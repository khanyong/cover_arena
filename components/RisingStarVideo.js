import React from 'react';
import { calculateRankChange } from '../lib/rankTracker';

export default function RisingStarVideo({ videos, onVideoClick }) {
  // 순위 상승폭이 가장 큰 비디오 찾기
  const getRisingStarVideo = () => {
    if (!videos || videos.length === 0) return null;
    
    return videos
      .filter(video => 
        video.previous_rank !== null && 
        video.previous_rank !== undefined && 
        video.rank < video.previous_rank
      ) // 순위 상승한 비디오만 (previous_rank가 0인 경우도 포함)
      .sort((a, b) => (b.previous_rank - b.rank) - (a.previous_rank - a.rank)) // 상승폭 기준 정렬
      .slice(0, 1)[0]; // 가장 큰 상승폭
  };

  const risingStarVideo = getRisingStarVideo();

  if (!risingStarVideo) {
    return null; // 순위 상승한 비디오가 없으면 표시하지 않음
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

  const rankIncrease = risingStarVideo.previous_rank - risingStarVideo.rank;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        🔥 순위 급상승 1위
        <span className="ml-2 text-sm text-gray-300">(이전 업데이트 대비)</span>
      </h2>
      
      <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-red-700/30">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 썸네일 */}
          <div className="relative flex-shrink-0">
            <img 
              src={risingStarVideo.thumbnail || `https://img.youtube.com/vi/${risingStarVideo.youtube_id}/maxresdefault.jpg`} 
              alt={risingStarVideo.title}
              className="w-full lg:w-80 h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
              onClick={() => onVideoClick(risingStarVideo)}
            />
            
            {/* 급상승 배지 */}
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
              🔥 +{rankIncrease}단계 상승!
            </div>
            
            {/* 현재 순위 */}
            <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-bold">
              {risingStarVideo.rank}위
            </div>
          </div>
          
          {/* 정보 */}
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                {risingStarVideo.title}
              </h3>
              <p className="text-gray-200 mb-3">
                <span className="font-semibold">채널:</span> {risingStarVideo.channel}
              </p>
              
              {/* 순위 변화 */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center">
                  <div className="text-gray-400 text-sm">이전 순위</div>
                  <div className="text-red-300 font-bold text-lg">{risingStarVideo.previous_rank}위</div>
                </div>
                <div className="text-2xl text-orange-400 animate-bounce">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="inline-block">
                    <polygon points="12,4 22,20 2,20" fill="#3B82F6" />
                  </svg>
                </div>
                <div className="bg-black bg-opacity-30 rounded-lg p-3 text-center">
                  <div className="text-gray-400 text-sm">현재 순위</div>
                  <div className="text-green-300 font-bold text-lg">{risingStarVideo.rank}위</div>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-3 text-center">
                  <div className="text-white text-sm font-bold">상승폭</div>
                  <div className="text-white font-bold text-lg">+{rankIncrease}</div>
                </div>
              </div>
            </div>
            
            {/* 점수 정보 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-black bg-opacity-20 rounded p-3">
                <div className="text-yellow-300 font-bold text-sm">본선점수</div>
                <div className="text-white font-bold">{formatScore(risingStarVideo.site_score)}</div>
              </div>
              <div className="bg-black bg-opacity-20 rounded p-3">
                <div className="text-blue-300 font-bold text-sm">예선점수</div>
                <div className="text-white font-bold">{formatScore(risingStarVideo.candidate_score)}</div>
              </div>
              <div className="bg-black bg-opacity-20 rounded p-3">
                <div className="text-green-300 font-bold text-sm">조회수</div>
                <div className="text-white font-bold">{formatViews(risingStarVideo.views)}</div>
              </div>
              <div className="bg-black bg-opacity-20 rounded p-3">
                <div className="text-red-300 font-bold text-sm">좋아요</div>
                <div className="text-white font-bold">{formatViews(risingStarVideo.likes)}</div>
              </div>
            </div>
            
            {/* Arena 좋아요 정보 */}
            <div className="flex justify-between items-center text-sm text-gray-200 mb-4">
              <span>🏆 Arena 좋아요: {risingStarVideo.arena_likes || 0}</span>
              <span>👤 비회원 좋아요: {risingStarVideo.guest_likes || 0}</span>
            </div>
            
            {/* 액션 버튼 */}
            <div className="flex space-x-3">
              <button
                onClick={() => onVideoClick(risingStarVideo)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold"
              >
                🎬 상세보기
              </button>
              <button
                onClick={() => window.open(`https://www.youtube.com/watch?v=${risingStarVideo.youtube_id}`, '_blank')}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold"
              >
                📺 YouTube 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 