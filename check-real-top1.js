import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRealTop1() {
  console.log('=== 1. Current Real TOP 5 ===');
  const { data: top5, error: topError } = await supabase
    .from('coversong_videos')
    .select('rank, id, title, score, previous_rank')
    .eq('competition_id', 5)
    .order('rank', { ascending: true })
    .limit(5);

  if (topError) {
    console.error('Error fetching top 5:', topError);
    return;
  }

  top5.forEach(video => {
    const type = video.previous_rank === null ? '🆕 New Entry' : 'Existing';
    console.log(`Rank ${video.rank}: ${video.title} (Score: ${video.score}) - ${type}`);
  });

  console.log('\n=== 2. New Entry Videos in TOP 5 ===');
  const { data: newEntries, error: newError } = await supabase
    .from('coversong_videos')
    .select('rank, id, title, score')
    .eq('competition_id', 5)
    .is('previous_rank', null)
    .order('rank', { ascending: true })
    .limit(5);

  if (newError) {
    console.error('Error fetching new entries:', newError);
    return;
  }

  newEntries.forEach(video => {
    console.log(`Rank ${video.rank}: ${video.title} (Score: ${video.score})`);
  });

  console.log('\n=== 3. Rising Stars Table (New Entries) ===');
  const { data: risingStars, error: rsError } = await supabase
    .from('coversong_rising_stars')
    .select('rank_position, video_id, video_title, end_rank')
    .eq('competition_id', 5)
    .eq('recorded_date', '2025-08-06')
    .eq('category', 'new_entry')
    .order('rank_position', { ascending: true });

  if (rsError) {
    console.error('Error fetching rising stars:', rsError);
    return;
  }

  risingStars.forEach(star => {
    console.log(`New Entry Position ${star.rank_position}: ${star.video_title} (Overall Rank: ${star.end_rank})`);
  });

  process.exit(0);
}

checkRealTop1().catch(console.error);