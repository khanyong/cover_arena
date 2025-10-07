import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import ReviewStats from './ReviewStats';
import { getUserVideoReview } from '../../lib/reviewApi';

export default function VideoDetailModal({ video, isOpen, onClose, user, onArenaLike }) {
  const [activeTab, setActiveTab] = useState('info');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    if (isOpen && video && user) {
      loadUserReview();
    }
  }, [isOpen, video, user]);

  const loadUserReview = async () => {
    if (!user || !video) return;
    try {
      const review = await getUserVideoReview(user.id, video.youtube_id);
      setExistingReview(review);
    } catch (error) {
      console.error('Failed to load user review:', error);
    }
  };

  const handleReviewSubmit = (review) => {
    setShowReviewForm(false);
    setExistingReview(review);
    setRefreshReviews(prev => prev + 1);
    setActiveTab('reviews');
  };

  const handleEditReview = (review) => {
    setExistingReview(review);
    setShowReviewForm(true);
    setActiveTab('reviews');
  };

  if (!isOpen || !video) return null;

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '정보 없음';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return { bgColor: 'from-yellow-400 to-yellow-600', text: '🥇 1위' };
    if (rank === 2) return { bgColor: 'from-gray-300 to-gray-500', text: '🥈 2위' };
    if (rank === 3) return { bgColor: 'from-orange-400 to-orange-600', text: '🥉 3위' };
    return { bgColor: 'from-blue-500 to-blue-700', text: `${rank}위` };
  };

  // displayRank가 있으면 우선 사용, 없으면 rank 사용
  const actualRank = video.displayRank || video.rank;
  console.log('VideoDetailModal - rank debug:', {
    title: video.title,
    displayRank: video.displayRank,
    rank: video.rank,
    actualRank: actualRank
  });
  const rankBadge = getRankBadge(actualRank);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-neutral-700 shadow-2xl">
        {/* 헤더 */}
                  <div className="flex justify-between items-center p-6 border-b border-neutral-700">
          <h2 className="text-2xl font-bold text-white">🎬 영상 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-neutral-700">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'info'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📊 정보
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'reviews'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            💬 리뷰 & 평가
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="p-6">
          {/* 정보 탭 */}
          {activeTab === 'info' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽: 썸네일 및 기본 정보 */}
            <div>
              {/* 썸네일 */}
              <div className="relative mb-4">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full rounded-lg shadow-lg"
                />
                <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-white font-bold text-sm bg-gradient-to-r ${rankBadge.bgColor}`}>
                  {rankBadge.text}
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white leading-tight">
                  {video.title}
                </h3>
                <p className="text-gray-300">
                  <span className="font-semibold">채널:</span> {video.channel}
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold">주제:</span> {video.topic}
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold">업로드:</span> {formatDate(video.created_at)}
                </p>
              </div>
            </div>

            {/* 오른쪽: 통계 및 점수 */}
            <div className="space-y-6">
              {/* 점수 정보 */}
              <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-lg p-4 border border-blue-700/30">
                <h4 className="text-lg font-bold text-white mb-3">📊 점수 정보</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {formatNumber(video.site_score)}
                    </div>
                    <div className="text-sm text-gray-300">본선 점수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {formatNumber(video.candidate_score)}
                    </div>
                    <div className="text-sm text-gray-300">예선 점수</div>
                  </div>
                </div>
              </div>

              {/* 유튜브 통계 */}
              <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-lg p-4 border border-emerald-700/30">
                <h4 className="text-lg font-bold text-white mb-3">📈 유튜브 통계</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {formatNumber(video.views)}
                    </div>
                    <div className="text-sm text-gray-300">조회수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-400">
                      {formatNumber(video.likes)}
                    </div>
                    <div className="text-sm text-gray-300">좋아요</div>
                  </div>
                </div>
              </div>

              {/* 사이트 좋아요 */}
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-purple-700/30">
                <h4 className="text-lg font-bold text-white mb-3">❤️ 사이트 좋아요</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {video.arena_likes || 0}
                    </div>
                    <div className="text-sm text-gray-300">회원 좋아요</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      {video.guest_likes || 0}
                    </div>
                    <div className="text-sm text-gray-300">비회원 좋아요</div>
                  </div>
                </div>
              </div>

              {/* 좋아요 버튼 */}
              <div className="text-center">
                <button
                  onClick={() => onArenaLike(video)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  ❤️ 좋아요 ({video.arena_likes || 0})
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  {user ? '회원 좋아요로 반영됩니다' : '로그인하면 회원 좋아요로 반영됩니다'}
                </p>
              </div>
            </div>
              </div>

              {/* 추가 정보 (YouTube API에서 가져온 모든 정보) */}
              {video.description && (
            <div className="mt-6 bg-gradient-to-br from-neutral-800/30 to-neutral-900/30 rounded-lg p-4 border border-neutral-700/50">
              <h4 className="text-lg font-bold text-white mb-3">📝 영상 설명</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {video.description.length > 300 
                  ? `${video.description.substring(0, 300)}...` 
                  : video.description
                }
              </p>
            </div>
          )}

          {/* 태그 정보 */}
          {video.tags && video.tags.length > 0 && (
            <div className="mt-6 bg-gradient-to-br from-neutral-800/30 to-neutral-900/30 rounded-lg p-4 border border-neutral-700/50">
              <h4 className="text-lg font-bold text-white mb-3">🏷️ 태그</h4>
              <div className="flex flex-wrap gap-2">
                {video.tags.slice(0, 10).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
            </>
          )}

          {/* 리뷰 탭 */}
          {activeTab === 'reviews' && (
            <div>
              {/* 리뷰 통계 */}
              <ReviewStats videoId={video.youtube_id} />

              {/* 리뷰 작성 버튼 또는 폼 */}
              {user && !showReviewForm && (
                <div className="mb-6 text-center">
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
                  >
                    {existingReview ? '📝 내 리뷰 수정하기' : '✍️ 리뷰 작성하기'}
                  </button>
                  {existingReview && (
                    <p className="text-sm text-gray-400 mt-2">
                      이미 작성한 리뷰가 있습니다. 수정하실 수 있습니다.
                    </p>
                  )}
                </div>
              )}

              {/* 리뷰 작성 폼 */}
              {user && showReviewForm && (
                <div className="mb-6">
                  <ReviewForm
                    videoId={video.youtube_id}
                    existingReview={existingReview}
                    userId={user.id}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              {/* 로그인 안내 */}
              {!user && (
                <div className="mb-6 text-center p-6 bg-gray-800 rounded-lg">
                  <p className="text-gray-300 mb-3">리뷰를 작성하려면 로그인이 필요합니다.</p>
                  <button
                    onClick={() => window.location.href = '/auth'}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                  >
                    로그인하기
                  </button>
                </div>
              )}

              {/* 리뷰 목록 */}
              <ReviewList
                key={refreshReviews}
                videoId={video.youtube_id}
                currentUserId={user?.id}
                onEditReview={handleEditReview}
              />
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex justify-between items-center p-6 border-t border-neutral-700">
          <div className="text-sm text-gray-400">
            영상 ID: {video.youtube_id}
          </div>
          <div className="space-x-3">
            <button
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtube_id}`, '_blank')}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              🎥 YouTube에서 보기
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 