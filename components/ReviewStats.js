import { useState, useEffect } from 'react'
import { getVideoReviewSummary, getTopReviewers } from '../lib/reviewApi'

export default function ReviewStats({ videoId }) {
  const [summary, setSummary] = useState(null)
  const [topReviewers, setTopReviewers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [videoId])

  const loadStats = async () => {
    try {
      setLoading(true)
      const [summaryData, reviewersData] = await Promise.all([
        getVideoReviewSummary(videoId),
        getTopReviewers(5)
      ])
      setSummary(summaryData)
      setTopReviewers(reviewersData || [])
    } catch (error) {
      console.error('Failed to load review stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!summary || summary.total_reviews === 0) {
    return null
  }

  const RatingBar = ({ label, value, max = 5 }) => {
    const percentage = (value / max) * 100
    return (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-400">{label}</span>
          <span className="text-sm font-bold text-yellow-400">{value?.toFixed(1) || '0.0'}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-6">평가 통계</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 전체 통계 */}
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-yellow-400">
                  {summary.avg_overall_rating?.toFixed(1) || '0.0'}
                </div>
                <div className="text-sm text-gray-400">전체 평점</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {summary.total_reviews}
                </div>
                <div className="text-sm text-gray-400">총 리뷰</div>
              </div>
            </div>
            
            {/* 별점 시각화 */}
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`text-2xl ${
                    star <= Math.round(summary.avg_overall_rating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-600'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            
            <div className="text-sm text-gray-400">
              {summary.unique_reviewers}명이 평가 · {summary.total_helpful_votes}개의 도움됨
            </div>
          </div>
        </div>

        {/* 카테고리별 평점 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            카테고리별 평점
          </h4>
          <RatingBar label="보컬 실력" value={summary.avg_vocal_rating} />
          <RatingBar label="감정 전달" value={summary.avg_emotion_rating} />
          <RatingBar label="편곡/해석" value={summary.avg_arrangement_rating} />
          <RatingBar label="영상 퀄리티" value={summary.avg_quality_rating} />
        </div>
      </div>

      {/* 평점 분포 차트 */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          평가 인사이트
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-700/50 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">가장 높은 평가</div>
            <div className="text-sm font-semibold text-green-400">
              {(() => {
                const ratings = {
                  '보컬': summary.avg_vocal_rating || 0,
                  '감정': summary.avg_emotion_rating || 0,
                  '편곡': summary.avg_arrangement_rating || 0,
                  '영상': summary.avg_quality_rating || 0
                }
                const highest = Object.entries(ratings).reduce((a, b) => 
                  ratings[a[0]] > ratings[b[0]] ? a : b
                )
                return highest[0]
              })()}
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-700/50 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">개선 필요</div>
            <div className="text-sm font-semibold text-orange-400">
              {(() => {
                const ratings = {
                  '보컬': summary.avg_vocal_rating || 0,
                  '감정': summary.avg_emotion_rating || 0,
                  '편곡': summary.avg_arrangement_rating || 0,
                  '영상': summary.avg_quality_rating || 0
                }
                const lowest = Object.entries(ratings).reduce((a, b) => 
                  ratings[a[0]] < ratings[b[0]] ? a : b
                )
                return lowest[0]
              })()}
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-700/50 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">평가 참여율</div>
            <div className="text-sm font-semibold text-blue-400">
              {summary.unique_reviewers > 10 ? '높음' : summary.unique_reviewers > 5 ? '보통' : '낮음'}
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-700/50 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">신뢰도</div>
            <div className="text-sm font-semibold text-purple-400">
              {summary.total_helpful_votes > 20 ? '매우 높음' : summary.total_helpful_votes > 10 ? '높음' : '보통'}
            </div>
          </div>
        </div>
      </div>

      {/* TOP 리뷰어 */}
      {topReviewers.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            TOP 리뷰어
          </h4>
          <div className="flex gap-2 flex-wrap">
            {topReviewers.slice(0, 3).map((reviewer, index) => {
              const userName = reviewer.user?.raw_user_meta_data?.name || 
                              reviewer.user?.email?.split('@')[0] || 'Anonymous'
              return (
                <div key={reviewer.user_id} className="flex items-center gap-2 px-3 py-1 bg-gray-700/50 rounded-full">
                  <span className="text-xs font-bold text-yellow-400">#{index + 1}</span>
                  <span className="text-sm text-white">{userName}</span>
                  <span className="text-xs text-gray-400">({reviewer.total_reviews} 리뷰)</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}