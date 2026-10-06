import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import test from 'node:test';
import { buildSceneReviewPacket } from '../../shared/lib/novelSceneReviewPacket.js';
import { buildBilingualReviewPacket } from '../../shared/lib/novelBilingualReviewPacket.js';

if (!globalThis.crypto) globalThis.crypto = webcrypto;
const hash = value => createHash('sha256').update(value, 'utf8').digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const packetId = '74a1f823-f268-4c42-b6b7-0ef957f669a7';

async function fixture({ ko = ['첫 문장.  ', '“지금.”'], en = ['First sentence.  ', '“Mark.”'], comments = [], guidelines = [] } = {}) {
  const paragraphs = ko.map((body, index) => ({
    id: `ko-unit-${index + 1}`, unitId: `ko-unit-${index + 1}`, revisionVersionId: `ko-version-${index + 1}`,
    sourceKey: `PRO/CH01/SC01/B${String(index + 1).padStart(4, '0')}`, activeVersion: 'review',
    versions: { review: { content: body } }, separatorAfter: index === ko.length - 1 ? '' : '\n\n',
  }));
  const scene = {
    id: 'b48a4f04', managedSceneId: 'managed-scene', logicalProjectId: 'ko-project', title: '[장면 1: 합의의 건축]',
    storageModel: 'ros-ko-block-v1', compositionRevisionId: 'ko-composition', generation: 1,
    terminalLf: 0, canonicalBodySha256: hash(ko.join('\n\n')), paragraphs,
  };
  const comparison = {
    format: 'novel-translation-comparison-v1', managed_scene_id: scene.managedSceneId, scene_id: scene.id,
    source_key: 'PRO/CH01/SC01', ko_composition_id: scene.compositionRevisionId,
    ko_body_sha256: scene.canonicalBodySha256, ko_body: ko.join('\n\n'), ko_title: scene.title,
    en_document_id: 'en-document', en_document_slug: 'novel-en-act-2', en_scene_id: scene.id,
    en_title: 'Scene 1: The Architecture of Consensus', en_body: en.join('\n\n'),
    en_body_sha256: hash(en.join('\n\n')), en_terminal_lf: 0, changed_count: 0, latest_status: 'available', en_latest_structure_changed: false,
    rows: ko.map((body, index) => ({
      position: index + 1, ko_unit_id: paragraphs[index].unitId, ko_version_id: paragraphs[index].revisionVersionId,
      ko_body: body, separator_after: paragraphs[index].separatorAfter, alignment_id: `alignment-${index + 1}`,
      en_unit_id: `en-unit-${index + 1}`, en_version_id: `en-version-${index + 1}`, en_body: en[index], en_body_sha256: hash(en[index]),
      en_latest_version_id: `en-version-${index + 1}`, en_latest_body: en[index], en_latest_body_sha256: hash(en[index]), en_status: 'unchanged',
    })),
  };
  const scenePacket = await buildSceneReviewPacket({ scene, comments, guidelines, readerSlug: 'novel', exportedAt: '2026-10-06T03:00:00Z' });
  return { scene, comparison, scenePacket };
}
const build = data => buildBilingualReviewPacket({ ...data, packetId });

test('79 ordered KO/EN blocks retain exact manuscript bytes, separators, math and linked stable IDs', async () => {
  const ko = Array.from({ length: 79 }, (_, index) => [11, 33, 35, 37].includes(index + 1)
    ? `$$ \\Psi_{${index}} = R e^{iS/\\hbar} $$` : `국문 ${index + 1} 가·가·é·é 👩🏽‍💻.  `);
  const en = ko.map((_, index) => [11, 33, 35, 37].includes(index + 1)
    ? ko[index] : `English ${index + 1}. Multiple sentences may align with one Korean block.  `);
  const data = await fixture({ ko, en });
  const before = JSON.stringify(data);
  const result = await build(data);
  const parsed = JSON.parse(result.json);
  assert.equal(parsed.format, 'novel-bilingual-scene-review-packet-v1');
  assert.equal(parsed.source_packet_format, 'novel-scene-review-packet-v1');
  assert.equal(parsed.packet_id, packetId);
  assert.ok(result.markdown.includes(packetId));
  assert.equal(parsed.scene.body, ko.join('\n\n'));
  assert.equal(parsed.scene.sha256, hash(ko.join('\n\n')));
  assert.equal(parsed.scene.lf_count, 156);
  assert.equal(parsed.scene.terminal_lf, 0);
  assert.equal(parsed.comparison.en_body, en.join('\n\n'));
  assert.equal(parsed.comparison.en_stats.sha256, hash(en.join('\n\n')));
  assert.equal(parsed.comparison.en_stats.utf8_bytes, Buffer.byteLength(en.join('\n\n')));
  assert.equal(parsed.comparison.en_stats.terminal_lf, 0);
  assert.equal(parsed.comparison.blocks.length, 79);
  assert.equal(parsed.comparison.blocks.map(block => block.ko.body + block.ko.separator_after).join(''), parsed.scene.body);
  assert.equal(parsed.comparison.blocks.map(block => block.en.body + block.en.separator_after).join(''), parsed.comparison.en_body);
  assert.equal(parsed.comparison.blocks[10].alignment_id, 'alignment-11');
  assert.equal(parsed.comparison.blocks[78].en.separator_after, '');
  assert.equal(parsed.comparison.en_serialization, 'utf8-en-block-body-lf-lf-terminal0-v1');
  assert.match(result.markdown, /문장별 1:1 번역을 보장하지 않습니다/);
  assert.match(result.markdown, /과거 영문 publication의 끝 LF 1/);
  assert.equal(JSON.stringify(data), before, 'no manuscript, source Version or export is mutated');
});

test('alignment manifest is independently reconstructible from fixed order fields and actual IDs', async () => {
  const { payload } = await build(await fixture());
  const manifest = payload.comparison.alignment_manifest;
  const reconstructed = JSON.stringify([manifest.format, payload.scene.managed_scene_id, payload.scene.scene_id,
    payload.scene.composition_revision_id, payload.comparison.en_document_id, payload.comparison.en_document_slug,
    payload.comparison.en_scene_id, manifest.fields, manifest.rows]);
  assert.equal(manifest.exact_text, reconstructed);
  assert.equal(manifest.sha256, hash(reconstructed));
  assert.equal(manifest.utf8_bytes, Buffer.byteLength(reconstructed));
  assert.equal(manifest.rows[0][1], 'ko-unit-1');
  assert.equal(manifest.rows[0][2], 'ko-version-1');
  assert.equal(manifest.rows[0][7], 'en-version-1');
});

test('C/G scope, histories and example role are retained without turning work guidance into a local request', async () => {
  const comment = {
    id: 'comment-1', revision: 2, managed_scene_id: 'managed-scene', scene_id: 'b48a4f04',
    block_unit_id: 'ko-unit-1', block_version_id: 'ko-version-1', composition_id: 'ko-composition',
    body_snapshot: '첫 문장.  ', body_sha256: hash('첫 문장.  '), position: 1,
    selected_text: '첫 문장.', selection_start: 0, selection_end: 5,
    include_in_export: true, status: 'open', direction: '이 문장을 명료하게.', priority: 'required',
    history: [{ revision: 1, direction: '처음 의견' }],
  };
  const guideline = {
    ...comment, id: 'guideline-1', scope: 'work', logical_project_id: 'ko-project', direction: '이안 대사는 절제되게.',
    target_character: '이안', applies_to: 'dialogue', preservation: '물리 정보 보존',
  };
  const data = await fixture({ comments: [comment, { ...comment, id: 'held', status: 'held' }], guidelines: [guideline] });
  const { payload, markdown } = await build(data);
  const original = JSON.parse(data.scenePacket.json);
  assert.deepEqual(payload.comments, original.comments);
  assert.deepEqual(payload.guidelines, original.guidelines);
  assert.equal(payload.comment_count, 1);
  assert.equal(payload.guideline_count, 1);
  assert.equal(payload.comments[0].export_context.role, 'specific_target');
  assert.equal(payload.guidelines[0].export_context.role, 'example_not_exclusive_target');
  assert.equal(payload.guidelines[0].scope, 'work');
  assert.deepEqual(payload.comparison.blocks[0].comment_refs, ['C001']);
  assert.deepEqual(payload.comparison.blocks[0].guideline_example_refs, ['G001']);
  assert.ok(markdown.includes(data.scenePacket.markdown));
  assert.match(markdown, /G001\(예시\)/);
  assert.deepEqual(payload.comments[0].history, comment.history);
});

test('baseline EN is pinned; observed latest changed/unavailable states never replace source', async () => {
  const data = await fixture();
  Object.assign(data.comparison.rows[0], { en_latest_version_id: 'new-en-version', en_latest_body: 'Changed after translation.',
    en_latest_body_sha256: hash('Changed after translation.'), en_status: 'changed' });
  Object.assign(data.comparison.rows[1], { en_latest_version_id: null, en_latest_body: null, en_latest_body_sha256: null, en_status: 'unavailable' });
  data.comparison.changed_count = 1;
  data.comparison.latest_status = 'partial';
  const { payload, markdown } = await build(data);
  assert.equal(payload.comparison.en_body, 'First sentence.  \n\n“Mark.”');
  assert.equal(payload.comparison.blocks[0].en.version_id, 'en-version-1');
  assert.equal(payload.comparison.blocks[0].observed_latest_en.version_id, 'new-en-version');
  assert.equal(payload.comparison.blocks[1].observed_latest_en.body, null);
  assert.equal(payload.comparison.changed_count, 1);
  assert.equal(payload.comparison.unavailable_count, 1);
  assert.match(markdown, /최신 영문 관찰본/);
  assert.match(markdown, /자동 재적용 금지/);
});

test('different EN Version with identical text remains a source-version change', async () => {
  const data = await fixture();
  Object.assign(data.comparison.rows[0], { en_latest_version_id: 'new-version-same-body', en_status: 'changed' });
  data.comparison.changed_count = 1;
  const result = await build(data);
  assert.equal(result.payload.comparison.changed_count, 1);
  assert.equal(result.payload.comparison.blocks[0].en.sha256, result.payload.comparison.blocks[0].observed_latest_en.sha256);
});

test('latest EN structural change is explicit even when all mapped Version/body values are unchanged', async () => {
  const data = await fixture();
  data.comparison.en_latest_structure_changed = true;
  data.comparison.latest_status = 'changed';
  const { payload, markdown } = await build(data);
  assert.equal(payload.comparison.en_latest_structure_changed, true);
  assert.equal(payload.comparison.changed_count, 0);
  assert.equal(payload.comparison.observed_latest_status, 'changed');
  assert.ok(payload.comparison.blocks.every(block => block.observed_latest_en.status === 'unchanged'));
  assert.equal(payload.comparison.en_body, data.comparison.en_body);
  assert.match(markdown, /최신 EN의 블록 구성·순서가 기준과 다릅니다/);
  assert.match(markdown, /최신 EN Scene 전체를 재현하지 않습니다/);
});

test('stale composition, wrong Scene/title/Unit/Version/body/separator all reject with no positional fallback', async () => {
  const data = await fixture();
  const mutations = [
    comparison => { comparison.ko_composition_id = 'old-composition'; },
    comparison => { comparison.scene_id = 'other-scene'; },
    comparison => { comparison.managed_scene_id = 'other-managed'; },
    comparison => { comparison.ko_title = 'different title'; },
    comparison => { comparison.rows[0].ko_unit_id = 'other-unit'; },
    comparison => { comparison.rows[0].ko_version_id = 'other-version'; },
    comparison => { comparison.rows[0].ko_body = '후속 수정'; },
    comparison => { comparison.rows[0].separator_after = '\n'; },
    comparison => { comparison.rows[0].position = 2; },
  ];
  for (const mutate of mutations) {
    const copy = clone(data);
    mutate(copy.comparison);
    await assert.rejects(() => build(copy));
  }
});

test('unsupported or incomplete mapping cannot silently export a purported complete source Scene', async () => {
  const data = await fixture();
  const mutations = [
    comparison => { comparison.format = 'future-mapping'; },
    comparison => { comparison.rows.pop(); },
    comparison => { comparison.en_document_id = null; },
    comparison => { comparison.rows[0].alignment_id = null; },
    comparison => { comparison.rows[1].alignment_id = comparison.rows[0].alignment_id; },
    comparison => { comparison.rows[1].en_unit_id = comparison.rows[0].en_unit_id; },
    comparison => { comparison.rows[1].en_version_id = comparison.rows[0].en_version_id; },
    comparison => { comparison.rows[1].en_body = null; },
  ];
  for (const mutate of mutations) {
    const copy = clone(data);
    mutate(copy.comparison);
    await assert.rejects(() => build(copy));
  }
  const unsupported = clone(data);
  const parsed = JSON.parse(unsupported.scenePacket.json);
  parsed.format = 'unknown';
  unsupported.scenePacket.json = JSON.stringify(parsed);
  await assert.rejects(() => build(unsupported), /지원하지 않는 Scene/);
});

test('independent EN/KO, block/fullbody/hash checks reject altered text and terminal LF1', async () => {
  const data = await fixture();
  const mutations = [
    comparison => { comparison.en_body_sha256 = '0'.repeat(64); },
    comparison => { comparison.rows[0].en_body_sha256 = '0'.repeat(64); },
    comparison => { comparison.rows[0].en_body += ' '; },
    comparison => { comparison.ko_body_sha256 = '0'.repeat(64); },
    comparison => { comparison.ko_body += '\n'; },
    comparison => { comparison.en_body += '\n'; comparison.en_body_sha256 = hash(comparison.en_body); comparison.en_terminal_lf = 1; },
    comparison => { comparison.rows[0].en_latest_body_sha256 = '0'.repeat(64); },
    comparison => { comparison.changed_count = 1; },
    comparison => { comparison.rows[0].en_status = 'changed'; comparison.changed_count = 1; },
  ];
  for (const mutate of mutations) {
    const copy = clone(data);
    mutate(copy.comparison);
    await assert.rejects(() => build(copy));
  }
});

test('Markdown wrappers preserve HTML/backticks as quoted manuscript data, not executable markup', async () => {
  const english = '<script>alert("x")</script>\n``````\n# manuscript heading';
  const data = await fixture({ ko: ['국문'], en: [english] });
  data.comparison.en_title = '<img src=x onerror=alert(1)>\n# title';
  const { payload, markdown } = await build(data);
  assert.equal(payload.comparison.en_body, english);
  assert.ok(markdown.includes('```````text\n' + english + '\n```````'));
  assert.ok(markdown.includes('\\<img src=x onerror=alert(1)\\> \\# title'));
  assert.ok(!markdown.includes('\n# title'));
});

test('history read-only state and stale comment snapshot are not rewritten by bilingual export', async () => {
  const old = {
    id: 'old-comment', managed_scene_id: 'managed-scene', scene_id: 'b48a4f04', include_in_export: true, status: 'open',
    block_unit_id: 'ko-unit-1', block_version_id: 'old-ko-version', body_snapshot: '옛 문장', body_sha256: hash('옛 문장'),
    direction: '예전 의견',
  };
  const data = await fixture({ comments: [old] });
  const original = JSON.parse(data.scenePacket.json);
  original.scene.read_only_history = true;
  original.scene.review_composition_id = 'newer-review';
  data.scenePacket.json = JSON.stringify(original);
  const { payload } = await build(data);
  assert.equal(payload.scene.read_only_history, true);
  assert.equal(payload.scene.review_composition_id, 'newer-review');
  assert.equal(payload.comments[0].body_snapshot, '옛 문장');
  assert.equal(payload.comments[0].export_context.state, 'changed');
  assert.equal(payload.comparison.blocks[0].ko.body, '첫 문장.  ');
});
