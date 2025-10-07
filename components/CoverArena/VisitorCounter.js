import { useState, useEffect } from 'react'

export default function VisitorCounter() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 페이지 방문 추적
    const trackVisit = async () => {
      try {
        await fetch('/api/track-visitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_path: window.location.pathname,
            referrer: document.referrer
          })
        })
      } catch (error) {
        console.error('방문 추적 실패:', error)
      }
    }

    // 통계 가져오기
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/visitor-stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('통계 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    trackVisit()
    fetchStats()

    // 5분마다 통계 업데이트
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !stats) {
    return (
      <div className="text-sm text-gray-500">
        📊 방문자 통계 로딩중...
      </div>
    )
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-600 shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-3xl">📊</span>
        <div>
          <h3 className="text-xl font-bold text-white">실시간 방문자 통계</h3>
          <p className="text-gray-300 text-sm">사이트 방문 현황</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* 24시간 방문 */}
        <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-lg py-4 flex flex-col items-center justify-center border border-blue-700/30 shadow-lg">
          <div className="text-2xl font-bold text-white mb-1">
            {stats.realtime?.visits_24h || 0}
          </div>
          <div className="text-gray-300 text-xs text-center">24시간 방문</div>
        </div>
        
        {/* 최근 1시간 */}
        <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-lg py-4 flex flex-col items-center justify-center border border-orange-700/30 shadow-lg">
          <div className="text-2xl font-bold text-white mb-1">
            {stats.realtime?.visits_1h || 0}
          </div>
          <div className="text-gray-300 text-xs text-center">최근 1시간</div>
        </div>

        {/* 순 방문자 (24시간) */}
        <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-sm rounded-lg py-4 flex flex-col items-center justify-center border border-emerald-700/30 shadow-lg">
          <div className="text-2xl font-bold text-white mb-1">
            {stats.realtime?.unique_visitors_24h || 0}
          </div>
          <div className="text-gray-300 text-xs text-center">순 방문자<br/>(24시간)</div>
        </div>

        {/* 총 방문자 */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg py-4 flex flex-col items-center justify-center border border-purple-700/30 shadow-lg">
          <div className="text-2xl font-bold text-white mb-1">
            {stats.realtime?.total_unique_visitors || 0}
          </div>
          <div className="text-gray-300 text-xs text-center">총 순방문자<br/>(전체 기간)</div>
        </div>
      </div>
      
      {/* 추가 통계 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white bg-opacity-5 rounded-lg p-3 border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">총 방문 횟수</span>
            <span className="text-white font-bold">{stats.realtime?.total_visits?.toLocaleString() || 0}</span>
          </div>
        </div>
        <div className="bg-white bg-opacity-5 rounded-lg p-3 border border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">방문당 평균 페이지뷰</span>
            <span className="text-white font-bold">
              {stats.realtime?.total_visits && stats.realtime?.total_unique_visitors 
                ? (stats.realtime.total_visits / stats.realtime.total_unique_visitors).toFixed(1)
                : '0'
              }
            </span>
          </div>
        </div>
      </div>

      {stats.popularPages && stats.popularPages.length > 0 && (
        <div className="bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <span className="mr-2">🔥</span>
            인기 페이지 (최근 7일)
          </h4>
          <div className="space-y-2">
            {stats.popularPages.slice(0, 3).map((page, index) => (
              <div 
                key={page.page_path} 
                className="flex justify-between items-center p-2 bg-white bg-opacity-5 rounded hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 font-bold text-sm">#{index + 1}</span>
                  <span className="text-gray-300 text-sm truncate">{page.page_path}</span>
                </div>
                <span className="text-white font-bold text-sm">{page.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
