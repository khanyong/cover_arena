import React, { useState } from 'react';
import { NovelParagraph, getParagraphText } from './novelData';
import { NovelDiffViewer } from './NovelDiffViewer';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface NovelParagraphViewerProps {
  paragraph: NovelParagraph;
  allVersions: string[];
  selectedVersion: string;
  onVersionChange: (paragraphId: string, versionKey: string) => void;
  onAddNewVersion: (paragraphId: string, newVersionKey: string, content: string, note: string) => void;
}

export const NovelParagraphViewer: React.FC<NovelParagraphViewerProps> = ({
  paragraph,
  allVersions,
  selectedVersion,
  onVersionChange,
  onAddNewVersion
}) => {
  const [showDiff, setShowDiff] = useState(false);
  const [diffCompareVersion, setDiffCompareVersion] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const availableVersionKeys = Object.keys(paragraph.versions);
  const currentText = getParagraphText(paragraph, selectedVersion);
  const currentVersionMeta = paragraph.versions[selectedVersion];

  // 새 버전 작성 폼 상태
  const [newVerName, setNewVerName] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editNote, setEditNote] = useState('');

  const handleStartEdit = () => {
    // 다음 추천 버전명 계산 (예: v2.0 -> v2.1)
    const latestVer = availableVersionKeys[availableVersionKeys.length - 1] || 'v1.0';
    let nextVer = 'v2.1';
    if (latestVer.startsWith('v')) {
      const parts = latestVer.replace('v', '').split('.');
      if (parts.length >= 2) {
        const major = parseInt(parts[0], 10);
        const minor = parseInt(parts[1], 10) + 1;
        nextVer = `v${major}.${minor}`;
      } else {
        nextVer = `${latestVer}.1`;
      }
    }
    setNewVerName(nextVer);
    setEditContent(currentText);
    setEditNote('');
    setIsEditing(true);
  };

  const handleSaveNewVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVerName.trim() || !editContent.trim()) return;
    onAddNewVersion(paragraph.id, newVerName.trim(), editContent, editNote);
    setIsEditing(false);
  };

  // Diff 비교할 과거 버전 찾기
  const oldCompareVersionKey = diffCompareVersion || availableVersionKeys.find(v => v !== selectedVersion) || availableVersionKeys[0];
  const oldCompareText = oldCompareVersionKey ? getParagraphText(paragraph, oldCompareVersionKey) : '';

  return (
    <div className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/40 rounded-xl p-5 mb-5 transition-all duration-200">
      {/* 단락 헤더 및 버전 조종바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/10 text-amber-400 font-mono px-2.5 py-1 rounded-md border border-amber-500/20 font-semibold">
            {paragraph.id}
          </span>
          {paragraph.commentary && (
            <span className="text-zinc-400 italic bg-zinc-800/50 px-2 py-0.5 rounded">
              💡 {paragraph.commentary}
            </span>
          )}
        </div>

        {/* 버전 셀렉터 및 액션 버튼들 */}
        <div className="flex items-center gap-2">
          {/* 버전 선택 Dropdown */}
          <div className="flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">
            <span className="text-zinc-500 font-medium">버전:</span>
            <select
              value={selectedVersion}
              onChange={(e) => onVersionChange(paragraph.id, e.target.value)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
            >
              {availableVersionKeys.map((verKey) => (
                <option key={verKey} value={verKey} className="bg-zinc-900 text-zinc-200">
                  {verKey} {verKey === paragraph.activeVersion ? '(최신)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 과거 버전과 비교 버튼 */}
          {availableVersionKeys.length > 1 && (
            <button
              onClick={() => setShowDiff(!showDiff)}
              className={`px-3 py-1 rounded-md font-medium transition-colors border ${
                showDiff
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
            >
              {showDiff ? 'Diff 닫기' : '🔍 이전 버전과 비교'}
            </button>
          )}

          {/* 수정 및 새 버전 생성 버튼 */}
          <button
            onClick={handleStartEdit}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-md font-medium transition-colors"
          >
            ✏️ 새 버전으로 업데이트
          </button>
        </div>
      </div>

      {/* 과거 버전 비교 (Diff) 영역 */}
      {showDiff && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 text-xs text-zinc-400">
            <span className="font-semibold text-amber-400">버전 비교 모드</span>
            <div className="flex items-center gap-2">
              <span>비교 대상 버전:</span>
              <select
                value={oldCompareVersionKey}
                onChange={(e) => setDiffCompareVersion(e.target.value)}
                className="bg-zinc-950 text-zinc-300 border border-zinc-700 rounded px-2 py-0.5"
              >
                {availableVersionKeys.map((ver) => (
                  <option key={ver} value={ver}>
                    {ver}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <NovelDiffViewer
            oldContent={oldCompareText}
            newContent={currentText}
            oldVersionLabel={`과거 ${oldCompareVersionKey}`}
            newVersionLabel={`선택한 ${selectedVersion}`}
          />
        </div>
      )}

      {/* 새 버전 생성 폼 (Editing Mode) */}
      {isEditing ? (
        <form onSubmit={handleSaveNewVersion} className="bg-zinc-950 border border-amber-500/30 rounded-lg p-4 mt-3">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800 text-xs">
            <span className="font-bold text-amber-400">새 버전 생성 및 단락 수정</span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">신규 버전 태그:</span>
              <input
                type="text"
                value={newVerName}
                onChange={(e) => setNewVerName(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-amber-300 font-mono text-xs w-24 focus:outline-none focus:border-amber-500"
                placeholder="예: v2.1"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs text-zinc-400 mb-1">소설 단락 본문</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={5}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-zinc-100 text-sm leading-relaxed focus:outline-none focus:border-amber-500 font-sans"
              placeholder="단락 본문을 작성하거나 수정하세요..."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs text-zinc-400 mb-1">수정 이유 / 작가 노트</label>
            <input
              type="text"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
              placeholder="예: 과거 v1.0의 분위기를 살려 대사 보강 및 공간 등고선 묘사 수정"
            />
          </div>

          <div className="flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-1.5 rounded transition-colors"
            >
              저장 및 버전 업데이트
            </button>
          </div>
        </form>
      ) : (
        /* 본문 및 작가 노트 표시 */
        <div>
          <div className="text-zinc-100 text-base leading-relaxed whitespace-pre-wrap font-sans prose prose-invert max-w-none novel-math-prose">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {currentText}
            </ReactMarkdown>
          </div>

          {currentVersionMeta?.note && (
            <div className="mt-3 text-xs text-amber-400/80 bg-amber-500/5 px-3 py-1.5 rounded border border-amber-500/10 flex items-center gap-2">
              <span>✍️ 작가 노트 ({currentVersionMeta.version}):</span>
              <span>{currentVersionMeta.note}</span>
              {currentVersionMeta.createdAt && (
                <span className="ml-auto text-zinc-500 text-[10px]">
                  {currentVersionMeta.createdAt}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
