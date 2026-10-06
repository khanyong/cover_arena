import { supabase } from './supabase';
import { sha256Hex } from './rosKoBlockModel';

export const listReviewGuidelines = async (managedSceneId) => {
  const { data, error } = await supabase.rpc('ros_ko_review_guidelines_list', { p_managed_scene_id: managedSceneId });
  if (error) throw error;
  if (!Array.isArray(data)) throw new Error('검토 지침 조회 응답을 확인할 수 없습니다.');
  return data;
};

const pending = new Map();
const editableFields = ['target_character', 'applies_to', 'preservation', 'direction', 'proposal', 'kind', 'priority', 'status', 'include_in_export'];
export const saveReviewGuideline = async ({ scene, paragraph = null, input, existing = null }) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw authError || new Error('로그인이 필요합니다.');
  const origin = existing?.managed_scene_id || scene.managedSceneId;
  if (!origin) throw new Error('검토 지침의 대상 Scene 식별값이 없습니다.');
  const payload = Object.fromEntries(editableFields.filter(key => Object.prototype.hasOwnProperty.call(input, key)).map(key => [key, input[key]]));
  if (!existing) {
    if (scene.managedReadOnly || !scene.compositionRevisionId) throw new Error('최신 review 구성에서 지침을 작성해 주세요.');
    payload.scope = input.scope;
    payload.expected_composition_id = scene.compositionRevisionId;
    if (paragraph) {
      const body = paragraph.versions?.[paragraph.activeVersion]?.content;
      if (!paragraph.unitId || !paragraph.revisionVersionId || typeof body !== 'string') throw new Error('예시 블록의 본문과 버전을 확인할 수 없습니다.');
      payload.example = {
        block_unit_id: paragraph.unitId, block_version_id: paragraph.revisionVersionId,
        composition_id: scene.compositionRevisionId, body_sha256: await sha256Hex(body),
        selected_text: input.selected_text || '', selection_start: input.selection_start ?? null, selection_end: input.selection_end ?? null
      };
    }
  }
  const expectedRevision = existing?.revision || 0;
  const key = `novel-review-guideline-v1:${user.id}:${origin}:${existing?.id || paragraph?.unitId || 'general'}`;
  const fingerprint = await sha256Hex(JSON.stringify({ payload, expectedRevision }));
  let prior = pending.get(key);
  try { prior = prior || JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { /* memory retry available */ }
  const request = prior?.fingerprint === fingerprint ? prior : { fingerprint, guidelineId: existing?.id || crypto.randomUUID(), eventId: crypto.randomUUID() };
  pending.set(key, request);
  try { sessionStorage.setItem(key, JSON.stringify(request)); } catch { /* no manuscript in this optional cache */ }
  const { data, error } = await supabase.rpc('ros_ko_review_guideline_save', {
    p_managed_scene_id: origin, p_guideline_id: request.guidelineId, p_event_id: request.eventId,
    p_expected_revision: expectedRevision, p_input: payload
  });
  if (error) throw error;
  if (!data?.id) throw new Error('지침 저장 결과가 불명확합니다. 동일 입력으로 다시 확인해 주세요.');
  pending.delete(key);
  try { sessionStorage.removeItem(key); } catch { /* optional cache */ }
  return data;
};
