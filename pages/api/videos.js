import { supabase, supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { topic, page = 1, limit = 20 } = req.query; // page, limit 추가
    if (!topic) {
      return res.status(400).json({ message: 'Topic parameter is required' });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    // Service role client 사용 (RLS 우회)
    const dbClient = supabaseAdmin || supabase;

    // 먼저 차단된 영상 목록 가져오기 (RLS 우회)
    const { data: blockedVideos } = await dbClient
      .from('coversong_blocked_videos')
      .select('youtube_id')
      .eq('is_active', true);
    
    const blockedIds = blockedVideos ? blockedVideos.map(v => v.youtube_id) : [];

    // DB에서 해당 topic의 영상 가져오기 (차단된 영상 제외, 페이지네이션 적용)
    let query = supabase
      .from('coversong_videos')
      .select('*', { count: 'exact' }) // count: 'exact'로 전체 개수도 함께 조회
      .eq('topic', topic);
    
    // 차단된 영상이 있으면 필터링
    if (blockedIds.length > 0) {
      query = query.not('youtube_id', 'in', `(${blockedIds.map(id => `"${id}"`).join(',')})`);
    }
    
    const { data: videos, error, count } = await query
      .order('arena_likes', { ascending: false })
      .range(from, to); // 여기서 페이지네이션 적용

    if (error) {
      return res.status(500).json({ message: 'DB fetch error', error: error.message });
    }

    res.status(200).json({
      success: true,
      videos,
      total: count, // 전체 아이템 수
      page: pageNum,
      totalPages: Math.ceil(count / limitNum),
      topic,
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
} 