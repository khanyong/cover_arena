import React, { useState } from 'react';
import { NovelSideBySideDiff } from './NovelSideBySideDiff';

interface NovelDiffViewerProps {
  oldContent: string;
  newContent: string;
  oldVersionLabel?: string;
  newVersionLabel?: string;
  onAdoptOld?: () => void;
  onAdoptNew?: () => void;
}

interface DiffToken {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

// 문장/어휘 단위 diff 계산 헬퍼 함수
function computeDiff(oldStr: string, newStr: string): DiffToken[] {
  if (oldStr === newStr) {
    return [{ type: 'unchanged', value: newStr }];
  }

  const oldWords = oldStr.split(/(\s+)/);
  const newWords = newStr.split(/(\s+)/);

  const tokens: DiffToken[] = [];
  let i = 0;
  let j = 0;

  while (i < oldWords.length && j < newWords.length) {
    if (oldWords[i] === newWords[j]) {
      tokens.push({ type: 'unchanged', value: oldWords[i] });
      i++;
      j++;
    } else {
      let foundMatch = false;
      for (let lookAhead = 1; lookAhead <= 5; lookAhead++) {
        if (j + lookAhead < newWords.length && oldWords[i] === newWords[j + lookAhead]) {
          for (let k = 0; k < lookAhead; k++) {
            tokens.push({ type: 'added', value: newWords[j + k] });
          }
          j += lookAhead;
          foundMatch = true;
          break;
        }
        if (i + lookAhead < oldWords.length && oldWords[i + lookAhead] === newWords[j]) {
          for (let k = 0; k < lookAhead; k++) {
            tokens.push({ type: 'removed', value: oldWords[i + k] });
          }
          i += lookAhead;
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch) {
        tokens.push({ type: 'removed', value: oldWords[i] });
        tokens.push({ type: 'added', value: newWords[j] });
        i++;
        j++;
      }
    }
  }

  while (i < oldWords.length) {
    tokens.push({ type: 'removed', value: oldWords[i] });
    i++;
  }

  while (j < newWords.length) {
    tokens.push({ type: 'added', value: newWords[j] });
    j++;
  }

  return tokens;
}

export const NovelDiffViewer: React.FC<NovelDiffViewerProps> = ({
  oldContent,
  newContent,
  oldVersionLabel = '이전 버전',
  newVersionLabel = '선택/최신 버전',
  onAdoptOld,
  onAdoptNew
}) => {
  const [displayMode, setDisplayMode] = useState<'split' | 'inline' | 'raw'>('split');
  const diffTokens = computeDiff(oldContent, newContent);

  return (
    <div className="border border-amber-500/20 bg-zinc-950/90 rounded-xl p-4 font-sans leading-relaxed text-sm shadow-xl">
      {/* 뷰 모드 컨트롤 헤더 */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-zinc-800 text-xs text-zinc-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <span>⚖️</span> 버전 차이 분석
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              {oldVersionLabel}
            </span>
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {newVersionLabel}
            </span>
          </div>
        </div>
        
        {/* 모드 전환 탭 */}
        <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-700/80 text-xs">
          <button
            onClick={() => setDisplayMode('split')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              displayMode === 'split'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            양쪽 분할(Side-by-Side)
          </button>
          <button
            onClick={() => setDisplayMode('inline')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              displayMode === 'inline'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            인라인 취소선
          </button>
          <button
            onClick={() => setDisplayMode('raw')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              displayMode === 'raw'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            이전 원본
          </button>
        </div>
      </div>

      {/* 1. 사이드 바이 사이드 분할 뷰 */}
      {displayMode === 'split' && (
        <NovelSideBySideDiff
          initialLeftText={oldContent}
          initialRightText={newContent}
          leftLabel={oldVersionLabel}
          rightLabel={newVersionLabel}
          onAdoptLeft={onAdoptOld ? () => onAdoptOld() : undefined}
          onAdoptRight={onAdoptNew ? () => onAdoptNew() : undefined}
        />
      )}

      {/* 2. 인라인 취소선 뷰 */}
      {displayMode === 'inline' && (
        <div className="whitespace-pre-wrap leading-relaxed text-zinc-200 p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
          {diffTokens.map((token, index) => {
            if (token.type === 'removed') {
              return (
                <span
                  key={index}
                  className="bg-rose-950/70 text-rose-300 line-through px-1 py-0.5 rounded mx-0.5 border border-rose-800/50"
                >
                  {token.value}
                </span>
              );
            }
            if (token.type === 'added') {
              return (
                <span
                  key={index}
                  className="bg-emerald-950/70 text-emerald-200 font-medium px-1 py-0.5 rounded mx-0.5 border border-emerald-700/50"
                >
                  {token.value}
                </span>
              );
            }
            return <span key={index}>{token.value}</span>;
          })}
        </div>
      )}

      {/* 3. 과거 버전 원본 뷰 */}
      {displayMode === 'raw' && (
        <div className="whitespace-pre-wrap leading-relaxed text-zinc-300 p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 font-serif">
          {oldContent}
        </div>
      )}
    </div>
  );
};

