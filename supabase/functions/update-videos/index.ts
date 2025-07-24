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
    console.log(`[Edge] searchVideosByTopic: topic=${topic}`);
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

    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    if (!videoIds) return [];

    const detailsRes = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?` +
      `part=statistics,snippet&` +
      `id=${videoIds}&` +
      `key=${YOUTUBE_API_KEY}`
    );
    if (!detailsRes.ok) throw new Error('영상 상세 정보 요청 실패');
    const detailsData = await detailsRes.json();

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
    console.log(`[Edge] searchVideosByTopic: found ${videos.length} videos`);
    return videos;
  } catch (error) {
    console.error('[Edge] YouTube API 오류:', error);
    return [];
  }
}

function calcCandidateScore(video) {
  return (video.views || 0) + (video.likes || 0) * 100;
}
function calcSiteScore(video, guest_likes) {
  return calcCandidateScore(video) + (video.arena_likes || 0) * 500 + (guest_likes || 0) * 10;
}

Deno.serve(async (req) => {
  console.log('[Edge] update-videos 함수 진입');

  // 1. competitions 쿼리
  const { data: competitions, error: compError } = await supabase
    .from('coversong_competitions')
    .select('id, topic')
    .eq('status', 'active');
  if (compError) {
    console.error('[Edge] competitions 조회 에러:', compError.message);
    return new Response(JSON.stringify({ error: compError.message }), { status: 500 });
  }
  if (!competitions || competitions.length === 0) {
    console.error('[Edge] competitions 쿼리 결과가 null이거나 비어있음');
    return new Response(JSON.stringify({ error: 'competitions 쿼리 결과가 null이거나 비어있음' }), { status: 500 });
  }
  console.log(`[Edge] competitions 개수: ${competitions.length}`);

  // 타임아웃 방지를 위해 topic 개수가 많으면 일부만 처리(운영시 삭제)
  // const competitionsToProcess = competitions.slice(0, 2); // 예시: 2개만 처리
  const competitionsToProcess = competitions;

  for (const comp of competitionsToProcess) {
    const topic = comp.topic;
    console.log(`[Edge] topic: ${topic}`);

    // 2. YouTube API로 영상 긁기
    const videos = await searchVideosByTopic(topic, 300);

    // 3. coversong_video_rankings에서 arena_likes 조회 및 매핑
    const { data: rankings, error: rankingsError } = await supabase
      .from('coversong_video_rankings')
      .select('video_id, arena_likes');
    if (rankingsError) {
      console.error('[Edge] rankings 조회 에러:', rankingsError.message);
      continue;
    }
    if (!rankings) {
      console.error('[Edge] rankings 쿼리 결과가 null입니다.');
      continue;
    }
    const arenaLikesMap = {};
    rankings.forEach(r => { arenaLikesMap[r.video_id] = r.arena_likes; });

    // 4. score 계산 및 랭킹 부여
    const videosWithScore = videos.map(v => {
      const candidate_score = calcCandidateScore(v);
      const site_score = calcSiteScore(
        { ...v, arena_likes: arenaLikesMap[v.id] || 0 },
        v.guest_likes || 0
      );
      return {
        ...v,
        arena_likes: arenaLikesMap[v.id] || 0,
        guest_likes: v.guest_likes || 0,
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
    try {
      const { error: upsertError } = await supabase
        .from('coversong_videos')
        .upsert(top100, { onConflict: ['id'] });
      if (upsertError) {
        console.error('[Edge] DB 저장 실패:', upsertError.message);
      } else {
        console.log(`[Edge] DB 저장 성공: ${top100.length}개`);
      }
    } catch (e) {
      console.error('[Edge] DB upsert 예외:', e);
    }
  }

  console.log('[Edge] update-videos 함수 종료');
  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
