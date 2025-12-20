import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { auth, topics, competitions, supabase } from '../shared/lib/supabase'
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

  // 회원 관리 상태 추가
  const [users, setUsers] = useState([])
  const [userLoading, setUserLoading] = useState(false)
  const [userFilter, setUserFilter] = useState('all') // 'all', 'pending', 'approved', 'rejected'

  // 최종 순위 발표 기능 추가
  const [currentCompetition, setCurrentCompetition] = useState(null)
  const [finalResults, setFinalResults] = useState([])
  const [isAnnouncing, setIsAnnouncing] = useState(false)

  // Competition 히스토리 상태 추가
  const [competitionHistory, setCompetitionHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // 영상 차단 관리 상태 추가
  const [blockedVideos, setBlockedVideos] = useState([])
  const [videoSearchQuery, setVideoSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedVideosForBlock, setSelectedVideosForBlock] = useState([]) // 선택된 영상들

  // 채널 차단 관리 상태 추가
  const [blockedChannels, setBlockedChannels] = useState([])
  const [channelSearchQuery, setChannelSearchQuery] = useState('')
  const [channelToBlock, setChannelToBlock] = useState('')
  const [channelIdToBlock, setChannelIdToBlock] = useState('')  // 채널 ID 추가
  const [blockReason, setBlockReason] = useState('')
  const [blockTab, setBlockTab] = useState('videos') // 'videos' or 'channels'

  useEffect(() => {
    // 최초 로드 시 main_title fetch
    async function fetchMainTitle() {
      try {
        const { data, error } = await supabase
          .from('coversong_config')
          .select('value')
          .eq('key', 'main_title')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        if (data) setManualTopic(data.value);
      } catch (error) {
        console.error('Error fetching main title:', error);
      }
    }
    fetchMainTitle();
  }, []);
  const handleManualTopicSave = async () => {
    try {
      const response = await fetch('/api/update-main-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, mainTitle: manualTopic })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '저장 실패');
      }
      alert('메인 타이틀이 저장되었습니다!');
    } catch (error) {
      alert('저장 실패: ' + error.message);
      console.error(error);
    }
  };

  // 회원 목록 로드
  const loadUsers = async () => {
    setUserLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('회원 로드 오류:', error)
        alert('회원 목록을 불러오는데 실패했습니다: ' + error.message)
      } else {
        setUsers(data || [])
      }
    } catch (error) {
      console.error('회원 로드 오류:', error)
      alert('회원 목록을 불러오는데 실패했습니다.')
    } finally {
      setUserLoading(false)
    }
  }

  // 회원 승인/거부 처리
  const handleUserApproval = async (userId, approved, status) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          approved: approved,
          status: status, // 'active' 또는 'rejected'
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        alert('회원 상태 변경에 실패했습니다: ' + error.message)
      } else {
        alert('회원 상태가 변경되었습니다.')
        loadUsers() // 목록 새로고침
      }
    } catch (error) {
      alert('회원 상태 변경 중 오류가 발생했습니다.')
    }
  }

  // 회원 상태 변경
  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          status: newStatus, // 'active', 'rejected', 'suspended'
          approved: newStatus === 'active', // active일 때만 approved = true
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        alert('회원 상태 변경에 실패했습니다: ' + error.message)
      } else {
        alert('회원 상태가 변경되었습니다.')
        loadUsers() // 목록 새로고침
      }
    } catch (error) {
      alert('회원 상태 변경 중 오류가 발생했습니다.')
    }
  }

  // 필터링된 회원 목록
  const getFilteredUsers = () => {
    if (userFilter === 'all') return users
    return users.filter(user => user.status === userFilter)
  }

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

  // 최종 순위 발표 (기존 테이블 사용)
  const handleAnnounceResults = async () => {
    if (!currentCompetition) {
      alert('현재 진행 중인 Competition이 없습니다.')
      return
    }

    const confirmed = window.confirm(
      `"${currentCompetition.topic}" Competition의 최종 순위를 발표하시겠습니까?\n\n` +
      '이 작업은 되돌릴 수 없습니다.'
    )

    if (!confirmed) return

    setIsAnnouncing(true)

    try {
      // 1. 최종 결과 계산
      const { data: finalResults, error: resultsError } = await supabase
        .from('coversong_videos')
        .select('*')
        .eq('competition_id', currentCompetition.id)
        .order('site_score', { ascending: false })
        .limit(100)

      if (resultsError) throw resultsError

      // 2. final_rank 업데이트
      const updatePromises = finalResults.map((video, index) =>
        supabase
          .from('coversong_videos')
          .update({ final_rank: index + 1 })
          .eq('id', video.id)
      )

      await Promise.all(updatePromises)

      // 3. Competition 결과 자동 업데이트 (PostgreSQL 함수 호출)
      const { data: roundNumber, error: updateError } = await supabase
        .rpc('update_competition_results', {
          p_competition_id: currentCompetition.id
        })

      if (updateError) {
        console.error('Competition 업데이트 오류:', updateError)
        throw updateError
      }

      // 4. 성공 메시지
      const top3 = finalResults.slice(0, 3)
      const message = `🏆 ${roundNumber}회차 최종 순위 발표 완료!\n\n` +
        `주제: ${currentCompetition.topic}\n\n` +
        `1위: ${top3[0]?.channel} (${top3[0]?.site_score?.toLocaleString()}점)\n` +
        `2위: ${top3[1]?.channel} (${top3[1]?.site_score?.toLocaleString()}점)\n` +
        `3위: ${top3[2]?.channel} (${top3[2]?.site_score?.toLocaleString()}점)\n\n` +
        `총 ${finalResults.length}개 영상 참가`

      alert(message)

      // 5. 상태 업데이트
      setCurrentCompetition(null)
      setFinalResults([])
      await loadCompetitionHistory() // 히스토리 새로고침

    } catch (error) {
      console.error('발표 오류:', error)
      alert('발표 중 오류가 발생했습니다: ' + error.message)
    } finally {
      setIsAnnouncing(false)
    }
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
      // 0. 기존 Active Competition 종료 (API 호출)
      await fetch('/api/close-active-competitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      // 1. competition 생성
      const currentStartTime = new Date().toISOString(); // 현재 시간으로 강제 업데이트 (페이지 로드 시점 시간 방지)

      const { data: compData, error: compError } = await supabase
        .from('coversong_competitions')
        .insert({
          topic: selectedTopics.join(', '), // 선택된 주제를 topic 필드에 저장
          start_time: currentStartTime,
          end_time: votingPeriod.endTime, // 종료 시간은 유지 (필요시 이것도 재계산 가능)
          status: 'active' // 명시적으로 active 설정
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
        console.log(`[스크랩] ${i + 1}/${selectedTopics.length}:`, topic); // 반복 로그 추가
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
      // 4. 메인 타이틀 업데이트 (API 호출)
      const newMainTitle = selectedTopics.join(', ');
      try {
        const configResponse = await fetch('/api/update-main-title', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, mainTitle: newMainTitle })
        });

        if (configResponse.ok) {
          setManualTopic(newMainTitle);
        } else {
          console.error('메인 타이틀 업데이트 실패:', await configResponse.json());
        }
      } catch (err) {
        console.error('메인 타이틀 업데이트 오류:', err);
      }

      alert(`스크랩 완료!\n총 ${selectedTopics.length}개 주제, ${totalVideos}개 영상이 저장되었습니다.\n메인 타이틀이 "${newMainTitle}"(으)로 변경되었습니다.`);
      window.location.href = `/?competition_id=${competitionId}`;
    } catch (error) {
      alert('스크랩 실행 중 오류: ' + error.message);
    } finally {
      setIsScraping(false);
    }
  };

  // 현재 Competition 로드
  const loadCurrentCompetition = async () => {
    try {
      const { data, error } = await supabase
        .from('coversong_competitions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Competition 로드 오류:', error)
      } else if (data) {
        setCurrentCompetition(data)
        // 최종 결과 미리 계산
        await calculateFinalResults(data.id)
      }
    } catch (error) {
      console.error('Competition 로드 오류:', error)
    }
  }

  // 최종 결과 계산
  const calculateFinalResults = async (competitionId) => {
    try {
      const { data, error } = await supabase
        .from('coversong_videos')
        .select('*')
        .eq('competition_id', competitionId)
        .order('site_score', { ascending: false })
        .limit(100)

      if (error) {
        console.error('결과 계산 오류:', error)
      } else {
        const results = data.map((video, index) => ({
          ...video,
          final_rank: index + 1
        }))
        setFinalResults(results)
      }
    } catch (error) {
      console.error('결과 계산 오류:', error)
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
        .limit(20)

      if (!error && data) {
        setCompetitionHistory(data)
      }
    } catch (error) {
      console.error('히스토리 로드 오류:', error)
    } finally {
      setHistoryLoading(false)
    }
  }

  // 차단된 영상 목록 로드
  const loadBlockedVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('coversong_blocked_videos')
        .select('*')
        .eq('is_active', true)
        .order('blocked_at', { ascending: false })

      if (!error && data) {
        setBlockedVideos(data)
      }
    } catch (error) {
      console.error('차단 목록 로드 오류:', error)
    }
  }

  // 차단된 채널 목록 로드
  const loadBlockedChannels = async () => {
    try {
      const response = await fetch('/api/blocked-channels')
      const data = await response.json()
      setBlockedChannels(data.blockedChannels || [])
    } catch (error) {
      console.error('차단된 채널 로드 오류:', error)
    }
  }

  // 영상 검색
  const searchVideos = async () => {
    if (!videoSearchQuery.trim()) return

    setIsSearching(true)
    setSelectedVideosForBlock([]) // 검색 시 선택 초기화
    try {
      // 먼저 차단된 영상 목록 가져오기
      const { data: blockedData } = await supabase
        .from('coversong_blocked_videos')
        .select('youtube_id')
        .eq('is_active', true)

      const blockedYoutubeIds = blockedData ? blockedData.map(b => b.youtube_id) : []

      // 영상 검색
      const { data, error } = await supabase
        .from('coversong_videos')
        .select('*')
        .or(`title.ilike.%${videoSearchQuery}%,channel.ilike.%${videoSearchQuery}%,youtube_id.ilike.%${videoSearchQuery}%`)
        .limit(50) // 더 많이 가져온 후 필터링

      if (!error && data) {
        // 차단된 영상 제외
        const filteredResults = data.filter(video =>
          !blockedYoutubeIds.includes(video.youtube_id)
        ).slice(0, 20) // 최종적으로 20개만 표시

        setSearchResults(filteredResults)
      }
    } catch (error) {
      console.error('영상 검색 오류:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // 영상 차단
  const blockVideo = async (youtubeId, title, reason) => {
    try {
      const { error } = await supabase
        .from('coversong_blocked_videos')
        .insert({
          youtube_id: youtubeId,
          reason: reason || `${title} - 관리자에 의해 차단됨`,
          blocked_by: user?.id
        })

      if (error) {
        if (error.code === '23505') {
          alert('이미 차단된 영상입니다.')
        } else {
          alert('영상 차단에 실패했습니다: ' + error.message)
        }
      } else {
        alert('영상이 차단되었습니다.')
        loadBlockedVideos()
        setSearchResults([])
        setVideoSearchQuery('')
      }
    } catch (error) {
      alert('영상 차단 중 오류가 발생했습니다.')
    }
  }

  // 영상 차단 해제
  const unblockVideo = async (id) => {
    try {
      const { error } = await supabase
        .from('coversong_blocked_videos')
        .update({
          is_active: false,
          unblocked_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        alert('차단 해제에 실패했습니다: ' + error.message)
      } else {
        alert('차단이 해제되었습니다.')
        loadBlockedVideos()
      }
    } catch (error) {
      alert('차단 해제 중 오류가 발생했습니다.')
    }
  }

  // 일괄 차단
  const blockSelectedVideos = async () => {
    if (selectedVideosForBlock.length === 0) {
      alert('차단할 영상을 선택해주세요.')
      return
    }

    const confirmed = window.confirm(
      `선택한 ${selectedVideosForBlock.length}개 영상을 차단하시겠습니까?`
    )
    if (!confirmed) return

    try {
      const blockPromises = selectedVideosForBlock.map(video =>
        supabase
          .from('coversong_blocked_videos')
          .insert({
            youtube_id: video.youtube_id,
            reason: `${video.title} - 관리자에 의해 일괄 차단됨`,
            blocked_by: user?.id
          })
      )

      const results = await Promise.allSettled(blockPromises)
      const successCount = results.filter(r => r.status === 'fulfilled').length
      const failCount = results.filter(r => r.status === 'rejected').length

      alert(`차단 완료: ${successCount}개 성공${failCount > 0 ? `, ${failCount}개 실패` : ''}`)

      loadBlockedVideos()
      setSearchResults([])
      setSelectedVideosForBlock([])
      setVideoSearchQuery('')
    } catch (error) {
      alert('일괄 차단 중 오류가 발생했습니다.')
    }
  }

  // 체크박스 토글
  const toggleVideoSelection = (video) => {
    setSelectedVideosForBlock(prev => {
      const isSelected = prev.some(v => v.id === video.id)
      if (isSelected) {
        return prev.filter(v => v.id !== video.id)
      } else {
        return [...prev, video]
      }
    })
  }

  // 채널 차단
  const blockChannel = async () => {
    if (!channelToBlock.trim() && !channelIdToBlock.trim()) {
      alert('차단할 채널명 또는 채널 ID를 입력해주세요.')
      return
    }

    try {
      const response = await fetch('/api/blocked-channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel_name: channelToBlock.trim() || null,
          channel_id: channelIdToBlock.trim() || null,
          reason: blockReason.trim() || `채널 차단 - 관리자에 의해 차단됨`,
          user_id: user?.id
        })
      })

      const result = await response.json()

      if (response.ok) {
        const blockedName = channelToBlock || channelIdToBlock;
        alert(`채널 "${blockedName}"이(가) 차단되었습니다.`)
        setChannelToBlock('')
        setChannelIdToBlock('')
        setBlockReason('')
        loadBlockedChannels()
      } else {
        console.error('Channel block error:', result);
        const errorMsg = result.details
          ? `채널 차단 실패: ${result.details}`
          : (result.error || '채널 차단에 실패했습니다.');
        alert(errorMsg);
      }
    } catch (error) {
      console.error('채널 차단 오류:', error)
      alert('채널 차단 중 오류가 발생했습니다.')
    }
  }

  // 채널 차단 해제
  const unblockChannel = async (channelIdentifier) => {
    try {
      // channelIdentifier가 채널명인지 채널ID인지 판단
      const isChannelId = channelIdentifier && channelIdentifier.startsWith('UC');

      const response = await fetch('/api/blocked-channels', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isChannelId
            ? { channel_id: channelIdentifier }
            : { channel_name: channelIdentifier }
        )
      })

      if (response.ok) {
        alert(`채널 "${channelIdentifier}"의 차단이 해제되었습니다.`)
        loadBlockedChannels()
      } else {
        alert('채널 차단 해제에 실패했습니다.')
      }
    } catch (error) {
      console.error('채널 차단 해제 오류:', error)
      alert('차단 해제 중 오류가 발생했습니다.')
    }
  }

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedVideosForBlock.length === searchResults.length) {
      setSelectedVideosForBlock([])
    } else {
      setSelectedVideosForBlock(searchResults)
    }
  }



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
            // Admin 인증 후 데이터 로드
            loadSuggestedTopics()
            loadUsers()
            loadCurrentCompetition()
            loadCompetitionHistory() // 히스토리 로드 추가
            loadBlockedVideos() // 차단 목록 로드 추가
            loadBlockedChannels() // 채널 차단 목록 로드 추가
          }
        } catch (error) {
          console.error('Admin 권한 확인 오류:', error)
        }
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

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
        {/* 통합된 주제 및 투표 관리 */}
        <div className="mb-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">🎯 주제 및 투표 관리</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 왼쪽: 주제 선택 및 현재 주제 */}
            <div className="space-y-6">
              {/* 현재 주제 표시 */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">현재 진행 중인 주제</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualTopic}
                    onChange={(e) => setManualTopic(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="메인 타이틀 입력"
                  />
                  <button
                    onClick={handleManualTopicSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    저장
                  </button>
                </div>
              </div>

              {/* 새 주제 선택 */}
              <div>
                <label className="block text-gray-300 text-sm mb-3">새 주제 선택 (실행할 주제)</label>

                {/* 빠른 선택 버튼 */}
                <div className="mb-3">
                  <button
                    onClick={() => setSelectedTopics(suggestedTopics.slice(0, 3).map(t => t.topic))}
                    className="px-3 py-2 bg-yellow-500 text-white rounded-lg mr-2 hover:bg-yellow-600 transition-colors"
                    disabled={isScraping || suggestedTopics.length < 3}
                  >
                    🔥 인기 TOP 3 전체 선택
                  </button>
                  <button
                    onClick={() => setSelectedTopics([])}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={isScraping}
                  >
                    선택 해제
                  </button>
                </div>

                {/* 주제 목록 */}
                <div className="space-y-2 max-h-48 overflow-y-auto bg-white bg-opacity-5 rounded-lg p-3">
                  {suggestedTopics.length === 0 ? (
                    <div className="text-center text-gray-300 py-4">제안된 주제가 없습니다.</div>
                  ) : (
                    suggestedTopics.map((item, idx) => (
                      <label key={item.id} className="flex items-center space-x-3 p-2 bg-white bg-opacity-10 rounded hover:bg-white hover:bg-opacity-20 transition-colors">
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
                        <div className="flex-1">
                          <span className="text-white text-sm">
                            {idx < 3 && <span className="text-yellow-400 mr-1">🔥</span>}
                            {item.topic}
                          </span>
                          <div className="text-gray-300 text-xs">({item.votes_count}표)</div>
                        </div>
                      </label>
                    ))
                  )}
                </div>

                {/* 선택된 주제 표시 */}
                {selectedTopics.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-600 bg-opacity-20 rounded-lg border border-blue-500 border-opacity-30">
                    <div className="text-blue-300 text-sm font-semibold mb-2">선택된 주제 ({selectedTopics.length}개):</div>
                    <div className="text-white text-sm">
                      {selectedTopics.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽: 투표 기간 설정 */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm mb-3">투표 기간 설정</label>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-xs mb-1">시작 시간</label>
                    <input
                      type="datetime-local"
                      value={votingPeriod.startTime.slice(0, 16)}
                      onChange={(e) => handleVotingPeriodChange('startTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-xs mb-1">종료 시간</label>
                    <input
                      type="datetime-local"
                      value={votingPeriod.endTime.slice(0, 16)}
                      onChange={(e) => handleVotingPeriodChange('endTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-xs mb-1">상태</label>
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
                </div>

                {/* 현재 설정 미리보기 */}
                <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg">
                  <div className="text-gray-300 text-xs mb-2">설정 미리보기:</div>
                  <div className="text-white text-sm space-y-1">
                    <div>상태: <span className="font-semibold">{votingPeriod.status}</span></div>
                    <div>시작: <span className="font-semibold">{new Date(votingPeriod.startTime).toLocaleString()}</span></div>
                    <div>종료: <span className="font-semibold">{new Date(votingPeriod.endTime).toLocaleString()}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 실행 버튼 (하단 중앙) */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4">
              <button
                onClick={handleExecuteTopics}
                disabled={isScraping || selectedTopics.length === 0}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${isScraping
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : selectedTopics.length
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
              >
                {isScraping ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">🔄</span>
                    스크랩 중...
                  </span>
                ) : (
                  <span className="flex items-center">
                    🚀 주제 실행 및 Competition 시작
                  </span>
                )}
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-300 max-w-2xl mx-auto">
              💡 <strong>프로세스:</strong> 주제를 선택하고 투표 기간을 설정한 후 실행하면,
              YouTube에서 해당 주제의 커버 영상을 스크랩하여 새로운 Competition을 시작합니다.
            </div>
          </div>
        </div>

        {/* Competition 히스토리 */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">🏆 Competition 히스토리</h2>

          {historyLoading ? (
            <div className="text-center text-gray-300 py-4">로딩 중...</div>
          ) : competitionHistory.length === 0 ? (
            <div className="text-center text-gray-300 py-4">아직 발표된 Competition이 없습니다.</div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {competitionHistory.map((history) => (
                <div
                  key={history.id}
                  className="p-4 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <h3 className="text-white font-semibold">
                          {history.id}회차 - {history.topic}
                        </h3>
                        <div className="text-gray-300 text-sm">
                          {new Date(history.announcement_date).toLocaleDateString()} 발표
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-lg">
                        {history.total_participants}개 영상
                      </div>
                      <div className="text-gray-400 text-xs">참가</div>
                    </div>
                  </div>

                  {/* TOP 3 결과 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* 1위 */}
                    {history.winner_video_id && (
                      <div className="p-3 bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 rounded-lg border border-yellow-400/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🥇</span>
                          <span className="text-white font-semibold text-sm">1위</span>
                        </div>
                        <div className="text-yellow-300 text-sm font-medium truncate">
                          {history.winner_channel}
                        </div>
                        <div className="text-yellow-400 font-bold">
                          {history.winner_score?.toLocaleString()}점
                        </div>
                      </div>
                    )}

                    {/* 2위 */}
                    {history.runner_up_video_id && (
                      <div className="p-3 bg-gradient-to-br from-gray-600/30 to-gray-800/30 rounded-lg border border-gray-400/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🥈</span>
                          <span className="text-white font-semibold text-sm">2위</span>
                        </div>
                        <div className="text-gray-300 text-sm font-medium truncate">
                          {history.runner_up_channel}
                        </div>
                        <div className="text-gray-400 font-bold">
                          {history.runner_up_score?.toLocaleString()}점
                        </div>
                      </div>
                    )}

                    {/* 3위 */}
                    {history.third_place_video_id && (
                      <div className="p-3 bg-gradient-to-br from-orange-600/30 to-orange-800/30 rounded-lg border border-orange-400/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">🥉</span>
                          <span className="text-white font-semibold text-sm">3위</span>
                        </div>
                        <div className="text-orange-300 text-sm font-medium truncate">
                          {history.third_place_channel}
                        </div>
                        <div className="text-orange-400 font-bold">
                          {history.third_place_score?.toLocaleString()}점
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 기간 정보 */}
                  <div className="mt-3 pt-3 border-t border-white border-opacity-20">
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>
                        시작: {history.start_time ? new Date(history.start_time).toLocaleDateString() : '-'}
                      </div>
                      <div>
                        종료: {history.end_time ? new Date(history.end_time).toLocaleDateString() : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 통계 */}
          {competitionHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white border-opacity-20">
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-300">
                <div>총 {competitionHistory.length}회차</div>
                <div>
                  평균 참가: {Math.round(
                    competitionHistory.reduce((sum, h) => sum + (h.total_participants || 0), 0) / competitionHistory.length
                  )}개
                </div>
                <div>
                  최근: {competitionHistory[0]?.id}회차
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 차단 관리 탭 */}
        <div className="mb-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">🚫 차단 관리</h2>

          {/* 탭 메뉴 */}
          <div className="flex space-x-4 mb-6 border-b border-white border-opacity-20 pb-2">
            <button
              onClick={() => setBlockTab('videos')}
              className={`px-4 py-2 font-semibold transition-colors ${blockTab === 'videos'
                ? 'text-white border-b-2 border-red-500'
                : 'text-gray-300 hover:text-white'
                }`}
            >
              개별 영상 차단
            </button>
            <button
              onClick={() => setBlockTab('channels')}
              className={`px-4 py-2 font-semibold transition-colors ${blockTab === 'channels'
                ? 'text-white border-b-2 border-red-500'
                : 'text-gray-300 hover:text-white'
                }`}
            >
              채널 차단
            </button>
          </div>

          {/* 영상 차단 탭 */}
          {blockTab === 'videos' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 왼쪽: 영상 검색 및 차단 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">영상 검색</h3>

                {/* 검색 입력 */}
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={videoSearchQuery}
                    onChange={(e) => setVideoSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchVideos()}
                    placeholder="제목, 채널명 또는 YouTube ID로 검색"
                    className="flex-1 px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={searchVideos}
                    disabled={isSearching}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isSearching ? '검색 중...' : '검색'}
                  </button>
                </div>

                {/* 일괄 선택 버튼들 */}
                {searchResults.length > 0 && (
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleSelectAll}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        {selectedVideosForBlock.length === searchResults.length ? '전체 해제' : '전체 선택'}
                      </button>
                      {selectedVideosForBlock.length > 0 && (
                        <span className="text-white text-sm">
                          {selectedVideosForBlock.length}개 선택됨
                        </span>
                      )}
                    </div>
                    {selectedVideosForBlock.length > 0 && (
                      <button
                        onClick={blockSelectedVideos}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <span>🚫</span>
                        <span>선택한 {selectedVideosForBlock.length}개 일괄 차단</span>
                      </button>
                    )}
                  </div>
                )}

                {/* 검색 결과 */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="text-center text-gray-300 py-4">
                      {videoSearchQuery ? '검색 결과가 없습니다.' : '영상을 검색하세요.'}
                    </div>
                  ) : (
                    searchResults.map((video) => {
                      const isSelected = selectedVideosForBlock.some(v => v.id === video.id)
                      return (
                        <div
                          key={video.id}
                          className={`p-3 rounded-lg transition-all ${isSelected
                            ? 'bg-red-600 bg-opacity-20 border border-red-500 border-opacity-50'
                            : 'bg-white bg-opacity-10'
                            }`}
                        >
                          <div className="flex items-start">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleVideoSelection(video)}
                              className="mt-1 mr-3 accent-red-500"
                            />
                            <div className="flex-1">
                              <div className="text-white font-semibold text-sm">{video.title}</div>
                              <div className="text-gray-300 text-xs mt-1">
                                채널: {video.channel} | ID: {video.youtube_id}
                              </div>
                              <div className="text-gray-400 text-xs mt-1">
                                조회수: {video.views?.toLocaleString()} | 좋아요: {video.likes?.toLocaleString()}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (confirm(`"${video.title}"을(를) 차단하시겠습니까?`)) {
                                  blockVideo(video.youtube_id, video.title)
                                }
                              }}
                              className="ml-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                            >
                              개별 차단
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* 오른쪽: 차단된 영상 목록 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  차단된 영상 목록 ({blockedVideos.length}개)
                </h3>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {blockedVideos.length === 0 ? (
                    <div className="text-center text-gray-300 py-4">차단된 영상이 없습니다.</div>
                  ) : (
                    blockedVideos.map((blocked) => (
                      <div key={blocked.id} className="p-3 bg-white bg-opacity-10 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-white text-sm">{blocked.reason}</div>
                            <div className="text-gray-400 text-xs mt-1">
                              YouTube ID: {blocked.youtube_id}
                            </div>
                            <div className="text-gray-400 text-xs mt-1">
                              차단일: {new Date(blocked.blocked_at).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm('차단을 해제하시겠습니까?')) {
                                unblockVideo(blocked.id)
                              }
                            }}
                            className="ml-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            해제
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 채널 차단 탭 */}
          {blockTab === 'channels' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 왼쪽: 채널 차단 추가 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">채널 차단 추가</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">채널명</label>
                    <input
                      type="text"
                      value={channelToBlock}
                      onChange={(e) => setChannelToBlock(e.target.value)}
                      placeholder="차단할 채널명을 입력하세요 (예: MBC K-POP)"
                      className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">채널 ID (선택)</label>
                    <input
                      type="text"
                      value={channelIdToBlock}
                      onChange={(e) => setChannelIdToBlock(e.target.value)}
                      placeholder="YouTube 채널 ID (예: UCe52oeb7Xv_KaJsEzcKXJJg)"
                      className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">차단 사유 (선택)</label>
                    <input
                      type="text"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="차단 사유를 입력하세요"
                      className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <button
                    onClick={blockChannel}
                    className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>🚫</span>
                    <span>채널 차단</span>
                  </button>
                </div>

                <div className="mt-6 p-4 bg-yellow-600 bg-opacity-20 rounded-lg">
                  <div className="text-yellow-300 text-sm font-semibold mb-2">⚠️ 주의사항</div>
                  <ul className="text-yellow-200 text-xs space-y-1">
                    <li>• 채널을 차단하면 해당 채널의 모든 영상이 차단됩니다</li>
                    <li>• 차단 후에도 새로 업로드되는 영상도 자동으로 차단됩니다</li>
                    <li>• 채널명은 정확히 일치해야 합니다</li>
                  </ul>
                </div>
              </div>

              {/* 오른쪽: 차단된 채널 목록 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  차단된 채널 목록 ({blockedChannels.length}개)
                </h3>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {blockedChannels.length === 0 ? (
                    <div className="text-center text-gray-300 py-4">차단된 채널이 없습니다.</div>
                  ) : (
                    blockedChannels.map((channel) => (
                      <div key={channel.id} className="p-3 bg-white bg-opacity-10 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-white font-semibold">
                              {channel.channel_name || channel.channel_id || '알 수 없음'}
                            </div>
                            {channel.channel_id && (
                              <div className="text-gray-300 text-xs mt-1">
                                ID: {channel.channel_id}
                              </div>
                            )}
                            <div className="text-gray-400 text-xs mt-1">
                              {channel.reason || '관리자에 의해 차단됨'}
                            </div>
                            <div className="text-gray-400 text-xs mt-1">
                              차단일: {new Date(channel.blocked_at).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const channelIdentifier = channel.channel_name || channel.channel_id;
                              if (confirm(`"${channelIdentifier}" 채널의 차단을 해제하시겠습니까?`)) {
                                unblockChannel(channel.channel_name || channel.channel_id)
                              }
                            }}
                            className="ml-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            해제
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-300">
            💡 차단된 영상과 채널은 모든 리스트와 순위에서 제외됩니다.
          </div>
        </div>

        {/* 회원 관리 */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">👥 회원 관리</h2>

          {/* 필터 */}
          <div className="mb-4">
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 회원</option>
              <option value="pending">승인 대기</option>
              <option value="active">활성화</option>
              <option value="rejected">거부됨</option>
              <option value="suspended">정지됨</option>
            </select>
          </div>

          {/* 회원 목록 */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {userLoading ? (
              <div className="text-center text-gray-300 py-4">로딩 중...</div>
            ) : getFilteredUsers().length === 0 ? (
              <div className="text-center text-gray-300 py-4">회원이 없습니다.</div>
            ) : (
              getFilteredUsers().map((user) => (
                <div
                  key={user.id}
                  className="p-3 bg-white bg-opacity-10 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm font-semibold">
                        {user.username || user.email?.split('@')[0] || 'Unknown'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${user.status === 'active' ? 'bg-green-600 text-white' :
                        user.status === 'pending' ? 'bg-yellow-600 text-white' :
                          user.status === 'rejected' ? 'bg-red-600 text-white' :
                            'bg-gray-600 text-white'
                        }`}>
                        {user.status === 'active' ? '활성화' :
                          user.status === 'pending' ? '대기' :
                            user.status === 'rejected' ? '거부' :
                              user.status === 'suspended' ? '정지' : user.status}
                      </span>
                      {user.is_admin && (
                        <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                          관리자
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-gray-300 text-xs mb-2">
                    {user.email}
                  </div>

                  <div className="text-gray-300 text-xs mb-3">
                    가입일: {new Date(user.created_at).toLocaleDateString()}
                  </div>

                  {/* 승인/거부 버튼 */}
                  {user.status === 'pending' && (
                    <div className="flex space-x-2 mb-2">
                      <button
                        onClick={() => handleUserApproval(user.id, true, 'active')}
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleUserApproval(user.id, false, 'rejected')}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        거부
                      </button>
                    </div>
                  )}

                  {/* 상태 변경 */}
                  {user.status !== 'pending' && (
                    <div className="flex space-x-2">
                      <select
                        value={user.status}
                        onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                        className="px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded border border-white border-opacity-30"
                      >
                        <option value="active">활성화</option>
                        <option value="rejected">거부</option>
                        <option value="suspended">정지</option>
                      </select>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* 통계 */}
          <div className="mt-4 pt-4 border-t border-white border-opacity-20">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
              <div>전체: {users.length}명</div>
              <div>활성화: {users.filter(u => u.status === 'active').length}명</div>
              <div>대기: {users.filter(u => u.status === 'pending').length}명</div>
              <div>거부: {users.filter(u => u.status === 'rejected').length}명</div>
            </div>
          </div>
        </div>

        {/* 주제 제안 관리 */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">📝 주제 제안 관리</h2>

          {/* 실시간 통계 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-white bg-opacity-10 rounded-lg">
              <div className="text-2xl font-bold text-white">{suggestedTopics.length}</div>
              <div className="text-xs text-gray-300">전체 제안</div>
            </div>
            <div className="text-center p-3 bg-white bg-opacity-10 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {suggestedTopics.filter(t => t.votes_count >= 10).length}
              </div>
              <div className="text-xs text-gray-300">인기 제안 (10표+)</div>
            </div>
            <div className="text-center p-3 bg-white bg-opacity-10 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">
                {suggestedTopics.filter(t => t.votes_count >= 50).length}
              </div>
              <div className="text-xs text-gray-300">핫 제안 (50표+)</div>
            </div>
          </div>

          {/* 빠른 관리 버튼 */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => {
                const top3 = suggestedTopics.slice(0, 3).map(t => t.topic);
                setSelectedTopics(top3);
              }}
              className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
              disabled={suggestedTopics.length < 3}
            >
              🔥 TOP 3 선택
            </button>
            <button
              onClick={() => {
                const popular = suggestedTopics.filter(t => t.votes_count >= 10).slice(0, 3).map(t => t.topic);
                setSelectedTopics(popular);
              }}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              ⭐ 인기 제안 선택
            </button>
            <button
              onClick={() => {
                const confirmed = confirm('투표수가 5표 미만인 주제들을 모두 삭제하시겠습니까?');
                if (confirmed) {
                  suggestedTopics.filter(t => t.votes_count < 5).forEach(t => handleDeleteTopic(t.id));
                }
              }}
              className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              🗑️ 저투표 제안 정리
            </button>
          </div>

          {/* 새 주제 추가 */}
          <form onSubmit={handleAddTopic} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="새 주제 입력 (예: BTS - Butter)"
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

          {/* 주제 목록 (개선된 UI) */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {suggestedTopics.length === 0 ? (
              <div className="text-center text-gray-300 py-8">
                <div className="text-4xl mb-2">📝</div>
                <div>제안된 주제가 없습니다.</div>
                <div className="text-xs text-gray-400 mt-1">사용자들이 주제를 제안하면 여기에 표시됩니다.</div>
              </div>
            ) : (
              suggestedTopics.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg transition-all duration-200 ${item.votes_count >= 50 ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30' :
                    item.votes_count >= 20 ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30' :
                      item.votes_count >= 10 ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30' :
                        'bg-white bg-opacity-10'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex flex-col items-center min-w-[40px]">
                        <span className={`text-sm font-bold ${item.votes_count >= 50 ? 'text-yellow-400' :
                          item.votes_count >= 20 ? 'text-green-400' :
                            item.votes_count >= 10 ? 'text-blue-400' :
                              'text-gray-400'
                          }`}>
                          {index + 1}
                        </span>
                        <span className={`text-xs ${item.votes_count >= 50 ? 'text-yellow-400' :
                          item.votes_count >= 20 ? 'text-green-400' :
                            item.votes_count >= 10 ? 'text-blue-400' :
                              'text-gray-400'
                          }`}>
                          {item.votes_count}표
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{item.topic}</div>
                        <div className="text-gray-300 text-xs">
                          제안일: {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
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
                </div>
              ))
            )}
          </div>
        </div>

        {/* 최종 순위 발표 */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">🏆 최종 순위 발표</h2>

          {currentCompetition ? (
            <div className="space-y-4">
              {/* 현재 Competition 정보 */}
              <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                <div className="text-gray-300 text-sm mb-2">현재 Competition:</div>
                <div className="text-white font-semibold text-lg mb-2">{currentCompetition.topic}</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-300">상태:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${currentCompetition.status === 'active' ? 'bg-green-600 text-white' :
                      currentCompetition.status === 'ended' ? 'bg-red-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}>
                      {currentCompetition.status === 'active' ? '진행중' :
                        currentCompetition.status === 'ended' ? '종료됨' : '준비중'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-300">참가 영상:</span>
                    <span className="ml-2 text-white font-semibold">{finalResults.length}개</span>
                  </div>
                </div>
              </div>

              {/* 최종 순위 미리보기 */}
              {finalResults.length > 0 && (
                <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                  <div className="text-gray-300 text-sm mb-3">최종 순위 미리보기:</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {finalResults.slice(0, 5).map((video, index) => (
                      <div key={video.id} className="flex items-center space-x-3 p-2 bg-white bg-opacity-5 rounded">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-500 text-white' :
                              'bg-gray-600 text-white'
                          }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium truncate">{video.title}</div>
                          <div className="text-gray-300 text-xs">{video.channel}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-sm font-semibold">{video.site_score?.toLocaleString()}</div>
                          <div className="text-gray-300 text-xs">점수</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {finalResults.length > 5 && (
                    <div className="text-center text-gray-300 text-xs mt-2">
                      ... 외 {finalResults.length - 5}개 영상
                    </div>
                  )}
                </div>
              )}

              {/* 발표 버튼 */}
              <div className="flex items-center justify-between">
                <div className="text-gray-300 text-sm">
                  {currentCompetition.status === 'ended'
                    ? '이미 종료된 Competition입니다.'
                    : '투표 기간이 종료되면 최종 순위를 발표할 수 있습니다.'
                  }
                </div>
                <button
                  onClick={handleAnnounceResults}
                  disabled={currentCompetition.status !== 'ended' || isAnnouncing}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${currentCompetition.status === 'ended' && !isAnnouncing
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700 shadow-lg'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {isAnnouncing ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">🔄</span>
                      발표 중...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      🏆 최종 순위 발표
                    </span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-300 py-8">
              <div className="text-4xl mb-2">🏆</div>
              <div>진행 중인 Competition이 없습니다.</div>
              <div className="text-xs text-gray-400 mt-1">새로운 Competition을 시작하면 여기에 표시됩니다.</div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 
