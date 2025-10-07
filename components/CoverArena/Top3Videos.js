import React from 'react';
import { calculateRankChange } from '../../lib/rankTracker';

export default function Top3Videos({ videos, onVideoClick }) {
  // 상위 3개 영상 추출 (rank 기준으로 정렬된 데이터의 첫 3개)
  console.log('=== Top3Videos 컴포넌트 ===');
  console.log('받은 videos 배열 길이:', videos.length);
  console.log('첫 5개 영상:', videos.slice(0, 5).map(v => ({
    rank: v.rank,
    title: v.title,
    score: v.site_score
  })));
  
  // index.js에서 이미 displayRank를 계산했으므로 그대로 사용
  const top3Videos = videos
    .slice(0, 3);

  if (top3Videos.length === 0) {
    return null;
  }

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1: return { emoji: '🥇', bgColor: 'from-yellow-400 to-yellow-600', textColor: 'text-yellow-900' };
      case 2: return { emoji: '🥈', bgColor: 'from-gray-400 to-gray-600', textColor: 'text-gray-900' };
      case 3: return { emoji: '🥉', bgColor: 'from-orange-400 to-orange-600', textColor: 'text-orange-900' };
      default: return { emoji: '🏆', bgColor: 'from-blue-400 to-blue-600', textColor: 'text-blue-900' };
    }
  };

  const getRankChangeIcon = (video) => {
    const rankChange = calculateRankChange(video, {});
    
    return (
      <div className={`flex items-center text-sm ${rankChange.color}`}>
        <span className="mr-1">{rankChange.icon}</span>
        <span className="text-xs">{rankChange.text}</span>
      </div>
    );
  };

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

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        🏆 TOP 3 영상
        <span className="ml-2 text-sm text-gray-300">(본선점수 기준)</span>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1위 영상 - 큰 카드 */}
        {top3Videos[0] && (
          <div className={`lg:col-span-2 bg-gradient-to-br ${getRankBadge(1).bgColor} rounded-lg p-4 shadow-lg`}>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-shrink-0">
                <img 
                  src={top3Videos[0].thumbnail || `https://img.youtube.com/vi/${top3Videos[0].youtube_id}/maxresdefault.jpg`} 
                  alt={top3Videos[0].title}
                  className="w-full lg:w-80 h-48 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onVideoClick(top3Videos[0])}
                />
                <div className={`absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold`}>
                  {getRankBadge(top3Videos[0].displayRank).emoji} {top3Videos[0].displayRank}위
                </div>
                {getRankChangeIcon(top3Videos[0])}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                  {top3Videos[0].title}
                </h3>
                <p className="text-gray-200 mb-3">
                  <span className="font-semibold">채널:</span> {top3Videos[0].channel}
                </p>
                
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="bg-black bg-opacity-20 rounded p-2">
                    <div className="text-yellow-300 font-bold">본선점수</div>
                    <div className="text-white">{formatScore(top3Videos[0].site_score)}</div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded p-2">
                    <div className="text-blue-300 font-bold">예선점수</div>
                    <div className="text-white">{formatScore(top3Videos[0].candidate_score)}</div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded p-2">
                    <div className="text-green-300 font-bold">조회수</div>
                    <div className="text-white">{formatViews(top3Videos[0].views)}</div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded p-2">
                    <div className="text-red-300 font-bold">좋아요</div>
                    <div className="text-white">{formatViews(top3Videos[0].likes)}</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-200">
                  <span>🏆 Arena 좋아요: {top3Videos[0].arena_likes || 0}</span>
                  <span>👤 비회원 좋아요: {top3Videos[0].guest_likes || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 2-3위 영상 - 작은 카드 */}
        <div className="space-y-4">
          {/* 2위 */}
          {top3Videos[1] && (
            <div className={`bg-gradient-to-br ${getRankBadge(2).bgColor} rounded-lg p-3 shadow-lg`}>
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <img 
                    src={top3Videos[1].thumbnail || `https://img.youtube.com/vi/${top3Videos[1].youtube_id}/hqdefault.jpg`} 
                    alt={top3Videos[1].title}
                    className="w-24 h-16 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onVideoClick(top3Videos[1])}
                  />
                  <div className={`absolute -top-1 -right-1 bg-gray-500 text-white px-1 py-0.5 rounded text-xs font-bold`}>
                    {getRankBadge(2).emoji}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-bold text-gray-900">{top3Videos[1].displayRank}위</div>
                    {getRankChangeIcon(top3Videos[1])}
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-2 mb-1">
                    {top3Videos[1].title}
                  </h4>
                  <p className="text-xs text-gray-200 mb-2">{top3Videos[1].channel}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>
                      <span className="text-yellow-300">본선:</span> {formatScore(top3Videos[1].site_score)}
                    </div>
                    <div>
                      <span className="text-blue-300">예선:</span> {formatScore(top3Videos[1].candidate_score)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 3위 */}
          {top3Videos[2] && (
            <div className={`bg-gradient-to-br ${getRankBadge(3).bgColor} rounded-lg p-3 shadow-lg`}>
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <img 
                    src={top3Videos[2].thumbnail || `https://img.youtube.com/vi/${top3Videos[2].youtube_id}/hqdefault.jpg`} 
                    alt={top3Videos[2].title}
                    className="w-24 h-16 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onVideoClick(top3Videos[2])}
                  />
                  <div className={`absolute -top-1 -right-1 bg-orange-500 text-white px-1 py-0.5 rounded text-xs font-bold`}>
                    {getRankBadge(3).emoji}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-bold text-orange-900">{top3Videos[2].displayRank}위</div>
                    {getRankChangeIcon(top3Videos[2])}
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-2 mb-1">
                    {top3Videos[2].title}
                  </h4>
                  <p className="text-xs text-gray-200 mb-2">{top3Videos[2].channel}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>
                      <span className="text-yellow-300">본선:</span> {formatScore(top3Videos[2].site_score)}
                    </div>
                    <div>
                      <span className="text-blue-300">예선:</span> {formatScore(top3Videos[2].candidate_score)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 