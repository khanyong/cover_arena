import { sha256Hex } from './rosKoBlockModel.js';

export const TRANSLATION_COMPARISON_FORMAT = 'novel-translation-comparison-v1';
const documentId = 'quantum-vibration-novel-act-2';
const enDocumentId = 'quantum-vibration-novel-en-act-2';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hash = /^[0-9a-f]{64}$/;
const requireValue = (value, message) => { if (!value) throw new Error(message); };

export const supportsSceneTranslationComparison = scene => Boolean(
  scene?.id === 'b48a4f04' && scene.storageModel === 'ros-ko-block-v1'
  && uuid.test(scene.managedSceneId || '') && uuid.test(scene.compositionRevisionId || '')
  && scene.managedViewKey !== 'legacy'
);

// Independent browser-side verification. No trim/normalization/fallback and no writes.
export async function validateTranslationComparison(raw, scene) {
  requireValue(supportsSceneTranslationComparison(scene), '이 Scene 또는 legacy 전문은 영한 블록 비교 대상이 아닙니다.');
  requireValue(raw?.format === TRANSLATION_COMPARISON_FORMAT
    && raw.managed_scene_id === scene.managedSceneId && raw.scene_id === scene.id
    && raw.source_key === 'PRO/CH01/SC01' && raw.ko_document_id === documentId
    && raw.ko_document_slug === documentId && raw.en_document_id === enDocumentId
    && raw.en_document_slug === enDocumentId && raw.en_scene_id === scene.id,
  '영한 비교 대상 식별값이 일치하지 않습니다.');
  requireValue(raw.ko_composition_id === scene.compositionRevisionId,
    '화면과 영한 비교의 구성 리비전이 다릅니다. 새로고침 후 다시 확인해 주세요.');
  requireValue(Array.isArray(raw.rows) && raw.rows.length === 79
    && Array.isArray(scene.paragraphs) && scene.paragraphs.length === 79
    && raw.ko_terminal_lf === 0 && raw.en_terminal_lf === 0,
  '영한 비교의 블록 수 또는 직렬화 계약이 다릅니다.');
  const ids = { ko: new Set(), en: new Set(), alignment: new Set() };
  let koBody = ''; let enBody = ''; let changed = 0; let unavailable = 0;
  for (let i = 0; i < raw.rows.length; i += 1) {
    const row = raw.rows[i]; const paragraph = scene.paragraphs[i];
    requireValue(row.position === i + 1 && row.separator_after === (i === 78 ? '' : '\n\n')
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
  const { data, error } = await client.rpc('ros_ko_get_translation_comparison', {
    p_managed_scene_id: scene.managedSceneId,
    p_composition_id: scene.compositionRevisionId,
  });
  if (error) throw error;
  return validateTranslationComparison(data, scene);
}
