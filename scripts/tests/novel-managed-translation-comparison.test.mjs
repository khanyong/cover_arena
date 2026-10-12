import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { postgresJsonbText } from '../../shared/lib/rosKoBlockModel.js';
import { loadSceneTranslationComparison, supportsSceneTranslationComparison, validateTranslationComparison } from '../../shared/lib/novelTranslationComparison.js';

const id = n => `00000000-0000-4000-8000-${n.toString(16).padStart(12, '0')}`;
const sha = value => createHash('sha256').update(value).digest('hex');
const enProject = '707e3ae1-0817-467a-bb42-5401c646151e';

function fixture({ sceneId = 'dd5e34a3', source = 'A0/CH03/SC01', act = 3, count = 3 } = {}) {
  const paragraphs = Array.from({ length: count }, (_, index) => ({
    id: id(index + 1), unitId: id(index + 1), revisionVersionId: id(index + 101),
    sourceKey: `KO/${source}/B${String(index + 1).padStart(4, '0')}`,
    compositionRevisionId: id(901), storageModel: 'ros-ko-block-v1',
    activeVersion: 'review', versions: { review: { content: `Synthetic KO ${index}: 한글.` } },
    separatorAfter: index === count - 1 ? '' : '\n\n',
  }));
  const body = paragraphs.map(p => p.versions.review.content + p.separatorAfter).join('');
  const scene = {
    id: sceneId, storageModel: 'ros-ko-block-v1', managedSceneId: id(900), compositionRevisionId: id(901),
    managedViewKey: id(901), managedSourceKey: source, managedDocumentId: `quantum-vibration-novel-act-${act}`,
    managedDocumentSlug: `quantum-vibration-novel-act-${act}`, terminalLf: 0,
    canonicalBodySha256: sha(body), paragraphs,
  };
  const managed = {
    managed_scene_id: scene.managedSceneId, scene_id: scene.id, source_key: source,
    requested_composition_id: scene.compositionRevisionId, display_mode: 'composition',
    composition: { id: id(901), managed_scene_id: id(900), status: 'sealed', block_count: count,
      terminal_lf: 0, body_sha256: sha(body), title_snapshot: 'Synthetic title' },
    paragraphs: structuredClone(paragraphs), projection_sha256: sha(postgresJsonbText(paragraphs)),
  };
  const enParagraphs = paragraphs.map((_, index) => ({
    id: id(index + 201), unitId: id(index + 201), revisionVersionId: id(index + 301),
    activeVersion: 'reader', versions: { reader: { content: `Synthetic EN ${index}.` } },
  }));
  const tables = {
    ko_managed_scenes: [{ id: id(900), root_document_id: 'quantum-vibration-novel',
      document_id: scene.managedDocumentId, document_slug: scene.managedDocumentSlug,
      scene_id: scene.id, source_key: source, scene_path: ['chapters', '2', 'scenes', '0'],
      logical_project_id: id(950), storage_model: 'ros-ko-block-v1' }],
    ko_en_block_alignments: paragraphs.map((p, index) => ({
      id: id(index + 401), managed_scene_id: id(900), ko_block_unit_id: p.unitId,
      en_block_unit_id: id(index + 201), en_block_version_id: id(index + 301),
      relation: 'translation_of', evidence_manifest_sha256: 'a'.repeat(64),
    })),
    novel_documents: [{ id: `quantum-vibration-novel-en-act-${act}`, slug: `quantum-vibration-novel-en-act-${act}`,
      data: { number: act, chapters: [{ scenes: [{ id: scene.id, title: 'Synthetic English title', paragraphs: enParagraphs }] }] } }],
    content_units: [
      ...enParagraphs.map(p => ({ id: p.unitId, project_id: enProject, unit_type: 'paragraph' })),
      { id: id(700), project_id: enProject, unit_type: 'scene', source_path: `act-${act}/ch-3/sc-1` },
    ],
    paragraph_versions: enParagraphs.map(p => ({ id: p.revisionVersionId, paragraph_unit_id: p.unitId,
      body_markdown: p.versions.reader.content })),
    revision_content_map: enParagraphs.map(p => ({ unit_id: p.unitId, paragraph_version_id: p.revisionVersionId,
      parent_unit_id: id(700), snapshot_id: id(800) })),
    revision_snapshots: [{ id: id(800), project_id: enProject }],
  };
  const calls = [];
  const client = {
    async rpc(name, args) { calls.push({ rpc: name, args }); return { data: managed, error: null }; },
    from(table) {
      const query = { table, filters: [], orders: [], start: 0, end: Infinity, single: false };
      const builder = {
        select() { return this; },
        eq(column, value) { query.filters.push(row => row[column] === value); return this; },
        in(column, values) { query.filters.push(row => values.includes(row[column])); query.inColumn = column; return this; },
        order(column) { query.orders.push(column); return this; },
        range(start, end) { query.start = start; query.end = end; return this; },
        single() { query.single = true; return this; },
        then(resolve, reject) {
          calls.push({ table, start: query.start, end: query.end, inColumn: query.inColumn });
          let rows = (tables[table] || []).filter(row => query.filters.every(filter => filter(row)));
          rows = rows.toSorted((left, right) => {
            for (const column of query.orders) {
              const comparison = String(left[column]).localeCompare(String(right[column]));
              if (comparison) return comparison;
            }
            return 0;
          }).slice(query.start, query.end + 1);
          return Promise.resolve({ data: query.single ? rows[0] : rows, error: null }).then(resolve, reject);
        },
      };
      return builder;
    },
  };
  return { scene, managed, tables, calls, client, enParagraphs };
}

test('managed binding enables any sealed Scene and reads pinned EN using existing authenticated SELECTs', async () => {
  for (const options of [{}, { sceneId: 'future-scene', source: 'A4/CH12/SC03', act: 7 },
    { sceneId: 'b48a4f04', source: 'PRO/CH01/SC01', act: 2 }]) {
    const f = fixture(options); const before = JSON.stringify({ scene: f.scene, managed: f.managed, tables: f.tables });
    assert.equal(supportsSceneTranslationComparison(f.scene), true);
    const result = await loadSceneTranslationComparison(f);
    assert.equal(result.rows.length, 3);
    assert.equal(result.source_key, f.scene.managedSourceKey);
    assert.equal(result.latest_status, 'unchanged');
    assert.equal(result.ko_body_sha256, f.scene.canonicalBodySha256);
    assert.deepEqual(f.calls.filter(call => call.rpc), [{ rpc: 'ros_ko_get_scene', args: {
      p_managed_scene_id: f.scene.managedSceneId, p_composition_id: f.scene.compositionRevisionId, p_include_legacy: false,
    } }]);
    assert.equal(JSON.stringify({ scene: f.scene, managed: f.managed, tables: f.tables }), before);
  }
});

test('incomplete or wrong binding fails closed instead of falling back to a supported Scene ID', async () => {
  for (const mutate of [
    f => { f.scene.managedDocumentSlug = 'other'; },
    f => { f.scene.managedDocumentId = 'quantum-vibration-novel-en-act-3'; },
    f => { delete f.scene.managedSourceKey; },
    f => { f.scene.managedViewKey = 'legacy'; },
    f => { f.scene.terminalLf = 1; },
    f => { f.scene.canonicalBodySha256 = 'invalid'; },
  ]) {
    const f = fixture(); mutate(f);
    assert.equal(supportsSceneTranslationComparison(f.scene), false);
    await assert.rejects(loadSceneTranslationComparison(f));
    assert.equal(f.calls.length, 0);
  }
});

test('generic read rejects wrong capability result, scope, projection, alignment and target membership', async () => {
  for (const mutate of [
    f => { f.managed.scene_id = 'wrong-scene'; },
    f => { f.managed.source_key = 'A0/CH01/SC01'; },
    f => { f.managed.composition.id = id(999); },
    f => { f.managed.composition.status = 'assembling'; },
    f => { f.managed.composition.body_sha256 = '0'.repeat(64); },
    f => { f.managed.paragraphs[0].versions.review.content += ' '; },
    f => { f.tables.ko_managed_scenes[0].root_document_id = 'wrong'; },
    f => { f.tables.ko_managed_scenes[0].scene_path[1] = '-1'; },
    f => { f.tables.ko_managed_scenes[0].document_id = 'quantum-vibration-novel-act-2'; },
    f => { f.tables.ko_en_block_alignments.pop(); },
    f => { f.tables.ko_en_block_alignments[0].relation = 'merged_from'; },
    f => { f.tables.ko_en_block_alignments[0].en_block_unit_id = f.tables.ko_en_block_alignments[1].en_block_unit_id; },
    f => { f.tables.ko_en_block_alignments[0].evidence_manifest_sha256 = ''; },
    f => { f.tables.paragraph_versions[0].paragraph_unit_id = id(999); },
    f => { f.tables.paragraph_versions.shift(); },
    f => { f.tables.content_units[0].project_id = id(999); },
    f => { f.tables.content_units.at(-1).source_path = 'act-3/ch-1/sc-1'; },
    f => { f.tables.revision_snapshots[0].project_id = id(999); },
    f => { f.tables.revision_content_map.shift(); },
    f => { f.tables.revision_content_map[0].paragraph_version_id = id(999); },
    f => { f.tables.novel_documents[0].slug = 'quantum-vibration-novel-act-3'; },
    f => { f.scene.paragraphs[0].versions.review.content += ' '; },
  ]) {
    const f = fixture(); mutate(f);
    await assert.rejects(loadSceneTranslationComparison(f));
  }
});

test('latest EN changes, unavailable versions and structure are distinct from immutable pinned EN', async () => {
  const f = fixture(); const pinned = f.tables.paragraph_versions[0].body_markdown;
  const latest = { id: id(999), paragraph_unit_id: f.enParagraphs[0].unitId, body_markdown: 'A later EN edition.' };
  f.tables.paragraph_versions.push(latest);
  f.enParagraphs[0].revisionVersionId = latest.id;
  f.enParagraphs[0].versions.reader.content = latest.body_markdown;
  f.enParagraphs[1].revisionVersionId = id(998);
  f.enParagraphs.reverse();
  const result = await loadSceneTranslationComparison(f);
  assert.equal(result.rows[0].en_body, pinned);
  assert.equal(result.rows[0].en_latest_body, latest.body_markdown);
  assert.equal(result.rows[0].en_status, 'changed');
  assert.equal(result.rows[1].en_status, 'unavailable');
  assert.equal(result.rows[1].en_latest_body, null);
  assert.equal(result.changed_count, 1);
  assert.equal(result.unavailable_count, 1);
  assert.equal(result.en_latest_structure_changed, true);
  assert.equal(result.latest_status, 'unavailable');
  result.ko_document_id = 'quantum-vibration-novel-act-2';
  await assert.rejects(validateTranslationComparison(result, f.scene));
});

test('duplicate or missing latest Scene and tampered latest prose cannot impersonate pinned EN', async () => {
  for (const mutate of [
    f => { f.tables.novel_documents[0].data.chapters[0].scenes.push(structuredClone(f.tables.novel_documents[0].data.chapters[0].scenes[0])); },
    f => { f.tables.novel_documents[0].data.chapters[0].scenes[0].id = 'different'; },
    f => { f.enParagraphs[0].versions.reader.content = 'unverified'; },
    f => { f.enParagraphs.push(structuredClone(f.enParagraphs[0])); },
  ]) {
    const f = fixture(); mutate(f);
    const result = await loadSceneTranslationComparison(f);
    assert.equal(result.rows[0].en_status, 'unavailable');
    assert.equal(result.rows[0].en_latest_body, null);
    assert.equal(result.rows[0].en_body, 'Synthetic EN 0.');
  }
});

test('pagination and ID batches retain complete evidence and access failures propagate without alternate data', async () => {
  const f = fixture({ count: 105 });
  const first = f.tables.revision_content_map[0];
  f.tables.revision_content_map.push(...Array.from({ length: 1001 }, () => ({ ...first })));
  const result = await loadSceneTranslationComparison(f);
  assert.equal(result.rows.length, 105);
  assert.ok(f.calls.some(call => call.table === 'revision_content_map' && call.start === 1000));
  assert.ok(f.calls.filter(call => call.table === 'revision_content_map').every(call => call.inColumn === 'paragraph_version_id'));
  assert.ok(f.calls.filter(call => call.table === 'paragraph_versions').length >= 2);
  const denied = new Error('MANAGED_SCENE_ACCESS_DENIED');
  const rejected = fixture();
  rejected.client.rpc = async () => ({ data: null, error: denied });
  await assert.rejects(loadSceneTranslationComparison(rejected), error => error.cause === denied && error.comparisonStage === '국문 구성');
  assert.equal(rejected.calls.length, 0);
});

test('read errors identify the failing stage without exposing response detail or manuscript text', async () => {
  const f = fixture(); const from = f.client.from;
  f.client.from = table => {
    const query = from(table);
    if (table === 'revision_content_map') query.then = resolve => resolve({ data: null,
      error: { code: '57014', message: 'canceling statement due to statement timeout', details: 'PRIVATE MANUSCRIPT' } });
    return query;
  };
  await assert.rejects(loadSceneTranslationComparison(f), error => {
    assert.equal(error.code, '57014');
    assert.equal(error.comparisonStage, '영문 고정 Version 소속');
    assert.match(error.message, /영문 고정 Version 소속.*조회 시간이 초과/);
    assert.doesNotMatch(error.message, /PRIVATE MANUSCRIPT/);
    return true;
  });
});
