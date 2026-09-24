import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const source = await fs.readFile(new URL('../../components/TemscoEquityAccess/ProtectedEquityReport.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
} }).outputText;
const session = { access_token: 'test.jwt.signature', user: { id: 'test-user', is_anonymous: false } };
const artifact = { schemaVersion: 1, javascript: 'private test fixture', css: '.report{}' };
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; };
const settle = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

function harness() {
  let effect, callback, stateIndex = 0, unsubscribed = false, unmounts = 0;
  const states = [], requests = [], scripts = [], styles = [], revoked = [];
  const initial = deferred();
  const host = { clears: 0, replaceChildren() { this.clears++; } };
  const window = { location: { pathname: '/temsco/equity', search: '?slide=4', hash: '#report' } };
  const document = {
    createElement(tag) { return { tag, dataset: {}, removed: false, remove() { this.removed = true; } }; },
    head: { appendChild(element) { styles.push(element); } },
    body: { appendChild(element) { scripts.push(element); } },
  };
  const react = {
    useEffect(fn) { effect = fn; },
    useRef() { return { current: host }; },
    useState(value) {
      const index = stateIndex++;
      states[index] = value;
      return [value, update => { states[index] = typeof update === 'function' ? update(states[index]) : update; }];
    },
  };
  const supabase = { auth: {
    onAuthStateChange(fn) { callback = fn; return { data: { subscription: { unsubscribe() { unsubscribed = true; } } } }; },
    getSession() { return initial.promise; },
  } };
  const imports = {
    react,
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }), Fragment: 'fragment' },
    'next/head': () => null,
    'next/link': () => null,
    '../../shared/lib/supabase': { supabase },
  };
  const module = { exports: {} };
  vm.runInNewContext(`(function(require,exports,module){${compiled}\n})`, {
    window, document, AbortController, Blob, encodeURIComponent,
    URL: { createObjectURL() { return `blob:test-${scripts.length}`; }, revokeObjectURL(url) { revoked.push(url); } },
    fetch(url, options) { const pending = deferred(); requests.push({ url, options, ...pending }); return pending.promise; },
  })((name) => { assert.ok(name in imports, `Unexpected import: ${name}`); return imports[name]; }, module.exports, module);
  module.exports.default({ view: 'deck' });
  const cleanup = effect();
  return {
    window, states, requests, scripts, styles, revoked, host, initial, cleanup,
    emit(event, value) { callback(event, value); },
    get unsubscribed() { return unsubscribed; },
    get unmounts() { return unmounts; },
    respond(index = 0, status = 200) { requests[index].resolve({ status, ok: status === 200, json: async () => artifact }); },
    executeBundle({ throws = false } = {}) {
      // A classic-script top-level `var` is non-configurable. Assignment clears
      // it safely; deleting it from Next's strict-mode bundle would throw.
      Object.defineProperty(window, 'TemscoPrivateReport', { configurable: false, writable: true, value: {
        mount(element, view) {
          assert.equal(element, host); assert.equal(view, 'deck');
          if (throws) throw new Error('Test mount failure');
          return () => { unmounts++; };
        },
      } });
      scripts.at(-1).onload();
    },
  };
}

test('unauthenticated and anonymous sessions never request the report', async () => {
  const h = harness();
  h.initial.resolve({ data: { session: null }, error: null });
  await settle();
  h.emit('SIGNED_IN', { ...session, user: { id: 'anonymous', is_anonymous: true } });
  assert.equal(h.states[0], 'login');
  assert.equal(h.requests.length, 0);
  assert.match(h.states[2], /next=%2Ftemsco%2Fequity%3Fslide%3D4%23report$/);
  h.cleanup();
});

test('logout fences a stale initial session response', async () => {
  const h = harness();
  h.emit('SIGNED_OUT', null);
  h.initial.resolve({ data: { session }, error: null });
  await settle();
  assert.equal(h.states[0], 'login');
  assert.equal(h.requests.length, 0);
  h.cleanup();
});

test('logout aborts and discards an already-started authenticated fetch', async () => {
  const h = harness();
  h.emit('SIGNED_IN', session);
  assert.equal(h.requests.length, 1);
  assert.equal(h.requests[0].options.headers.Authorization, `Bearer ${session.access_token}`);
  h.emit('SIGNED_OUT', null);
  assert.equal(h.requests[0].options.signal.aborted, true);
  h.respond();
  await settle();
  assert.equal(h.scripts.length, 0);
  assert.equal(h.styles.length, 0);
  assert.equal(h.states[0], 'login');
  h.cleanup();
});

test('success mounts only after auth response; logout clears mount, CSS, script and global', async () => {
  const h = harness();
  h.emit('SIGNED_IN', session);
  h.respond();
  await settle();
  assert.equal(h.states[0], 'loading');
  assert.equal(h.scripts.length, 1);
  h.executeBundle();
  assert.equal(h.states[0], 'ready');
  assert.equal(h.window.TemscoPrivateReport, undefined);
  assert.equal(h.scripts[0].removed, true);
  assert.equal(h.revoked.length, 1);
  h.emit('SIGNED_OUT', null);
  assert.equal(h.states[0], 'login');
  assert.equal(h.unmounts, 1);
  assert.equal(h.styles[0].removed, true);
  assert.equal(h.window.TemscoPrivateReport, undefined);
  h.cleanup();
  assert.equal(h.unsubscribed, true);
});

test('late script load after route cleanup cannot mount the report', async () => {
  const h = harness();
  h.emit('SIGNED_IN', session);
  h.respond();
  await settle();
  h.cleanup();
  h.executeBundle();
  assert.notEqual(h.states[0], 'ready');
  assert.equal(h.unmounts, 0);
  assert.equal(h.styles[0].removed, true);
  assert.equal(h.scripts[0].removed, true);
});

test('server denial and bundle mount failures expose no report and offer recoverable states', async () => {
  const denied = harness();
  denied.emit('SIGNED_IN', session);
  denied.respond(0, 401);
  await settle();
  assert.equal(denied.states[0], 'login');
  assert.equal(denied.scripts.length, 0);
  denied.cleanup();

  const broken = harness();
  broken.emit('SIGNED_IN', session);
  broken.respond();
  await settle();
  broken.executeBundle({ throws: true });
  assert.equal(broken.states[0], 'error');
  assert.equal(broken.styles[0].removed, true);
  assert.equal(broken.scripts[0].removed, true);
  assert.equal(broken.window.TemscoPrivateReport, undefined);
  broken.cleanup();
});
