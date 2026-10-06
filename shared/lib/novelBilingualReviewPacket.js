const encoder = new TextEncoder();
const comparisonFormat = 'novel-translation-comparison-v1';
const packetFormat = 'novel-bilingual-scene-review-packet-v1';
const alignmentFormat = 'json-utf8-fixed-order-alignment-v1';
const alignmentFields = [
  'position', 'ko_unit_id', 'ko_version_id', 'ko_body_sha256', 'ko_separator_after',
  'alignment_id', 'en_unit_id', 'en_version_id', 'en_body_sha256', 'en_separator_after',
];

const sha256 = async text => Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(text))))
  .map(byte => byte.toString(16).padStart(2, '0')).join('');
const stats = async text => ({
  utf8_bytes: encoder.encode(text).length,
  lf_count: (text.match(/\n/g) || []).length,
  terminal_lf: (text.match(/\n*$/)?.[0] || '').length,
  sha256: await sha256(text),
});
const safeLabel = value => String(value ?? '미제공').replace(/[\r\n\u2028\u2029]+/g, ' ').replace(/[\\`*_{}[\]<>#|]/g, '\\$&');
const fence = value => {
  const delimiter = '`'.repeat(Math.max(3, ...((value.match(/`+/g) || []).map(run => run.length + 1))));
  return `${delimiter}text\n${value}${value.endsWith('\n') ? '' : '\n'}${delimiter}`;
};
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
const hasId = value => typeof value === 'string' && value.length > 0;

/**
 * Read-only export wrapper. The supplied Scene packet is produced by
 * buildSceneReviewPacket, retaining its current C/G scope, history and filters.
 * Alignment is never inferred from position, matching prose or punctuation.
 * V1 supports complete ordered 1:1 block alignment, not sentence equivalence.
 */
export async function buildBilingualReviewPacket({ scenePacket, comparison, packetId = globalThis.crypto.randomUUID() }) {
  requireValue(hasId(packetId), '영한 검토 패키지 ID가 필요합니다.');
  requireValue(typeof scenePacket?.json === 'string' && typeof scenePacket?.markdown === 'string', '검증된 Scene 검토 패키지가 필요합니다.');
  const original = JSON.parse(scenePacket.json);
  requireValue(original.format === 'novel-scene-review-packet-v1', '지원하지 않는 Scene 검토 패키지 규격입니다.');
  requireValue(comparison?.format === comparisonFormat, '지원하지 않는 영한 대응 규격입니다.');
  const scene = original.scene;
  requireValue(scene && Array.isArray(scene.blocks) && scene.blocks.length > 0, '빈 Scene 또는 블록이 없는 Scene은 영한 대응 내보내기를 지원하지 않습니다.');
  requireValue(hasId(scene.managed_scene_id) && scene.managed_scene_id === comparison.managed_scene_id
    && hasId(scene.scene_id) && scene.scene_id === comparison.scene_id
    && hasId(scene.composition_revision_id) && scene.composition_revision_id === comparison.ko_composition_id,
  '국문 Scene 또는 구성 리비전이 달라졌습니다. 같은 구성을 새로 조회해 주세요.');
  requireValue(scene.title === comparison.ko_title, '국문 표제의 조회 기준이 다릅니다.');
  requireValue(hasId(comparison.source_key) && hasId(comparison.en_document_id) && hasId(comparison.en_document_slug)
    && hasId(comparison.en_scene_id), '영문 원문의 문서·Scene·대응 출처가 불완전합니다.');
  requireValue(typeof comparison.ko_body === 'string' && typeof comparison.en_body === 'string', '영한 전문이 필요합니다.');
  requireValue(Array.isArray(comparison.rows) && comparison.rows.length === scene.blocks.length
    && original.scene.block_count === scene.blocks.length, '영한 블록 대응 개수가 다릅니다. 일부 대응만으로 전문을 만들지 않습니다.');
  requireValue(Array.isArray(original.comments) && Array.isArray(original.guidelines)
    && original.comment_count === original.comments.length && original.guideline_count === original.guidelines.length,
  'Scene 지침·코멘트 포함 개수가 일치하지 않습니다.');

  const seen = { koUnit: new Set(), koVersion: new Set(), alignment: new Set(), enUnit: new Set(), enVersion: new Set() };
  const pairedBlocks = [];
  let changedCount = 0;
  for (let index = 0; index < comparison.rows.length; index += 1) {
    const row = comparison.rows[index];
    const block = scene.blocks[index];
    const label = `B${String(index + 1).padStart(4, '0')}`;
    requireValue(row?.position === index + 1 && block?.position === index + 1 && block.label === label,
      `${label}의 순서 또는 위치가 다릅니다.`);
    requireValue(row.ko_unit_id === block.block_unit_id && row.ko_version_id === block.block_version_id
      && typeof row.ko_body === 'string' && row.ko_body === block.body
      && typeof row.separator_after === 'string' && row.separator_after === block.separator_after,
    `${label}의 국문 Unit·Version·본문·구분자가 다릅니다.`);
    const identifiers = [
      ['koUnit', row.ko_unit_id], ['koVersion', row.ko_version_id], ['alignment', row.alignment_id],
      ['enUnit', row.en_unit_id], ['enVersion', row.en_version_id],
    ];
    for (const [kind, id] of identifiers) {
      requireValue(hasId(id) && !seen[kind].has(id), `${label}의 ${kind} ID가 없거나 중복입니다. V1은 검증된 블록별 1:1 대응만 지원합니다.`);
      seen[kind].add(id);
    }
    requireValue(typeof row.en_body === 'string', `${label}의 기준 영문이 없습니다.`);
    const koStats = await stats(row.ko_body);
    const enStats = await stats(row.en_body);
    requireValue(block.sha256 === koStats.sha256 && block.utf8_bytes === koStats.utf8_bytes
      && block.lf_count === koStats.lf_count && block.terminal_lf === koStats.terminal_lf,
    `${label}의 국문 본문 지문이 일치하지 않습니다.`);
    requireValue(row.en_body_sha256 === enStats.sha256, `${label}의 기준 영문 본문 지문이 일치하지 않습니다.`);
    requireValue(['unchanged', 'changed', 'unavailable'].includes(row.en_status), `${label}의 최신 영문 대조 상태가 불명확합니다.`);
    const latest = { status: row.en_status, version_id: null, body: null, sha256: null };
    if (row.en_status !== 'unavailable') {
      requireValue(hasId(row.en_latest_version_id) && typeof row.en_latest_body === 'string', `${label}의 최신 영문 대조 자료가 불완전합니다.`);
      const latestHash = await sha256(row.en_latest_body);
      requireValue(row.en_latest_body_sha256 === latestHash, `${label}의 최신 영문 지문이 일치하지 않습니다.`);
      const differs = row.en_latest_version_id !== row.en_version_id || row.en_latest_body !== row.en_body;
      requireValue((row.en_status === 'changed') === differs, `${label}의 최신 영문 상태와 실제 Version·본문이 다릅니다.`);
      Object.assign(latest, { version_id: row.en_latest_version_id, body: row.en_latest_body, sha256: latestHash });
    }
    if (row.en_status === 'changed') changedCount += 1;
    pairedBlocks.push({
      label, position: index + 1, alignment_id: row.alignment_id,
      comment_refs: block.comment_refs.slice(), guideline_example_refs: block.guideline_example_refs.slice(),
      ko: { unit_id: row.ko_unit_id, version_id: row.ko_version_id, body: row.ko_body, separator_after: row.separator_after, ...koStats },
      en: { unit_id: row.en_unit_id, version_id: row.en_version_id, body: row.en_body,
        separator_after: index === comparison.rows.length - 1 ? '' : '\n\n', ...enStats },
      observed_latest_en: latest,
    });
  }
  requireValue(comparison.changed_count === changedCount, '최신 영문 변경 개수가 대응 목록과 다릅니다.');
  const koBody = pairedBlocks.map(block => block.ko.body + block.ko.separator_after).join('');
  const enBody = pairedBlocks.map(block => block.en.body + block.en.separator_after).join('');
  const koStats = await stats(koBody);
  const enStats = await stats(enBody);
  requireValue(koBody === scene.body && koBody === comparison.ko_body && koStats.sha256 === scene.sha256
    && koStats.sha256 === comparison.ko_body_sha256 && koStats.utf8_bytes === scene.utf8_bytes
    && koStats.lf_count === scene.lf_count && koStats.terminal_lf === 0 && scene.terminal_lf === 0,
  '국문 전문·구분자·SHA 또는 끝 LF 0 계약이 일치하지 않습니다.');
  requireValue(enBody === comparison.en_body && enStats.sha256 === comparison.en_body_sha256
    && comparison.en_terminal_lf === 0 && enStats.terminal_lf === 0,
  '기준 영문 전문·SHA 또는 끝 LF 0 계약이 일치하지 않습니다.');

  const alignmentRows = pairedBlocks.map(block => [block.position, block.ko.unit_id, block.ko.version_id,
    block.ko.sha256, block.ko.separator_after, block.alignment_id, block.en.unit_id, block.en.version_id,
    block.en.sha256, block.en.separator_after]);
  // Fixed order and standard JSON escaping are part of this export-only format.
  // This is deliberately not the persistence RPC's LPF request/result contract.
  const alignmentText = JSON.stringify([alignmentFormat, comparison.managed_scene_id,
    comparison.scene_id, comparison.ko_composition_id, comparison.en_document_id,
    comparison.en_document_slug, comparison.en_scene_id, alignmentFields, alignmentRows]);
  const warnings = [
    ...original.warnings,
    '영문은 번역 대응에 고정된 Unit/Version의 원문입니다. 관찰한 최신 영문과 다르더라도 기준 영문을 자동 교체하지 않습니다.',
    'B 번호는 대응 블록 위치이며 문장별 1:1 번역을 보장하지 않습니다. 문장 자동 분할이나 문구 검색으로 대응을 만들지 않았습니다.',
    '영문 전문은 대응 블록을 LF LF로 결합한 끝 LF 0 비교용 투영입니다. 과거 영문 publication의 끝 LF 1 해시와 혼동하지 않습니다.',
    '관찰한 최신 영문 상태는 내보내기 조회 시점에 한정됩니다. 이후의 최신성이나 다른 Scene의 검토 완료를 보증하지 않습니다.',
    '이 파일은 수정 제안용입니다. 영문 수정, DB 저장, review 변경, final/accepted 또는 문안 최종 수용을 승인하지 않습니다.',
  ];
  if (comparison.en_latest_structure_changed === true) warnings.push(
    '최신 EN의 블록 구성·순서가 기준과 다릅니다. 수록한 영문 전문과 대응표는 고정 기준의 순서이며 최신 EN Scene 전체를 재현하지 않습니다. 각 대응 블록의 본문·Version이 같아도 구조는 달라질 수 있습니다.',
  );
  const payload = {
    ...original, format: packetFormat, source_packet_format: original.format, packet_id: packetId,
    comparison: {
      format: comparisonFormat, source_key: comparison.source_key, basis: 'pinned-en-block-versions',
      en_document_id: comparison.en_document_id, en_document_slug: comparison.en_document_slug,
      en_scene_id: comparison.en_scene_id, en_title: comparison.en_title ?? null,
      en_serialization: 'utf8-en-block-body-lf-lf-terminal0-v1', en_body: enBody, en_stats: enStats,
      observed_latest_status: comparison.latest_status ?? null, changed_count: changedCount,
      en_latest_structure_changed: comparison.en_latest_structure_changed ?? null,
      unavailable_count: pairedBlocks.filter(block => block.observed_latest_en.status === 'unavailable').length,
      block_count: pairedBlocks.length, blocks: pairedBlocks,
      alignment_manifest: { format: alignmentFormat, fields: alignmentFields.slice(), rows: alignmentRows,
        exact_text: alignmentText, ...await stats(alignmentText) },
    }, warnings,
  };
  const lines = [
    '# 영한 Scene 비교 검토 패키지', '',
    `- 패키지 ID: ${safeLabel(packetId)}`,
    `- 규격: ${packetFormat}`,
    `- 국문 Scene / 구성: ${safeLabel(scene.scene_id)} / ${safeLabel(scene.composition_revision_id)}`,
    `- KO SHA-256: ${koStats.sha256}`,
    `- EN 기준 원문 SHA-256: ${enStats.sha256}`,
    `- 대응 명세 SHA-256: ${payload.comparison.alignment_manifest.sha256}`,
    `- 기준과 다른 최신 영문 블록: ${changedCount}개 / 최신 미확인: ${payload.comparison.unavailable_count}개`, '',
    '이 패키지의 Markdown과 JSON에는 같은 패키지 ID가 들어 있습니다. 국문 본문·C/G 지침은 아래 기존 Scene 검토본을 따릅니다. 영문은 읽기 전용 참고자료이며 최신본 대조 결과가 기준 원문을 대체하지 않습니다.', '',
    ...warnings.slice(original.warnings.length).map(warning => `- ${warning}`), '',
    scenePacket.markdown, '', '## 5. 번역 기준 영문 전체', '',
    `- 문서 / slug: ${safeLabel(comparison.en_document_id)} / ${safeLabel(comparison.en_document_slug)}`,
    `- Scene / 표제: ${safeLabel(comparison.en_scene_id)} / ${safeLabel(comparison.en_title)}`,
    `- 전문: ${pairedBlocks.length}블록 / ${enStats.utf8_bytes} UTF-8 bytes / LF ${enStats.lf_count} / 끝 LF ${enStats.terminal_lf}`,
    '', fence(enBody), '', '## 6. 영한 블록 대응표', '',
    'C는 정확한 국소 요청, G(예시)는 넓은 지침의 예시 연결입니다. G 지침을 표시된 블록에만 한정하지 마세요. 최신 영문은 관찰값이며 아래 기준 원문을 자동 대체하지 않습니다.',
  ];
  for (const block of pairedBlocks) {
    lines.push('', `### ${block.label}${block.comment_refs.length ? ` / ${block.comment_refs.join(', ')}` : ''}${block.guideline_example_refs.length ? ` / ${block.guideline_example_refs.map(ref => `${ref}(예시)`).join(', ')}` : ''}`, '',
      `- 대응 ID: ${safeLabel(block.alignment_id)}`,
      `- KO Unit / Version: ${safeLabel(block.ko.unit_id)} / ${safeLabel(block.ko.version_id)}`,
      `- EN Unit / 기준 Version: ${safeLabel(block.en.unit_id)} / ${safeLabel(block.en.version_id)}`,
      `- EN 최신 관찰 상태: ${block.observed_latest_en.status === 'unchanged' ? '기준과 일치' : block.observed_latest_en.status === 'changed' ? '기준과 다름 — 자동 재적용 금지' : '미확인'}`,
      '', '#### 한국어 검토본', '', fence(block.ko.body), '', '#### 번역 기준 영어', '', fence(block.en.body));
    if (block.observed_latest_en.status === 'changed') lines.push('',
      `#### 최신 영문 관찰본 — Version ${safeLabel(block.observed_latest_en.version_id)}`, '', fence(block.observed_latest_en.body));
  }
  return {
    payload, markdown: `${lines.join('\n')}\n`, json: `${JSON.stringify(payload, null, 2)}\n`,
    packetId, baseFilename: `${scenePacket.baseFilename || 'scene-review'}-bilingual-${packetId.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 36)}`,
    bodySha256: koStats.sha256, englishBodySha256: enStats.sha256, blockCount: pairedBlocks.length,
    count: original.comment_count + original.guideline_count, commentCount: original.comment_count, guidelineCount: original.guideline_count,
  };
}
