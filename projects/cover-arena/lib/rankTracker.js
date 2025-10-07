// 순위 변동 추적을 위한 유틸리티 함수들

// 로컬 스토리지에서 이전 순위 데이터 가져오기
export const getPreviousRanks = () => {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem('previousVideoRanks');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('이전 순위 데이터 로드 실패:', error);
    return {};
  }
};

// 현재 순위 데이터를 로컬 스토리지에 저장
export const saveCurrentRanks = (videos) => {
  if (typeof window === 'undefined') return;
  
  try {
    const rankData = {};
    videos.forEach(video => {
      rankData[video.youtube_id] = {
        rank: video.rank,
        site_score: video.site_score,
        views: video.views,
        likes: video.likes,
        arena_likes: video.arena_likes || 0,
        guest_likes: video.guest_likes || 0,
        timestamp: new Date().toISOString()
      };
    });
    
    localStorage.setItem('previousVideoRanks', JSON.stringify(rankData));
  } catch (error) {
    console.error('현재 순위 데이터 저장 실패:', error);
  }
};

// 순위 변동 계산
export const calculateRankChange = (currentVideo, previousRanks) => {
  const previous = previousRanks[currentVideo.youtube_id];
  
  if (!previous) {
    return {
      change: 0,
      type: 'new',
      icon: '🆕',
      text: '신규',
      color: 'text-blue-400'
    };
  }
  
  const rankChange = previous.rank - currentVideo.rank;
  
  if (rankChange > 0) {
    return {
      change: rankChange,
      type: 'up',
      icon: '↗️',
      text: `+${rankChange}`,
      color: 'text-green-400'
    };
  } else if (rankChange < 0) {
    return {
      change: Math.abs(rankChange),
      type: 'down',
      icon: '↘️',
      text: `-${Math.abs(rankChange)}`,
      color: 'text-red-400'
    };
  } else {
    return {
      change: 0,
      type: 'stable',
      icon: '→',
      text: '유지',
      color: 'text-gray-400'
    };
  }
};

// 점수 변동 계산
export const calculateScoreChange = (currentVideo, previousRanks) => {
  const previous = previousRanks[currentVideo.youtube_id];
  
  if (!previous) {
    return {
      site_score_change: 0,
      views_change: 0,
      likes_change: 0,
      arena_likes_change: 0
    };
  }
  
  return {
    site_score_change: currentVideo.site_score - previous.site_score,
    views_change: currentVideo.views - previous.views,
    likes_change: currentVideo.likes - previous.likes,
    arena_likes_change: (currentVideo.arena_likes || 0) - previous.arena_likes
  };
};

// 순위 변동 요약 정보 생성
export const generateRankSummary = (videos) => {
  const previousRanks = getPreviousRanks();
  const summary = {
    totalVideos: videos.length,
    newVideos: 0,
    rankUp: 0,
    rankDown: 0,
    stable: 0,
    topMovers: []
  };
  
  const movers = [];
  
  videos.forEach(video => {
    const rankChange = calculateRankChange(video, previousRanks);
    
    if (rankChange.type === 'new') {
      summary.newVideos++;
    } else if (rankChange.type === 'up') {
      summary.rankUp++;
      movers.push({
        video,
        change: rankChange.change,
        type: 'up'
      });
    } else if (rankChange.type === 'down') {
      summary.rankDown++;
      movers.push({
        video,
        change: rankChange.change,
        type: 'down'
      });
    } else {
      summary.stable++;
    }
  });
  
  // 상위 변동자 정렬 (변동 폭이 큰 순)
  summary.topMovers = movers
    .sort((a, b) => b.change - a.change)
    .slice(0, 5);
  
  return summary;
};

// 순위 변동 히스토리 저장 (최근 10회)
export const saveRankHistory = (videos) => {
  if (typeof window === 'undefined') return;
  
  try {
    const history = JSON.parse(localStorage.getItem('rankHistory') || '[]');
    const currentData = {
      timestamp: new Date().toISOString(),
      videos: videos.map(video => ({
        youtube_id: video.youtube_id,
        rank: video.rank,
        site_score: video.site_score,
        title: video.title
      }))
    };
    
    history.push(currentData);
    
    // 최근 10회만 유지
    if (history.length > 10) {
      history.shift();
    }
    
    localStorage.setItem('rankHistory', JSON.stringify(history));
  } catch (error) {
    console.error('순위 히스토리 저장 실패:', error);
  }
};

// 순위 변동 히스토리 가져오기
export const getRankHistory = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem('rankHistory') || '[]');
  } catch (error) {
    console.error('순위 히스토리 로드 실패:', error);
    return [];
  }
}; 