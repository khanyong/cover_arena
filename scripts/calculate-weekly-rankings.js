import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function calculateWeeklyRankings() {
  try {
    console.log('=== 주간 순위 변동 계산 시작 ===\n');

    // 1. 현재 활성 competition 찾기
    const { data: competition } = await supabase
      .from('coversong_competitions')
      .select('id')
      .eq('status', 'active')
      .single();

    if (!competition) {
      console.error('활성 competition이 없습니다.');
      process.exit(1);
    }

    const competitionId = competition.id;
    console.log(`Competition ID: ${competitionId}`);

    // 2. 오늘과 7일 전 날짜 계산
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    console.log(`오늘: ${todayStr}`);
    console.log(`7일 전: ${sevenDaysAgoStr}\n`);

    // 3. 7일 전 순위 데이터 가져오기
    const { data: oldRankData, error: oldError } = await supabase
      .from('coversong_rank_history')
      .select('*')
      .eq('competition_id', competitionId)
      .eq('recorded_date', sevenDaysAgoStr);

    if (oldError || !oldRankData || oldRankData.length === 0) {
      console.log(`7일 전(${sevenDaysAgoStr}) 데이터가 없습니다. 가장 오래된 데이터를 찾습니다...`);
      
      // 가장 오래된 데이터 찾기
      const { data: oldestData } = await supabase
        .from('coversong_rank_history')
        .select('recorded_date')
        .eq('competition_id', competitionId)
        .order('recorded_date', { ascending: true })
        .limit(1)
        .single();

      if (oldestData) {
        console.log(`가장 오래된 데이터: ${oldestData.recorded_date}`);
        
        // 해당 날짜의 데이터 가져오기
        const { data: alternativeOldData } = await supabase
          .from('coversong_rank_history')
          .select('*')
          .eq('competition_id', competitionId)
          .eq('recorded_date', oldestData.recorded_date);

        if (alternativeOldData && alternativeOldData.length > 0) {
          console.log(`${oldestData.recorded_date} 데이터 사용 (${alternativeOldData.length}개 영상)\n`);
          oldRankData = alternativeOldData;
          sevenDaysAgoStr = oldestData.recorded_date;
        } else {
          console.error('사용 가능한 과거 데이터가 없습니다.');
          process.exit(1);
        }
      } else {
        console.error('히스토리 데이터가 없습니다.');
        process.exit(1);
      }
    } else {
      console.log(`7일 전 데이터: ${oldRankData.length}개 영상\n`);
    }

    // 4. 오늘 순위 데이터 가져오기
    const { data: todayRankData, error: todayError } = await supabase
      .from('coversong_rank_history')
      .select('*')
      .eq('competition_id', competitionId)
      .eq('recorded_date', todayStr);

    let currentRankData;
    if (todayError || !todayRankData || todayRankData.length === 0) {
      console.log('오늘 히스토리가 없어 현재 순위를 직접 계산합니다...');
      
      // 현재 영상들의 순위 직접 계산
      const { data: videos } = await supabase
        .from('coversong_videos')
        .select('*')
        .eq('competition_id', competitionId)
        .order('site_score', { ascending: false });

      if (videos && videos.length > 0) {
        currentRankData = videos.map((video, index) => ({
          video_id: video.id,
          rank: index + 1,
          site_score: video.site_score
        }));
        console.log(`현재 순위 계산 완료: ${currentRankData.length}개 영상\n`);
      } else {
        console.error('현재 영상 데이터를 가져올 수 없습니다.');
        process.exit(1);
      }
    } else {
      currentRankData = todayRankData;
      console.log(`오늘 데이터: ${currentRankData.length}개 영상\n`);
    }

    // 5. 순위 변동 계산
    const oldRankMap = {};
    oldRankData.forEach(item => {
      oldRankMap[item.video_id] = item.rank;
    });

    const weeklyChanges = [];
    currentRankData.forEach(current => {
      const oldRank = oldRankMap[current.video_id];
      
      if (oldRank) {
        // 기존 영상의 순위 변동
        const rankChange = oldRank - current.rank;
        if (rankChange > 0) {
          weeklyChanges.push({
            video_id: current.video_id,
            competition_id: competitionId,
            period_type: 'weekly',
            period_start: sevenDaysAgoStr,
            period_end: todayStr,
            start_rank: oldRank,
            end_rank: current.rank,
            rank_change: rankChange,
            is_new_entry: false
          });
        }
      } else {
        // 신규 진입 영상
        weeklyChanges.push({
          video_id: current.video_id,
          competition_id: competitionId,
          period_type: 'weekly',
          period_start: sevenDaysAgoStr,
          period_end: todayStr,
          start_rank: null,
          end_rank: current.rank,
          rank_change: null,
          is_new_entry: true
        });
      }
    });

    // 순위 상승 기준으로 정렬
    weeklyChanges.sort((a, b) => {
      if (a.is_new_entry && !b.is_new_entry) return 1;
      if (!a.is_new_entry && b.is_new_entry) return -1;
      return (b.rank_change || 0) - (a.rank_change || 0);
    });

    console.log('=== 주간 급상승 TOP 10 ===');
    const topRising = weeklyChanges.filter(c => !c.is_new_entry).slice(0, 10);
    
    for (const change of topRising) {
      const { data: video } = await supabase
        .from('coversong_videos')
        .select('title, channel')
        .eq('id', change.video_id)
        .single();

      if (video) {
        console.log(`${change.start_rank}위 → ${change.end_rank}위 (↑${change.rank_change}) - ${video.title} [${video.channel}]`);
      }
    }

    // 6. DB에 저장
    if (weeklyChanges.length > 0) {
      console.log(`\n총 ${weeklyChanges.length}개의 주간 변동 데이터를 저장합니다...`);
      
      const { error: insertError } = await supabase
        .from('coversong_rank_changes')
        .upsert(weeklyChanges, {
          onConflict: 'video_id,competition_id,period_type,period_end'
        });

      if (insertError) {
        console.error('저장 실패:', insertError);
        process.exit(1);
      } else {
        console.log('✅ 주간 순위 변동 데이터 저장 완료!');
      }
    }

    console.log('\n=== 완료 ===');
    process.exit(0);

  } catch (error) {
    console.error('오류 발생:', error);
    process.exit(1);
  }
}

calculateWeeklyRankings();