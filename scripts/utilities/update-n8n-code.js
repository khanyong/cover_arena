// n8n Code Node에 추가할 순위 히스토리 업데이트 코드
// 기존 n8n 워크플로우의 Code Node에 이 부분을 추가하세요

// 순위 히스토리 업데이트 함수
async function updateRankHistory(supabase, competitionId) {
  try {
    console.log('순위 히스토리 업데이트 시작...');
    
    // 1. 오늘의 순위 기록
    const { error: recordError } = await supabase.rpc('record_daily_ranks');
    if (recordError) {
      console.error('일일 순위 기록 실패:', recordError);
      return false;
    }
    
    // 2. 일일 순위 변동 계산
    const { error: dailyError } = await supabase.rpc('calculate_rank_changes', {
      p_competition_id: competitionId,
      p_period_type: 'daily',
      p_period_days: 1
    });
    if (dailyError) {
      console.error('일일 순위 변동 계산 실패:', dailyError);
    }
    
    // 3. 주간 순위 변동 계산 (일요일만)
    const today = new Date();
    if (today.getDay() === 0) { // 일요일
      const { error: weeklyError } = await supabase.rpc('calculate_rank_changes', {
        p_competition_id: competitionId,
        p_period_type: 'weekly',
        p_period_days: 7
      });
      if (weeklyError) {
        console.error('주간 순위 변동 계산 실패:', weeklyError);
      }
    }
    
    // 4. 급상승 영상 선정
    const { error: risingError } = await supabase.rpc('select_rising_stars', {
      p_competition_id: competitionId
    });
    if (risingError) {
      console.error('급상승 영상 선정 실패:', risingError);
    }
    
    console.log('순위 히스토리 업데이트 완료');
    return true;
  } catch (error) {
    console.error('순위 히스토리 업데이트 중 오류:', error);
    return false;
  }
}

// 기존 n8n 코드의 메인 로직에 추가
// processedVideos 업데이트 후에 실행
const historyUpdated = await updateRankHistory(supabase, competition.id);
if (historyUpdated) {
  console.log('✅ 순위 히스토리가 성공적으로 업데이트되었습니다.');
} else {
  console.log('⚠️ 순위 히스토리 업데이트 중 일부 오류가 발생했습니다.');
}

// 결과 반환에 히스토리 업데이트 정보 추가
return {
  json: {
    success: true,
    message: '영상 데이터가 성공적으로 업데이트되었습니다.',
    details: {
      processedCount: processedVideos.length,
      updatedCount: updatedCount,
      failedCount: failedUpdates.length,
      historyUpdated: historyUpdated,
      timestamp: new Date().toISOString()
    }
  }
};