import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getVideoReviews } from '../lib/reviewApi'

export default function VerifyReviews() {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(true)
  const [testVideoId, setTestVideoId] = useState(null)

  useEffect(() => {
    verifyReviewSystem()
  }, [])

  const verifyReviewSystem = async () => {
    const testResults = {}

    // Step 1: Get a real video from the database
    try {
      const { data: videos, error } = await supabase
        .from('coversong_videos')
        .select('youtube_id, title')
        .limit(1)
      
      if (videos && videos.length > 0) {
        const videoId = videos[0].youtube_id
        setTestVideoId(videoId)
        
        testResults.testVideo = {
          success: true,
          videoId: videoId,
          title: videos[0].title
        }

        // Step 2: Check if this video has reviews
        const { data: reviews, error: reviewError } = await supabase
          .from('coversong_reviews')
          .select('*')
          .eq('video_id', videoId)
        
        testResults.directReviewQuery = {
          success: !reviewError,
          count: reviews?.length || 0,
          reviews: reviews,
          error: reviewError?.message
        }

        // Step 3: Test the API function
        try {
          const apiReviews = await getVideoReviews(videoId)
          testResults.apiFunction = {
            success: true,
            count: apiReviews.length,
            reviews: apiReviews
          }
        } catch (apiError) {
          testResults.apiFunction = {
            success: false,
            error: apiError.message
          }
        }
      }
    } catch (e) {
      testResults.testVideo = { success: false, error: e.message }
    }

    // Step 4: Check total reviews in database
    try {
      const { data, count, error } = await supabase
        .from('coversong_reviews')
        .select('*', { count: 'exact', head: true })
      
      testResults.totalReviews = {
        success: !error,
        count: count,
        error: error?.message
      }
    } catch (e) {
      testResults.totalReviews = { success: false, error: e.message }
    }

    // Step 5: Check distinct video_ids that have reviews
    try {
      const { data, error } = await supabase
        .from('coversong_reviews')
        .select('video_id')
      
      const uniqueIds = [...new Set(data?.map(r => r.video_id) || [])]
      
      testResults.videosWithReviews = {
        success: !error,
        count: uniqueIds.length,
        sampleIds: uniqueIds.slice(0, 5),
        error: error?.message
      }
    } catch (e) {
      testResults.videosWithReviews = { success: false, error: e.message }
    }

    setResults(testResults)
    setLoading(false)
  }

  const testSpecificVideo = async (videoId) => {
    setLoading(true)
    const testResults = { ...results }

    try {
      // Direct query
      const { data: reviews, error } = await supabase
        .from('coversong_reviews')
        .select('*')
        .eq('video_id', videoId)
      
      testResults.specificVideoTest = {
        success: !error,
        videoId: videoId,
        reviewCount: reviews?.length || 0,
        reviews: reviews,
        error: error?.message
      }

      // API function test
      try {
        const apiReviews = await getVideoReviews(videoId)
        testResults.specificVideoApi = {
          success: true,
          count: apiReviews.length,
          reviews: apiReviews
        }
      } catch (apiError) {
        testResults.specificVideoApi = {
          success: false,
          error: apiError.message
        }
      }
    } catch (e) {
      testResults.specificVideoTest = { success: false, error: e.message }
    }

    setResults(testResults)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="text-center">Verifying review system...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Review System Verification</h1>
      
      {testVideoId && (
        <div className="mb-8 p-4 bg-blue-900 rounded">
          <h2 className="text-xl font-bold mb-2">Test Video</h2>
          <p>Video ID: {testVideoId}</p>
          <button
            onClick={() => testSpecificVideo(testVideoId)}
            className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Re-test This Video
          </button>
        </div>
      )}
      
      {Object.entries(results).map(([testName, result]) => (
        <div key={testName} className="mb-8 p-4 bg-gray-800 rounded">
          <h2 className="text-xl font-bold mb-2">
            {testName}: {result.success ? '✅ Success' : '❌ Failed'}
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
          
          {result.videoId && (
            <div className="text-green-400 mb-2">
              Video ID: {result.videoId}
            </div>
          )}
          
          {(result.reviews || result.data || result.sampleIds) && (
            <details className="mt-2">
              <summary className="cursor-pointer text-gray-400">View Details</summary>
              <pre className="mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto">
                {JSON.stringify(result.reviews || result.data || result, null, 2)}
              </pre>
            </details>
          )}
        </div>
      ))}
      
      <div className="mt-8 space-y-4">
        <div>
          <h3 className="text-lg font-bold mb-2">Test Specific Video ID</h3>
          <input
            type="text"
            placeholder="Enter YouTube video ID"
            className="px-4 py-2 bg-gray-700 text-white rounded mr-2"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                testSpecificVideo(e.target.value)
              }
            }}
          />
        </div>
        
        <div className="space-x-4">
          <button
            onClick={verifyReviewSystem}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Re-run All Tests
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}