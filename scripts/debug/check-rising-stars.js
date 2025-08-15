import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRisingStars() {
  // 1. 최신 날짜 확인
  const { data: latestDate } = await supabase
    .from('coversong_rising_stars')
    .select('recorded_date')
    .eq('competition_id', 5)
    .order('recorded_date', { ascending: false })
    .limit(1)
    .single();
  
  const targetDate = latestDate?.recorded_date || new Date().toISOString().split('T')[0];
  console.log('Target date:', targetDate);

  // 2. 신규 진입 영상들 확인
  console.log('\n=== New Entry Videos in rising_stars ===');
  const { data: newEntries, error } = await supabase
    .from('coversong_rising_stars')
    .select('*')
    .eq('competition_id', 5)
    .eq('recorded_date', targetDate)
    .eq('category', 'new_entry')
    .order('rank_position', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${newEntries?.length || 0} new entry videos`);
  
  if (newEntries) {
    for (const entry of newEntries) {
      console.log(`\nRank Position ${entry.rank_position}:`);
      console.log(`  Title: ${entry.video_title}`);
      console.log(`  Video ID: ${entry.video_id}`);
      console.log(`  End Rank: ${entry.end_rank}`);
      
      // 실제 현재 랭킹 확인
      const { data: currentVideo } = await supabase
        .from('coversong_videos')
        .select('rank, youtube_id, title')
        .eq('youtube_id', entry.video_id)
        .eq('competition_id', 5)
        .single();
      
      if (currentVideo) {
        console.log(`  Current Actual Rank: ${currentVideo.rank}`);
        if (currentVideo.rank !== entry.end_rank) {
          console.log(`  ⚠️  MISMATCH: end_rank(${entry.end_rank}) != actual rank(${currentVideo.rank})`);
        }
      } else {
        console.log(`  ⚠️  Video not found in current rankings`);
      }
    }
  }

  // 3. 블럭된 영상 확인
  console.log('\n=== Check if any are blocked ===');
  const { data: blockedVideos } = await supabase
    .from('coversong_blocked_videos')
    .select('youtube_id')
    .eq('is_active', true);
  
  const blockedIds = blockedVideos?.map(v => v.youtube_id) || [];
  
  if (newEntries) {
    for (const entry of newEntries) {
      if (blockedIds.includes(entry.video_id)) {
        console.log(`🚫 ${entry.video_title} is BLOCKED but in rising_stars!`);
      }
    }
  }

  process.exit(0);
}

checkRisingStars().catch(console.error);