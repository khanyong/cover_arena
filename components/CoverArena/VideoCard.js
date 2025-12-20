import { useState, useEffect } from 'react';
import { getVideoReviewSummary } from '../../lib/reviewApi';

export default function VideoCard({ video, isHovered }) {
  const [reviewSummary, setReviewSummary] = useState(null);
  const youtubeId = video.youtubeId || video.youtube_id;
  // 썸네일 우선순위 fallback
  const [thumb, setThumb] = useState(
    video.thumbnail ||
    `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
  );

  // 리뷰 요약 정보 가져오기
  useEffect(() => {
    const loadReviewSummary = async () => {
      try {
        const summary = await getVideoReviewSummary(youtubeId);
        setReviewSummary(summary);
      } catch (error) {
        console.error('Failed to load review summary:', error);
      }
    };

    if (youtubeId) {
      loadReviewSummary();
    }
  }, [youtubeId]);

  // 순위변동 표시 함수
  const getRankChangeDisplay = () => {
    if (!video.rank_status) return null;

    switch (video.rank_status) {
      case 'new':
        return { text: '🆕', color: 'text-green-500', bgColor: 'bg-green-100' };
      case 'up':
        return { text: `📈+${Math.abs(video.rank_change || 0)}`, color: 'text-blue-500', bgColor: 'bg-blue-100' };
      case 'down':
        return { text: `📉${video.rank_change || 0}`, color: 'text-red-500', bgColor: 'bg-red-100' };
      case 'same':
        return { text: '➡️', color: 'text-gray-500', bgColor: 'bg-gray-100' };
      default:
        return null;
    }
  };

  const rankChange = getRankChangeDisplay();

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      {/* 썸네일 이미지 */}
      {thumb && (
        <img
          src={thumb}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={e => {
            if (thumb.includes('maxresdefault')) {
              setThumb(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`);
            } else if (thumb.includes('hqdefault')) {
              setThumb(`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`);
            } else {
              setThumb('');
            }
          }}
          style={{ display: thumb ? 'block' : 'none' }}
        />
      )}
      {/* 썸네일이 없을 때만 검은 배경 */}
      {!thumb && (
        <div className="w-full h-full flex items-center justify-center bg-black text-white text-2xl">
          🎵
        </div>
      )}

      {/* 순위변동 표시 (좌상단) */}
      {rankChange && (
        <div className={`absolute top-1 left-1 ${rankChange.bgColor} ${rankChange.color} text-[8px] px-1 py-0.5 rounded font-bold`}>
          {rankChange.text}
        </div>
      )}

      {/* 크기 표시 (우상단) */}
      <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-[8px] px-1 py-0.5 rounded">
        {video.size.toFixed(1)}
      </div>

      {/* 영상 정보 오버레이 - 극한 크기용 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-1 pointer-events-none">
        <h3 className="font-semibold text-white text-[6px] line-clamp-1 mb-0.5">
          {video.title}
        </h3>
        <div className="flex justify-between items-center text-[5px] text-gray-300">
          <span className="truncate">{video.channel}</span>
          <div className="flex items-center space-x-1">
            <span>👁️{video.views > 999 ? (video.views / 1000).toFixed(1) + 'K' : video.views}</span>
            <span>❤️{video.likes > 999 ? (video.likes / 1000).toFixed(1) + 'K' : video.likes}</span>
          </div>
        </div>

        {/* 평점 표시 (우하단) */}
        {reviewSummary && reviewSummary.total_reviews > 0 && (
          <div className="absolute bottom-1 right-1 bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <span className="text-[7px] font-bold">⭐{reviewSummary.avg_overall_rating?.toFixed(1)}</span>
            <span className="text-[6px] text-purple-100">({reviewSummary.total_reviews})</span>
          </div>
        )}

        {/* 평가 가능 표시 (리뷰가 없을 때) */}
        {(!reviewSummary || reviewSummary.total_reviews === 0) && (
          <div className="absolute bottom-1 right-1 bg-gradient-to-r from-gray-600/90 to-gray-700/90 text-white px-1.5 py-0.5 rounded-full">
            <span className="text-[6px] font-bold">⭐평가하기</span>
          </div>
        )}
      </div>

      {/* Play Icon Overlay (Hover) */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/50 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8 drop-shadow-lg">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
} 