import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function calculateMultiPeriodRankings() {
  try {
    console.log('=== 다중 기간 순위 변동 계산 시작 ===\n');

    // 1. 현재 활성 competition 찾기
    const { data: competition } = await supabase
      .from('coversong_competitions')
      .select('id, start_time')
      .eq('status', 'active')
      .single();

    if (!competition) {
      console.error('활성 competition이 없습니다.');
      process.exit(1);
    }

    const competitionId = competition.id;
    const competitionStartDate = new Date(competition.start_time).toISOString().split('T')[0];
    console.log(`Competition ID: ${competitionId}`);
    console.log(`Competition 시작일: ${competitionStartDate}`);

    // 2. 기간 설정 (1주, 2주, 3주, 4주, 전체)
    const periods = [
      { type: 'weekly_1', days: 7, label: '1주' },
      { type: 'weekly_2', days: 14, label: '2주' },
      { type: 'weekly_3', days: 21, label: '3주' },
      { type: 'weekly_4', days: 28, label: '4주' },
      { type: 'monthly', days: 30, label: '한달' },
      { type: 'total', days: null, label: '전체 기간' }
    ];

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    console.log(`오늘: ${todayStr}\n`);

    // 3. 현재 순위 데이터 가져오기 또는 계산
    const { data: todayRankData } = await supabase
      .from('coversong_rank_history')
      .select('*')
      .eq('competition_id', competitionId)
      .eq('recorded_date', todayStr);

    let currentRankData;
    if (!todayRankData || todayRankData.length === 0) {
      console.log('오늘 히스토리가 없어 현재 순위를 직접 계산합니다...');
      
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
      }
    } else {
      currentRankData = todayRankData;
      console.log(`오늘 데이터: ${currentRankData.length}개 영상\n`);
    }

    // 4. 각 기간별로 순위 변동 계산
    for (const period of periods) {
      console.log(`\n=== ${period.label} 급상승 계산 ===`);
      
      let targetDate;
      if (period.type === 'total') {
        // 전체 기간: competition 시작일 사용
        targetDate = competitionStartDate;
      } else {
        // 특정 기간: N일 전 날짜 계산
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - period.days);
        targetDate = pastDate.toISOString().split('T')[0];
        
        // 시작일보다 이전이면 시작일 사용
        if (targetDate < competitionStartDate) {
          targetDate = competitionStartDate;
        }
      }

      console.log(`비교 기준일: ${targetDate}`);

      // 과거 순위 데이터 가져오기
      const { data: oldRankData } = await supabase
        .from('coversong_rank_history')
        .select('*')
        .eq('competition_id', competitionId)
        .eq('recorded_date', targetDate);

      let finalOldRankData = oldRankData;
      let finalTargetDate = targetDate;
      
      if (!oldRankData || oldRankData.length === 0) {
        console.log(`${targetDate} 데이터가 없습니다. 가장 가까운 날짜를 찾습니다...`);
        
        // 가장 가까운 날짜 찾기
        const { data: nearestData } = await supabase
          .from('coversong_rank_history')
          .select('recorded_date')
          .eq('competition_id', competitionId)
          .gte('recorded_date', targetDate)
          .order('recorded_date', { ascending: true })
          .limit(1)
          .single();

        if (nearestData) {
          finalTargetDate = nearestData.recorded_date;
          console.log(`대체 날짜: ${finalTargetDate}`);
          
          const { data: alternativeData } = await supabase
            .from('coversong_rank_history')
            .select('*')
            .eq('competition_id', competitionId)
            .eq('recorded_date', finalTargetDate);

          if (alternativeData && alternativeData.length > 0) {
            finalOldRankData = alternativeData;
          }
        }
      }

      if (!finalOldRankData || finalOldRankData.length === 0) {
        console.log(`${period.label} 기간 데이터 없음 - 건너뜀`);
        continue;
      }

      // 순위 변동 계산
      const oldRankMap = {};
      finalOldRankData.forEach(item => {
        oldRankMap[item.video_id] = item.rank;
      });

      const periodChanges = [];
      currentRankData.forEach(current => {
        const oldRank = oldRankMap[current.video_id];
        
        if (oldRank) {
          // 기존 영상의 순위 변동
          const rankChange = oldRank - current.rank;
          periodChanges.push({
            video_id: current.video_id,
            competition_id: competitionId,
            period_type: period.type,
            period_start: finalTargetDate,
            period_end: todayStr,
            start_rank: oldRank,
            end_rank: current.rank,
            rank_change: rankChange,
            is_new_entry: false
          });
        } else {
          // 신규 진입 영상
          periodChanges.push({
            video_id: current.video_id,
            competition_id: competitionId,
            period_type: period.type,
            period_start: finalTargetDate,
            period_end: todayStr,
            start_rank: null,
            end_rank: current.rank,
            rank_change: null,
            is_new_entry: true
          });
        }
      });

      // 순위 상승 기준으로 정렬
      periodChanges.sort((a, b) => {
        if (a.is_new_entry && !b.is_new_entry) return 1;
        if (!a.is_new_entry && b.is_new_entry) return -1;
        return (b.rank_change || 0) - (a.rank_change || 0);
      });

      // TOP 5 출력
      console.log(`\n${period.label} 급상승 TOP 5:`);
      const topRising = periodChanges.filter(c => !c.is_new_entry && c.rank_change > 0).slice(0, 5);
      
      for (const change of topRising) {
        const { data: video } = await supabase
          .from('coversong_videos')
          .select('title')
          .eq('id', change.video_id)
          .single();

        if (video) {
          console.log(`  ${change.start_rank}위 → ${change.end_rank}위 (↑${change.rank_change}) - ${video.title.substring(0, 50)}...`);
        }
      }

      // DB에 저장
      if (periodChanges.length > 0) {
        console.log(`\n${periodChanges.length}개의 ${period.label} 변동 데이터 저장 중...`);
        
        const { error: insertError } = await supabase
          .from('coversong_rank_changes')
          .upsert(periodChanges, {
            onConflict: 'video_id,competition_id,period_type,period_end'
          });

        if (insertError) {
          console.error(`${period.label} 저장 실패:`, insertError.message);
        } else {
          console.log(`✅ ${period.label} 데이터 저장 완료`);
        }
      }
    }

    console.log('\n=== 모든 기간 계산 완료 ===');
    process.exit(0);

  } catch (error) {
    console.error('오류 발생:', error);
    process.exit(1);
  }
}

calculateMultiPeriodRankings();