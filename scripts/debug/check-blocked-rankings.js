import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBlockedRankings() {
  // 1. 블럭된 영상 목록 가져오기
  console.log('=== 1. Blocked Videos ===');
  const { data: blockedVideos, error: blockedError } = await supabase
    .from('coversong_blocked_videos')
    .select('youtube_id, reason, blocked_at')
    .eq('is_active', true);

  if (blockedError) {
    console.error('Error fetching blocked videos:', blockedError);
    return;
  }

  const blockedIds = blockedVideos.map(v => v.youtube_id);
  console.log(`Total blocked videos: ${blockedIds.length}`);
  blockedVideos.forEach(v => {
    console.log(`- ${v.youtube_id}: ${v.reason} (blocked at: ${v.blocked_at})`);
  });

  // 2. 현재 TOP 10 영상 확인 (블럭 상태 포함)
  console.log('\n=== 2. Current TOP 10 Videos with Block Status ===');
  const { data: top10, error: topError } = await supabase
    .from('coversong_videos')
    .select('rank, youtube_id, title, score')
    .eq('competition_id', 5)
    .order('rank', { ascending: true })
    .limit(10);

  if (topError) {
    console.error('Error fetching top 10:', topError);
    return;
  }

  top10.forEach(video => {
    const isBlocked = blockedIds.includes(video.youtube_id);
    const blockStatus = isBlocked ? '🚫 BLOCKED' : '✅ OK';
    console.log(`Rank ${video.rank}: ${video.title.substring(0, 50)}... (${blockStatus})`);
    if (isBlocked) {
      console.log(`  -> YouTube ID: ${video.youtube_id} should not be in rankings!`);
    }
  });

  // 3. 블럭된 영상 중 상위 랭킹에 있는 것들 찾기
  console.log('\n=== 3. Blocked Videos Still in Rankings ===');
  const { data: blockedInRankings, error: rankError } = await supabase
    .from('coversong_videos')
    .select('rank, youtube_id, title, score, site_score')
    .eq('competition_id', 5)
    .in('youtube_id', blockedIds)
    .order('rank', { ascending: true });

  if (rankError) {
    console.error('Error checking blocked in rankings:', rankError);
    return;
  }

  if (blockedInRankings && blockedInRankings.length > 0) {
    console.log(`⚠️  Found ${blockedInRankings.length} blocked videos still in rankings:`);
    blockedInRankings.forEach(video => {
      console.log(`  Rank ${video.rank}: ${video.title}`);
      console.log(`    YouTube ID: ${video.youtube_id}`);
      console.log(`    Score: ${video.score}, Site Score: ${video.site_score}`);
    });
  } else {
    console.log('✅ No blocked videos found in rankings');
  }

  // 4. 블럭되지 않은 실제 TOP 5
  console.log('\n=== 4. Real TOP 5 (Excluding Blocked) ===');
  const { data: realTop5, error: realError } = await supabase
    .from('coversong_videos')
    .select('rank, youtube_id, title, score')
    .eq('competition_id', 5)
    .not('youtube_id', 'in', `(${blockedIds.map(id => `'${id}'`).join(',')})`)
    .order('score', { ascending: false })
    .limit(5);

  if (realError) {
    console.error('Error fetching real top 5:', realError);
    return;
  }

  console.log('Videos that should be in TOP 5 (by score):');
  realTop5.forEach((video, index) => {
    console.log(`Real Rank ${index + 1}: ${video.title}`);
    console.log(`  Current Rank: ${video.rank}, Score: ${video.score}`);
  });

  process.exit(0);
}

checkBlockedRankings().catch(console.error);