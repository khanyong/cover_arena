import React, { useMemo, useState } from 'react';
import type { NovelScene } from './novelData';
import { BilingualBlockText } from './NovelBilingualReader';
import { hasParallelMath, segmentParallelText } from '../../shared/lib/novelParallelReading';

export interface ParallelReadingSide {
  title: string;
  body: string;
  paragraphs: Array<{ id: string; versionId: string; body: string; separatorAfter: string }>;
  terminalLf: number;
}

export interface ParallelReading {
  format: string;
  sceneId: string;
  currentLanguage: 'ko' | 'en';
  scope: { actNumber: number; chapterNumber: number; sceneNumber: number };
  ko: ParallelReadingSide;
  en: ParallelReadingSide;
}

interface Props {
  scene: NovelScene;
  comparison: ParallelReading | null;
  loading: boolean;
  error: string;
  fontSizeClass: string;
  onRetry: () => void;
  onClose: () => void;
  readingUnit?: 'paragraph' | 'sentence';
  onReadingUnitChange?: (unit: 'paragraph' | 'sentence') => void;
}

const buttonClass = 'rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400';

/** Independent columns intentionally make no sentence/paragraph alignment claim. */
export function NovelParallelReader({ scene, comparison, loading, error, fontSizeClass, onRetry, onClose, readingUnit, onReadingUnitChange }: Props) {
  const [localMode, setLocalMode] = useState<'paragraph' | 'sentence'>('paragraph');
  const mode = readingUnit || localMode;
  const setMode = (unit: 'paragraph' | 'sentence') => { setLocalMode(unit); onReadingUnitChange?.(unit); };
  const ko = useMemo(() => segmentParallelText(comparison?.ko.body || '', mode, 'ko'), [comparison?.ko.body, mode]);
  const en = useMemo(() => segmentParallelText(comparison?.en.body || '', mode, 'en'), [comparison?.en.body, mode]);
  const unitLabel = mode === 'paragraph' ? '단락' : '문장';

  return <section aria-label="영한 나란히 읽기" data-parallel-scene-id={scene.id} className="space-y-4 rounded-xl border border-sky-800/60 bg-zinc-950/40 p-3 sm:p-4">
    <header className="space-y-3 border-b border-zinc-800 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="font-semibold text-sky-200">영한 비교 · 나란히 읽기</h5>
        <button type="button" className={buttonClass} onClick={onClose}>일반 읽기로 돌아가기</button>
      </div>
      <p className="text-xs leading-5 text-amber-200">같은 Scene의 두 언어 본문을 각각 표시합니다. 검증된 1:1 번역 대응표가 아니며, 양쪽의 번호와 단락·문장 수는 독립적입니다. 각 칸을 따로 스크롤할 수 있습니다.</p>
      <p className="text-xs leading-5 text-zinc-400">현재 언어는 선택한 판본, 반대 언어는 조회 시점의 Reader 판본입니다. 반대 언어가 번역 당시의 기준본이라는 뜻은 아닙니다. 모두 읽기 전용이며 본문·Version·코멘트·검토 상태를 바꾸지 않습니다.</p>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={`parallel-unit-${scene.id}`} className="text-xs text-zinc-300">읽기 단위</label>
        <select id={`parallel-unit-${scene.id}`} value={mode} onChange={event => setMode(event.target.value as 'paragraph' | 'sentence')} className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200">
          <option value="paragraph">단락</option><option value="sentence">문장</option>
        </select>
        <span className="text-xs text-zinc-400">표시만 분리 · 원본 공백과 개행 보존</span>
      </div>
      {mode === 'sentence' ? <p className="text-xs leading-5 text-zinc-400">브라우저의 문장 분리 기능을 사용하며 지원하지 않으면 종결부호로 나눕니다. 문학적 문장 경계나 번역 대응을 확정하지 않습니다. 수식이 있는 단락은 통째로 유지합니다.</p> : null}
    </header>
    {loading ? <p role="status" className="p-4 text-sm text-sky-200">같은 Scene의 반대 언어 본문을 읽고 있습니다…</p> : null}
    {error ? <div role="alert" className="space-y-2 rounded-lg border border-red-900 bg-red-950/30 p-4 text-sm text-red-200"><p>{error}</p><p className="text-xs">없는 번역이나 대응 관계를 제목·배열 순서로 추정하지 않습니다.</p><button type="button" className={buttonClass} onClick={onRetry}>다시 확인</button></div> : null}
    {!loading && !error && comparison ? <div tabIndex={0} role="region" aria-label="영한 나란히 읽기 · 좁은 화면에서 좌우 스크롤" className="overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"><div className="grid min-w-[40rem] grid-cols-2 gap-4">
      {(['ko', 'en'] as const).map(language => {
        const side = comparison[language];
        const reading = language === 'ko' ? ko : en;
        const label = language === 'ko' ? '한국어' : '영어';
        return <section key={language} lang={language} aria-label={`${label} 독립 읽기 칸`} className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-900/20">
          <header className="space-y-1 border-b border-zinc-800 p-3">
            <h6 className={`font-semibold ${language === 'ko' ? 'text-sky-200' : 'text-emerald-200'}`}>{label} · 읽기 전용</h6>
            <p className="text-sm text-zinc-300">{side.title || `장면 ${comparison.scope.sceneNumber}`}</p>
            <p className="text-xs text-zinc-400">{comparison.currentLanguage === language ? '현재 선택 판본' : '조회 시점 Reader 판본'} · {reading.segments.length}{unitLabel}{mode === 'sentence' ? '/수식 단락' : ''}</p>
          </header>
          <div tabIndex={0} role="region" aria-label={`${label} ${unitLabel} 본문 · 독립 스크롤`} className={`max-h-[70vh] overflow-y-auto overscroll-contain p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 ${fontSizeClass}`}>
            {reading.segments.map((body, index) => <article key={`${mode}-${index}`} data-parallel-language={language} data-parallel-index={index + 1} className="border-b border-zinc-800/60 py-3 last:border-b-0">
              <p className="mb-2 text-[10px] text-zinc-500">{language.toUpperCase()} {unitLabel} {index + 1}{mode === 'sentence' && hasParallelMath(body) ? ' · 수식 단락 유지' : ''}</p>
              {hasParallelMath(body) ? <BilingualBlockText body={body} /> : <div className="whitespace-pre-wrap break-words leading-relaxed">{body}</div>}
            </article>)}
          </div>
        </section>;
      })}
    </div></div> : null}
  </section>;
}
