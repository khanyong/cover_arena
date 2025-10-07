import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // 실시간 통계 (최근 24시간) - 직접 계산
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { data: last24hVisits, error: realtimeError } = await supabase
      .from('coversong_page_visits')
      .select('visitor_fingerprint, created_at')
      .gte('created_at', twentyFourHoursAgo)

    if (realtimeError) throw realtimeError

    // JavaScript로 실시간 통계 계산
    const visits_24h = last24hVisits?.length || 0
    const unique_visitors_24h = new Set(last24hVisits?.map(v => v.visitor_fingerprint)).size || 0
    const visits_1h = last24hVisits?.filter(v => v.created_at >= oneHourAgo).length || 0
    
    // 전체 방문자 수 계산
    const { data: allVisits, error: totalError } = await supabase
      .from('coversong_page_visits')
      .select('visitor_fingerprint', { count: 'exact' })

    if (totalError) throw totalError

    const total_visits = allVisits?.length || 0
    const total_unique_visitors = new Set(allVisits?.map(v => v.visitor_fingerprint)).size || 0

    const realtimeStats = {
      visits_24h,
      unique_visitors_24h,
      visits_1h,
      total_visits,
      total_unique_visitors
    }

    // 일일 통계 (최근 30일) - 직접 계산
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    
    const { data: last30dVisits, error: dailyError } = await supabase
      .from('coversong_page_visits')
      .select('visit_date, visitor_fingerprint, page_path')
      .gte('created_at', thirtyDaysAgo)

    if (dailyError) throw dailyError

    // JavaScript로 일일 통계 계산
    const dailyCount = {}
    last30dVisits?.forEach(visit => {
      const date = visit.visit_date
      if (!dailyCount[date]) {
        dailyCount[date] = {
          visit_date: date,
          total_visits: 0,
          unique_visitors: new Set(),
          pages_visited: new Set()
        }
      }
      dailyCount[date].total_visits++
      dailyCount[date].unique_visitors.add(visit.visitor_fingerprint)
      dailyCount[date].pages_visited.add(visit.page_path)
    })

    const dailyStats = Object.values(dailyCount)
      .map(day => ({
        visit_date: day.visit_date,
        total_visits: day.total_visits,
        unique_visitors: day.unique_visitors.size,
        pages_visited: day.pages_visited.size
      }))
      .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))
      .slice(0, 30)

    // 인기 페이지 (최근 7일) - 단순 조회 후 JavaScript로 집계
    const { data: recentVisits, error: pagesError } = await supabase
      .from('coversong_page_visits')
      .select('page_path')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .not('page_path', 'eq', '/api/track-visitor') // API 호출 제외

    if (pagesError) throw pagesError

    // JavaScript로 페이지별 방문 수 집계
    const pageCount = {}
    recentVisits?.forEach(visit => {
      pageCount[visit.page_path] = (pageCount[visit.page_path] || 0) + 1
    })

    // 상위 10개 페이지 선택
    const popularPages = Object.entries(pageCount)
      .map(([page_path, count]) => ({ page_path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    res.status(200).json({
      realtime: realtimeStats,
      daily: dailyStats,
      popularPages: popularPages
    })
  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
}
