import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import test from 'node:test';
import { buildSceneReviewPacket } from '../../shared/lib/novelSceneReviewPacket.js';

if (!globalThis.crypto) globalThis.crypto = webcrypto;
const hash = text => createHash('sha256').update(text, 'utf8').digest('hex');
const exportedAt = '2026-10-05T12:00:00.000Z';
function sceneOf(bodies = ['첫 문장.', '중간 문장.', '“지금.”'], separators) {
  const paragraphs = bodies.map((body, index) => ({
    id: `paragraph-${index + 1}`, unitId: `unit-${index + 1}`, revisionVersionId: `version-${index + 1}`,
    sourceKey: `PRO/CH01/SC01/B${String(index + 1).padStart(4, '0')}`, activeVersion: 'review',
    versions: { review: { content: body } }, separatorAfter: separators?.[index] ?? (index === bodies.length - 1 ? '' : '\n\n'),
  }));
  const body = paragraphs.map(p => p.versions.review.content + p.separatorAfter).join('');
  return {
    id: 'scene-1', managedSceneId: 'managed-1', projectId: 'ko-project', title: '[장면 1: 합의의 건축]',
    storageModel: 'ros-ko-block-v1', compositionRevisionId: 'composition-1', generation: 1,
    terminalLf: 0, canonicalBodySha256: hash(body), paragraphs,
  };
}
function comment(scene, overrides = {}) {
  const p = scene.paragraphs[0];
  const body = p.versions.review.content;
  return {
    id: 'comment-1', revision: 1, scene_id: scene.id, managed_scene_id: scene.managedSceneId,
    block_unit_id: p.unitId, block_version_id: p.revisionVersionId, composition_id: scene.compositionRevisionId,
    source_key: 'PRO/CH01/SC01', position: 1, body_snapshot: body, body_sha256: hash(body),
    selected_text: '', selection_start: null, selection_end: null,
    kind: 'style', direction: '이 부분은 길게 써주세요.', proposal: '', status: 'open', priority: 'required', include_in_export: true,
    created_at: '2026-10-05T10:00:00Z', ...overrides,
  };
}
const packet = (scene, rest = {}) => buildSceneReviewPacket({ scene, readerSlug: 'novel', exportedAt, ...rest });

test('full Scene contains every one of 79 blocks including uncommented blocks with exact canonical bytes', async () => {
  const bodies = Array.from({ length: 79 }, (_, i) => [11, 33, 35, 37].includes(i + 1)
    ? `$$ V_{\\epsilon}(r) = \\frac{1}{r^2+\\epsilon^2} + ${i} $$` : `${i + 1} 가·가·é·é 👩🏽‍💻 문장.  `);
  const scene = sceneOf(bodies);
  const original = JSON.stringify(scene);
  const result = await packet(scene, { comments: [comment(scene)] });
  const parsed = JSON.parse(result.json);
  assert.equal(parsed.scene.block_count, 79);
  assert.equal(result.blockCount, 79);
  assert.equal(parsed.scene.body, bodies.join('\n\n'));
  assert.equal(parsed.scene.utf8_bytes, Buffer.byteLength(bodies.join('\n\n')));
  assert.equal(parsed.scene.lf_count, 156);
  assert.equal(parsed.scene.terminal_lf, 0);
  assert.equal(parsed.scene.sha256, hash(bodies.join('\n\n')));
  assert.equal(parsed.scene.blocks.map(b => b.body + b.separator_after).join(''), parsed.scene.body);
  assert.deepEqual(parsed.scene.blocks[0].comment_refs, ['C001']);
  assert.deepEqual(parsed.scene.blocks[78].comment_refs, []);
  assert.match(result.markdown, /### B0079/);
  assert.ok(result.markdown.includes(bodies[50]));
  assert.equal(JSON.stringify(scene), original);
});

test('scope, example and exact target remain distinct; conflicting guidance is preserved for human resolution', async () => {
  const scene = sceneOf();
  const local = comment(scene);
  const broad = {
    ...comment(scene, { id: 'guideline-1' }), scope: 'work', project_id: 'ko-project',
    target_character: '이안', applies_to: 'dialogue', direction: '이안 대사는 전반적으로 짧게 써주세요.',
    preservation: '과학적 정보는 보존합니다.',
  };
  const sceneGuide = { id: 'guideline-2', scope: 'scene', scene_id: scene.id, direction: '긴장감을 높입니다.', include_in_export: true, status: 'open' };
  const result = await packet(scene, { comments: [local], guidelines: [broad, sceneGuide] });
  const saved = JSON.parse(result.json);
  assert.equal(result.count, 3);
  assert.equal(saved.comments[0].direction, local.direction);
  assert.equal(saved.guidelines[0].direction, broad.direction);
  assert.equal(saved.guidelines[0].export_context.role, 'example_not_exclusive_target');
  assert.equal(saved.comments[0].export_context.role, 'specific_target');
  assert.deepEqual(saved.scene.blocks[0].guideline_example_refs, ['G001']);
  assert.equal(saved.guidelines[1].export_context.state, 'no_example');
  assert.match(result.markdown, /G001\(예시\)/);
  assert.match(result.markdown, /우선순위는 자동 결정하지 않습니다/);
  assert.ok(result.markdown.includes(broad.preservation));
});

test('selected repeated quotation is fixed to saved Unicode offsets, not substring search', async () => {
  const scene = sceneOf(['😀 같은 말. 같은 말.']);
  const row = comment(scene, { selected_text: '같은 말.', selection_start: 8, selection_end: 13 });
  const parsed = JSON.parse((await packet(scene, { comments: [row] })).json);
  assert.equal(parsed.comments[0].selection_start, 8);
  assert.equal(parsed.comments[0].selection_end, 13);
  assert.equal(parsed.comments[0].export_context.saved_quote_valid, true);
  assert.equal(parsed.comments[0].export_context.state, 'unchanged');
  const invalid = JSON.parse((await packet(scene, { comments: [{ ...row, selection_start: 1, selection_end: 6 }] })).json);
  assert.equal(invalid.comments[0].export_context.saved_quote_valid, false);
  assert.ok(invalid.comments[0].export_context.reasons.includes('saved_quote_offsets_invalid'));
});

test('stale/missing anchors preserve original snapshots and never relocate to a duplicate string', async () => {
  const scene = sceneOf(['같은 문장', '같은 문장']);
  const rows = [comment(scene, { id: 'stale', block_version_id: 'old-version', body_snapshot: '이전 문장', body_sha256: hash('이전 문장') }),
    comment(scene, { id: 'missing', block_unit_id: 'deleted-unit', position: 2 })];
  const saved = JSON.parse((await packet(scene, { comments: rows })).json);
  const stale = saved.comments.find(r => r.id === 'stale');
  const missing = saved.comments.find(r => r.id === 'missing');
  assert.equal(stale.body_snapshot, '이전 문장');
  assert.equal(stale.export_context.state, 'changed');
  assert.equal(stale.export_context.current_block_label, 'B0001');
  assert.equal(missing.export_context.state, 'missing');
  assert.equal(missing.export_context.current_block_label, null);
  assert.deepEqual(saved.scene.blocks[1].comment_refs, []);
});

test('work guideline from another Scene keeps external example with no invented local link', async () => {
  const scene = sceneOf();
  const guideline = { ...comment(scene), id: 'external', scope: 'work', scene_id: 'other-scene', managed_scene_id: 'other-managed', source_key: 'A1/CH01/SC02' };
  const saved = JSON.parse((await packet(scene, { guidelines: [guideline] })).json);
  assert.equal(saved.guidelines.length, 1);
  assert.equal(saved.guidelines[0].body_snapshot, guideline.body_snapshot);
  assert.equal(saved.guidelines[0].export_context.state, 'external');
  assert.equal(saved.guidelines[0].export_context.current_scene_link, null);
  assert.deepEqual(saved.scene.blocks[0].guideline_example_refs, []);
});

test('filters selections, statuses, other Scene directives and mismatched project; preserves eligible history fields', async () => {
  const scene = sceneOf();
  const statuses = ['resolved', 'withdrawn', 'held', 'on_hold', 'deferred'];
  const comments = [comment(scene), comment(scene, { id: 'other', scene_id: 'other' }),
    comment(scene, { id: 'unchecked', include_in_export: false }), comment(scene, { id: 'truthy', include_in_export: 'true' }),
    ...statuses.map(status => comment(scene, { id: status, status }))];
  const history = [{ revision: 1, direction: 'old' }];
  const guidelines = [{ id: 'yes', revision: 2, scope: 'scene', managed_scene_id: scene.managedSceneId, include_in_export: true, history },
    { id: 'other-scene', scope: 'scene', scene_id: 'other', include_in_export: true },
    { id: 'other-project', scope: 'work', project_id: 'foreign', include_in_export: true }];
  const parsed = JSON.parse((await packet(scene, { comments, guidelines })).json);
  assert.equal(parsed.comments.length, 1);
  assert.equal(parsed.guidelines.length, 1);
  assert.deepEqual(parsed.guidelines[0].history, history);
});

test('Markdown wrappers cannot be escaped by manuscript or instructions; JSON raw strings unchanged', async () => {
  const body = '  본문\n``````\n# 본문 속 표제\n\\Psi_{x} “지금.”  ';
  const scene = sceneOf([body]);
  const direction = '```\n지시\n`````';
  const result = await packet(scene, { comments: [comment(scene, { direction })] });
  assert.ok(result.markdown.includes('```````text\n' + body + '\n```````'));
  assert.ok(result.markdown.includes('``````text\n' + direction + '\n``````'));
  assert.equal(JSON.parse(result.json).scene.body, body);
  assert.equal(JSON.parse(result.json).comments[0].direction, direction);
});

test('empty Scene and unchanged composition-vs-block distinction are explicit', async () => {
  const empty = await packet(sceneOf([]));
  assert.equal(JSON.parse(empty.json).scene.body, '');
  assert.equal(JSON.parse(empty.json).scene.sha256, hash(''));
  const scene = sceneOf();
  const row = comment(scene, { composition_id: 'old-composition' });
  const saved = JSON.parse((await packet(scene, { comments: [row] })).json).comments[0];
  assert.equal(saved.export_context.composition_changed, true);
  assert.equal(saved.export_context.state, 'unchanged');
  assert.equal(saved.export_context.requires_recheck, false);
});

test('unanchored directives use expected composition and server flags without cross-Scene comparisons', async () => {
  const scene = sceneOf();
  const base = { scope: 'scene', managed_scene_id: scene.managedSceneId, include_in_export: true, status: 'open', direction: '검토' };
  const guidelines = [
    { ...base, id: 'local-expected', expected_composition_id: 'old-composition' },
    { ...base, id: 'local-server', composition_changed: true },
    { ...base, id: 'external-expected', scope: 'work', managed_scene_id: 'other-scene', expected_composition_id: 'other-composition' },
    { ...base, id: 'external-server', scope: 'work', managed_scene_id: 'other-scene', expected_composition_id: 'other-composition', composition_changed: true },
  ];
  const result = await packet(scene, { guidelines });
  const saved = JSON.parse(result.json).guidelines;
  const get = id => saved.find(row => row.id === id).export_context;
  assert.equal(get('local-expected').state, 'no_example');
  assert.equal(get('local-expected').composition_changed, true);
  assert.equal(get('local-expected').composition_comparison, 'export_scene');
  assert.equal(get('local-server').composition_changed, true);
  assert.equal(get('external-expected').composition_changed, false);
  assert.equal(get('external-expected').composition_comparison, 'not_compared_external_source');
  assert.equal(get('external-server').composition_changed, true);
  assert.equal(get('external-server').composition_comparison, 'server_source_scene');
  assert.match(result.markdown, /별도로 내려받는 JSON/);
  assert.doesNotMatch(result.markdown, /동봉 JSON/);
});

test('fails closed on missing active source/separator, duplicate IDs, changed canonical hash and terminal contract', async () => {
  const missing = sceneOf(); delete missing.paragraphs[0].separatorAfter;
  await assert.rejects(packet(missing), /계약이 불완전/);
  const active = sceneOf(); active.paragraphs[0].activeVersion = 'not-found';
  await assert.rejects(packet(active), /계약이 불완전/);
  const duplicate = sceneOf(); duplicate.paragraphs[1].unitId = duplicate.paragraphs[0].unitId;
  await assert.rejects(packet(duplicate), /계약이 불완전/);
  await assert.rejects(packet({ ...sceneOf(), canonicalBodySha256: 'bad' }), /지문/);
  await assert.rejects(packet({ ...sceneOf(), terminalLf: 1 }), /끝 개행/);
});

test('fixed inputs yield byte-identical files and never mutate inputs', async () => {
  const scene = sceneOf();
  const comments = [comment(scene)];
  const guidelines = [{ scope: 'scene', id: 'guide', include_in_export: true, status: 'open', direction: '검토' }];
  const before = JSON.stringify({ scene, comments, guidelines });
  const first = await packet(scene, { comments, guidelines });
  const second = await packet(scene, { comments, guidelines });
  assert.equal(first.json, second.json);
  assert.equal(first.markdown, second.markdown);
  assert.equal(JSON.stringify({ scene, comments, guidelines }), before);
  assert.equal(first.baseFilename, 'scene-1-scene-review-2026-10-05');
});
