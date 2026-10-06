// Run: node --experimental-vm-modules --test scripts/tests/novel-review-guideline-client.test.mjs
// Evaluate the actual client with isolated imports; no real Auth or DB calls.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../../shared/lib/novelReviewGuidelineClient.js', import.meta.url), 'utf8');
const hash = value => createHash('sha256').update(value, 'utf8').digest('hex');
const plain = value => JSON.parse(JSON.stringify(value));
const scene = { managedSceneId: 'managed-current', compositionRevisionId: 'composition-current' };
const input = { scope: 'scene', direction: '설명은 줄이고 대사는 절제해 주세요.', target_character: '이안', applies_to: 'dialogue', preservation: '과학적 의미 보존', include_in_export: true };

async function harness({ store = new Map(), storageDenied = false, sequenceStart = 0 } = {}) {
  let sequence = sequenceStart;
  const state = { actor: 'actor-1', authError: null, userMissing: false, handler: null, calls: [], authCalls: 0 };
  const sessionStorage = {
    getItem(key) { if (storageDenied) throw new Error('storage denied'); return store.get(key) ?? null; },
    setItem(key, value) { if (storageDenied) throw new Error('storage denied'); store.set(key, value); },
    removeItem(key) { if (storageDenied) throw new Error('storage denied'); store.delete(key); },
  };
  const supabase = {
    auth: { async getUser() { state.authCalls++; return { data: { user: state.userMissing ? null : { id: state.actor } }, error: state.authError }; } },
    async rpc(name, args) {
      state.calls.push({ name, args: plain(args), actor: state.actor });
      if (state.handler) return state.handler(name, args);
      return { data: name.endsWith('_list') ? [] : { id: args.p_guideline_id, revision: args.p_expected_revision + 1 }, error: null };
    },
  };
  const context = vm.createContext({ sessionStorage, crypto: { randomUUID: () => `00000000-0000-4000-8000-${String(++sequence).padStart(12, '0')}` } });
  const target = new vm.SourceTextModule(source, { context, identifier: 'novelReviewGuidelineClient.js' });
  const mockSupabase = new vm.SyntheticModule(['supabase'], function () { this.setExport('supabase', supabase); }, { context });
  const mockHash = new vm.SyntheticModule(['sha256Hex'], function () { this.setExport('sha256Hex', async value => hash(value)); }, { context });
  await target.link(specifier => {
    if (specifier === './supabase') return mockSupabase;
    if (specifier === './rosKoBlockModel') return mockHash;
    throw new Error(`Unexpected import: ${specifier}`);
  });
  await target.evaluate();
  return { api: target.namespace, state, store };
}

test('unanchored creation sends current composition and editable guidance only; clears successful retry state', async () => {
  const h = await harness();
  const beforeScene = JSON.stringify(scene), beforeInput = JSON.stringify(input);
  const result = await h.api.saveReviewGuideline({ scene, input: { ...input, author_id: 'untrusted', body_snapshot: 'not trusted', expected_composition_id: 'untrusted' } });
  assert.equal(h.state.authCalls, 1);
  assert.equal(h.state.calls.length, 1);
  const call = h.state.calls[0];
  assert.equal(call.name, 'ros_ko_review_guideline_save');
  assert.equal(call.args.p_managed_scene_id, scene.managedSceneId);
  assert.equal(call.args.p_expected_revision, 0);
  assert.deepEqual(call.args.p_input, { target_character: '이안', applies_to: 'dialogue', preservation: '과학적 의미 보존', direction: input.direction, include_in_export: true, scope: 'scene', expected_composition_id: scene.compositionRevisionId });
  assert.equal(Object.hasOwn(call.args.p_input, 'example'), false);
  assert.equal(result.id, call.args.p_guideline_id);
  assert.equal(h.store.size, 0);
  assert.equal(JSON.stringify(scene), beforeScene);
  assert.equal(JSON.stringify(input), beforeInput);
});

test('anchored creation hashes exact active body and preserves codepoint selection offsets', async () => {
  const h = await harness();
  const body = '  가👩🏽‍💻é\n\n$$\\Psi = R e^{iS/\\hbar}$$\n끝 LF 없음  ';
  const paragraph = { unitId: 'ko-unit-11', revisionVersionId: 'ko-version-11', activeVersion: 'review', versions: { review: { content: body }, old: { content: 'old' } } };
  const start = 3, end = 7, selected = Array.from(body).slice(start, end).join('');
  await h.api.saveReviewGuideline({ scene, paragraph, input: { ...input, scope: 'work', selected_text: selected, selection_start: start, selection_end: end, example: { body_sha256: 'untrusted' } } });
  const payload = h.state.calls[0].args.p_input;
  assert.equal(payload.scope, 'work');
  assert.deepEqual(payload.example, { block_unit_id: 'ko-unit-11', block_version_id: 'ko-version-11', composition_id: scene.compositionRevisionId, body_sha256: hash(body), selected_text: selected, selection_start: start, selection_end: end });
  assert.equal(Object.hasOwn(payload, 'selected_text'), false);
  assert.equal(Object.hasOwn(payload.example, 'body_snapshot'), false);
  assert.notEqual(payload.example.body_sha256, hash(body.trim()));
});

test('whole-block example uses empty selection and explicit null offsets without editing source', async () => {
  const h = await harness();
  const paragraph = { unitId: 'unit', revisionVersionId: 'version', activeVersion: 'review', versions: { review: { content: '본문\n\n수식 $x$' } } };
  const before = JSON.stringify(paragraph);
  await h.api.saveReviewGuideline({ scene, paragraph, input });
  assert.equal(h.state.calls[0].args.p_input.example.selected_text, '');
  assert.equal(h.state.calls[0].args.p_input.example.selection_start, null);
  assert.equal(h.state.calls[0].args.p_input.example.selection_end, null);
  assert.equal(JSON.stringify(paragraph), before);
});

test('update routes to immutable origin and sends only mutable fields, never rebases existing anchor', async () => {
  const h = await harness();
  const existing = { id: 'guideline-existing', revision: 4, managed_scene_id: 'origin-scene', scope: 'work', expected_composition_id: 'origin-comp', block_unit_id: 'origin-unit' };
  await h.api.saveReviewGuideline({ scene: { ...scene, managedReadOnly: true }, paragraph: { unitId: 'different' }, existing,
    input: { direction: '새 지침', status: 'review', scope: 'scene', expected_composition_id: 'replace', selected_text: 'replace', example: null, block_unit_id: 'replace', author_id: 'replace', include_in_export: false } });
  const args = h.state.calls[0].args;
  assert.equal(args.p_managed_scene_id, 'origin-scene');
  assert.equal(args.p_guideline_id, 'guideline-existing');
  assert.equal(args.p_expected_revision, 4);
  assert.deepEqual(args.p_input, { direction: '새 지침', status: 'review', include_in_export: false });
});

test('failed RPC retry preserves exact request IDs and payload, success removes pending request', async () => {
  const h = await harness();
  let first = true;
  h.state.handler = (_name, args) => first ? (first = false, { data: null, error: { message: 'temporary failure' } }) : { data: { id: args.p_guideline_id }, error: null };
  await assert.rejects(h.api.saveReviewGuideline({ scene, input }), error => error.message === 'temporary failure');
  assert.equal(h.store.size, 1);
  const cached = JSON.parse([...h.store.values()][0]);
  assert.deepEqual(Object.keys(cached).sort(), ['eventId', 'fingerprint', 'guidelineId']);
  assert.equal(JSON.stringify(cached).includes(input.direction), false);
  await h.api.saveReviewGuideline({ scene, input });
  assert.deepEqual(h.state.calls[1].args, h.state.calls[0].args);
  assert.equal(h.store.size, 0);
  await h.api.saveReviewGuideline({ scene, input });
  assert.notEqual(h.state.calls[2].args.p_event_id, h.state.calls[0].args.p_event_id);
  assert.notEqual(h.state.calls[2].args.p_guideline_id, h.state.calls[0].args.p_guideline_id);
});

test('uncertain response persists request across fresh module load in same browser session', async () => {
  const store = new Map();
  const first = await harness({ store });
  first.state.handler = () => ({ data: {}, error: null });
  await assert.rejects(first.api.saveReviewGuideline({ scene, input }), error => /불명확/.test(error.message));
  const second = await harness({ store, sequenceStart: 50 });
  await second.api.saveReviewGuideline({ scene, input });
  assert.deepEqual(second.state.calls[0].args, first.state.calls[0].args);
  assert.equal(store.size, 0);
});

test('retry cache is actor scoped, including returning to the original actor after a failed request', async () => {
  const h = await harness();
  h.state.handler = () => ({ data: null, error: { message: 'network unavailable' } });
  await assert.rejects(h.api.saveReviewGuideline({ scene, input }));
  h.state.actor = 'actor-2';
  await assert.rejects(h.api.saveReviewGuideline({ scene, input }));
  assert.notEqual(h.state.calls[1].args.p_event_id, h.state.calls[0].args.p_event_id);
  assert.notEqual(h.state.calls[1].args.p_guideline_id, h.state.calls[0].args.p_guideline_id);
  assert.equal(h.store.size, 2);
  const keys = [...h.store.keys()];
  assert.ok(keys.some(key => key.includes(':actor-1:managed-current:')));
  assert.ok(keys.some(key => key.includes(':actor-2:managed-current:')));
  h.state.actor = 'actor-1';
  await assert.rejects(h.api.saveReviewGuideline({ scene, input }));
  assert.deepEqual(h.state.calls[2].args, h.state.calls[0].args);
  assert.equal(h.state.authCalls, 3);
});

test('changed input or expected revision creates a new event, while storage denial preserves memory retry', async () => {
  const h = await harness({ storageDenied: true });
  h.state.handler = () => ({ data: null, error: { message: 'retry later' } });
  const existing = { id: 'existing', managed_scene_id: scene.managedSceneId, revision: 1 };
  await assert.rejects(h.api.saveReviewGuideline({ scene, input, existing }));
  await assert.rejects(h.api.saveReviewGuideline({ scene, input, existing }));
  assert.deepEqual(h.state.calls[1].args, h.state.calls[0].args);
  await assert.rejects(h.api.saveReviewGuideline({ scene, input: { ...input, direction: 'different' }, existing }));
  assert.notEqual(h.state.calls[2].args.p_event_id, h.state.calls[1].args.p_event_id);
  await assert.rejects(h.api.saveReviewGuideline({ scene, input: { ...input, direction: 'different' }, existing: { ...existing, revision: 2 } }));
  assert.notEqual(h.state.calls[3].args.p_event_id, h.state.calls[2].args.p_event_id);
  for (const call of h.state.calls) assert.equal(call.args.p_guideline_id, 'existing');
});

test('missing login, bad origin, historical creation and incomplete example cannot reach save RPC', async () => {
  const h = await harness();
  h.state.userMissing = true;
  await assert.rejects(h.api.saveReviewGuideline({ scene, input }), error => /로그인/.test(error.message));
  h.state.userMissing = false;
  h.state.authError = { message: 'auth expired' };
  await assert.rejects(h.api.saveReviewGuideline({ scene, input }), error => error.message === 'auth expired');
  h.state.authError = null;
  await assert.rejects(h.api.saveReviewGuideline({ scene: {}, input }), error => /식별값/.test(error.message));
  await assert.rejects(h.api.saveReviewGuideline({ scene: { ...scene, managedReadOnly: true }, input }), error => /최신 review/.test(error.message));
  await assert.rejects(h.api.saveReviewGuideline({ scene: { managedSceneId: 'scene' }, input }), error => /최신 review/.test(error.message));
  await assert.rejects(h.api.saveReviewGuideline({ scene, paragraph: { unitId: 'unit' }, input }), error => /본문과 버전/.test(error.message));
  assert.equal(h.state.calls.length, 0);
  assert.equal(h.store.size, 0);
});

test('list uses only requested managed Scene, propagates denial and rejects malformed responses', async () => {
  const h = await harness();
  const rows = [{ id: 'scene-guidance', scope: 'scene' }, { id: 'work-guidance', scope: 'work' }];
  h.state.handler = () => ({ data: rows, error: null });
  assert.deepEqual(await h.api.listReviewGuidelines('managed-one'), rows);
  assert.deepEqual(h.state.calls[0], { name: 'ros_ko_review_guidelines_list', args: { p_managed_scene_id: 'managed-one' }, actor: 'actor-1' });
  h.state.handler = () => ({ data: null, error: { message: 'permission denied' } });
  await assert.rejects(h.api.listReviewGuidelines('managed-one'), error => error.message === 'permission denied');
  h.state.handler = () => ({ data: {}, error: null });
  await assert.rejects(h.api.listReviewGuidelines('managed-one'), error => /조회 응답/.test(error.message));
});
