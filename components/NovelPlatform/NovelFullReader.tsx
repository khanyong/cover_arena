import React, { useState } from 'react';
import { NovelDetails, NovelParagraph, getParagraphText } from './novelData';
import { NovelDiffViewer } from './NovelDiffViewer';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface NovelFullReaderProps {
  novel: NovelDetails;
  customVersionMap: Record<string, string>;
  onAddNewVersion: (
    paragraphId: string,
    newVersionKey: string,
    content: string,
    note: string
  ) => void;
  onParagraphVersionChange: (paragraphId: string, versionKey: string) => void;
}

export const NovelFullReader: React.FC<NovelFullReaderProps> = ({
  novel,
  customVersionMap,
  onAddNewVersion,
  onParagraphVersionChange
}) => {
  // 현재 클릭해서 편집 중인 단락 상태
  const [editingParagraph, setEditingParagraph] = useState<NovelParagraph | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editVersionTag, setEditVersionTag] = useState('');
  const [editNote, setEditNote] = useState('');
  const [showDiffInModal, setShowDiffInModal] = useState(false);
  const [compareTargetVersion, setCompareTargetVersion] = useState<string>('');

  // 폰트 크기 조절 (독서 편의용)
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('lg');
  
  // 저장 성공 알림 메시지
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 단락 클릭 시 수정 모달 열기
  const handleParagraphClick = (paragraph: NovelParagraph) => {
    const currentVerKey = customVersionMap[paragraph.id] || paragraph.activeVersion;
    const currentText = getParagraphText(paragraph, currentVerKey);

    // 다음 추천 버전명 계산 (예: v2.0 -> v2.1)
    const verKeys = Object.keys(paragraph.versions);
    let nextVerTag = 'v2.1';
    if (verKeys.length > 0) {
      const lastVer = verKeys[verKeys.length - 1];
      const match = lastVer.match(/^v(\d+)\.(\d+)$/);
      if (match) {
        const major = match[1];
        const minor = parseInt(match[2], 10) + 1;
        nextVerTag = `v${major}.${minor}`;
      } else {
        nextVerTag = `${lastVer}-new`;
      }
    }

    setEditingParagraph(paragraph);
    setEditContent(currentText);
    setEditVersionTag(nextVerTag);
    setEditNote('전체 창에서 즉시 수정 업데이트');
    setShowDiffInModal(false);
    setCompareTargetVersion(currentVerKey);
  };

  // 모달에서 저장 클릭 시
  const handleSaveParagraph = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParagraph || !editContent.trim()) return;

    onAddNewVersion(
      editingParagraph.id,
      editVersionTag.trim() || 'v2.1',
      editContent,
      editNote.trim() || '소설 뷰어에서 인라인 수정'
    );

    showToast(`단락이 새로운 버전(${editVersionTag})으로 업데이트되었습니다!`);
    setEditingParagraph(null);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-sm leading-relaxed';
      case 'base':
        return 'text-base leading-relaxed';
      case 'lg':
        return 'text-lg leading-loose';
      case 'xl':
        return 'text-xl leading-loose';
      default:
        return 'text-lg leading-loose';
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-zinc-950 px-5 py-3 rounded-xl font-bold shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <span>✅</span> {toastMessage}
        </div>
      )}

      {/* Reader Control Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sticky top-20 z-40 backdrop-blur shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
            📖 FULL CONTINUOUS READER
          </span>
          <span className="text-xs text-zinc-400">
            💡 본문의 **어느 단락이든 클릭**하면 해당 단락을 수정하고 새 버전으로 등록할 수 있습니다.
          </span>
        </div>

        {/* Font Size Adjuster */}
        <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <span className="text-zinc-500 px-2 font-mono">글자 크기:</span>
          {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => setFontSize(sz)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold uppercase transition-all ${
                fontSize === sz
                  ? 'bg-amber-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Full Novel Document Sheet */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 lg:p-12 shadow-2xl space-y-12">
        {/* Title Header */}
        <div className="text-center pb-8 border-b border-zinc-800/80 space-y-3">
          <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">
            MASTER NOVEL READ & EDIT MODE
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
            {novel.title}
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
            {novel.subtitle}
          </p>
          <div className="text-xs text-amber-300/80 font-mono pt-2">
            저자: {novel.author} | 최신 업데이트: {novel.updatedAt}
          </div>
        </div>

        {/* Acts & Chapters Loop */}
        {novel.acts.map((act) => (
          <div key={act.number} className="space-y-10">
            {/* Act Title */}
            <div className="border-b border-amber-500/30 pb-4 pt-6">
              <h2 className="text-2xl font-black text-amber-400 flex items-center gap-2">
                <span>🎬</span> {act.title}
              </h2>
              {act.summary && (
                <p className="text-xs text-zinc-400 mt-1">{act.summary}</p>
              )}
            </div>

            {/* Chapters */}
            {act.chapters.map((ch) => (
              <div
                key={ch.number}
                id={`full-act-${act.number}-ch-${ch.number}`}
                className="space-y-6 scroll-mt-28"
              >
                <div className="bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl">
                  <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                    <span>📖</span> {ch.title}
                  </h3>
                  {ch.synopsis && (
                    <p className="text-xs text-zinc-400 mt-1">{ch.synopsis}</p>
                  )}
                </div>

                {/* Paragraphs Continuous Text Container */}
                <div className="space-y-4 font-sans text-zinc-200">
                  {ch.paragraphs.map((p) => {
                    const activeVerKey = customVersionMap[p.id] || p.activeVersion;
                    const content = getParagraphText(p, activeVerKey);

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleParagraphClick(p)}
                        className={`group relative p-4 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-amber-500/40 hover:bg-amber-500/5 ${getFontSizeClass()}`}
                        title="클릭하여 이 단락 수정 & 새 버전 생성"
                      >
                        {/* Hover Quick Edit Badge */}
                        <div className="absolute top-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-zinc-950 text-xs px-2.5 py-1 rounded-md font-bold shadow-lg flex items-center gap-1">
                          <span>✏️</span> 클릭해서 단락 수정 ({activeVerKey})
                        </div>

                        {/* Version Indicator Tag */}
                        <div className="inline-block text-[11px] font-mono text-amber-400/80 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 mb-1.5 mr-2 select-none">
                          {activeVerKey}
                        </div>

                        {/* Paragraph Content with Paragraph Breaks */}
                        <div className="whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none novel-math-prose">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* End of Novel Sheet */}
        <div className="text-center pt-12 border-t border-zinc-800 text-zinc-500 text-xs font-mono">
          [ 소설 전체 본문 읽기 종료 - 모든 단락은 최신 버전으로 연동됩니다 ]
        </div>
      </div>

      {/* Paragraph Edit Modal */}
      {editingParagraph && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                  단락 인라인 퀵 에디터
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  단락 내용 수정 & 버전 생성 ({editingParagraph.id})
                </h3>
              </div>
              <button
                onClick={() => setEditingParagraph(null)}
                className="text-zinc-500 hover:text-zinc-300 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Current Active Version Info */}
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
              <div className="text-zinc-400">
                현재 활성 버전:{' '}
                <span className="text-amber-300 font-mono font-bold">
                  {customVersionMap[editingParagraph.id] || editingParagraph.activeVersion}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDiffInModal(!showDiffInModal)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-amber-300 px-3 py-1 rounded font-semibold transition-colors"
                >
                  {showDiffInModal ? '에디터로 돌아가기' : '🔍 기존 버전과 Diff 비교'}
                </button>
              </div>
            </div>

            {/* Version Diff View in Modal */}
            {showDiffInModal ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-semibold">비교할 과거 버전 선택:</span>
                  <select
                    value={compareTargetVersion}
                    onChange={(e) => setCompareTargetVersion(e.target.value)}
                    className="bg-zinc-950 border border-zinc-700 rounded px-2.5 py-1 text-amber-300 font-mono"
                  >
                    {Object.keys(editingParagraph.versions).map((vKey) => (
                      <option key={vKey} value={vKey}>
                        {vKey} ({editingParagraph.versions[vKey].note || '버전'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950">
                  <h4 className="text-xs font-bold text-zinc-400 mb-2">
                    [{compareTargetVersion}] 버전과 현재 작성 중인 텍스트 비교:
                  </h4>
                  <NovelDiffViewer
                    oldContent={getParagraphText(editingParagraph, compareTargetVersion)}
                    newContent={editContent}
                    oldVersionLabel={`과거 ${compareTargetVersion}`}
                    newVersionLabel="작성 중인 내용"
                  />
                </div>
              </div>
            ) : (
              /* Edit Form */
              <form onSubmit={handleSaveParagraph} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">
                      새 버전 태그 / 번호
                    </label>
                    <input
                      type="text"
                      value={editVersionTag}
                      onChange={(e) => setEditVersionTag(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                      placeholder="v2.1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">
                      수정 메모 (Note)
                    </label>
                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-zinc-200 focus:outline-none focus:border-amber-500"
                      placeholder="예: 수식 설명 보강, 감정 묘사 강화"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 font-semibold mb-1">
                    단락 본문 내용 (수식 및 문장 수정)
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={8}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl p-4 text-base text-zinc-100 font-sans leading-relaxed focus:outline-none focus:border-amber-500 shadow-inner"
                    required
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingParagraph(null)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-5 py-2.5 rounded-xl font-semibold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>💾</span> 새 버전으로 저장 및 전체 반영
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
