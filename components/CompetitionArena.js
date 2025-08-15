import { useRef, useEffect, useState } from 'react'
import VideoCard from './VideoCard'
import { supabase } from '../lib/supabase'

// 좋아요 비율 기반 동적 셀 크기 Arena
export default function CompetitionArena({ videos, setVideos, onVideoClick, isVotingActive = true, user }) {
  const arenaRef = useRef(null)
  const [arenaSize, setArenaSize] = useState({ width: 0, height: 0 })
  const [votedVideos, setVotedVideos] = useState(new Set()) // 투표한 비디오 ID 추적
  const [guestVotedVideos, setGuestVotedVideos] = useState(new Set()) // 비로그인 사용자 투표 추적

  // 실시간 좋아요 업데이트 구독
  useEffect(() => {
    if (!videos.length) return

    const channel = supabase
      .channel('video-likes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'coversong_videos',
          filter: `id=in.(${videos.map(v => v.id).join(',')})`
        },
        (payload) => {
          // 실시간으로 좋아요 수 업데이트
          setVideos(prev => prev.map(v => 
            v.id === payload.new.id 
              ? { 
                  ...v, 
                  arenaLikes: payload.new.arena_likes,
                  guest_likes: payload.new.guest_likes 
                } 
              : v
          ))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [videos, setVideos])

  // 사용자가 이미 투표한 비디오 로드
  useEffect(() => {
    const loadVotedVideos = async () => {
      if (!videos.length) return
      
      const competitionId = videos[0]?.competition_id
      if (!competitionId) return
      
      // 로그인 사용자의 경우 데이터베이스에서 로드
      if (user) {
        try {
          // 사용자의 투표 히스토리 조회
          const { data, error } = await supabase
            .from('coversong_like_history')
            .select('video_id')
            .eq('user_id', user.id)
            .eq('competition_id', competitionId)
            .eq('like_type', 'arena')
          
          if (!error && data) {
            const votedIds = new Set(data.map(item => item.video_id))
            setVotedVideos(votedIds)
          }
        } catch (error) {
          console.error('투표 히스토리 로드 오류:', error)
        }
      } else {
        // 비로그인 사용자의 경우 로컬 스토리지에서 로드
        const storageKey = `guest_votes_${competitionId}`
        const storedVotes = localStorage.getItem(storageKey)
        if (storedVotes) {
          try {
            const votedIds = new Set(JSON.parse(storedVotes))
            setGuestVotedVideos(votedIds)
          } catch (error) {
            console.error('로컬 스토리지 파싱 오류:', error)
          }
        }
      }
    }
    
    loadVotedVideos()
  }, [user, videos])

  // Arena 크기 측정 (반응형)
  useEffect(() => {
    function updateSize() {
      if (arenaRef.current) {
        setArenaSize({
          width: arenaRef.current.offsetWidth,
          height: arenaRef.current.offsetHeight
        })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // 동적 행/열 계산
  const N = videos.length
  const cols = Math.ceil(Math.sqrt(N))
  const rows = Math.ceil(N / cols)

  // 좋아요 비율 계산
  const totalArenaLikes = videos.reduce((sum, v) => sum + (v.arenaLikes || 0), 0) || 1
  // 최소 셀 넓이/높이 비율 (아주 작은 영상도 보이게)
  const minRatio = 0.015

  // 각 셀의 넓이 비율(%) 계산 (Arena 좋아요 비율 기반, 최소값 보장)
  const cellRatios = videos.map(v => Math.max(minRatio, (v.arenaLikes || 0) / totalArenaLikes))
  // 전체 합이 1이 되도록 정규화
  const ratioSum = cellRatios.reduce((a, b) => a + b, 0)
  const normRatios = cellRatios.map(r => r / ratioSum)

  // 셀 배치: 행/열 인덱스 계산
  const getCellPosition = idx => {
    const row = Math.floor(idx / cols)
    const col = idx % cols
    return { row, col }
  }

  // arenaLikes가 모두 0이면 균등 분할
  const allZero = videos.every(v => v.arenaLikes === 0);

  let cellSizes;
  if (allZero) {
    // 균등 분할: 모든 size = 1
    const baseSize = Math.min(arenaSize.width / cols, arenaSize.height / rows)
    cellSizes = Array(videos.length).fill().map(() => ({ 
      width: baseSize, 
      height: baseSize 
    }))
  } else {
    // 로그 함수 기반 자연스러운 증가율 시스템
    const maxArenaLikes = Math.max(...videos.map(v => v.arenaLikes || 0))
    const totalArenaLikes = videos.reduce((sum, v) => sum + (v.arenaLikes || 0), 0)
    const avgArenaLikes = totalArenaLikes / videos.length
    
    // 기본 크기 (평균 좋아요일 때)
    const baseSize = Math.min(arenaSize.width / cols, arenaSize.height / rows)
    
    cellSizes = videos.map(video => {
      const arenaLikes = video.arenaLikes || 0
      
      if (arenaLikes === 0) {
        // 좋아요가 없으면 기본 크기의 0.85배
        return { width: baseSize * 0.85, height: baseSize * 0.85 }
      }
      
      // 로그 함수를 사용한 자연스러운 증가율 계산
      // log(1 + x) 함수의 특성을 활용
      const logLikes = Math.log10(arenaLikes + 1)
      const logMax = Math.log10(maxArenaLikes + 1)
      
      // 로그 스케일에서의 정규화된 위치 (0~1)
      const normalizedPosition = logLikes / Math.max(logMax, 1)
      
      // 로그 함수를 사용한 부드러운 크기 계산
      // 1. 자연 로그를 사용한 부드러운 증가
      const naturalLogFactor = Math.log(1 + normalizedPosition * 9) / Math.log(10)
      
      // 2. 크기 범위: 0.75배 ~ 2.5배
      const minMultiplier = 0.75
      const maxMultiplier = 2.5
      const range = maxMultiplier - minMultiplier
      
      // 3. 로그 함수 기반 크기 계산
      const sizeMultiplier = minMultiplier + (naturalLogFactor * range)
      
      // 4. 최소/최대 크기 보장
      const clampedMultiplier = Math.max(minMultiplier, Math.min(maxMultiplier, sizeMultiplier))
      
      const newSize = baseSize * clampedMultiplier
      
      // Arena 경계를 벗어나지 않도록 최대 크기 제한
      const maxSize = Math.min(arenaSize.width, arenaSize.height) * 0.2
      const limitedSize = Math.min(newSize, maxSize)
      
      return { width: limitedSize, height: limitedSize }
    })
  }

  // 안전한 cellSizes 접근을 위한 헬퍼 함수
  const getCellSize = (idx) => {
    if (!cellSizes || !cellSizes[idx]) {
      const baseSize = Math.min(arenaSize.width / cols, arenaSize.height / rows)
      return { width: baseSize, height: baseSize }
    }
    return cellSizes[idx]
  }

  // z-index: 크기에 따라 레이어 순서 결정 (큰 영상이 위에)
  const getZIndex = (idx) => {
    if (allZero) return 1 // 모든 영상이 동일한 레이어
    const size = getCellSize(idx)
    const area = size.width * size.height
    // 크기가 클수록 높은 z-index (최대 1000)
    return Math.floor((area / (arenaSize.width * arenaSize.height)) * 1000) + 1
  }

  // 겹침 감지 함수
  const detectOverlap = (rect1, rect2) => {
    return !(rect1.x + rect1.width <= rect2.x || 
             rect2.x + rect2.width <= rect1.x || 
             rect1.y + rect1.height <= rect2.y || 
             rect2.y + rect2.height <= rect1.y)
  }

  // 공간 효율적인 배치 계산 (겹침 최소화 + 공간 활용)
  let positions = []
  
  // 영상들을 크기 순으로 정렬 (큰 영상부터 배치)
  const sortedVideos = videos.map((video, idx) => ({
    ...video,
    originalIndex: idx,
    size: getCellSize(idx)
  })).sort((a, b) => {
    const areaA = a.size.width * a.size.height
    const areaB = b.size.width * b.size.height
    return areaB - areaA // 큰 영상부터
  })
  
  // 사용된 공간을 추적하는 2D 배열 (더 세밀한 격자)
  const gridSize = 5 // 5px 격자
  const usedSpace = Array(Math.ceil(arenaSize.height / gridSize)).fill().map(() => 
    Array(Math.ceil(arenaSize.width / gridSize)).fill(false)
  )
  
  // 특정 위치에 영상을 배치할 수 있는지 확인
  const canPlaceAt = (x, y, width, height) => {
    const startX = Math.floor(x / gridSize)
    const startY = Math.floor(y / gridSize)
    const endX = Math.floor((x + width) / gridSize)
    const endY = Math.floor((y + height) / gridSize)
    
    // Arena 경계 확인
    if (x + width > arenaSize.width || y + height > arenaSize.height) {
      return false
    }
    
    // 사용된 공간 확인
    for (let i = startY; i <= endY; i++) {
      for (let j = startX; j <= endX; j++) {
        if (i < usedSpace.length && j < usedSpace[0].length && usedSpace[i][j]) {
          return false
        }
      }
    }
    
    return true
  }
  
  // 특정 위치에 영상 배치
  const placeAt = (x, y, width, height) => {
    const startX = Math.floor(x / gridSize)
    const startY = Math.floor(y / gridSize)
    const endX = Math.floor((x + width) / gridSize)
    const endY = Math.floor((y + height) / gridSize)
    
    for (let i = startY; i <= endY; i++) {
      for (let j = startX; j <= endX; j++) {
        if (i < usedSpace.length && j < usedSpace[0].length) {
          usedSpace[i][j] = true
        }
      }
    }
  }
  
  // 각 영상에 대해 최적의 위치 찾기
  sortedVideos.forEach((video) => {
    const { width, height } = video.size
    let placed = false
    
    // 격자 단위로 위치 탐색 (5px 간격)
    for (let y = 0; y < arenaSize.height && !placed; y += gridSize) {
      for (let x = 0; x < arenaSize.width && !placed; x += gridSize) {
        if (canPlaceAt(x, y, width, height)) {
          positions[video.originalIndex] = { x, y }
          placeAt(x, y, width, height)
          placed = true
        }
      }
    }
    
    // 배치할 수 없는 경우 겹침 허용 배치
    if (!placed) {
      const idx = video.originalIndex
      
      // 기존 영상들과의 겹침을 최소화하는 위치 찾기
      let bestX = 0, bestY = 0, minOverlap = Infinity
      
      for (let y = 0; y < arenaSize.height - height; y += gridSize) {
        for (let x = 0; x < arenaSize.width - width; x += gridSize) {
          let overlap = 0
          
          // 기존 영상들과의 겹침 계산
          for (let i = 0; i < positions.length; i++) {
            if (positions[i]) {
              const existingPos = positions[i]
              const existingSize = getCellSize(i)
              
              const currentRect = { x, y, width, height }
              const existingRect = { 
                x: existingPos.x, 
                y: existingPos.y, 
                width: existingSize.width, 
                height: existingSize.height 
              }
              
              if (detectOverlap(currentRect, existingRect)) {
                // 겹침 영역 계산
                const overlapX = Math.max(0, Math.min(x + width, existingPos.x + existingSize.width) - Math.max(x, existingPos.x))
                const overlapY = Math.max(0, Math.min(y + height, existingPos.y + existingSize.height) - Math.max(y, existingPos.y))
                overlap += overlapX * overlapY
              }
            }
          }
          
          if (overlap < minOverlap) {
            minOverlap = overlap
            bestX = x
            bestY = y
          }
        }
      }
      
      positions[idx] = { x: bestX, y: bestY }
    }
  })

  // 각 영상의 겹침 상태 계산
  const overlapStates = videos.map((video, idx) => {
    const currentRect = {
      x: positions[idx]?.x || 0,
      y: positions[idx]?.y || 0,
      width: getCellSize(idx)?.width || 10,
      height: getCellSize(idx)?.height || 10
    }
    
    // 다른 영상들과의 겹침 확인
    const overlappingVideos = videos.filter((otherVideo, otherIdx) => {
      if (idx === otherIdx) return false
      
      const otherRect = {
        x: positions[otherIdx]?.x || 0,
        y: positions[otherIdx]?.y || 0,
        width: getCellSize(otherIdx)?.width || 10,
        height: getCellSize(otherIdx)?.height || 10
      }
      
      return detectOverlap(currentRect, otherRect)
    })
    
    return {
      isOverlapping: overlappingVideos.length > 0,
      overlapCount: overlappingVideos.length,
      zIndex: getZIndex(idx),
      overlappingVideos: overlappingVideos.map(otherIdx => ({
        idx: otherIdx,
        zIndex: getZIndex(otherIdx),
        area: getCellSize(otherIdx)?.width * getCellSize(otherIdx)?.height || 0
      }))
    }
  })

  // 겹침에 따른 투명도 계산 (겹침 심한 경우에만 적용)
  const getOpacity = (idx) => {
    // 디버깅: 모든 영상을 불투명하게 설정
    return 1.0
    
    /*
    const overlapState = overlapStates[idx]
    
    // 겹치지 않으면 완전 불투명
    if (!overlapState.isOverlapping) {
      return 1.0
    }
    
    // 겹침 정도에 따라 투명도 결정
    const overlapRatio = overlapState.overlapCount / videos.length
    
    // 겹침이 심한 경우에만 투명도 적용 (50% 이상 겹칠 때)
    if (overlapRatio < 0.5) {
      return 1.0 // 겹침이 적으면 불투명
    }
    
    // 겹치는 영상이 있으면 투명도 계산
    const currentZIndex = overlapState.zIndex
    const overlappingVideos = overlapState.overlappingVideos
    
    // 겹치는 영상들 중에서 현재 영상이 가장 높은 z-index를 가지고 있으면 투명하게
    const isHighestZIndex = overlappingVideos.every(other => currentZIndex >= other.zIndex)
    
    if (isHighestZIndex) {
      // 위에 있는 영상: 크기에 따라 투명도 조절
      const currentSize = getCellSize(idx)
      const currentArea = currentSize.width * currentSize.height
      const baseArea = Math.min(arenaSize.width / cols, arenaSize.height / rows) ** 2
      const relativeSize = currentArea / baseArea
      
      if (relativeSize > 2.0) {
        return 0.9 // 큰 영상은 거의 불투명
      } else if (relativeSize > 1.5) {
        return 0.85 // 중간 영상
      } else {
        return 0.7 // 작은 영상은 더 투명
      }
    } else {
      return 1.0 // 아래에 있는 영상은 완전 불투명
    }
    */
  }

  const handleLike = async (video) => {
    if (!isVotingActive) {
      alert('투표 기간이 종료되었습니다.')
      return
    }

    // 클라이언트 측 중복 투표 체크
    if (user && votedVideos.has(video.id)) {
      alert('이미 이 영상에 투표하셨습니다.')
      return
    }
    
    // 비로그인 사용자 중복 투표 체크
    if (!user && guestVotedVideos.has(video.id)) {
      alert('이미 이 영상에 투표하셨습니다.')
      return
    }

    try {
      // 데이터베이스 함수 호출로 좋아요 증가
      const { data, error } = await supabase.rpc('increment_likes', {
        p_video_id: video.id,
        p_competition_id: video.competition_id,
        p_user_id: user?.id || null,
        p_like_type: user ? 'arena' : 'guest'
      })

      if (error) {
        console.error('좋아요 업데이트 오류:', error)
        alert('좋아요 업데이트에 실패했습니다.')
        return
      }

      if (data) {
        if (data.success) {
          // 성공적으로 업데이트된 경우에만 UI 업데이트
          setVideos(prev => prev.map(v => 
            v.id === video.id 
              ? { 
                  ...v, 
                  arenaLikes: data.arena_likes,
                  guest_likes: data.guest_likes 
                } 
              : v
          ))
          
          // 투표한 비디오 ID 추가
          if (user) {
            setVotedVideos(prev => new Set([...prev, video.id]))
          } else {
            // 비로그인 사용자의 경우 로컬 스토리지에 저장
            const competitionId = video.competition_id
            const storageKey = `guest_votes_${competitionId}`
            const newVotedIds = new Set([...guestVotedVideos, video.id])
            setGuestVotedVideos(newVotedIds)
            localStorage.setItem(storageKey, JSON.stringify([...newVotedIds]))
          }
        } else {
          // 이미 투표한 경우
          alert(data.message)
        }
      }
    } catch (error) {
      console.error('좋아요 처리 오류:', error)
      alert('좋아요 처리 중 오류가 발생했습니다.')
    }
  }

  return (
    <div
      ref={arenaRef}
      className="w-full h-[80vh] relative overflow-hidden"
      style={{ position: 'relative', zIndex: 1 }}
    >
      {videos.map((video, idx) => (
        <div
          key={video.id}
          style={{
            position: 'absolute',
            left: Math.min(positions[idx]?.x || 0, arenaSize.width - (getCellSize(idx)?.width || 0)),
            top: Math.min(positions[idx]?.y || 0, arenaSize.height - (getCellSize(idx)?.height || 0)),
            width: Math.min(getCellSize(idx)?.width || 10, arenaSize.width),
            height: Math.min(getCellSize(idx)?.height || 10, arenaSize.height),
            transition: 'all 1s cubic-bezier(0.4,0,0.6,1)',
            zIndex: overlapStates[idx].zIndex,
            maxWidth: '100%',
            maxHeight: '100%',
            opacity: getOpacity(idx),
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
          className="grid-item border border-black/20 overflow-hidden flex flex-col hover:scale-105 hover:shadow-2xl"
          onClick={() => onVideoClick && onVideoClick(video)}
        >
          <div className="flex-1 cursor-pointer">
            <VideoCard video={video} isHovered={false} />
          </div>
          {/* Arena 좋아요 & 유튜브 좋아요 표시 및 버튼 */}
          <div className="bg-gray-800 p-1 rounded-b-lg flex flex-col items-center gap-1 mt-0.5">
            <div className="flex justify-between w-full text-[10px] text-gray-300">
              <span>🏆 Arena: {video.arenaLikes || 0}</span>
              <span>❤️ YT: {video.likes}</span>
            </div>
            <button
              onClick={e => { e.stopPropagation(); handleLike(video); }}
              disabled={!isVotingActive || (user && votedVideos.has(video.id)) || (!user && guestVotedVideos.has(video.id))}
              className={`w-full py-0.5 rounded text-[10px] mt-0.5 transition-colors ${
                !isVotingActive
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : (user && votedVideos.has(video.id)) || (!user && guestVotedVideos.has(video.id))
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
              }`}
            >
              {!isVotingActive 
                ? '🔒 투표 종료' 
                : (user && votedVideos.has(video.id)) || (!user && guestVotedVideos.has(video.id))
                ? '✓ 투표 완료'
                : 'Arena 좋아요'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
} 