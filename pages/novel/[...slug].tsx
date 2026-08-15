import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  novelsMap,
  NovelDetails,
  addParagraphVersion,
  addParagraphAiComment,
  deleteParagraph,
  insertParagraphAfter,
  insertParagraphBefore,
  insertChapterAfter,
  insertChapterBefore,
  deleteChapter,
  insertActAfter,
  insertActBefore,
  deleteAct,
  updateActMetadata,
  updateChapterMetadata,
  insertNovelSceneAfter,
  deleteNovelScene,
  updateNovelSceneMetadata,
  addCharacter,
  updateCharacter,
  deleteCharacter,
  addScene,
  updateScene,
  deleteScene,
  addLocation,
  updateLocation,
  deleteLocation,
  initialNovelData,
  getSceneTitle
} from '../../components/NovelPlatform/novelData';
import { NovelParagraphViewer } from '../../components/NovelPlatform/NovelParagraphViewer';
import { NovelMosaicMixer } from '../../components/NovelPlatform/NovelMosaicMixer';
import { NovelFullReader } from '../../components/NovelPlatform/NovelFullReader';
import { NovelSideBySideDiff } from '../../components/NovelPlatform/NovelSideBySideDiff';
import { CharacterGlossary } from '../../components/NovelPlatform/CharacterGlossary';
import { SceneGlossary } from '../../components/NovelPlatform/SceneGlossary';
import { LocationGlossary } from '../../components/NovelPlatform/LocationGlossary';
import { novels } from '../../shared/lib/supabase';

export default function NovelStudioPage() {
  const router = useRouter();
  const { slug } = router.query;
  const novelId = Array.isArray(slug) ? slug[0] : slug;
  const lang = Array.isArray(slug) && slug.length > 1 ? slug[1] : 'ko';
  const dbSlug = lang === 'en' ? `${novelId}-en` : (novelId || '');

  // 소설 데이터 state (기본값: initialNovelData)
  const [novel, setNovel] = useState<NovelDetails>(() => {
    if (dbSlug && typeof dbSlug === 'string' && novelsMap[dbSlug]) {
      return novelsMap[dbSlug];
    }
    if (novelId && typeof novelId === 'string' && novelsMap[novelId]) {
      return novelsMap[novelId];
    }
    return initialNovelData;
  });

  // 단락별 개별 선택 버전 맵: paragraphId -> versionKey
  const [customVersionMap, setCustomVersionMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // 현재 선택된 메인 탭
  const [mainTab, setMainTab] = useState<'story' | 'characters' | 'scenes' | 'locations' | 'diff'>('story');

  // 버전 비교 탭용 상태
  const [diffActNumber, setDiffActNumber] = useState<number>(1);
  const [diffChapterNumber, setDiffChapterNumber] = useState<number>(1);
  const [diffVersionA, setDiffVersionA] = useState<string>('v1.0');
  const [diffVersionB, setDiffVersionB] = useState<string>('v2.0');

  // Supabase에서 소설 데이터 불러오기
  useEffect(() => {
    async function loadNovel() {
      if (!dbSlug || typeof dbSlug !== 'string') return;
      
      setIsLoading(true);
      const { data, error } = await novels.getNovelBySlug(dbSlug);
      
      // 마이그레이션 로직: act -> chapter -> paragraphs 구조를 act -> chapter -> scenes -> paragraphs 구조로 변환
      const migrateNovelData = (sourceData: any) => {
        const migrated = JSON.parse(JSON.stringify(sourceData));
        if (!migrated.scenes) migrated.scenes = initialNovelData.scenes || [];
        if (!migrated.locations) migrated.locations = initialNovelData.locations || [];
        
        if (migrated.acts) {
          for (const act of migrated.acts) {
            if (act.chapters) {
              for (const ch of act.chapters) {
                // 기존 paragraphs가 있다면 scene 1을 만들어서 넣는다
                if (ch.paragraphs && ch.paragraphs.length > 0 && (!ch.scenes || ch.scenes.length === 0)) {
                  ch.scenes = [{
                    id: `scene-${act.number}-${ch.number}-1`,
                    number: 1,
                    title: `SCENE 1`,
                    paragraphs: ch.paragraphs
                  }];
                  delete ch.paragraphs;
                } else if (!ch.scenes || ch.scenes.length === 0) {
                  // If scenes are completely empty and paragraphs are missing (corrupted state), try to recover from initialNovelData
                  const initialAct = initialNovelData.acts.find(a => a.number === act.number);
                  const initialCh = initialAct?.chapters.find(c => c.number === ch.number);
                  if (initialCh && initialCh.scenes && initialCh.scenes.length > 0) {
                    ch.scenes = initialCh.scenes;
                  } else {
                    ch.scenes = [];
                  }
                }
              }
            }
          }
        }
        return migrated;
      };

      if (data) {
        setNovel(migrateNovelData(data));
      } else if (novelsMap[dbSlug]) {
        setNovel(migrateNovelData(novelsMap[dbSlug]));
      } else if (novelId && typeof novelId === 'string' && novelsMap[novelId]) {
        setNovel(migrateNovelData(novelsMap[novelId]));
      } else {
        setNovel(migrateNovelData(initialNovelData));
      }
      setIsLoading(false);
    }
    
    loadNovel();
  }, [dbSlug, novelId]);

  // 뷰 모드: 'reader' (전체 연속 정독 & 인라인 퀵 편집) | 'editor' (단락별 카드 세부 집필/비교) | 'mosaic' (최종본 조합)
  const [activeTab, setActiveTab] = useState<'reader' | 'editor' | 'mosaic'>('reader');

  // 개요/캐릭터 접기 토글 상태
  const [showOutlineDetails, setShowOutlineDetails] = useState(true);

  // 초안 가져오기 / 텍스트 등록 모달 상태
  const [showImportModal, setShowImportModal] = useState(false);
  const [importDraftText, setImportDraftText] = useState('');
  const [importTargetAct, setImportTargetAct] = useState(1);
  const [importTargetChapter, setImportTargetChapter] = useState(1);
  const [importVersionTag, setImportVersionTag] = useState('v1.0');

  // 클릭 네비게이션 중 Observer 동작을 잠시 멈추기 위한 flag
  const isNavigating = React.useRef(false);

  // 현재 화면에 보이는 챕터 ID (Scroll Spy 용)
  const [activeChapterId, setActiveChapterId] = useState<string>('');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // Scroll Spy 구현 (Intersection Observer)
  useEffect(() => {
    // 관찰할 대상 챕터 DOM 요소들 선택
    const chapterElements = document.querySelectorAll('div[id^="full-act-"], div[id^="act-"]');
    if (chapterElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 화면 교차 영역에 들어오거나 가장 많이 보이는 요소를 찾는다.
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.id;
            setActiveChapterId(currentId);
            
            // 사이드바 메뉴 아이템을 찾아 자동 스크롤
            // 단, 사용자가 목차를 클릭해서 이동 중일 때는 부드러운 스크롤 충돌을 막기 위해 무시함
            if (!isNavigating.current) {
              const navElement = document.getElementById(`nav-${currentId}`);
              if (navElement) {
                // scrollIntoView는 부모 창 전체 스크롤에 영향을 줄 수 있으므로,
                // aside(사이드바) 컨테이너의 scrollTop을 수동으로 조작합니다.
                const sidebar = navElement.closest('aside');
                if (sidebar) {
                  const targetTop = navElement.offsetTop - (sidebar.clientHeight / 2) + (navElement.clientHeight / 2);
                  sidebar.scrollTo({ top: targetTop, behavior: 'smooth' });
                }
              }
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -40% 0px', // 화면 위쪽 20%, 아래쪽 40% 여백
        threshold: 0.1
      }
    );

    chapterElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [novel, activeTab]);

  // 전체 버전을 일괄 변경할 때
  const handleSetGlobalVersion = (globalVer: string) => {
    const newMap: Record<string, string> = {};
    for (const act of novel.acts) {
      for (const ch of act.chapters) {
        for (const scene of ch.scenes || []) {
          for (const p of scene.paragraphs || []) {
            if (p.versions[globalVer]) {
              newMap[p.id] = globalVer;
            }
          }
        }
      }
    }
    setCustomVersionMap(newMap);
  };

  // 단락별 버전 변경 핸들러
  const handleParagraphVersionChange = (paragraphId: string, versionKey: string) => {
    setCustomVersionMap(prev => ({
      ...prev,
      [paragraphId]: versionKey
    }));
  };

  // 단락에 새 버전 추가/업데이트 핸들러
  const handleAddNewVersion = (
    paragraphId: string,
    newVersionKey: string,
    content: string,
    note: string
  ) => {
    const updatedNovel = addParagraphVersion(
      novel,
      paragraphId,
      newVersionKey,
      content,
      note
    );
    setNovel(updatedNovel);
    setCustomVersionMap(prev => ({
      ...prev,
      [paragraphId]: newVersionKey
    }));
    // Supabase에 저장
    novels.saveNovel(updatedNovel);
  };

  const handleSaveAiPrompt = (paragraphId: string, targetVersion: string, prompt: string) => {
    const updatedNovel = addParagraphAiComment(novel, paragraphId, targetVersion, prompt);
    setNovel(updatedNovel);
    // Supabase에 저장
    novels.saveNovel(updatedNovel);
  };

  const handleDeleteParagraph = (paragraphId: string) => {
    if (confirm('이 단락을 정말 삭제하시겠습니까? (삭제 시 복구할 수 없습니다)')) {
      const updatedNovel = deleteParagraph(novel, paragraphId);
      setNovel(updatedNovel);
      // Supabase에 저장
      novels.saveNovel(updatedNovel);
    }
  };

  const handleInsertParagraph = (paragraphId: string) => {
    const updatedNovel = insertParagraphAfter(novel, paragraphId);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleInsertParagraphBefore = (paragraphId: string) => {
    const updatedNovel = insertParagraphBefore(novel, paragraphId);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleInsertChapter = (actNumber: number, chapterNumber: number) => {
    const updatedNovel = insertChapterAfter(novel, actNumber, chapterNumber);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleInsertChapterBefore = (actNumber: number, chapterNumber: number) => {
    const updatedNovel = insertChapterBefore(novel, actNumber, chapterNumber);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleDeleteChapter = (actNumber: number, chapterNumber: number) => {
    if (confirm('이 챕터를 정말 삭제하시겠습니까? (삭제 시 내부의 모든 단락이 함께 삭제됩니다)')) {
      const updatedNovel = deleteChapter(novel, actNumber, chapterNumber);
      setNovel(updatedNovel);
      novels.saveNovel(updatedNovel);
    }
  };

  const handleInsertActAfter = (actNumber: number) => {
    const updatedNovel = insertActAfter(novel, actNumber);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleInsertActBefore = (actNumber: number) => {
    const updatedNovel = insertActBefore(novel, actNumber);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleDeleteAct = (actNumber: number) => {
    if (confirm('이 막(Act)을 정말 삭제하시겠습니까? (삭제 시 내부의 모든 챕터와 단락이 함께 삭제됩니다)')) {
      const updatedNovel = deleteAct(novel, actNumber);
      setNovel(updatedNovel);
      novels.saveNovel(updatedNovel);
    }
  };

  const handleUpdateActMetadata = (actNumber: number, title: string, summary?: string) => {
    const updatedNovel = updateActMetadata(novel, actNumber, title, summary);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleUpdateChapterMetadata = (actNumber: number, chapterNumber: number, title: string, synopsis?: string) => {
    const updatedNovel = updateChapterMetadata(novel, actNumber, chapterNumber, title, synopsis);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleInsertScene = (actNumber: number, chapterNumber: number, targetSceneId: string) => {
    const updatedNovel = insertNovelSceneAfter(novel, actNumber, chapterNumber, targetSceneId);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleDeleteSceneInner = (actNumber: number, chapterNumber: number, sceneId: string) => {
    if (confirm('이 씬(Scene)을 정말 삭제하시겠습니까? (삭제 시 내부의 모든 단락이 함께 삭제됩니다)')) {
      const updatedNovel = deleteNovelScene(novel, actNumber, chapterNumber, sceneId);
      setNovel(updatedNovel);
      novels.saveNovel(updatedNovel);
    }
  };

  const handleUpdateSceneMetadata = (actNumber: number, chapterNumber: number, sceneId: string, title: string) => {
    const updatedNovel = updateNovelSceneMetadata(novel, actNumber, chapterNumber, sceneId, title);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleAddCharacter = () => {
    const updatedNovel = addCharacter(novel);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleUpdateCharacter = (id: string, updates: any) => {
    const updatedNovel = updateCharacter(novel, id, updates);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleDeleteCharacter = (id: string) => {
    const updatedNovel = deleteCharacter(novel, id);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleAddScene = () => {
    const updatedNovel = addScene(novel);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleUpdateScene = (id: string, updates: any) => {
    const updatedNovel = updateScene(novel, id, updates);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleDeleteScene = (id: string) => {
    const updatedNovel = deleteScene(novel, id);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleAddLocation = () => {
    const updatedNovel = addLocation(novel);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleUpdateLocation = (id: string, updates: any) => {
    const updatedNovel = updateLocation(novel, id, updates);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  const handleDeleteLocation = (id: string) => {
    const updatedNovel = deleteLocation(novel, id);
    setNovel(updatedNovel);
    novels.saveNovel(updatedNovel);
  };

  // 사용자가 가져온 초안 텍스트를 단락 구조로 자동 파싱하여 추가하는 헬퍼
  const handleImportDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importDraftText.trim()) return;

    const rawParagraphs = importDraftText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const updatedNovel: NovelDetails = JSON.parse(JSON.stringify(novel));
    
    let targetActObj = updatedNovel.acts.find(a => a.number === importTargetAct);
    if (!targetActObj) {
      targetActObj = {
        number: importTargetAct,
        title: `제 ${importTargetAct} 막`,
        chapters: []
      };
      updatedNovel.acts.push(targetActObj);
    }

    let targetChObj = targetActObj.chapters.find(c => c.number === importTargetChapter);
    if (!targetChObj) {
      targetChObj = {
        number: importTargetChapter,
        title: `제 ${importTargetChapter} 장`,
        scenes: []
      };
      targetActObj.chapters.push(targetChObj);
    }

    rawParagraphs.forEach((txt) => {
      if (!targetChObj.scenes) targetChObj.scenes = [];
      if (targetChObj.scenes.length === 0) targetChObj.scenes.push({ id: `scene-import`, number: 1, paragraphs: [] });
      const targetScene = targetChObj.scenes[0];
      const pId = `act${importTargetAct}-ch${importTargetChapter}-p${targetScene.paragraphs.length + 1}`;
      targetScene.paragraphs.push({
        id: pId,
        activeVersion: importVersionTag,
        versions: {
          [importVersionTag]: {
            version: importVersionTag,
            content: txt,
            note: '사용자 초안 가져오기 입력',
            createdAt: new Date().toISOString().substring(0, 16)
          }
        }
      });
    });

    if (!updatedNovel.versionHistory.includes(importVersionTag)) {
      updatedNovel.versionHistory.push(importVersionTag);
      updatedNovel.versionHistory.sort();
    }

    setNovel(updatedNovel);
    setShowImportModal(false);
    setImportDraftText('');
  };

  // 목차 클릭 시 부드럽게 스크롤
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, elementId: string) => {
    e.preventDefault();
    
    isNavigating.current = true;
    
    setExpandedChapters(prev => ({
      ...prev,
      [elementId]: true
    }));

    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => {
      isNavigating.current = false;
    }, 1000);
  };

  const toggleChapterExpansion = (targetId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [targetId]: !prev[targetId]
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950">
      <Head>
        <title>{novel.title} - 소설 집필 & 버전 스튜디오</title>
        <meta name="description" content={`${novel.title} 소설 막·장·단락 독립 버전 관리`} />
      </Head>

      {/* Navigation Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/novel" className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md font-semibold transition-colors">
              ← 목록으로
            </Link>
            <h1 className="text-lg font-bold text-white tracking-tight truncate max-w-md">
              {novel.title}
            </h1>

            {/* Language Toggle */}
            {novelId && (
              <div className="ml-4 flex items-center bg-zinc-800 rounded-md p-0.5 border border-zinc-700">
                <Link
                  href={`/novel/${novelId}`}
                  className={`text-xs px-2.5 py-1 rounded-sm font-semibold transition-colors ${lang !== 'en' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  KOR
                </Link>
                <Link
                  href={`/novel/${novelId}/en`}
                  className={`text-xs px-2.5 py-1 rounded-sm font-semibold transition-colors ${lang === 'en' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  ENG
                </Link>
              </div>
            )}
          </div>

          {/* Top Center Tabs */}
          <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 shrink-0">
            <button
              onClick={() => setMainTab('story')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                mainTab === 'story' 
                  ? 'bg-amber-500 text-zinc-950 shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              📖 본문 편집
            </button>
            <button
              onClick={() => setMainTab('characters')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                mainTab === 'characters' 
                  ? 'bg-amber-500 text-zinc-950 shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              👥 캐릭터 설정
            </button>
            <button
              onClick={() => setMainTab('scenes')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                mainTab === 'scenes' 
                  ? 'bg-amber-500 text-zinc-950 shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              🎬 장면 씬 구상
            </button>
            <button
              onClick={() => setMainTab('locations')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                mainTab === 'locations' 
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              🌍 장소 구상
            </button>
            <button
              onClick={() => setMainTab('diff')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                mainTab === 'diff' 
                  ? 'bg-amber-500 text-zinc-950 shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              ⚖️ 버전 비교
            </button>
          </div>

          {/* 탭 & 컨트롤 (본문 편집 시에만 표시) */}
          {mainTab === 'story' && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>📥</span> 초안 가져오기/입력
              </button>

              <div className="bg-zinc-950 p-1 rounded-xl border border-zinc-800 flex items-center text-xs">
                <button
                  onClick={() => setActiveTab('reader')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'reader'
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  📖 전체 정독 & 인라인 수정
                </button>
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'editor'
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  📝 단락 카드 비교
                </button>
                <button
                  onClick={() => setActiveTab('mosaic')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'mosaic'
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  ✨ 마스터 조합본
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar: Sticky Fixed Navigation & Version Swapper */}
        {mainTab === 'story' && (
          <aside className="space-y-6 lg:col-span-1 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1 font-sans scrollbar-thin scrollbar-thumb-zinc-800">
            {/* Global Version Selector Box */}
            <div className="hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>전체 버전 일괄 설정</span>
                <span className="text-zinc-500 font-normal font-mono">Global</span>
              </h3>
              <p className="text-xs text-zinc-400 mb-3">
                모든 단락을 해당 버전으로 한번에 스위칭합니다.
              </p>
              <div className="flex flex-wrap gap-2">
                {novel.versionHistory.map((verKey) => (
                  <button
                    key={verKey}
                    onClick={() => handleSetGlobalVersion(verKey)}
                    className="bg-zinc-950 hover:bg-amber-500/20 text-amber-300 border border-zinc-800 hover:border-amber-500/40 text-xs px-3 py-1.5 rounded-lg font-mono font-bold transition-colors"
                  >
                    {verKey}로 적용
                  </button>
                ))}
              </div>
            </div>

            {/* Act & Chapter Outline Sticky Menu */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>📌 소설 목차 & 고속 이동</span>
                <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded font-mono">Sticky Fix</span>
              </h3>

              <div className="space-y-4 text-xs">
                {novel.acts.map((act) => (
                  <div key={act.number} className="space-y-2">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🎬</span> {act.title}
                    </div>
                    <div className="pl-3 space-y-1 border-l border-zinc-800">
                      {act.chapters.map((ch) => {
                        const targetId = activeTab === 'reader' 
                          ? `full-act-${act.number}-ch-${ch.number}` 
                          : `act-${act.number}-ch-${ch.number}`;
                        
                        const isActive = activeChapterId === targetId;

                        return (
                          <div key={ch.number} className="flex flex-col">
                            <div className="flex items-center group">
                              <button
                                onClick={() => toggleChapterExpansion(targetId)}
                                className="px-1.5 py-1 text-[10px] text-zinc-500 hover:text-amber-400 focus:outline-none"
                              >
                                {expandedChapters[targetId] ? '▼' : '▶'}
                              </button>
                              <a
                                id={`nav-${targetId}`}
                                href={`#${targetId}`}
                                onClick={(e) => handleNavClick(e, targetId)}
                                className={`flex-1 transition-all py-1.5 px-1.5 rounded-md truncate duration-150 ${
                                  isActive
                                    ? 'text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 translate-x-1'
                                    : 'text-zinc-400 hover:text-amber-300 hover:translate-x-1 hover:bg-zinc-800/50'
                                }`}
                              >
                                {ch.title}
                              </a>
                            </div>
                            {/* Scenes dropdown */}
                            {expandedChapters[targetId] && ch.scenes && ch.scenes.length > 0 && (
                              <div className="pl-6 py-1 space-y-1 border-l border-zinc-800 ml-2 mb-1">
                                {ch.scenes.map((scene) => (
                                  <a
                                    key={scene.id}
                                    href={`#scene-${scene.id}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const el = document.getElementById(`scene-${scene.id}`);
                                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    className="block transition-all py-1 px-2 rounded-md truncate duration-150 text-[11px] text-zinc-500 hover:text-amber-200 hover:bg-zinc-800/50"
                                  >
                                    🎬 {getSceneTitle(scene, customVersionMap)}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Center/Right Content Area */}
        <main className={mainTab === 'story' ? 'lg:col-span-3 space-y-8' : 'lg:col-span-4 space-y-8'}>
          {/* Main Content View Switch */}
          {mainTab === 'characters' && (
            <CharacterGlossary
              characters={novel.characters || []}
              onAddCharacter={handleAddCharacter}
              onUpdateCharacter={handleUpdateCharacter}
              onDeleteCharacter={handleDeleteCharacter}
            />
          )}

          {mainTab === 'scenes' && (
            <SceneGlossary
              scenes={novel.scenes || []}
              onAddScene={handleAddScene}
              onUpdateScene={handleUpdateScene}
              onDeleteScene={handleDeleteScene}
            />
          )}

          {mainTab === 'locations' && (
            <LocationGlossary
              locations={novel.locations || []}
              onAddLocation={handleAddLocation}
              onUpdateLocation={handleUpdateLocation}
              onDeleteLocation={handleDeleteLocation}
            />
          )}

          {mainTab === 'diff' && (() => {
            const currentActNumber = diffActNumber || novel.acts[0]?.number || 1;
            const currentAct = novel.acts.find(a => a.number === currentActNumber) || novel.acts[0];
            const currentChNumber = diffChapterNumber || currentAct?.chapters[0]?.number || 1;
            const currentCh = currentAct?.chapters.find(c => c.number === currentChNumber) || currentAct?.chapters[0];

            const getChapterTextByVer = (ver: string) => {
              if (!currentCh) return '';
              return (currentCh.scenes || []).flatMap(s => s.paragraphs || [])
                .map(p => {
                  if (p.versions && p.versions[ver]?.content) return p.versions[ver].content;
                  if (p.activeVersion && p.versions && p.versions[p.activeVersion]?.content) {
                    return p.versions[p.activeVersion].content;
                  }
                  const firstKey = Object.keys(p.versions || {})[0];
                  return (firstKey && p.versions[firstKey]?.content) || '';
                })
                .filter(Boolean)
                .join('\n\n');
            };

            const leftCompareText = getChapterTextByVer(diffVersionA);
            const rightCompareText = getChapterTextByVer(diffVersionB);

            return (
              <div className="space-y-6 animate-fade-in">
                {/* 상단 챕터 및 버전 선택기 */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-zinc-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚖️</span>
                      <div>
                        <h2 className="text-base font-bold text-amber-400">
                          {novel.title} - 챕터 버전 나란히 비교 & 채택
                        </h2>
                        <p className="text-zinc-400 text-[11px]">
                          선택한 챕터의 두 버전을 라인별 수평 정렬로 비교하고 최종 버전을 채택하세요
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/tools/novel-diff"
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors flex items-center gap-1 font-semibold"
                    >
                      <span>↗️</span> 독립 비교 도구 열기
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-zinc-400 mb-1">비교 대상 막(Act)</label>
                      <select
                        value={currentActNumber}
                        onChange={e => {
                          const num = parseInt(e.target.value, 10) || 1;
                          setDiffActNumber(num);
                          const act = novel.acts.find(a => a.number === num);
                          if (act && act.chapters[0]) setDiffChapterNumber(act.chapters[0].number);
                        }}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200"
                      >
                        {novel.acts.map(act => (
                          <option key={act.number} value={act.number}>
                            {act.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">비교 대상 장(Chapter)</label>
                      <select
                        value={currentChNumber}
                        onChange={e => setDiffChapterNumber(parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-200 truncate"
                      >
                        {currentAct?.chapters.map(ch => (
                          <option key={ch.number} value={ch.number}>
                            {ch.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-rose-400 font-semibold mb-1">◀ 좌측 비교 버전 (A)</label>
                      <select
                        value={diffVersionA}
                        onChange={e => setDiffVersionA(e.target.value)}
                        className="w-full bg-zinc-950 border border-rose-500/40 text-rose-300 font-mono rounded-lg p-2"
                      >
                        {novel.versionHistory.map(v => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-emerald-400 font-semibold mb-1">▶ 우측 비교 버전 (B)</label>
                      <select
                        value={diffVersionB}
                        onChange={e => setDiffVersionB(e.target.value)}
                        className="w-full bg-zinc-950 border border-emerald-500/40 text-emerald-300 font-mono rounded-lg p-2"
                      >
                        {novel.versionHistory.map(v => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Diff Viewer */}
                <NovelSideBySideDiff
                  initialLeftText={leftCompareText}
                  initialRightText={rightCompareText}
                  leftLabel={`${currentCh?.title || '챕터'} [${diffVersionA}]`}
                  rightLabel={`${currentCh?.title || '챕터'} [${diffVersionB}]`}
                  onAdoptLeft={text => {
                    navigator.clipboard.writeText(text);
                    alert(`[${diffVersionA}] 버전 본문이 클립보드에 복사되었습니다!`);
                  }}
                  onAdoptRight={text => {
                    navigator.clipboard.writeText(text);
                    alert(`[${diffVersionB}] 버전 본문이 클립보드에 복사되었습니다!`);
                  }}
                />
              </div>
            );
          })()}

          {mainTab === 'story' && (
            activeTab === 'reader' ? (
              /* 전체 연속 정독 & 인라인 수정 뷰어 (메인 모드) */
              <NovelFullReader
                novel={novel}
                customVersionMap={customVersionMap}
                onAddNewVersion={handleAddNewVersion}
                onParagraphVersionChange={handleParagraphVersionChange}
                onSaveAiPrompt={handleSaveAiPrompt}
                onDeleteParagraph={handleDeleteParagraph}
                onInsertParagraph={handleInsertParagraph}
                onInsertParagraphBefore={handleInsertParagraphBefore}
                onInsertChapter={handleInsertChapter}
                onInsertChapterBefore={handleInsertChapterBefore}
                onDeleteChapter={handleDeleteChapter}
                onInsertActAfter={handleInsertActAfter}
                onInsertActBefore={handleInsertActBefore}
                onDeleteAct={handleDeleteAct}
                onUpdateActMetadata={handleUpdateActMetadata}
                onUpdateChapterMetadata={handleUpdateChapterMetadata}
                onInsertScene={handleInsertScene}
                onDeleteScene={handleDeleteSceneInner}
                onUpdateSceneMetadata={handleUpdateSceneMetadata}
              />
            ) : activeTab === 'mosaic' ? (
              /* 마스터 최종본 조합 스튜디오 */
              <NovelMosaicMixer novel={novel} customVersionMap={customVersionMap} />
            ) : (
              /* 단락별 집필 및 버전 비교 모드 */
              <div>
              {/* Novel Logline & Overview Card */}
              <div className="bg-gradient-to-r from-zinc-900 via-amber-950/20 to-zinc-900 border border-amber-500/30 rounded-2xl p-6 mb-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    SF NOVEL OUTLINE & ARCHITECTURE
                  </span>
                  <button
                    onClick={() => setShowOutlineDetails(!showOutlineDetails)}
                    className="text-xs text-zinc-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <span>{showOutlineDetails ? '개요/인물정보 접기 ▲' : '개요/인물정보 펼치기 ▼'}</span>
                  </button>
                </div>

                <h2 className="text-3xl font-black text-white mb-2">
                  {novel.title}
                </h2>
                <p className="text-xs text-amber-200/90 mb-4 font-semibold">
                  {novel.subtitle}
                </p>

                {/* Logline Box */}
                {novel.logline && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span>💡</span> 작품 개요 (Logline)
                    </h3>
                    <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                      {novel.logline}
                    </p>
                  </div>
                )}

                {/* 상세 개요 및 인물/3막 구조 */}
                {showOutlineDetails && (
                  <div className="space-y-6 pt-4 border-t border-zinc-800/80">
                    {/* 캐릭터 설정 */}
                    {novel.characters && novel.characters.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <span>👥</span> 주요 캐릭터 설정 (과학적 패러다임의 대립)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          {novel.characters.map((char) => (
                            <div
                              key={char.id}
                              className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5 space-y-1.5"
                            >
                              <div className="font-bold text-amber-400 text-sm">
                                {char.name}
                              </div>
                              <div className="text-[11px] text-amber-200/70 font-mono">
                                {char.role}
                              </div>
                              <div className="text-zinc-400 italic text-[11px]">
                                "{char.tagline}"
                              </div>
                              <p className="text-zinc-300 text-[11px] leading-relaxed pt-1">
                                {char.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 핵심 3막 플롯 및 논문 매핑 요약 */}
                    <div>
                      <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <span>🗺️</span> 핵심 3막 플롯 (원작 논문 I~IV 수식 및 서사 매핑)
                      </h3>
                      <div className="space-y-2.5 text-xs">
                        {novel.acts.map((act) => (
                          <div
                            key={act.number}
                            className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3 flex flex-col md:flex-row gap-3 md:items-center justify-between"
                          >
                            <div className="font-bold text-amber-300 min-w-[140px]">
                              🎬 {act.title}
                            </div>
                            <div className="flex-1 space-y-1 text-[11px]">
                              {act.theory && (
                                <div className="text-zinc-300">
                                  <span className="text-amber-400 font-semibold">🔮 이론:</span> {act.theory}
                                </div>
                              )}
                              {act.story && (
                                <div className="text-zinc-400">
                                  <span className="text-emerald-400 font-semibold">🚀 서사:</span> {act.story}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Acts & Chapters List */}
              {novel.acts.map((act) => (
                <div key={act.number} className="mb-12 space-y-6">
                  {/* Act Title Header */}
                  <div className="bg-zinc-900/90 border border-amber-500/20 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-amber-400 tracking-tight">
                        {act.title}
                      </h2>
                      <span className="text-xs font-mono text-zinc-500">
                        {act.chapters.length}개 장 수록
                      </span>
                    </div>

                    {act.summary && (
                      <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                        {act.summary}
                      </p>
                    )}

                    {(act.theory || act.story) && (
                      <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {act.theory && (
                          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/60 text-zinc-300">
                            <span className="text-amber-400 font-bold">🔮 논문 연동 이론:</span> {act.theory}
                          </div>
                        )}
                        {act.story && (
                          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/60 text-zinc-300">
                            <span className="text-emerald-400 font-bold">🚀 서사 전개:</span> {act.story}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Chapters */}
                  {act.chapters.map((ch) => (
                    <div
                      key={ch.number}
                      id={`act-${act.number}-ch-${ch.number}`}
                      className="space-y-4 scroll-mt-20"
                    >
                      <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl">
                        <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                          <span>📖</span> {ch.title}
                        </h3>
                        {ch.synopsis && (
                          <p className="text-xs text-zinc-400 mt-1">{ch.synopsis}</p>
                        )}
                      </div>

                      {/* Paragraphs */}
                      <div className="pl-2 space-y-4">
                        {(ch.scenes || []).flatMap(s => s.paragraphs || []).map((p) => {
                          const selectedVer = customVersionMap[p.id] || p.activeVersion;
                          return (
                            <NovelParagraphViewer
                              key={p.id}
                              paragraph={p}
                              allVersions={novel.versionHistory}
                              selectedVersion={selectedVer}
                              onVersionChange={handleParagraphVersionChange}
                              onAddNewVersion={handleAddNewVersion}
                              onSaveAiPrompt={handleSaveAiPrompt}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )
        )}
        </main>
      </div>

      {/* 초안 가져오기 모달 */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <span>📥</span> 소설 초안 가져오기 및 등록
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleImportDraft} className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">대상 막(Act)</label>
                  <input
                    type="number"
                    min={1}
                    value={importTargetAct}
                    onChange={(e) => setImportTargetAct(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">대상 장(Chapter)</label>
                  <input
                    type="number"
                    min={1}
                    value={importTargetChapter}
                    onChange={(e) => setImportTargetChapter(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">버전 태그</label>
                  <input
                    type="text"
                    value={importVersionTag}
                    onChange={(e) => setImportVersionTag(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-amber-300 font-mono"
                    placeholder="v1.0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  초안 텍스트 붙여넣기 (줄바꿈/빈 줄 단위로 단락이 자동 분할됩니다)
                </label>
                <textarea
                  value={importDraftText}
                  onChange={(e) => setImportDraftText(e.target.value)}
                  rows={8}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-100 font-sans focus:outline-none focus:border-amber-500"
                  placeholder="작성 중이신 초안 텍스트를 이곳에 붙여넣으세요..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-5 py-2 rounded-lg font-bold shadow-lg shadow-amber-500/10"
                >
                  초안 데이터 적용하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
