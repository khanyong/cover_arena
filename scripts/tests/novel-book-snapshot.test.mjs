import test from 'node:test';
import assert from 'node:assert/strict';
import { BookSnapshotError, validateBookPdfRequest, bookSourceFingerprint, buildBookSnapshot } from '../../shared/lib/novelBookSnapshot.mjs';
import { sha256Hex } from '../../shared/lib/rosKoBlockModel.js';
import { authenticateBookRequest, loadBookSnapshot } from '../../lib/novel-book/loadBookSnapshot.mjs';

const KO = 'quantum-vibration-novel';
const EN = `${KO}-en`;
const clone = value => structuredClone(value);
const legacy = (id, content) => ({ id, activeVersion: 'saved', versions: {
  old: { content: 'DO NOT EXPORT OLD TEXT', note: 'DO NOT EXPORT NOTE' },
  saved: { content, revisionVersionId: `${id}-version`, note: 'DO NOT EXPORT NOTE' },
} });

async function fixture(slug = KO) {
  const root = { id: slug, slug, data: { id: slug, slug, title: 'A book / 책', subtitle: 'Subtitle', author: 'Author',
    synopsis: 'DO NOT EXPORT SYNOPSIS', agentQueries: ['DO NOT EXPORT PROMPT'], acts: [{ number: 1 }, { number: 9 }] } };
  const fragments = [
    { id: `${slug}-act-1`, slug: `${slug}-act-1`, data: { number: 1, title: 'Unknown Act', chapters: [{ number: 1, title: 'Front Cover', scenes: [
      { id: 'cover', title: 'Opening', number: 1, paragraphs: [] },
      { id: 'legacy', title: 'Legacy', number: 2, paragraphs: [legacy('legacy-p', '  Exact\ntext\r\n한글  ')] },
    ] }] } },
    { id: '00000000-0000-4000-8000-000000000009', slug: `${slug}-act-9`, data: { number: 9, title: 'Appendix', chapters: [{ number: 1, title: 'Appendix B', scenes: [
      { id: 'managed-scene', title: 'Opening', storageModel: 'ros-ko-block-v1', managedSceneId: 'managed-id', paragraphs: [] },
    ] }] } },
  ];
  const paragraphs = ['$$\nx = 1\n$$', '[Part I](https://doi.org/example)'].map((content, i) => ({ id: `unit-${i}`, unitId: `unit-${i}`,
    sourceKey: `KO/APPENDIX/B/OPENING/B000${i + 1}`, revisionVersionId: `version-${i}`, activeVersion: 'review',
    storageModel: 'ros-ko-block-v1', compositionRevisionId: 'composition-id', generation: 2, separatorAfter: i ? '' : '\n\n',
    versions: { review: { content, revisionVersionId: `version-${i}`, note: 'DO NOT EXPORT NOTE' } } }));
  const body = paragraphs.map(p => p.versions.review.content + p.separatorAfter).join('');
  const managed = { managed_scene_id: 'managed-id', scene_id: 'managed-scene', source_key: 'APPENDIX/B/OPENING', display_mode: 'composition', read_only: false,
    generation: 2, review_composition_id: 'composition-id', requested_composition_id: 'composition-id',
    composition: { id: 'composition-id', managed_scene_id: 'managed-id', status: 'sealed', block_count: 2,
      body_sha256: await sha256Hex(body), body_bytes: Buffer.byteLength(body), body_lf: (body.match(/\n/g) || []).length, terminal_lf: 0 },
    paragraphs, projection_sha256: await bookSourceFingerprint(paragraphs), available_compositions: [{ note: 'DO NOT EXPORT HISTORY' }] };
  return { slug, root, fragments, managedResults: new Map([['managed-id', managed]]), capturedAt: '2026-10-24T00:00:00.000Z' };
}

test('only exact root slugs and bounded layout options are accepted', () => {
  for (const slug of [KO, EN]) {
    assert.deepEqual(validateBookPdfRequest({ slug }).options, { pageSize: 'book', fontSize: 11 });
    for (const pageSize of ['book', 'A4']) for (const fontSize of [10, 11, 12]) {
      assert.deepEqual(validateBookPdfRequest({ slug, options: { pageSize, fontSize } }), { slug, options: { pageSize, fontSize } });
    }
  }
  for (const body of [null, [], {}, { slug: `${KO}-act-2` }, { slug: EN, body: 'injected manuscript' },
    { slug: EN, options: null }, { slug: EN, options: { pageSize: 'a4' } }, { slug: EN, options: { fontSize: '11' } },
    { slug: EN, options: { fontSize: 100 } }, { slug: EN, options: { url: 'https://attacker.invalid' } }]) {
    assert.throws(() => validateBookPdfRequest(body), error => error.status === 400);
  }
});

test('model preserves source order, Act1/Opening/empty scenes, exact text and current versions only', async () => {
  for (const slug of [KO, EN]) {
    const input = await fixture(slug);
    const before = JSON.stringify(input.root);
    const snapshot = await buildBookSnapshot(input);
    assert.equal(snapshot.language, slug === KO ? 'ko' : 'en');
    assert.deepEqual(snapshot.counts, { scenes: 3, paragraphs: 3 });
    assert.equal(snapshot.acts[0].title, 'Unknown Act');
    assert.equal(snapshot.acts[0].chapters[0].scenes[0].paragraphs.length, 0);
    assert.equal(snapshot.acts[0].chapters[0].scenes[1].paragraphs[0].text, '  Exact\ntext\r\n한글  ');
    assert.equal(snapshot.acts[0].chapters[0].scenes[1].paragraphs[0].versionId, 'legacy-p-version');
    assert.equal(snapshot.acts[1].chapters[0].scenes[0].paragraphs[0].text, '$$\nx = 1\n$$');
    assert.equal(snapshot.acts[1].chapters[0].scenes[0].compositionId, 'composition-id');
    assert.doesNotMatch(JSON.stringify(snapshot), /DO NOT EXPORT|versions|agentQueries|available_compositions/);
    assert.equal(JSON.stringify(input.root), before);
  }
});

test('incomplete or cross-language fragments and invalid selected versions fail closed', async () => {
  const mutations = [
    x => { x.fragments.pop(); },
    x => { x.fragments[0].slug = `${EN}-act-1`; },
    x => { x.fragments[0].id = 'unrelated-id'; },
    x => { x.fragments[1].data.number = 1; },
    x => { x.root.data.acts.push({ number: 1 }); },
    x => { x.fragments[0].data.chapters[0].scenes[1].paragraphs[0].activeVersion = 'missing'; },
    x => { x.fragments[0].data.chapters[0].scenes[1].paragraphs[0].versions.saved.content = null; },
    x => { x.managedResults.clear(); },
    x => { x.fragments[1].data.chapters[0].scenes[0].id = 'cover'; },
  ];
  for (const mutate of mutations) { const x = await fixture(); mutate(x); await assert.rejects(buildBookSnapshot(x), BookSnapshotError); }
});

test('managed identity, current review, mapping, body hash, count and projection tamper are rejected', async () => {
  const mutations = [
    x => { x.scene_id = 'other'; }, x => { x.managed_scene_id = 'other'; },
    x => { x.display_mode = 'legacy'; },
    x => { x.requested_composition_id = 'old'; }, x => { x.composition.status = 'draft'; },
    x => { x.composition.block_count++; }, x => { x.composition.body_bytes++; },
    x => { x.composition.body_lf++; }, x => { x.composition.body_sha256 = '0'.repeat(64); },
    x => { x.projection_sha256 = '0'.repeat(64); }, x => { x.paragraphs[0].generation++; },
    x => { x.paragraphs[0].sourceKey = 'KO/APPENDIX/B/OPENING/B0002'; },
    x => { x.paragraphs[0].sourceKey = 'KO/OTHER/SCENE/B0001'; },
    x => { x.paragraphs[0].versions.review.revisionVersionId = 'wrong-version'; },
    x => { x.paragraphs[0].versions.review.content += 'tamper'; }, x => { x.paragraphs[0].separatorAfter = ''; },
  ];
  for (const mutate of mutations) { const x = await fixture(); mutate(x.managedResults.get('managed-id')); await assert.rejects(buildBookSnapshot(x), BookSnapshotError); }
});

test('a readable current composition is exportable even when UI marks it read-only', async () => {
  const input = await fixture();
  input.managedResults.get('managed-id').read_only = true;
  assert.deepEqual((await buildBookSnapshot(input)).counts, { scenes: 3, paragraphs: 3 });
});

function clientFixture(input, { changeDocument = false, changeSelection = false, error = null } = {}) {
  let rootReads = 0; let rpcReads = 0;
  const calls = [];
  const result = data => ({ data, error });
  return { calls, client: {
    from(table) {
      assert.equal(table, 'novel_documents');
      return { select(columns) { assert.equal(columns, 'id,slug,data'); return {
        eq(column, value) {
          calls.push(['root', column, value]); rootReads++;
          const root = clone(input.root); if (changeDocument && rootReads > 1) root.data.title += 'edited';
          return Promise.resolve(result([root]));
        },
        in(column, values) { calls.push(['fragments', column, values]); return Promise.resolve(result(clone(input.fragments))); },
      }; } };
    },
    rpc(name, args) {
      calls.push(['rpc', name, args]); rpcReads++;
      assert.equal(name, 'ros_ko_get_scene');
      assert.deepEqual(args, { p_managed_scene_id: 'managed-id', p_composition_id: null, p_include_legacy: false });
      const row = clone(input.managedResults.get('managed-id'));
      if (changeSelection && rpcReads > 1) row.generation++;
      return Promise.resolve(result(row));
    },
  } };
}

test('loader uses exact RLS document reads and current RPC, repeats fingerprints and never writes', async () => {
  const f = clientFixture(await fixture());
  const snapshot = await loadBookSnapshot(f.client, KO);
  assert.deepEqual(snapshot.counts, { scenes: 3, paragraphs: 3 });
  assert.equal(snapshot.source.consistency, 'unchanged-read-passes');
  assert.equal(f.calls.filter(x => x[0] === 'root').length, 3);
  assert.equal(f.calls.filter(x => x[0] === 'rpc').length, 2);
  assert.equal(f.calls.length, 8);
});

test('loader aborts observed document/selection changes with 409 and denied reads with 403', async () => {
  for (const options of [{ changeDocument: true }, { changeSelection: true }]) {
    const f = clientFixture(await fixture(), options);
    await assert.rejects(loadBookSnapshot(f.client, KO), error => error.code === 'BOOK_SOURCE_CHANGED' && error.status === 409);
  }
  const denied = clientFixture(await fixture(), { error: { code: '42501', message: 'PRIVATE DETAIL' } });
  await assert.rejects(loadBookSnapshot(denied.client, KO), error => error.status === 403 && !error.message.includes('PRIVATE'));
  const signal = AbortSignal.abort();
  await assert.rejects(loadBookSnapshot(denied.client, KO, { signal }), error => error.code === 'BOOK_REQUEST_ABORTED');
});

test('auth uses a new public-key client with verified bearer and no session persistence', async () => {
  const created = [];
  const token = 'header.payload.signature';
  const env = { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
    SUPABASE_SERVICE_ROLE_KEY: 'DO_NOT_USE_SERVICE_ROLE' };
  const clientFactory = (url, key, options) => {
    const client = { auth: { getUser: async actual => { assert.equal(actual, token); return { data: { user: { id: 'user' } }, error: null }; } } };
    created.push({ url, key, options, client }); return client;
  };
  const a = await authenticateBookRequest(`Bearer ${token}`, { env, clientFactory });
  const b = await authenticateBookRequest(`Bearer ${token}`, { env, clientFactory });
  assert.notEqual(a.client, b.client);
  assert.equal(created[0].key, 'sb_publishable_test');
  assert.deepEqual(created[0].options.auth, { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false });
  assert.equal(created[0].options.global.headers.Authorization, `Bearer ${token}`);
});

test('auth rejects anonymous/invalid tokens, service role keys and network errors without details', async () => {
  const env = { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test' };
  for (const authorization of [undefined, [], 'Basic abc', 'Bearer secret', `Bearer ${'a'.repeat(17000)}`]) {
    await assert.rejects(authenticateBookRequest(authorization, { env }), error => error.status === 401);
  }
  for (const result of [{ data: { user: { id: 'u', is_anonymous: true } }, error: null },
    { data: { user: null }, error: null }, { error: { status: 401, message: 'SECRET' } }]) {
    const clientFactory = () => ({ auth: { getUser: async () => result } });
    await assert.rejects(authenticateBookRequest('Bearer h.p.s', { env, clientFactory }), error => error.status === 401 && !error.message.includes('SECRET'));
  }
  const serviceKey = `header.${Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url')}.signature`;
  await assert.rejects(authenticateBookRequest('Bearer h.p.s', { env: { ...env, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: serviceKey } }), error => error.status === 503);
  await assert.rejects(authenticateBookRequest('Bearer h.p.s', { env, clientFactory: () => ({ auth: { getUser: async () => { throw new Error('SECRET'); } } }) }), error => error.status === 503 && !error.message.includes('SECRET'));
});

test('terminal_lf validates the appended separator, preserving newlines inside the last block', async()=>{
 for(const terminal of [0,1])for(const internal of [0,1,2]){
  const input=await fixture(),m=input.managedResults.get('managed-id');
  const last=m.paragraphs.at(-1);last.versions.review.content+='\n'.repeat(internal);last.separatorAfter='\n'.repeat(terminal);
  const body=m.paragraphs.map(p=>p.versions.review.content+p.separatorAfter).join('');
  Object.assign(m.composition,{terminal_lf:terminal,body_sha256:await sha256Hex(body),body_bytes:Buffer.byteLength(body),body_lf:(body.match(/\n/g)||[]).length});
  m.projection_sha256=await bookSourceFingerprint(m.paragraphs);
  const output=await buildBookSnapshot(input);
  assert.equal(output.acts[1].chapters[0].scenes[0].paragraphs.at(-1).text,last.versions.review.content);
  m.composition.terminal_lf=1-terminal;
  await assert.rejects(buildBookSnapshot(input),BookSnapshotError);
 }
});
