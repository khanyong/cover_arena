import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { initialNovelData } from '../../components/NovelPlatform/novelData';

export default function NovelDashboard() {
  const novelList = [initialNovelData];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950">
      <Head>
        <title>SF 소설 버전 관리 & 집필 플랫폼</title>
        <meta name="description" content="논문 기반 소설 막·장·단락 계층형 버전 관리 및 비교 스튜디오" />
      </Head>

      {/* Navigation Bar */}
      <nav className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-black tracking-tight text-amber-400 hover:text-amber-300 transition-colors">
              N O V E L <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono">STUDIO</span>
            </Link>
            <span className="text-zinc-600">|</span>
            <span className="text-xs text-zinc-400 font-medium">논문 기반 소설 버전 관리 플랫폼</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/papers" className="text-zinc-400 hover:text-zinc-200 transition-colors font-semibold">
              📄 논문 리서치 창고 (/papers)
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
              ✨ 막 · 장 · 단락 독립 버전 관리 지원
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              논문 기반 SF 소설 집필 & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                버전 비교 · 최종본 완성을 위한 스튜디오
              </span>
            </h1>
            <p className="text-zinc-300 text-sm leading-relaxed mb-6">
              논문의 마디(Node) 특이점, 카멜레온 메커니즘, 게르첸슈타인 효과 등 원작 논문의 핵심 이론 수식을 바탕으로 소설을 구성하며, 
              <strong> 1막 1장의 각 단락별 독립 버전(v1.0, v1.1, v2.0...)</strong>을 과거 내용과 실시간 비교하고 조합하여 마스터 최종본을 완성해보세요.
            </p>
          </div>
        </div>

        {/* Novel List */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📚</span> 집필 중인 소설 프로젝트 목록
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {novelList.map((novel) => (
              <div
                key={novel.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs text-zinc-400">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded font-mono font-semibold">
                      최신 버전: {novel.versionHistory[novel.versionHistory.length - 1]}
                    </span>
                    <span>최종 수정: {novel.updatedAt}</span>
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
                      <span className="text-[11px] font-bold text-zinc-400 block mb-2">👥 주요 등장인물:</span>
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        {novel.characters.map(c => (
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
                    <span>저자: {novel.author}</span>
                    <span>구조: {novel.acts.length}개 막 / {novel.acts.reduce((acc, a) => acc + a.chapters.length, 0)}개 장</span>
                  </div>

                  <Link
                    href={`/novel/${novel.slug}`}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
                  >
                    <span>📖 집필 & 버전 비교 스튜디오 입장</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
