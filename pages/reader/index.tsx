import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { useRouter } from 'next/router';
import { novels } from '../../shared/lib/supabase';
import { NovelDetails } from '../../components/NovelPlatform/novelData';

export default function AgentReaderPage() {
  const router = useRouter();
  const { token } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [novelData, setNovelData] = useState<NovelDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'PROLOGUE' | 'SYNOPSIS' | 'ACTS'>('ACTS');
  const [activePosition, setActivePosition] = useState<{ actNumber: number, chapterNumber: number } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (!token || typeof token !== 'string') {
      setError('Invalid Access Token');
      setLoading(false);
      return;
    }

    async function loadNovel() {
      try {
        // 1. Validate Token
        const { data: tokenData, error: tokenError } = await novels.validateAgentToken(token as string);
        if (tokenError || !tokenData) {
          setError('This access link has expired or is invalid.');
          setLoading(false);
          return;
        }

        // 2. Load Novel by Slug (Enforced by token)
        const { data: novelRes, error: novelError } = await novels.getNovelBySlug(tokenData.novel_slug);
        if (novelError || !novelRes) {
          setError('Novel data not found.');
          setLoading(false);
          return;
        }

        setNovelData(novelRes as NovelDetails);
        
        // Find first valid act and chapter for default activePosition
        const validActs = (novelRes.acts || []).filter(a => a.chapters && a.chapters.length > 0);
        if (validActs.length > 0) {
          setActivePosition({ actNumber: validActs[0].number, chapterNumber: validActs[0].chapters[0].number });
        }
        
        // 3. Update Access Time in background
        novels.updateTokenAccessTime(token as string);
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading the manuscript.');
      } finally {
        setLoading(false);
      }
    }

    loadNovel();
  }, [router.isReady, token]);

  // Navigation Helpers
  const getPrevPosition = () => {
    if (!novelData || !novelData.acts || !activePosition) return null;
    const currentActIndex = novelData.acts.findIndex(a => a.number === activePosition.actNumber);
    if (currentActIndex === -1) return null;
    const currentAct = novelData.acts[currentActIndex];
    const currentChapterIndex = currentAct.chapters?.findIndex(c => c.number === activePosition.chapterNumber) ?? -1;
    
    if (currentChapterIndex > 0) {
      return { actNumber: currentAct.number, chapterNumber: currentAct.chapters![currentChapterIndex - 1].number };
    } else if (currentActIndex > 0) {
      let prevActIndex = currentActIndex - 1;
      while (prevActIndex >= 0) {
        const prevAct = novelData.acts[prevActIndex];
        if (prevAct.chapters && prevAct.chapters.length > 0) {
          return { actNumber: prevAct.number, chapterNumber: prevAct.chapters[prevAct.chapters.length - 1].number };
        }
        prevActIndex--;
      }
    }
    return null;
  };

  const getNextPosition = () => {
    if (!novelData || !novelData.acts || !activePosition) return null;
    const currentActIndex = novelData.acts.findIndex(a => a.number === activePosition.actNumber);
    if (currentActIndex === -1) return null;
    const currentAct = novelData.acts[currentActIndex];
    const currentChapterIndex = currentAct.chapters?.findIndex(c => c.number === activePosition.chapterNumber) ?? -1;
    
    if (currentAct.chapters && currentChapterIndex < currentAct.chapters.length - 1) {
      return { actNumber: currentAct.number, chapterNumber: currentAct.chapters[currentChapterIndex + 1].number };
    } else if (currentActIndex < novelData.acts.length - 1) {
      let nextActIndex = currentActIndex + 1;
      while (nextActIndex < novelData.acts.length) {
        const nextAct = novelData.acts[nextActIndex];
        if (nextAct.chapters && nextAct.chapters.length > 0) {
          return { actNumber: nextAct.number, chapterNumber: nextAct.chapters[0].number };
        }
        nextActIndex++;
      }
    }
    return null;
  };

  const handleNavigate = (pos: { actNumber: number, chapterNumber: number } | null) => {
    if (pos) {
      setActivePosition(pos);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 flex items-center justify-center font-serif">
        <div className="animate-pulse text-lg tracking-widest text-amber-500/50">Loading Manuscript...</div>
      </div>
    );
  }

  if (error || !novelData) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 flex items-center justify-center font-sans">
        <div className="text-center p-8 bg-zinc-900/50 rounded-2xl border border-rose-500/20 max-w-md">
          <h1 className="text-xl font-bold text-rose-400 mb-2">Access Denied</h1>
          <p className="text-sm text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] text-zinc-300 font-serif selection:bg-amber-500/30 selection:text-amber-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0f13]/90 backdrop-blur-md border-b border-zinc-800/50 px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-zinc-400 hover:text-zinc-100 transition-colors hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-zinc-400 hover:text-zinc-100 transition-colors lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-100">{novelData.title}</h1>
            <p className="text-[10px] md:text-xs text-amber-500/80 font-sans tracking-widest uppercase mt-1">Confidential Manuscript</p>
          </div>
        </div>
        <div className="flex gap-4 font-sans text-sm font-semibold">
          <button 
            onClick={() => setActiveTab('PROLOGUE')}
            className={`transition-colors ${activeTab === 'PROLOGUE' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Prologue
          </button>
          <button 
            onClick={() => setActiveTab('SYNOPSIS')}
            className={`transition-colors ${activeTab === 'SYNOPSIS' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Synopsis
          </button>
          <button 
            onClick={() => setActiveTab('ACTS')}
            className={`transition-colors ${activeTab === 'ACTS' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Manuscript
          </button>
        </div>
      </header>

      
      {/* Layout Container */}
      <div className="flex-1 flex w-full max-w-[1400px] mx-auto">

      {/* Mobile TOC Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex font-sans">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setIsSidebarOpen(false)} 
          />
          <div className="relative w-80 max-w-[80vw] bg-[#0f0f13] border-r border-zinc-800 h-full overflow-y-auto flex flex-col shadow-2xl animate-slide-in-left">
            <div className="sticky top-0 bg-[#0f0f13]/90 backdrop-blur-md border-b border-zinc-800 p-4 flex justify-between items-center">
              <h2 className="text-zinc-100 font-bold tracking-wider uppercase text-sm">Table of Contents</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-500 hover:text-zinc-100 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 space-y-6">
              {novelData.acts?.filter(a => a.chapters && a.chapters.length > 0).map(act => {
                let shortName = `Act ${act.number}`;
                if (act.title === 'Unknown Act') shortName = 'Front Matter';
                else if (act.title.toUpperCase().includes('PROLOGUE')) shortName = 'Prologue';
                else if (act.title.toUpperCase().includes('EPILOGUE')) shortName = 'Epilogue';
                else if (act.title.toUpperCase().includes('APPENDIX')) shortName = 'Appendix';
                else if (act.title.toUpperCase().includes('ACT ')) {
                  const match = act.title.match(/ACT\s*\d+/i);
                  if (match) shortName = match[0];
                }

                return (
                  <div key={act.number} className="space-y-2">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 mb-2">{shortName}</h3>
                    <div className="space-y-1">
                      {act.chapters?.map(chapter => {
                        const isActive = activePosition?.actNumber === act.number && activePosition?.chapterNumber === chapter.number;
                        return (
                          <button
                            key={chapter.number}
                            onClick={() => {
                              setActiveTab('ACTS');
                              handleNavigate({ actNumber: act.number, chapterNumber: chapter.number });
                              setIsSidebarOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive 
                                ? 'bg-amber-500/10 text-amber-400 font-semibold' 
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                            }`}
                          >
                            {chapter.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

        {/* Desktop Fixed TOC Sidebar */}
        <aside className="hidden lg:flex w-72 flex-shrink-0 border-r border-zinc-800/50 flex-col sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 font-sans">
          <div className="p-6 space-y-8">
            <h2 className="text-zinc-500 font-bold tracking-widest uppercase text-xs">Table of Contents</h2>
            <div className="space-y-8">
              {novelData.acts?.filter(a => a.chapters && a.chapters.length > 0).map(act => {
                let shortName = `Act ${act.number}`;
                if (act.title === 'Unknown Act') shortName = 'Front Matter';
                else if (act.title.toUpperCase().includes('PROLOGUE')) shortName = 'Prologue';
                else if (act.title.toUpperCase().includes('EPILOGUE')) shortName = 'Epilogue';
                else if (act.title.toUpperCase().includes('APPENDIX')) shortName = 'Appendix';
                else if (act.title.toUpperCase().includes('ACT ')) {
                  const match = act.title.match(/ACT\s*\d+/i);
                  if (match) shortName = match[0];
                }

                return (
                  <div key={act.number} className="space-y-3">
                    <h3 className="text-[11px] font-bold text-amber-500/80 uppercase tracking-widest pl-2 mb-2">{shortName}</h3>
                    <div className="space-y-1 border-l border-zinc-800/50 ml-2 pl-3">
                      {act.chapters?.map(chapter => {
                        const isActive = activePosition?.actNumber === act.number && activePosition?.chapterNumber === chapter.number;
                        return (
                          <button
                            key={chapter.number}
                            onClick={() => {
                              setActiveTab('ACTS');
                              handleNavigate({ actNumber: act.number, chapterNumber: chapter.number });
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive 
                                ? 'bg-amber-500/10 text-amber-400 font-semibold' 
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                            }`}
                          >
                            {chapter.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
{/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 pb-32">
        
        {/* Prologue View */}
        {activeTab === 'PROLOGUE' && (
          <article className="animate-fade-in prose prose-invert prose-amber max-w-none">
            <h2 className="text-3xl font-bold mb-8 text-center text-zinc-100">Logline</h2>
            <div className="text-lg leading-relaxed space-y-6 text-zinc-300 whitespace-pre-wrap">
              {novelData.logline || 'No logline available.'}
            </div>
          </article>
        )}

        {/* Synopsis View */}
        {activeTab === 'SYNOPSIS' && (
          <article className="animate-fade-in prose prose-invert prose-amber max-w-none">
            <h2 className="text-3xl font-bold mb-8 text-center text-zinc-100">Synopsis</h2>
            <div className="text-lg leading-relaxed space-y-6 text-zinc-300 whitespace-pre-wrap">
              {novelData.synopsis || 'No synopsis available.'}
            </div>
            
            {novelData.acts && novelData.acts.length > 0 && (
              <div className="mt-16 space-y-12">
                <h3 className="text-2xl font-bold text-center border-b border-zinc-800 pb-4">Act Summaries</h3>
                {novelData.acts.map(act => (
                  <div key={act.number} className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800/50">
                    <h4 className="text-xl font-bold text-amber-500 mb-3">Act {act.number}: {act.title}</h4>
                    <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{act.summary || act.theory || 'No summary available.'}</p>
                  </div>
                ))}
              </div>
            )}
          </article>
        )}

        {/* Full Manuscript (Acts & Chapters) View */}
        {activeTab === 'ACTS' && activePosition && (
          <div className="animate-fade-in pb-16">
            {novelData.acts?.filter(a => a.number === activePosition.actNumber).map((act) => {
              const chapter = act.chapters?.find(c => c.number === activePosition.chapterNumber);
              if (!chapter) return null;

              const isTitlePage = act.title === 'Unknown Act';
              const displayTitle = isTitlePage ? 'Title Page' : act.title;

              return (
                <article key={`${act.number}-${chapter.number}`} className="scroll-mt-32 max-w-2xl mx-auto">
                  <div className="text-center mb-16">
                    {!isTitlePage && !displayTitle.toUpperCase().includes('ACT') && !displayTitle.toUpperCase().includes('PROLOGUE') && !displayTitle.toUpperCase().includes('EPILOGUE') && (
                      <span className="text-amber-500/60 font-sans tracking-[0.2em] text-sm uppercase block mb-4">Act {act.number}</span>
                    )}
                    {!isTitlePage && (
                      <h2 className="text-3xl font-bold text-zinc-100">{displayTitle}</h2>
                    )}
                  </div>
                  
                  <div className="space-y-16">
                    <section className="group">
                      {!isTitlePage && (
                        <h3 className="text-xl md:text-2xl font-bold text-zinc-300 mb-8 pb-4 border-b border-zinc-800/50 text-center">
                          {chapter.title}
                        </h3>
                      )}
                      {chapter.scenes?.map((scene) => (
                        <div key={scene.id} className="mb-10">
                          <div className="text-lg text-zinc-300 text-justify">
                            {scene.paragraphs?.map(p => {
                              const ver = p.versions[p.activeVersion];
                              if (!ver) return null;
                              return (
                                <div key={p.id}>
                                  <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                      p: ({node, ...props}) => <p className="indent-6 mb-5 leading-relaxed" {...props} />
                                    }}
                                  >
                                    {ver.content}
                                  </ReactMarkdown>
                                </div>
                              );
                            })}
                          </div>
                          {scene !== chapter.scenes[chapter.scenes.length - 1] && (
                            <div className="text-center text-zinc-600 my-10 opacity-50 tracking-[1em]">***</div>
                          )}
                        </div>
                      ))}
                    </section>
                  </div>
                </article>
              );
            })}
            
            {/* Pagination */}
            <div className="flex justify-between items-center mt-20 pt-8 border-t border-zinc-800/50 font-sans">
              <button 
                onClick={() => handleNavigate(getPrevPosition())}
                disabled={!getPrevPosition()}
                className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 disabled:opacity-20 disabled:hover:text-zinc-400 transition-colors px-4 py-2"
              >
                <span className="text-xl">←</span> Previous Chapter
              </button>
              
              <button 
                onClick={() => handleNavigate(getNextPosition())}
                disabled={!getNextPosition()}
                className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 disabled:opacity-20 disabled:hover:text-zinc-400 transition-colors px-4 py-2"
              >
                Next Chapter <span className="text-xl">→</span>
              </button>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}