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
  onSaveAiPrompt?: (paragraphId: string, targetVersion: string, prompt: string) => void;
  onDeleteParagraph?: (paragraphId: string) => void;
  onInsertParagraph?: (paragraphId: string) => void;
  onInsertChapter?: (actNumber: number, chapterNumber: number) => void;
  onUpdateActMetadata?: (actNumber: number, title: string, summary?: string) => void;
  onUpdateChapterMetadata?: (actNumber: number, chapterNumber: number, title: string, synopsis?: string) => void;
}

export const NovelFullReader: React.FC<NovelFullReaderProps> = ({
  novel,
  customVersionMap,
  onAddNewVersion,
  onParagraphVersionChange,
  onSaveAiPrompt,
  onDeleteParagraph,
  onInsertParagraph,
  onInsertChapter,
  onUpdateActMetadata,
  onUpdateChapterMetadata
}) => {
  // 현재 클릭해서 편집 중인 단락 상태
  const [editingParagraph, setEditingParagraph] = useState<NovelParagraph | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editVersionTag, setEditVersionTag] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editAiPrompt, setEditAiPrompt] = useState('');
  const [showDiffInModal, setShowDiffInModal] = useState(false);
  const [compareTargetVersion, setCompareTargetVersion] = useState<string>('');

  // 폰트 크기 조절 (독서 편의용)
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('lg');
  
  // 저장 성공 알림 메시지
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 막/장 메타데이터 인라인 편집 상태
  const [editingAct, setEditingAct] = useState<number | null>(null);
  const [actEditTitle, setActEditTitle] = useState('');
  const [actEditSummary, setActEditSummary] = useState('');

  const [editingChapter, setEditingChapter] = useState<{actNumber: number, chapterNumber: number} | null>(null);
  const [chapterEditTitle, setChapterEditTitle] = useState('');
  const [chapterEditSynopsis, setChapterEditSynopsis] = useState('');

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
      const lastVer = currentVerKey;
      
      if (lastVer === 'v_en') {
        nextVerTag = 'v_en-0.0.1';
      } else if (lastVer.startsWith('v_en-')) {
        const suffix = lastVer.replace('v_en-', '');
        const numMatch = suffix.match(/^(\d+)\.(\d+)\.(\d+)$/);
        if (numMatch) {
          nextVerTag = `v_en-${numMatch[1]}.${numMatch[2]}.${parseInt(numMatch[3], 10) + 1}`;
        } else {
          nextVerTag = 'v_en-0.0.1';
        }
      } else {
        const match = lastVer.match(/^v(\d+)\.(\d+)$/);
        if (match) {
          const major = match[1];
          const minor = parseInt(match[2], 10) + 1;
          nextVerTag = `v${major}.${minor}`;
        } else {
          nextVerTag = `${lastVer}-1`;
        }
      }
    }

    setEditingParagraph(paragraph);
    setEditContent(currentText);
    setEditVersionTag(nextVerTag);
    setEditNote('전체 창에서 즉시 수정 업데이트');
    setEditAiPrompt(''); // 항상 빈칸으로 시작 (새로운 지시사항 작성용)
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

    if (onSaveAiPrompt && editAiPrompt.trim()) {
      onSaveAiPrompt(editingParagraph.id, editVersionTag.trim() || 'v2.1', editAiPrompt);
    }

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
            <div className="border-b border-amber-500/30 pb-4 pt-6 group relative">
              {editingAct === act.number ? (
                <div className="bg-zinc-950 border border-amber-500/50 p-4 rounded-xl space-y-3 shadow-lg">
                  <input
                    value={actEditTitle}
                    onChange={(e) => setActEditTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xl font-black text-amber-400 focus:outline-none focus:border-amber-500"
                    placeholder="막 제목"
                  />
                  <textarea
                    value={actEditSummary}
                    onChange={(e) => setActEditSummary(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-zinc-300 focus:outline-none focus:border-amber-500"
                    placeholder="막 요약 (선택사항)"
                    rows={2}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingAct(null)}
                      className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => {
                        onUpdateActMetadata?.(act.number, actEditTitle, actEditSummary);
                        setEditingAct(null);
                        showToast('막 정보가 수정되었습니다.');
                      }}
                      className="px-3 py-1.5 text-xs bg-amber-500 text-zinc-950 font-bold rounded hover:bg-amber-400"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-amber-400 flex items-center gap-2">
                    <span>🎬</span> {act.title}
                    <button
                      onClick={() => {
                        setEditingAct(act.number);
                        setActEditTitle(act.title);
                        setActEditSummary(act.summary || '');
                      }}
                      className="ml-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✏️ 수정
                    </button>
                  </h2>
                  {act.summary && (
                    <p className="text-xs text-zinc-400 mt-1">{act.summary}</p>
                  )}
                </>
              )}
            </div>

            {/* Chapters */}
            {act.chapters.map((ch) => (
              <div
                key={ch.number}
                id={`full-act-${act.number}-ch-${ch.number}`}
                className="space-y-6 scroll-mt-28"
              >
                <div className="bg-zinc-950/60 border border-zinc-800/80 p-4 rounded-xl group relative">
                  {editingChapter?.actNumber === act.number && editingChapter?.chapterNumber === ch.number ? (
                    <div className="space-y-3">
                      <input
                        value={chapterEditTitle}
                        onChange={(e) => setChapterEditTitle(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-lg font-bold text-zinc-200 focus:outline-none focus:border-amber-500"
                        placeholder="장 제목"
                      />
                      <textarea
                        value={chapterEditSynopsis}
                        onChange={(e) => setChapterEditSynopsis(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-zinc-400 focus:outline-none focus:border-amber-500"
                        placeholder="장 시놉시스 (선택사항)"
                        rows={2}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingChapter(null)}
                          className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => {
                            onUpdateChapterMetadata?.(act.number, ch.number, chapterEditTitle, chapterEditSynopsis);
                            setEditingChapter(null);
                            showToast('장 정보가 수정되었습니다.');
                          }}
                          className="px-3 py-1.5 text-xs bg-amber-500 text-zinc-950 font-bold rounded hover:bg-amber-400"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                        <span>📖</span> {ch.title}
                        <button
                          onClick={() => {
                            setEditingChapter({ actNumber: act.number, chapterNumber: ch.number });
                            setChapterEditTitle(ch.title);
                            setChapterEditSynopsis(ch.synopsis || '');
                          }}
                          className="ml-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✏️ 수정
                        </button>
                      </h3>
                      {ch.synopsis && (
                        <p className="text-xs text-zinc-400 mt-1">{ch.synopsis}</p>
                      )}
                    </>
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

                        {/* Version Indicator Tag and AI Prompt */}
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <div className="inline-block text-[11px] font-mono text-amber-400/80 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 select-none">
                            {activeVerKey}
                          </div>
                          {(() => {
                            const latestPrompt = p.aiPrompts && p.aiPrompts.length > 0 
                              ? p.aiPrompts[p.aiPrompts.length - 1].prompt 
                              : p.aiPrompt;
                            if (!latestPrompt) return null;
                            return (
                              <div className="inline-flex items-center gap-1 text-[11px] text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 max-w-full">
                                <span>🤖</span>
                                <span className="truncate" title={latestPrompt}>{latestPrompt}</span>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Paragraph Content with Paragraph Breaks */}
                        <div className="whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none novel-math-prose">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              code({node, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '');
                                if (!match) {
                                  return (
                                    <mark
                                      className="bg-amber-500/30 text-amber-200 px-1 py-0.5 rounded shadow-sm font-semibold mx-0.5"
                                      {...props}
                                    >
                                      {children}
                                    </mark>
                                  );
                                }
                                return (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              }
                            }}
                          >
                            {content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Add Chapter Button */}
                {onInsertChapter && (
                  <div className="mt-6 flex justify-center border-t border-zinc-800/50 pt-4">
                    <button
                      onClick={() => {
                        onInsertChapter(act.number, ch.number);
                        // Optional: Add a toast notification here if you want
                      }}
                      className="text-xs bg-zinc-800/50 hover:bg-zinc-700/80 text-zinc-400 hover:text-zinc-200 px-4 py-2 rounded-full transition-all border border-zinc-700/50 flex items-center gap-2"
                    >
                      <span>➕</span> 여기에 새 챕터 추가하기
                    </button>
                  </div>
                )}
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

                {/* AI Prompts Timeline & Input */}
                <div className="space-y-2">
                  <label className="block text-zinc-400 font-semibold mb-1">
                    AI 수정 지시 히스토리
                  </label>
                  
                  {/* Timeline */}
                  {(editingParagraph.aiPrompts?.length || editingParagraph.aiPrompt) ? (
                    <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2 mb-3 scrollbar-thin scrollbar-thumb-zinc-700">
                      {(!editingParagraph.aiPrompts && editingParagraph.aiPrompt) && (
                        <div className="flex gap-2 text-xs">
                          <span className="text-zinc-500 font-mono flex-shrink-0">[Legacy]</span>
                          <span className="text-zinc-300">{editingParagraph.aiPrompt}</span>
                        </div>
                      )}
                      {[...(editingParagraph.aiPrompts || [])].reverse().map((c) => (
                        <div key={c.id} className="flex gap-2 text-xs">
                          <span className="text-zinc-500 font-mono flex-shrink-0">[{c.targetVersion}]</span>
                          <span className="text-zinc-300">{c.prompt}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* New Comment Input */}
                  <textarea
                    value={editAiPrompt}
                    onChange={(e) => setEditAiPrompt(e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-sm text-blue-300 font-sans leading-relaxed focus:outline-none focus:border-blue-500"
                    placeholder="새로운 수정 지시사항이나 코멘트를 입력하세요..."
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs text-zinc-400 font-semibold">
                      단락 본문 내용 (수식 및 문장 수정)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById(`editor-full-${editingParagraph.id}`) as HTMLTextAreaElement;
                        if (!textarea) return;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = editContent;
                        const before = text.substring(0, start);
                        const selected = text.substring(start, end);
                        const after = text.substring(end, text.length);
                        
                        if (selected) {
                          setEditContent(`${before}\`${selected}\`${after}`);
                        } else {
                          setEditContent(`${before}\`강조할 문장\`${after}`);
                        }
                        
                        setTimeout(() => {
                          textarea.focus();
                        }, 0);
                      }}
                      className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 hover:bg-amber-500/30 transition-colors flex items-center gap-1"
                    >
                      <span>💡</span> 형광펜 칠하기
                    </button>
                  </div>
                  <textarea
                    id={`editor-full-${editingParagraph.id}`}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={8}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl p-4 text-base text-zinc-100 font-sans leading-relaxed focus:outline-none focus:border-amber-500 shadow-inner"
                    required
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-4 border-t border-zinc-800/60 mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(editContent);
                        showToast('단락 본문이 복사되었습니다!');
                      }}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2.5 rounded-xl font-semibold transition-colors"
                    >
                      📋 본문 전체 복사
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const currentVer = customVersionMap[editingParagraph.id] || editingParagraph.activeVersion;
                        const matchedComment = editingParagraph.aiPrompts?.find(c => c.targetVersion === currentVer)?.prompt
                                            || editingParagraph.aiPrompts?.slice(-1)[0]?.prompt
                                            || editingParagraph.aiPrompt
                                            || '';
                        
                        // 사용자가 입력 중인 새 코멘트가 있다면 그것을 우선순위로 복사, 아니면 히스토리에서 찾은 코멘트 복사
                        const promptToCopy = editAiPrompt.trim() ? editAiPrompt.trim() : matchedComment;
                        
                        const aiPromptSection = promptToCopy ? `\n\n[AI 수정 요청사항 / 가이드]\n${promptToCopy}` : '';
                        const textToCopy = `[현재 단락 본문]\n${editContent}${aiPromptSection}`;
                        navigator.clipboard.writeText(textToCopy);
                        showToast('본문과 코멘트가 함께 복사되었습니다!');
                      }}
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-2.5 rounded-xl font-semibold transition-colors border border-emerald-500/30"
                    >
                      📋 본문 + 코멘트 복사
                    </button>
                    {onDeleteParagraph && (
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteParagraph(editingParagraph.id);
                          setEditingParagraph(null);
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2.5 rounded-xl font-semibold transition-colors border border-red-500/20 ml-2"
                      >
                        🗑️ 단락 삭제
                      </button>
                    )}
                    {onInsertParagraph && (
                      <button
                        type="button"
                        onClick={() => {
                          onInsertParagraph(editingParagraph.id);
                          showToast('현재 단락 아래에 새 단락이 추가되었습니다.');
                          setEditingParagraph(null); // 모달 닫기 (배경에서 새 단락 확인 가능)
                        }}
                        className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 px-3 py-2.5 rounded-xl font-semibold transition-colors border border-purple-500/20 ml-2"
                      >
                        ⬇️ 아래에 새 단락 추가
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingParagraph(null)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2.5 rounded-xl font-semibold transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingParagraph || !onSaveAiPrompt || !editAiPrompt.trim()) return;
                        const currentVer = customVersionMap[editingParagraph.id] || editingParagraph.activeVersion;
                        onSaveAiPrompt(editingParagraph.id, currentVer, editAiPrompt);
                        showToast(`현재 버전에 대한 AI 코멘트가 추가되었습니다!`);
                        setEditAiPrompt('');
                        
                        // 로컬 상태 업데이트 (모달 닫지 않고 즉시 뷰 갱신)
                        const newComment = {
                          id: crypto.randomUUID(),
                          targetVersion: currentVer,
                          prompt: editAiPrompt,
                          createdAt: new Date().toISOString()
                        };
                        const updatedParagraph = { ...editingParagraph };
                        if (!updatedParagraph.aiPrompts) updatedParagraph.aiPrompts = [];
                        updatedParagraph.aiPrompts.push(newComment);
                        setEditingParagraph(updatedParagraph);
                      }}
                      className="bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold transition-all border border-blue-500/30"
                    >
                      🤖 코멘트 저장
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                    >
                      <span>💾</span> 새 버전 업데이트
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
