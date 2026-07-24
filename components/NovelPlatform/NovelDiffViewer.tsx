import React from 'react';

interface NovelDiffViewerProps {
  oldContent: string;
  newContent: string;
  oldVersionLabel?: string;
  newVersionLabel?: string;
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
      // 어휘 일치 검색 window
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
  newVersionLabel = '선택/최신 버전'
}) => {
  const diffTokens = computeDiff(oldContent, newContent);

  return (
    <div className="border border-amber-500/20 bg-zinc-950/80 rounded-lg p-4 font-sans leading-relaxed text-sm">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800 text-xs text-zinc-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
          <span className="font-medium text-red-300">{oldVersionLabel} (삭제)</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-medium text-emerald-300">{newVersionLabel} (추가/수정)</span>
        </span>
      </div>

      <div className="whitespace-pre-wrap leading-relaxed text-zinc-200">
        {diffTokens.map((token, index) => {
          if (token.type === 'removed') {
            return (
              <span
                key={index}
                className="bg-red-950/60 text-red-400 line-through px-1 py-0.5 rounded mx-0.5 border border-red-800/40"
              >
                {token.value}
              </span>
            );
          }
          if (token.type === 'added') {
            return (
              <span
                key={index}
                className="bg-emerald-950/60 text-emerald-300 font-medium px-1 py-0.5 rounded mx-0.5 border border-emerald-700/40"
              >
                {token.value}
              </span>
            );
          }
          return <span key={index}>{token.value}</span>;
        })}
      </div>
    </div>
  );
};
