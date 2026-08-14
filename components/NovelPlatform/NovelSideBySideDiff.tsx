import React, { useState, useEffect, useRef, useMemo } from 'react';
import { diffLines, diffWordsWithSpace, Change } from 'diff';

export interface NovelSideBySideDiffProps {
  initialLeftText?: string;
  initialRightText?: string;
  leftLabel?: string;
  rightLabel?: string;
  onAdoptLeft?: (text: string) => void;
  onAdoptRight?: (text: string) => void;
  readOnly?: boolean;
  className?: string;
}

interface AlignedLine {
  type: 'unchanged' | 'modified' | 'added' | 'removed' | 'empty';
  lineNum?: number;
  content: string;
  wordDiffs?: Change[];
}

interface DiffRow {
  left: AlignedLine;
  right: AlignedLine;
}

export const NovelSideBySideDiff: React.FC<NovelSideBySideDiffProps> = ({
  initialLeftText = '',
  initialRightText = '',
  leftLabel = '버전 A (이전 / 대안 1)',
  rightLabel = '버전 B (수정 / 대안 2)',
  onAdoptLeft,
  onAdoptRight,
  readOnly = false,
  className = ''
}) => {
  const [leftText, setLeftText] = useState(initialLeftText);
  const [rightText, setRightText] = useState(initialRightText);
  
  // 뷰 모드: 'compare' (비교 모드) vs 'edit' (직접 입력/붙여넣기 모드)
  const [activeTab, setActiveTab] = useState<'compare' | 'edit'>('compare');
  
  // 동기화 스크롤 설정
  const [syncScroll, setSyncScroll] = useState(true);
  
  // 리딩 및 가독성 설정
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState<number>(15);
  const [lineHeight, setLineHeight] = useState<number>(1.8);
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  
  // 복사 알림 토스트 상태
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // 스크롤 ref
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<'left' | 'right' | null>(null);

  // 외부 props 변경 시 동기화
  useEffect(() => {
    setLeftText(initialLeftText);
  }, [initialLeftText]);

  useEffect(() => {
    setRightText(initialRightText);
  }, [initialRightText]);

  // Diff 연산 및 라인 수평 정렬 (Line Alignment Algorithm)
  const diffRows = useMemo<DiffRow[]>(() => {
    const rawDiff = diffLines(leftText || '', rightText || '');
    const rows: DiffRow[] = [];
    
    let leftLineCounter = 1;
    let rightLineCounter = 1;

    let i = 0;
    while (i < rawDiff.length) {
      const part = rawDiff[i];
      const nextPart = rawDiff[i + 1];

      // 1. 양쪽 모두 변경 없음 (Unchanged)
      if (!part.added && !part.removed) {
        const lines = part.value.replace(/\r\n/g, '\n').split('\n');
        if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();

        for (const line of lines) {
          rows.push({
            left: { type: 'unchanged', lineNum: leftLineCounter++, content: line },
            right: { type: 'unchanged', lineNum: rightLineCounter++, content: line }
          });
        }
        i++;
      }
      // 2. 수정된 경우 (Removed 바로 뒤에 Added가 오는 경우 매칭)
      else if (part.removed && nextPart && nextPart.added) {
        const removedLines = part.value.replace(/\r\n/g, '\n').split('\n');
        if (removedLines.length > 0 && removedLines[removedLines.length - 1] === '') removedLines.pop();

        const addedLines = nextPart.value.replace(/\r\n/g, '\n').split('\n');
        if (addedLines.length > 0 && addedLines[addedLines.length - 1] === '') addedLines.pop();

        const maxLen = Math.max(removedLines.length, addedLines.length);

        for (let idx = 0; idx < maxLen; idx++) {
          const remLine = removedLines[idx];
          const addLine = addedLines[idx];

          if (remLine !== undefined && addLine !== undefined) {
            // 단어/조사 세부 diff 계산
            const wordDiffs = diffWordsWithSpace(remLine, addLine);
            rows.push({
              left: {
                type: 'modified',
                lineNum: leftLineCounter++,
                content: remLine,
                wordDiffs: wordDiffs.filter(w => !w.added)
              },
              right: {
                type: 'modified',
                lineNum: rightLineCounter++,
                content: addLine,
                wordDiffs: wordDiffs.filter(w => !w.removed)
              }
            });
          } else if (remLine !== undefined) {
            rows.push({
              left: { type: 'removed', lineNum: leftLineCounter++, content: remLine },
              right: { type: 'empty', content: '' }
            });
          } else if (addLine !== undefined) {
            rows.push({
              left: { type: 'empty', content: '' },
              right: { type: 'added', lineNum: rightLineCounter++, content: addLine }
            });
          }
        }
        i += 2;
      }
      // 3. 순수 삭제 (Left에만 존재)
      else if (part.removed) {
        const lines = part.value.replace(/\r\n/g, '\n').split('\n');
        if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();

        for (const line of lines) {
          rows.push({
            left: { type: 'removed', lineNum: leftLineCounter++, content: line },
            right: { type: 'empty', content: '' }
          });
        }
        i++;
      }
      // 4. 순수 추가 (Right에만 존재)
      else if (part.added) {
        const lines = part.value.replace(/\r\n/g, '\n').split('\n');
        if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();

        for (const line of lines) {
          rows.push({
            left: { type: 'empty', content: '' },
            right: { type: 'added', lineNum: rightLineCounter++, content: line }
          });
        }
        i++;
      } else {
        i++;
      }
    }

    return rows;
  }, [leftText, rightText]);

  // 통계 계산
  const stats = useMemo(() => {
    const leftLen = leftText.length;
    const leftLenNoSpace = leftText.replace(/\s/g, '').length;
    const rightLen = rightText.length;
    const rightLenNoSpace = rightText.replace(/\s/g, '').length;

    let unchangedCount = 0;
    let modifiedCount = 0;
    let addedCount = 0;
    let removedCount = 0;

    diffRows.forEach(row => {
      if (row.left.type === 'unchanged') unchangedCount++;
      else if (row.left.type === 'modified') modifiedCount++;
      else if (row.left.type === 'removed') removedCount++;
      else if (row.right.type === 'added') addedCount++;
    });

    const totalLines = diffRows.length || 1;
    const similarity = Math.round((unchangedCount / totalLines) * 100);

    return {
      leftLen,
      leftLenNoSpace,
      rightLen,
      rightLenNoSpace,
      unchangedCount,
      modifiedCount,
      addedCount,
      removedCount,
      similarity
    };
  }, [leftText, rightText, diffRows]);

  // 동기화 스크롤 핸들러
  const handleScroll = (source: 'left' | 'right') => {
    if (!syncScroll) return;
    if (isScrollingRef.current && isScrollingRef.current !== source) return;

    isScrollingRef.current = source;
    const leftEl = leftScrollRef.current;
    const rightEl = rightScrollRef.current;

    if (source === 'left' && leftEl && rightEl) {
      rightEl.scrollTop = leftEl.scrollTop;
      rightEl.scrollLeft = leftEl.scrollLeft;
    } else if (source === 'right' && leftEl && rightEl) {
      leftEl.scrollTop = rightEl.scrollTop;
      leftEl.scrollLeft = rightEl.scrollLeft;
    }

    setTimeout(() => {
      isScrollingRef.current = null;
    }, 50);
  };

  const showToast = (msg: string) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(null), 2500);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`📋 ${label} 본문이 클립보드에 복사되었습니다!`);
  };

  // 단락/라인 병합 함수 (Left -> Right or Right -> Left)
  const handleMergeLine = (rowIndex: number, direction: 'toRight' | 'toLeft') => {
    const row = diffRows[rowIndex];
    if (!row) return;

    if (direction === 'toRight' && row.left.content) {
      const newRightLines = diffRows
        .map((r, idx) => (idx === rowIndex ? r.left.content : r.right.type === 'empty' ? '' : r.right.content))
        .filter(c => c !== '');
      setRightText(newRightLines.join('\n'));
      showToast('👉 좌측 단락을 우측으로 병합했습니다.');
    } else if (direction === 'toLeft' && row.right.content) {
      const newLeftLines = diffRows
        .map((r, idx) => (idx === rowIndex ? r.right.content : r.left.type === 'empty' ? '' : r.left.content))
        .filter(c => c !== '');
      setLeftText(newLeftLines.join('\n'));
      showToast('👈 우측 단락을 좌측으로 병합했습니다.');
    }
  };

  // 테마별 스타일 매핑
  const themeStyles = {
    dark: {
      container: 'bg-zinc-950 text-zinc-100 border-zinc-800',
      header: 'bg-zinc-900/90 border-zinc-800 text-zinc-200',
      panel: 'bg-zinc-900/40 border-zinc-800/80',
      lineNum: 'text-zinc-600 bg-zinc-950/40 border-zinc-800/40',
      unchanged: 'text-zinc-200 hover:bg-zinc-800/20',
      modifiedLeft: 'bg-rose-950/40 text-rose-200 border-l-2 border-rose-500',
      modifiedRight: 'bg-emerald-950/40 text-emerald-200 border-l-2 border-emerald-500',
      removed: 'bg-rose-950/50 text-rose-300 border-l-2 border-rose-600',
      added: 'bg-emerald-950/50 text-emerald-300 border-l-2 border-emerald-600',
      empty: 'bg-zinc-950/60 opacity-30 select-none pattern-diagonal-lines',
      wordDel: 'bg-rose-900/80 text-rose-100 px-1 py-0.5 rounded font-medium shadow-sm',
      wordAdd: 'bg-emerald-900/90 text-emerald-100 px-1 py-0.5 rounded font-semibold shadow-sm'
    },
    sepia: {
      container: 'bg-[#fcf7ed] text-[#433422] border-[#e8dcc4]',
      header: 'bg-[#f4ebd9] border-[#e4d5bc] text-[#5c4731]',
      panel: 'bg-[#f7f0e1]/60 border-[#e8dcc4]',
      lineNum: 'text-[#a39480] bg-[#f0e5d1]/50 border-[#e2d3bb]',
      unchanged: 'text-[#3c3022] hover:bg-[#ede1ca]/40',
      modifiedLeft: 'bg-[#fbe4e4] text-[#8e2b2b] border-l-2 border-[#d9534f]',
      modifiedRight: 'bg-[#e3f4e8] text-[#256c39] border-l-2 border-[#5cb85c]',
      removed: 'bg-[#f9dada] text-[#8a1f1f] border-l-2 border-[#d9534f]',
      added: 'bg-[#daf1e2] text-[#1c6430] border-l-2 border-[#4cae4c]',
      empty: 'bg-[#ede5d5]/50 opacity-40 select-none',
      wordDel: 'bg-[#f3bcbc] text-[#781717] px-1 py-0.5 rounded font-medium',
      wordAdd: 'bg-[#bee6cb] text-[#144f24] px-1 py-0.5 rounded font-semibold'
    },
    light: {
      container: 'bg-white text-zinc-900 border-zinc-200',
      header: 'bg-zinc-100 border-zinc-200 text-zinc-800',
      panel: 'bg-zinc-50/70 border-zinc-200',
      lineNum: 'text-zinc-400 bg-zinc-100/60 border-zinc-200',
      unchanged: 'text-zinc-800 hover:bg-zinc-100/60',
      modifiedLeft: 'bg-red-50 text-red-900 border-l-2 border-red-500',
      modifiedRight: 'bg-emerald-50 text-emerald-900 border-l-2 border-emerald-600',
      removed: 'bg-red-100/70 text-red-900 border-l-2 border-red-500',
      added: 'bg-emerald-100/70 text-emerald-950 border-l-2 border-emerald-600',
      empty: 'bg-zinc-100/50 opacity-30 select-none',
      wordDel: 'bg-red-200 text-red-950 px-1 py-0.5 rounded font-medium',
      wordAdd: 'bg-emerald-200 text-emerald-950 px-1 py-0.5 rounded font-semibold'
    }
  }[theme];

  return (
    <div className={`rounded-xl border shadow-xl flex flex-col overflow-hidden ${themeStyles.container} ${className}`}>
      {/* 상단 컨트롤 및 툴바 */}
      <div className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${themeStyles.header}`}>
        {/* 좌측: 탭 & 통계 요약 */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-black/20 p-0.5 rounded-lg border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'compare'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>⚖️</span> 나란히 비교 (Side-by-Side)
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'edit'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>✏️</span> 원고 복사/직접 편집
            </button>
          </div>

          {/* 통계 뱃지 */}
          <div className="flex items-center gap-2 text-xs opacity-90">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-md">
              유사도 <strong className="font-bold">{stats.similarity}%</strong>
            </span>
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 rounded-md">
              삭제/수정 <strong>{stats.removedCount + stats.modifiedCount}줄</strong>
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md">
              추가 <strong>{stats.addedCount}줄</strong>
            </span>
          </div>
        </div>

        {/* 우측: 리딩 설정 & 옵션 */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          {/* 동기화 스크롤 토글 */}
          <button
            onClick={() => setSyncScroll(!syncScroll)}
            className={`px-2.5 py-1 rounded-md border flex items-center gap-1 transition-colors ${
              syncScroll
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
            title="양쪽 창의 스크롤 위치를 동시에 연동합니다."
          >
            <span>{syncScroll ? '🔗 스크롤 연동 켜짐' : '🔓 스크롤 독립'}</span>
          </button>

          {/* 서체 토글 */}
          <div className="flex bg-black/20 p-0.5 rounded border border-white/10">
            <button
              onClick={() => setFontFamily('serif')}
              className={`px-2 py-0.5 rounded text-[11px] ${fontFamily === 'serif' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'}`}
            >
              바탕/명조
            </button>
            <button
              onClick={() => setFontFamily('sans')}
              className={`px-2 py-0.5 rounded text-[11px] ${fontFamily === 'sans' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'}`}
            >
              고딕
            </button>
          </div>

          {/* 폰트 크기 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFontSize(s => Math.max(12, s - 1))}
              className="px-1.5 py-0.5 rounded bg-black/20 hover:bg-black/30 border border-white/10"
              title="글자 크기 축소"
            >
              -
            </button>
            <span className="font-mono w-6 text-center">{fontSize}px</span>
            <button
              onClick={() => setFontSize(s => Math.min(24, s + 1))}
              className="px-1.5 py-0.5 rounded bg-black/20 hover:bg-black/30 border border-white/10"
              title="글자 크기 확대"
            >
              +
            </button>
          </div>

          {/* 테마 선택 */}
          <div className="flex bg-black/20 p-0.5 rounded border border-white/10">
            <button
              onClick={() => setTheme('dark')}
              className={`px-2 py-0.5 rounded text-[11px] ${theme === 'dark' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400'}`}
            >
              다크
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`px-2 py-0.5 rounded text-[11px] ${theme === 'sepia' ? 'bg-[#f4ebd9] text-[#5c4731] font-bold' : 'text-zinc-400'}`}
            >
              세피아
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-2 py-0.5 rounded text-[11px] ${theme === 'light' ? 'bg-white text-zinc-900 font-bold' : 'text-zinc-400'}`}
            >
              라이트
            </button>
          </div>
        </div>
      </div>

      {/* 토스트 메시지 */}
      {copyToast && (
        <div className="bg-amber-500 text-zinc-950 font-bold text-xs px-4 py-2 text-center animate-fade-in shadow-md">
          {copyToast}
        </div>
      )}

      {/* 1. 편집/직접 붙여넣기 뷰 */}
      {activeTab === 'edit' && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {/* 좌측 입력 에어리어 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-rose-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                {leftLabel} (원본/이전 버전)
              </span>
              <span className="text-zinc-500 font-mono">
                {stats.leftLen.toLocaleString()}자 (공백제외 {stats.leftLenNoSpace.toLocaleString()}자)
              </span>
            </div>
            <textarea
              value={leftText}
              onChange={e => setLeftText(e.target.value)}
              placeholder="여기에 비교할 첫 번째 버전(또는 이전 챕터 원고)을 붙여넣으세요..."
              rows={18}
              className="w-full bg-black/30 border border-zinc-700/80 rounded-lg p-3 text-sm leading-relaxed focus:outline-none focus:border-amber-500 font-serif resize-y"
            />
            <div className="flex justify-between items-center text-xs">
              <button
                onClick={() => setLeftText('')}
                className="text-zinc-500 hover:text-zinc-300 underline"
              >
                좌측 비우기
              </button>
              <button
                onClick={() => handleCopyText(leftText, '좌측 버전')}
                className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-zinc-300"
              >
                📋 내용 복사
              </button>
            </div>
          </div>

          {/* 우측 입력 에어리어 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                {rightLabel} (수정/신규 버전)
              </span>
              <span className="text-zinc-500 font-mono">
                {stats.rightLen.toLocaleString()}자 (공백제외 {stats.rightLenNoSpace.toLocaleString()}자)
              </span>
            </div>
            <textarea
              value={rightText}
              onChange={e => setRightText(e.target.value)}
              placeholder="여기에 비교할 두 번째 버전(또는 수정된 챕터 원고)을 붙여넣으세요..."
              rows={18}
              className="w-full bg-black/30 border border-zinc-700/80 rounded-lg p-3 text-sm leading-relaxed focus:outline-none focus:border-amber-500 font-serif resize-y"
            />
            <div className="flex justify-between items-center text-xs">
              <button
                onClick={() => setRightText('')}
                className="text-zinc-500 hover:text-zinc-300 underline"
              >
                우측 비우기
              </button>
              <button
                onClick={() => handleCopyText(rightText, '우측 버전')}
                className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-zinc-300"
              >
                📋 내용 복사
              </button>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-center mt-2">
            <button
              onClick={() => setActiveTab('compare')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>🔍</span> 변경점 나란히 비교하기
            </button>
          </div>
        </div>
      )}

      {/* 2. 나란히(Side-by-Side) Diff 뷰 */}
      {activeTab === 'compare' && (
        <div className="flex flex-col flex-1">
          {/* 컬럼 헤더 & 채택 액션 바 */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-white/10 text-xs">
            {/* 좌측 패널 헤더 */}
            <div className={`p-3 flex items-center justify-between border-r border-white/10 ${themeStyles.header}`}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="font-bold text-rose-400">{leftLabel}</span>
                <span className="text-zinc-400 font-mono text-[11px]">
                  ({stats.leftLen.toLocaleString()}자)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyText(leftText, leftLabel)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-[11px] transition-colors"
                  title="좌측 전체 복사"
                >
                  📋 복사
                </button>
                {onAdoptLeft && (
                  <button
                    onClick={() => onAdoptLeft(leftText)}
                    className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded font-semibold text-[11px] transition-colors"
                  >
                    👈 이 버전 전체 채택
                  </button>
                )}
              </div>
            </div>

            {/* 우측 패널 헤더 */}
            <div className={`p-3 flex items-center justify-between ${themeStyles.header}`}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-emerald-400">{rightLabel}</span>
                <span className="text-zinc-400 font-mono text-[11px]">
                  ({stats.rightLen.toLocaleString()}자)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyText(rightText, rightLabel)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-[11px] transition-colors"
                  title="우측 전체 복사"
                >
                  📋 복사
                </button>
                {onAdoptRight && (
                  <button
                    onClick={() => onAdoptRight(rightText)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 px-3 py-1 rounded font-bold text-[11px] transition-colors shadow"
                  >
                    👉 이 버전 최종 채택
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 본문 비교 스크롤 컨테이너 */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 divide-x divide-white/10 max-h-[70vh] overflow-y-auto ${
              fontFamily === 'serif' ? 'font-serif' : 'font-sans'
            }`}
            style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
          >
            {/* 좌측 패널 (Left Lines) */}
            <div
              ref={leftScrollRef}
              onScroll={() => handleScroll('left')}
              className="overflow-y-auto overflow-x-hidden select-text divide-y divide-white/5"
            >
              {diffRows.map((row, idx) => {
                const item = row.left;
                return (
                  <div
                    key={`left-${idx}`}
                    className={`flex group transition-colors min-h-[32px] ${
                      item.type === 'modified'
                        ? themeStyles.modifiedLeft
                        : item.type === 'removed'
                        ? themeStyles.removed
                        : item.type === 'empty'
                        ? themeStyles.empty
                        : themeStyles.unchanged
                    }`}
                  >
                    {/* 라인 번호 */}
                    <div
                      className={`w-10 flex-shrink-0 text-right pr-2 select-none text-[11px] font-mono py-1.5 ${themeStyles.lineNum}`}
                    >
                      {item.lineNum ?? ''}
                    </div>

                    {/* 라인 본문 */}
                    <div className="flex-1 px-3 py-1.5 whitespace-pre-wrap break-words relative">
                      {item.type === 'modified' && item.wordDiffs ? (
                        item.wordDiffs.map((w, wIdx) =>
                          w.removed ? (
                            <span key={wIdx} className={themeStyles.wordDel}>
                              {w.value}
                            </span>
                          ) : (
                            <span key={wIdx}>{w.value}</span>
                          )
                        )
                      ) : item.type === 'empty' ? (
                        <span className="italic text-xs opacity-40 font-sans">
                          (해당 단락 없음)
                        </span>
                      ) : (
                        item.content
                      )}

                      {/* 단락 머지 버튼 (Left -> Right) */}
                      {!readOnly && item.type !== 'empty' && row.right.type === 'empty' && (
                        <button
                          onClick={() => handleMergeLine(idx, 'toRight')}
                          className="opacity-0 group-hover:opacity-100 absolute right-2 top-1.5 bg-zinc-800/90 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded shadow transition-all"
                          title="이 단락을 우측 버전으로 복사"
                        >
                          👉 우측 반영
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 우측 패널 (Right Lines) */}
            <div
              ref={rightScrollRef}
              onScroll={() => handleScroll('right')}
              className="overflow-y-auto overflow-x-hidden select-text divide-y divide-white/5"
            >
              {diffRows.map((row, idx) => {
                const item = row.right;
                return (
                  <div
                    key={`right-${idx}`}
                    className={`flex group transition-colors min-h-[32px] ${
                      item.type === 'modified'
                        ? themeStyles.modifiedRight
                        : item.type === 'added'
                        ? themeStyles.added
                        : item.type === 'empty'
                        ? themeStyles.empty
                        : themeStyles.unchanged
                    }`}
                  >
                    {/* 라인 번호 */}
                    <div
                      className={`w-10 flex-shrink-0 text-right pr-2 select-none text-[11px] font-mono py-1.5 ${themeStyles.lineNum}`}
                    >
                      {item.lineNum ?? ''}
                    </div>

                    {/* 라인 본문 */}
                    <div className="flex-1 px-3 py-1.5 whitespace-pre-wrap break-words relative">
                      {item.type === 'modified' && item.wordDiffs ? (
                        item.wordDiffs.map((w, wIdx) =>
                          w.added ? (
                            <span key={wIdx} className={themeStyles.wordAdd}>
                              {w.value}
                            </span>
                          ) : (
                            <span key={wIdx}>{w.value}</span>
                          )
                        )
                      ) : item.type === 'empty' ? (
                        <span className="italic text-xs opacity-40 font-sans">
                          (해당 단락 없음)
                        </span>
                      ) : (
                        item.content
                      )}

                      {/* 단락 머지 버튼 (Right -> Left) */}
                      {!readOnly && item.type !== 'empty' && row.left.type === 'empty' && (
                        <button
                          onClick={() => handleMergeLine(idx, 'toLeft')}
                          className="opacity-0 group-hover:opacity-100 absolute right-2 top-1.5 bg-zinc-800/90 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded shadow transition-all"
                          title="이 단락을 좌측 버전으로 복사"
                        >
                          👈 좌측 반영
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
