import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import katex from 'katex';

// Component Imports
import { papersMap, ParagraphData, ReferenceData, PaperDetails } from '../../components/PaperPlatform/paperData';
import { SimulationWidget } from '../../components/PaperPlatform/SimulationWidget';
import { SimulationWidget_V2 } from '../../components/PaperPlatform/SimulationWidget_V2';
import { SimulationWidget_V3 } from '../../components/PaperPlatform/SimulationWidget_V3';
import { PaperDiffViewer } from '../../components/PaperPlatform/PaperDiffViewer';
import { ReferencePdfPanel } from '../../components/PaperPlatform/ReferencePdfPanel';
import { ReviewTracker } from '../../components/PaperPlatform/ReviewTracker';
import { EquationTooltip } from '../../components/PaperPlatform/EquationTooltip';

const paperDOIs: Record<string, { doi: string; repo: string }> = {
  'spatial-vibration-1': {
    doi: '10.5281/zenodo.21206211',
    repo: 'https://github.com/khanyong/spatial-vibration-series'
  },
  'spatial-vibration-2': {
    doi: '10.5281/zenodo.21233252',
    repo: 'https://github.com/khanyong/spatial-vibration-series-2'
  },
  'spatial-vibration-3': {
    doi: '10.5281/zenodo.21258029',
    repo: 'https://github.com/khanyong/spatial-vibration-series-3'
  }
};

const getChapterTitle = (ch: any, version: string, lang: 'ko' | 'en') => {
  if (ch.title.versions && ch.title.versions[version] && ch.title.versions[version][lang]) {
    return ch.title.versions[version][lang];
  }
  return ch.title[lang] || '';
};

const isChapterVisible = (ch: any, version: string) => {
  if (version === 'diff') return true;
  return ch.paragraphs.some((p: any) => {
    const versionsMap = p.versions || {};
    const txt = versionsMap[version]?.ko || versionsMap[version]?.en || '';
    if (!txt) return false;
    let clean = txt.trim();
    if (clean.startsWith('- ')) clean = clean.slice(2).trim();
    if (version === 'v2' && clean.startsWith('~~') && clean.endsWith('~~')) {
      return false;
    }
    return true;
  });
};
import { CitationGenerator } from '../../components/PaperPlatform/CitationGenerator';
import { PaperExport } from '../../components/PaperPlatform/PaperExport';
import { AuthModal } from '../../components/PaperPlatform/AuthModal';

// Supabase client import for dynamic fetching
import { supabase } from '../../shared/lib/supabase';

// ==================== SUB-COMPONENT: INTERACTIVE REVISION PARAGRAPH ====================
// ==================== SUB-COMPONENT: INTERACTIVE REVISION PARAGRAPH ====================
interface InteractiveParagraphProps {
  p: ParagraphData;
  lang: 'ko' | 'en';
  versionMode: string;
  isAuthorized: boolean;
  chNumber: number;
  setIsAuthModalOpen: (open: boolean) => void;
  parseParagraphText: (text: string, currentLang: 'ko' | 'en') => React.ReactNode;
  isMosaicMode?: boolean;
  customVersionMap?: Record<string, string>;
  onVersionSelect?: (paragraphId: string, ver: string) => void;
}

const InteractiveParagraph: React.FC<InteractiveParagraphProps> = ({
  p,
  lang,
  versionMode,
  isAuthorized,
  chNumber,
  setIsAuthModalOpen,
  parseParagraphText,
  isMosaicMode = false,
  customVersionMap = {},
  onVersionSelect
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // versions 맵 사용
  const versionsMap = p.versions || {};

  // 결정론적 단락 버전 선택 (모자이크 모드 우선)
  const chosenVersion = (() => {
    if (isMosaicMode && customVersionMap[p.id]) {
      return customVersionMap[p.id];
    }
    if (versionMode === 'diff') {
      const versionsList = Object.keys(p.versions)
        .filter(v => v !== 'diff' && v !== 'v1_v2')
        .sort((a, b) => {
          const numA = parseFloat(a.replace('v', ''));
          const numB = parseFloat(b.replace('v', ''));
          return numA - numB;
        });
      return versionsList[versionsList.length - 1] || 'v8';
    }
    return versionMode;
  })();

  // 버전별 상속 체인 Fallback 데이터 해석기 (한영 혼용 방지를 위한 엄격한 언어 분리 상속)
  const getParagraphTextForVersion = (vKey: string, currentLang: 'ko' | 'en') => {
    const directText = versionsMap[vKey]?.[currentLang]?.trim() || '';
    
    // v3 and later versions are fully complete, independent markdown documents.
    // They MUST NOT inherit paragraphs from older or baseline versions.
    if (vKey !== 'v1' && vKey !== 'v2') {
      return directText; // Return directText exactly (if missing, it is deleted)
    }

    if (directText) return directText;

    if (vKey === 'v2') {
      const v1Text = versionsMap['v1']?.[currentLang]?.trim() || '';
      if (v1Text) {
        return v1Text.replace(/~~/g, ''); // v2에 데이터가 없고 v1만 취소선으로 있다면 취소선을 뗀 일반 텍스트가 v2 최종본의 내용임
      }
    }

    if (vKey === 'v1') {
      const v2Text = versionsMap['v2']?.[currentLang]?.trim() || '';
      if (v2Text) return v2Text;
    }

    return '';
  };

  if (versionMode === 'diff' && !isMosaicMode) {
    return (
      <div className="border border-zinc-150 p-2 rounded-sm bg-zinc-50/50 mb-4">
        <PaperDiffViewer paragraphId={p.id} lang={lang} />
      </div>
    );
  }

  const v1Raw = getParagraphTextForVersion('v1', lang);
  const v2Raw = getParagraphTextForVersion('v2', lang);
  const activeText = getParagraphTextForVersion(chosenVersion, lang);

  // 1. 기본 텍스트 체크
  if (!activeText) return null;

  // 1.5. 본문에 포함된 기존 중복 참고문헌 단락 필터링
  const isLegacyRef = activeText.trim().startsWith('[1]') ||
    activeText.trim().startsWith('[2]') ||
    activeText.trim().startsWith('[3]') ||
    activeText.trim().startsWith('[4]') ||
    activeText.trim().startsWith('[5]') ||
    activeText.trim().startsWith('~~[1]') ||
    activeText.trim().startsWith('~~[2]') ||
    activeText.trim().startsWith('~~[3]') ||
    activeText.trim().startsWith('~~[4]') ||
    activeText.trim().startsWith('~~[5]');
  if (isLegacyRef) return null;

  // 2. 리스트 기호를 제외한 순수 알맹이 텍스트 추출
  let cleanBody = activeText;
  if (cleanBody.startsWith('- ')) {
    cleanBody = cleanBody.slice(2).trim();
  }

  // 3. 최종본(v2 이상) 모드인데 본문 전체가 취소선인 경우 리스트 기호 포함하여 통째로 렌더링 생략
  if (chosenVersion !== 'v1' && cleanBody.startsWith('~~') && cleanBody.endsWith('~~')) {
    return null;
  }

  // 4. V1(초안) 모드인데 V1 내용이 비어있는 경우 생략
  if (!isMosaicMode && chosenVersion === 'v1' && !v1Raw) {
    return null;
  }

  // 다중 버전 통틀어서 고유 텍스트 개수가 2개 이상이면 수정 이력 있음으로 판단
  const versionKeys = Object.keys(versionsMap).filter(k => versionsMap[k]?.[lang]?.trim() || versionsMap[k]?.ko?.trim());
  const uniqueTexts = new Set(versionKeys.map(k => (versionsMap[k]?.[lang] || '').trim()));
  const hasHistory = uniqueTexts.size > 1;

  return (
    <div
      className={`relative group/para mb-4 text-justify font-serif transition-all duration-200 ${isMosaicMode && customVersionMap[p.id]
          ? 'bg-emerald-50/20 border-l-2 border-emerald-400 pl-3.5 py-1.5 pr-2 rounded-r-sm'
          : hasHistory
            ? chosenVersion === 'v2'
              ? 'bg-amber-50/30 border-l-2 border-amber-300 pl-3.5 py-1.5 pr-2 rounded-r-sm hover:bg-amber-50/50'
              : 'bg-blue-50/30 border-l-2 border-blue-300 pl-3.5 py-1.5 pr-2 rounded-r-sm hover:bg-blue-50/55'
            : ''
        }`}
    >
      {/* ✏️ 일반 모드 수정 이력 뱃지 및 호버 툴팁 */}
      {!isMosaicMode && hasHistory && (
        <div className="absolute right-2 -top-2.5 opacity-35 group-hover/para:opacity-100 transition-opacity z-20">
          <div className="relative inline-block">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              className={`px-1.5 py-0.5 rounded-sm font-mono text-[9px] font-bold shadow-xs border transition-colors cursor-help ${chosenVersion === 'v2'
                  ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                  : 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'
                }`}
            >
              ✏️ {chosenVersion === 'v2' ? 'v1.0.0 이력 있음' : `${chosenVersion} 변경안 보기`}
            </button>

            {/* 호버 시 튀어나오는 말풍선 툴팁 */}
            {showTooltip && (
              <div className="absolute right-0 bottom-6 w-80 p-3 bg-zinc-950 text-white rounded-sm shadow-xl text-[11px] leading-relaxed z-50 font-sans pointer-events-none">
                <div className="font-bold text-[#f2ede4] mb-1.5 pb-1 border-b border-zinc-800 flex justify-between font-mono text-[9px] uppercase tracking-wider">
                  <span>{chosenVersion === 'v2' ? 'V1.0.0 (이전 취소선 초안)' : '최종 변경안'}</span>
                  <span className="text-amber-400">History Log</span>
                </div>
                <p className="text-zinc-300 italic text-justify leading-relaxed">
                  {chosenVersion === 'v2' ? (
                    <span className="line-through decoration-red-500/50 text-zinc-400">
                      {v1Raw.startsWith('- ') ? v1Raw.slice(2) : v1Raw}
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold">
                      {v2Raw.startsWith('- ') ? v2Raw.slice(2) : v2Raw}
                    </span>
                  )}
                </p>
                <div className="absolute right-4 -bottom-1 w-2.5 h-2.5 bg-zinc-950 rotate-45 transform" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🎨 모자이크 조립 스위처 배지 (호버 시 또는 선택 시 세련되게 활성화) */}
      {isMosaicMode && onVersionSelect && (
        <div className="absolute right-2 -top-2.5 opacity-60 group-hover/para:opacity-100 transition-opacity z-20 flex items-center space-x-1 bg-white border border-zinc-200 shadow-xs px-1 rounded-sm">
          <span className="text-[7.5px] font-mono text-zinc-400 uppercase tracking-widest mr-1">Assemble:</span>
          {['v1', 'v2', 'v3', 'v4'].map((vKey) => {
            const hasVerText = getParagraphTextForVersion(vKey, lang);
            if (!hasVerText) return null;
            const isSel = chosenVersion === vKey;
            return (
              <button
                key={vKey}
                onClick={() => onVersionSelect(p.id, vKey)}
                className={`px-1 py-0.5 text-[8.5px] font-mono font-bold rounded-xs cursor-pointer transition-colors ${isSel
                    ? 'bg-emerald-600 text-white'
                    : 'text-zinc-550 hover:bg-zinc-100 hover:text-zinc-950'
                  }`}
              >
                {vKey.toUpperCase()}
              </button>
            );
          })}
        </div>
      )}

      {/* In-context reviewer objection pin */}
      {p.reviewIds && p.reviewIds.length > 0 && (
        <span className="absolute -left-6 top-1 text-[8px] bg-red-800/10 border border-[#8b1a1a]/30 text-[#8b1a1a] px-1 rounded flex items-center font-mono opacity-60 group-hover/para:opacity-100 transition-opacity">
          Rev R{p.reviewIds.map(r => r.replace('rev', '')).join(',')}
        </span>
      )}

      <div key={`${lang}_${chosenVersion}_${p.id}`} className="indent-6 leading-relaxed text-sm md:text-base text-zinc-900 tracking-wide mathjax-latex-content">
        {parseParagraphText(activeText, lang)}
      </div>
    </div>
  );
};

// ==================== SUB-COMPONENT: ACADEMIC REFERENCES SECTION ====================
const ReferencesSection: React.FC<{
  references: Record<string, ReferenceData>;
  journalMode: 'nature' | 'prl' | 'ieee' | 'arxiv';
  lang: 'ko' | 'en';
}> = ({ references, journalMode, lang }) => {
  const refList = Object.values(references);
  if (refList.length === 0) return null;

  const renderReferenceText = (ref: ReferenceData, index: number) => {
    const num = index + 1;
    const { authors, title, journal, year, pdfUrl, citedPage } = ref;

    if (journalMode === 'nature') {
      return (
        <span className="text-zinc-800 font-sans text-xs">
          <span className="font-bold mr-1.5">{num}.</span>
          {authors}. {title}. <span className="italic font-medium">{journal}</span> <span className="font-bold">{citedPage}</span> ({year}).
        </span>
      );
    }

    if (journalMode === 'prl') {
      return (
        <span className="text-zinc-900 font-serif text-sm">
          <span className="mr-2">[{num}]</span>
          {authors}, <span className="italic">{journal}</span> <span className="font-bold">{citedPage}</span> ({year}).
        </span>
      );
    }

    if (journalMode === 'ieee') {
      return (
        <span className="text-zinc-800 font-serif text-xs">
          <span className="mr-2">[{num}]</span>
          {authors}, "{title}," <span className="italic">{journal}</span>, pp. {citedPage}, {year}.
        </span>
      );
    }

    // arXiv (Default)
    return (
      <span className="text-zinc-700 font-mono text-xs leading-relaxed">
        <span className="text-[#b31b1b] font-bold mr-1">[{num}]</span>
        {authors} ({year}). "{title}." <span className="italic">{journal}</span>, p. {citedPage}.
      </span>
    );
  };

  return (
    <div className="mt-12 pt-6 border-t-2 border-zinc-300">
      <h3 className="text-base font-bold mb-4 font-serif text-zinc-900 tracking-wide uppercase border-b border-zinc-200 pb-1">
        {lang === 'ko' ? '참고문헌 (References)' : 'References'}
      </h3>
      <ul className="space-y-3">
        {refList.map((ref, idx) => (
          <li key={ref.id} className="flex items-start gap-1">
            <div className="flex-1">
              {renderReferenceText(ref, idx)}
              {ref.pdfUrl && (
                <a
                  href={ref.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-[10px] text-blue-600 hover:text-blue-800 underline font-mono inline-flex items-center gap-0.5"
                >
                  [PDF] ↗
                </a>
              )}
              <p className="text-[10px] text-zinc-550 font-serif mt-0.5 pl-4 italic">
                &quot;{lang === 'ko' ? ref.citedContext.ko : ref.citedContext.en}&quot;
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ==================== MAIN PAGE VIEW ====================
export default function AcademicPaperViewer() {
  const router = useRouter();
  const { slug } = router.query;

  // State to hold paper data dynamically (Supabase client + local fallback)
  const [paperData, setPaperData] = useState<PaperDetails | null>(null);

  // Load paper data and sync with Supabase
  useEffect(() => {
    if (!slug) return;
    const fallback = papersMap[slug as string] || papersMap[Object.keys(papersMap)[0]] || null;
    setPaperData(fallback);

    const loadFreshData = async () => {
      try {
        const { data, error } = await supabase
          .from('papers_v2')
          .select('document_data')
          .eq('slug', slug)
          .single();

        if (data && data.document_data) {
          console.log(`🍀 Loaded fresh version data from Supabase for ${slug}`);
          setPaperData(data.document_data as PaperDetails);
        }
      } catch (err) {
        console.warn('Could not sync latest paper details from Supabase.', err);
      }
    };

    loadFreshData();
  }, [slug]);

  // Navigation Links Calculation
  const slugKeys = Object.keys(papersMap);
  const currentIndex = slugKeys.indexOf(slug as string);
  const prevSlug = currentIndex > 0 ? slugKeys[currentIndex - 1] : null;
  const nextSlug = currentIndex < slugKeys.length - 1 ? slugKeys[currentIndex + 1] : null;

  // Layout & Navigation States
  const [journalMode, setJournalMode] = useState<'nature' | 'prl' | 'ieee' | 'arxiv'>('arxiv');
  const [readMode, setReadMode] = useState<'single' | 'bilingual'>('single');
  const [activeLang, setActiveLang] = useState<'ko' | 'en'>('ko');
  const [versionMode, setVersionMode] = useState<string>('v2');
  const [isMosaicMode, setIsMosaicMode] = useState<boolean>(false);
  const [customVersionMap, setCustomVersionMap] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'body' | 'sandbox' | 'reviews' | 'export'>('body');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('abstract'); // Focus on Abstract by default

  const handleVersionSelect = (paragraphId: string, ver: string) => {
    setCustomVersionMap(prev => ({
      ...prev,
      [paragraphId]: ver
    }));
  };

  // Auth States
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [showAuthorModal, setShowAuthorModal] = useState<boolean>(false);

  // Split Panel & Reference States
  const [selectedReference, setSelectedReference] = useState<ReferenceData | null>(null);

  // Scroll Sync Refs
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  // 1. Client-side authorization fetch with 6-hour expiration TTL validation
  useEffect(() => {
    try {
      const raw = localStorage.getItem('academic_invite_authorized_v2');
      if (raw) {
        const authObj = JSON.parse(raw);
        const isExpired = Date.now() > authObj.expireAt;
        if (authObj.authorized && !isExpired) {
          setIsAuthorized(true);
          const email = localStorage.getItem('academic_user_email') || '';
          setUserEmail(email);
          return;
        }
        // Clear expired credential state
        localStorage.removeItem('academic_invite_authorized_v2');
      }
    } catch (e) {
      console.error('Auth state parsing failed:', e);
    }
    setIsAuthorized(false);
    setUserEmail('');
  }, []);

  // 1-2. URL 쿼리 파라미터 복구 (Restore state from URL parameters)
  useEffect(() => {
    if (!router.isReady) return;

    const { tab, mode, lang, v } = router.query;

    if (tab && ['body', 'sandbox', 'reviews', 'export'].includes(tab as string)) {
      setActiveTab(tab as any);
    }
    if (mode && ['single', 'bilingual'].includes(mode as string)) {
      setReadMode(mode as any);
    }
    if (lang && ['ko', 'en'].includes(lang as string)) {
      setActiveLang(lang as any);
    }
    if (v) {
      setVersionMode(v as string);
    }
  }, [router.isReady, router.query.tab, router.query.mode, router.query.lang, router.query.v]);

  // Dynamically default the version selection to the latest compiled version if query parameter is empty
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.v) return; // Preserve manual query selection
    if (!paperData) return; // Null guard to prevent runtime TypeError during initial loading

    const availableVersions = Object.keys(paperData.abstract?.versions || {});
    if (availableVersions.length > 0) {
      const latestVersion = availableVersions[availableVersions.length - 1];
      if (latestVersion && latestVersion !== versionMode) {
        setVersionMode(latestVersion);
      }
    }
  }, [paperData, router.isReady, router.query.v]);

  // 1-3. 상태 변경 시 URL 쿼리 파라미터 동기화 (Sync status to URL query parameters)
  useEffect(() => {
    if (!router.isReady) return;

    const currentQuery = { ...router.query };
    let changed = false;

    if (currentQuery.tab !== activeTab) {
      currentQuery.tab = activeTab;
      changed = true;
    }
    if (currentQuery.mode !== readMode) {
      currentQuery.mode = readMode;
      changed = true;
    }
    if (currentQuery.lang !== activeLang) {
      currentQuery.lang = activeLang;
      changed = true;
    }
    if (currentQuery.v !== versionMode) {
      currentQuery.v = versionMode;
      changed = true;
    }

    if (changed) {
      router.replace(
        {
          pathname: router.pathname,
          query: currentQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [activeTab, readMode, activeLang, versionMode, router.isReady]);

  const handleAuthSuccess = (inviteVerified: boolean, emailUser?: string) => {
    setIsAuthorized(inviteVerified);
    if (emailUser) {
      setUserEmail(emailUser);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('academic_invite_authorized_v2');
    localStorage.removeItem('academic_invite_authorized'); // Legacy clean
    localStorage.removeItem('academic_user_email');
    setIsAuthorized(false);
    setUserEmail('');
    setSelectedReference(null);
  };

  // Scroll Synchronization for Bilingual mode
  const handleScrollSync = (source: 'left' | 'right') => {
    if (readMode !== 'bilingual' || isSyncingRef.current) return;
    isSyncingRef.current = true;

    const sourceEl = source === 'left' ? leftScrollRef.current : rightScrollRef.current;
    const targetEl = source === 'left' ? rightScrollRef.current : leftScrollRef.current;

    if (sourceEl && targetEl) {
      const scrollPercentage = sourceEl.scrollTop / (sourceEl.scrollHeight - sourceEl.clientHeight);
      targetEl.scrollTop = scrollPercentage * (targetEl.scrollHeight - targetEl.clientHeight);
    }

    isSyncingRef.current = false;
  };

  const handleScrollToSection = (paragraphId: string) => {
    setActiveTab('body');
    setTimeout(() => {
      const el = document.getElementById(paragraphId) || document.getElementById(`ko-${paragraphId}`) || document.getElementById(`en-${paragraphId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('bg-yellow-100/50');
        setTimeout(() => el.classList.remove('bg-yellow-100/50'), 2500);
      }
    }, 200);
  };

  // Parsing helper for math & references with KaTeX integrated rendering
  const parseParagraphText = (text: string, currentLang: 'ko' | 'en') => {
    if (!text) return null;

    // Replace double backslashes with single backslash globally for all TeX parsing
    let processedText = text.trim().replace(/\\\\/g, '\\');

    // Prevent bundler escaping bugs that split \nu into literal newlines and 'u'
    processedText = processedText
      .replace(/\r?\n\s*u/g, '\\nu')
      .replace(/\r?\n\s*a/g, '\\na')
      .replace(/\\n\s*u/g, '\\nu')
      .replace(/\\n\s*a/g, '\\na')
      .replace(/\r?\n/g, ' ');

    // 1. Hide raw display math delimiters ($$)
    if (processedText === '$$') {
      return null;
    }

    const cleanMathText = processedText;

    // 2. Check if the text is a block display math (wrapped in $$ ... $$ or starting with common LaTeX keywords without Korean/English text)
    const isExplicitBlockMath = processedText.startsWith('$$') && processedText.endsWith('$$');

    // Heuristic: If it has math backslashes and LaTeX symbols, and contains no common language words
    const hasMathIndicators = cleanMathText.includes('\\') || cleanMathText.includes('^') || cleanMathText.includes('_');

    // Check if it's purely a formula (doesn't contain typical Korean syllables or sentence spacing patterns)
    const isPureFormula = hasMathIndicators && 
      !/[가-힣]/.test(cleanMathText) && 
      cleanMathText.split(/\s+/).length < 12 && (
      cleanMathText.includes('\\frac') ||
      cleanMathText.includes('\\hbar') ||
      cleanMathText.includes('\\psi') ||
      cleanMathText.includes('\\partial') ||
      cleanMathText.includes('\\nabla') ||
      cleanMathText.includes('\\equiv') ||
      cleanMathText.includes('\\lambda') ||
      cleanMathText.includes('\\int') ||
      cleanMathText.includes('\\sum') ||
      cleanMathText.includes('\\cdot') ||
      cleanMathText.includes('\\mu') ||
      cleanMathText.includes('\\nu') ||
      cleanMathText.includes('\\tilde') ||
      cleanMathText.includes('\\ddot') ||
      cleanMathText.includes('\\rho') ||
      cleanMathText.includes('\\Delta') ||
      cleanMathText.includes('\\Gamma') ||
      cleanMathText.includes('^2')
    );

    if (isExplicitBlockMath || isPureFormula) {
      let formula = cleanMathText;
      if (isExplicitBlockMath) {
        formula = cleanMathText.slice(2, -2).trim();
      }
      try {
        const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
        return (
          <div
            className="my-4 py-2 overflow-x-auto select-all selection:bg-[#8b1a1a]/20 mathjax-latex-content block-formula-container"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (err) {
        return <div className="text-red-600 font-mono my-2 text-xs">LaTeX Error: {formula}</div>;
      }
    }

    // Check and handle markdown sub-headings
    let headingLevel = 0;
    if (processedText.startsWith('#### ')) {
      headingLevel = 4;
      processedText = processedText.slice(5).trim();
    } else if (processedText.startsWith('### ')) {
      headingLevel = 3;
      processedText = processedText.slice(4).trim();
    } else if (processedText.startsWith('## ')) {
      headingLevel = 2;
      processedText = processedText.slice(3).trim();
    }

    let isListItem = false;
    if (processedText.startsWith('- ')) {
      isListItem = true;
      processedText = processedText.slice(2).trim();
    }

    // Inline Markdown (Bold, Strikethrough)
    const renderInlineMarkdown = (plainText: string) => {
      if (!plainText) return '';
      const parts = plainText.split(/(\*\*[^*]+\*\*)|(~~[^~]+~~)/g);
      return parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-zinc-955 bg-zinc-100 px-1 rounded">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('~~') && part.endsWith('~~')) {
          // Hide strikethrough content for all compiled revision versions (v2, v3 etc.)
          if (versionMode !== 'v1') return null;
          return <span key={i} className="line-through text-zinc-400 opacity-60 decoration-red-800/40">{part.slice(2, -2)}</span>;
        }
        return part;
      });
    };

    // Parser for inline LaTeX math ($...$)
    const parseInlineMath = (plainText: string) => {
      if (!plainText) return null;

      const parts = plainText.split(/(\$[^\$]+\$)/g);
      return parts.map((part, index) => {
        if (!part) return null;
        if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1).trim();
          try {
            const html = katex.renderToString(formula, { displayMode: false, throwOnError: false });
            return (
              <span
                key={index}
                className="inline-block px-0.5 max-w-full overflow-x-auto overflow-y-hidden align-middle select-all selection:bg-[#8b1a1a]/20"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (err) {
            return <span key={index} className="text-red-600 font-mono text-xs">LaTeX Error: {formula}</span>;
          }
        }
        return <span key={index}>{renderInlineMarkdown(part)}</span>;
      });
    };

    // Split for citation bracket tokens like [1], [2]
    const tokens = processedText.split(/(\[\d+\])/g);

    const parsedNodes = tokens.map((token, index) => {
      if (!token) return null;

      // 1. Reference check [N]
      if (token.startsWith('[') && token.endsWith(']')) {
        const refNum = token.slice(1, -1);
        const refId = `ref${refNum}`;
        const refObj = paperData?.references?.[refId];

        return (
          <button
            key={index}
            onClick={() => refObj && setSelectedReference(refObj)}
            className="mx-0.5 px-1.5 py-0.5 bg-red-855/5 hover:bg-[#8b1a1a] hover:text-white border border-[#8b1a1a]/20 text-[#8b1a1a] text-[10px] font-bold font-mono rounded inline-flex items-center align-middle transform transition-all hover:scale-105 active:scale-95"
            title={refObj ? `${refObj.authors} (${refObj.year})` : 'Citation'}
          >
            {token}
          </button>
        );
      }

      // 2. Plain text (parse inline math inside)
      return <React.Fragment key={index}>{parseInlineMath(token)}</React.Fragment>;
    });

    if (headingLevel === 3) {
      return <h4 className="text-md font-bold text-[#8b1a1a] mt-6 mb-3 block font-serif">{parsedNodes}</h4>;
    }
    if (headingLevel === 4) {
      return <h5 className="text-sm font-semibold text-zinc-800 mt-4 mb-2 block font-serif">{parsedNodes}</h5>;
    }
    if (headingLevel === 2) {
      return <h3 className="text-lg font-bold text-zinc-900 mt-8 mb-4 block font-serif">{parsedNodes}</h3>;
    }

    if (isListItem) {
      return (
        <span className="flex items-start gap-2 pl-2 my-0.5">
          <span className="text-[#8b1a1a] font-extrabold mt-1 select-none text-[10px]">•</span>
          <span className="flex-1 text-zinc-700">{parsedNodes}</span>
        </span>
      );
    }

    return parsedNodes;
  };

  const renderAbstractText = (rawText: string, lang: 'ko' | 'en') => {
    if (!rawText) return null;
    
    // Stitch back potential broken \nu and \nabla before applying placeholders
    let sanitizedText = rawText
      .replace(/(\$[^\$]*)\r?\n\s*u([^\$]*\$)/g, '$1\\nu$2')
      .replace(/(\$[^\$]*)\r?\n\s*a([^\$]*\$)/g, '$1\\na$2')
      .replace(/\\n\s*u/g, '\\nu')
      .replace(/\\n\s*a/g, '\\na');

    // 1. Temporarily replace valid LaTeX patterns to prevent split collision on \\n
    sanitizedText = sanitizedText
      .replace(/\\nu/g, '___LATEX_NU_PLACEHOLDER___')
      .replace(/\\nabla/g, '___LATEX_NABLA_PLACEHOLDER___')
      .replace(/\\na/g, '___LATEX_NA_PLACEHOLDER___');

    // 2. Split safely by actual or explicit paragraph markers
    const paras = sanitizedText.split(/\n|\\n/);
    return paras.map((para, idx) => {
      let trimmed = para.trim();
      if (!trimmed) return null;

      // 3. Restore LaTeX patterns before compiling KaTeX nodes
      trimmed = trimmed
        .replace(/___LATEX_NU_PLACEHOLDER___/g, '\\nu')
        .replace(/___LATEX_NABLA_PLACEHOLDER___/g, '\\nabla')
        .replace(/___LATEX_NA_PLACEHOLDER___/g, '\\na');

      return (
        <div key={idx} className={idx > 0 ? "mt-3 indent-4" : ""}>
          {parseParagraphText(trimmed, lang)}
        </div>
      );
    });
  };

  const getJournalStyleClass = () => {
    switch (journalMode) {
      case 'nature':
        return 'font-serif text-[13px] md:text-[13.5px] leading-relaxed tracking-normal columns-1 md:columns-2 gap-8 text-zinc-900 text-justify';
      case 'prl':
        return 'font-serif text-xs md:text-[12.5px] leading-normal tracking-tight columns-1 md:columns-2 gap-6 text-zinc-900 text-justify border-t border-b border-zinc-200 py-5';
      case 'ieee':
        return 'font-sans text-[12px] md:text-[12.5px] leading-normal tracking-normal columns-1 md:columns-2 gap-6 text-zinc-900 text-left';
      case 'arxiv':
      default:
        return 'font-serif text-[15.5px] md:text-base leading-relaxed tracking-wide max-w-3xl mx-auto px-4 md:px-6 text-justify text-zinc-850';
    }
  };

  if (!paperData) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center font-mono text-xs">
        <span className="animate-pulse">Loading manuscript metadata...</span>
      </div>
    );
  }

  // Workflow fallbacks
  const workflow = paperData.workflow || {
    stage: "Pre-submission Drafting",
    percent: 20,
    nextStep: "본문 집필 중",
    journalTarget: "Nature Physics"
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-[#8b1a1a]/10 selection:text-[#8b1a1a] font-sans antialiased pb-20">
      <Head>
        <title>svW:{paperData.id} - {paperData.title.ko}</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;850&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet" />

        {/* Custom Slide-In Animation style for PDF panel */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            .reference-panel-slide-in {
              animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `
        }} />
      </Head>

      {/* ==================== 1. YONSEI/UCONN BRAND TOP RIBBON (Cornell Style) ==================== */}
      <div className="bg-[#1e1e1e] text-white text-[11px] px-6 py-3 font-mono flex justify-between items-center border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="bg-[#8b1a1a] text-white px-2 py-0.5 font-bold tracking-tight rounded-xs text-[10px]">
            SVW BOARD
          </div>
          <span className="font-semibold text-zinc-300">Yonsei University / UConn Law Academic Lab Node</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400">
          <span>Principal Researcher: <strong>유광용 (Kwang yong Yoo)</strong></span>
        </div>
      </div>

      {/* ==================== 2. MAIN RED HEADER BAR (arXiv Style) ==================== */}
      <header className="bg-[#b31b1b] text-white px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight font-serif">
          <Link href="/papers" className="hover:underline">
            svW
          </Link>
          <span className="text-red-200 text-sm font-sans font-normal">
            &gt; {slug?.toString().includes('1') ? 'quant-ph' : 'gr-qc'} &gt; svW:{paperData.id}
          </span>
        </div>

        {/* Fake Search & Action */}
        <div className="flex items-center gap-3">
          <div className="flex border border-red-800 rounded-sm overflow-hidden text-xs text-zinc-800">
            <input
              type="text"
              placeholder="Search svW Archive..."
              className="px-3 py-1.5 bg-white focus:outline-none w-48"
              disabled
            />
            <button className="bg-zinc-800 text-white px-3 py-1.5 hover:bg-zinc-700 transition-colors">
              Search
            </button>
          </div>
          <Link href="/papers" className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-sm font-semibold transition-colors">
            ← Main List
          </Link>
        </div>
      </header>

      {/* ==================== 3. MAIN CORE CONTENT SPLIT ==================== */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 flex flex-col lg:flex-row gap-6 items-start">

        {/* LEFT AREA: Title, Author, Abstract, History & Main Paper Content */}
        <div className="flex-1 w-full space-y-6">

          {/* Category Header */}
          <div className="border-b border-zinc-200 pb-2">
            <span className="text-md font-bold text-zinc-800 font-serif">
              {slug?.toString().includes('1') ? 'Quantum Physics (quant-ph)' : 'General Relativity and Quantum Cosmology (gr-qc)'}
            </span>
          </div>

          {/* Submission Info & Title block */}
          <div className="space-y-4">
            <p className="text-xs text-zinc-550 italic leading-none">
              [Submitted on 25 Jun 2026]
            </p>
            <h1 className="text-xl md:text-2.5xl font-extrabold tracking-tight text-zinc-955 font-serif leading-tight">
              <span className="block">{paperData.title.ko}</span>
              <span className="block text-base md:text-lg text-zinc-500 font-normal mt-2 leading-snug font-sans">{paperData.title.en}</span>
            </h1>

            {/* Author Line */}
            <div className="text-sm font-serif">
              <button
                onClick={() => setShowAuthorModal(true)}
                className="text-[#b31b1b] font-bold hover:underline"
                title="저자 상세 프로필 보기"
              >
                {paperData.authors.ko}
              </button>
              <span className="text-zinc-500 text-xs ml-2">
                ({paperData.authors.en})
              </span>
            </div>
          </div>

          {/* Metadata Grid Fields */}
          <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-sm text-xs font-mono text-zinc-655 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1 border-b border-zinc-150 pb-2">
              <span className="font-bold text-zinc-800">Comments:</span>
              <span className="md:col-span-3 font-serif">Submission status to {workflow.journalTarget}. Rebuttal objections resolves {Object.values(paperData.reviews).filter((r: any) => r.status === 'Resolved').length} / {Object.values(paperData.reviews).length}.</span>
            </div>
            {paperDOIs[paperData.id] && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1 border-b border-zinc-150 pb-2 items-center">
                <span className="font-bold text-zinc-800 text-[#b31b1b]">Zenodo DOI:</span>
                <span className="md:col-span-3 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://doi.org/${paperDOIs[paperData.id].doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#10b981] hover:bg-[#059669] text-white px-2.5 py-1 rounded font-bold text-[10px] tracking-wide transition-all shadow-sm"
                  >
                    <span>doi:{paperDOIs[paperData.id].doi}</span>
                    <span className="bg-white/20 px-1 py-0.2 rounded text-[8px]">Open Access</span>
                  </a>
                  <a
                    href={paperDOIs[paperData.id].repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-zinc-800 text-[11px] underline"
                  >
                    Source Code & Data Repo
                  </a>
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1 border-b border-zinc-150 pb-2">
              <span className="font-bold text-zinc-800">Subjects:</span>
              <span className="md:col-span-3">Quantum Cosmology (gr-qc); Quantum Physics (quant-ph)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
              <span className="font-bold text-zinc-800">Cite as:</span>
              <span className="md:col-span-3">svW:{paperData.id} [{slug?.toString().includes('1') ? 'quant-ph' : 'gr-qc'}]</span>
            </div>
          </div>

          {/* ==================== 4. SUBMISSION HISTORY (arXiv Style Version Controller) ==================== */}
          <div className="border-t border-b border-zinc-200 py-3 space-y-2">
            <h4 className="text-xs font-bold text-zinc-900 font-mono uppercase tracking-wider">Submission history</h4>
            <div className="text-[11px] font-mono leading-relaxed space-y-1 text-zinc-655">
              {Object.keys(paperData.abstract?.versions || {}).map((vKey) => (
                <div key={vKey} className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setVersionMode(vKey)}
                    className={`px-1.5 py-0.5 rounded-sm font-bold transition-all ${versionMode === vKey ? 'bg-[#b31b1b] text-white' : 'text-[#b31b1b] hover:bg-red-50'
                      }`}
                  >
                    [{vKey}]
                  </button>
                  <span>
                    {paperData.id === 'spatial-vibration-1' ? (
                      <>
                        {vKey === 'v1' && "Thu, 25 Jun 2026 16:34:28 UTC (16,171 KB) — Initial draft with Notion strikethroughs."}
                        {vKey === 'v2' && "Sun, 28 Jun 2026 11:45:00 UTC (17,250 KB) — Current revised copy with completed rebuttals."}
                        {vKey !== 'v1' && vKey !== 'v2' && `Revision version ${vKey.slice(1)} compiled from split markdown.`}
                      </>
                    ) : (
                      <>
                        {vKey === 'v1' && "Initial submission draft containing bilingual baseline."}
                        {vKey === 'v2' && "Sun, 28 Jun 2026 11:45:00 UTC (17,250 KB) — Baseline copy."}
                        {vKey === 'v3' && "Revision version 3 compiled from newly revised split markdown."}
                        {vKey !== 'v1' && vKey !== 'v2' && vKey !== 'v3' && `Revision version ${vKey.slice(1)} compiled from split markdown.`}
                      </>
                    )}
                  </span>
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-4 pt-1.5 border-t border-zinc-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setVersionMode('diff');
                      setIsMosaicMode(false);
                    }}
                    className={`px-2 py-0.5 rounded-sm font-bold text-xs transition-all ${versionMode === 'diff' && !isMosaicMode ? 'bg-[#b31b1b] text-white' : 'text-blue-600 hover:bg-blue-50'
                      }`}
                  >
                    [Compare Versions Diff]
                  </button>
                  <span className="text-[10px] text-zinc-550 italic">Compare V1 vs V2.</span>
                </div>

                <div className="flex items-center gap-2 border-l border-zinc-200 pl-4">
                  <button
                    onClick={() => {
                      setIsMosaicMode(!isMosaicMode);
                      if (versionMode === 'diff') {
                        const availableVersions = Object.keys(paperData.abstract?.versions || {});
                        const latestVersion = availableVersions[availableVersions.length - 1] || 'v3';
                        setVersionMode(latestVersion);
                      }
                    }}
                    className={`px-2.5 py-0.5 rounded-sm font-bold text-xs transition-all flex items-center gap-1 border ${isMosaicMode
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'text-emerald-700 border-emerald-500/30 hover:bg-emerald-50'
                      }`}
                  >
                    🎨 {isMosaicMode ? 'Mosaic Mode ON' : 'Mosaic Mode (Custom Assembly)'}
                  </button>
                  <span className="text-[10px] text-zinc-550 italic">문단별 원하는 버전(V1/V2/V3)을 조립하여 맞춤 열람할 수 있습니다.</span>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== 5. ARXIVLABS INTERACTIVE TAB SELECTOR ==================== */}
          <div className="space-y-4">

            {/* Tab Headers with overflow scrolling to prevent wrapping and breaking layout */}
            <div className="flex border-b border-zinc-300 bg-zinc-50 px-2 rounded-t-sm overflow-x-auto whitespace-nowrap scrollbar-none">
              <button
                onClick={() => setActiveTab('body')}
                className={`flex-shrink-0 px-4 py-2 text-xs font-bold font-mono transition-all border-b-2 -mb-px ${activeTab === 'body'
                    ? 'border-[#b31b1b] text-zinc-950 bg-white font-extrabold border-t border-l border-r border-zinc-300 rounded-t-sm'
                    : 'border-transparent text-zinc-550 hover:text-zinc-900'
                  }`}
              >
                Bibliographic Tools (Manuscript)
              </button>
              <button
                onClick={() => setActiveTab('sandbox')}
                className={`flex-shrink-0 px-4 py-2 text-xs font-bold font-mono transition-all border-b-2 -mb-px ${activeTab === 'sandbox'
                    ? 'border-[#b31b1b] text-zinc-950 bg-white font-extrabold border-t border-l border-r border-zinc-300 rounded-t-sm'
                    : 'border-transparent text-zinc-550 hover:text-zinc-900'
                  }`}
              >
                Simulation Sandbox
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-shrink-0 px-4 py-2 text-xs font-bold font-mono transition-all border-b-2 -mb-px ${activeTab === 'reviews'
                    ? 'border-[#b31b1b] text-zinc-950 bg-white font-extrabold border-t border-l border-r border-zinc-300 rounded-t-sm'
                    : 'border-transparent text-zinc-550 hover:text-zinc-900'
                  }`}
              >
                Peer Review Timeline ({Object.keys(paperData.reviews).length})
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`flex-shrink-0 px-4 py-2 text-xs font-bold font-mono transition-all border-b-2 -mb-px ${activeTab === 'export'
                    ? 'border-[#b31b1b] text-zinc-950 bg-white font-extrabold border-t border-l border-r border-zinc-300 rounded-t-sm'
                    : 'border-transparent text-zinc-550 hover:text-zinc-900'
                  }`}
              >
                LaTeX / Word Exporter
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-2">

              {/* TAB 1: Document Body Sheet */}
              {activeTab === 'body' && (
                <div className="space-y-6">

                  {/* Journal Style toolbar inside tab */}
                  <div className="flex justify-between items-center bg-zinc-50 border border-zinc-200 p-2 rounded-sm text-[11px] text-zinc-650">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setReadMode('single'); setSelectedReference(null); }}
                        className={`px-2 py-0.5 rounded-sm font-semibold ${readMode === 'single' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-200'
                          }`}
                      >
                        단일 언어
                      </button>
                      <button
                        onClick={() => { setReadMode('bilingual'); setSelectedReference(null); }}
                        className={`px-2 py-0.5 rounded-sm font-semibold ${readMode === 'bilingual' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-200'
                          }`}
                      >
                        한/영 대칭
                      </button>

                      {/* 단일 언어 모드일 때만 한글/영문 선택 탭 추가 제공 */}
                      {readMode === 'single' && (
                        <div className="flex items-center gap-1.5 ml-3 pl-3 border-l border-zinc-300">
                          <button
                            onClick={() => setActiveLang('ko')}
                            className={`px-2 py-0.5 rounded-sm font-medium transition-colors ${activeLang === 'ko' ? 'bg-[#b31b1b]/10 text-[#b31b1b] font-bold border border-[#b31b1b]/20' : 'text-zinc-550 hover:bg-zinc-200 border border-transparent'
                              }`}
                          >
                            한국어 (KO)
                          </button>
                          <button
                            onClick={() => setActiveLang('en')}
                            className={`px-2 py-0.5 rounded-sm font-medium transition-colors ${activeLang === 'en' ? 'bg-[#b31b1b]/10 text-[#b31b1b] font-bold border border-[#b31b1b]/20' : 'text-zinc-550 hover:bg-zinc-200 border border-transparent'
                              }`}
                          >
                            English (EN)
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span>Layout:</span>
                      <select
                        value={journalMode}
                        onChange={(e) => setJournalMode(e.target.value as any)}
                        className="bg-white border border-zinc-300 p-0.5 text-[11px] focus:outline-none"
                      >
                        <option value="arxiv">arXiv Normal</option>
                        <option value="nature">Nature Layout</option>
                        <option value="prl">PRL Physics</option>
                        <option value="ieee">IEEE style</option>
                      </select>
                    </div>
                  </div>

                  {/* Document Body container split into Sidebar TOC and Content Sheet */}
                  <div className="bg-white border border-zinc-200 p-4 md:p-6 rounded-sm shadow-xs min-h-[500px]">
                    <div className="flex flex-col md:flex-row gap-6">

                      {/* Left Sidebar Table of Contents */}
                      <aside className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-zinc-200 pb-4 md:pb-0 md:pr-4">
                        <h4 className="text-[10px] font-bold text-zinc-400 font-mono uppercase tracking-wider mb-3 pl-2">
                          Table of Contents (개요)
                        </h4>
                        <nav className="space-y-1 text-xs">
                          {/* Abstract Tab */}
                          <button
                            onClick={() => setSelectedChapterId('abstract')}
                            className={`w-full text-left px-3 py-2 rounded-xs font-semibold transition-all flex items-center justify-between ${selectedChapterId === 'abstract'
                                ? 'bg-[#b31b1b]/10 text-[#b31b1b] font-bold border border-[#b31b1b]/20 shadow-xs'
                                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
                              }`}
                          >
                            <span>{activeLang === 'ko' ? '초록' : 'Abstract'}</span>
                            <span className="opacity-60 font-mono text-[9px]">INTRO</span>
                          </button>

                          {/* Dynamic Chapters Tabs */}
                          {paperData.chapters
                            .filter((ch) => isChapterVisible(ch, versionMode))
                            .map((ch) => {
                              const isSelected = selectedChapterId === ch.number.toString();
                              const isReferences = getChapterTitle(ch, versionMode, 'ko').includes('참고문헌');
                              return (
                                <button
                                  key={ch.number}
                                  onClick={() => setSelectedChapterId(ch.number.toString())}
                                  className={`w-full text-left px-3 py-2 rounded-xs font-medium transition-all flex items-center justify-between ${isSelected
                                      ? 'bg-[#b31b1b]/10 text-[#b31b1b] font-bold border border-[#b31b1b]/20 shadow-xs'
                                      : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
                                    }`}
                                >
                                  <span className="truncate pr-2 select-none">
                                    {getChapterTitle(ch, versionMode, activeLang)}
                                  </span>
                                  <span className="opacity-60 font-mono text-[9px] flex-shrink-0">
                                    {isReferences ? 'REF' : `CH ${ch.number}`}
                                  </span>
                                </button>
                              );
                            })}

                          {/* References Sidebar Menu */}
                          <button
                            onClick={() => setSelectedChapterId('references')}
                            className={`w-full text-left px-3 py-2 rounded-xs font-semibold transition-all flex items-center justify-between ${selectedChapterId === 'references'
                                ? 'bg-[#b31b1b]/10 text-[#b31b1b] font-bold border border-[#b31b1b]/20 shadow-xs'
                                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
                              }`}
                          >
                            <span>{activeLang === 'ko' ? '참고문헌' : 'References'}</span>
                            <span className="opacity-60 font-mono text-[9px]">BIB</span>
                          </button>

                          {/* Full Manuscript view tab */}
                          <div className="pt-2 border-t border-zinc-150 mt-2">
                            <button
                              onClick={() => setSelectedChapterId('all')}
                              className={`w-full text-left px-3 py-2 rounded-xs font-bold transition-all flex items-center justify-between ${selectedChapterId === 'all'
                                  ? 'bg-zinc-800 text-white font-bold border border-zinc-950 shadow-xs'
                                  : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
                                }`}
                            >
                              <span>전체 본문 연속 보기</span>
                              <span className="opacity-60 font-mono text-[9px]">FULL</span>
                            </button>
                          </div>
                        </nav>
                      </aside>

                      {/* Right Paper Sheet Content View */}
                      <main className="flex-1 min-w-0">

                        {/* 1. Show Abstract if selected */}
                        {selectedChapterId === 'abstract' && (
                          <div className="space-y-6 font-serif">
                            <div className="bg-zinc-50 border border-zinc-200 p-6 md:p-8 rounded-sm">
                              <h3 className="text-xs font-bold text-[#b31b1b] border-b border-zinc-200 pb-1.5 uppercase tracking-wider mb-4 font-sans">
                                {activeLang === 'ko' ? '초록' : 'Abstract'}
                              </h3>
                              <div className="text-sm md:text-[14.5px] text-zinc-800 text-justify leading-relaxed">
                                {readMode === 'single'
                                  ? (activeLang === 'ko'
                                    ? renderAbstractText(paperData.abstract.versions?.[versionMode]?.ko || paperData.abstract.versions?.['v2']?.ko || '', 'ko')
                                    : renderAbstractText(paperData.abstract.versions?.[versionMode]?.en || paperData.abstract.versions?.['v2']?.en || '', 'en')
                                  )
                                  : renderAbstractText(paperData.abstract.versions?.[versionMode]?.ko || paperData.abstract.versions?.['v2']?.ko || '', 'ko')
                                }
                              </div>
                              {readMode === 'bilingual' && (
                                <div className="text-xs md:text-[13.5px] text-zinc-500 italic text-justify leading-relaxed mt-4 border-t border-zinc-150 pt-4">
                                  {renderAbstractText(paperData.abstract.versions?.[versionMode]?.en || paperData.abstract.versions?.['v2']?.en || '', 'en')}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 2. Single Language Mode View */}
                        {readMode === 'single' && selectedChapterId !== 'abstract' && (
                          <div className={getJournalStyleClass()}>
                            {paperData.chapters
                              .filter((ch) => isChapterVisible(ch, versionMode))
                              .map((ch) => {
                                if (selectedChapterId !== 'all' && selectedChapterId !== ch.number.toString()) {
                                  return null;
                                }

                                // 영문 단독 모드도 국문과 동일하게 초대 코드 잠금 정책 적용
                                const isRestrictedChapter = !isAuthorized && (ch.number >= 3 && ch.number <= 6);

                                // Pre-check if chapter has paragraphs
                                const hasVisibleParagraphs = ch.paragraphs.some(p => {
                                  const versionsMap = p.versions || {};
                                  const activeText = versionMode === 'diff' ? '' : (versionsMap[versionMode]?.[activeLang] || versionsMap[versionMode]?.ko || '');
                                  if (!activeText) return false;
                                  let clean = activeText.trim();
                                  if (clean.startsWith('- ')) clean = clean.slice(2).trim();
                                  if (versionMode === 'v2' && clean.startsWith('~~') && clean.endsWith('~~')) {
                                    return false;
                                  }
                                  return true;
                                });

                                if (!hasVisibleParagraphs && versionMode !== 'diff') return null;

                                return (
                                  <div key={ch.number} className="mb-8 break-inside-avoid space-y-4">
                                    <h3 className="text-xs font-bold text-[#b31b1b] border-b border-zinc-200 pb-1.5 uppercase tracking-wider font-serif">
                                      {getChapterTitle(ch, versionMode, activeLang)}
                                    </h3>

                                    {isRestrictedChapter ? (
                                      <div className="bg-zinc-50 border border-zinc-250 p-6 md:p-10 rounded-sm text-center space-y-4 my-6 shadow-xs">
                                        <span className="text-3xl block">🔐</span>
                                        <h4 className="text-sm md:text-base font-bold text-zinc-950 font-serif">
                                          {activeLang === 'ko' 
                                            ? `학술지 투고 심사 전용 세션 잠금 (${ch.number}장)`
                                            : `Restricted Editorial Section Locked (Ch. ${ch.number})`
                                          }
                                        </h4>
                                        <p className="text-xs text-zinc-650 max-w-xl mx-auto leading-relaxed font-serif">
                                          {activeLang === 'ko'
                                            ? `본 논문의 ${ch.number}장은 피어 리뷰어 및 학술 편집위원회 전용 비공개 구간입니다. 전달받으신 고유 초대 코드를 입력하시면 모든 챕터와 시뮬레이터 샌드박스가 즉시 잠금 해제됩니다.`
                                            : `Chapter ${ch.number} of this manuscript is restricted for peer reviewers and editorial board members. Enter the invitation code to unlock all chapters and simulation sandbox.`
                                          }
                                        </p>
                                        <div className="pt-2">
                                          <button
                                            onClick={() => setIsAuthModalOpen(true)}
                                            className="px-6 py-2.5 bg-[#b31b1b] hover:bg-red-800 text-white text-xs font-bold rounded-sm transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                                          >
                                            {activeLang === 'ko' ? '초대 인증코드 입력' : 'Enter Code'}
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      ch.paragraphs.map((p) => (
                                        <InteractiveParagraph
                                          key={p.id}
                                          p={p}
                                          lang={activeLang}
                                          versionMode={versionMode}
                                          isAuthorized={isAuthorized}
                                          chNumber={ch.number}
                                          setIsAuthModalOpen={setIsAuthModalOpen}
                                          parseParagraphText={parseParagraphText}
                                          isMosaicMode={isMosaicMode}
                                          customVersionMap={customVersionMap}
                                          onVersionSelect={handleVersionSelect}
                                        />
                                      ))
                                    )}
                                  </div>
                                );
                              })}
                            {selectedChapterId === 'all' || selectedChapterId === 'references' ? (
                              <ReferencesSection
                                references={paperData.references}
                                journalMode={journalMode}
                                lang={activeLang}
                              />
                            ) : null}
                          </div>
                        )}

                        {/* 3. Bilingual Mode View */}
                        {readMode === 'bilingual' && selectedChapterId !== 'abstract' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Korean column */}
                            <div ref={leftScrollRef} onScroll={() => handleScrollSync('left')} className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin border-r border-zinc-150">
                              <h4 className="text-[9px] font-bold text-zinc-400 font-mono text-right uppercase mb-4">KOREAN ORIGINAL</h4>
                              {paperData.chapters
                                .filter((ch) => isChapterVisible(ch, versionMode))
                                .map((ch) => {
                                  if (selectedChapterId !== 'all' && selectedChapterId !== ch.number.toString()) {
                                    return null;
                                  }

                                  const isRestrictedChapter = !isAuthorized && (ch.number >= 3 && ch.number <= 6);
                                  const hasVisible = ch.paragraphs.some(p => {
                                    const versionsMap = p.versions || {};
                                    const txt = versionMode === 'diff' ? '' : (versionsMap[versionMode]?.ko || versionsMap[versionMode]?.en || '');
                                    if (!txt) return false;
                                    let clean = txt.trim();
                                    if (clean.startsWith('- ')) clean = clean.slice(2).trim();
                                    if (versionMode === 'v2' && clean.startsWith('~~') && clean.endsWith('~~')) {
                                      return false;
                                    }
                                    return true;
                                  });
                                  if (!hasVisible && versionMode !== 'diff') return null;

                                  return (
                                    <div key={ch.number} className="space-y-3 mb-6">
                                      <h3 className="text-xs font-bold text-[#b31b1b] border-b border-zinc-200 pb-1">
                                        {getChapterTitle(ch, versionMode, 'ko')}
                                      </h3>
                                    {isRestrictedChapter ? (
                                      <div className="bg-zinc-50 border border-zinc-250 p-4 rounded-sm text-center space-y-2">
                                        <p className="text-[11px] text-zinc-600 font-serif">학술지 투고 심사 전용 구간 잠김 ({ch.number}장)</p>
                                        <button onClick={() => setIsAuthModalOpen(true)} className="px-3 py-1 bg-[#b31b1b] text-white text-[10px] rounded-sm font-bold">인증코드 입력</button>
                                      </div>
                                    ) : (
                                      ch.paragraphs.map((p) => (
                                        <InteractiveParagraph
                                          key={p.id}
                                          p={p}
                                          lang="ko"
                                          versionMode={versionMode}
                                          isAuthorized={isAuthorized}
                                          chNumber={ch.number}
                                          setIsAuthModalOpen={setIsAuthModalOpen}
                                          parseParagraphText={parseParagraphText}
                                          isMosaicMode={isMosaicMode}
                                          customVersionMap={customVersionMap}
                                          onVersionSelect={handleVersionSelect}
                                        />
                                      ))
                                    )}
                                  </div>
                                );
                              })}
                              {selectedChapterId === 'all' || selectedChapterId === 'references' ? (
                                <ReferencesSection
                                  references={paperData.references}
                                  journalMode={journalMode}
                                  lang="ko"
                                />
                              ) : null}
                            </div>

                            {/* English column */}
                            <div ref={rightScrollRef} onScroll={() => handleScrollSync('right')} className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
                              <h4 className="text-[9px] font-bold text-zinc-400 font-mono text-left uppercase mb-4">ENGLISH MANUSCRIPT</h4>
                              {paperData.chapters
                                .filter((ch) => isChapterVisible(ch, versionMode))
                                .map((ch) => {
                                  if (selectedChapterId !== 'all' && selectedChapterId !== ch.number.toString()) {
                                    return null;
                                  }

                                  const isRestrictedChapter = !isAuthorized && (ch.number >= 3 && ch.number <= 6);
                                  const hasVisible = ch.paragraphs.some(p => {
                                    const versionsMap = p.versions || {};
                                    const txt = versionMode === 'diff' ? '' : (versionsMap[versionMode]?.en || versionsMap[versionMode]?.ko || '');
                                    if (!txt) return false;
                                    let clean = txt.trim();
                                    if (clean.startsWith('- ')) clean = clean.slice(2).trim();
                                    if (versionMode === 'v2' && clean.startsWith('~~') && clean.endsWith('~~')) {
                                      return false;
                                    }
                                    return true;
                                  });
                                  if (!hasVisible && versionMode !== 'diff') return null;

                                  return (
                                    <div key={ch.number} className="space-y-3 mb-6">
                                      <h3 className="text-xs font-bold text-zinc-700 border-b border-zinc-200 pb-1 font-serif">
                                        {getChapterTitle(ch, versionMode, 'en')}
                                      </h3>
                                      {isRestrictedChapter ? (
                                        <div className="bg-zinc-50 border border-zinc-250 p-4 rounded-sm text-center space-y-2">
                                          <p className="text-[11px] text-zinc-655 font-serif">Restricted Editorial Section Locked (Ch. {ch.number})</p>
                                          <button onClick={() => setIsAuthModalOpen(true)} className="px-3 py-1 bg-[#b31b1b] text-white text-[10px] rounded-sm font-bold">Enter Code</button>
                                        </div>
                                      ) : (
                                        ch.paragraphs.map((p) => (
                                          <InteractiveParagraph
                                            key={p.id}
                                            p={p}
                                            lang="en"
                                            versionMode={versionMode}
                                            isAuthorized={isAuthorized}
                                            chNumber={ch.number}
                                            setIsAuthModalOpen={setIsAuthModalOpen}
                                            parseParagraphText={parseParagraphText}
                                            isMosaicMode={isMosaicMode}
                                            customVersionMap={customVersionMap}
                                            onVersionSelect={handleVersionSelect}
                                          />
                                        ))
                                      )}
                                    </div>
                                  );
                                })}
                              {selectedChapterId === 'all' || selectedChapterId === 'references' ? (
                                <ReferencesSection
                                  references={paperData.references}
                                  journalMode={journalMode}
                                  lang="en"
                                />
                              ) : null}
                            </div>
                          </div>
                        )}

                      </main>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Interactive Sandbox */}
              {activeTab === 'sandbox' && (
                <div className="bg-white border border-zinc-200 p-6 rounded-sm shadow-xs space-y-4">
                  {isAuthorized ? (
                    <>
                      {paperData.id === 'spatial-vibration-1' && (
                        <>
                          <h4 className="text-xs font-bold text-zinc-900 font-mono text-center mb-2 uppercase tracking-wider">INTERACTIVE GEOMECHANICAL SLIT EXPERIMENT SANDBOX</h4>
                          <SimulationWidget />
                        </>
                      )}
                      {paperData.id === 'spatial-vibration-2' && (
                        <>
                          <h4 className="text-xs font-bold text-zinc-900 font-mono text-center mb-2 uppercase tracking-wider">MACROSCOPIC GRAVITY & DARK UNIVERSE SANDBOX</h4>
                          <SimulationWidget_V2 />
                        </>
                      )}
                      {paperData.id === 'spatial-vibration-3' && (
                        <>
                          <h4 className="text-xs font-bold text-zinc-900 font-mono text-center mb-2 uppercase tracking-wider">COSMIC WEB & FRB QUANTUM GEODESIC SANDBOX</h4>
                          <SimulationWidget_V3 />
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <span className="text-2xl">🔒</span>
                      <h4 className="text-sm font-bold text-zinc-900 font-serif">물리적 시뮬레이터 샌드박스 잠김</h4>
                      <p className="text-xs text-zinc-550 max-w-md mx-auto leading-relaxed font-serif">
                        이 논문만의 독특한 공간 곡률 요동 시뮬레이션 및 감쇄 인자 샌드박스를 직접 조작하려면 초대 인증코드를 검증해 주세요.
                      </p>
                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="px-4 py-2 bg-[#b31b1b] hover:bg-red-800 text-white text-xs font-bold rounded-sm transition-colors shadow-xs"
                      >
                        초대 코드 인증
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Peer Review Tracks */}
              {activeTab === 'reviews' && (
                <div className="bg-white border border-zinc-200 p-4 rounded-sm shadow-xs">
                  {isAuthorized ? (
                    <ReviewTracker
                      onScrollToSection={handleScrollToSection}
                      onActivateDiff={() => setVersionMode('diff')}
                      lang={activeLang}
                      paperData={paperData}
                    />
                  ) : (
                    <div className="text-center py-10 text-zinc-500">
                      <p className="text-xs font-serif">🔐 심사위원(Reviewer)들의 수정 요구 피드백 및 저자 답변 대응 이력은 **초대 회원**에게만 제공됩니다.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Exporters & Citation */}
              {activeTab === 'export' && (
                <div className="bg-white border border-zinc-200 p-4 rounded-sm shadow-xs space-y-6">
                  {isAuthorized ? (
                    <>
                      <CitationGenerator />
                      <PaperExport journalMode={journalMode} lang={activeLang} paperData={paperData} />
                    </>
                  ) : (
                    <div className="text-center py-10 text-zinc-500">
                      <p className="text-xs font-serif">🔐 투고용 LaTeX 소스 및 Word 원고 다운로드, BibTeX 학술 인용 복사 기능은 **초대 회원**에게만 제공됩니다.</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ==================== RIGHT SIDEBAR: ACCESS CONTROL & CONTEXT (arXiv Style) ==================== */}
        <aside className="w-full lg:w-[260px] bg-white border border-zinc-250 p-4 rounded-sm shadow-xs space-y-5 lg:sticky lg:top-12">

          {/* Access Paper Block */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-955 font-serif border-b border-zinc-200 pb-1">Access Paper:</h4>
            <div className="flex flex-col gap-1.5 font-mono text-[11px] text-blue-700">
              <button
                onClick={() => {
                  if (isAuthorized) {
                    const el = document.getElementById('export-pdf-trigger');
                    if (el) el.click();
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="text-left hover:underline text-blue-700 font-semibold"
              >
                View PDF (Manuscript Print)
              </button>

              <button
                onClick={() => {
                  setActiveTab('body');
                  setReadMode(readMode === 'single' ? 'bilingual' : 'single');
                }}
                className="text-left hover:underline text-blue-700 font-semibold"
              >
                HTML fulltext (Bilingual mode)
              </button>

              <button
                onClick={() => {
                  if (isAuthorized) {
                    setActiveTab('export');
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="text-left hover:underline text-blue-700 font-semibold"
              >
                TeX Source Package (.TEX)
              </button>

              <button
                onClick={() => {
                  if (isAuthorized) {
                    setActiveTab('export');
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="text-left hover:underline text-blue-700 font-semibold"
              >
                MS Word Manuscript (.DOC)
              </button>
            </div>
          </div>

          {/* Current Browse Context */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-955 font-serif border-b border-zinc-200 pb-1">Current browse context:</h4>
            <div className="font-mono text-[11px] text-zinc-650 space-y-1.5">
              <p className="font-bold text-zinc-800">
                {slug?.toString().includes('1') ? 'quant-ph' : 'gr-qc'}
              </p>

              {/* Prev / Next routing links */}
              <div className="flex gap-2 text-blue-755 font-semibold">
                {prevSlug ? (
                  <Link href={`/papers/${prevSlug}`} className="hover:underline">
                    &lt; prev
                  </Link>
                ) : (
                  <span className="opacity-40">&lt; prev</span>
                )}
                <span>|</span>
                {nextSlug ? (
                  <Link href={`/papers/${nextSlug}`} className="hover:underline">
                    next &gt;
                  </Link>
                ) : (
                  <span className="opacity-40">next &gt;</span>
                )}
              </div>
            </div>
          </div>

          {/* SVW Workflow Stage info */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-955 font-serif border-b border-zinc-200 pb-1">Submission Pipeline:</h4>
            <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-sm space-y-2 text-[11px]">
              <div className="flex justify-between items-center font-mono font-bold text-zinc-755">
                <span className="text-[#b31b1b]">{workflow.stage}</span>
                <span>{workflow.percent}%</span>
              </div>
              <div className="w-full bg-zinc-200 h-1 rounded-full overflow-hidden">
                <div className="bg-[#b31b1b] h-full" style={{ width: `${workflow.percent}%` }} />
              </div>
              <p className="text-[10px] text-zinc-550 font-mono leading-tight">
                <strong>Next Step:</strong> {workflow.nextStep}
              </p>
            </div>
          </div>

          {/* Export BibTeX */}
          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => {
                if (isAuthorized) {
                  setActiveTab('export');
                  setTimeout(() => {
                    const el = document.getElementById('citation-trigger');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 200);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="text-left text-[11px] font-mono text-blue-705 hover:underline block font-semibold"
            >
              Export BibTeX Citation
            </button>
          </div>

        </aside>

      </div>

      {/* ==================== 6. RIGHT SIDE SLIDE-OUT DRAWER: REFERENCE PDF VIEW ==================== */}
      {selectedReference && (
        <div className="fixed right-0 top-0 h-screen w-full md:w-[620px] xl:w-[700px] bg-white shadow-2xl border-l border-zinc-350 overflow-hidden z-50 reference-panel-slide-in">
          <ReferencePdfPanel
            reference={selectedReference}
            onClose={() => setSelectedReference(null)}
            lang={activeLang}
          />
        </div>
      )}

      {/* ==================== 7. MODAL: AUTHOR PROFESSIONAL RESUME ==================== */}
      {showAuthorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-zinc-300 w-full max-w-md p-6 shadow-2xl rounded-sm space-y-4">

            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-zinc-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-955 font-serif">Author Profile</h3>
                <p className="text-[10px] text-zinc-450 font-mono">Academic Credentials & Biography</p>
              </div>
              <button
                onClick={() => setShowAuthorModal(false)}
                className="text-zinc-400 hover:text-zinc-700 text-lg leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Resume Content */}
            <div className="space-y-4 text-xs text-zinc-755 font-serif">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-100 border border-zinc-300 rounded-sm flex items-center justify-center font-bold text-lg text-zinc-800 font-serif">
                  KY
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 font-serif">유광용 (Kwang yong Yoo)</h4>
                  <p className="text-[11px] text-[#b31b1b] font-semibold font-serif">KT Director (부장)</p>
                </div>
              </div>

              {/* Education section */}
              <div className="space-y-3 pt-2">
                <h5 className="font-bold text-zinc-900 border-b border-zinc-150 pb-1 font-mono uppercase text-[10px]">Education History</h5>

                {/* UCONN LLM */}
                <div className="space-y-0.5">
                  <div className="flex justify-between font-bold text-zinc-850">
                    <span>University of Connecticut School of Law</span>
                    <span className="font-mono text-[10px] text-zinc-550">2016 – 2019</span>
                  </div>
                  <p className="text-[11px] text-zinc-555 leading-relaxed">
                    Master of Laws (LL.M.) in American/U.S. Law & Legal Studies
                  </p>
                </div>

                {/* Yonsei PhD Candidate */}
                <div className="space-y-0.5">
                  <div className="flex justify-between font-bold text-zinc-855">
                    <span>Yonsei University Graduate School</span>
                    <span className="font-mono text-[10px] text-zinc-550">2010 – 2015</span>
                  </div>
                  <p className="text-[11px] text-zinc-555 leading-relaxed">
                    Ph.D. Candidate in Business Administration & Management
                  </p>
                  <p className="text-[10px] text-zinc-450 italic font-mono">Activities: Teaching Assistant & Part-time Instructor</p>
                </div>

                {/* Yonsei Master */}
                <div className="space-y-0.5">
                  <div className="flex justify-between font-bold text-zinc-855">
                    <span>Yonsei University</span>
                    <span className="font-mono text-[10px] text-zinc-550">2007 – 2009</span>
                  </div>
                  <p className="text-[11px] text-zinc-555 leading-relaxed">
                    Master's Degree in Business Administration & Management
                  </p>
                </div>

                {/* Yonsei Bachelor */}
                <div className="space-y-0.5">
                  <div className="flex justify-between font-bold text-zinc-855">
                    <span>Yonsei University</span>
                    <span className="font-mono text-[10px] text-zinc-550">1995 – 2001</span>
                  </div>
                  <p className="text-[11px] text-zinc-555 leading-relaxed">
                    Bachelor's Degree in Business Administration
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-zinc-200 text-right">
              <button
                onClick={() => setShowAuthorModal(false)}
                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-350 text-zinc-800 text-[10.5px] font-bold rounded-sm cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Auth Modal Portal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
