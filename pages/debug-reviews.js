import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function DebugReviews() {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    runDebugQueries()
  }, [])

  const runDebugQueries = async () => {
    const debugResults = {}

    // 1. Check total reviews
    try {
      const { data, count, error } = await supabase
        .from('coversong_reviews')
        .select('*', { count: 'exact', head: false })
        .limit(10)
      
      debugResults.totalReviews = {
        success: !error,
        count: count,
        sample: data,
        error: error?.message
      }
    } catch (e) {
      debugResults.totalReviews = { success: false, error: e.message }
    }

    // 2. Check unique video IDs in reviews
    try {
      const { data, error } = await supabase
        .from('coversong_reviews')
        .select('video_id')
      
      const uniqueVideoIds = [...new Set(data?.map(r => r.video_id) || [])]
      
      debugResults.uniqueVideoIds = {
        success: !error,
        count: uniqueVideoIds.length,
        ids: uniqueVideoIds.slice(0, 5),
        error: error?.message
      }
    } catch (e) {
      debugResults.uniqueVideoIds = { success: false, error: e.message }
    }

    // 3. Check if video IDs match youtube_id in coversong_videos
    try {
      const { data: videos, error } = await supabase
        .from('coversong_videos')
        .select('youtube_id, title')
        .limit(5)
      
      debugResults.sampleVideos = {
        success: !error,
        data: videos,
        error: error?.message
      }
    } catch (e) {
      debugResults.sampleVideos = { success: false, error: e.message }
    }

    // 4. Try to match a specific review with video
    try {
      const { data: review, error: reviewError } = await supabase
        .from('coversong_reviews')
        .select('*')
        .limit(1)
        .single()
      
      if (review) {
        const { data: video, error: videoError } = await supabase
          .from('coversong_videos')
          .select('*')
          .eq('youtube_id', review.video_id)
          .single()
        
        debugResults.matchTest = {
          success: !reviewError && !videoError,
          review: review,
          video: video,
          reviewError: reviewError?.message,
          videoError: videoError?.message
        }
      }
    } catch (e) {
      debugResults.matchTest = { success: false, error: e.message }
    }

    // 5. Check profiles for review users
    try {
      const { data: reviews, error: reviewError } = await supabase
        .from('coversong_reviews')
        .select('user_id')
        .limit(5)
      
      if (reviews && reviews.length > 0) {
        const userIds = reviews.map(r => r.user_id)
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, email')
          .in('id', userIds)
        
        debugResults.profileMatch = {
          success: !profileError,
          reviewUserIds: userIds,
          profiles: profiles,
          error: profileError?.message
        }
      }
    } catch (e) {
      debugResults.profileMatch = { success: false, error: e.message }
    }

    // 6. Direct query for a known video
    try {
      const { data: videos, error } = await supabase
        .from('coversong_videos')
        .select('youtube_id')
        .limit(1)
      
      if (videos && videos.length > 0) {
        const videoId = videos[0].youtube_id
        const { data: reviews, error: reviewError } = await supabase
          .from('coversong_reviews')
          .select('*')
          .eq('video_id', videoId)
        
        debugResults.directVideoReviews = {
          success: !reviewError,
          videoId: videoId,
          reviewCount: reviews?.length || 0,
          reviews: reviews,
          error: reviewError?.message
        }
      }
    } catch (e) {
      debugResults.directVideoReviews = { success: false, error: e.message }
    }

    setResults(debugResults)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="text-center">Running debug queries...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Review System Debug</h1>
      
      {Object.entries(results).map(([queryName, result]) => (
        <div key={queryName} className="mb-8 p-4 bg-gray-800 rounded">
          <h2 className="text-xl font-bold mb-2">
            {queryName}: {result.success ? '✅' : '❌'}
          </h2>
          
          {result.error && (
            <div className="text-red-400 mb-2">
              Error: {result.error}
            </div>
          )}
          
          {result.count !== undefined && (
            <div className="text-blue-400 mb-2">
              Count: {result.count}
            </div>
          )}
          
          {result.data && (
            <details className="mt-2">
              <summary className="cursor-pointer text-gray-400">View Data</summary>
              <pre className="mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto">
                {JSON.stringify(result.data || result, null, 2)}
              </pre>
            </details>
          )}
        </div>
      ))}
      
      <div className="mt-8 space-x-4">
        <button
          onClick={runDebugQueries}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Re-run Debug Queries
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}