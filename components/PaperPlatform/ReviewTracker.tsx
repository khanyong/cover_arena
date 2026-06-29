import React, { useState } from 'react';
import { ReviewComment } from './paperData';

interface ReviewTrackerProps {
  onScrollToSection: (paragraphId: string) => void;
  onActivateDiff: () => void;
  lang: 'ko' | 'en';
  paperData: any;
}

export const ReviewTracker: React.FC<ReviewTrackerProps> = ({ onScrollToSection, onActivateDiff, lang, paperData }) => {
  const [selectedReviewer, setSelectedReviewer] = useState<'All' | 'Reviewer 1' | 'Reviewer 2'>('All');
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});

  const reviewsList = Object.values(paperData.reviews);
  
  // Calculate resolution metrics
  const totalComments = reviewsList.length;
  const resolvedComments = reviewsList.filter((r: any) => r.status === 'Resolved').length;
  const resolutionPercentage = Math.round((resolvedComments / totalComments) * 100);

  const toggleThread = (id: string) => {
    setExpandedThreads(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredReviews = reviewsList.filter((r: any) => {
    if (selectedReviewer === 'All') return true;
    return r.reviewer === selectedReviewer;
  });

  const handleViewEdit = (paragraphId: string) => {
    onActivateDiff();
    setTimeout(() => {
      onScrollToSection(paragraphId);
    }, 100);
  };

  return (
    <div className="bg-zinc-50 border border-zinc-250 rounded-sm p-5 md:p-6 my-6 shadow-sm space-y-5">
      
      {/* Header and Progress Metrics */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-zinc-200">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 font-serif">
            <span>💬</span> 피어 리뷰 의견 및 논문 개정 이력 (Peer Review & Rebuttal Tracker)
          </h3>
          <p className="text-[11px] text-zinc-500">
            심사위원들의 공식 Objection 지적 사항 및 저자의 소명(Rebuttal), 본문 개정본(v1 vs v2) 매치 데이터를 추적합니다.
          </p>
        </div>

        {/* Metric Progress circle/bar */}
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 border border-zinc-200 rounded-sm shadow-xs">
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider font-mono">Review Resolution</span>
            <span className="text-xs font-bold text-emerald-600 font-mono">
              {resolvedComments} / {totalComments} Resolved ({resolutionPercentage}%)
            </span>
          </div>
          {/* Simple progress bar */}
          <div className="w-16 h-1.5 bg-zinc-150 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
              style={{ width: `${resolutionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Content Controls */}
      <div className="flex justify-between items-center bg-zinc-100/80 p-1.5 border border-zinc-200 rounded-sm text-xs">
        <span className="text-[11px] text-zinc-500 ml-2 font-medium">Reviewer Filter:</span>
        <div className="flex gap-1">
          {(['All', 'Reviewer 1', 'Reviewer 2'] as const).map((reviewer) => (
            <button
              key={reviewer}
              onClick={() => setSelectedReviewer(reviewer)}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-sm transition-all border ${
                selectedReviewer === reviewer 
                  ? 'bg-[#8b1a1a] text-white border-[#8b1a1a] shadow-xs' 
                  : 'bg-white text-zinc-650 border-zinc-200 hover:text-zinc-900'
              }`}
            >
              {reviewer === 'All' ? '전체 보기' : reviewer}
            </button>
          ))}
        </div>
      </div>

      {/* Peer Review Timeline Cards */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {filteredReviews.map((rev: any) => {
          const isExpanded = expandedThreads[rev.id] || false;
          
          return (
            <div 
              key={rev.id} 
              className="bg-white border border-zinc-200 rounded-sm p-4 hover:border-zinc-300 transition-all space-y-4 shadow-xs"
            >
              {/* Card Meta Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-250 text-[9px] font-bold rounded-sm text-zinc-700">
                    {rev.reviewer}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-sm border ${
                    rev.status === 'Resolved' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {rev.status}
                  </span>
                </div>
                
                <button
                  onClick={() => handleViewEdit(rev.linkedParagraphId)}
                  className="text-[10px] text-[#8b1a1a] hover:underline font-bold flex items-center gap-1 bg-red-805/5 hover:bg-red-800/10 px-2 py-1 border border-[#8b1a1a]/20 rounded-sm transition-all"
                >
                  🔍 v1 vs v2 수정 구절 대조하기
                </button>
              </div>

              {/* Reviewer Objection (The Problem) */}
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-red-800 uppercase tracking-wide flex items-center gap-1 font-mono">
                  <span>🚨</span> Reviewer Objection (심사 지적 사항)
                </h4>
                <p className="text-xs text-zinc-800 bg-red-50/50 border-l-2 border-[#8b1a1a] p-3 rounded-r-sm leading-relaxed font-serif">
                  {lang === 'ko' ? rev.objection.ko : rev.objection.en}
                </p>
              </div>

              {/* Author Rebuttal (The Solution) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1 font-mono">
                    <span>🟢</span> Author Rebuttal & Responses (저자 답변 요지)
                  </h4>
                  <button 
                    onClick={() => toggleThread(rev.id)}
                    className="text-[10px] text-[#8b1a1a] hover:underline font-semibold"
                  >
                    {isExpanded ? '💬 토론 이력 접기' : `💬 전체 토론 이력 보기 (${rev.rebuttal.length + 1}개 대화)`}
                  </button>
                </div>

                {/* Primary Response */}
                <div className="bg-emerald-50/40 border-l-2 border-emerald-600 p-3 rounded-r-sm space-y-1 font-serif">
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider font-mono block">Primary Author Response</span>
                  <p className="text-xs text-zinc-800 leading-relaxed">
                    {lang === 'ko' ? rev.rebuttal[0].text.ko : rev.rebuttal[0].text.en}
                  </p>
                </div>

                {/* Multi-turn conversations */}
                {isExpanded && rev.rebuttal.slice(1).map((chat, idx) => {
                  const isAuthor = chat.role === 'author';
                  return (
                    <div 
                      key={idx} 
                      className={`flex flex-col p-3 rounded-sm max-w-[85%] border leading-relaxed font-serif ${
                        isAuthor 
                          ? 'ml-auto bg-blue-50/50 border-blue-200 text-right' 
                          : 'mr-auto bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <span className={`text-[9px] font-bold uppercase tracking-wider mb-1 block ${
                        isAuthor ? 'text-blue-700' : 'text-zinc-500'
                      }`}>
                        {isAuthor ? 'Author Response' : `${rev.reviewer} Feedback`}
                      </span>
                      <p className="text-xs text-zinc-800 text-left">
                        {lang === 'ko' ? chat.text.ko : chat.text.en}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
