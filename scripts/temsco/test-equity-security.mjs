import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
import * as reportCrypto from '../../lib/temsco/equity-report-crypto.mjs';

const require = createRequire(import.meta.url);

async function loadTypeScript(relativePath, overrides = {}) {
  const file = new URL(relativePath, import.meta.url);
  const source = await fs.readFile(file, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  });
  const exports = {};
  const run = vm.runInThisContext(`(function(require, exports, module) { ${compiled.outputText}\n})`, { filename: file.pathname });
  run((name) => Object.hasOwn(overrides, name) ? overrides[name] : require(name), exports, { exports });
  return exports;
}

// No test is allowed to contact the real Supabase service.
let clientFactory = () => { throw new Error('Unexpected real auth call'); };
const auth = await loadTypeScript('../../lib/temsco/equity-report-auth.ts', {
  '@supabase/supabase-js': { createClient(...args) { return clientFactory(...args); } },
});
const api = await loadTypeScript('../../pages/api/temsco/equity-report.ts', {
  '../../../lib/temsco/equity-report-auth': auth,
  '../../../lib/temsco/equity-report-crypto.mjs': reportCrypto,
});
const env = { NEXT_PUBLIC_SUPABASE_URL: 'https://test.invalid', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_only' };
const token = 'test.header.signature';
const header = `Bearer ${token}`;
const verified = { data: { user: { id: 'user-123', is_anonymous: false } }, error: null };
const artifact = { schemaVersion: 1, javascript: 'window.testReport = true;', css: '.report{color:black}', sourceHash: 'a'.repeat(64) };

test('missing, malformed, duplicated and oversized credentials deny before verification', async () => {
  let calls = 0;
  for (const value of [undefined, '', 'Basic abc', 'Bearer forged', `${header}, ${header}`, [header], `Bearer ${'a'.repeat(17000)}.b.c`]) {
    const result = await auth.authorizeEquityReport(value, { env, verifyUser: async () => { calls++; return verified; } });
    assert.deepEqual(result, { ok: false, status: 401 });
  }
  assert.equal(calls, 0);
});

test('missing or privileged server configuration fails closed before verification', async () => {
  const serviceRole = ['e30', Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url'), 'signature'].join('.');
  let calls = 0;
  for (const config of [{}, { ...env, NEXT_PUBLIC_SUPABASE_URL: 'bad-url' }, { ...env, NEXT_PUBLIC_SUPABASE_URL: 'https://user:secret@test.invalid' }, { ...env, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_not_allowed' }, { ...env, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: serviceRole }]) {
    assert.deepEqual(await auth.authorizeEquityReport(header, { env: config, verifyUser: async () => { calls++; return verified; } }), { ok: false, status: 503 });
  }
  assert.equal(calls, 0);
});

test('verified non-anonymous user succeeds with publishable or legacy anon key', async () => {
  const anonKey = ['e30', Buffer.from(JSON.stringify({ role: 'anon' })).toString('base64url'), 'signature'].join('.');
  for (const config of [env, { NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey }]) {
    assert.deepEqual(await auth.authorizeEquityReport(header, {
      env: config,
      verifyUser: async (received, clientConfig) => {
        assert.equal(received, token);
        assert.equal(clientConfig.url, env.NEXT_PUBLIC_SUPABASE_URL);
        return verified;
      },
    }), { ok: true, userId: 'user-123' });
  }
});

test('default verifier creates independent clients and calls getUser with the received JWT', async () => {
  let clients = 0;
  let requests = 0;
  const previousFactory = clientFactory;
  try {
    clientFactory = (url, key, options) => {
      clients++;
      assert.equal(url, env.NEXT_PUBLIC_SUPABASE_URL);
      assert.equal(key, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
      assert.deepEqual(options.auth, { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false });
      assert.equal(typeof options.global.fetch, 'function');
      return { auth: { getUser: async (received) => { requests++; assert.equal(received, token); return verified; } } };
    };
    for (let i = 0; i < 2; i++) {
      assert.deepEqual(await auth.authorizeEquityReport(header, { env }), { ok: true, userId: 'user-123' });
    }
    assert.equal(clients, 2);
    assert.equal(requests, 2);
  } finally {
    clientFactory = previousFactory;
  }
});

test('forged, expired and Supabase anonymous users receive 401', async () => {
  for (const response of [
    { data: { user: null }, error: { status: 401, code: 'bad_jwt' } },
    { data: { user: null }, error: { status: 403, code: 'jwt_expired' } },
    { data: { user: { id: 'anonymous-id', is_anonymous: true } }, error: null },
    { data: { user: null }, error: null },
    { data: { user: { id: '' } }, error: null },
  ]) {
    assert.deepEqual(await auth.authorizeEquityReport(header, { env, verifyUser: async () => response }), { ok: false, status: 401 });
  }
});

test('auth outages, rate limits, invalid API key and thrown errors return 503', async () => {
  for (const error of [{ status: 500 }, { status: 429 }, { status: 0, name: 'AuthRetryableFetchError' }, { status: 401, message: 'Invalid API key' }, new Error('offline')]) {
    assert.deepEqual(await auth.authorizeEquityReport(header, { env, verifyUser: async () => ({ data: { user: null }, error }) }), { ok: false, status: 503 });
  }
  assert.deepEqual(await auth.authorizeEquityReport(header, { env, verifyUser: async () => { throw new Error('offline'); } }), { ok: false, status: 503 });
});

function response() {
  return {
    statusCode: 0,
    headers: {},
    payload: undefined,
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

function assertPrivate(res) {
  assert.match(res.headers['cache-control'], /private/);
  assert.match(res.headers['cache-control'], /no-store/);
  assert.equal(res.headers['cdn-cache-control'], 'no-store');
  assert.equal(res.headers['vercel-cdn-cache-control'], 'no-store');
  assert.equal(res.headers.vary, 'Authorization');
  assert.equal(res.headers['x-content-type-options'], 'nosniff');
}

test('non-GET requests neither authenticate nor read the artifact', async () => {
  let calls = 0;
  const handler = api.createEquityReportHandler({ authorize: async () => { calls++; return { ok: true, userId: 'user-123' }; }, readArtifact: async () => { calls++; return artifact; } });
  for (const method of ['POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS']) {
    const res = response();
    await handler({ method, headers: { authorization: header } }, res);
    assert.equal(res.statusCode, 405);
    assert.equal(res.headers.allow, 'GET');
    assertPrivate(res);
  }
  assert.equal(calls, 0);
});

test('denied or unavailable authentication cannot read or return private content', async () => {
  let reads = 0;
  for (const status of [401, 503]) {
    const handler = api.createEquityReportHandler({ authorize: async () => ({ ok: false, status }), readArtifact: async () => { reads++; return artifact; } });
    const res = response();
    await handler({ method: 'GET', headers: {} }, res);
    assert.equal(res.statusCode, status);
    assert.equal('javascript' in res.payload, false);
    assertPrivate(res);
  }
  assert.equal(reads, 0);
});

test('authenticated artifact returns only contract fields with private response headers', async () => {
  let authenticated = false;
  const handler = api.createEquityReportHandler({
    authorize: async (received) => { assert.equal(received, header); authenticated = true; return { ok: true, userId: 'user-123' }; },
    readArtifact: async () => { assert.equal(authenticated, true); return { ...artifact, localPath: '/private/build/path', userId: 'do-not-return' }; },
  });
  const res = response();
  await handler({ method: 'GET', headers: { authorization: header } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload, artifact);
  assertPrivate(res);
});

test('missing or malformed artifact fails closed without details', async () => {
  for (const value of [null, {}, { ...artifact, schemaVersion: 2 }, { ...artifact, javascript: '' }, { ...artifact, css: '' }, { ...artifact, sourceHash: '../unexpected' }, new Error('ENOENT /private/build/path')]) {
    const handler = api.createEquityReportHandler({
      authorize: async () => ({ ok: true, userId: 'user-123' }),
      readArtifact: async () => { if (value instanceof Error) throw value; return value; },
    });
    const res = response();
    await handler({ method: 'GET', headers: { authorization: header } }, res);
    assert.equal(res.statusCode, 503);
    assert.deepEqual(Object.keys(res.payload), ['error']);
    assert.doesNotMatch(JSON.stringify(res.payload), /ENOENT|private\/build|javascript/);
    assertPrivate(res);
  }
});
