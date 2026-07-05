import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { papersMap } from '../../components/PaperPlatform/paperData';

export default function PapersDashboard() {
  const publishedPapers = Object.values(papersMap).map((paper: any) => {
    const reviewsList = Object.values(paper.reviews || {});
    const resolvedComments = reviewsList.filter((r: any) => r.status === 'Resolved').length;
    const totalComments = reviewsList.length;
    const versions = paper.abstract.versions || {};
    const defaultVersion = versions['v2'] || versions[Object.keys(versions)[0]] || { ko: '', en: '' };
    const abstractText = defaultVersion.ko || defaultVersion.en || '';

    return {
      id: paper.id,
      title: paper.title.ko,
      titleEn: paper.title.en,
      author: paper.authors.ko,
      affiliation: paper.affiliations.ko,
      year: paper.year || 2026,
      version: "v2.0.0",
      resolvedComments,
      totalComments,
      abstract: abstractText,
      workflow: paper.workflow || {
        stage: "Pre-submission Drafting",
        percent: 20,
        nextStep: "본문 집필 중",
        journalTarget: "Nature Physics"
      }
    };
  });

  return (
    <div className="min-h-screen bg-[#f9f8f6] text-zinc-800 selection:bg-[#8b1a1a]/10 selection:text-[#8b1a1a] font-sans antialiased pb-20">
      <Head>
        <title>SVW Workbench - Kwang yong Yoo Academic Archive</title>
        <meta name="description" content="KYY Quantum Spatial Vibration Workbench and Academic Publishing Pipeline." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;850&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>

      {/* Top SVW Editorial Ribbon */}
      <div className="bg-[#8b1a1a] text-white text-[11px] px-6 py-2 font-mono flex justify-between items-center border-b border-[#721515]">
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-widest">KYY QUANTUM SPATIAL VIBRATION WORKBENCH (SVW)</span>
          <span className="bg-white/10 px-2 py-0.5 rounded text-[10px]">Active Project Dashboard</span>
        </div>
        <div className="flex gap-4">
          <span className="opacity-75">Principal Investigator: <strong>Kwang yong Yoo</strong></span>
        </div>
      </div>

      {/* Unique Brand Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo and Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="bg-zinc-900 text-white px-3 py-1 font-mono text-xl font-bold tracking-tight rounded-sm border-b-2 border-[#8b1a1a]">
              SVW
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-950 tracking-tight leading-none" style={{ fontFamily: 'Outfit' }}>
                SPATIAL VIBRATION WORKBENCH
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Academic Submission & Review Pipeline</span>
            </div>
          </div>

          {/* Submission Pipeline Quick Progress Overview */}
          <div className="hidden lg:flex items-center gap-6 text-xs bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-sm">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-400 font-bold uppercase">Pipeline Flow</span>
              <span className="font-semibold text-zinc-700">Drafting → Review → Submission</span>
            </div>
            <div className="h-6 w-px bg-zinc-250" />
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" title="Spatial-Vibration-1: Proofing" />
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full border border-white animate-pulse" title="Spatial-Vibration-2: Peer Review" />
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full border border-white" title="Spatial-Vibration-3: Drafting" />
              </div>
              <span className="text-[11px] text-zinc-500 font-semibold font-mono">3 Active Tracks</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-650">
            <Link href="/" className="hover:text-[#8b1a1a] transition-colors">
              ← Main Arena
            </Link>
            <span className="text-zinc-300">|</span>
            <span className="text-[#8b1a1a] font-bold">Authoring Panel</span>
          </div>

        </div>
      </header>

      {/* Hero Welcome banner */}
      <section className="bg-[#f2ede4]/60 border-b border-zinc-250 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-[#8b1a1a]/10 text-[#8b1a1a] text-[10px] font-bold tracking-wider uppercase font-mono px-2.5 py-1 rounded-sm border border-[#8b1a1a]/20">
              📌 Target Journal Submission System
            </div>
            <h1 className="text-2xl md:text-3.5xl font-extrabold text-zinc-950 leading-tight font-serif">
              KYY 공간 진동 역학 연구소 및 편집 워크벤치
            </h1>
            <p className="text-xs md:text-sm text-zinc-650 leading-relaxed text-justify">
              본 플랫폼은 저자(Kwang yong Yoo)가 노션(Notion)에 집필한 3개 연작 논문을 통합 빌드하여 버전(v1 vs v2)을 자동 관리하고, 학술지 투고(Nature, Physical Review Letters 등) 전 피어 리뷰 의견에 실시간 대응하며 완성도를 조율하기 위해 특별 설계된 <strong>지능형 에디토리얼 워크플로우 시스템</strong>입니다.
            </p>
          </div>
          
          {/* Author Badge Card */}
          <div className="bg-white border border-zinc-250 p-4 rounded-sm shadow-sm w-full md:w-60 space-y-2">
            <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase font-mono block">Principal Author</span>
            <div className="text-xs">
              <p className="font-bold text-zinc-900 font-serif">유광용 (Kwang yong Yoo)</p>
              <p className="text-[10px] text-zinc-500 leading-tight mt-1 font-serif">
                KT Director / Ph.D. Candidate at Yonsei University / LL.M. at UCONN
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Publication Grid */}
      <main className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Area: Active Manuscripts List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-widest border-b border-zinc-300 pb-2 flex justify-between items-center font-mono">
            <span>📑 Active Manuscripts & Submission Pipeline</span>
            <span className="text-[11px] text-zinc-500 font-normal normal-case">Select manuscript to edit or review</span>
          </h2>

          <div className="space-y-6">
            {publishedPapers.map((paper) => (
              <div 
                key={paper.id} 
                className="group relative bg-white border border-zinc-250 hover:border-zinc-400 p-6 rounded-sm transition-all duration-200 shadow-sm hover:shadow-md space-y-4"
              >
                {/* Paper Header: Journal Target & Version */}
                <div className="flex flex-wrap justify-between items-center text-[11px] gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#8b1a1a] font-bold uppercase tracking-wider font-serif">
                      Target: {paper.workflow.journalTarget}
                    </span>
                    <span className="text-zinc-300">|</span>
                    <span className="text-zinc-550 font-mono font-bold">
                      {paper.version}
                    </span>
                  </div>
                  
                  {/* Workflow Status badge */}
                  <span className={`px-2 py-0.5 rounded-sm font-bold text-[9px] border ${
                    paper.workflow.stage.includes('Proof') 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-250'
                      : paper.workflow.stage.includes('Review')
                      ? 'bg-amber-50 text-amber-800 border-amber-250 animate-pulse'
                      : 'bg-blue-50 text-blue-800 border-blue-250'
                  }`}>
                    {paper.workflow.stage}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <h3 className="text-base md:text-lg font-bold text-zinc-950 group-hover:text-[#8b1a1a] transition-colors leading-snug font-serif">
                      {paper.title}
                    </h3>
                    {paper.id === 'spatial-vibration-1' && (
                      <a
                        href="https://doi.org/10.5281/zenodo.21206295"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-20 inline-flex items-center gap-1 bg-[#10b981] hover:bg-[#059669] text-white px-2 py-0.5 rounded font-mono text-[9px] font-bold transition-all shadow-sm"
                      >
                        doi:10.5281/zenodo.21206295
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 italic font-serif leading-tight">
                    {paper.titleEn}
                  </p>
                </div>

                {/* Abstract Preview */}
                <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3 text-justify font-serif">
                  {paper.abstract}
                </p>

                {/* Active Milestones Info */}
                <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-sm text-[11px] space-y-1.5 font-mono text-zinc-650">
                  <div className="flex justify-between items-center">
                    <span>Revision Progress:</span>
                    <span className="font-bold text-zinc-800">{paper.workflow.percent}% Completed</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#8b1a1a] h-full transition-all duration-300" style={{ width: `${paper.workflow.percent}%` }} />
                  </div>
                  <p className="text-zinc-500 pt-1 leading-snug">
                    <strong className="text-zinc-700">Next Milestone:</strong> {paper.workflow.nextStep}
                  </p>
                </div>

                {/* Footer Status Indicators */}
                <div className="flex flex-wrap justify-between items-center pt-3 border-t border-zinc-150 text-[11px] gap-2">
                  <span className="text-zinc-500">Author: <strong className="text-zinc-800 font-bold font-serif">{paper.author}</strong></span>
                  <span className="bg-emerald-50 text-emerald-750 border border-emerald-200 px-2 py-0.5 rounded-sm font-bold font-mono">
                    ✓ Peer Review {paper.resolvedComments}/{paper.totalComments} Rebuttals Resolved
                  </span>
                </div>

                {/* Click Link */}
                <Link 
                  href={`/papers/${paper.id}`} 
                  className="absolute inset-0 z-10 rounded-sm focus:outline-none"
                  aria-label={`Read and Edit ${paper.title}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Area: System Integration capabilities */}
        <div className="space-y-6">
          
          {/* Submission Checklist */}
          <div className="bg-white border border-zinc-250 p-5 rounded-sm shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-widest border-b border-zinc-350 pb-2 font-mono">
              📝 Submission Checklist
            </h3>
            
            <div className="space-y-2.5 text-[11px] text-zinc-650">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 border-zinc-300 text-[#8b1a1a] focus:ring-[#8b1a1a]" disabled />
                <span>Notion MD Draft Parsing & Bilingual Alignment</span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 border-zinc-300 text-[#8b1a1a] focus:ring-[#8b1a1a]" disabled />
                <span>Strikethrough Versioning Split (v1.0.0 vs v2.0.0)</span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 border-zinc-300 text-[#8b1a1a] focus:ring-[#8b1a1a]" disabled />
                <span>Supabase Storage Reference PDF Connection</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 border-zinc-300 text-[#8b1a1a] focus:ring-[#8b1a1a]" disabled />
                <span>Reviewer Objection & Rebuttal Tracker Match</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 border-zinc-300 text-[#8b1a1a] focus:ring-[#8b1a1a]" disabled />
                <span>Interactive Wave & Damping Simulator Sandbox</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked={false} className="mt-0.5 border-zinc-300 text-[#8b1a1a] focus:ring-[#8b1a1a]" disabled />
                <span>Final Journal Proof Submission (PRL / Nature)</span>
              </label>
            </div>
          </div>

          {/* Workbench Capabilities */}
          <div className="bg-[#f2ede4]/40 border border-zinc-250 p-5 rounded-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-widest border-b border-zinc-350 pb-2 font-mono">
              💡 Workbench System
            </h3>
            
            <div className="space-y-3 font-serif">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-900">1. Notion-Synced Updates</h4>
                <p className="text-[11px] text-zinc-650 leading-relaxed text-justify">
                  노션의 마크다운 소스를 그대로 이식받아 취소선으로 구분된 개정 이력을 실시간 파싱, 즉각적인 수식 변환을 제공합니다.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-900">2. Active Rebuttal Mapping</h4>
                <p className="text-[11px] text-zinc-650 leading-relaxed text-justify">
                  학술지 심사에서 기각 혹은 보완 요구받은 부분을 역추적하여, v1.0.0 대비 수정된 v2.0.0의 차이점을 Diff 뷰로 증명해 냅니다.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-900">3. LaTeX Print Compiler</h4>
                <p className="text-[11px] text-zinc-650 leading-relaxed text-justify">
                  선택한 저널 템플릿(Nature, PRL 등)에 따라 실시간 컴파일링된 LaTeX 및 DOCX 서류 꾸러미를 출력하여 학계 투고 준비를 지원합니다.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-250 text-center text-xs text-zinc-450 font-mono">
        <p>©2026 Kwang yong Yoo Spatial Vibration Workbench (SVW). Generated manuscripts are optimized for target journal peer review processes.</p>
      </footer>
    </div>
  );
}
