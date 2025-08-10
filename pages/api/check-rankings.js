import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('coversong_videos')
      .select('rank, id, title, site_score, candidate_score, arena_likes, guest_likes')
      .eq('competition_id', 5)
      .order('rank', { ascending: true })
      .limit(10);

    if (error) throw error;

    res.status(200).json({ 
      success: true,
      message: '현재 TOP 10 순위',
      data: data.map((v, idx) => ({
        ...v,
        expected_rank: idx + 1,
        rank_match: v.rank === idx + 1 ? '✅' : '❌'
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}