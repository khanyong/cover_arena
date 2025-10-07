import { supabase, supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { competition_id = 5 } = req.query;
    
    // Use service role client to bypass RLS
    const dbClient = supabaseAdmin || supabase;

    // Query for top 5 videos in competition_id 5
    const { data: topVideos, error } = await dbClient
      .from('coversong_videos')
      .select('rank, title, site_score, score, previous_rank, id')
      .eq('competition_id', competition_id)
      .order('rank', { ascending: true })
      .limit(5);

    if (error) {
      return res.status(500).json({ message: 'DB query error', error: error.message });
    }

    res.status(200).json({
      success: true,
      competition_id,
      topVideos,
      count: topVideos.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}