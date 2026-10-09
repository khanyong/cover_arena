import React, { useEffect, useState } from 'react';
import type { NovelScene } from './novelData';
import {
  getKoreanTranslationEditionCandidate,
  matchesKoreanTranslationEdition,
} from '../../shared/lib/koreanTranslationEdition';

interface KoreanTranslationBadgeProps {
  novelSlug: string;
  actNumber: number;
  scene: NovelScene;
  customVersionMap: Record<string, string>;
}

export function KoreanTranslationBadge(props: KoreanTranslationBadgeProps) {
  const candidate = getKoreanTranslationEditionCandidate(props);
  const body = candidate?.body;
  const sha256 = candidate?.sha256;
  const [verified, setVerified] = useState<{ body: string; sha256: string } | null>(null);

  // Hash the displayed bytes, not only the stored metadata. Hide immediately on
  // version/body changes; late hashing results must not label a different view.
  useEffect(() => {
    if (body === undefined || sha256 === undefined) return;
    let cancelled = false;
    void matchesKoreanTranslationEdition({ body, sha256 }).then((matches) => {
      if (!cancelled) setVerified(matches ? { body, sha256 } : null);
    }).catch(() => {
      if (!cancelled) setVerified(null);
    });
    return () => { cancelled = true; };
  }, [body, sha256]);

  if (!candidate || verified?.body !== body || verified?.sha256 !== sha256) return null;
  return (
    <span
      className="mr-1 inline-block whitespace-nowrap rounded border border-sky-500/40 bg-sky-500/10 px-1.5 py-0.5 font-sans text-[11px] font-semibold text-sky-300"
      data-ko-translation-edition="v1"
      data-ko-translation-scene-id={props.scene.id}
      title="이번 국문 r01 반영본 · 본문 일치 확인 · 문안 최종 승인이나 구조 리비전 번호가 아닙니다."
    >
      [국문 v1]
    </span>
  );
}
