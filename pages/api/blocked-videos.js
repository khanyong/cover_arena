import { supabaseAdmin, supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Service role client 사용 (RLS 우회) 또는 일반 client 사용
    const dbClient = supabaseAdmin || supabase;
    
    // 차단된 영상 목록 가져오기
    const { data: blockedVideos, error } = await dbClient
      .from('coversong_blocked_videos')
      .select('youtube_id')
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching blocked videos:', error);
      return res.status(200).json({ blockedIds: [] }); // 에러 시 빈 배열 반환
    }
    
    const blockedIds = blockedVideos ? blockedVideos.map(v => v.youtube_id) : [];
    
    res.status(200).json({ blockedIds });
  } catch (error) {
    console.error('Server error:', error);
    res.status(200).json({ blockedIds: [] }); // 에러 시에도 빈 배열 반환
  }
}