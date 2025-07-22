import { supabase } from '../../lib/supabase';

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

    // DB에서 해당 topic의 영상 가져오기 (페이지네이션 적용)
    const { data: videos, error, count } = await supabase
      .from('coversong_videos')
      .select('*', { count: 'exact' }) // count: 'exact'로 전체 개수도 함께 조회
      .eq('topic', topic)
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