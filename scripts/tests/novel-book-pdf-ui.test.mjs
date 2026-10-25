// Executes the real component handlers with isolated hooks, auth, fetch and DOM.
// No browser credentials, manuscripts, network, local env or DB are read.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../../components/NovelPlatform/BookPdfDownload.tsx', import.meta.url), 'utf8');
const reader = await readFile(new URL('../../components/NovelPlatform/NovelFullReader.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: {
  target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
} });
assert.deepEqual(compiled.diagnostics || [], []);
const defer = () => { let resolve; let reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const tick = () => new Promise(resolve => setImmediate(resolve));
const session = actor => actor ? { user: { id: actor }, access_token: `SYNTHETIC-TOKEN-${actor}` } : null;
const pdfResponse = (headers = {}) => new Response('%PDF-1.7\nSYNTHETIC PDF\n%%EOF\n', { headers: { 'Content-Type': 'application/pdf', ...headers } });

function harness({ slug = 'quantum-vibration-novel', hasOpenEditor = false, actor = 'actor-1', captureId, fetchResult = () => Promise.resolve(pdfResponse()) } = {}) {
  let cursor = 0;
  let authCallback;
  let tree;
  let props = { slug, hasOpenEditor };
  let currentSession = session(actor);
  const slots = []; const effects = []; const timers = new Map();
  const requests = []; const downloads = []; const revoked = []; const logs = [];
  let timerId = 0; let unsubscribeCount = 0; let sessionReads = 0;
  const React = {
    useId: () => 'pdf-ui-test',
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { value: initial };
      return [slots[index].value, next => { slots[index].value = typeof next === 'function' ? next(slots[index].value) : next; }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useEffect(effect, deps) {
      const index = cursor++;
      const previous = slots[index];
      if (!previous || deps.some((value, i) => !Object.is(value, previous.deps[i]))) {
        effects.push(() => { previous?.cleanup?.(); slots[index] = { deps, cleanup: effect() }; });
      }
    },
  };
  const jsx = (type, props) => ({ type, props: props || {} });
  const exports = {};
  const scope = {
    exports, AbortController, Error, Date, Set,
    require(name) {
      if (name.endsWith('/novelBookCaptureSession.js')) return {selectedBookCapture: () => captureId};
      if (name === 'react') return React;
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (name.endsWith('/supabase')) return { supabase: { auth: {
        onAuthStateChange(callback) { authCallback = callback; return { data: { subscription: { unsubscribe() { unsubscribeCount++; } } } }; },
        getSession() { sessionReads++; return Promise.resolve({ data: { session: currentSession }, error: null }); },
      } } };
      throw new Error(`Unexpected dependency ${name}`);
    },
    fetch(url, options) { requests.push({ url, options }); return fetchResult(url, options); },
    URL: { createObjectURL() { return 'blob:synthetic-pdf'; }, revokeObjectURL(url) { revoked.push(url); } },
    window: { setTimeout(callback, delay) { const id = ++timerId; timers.set(id, { callback, delay }); return id; }, clearTimeout(id) { timers.delete(id); } },
    document: { body: { appendChild() {} }, createElement(tag) {
      assert.equal(tag, 'a'); return { href: '', download: '', click() { downloads.push({ href: this.href, filename: this.download }); }, remove() {} };
    } },
    console: { log: (...args) => logs.push(args), error: (...args) => logs.push(args) },
  };
  vm.runInNewContext(compiled.outputText, scope, { filename: 'BookPdfDownload.test.cjs' });
  const render = (next = {}, flushEffects = true) => {
    props = { ...props, ...next }; cursor = 0;
    tree = exports.BookPdfDownload(props);
    if (flushEffects) while (effects.length) effects.shift()();
    return tree;
  };
  const flatten = (node = tree) => !node ? [] : Array.isArray(node) ? node.flatMap(flatten)
    : typeof node === 'object' ? [node, ...flatten(node.props.children)] : [];
  const textOf = (node = tree) => node == null ? '' : Array.isArray(node) ? node.map(textOf).join('')
    : typeof node === 'object' ? textOf(node.props.children) : String(node);
  const controls = type => flatten().filter(node => node.type === type);
  const downloadButton = () => controls('button').find(node => 'aria-busy' in node.props);
  const generate = () => downloadButton().props.onClick();
  const emit = (event, nextActor) => { currentSession = session(nextActor); authCallback(event, currentSession); render(); };
  const unmount = () => { for (const slot of slots) slot?.cleanup?.(); };
  render();
  return { exports, render, controls, textOf, generate, downloadButton, requests, downloads, revoked, logs, emit, unmount, timers,
    async ready() { await tick(); render(); }, setSession(nextActor) { currentSession = session(nextActor); },
    get unsubscribeCount() { return unsubscribeCount; }, get sessionReads() { return sessionReads; } };
}

test('supported KO/EN have labeled options and exact saved-selection disclosure; no automatic fetch', async () => {
  for (const slug of ['quantum-vibration-novel', 'quantum-vibration-novel-en']) {
    const h = harness({ slug }); await h.ready();
    assert.equal(h.downloadButton().props.disabled, false);
    assert.equal(h.controls('select').length, 2);
    assert.match(h.textOf(), /6 × 9인치.*A4.*10pt.*11pt.*12pt/);
    assert.match(h.textOf(), /최신 review.*과거 버전·저장하지 않은 편집 내용은 포함하지 않습니다/);
    assert.match(h.textOf(), /final\/accepted 상태는 변경하지 않습니다/);
    assert.equal(h.requests.length, 0);
    h.unmount(); assert.equal(h.unsubscribeCount, 1);
  }
});

test('only root editions are offered; logged out and open editor cannot start generation', async () => {
  for (const slug of ['another-novel', 'quantum-vibration-novel-act-1', 'quantum-vibration-novel-en-act-9']) {
    const h = harness({ slug }); await h.ready(); assert.equal(h.render(), null); h.unmount();
  }
  for (const options of [{ actor: null }, { hasOpenEditor: true }]) {
    const h = harness(options); await h.ready(); assert.equal(h.downloadButton().props.disabled, true);
    await h.generate(); assert.equal(h.requests.length, 0); h.unmount();
  }
});

test('real handler posts only slug/settings with session bearer and downloads verified PDF Blob', async () => {
  const h = harness({ slug: 'quantum-vibration-novel-en', fetchResult: () => Promise.resolve(pdfResponse({ 'Content-Disposition': 'attachment; filename="ROS-EN-review.pdf"' })) });
  await h.ready();
  h.controls('select')[0].props.onChange({ target: { value: 'A4' } });
  h.controls('select')[1].props.onChange({ target: { value: '12' } }); h.render();
  await h.generate(); h.render();
  assert.equal(h.requests.length, 1);
  const { url, options } = h.requests[0];
  assert.equal(url, '/api/novel-book-pdf'); assert.equal(options.method, 'POST'); assert.equal(options.cache, 'no-store');
  assert.equal(options.headers.Authorization, 'Bearer SYNTHETIC-TOKEN-actor-1');
  assert.deepEqual(JSON.parse(options.body), { slug: 'quantum-vibration-novel-en', options: { pageSize: 'A4', fontSize: 12 } });
  assert.deepEqual(h.downloads, [{ href: 'blob:synthetic-pdf', filename: 'ROS-EN-review.pdf' }]);
  assert.equal(h.sessionReads, 3); assert.equal(h.downloadButton().props['aria-busy'], false);
  assert.match(h.textOf(), /다운로드를 요청했습니다/); assert.deepEqual(h.logs, []);
  h.unmount(); assert.deepEqual(h.revoked, ['blob:synthetic-pdf']);
});

test('duplicate clicks are prevented and cancellation discards a response even if fetch ignores abort', async () => {
  const deferred = defer(); const h = harness({ fetchResult: () => deferred.promise }); await h.ready();
  const first = h.generate(); await tick(); h.render(); await h.generate();
  assert.equal(h.requests.length, 1); assert.equal(h.downloadButton().props['aria-busy'], true);
  assert.doesNotMatch(h.textOf(), /\d+%/);
  h.controls('button').find(node => h.textOf(node) === '요청 취소').props.onClick(); h.render();
  assert.equal(h.requests[0].options.signal.aborted, true);
  deferred.resolve(pdfResponse()); await first; h.render();
  assert.equal(h.downloads.length, 0); assert.match(h.textOf(), /취소했습니다/); h.unmount();
});

for (const [name, invalidate] of [
  ['sign out', h => h.emit('SIGNED_OUT', null)],
  ['account change', h => h.emit('SIGNED_IN', 'actor-2')],
  ['novel change', h => h.render({ slug: 'quantum-vibration-novel-en' })],
  ['editor opened', h => h.render({ hasOpenEditor: true })],
  ['unmount', h => h.unmount()],
]) test(`${name} aborts generation and prevents a stale download`, async () => {
  const deferred = defer(); const h = harness({ fetchResult: () => deferred.promise }); await h.ready();
  const pending = h.generate(); await tick(); invalidate(h);
  assert.equal(h.requests[0].options.signal.aborted, true);
  deferred.resolve(pdfResponse()); await pending;
  assert.equal(h.downloads.length, 0); assert.deepEqual(h.logs, []); h.unmount();
});

test('render-scope guard rejects changed novel before effect cleanup has run', async () => {
  const deferred = defer(); const h = harness({ fetchResult: () => deferred.promise }); await h.ready();
  const pending = h.generate(); await tick(); h.render({ slug: 'quantum-vibration-novel-en' }, false);
  deferred.resolve(pdfResponse()); await pending; assert.equal(h.downloads.length, 0); h.unmount();
});

test('post-generation session recheck rejects an account switch even without an auth event', async () => {
  const deferred = defer(); const h = harness({ fetchResult: () => deferred.promise }); await h.ready();
  const pending = h.generate(); await tick(); h.setSession('actor-2'); deferred.resolve(pdfResponse());
  await pending; h.render(); assert.equal(h.downloads.length, 0); assert.match(h.textOf(), /로그인 상태가 변경/); h.unmount();
});

test('token refresh for the same actor does not abort an authorized request', async () => {
  const deferred = defer(); const h = harness({ fetchResult: () => deferred.promise }); await h.ready();
  const pending = h.generate(); await tick(); h.emit('TOKEN_REFRESHED', 'actor-1'); deferred.resolve(pdfResponse());
  await pending; assert.equal(h.downloads.length, 1); h.unmount();
});

for (const [name, response, message] of [
  ['HTML instead of PDF', () => new Response('<html>PRIVATE ERROR</html>', { headers: { 'Content-Type': 'text/html' } }), /PDF 파일이 아닙니다/],
  ['JSON success instead of PDF', () => new Response('{"url":"PRIVATE"}', { headers: { 'Content-Type': 'application/json' } }), /PDF 파일이 아닙니다/],
  ['wrong PDF magic', () => new Response('NOT A PDF PRIVATE', { headers: { 'Content-Type': 'application/pdf' } }), /PDF 파일 형식/],
  ['truncated PDF', () => new Response('%PDF-1.7\nTRUNCATED', { headers: { 'Content-Type': 'application/pdf' } }), /PDF 파일 형식/],
  ['partial-content PDF', () => new Response('%PDF-1.7\nPARTIAL\n%%EOF', { status: 206, headers: { 'Content-Type': 'application/pdf' } }), /PDF 파일이 아닙니다/],
  ['unauthorized', () => new Response('{"error":"PRIVATE TOKEN"}', { status: 401, headers: { 'Content-Type': 'application/json' } }), /로그인이 만료/],
  ['forbidden', () => new Response('{broken', { status: 403, headers: { 'Content-Type': 'application/json' } }), /권한이 없습니다/],
  ['changed manuscript', () => new Response('{}', { status: 409, headers: { 'Content-Type': 'application/json' } }), /원고가 변경/],
  ['server error', () => new Response('<html>PRIVATE ERROR</html>', { status: 500 }), /PDF를 생성하지 못했습니다/],
]) test(`${name} is a visible bounded failure, never a download`, async () => {
  const h = harness({ fetchResult: () => Promise.resolve(response()) }); await h.ready(); await h.generate(); h.render();
  assert.equal(h.downloads.length, 0); assert.match(h.textOf(), message); assert.doesNotMatch(h.textOf(), /PRIVATE/);
  assert.equal(h.controls('p').find(node => node.props.id.endsWith('-status')).props.role, 'alert'); h.unmount();
});

test('unexpected network details are not displayed or logged', async () => {
  const h = harness({ fetchResult: () => Promise.reject(new Error('PDF PRIVATE MANUSCRIPT TOKEN')) }); await h.ready();
  await h.generate(); h.render(); assert.doesNotMatch(h.textOf(), /PRIVATE|TOKEN/); assert.deepEqual(h.logs, []); h.unmount();
});

test('client timeout ends busy state with a retryable message', async () => {
  const deferred = defer(); const h = harness({ fetchResult: () => deferred.promise }); await h.ready();
  const pending = h.generate(); await tick();
  [...h.timers.values()].find(timer => timer.delay === 320000).callback();
  deferred.reject(new DOMException('Aborted', 'AbortError')); await pending; h.render();
  assert.equal(h.downloadButton().props['aria-busy'], false); assert.match(h.textOf(), /시간이 초과/); h.unmount();
});

test('filename header allows safe PDF names and rejects path/control/extension tricks', () => {
  const h = harness(); const date = new Date('2026-10-24T00:00:00Z');
  for (const header of [null, 'attachment; filename="../private.pdf"', 'attachment; filename="a\\b.pdf"', 'attachment; filename="evil.html"', 'attachment; filename="a\r\nb.pdf"', "attachment; filename*=UTF-8''%ZZ.pdf"]) {
    assert.equal(h.exports.bookPdfFilename(header, 'quantum-vibration-novel', date), 'ROS-KO-2026-10-24.pdf');
  }
  assert.equal(h.exports.bookPdfFilename("attachment; filename*=UTF-8''%EA%B5%AD%EB%AC%B8.pdf", 'quantum-vibration-novel-en', date), '국문.pdf');
  h.unmount();
});

test('Reader integrates outside edit-only controls and removes legacy Mac/open-window workflow', () => {
  assert.match(reader, /<BookPdfDownload slug=\{novel\.slug\} hasOpenEditor=\{hasOpenEditor\} \/>/);
  assert.match(reader, /<details[\s\S]*?책 다운로드 · PDF \/ Kindle[\s\S]*?<BookPdfDownload[\s\S]*?<\/details>/);
  assert.doesNotMatch(reader, /isGeneratingPDF|Mac_로컬 only|fetch\('\/api\/generate-pdf'/);
  assert.doesNotMatch(source, /window\.open|localStorage|service_role|supabaseAdmin|console\./);
});

test('Reader capture ID is carried through the actual PDF handler', async () => {
 const captureId='a'.repeat(64);const h=harness({captureId});await h.ready();await h.generate();
 assert.equal(JSON.parse(h.requests[0].options.body).captureId,captureId);h.unmount();
});
