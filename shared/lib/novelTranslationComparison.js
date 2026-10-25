import { postgresJsonbText, sha256Hex } from './rosKoBlockModel.js';

export const TRANSLATION_COMPARISON_FORMAT = 'novel-translation-comparison-v1';
const documentId = 'quantum-vibration-novel-act-2';
const enDocumentId = 'quantum-vibration-novel-en-act-2';
const enProjectId = '707e3ae1-0817-467a-bb42-5401c646151e';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hash = /^[0-9a-f]{64}$/;
const requireValue = (value, message) => { if (!value) throw new Error(message); };
const sceneContracts = new Map([
  ['b48a4f04', { sourceKey: 'PRO/CH01/SC01', enSceneId: 'b48a4f04', blockCount: 79 }],
  ['3b301af5', { sourceKey: 'PRO/CH02/SC01', enSceneId: '3b301af5', blockCount: 139 }],
  ['30ad0834', { sourceKey: 'PRO/CH02/SC02', enSceneId: '30ad0834', blockCount: 246 }],
]);

export const supportsTranslationComparisonSceneId = sceneId => sceneContracts.has(sceneId);

const hasBinding = scene => ['managedSourceKey', 'managedDocumentId', 'managedDocumentSlug']
  .some(key => scene?.[key] !== undefined);

const comparisonContract = scene => {
  if (!hasBinding(scene)) {
    const original = sceneContracts.get(scene?.id);
    return original ? { ...original, documentId, enDocumentId } : null;
  }
  const match = /^quantum-vibration-novel-act-([1-9]\d*)$/.exec(scene.managedDocumentId || '');
  if (!match || scene.managedDocumentSlug !== scene.managedDocumentId
    || !/^(?:PRO|A\d+)\/CH\d+\/SC\d+$/.test(scene.managedSourceKey || '')
    || !Array.isArray(scene.paragraphs) || scene.paragraphs.length === 0
    || scene.terminalLf !== 0 || !hash.test(scene.canonicalBodySha256 || '')) return null;
  return {
    sourceKey: scene.managedSourceKey, enSceneId: scene.id,
    documentId: scene.managedDocumentId,
    enDocumentId: `quantum-vibration-novel-en-act-${match[1]}`,
    actNumber: Number(match[1]), blockCount: scene.paragraphs.length,
  };
};

export const supportsSceneTranslationComparison = scene => Boolean(
  comparisonContract(scene) && typeof scene?.id === 'string' && scene.id.length > 0
  && scene.storageModel === 'ros-ko-block-v1'
  && uuid.test(scene.managedSceneId || '') && uuid.test(scene.compositionRevisionId || '')
  && scene.managedViewKey !== 'legacy'
);

// Independent browser-side verification. No trim/normalization/fallback and no writes.
export async function validateTranslationComparison(raw, scene) {
  requireValue(supportsSceneTranslationComparison(scene), '이 Scene 또는 legacy 전문은 영한 블록 비교 대상이 아닙니다.');
  const contract = comparisonContract(scene);
  requireValue(raw?.format === TRANSLATION_COMPARISON_FORMAT
    && raw.managed_scene_id === scene.managedSceneId && raw.scene_id === scene.id
    && raw.source_key === contract.sourceKey && raw.ko_document_id === contract.documentId
    && raw.ko_document_slug === contract.documentId && raw.en_document_id === contract.enDocumentId
    && raw.en_document_slug === contract.enDocumentId && raw.en_scene_id === contract.enSceneId,
  '영한 비교 대상 식별값이 일치하지 않습니다.');
  requireValue(raw.ko_composition_id === scene.compositionRevisionId,
    '화면과 영한 비교의 구성 리비전이 다릅니다. 새로고침 후 다시 확인해 주세요.');
  requireValue(Array.isArray(raw.rows) && raw.rows.length === contract.blockCount
    && Array.isArray(scene.paragraphs) && scene.paragraphs.length === contract.blockCount
    && raw.ko_terminal_lf === 0 && raw.en_terminal_lf === 0,
  '영한 비교의 블록 수 또는 직렬화 계약이 다릅니다.');
  const ids = { ko: new Set(), en: new Set(), alignment: new Set() };
  let koBody = ''; let enBody = ''; let changed = 0; let unavailable = 0;
  for (let i = 0; i < raw.rows.length; i += 1) {
    const row = raw.rows[i]; const paragraph = scene.paragraphs[i];
    requireValue(row.position === i + 1 && row.separator_after === (i === contract.blockCount - 1 ? '' : '\n\n')
      && ['ko_unit_id', 'ko_version_id', 'alignment_id', 'en_unit_id', 'en_version_id'].every(key => uuid.test(row[key] || ''))
      && typeof row.ko_body === 'string' && typeof row.en_body === 'string',
    '영한 비교 블록의 순서·식별값·구분자가 올바르지 않습니다.');
    requireValue(!ids.ko.has(row.ko_unit_id) && !ids.en.has(row.en_unit_id) && !ids.alignment.has(row.alignment_id),
      '중복되거나 다대일인 대응은 현재 비교 범위에서 지원하지 않습니다.');
    ids.ko.add(row.ko_unit_id); ids.en.add(row.en_unit_id); ids.alignment.add(row.alignment_id);
    requireValue(row.ko_unit_id === paragraph.unitId && row.ko_version_id === paragraph.revisionVersionId
      && row.ko_body === paragraph.versions?.[paragraph.activeVersion]?.content
      && row.separator_after === paragraph.separatorAfter,
    '화면의 국문 블록과 비교 기준이 다릅니다. 새로고침 후 다시 확인해 주세요.');
    requireValue(hash.test(row.en_body_sha256 || '') && await sha256Hex(row.en_body) === row.en_body_sha256,
      '번역 기준 영문 블록의 SHA-256이 일치하지 않습니다.');
    if (row.en_status === 'unavailable') {
      requireValue(row.en_latest_version_id === null && row.en_latest_body === null && row.en_latest_body_sha256 === null,
        '미확인 최신 영문을 기준 영문으로 대체할 수 없습니다.');
      unavailable += 1;
    } else {
      requireValue(['changed', 'unchanged'].includes(row.en_status)
        && uuid.test(row.en_latest_version_id || '') && typeof row.en_latest_body === 'string'
        && hash.test(row.en_latest_body_sha256 || '')
        && await sha256Hex(row.en_latest_body) === row.en_latest_body_sha256,
      '최신 영문의 버전·본문·SHA-256을 확인할 수 없습니다.');
      const same = row.en_latest_version_id === row.en_version_id && row.en_latest_body === row.en_body;
      requireValue(row.en_status === (same ? 'unchanged' : 'changed'), '영문 변경 상태와 실제 본문·버전이 다릅니다.');
      if (!same) changed += 1;
    }
    koBody += row.ko_body + row.separator_after;
    enBody += row.en_body + row.separator_after;
  }
  requireValue(typeof raw.ko_body === 'string' && typeof raw.en_body === 'string'
    && koBody === raw.ko_body && enBody === raw.en_body
    && !koBody.endsWith('\n') && !enBody.endsWith('\n')
    && hash.test(raw.ko_body_sha256 || '') && hash.test(raw.en_body_sha256 || '')
    && await sha256Hex(koBody) === raw.ko_body_sha256 && await sha256Hex(enBody) === raw.en_body_sha256
    && raw.ko_body_sha256 === scene.canonicalBodySha256,
  '영한 비교 전문의 재구성 또는 SHA-256이 일치하지 않습니다.');
  requireValue(typeof raw.en_latest_structure_changed === 'boolean'
    && raw.changed_count === changed && raw.unavailable_count === unavailable
    && raw.latest_status === (unavailable ? 'unavailable' : changed || raw.en_latest_structure_changed ? 'changed' : 'unchanged'),
  '최신 영문 비교 집계가 일치하지 않습니다.');
  return raw;
}

export async function loadSceneTranslationComparison({ scene, client }) {
  requireValue(supportsSceneTranslationComparison(scene), '이 Scene 또는 legacy 전문은 영한 블록 비교 대상이 아닙니다.');
  requireValue(typeof client?.rpc === 'function', '인증된 비교 조회 연결이 필요합니다.');
  // r01 publication has version-specific correspondence. Legacy alignment rows
  // remain historical and must not substitute an earlier EN version for R05/R07.
  if (scene.id === 'b48a4f04' && scene.paragraphs.length === 67) {
    const { data: pinned, error } = await client.rpc('ros_bilingual_read_published', {
      p_managed_scene_id: scene.managedSceneId, p_composition_id: scene.compositionRevisionId,
    });
    if (error) throw error;
    requireValue(pinned?.ko_composition_id === scene.compositionRevisionId && uuid.test(pinned.publication_id || ''),
      '공동 게시 판본을 확인할 수 없습니다.');
    const contract = comparisonContract(scene);
    const rows = pinned.pairs.map(p => ({ ...p, ko_body: p.ko_body, en_body: p.en_body,
      en_body_sha256: p.en_sha256, en_latest_version_id: p.en_version_id,
      en_latest_body: p.en_body, en_latest_body_sha256: p.en_sha256, en_status: 'unchanged' }));
    const enBody = rows.map(p => p.en_body + p.separator_after).join('');
    const koBody = rows.map(p => p.ko_body + p.separator_after).join('');
    return validateTranslationComparison({format: TRANSLATION_COMPARISON_FORMAT,
      publication_id: pinned.publication_id, release_id: pinned.release_id, en_snapshot_id: pinned.en_snapshot_id,
      managed_scene_id: scene.managedSceneId, scene_id: scene.id, source_key: contract.sourceKey,
      ko_document_id: contract.documentId, ko_document_slug: contract.documentId,
      en_document_id: contract.enDocumentId, en_document_slug: contract.enDocumentId, en_scene_id: scene.id,
      ko_composition_id: scene.compositionRevisionId, ko_title: scene.title, en_title: null,
      en_title_basis: 'pinned_publication', ko_body: koBody, ko_body_sha256: await sha256Hex(koBody),
      en_body: enBody, en_body_sha256: await sha256Hex(enBody), ko_terminal_lf: 0, en_terminal_lf: 0,
      rows, changed_count: 0, unavailable_count: 0, en_latest_structure_changed: false, latest_status: 'unchanged'}, scene);
  }
  if (hasBinding(scene)) return loadManagedTranslationComparison({ scene, client });
  const { data, error } = await client.rpc('ros_ko_get_translation_comparison', {
    p_managed_scene_id: scene.managedSceneId,
    p_composition_id: scene.compositionRevisionId,
  });
  if (error) throw error;
  return validateTranslationComparison(data, scene);
}

const readResult = async (request, stage) => {
  const { data, error } = await request;
  if (error) {
    if (!stage) throw error;
    const code = typeof error.code === 'string' && /^[A-Z0-9_]+$/i.test(error.code) ? error.code : null;
    const reason = code === '57014' ? '조회 시간이 초과되었습니다.' : '조회에 실패했습니다.';
    const failure = new Error(`[영한 비교 · ${stage}] ${reason}${code ? ` (${code})` : ''}`, { cause: error });
    failure.code = code;
    failure.comparisonStage = stage;
    throw failure;
  }
  return data;
};

// Keep reads bounded and handle PostgREST's page limit without accepting a partial mapping.
const readRows = async (makeQuery, stage) => {
  const rows = [];
  for (let offset = 0; offset < 100000; offset += 1000) {
    const page = await readResult(makeQuery().range(offset, offset + 999), stage);
    requireValue(Array.isArray(page), '비교 근거 조회 결과가 올바르지 않습니다.');
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
  throw new Error('비교 근거가 조회 한도를 초과했습니다.');
};

const readByIds = async (client, table, fields, column, values, stage, scope = query => query) => {
  const ids = [...new Set(values)];
  const results = [];
  for (let start = 0; start < ids.length; start += 100) {
    const batch = ids.slice(start, start + 100);
    results.push(...await readRows(() => {
      const query = scope(client.from(table).select(fields).in(column, batch).order(column));
      return table === 'revision_content_map' ? query.order('snapshot_id').order('unit_id') : query;
    }, stage));
  }
  return results;
};

const uniqueRows = (rows, field, message) => {
  const result = new Map();
  for (const row of rows) {
    requireValue(uuid.test(row?.[field] || '') && !result.has(row[field]), message);
    result.set(row[field], row);
  }
  return result;
};

async function loadManagedTranslationComparison({ scene, client }) {
  requireValue(typeof client.from === 'function', '인증된 비교 근거 조회 연결이 필요합니다.');
  const contract = comparisonContract(scene);
  // This RPC enforces the existing per-Scene read capability, including shared readers.
  const managed = await readResult(client.rpc('ros_ko_get_scene', {
    p_managed_scene_id: scene.managedSceneId, p_composition_id: scene.compositionRevisionId, p_include_legacy: false,
  }), '국문 구성');
  requireValue(managed?.managed_scene_id === scene.managedSceneId && managed.scene_id === scene.id
    && managed.source_key === contract.sourceKey && managed.requested_composition_id === scene.compositionRevisionId
    && managed.composition?.id === scene.compositionRevisionId && managed.composition.status === 'sealed'
    && managed.composition.managed_scene_id === scene.managedSceneId
    && managed.composition.block_count === contract.blockCount && managed.composition.terminal_lf === 0
    && managed.composition.body_sha256 === scene.canonicalBodySha256
    && Array.isArray(managed.paragraphs) && managed.paragraphs.length === contract.blockCount
    && await sha256Hex(postgresJsonbText(managed.paragraphs)) === managed.projection_sha256,
  '현재 국문 Scene의 구성·출처·본문 지문이 일치하지 않습니다.');

  const binding = await readResult(client.from('ko_managed_scenes')
    .select('id,root_document_id,document_id,document_slug,scene_id,scene_path,source_key,logical_project_id,storage_model')
    .eq('id', scene.managedSceneId).single(), '국문 문서 연결');
  requireValue(binding?.id === scene.managedSceneId && binding.root_document_id === 'quantum-vibration-novel'
    && binding.document_id === contract.documentId && binding.document_slug === contract.documentId
    && binding.scene_id === scene.id && binding.source_key === contract.sourceKey
    && binding.storage_model === 'ros-ko-block-v1' && uuid.test(binding.logical_project_id || '')
    && Array.isArray(binding.scene_path) && binding.scene_path.length === 4
    && binding.scene_path[0] === 'chapters' && binding.scene_path[2] === 'scenes'
    && /^\d+$/.test(binding.scene_path[1]) && /^\d+$/.test(binding.scene_path[3]),
  '국문 Scene의 문서·출처 연결을 확인할 수 없습니다.');
  const expectedEnPath = `act-${contract.actNumber}/ch-${Number(binding.scene_path[1]) + 1}/sc-${Number(binding.scene_path[3]) + 1}`;
  const [alignments, enDocument, enParent] = await Promise.all([
    readRows(() => client.from('ko_en_block_alignments')
      .select('id,managed_scene_id,ko_block_unit_id,en_block_unit_id,en_block_version_id,relation,evidence_manifest_sha256')
      .eq('managed_scene_id', scene.managedSceneId).order('id'), '블록 대응'),
    readResult(client.from('novel_documents').select('id,slug,data').eq('id', contract.enDocumentId).single(), '영문 Reader'),
    readResult(client.from('content_units').select('id,project_id,unit_type,source_path')
      .eq('project_id', enProjectId).eq('source_path', expectedEnPath).single(), '영문 Scene'),
  ]);
  requireValue(uuid.test(enParent?.id || '') && enParent.project_id === enProjectId
    && enParent.unit_type === 'scene' && enParent.source_path === expectedEnPath,
  '영문 Scene의 프로젝트·출처 식별값이 일치하지 않습니다.');
  requireValue(enDocument?.id === contract.enDocumentId && enDocument.slug === contract.enDocumentId
    && enDocument.data?.number === contract.actNumber && Array.isArray(enDocument.data.chapters),
  '영문 문서의 언어·권 식별값이 일치하지 않습니다.');
  const enScenes = enDocument.data.chapters.flatMap(chapter => chapter.scenes || []).filter(item => item?.id === scene.id);
  const enScene = enScenes.length === 1 ? enScenes[0] : null;
  const latestParagraphs = Array.isArray(enScene?.paragraphs) ? enScene.paragraphs : [];
  const alignmentByKo = uniqueRows(alignments, 'ko_block_unit_id', '국문 블록 대응이 없거나 중복입니다.');
  const selectedAlignments = managed.paragraphs.map((paragraph, index) => {
    const alignment = alignmentByKo.get(paragraph.unitId);
    requireValue(uuid.test(paragraph.unitId || '') && uuid.test(paragraph.revisionVersionId || '')
      && paragraph.compositionRevisionId === scene.compositionRevisionId
      && paragraph.storageModel === 'ros-ko-block-v1'
      && paragraph.sourceKey === `KO/${contract.sourceKey}/B${String(index + 1).padStart(4, '0')}`
      && alignment?.managed_scene_id === scene.managedSceneId && alignment.relation === 'translation_of'
      && uuid.test(alignment.id || '') && uuid.test(alignment.en_block_unit_id || '')
      && uuid.test(alignment.en_block_version_id || '') && hash.test(alignment.evidence_manifest_sha256 || ''),
    '국문 블록의 원문 대응·출처를 확인할 수 없습니다.');
    return alignment;
  });
  const enIds = selectedAlignments.map(row => row.en_block_unit_id);
  requireValue(new Set(enIds).size === contract.blockCount, '중복되거나 다대일인 영문 대응은 지원하지 않습니다.');
  const latestIds = latestParagraphs.map(p => p.revisionVersionId).filter(value => uuid.test(value || ''));
  const [units, versions, mappings] = await Promise.all([
    readByIds(client, 'content_units', 'id,project_id,unit_type,source_path', 'id', enIds, '영문 Unit'),
    readByIds(client, 'paragraph_versions', 'id,paragraph_unit_id,body_markdown', 'id',
      [...selectedAlignments.map(row => row.en_block_version_id), ...latestIds], '영문 Version'),
    // paragraph_version_id has an existing index; unit_id alone would scan all snapshot history under RLS.
    readByIds(client, 'revision_content_map', 'unit_id,paragraph_version_id,parent_unit_id,snapshot_id',
      'paragraph_version_id', selectedAlignments.map(row => row.en_block_version_id), '영문 고정 Version 소속',
      query => query.eq('parent_unit_id', enParent.id)),
  ]);
  const unitsById = uniqueRows(units, 'id', '영문 Unit 식별값이 중복되거나 올바르지 않습니다.');
  const versionsById = uniqueRows(versions, 'id', '영문 Version 식별값이 중복되거나 올바르지 않습니다.');
  const snapshotIds = mappings.map(row => row.snapshot_id).filter(value => uuid.test(value || ''));
  const snapshots = await readByIds(client, 'revision_snapshots', 'id,project_id', 'id', snapshotIds, '영문 Snapshot');
  const snapshotsById = uniqueRows(snapshots, 'id', '영문 Snapshot의 식별값이 올바르지 않습니다.');
  const rows = [];
  for (let index = 0; index < managed.paragraphs.length; index += 1) {
    const paragraph = managed.paragraphs[index]; const alignment = selectedAlignments[index];
    const unit = unitsById.get(alignment.en_block_unit_id); const version = versionsById.get(alignment.en_block_version_id);
    const validParents = new Set(mappings.filter(map => {
      const snapshot = snapshotsById.get(map.snapshot_id);
      return map.unit_id === alignment.en_block_unit_id && map.paragraph_version_id === alignment.en_block_version_id
        && map.parent_unit_id === enParent.id && snapshot?.project_id === enProjectId;
    }).map(map => map.parent_unit_id));
    requireValue(unit?.project_id === enProjectId && unit.unit_type === 'paragraph'
      && version?.paragraph_unit_id === unit.id && typeof version.body_markdown === 'string'
      && validParents.size === 1,
    '고정된 영문 Version의 프로젝트·Scene 소속을 확인할 수 없습니다.');
    const candidates = latestParagraphs.filter(p => (p.unitId ?? p.id) === unit.id);
    const candidate = candidates.length === 1 ? candidates[0] : null;
    const latest = candidate ? versionsById.get(candidate.revisionVersionId) : null;
    const latestValid = latest?.paragraph_unit_id === unit.id && typeof latest.body_markdown === 'string'
      && latest.body_markdown === candidate?.versions?.[candidate.activeVersion]?.content;
    rows.push({
      position: index + 1, ko_unit_id: paragraph.unitId, ko_version_id: paragraph.revisionVersionId,
      ko_body: paragraph.versions?.[paragraph.activeVersion]?.content, separator_after: paragraph.separatorAfter,
      alignment_id: alignment.id, en_unit_id: unit.id, en_version_id: version.id,
      en_body: version.body_markdown, en_body_sha256: await sha256Hex(version.body_markdown),
      en_latest_version_id: latestValid ? latest.id : null, en_latest_body: latestValid ? latest.body_markdown : null,
      en_latest_body_sha256: latestValid ? await sha256Hex(latest.body_markdown) : null,
      en_status: !latestValid ? 'unavailable' : latest.id === version.id && latest.body_markdown === version.body_markdown ? 'unchanged' : 'changed',
    });
  }
  const koBody = rows.map(row => row.ko_body + row.separator_after).join('');
  const enBody = rows.map(row => row.en_body + row.separator_after).join('');
  const changed = rows.filter(row => row.en_status === 'changed').length;
  const unavailable = rows.filter(row => row.en_status === 'unavailable').length;
  const structureChanged = Boolean(enScene) && JSON.stringify(latestParagraphs.map(p => p.unitId ?? p.id)) !== JSON.stringify(enIds);
  return validateTranslationComparison({
    format: TRANSLATION_COMPARISON_FORMAT, managed_scene_id: scene.managedSceneId, scene_id: scene.id,
    source_key: contract.sourceKey, ko_document_id: contract.documentId, ko_document_slug: contract.documentId,
    ko_composition_id: scene.compositionRevisionId, ko_title: managed.composition.title_snapshot,
    ko_body: koBody, ko_body_sha256: managed.composition.body_sha256, ko_terminal_lf: 0,
    en_document_id: contract.enDocumentId, en_document_slug: contract.enDocumentId, en_scene_id: scene.id,
    en_title: enScene?.title ?? null, en_title_basis: 'current_reader', en_body: enBody,
    en_body_sha256: await sha256Hex(enBody), en_terminal_lf: 0, rows,
    changed_count: changed, unavailable_count: unavailable, en_latest_structure_changed: structureChanged,
    latest_status: unavailable ? 'unavailable' : changed || structureChanged ? 'changed' : 'unchanged',
  }, scene);
}
