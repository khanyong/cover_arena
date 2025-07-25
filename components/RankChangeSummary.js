import React from 'react';
import { generateRankSummary } from '../lib/rankTracker';

export default function RankChangeSummary({ videos }) {
  if (!videos || videos.length === 0) return null;

  const summary = generateRankSummary(videos);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-lg p-4 mb-6 border border-neutral-700/50 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        📊 순위 변동 요약
        <span className="ml-2 text-sm text-gray-300">(이전 업데이트 대비)</span>
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {summary.newVideos}
          </div>
          <div className="text-sm text-gray-300">🆕 신규</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {summary.rankUp}
          </div>
          <div className="text-sm text-gray-300">↗️ 상승</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            {summary.rankDown}
          </div>
          <div className="text-sm text-gray-300">↘️ 하락</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400">
            {summary.stable}
          </div>
          <div className="text-sm text-gray-300">→ 유지</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {summary.totalVideos}
          </div>
          <div className="text-sm text-gray-300">📊 전체</div>
        </div>
      </div>

      {/* 상위 변동자 */}
      {summary.topMovers.length > 0 && (
        <div>
          <h4 className="text-md font-bold text-white mb-3">🔥 상위 변동자</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {summary.topMovers.map((mover, index) => (
              <div
                key={mover.video.youtube_id}
                className={`bg-black bg-opacity-30 rounded-lg p-3 border-l-4 ${
                  mover.type === 'up' ? 'border-green-500' : 'border-red-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">
                    {mover.video.title.length > 30 
                      ? `${mover.video.title.substring(0, 30)}...` 
                      : mover.video.title
                    }
                  </span>
                  <span className={`text-lg font-bold ${
                    mover.type === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {mover.type === 'up' ? '↗️' : '↘️'} {mover.change}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{mover.video.rank}위</span>
                  <span>{formatNumber(mover.video.site_score)}점</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 업데이트 시간 */}
      <div className="mt-4 text-center text-xs text-gray-400">
        마지막 업데이트: {new Date().toLocaleString('ko-KR')}
      </div>
    </div>
  );
} 