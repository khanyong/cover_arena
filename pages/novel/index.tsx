import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { initialNovelData } from '../../components/NovelPlatform/novelData';
import { novels, auth } from '../../shared/lib/supabase';

export default function NovelDashboard() {
  const router = useRouter();
  const [novelList, setNovelList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // 인증 확인
  useEffect(() => {
    const checkAuth = async () => {
      const user = await auth.getCurrentUser();
      if (!user) {
        router.replace('/auth');
      } else {
        setIsAuthChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  // DB에서 소설 목록 불러오기
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const { data, error } = await novels.getAllNovels();
        if (error) {
          console.error("Error fetching novels:", error);
        } else if (data) {
          // DB에서 가져온 JSON(data 컬럼) 리스트를 저장
          setNovelList(data.map(row => row.data));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNovels();
  }, []);

  const handleCreateNewVolume = async () => {
    const newSlug = window.prompt("Enter the slug (English URL) for the new volume.\ne.g., quantum-vibration-vol2");
    if (!newSlug) return;
    
    const newTitle = window.prompt("Enter the title for the new volume.\ne.g., Quantum Vibration Vol 2");
    if (!newTitle) return;

    try {
      // 1권의 뼈대(initialNovelData)를 복사하되 id, slug, title만 변경
      const newNovelData = {
        ...initialNovelData,
        id: newSlug,
        slug: newSlug,
        title: newTitle,
        updatedAt: new Date().toISOString().split('T')[0] // 오늘 날짜
      };

      const { error } = await novels.createNovel(newNovelData);
      if (error) {
        alert("Error occurred during creation: " + error.message);
      } else {
        alert("New project created. Redirecting to the writing studio.");
        router.push(`/novel/${newSlug}`);
      }
    } catch (err) {
      console.error(err);
      alert("Creation failed");
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-amber-500 animate-pulse text-lg font-bold">
          Verifying access...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950">
      <Head>
        <title>Sci-Fi Novel Version Control & Writing Studio</title>
        <meta name="description" content="Paper-based Sci-Fi novel hierarchical version control and comparison studio" />
      </Head>

      {/* Navigation Bar */}
      <nav className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-black tracking-tight text-amber-400 hover:text-amber-300 transition-colors">
              N O V E L <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono">STUDIO</span>
            </Link>
            <span className="text-zinc-600">|</span>
            <span className="text-xs text-zinc-400 font-medium">Paper-based Novel Version Control Platform</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/tools/novel-diff"
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1.5"
            >
              <span>⚖️</span> Version Comparison Studio
            </Link>
            <Link href="/papers" className="text-zinc-400 hover:text-zinc-200 transition-colors font-semibold">
              📄 Paper Research Vault (/papers)
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Banner */}
        <div className="mb-12 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 p-8 rounded-3xl border border-amber-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-4">
              ✨ Independent Version Control for Acts, Chapters & Paragraphs
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Paper-based Sci-Fi Novel Writing & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                Version Comparison Studio for the Master Draft
              </span>
            </h1>
            <p className="text-zinc-300 text-sm leading-relaxed mb-6">
              Construct your novel based on core theoretical formulas from original papers such as Node singularities, chameleon mechanisms, and the Gertsenshtein effect. Manage <strong>independent versions for each paragraph (v1.0, v1.1, v2.0...)</strong>, compare them in real-time, and combine them to complete your master draft.
            </p>
          </div>
        </div>

        {/* Novel List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📚</span> Novel Projects in Progress
            </h2>
            <button
              onClick={handleCreateNewVolume}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-4 py-2 text-sm font-bold rounded-lg transition-colors shadow-lg shadow-amber-500/20"
            >
              + Create New Volume
            </button>
          </div>

          {loading ? (
            <div className="text-center text-zinc-400 py-20 animate-pulse">
              Loading data...
            </div>
          ) : novelList.filter(n => !(n.slug?.endsWith('-en'))).length === 0 ? (
            <div className="text-center text-zinc-400 py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
              No projects created yet. Click '+ Create New Volume' to begin.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {novelList.filter(n => !(n.slug?.endsWith('-en'))).map((novel) => (
              <div
                key={novel.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs text-zinc-400">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded font-mono font-semibold">
                      Latest Version: {novel.versionHistory && novel.versionHistory.length > 0 ? novel.versionHistory[novel.versionHistory.length - 1] : 'v1.0'}
                    </span>
                    <span>Last Updated: {novel.updatedAt || 'Unknown'}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                    {novel.title}
                  </h3>
                  {novel.subtitle && (
                    <p className="text-xs text-zinc-400 mb-3 font-medium">
                      {novel.subtitle}
                    </p>
                  )}

                  {/* Logline Preview Box */}
                  {novel.logline && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 mb-4 text-xs">
                      <span className="font-bold text-amber-400 block mb-1">💡 Logline:</span>
                      <p className="text-zinc-200 leading-relaxed italic">
                        "{novel.logline}"
                      </p>
                    </div>
                  )}

                  {/* Characters Preview */}
                  {novel.characters && (
                    <div className="mb-4">
                      <span className="text-[11px] font-bold text-zinc-400 block mb-2">👥 Key Characters:</span>
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        {novel.characters.map((c: any) => (
                          <span key={c.id} className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                            {c.name} ({c.role.split('/')[0].trim()})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 pb-4 mb-4 border-b border-zinc-800">
                    <span>Author: {novel.author}</span>
                    <span>Structure: {novel.acts ? novel.acts.length : 0} Acts / {novel.chapterCount ? novel.chapterCount : (novel.acts ? novel.acts.reduce((acc: number, a: any) => acc + (a.chapters ? a.chapters.length : 0), 0) : 0)} Chapters</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/novel/${novel.slug}`}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
                    >
                      <span>📖 KOR Studio</span>
                    </Link>
                    <Link
                      href={`/novel/${novel.slug}/en`}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-amber-500/30 font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🌐 ENG Studio</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
