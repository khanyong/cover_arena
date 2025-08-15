import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getRealRankings() {
  // 1. 블럭된 영상 목록 가져오기
  const { data: blockedVideos, error: blockedError } = await supabase
    .from('coversong_blocked_videos')
    .select('youtube_id')
    .eq('is_active', true);

  if (blockedError) {
    console.error('Error fetching blocked videos:', blockedError);
    return;
  }

  const blockedIds = blockedVideos.map(v => v.youtube_id);
  console.log(`\nTotal blocked videos: ${blockedIds.length}\n`);

  // 2. 블럭되지 않은 영상들의 실제 TOP 10
  console.log('=== REAL TOP 10 (Excluding Blocked Videos) ===\n');
  
  // 모든 영상 가져와서 필터링 (SQL NOT IN이 안되는 경우)
  const { data: allVideos, error: allError } = await supabase
    .from('coversong_videos')
    .select('rank, youtube_id, title, score, channel, site_score')
    .eq('competition_id', 5)
    .order('score', { ascending: false });

  if (allError) {
    console.error('Error fetching videos:', allError);
    return;
  }

  // 블럭되지 않은 영상만 필터링
  const unblockedVideos = allVideos.filter(v => !blockedIds.includes(v.youtube_id));
  const top10 = unblockedVideos.slice(0, 10);

  console.log('These should be the REAL rankings:');
  console.log('─'.repeat(80));
  
  top10.forEach((video, index) => {
    const realRank = index + 1;
    const rankDiff = video.rank - realRank;
    const rankStatus = rankDiff > 0 ? `(currently #${video.rank}, -${rankDiff} positions off)` : 
                       rankDiff < 0 ? `(currently #${video.rank}, +${Math.abs(rankDiff)} positions off)` : 
                       '(correctly ranked)';
    
    console.log(`REAL #${realRank}: ${video.title}`);
    console.log(`         Channel: ${video.channel}`);
    console.log(`         Score: ${video.score.toLocaleString()}`);
    console.log(`         ${rankStatus}`);
    console.log('─'.repeat(80));
  });

  // 3. 현재 잘못된 랭킹 상황 요약
  console.log('\n=== SUMMARY ===\n');
  console.log('Current Issue:');
  console.log(`- ${blockedIds.length} videos are blocked but still appear in rankings`);
  console.log('- Top 3 positions are ALL occupied by blocked videos');
  console.log('- The real #1 should be "Soda Pop Official Lyric Video" (currently #4)');
  console.log('- The real #2 should be "Golden" (currently #5)');
  
  process.exit(0);
}

getRealRankings().catch(console.error);