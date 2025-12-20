import { useState, useEffect } from 'react'
import { supabase } from '../shared/lib/supabase'

export default function ReviewStats() {
  const [stats, setStats] = useState({
    totalReviews: 0,
    videosWithReviews: 0,
    avgRating: 0,
    topVideos: [],
    ratingDistribution: [],
    recentReviews: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // 전체 통계
      const { data: reviewStats } = await supabase
        .from('coversong_reviews')
        .select('overall_rating')
      
      const totalReviews = reviewStats?.length || 0
      const avgRating = reviewStats?.length 
        ? (reviewStats.reduce((sum, r) => sum + r.overall_rating, 0) / reviewStats.length).toFixed(2)
        : 0

      // 리뷰가 있는 영상 수
      const { data: videosData } = await supabase
        .from('coversong_reviews')
        .select('video_id')
      
      const uniqueVideos = [...new Set(videosData?.map(r => r.video_id) || [])]
      
      // 상위 영상 (리뷰가 많은 순)
      const { data: topVideosData } = await supabase
        .from('coversong_reviews')
        .select(`
          video_id,
          overall_rating,
          coversong_videos!inner(
            title,
            channel,
            youtube_id,
            site_score
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      // 영상별로 그룹화
      const videoGroups = {}
      topVideosData?.forEach(review => {
        const videoId = review.video_id
        if (!videoGroups[videoId]) {
          videoGroups[videoId] = {
            ...review.coversong_videos,
            reviews: [],
            totalRating: 0,
            count: 0
          }
        }
        videoGroups[videoId].reviews.push(review.overall_rating)
        videoGroups[videoId].totalRating += review.overall_rating
        videoGroups[videoId].count++
      })

      const topVideos = Object.values(videoGroups)
        .map(video => ({
          ...video,
          avgRating: (video.totalRating / video.count).toFixed(2)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // 평점 분포
      const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      reviewStats?.forEach(r => {
        ratingCounts[r.overall_rating]++
      })
      
      const ratingDistribution = Object.entries(ratingCounts).map(([rating, count]) => ({
        rating: parseInt(rating),
        count,
        percentage: totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(1) : 0
      }))

      // 최근 리뷰
      const { data: recentReviewsData } = await supabase
        .from('coversong_reviews')
        .select(`
          *,
          coversong_videos!inner(
            title,
            channel
          ),
          profiles!inner(
            username,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      const recentReviews = recentReviewsData?.map(r => ({
        ...r,
        videoTitle: r.coversong_videos.title,
        channel: r.coversong_videos.channel,
        reviewer: r.profiles.username || r.profiles.email?.split('@')[0] || 'Anonymous'
      })) || []

      setStats({
        totalReviews,
        videosWithReviews: uniqueVideos.length,
        avgRating,
        topVideos,
        ratingDistribution,
        recentReviews
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">📊 리뷰 시스템 통계</h1>
        
        {/* 전체 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-lg p-6 border border-blue-700/30">
            <div className="text-3xl font-bold text-blue-400">{stats.totalReviews}</div>
            <div className="text-gray-300">전체 리뷰 수</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-lg p-6 border border-green-700/30">
            <div className="text-3xl font-bold text-green-400">{stats.videosWithReviews}</div>
            <div className="text-gray-300">리뷰가 있는 영상</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-lg p-6 border border-yellow-700/30">
            <div className="text-3xl font-bold text-yellow-400">⭐ {stats.avgRating}</div>
            <div className="text-gray-300">평균 평점</div>
          </div>
        </div>

        {/* 평점 분포 */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">평점 분포</h2>
          <div className="space-y-2">
            {stats.ratingDistribution.sort((a, b) => b.rating - a.rating).map(item => (
              <div key={item.rating} className="flex items-center gap-3">
                <div className="w-20 text-yellow-400">
                  {'⭐'.repeat(item.rating)}
                </div>
                <div className="flex-1 bg-gray-700 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                  <span className="absolute left-2 top-0 h-full flex items-center text-xs text-white font-semibold">
                    {item.count}개 ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 리뷰가 많은 영상 TOP 10 */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">리뷰가 많은 영상 TOP 10</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2">순위</th>
                  <th className="text-left p-2">제목</th>
                  <th className="text-left p-2">채널</th>
                  <th className="text-center p-2">리뷰 수</th>
                  <th className="text-center p-2">평균 평점</th>
                  <th className="text-center p-2">YouTube ID</th>
                </tr>
              </thead>
              <tbody>
                {stats.topVideos.map((video, index) => (
                  <tr key={video.youtube_id} className="border-b border-gray-700/50">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2 text-blue-400">{video.title}</td>
                    <td className="p-2 text-gray-400">{video.channel}</td>
                    <td className="p-2 text-center">{video.count}</td>
                    <td className="p-2 text-center text-yellow-400">⭐ {video.avgRating}</td>
                    <td className="p-2 text-center">
                      <a 
                        href={`https://youtube.com/watch?v=${video.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300"
                      >
                        {video.youtube_id}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 최근 리뷰 */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">최근 작성된 리뷰</h2>
          <div className="space-y-4">
            {stats.recentReviews.map(review => (
              <div key={review.id} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-blue-400">{review.videoTitle}</div>
                    <div className="text-sm text-gray-400">by {review.reviewer}</div>
                  </div>
                  <div className="text-yellow-400">⭐ {review.overall_rating}</div>
                </div>
                {review.review_text && (
                  <p className="text-gray-300 text-sm">{review.review_text}</p>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(review.created_at).toLocaleDateString('ko-KR')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 돌아가기 버튼 */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            메인 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
