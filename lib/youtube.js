// YouTube Data API v3 연동
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || 'YOUR_API_KEY_HERE'
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3'

// 주제로 유튜브 영상 검색
export async function searchVideosByTopic(topic, maxResults = 500) {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?` +
      `part=snippet&` +
      `q=${encodeURIComponent(topic + ' cover')}&` +
      `type=video&` +
      `videoDuration=short&` +
      `order=relevance&` +
      `maxResults=${maxResults}&` +
      `key=${YOUTUBE_API_KEY}`
    )

    if (!response.ok) {
      throw new Error('YouTube API 요청 실패')
    }

    const data = await response.json()
    
    if (!data.items) {
      return []
    }

    // 영상 ID 목록 추출
    const videoIds = data.items.map(item => item.id.videoId).join(',')

    // 영상 상세 정보 가져오기
    const detailsResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?` +
      `part=statistics,snippet&` +
      `id=${videoIds}&` +
      `key=${YOUTUBE_API_KEY}`
    )

    if (!detailsResponse.ok) {
      throw new Error('영상 상세 정보 요청 실패')
    }

    const detailsData = await detailsResponse.json()

    // 영상 데이터 변환
    const videos = detailsData.items.map((item, index) => ({
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      views: parseInt(item.statistics.viewCount) || 0,
      likes: parseInt(item.statistics.likeCount) || 0,
      youtubeId: item.id,
      size: 1, // 초기 크기
      thumbnail: item.snippet.thumbnails?.maxres?.url || 
                 item.snippet.thumbnails?.high?.url ||
                 item.snippet.thumbnails?.medium?.url,
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description
    }))

    return videos
  } catch (error) {
    console.error('YouTube API 오류:', error)
    return []
  }
}

// 영상 정보 업데이트 (좋아요 수 등)
export async function getVideoDetails(videoId) {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?` +
      `part=statistics&` +
      `id=${videoId}&` +
      `key=${YOUTUBE_API_KEY}`
    )

    if (!response.ok) {
      throw new Error('영상 정보 요청 실패')
    }

    const data = await response.json()
    
    if (data.items && data.items.length > 0) {
      const item = data.items[0]
      return {
        views: parseInt(item.statistics.viewCount) || 0,
        likes: parseInt(item.statistics.likeCount) || 0
      }
    }

    return null
  } catch (error) {
    console.error('영상 정보 업데이트 오류:', error)
    return null
  }
}

// 샘플 데이터 (API 키가 없을 때 사용) - 수백 개 생성
export function getSampleVideos(topic) {
  const sampleVideos = []
  const youtubeIds = [
    'dQw4w9WgXcQ', '9bZkp7q19f0', 'kJQP7kiw5Fk', 'y6120QOlsfU', 'hT_nvWreIhg',
    'ZZ5LpwO-An4', 'L_jWHffIx5E', 'kXYiU_JCYtU', 'YQHsXMglC9A', 'fJ9rUzIMcZQ',
    'oHg5SJYRHA0', 'jNQXAC9IVRw', 'ZZ5LpwO-An4', 'dQw4w9WgXcQ', '9bZkp7q19f0'
  ]
  
  const coverTypes = [
    'Voice', 'Piano', 'Guitar', 'Violin', 'Band', 'Acoustic', 'Rock', 'Jazz',
    'Electronic', 'Classical', 'Folk', 'Metal', 'Pop', 'Hip Hop', 'Country',
    'Blues', 'Reggae', 'Soul', 'Funk', 'Disco', 'R&B', 'Alternative', 'Indie',
    'Punk', 'Hardcore', 'Ska', 'Gospel', 'Opera', 'Choir', 'Orchestra'
  ]
  
  const artists = [
    'CoverArtist1', 'PianoMaster', 'GuitarHero', 'ViolinPro', 'BandCovers',
    'AcousticSoul', 'RockCovers', 'JazzMaster', 'EDMProducer', 'ClassicalPro',
    'FolkArtist', 'MetalHead', 'PopStar', 'HipHopKing', 'CountrySinger',
    'BluesMaster', 'ReggaeVibes', 'SoulSinger', 'FunkMaster', 'DiscoQueen',
    'RBSoul', 'AltRock', 'IndieArtist', 'PunkRock', 'HardcoreBand',
    'SkaVibes', 'GospelChoir', 'OperaSinger', 'ChoirGroup', 'OrchestraPro'
  ]

  // 500개의 샘플 영상 생성
  for (let i = 1; i <= 500; i++) {
    const coverType = coverTypes[Math.floor(Math.random() * coverTypes.length)]
    const artist = artists[Math.floor(Math.random() * artists.length)]
    const youtubeId = youtubeIds[Math.floor(Math.random() * youtubeIds.length)]
    
    // 랜덤한 조회수와 좋아요 수 생성
    const views = Math.floor(Math.random() * 50000) + 1000
    const likes = Math.floor(Math.random() * 5000) + 100
    
    sampleVideos.push({
      id: i.toString(),
      title: `${topic} - ${coverType} Cover by ${artist}`,
      channel: artist,
      views: views,
      likes: likes,
      youtubeId: youtubeId,
      size: 1, // 초기 크기 (1픽셀부터 시작 가능)
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    })
  }

  return sampleVideos
} 

// 후보 score 계산 함수
function calcCandidateScore(video) {
  return (video.views || 0) + (video.likes || 0) * 100;
}

// 사이트 랭킹 score 계산 함수
function calcSiteScore(video) {
  return (
    (video.views || 0) + (video.likes || 0) * 100 // candidate_score
    + (video.arena_likes || 0) * 500              // 로그인 회원 좋아요
    + (video.guest_likes || 0) * 10               // 비로그인 좋아요
  );
}

// 1. YouTube API로 영상 긁기 (views, likes 최신값 포함)
// let videos = await searchVideosByTopic(topic, 300); // 200~300개 긁기

// 2. 후보 score/사이트 score 계산
// const videosWithScore = videos.map(v => {
//   const candidate_score = calcCandidateScore(v);
//   const site_score = candidate_score + (v.arena_likes || 0) * 500;
//   return {
//     id: v.id,
//     title: v.title,
//     channel: v.channel,
//     thumbnail: v.thumbnail,
//     youtube_id: v.youtubeId,
//     views: v.views,
//     likes: v.likes,
//     arena_likes: v.arena_likes || 0,
//     topic: topic,
//     size: 1,
//     candidate_score,
//     site_score
//   };
// });

// 3. 후보 score 기준 내림차순 정렬, 상위 300개만 추림
// const candidateList = videosWithScore
//   .sort((a, b) => b.candidate_score - a.candidate_score)
//   .slice(0, 300);

// 4. site_score 기준 내림차순 정렬, 상위 100개만 노출
// const top100 = candidateList
//   .sort((a, b) => b.site_score - a.site_score)
//   .slice(0, 100);

// 5. rank 부여
// top100.forEach((v, i) => v.rank = i + 1);

// 6. DB 저장 (upsert)
// await supabase.from('coversong_videos').upsert(top100, { onConflict: ['id'] }); 