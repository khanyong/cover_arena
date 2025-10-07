import { supabaseAdmin, supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Service role client 사용 (RLS 우회) 또는 일반 client 사용
    const dbClient = supabaseAdmin || supabase;
    
    // 차단된 영상 목록 가져오기
    const { data: blockedVideos, error: videosError } = await dbClient
      .from('coversong_blocked_videos')
      .select('youtube_id')
      .eq('is_active', true);
    
    // 차단된 채널 목록 가져오기
    const { data: blockedChannels, error: channelsError } = await dbClient
      .from('coversong_blocked_channels')
      .select('channel_name')
      .eq('is_active', true);
    
    if (videosError) {
      console.error('Error fetching blocked videos:', videosError);
    }
    
    if (channelsError) {
      console.error('Error fetching blocked channels:', channelsError);
    }
    
    const blockedIds = blockedVideos ? blockedVideos.map(v => v.youtube_id) : [];
    const blockedChannelNames = blockedChannels ? blockedChannels.map(c => c.channel_name) : [];
    
    res.status(200).json({ 
      blockedIds,
      blockedChannels: blockedChannelNames 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(200).json({ blockedIds: [], blockedChannels: [] }); // 에러 시에도 빈 배열 반환
  }
}