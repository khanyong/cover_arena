import { useState } from 'react'
import { createReview, updateReview } from '../lib/reviewApi'

export default function ReviewForm({ videoId, existingReview, userId, onSubmit, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    overall_rating: existingReview?.overall_rating || 3,
    vocal_rating: existingReview?.vocal_rating || 3,
    emotion_rating: existingReview?.emotion_rating || 3,
    arrangement_rating: existingReview?.arrangement_rating || 3,
    quality_rating: existingReview?.quality_rating || 3,
    review_text: existingReview?.review_text || ''
  })

  const ratingLabels = {
    vocal_rating: '보컬 실력',
    emotion_rating: '감정 전달',
    arrangement_rating: '편곡/해석',
    quality_rating: '영상 퀄리티'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const reviewData = {
        ...formData,
        video_id: videoId,
        user_id: userId
      }

      let result
      if (existingReview) {
        result = await updateReview(existingReview.id, formData)
      } else {
        result = await createReview(reviewData)
      }

      if (onSubmit) onSubmit(result)
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('리뷰 제출에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseInt(value)
    }))
  }

  const RatingSlider = ({ field, label }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-sm font-bold text-yellow-400">{formData[field]}/5</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="1"
          max="5"
          value={formData[field]}
          onChange={(e) => handleRatingChange(field, e.target.value)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #facc15 0%, #facc15 ${((formData[field] - 1) / 4) * 100}%, #374151 ${((formData[field] - 1) / 4) * 100}%, #374151 100%)`
          }}
        />
        <div className="flex justify-between mt-1">
          {[1, 2, 3, 4, 5].map(num => (
            <span key={num} className="text-xs text-gray-500">{num}</span>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-6">
        {existingReview ? '리뷰 수정하기' : '리뷰 작성하기'}
      </h3>

      {/* 전체 평점 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-lg font-bold text-white">전체 평점</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange('overall_rating', star)}
                className={`text-2xl transition-colors ${
                  star <= formData.overall_rating
                    ? 'text-yellow-400'
                    : 'text-gray-600'
                }`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-lg font-bold text-yellow-400">
              {formData.overall_rating}/5
            </span>
          </div>
        </div>
      </div>

      {/* 카테고리별 평점 */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          세부 평가
        </h4>
        {Object.entries(ratingLabels).map(([field, label]) => (
          <RatingSlider key={field} field={field} label={label} />
        ))}
      </div>

      {/* 리뷰 텍스트 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          상세 리뷰 (선택사항)
        </label>
        <textarea
          value={formData.review_text}
          onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
          placeholder="이 커버에 대한 자세한 의견을 남겨주세요..."
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="4"
        />
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '제출 중...' : existingReview ? '리뷰 수정' : '리뷰 제출'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            취소
          </button>
        )}
      </div>
    </form>
  )
}