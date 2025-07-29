import { useState, useEffect } from 'react'
import Head from 'next/head'
import CompetitionArena from '../components/CompetitionArena'
import Header from '../components/Header'
import TopicSuggestionNew from '../components/TopicSuggestionNew'
import VideoGrid from '../components/VideoGrid'
import VideoTable from '../components/VideoTable'
import Top3Videos from '../components/Top3Videos'
import VideoFilters from '../components/VideoFilters'
import VideoDetailModal from '../components/VideoDetailModal'
import RankChangeSummary from '../components/RankChangeSummary'
import RisingStarVideo from '../components/RisingStarVideo'
import { auth, supabase } from '../lib/supabase'
import { saveCurrentRanks, saveRankHistory } from '../lib/rankTracker'

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
  const [viewMode, setViewMode] = useState('table'); // 'table' 또는 'grid'
  const [activeFilter, setActiveFilter] = useState('all'); // 필터 상태 추가
  const [latestUpdateTime, setLatestUpdateTime] = useState(null); // 최신 업데이트 시간

  // 최종 순위 발표 이벤트 상태 추가
  const [announcedCompetition, setAnnouncedCompetition] = useState(null)
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [finalResults, setFinalResults] = useState([])

  // Competition 히스토리 상태 추가
  const [competitionHistory, setCompetitionHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [totalVideoCount, setTotalVideoCount] = useState(0) // 총 영상 수 상태 추가

  // 발표된 Competition 확인
  const checkAnnouncedCompetition = async () => {
    try {
      const { data, error } = await supabase
        .from('coversong_competitions')
        .select('*')
        .eq('status', 'ended')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
      
      if (data && !error) {
        // 최근 24시간 내에 발표된 Competition인지 확인
        const announcementTime = new Date(data.updated_at)
        const now = new Date()
        const hoursDiff = (now - announcementTime) / (1000 * 60 * 60)
        
        if (hoursDiff <= 24) { // 24시간 이내 발표
          setAnnouncedCompetition(data)
          setShowAnnouncement(true)
          
          // 최종 결과 로드
          await loadFinalResults(data.id)
        }
      }
    } catch (error) {
      console.error('발표된 Competition 확인 오류:', error)
    }
  }

  // 최종 결과 로드
  const loadFinalResults = async (competitionId) => {
    try {
      const { data, error } = await supabase
        .from('coversong_videos')
        .select('*')
        .eq('competition_id', competitionId)
        .not('final_rank', 'is', null)
        .order('final_rank', { ascending: true })
        .limit(10)
      
      if (!error && data) {
        setFinalResults(data)
      }
    } catch (error) {
      console.error('최종 결과 로드 오류:', error)
    }
  }

  // 발표 알림 닫기
  const closeAnnouncement = () => {
    setShowAnnouncement(false)
  }

  // 발표 알림을 로컬 스토리지에 저장 (24시간 동안 표시하지 않음)
  const dismissAnnouncement = () => {
    if (announcedCompetition) {
      localStorage.setItem(`announcement_${announcedCompetition.id}`, 'dismissed')
      setShowAnnouncement(false)
    }
  }

  // Competition 히스토리 로드 (기존 테이블 사용)
  const loadCompetitionHistory = async () => {
    setHistoryLoading(true)
    try {
      const { data, error } = await supabase
        .from('coversong_competitions')
        .select('*')
        .eq('status', 'ended')
        .order('updated_at', { ascending: false })
        .limit(5) // 최근 5회차만 표시
      
      if (!error && data) {
        setCompetitionHistory(data)
      }
    } catch (error) {
      console.error('히스토리 로드 오류:', error)
    } finally {
      setHistoryLoading(false)
    }
  }

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
    if (!mounted) return;
    
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
  }, [mounted])

  useEffect(() => {
    if (!mounted) return;
    
    async function fetchLatestCompetitionAndVideos() {
      try {
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

      // DB의 기간을 votingPeriod에 반영
      setVotingPeriod({
        startTime: latestCompetition.start_time,
        endTime: latestCompetition.end_time,
        status: latestCompetition.status
      });

      const { data: videos, error: vidError } = await supabase
        .from('coversong_videos')
        .select('*')
        .eq('competition_id', latestCompetition.id);

      console.log('videos:', videos, vidError);
        const videoArray = Array.isArray(videos) ? videos : [];
        setVideos(videoArray);
        
        // 총 영상 수 설정 (상위 100개만 표시하므로 실제 총 개수)
        setTotalVideoCount(videoArray.length);
        
        // 최신 업데이트 시간 찾기
        if (videoArray.length > 0) {
          const latestUpdate = videoArray.reduce((latest, video) => {
            const videoUpdateTime = new Date(video.updated_at);
            return videoUpdateTime > latest ? videoUpdateTime : latest;
          }, new Date(0));
          setLatestUpdateTime(latestUpdate);
        }
        
        // 순위 데이터 저장 (클라이언트 사이드에서만)
        if (videoArray.length > 0 && typeof window !== 'undefined') {
          saveCurrentRanks(videoArray);
          saveRankHistory(videoArray);
        }
        
        console.log('isLoading:', false, 'videos:', videoArray.length);

        // 발표된 Competition 확인
        await checkAnnouncedCompetition()
        
        // 히스토리 로드
        await loadCompetitionHistory()
        
      } catch (error) {
        console.error('데이터 로드 오류:', error)
      }
    }
    fetchLatestCompetitionAndVideos()
  }, [mounted])

  useEffect(() => {
    console.log('isLoading:', isLoading, 'videos:', videos.length);
  }, [isLoading, videos]);

  // 실시간 좋아요 업데이트 구독
  useEffect(() => {
    if (!videos.length) return

    // 현재 competition_id 가져오기 (첫 번째 비디오에서)
    const competitionId = videos[0]?.competition_id
    if (!competitionId) return

    const channel = supabase
      .channel('video-likes-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'coversong_videos',
          filter: `competition_id=eq.${competitionId}`
        },
        (payload) => {
          // 실시간으로 좋아요 수 업데이트
          setVideos(prev => prev.map(v => 
            v.id === payload.new.id 
              ? { 
                  ...v, 
                  arena_likes: payload.new.arena_likes,
                  guest_likes: payload.new.guest_likes,
                  updated_at: payload.new.updated_at
                }
              : v
          ))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [videos])

  // 메인 타이틀 가져오기
  useEffect(() => {
    if (!mounted) return;
    
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
  }, [mounted]);

  // 주제 변경 핸들러 (Admin에서만 실행 가능)
  const handleTopicChange = (newTopic) => {
    // 일반 사용자는 주제 변경 불가
    alert('주제 변경은 Admin 페이지에서만 가능합니다.')
  }

  // 팝업 닫기
  const handleClosePopup = () => setSelectedVideo(null)
  
  // 필터링 로직
  const getFilteredVideos = () => {
    if (!videos || videos.length === 0) return [];
    
    switch (activeFilter) {
      case 'trending':
        // 최근 업로드된 영상 중 조회수가 높은 것들
        return videos
          .filter(video => video.views > 10000)
          .sort((a, b) => b.views - a.views)
          .slice(0, Math.floor(videos.length * 0.3));
      
      case 'recent':
        // 최근 업로드된 영상들 (created_at 기준)
        return videos
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, Math.floor(videos.length * 0.2));
      
      case 'high-score':
        // 본선 점수가 높은 영상들
        return videos
          .filter(video => video.site_score > 100000)
          .sort((a, b) => b.site_score - a.site_score)
          .slice(0, Math.floor(videos.length * 0.25));
      
      case 'arena-likes':
        // 회원 좋아요가 있는 영상들
        return videos
          .filter(video => video.arena_likes > 0)
          .sort((a, b) => b.arena_likes - a.arena_likes)
          .slice(0, Math.floor(videos.length * 0.15));
      
      default:
        return videos;
    }
  };
  
  const filteredVideos = getFilteredVideos();
  
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
    if (!mounted) return '로딩 중...';
    const now = new Date();
    const endTime = new Date(votingPeriod.endTime);
    const remaining = endTime - now;
    
    if (remaining <= 0) return '종료됨';

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    let result = '';
    if (days > 0) result += `${days}일 `;
    if (hours > 0 || days > 0) result += `${hours}시간 `;
    result += `${minutes}분`;
    return result.trim();
  }

  // 최신 업데이트 시간 포맷팅
  const getLatestUpdateDisplay = () => {
    if (!latestUpdateTime) return '업데이트 정보 없음';
    
    const now = new Date();
    const updateTime = new Date(latestUpdateTime);
    const diffMs = now - updateTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    const formatTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}.${month}.${day} ${hours}:${minutes}`;
    };
    
    if (diffDays > 0) {
      return `${diffDays}일 전 (${formatTime(updateTime)})`;
    } else if (diffHours > 0) {
      return `${diffHours}시간 전 (${formatTime(updateTime)})`;
    } else {
      return `방금 전 (${formatTime(updateTime)})`;
    }
  }

  // 현재 주제 수동 입력 상태 추가
  // const [manualTitle, setManualTitle] = useState('');

  // 1. mainTitle을 먼저 선언
  // const [mainTitle, setMainTitle] = useState('');

  // 2. manualTitle은 필요 없으면 삭제
  // const [manualTitle, setManualTitle] = useState('');

  // 만약 필요하다면 아래처럼 mainTitle 이후에 선언
  // const [manualTitle, setManualTitle] = useState(mainTitle);

  // Arena 좋아요 DB 반영 함수 (로그인/비로그인 구분)
  const handleArenaLike = async (video) => {
    if (user) {
      // 로그인 회원: arena_likes 증가
      const { data, error } = await supabase
        .from('coversong_videos')
        .update({ arena_likes: (video.arena_likes || 0) + 1 })
        .eq('id', video.id);

      if (!error) {
        setVideos(prev =>
          prev.map(v =>
            v.id === video.id
              ? { ...v, arena_likes: (v.arena_likes || 0) + 1 }
              : v
          )
        );
        setSelectedVideo(prev =>
          prev
            ? { ...prev, arena_likes: (prev.arena_likes || 0) + 1 }
            : prev
        );
      } else {
        alert('좋아요 저장에 실패했습니다.');
      }
    } else {
      // 비로그인: Local Storage로 중복 방지
      const guestLikesKey = `guest_likes_${video.id}`;
      const hasLiked = localStorage.getItem(guestLikesKey);
      
      if (hasLiked) {
        alert('이미 좋아요를 누른 영상입니다.');
        return;
      }

      const { data, error } = await supabase
        .from('coversong_videos')
        .update({ guest_likes: (video.guest_likes || 0) + 1 })
        .eq('id', video.id);

      if (!error) {
        // Local Storage에 좋아요 기록 저장
        localStorage.setItem(guestLikesKey, 'true');
        
        setVideos(prev =>
          prev.map(v =>
            v.id === video.id
              ? { ...v, guest_likes: (v.guest_likes || 0) + 1 }
              : v
          )
        );
        setSelectedVideo(prev =>
          prev
            ? { ...prev, guest_likes: (prev.guest_likes || 0) + 1 }
            : prev
        );
      } else {
        alert('좋아요 저장에 실패했습니다.');
      }
    }
  };

  // 날짜/시간 포맷 함수
  function formatDateTime(dt) {
    const d = new Date(dt);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }

  // 총 회원/비회원 좋아요 계산
  const totalArenaLikes = videos.reduce((sum, v) => sum + (v.arena_likes || 0), 0);
  const totalGuestLikes = videos.reduce((sum, v) => sum + (v.guest_likes || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
      <Head>
        <title>{mainTitle || 'Cover Battle Arena 100'}</title>
        <meta name="description" content="Cover Battle Arena 100 - 커버 영상 랭킹 대회" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 최종 순위 발표 이벤트 모달 */}
      {showAnnouncement && announcedCompetition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full mx-4 bg-gradient-to-br from-yellow-900/90 to-orange-900/90 backdrop-blur-md rounded-2xl border-2 border-yellow-500/50 shadow-2xl animate-pulse">
            {/* 닫기 버튼 */}
            <button
              onClick={dismissAnnouncement}
              className="absolute top-4 right-4 text-white hover:text-yellow-300 transition-colors z-10"
            >
              <span className="text-2xl">×</span>
            </button>

            {/* 발표 헤더 */}
            <div className="text-center py-8 px-6">
              <div className="text-6xl mb-4 animate-bounce">🏆</div>
              <h1 className="text-3xl font-bold text-white mb-2 animate-pulse">
                최종 순위 발표!
              </h1>
              <div className="text-xl text-yellow-300 mb-4">
                {announcedCompetition.topic}
              </div>
              <div className="text-sm text-gray-300">
                {new Date(announcedCompetition.updated_at).toLocaleString()} 발표
              </div>
            </div>

            {/* TOP 3 결과 */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {finalResults.slice(0, 3).map((video, index) => (
                  <div
                    key={video.id}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-500 hover:scale-105 ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 border-yellow-400' :
                      index === 1 ? 'bg-gradient-to-br from-gray-600/30 to-gray-800/30 border-gray-400' :
                      'bg-gradient-to-br from-orange-600/30 to-orange-800/30 border-orange-400'
                    }`}
                  >
                    {/* 순위 배지 */}
                    <div className={`absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 ${
                      index === 0 ? 'bg-yellow-500 border-yellow-300' :
                      index === 1 ? 'bg-gray-500 border-gray-300' :
                      'bg-orange-500 border-orange-300'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>

                    {/* 썸네일 */}
                    <div className="mb-3">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* 정보 */}
                    <div className="text-center">
                      <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="text-gray-300 text-xs mb-2">
                        {video.channel}
                      </div>
                      <div className="text-yellow-400 font-bold text-lg">
                        {video.site_score?.toLocaleString()}점
                      </div>
                      <div className="text-gray-400 text-xs">
                        조회수: {video.views?.toLocaleString()} | 좋아요: {video.likes?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 전체 순위 링크 */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setShowAnnouncement(false)
                    // 전체 순위 페이지로 이동 (추후 구현)
                    alert('전체 순위 페이지는 추후 구현 예정입니다!')
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 shadow-lg"
                >
                  🏅 전체 순위 보기
                </button>
              </div>
            </div>

            {/* 하단 안내 */}
            <div className="bg-black bg-opacity-30 p-4 rounded-b-2xl">
              <div className="text-center text-gray-300 text-sm">
                새로운 Competition이 곧 시작됩니다! 🚀
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 기존 헤더 */}
      <Header mainTitle={mainTitle} onTopicChange={handleTopicChange} user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* 상단 통계/상태 영역 */}
        <div className="bg-gray-800 bg-opacity-80 rounded-lg p-4 mb-8 border border-gray-600">
          {/* 상태/시간/기간: 상단 한 줄 */}
          <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className={`text-lg ${mounted && isVotingActive() ? 'text-green-400' : 'text-red-400'}`}>●</span>
              <span className={`font-bold ${mounted && isVotingActive() ? 'text-green-300' : 'text-red-300'}`}>{mounted ? (isVotingActive() ? '투표 진행중' : '투표 종료') : '로딩 중...'}</span>
                </div>
            <div className="text-center">
            <div className="font-bold text-xl text-white">{getRemainingTime()}</div>
              <div className="text-xs text-gray-300">투표 마감까지</div>
            </div>
            <div className="text-xs text-gray-300">
              기간: {formatDateTime(votingPeriod.startTime)} ~ {formatDateTime(votingPeriod.endTime)}
            </div>
          </div>
          {/* 발표된 Competition 결과 섹션 */}
          {announcedCompetition && !showAnnouncement && (
            <div className="mb-8 bg-yellow-900/40 backdrop-blur-sm rounded-lg p-6 border border-yellow-600/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">최종 순위 발표</h2>
                    <p className="text-yellow-300 text-sm">{announcedCompetition.topic}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAnnouncement(true)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-200"
                >
                  🎉 발표 이벤트 보기
                </button>
              </div>

              {/* TOP 3 미리보기 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {finalResults.slice(0, 3).map((video, index) => (
                  <div
                    key={video.id}
                    className="flex items-center space-x-3 p-3 bg-white bg-opacity-10 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {video.title}
                      </div>
                      <div className="text-gray-300 text-xs truncate">
                        {video.channel}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-sm">
                        {video.site_score?.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-xs">점수</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <div className="text-gray-300 text-sm">
                  발표일: {new Date(announcedCompetition.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
          {/* Competition 히스토리 섹션 */}
          {competitionHistory.length > 0 && (
            <div className="mb-8 bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-600 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">📚</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">Competition 히스토리</h2>
                    <p className="text-gray-300 text-sm">지난 대회 결과</p>
                  </div>
                </div>
              </div>

              {historyLoading ? (
                <div className="text-center text-gray-300 py-4">로딩 중...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {competitionHistory.map((history) => (
                    <div
                      key={history.id}
                      className="p-4 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 hover:bg-white hover:bg-opacity-20 transition-colors cursor-pointer"
                      onClick={() => {
                        // 히스토리 상세 보기 (추후 구현)
                        alert(`${history.round_number}회차 - ${history.topic}\n\n` +
                          `🥇 1위: ${history.winner_channel || '미정'} (${history.winner_score?.toLocaleString() || 0}점)\n` +
                          `🥈 2위: ${history.runner_up_channel || '미정'} (${history.runner_up_score?.toLocaleString() || 0}점)\n` +
                          `🥉 3위: ${history.third_place_channel || '미정'} (${history.third_place_score?.toLocaleString() || 0}점)\n\n` +
                          `총 ${history.total_participants || 0}개 영상 참가\n` +
                          `발표일: ${history.announcement_date ? new Date(history.announcement_date).toLocaleDateString() : '미정'}`)
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">🏆</span>
                          <div>
                            <h3 className="text-white font-semibold text-sm">
                              {history.round_number}회차
                            </h3>
                            <div className="text-gray-300 text-xs truncate">
                              {history.topic}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-400 font-bold text-sm">
                            {history.total_participants}개
                          </div>
                          <div className="text-gray-400 text-xs">참가</div>
                        </div>
                      </div>

                      {/* TOP 3 미리보기 */}
                      <div className="space-y-2">
                        {/* 1위 */}
                        {history.winner_channel && (
                          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">🥇</span>
                              <span className="text-yellow-300 text-xs truncate">
                                {history.winner_channel}
                              </span>
                            </div>
                            <span className="text-yellow-400 font-bold text-xs">
                              {history.winner_score?.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {/* 2위 */}
                        {history.runner_up_channel && (
                          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">🥈</span>
                              <span className="text-gray-300 text-xs truncate">
                                {history.runner_up_channel}
                              </span>
                            </div>
                            <span className="text-gray-400 font-bold text-xs">
                              {history.runner_up_score?.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {/* 3위 */}
                        {history.third_place_channel && (
                          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-orange-600/20 to-orange-800/20 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">🥉</span>
                              <span className="text-orange-300 text-xs truncate">
                                {history.third_place_channel}
                              </span>
                            </div>
                            <span className="text-orange-400 font-bold text-xs">
                              {history.third_place_score?.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-white border-opacity-20">
                        <div className="text-gray-400 text-xs text-center">
                          {new Date(history.announcement_date).toLocaleDateString()} 발표
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 전체 히스토리 링크 */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    // 전체 히스토리 페이지로 이동 (추후 구현)
                    alert('전체 히스토리 페이지는 추후 구현 예정입니다!')
                  }}
                  className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                >
                  📚 전체 히스토리 보기
                </button>
              </div>
            </div>
          )}

          {/* 통계 카드 3분할 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 영상 수 */}
            <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-lg py-4 flex flex-col items-center justify-center border border-blue-700/30 shadow-lg">
              <div className="text-3xl font-bold text-white mb-1">🎬 {videos.length}</div>
              <div className="text-gray-300 text-sm">총 영상 수<br/><span className="text-xs">({totalVideoCount}개 중 100개만 표시)</span></div>
            </div>
            {/* Arena 좋아요 */}
                          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg py-4 flex flex-col items-center justify-center border border-gray-600 shadow-lg">
              <div className="text-3xl font-bold text-white mb-1">
                🏆 {totalArenaLikes.toLocaleString()} <span className="ml-2">👤 {totalGuestLikes.toLocaleString()}</span>
              </div>
              <div className="text-gray-300 text-sm">총 Arena 좋아요<br/><span className="text-xs">(회원/비회원)</span></div>
            </div>
            {/* 유튜브 좋아요/조회수 */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-sm rounded-lg py-4 flex flex-col items-center justify-center border border-emerald-700/30 shadow-lg">
              <div className="text-2xl font-bold text-white mb-1">
                👍 {videos.reduce((sum, video) => sum + video.likes, 0).toLocaleString()}
              </div>
              <div className="text-gray-300 text-sm mb-2">유튜브 좋아요</div>
              <div className="text-2xl font-bold text-white mb-1">
                ▶️ {videos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
              </div>
              <div className="text-gray-300 text-sm">유튜브 조회수</div>
            </div>
          </div>
          
          {/* 최신 업데이트 정보 */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-lg border border-green-500/30 shadow-lg">
              <span className="text-green-400 mr-2">🔄</span>
              <span className="text-green-300 text-sm font-medium">
                최신 정보 기준: <span className="text-white font-bold">{getLatestUpdateDisplay()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* TOP 3 영상 섹션 */}
        {videos.length > 0 && (
          <Top3Videos 
            videos={videos} 
            onVideoClick={setSelectedVideo}
          />
        )}

        {/* 순위 급상승 1위 섹션 */}
        {videos.length > 0 && (
          <RisingStarVideo 
            videos={videos} 
            onVideoClick={setSelectedVideo}
          />
        )}

        {/* 순위 변동 요약 */}
        {videos.length > 0 && (
          <RankChangeSummary videos={videos} competitionId={videos[0]?.competition_id} />
        )}

        {/* 필터 옵션 */}
        {videos.length > 0 && (
          <VideoFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            totalVideos={videos.length}
            filteredCount={filteredVideos.length}
          />
        )}

        {/* 뷰 모드 토글 */}
        {videos.length > 0 && (
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-lg p-1 border border-neutral-700/50 shadow-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-neutral-700/50'
                }`}
              >
                📊 표 보기
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-neutral-700/50'
                }`}
              >
                🎯 그리드 보기
              </button>
            </div>
          </div>
        )}

        {/* 영상 목록 (표 또는 그리드) */}
          {videos.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          </div>
        ) : viewMode === 'table' ? (
          <VideoTable videos={filteredVideos} onVideoClick={setSelectedVideo} />
        ) : (
          <div className="mb-16">
            <VideoGrid videos={filteredVideos} setVideos={setVideos} user={user} setSelectedVideo={setSelectedVideo} />
          </div>
          )}

        {/* 그 아래에 주제 제안, 인기 순위 등 */}
        <div className="mt-16" style={{ minHeight: '300px' }}>
          <TopicSuggestionNew />
        </div>

        {/* 산정/업데이트 방식 안내 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          {/* 후보 리스트 산정 방식 */}
          <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-sm rounded-lg py-6 px-4 flex flex-col items-center justify-center border border-blue-700/30 shadow-lg">
            <div className="text-xl font-bold text-white mb-2">📋 예선 점수 산정</div>
            <div className="text-gray-200 text-base mb-2 text-center">
              <span className="font-bold">예선 점수</span><br />
              = 유튜브 조회수 + (유튜브 좋아요 × 가중치)
            </div>
            <div className="text-gray-400 text-xs text-center">
              유튜브 데이터 기준, 상위 300개 후보 선정
            </div>
          </div>
          {/* 최종 랭킹 산정 방식 */}
                      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg py-6 px-4 flex flex-col items-center justify-center border border-gray-600 shadow-lg">
            <div className="text-xl font-bold text-white mb-2">🏆 본선 점수 산정</div>
            <div className="text-gray-200 text-base mb-2 text-center">
              <span className="font-bold">본선 점수</span><br />
              = 예선 점수 + (회원 좋아요 × 높은 가중치) + (비회원 좋아요 × 낮은 가중치)
            </div>
            <div className="text-gray-400 text-xs text-center">
              site_score 기준, 상위 100개만 노출
            </div>
          </div>
          {/* 데이터 업데이트/스크래핑 방식 */}
          <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 backdrop-blur-sm rounded-lg py-6 px-4 flex flex-col items-center justify-center border border-emerald-700/30 shadow-lg">
            <div className="text-xl font-bold text-white mb-2">🔄 데이터 자동 업데이트</div>
            <div className="text-gray-200 text-base mb-2 text-center">
              n8n 워크플로우에서<br />
              YouTube API로 최대 <span className="font-bold">300개</span> 영상 스크랩<br />
              예선 점수 및 본선 점수 계산 후<br />
              DB <span className="font-bold">upsert</span>로 DB 테이블 갱신
            </div>
            <div className="text-gray-400 text-xs text-center">
              업데이트 주기: <span className="font-bold">1일 1회 자동 실행</span><br />
              (규모: 최대 300개 예선, 100개 본선)
            </div>
          </div>
        </div>

        {/* 영상 상세 정보 모달 */}
        <VideoDetailModal
          video={selectedVideo}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          user={user}
          onArenaLike={handleArenaLike}
        />
      </main>
    </div>
  )
} 