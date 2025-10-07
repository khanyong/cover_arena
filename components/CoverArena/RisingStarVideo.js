import React from 'react';
import { calculateRankChange } from '../../lib/rankTracker';

export default function RisingStarVideo({ videos, onVideoClick }) {
  // 순위 상승 비디오들 찾기
  const getRisingVideos = () => {
    if (!videos || videos.length === 0) return [];
    
    const risingVideos = videos
      .filter(video => 
        video.previous_rank !== null && 
        video.previous_rank !== undefined && 
        (video.displayRank || video.rank) < video.previous_rank &&
        (video.displayRank || video.rank) <= 100 // 현재 순위가 100위 이내인 것만
      )
      .map(video => {
        const currentRank = video.displayRank || video.rank;
        const rankIncrease = video.previous_rank - currentRank;
        return { ...video, currentRank, rankIncrease };
      })
      .sort((a, b) => {
        // 1차: 상승폭 기준 정렬 (큰 것부터)
        if (b.rankIncrease !== a.rankIncrease) {
          return b.rankIncrease - a.rankIncrease;
        }
        
        // 2차: 상승폭이 같으면 현재 순위 기준 정렬 (작은 것부터 = 높은 순위부터)
        return a.currentRank - b.currentRank;
      });
    
    if (risingVideos.length === 0) return [];
    
    // 디버깅: 상위 3개 영상의 상승폭 확인
    console.log('Top 3 rising videos:');
    risingVideos.slice(0, 3).forEach((video, index) => {
      console.log(`${index + 1}. ${video.title}: 상승폭 +${video.rankIncrease} (${video.previous_rank}위 → ${video.currentRank}위)`);
    });
    
    const maxRankIncrease = risingVideos[0].rankIncrease;
    const topVideos = risingVideos.filter(video => video.rankIncrease === maxRankIncrease);
    
    console.log(`최대 상승폭: +${maxRankIncrease}, 동률 개수: ${topVideos.length}`);
    
    return topVideos;
  };

  // 신규 진입 비디오들 찾기
  const getNewEntryVideos = () => {
    if (!videos || videos.length === 0) return [];
    
    const newVideos = videos
      .filter(video => 
        (video.previous_rank === null || video.previous_rank === undefined) && 
        (video.displayRank || video.rank) <= 100 // 100위 이내로 신규 진입한 비디오만
      )
      .sort((a, b) => (a.displayRank || a.rank) - (b.displayRank || b.rank)); // 현재 순위 기준 정렬 (높은 순위부터)
    
    if (newVideos.length === 0) return [];
    
    const topRank = newVideos[0].displayRank || newVideos[0].rank;
    return newVideos.filter(video => (video.displayRank || video.rank) === topRank);
  };

  const risingVideos = getRisingVideos();
  const newEntryVideos = getNewEntryVideos();

  // 둘 다 없으면 표시하지 않음
  if ((!risingVideos || risingVideos.length === 0) && (!newEntryVideos || newEntryVideos.length === 0)) {
    return null;
  }

  const formatScore = (score) => {
    if (!score) return '0';
    return score.toLocaleString();
  };

  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  // 비디오 카드 렌더링 함수
  const renderVideoCard = (video, isNewEntry, index, totalCount) => {
    const currentRank = video.currentRank || video.displayRank || video.rank;
    const rankIncrease = isNewEntry ? 0 : (video.rankIncrease || video.previous_rank - currentRank);
    
    return (
      <div key={video.id} className={`backdrop-blur-sm rounded-lg p-6 shadow-lg border ${
        isNewEntry 
          ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700/30' 
          : 'bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-700/30'
      }`}>
        {totalCount > 1 && (
          <div className="flex items-center justify-between mb-4">
            <span className={`font-bold text-lg ${isNewEntry ? 'text-green-300' : 'text-orange-300'}`}>
              공동 1위 ({index + 1}/{totalCount})
            </span>
            <span className="text-gray-300 text-sm">
              {isNewEntry ? `${currentRank}위 신규 진입` : `+${rankIncrease}단계 상승`}
            </span>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 썸네일 */}
          <div className="relative flex-shrink-0">
            <img 
              src={video.thumbnail || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`} 
              alt={video.title}
              className="w-full lg:w-80 h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
              onClick={() => onVideoClick(video)}
            />
            
            {/* 배지 */}
            <div className={`absolute top-3 left-3 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse ${
              isNewEntry 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-red-500 to-orange-500'
            }`}>
              {isNewEntry ? `🌟 ${currentRank}위 신규!` : `🔥 +${rankIncrease}단계 상승!`}
            </div>
            
            {/* 현재 순위 */}
            <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-bold">
              {currentRank}위
            </div>
          </div>
          
          {/* 정보 */}
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-gray-200 mb-3">
                <span className="font-semibold">채널:</span> {video.channel}
              </p>
              
              {/* 순위 변화 */}
              <div className="flex items-center space-x-4 mb-4">
                {isNewEntry ? (
                  <>
                    <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center">
                      <div className="text-gray-400 text-sm">이전 순위</div>
                      <div className="text-gray-500 font-bold text-lg">신규</div>
                    </div>
                    <div className="text-2xl text-green-400 animate-bounce">
                      🌟
                    </div>
                    <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center">
                      <div className="text-gray-400 text-sm">현재 순위</div>
                      <div className="text-green-300 font-bold text-lg">{currentRank}위</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 text-center">
                      <div className="text-white text-sm font-bold">진입</div>
                      <div className="text-white font-bold text-lg">NEW</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center">
                      <div className="text-gray-400 text-sm">이전 순위</div>
                      <div className="text-red-300 font-bold text-lg">{video.previous_rank}위</div>
                    </div>
                    <div className="text-2xl text-orange-400 animate-bounce">
                      <svg width="24" height="24" viewBox="0 0 24 24" className="inline-block">
                        <polygon points="12,4 22,20 2,20" fill="#3B82F6" />
                      </svg>
                    </div>
                    <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center">
                      <div className="text-gray-400 text-sm">현재 순위</div>
                      <div className="text-green-300 font-bold text-lg">{currentRank}위</div>
                    </div>
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-3 text-center">
                      <div className="text-white text-sm font-bold">상승폭</div>
                      <div className="text-white font-bold text-lg">+{rankIncrease}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* 점수 정보 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-black bg-opacity-20 rounded p-3">
                <div className="text-yellow-300 font-bold text-sm">본선점수</div>
                <div className="text-white font-bold">{formatScore(video.site_score)}</div>
              </div>
              <div className="bg-black bg-opacity-20 rounded p-3">
                <div className="text-blue-300 font-bold text-sm">예선점수</div>
                <div className="text-white font-bold">{formatScore(video.candidate_score)}</div>
              </div>
              <div className="bg-black bg-opacity-20 rounded p-3">
                <div className="text-green-300 font-bold text-sm">조회수</div>
                <div className="text-white font-bold">{formatViews(video.views)}</div>
              </div>
              <div className="bg-black bg-opacity-20 rounded p-3">
                <div className="text-red-300 font-bold text-sm">좋아요</div>
                <div className="text-white font-bold">{formatViews(video.likes)}</div>
              </div>
            </div>
            
            {/* Arena 좋아요 정보 */}
            <div className="flex justify-between items-center text-sm text-gray-200 mb-4">
              <span>🏆 Arena 좋아요: {video.arena_likes || 0}</span>
              <span>👤 비회원 좋아요: {video.guest_likes || 0}</span>
            </div>
            
            {/* 액션 버튼 */}
            <div className="flex space-x-3">
              <button
                onClick={() => onVideoClick(video)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold"
              >
                🎬 상세보기
              </button>
              <button
                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtube_id}`, '_blank')}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold"
              >
                📺 YouTube 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8 space-y-8">
      {/* 순위 급상승 섹션 */}
      {risingVideos && risingVideos.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            🔥 순위 급상승 1위
            {risingVideos.length > 1 && (
              <span className="ml-2 text-sm text-orange-300">
                ({risingVideos.length}개 동률 - 모두 +{risingVideos[0].rankIncrease}단계 상승)
              </span>
            )}
            <span className="ml-2 text-sm text-gray-300">(이전 업데이트 대비)</span>
          </h2>
          
          <div className="space-y-6">
            {risingVideos.map((video, index) => 
              renderVideoCard(video, false, index, risingVideos.length)
            )}
          </div>
        </div>
      )}

      {/* 신규 진입 섹션 */}
      {newEntryVideos && newEntryVideos.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            🌟 신규 진입 1위
            {newEntryVideos.length > 1 && (
              <span className="ml-2 text-sm text-green-300">({newEntryVideos.length}개 동률)</span>
            )}
            <span className="ml-2 text-sm text-gray-300">(높은 순위 신규 진입)</span>
          </h2>
          
          <div className="space-y-6">
            {newEntryVideos.map((video, index) => 
              renderVideoCard(video, true, index, newEntryVideos.length)
            )}
          </div>
        </div>
      )}
    </div>
  );
} 