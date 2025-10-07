import React, { useState, useEffect } from 'react';
import { getVideoReviewSummary } from '../../lib/reviewApi';

export default function VideoTable({ videos, onVideoClick }) {
  const [reviewSummaries, setReviewSummaries] = useState({});
  
  // 리뷰 요약 정보 일괄 로드
  useEffect(() => {
    const loadReviewSummaries = async () => {
      const summaries = {};
      for (const video of videos.slice(0, 100)) {
        try {
          const summary = await getVideoReviewSummary(video.youtube_id);
          summaries[video.youtube_id] = summary;
        } catch (error) {
          console.error('Failed to load review summary:', error);
        }
      }
      setReviewSummaries(summaries);
    };
    
    if (videos && videos.length > 0) {
      loadReviewSummaries();
    }
  }, [videos]);
  
  if (!videos || videos.length === 0) {
    return <div className="text-center text-gray-400 py-8">영상이 없습니다.</div>;
  }

  // 데이터베이스의 실제 rank를 사용 (이미 정렬된 상태)
  // index.js에서 이미 displayRank와 displayPreviousRank를 계산했으므로 그대로 사용
  const sortedVideos = videos
    .slice(0, 100);

  // rank와 previous_rank를 사용한 순위변동 표시
  const getRankChangeDisplay = (video) => {
    // 디버깅: rank 데이터 확인
    console.log('Video rank debug:', {
      id: video.id,
      title: video.title,
      displayRank: video.displayRank,
      displayPreviousRank: video.displayPreviousRank,
      originalRank: video.originalRank,
      originalPreviousRank: video.originalPreviousRank
    });
    
    // displayPreviousRank가 없으면 신규
    if (video.displayPreviousRank === null || video.displayPreviousRank === undefined) {
      console.log('New video (no displayPreviousRank):', video.id);
      return { 
        text: '신규', 
        color: 'text-white font-bold',
        svg: (
          <svg width="16" height="16" viewBox="0 0 24 24" className="inline-block mr-2">
            <polygon points="20,2 4,12 20,22" fill="#10B981" />
          </svg>
        )
      };
    }
    
    // displayRank가 없으면 표시 불가
    if (!video.displayRank) {
      console.log('No displayRank for video:', video.id);
      return null;
    }
    
    // 순위변동 계산 (표시용 순위 기준)
    const rankChange = video.displayPreviousRank - video.displayRank;
    
    if (rankChange > 0) {
      // 순위 상승 (displayPreviousRank > displayRank)
      console.log('Rank up:', video.id, `${video.displayPreviousRank} -> ${video.displayRank} (+${rankChange})`);
      return { 
        text: `+${rankChange}`, 
        color: 'text-white font-bold',
        svg: (
          <svg width="16" height="16" viewBox="0 0 24 24" className="inline-block mr-2">
            <polygon points="12,4 22,20 2,20" fill="#3B82F6" />
          </svg>
        )
      };
    } else if (rankChange < 0) {
      // 순위 하락 (displayPreviousRank < displayRank)
      console.log('Rank down:', video.id, `${video.displayPreviousRank} -> ${video.displayRank} (${rankChange})`);
      return { 
        text: `${rankChange}`, 
        color: 'text-white font-bold',
        svg: (
          <svg width="16" height="16" viewBox="0 0 24 24" className="inline-block mr-2">
            <polygon points="2,4 22,4 12,20" fill="#EF4444" />
          </svg>
        )
      };
    } else {
      // 순위 유지 (displayPreviousRank = displayRank)
      console.log('Rank same:', video.id, `${video.displayPreviousRank} -> ${video.displayRank}`);
      return { 
        text: '유지', 
        color: 'text-white font-bold',
        svg: (
          <svg width="16" height="16" viewBox="0 0 24 24" className="inline-block mr-2">
            <polygon points="4,2 20,12 4,22" fill="#EAB308" />
          </svg>
        )
      };
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getRankBadge = (rank) => {
    // if (rank === 1) return '🥇';
    // if (rank === 2) return '🥈';
    // if (rank === 3) return '🥉';
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
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                회원평가
              </th>
            </tr>
          </thead>
          <tbody className="bg-neutral-900/50 divide-y divide-neutral-700">
            {sortedVideos.map((video) => {
              const rankChange = getRankChangeDisplay(video);
              return (
                <tr key={video.id} className="hover:bg-neutral-800/70 transition-colors duration-200">
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-bold text-white text-center">
                    {video.displayRank}
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
                    {rankChange ? (
                      <span className={`font-bold ${rankChange.color} flex items-center`}>
                        {rankChange.svg}
                        {rankChange.text}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
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
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    {reviewSummaries[video.youtube_id] && reviewSummaries[video.youtube_id].total_reviews > 0 ? (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 font-bold">⭐</span>
                          <span className="text-white font-semibold">
                            {reviewSummaries[video.youtube_id].avg_overall_rating?.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          ({reviewSummaries[video.youtube_id].total_reviews}명)
                        </span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => onVideoClick(video)}
                        className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
                      >
                        평가하기
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-center">
        총 {sortedVideos.length}개 영상 • 썸네일 또는 제목 클릭 시 상세 보기
      </div>
    </div>
  );
} 