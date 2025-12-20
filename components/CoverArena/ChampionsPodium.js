import React from 'react';
import VideoCard from './VideoCard';

export default function ChampionsPodium({ videos = [], onVideoClick, onLike, isVotingActive = true, user }) {
    // Top 5 영상만 추출
    const topVideos = videos.slice(0, 5);
    const rank1Video = topVideos[0];
    const runnerUps = topVideos.slice(1, 5);

    if (!rank1Video) return null;

    return (
        <div className="w-full mb-12">
            {/* 1. 섹션 헤더 - 프리미엄 골드 디자인 */}
            <div className="text-center mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
                <h2 className="relative inline-block px-6 py-2 bg-[#1a1a1a] border border-yellow-500/30 rounded-full text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                    👑 HALL OF FAME
                </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* 2. 1위 Hero Section (좌측 또는 중앙 강조) */}
                <div className="w-full lg:w-5/12 flex flex-col">
                    <div className="relative group w-full h-[350px] lg:h-[450px] rounded-2xl overflow-hidden border-2 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-transform hover:scale-[1.02]">
                        {/* 배경 Glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 z-10 pointer-events-none"></div>

                        {/* 썸네일 */}
                        <img
                            src={rank1Video.thumbnail}
                            alt={rank1Video.title}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => onVideoClick && onVideoClick(rank1Video)}
                        />

                        {/* 1위 배지 */}
                        <div className="absolute top-4 left-4 z-20">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-yellow-500/30 animate-pulse">
                                <span className="text-3xl">👑</span>
                            </div>
                        </div>

                        {/* 정보 (하단 오버레이) */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 backdrop-blur-sm bg-black/40">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">RANK 1</span>
                                <span className="text-yellow-300 font-bold block truncate">{rank1Video.channel}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 drop-shadow-md leading-tight">
                                {rank1Video.title}
                            </h3>

                            <div className="flex items-center justify-between text-sm text-gray-200 mb-4">
                                <div className="flex gap-4">
                                    <div>🏆 <span className="text-yellow-400 font-bold">{rank1Video.site_score?.toLocaleString()}</span> 점</div>
                                    <div>❤️ <span className="text-red-400 font-bold">{rank1Video.arena_likes || 0}</span> Likes</div>
                                </div>
                            </div>

                            <button
                                onClick={e => { e.stopPropagation(); if (onLike) onLike(rank1Video); }}
                                disabled={!isVotingActive}
                                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span>👍 1위에게 투표하기</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. 2~5위 Grid Section (우측) */}
                <div className="w-full lg:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {runnerUps.map((video, idx) => {
                        const rank = idx + 2; // 0 index -> Rank 2
                        const isTop3 = rank <= 3;

                        return (
                            <div key={video.id} className="relative bg-[#1a1a1a]/80 rounded-xl overflow-hidden border border-white/10 hover:border-gray-500 transition-all group flex flex-row md:flex-col h-24 md:h-auto">
                                {/* 썸네일 */}
                                <div className="relative w-32 md:w-full md:h-32 shrink-0 cursor-pointer overflow-hidden" onClick={() => onVideoClick && onVideoClick(video)}>
                                    <img
                                        src={video.thumbnail}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>

                                    {/* 순위 배지 */}
                                    <div className={`absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-white shadow-md text-sm border border-white/20
                      ${rank === 2 ? 'bg-gray-400' : rank === 3 ? 'bg-orange-700' : 'bg-blue-900'}`}>
                                        {rank}
                                    </div>
                                </div>

                                {/* 정보 */}
                                <div className="p-3 flex flex-col justify-between flex-1">
                                    <div>
                                        <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">{video.title}</h4>
                                        <p className="text-xs text-gray-400 mb-2">{video.channel}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-mono text-gray-300">
                                            {video.site_score?.toLocaleString()} pts
                                        </div>
                                        <button
                                            onClick={e => { e.stopPropagation(); if (onLike) onLike(video); }}
                                            className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${!isVotingActive ? 'bg-gray-700 text-gray-500' : 'bg-white/10 hover:bg-white/20 text-white'
                                                }`}
                                        >
                                            👍 투표
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
