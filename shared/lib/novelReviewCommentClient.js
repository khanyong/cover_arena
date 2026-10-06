import { supabase } from './supabase';
import { sha256Hex } from './rosKoBlockModel';

export const listReviewComments = async (managedSceneId) => {
  const { data, error } = await supabase.rpc('ros_ko_review_comments_list', {
    p_managed_scene_id: managedSceneId
  });
  if (error) throw error;
  if (!Array.isArray(data)) throw new Error('코멘트 조회 응답을 확인할 수 없습니다.');
  return data;
};

// Only request identities are retained here. Manuscript and comment text are
// sent to the authenticated RPC, never stored in browser retry metadata.
const retries = new Map();
export const saveReviewComment = async ({ scene, paragraph, input, existing }) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw authError || new Error('로그인이 필요합니다.');
  if (!scene.managedSceneId || !paragraph.unitId || !paragraph.revisionVersionId) {
    throw new Error('코멘트를 연결할 블록 식별값이 없습니다.');
  }
  const body = paragraph.versions[paragraph.activeVersion]?.content;
  const payload = existing ? input : {
    ...input,
    block_unit_id: paragraph.unitId,
    block_version_id: paragraph.revisionVersionId,
    composition_id: scene.compositionRevisionId,
    body_sha256: await sha256Hex(body)
  };
  const expectedRevision = existing?.revision || 0;
  const key = `novel-review-comment-v1:${user.id}:${scene.managedSceneId}:${existing?.id || paragraph.unitId}`;
  const fingerprint = await sha256Hex(JSON.stringify({ payload, expectedRevision }));
  let previous = retries.get(key);
  try { previous = previous || JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { /* in-memory retry remains available */ }
  const retry = previous?.fingerprint === fingerprint ? previous : {
    fingerprint, commentId: existing?.id || crypto.randomUUID(), eventId: crypto.randomUUID()
  };
  retries.set(key, retry);
  try { sessionStorage.setItem(key, JSON.stringify(retry)); } catch { /* storage may be disabled */ }
  const { data, error } = await supabase.rpc('ros_ko_review_comment_save', {
    p_managed_scene_id: scene.managedSceneId,
    p_comment_id: retry.commentId,
    p_event_id: retry.eventId,
    p_expected_revision: expectedRevision,
    p_input: payload
  });
  if (error) throw error;
  if (!data?.id) throw new Error('저장 결과를 확인할 수 없습니다. 동일 입력으로 다시 확인해 주세요.');
  retries.delete(key);
  try { sessionStorage.removeItem(key); } catch { /* optional browser cache */ }
  return data;
};
