const encoder = new TextEncoder();
const excludedStatuses = new Set(['resolved', 'withdrawn', 'held', 'on_hold', 'deferred']);
const labels = {
  all: '전체', dialogue: '대사', narration: '서술', inner_voice: '내면 독백',
  required: '필수', suggested: '권장', question: '질문',
  open: '검토 중', sent: '편집 요청 전달', review: '재검토 필요',
};

const textCompare = (a, b) => String(a ?? '') < String(b ?? '') ? -1 : String(a ?? '') > String(b ?? '') ? 1 : 0;
const eligible = row => row?.include_in_export === true && !excludedStatuses.has(row.status);
const safeLabel = value => String(value ?? '미기록').replace(/[\r\n\u2028\u2029]+/g, ' ').replace(/[\\`*_{}[\]<>#|]/g, '\\$&');
const safeFilename = value => String(value || 'scene').replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/^[-.]+|[-.]+$/g, '').slice(0, 100) || 'scene';
const fence = value => {
  const body = String(value ?? '');
  const delimiter = '`'.repeat(Math.max(3, ...((body.match(/`+/g) || []).map(run => run.length + 1))));
  return `${delimiter}text\n${body}${body.endsWith('\n') ? '' : '\n'}${delimiter}`;
};
const sha256 = async value => Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(value))))
  .map(byte => byte.toString(16).padStart(2, '0')).join('');
const stats = async body => ({
  utf8_bytes: encoder.encode(body).length,
  lf_count: (body.match(/\n/g) || []).length,
  terminal_lf: (body.match(/\n*$/)?.[0] || '').length,
  sha256: await sha256(body),
});
const ordered = rows => rows.slice().sort((a, b) => (Number(a.position) || Number.MAX_SAFE_INTEGER)
  - (Number(b.position) || Number.MAX_SAFE_INTEGER) || textCompare(a.created_at, b.created_at) || textCompare(a.id, b.id));

function sameScene(row, scene) {
  return (!row.managed_scene_id || row.managed_scene_id === scene.managedSceneId)
    && (!row.scene_id || row.scene_id === scene.id);
}

function anchorFields(row, isGuideline) {
  const prefix = isGuideline && (row.example_block_unit_id || row.example_body_snapshot != null) ? 'example_' : '';
  const read = key => row[`${prefix}${key}`] ?? null;
  return {
    block_unit_id: read('block_unit_id'), block_version_id: read('block_version_id'),
    composition_id: read('composition_id'), body_snapshot: read('body_snapshot'), body_sha256: read('body_sha256'),
    selected_text: read('selected_text'), selection_start: read('selection_start'), selection_end: read('selection_end'),
    scene_id: read('scene_id'), managed_scene_id: read('managed_scene_id'), source_key: read('source_key'),
  };
}

async function locateAnchor(row, scene, blocks, isGuideline) {
  const anchor = anchorFields(row, isGuideline);
  const reasons = [];
  const sourceDiffers = (anchor.scene_id && anchor.scene_id !== scene.id)
    || (anchor.managed_scene_id && anchor.managed_scene_id !== scene.managedSceneId);
  const current = sourceDiffers ? null : blocks.find(block => block.block_unit_id === anchor.block_unit_id);
  const referenceComposition = anchor.composition_id || (isGuideline ? row.expected_composition_id : null);
  // A global directive may originate in another Scene. Its saved composition
  // cannot be compared to this export's composition, even without an example.
  const localCompositionChanged = Boolean(!sourceDiffers && referenceComposition && scene.compositionRevisionId
    && referenceComposition !== scene.compositionRevisionId);
  const compositionChanged = row.composition_changed === true || localCompositionChanged;
  let savedQuoteValid = null;
  if (anchor.selected_text) {
    savedQuoteValid = typeof anchor.body_snapshot === 'string'
      && Number.isInteger(anchor.selection_start) && Number.isInteger(anchor.selection_end)
      && anchor.selection_start >= 0 && anchor.selection_end > anchor.selection_start
      && anchor.selection_end <= Array.from(anchor.body_snapshot).length
      && Array.from(anchor.body_snapshot).slice(anchor.selection_start, anchor.selection_end).join('') === anchor.selected_text;
    if (!savedQuoteValid) reasons.push('saved_quote_offsets_invalid');
  }
  if (anchor.body_sha256 && typeof anchor.body_snapshot === 'string'
    && await sha256(anchor.body_snapshot) !== anchor.body_sha256) reasons.push('saved_snapshot_hash_mismatch');
  if (current && anchor.block_version_id && current.block_version_id !== anchor.block_version_id) reasons.push('block_version_changed');
  if (current && typeof anchor.body_snapshot === 'string' && current.body !== anchor.body_snapshot) reasons.push('block_body_changed');
  if (current && anchor.body_sha256 && current.sha256 !== anchor.body_sha256) reasons.push('block_hash_changed');
  if (row.is_stale === true) reasons.push('server_marked_stale');
  const noAnchor = !anchor.block_unit_id;
  const state = noAnchor ? (isGuideline ? 'no_example' : 'missing')
    : sourceDiffers ? 'external' : !current ? 'missing' : reasons.length ? 'changed' : 'unchanged';
  return {
    role: isGuideline ? 'example_not_exclusive_target' : 'specific_target',
    state,
    requires_recheck: state === 'changed' || state === 'missing' || reasons.length > 0,
    reasons,
    composition_changed: compositionChanged,
    composition_comparison: sourceDiffers
      ? typeof row.composition_changed === 'boolean' ? 'server_source_scene' : 'not_compared_external_source'
      : referenceComposition && scene.compositionRevisionId ? 'export_scene'
        : typeof row.composition_changed === 'boolean' ? 'server_source_scene' : 'unavailable',
    current_block_label: current?.label ?? null,
    current_block_version_id: current?.block_version_id ?? null,
    current_position: current?.position ?? null,
    position_changed: Boolean(current && row.position != null && current.position !== row.position),
    current_scene_link: current ? `#scene-${scene.id}` : null,
    saved_quote_valid: savedQuoteValid,
    quote_coordinate_system: 'unicode-code-points; zero-based; end-exclusive',
    source: anchor,
  };
}

function recordMarkdown(row, guideline = false) {
  const context = row.export_context;
  const source = context.source;
  const stateLabels = {
    unchanged: '현재 기준과 일치', changed: '현재 본문/버전과 차이 — 재확인 필요',
    missing: '현재 Scene에서 대상 미발견 — 재확인 필요',
    external: '다른 Scene의 예시 — 이 Scene 위치로 연결하지 않음', no_example: '특정 예시 없음',
  };
  const lines = [
    `### ${row.export_ref} — ${guideline ? row.scope === 'work' ? '작품 공통 지침' : 'Scene 지침' : '위치별 코멘트'}`, '',
    `- 기록 ID / 리비전: ${safeLabel(row.id)} / ${safeLabel(row.revision)}`,
    `- 상태 / 우선순위: ${safeLabel(labels[row.status] || row.status)} / ${safeLabel(labels[row.priority] || row.priority)}`,
    `- 작성 / 수정: ${safeLabel(row.created_at)} / ${safeLabel(row.updated_at)}`,
  ];
  if (guideline) lines.push(
    `- 적용 범위: ${row.scope === 'work' ? '작품 공통 — 이번 파일은 현재 Scene만 수록' : '현재 Scene'}`,
    `- 대상 인물: ${safeLabel(row.target_character || '특정 인물 지정 없음')}`,
    `- 적용 내용: ${safeLabel(labels[row.applies_to] || row.applies_to || '전체')}`,
    '- 연결 문장 역할: 예시 — 이 문장만 수정하라는 뜻이 아님',
  );
  else lines.push(`- 적용 범위: ${source.selected_text ? '선택 문장' : '해당 블록 전체'}만 수정`);
  lines.push(
    `- 대상/예시 상태: ${stateLabels[context.state]}`,
    `- 현재 본문 위치: ${safeLabel(context.current_block_label || '없음')}`,
    `- 원문 위치 / Scene: ${safeLabel(source.source_key || row.source_key)} / ${safeLabel(source.scene_id || source.managed_scene_id)}`,
    `- 기준 Unit / Version: ${safeLabel(source.block_unit_id)} / ${safeLabel(source.block_version_id)}`,
    `- 기준 구성 / 본문 SHA-256: ${safeLabel(source.composition_id)} / ${safeLabel(source.body_sha256)}`,
    `- 작성 후 구성 변경: ${context.composition_changed ? '있음 — 다른 블록 수정일 수 있음' : '변경 확인 없음'}`,
  );
  if (context.reasons.length) lines.push(`- 재확인 사유: ${context.reasons.map(safeLabel).join(', ')}`);
  if (source.body_snapshot != null) lines.push('', `#### 작성 당시 ${guideline ? '예시' : '대상'} 블록 전문`, '', fence(source.body_snapshot));
  if (source.selected_text) lines.push(
    '', `#### 정확한 ${guideline ? '예시' : '대상'} 문장`, '', fence(source.selected_text), '',
    `문자 위치: [${safeLabel(source.selection_start)}, ${safeLabel(source.selection_end)}) — Unicode code point, 0부터 시작. 같은 문구를 검색해서 다른 위치로 옮기지 않습니다.`,
  );
  lines.push('', '#### 수정 방향', '', fence(row.direction));
  if (guideline) lines.push('', '#### 보존 조건', '', row.preservation ? fence(row.preservation) : '별도 조건 미기록');
  lines.push('', '#### 제안 문안', '', row.proposal ? fence(row.proposal) : '제안 문안 없음 — 수정 방향을 검토합니다.');
  return lines;
}

/**
 * Creates an evidence-backed editorial packet without touching manuscript or
 * comment state. The caller supplies the current Scene and same-project rows.
 * Snapshot scope is explicit: a work guideline does not prove cross-Scene review.
 * Markers exist only in the review presentation, never canonical body strings.
 */
export async function buildSceneReviewPacket({ scene, comments = [], guidelines = [], readerSlug = '', exportedAt = new Date().toISOString() }) {
  if (!scene?.id || !Array.isArray(scene.paragraphs)) throw new Error('Scene 전문과 식별값이 필요합니다.');
  if (scene.storageModel !== 'ros-ko-block-v1') throw new Error('검토 패키지는 명시적 블록 직렬화 계약이 있는 Scene만 지원합니다.');
  const seenUnits = new Set();
  const blocks = await Promise.all(scene.paragraphs.map(async (paragraph, index) => {
    const version = paragraph.versions?.[paragraph.activeVersion];
    if (!paragraph.unitId || seenUnits.has(paragraph.unitId) || !paragraph.revisionVersionId
      || typeof version?.content !== 'string' || typeof paragraph.separatorAfter !== 'string') {
      throw new Error(`B${String(index + 1).padStart(4, '0')}의 고유 ID·활성 본문·구분자 계약이 불완전합니다.`);
    }
    seenUnits.add(paragraph.unitId);
    return {
      label: `B${String(index + 1).padStart(4, '0')}`, position: index + 1,
      paragraph_id: paragraph.id, block_unit_id: paragraph.unitId,
      block_version_id: paragraph.revisionVersionId, active_version: paragraph.activeVersion,
      source_key: paragraph.sourceKey ?? null, body: version.content,
      separator_after: paragraph.separatorAfter, ...await stats(version.content),
      comment_refs: [], guideline_example_refs: [],
    };
  }));
  const body = blocks.map(block => block.body + block.separator_after).join('');
  const bodyStats = await stats(body);
  if (scene.canonicalBodySha256 && scene.canonicalBodySha256 !== bodyStats.sha256) throw new Error('Scene 전문 지문이 현재 구성의 기대값과 다릅니다. 새로고침 후 확인하세요.');
  if (scene.terminalLf != null && scene.terminalLf !== bodyStats.terminal_lf) throw new Error('Scene 끝 개행 계약이 다릅니다.');
  const selectedComments = ordered(comments.filter(row => eligible(row) && sameScene(row, scene)));
  const logicalProjectId = scene.logicalProjectId ?? scene.projectId ?? null;
  const selectedGuidelines = guidelines.filter(row => eligible(row) && ['scene', 'work'].includes(row.scope)
    && (row.scope === 'work' || sameScene(row, scene))
    && (!(row.logical_project_id || row.project_id) || !logicalProjectId
      || (row.logical_project_id || row.project_id) === logicalProjectId))
    .slice().sort((a, b) => (a.scope === 'work' ? 0 : 1) - (b.scope === 'work' ? 0 : 1)
      || textCompare(a.created_at, b.created_at) || textCompare(a.id, b.id));
  const hydrate = async (row, index, guideline) => ({
    ...row,
    export_ref: `${guideline ? 'G' : 'C'}${String(index + 1).padStart(3, '0')}`,
    export_context: await locateAnchor(row, scene, blocks, guideline),
  });
  const exportedComments = await Promise.all(selectedComments.map((row, index) => hydrate(row, index, false)));
  const exportedGuidelines = await Promise.all(selectedGuidelines.map((row, index) => hydrate(row, index, true)));
  for (const row of [...exportedComments, ...exportedGuidelines]) {
    const block = blocks.find(candidate => candidate.label === row.export_context.current_block_label);
    if (block) (row.export_ref.startsWith('G') ? block.guideline_example_refs : block.comment_refs).push(row.export_ref);
  }
  const warnings = [
    '공통 지침·Scene 지침·위치별 코멘트 사이의 우선순위는 자동 결정하지 않습니다. 충돌하면 reviewer가 확인 사항으로 남깁니다.',
    '작품 공통 지침을 포함해도 다른 Scene의 원문 검토·수정 완료를 뜻하지 않습니다.',
    '본문 위치 표시는 검토용입니다. 제안 문안·코멘트·표시 번호는 저장된 소설 본문에 포함되지 않습니다.',
    '변경되었거나 사라진 대상은 저장 당시 원문과 현재 전문을 대조해야 합니다. 인용문 검색으로 자동 재연결하지 않습니다.',
  ];
  const payload = {
    format: 'novel-scene-review-packet-v1', exported_at: exportedAt, reader_slug: readerSlug,
    scene: {
      scene_id: scene.id, managed_scene_id: scene.managedSceneId ?? null,
      logical_project_id: logicalProjectId, title: scene.title ?? null,
      composition_revision_id: scene.compositionRevisionId ?? null,
      review_composition_id: scene.managedReviewCompositionId ?? scene.compositionRevisionId ?? null,
      generation: scene.generation ?? null, read_only_history: scene.managedReadOnly === true,
      serialization: 'utf8-block-body-plus-exact-separator-v1', body, ...bodyStats,
      block_count: blocks.length, blocks,
    },
    comment_count: exportedComments.length, guideline_count: exportedGuidelines.length,
    comments: exportedComments, guidelines: exportedGuidelines, warnings,
  };
  const lines = [
    `# ${safeLabel(scene.title || scene.id)} — Scene 검토 패키지`, '',
    `- Reader / Scene: ${safeLabel(readerSlug)} / ${safeLabel(scene.id)}`,
    `- 구성 / generation: ${safeLabel(scene.compositionRevisionId)} / ${safeLabel(scene.generation)}`,
    `- 내보낸 시각: ${safeLabel(exportedAt)}`,
    `- 본문: ${blocks.length}블록 / ${bodyStats.utf8_bytes} UTF-8 bytes / LF ${bodyStats.lf_count} / 끝 LF ${bodyStats.terminal_lf}`,
    `- 본문 SHA-256: ${bodyStats.sha256}`,
    `- 지침 ${exportedGuidelines.length}개 / 위치별 코멘트 ${exportedComments.length}개`, '',
    '## 검토 원칙', '', ...warnings.map(warning => `- ${warning}`), '',
    '## 1. 작품 공통 지침', '',
  ];
  const work = exportedGuidelines.filter(row => row.scope === 'work');
  const local = exportedGuidelines.filter(row => row.scope === 'scene');
  if (!work.length) lines.push('선택된 작품 공통 지침 없음');
  work.forEach(row => lines.push(...recordMarkdown(row, true), ''));
  lines.push('', '## 2. 이번 Scene의 수정 지침', '');
  if (!local.length) lines.push('선택된 Scene 지침 없음');
  local.forEach(row => lines.push(...recordMarkdown(row, true), ''));
  lines.push('', '## 3. Scene 전체 본문', '',
    '모든 블록을 순서대로 수록합니다. C는 해당 위치 수정 요청, G는 범위 지침의 예시입니다. 구분자와 정확한 원바이트 전문은 별도로 내려받는 JSON의 scene.body 및 blocks에서 확인합니다.');
  blocks.forEach(block => lines.push('', `### ${block.label}${block.comment_refs.length ? ` / ${block.comment_refs.join(', ')}` : ''}${block.guideline_example_refs.length ? ` / ${block.guideline_example_refs.map(ref => `${ref}(예시)`).join(', ')}` : ''}`, '',
    `Unit: ${safeLabel(block.block_unit_id)} · Version: ${safeLabel(block.block_version_id)} · 뒤 구분자: ${safeLabel(JSON.stringify(block.separator_after))}`, '', fence(block.body)));
  lines.push('', '## 4. 위치별 수정 요청', '');
  if (!exportedComments.length) lines.push('선택된 위치별 코멘트 없음');
  exportedComments.forEach(row => lines.push(...recordMarkdown(row), ''));
  return {
    markdown: `${lines.join('\n')}\n`, json: `${JSON.stringify(payload, null, 2)}\n`,
    baseFilename: `${safeFilename(scene.id)}-scene-review-${safeFilename(String(exportedAt).slice(0, 10))}`,
    count: exportedComments.length + exportedGuidelines.length,
    commentCount: exportedComments.length, guidelineCount: exportedGuidelines.length,
    blockCount: blocks.length, bodySha256: bodyStats.sha256,
  };
}
