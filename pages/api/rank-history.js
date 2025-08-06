import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      // 순위 히스토리 업데이트 (관리자 전용)
      return updateRankHistory(req, res);
    
    case 'GET':
      // 순위 히스토리 조회
      return getRankHistory(req, res);
    
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function updateRankHistory(req, res) {
  try {
    // 관리자 권한 확인
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 관리자 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // 현재 활성 competition 찾기
    const { data: competition } = await supabase
      .from('coversong_competitions')
      .select('id')
      .eq('status', 'active')
      .single();

    if (!competition) {
      return res.status(404).json({ message: 'No active competition found' });
    }

    // 순위 업데이트 실행
    const { error: updateError } = await supabase.rpc('daily_rank_update');

    if (updateError) {
      console.error('순위 업데이트 오류:', updateError);
      return res.status(500).json({ message: 'Failed to update ranks', error: updateError.message });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Rank history updated successfully',
      competition_id: competition.id
    });

  } catch (error) {
    console.error('순위 히스토리 업데이트 오류:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function getRankHistory(req, res) {
  try {
    const { video_id, competition_id, period_type, days = 7 } = req.query;

    if (!video_id || !competition_id) {
      return res.status(400).json({ message: 'video_id and competition_id are required' });
    }

    // 순위 히스토리 조회
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const { data: history, error: historyError } = await supabase
      .from('coversong_rank_history')
      .select('*')
      .eq('video_id', video_id)
      .eq('competition_id', competition_id)
      .gte('recorded_date', startDate.toISOString().split('T')[0])
      .lte('recorded_date', endDate.toISOString().split('T')[0])
      .order('recorded_date', { ascending: true });

    if (historyError) {
      console.error('히스토리 조회 오류:', historyError);
      return res.status(500).json({ message: 'Failed to fetch history', error: historyError.message });
    }

    // 기간별 변동 조회
    let changes = null;
    if (period_type) {
      const { data: changeData, error: changeError } = await supabase
        .from('coversong_rank_changes')
        .select('*')
        .eq('video_id', video_id)
        .eq('competition_id', competition_id)
        .eq('period_type', period_type)
        .order('period_end', { ascending: false })
        .limit(1);

      if (!changeError && changeData) {
        changes = changeData[0];
      }
    }

    return res.status(200).json({
      success: true,
      history,
      changes,
      video_id,
      competition_id
    });

  } catch (error) {
    console.error('순위 히스토리 조회 오류:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}