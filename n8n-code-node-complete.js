// === n8n Code Node - Complete Video Processing Script ===
// API Keys (Replace with your actual keys)
const SUPABASE_API_KEY = '여기에_실제_서비스_롤_키_입력';
const YOUTUBE_API_KEY = '여기에_실제_유튜브_API_키_입력';

try {
  // 1. topic을 쉼표로 분리하여 배열로 만듦
  const topicRaw = items[0].json.topic;
  const topics = topicRaw.split(',').map(t => t.trim()).filter(Boolean);

  const maxResults = 50; // 실행용: 한 번에 50개씩
  const totalWanted = 300; // 실행용: 총 300개 수집
  let allVideos = [];

  // 각 topic별로 YouTube 검색 수행
  for (const topic of topics) {
    let nextPageToken = null;
    let topicVideos = [];
    do {
      const params = {
        part: 'snippet',
        q: topic + ' cover',
        type: 'video',
        videoDuration: 'short',
        order: 'relevance',
        maxResults: maxResults,
        key: YOUTUBE_API_KEY,
        ...(nextPageToken && { pageToken: nextPageToken })
      };

      const res = await this.helpers.request({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/search',
        qs: params,
        json: true
      });

      if (res.items) {
        res.items.forEach(item => item._searchTopic = topic);
        topicVideos.push(...res.items);
      }
      nextPageToken = res.nextPageToken;
    } while (nextPageToken && topicVideos.length < totalWanted);

    allVideos.push(...topicVideos);
  }

  // 2. videoId 중복 제거 (youtube_id 기준)
  const seenIds = new Set();
  const uniqueVideos = [];
  for (const item of allVideos.slice(0, totalWanted)) {
    if (!seenIds.has(item.id.videoId)) {
      seenIds.add(item.id.videoId);
      uniqueVideos.push(item);
    }
  }

  // 3. videos API로 상세 정보 조회 (모든 정보 포함)
  const videoIdsArr = uniqueVideos.map(v => v.id.videoId).filter(Boolean);
  let videoDetails = [];
  if (videoIdsArr.length > 0) {
    for (let i = 0; i < videoIdsArr.length; i += 50) {
      const batchIds = videoIdsArr.slice(i, i + 50).join(',');
      const detailsRes = await this.helpers.request({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/videos',
        qs: {
          part: 'statistics,snippet,contentDetails,status,liveStreamingDetails,recordingDetails',
          id: batchIds,
          key: YOUTUBE_API_KEY
        },
        json: true
      });
      if (detailsRes.items) {
        videoDetails.push(...detailsRes.items);
      }
    }
  }

  // 4-1. coversong_competitions에서 현재 활성 competition_id 조회 (status=active)
  let latestCompetitionId = null;
  try {
    const competitionsRes = await this.helpers.request({
      method: 'GET',
      url: 'https://iklsghevdtqqkjuaympc.supabase.co/rest/v1/coversong_competitions?select=id&status=eq.active&order=created_at.desc&limit=1',
      headers: {
        'apikey': SUPABASE_API_KEY,
        'Authorization': 'Bearer ' + SUPABASE_API_KEY
      },
      json: true
    });

    if (competitionsRes && Array.isArray(competitionsRes) && competitionsRes.length > 0) {
      latestCompetitionId = competitionsRes[0].id;
    }
  } catch (error) {
    latestCompetitionId = 1; // 기본값
  }

  // 4-2. coversong_video_rankings에서 arena_likes와 guest_likes 조회
  let arenaLikesMap = {};
  let guestLikesMap = {};
  try {
    const rankingsRes = await this.helpers.request({
      method: 'GET',
      url: 'https://iklsghevdtqqkjuaympc.supabase.co/rest/v1/coversong_video_rankings?select=youtube_id,arena_likes,guest_likes',
      headers: {
        'apikey': SUPABASE_API_KEY,
        'Authorization': 'Bearer ' + SUPABASE_API_KEY
      },
      json: true
    });

    if (rankingsRes && Array.isArray(rankingsRes)) {
      rankingsRes.forEach(r => {
        arenaLikesMap[r.youtube_id] = r.arena_likes || 0;
        guestLikesMap[r.youtube_id] = r.guest_likes || 0;
      });
    }
  } catch (error) {}

  // 4-3. 기존 coversong_videos에서 arena_likes와 guest_likes 조회 (누적용)
  let existingLikesMap = {};
  try {
    const existingVideosRes = await this.helpers.request({
      method: 'GET',
      url: 'https://iklsghevdtqqkjuaympc.supabase.co/rest/v1/coversong_videos?select=youtube_id,arena_likes,guest_likes',
      headers: {
        'apikey': SUPABASE_API_KEY,
        'Authorization': 'Bearer ' + SUPABASE_API_KEY
      },
      json: true
    });

    if (existingVideosRes && Array.isArray(existingVideosRes)) {
      existingVideosRes.forEach(v => {
        existingLikesMap[v.youtube_id] = {
          arena_likes: v.arena_likes || 0,
          guest_likes: v.guest_likes || 0
        };
      });
    }
  } catch (error) {}

  // 4-4. 새로운 arena_likes와 guest_likes 계산 (현재는 0으로 설정)
  let newArenaLikesMap = {};
  let newGuestLikesMap = {};
  uniqueVideos.forEach(v => {
    newArenaLikesMap[v.id.videoId] = 0;
    newGuestLikesMap[v.id.videoId] = 0;
  });

  // 5. 상세 정보 매핑 및 score 계산 (모든 필드 포함)
  const detailsMap = {};
  videoDetails.forEach(item => {
    detailsMap[item.id] = item;
  });

  const videosWithScore = uniqueVideos.map(v => {
    const detail = detailsMap[v.id.videoId] || {};
    const stats = detail.statistics || {};
    const snippet = detail.snippet || {};
    const contentDetails = detail.contentDetails || {};
    const status = detail.status || {};
    const liveStreaming = detail.liveStreamingDetails || {};
    const recording = detail.recordingDetails || {};

    const views = parseInt(stats.viewCount) || 0;
    const likes = parseInt(stats.likeCount) || 0;
    const existingLikes = existingLikesMap[v.id.videoId] || { arena_likes: 0, guest_likes: 0 };
    const newArenaLikes = newArenaLikesMap[v.id.videoId] || 0;
    const newGuestLikes = newGuestLikesMap[v.id.videoId] || 0;
    const arena_likes = existingLikes.arena_likes + newArenaLikes;
    const guest_likes = existingLikes.guest_likes + newGuestLikes;

    const candidate_score = views + likes * 100;
    const site_score = candidate_score + arena_likes * 500 + guest_likes * 10;

    return {
      id: v.id.videoId,
      title: snippet.title || v.snippet.title,
      channel: snippet.channelTitle || v.snippet.channelTitle,
      thumbnail: snippet.thumbnails?.high?.url || v.snippet.thumbnails.high?.url,
      youtube_id: v.id.videoId,
      views: views,
      likes: likes,
      arena_likes: arena_likes,
      guest_likes: guest_likes,
      topic: topicRaw,
      size: 1,
      candidate_score: candidate_score,
      site_score: site_score,
      competition_id: latestCompetitionId,

      description: snippet.description || null,
      published_at: snippet.publishedAt || null,
      channel_id: snippet.channelId || null,
      tags: snippet.tags || null,
      category_id: snippet.categoryId || null,
      default_language: snippet.defaultLanguage || null,
      default_audio_language: snippet.defaultAudioLanguage || null,
      live_broadcast_content: snippet.liveBroadcastContent || null,

      thumbnail_default: snippet.thumbnails?.default?.url || null,
      thumbnail_medium: snippet.thumbnails?.medium?.url || null,
      thumbnail_standard: snippet.thumbnails?.standard?.url || null,
      thumbnail_maxres: snippet.thumbnails?.maxres?.url || null,

      dislikes: parseInt(stats.dislikeCount) || 0,
      favorites: parseInt(stats.favoriteCount) || 0,
      comments: parseInt(stats.commentCount) || 0,

      duration: contentDetails.duration || null,
      dimension: contentDetails.dimension || null,
      definition: contentDetails.definition || null,
      caption: contentDetails.caption === 'true' ? true : false,
      licensed_content: contentDetails.licensedContent === true ? true : false,
      privacy_status: status.privacyStatus || null,
      embeddable: status.embeddable === true ? true : false,
      made_for_kids: status.madeForKids === true ? true : false,

      actual_start_time: liveStreaming.actualStartTime || null,
      actual_end_time: liveStreaming.actualEndTime || null,
      scheduled_start_time: liveStreaming.scheduledStartTime || null,
      concurrent_viewers: parseInt(liveStreaming.concurrentViewers) || 0,

      location_description: recording.locationDescription || null,
      location_latitude: recording.location?.latitude ? parseFloat(recording.location.latitude) : null,
      location_longitude: recording.location?.longitude ? parseFloat(recording.location.longitude) : null,
    };
  });

  // 6. candidate_score 내림차순 정렬, 상위 300개
  const candidateList = videosWithScore
    .sort((a, b) => b.candidate_score - a.candidate_score)
    .slice(0, 300);

  // 7. site_score 내림차순 정렬, 상위 100개
  const top100 = candidateList
    .sort((a, b) => b.site_score - a.site_score)
    .slice(0, 100);

  // 8. rank 부여
  top100.forEach((v, i) => v.rank = i + 1);

  if (top100.length === 0) {
    return [{ json: { error: 'no_videos_found', message: '비디오를 찾을 수 없습니다', topic: topicRaw } }];
  }

  return top100;

} catch (error) {
  return [{
    json: {
      error: true,
      message: error.message,
      details: error.response?.data,
      topic: items[0]?.json?.topic || 'unknown'
    }
  }];
} 