import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import {
  validateTranslationComparison, loadSceneTranslationComparison,
  supportsSceneTranslationComparison, supportsTranslationComparisonSceneId,
} from '../../shared/lib/novelTranslationComparison.js';

const digest = value => createHash('sha256').update(value, 'utf8').digest('hex');
const id = n => `00000000-0000-4000-8000-${n.toString(16).padStart(12, '0')}`;
const koManifest = JSON.parse(await readFile(new URL('../../reports/revision-platform/ROS-KO-BLOCK-MODEL-01/migration-manifest.v0.2.1.review.json', import.meta.url), 'utf8'));
const enEvidence = JSON.parse(await readFile(new URL('../../reports/revision-platform/ROS-KO-BLOCK-MODEL-01/EN_DB_READBACK_SOURCE_COPY_v0.2.1.json', import.meta.url), 'utf8'));
const enById = new Map(enEvidence.verification.reader.paragraphs.map(p => [p.id, p]));

function fixture() {
  // KO identities are synthetic test-only. EN and exact manuscript bytes are local historical evidence.
  const rows = koManifest.rows.map((entry, index) => {
    const en = enById.get(entry.alignment.en_unit_id);
    const body = en.versions[en.activeVersion].content;
    return {
      position: index + 1, ko_unit_id: id(index + 1), ko_version_id: id(index + 101),
      ko_body: entry.ko_body_utf8, separator_after: entry.separator_after_utf8,
      alignment_id: id(index + 201), en_unit_id: en.id, en_version_id: en.revisionVersionId,
      en_body: body, en_body_sha256: digest(body), en_latest_version_id: en.revisionVersionId,
      en_latest_body: body, en_latest_body_sha256: digest(body), en_status: 'unchanged',
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
    ko_body_sha256: digest(koBody), ko_body: koBody, ko_title: '합의의 건축', ko_terminal_lf: 0,
    en_document_id: 'quantum-vibration-novel-en-act-2', en_document_slug: 'quantum-vibration-novel-en-act-2',
    en_scene_id: scene.id, en_title: 'The Architecture of Consensus', en_body: enBody,
    en_body_sha256: digest(enBody), en_terminal_lf: 0, rows,
    changed_count: 0, unavailable_count: 0, en_latest_structure_changed: false, latest_status: 'unchanged',
  };
  return { raw, scene };
}

const sceneScopes = [
  { sceneId: 'b48a4f04', sourceKey: 'PRO/CH01/SC01', count: 79 },
  { sceneId: '3b301af5', sourceKey: 'PRO/CH02/SC01', count: 139 },
  { sceneId: '30ad0834', sourceKey: 'PRO/CH02/SC02', count: 246 },
];

function syntheticFixture(scope) {
  // Deliberately synthetic prose and IDs: CH2 tests never create fallback manuscript data.
  const offset = (sceneScopes.indexOf(scope) + 1) * 10000;
  const rows = Array.from({ length: scope.count }, (_, index) => {
    const body = `English ${scope.sourceKey} block ${index + 1}.`;
    return {
      position: index + 1, ko_unit_id: id(offset + index), ko_version_id: id(offset + index + 1000),
      ko_body: `국문 ${scope.sourceKey} 블록 ${index + 1}.`, separator_after: index === scope.count - 1 ? '' : '\n\n',
      alignment_id: id(offset + index + 2000), en_unit_id: id(offset + index + 3000), en_version_id: id(offset + index + 4000),
      en_body: body, en_body_sha256: digest(body), en_latest_version_id: id(offset + index + 4000),
      en_latest_body: body, en_latest_body_sha256: digest(body), en_status: 'unchanged',
    };
  });
  const koBody = rows.map(row => row.ko_body + row.separator_after).join('');
  const enBody = rows.map(row => row.en_body + row.separator_after).join('');
  const scene = {
    id: scope.sceneId, storageModel: 'ros-ko-block-v1', managedSceneId: id(offset + 5000),
    compositionRevisionId: id(offset + 5001), canonicalBodySha256: digest(koBody),
    paragraphs: rows.map(row => ({
      id: row.ko_unit_id, unitId: row.ko_unit_id, revisionVersionId: row.ko_version_id,
      activeVersion: 'review', versions: { review: { content: row.ko_body } }, separatorAfter: row.separator_after,
    })),
  };
  return { scene, raw: {
    format: 'novel-translation-comparison-v1', managed_scene_id: scene.managedSceneId,
    scene_id: scope.sceneId, source_key: scope.sourceKey, ko_document_id: 'quantum-vibration-novel-act-2',
    ko_document_slug: 'quantum-vibration-novel-act-2', ko_composition_id: scene.compositionRevisionId,
    ko_body: koBody, ko_body_sha256: digest(koBody), ko_terminal_lf: 0,
    en_document_id: 'quantum-vibration-novel-en-act-2', en_document_slug: 'quantum-vibration-novel-en-act-2',
    en_scene_id: scope.sceneId, en_body: enBody, en_body_sha256: digest(enBody), en_terminal_lf: 0, rows,
    changed_count: 0, unavailable_count: 0, en_latest_structure_changed: false, latest_status: 'unchanged',
  } };
}

test('validates exact 79-block KO r01 and historical pinned EN without terminal LF normalization', async () => {
  const { raw, scene } = fixture(); const before = JSON.stringify({ raw, scene });
  assert.equal(await validateTranslationComparison(raw, scene), raw);
  assert.equal(Buffer.byteLength(raw.ko_body), 9554);
  assert.equal(raw.ko_body.split('\n').length - 1, 156);
  assert.equal(raw.ko_body_sha256, 'fe3c492c1fed62b6707fa8ac105e0bbe4b0e180688a69b6b3491251e5b4cfea6');
  assert.equal(Buffer.byteLength(raw.en_body), 7954);
  assert.equal(raw.en_body_sha256, '12d74c87ecc8e0686088f101ea0db1e589a99482d1fff9c2580427718c1de5c4');
  assert.equal(JSON.stringify({ raw, scene }), before);
});

test('legacy RPC compatibility retains its three known Scene IDs', () => {
  for (const scope of sceneScopes) assert.equal(supportsTranslationComparisonSceneId(scope.sceneId), true);
  for (const value of [undefined, null, '', 'd9766afa', 'toString', '__proto__', ['3b301af5']]) {
    assert.equal(supportsTranslationComparisonSceneId(value), false);
  }
});

for (const scope of sceneScopes.slice(1)) {
  test(`validates exact ${scope.count}-block ${scope.sourceKey} composition without mutations`, async () => {
    const { raw, scene } = syntheticFixture(scope); const before = JSON.stringify({ raw, scene });
    assert.equal(supportsSceneTranslationComparison(scene), true);
    assert.equal(await validateTranslationComparison(raw, scene), raw);
    assert.equal(raw.rows.length, scope.count);
    assert.equal(raw.ko_body.split('\n').length - 1, 2 * (scope.count - 1));
    assert.equal(raw.rows.at(-1).separator_after, '');
    assert.equal(raw.ko_body.endsWith('\n'), false);
    assert.equal(raw.en_body.endsWith('\n'), false);
    assert.equal(JSON.stringify({ raw, scene }), before);
  });

  test(`${scope.sourceKey} rejects wrong counts, last-block separators and terminal LF`, async () => {
    for (const mutate of [
      ({ raw }) => { raw.rows = raw.rows.slice(0, 79); },
      ({ scene }) => { scene.paragraphs.pop(); },
      ({ raw }) => { raw.rows[78].separator_after = ''; },
      ({ raw }) => { raw.rows.at(-1).separator_after = '\n\n'; },
      ({ raw }) => { raw.ko_terminal_lf = 1; },
      ({ raw }) => { raw.en_terminal_lf = 1; },
    ]) {
      const f = syntheticFixture(scope); mutate(f);
      await assert.rejects(validateTranslationComparison(f.raw, f.scene));
    }
    for (const language of ['ko', 'en']) {
      const { raw, scene } = syntheticFixture(scope);
      raw.rows.at(-1)[`${language}_body`] += '\n';
      raw[`${language}_body`] += '\n';
      raw[`${language}_body_sha256`] = digest(raw[`${language}_body`]);
      if (language === 'ko') {
        scene.paragraphs.at(-1).versions.review.content += '\n';
        scene.canonicalBodySha256 = raw.ko_body_sha256;
      } else {
        const last = raw.rows.at(-1);
        last.en_body_sha256 = digest(last.en_body);
        last.en_latest_body = last.en_body;
        last.en_latest_body_sha256 = last.en_body_sha256;
      }
      await assert.rejects(validateTranslationComparison(raw, scene), /전문의 재구성/);
    }
  });

  test(`${scope.sourceKey} loader reads its own composition and rejects another Scene response`, async () => {
    const { raw, scene } = syntheticFixture(scope); const calls = [];
    await loadSceneTranslationComparison({ scene, client: { rpc: async (...args) => {
      calls.push(args); return { data: raw, error: null };
    } } });
    assert.deepEqual(calls, [['ros_ko_get_translation_comparison', {
      p_managed_scene_id: scene.managedSceneId, p_composition_id: scene.compositionRevisionId,
    }]]);
    await assert.rejects(loadSceneTranslationComparison({ scene, client: { rpc: async () => ({
      data: syntheticFixture(sceneScopes[0]).raw, error: null,
    }) } }));
  });
}

test('rejects cross-Scene source keys, EN Scene IDs and relabelled block counts in every direction', async () => {
  for (const scope of sceneScopes) for (const other of sceneScopes) {
    if (scope === other) continue;
    for (const mutate of [
      ({ raw }) => { raw.source_key = other.sourceKey; },
      ({ raw }) => { raw.en_scene_id = other.sceneId; },
      ({ raw, scene }) => {
        raw.source_key = other.sourceKey; raw.scene_id = other.sceneId;
        raw.en_scene_id = other.sceneId; scene.id = other.sceneId;
      },
    ]) {
      const f = syntheticFixture(scope); mutate(f);
      await assert.rejects(validateTranslationComparison(f.raw, f.scene));
    }
  }
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
