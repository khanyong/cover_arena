import React from 'react';
import { calculateRankChange } from '../lib/rankTracker';

export default function VideoTable({ videos, onVideoClick }) {
  if (!videos || videos.length === 0) {
    return <div className="text-center text-gray-400 py-8">영상이 없습니다.</div>;
  }

  // 본선점수 기준으로 정렬하고 순위 부여 (상위 100개만)
  const sortedVideos = videos
    .sort((a, b) => (b.site_score || 0) - (a.site_score || 0))
    .slice(0, 100)
    .map((video, index) => ({
      ...video,
      rank: index + 1
    }));

  const getRankChangeIcon = (video) => {
    const rankChange = calculateRankChange(video, {});
    return (
      <span className={`font-bold ${rankChange.color}`}>
        {rankChange.icon} {rankChange.text}
      </span>
    );
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-8 overflow-x-auto border border-neutral-700/50">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        🎬 상위 100개 영상 랭킹
        <span className="ml-2 text-sm text-gray-300">(본선점수 기준)</span>
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gradient-to-r from-neutral-800 to-neutral-700">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                순위
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                썸네일
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                제목
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                채널
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                본선점수
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                예선점수
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                변동
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                조회수
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                좋아요
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Arena
              </th>
            </tr>
          </thead>
          <tbody className="bg-neutral-900/50 divide-y divide-neutral-700">
            {sortedVideos.map((video) => (
                              <tr key={video.id} className="hover:bg-neutral-800/70 transition-colors duration-200">
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-white">
                  <div className="flex items-center">
                    <span className="mr-2">{getRankBadge(video.rank)}</span>
                    <span className="text-lg font-bold">{video.rank}</span>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <img
                    src={video.thumbnail || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                    alt={video.title}
                    className="h-12 w-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onVideoClick(video)}
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`; 
                    }}
                  />
                </td>
                <td className="px-3 py-4 text-sm text-gray-300 max-w-xs">
                  <span 
                    className="cursor-pointer hover:text-blue-400 transition-colors line-clamp-2" 
                    onClick={() => onVideoClick(video)}
                    title={video.title}
                  >
                    {video.title}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-400 max-w-32 truncate">
                  {video.channel}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  <div className="text-yellow-300 font-bold">
                    {formatNumber(video.site_score)}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  <div className="text-blue-300">
                    {formatNumber(video.candidate_score)}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  {getRankChangeIcon(video)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatNumber(video.views)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatNumber(video.likes)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  <div className="flex flex-col text-xs">
                    <span className="text-yellow-400">🏆 {video.arena_likes || 0}</span>
                    <span className="text-gray-400">👤 {video.guest_likes || 0}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        총 {sortedVideos.length}개 영상 • 썸네일 또는 제목 클릭 시 상세 보기
      </div>
    </div>
  );
} 