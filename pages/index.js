import { useState, useEffect } from 'react'
import Head from 'next/head'
import CompetitionArena from '../components/CompetitionArena'
import Header from '../components/Header'
import TopicSuggestionNew from '../components/TopicSuggestionNew'
import VideoGrid from '../components/VideoGrid'
import { auth, supabase } from '../lib/supabase'

// 코드 상단에 운영자가 직접 입력
// MAIN_TITLE 상수 선언 및 사용 완전 제거
// 타이틀, 헤더, <title> 등은 mainTitle 상태만 사용
// mainTitle이 없을 때는 '...' 등 기본값 표시

export default function Home() {
  // 1. useState 선언부 (최상단)
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useApi, setUseApi] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [user, setUser] = useState(null);
  const [votingPeriod, setVotingPeriod] = useState({
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'active'
  });
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [popularTopics, setPopularTopics] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [mainTitle, setMainTitle] = useState(''); // 반드시 위에!

  // 2. 함수, useEffect 등 mainTitle 사용 코드
  // 아래 함수 전체를 삭제
  // const loadVideos = async (topic) => {
  //   setIsLoading(true)
  //   try {
  //     const response = await fetch(`/api/videos?topic=${encodeURIComponent(topic)}&useApi=${useApi}`)
  //     const data = await response.json()
      
  //     if (data.success) {
  //       // Supabase에서 Arena 좋아요 데이터 가져오기
  //       const { data: videoData, error } = await supabase
  //         .from('coversong_videos')
  //         .select('id, arena_likes, guest_likes')
  //         .eq('topic', topic)
        
  //       if (!error && videoData) {
  //         // Arena 좋아요 데이터 병합
  //         const videosWithLikes = data.videos.map(video => {
  //           const dbVideo = videoData.find(v => v.id === video.id)
  //           return {
  //             ...video,
  //             arenaLikes: dbVideo?.arena_likes || 0,
  //             guest_likes: dbVideo?.guest_likes || 0
  //           }
  //         })
  //         setVideos(videosWithLikes)
  //       } else {
  //         setVideos(data.videos)
  //       }
  //     } else {
  //       console.error('영상 로드 실패:', data.message)
  //     }
  //   } catch (error) {
  //     console.error('API 요청 오류:', error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // 사용자 인증 상태 관리
  useEffect(() => {
    const getCurrentUser = async () => {
      const currentUser = await auth.getCurrentUser()
      setUser(currentUser)
    }
    getCurrentUser()

    // 인증 상태 변경 감지
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 초기 로드
  useEffect(() => {
    async function fetchLatestCompetitionAndVideos() {
      const { data: competitions, error: compError } = await supabase
        .from('coversong_competitions')
        .select('*')
        .eq('status', 'active')
        .order('start_time', { ascending: false })
        .limit(1);

      console.log('competitions:', competitions, compError);

      const latestCompetition = competitions?.[0];
      if (!latestCompetition) {
        setVideos([]);
        console.log('isLoading:', false, 'videos:', 0);
        return;
      }

      const { data: videos, error: vidError } = await supabase
        .from('coversong_videos')
        .select('*')
        .eq('competition_id', latestCompetition.id);

      console.log('videos:', videos, vidError);
      setVideos(Array.isArray(videos) ? videos : []);
      console.log('isLoading:', false, 'videos:', Array.isArray(videos) ? videos.length : 0);
    }
    fetchLatestCompetitionAndVideos();
  }, []);

  useEffect(() => {
    console.log('isLoading:', isLoading, 'videos:', videos.length);
  }, [isLoading, videos]);

  // 주제 변경 핸들러 (Admin에서만 실행 가능)
  const handleTopicChange = (newTopic) => {
    // 일반 사용자는 주제 변경 불가
    alert('주제 변경은 Admin 페이지에서만 가능합니다.')
  }

  // 팝업 닫기
  const handleClosePopup = () => setSelectedVideo(null)
  
  // 투표 가능 여부 체크
  const isVotingActive = () => {
    const now = new Date()
    const startTime = new Date(votingPeriod.startTime)
    const endTime = new Date(votingPeriod.endTime)
    
    return votingPeriod.status === 'active' && now >= startTime && now <= endTime
  }
  
  // 클라이언트 사이드에서만 실행되는 상태
  useEffect(() => {
    setMounted(true)
    
    // 1분마다 시간 업데이트
    const interval = setInterval(() => {
      // 강제 리렌더링
      setVideos(prev => [...prev])
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])

  // 남은 시간 계산
  const getRemainingTime = () => {
    if (!mounted) return '로딩 중...' // 서버사이드에서는 로딩 표시
    
    const now = new Date()
    const endTime = new Date(votingPeriod.endTime)
    const remaining = endTime - now
    
    if (remaining <= 0) return '종료됨'
    
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}시간 ${minutes}분`
  }

  // 현재 주제 수동 입력 상태 추가
  // const [manualTitle, setManualTitle] = useState('');

  // 1. mainTitle을 먼저 선언
  // const [mainTitle, setMainTitle] = useState('');

  // 2. manualTitle은 필요 없으면 삭제
  // const [manualTitle, setManualTitle] = useState('');

  // 만약 필요하다면 아래처럼 mainTitle 이후에 선언
  // const [manualTitle, setManualTitle] = useState(mainTitle);

useEffect(() => {
  async function fetchMainTitle() {
    const { data, error } = await supabase
      .from('coversong_config')
      .select('value')
      .eq('key', 'main_title')
      .order('created_at', { ascending: false })
      .limit(1);
    console.log('main_title fetch:', data, error);
    if (data && data.length > 0) setMainTitle(data[0].value);
  }
  fetchMainTitle();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Head>
        <title>Cover Battle Arena 100 - {mainTitle || '...'}</title>
        <meta name="description" content="100개 실시간 커버송 competition 플랫폼" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header currentTopic={mainTitle || '...'} />
      
      <main className="container mx-auto px-4 py-8">
        {/* 상단 타이틀/상태 표시 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎵 {mainTitle || '...'}
          </h1>
          <p className="text-gray-300 text-lg mb-4">
            실시간 커버송 competition이 진행 중입니다!
          </p>
          {/* 투표 상태 표시 */}
          <div className="mb-4 p-4 bg-white bg-opacity-10 rounded-lg">
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="text-center">
                <div className={`text-lg font-bold ${mounted && isVotingActive() ? 'text-green-400' : 'text-red-400'}`}>
                  {mounted ? (isVotingActive() ? '🟢 투표 진행중' : '🔴 투표 종료') : '로딩 중...'}
                </div>
                <div className="text-gray-300">투표 상태</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{getRemainingTime()}</div>
                <div className="text-gray-300">남은 시간</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {videos.reduce((sum, video) => sum + (video.arenaLikes || 0), 0).toLocaleString()}
                </div>
                <div className="text-gray-300">총 Arena 좋아요</div>
              </div>
            </div>
          </div>
          
          {/* 통계 정보 */}
          <div className="flex justify-center space-x-8 text-sm text-gray-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{videos.length}</div>
              <div>총 영상 수</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {videos.reduce((sum, video) => sum + video.likes, 0).toLocaleString()}
              </div>
              <div>총 좋아요</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {videos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
              </div>
              <div>총 조회수</div>
            </div>
          </div>
        </div>

        {/* Arena를 타이틀/상태 바로 아래에 배치 */}
        <div className="arena-container mb-8">
          {videos.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            </div>
          ) : (
            <VideoGrid videos={videos} setVideos={setVideos} user={user} setSelectedVideo={setSelectedVideo} />
          )}
        </div>

        {/* 그 아래에 주제 제안, 인기 순위 등 */}
        <div className="mt-64" style={{ minHeight: '300px' }}>
          <TopicSuggestionNew />
        </div>

        {/* 영상 팝업 모달 */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
              <iframe
                className="popup-iframe"
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId || selectedVideo.youtube_id}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {/* Arena 좋아요 버튼 */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-gray-700 font-semibold">
                  🏆 Arena: {selectedVideo.arenaLikes || 0}
                </div>
                <button
                  onClick={() => {
                    setVideos(prev =>
                      prev.map(v =>
                        v.id === selectedVideo.id
                          ? { ...v, arenaLikes: (v.arenaLikes || 0) + 1 }
                          : v
                      )
                    );
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
                >
                  Arena 좋아요
                </button>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="ml-4 px-4 py-2 bg-gray-400 text-white rounded"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 