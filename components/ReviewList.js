import { useState, useEffect } from 'react'
import { getVideoReviews, toggleReaction, createComment, deleteReview } from '../lib/reviewApi'
import ReviewComments from './ReviewComments'

export default function ReviewList({ videoId, currentUserId, onEditReview }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('created_at')
  const [expandedReview, setExpandedReview] = useState(null)
  const [showComments, setShowComments] = useState({})

  useEffect(() => {
    loadReviews()
  }, [videoId, sortBy])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const data = await getVideoReviews(videoId, sortBy, sortBy === 'created_at')
      setReviews(data || [])
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReaction = async (reviewId, reactionType) => {
    if (!currentUserId) {
      alert('로그인이 필요합니다.')
      return
    }

    try {
      await toggleReaction(reviewId, currentUserId, reactionType)
      loadReviews() // 리로드하여 업데이트된 반응 표시
    } catch (error) {
      console.error('Failed to toggle reaction:', error)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      try {
        await deleteReview(reviewId)
        loadReviews()
      } catch (error) {
        console.error('Failed to delete review:', error)
        alert('리뷰 삭제에 실패했습니다.')
      }
    }
  }

  const toggleComments = (reviewId) => {
    setShowComments(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60))
        return `${minutes}분 전`
      }
      return `${hours}시간 전`
    } else if (days < 7) {
      return `${days}일 전`
    } else {
      return date.toLocaleDateString('ko-KR')
    }
  }

  const StarRating = ({ rating }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-sm text-gray-400">({rating}/5)</span>
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">아직 리뷰가 없습니다.</p>
        <p className="text-gray-500 text-sm mt-2">첫 번째 리뷰를 작성해보세요!</p>
      </div>
    )
  }

  return (
    <div>
      {/* 정렬 옵션 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">
          리뷰 ({reviews.length}개)
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 bg-gray-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="created_at">최신순</option>
          <option value="helpful_count">도움됨순</option>
          <option value="overall_rating">평점순</option>
        </select>
      </div>

      {/* 리뷰 목록 */}
      <div className="space-y-4">
        {reviews.map(review => {
          const userReaction = review.reactions?.find(r => r.user_id === currentUserId)
          const isOwner = review.user_id === currentUserId
          const userName = review.user?.raw_user_meta_data?.name || review.user?.email?.split('@')[0] || 'Anonymous'

          return (
            <div key={review.id} className="bg-gray-800 rounded-lg p-4">
              {/* 리뷰 헤더 */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {userName[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{userName}</span>
                      {review.reviewer_level === 'expert' && (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                          전문가
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{formatDate(review.created_at)}</span>
                      {review.updated_at !== review.created_at && (
                        <span>(수정됨)</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 전체 평점 */}
                <StarRating rating={review.overall_rating} />
              </div>

              {/* 세부 평점 */}
              {(review.vocal_rating || review.emotion_rating || review.arrangement_rating || review.quality_rating) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 p-3 bg-gray-700/50 rounded-lg">
                  {review.vocal_rating && (
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">보컬</div>
                      <div className="text-sm font-semibold text-yellow-400">{review.vocal_rating}/5</div>
                    </div>
                  )}
                  {review.emotion_rating && (
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">감정</div>
                      <div className="text-sm font-semibold text-yellow-400">{review.emotion_rating}/5</div>
                    </div>
                  )}
                  {review.arrangement_rating && (
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">편곡</div>
                      <div className="text-sm font-semibold text-yellow-400">{review.arrangement_rating}/5</div>
                    </div>
                  )}
                  {review.quality_rating && (
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">영상</div>
                      <div className="text-sm font-semibold text-yellow-400">{review.quality_rating}/5</div>
                    </div>
                  )}
                </div>
              )}

              {/* 리뷰 텍스트 */}
              {review.review_text && (
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {review.review_text}
                </p>
              )}

              {/* 액션 버튼 */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReaction(review.id, 'helpful')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                      userReaction?.reaction_type === 'helpful'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    👍 도움됨 {review.helpful_count > 0 && `(${review.helpful_count})`}
                  </button>
                  
                  <button
                    onClick={() => toggleComments(review.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-400 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                  >
                    💬 댓글 {review.comments?.length > 0 && `(${review.comments.length})`}
                  </button>
                </div>

                {isOwner && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditReview(review)}
                      className="px-3 py-1 bg-gray-700 text-gray-400 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              {/* 댓글 섹션 */}
              {showComments[review.id] && (
                <ReviewComments
                  reviewId={review.id}
                  currentUserId={currentUserId}
                  initialComments={review.comments || []}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}