import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { auth, topics, competitions, supabase } from '../lib/supabase'
import { searchVideosByTopic } from '../lib/youtube'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // 투표 기간 관리 상태
  const [votingPeriod, setVotingPeriod] = useState({
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'active' // 'preparing', 'active', 'ended'
  })
  
  // 주제 제안 상태
  const [suggestedTopics, setSuggestedTopics] = useState([])
  
  // 새 주제 입력
  const [newTopic, setNewTopic] = useState('')
  
  // 투표 결과 (실제로는 API에서 가져옴)
  const [votingResults, setVotingResults] = useState([])
  
  // 현재 주제 수동 입력 상태 추가
  const [manualTopic, setManualTopic] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  useEffect(() => {
    // 최초 로드 시 main_title fetch
    async function fetchMainTitle() {
      const { data } = await supabase
        .from('coversong_config')
        .select('value')
        .eq('key', 'main_title')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) setManualTopic(data.value);
    }
    fetchMainTitle();
  }, []);
  const handleManualTopicSave = async () => {
    const { error } = await supabase
      .from('coversong_config')
      .insert({ key: 'main_title', value: manualTopic });
    if (error) {
      alert('저장 실패: ' + error.message);
      console.log(error);
    } else {
      alert('메인 타이틀이 저장되었습니다!');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      console.log('인증 체크 시작');
      const currentUser = await auth.getCurrentUser();
      console.log('currentUser:', currentUser);
      setUser(currentUser)
      
      // Admin 권한 체크 - Supabase에서 실제 admin 권한 확인
      if (currentUser) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', currentUser.id)
            .single()
          
          if (profile && profile.is_admin) {
            setIsAuthenticated(true)
            // Admin 인증 후 주제 제안 로드
            loadSuggestedTopics()
          }
        } catch (error) {
          console.error('Admin 권한 확인 오류:', error)
        }
      }
      
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  // 주제 제안 로드
  const loadSuggestedTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('coversong_topics')
        .select('*')
        .order('votes_count', { ascending: false })
      
      if (error) {
        console.error('주제 로드 오류:', error)
      } else {
        setSuggestedTopics(data || [])
      }
    } catch (error) {
      console.error('주제 로드 오류:', error)
    }
  }

  const handleVotingPeriodChange = (field, value) => {
    setVotingPeriod(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStatusChange = (status) => {
    setVotingPeriod(prev => ({
      ...prev,
      status
    }))
  }

  const handleAddTopic = async (e) => {
    e.preventDefault()
    if (newTopic.trim()) {
      try {
        const { data, error } = await supabase
          .from('coversong_topics')
          .insert([{ 
            topic: newTopic.trim(), 
            votes_count: 0 
          }])
          .select()
        
        if (error) {
          alert('주제 추가에 실패했습니다: ' + error.message)
        } else {
          setNewTopic('')
          loadSuggestedTopics() // 목록 새로고침
        }
      } catch (error) {
        alert('주제 추가 중 오류가 발생했습니다.')
      }
    }
  }

  const handleDeleteTopic = async (id) => {
    try {
      const { error } = await supabase
        .from('coversong_topics')
        .delete()
        .eq('id', id)
      
      if (error) {
        alert('주제 삭제에 실패했습니다: ' + error.message)
      } else {
        loadSuggestedTopics() // 목록 새로고침
      }
    } catch (error) {
      alert('주제 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleVoteChange = async (id, newVotes) => {
    try {
      const { error } = await supabase
        .from('coversong_topics')
        .update({ votes_count: Math.max(0, newVotes) })
        .eq('id', id)
      
      if (error) {
        alert('투표 수 변경에 실패했습니다: ' + error.message)
      } else {
        loadSuggestedTopics() // 목록 새로고침
      }
    } catch (error) {
      alert('투표 수 변경 중 오류가 발생했습니다.')
    }
  }

  const handleAnnounceResults = () => {
    // 실제로는 API 호출하여 결과 발표
    alert('최종 순위가 발표되었습니다!')
    // 결과 페이지로 이동하거나 모달 표시
  }
  
  // 3. 복수 주제 실행 핸들러
  const handleExecuteTopics = async () => {
    if (!selectedTopics.length) {
      alert('실행할 주제를 1개 이상 선택해주세요.');
      return;
    }
    const confirmed = confirm(`선택된 ${selectedTopics.length}개 주제로 스크랩을 실행하시겠습니까?\n\n이 작업은 몇 분 정도 소요될 수 있습니다.`);
    if (!confirmed) return;
    setIsScraping(true);
    try {
      // 1. competition 생성
      const { data: compData, error: compError } = await supabase
        .from('coversong_competitions')
        .insert({
          topic: selectedTopics.join(', '), // 선택된 주제를 topic 필드에 저장
          start_time: votingPeriod.startTime,
          end_time: votingPeriod.endTime,
          status: votingPeriod.status
        })
        .select()
        .single();
      if (compError || !compData) {
        alert('Competition 생성 실패: ' + (compError?.message || '')); return;
      }
      const competitionId = compData.id;
      // 2. coversong_competition_topics에 연결
      const topicRows = selectedTopics.map(topic => ({ competition_id: competitionId, topic }));
      const { error: topicError } = await supabase
        .from('coversong_competition_topics')
        .insert(topicRows);
      if (topicError) {
        alert('competition_topics 저장 실패: ' + topicError.message); return;
      }
      // 3. 각 topic별 영상 스크랩 및 저장
      let totalVideos = 0;
      for (let i = 0; i < selectedTopics.length; i++) {
        const topic = selectedTopics[i];
        console.log(`[스크랩] ${i+1}/${selectedTopics.length}:`, topic); // 반복 로그 추가
        let videos = await searchVideosByTopic(topic, 200);
        videos = videos.slice(0, 100);
        const videoRows = videos.map(v => ({
          id: v.id,
          title: v.title,
          channel: v.channel,
          thumbnail: v.thumbnail,
          youtube_id: v.youtubeId,
          views: v.views,
          likes: v.likes,
          arena_likes: 0,
          topic,
          competition_id: competitionId
        }));
        const { error: videoError } = await supabase
          .from('coversong_videos')
          .upsert(videoRows, { onConflict: ['id'] });
        if (videoError) {
          alert(`'${topic}' 영상 저장 실패: ` + videoError.message); return;
        }
        totalVideos += videoRows.length;
      }
      alert(`스크랩 완료!\n총 ${selectedTopics.length}개 주제, ${totalVideos}개 영상이 저장되었습니다.`);
      window.location.href = `/?competition_id=${competitionId}`;
    } catch (error) {
      alert('스크랩 실행 중 오류: ' + error.message);
    } finally {
      setIsScraping(false);
    }
  };

    if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Head>
          <title>Admin - Cover Battle Arena 100</title>
        </Head>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 w-96">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            🔐 Admin 접근 제한
          </h1>

          <div className="text-center text-gray-300 mb-6">
            <p>Admin 페이지에 접근하려면 관리자 권한이 필요합니다.</p>
          </div>

          <div className="space-y-4">
            <a
              href="/auth"
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              로그인하기
            </a>
            <Link href="/" className="block text-center text-gray-300 hover:text-white">
              ← 메인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Head>
        <title>Admin - Cover Battle Arena 100</title>
      </Head>
      
      {/* 헤더 */}
      <header className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-white border-opacity-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">👨‍💼</div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-gray-300">Cover Battle Arena 100 관리</p>
              </div>
            </div>
                                    <div className="flex items-center space-x-4">
                          <Link href="/" className="text-gray-300 hover:text-white">
                            메인 페이지
                          </Link>
                          <button
                            onClick={() => auth.signOut()}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            로그아웃
                          </button>
                        </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 현재 주제 및 실행 */}
        <div className="mb-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">🎯 현재 주제 관리</h2>
          
          <div className="space-y-4">
            {/* 현재 주제 수동 입력 UI */}
            <div className="mb-4 flex items-center gap-2">
              <input
                type="text"
                value={manualTopic}
                onChange={e => setManualTopic(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="현재 주제 직접 입력"
                style={{ minWidth: 200 }}
              />
              <button
                onClick={handleManualTopicSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                저장
              </button>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">현재 주제</label>
              <div className="text-white font-semibold text-lg">{manualTopic}</div>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2">새 주제 실행</label>
              {/* 2. 멀티 셀렉트 UI로 변경 */}
              <div className="mb-2 flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setSelectedTopics(suggestedTopics.slice(0, 3).map(t => t.topic))}
                  className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                  disabled={isScraping || suggestedTopics.length < 3}
                >
                  인기 TOP 3 전체 선택
                </button>
                {suggestedTopics.map((item, idx) => (
                  <label key={item.id} className="flex items-center space-x-2 bg-white bg-opacity-10 rounded px-3 py-2">
                    <input
                      type="checkbox"
                      value={item.topic}
                      checked={selectedTopics.includes(item.topic)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedTopics([...selectedTopics, item.topic]);
                        } else {
                          setSelectedTopics(selectedTopics.filter(t => t !== item.topic));
                        }
                      }}
                      disabled={isScraping}
                      className="accent-blue-500"
                    />
                    <span className="text-white">
                      {idx < 3 && <span className="text-yellow-400 mr-1">🔥</span>}
                      {item.topic} ({item.votes_count}표)
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleExecuteTopics}
                  disabled={isScraping || selectedTopics.length === 0}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isScraping
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : selectedTopics.length
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isScraping ? '🔄 스크랩 중...' : '🚀 실행'}
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-300">
              💡 주제를 선택하면 YouTube에서 해당 주제의 커버 영상을 스크랩하여 Competition을 시작합니다.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 투표 기간 관리 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">⏰ 투표 기간 관리</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">시작 시간</label>
                <input
                  type="datetime-local"
                  value={votingPeriod.startTime.slice(0, 16)}
                  onChange={(e) => handleVotingPeriodChange('startTime', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">종료 시간</label>
                <input
                  type="datetime-local"
                  value={votingPeriod.endTime.slice(0, 16)}
                  onChange={(e) => handleVotingPeriodChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">상태</label>
                <select
                  value={votingPeriod.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="preparing">준비중</option>
                  <option value="active">진행중</option>
                  <option value="ended">종료됨</option>
                </select>
              </div>
              
              <div className="pt-4">
                <div className="text-sm text-gray-300">
                  현재 상태: <span className="text-white font-semibold">{votingPeriod.status}</span>
                </div>
                <div className="text-sm text-gray-300">
                  시작: {new Date(votingPeriod.startTime).toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">
                  종료: {new Date(votingPeriod.endTime).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* 주제 제안 관리 */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">📝 주제 제안 관리</h2>
            
            {/* 새 주제 추가 */}
            <form onSubmit={handleAddTopic} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="새 주제 입력"
                  className="flex-1 px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  추가
                </button>
              </div>
            </form>
            
            {/* 주제 목록 */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {suggestedTopics.map((item, index) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-yellow-400 w-6">
                      {index + 1}
                    </span>
                    <span className="text-white text-sm">{item.topic}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={item.votes_count}
                      onChange={(e) => handleVoteChange(item.id, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 rounded bg-white bg-opacity-20 text-white text-sm border border-white border-opacity-30"
                    />
                    <button
                      onClick={() => handleDeleteTopic(item.id)}
                      className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 최종 순위 발표 */}
        <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">🏆 최종 순위 발표</h2>
          
          <div className="flex items-center justify-between">
            <div className="text-gray-300">
              투표 기간이 종료되면 최종 순위를 발표할 수 있습니다.
            </div>
            <button
              onClick={handleAnnounceResults}
              disabled={votingPeriod.status !== 'ended'}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                votingPeriod.status === 'ended'
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              최종 순위 발표
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 