import { supabase } from './supabase';

/**
 * 일일 순위 기록
 */
export async function recordDailyRanks(competitionId) {
  try {
    // 현재 영상들의 순위 가져오기
    const { data: videos, error } = await supabase
      .from('coversong_videos')
      .select('*')
      .eq('competition_id', competitionId)
      .order('site_score', { ascending: false });

    if (error) throw error;

    const today = new Date().toISOString().split('T')[0];
    
    // 각 영상의 순위 기록
    const rankRecords = videos.map((video, index) => ({
      video_id: video.id,
      competition_id: competitionId,
      rank: index + 1,
      site_score: video.site_score,
      arena_likes: video.arena_likes,
      youtube_likes: video.likes,
      recorded_date: today
    }));

    // 배치 삽입
    const { error: insertError } = await supabase
      .from('coversong_rank_history')
      .upsert(rankRecords, {
        onConflict: 'video_id,competition_id,recorded_date'
      });

    if (insertError) throw insertError;

    return { success: true, count: rankRecords.length };
  } catch (error) {
    console.error('일일 순위 기록 오류:', error);
    return { success: false, error };
  }
}

/**
 * 순위 변동 계산
 */
export async function calculateRankChanges(competitionId, periodType = 'daily', periodDays = 1) {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);
    const startDateStr = startDate.toISOString().split('T')[0];

    // 기간 시작과 끝의 순위 데이터 가져오기
    const { data: rankData, error } = await supabase
      .from('coversong_rank_history')
      .select('*')
      .eq('competition_id', competitionId)
      .in('recorded_date', [startDateStr, endDate]);

    if (error) throw error;

    // 영상별로 그룹화
    const videoRanks = {};
    rankData.forEach(record => {
      if (!videoRanks[record.video_id]) {
        videoRanks[record.video_id] = {};
      }
      videoRanks[record.video_id][record.recorded_date] = record;
    });

    // 순위 변동 계산
    const changes = [];
    for (const videoId in videoRanks) {
      const ranks = videoRanks[videoId];
      const startRank = ranks[startDateStr]?.rank || null;
      const endRank = ranks[endDate]?.rank || null;

      if (endRank !== null) {
        changes.push({
          video_id: videoId,
          competition_id: competitionId,
          period_type: periodType,
          period_start: startDateStr,
          period_end: endDate,
          start_rank: startRank,
          end_rank: endRank,
          rank_change: startRank ? startRank - endRank : null,
          is_new_entry: startRank === null
        });
      }
    }

    // 변동 데이터 저장
    if (changes.length > 0) {
      const { error: insertError } = await supabase
        .from('coversong_rank_changes')
        .upsert(changes, {
          onConflict: 'video_id,competition_id,period_type,period_end'
        });

      if (insertError) throw insertError;
    }

    return { success: true, count: changes.length };
  } catch (error) {
    console.error('순위 변동 계산 오류:', error);
    return { success: false, error };
  }
}

/**
 * 급상승 영상 선정
 */
export async function selectRisingStars(competitionId) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const risingStars = [];

    // 일일 급상승 TOP 3
    const { data: dailyRising } = await supabase
      .from('coversong_rank_changes')
      .select(`
        *,
        video:coversong_videos(*)
      `)
      .eq('competition_id', competitionId)
      .eq('period_type', 'daily')
      .eq('period_end', today)
      .eq('is_new_entry', false)
      .gt('rank_change', 0)
      .order('rank_change', { ascending: false })
      .limit(3);

    if (dailyRising) {
      dailyRising.forEach((item, index) => {
        risingStars.push({
          video_id: item.video_id,
          competition_id: competitionId,
          category: 'daily_rising',
          rank_position: index + 1,
          rank_change: item.rank_change,
          recorded_date: today,
          video_title: item.video.title,
          channel: item.video.channel,
          thumbnail: item.video.thumbnail
        });
      });
    }

    // 주간 급상승 TOP 3 (일요일만)
    if (new Date().getDay() === 0) {
      const { data: weeklyRising } = await supabase
        .from('coversong_rank_changes')
        .select(`
          *,
          video:coversong_videos(*)
        `)
        .eq('competition_id', competitionId)
        .eq('period_type', 'weekly')
        .eq('period_end', today)
        .eq('is_new_entry', false)
        .gt('rank_change', 0)
        .order('rank_change', { ascending: false })
        .limit(3);

      if (weeklyRising) {
        weeklyRising.forEach((item, index) => {
          risingStars.push({
            video_id: item.video_id,
            competition_id: competitionId,
            category: 'weekly_rising',
            rank_position: index + 1,
            rank_change: item.rank_change,
            recorded_date: today,
            video_title: item.video.title,
            channel: item.video.channel,
            thumbnail: item.video.thumbnail
          });
        });
      }
    }

    // 신규 진입 TOP 3
    const { data: newEntries } = await supabase
      .from('coversong_rank_changes')
      .select(`
        *,
        video:coversong_videos(*)
      `)
      .eq('competition_id', competitionId)
      .eq('period_type', 'daily')
      .eq('period_end', today)
      .eq('is_new_entry', true)
      .order('end_rank', { ascending: true })
      .limit(3);

    if (newEntries) {
      newEntries.forEach((item, index) => {
        risingStars.push({
          video_id: item.video_id,
          competition_id: competitionId,
          category: 'new_entry',
          rank_position: index + 1,
          rank_change: null,
          recorded_date: today,
          video_title: item.video.title,
          channel: item.video.channel,
          thumbnail: item.video.thumbnail
        });
      });
    }

    // 급상승 영상 저장
    if (risingStars.length > 0) {
      const { error: insertError } = await supabase
        .from('coversong_rising_stars')
        .upsert(risingStars, {
          onConflict: 'category,rank_position,recorded_date,competition_id'
        });

      if (insertError) throw insertError;
    }

    return { success: true, count: risingStars.length };
  } catch (error) {
    console.error('급상승 영상 선정 오류:', error);
    return { success: false, error };
  }
}

/**
 * 전체 순위 업데이트 프로세스
 */
export async function performDailyRankUpdate() {
  try {
    // 현재 활성 competition 찾기
    const { data: competition } = await supabase
      .from('coversong_competitions')
      .select('id, start_time')
      .eq('status', 'active')
      .single();

    if (!competition) {
      console.log('활성 competition이 없습니다.');
      return { success: false, message: 'No active competition' };
    }

    const competitionId = competition.id;
    
    // 1. 일일 순위 기록
    const recordResult = await recordDailyRanks(competitionId);
    if (!recordResult.success) {
      throw new Error('Failed to record daily ranks');
    }

    // 2. 일일 순위 변동 계산
    const dailyChangeResult = await calculateRankChanges(competitionId, 'daily', 1);
    if (!dailyChangeResult.success) {
      throw new Error('Failed to calculate daily changes');
    }

    // 3. 주간 순위 변동 계산 (일요일만)
    if (new Date().getDay() === 0) {
      const weeklyChangeResult = await calculateRankChanges(competitionId, 'weekly', 7);
      if (!weeklyChangeResult.success) {
        console.error('주간 변동 계산 실패:', weeklyChangeResult.error);
      }
    }

    // 4. 전체 기간 순위 변동 계산
    const startDate = new Date(competition.start_time);
    const today = new Date();
    const totalDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    
    if (totalDays > 1) {
      const totalChangeResult = await calculateRankChanges(competitionId, 'total', totalDays);
      if (!totalChangeResult.success) {
        console.error('전체 기간 변동 계산 실패:', totalChangeResult.error);
      }
    }

    // 5. 급상승 영상 선정
    const risingStarsResult = await selectRisingStars(competitionId);
    if (!risingStarsResult.success) {
      console.error('급상승 영상 선정 실패:', risingStarsResult.error);
    }

    return {
      success: true,
      message: 'Daily rank update completed successfully',
      details: {
        ranksRecorded: recordResult.count,
        dailyChanges: dailyChangeResult.count,
        risingStars: risingStarsResult.count
      }
    };

  } catch (error) {
    console.error('전체 순위 업데이트 오류:', error);
    return { success: false, error: error.message };
  }
}