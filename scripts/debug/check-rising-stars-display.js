import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRisingStarsDisplay() {
  // 1. rising_stars 데이터 확인
  const { data: risingStars } = await supabase
    .from('coversong_rising_stars')
    .select('*')
    .eq('competition_id', 5)
    .eq('recorded_date', '2025-08-10')
    .order('category')
    .order('rank_position');

  console.log('\n=== Rising Stars Table Data ===');
  risingStars?.forEach(star => {
    console.log(`${star.category} Position ${star.rank_position}:`);
    console.log(`  Video: ${star.video_title}`);
    console.log(`  Video ID: ${star.video_id}`);
    console.log(`  End Rank: ${star.end_rank}`);
    console.log(`  Rank Change: ${star.rank_change || 'N/A'}`);
  });

  // 2. 실제 현재 영상들 확인 (블럭 제외)
  const { data: blockedVideos } = await supabase
    .from('coversong_blocked_videos')
    .select('youtube_id')
    .eq('is_active', true);
  
  const blockedIds = blockedVideos?.map(v => v.youtube_id) || [];
  
  console.log('\n=== Blocked Videos Count ===');
  console.log(`Total blocked: ${blockedIds.length}`);

  // 3. 블럭되지 않은 영상들만 가져오기
  const { data: allVideos } = await supabase
    .from('coversong_videos')
    .select('*')
    .eq('competition_id', 5)
    .order('rank', { ascending: true });

  const unblockedVideos = allVideos?.filter(v => !blockedIds.includes(v.youtube_id)) || [];
  
  console.log('\n=== Top 10 Unblocked Videos ===');
  unblockedVideos.slice(0, 10).forEach((v, i) => {
    console.log(`Real Rank ${i+1}: ${v.title.substring(0, 50)}...`);
    console.log(`  Original DB Rank: ${v.rank}`);
    console.log(`  Previous Rank: ${v.previous_rank}`);
    if (v.previous_rank === null) {
      console.log(`  -> NEW ENTRY`);
    }
  });

  // 4. rising_stars의 영상들이 실제로 어디에 있는지 확인
  console.log('\n=== Rising Stars Actual Positions ===');
  if (risingStars) {
    for (const star of risingStars) {
      const actualVideo = unblockedVideos.find(v => v.youtube_id === star.video_id || v.id === star.video_id);
      if (actualVideo) {
        const realRank = unblockedVideos.indexOf(actualVideo) + 1;
        console.log(`${star.category} #${star.rank_position}: "${star.video_title.substring(0, 30)}..."`);
        console.log(`  Rising Stars end_rank: ${star.end_rank}`);
        console.log(`  Actual unblocked rank: ${realRank}`);
        if (star.end_rank !== realRank) {
          console.log(`  ⚠️ MISMATCH: Should be ${realRank}, not ${star.end_rank}`);
        }
      } else {
        console.log(`${star.category} #${star.rank_position}: NOT FOUND in current videos`);
      }
    }
  }

  process.exit(0);
}

checkRisingStarsDisplay().catch(console.error);