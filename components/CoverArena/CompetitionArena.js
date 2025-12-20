import { useState, useEffect } from 'react'
import VideoCard from './VideoCard'

export default function CompetitionArena({ videos = [], onVideoClick, onLike, isVotingActive = true, user }) {
  const [votedVideos, setVotedVideos] = useState(new Set())
  const [guestVotedVideos, setGuestVotedVideos] = useState(new Set())

  // 투표 상태 로드
  useEffect(() => {
    if (!user && videos.length > 0) {
      const competitionId = videos[0].competition_id;
      const storageKey = `guest_votes_${competitionId}`;
      const storedVotes = localStorage.getItem(storageKey);
      if (storedVotes) {
        try {
          setGuestVotedVideos(new Set(JSON.parse(storedVotes)));
        } catch (e) { }
      }
    }
  }, [user, videos]);

  const getLikes = (v) => v.arena_likes || v.arenaLikes || 0;

  // 순위 기반 그리드 스타일 결정
  const getGridClass = (index) => {
    // 1위: 2x2 (가장 큼) - 모바일에서는 가로 가득
    if (index === 0) return "col-span-2 row-span-2 md:col-span-2 md:row-span-2 bg-yellow-900/20 border-yellow-500/50";

    // 2~3위: 2x1 (가로 김) or 1x2 - 여기서는 가로로 넓게 배치
    if (index === 1 || index === 2) return "col-span-2 row-span-1 md:col-span-1 md:row-span-2 bg-gray-800/50 border-gray-400/50";

    // 4~8위: 1x1 (강조)
    if (index < 8) return "col-span-1 row-span-1 border-blue-500/30";

    // 나머지: 1x1 기본
    return "col-span-1 row-span-1 border-white/10";
  };

  return (
    <div className="w-full min-h-[50vh] p-4 bg-black/20 rounded-xl border border-white/5">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[200px] gap-4">
        {videos.map((video, idx) => (
          <div
            key={video.id}
            className={`relative rounded-xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:z-10 group ${getGridClass(idx)}`}
            onClick={() => onVideoClick && onVideoClick(video)}
          >
            {/* 배경 흐림 효과 (순위 높은 영상용) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-0 pointer-events-none" />

            {/* 비디오 카드 컨텐츠 */}
            <div className="relative h-full z-10 flex flex-col">
              <div className="flex-1 min-h-0">
                <VideoCard video={video} />
              </div>

              {/* 하단 투표/정보 바 */}
              <div className="p-2 flex flex-col gap-1 backdrop-blur-md bg-black/40">
                <div className="flex justify-between items-center text-[10px] text-gray-200">
                  <span className="font-bold flex items-center gap-1">
                    {idx === 0 ? '👑' : idx < 3 ? '🥈' : '️🏅'} {idx + 1}위
                  </span>
                  <span>🏆 {getLikes(video)}</span>
                </div>

                <button
                  onClick={e => { e.stopPropagation(); if (onLike) onLike(video); }}
                  disabled={!isVotingActive || (user && votedVideos.has(video.id)) || (!user && guestVotedVideos.has(video.id))}
                  className={`w-full py-1 text-[10px] rounded font-bold transition-all ${!isVotingActive
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : (user && votedVideos.has(video.id)) || (!user && guestVotedVideos.has(video.id))
                        ? 'bg-green-600/80 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-lg'
                    }`}
                >
                  {!isVotingActive
                    ? '종료'
                    : (user && votedVideos.has(video.id)) || (!user && guestVotedVideos.has(video.id))
                      ? '투표완료'
                      : '👍 투표하기'
                  }
                </button>
              </div>
            </div>

            {/* 순위 배지 (상위권만) */}
            {idx < 3 && (
              <div className="absolute top-0 left-0 p-2 z-20">
                <div className={`
                   w-8 h-8 flex items-center justify-center rounded-full font-bold text-white shadow-lg text-lg
                   ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 ring-2 ring-yellow-300' : ''}
                   ${idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 ring-1 ring-gray-400' : ''}
                   ${idx === 2 ? 'bg-gradient-to-br from-orange-400 to-red-500 ring-1 ring-orange-300' : ''}
                 `}>
                  {idx + 1}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}