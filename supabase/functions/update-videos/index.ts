import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Supabase 클라이언트 생성
const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);

// YouTube API 연동 함수
const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// 유튜브에서 topic으로 영상 검색
async function searchVideosByTopic(topic, maxResults = 300) {
  try {
    // 1. 검색 API 호출
    const searchRes = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?` +
      `part=snippet&` +
      `q=${encodeURIComponent(topic + ' cover')}&` +
      `type=video&` +
      `videoDuration=short&` +
      `order=relevance&` +
      `maxResults=${maxResults}&` +
      `key=${YOUTUBE_API_KEY}`
    );
    if (!searchRes.ok) throw new Error('YouTube API 요청 실패');
    const searchData = await searchRes.json();
    if (!searchData.items) return [];

    // 2. 영상 ID 목록 추출
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    if (!videoIds) return [];

    // 3. 상세 정보 API 호출
    const detailsRes = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?` +
      `part=statistics,snippet&` +
      `id=${videoIds}&` +
      `key=${YOUTUBE_API_KEY}`
    );
    if (!detailsRes.ok) throw new Error('영상 상세 정보 요청 실패');
    const detailsData = await detailsRes.json();

    // 4. 영상 데이터 변환
    const videos = detailsData.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      views: parseInt(item.statistics.viewCount) || 0,
      likes: parseInt(item.statistics.likeCount) || 0,
      youtubeId: item.id,
      size: 1,
      thumbnail: item.snippet.thumbnails?.maxres?.url ||
                 item.snippet.thumbnails?.high?.url ||
                 item.snippet.thumbnails?.medium?.url,
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description
    }));
    return videos;
  } catch (error) {
    console.error('YouTube API 오류:', error);
    return [];
  }
}

// 후보 score 계산 함수
function calcCandidateScore(video) {
  return (video.views || 0) + (video.likes || 0) * 100;
}
function calcSiteScore(video, guest_likes) {
  return calcCandidateScore(video) + (video.arena_likes || 0) * 500 + (guest_likes || 0) * 10;
}

Deno.serve(async (req) => {
  // 1. coversong_competitions에서 topic, guest_likes 조회
  const { data: competitions, error: compError } = await supabase
    .from('coversong_competitions')
    .select('id, topic, guest_likes')
    .eq('status', 'active');
  if (compError) return new Response(JSON.stringify({ error: compError.message }), { status: 500 });

  for (const comp of competitions) {
    const topic = comp.topic;
    const guest_likes = comp.guest_likes || 0;

    // 2. YouTube API로 영상 긁기
    const videos = await searchVideosByTopic(topic, 300);

    // 3. coversong_video_rankings에서 arena_likes 조회 및 매핑
    const { data: rankings, error: rankError } = await supabase
      .from('coversong_video_rankings')
      .select('video_id, arena_likes');
    if (rankError) continue;
    const arenaLikesMap = {};
    rankings.forEach(r => { arenaLikesMap[r.video_id] = r.arena_likes; });

    // 4. score 계산 및 랭킹 부여
    const videosWithScore = videos.map(v => {
      const candidate_score = calcCandidateScore(v);
      const site_score = calcSiteScore(
        { ...v, arena_likes: arenaLikesMap[v.id] || 0 },
        guest_likes
      );
      return {
        ...v,
        arena_likes: arenaLikesMap[v.id] || 0,
        guest_likes,
        candidate_score,
        site_score,
        topic,
      };
    });

    // 5. 후보 score 기준 내림차순 정렬, 상위 300개만 추림
    const candidateList = videosWithScore
      .sort((a, b) => b.candidate_score - a.candidate_score)
      .slice(0, 300);

    // 6. site_score 기준 내림차순 정렬, 상위 100개만 노출
    const top100 = candidateList
      .sort((a, b) => b.site_score - a.site_score)
      .slice(0, 100);

    // 7. rank 부여
    top100.forEach((v, i) => v.rank = i + 1);

    // 8. DB 저장 (upsert)
    const { error: upsertError } = await supabase
      .from('coversong_videos')
      .upsert(top100, { onConflict: ['id'] });
    if (upsertError) {
      // 에러 로깅
      console.error('DB 저장 실패:', upsertError.message);
    }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
