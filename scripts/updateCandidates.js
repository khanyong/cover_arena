// scripts/updateCandidates.js
import 'dotenv/config'; // ES 모듈 방식
import { supabase } from '../lib/supabase.js';
import { searchVideosByTopic } from '../lib/youtube.js';

// 후보 score 계산 함수
function calcCandidateScore(video) {
  return (video.views || 0) + (video.likes || 0) * 100;
}
function calcSiteScore(video) {
  return (
    calcCandidateScore(video)
    + (video.arena_likes || 0) * 500
    + (video.guest_likes || 0) * 10
  );
}

async function updateCandidates(topic) {
  // 1. YouTube API로 영상 긁기
  let videos = await searchVideosByTopic(topic, 300);

  // 2. score 계산
  const videosWithScore = videos.map(v => {
    const candidate_score = calcCandidateScore(v);
    const site_score = calcSiteScore(v);
    return {
      id: v.id,
      title: v.title,
      channel: v.channel,
      thumbnail: v.thumbnail,
      youtube_id: v.youtubeId,
      views: v.views,
      likes: v.likes,
      arena_likes: v.arena_likes || 0,
      guest_likes: v.guest_likes || 0, // 새로 추가
      topic: topic,
      size: 1,
      candidate_score,
      site_score,
      competition_id: 5,
    };
  });

  // 3. 후보 score 기준 내림차순 정렬, 상위 300개만 추림
  const candidateList = videosWithScore
    .sort((a, b) => b.candidate_score - a.candidate_score)
    .slice(0, 300);

  // 4. site_score 기준 내림차순 정렬, 상위 100개만 노출
  const top100 = candidateList
    .sort((a, b) => b.site_score - a.site_score)
    .slice(0, 100);

  // 5. rank 부여
  top100.forEach((v, i) => v.rank = i + 1);

  // 6. DB 저장 (upsert)
  const { error } = await supabase.from('coversong_videos').upsert(top100, { onConflict: ['id'] });
  if (error) {
    console.error('DB 저장 실패:', error.message);
  } else {
    console.log('DB 저장 성공:', top100.length, '개');
  }
}

// 여러 topic에 대해 반복 실행 가능
updateCandidates('KPOP Demon Hunters');
updateCandidates('Huntrix-Golden');
updateCandidates('Golden');
