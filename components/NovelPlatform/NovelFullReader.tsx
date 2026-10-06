import React, { useState, useEffect, useRef } from 'react';
import { NovelDetails, NovelParagraph, NovelScene, getParagraphText, getSceneTitle } from './novelData';
import { NovelDiffViewer } from './NovelDiffViewer';
import { SceneRevisionBadge } from './SceneRevisionBadge';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { buildManagedSceneCopyText } from '../../shared/lib/rosKoBlockModel';
import { listReviewComments, saveReviewComment } from '../../shared/lib/novelReviewCommentClient';
import { listReviewGuidelines, saveReviewGuideline } from '../../shared/lib/novelReviewGuidelineClient';
import { buildSceneReviewPacket } from '../../shared/lib/novelSceneReviewPacket';
import { loadSceneTranslationComparison } from '../../shared/lib/novelTranslationComparison';
import { buildBilingualReviewPacket } from '../../shared/lib/novelBilingualReviewPacket';
import { ManagedBlockReviewDialog } from './ManagedBlockReviewDialog';
import { NovelBilingualReader, TranslationComparison } from './NovelBilingualReader';
import { SceneReviewCommentsPanel } from './SceneReviewCommentsPanel';
import { supabase, novels } from '../../shared/lib/supabase';

// Comment events are append-only. A delayed read must never replace a newer
// revision already returned by a successful save in this same actor scope.
const mergeReviewCommentRevisions = (current: any[], incoming: any[]): any[] => {
  const rows = new Map(current.map(comment => [comment.id, comment]));
  for (const comment of incoming) {
    const previous = rows.get(comment.id);
    if (!previous || Number(comment.revision) >= Number(previous.revision)) {
      rows.set(comment.id, comment);
    }
  }
  return [...rows.values()];
};

// Some legacy whole-chapter records contain escaped paragraph separators.
// Decode only consecutive escaped newlines so LaTeX commands such as `\nabla`
// remain untouched and the stored manuscript text is never mutated.
export const normalizeEscapedParagraphBreaks = (content: string): string =>
  content.replace(/(?:(?:\\r)?\\n){2,}/g, (escapedBreaks) => {
    const breakCount = escapedBreaks.match(/\\n/g)?.length ?? 0;
    return '\n'.repeat(breakCount);
  });

export const buildSceneCopyText = (
  scene: NovelScene,
  customVersionMap: Record<string, string>,
  draftOverride?: { paragraphId: string; content: string }
): string => {
  if (!scene.paragraphs?.length) return '';

  const blocks = scene.paragraphs.map((paragraph) => {
    if (draftOverride?.paragraphId === paragraph.id) {
      return draftOverride.content;
    }

    const versionKey = customVersionMap[paragraph.id] || paragraph.activeVersion;
    return getParagraphText(paragraph, versionKey);
  });

  return `${blocks.join('\n\n')}\n`;
};

export const writeTextToClipboard = async (text: string): Promise<void> => {
  // Run the synchronous path first so the browser still sees the original
  // button click as the user gesture. Awaiting a denied async Clipboard call
  // before this fallback would lose that gesture in some browser contexts.
  if (typeof document !== 'undefined') {
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.readOnly = true;
    textarea.setAttribute('aria-hidden', 'true');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    try {
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      if (document.execCommand('copy')) return;
    } finally {
      textarea.remove();
      previousFocus?.focus();
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  throw new Error('Clipboard is unavailable in this environment.');
};

interface NovelFullReaderProps {
  novel: NovelDetails;
  customVersionMap: Record<string, string>;
  onAddNewVersion: (
    paragraphId: string,
    newVersionKey: string,
    content: string,
    note: string
  ) => boolean | Promise<boolean>;
  onParagraphVersionChange: (paragraphId: string, versionKey: string) => void;
  onSaveAiPrompt?: (paragraphId: string, targetVersion: string, prompt: string) => void;
  onDeleteParagraph?: (paragraphId: string) => void;
  onInsertParagraph?: (paragraphId: string) => void;
  onInsertParagraphBefore?: (paragraphId: string) => void;
  onInsertChapter?: (actNumber: number, chapterNumber: number) => void;
  onInsertChapterBefore?: (actNumber: number, chapterNumber: number) => void;
  onDeleteChapter?: (actNumber: number, chapterNumber: number) => void;
  onInsertActAfter?: (actNumber: number) => void;
  onInsertActBefore?: (actNumber: number) => void;
  onDeleteAct?: (actNumber: number) => void;
  onUpdateActMetadata?: (actNumber: number, title: string, summary?: string) => void;
  onUpdateChapterMetadata: (actNum: number, chNum: number, title: string, synopsis?: string) => void;
  onInsertScene?: (actNum: number, chNum: number, targetSceneId: string) => void;
  onDeleteScene?: (actNum: number, chNum: number, sceneId: string) => void;
  onUpdateSceneMetadata?: (actNum: number, chNum: number, sceneId: string, title: string) => void;
  onManagedRevisionChange?: (sceneId: string, viewKey: string) => Promise<boolean>;
  requestedComparisonSceneId?: string;
  requestedComparisonKey?: number;
}

export const NovelFullReader: React.FC<NovelFullReaderProps> = ({
  novel,
  customVersionMap,
  onAddNewVersion,
  onParagraphVersionChange,
  onSaveAiPrompt,
  onDeleteParagraph,
  onInsertParagraph,
  onInsertParagraphBefore,
  onInsertChapter,
  onInsertChapterBefore,
  onDeleteChapter,
  onInsertActAfter,
  onInsertActBefore,
  onDeleteAct,
  onUpdateActMetadata,
  onUpdateChapterMetadata,
  onInsertScene,
  onDeleteScene,
  onUpdateSceneMetadata,
  onManagedRevisionChange,
  requestedComparisonSceneId,
  requestedComparisonKey = 0
}) => {
  // 현재 클릭해서 편집 중인 단락 상태
  const [editingParagraph, setEditingParagraph] = useState<NovelParagraph | null>(null);
  const [editingParagraphScene, setEditingParagraphScene] = useState<NovelScene | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editingParagraphId, setEditingParagraphId] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [editVersionTag, setEditVersionTag] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editAiPrompt, setEditAiPrompt] = useState('');
  const [showDiffInModal, setShowDiffInModal] = useState(false);
  const [compareTargetVersion, setCompareTargetVersion] = useState<string>('');
  const [reviewSelection, setReviewSelection] = useState<{ text: string; start: number; end: number } | undefined>();
  const [commentPanelSceneId, setCommentPanelSceneId] = useState<string | null>(null);
  const [commentsReload, setCommentsReload] = useState(0);
  const [commentActorId, setCommentActorId] = useState<string | null | undefined>(undefined);
  const commentActorRef = useRef<string | null | undefined>(undefined);
  const commentReadSequence = useRef(0);
  const [commentState, setCommentState] = useState<{ scope: string; rows: any[]; guidelines: any[]; loading: boolean; error: string }>({ scope: '', rows: [], guidelines: [], loading: false, error: '' });
  const managedScenes = novel.acts.flatMap(a => a.chapters.flatMap(ch => (ch.scenes || []).filter(s => s.managedSceneId)));
  const commentsScope = `${commentActorId || 'no-actor'}:${novel.slug}:${managedScenes.map(s => `${s.managedSceneId}:${s.managedReviewCompositionId || s.compositionRevisionId}`).join('|')}`;
  const activeCommentsScope = useRef(commentsScope);
  activeCommentsScope.current = commentsScope;
  const reviewComments = commentActorId && commentState.scope === commentsScope ? commentState.rows : [];
  const reviewGuidelines = commentActorId && commentState.scope === commentsScope ? commentState.guidelines : [];
  const commentPanelScene = managedScenes.find(s => s.id === commentPanelSceneId);
  const [comparisonSceneId, setComparisonSceneId] = useState<string | null>(null);
  const [comparisonReload, setComparisonReload] = useState(0);
  const [comparisonState, setComparisonState] = useState<{ scope: string; value: TranslationComparison | null; loading: boolean; error: string }>({ scope: '', value: null, loading: false, error: '' });
  const comparisonReadSequence = useRef(0);
  const comparisonReturnAnchor = useRef<string | null>(null);
  const consumedComparisonRequest = useRef('');
  const isComparableScene = (scene: NovelScene) => novel.slug === 'quantum-vibration-novel'
    && scene.id === 'b48a4f04' && scene.storageModel === 'ros-ko-block-v1'
    && Boolean(scene.managedSceneId && scene.compositionRevisionId) && scene.managedViewKey !== 'legacy';
  const comparisonScene = managedScenes.find(scene => isComparableScene(scene)
    && (scene.id === comparisonSceneId || scene.id === editingParagraphScene?.id));
  const comparisonScope = `${commentActorId || 'no-actor'}:${novel.slug}:${comparisonScene?.managedSceneId || ''}:${comparisonScene?.compositionRevisionId || ''}:${comparisonScene?.generation ?? ''}`;
  const activeComparisonScope = useRef(comparisonScope);
  activeComparisonScope.current = comparisonScope;
  const comparison = commentActorId && comparisonState.scope === comparisonScope ? comparisonState.value : null;
  const comparisonLoading = Boolean(comparisonScene) && (comparisonState.scope !== comparisonScope || comparisonState.loading);
  const comparisonError = comparisonState.scope === comparisonScope ? comparisonState.error : '';

  useEffect(() => {
    let cancelled = false;
    const sequence = ++comparisonReadSequence.current;
    setComparisonState({ scope: comparisonScope, value: null, loading: Boolean(comparisonScene && commentActorId), error: comparisonScene && commentActorId === null ? '로그인 후 영한 비교를 열어 주세요.' : '' });
    if (comparisonScene && commentActorId) {
      loadSceneTranslationComparison({ scene: comparisonScene, client: supabase }).then((value: TranslationComparison) => {
        if (!cancelled && sequence === comparisonReadSequence.current && commentActorRef.current === commentActorId
          && activeComparisonScope.current === comparisonScope) {
          setComparisonState({ scope: comparisonScope, value, loading: false, error: '' });
        }
      }).catch((caught: unknown) => {
        if (!cancelled && sequence === comparisonReadSequence.current && activeComparisonScope.current === comparisonScope) {
          setComparisonState({ scope: comparisonScope, value: null, loading: false, error: caught instanceof Error ? caught.message : '영한 대응을 불러오지 못했습니다.' });
        }
      });
    }
    return () => { cancelled = true; };
  }, [comparisonScope, comparisonReload]);

  useEffect(() => {
    // The callback only updates local state. Awaiting Supabase calls here can
    // deadlock its session lock; authorized reads run in the separate effect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const nextActor = session?.user?.id || null;
      if (commentActorRef.current !== nextActor || event === 'SIGNED_OUT') {
        commentActorRef.current = nextActor;
        commentReadSequence.current += 1;
        setCommentState({ scope: '', rows: [], guidelines: [], loading: false, error: '' });
        closeParagraphEditor();
        setCommentPanelSceneId(null);
        setComparisonSceneId(null);
        consumedComparisonRequest.current = '';
        comparisonReadSequence.current += 1;
        setComparisonState({ scope: '', value: null, loading: false, error: '' });
      }
      setCommentActorId(nextActor);
    });
    return () => {
      commentReadSequence.current += 1;
      commentActorRef.current = undefined;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sequence = ++commentReadSequence.current;
    const canRead = Boolean(commentActorId && managedScenes.length);
    setCommentState(current => ({
      scope: commentsScope,
      rows: current.scope === commentsScope ? current.rows : [],
      guidelines: current.scope === commentsScope ? current.guidelines : [],
      loading: commentActorId === undefined || canRead,
      error: commentActorId === null && managedScenes.length ? '로그인 후 코멘트를 확인해 주세요.' : ''
    }));
    if (canRead) {
      Promise.all(managedScenes.map(s => Promise.all([listReviewComments(s.managedSceneId), listReviewGuidelines(s.managedSceneId)]))).then(groups => {
        if (!cancelled && sequence === commentReadSequence.current
          && commentActorRef.current === commentActorId && activeCommentsScope.current === commentsScope) {
          const scopedGuidelines = new Map<string, any>();
          groups.forEach((group, index) => group[1].forEach(guideline => {
            const previous = scopedGuidelines.get(guideline.id);
            scopedGuidelines.set(guideline.id, {
              ...(previous && previous.revision > guideline.revision ? previous : guideline),
              _visibleIn: [...(previous?._visibleIn || []), managedScenes[index].managedSceneId]
            });
          }));
          setCommentState(current => ({
            scope: commentsScope,
            rows: mergeReviewCommentRevisions(current.scope === commentsScope ? current.rows : [], groups.flatMap(group => group[0])),
            guidelines: [...scopedGuidelines.values()],
            loading: false, error: ''
          }));
        }
      }).catch(error => {
        if (!cancelled && sequence === commentReadSequence.current
          && commentActorRef.current === commentActorId && activeCommentsScope.current === commentsScope) {
          setCommentState({ scope: commentsScope, rows: [], guidelines: [], loading: false, error: `코멘트·지침을 불러오지 못했습니다: ${error.message || error}` });
        }
      });
    }
    return () => { cancelled = true; };
  }, [commentActorId, commentsScope, commentsReload]);

  useEffect(() => {
    closeParagraphEditor();
    setCommentPanelSceneId(null);
    setComparisonSceneId(null);
    comparisonReturnAnchor.current = null;
  }, [novel.slug]);

  useEffect(() => {
    const requestScope = `${novel.slug}:${requestedComparisonSceneId || ''}:${requestedComparisonKey}`;
    if (!requestedComparisonSceneId) { consumedComparisonRequest.current = ''; return; }
    if (!commentActorId) return;
    const requestedScene = managedScenes.find(scene => scene.id === requestedComparisonSceneId && isComparableScene(scene));
    if (!requestedScene || consumedComparisonRequest.current === requestScope) return;
    consumedComparisonRequest.current = requestScope;
    comparisonReturnAnchor.current = requestedScene.paragraphs[0]?.id || null;
    setComparisonSceneId(requestedScene.id);
  }, [novel.slug, commentActorId, requestedComparisonSceneId, requestedComparisonKey, managedScenes.map(scene => `${scene.id}:${scene.compositionRevisionId}`).join('|')]);

  const persistReviewComment = async (scene: NovelScene, paragraph: NovelParagraph, input: any, existing?: any) => {
    const actor = commentActorRef.current;
    if (!actor || actor !== commentActorId) throw new Error('로그인 상태를 다시 확인해 주세요.');
    const saved = await saveReviewComment({ scene, paragraph, input, existing });
    if (commentActorRef.current !== actor || activeCommentsScope.current !== commentsScope) return true;
    // Invalidate reads begun before this write returned, including responses
    // that contain no row for this newly created comment yet.
    const sequence = ++commentReadSequence.current;
    setCommentState(current => current.scope === commentsScope ? {
      ...current, loading: false, error: '', rows: mergeReviewCommentRevisions(current.rows, [saved])
    } : current);
    // The RPC result is authoritative; refresh for concurrent note changes as well.
    try {
      const rows = await listReviewComments(scene.managedSceneId);
      if (sequence === commentReadSequence.current && commentActorRef.current === actor
        && activeCommentsScope.current === commentsScope) {
        setCommentState(current => current.scope === commentsScope ? {
          ...current, rows: mergeReviewCommentRevisions(current.rows, rows)
        } : current);
      }
    } catch {
      if (sequence === commentReadSequence.current && commentActorRef.current === actor
        && activeCommentsScope.current === commentsScope) {
        showToast('코멘트는 저장됐습니다. 목록 재조회는 다시 시도해 주세요.');
      }
    }
    return true;
  };

  const persistReviewGuideline = async (scene: NovelScene, input: any, existing?: any, paragraph?: NovelParagraph) => {
    const actor = commentActorRef.current;
    if (!actor || actor !== commentActorId) throw new Error('로그인 상태를 다시 확인해 주세요.');
    const saved = await saveReviewGuideline({ scene, paragraph, input, existing });
    if (commentActorRef.current !== actor || activeCommentsScope.current !== commentsScope) return true;
    commentReadSequence.current += 1;
    setCommentState(current => current.scope === commentsScope ? {
      ...current, loading: false, error: '', guidelines: mergeReviewCommentRevisions(current.guidelines, [{ ...saved, _visibleIn: current.guidelines.find(g => g.id === saved.id)?._visibleIn || [scene.managedSceneId] }])
    } : current);
    setCommentsReload(n => n + 1);
    return true;
  };

  const buildCurrentSceneReviewPacket = async (scene: NovelScene) => {
    const actor = commentActorRef.current;
    if (!actor || scene.managedReadOnly) throw new Error('로그인 후 최신 review 구성에서 검토본을 내려받아 주세요.');
    const [current, comments, guidelines] = await Promise.all([
      novels.getManagedSceneRevision(scene, null), listReviewComments(scene.managedSceneId), listReviewGuidelines(scene.managedSceneId)
    ]);
    if (current.error || !current.data) throw current.error || new Error('Scene 전문을 확인할 수 없습니다.');
    if (current.data.compositionRevisionId !== scene.compositionRevisionId) throw new Error('Scene 본문이 변경됐습니다. 새로고침 후 검토본을 내려받아 주세요.');
    const packet = await buildSceneReviewPacket({ scene: current.data, comments, guidelines, readerSlug: novel.slug || novel.id });
    if (commentActorRef.current !== actor || activeCommentsScope.current !== commentsScope) throw new Error('계정 또는 Scene이 변경되어 다운로드를 중단했습니다.');
    return packet;
  };

  const buildCurrentBilingualReviewPacket = async (scene: NovelScene) => {
    const actor = commentActorRef.current;
    const scope = activeComparisonScope.current;
    if (!actor || !isComparableScene(scene) || scene.managedReadOnly) throw new Error('최신 한국어 review 구성에서 영한 검토본을 만들어 주세요.');
    const [scenePacket, capturedComparison] = await Promise.all([
      buildCurrentSceneReviewPacket(scene), loadSceneTranslationComparison({ scene, client: supabase }),
    ]);
    const packet = await buildBilingualReviewPacket({ scenePacket, comparison: capturedComparison });
    if (commentActorRef.current !== actor || activeComparisonScope.current !== scope) throw new Error('계정 또는 구성이 변경되어 영한 검토본 생성을 중단했습니다.');
    return packet;
  };

  const openBilingualComparison = (scene: NovelScene) => {
    const visibleParagraph = scene.paragraphs.find(paragraph => {
      const rect = document.getElementById(`paragraph-${paragraph.id}`)?.getBoundingClientRect();
      return rect && rect.bottom > 120 && rect.top < window.innerHeight;
    });
    comparisonReturnAnchor.current = visibleParagraph?.id || scene.paragraphs[0]?.id || null;
    setComparisonSceneId(scene.id);
    setComparisonReload(value => value + 1);
  };

  const closeBilingualComparison = (scene: NovelScene) => {
    const anchor = comparisonReturnAnchor.current;
    setComparisonSceneId(null);
    requestAnimationFrame(() => document.getElementById(anchor ? `paragraph-${anchor}` : `scene-${scene.id}`)?.scrollIntoView({ block: 'center' }));
  };

  // 뷰 모드 (스크롤 vs 양면 책)
  const [viewMode, setViewMode] = useState<'scroll' | 'book'>('scroll');
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editingSceneTitle, setEditingSceneTitle] = useState<string>('');

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

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setCurrentMatchIndex(0);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results: string[] = [];
    novel.acts.forEach(act => {
      act.chapters.forEach(ch => {
        (ch.scenes || []).forEach(scene => (scene.paragraphs || []).forEach(p => {
          const activeVerKey = customVersionMap[p.id] || p.activeVersion;
          const content = getParagraphText(p, activeVerKey);
          if (content.toLowerCase().includes(q)) {
            results.push(p.id);
          }
        }));
      });
    });
    setSearchResults(results);
    setCurrentMatchIndex(0);
  }, [searchQuery, novel, customVersionMap]);

  const scrollToMatch = (index: number, results = searchResults) => {
    if (results.length === 0) return;
    const pId = results[index];
    const el = document.getElementById(`paragraph-${pId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNextMatch = () => {
    if (searchResults.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % searchResults.length;
    setCurrentMatchIndex(nextIdx);
    scrollToMatch(nextIdx);
  };

  const handlePrevMatch = () => {
    if (searchResults.length === 0) return;
    const prevIdx = (currentMatchIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentMatchIndex(prevIdx);
    scrollToMatch(prevIdx);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNextMatch();
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const closeParagraphEditor = () => {
    setEditingParagraph(null);
    setEditingParagraphScene(null);
    setReviewSelection(undefined);
  };

  const copySceneToClipboard = async (
    scene: NovelScene,
    draftOverride?: { paragraphId: string; content: string }
  ) => {
    const sceneText = scene.storageModel === 'ros-ko-block-v1'
      ? buildManagedSceneCopyText(
          scene,
          customVersionMap,
          (paragraph: NovelParagraph, versionKey: string) =>
            draftOverride?.paragraphId === paragraph.id
              ? draftOverride.content
              : getParagraphText(paragraph, versionKey)
        )
      : buildSceneCopyText(scene, customVersionMap, draftOverride);

    if (!sceneText) {
      showToast('복사할 Scene 본문이 없습니다.');
      return false;
    }

    try {
      await writeTextToClipboard(sceneText);
      showToast(
        draftOverride
          ? `편집 중인 단락을 포함해 Scene 전체 ${scene.paragraphs.length}개 블록을 복사했습니다!`
          : `Scene 전체 ${scene.paragraphs.length}개 블록을 복사했습니다!`
      );
      return true;
    } catch (error) {
      console.error('Scene clipboard copy failed:', error);
      showToast('Scene 전체 복사에 실패했습니다. 브라우저의 클립보드 권한을 확인해 주세요.');
      return false;
    }
  };

  // 단락 클릭 시 수정 모달 열기
  const handleParagraphClick = (paragraph: NovelParagraph, scene: NovelScene) => {
    if (scene.storageModel === 'ros-ko-block-v1' && scene.managedReadOnly) {
      showToast('과거 구성은 읽기 전용입니다. 최신 review 구성으로 돌아간 뒤 수정해 주세요.');
      return;
    }
    const currentVerKey = customVersionMap[paragraph.id] || paragraph.activeVersion;
    const currentText = getParagraphText(paragraph, currentVerKey);

    // Rendered selections may contain math/layout text. Only attach a unique,
    // exact match from this block; the dialog also offers raw-source selection.
    const selected = window.getSelection();
    const blockElement = document.getElementById(`paragraph-${paragraph.id}`);
    const quote = selected?.toString() || '';
    const offset = quote ? currentText.indexOf(quote) : -1;
    const exactSelection = quote && selected?.anchorNode && selected?.focusNode && blockElement?.contains(selected.anchorNode) && blockElement.contains(selected.focusNode)
      && offset >= 0 && currentText.indexOf(quote, offset + 1) === -1
      ? { text: quote, start: Array.from(currentText.slice(0, offset)).length, end: Array.from(currentText.slice(0, offset + quote.length)).length }
      : undefined;
    setReviewSelection(exactSelection);

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

    if (scene.storageModel === 'ros-ko-block-v1') {
      const currentNo = Number(paragraph.versions?.[currentVerKey]?.versionNo || 1);
      nextVerTag = `block-v${currentNo + 1}`;
    }

    setEditingParagraph(paragraph);
    setEditingParagraphScene(scene);
    setEditContent(currentText);
    setEditVersionTag(nextVerTag);
    setEditNote(
      scene.storageModel === 'ros-ko-block-v1'
        ? '선택 블록 rewrite'
        : '전체 창에서 즉시 수정 업데이트'
    );
    setEditAiPrompt(''); // 항상 빈칸으로 시작 (새로운 지시사항 작성용)
    setShowDiffInModal(false);
    setCompareTargetVersion(currentVerKey);
  };

  // 모달에서 저장 클릭 시
  const handleSaveParagraph = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParagraph || !editContent.trim()) return;

    const saved = await onAddNewVersion(
      editingParagraph.id,
      editVersionTag.trim() || 'v2.1',
      editContent,
      editNote.trim() || '소설 뷰어에서 인라인 수정'
    );

    if (!saved) return;

    if (editingParagraph.storageModel !== 'ros-ko-block-v1' && onSaveAiPrompt && editAiPrompt.trim()) {
      onSaveAiPrompt(editingParagraph.id, editVersionTag.trim() || 'v2.1', editAiPrompt);
    }

    showToast(`단락이 새로운 버전(${editVersionTag})으로 업데이트되었습니다!`);
    closeParagraphEditor();
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
          
          <button
            onClick={async () => {
              setIsGeneratingPDF(true);
              setToastMessage('⏳ 서버에서 LaTeX PDF를 조판 중입니다... (10~20초 소요)');
              try {
                const response = await fetch('/api/generate-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: novel.id }) });
                const result = await response.json();
                if (result.success) {
                  window.open(result.url, '_blank');
                  setToastMessage('🎉 PDF 조판이 완료되었습니다!');
                } else {
                  alert('PDF 생성 실패: ' + result.error);
                  setToastMessage('❌ PDF 조판 실패');
                }
              } catch (e) {
                alert('PDF 생성 중 오류 발생');
                setToastMessage('❌ 시스템 오류');
              }
              setIsGeneratingPDF(false);
              setTimeout(() => setToastMessage(null), 3000);
            }}
            disabled={isGeneratingPDF}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
              isGeneratingPDF 
                ? 'bg-emerald-700 text-emerald-200 cursor-not-allowed opacity-70' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
            }`}
          >
            {isGeneratingPDF ? '⏳ 조판 중...' : '📚 책으로 다운받기 (Mac_로컬 only)'}
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 ml-1">
            <button
              onClick={() => setViewMode('scroll')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'scroll' ? 'bg-amber-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              📜 스크롤
            </button>
            <button
              onClick={() => setViewMode('book')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'book' ? 'bg-[#3a352c] text-[#e0d6c8] shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              📖 책 모드
            </button>
          </div>

          <div className="flex items-center gap-2 ml-1">
            <span className="text-zinc-500 text-xs">🔍</span>
            <input
              type="text"
              placeholder="단어 검색... (Enter로 다음)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 w-48 lg:w-64"
            />
            {searchResults.length > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-amber-400 font-bold px-2">
                  {currentMatchIndex + 1} / {searchResults.length}
                </span>
                <button onClick={handlePrevMatch} className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white" title="이전">▲</button>
                <button onClick={handleNextMatch} className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white" title="다음">▼</button>
              </div>
            )}
            {searchQuery.trim() !== '' && searchResults.length === 0 && (
              <span className="text-xs text-red-400 px-2">0 결과</span>
            )}
          </div>
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

      {commentPanelScene && <SceneReviewCommentsPanel
        key={`${commentActorId}:${commentPanelScene.id}`}
        scene={commentPanelScene}
        comments={reviewComments.filter(c => c.managed_scene_id === commentPanelScene.managedSceneId)}
        guidelines={reviewGuidelines.filter(g => g._visibleIn?.includes(commentPanelScene.managedSceneId))}
        onSaveGuideline={(input, existing) => persistReviewGuideline(commentPanelScene, input, existing)}
        onBuildScenePacket={() => buildCurrentSceneReviewPacket(commentPanelScene)}
        readerSlug={novel.slug || novel.id}
        loading={commentState.loading || commentState.scope !== commentsScope}
        error={commentState.error}
        onReload={() => setCommentsReload(n => n + 1)}
        onClose={() => setCommentPanelSceneId(null)}
        onOpen={comment => {
          const paragraph = commentPanelScene.paragraphs.find(p => (p.unitId || p.id) === comment.block_unit_id);
          if (!paragraph) { showToast('최신 review 구성에서 해당 블록을 열어 주세요.'); return; }
          document.getElementById(`paragraph-${paragraph.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          handleParagraphClick(paragraph, commentPanelScene);
        }}
        onToggle={async (comment, include) => {
          const paragraph = commentPanelScene.paragraphs.find(p => (p.unitId || p.id) === comment.block_unit_id);
          if (!paragraph) throw new Error('최신 review 구성에서 코멘트를 선택해 주세요.');
          await persistReviewComment(commentPanelScene, paragraph, {
            kind: comment.kind, priority: comment.priority, direction: comment.direction,
            proposal: comment.proposal, status: comment.status, include_in_export: include
          }, comment);
        }}
      />}

      {/* Full Novel Document Sheet */}
      <div className={`border rounded-3xl p-8 lg:p-12 shadow-2xl space-y-12 transition-all duration-700 ${
        viewMode === 'book' 
          ? 'bg-[#1a1815] bg-[radial-gradient(#2a2620_1px,transparent_1px)] [background-size:20px_20px] text-[#e0d6c8] border-[#3a352c] shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]' 
          : 'bg-zinc-900/80 border-zinc-800 text-zinc-200'
      }`}>
        {/* Title Header */}
        <div className={`text-center pb-8 border-b space-y-3 ${viewMode === 'book' ? 'border-[#3a352c]' : 'border-zinc-800/80'}`}>
          <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">
            MASTER NOVEL READ & EDIT MODE
          </span>
          <h1 className={`text-3xl lg:text-4xl font-black tracking-tight ${viewMode === 'book' ? 'text-[#e5dcd0] font-serif' : 'text-white'}`}>
            {novel.title}
          </h1>
          <p className={`text-sm max-w-2xl mx-auto ${viewMode === 'book' ? 'text-[#a39a8c] font-serif' : 'text-zinc-400'}`}>
            {novel.subtitle}
          </p>
          <div className="text-xs text-amber-300/80 font-mono pt-2">
            저자: {novel.author} | 최신 업데이트: {novel.updatedAt}
          </div>
        </div>

        {/* Acts & Chapters Loop */}
        {novel.acts.map((act) => (
          <div key={act.number} className="mb-16">
            {/* Act Insert Before Button (Only for the first act) */}
            {onInsertActBefore && act.number === 1 && (
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => onInsertActBefore(act.number)}
                  className={`text-sm px-5 py-2 rounded-full transition-all border flex items-center gap-2 font-bold ${
                    viewMode === 'book'
                      ? 'bg-[#141311]/50 border-[#3a352c] text-[#a39a8c] hover:text-[#d6caba] hover:bg-[#201d19]'
                      : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80'
                  }`}
                >
                  <span>⬆️</span> 첫 막(Act) 이전에 새 막 추가
                </button>
              </div>
            )}

            {/* Act Header */}
            <div className={`mb-8 pb-4 border-b group relative ${viewMode === 'book' ? 'border-[#3a352c]' : 'border-amber-500/30'}`}>
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
                    {onDeleteAct && (
                      <button
                        onClick={() => {
                          onDeleteAct(act.number);
                          setEditingAct(null);
                        }}
                        className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold rounded"
                      >
                        🗑️ 막 삭제
                      </button>
                    )}
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
                  <h2 className={`text-2xl font-black flex items-center gap-2 ${viewMode === 'book' ? 'text-amber-500/90 font-serif' : 'text-amber-400'}`}>
                    <span>🎬</span> {act.title === 'Unknown Act' ? 'Front Matter' : act.title}
                    <button
                      onClick={() => {
                        setEditingAct(act.number);
                        setActEditTitle(act.title);
                        setActEditSummary(act.summary || '');
                      }}
                      className="ml-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-sans"
                    >
                      ✏️ 수정
                    </button>
                  </h2>
                  {act.summary && (
                    <p className={`text-xs mt-1 ${viewMode === 'book' ? 'text-[#a39a8c] font-serif' : 'text-zinc-400'}`}>{act.summary}</p>
                  )}
                </>
              )}
            </div>

            {/* Chapters */}
            {act.chapters.map((ch) => (
              <div
                key={ch.number}
                id={`full-act-${act.number}-ch-${ch.number}`}
                className="space-y-6 scroll-mt-28 break-inside-avoid"
              >
                {/* Insert Chapter Before Button (Only shown before chapter 1, or can be shown before any chapter) */}
                {onInsertChapterBefore && ch.number === 1 && (
                  <div className={`mb-2 flex justify-center pb-2 font-sans`}>
                    <button
                      onClick={() => onInsertChapterBefore(act.number, ch.number)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all border flex items-center gap-1.5 ${
                        viewMode === 'book' 
                          ? 'bg-[#141311]/50 border-[#3a352c] text-[#a39a8c] hover:text-[#d6caba] hover:bg-[#201d19]' 
                          : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80'
                      }`}
                    >
                      <span>⬆️</span> 첫 챕터 이전에 새 챕터 추가
                    </button>
                  </div>
                )}

                <div className={`p-4 rounded-xl group relative border ${
                  viewMode === 'book' 
                    ? 'bg-[#141311]/50 border-[#3a352c]/50' 
                    : 'bg-zinc-950/60 border-zinc-800/80'
                }`}>
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
                        {onDeleteChapter && (
                          <button
                            onClick={() => {
                              onDeleteChapter(act.number, ch.number);
                              setEditingChapter(null);
                            }}
                            className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold rounded"
                          >
                            🗑️ 챕터 삭제
                          </button>
                        )}
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
                      <h3 className={`text-lg font-bold flex items-center gap-2 ${viewMode === 'book' ? 'text-[#e5dcd0] font-serif' : 'text-zinc-200'}`}>
                        <span>📖</span> {ch.title}
                        <span className={`text-xs font-normal px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${
                          viewMode === 'book'
                            ? 'bg-[#201d19] text-[#a39a8c] border border-[#3a352c]'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {(() => {
                            const chText = (ch.scenes || []).flatMap(s => s.paragraphs || []).map(p => getParagraphText(p, customVersionMap[p.id] || p.activeVersion)).join(' ');
                            const charCount = chText.replace(/\s/g, '').length;
                            const wordCount = chText.trim() === '' ? 0 : chText.trim().split(/\s+/).length;
                            return `${wordCount}단어 / 공백제외 ${charCount}자`;
                          })()}
                        </span>
                        <button
                          onClick={() => {
                            setEditingChapter({ actNumber: act.number, chapterNumber: ch.number });
                            setChapterEditTitle(ch.title);
                            setChapterEditSynopsis(ch.synopsis || '');
                          }}
                          className="ml-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-sans"
                        >
                          ✏️ 수정
                        </button>
                      </h3>
                      {ch.synopsis && (
                        <p className={`text-xs mt-1 ${viewMode === 'book' ? 'text-[#a39a8c] font-serif' : 'text-zinc-400'}`}>{ch.synopsis}</p>
                      )}
                    </>
                  )}
                </div>

                {/* Paragraphs Continuous Text Container */}
                <div className={`transition-all duration-700 ${
                  viewMode === 'book' 
                    ? `font-serif text-[#d6caba] ${comparisonSceneId ? 'max-w-none' : 'max-w-3xl'} mx-auto space-y-4 text-justify leading-loose`
                    : 'font-sans text-zinc-200 space-y-8'
                }`}>
                  {(ch.scenes || []).map((scene) => (
                    <div key={scene.id} id={`scene-${scene.id}`} className="relative group/scene scroll-mt-28">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {editingSceneId === scene.id ? (
                          <input 
                            autoFocus
                            type="text"
                            value={editingSceneTitle}
                            onChange={(e) => setEditingSceneTitle(e.target.value)}
                            onBlur={() => {
                              if (editingSceneTitle.trim() !== '') {
                                onUpdateSceneMetadata?.(act.number, ch.number, scene.id, editingSceneTitle.trim());
                              }
                              setEditingSceneId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if (editingSceneTitle.trim() !== '') {
                                  onUpdateSceneMetadata?.(act.number, ch.number, scene.id, editingSceneTitle.trim());
                                }
                                setEditingSceneId(null);
                              } else if (e.key === 'Escape') {
                                setEditingSceneId(null);
                              }
                            }}
                            className="text-sm font-semibold font-sans tracking-wider border-b border-amber-500/50 pb-1 flex-1 bg-transparent text-amber-400 outline-none w-full"
                          />
                        ) : (
                          <h4 
                            className={`text-sm font-semibold font-sans tracking-wider border-b border-zinc-800 pb-1 flex-1 ${onUpdateSceneMetadata && scene.storageModel !== 'ros-ko-block-v1' ? 'cursor-pointer hover:text-amber-400 text-zinc-500' : 'text-zinc-500'}`}
                            onClick={() => {
                              if (onUpdateSceneMetadata && scene.storageModel !== 'ros-ko-block-v1') {
                                setEditingSceneTitle(getSceneTitle(scene, customVersionMap));
                                setEditingSceneId(scene.id);
                              }
                            }}
                            title={onUpdateSceneMetadata && scene.storageModel !== 'ros-ko-block-v1' ? "클릭하여 씬 제목 수정" : ""}
                          >
                            <SceneRevisionBadge scene={scene} />
                            {getSceneTitle(scene, customVersionMap)}
                          </h4>
                        )}
                        {scene.storageModel === 'ros-ko-block-v1' && onManagedRevisionChange && (
                          <select
                            aria-label={`${getSceneTitle(scene, customVersionMap)} 구성 리비전 선택`}
                            value={scene.managedViewKey || scene.compositionRevisionId || ''}
                            onChange={(event) => void onManagedRevisionChange(scene.id, event.target.value)}
                            className="shrink-0 max-w-[220px] rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-300"
                          >
                            {(scene.managedHistory || []).map((revision) => (
                              <option key={revision.compositionId} value={revision.compositionId}>
                                {revision.isReview ? '최신 review' : '과거판'} · 구조 r{revision.revisionNo} · {revision.manuscriptVersion}
                              </option>
                            ))}
                            {scene.managedLegacyAvailable && <option value="legacy">legacy 원형 · 읽기 전용</option>}
                          </select>
                        )}
                        {scene.managedSceneId && <button type="button" onClick={() => {
                          setCommentPanelSceneId(scene.id);
                          requestAnimationFrame(() => document.querySelector('[aria-label="Scene 검토 코멘트 목록"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
                        }} className="shrink-0 text-xs px-3 py-1 rounded border border-blue-500/30 text-blue-300 bg-blue-500/10">Scene 검토본 · 지침/코멘트 {reviewComments.filter(c => c.managed_scene_id === scene.managedSceneId && !['resolved', 'withdrawn'].includes(c.status)).length} · 다운로드</button>}
                        {isComparableScene(scene) && <button type="button" aria-pressed={comparisonSceneId === scene.id} onClick={() => comparisonSceneId === scene.id ? closeBilingualComparison(scene) : openBilingualComparison(scene)} className="shrink-0 rounded border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">{comparisonSceneId === scene.id ? '국문 읽기' : '영한 비교'}</button>}
                        <button
                          type="button"
                          data-copy-scene-id={scene.id}
                          onClick={() => void copySceneToClipboard(scene)}
                          aria-label={`${getSceneTitle(scene, customVersionMap)} Scene 전체 본문 복사`}
                          title="현재 선택된 Version으로 Scene 본문 전체를 복사합니다"
                          className={`shrink-0 whitespace-nowrap text-[10px] px-2 py-1 rounded border font-sans transition-colors ${
                            viewMode === 'book'
                              ? 'bg-[#201d19] border-[#3a352c] text-[#c2b7a8] hover:bg-[#2a261f] hover:text-[#eee5d8]'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                          }`}
                        >
                          📋 Scene 전체 복사
                        </button>
                        {onDeleteScene && (
                          <button
                            disabled={scene.storageModel === 'ros-ko-block-v1'}
                            onClick={() => onDeleteScene(act.number, ch.number, scene.id)}
                            className="ml-2 text-[10px] bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-200 px-2 py-1 rounded opacity-0 group-hover/scene:opacity-100 transition-opacity font-sans disabled:hidden"
                            title="이 씬을 삭제합니다"
                          >
                            🗑️ 씬 삭제
                          </button>
                        )}
                      </div>
                      
                      {comparisonSceneId === scene.id && isComparableScene(scene) ? <NovelBilingualReader
                        key={comparisonScope}
                        scene={scene}
                        comparison={comparison}
                        loading={comparisonLoading}
                        error={comparisonError}
                        fontSizeClass={getFontSizeClass()}
                        comments={reviewComments.filter(comment => comment.managed_scene_id === scene.managedSceneId)}
                        onRetry={() => setComparisonReload(value => value + 1)}
                        onClose={() => closeBilingualComparison(scene)}
                        onSelectBlock={paragraph => { comparisonReturnAnchor.current = paragraph.id; }}
                        onOpenBlock={paragraph => handleParagraphClick(paragraph, scene)}
                        onBuildPacket={() => buildCurrentBilingualReviewPacket(scene)}
                      /> : <div className={viewMode === 'book' ? "space-y-0" : "space-y-2"}>
                      {(scene.paragraphs || []).map((p) => {
                    const activeVerKey = customVersionMap[p.id] || p.activeVersion;
                    let content = getParagraphText(p, activeVerKey);

                    const isMatch = searchResults.length > 0 && searchResults[currentMatchIndex] === p.id;
                    
                    let bgClass = isMatch 
                      ? 'bg-amber-900/30 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                      : 'border-transparent hover:bg-amber-500/5';
                      
                    if (viewMode === 'book') {
                      bgClass = isMatch
                        ? 'bg-amber-900/20 border-amber-800/40 shadow-[0_0_10px_rgba(245,158,11,0.05)]'
                        : 'border-transparent hover:bg-[#201d19]/40';
                    }

                    let displayContent = content;
                    if (searchQuery.trim() !== '' && searchResults.includes(p.id)) {
                      const escapedQuery = searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                      const regex = new RegExp(`(${escapedQuery})`, 'gi');
                      displayContent = content.replace(regex, '`$1`');
                      // 기존 백틱과 중첩되는 경우 방지 (``` -> `)
                      displayContent = displayContent.replace(/```/g, '`');
                    }

                    const isEnglishPrologueChapter1Scene1 =
                      novel.slug === 'quantum-vibration-novel-en' && scene.id === 'b48a4f04';

                    if (isEnglishPrologueChapter1Scene1) {
                      displayContent = normalizeEscapedParagraphBreaks(displayContent);
                    }

                    return (
                      <div
                        id={`paragraph-${p.id}`}
                        key={p.id}
                        data-managed-block-id={p.storageModel === 'ros-ko-block-v1' ? p.id : undefined}
                        data-managed-unit-id={p.storageModel === 'ros-ko-block-v1' ? p.unitId : undefined}
                        data-managed-position={p.storageModel === 'ros-ko-block-v1' ? p.sourceKey : undefined}
                        onClick={() => handleParagraphClick(p, scene)}
                        className={
                          viewMode === 'book'
                            ? `group relative px-2 py-1 transition-all ${scene.managedReadOnly ? 'cursor-default' : 'cursor-pointer'} break-inside-avoid mb-2 rounded ${bgClass} ${getFontSizeClass()}`
                            : `group relative px-3 py-1.5 transition-all ${scene.managedReadOnly ? 'cursor-default' : 'cursor-pointer'} break-inside-avoid mb-1 rounded-lg border-transparent ${bgClass} ${getFontSizeClass()}`
                        }
                        title={scene.managedReadOnly ? '과거 구성 읽기 전용' : scene.managedSceneId ? '클릭하여 검토 코멘트 작성 또는 본문 수정' : '클릭하여 이 단락 수정 & 새 버전 생성'}
                      >
                        {/* Hover Quick Edit Badge */}
                        {!scene.managedReadOnly && (
                          <div className="absolute top-0 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-zinc-950 text-[10px] px-2 py-0.5 rounded font-bold shadow-lg flex items-center gap-1 font-sans z-10">
                            <span>✏️</span> {scene.managedSceneId ? '검토 · 수정' : '수정'}
                          </div>
                        )}
                        {scene.managedSceneId && reviewComments.some(c => c.block_unit_id === (p.unitId || p.id) && !['resolved', 'withdrawn'].includes(c.status)) && <span className="inline-block text-xs text-blue-200 bg-blue-900/30 rounded px-2 py-0.5 mb-1" aria-label="이 블록의 검토 코멘트 수">💬 {reviewComments.filter(c => c.block_unit_id === (p.unitId || p.id) && !['resolved', 'withdrawn'].includes(c.status)).length}</span>}

                        {/* Version Indicator Tag and AI Prompt (hidden unless hovered) */}
                        <div className="flex items-center gap-2 flex-wrap font-sans opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-auto transition-all group-hover:mb-1">
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
                          {(!displayContent.match(/[*_#$\[\]`~]/)) ? (
                            <span>{displayContent}</span>
                          ) : (
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
                              {displayContent}
                            </ReactMarkdown>
                          )}
                        </div>
                      </div>
                    );
                  })}
                      </div>}
                    </div>
                  ))}
                </div>
                
                {/* Add Scene Button */}
                {onInsertScene && (
                  <div className={`mt-2 flex justify-center pb-4 font-sans`}>
                    <button
                      onClick={() => {
                        onInsertScene(act.number, ch.number, '');
                      }}
                      className={`text-xs px-4 py-2 rounded-full transition-all border flex items-center gap-2 ${
                        viewMode === 'book' 
                          ? 'bg-[#141311]/50 border-[#3a352c] text-[#a39a8c] hover:text-[#d6caba] hover:bg-[#201d19]' 
                          : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80'
                      }`}
                    >
                      <span>🎬</span> 여기에 새 씬(Scene) 추가하기
                    </button>
                  </div>
                )}
                
                {/* Add Chapter Button */}
                {onInsertChapter && (
                  <div className={`mt-6 flex justify-center border-t pt-4 font-sans ${viewMode === 'book' ? 'border-[#3a352c]' : 'border-zinc-800/50'}`}>
                    <button
                      onClick={() => {
                        onInsertChapter(act.number, ch.number);
                      }}
                      className={`text-xs px-4 py-2 rounded-full transition-all border flex items-center gap-2 ${
                        viewMode === 'book' 
                          ? 'bg-[#141311]/50 border-[#3a352c] text-[#a39a8c] hover:text-[#d6caba] hover:bg-[#201d19]' 
                          : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80'
                      }`}
                    >
                      <span>➕</span> 여기에 새 챕터 추가하기
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Insert Act After Button */}
            {onInsertActAfter && (
              <div className="flex justify-center mt-12 mb-8">
                <button
                  onClick={() => onInsertActAfter(act.number)}
                  className={`text-sm px-6 py-3 rounded-full transition-all border flex items-center gap-2 font-bold shadow-lg ${
                    viewMode === 'book'
                      ? 'bg-[#141311]/50 border-[#3a352c] text-[#a39a8c] hover:text-[#d6caba] hover:bg-[#201d19]'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700'
                  }`}
                >
                  <span>➕</span> 이 막(Act) 다음에 새 막 추가하기
                </button>
              </div>
            )}
          </div>
        ))}

        {/* End of Novel Sheet */}
        <div className={`text-center pt-12 border-t text-xs font-mono ${viewMode === 'book' ? 'border-[#3a352c] text-[#a39a8c]' : 'border-zinc-800 text-zinc-500'}`}>
          [ 소설 전체 본문 읽기 종료 - 모든 단락은 최신 버전으로 연동됩니다 ]
        </div>
      </div>

      {/* Paragraph Edit Modal */}
      {editingParagraph && editingParagraphScene?.managedSceneId && (
        <ManagedBlockReviewDialog
          key={`${editingParagraphScene.managedSceneId}:${editingParagraph.id}:${editingParagraph.revisionVersionId}`}
          scene={editingParagraphScene}
          paragraph={editingParagraph}
          comments={reviewComments.filter(c => c.block_unit_id === (editingParagraph.unitId || editingParagraph.id))}
          loading={commentState.loading || commentState.scope !== commentsScope}
          loadError={commentState.error}
          initialSelection={reviewSelection}
          englishSource={comparison?.rows.find(row => row.ko_unit_id === (editingParagraph.unitId || editingParagraph.id) && row.ko_version_id === editingParagraph.revisionVersionId)}
          englishSourceLoading={isComparableScene(editingParagraphScene) && comparisonLoading}
          englishSourceError={isComparableScene(editingParagraphScene) ? comparisonError : undefined}
          onClose={closeParagraphEditor}
          onSaveComment={async (input, existing) => persistReviewComment(editingParagraphScene, editingParagraph, input, existing)}
          onSaveGuideline={input => persistReviewGuideline(editingParagraphScene, input, undefined, editingParagraph)}
          onSaveBody={async (body, note) => {
            const saved = await onAddNewVersion(editingParagraph.id, editVersionTag, body, note);
            if (saved) { showToast('수정본을 새 버전으로 저장했습니다.'); closeParagraphEditor(); }
            return saved;
          }}
          onCopyScene={async () => {
            if (!await copySceneToClipboard(editingParagraphScene)) throw new Error('Scene 복사에 실패했습니다. 클립보드 권한을 확인해 주세요.');
          }}
          onCopyText={writeTextToClipboard}
        />
      )}
      {editingParagraph && !editingParagraphScene?.managedSceneId && (
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
                onClick={closeParagraphEditor}
                className="text-zinc-500 hover:text-zinc-300 text-xl font-bold p-1"
                aria-label="단락 편집 창 닫기"
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
                      readOnly={editingParagraph.storageModel === 'ros-ko-block-v1'}
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
                      onClick={async () => {
                        try {
                          await writeTextToClipboard(editContent);
                          showToast('현재 단락 본문을 복사했습니다!');
                        } catch (error) {
                          console.error('Paragraph clipboard copy failed:', error);
                          showToast('현재 단락 복사에 실패했습니다. 브라우저의 클립보드 권한을 확인해 주세요.');
                        }
                      }}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2.5 rounded-xl font-semibold transition-colors"
                    >
                      📋 현재 단락 복사
                    </button>
                    {editingParagraphScene && (
                      <button
                        type="button"
                        data-copy-editing-scene-id={editingParagraphScene.id}
                        onClick={() => void copySceneToClipboard(editingParagraphScene, {
                          paragraphId: editingParagraph.id,
                          content: editContent
                        })}
                        className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 px-3 py-2.5 rounded-xl font-semibold transition-colors border border-amber-500/30"
                        title="현재 편집 중인 단락을 포함해 Scene 전체를 복사합니다"
                      >
                        📚 Scene 전체 복사
                      </button>
                    )}
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
                    {onDeleteParagraph && editingParagraph.storageModel !== 'ros-ko-block-v1' && (
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteParagraph(editingParagraph.id);
                          closeParagraphEditor();
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2.5 rounded-xl font-semibold transition-colors border border-red-500/20 ml-2"
                      >
                        🗑️ 단락 삭제
                      </button>
                    )}
                    {onInsertParagraph && editingParagraph.storageModel !== 'ros-ko-block-v1' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            if (onInsertParagraphBefore) {
                              onInsertParagraphBefore(editingParagraph.id);
                              showToast('현재 단락 위에 새 단락이 추가되었습니다.');
                              closeParagraphEditor();
                            }
                          }}
                          className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 px-3 py-2.5 rounded-xl font-semibold transition-colors border border-purple-500/20 ml-2"
                        >
                          ⬆️ 위에 새 단락 추가
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onInsertParagraph(editingParagraph.id);
                            showToast('현재 단락 아래에 새 단락이 추가되었습니다.');
                            closeParagraphEditor();
                          }}
                          className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 px-3 py-2.5 rounded-xl font-semibold transition-colors border border-purple-500/20 ml-2"
                        >
                          ⬇️ 아래에 새 단락 추가
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={closeParagraphEditor}
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
