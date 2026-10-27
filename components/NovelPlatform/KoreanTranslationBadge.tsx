import React from 'react';
import type { NovelScene } from './novelData';
import { hasDisplayedKorean } from '../../shared/lib/koreanLanguageBadge';

interface KoreanTranslationBadgeProps {
  novelSlug: string;
  actNumber: number;
  scene: NovelScene;
  customVersionMap: Record<string, string>;
}

export function KoreanTranslationBadge(props: KoreanTranslationBadgeProps) {
  if (!hasDisplayedKorean(props)) return null;
  return (
    <span
      className="mr-1 inline-block whitespace-nowrap rounded border border-sky-500/40 bg-sky-500/10 px-1.5 py-0.5 font-sans text-[11px] font-semibold text-sky-300"
      data-ko-language="ko"
      data-ko-translation-scene-id={props.scene.id}
      title="현재 선택한 본문에 국문이 있습니다. 판본·게시 상태·작가 채택 여부는 별도 표시를 확인하세요."
    >
      [국문]
    </span>
  );
}
