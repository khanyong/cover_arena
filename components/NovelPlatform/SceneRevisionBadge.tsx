import React from 'react';
import { getSceneRevisionNumber, type SceneRevisionMetadata } from './sceneRevision';

export function SceneRevisionBadge({ scene }: { scene: SceneRevisionMetadata }) {
  const revision = getSceneRevisionNumber(scene);
  if (revision === null) return null;
  return (
    <span
      className="mr-1 inline-block font-sans font-semibold text-emerald-400"
      title={`Scene 수정본 반영 ${revision}회 · ${scene.publication!.editorial_version} · 사용자 최종 검수 완료 표시는 아닙니다.`}
    >
      [v{revision}]
    </span>
  );
}
