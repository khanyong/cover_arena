import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { EventEmitter } from 'node:events';
import vm from 'node:vm';
import ts from 'typescript';
import * as model from '../../shared/lib/novelBookSnapshot.mjs';

const source = await readFile(new URL('../../pages/api/novel-book-pdf.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const exports = {};
vm.runInNewContext(compiled, { exports, Buffer, AbortController, setTimeout, clearTimeout,
  require(name) {
    if (name.includes('novelBookSnapshot')) return model;
    if (name.includes('loadBookSnapshot')) return {};
    if (name.includes('renderBookPdf')) return {};
    throw new Error(`Unexpected dependency ${name}`);
  },
});

function http(body = { slug: 'quantum-vibration-novel-en' }, method = 'POST') {
  const req = new EventEmitter(); Object.assign(req, { body, method, headers: { authorization: 'Bearer h.p.s' } });
  const res = new EventEmitter();
  Object.assign(res, { headers: {}, chunks: [], statusCode: 200, headersSent: false, writableEnded: false, destroyed: false,
    setHeader(name, value) { this.headers[name] = value; }, removeHeader(name) { delete this.headers[name]; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; this.headersSent = true; this.end(); return this; },
    write(value) { this.headersSent = true; this.chunks.push(value); return true; },
    end() { this.writableEnded = true; this.emit('finish'); }, destroy() { this.destroyed = true; this.emit('close'); },
  });
  return { req, res };
}

function dependencies(overrides = {}) {
  const calls = []; let closed = 0;
  const deps = {
    authenticate: async (authorization, { signal }) => { calls.push('auth'); assert.equal(authorization, 'Bearer h.p.s'); assert.equal(signal.aborted, false); return { client: 'user-client' }; },
    load: async (client, slug) => { calls.push('load'); assert.equal(client, 'user-client'); return { slug, language: 'en' }; },
    render: async (snapshot, options) => { calls.push('render'); assert.deepEqual(options, { pageSize: 'book', fontSize: 11 }); return {
      filename: 'ROS-en-book.pdf', stream: new ReadableStream({ start(controller) { controller.enqueue(Buffer.from('%PDF-1.7\n')); controller.enqueue(Buffer.from('private book')); controller.close(); } }),
      close: async () => { closed++; },
    }; }, ...overrides,
  };
  return { deps, calls, get closed() { return closed; } };
}

test('configuration is bounded and download streams privately after auth and current-source load', async () => {
  assert.equal(exports.config.api.bodyParser.sizeLimit, '16kb');
  assert.equal(exports.config.api.responseLimit, false);
  assert.equal(exports.config.maxDuration, 300);
  const state = dependencies(); const { req, res } = http();
  await exports.createBookPdfHandler(state.deps)(req, res);
  assert.deepEqual(state.calls, ['auth', 'load', 'render']);
  assert.equal(Buffer.concat(res.chunks).toString(), '%PDF-1.7\nprivate book');
  assert.equal(res.headers['Content-Type'], 'application/pdf');
  assert.equal(res.headers['Content-Disposition'], 'attachment; filename="ROS-en-book.pdf"');
  assert.equal(res.headers['Cache-Control'], 'private, no-store, max-age=0');
  assert.equal(res.headers['CDN-Cache-Control'], 'no-store');
  assert.equal(res.headers['Vercel-CDN-Cache-Control'], 'no-store');
  assert.equal(res.headers.Vary, 'Authorization');
  assert.equal(res.headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(state.closed, 1);
  assert.equal(req.listenerCount('aborted'), 0); assert.equal(res.listenerCount('close'), 0);
});

test('GET and hostile request bodies never authenticate, load or launch renderer', async () => {
  for (const { body, method, status } of [
    { body: {}, method: 'GET', status: 405 }, { body: null, method: 'POST', status: 400 },
    { body: { slug: 'quantum-vibration-novel-act-2' }, method: 'POST', status: 400 },
    { body: { slug: 'quantum-vibration-novel-en', html: '<script>bad</script>' }, method: 'POST', status: 400 },
  ]) {
    const state = dependencies(); const { req, res } = http(body, method);
    await exports.createBookPdfHandler(state.deps)(req, res);
    assert.equal(res.statusCode, status); assert.deepEqual(state.calls, []);
    assert.equal(res.headers['Content-Disposition'], undefined);
  }
});

test('auth/RLS/consistency failures do not render and expose only safe codes', async () => {
  for (const [phase, error] of [
    ['authenticate', new model.BookSnapshotError('BOOK_AUTH_REQUIRED', 401)],
    ['load', new model.BookSnapshotError('BOOK_ACCESS_DENIED', 403)],
    ['load', new model.BookSnapshotError('BOOK_SOURCE_CHANGED', 409)],
  ]) {
    const state = dependencies({ [phase]: async () => { throw error; } }); const { req, res } = http();
    await exports.createBookPdfHandler(state.deps)(req, res);
    assert.equal(res.statusCode, error.status); assert.equal(res.body.error, error.code);
    assert.equal(state.calls.includes('render'), false); assert.equal(res.chunks.length, 0);
  }
  const { req, res } = http();
  await exports.createBookPdfHandler(dependencies({ render: async () => { throw new Error('PRIVATE SQL BEARER=SECRET'); } }).deps)(req, res);
  assert.equal(res.statusCode, 500); assert.equal(res.body.error, 'BOOK_PDF_FAILED');
  assert.doesNotMatch(JSON.stringify(res.body), /PRIVATE|SQL|SECRET/);
});

test('timeout aborts renderer and returns safe 504 before streaming', async () => {
  const state = dependencies({ timeoutMs: 10, render: async (_s, _o, { signal }) => {
    await new Promise((resolve, reject) => { signal.addEventListener('abort', () => reject(new Error('private renderer aborted')), { once: true }); setTimeout(resolve, 100); });
    throw new Error('must time out');
  } });
  const { req, res } = http(); await exports.createBookPdfHandler(state.deps)(req, res);
  assert.equal(res.statusCode, 504); assert.equal(res.body.error, 'BOOK_REQUEST_TIMEOUT');
});

test('disconnected client cancels streaming and closes renderer exactly once', async () => {
  let closed = 0; let cancelled = 0;
  const { req, res } = http();
  const state = dependencies({ render: async () => ({ filename: 'book.pdf',
    stream: new ReadableStream({ start(controller) { controller.enqueue(Buffer.from('%PDF')); }, cancel() { cancelled++; } }),
    close: async () => { closed++; },
  }) });
  const write = res.write; res.write = function(value) { write.call(this, value); this.destroy(); return true; };
  await exports.createBookPdfHandler(state.deps)(req, res);
  assert.equal(res.destroyed, true); assert.equal(closed, 1); assert.equal(cancelled, 1); assert.equal(res.body, undefined);
});

test('backpressure waits for drain and unsafe renderer filename cannot inject headers', async () => {
  let writes = 0;
  const state = dependencies(); const render = state.deps.render;
  state.deps.render = async (...args) => ({ ...await render(...args), filename: 'evil\r\nX-Injected: bad.pdf' });
  const { req, res } = http(); const write = res.write;
  res.write = function(value) { write.call(this, value); writes++; if (writes === 1) { setTimeout(() => this.emit('drain'), 2); return false; } return true; };
  await exports.createBookPdfHandler(state.deps)(req, res);
  assert.equal(writes, 2); assert.equal(res.headers['Content-Disposition'], 'attachment; filename="ROS-en-book.pdf"');
  assert.equal(res.listenerCount('drain'), 0); assert.equal(state.closed, 1);
});
