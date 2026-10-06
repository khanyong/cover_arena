import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import {
  validateTranslationComparison, loadSceneTranslationComparison,
  supportsSceneTranslationComparison,
} from '../../shared/lib/novelTranslationComparison.js';

const digest = value => createHash('sha256').update(value, 'utf8').digest('hex');
const id = n => `00000000-0000-4000-8000-${n.toString(16).padStart(12, '0')}`;
// Public CI contract fixture only: no manuscript, historical DB export, or real
// Unit/Version IDs. Passing this test is not evidence that production r01 matches.
// The Scene/document keys below remain the exact supported API scope.
const equationPositions = new Set([11, 33, 35, 37]);
const syntheticPairs = Array.from({ length: 79 }, (_, index) => {
  const position = index + 1;
  const label = String(position).padStart(4, '0');
  if (equationPositions.has(position)) {
    const body = `$$ q_{${position}} = \\frac{${position}}{2} $$`;
    return { ko: body, en: body };
  }
  if (position === 1) return {
    ko: '  합성 검토 블록 0001: 앞뒤 공백을 보존한다.  ',
    en: '  Synthetic review block 0001: preserve surrounding spaces.  ',
  };
  if (position === 2) return {
    ko: '정규화하지 않는 합성 표기: e\u0301 / 가👩🏽‍💻.',
    en: 'Synthetic Unicode stays exact: e\u0301 / 가👩🏽‍💻.',
  };
  if (position === 3) return {
    ko: '합성 블록 내부 첫 줄.\n둘째 줄은 같은 블록이다.',
    en: 'First line within a synthetic block.\nThe second line remains in this block.',
  };
  if (position === 79) return { ko: '“합성 검토의 끝.”', en: '“End of synthetic review.”' };
  return {
    ko: `합성 국문 블록 ${label}: 의미 연결 검증용 예문이다.`,
    en: `Synthetic English block ${label}: example for alignment validation.`,
  };
});

function fixture() {
  const rows = syntheticPairs.map((entry, index) => {
    const enUnitId = id(index + 601);
    const enVersionId = id(index + 701);
    return {
      position: index + 1, ko_unit_id: id(index + 1), ko_version_id: id(index + 101),
      ko_body: entry.ko, separator_after: index === syntheticPairs.length - 1 ? '' : '\n\n',
      alignment_id: id(index + 201), en_unit_id: enUnitId, en_version_id: enVersionId,
      en_body: entry.en, en_body_sha256: digest(entry.en), en_latest_version_id: enVersionId,
      en_latest_body: entry.en, en_latest_body_sha256: digest(entry.en), en_status: 'unchanged',
    };
  });
  const koBody = rows.map(row => row.ko_body + row.separator_after).join('');
  const enBody = rows.map(row => row.en_body + row.separator_after).join('');
  const scene = {
    id: 'b48a4f04', storageModel: 'ros-ko-block-v1', managedSceneId: id(400),
    compositionRevisionId: id(401), canonicalBodySha256: digest(koBody),
    paragraphs: rows.map(row => ({
      id: row.ko_unit_id, unitId: row.ko_unit_id, revisionVersionId: row.ko_version_id,
      activeVersion: 'review', versions: { review: { content: row.ko_body } }, separatorAfter: row.separator_after,
    })),
  };
  const raw = {
    format: 'novel-translation-comparison-v1', managed_scene_id: scene.managedSceneId,
    scene_id: scene.id, source_key: 'PRO/CH01/SC01', ko_document_id: 'quantum-vibration-novel-act-2',
    ko_document_slug: 'quantum-vibration-novel-act-2', ko_composition_id: scene.compositionRevisionId,
    ko_body_sha256: digest(koBody), ko_body: koBody, ko_title: '합성 비교 시험', ko_terminal_lf: 0,
    en_document_id: 'quantum-vibration-novel-en-act-2', en_document_slug: 'quantum-vibration-novel-en-act-2',
    en_scene_id: scene.id, en_title: 'Synthetic Comparison Test', en_body: enBody,
    en_body_sha256: digest(enBody), en_terminal_lf: 0, rows,
    changed_count: 0, unavailable_count: 0, en_latest_structure_changed: false, latest_status: 'unchanged',
  };
  return { raw, scene };
}

test('validates synthetic 79-pair exact bytes, Unicode, whitespace, formulas and terminal LF 0 (not manuscript evidence)', async () => {
  const { raw, scene } = fixture(); const before = JSON.stringify({ raw, scene });
  assert.equal(await validateTranslationComparison(raw, scene), raw);
  assert.equal(raw.rows.length, 79);
  assert.equal(Buffer.byteLength(raw.ko_body), 5023);
  assert.equal(raw.ko_body.split('\n').length - 1, 157);
  assert.equal(raw.ko_body_sha256, 'cf1c44e2a3fc61d403bf4c8f07c47e324dbf9c6d78df628f5f53159d6b6e66fa');
  assert.equal(Buffer.byteLength(raw.en_body), 4959);
  assert.equal(raw.en_body.split('\n').length - 1, 157);
  assert.equal(raw.en_body_sha256, '7b8086329d0d2995571ba86036468118188197ffae065f759c079677ca43ed78');
  for (const body of [raw.ko_body, raw.en_body]) {
    assert.equal(body.endsWith('\n'), false);
    assert.ok(body.startsWith('  '));
    assert.ok(body.includes('e\u0301 / 가👩🏽‍💻'));
    assert.notEqual(body.normalize('NFC'), body);
  }
  assert.equal(raw.rows[0].ko_body.endsWith('  '), true);
  assert.equal(raw.rows[0].en_body.endsWith('  '), true);
  assert.deepEqual(raw.rows.filter(row => row.ko_body.startsWith('$$')).map(row => row.position), [11, 33, 35, 37]);
  for (const position of equationPositions) assert.equal(raw.rows[position - 1].ko_body, raw.rows[position - 1].en_body);
  assert.equal(JSON.stringify({ raw, scene }), before);
});

test('rejects unsupported, wrong language/document/Scene/composition and legacy scopes', async () => {
  for (const mutate of [
    ({ scene }) => { scene.id = 'd9766afa'; },
    ({ scene }) => { scene.managedViewKey = 'legacy'; },
    ({ raw }) => { raw.ko_document_id = 'quantum-vibration-novel-en-act-2'; },
    ({ raw }) => { raw.en_scene_id = 'd9766afa'; },
    ({ raw }) => { raw.managed_scene_id = id(999); },
    ({ raw }) => { raw.ko_composition_id = id(999); },
  ]) {
    const f = fixture(); mutate(f);
    await assert.rejects(validateTranslationComparison(f.raw, f.scene));
  }
  assert.equal(supportsSceneTranslationComparison(fixture().scene), true);
});

test('rejects wrong counts, duplicates, ordering, mapping identities, separators, or displayed KO text', async () => {
  for (const mutate of [
    ({ raw }) => { raw.rows.pop(); },
    ({ raw }) => { raw.rows[0].position = 2; },
    ({ raw }) => { raw.rows[1].en_unit_id = raw.rows[0].en_unit_id; },
    ({ raw }) => { raw.rows[1].alignment_id = raw.rows[0].alignment_id; },
    ({ raw }) => { raw.rows[0].ko_version_id = id(999); },
    ({ raw }) => { raw.rows[0].separator_after = '\n'; },
    ({ raw }) => { raw.rows[78].separator_after = '\n'; },
    ({ scene }) => { scene.paragraphs[0].versions.review.content += ' '; },
    ({ raw }) => { raw.rows[10].en_body += ' '; },
    ({ raw }) => { raw.en_body += '\n'; },
    ({ raw }) => { raw.ko_body_sha256 = '0'.repeat(64); },
  ]) {
    const f = fixture(); mutate(f);
    await assert.rejects(validateTranslationComparison(f.raw, f.scene));
  }
});

test('pinned source remains intact while a newer EN version is explicitly marked changed', async () => {
  const { raw, scene } = fixture(); const pinned = raw.en_body;
  raw.rows[0].en_latest_version_id = id(999);
  raw.rows[0].en_latest_body = 'A later English revision.';
  raw.rows[0].en_latest_body_sha256 = digest(raw.rows[0].en_latest_body);
  raw.rows[0].en_status = 'changed'; raw.changed_count = 1; raw.latest_status = 'changed';
  await validateTranslationComparison(raw, scene);
  assert.equal(raw.en_body, pinned);
  raw.rows[0].en_status = 'unchanged';
  await assert.rejects(validateTranslationComparison(raw, scene));
});

test('missing latest source is unavailable, never silently replaced by pinned content', async () => {
  const { raw, scene } = fixture();
  Object.assign(raw.rows[0], { en_latest_version_id: null, en_latest_body: null, en_latest_body_sha256: null, en_status: 'unavailable' });
  raw.unavailable_count = 1; raw.latest_status = 'unavailable';
  await validateTranslationComparison(raw, scene);
  raw.rows[0].en_latest_body = raw.rows[0].en_body;
  await assert.rejects(validateTranslationComparison(raw, scene));
});

test('latest EN structural change and summary counts are explicit and checked', async () => {
  const { raw, scene } = fixture(); raw.en_latest_structure_changed = true; raw.latest_status = 'changed';
  await validateTranslationComparison(raw, scene);
  raw.changed_count = 1;
  await assert.rejects(validateTranslationComparison(raw, scene));
});

test('historical sealed KO composition is allowed but remains an exact composition snapshot', async () => {
  const { raw, scene } = fixture(); scene.managedReadOnly = true; scene.managedReviewCompositionId = id(500);
  await validateTranslationComparison(raw, scene);
});

test('loader uses only scoped read RPC with explicit composition and propagates access/network errors', async () => {
  const { raw, scene } = fixture(); const calls = [];
  const client = { rpc: async (...args) => { calls.push(args); return { data: raw, error: null }; } };
  await loadSceneTranslationComparison({ scene, client });
  assert.deepEqual(calls, [['ros_ko_get_translation_comparison', {
    p_managed_scene_id: scene.managedSceneId, p_composition_id: scene.compositionRevisionId,
  }]]);
  const denied = new Error('MANAGED_SCENE_ACCESS_DENIED');
  await assert.rejects(loadSceneTranslationComparison({ scene, client: { rpc: async () => ({ data: null, error: denied }) } }), error => error === denied);
  scene.managedViewKey = 'legacy';
  await assert.rejects(loadSceneTranslationComparison({ scene, client }));
  assert.equal(calls.length, 1);
});

test('SQL exposes only owner-gated stable read, with exact scopes and no manuscript mutation', async () => {
  const sql = await readFile(new URL('../ros-ko/translation-comparison-read.sql', import.meta.url), 'utf8');
  assert.match(sql, /stable security definer set search_path = ''/);
  assert.match(sql, /ros_ko_assert_scene_owner\(p_managed_scene_id, 'read'\)/);
  assert.match(sql, /revoke all[^;]+from public,anon,authenticated/);
  assert.match(sql, /grant execute[^;]+to authenticated/);
  assert.match(sql, /PINNED_EN_ALIGNMENT_INVALID/);
  assert.doesNotMatch(sql, /\b(?:insert\s+into|update\s+public\.|delete\s+from|create\s+table)\b/i);
});
