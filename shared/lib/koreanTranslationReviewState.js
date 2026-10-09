import { getKoreanTranslationEditionCandidate } from './koreanTranslationEdition.js';

// This is a component-local display snapshot, not publication or storage state.
// Only default-review candidates enter it. The badge must still verify their
// actual body bytes asynchronously before displaying an edition label.
const sceneKey = (actNumber, sceneId) => `${actNumber}:${sceneId}`;
const isManaged = scene => scene?.storageModel === 'ros-ko-block-v1';
const hasManagedIdentity = scene => typeof scene?.managedSceneId === 'string'
  && scene.managedSceneId.length > 0
  && typeof scene.managedReviewCompositionId === 'string'
  && scene.managedReviewCompositionId.length > 0
  && Number.isSafeInteger(scene.generation) && scene.generation >= 1;
const matchesDocument = (snapshot, novelSlug) => Boolean(snapshot
  && typeof novelSlug === 'string' && snapshot.novelSlug === novelSlug && snapshot.scenes);
const isCurrentCandidate = (novelSlug, actNumber, scene) => Boolean(
  (!isManaged(scene) || hasManagedIdentity(scene))
  && getKoreanTranslationEditionCandidate({ novelSlug, actNumber, scene })
);
const sameCurrentReview = (cached, scene) => isManaged(cached) && isManaged(scene)
  && hasManagedIdentity(cached) && hasManagedIdentity(scene)
  && cached.managedSceneId === scene.managedSceneId
  && cached.managedReviewCompositionId === scene.managedReviewCompositionId
  && cached.generation === scene.generation;
const isHistoricalView = scene => isManaged(scene) && scene.managedReadOnly === true
  && (scene.managedViewKey === 'legacy'
    || (typeof scene.compositionRevisionId === 'string' && scene.compositionRevisionId.length > 0
      && scene.compositionRevisionId !== scene.managedReviewCompositionId
      && scene.managedViewKey === scene.compositionRevisionId));

export function captureKoreanReviewScenes(novel) {
  if (typeof novel?.slug !== 'string' || !novel.slug) return null;
  const snapshot = { novelSlug: novel.slug, scenes: {} };
  for (const act of Array.isArray(novel.acts) ? novel.acts : []) {
    for (const chapter of Array.isArray(act?.chapters) ? act.chapters : []) {
      for (const scene of Array.isArray(chapter?.scenes) ? chapter.scenes : []) {
        if (isCurrentCandidate(novel.slug, act.number, scene)) {
          snapshot.scenes[sceneKey(act.number, scene.id)] = structuredClone(scene);
        }
      }
    }
  }
  return snapshot;
}

export function getKoreanReviewScene(snapshot, novelSlug, actNumber, viewScene) {
  if (!matchesDocument(snapshot, novelSlug) || typeof viewScene?.id !== 'string') return null;
  const key = sceneKey(actNumber, viewScene.id);
  if (!Object.hasOwn(snapshot.scenes, key)) return null;
  const cached = snapshot.scenes[key];
  if (cached?.id !== viewScene.id || !isCurrentCandidate(novelSlug, actNumber, cached)) return null;
  if (isManaged(cached)) {
    if (!sameCurrentReview(cached, viewScene)) return null;
    return isHistoricalView(viewScene) || isCurrentCandidate(novelSlug, actNumber, viewScene)
      ? cached : null;
  }
  // Opening's paragraph selection belongs to the body/header. Its default
  // review snapshot does not consult the reader's customVersionMap.
  return !isManaged(viewScene) && isCurrentCandidate(novelSlug, actNumber, viewScene) ? cached : null;
}

export function invalidateKoreanReviewScene(snapshot, novelSlug, actNumber, sceneId) {
  if (!matchesDocument(snapshot, novelSlug)) return null;
  if (!Number.isSafeInteger(actNumber) || typeof sceneId !== 'string') return snapshot;
  const key = sceneKey(actNumber, sceneId);
  if (!Object.hasOwn(snapshot.scenes, key)) return snapshot;
  const scenes = { ...snapshot.scenes };
  delete scenes[key];
  return { ...snapshot, scenes };
}

export function reconcileKoreanReviewScene(snapshot, novelSlug, actNumber, scene) {
  if (!matchesDocument(snapshot, novelSlug)) return null;
  if (!Number.isSafeInteger(actNumber) || typeof scene?.id !== 'string') return snapshot;
  const key = sceneKey(actNumber, scene.id);
  if (isCurrentCandidate(novelSlug, actNumber, scene)) {
    return { ...snapshot, scenes: { ...snapshot.scenes, [key]: structuredClone(scene) } };
  }
  // A historical view can keep known current evidence, but cannot create it.
  // Changed/missing current pointers, malformed current loads, and partial
  // data invalidate only the affected Scene; a fresh review read can restore it.
  if (isHistoricalView(scene) && getKoreanReviewScene(snapshot, novelSlug, actNumber, scene)) return snapshot;
  return invalidateKoreanReviewScene(snapshot, novelSlug, actNumber, scene.id);
}
