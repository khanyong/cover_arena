import { useState, useEffect } from 'react'
import Head from 'next/head'
import ChampionsPodium from '../../components/CoverArena/ChampionsPodium'
import Header from '../../components/CoverArena/Header'
import TopicSuggestionNew from '../../components/CoverArena/TopicSuggestionNew'
import VideoGrid from '../../components/CoverArena/VideoGrid'
import VideoTable from '../../components/CoverArena/VideoTable'
// import Top3Videos from '../../components/CoverArena/Top3Videos'
import VideoFilters from '../../components/CoverArena/VideoFilters'
import VideoDetailModal from '../../components/CoverArena/VideoDetailModal'
import RankChangeSummaryEnhanced from '../../components/CoverArena/RankChangeSummaryEnhanced'
import RisingStarVideo from '../../components/CoverArena/RisingStarVideo'
import Footer from '../../components/CoverArena/Footer'
import VisitorCounter from '../../components/CoverArena/VisitorCounter'
import { auth, supabase } from '../../shared/lib/supabase'
import { saveCurrentRanks, saveRankHistory } from '../../lib/rankTracker'
import {
  useActiveCompetition,
  useCompetitionVideos,
  useMainTitle,
  useCompetitionHistory,
  useAnnouncedCompetition,
  useFinalResults
} from '../../shared/hooks/useCoverArena'
import { useQueryClient } from '@tanstack/react-query'

export default function Home() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [viewMode, setViewMode] = useState('table')
  const [activeFilter, setActiveFilter] = useState('all')
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(false)

  // React Query Hooks
  const { data: mainTitle } = useMainTitle();
  const { data: activeCompetition } = useActiveCompetition();
  const { data: videos = [], isLoading: videosLoading } = useCompetitionVideos(activeCompetition?.id);
  const { data: competitionHistory = [], isLoading: historyLoading } = useCompetitionHistory();
  const { data: announcedCompetition } = useAnnouncedCompetition();
  const { data: finalResults = [] } = useFinalResults(announcedCompetition?.id);

  // Derived State
  const votingPeriod = activeCompetition ? {
    startTime: activeCompetition.start_time,
    endTime: activeCompetition.end_time,
    status: activeCompetition.status
  } : {
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'ended'
  };

  const isVotingActive = () => {
    if (!activeCompetition) return false;
    const now = new Date();
    const start = new Date(votingPeriod.startTime);
    const end = new Date(votingPeriod.endTime);
    return votingPeriod.status === 'active' && now >= start && now <= end;
  };

  // Listen for announcement
  useEffect(() => {
    if (announcedCompetition) {
      const isDismissed = localStorage.getItem(`announcement_${announcedCompetition.id}`);
      if (!isDismissed) {
        setShowAnnouncement(true);
      }
    }
  }, [announcedCompetition]);

  const dismissAnnouncement = () => {
    if (announcedCompetition) {
      localStorage.setItem(`announcement_${announcedCompetition.id}`, 'dismissed')
      setShowAnnouncement(false)
    }
  }

  // Auth State
  useEffect(() => {
    setMounted(true)
    const getCurrentUser = async () => {
      const currentUser = await auth.getCurrentUser()
      setUser(currentUser)
    }
    getCurrentUser()
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Rank Tracking (Side Effect)
  useEffect(() => {
    if (videos.length > 0 && typeof window !== 'undefined') {
      saveCurrentRanks(videos);
      saveRankHistory(videos);
    }
  }, [videos]);

  // Realtime Subscription
  useEffect(() => {
    if (!videos.length || !activeCompetition) return;

    const channel = supabase
      .channel('video-likes-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'coversong_videos',
          filter: `competition_id=eq.${activeCompetition.id}`
        },
        (payload) => {
          // Invalidate query to refetch fresh data or optimistic update
          // For simplicity, validting query is safer
          queryClient.invalidateQueries(['competitionVideos', activeCompetition.id]);
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [videos.length, activeCompetition, queryClient]);


  const getRemainingTime = () => {
    if (!mounted) return '...';
    if (!activeCompetition) return '대기 중';

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

  const getFilteredVideos = () => {
    if (!videos.length) return [];

    // Create a copy to sort
    const v = [...videos];

    switch (activeFilter) {
      case 'trending':
        return v
          .filter(video => video.views > 10000)
          .sort((a, b) => b.views - a.views)
          .slice(0, Math.floor(v.length * 0.3));
      case 'recent':
        return v
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, Math.floor(v.length * 0.2));
      case 'high-score':
        return v
          .filter(video => video.site_score > 100000)
          .sort((a, b) => b.site_score - a.site_score)
          .slice(0, Math.floor(v.length * 0.25));
      case 'arena-likes':
        return v
          .filter(video => video.arena_likes > 0)
          .sort((a, b) => b.arena_likes - a.arena_likes)
          .slice(0, Math.floor(v.length * 0.15));
      default:
        return v;
    }
  };

  const filteredVideos = getFilteredVideos();

  // 날짜 포맷
  const formatDateTime = (dt) => {
    if (!dt) return '';
    const d = new Date(dt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  // 좋아요 핸들러
  const handleArenaLike = async (video) => {
    if (!user) {
      const guestLikesKey = `guest_likes_${video.id}`;
      if (localStorage.getItem(guestLikesKey)) {
        alert('이미 이 영상에 투표하셨습니다.');
        return;
      }
    }

    try {
      const response = await fetch('/api/vote-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: video.id,
          competitionId: video.competition_id,
          userId: user?.id || null,
          likeType: user ? 'arena' : 'guest'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || '오류 발생');
        return;
      }

      if (data.success) {
        if (!user) localStorage.setItem(`guest_likes_${video.id}`, 'true');
        // React Query가 실시간 구독 또는 invalidateQueries로 업데이트 처리함
        // 즉각적인 피드백을 위해 invalidate 호출
        queryClient.invalidateQueries(['competitionVideos', activeCompetition?.id]);
      }
    } catch (e) {
      console.error(e);
      alert('투표 중 오류가 발생했습니다.');
    }
  };

  const handleTopicChange = () => alert('주제 변경은 Admin 페이지에서만 가능합니다.');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
      <Head>
        <title>{mainTitle || 'Cover Battle Arena 100'}</title>
        <meta name="description" content="Cover Battle Arena 100 - 커버 영상 랭킹 대회" />
      </Head>

      {/* Announcement Modal */}
      {showAnnouncement && announcedCompetition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full mx-4 bg-gradient-to-br from-yellow-900/90 to-orange-900/90 backdrop-blur-md rounded-2xl border-2 border-yellow-500/50 shadow-2xl animate-pulse">
            <button onClick={dismissAnnouncement} className="absolute top-4 right-4 text-white hover:text-yellow-300 z-10 text-2xl">×</button>
            <div className="text-center py-8 px-6">
              <div className="text-6xl mb-4 animate-bounce">🏆</div>
              <h1 className="text-3xl font-bold text-white mb-2">최종 순위 발표!</h1>
              <div className="text-xl text-yellow-300 mb-4">{announcedCompetition.topic}</div>
            </div>
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {finalResults.slice(0, 3).map((video, index) => (
                  <div key={video.id} className={`p-4 rounded-xl border-2 ${index === 0 ? 'bg-yellow-600/30 border-yellow-400' : index === 1 ? 'bg-gray-600/30 border-gray-400' : 'bg-orange-600/30 border-orange-400'}`}>
                    <div className="text-white font-bold text-lg mb-2">{index + 1}위</div>
                    <img src={video.thumbnail} className="w-full h-32 object-cover rounded mb-2" />
                    <div className="text-white text-sm truncate">{video.title}</div>
                    <div className="text-yellow-400 font-bold">{video.site_score?.toLocaleString()}점</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Header mainTitle={mainTitle} onTopicChange={handleTopicChange} user={user} />

      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border-b border-purple-600/30">
        <div className="container mx-auto px-4 py-3 text-center text-white">
          <span className="font-bold">⭐ NEW! 회원 평가 시스템 오픈</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 bg-opacity-80 rounded-lg p-4 mb-8 border border-gray-600">
          <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className={`text-lg ${mounted && isVotingActive() ? 'text-green-400' : 'text-red-400'}`}>●</span>
              <span className={`font-bold ${mounted && isVotingActive() ? 'text-green-300' : 'text-red-300'}`}>
                {mounted ? (isVotingActive() ? '투표 진행중' : '투표 종료') : '...'}
              </span>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-white">{getRemainingTime()}</div>
              <div className="text-xs text-gray-300">투표 마감까지</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-xs text-gray-300">
                기간: {formatDateTime(votingPeriod.startTime)} ~ {formatDateTime(votingPeriod.endTime)}
              </div>
              <button onClick={() => setShowHistoryModal(true)} className="px-3 py-1 bg-gray-700 text-white text-xs rounded border border-gray-500">
                📚 지난 대회 결과
              </button>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        {/* 메인 컨텐츠 */}
        <div className="space-y-12">
          {/* 1. 최상단 챔피언스 포디움 (Top 5 Hall of Fame) */}
          <ChampionsPodium
            videos={videos}
            onVideoClick={setSelectedVideo}
            onLike={handleArenaLike}
            isVotingActive={isVotingActive()}
            user={user}
          />

          <div className="space-y-8">
            <RankChangeSummaryEnhanced videos={videos} onVideoClick={setSelectedVideo} />
            <RisingStarVideo videos={videos} onVideoClick={setSelectedVideo} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <VisitorCounter />
            </div>
            <div className="lg:col-span-2">
              <TopicSuggestionNew user={user} />
            </div>
          </div>

          <div id="video-section">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">참가 영상 목록 ({videos.length})</h2>
              <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
                <button onClick={() => setViewMode('table')} className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>📋</button>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>田</button>
              </div>
            </div>

            <VideoFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

            {videosLoading ? (
              <div className="text-center text-white py-10">영상 로딩 중...</div>
            ) : viewMode === 'table' ? (
              <VideoTable videos={filteredVideos} onVideoClick={setSelectedVideo} onLike={handleArenaLike} />
            ) : (
              <VideoGrid videos={filteredVideos} onVideoClick={setSelectedVideo} />
            )}
          </div>
        </div>
      </main>

      <Footer />

      {selectedVideo && (
        <VideoDetailModal
          video={selectedVideo}
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          user={user}
          onArenaLike={handleArenaLike}
        />
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowHistoryModal(false)}>
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">지난 대회 기록</h2>
            <div className="space-y-2">
              {competitionHistory.map(comp => (
                <div key={comp.id} className="bg-gray-700 p-3 rounded flex justify-between text-white">
                  <span>{comp.topic}</span>
                  <span className="text-sm text-gray-400">{new Date(comp.end_time).toLocaleDateString()} 종료</span>
                </div>
              ))}
              {competitionHistory.length === 0 && <p className="text-gray-400">기록이 없습니다.</p>}
            </div>
            <button onClick={() => setShowHistoryModal(false)} className="mt-4 w-full py-2 bg-gray-600 text-white rounded">닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}