import { supabase } from '../../shared/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { videoId, competitionId, userId, likeType = 'arena' } = req.body
    
    console.log('📮 투표 요청 받음:', {
      videoId,
      competitionId,
      userId,
      likeType,
      timestamp: new Date().toISOString()
    })

    // UUID 형식 체크
    const isValidUUID = (uuid) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      return uuidRegex.test(uuid)
    }

    // 로그인 사용자의 경우 중복 투표 확인
    if (userId && isValidUUID(userId)) {
      // 기존 투표 확인
      const { data: existingVotes, error: checkError } = await supabase
        .from('coversong_like_history')
        .select('id')
        .eq('user_id', userId)
        .eq('video_id', videoId)
        .eq('competition_id', competitionId)
        .eq('like_type', likeType)

      if (checkError) {
        console.error('❌ 투표 확인 오류:', checkError)
      }

      console.log('🔍 기존 투표 확인 결과:', {
        userId,
        videoId,
        existingVotes: existingVotes?.length || 0
      })

      if (existingVotes && existingVotes.length > 0) {
        console.log('⚠️ 중복 투표 감지!')
        return res.status(400).json({ 
          success: false, 
          message: '이미 이 영상에 투표하셨습니다.' 
        })
      }

      // 투표 기록 저장
      const { error: insertError } = await supabase
        .from('coversong_like_history')
        .insert({
          user_id: userId,
          video_id: videoId,
          competition_id: competitionId,
          like_type: likeType
        })


      if (insertError) {
        if (insertError.code === '23505') { // 중복 키 오류
          console.log('⚠️ 데이터베이스 중복 키 감지!')
          return res.status(400).json({ 
            success: false, 
            message: '이미 이 영상에 투표하셨습니다.' 
          })
        }
        console.error('❌ 투표 기록 저장 실패:', insertError)
        return res.status(500).json({ 
          success: false, 
          message: '투표 처리 중 오류가 발생했습니다.' 
        })
      }
      
      console.log('✅ 투표 기록 저장 성공')
    } else {
      // 비로그인 사용자의 경우 로그만 남김
      console.log('👤 비로그인 사용자 투표:', {
        videoId,
        likeType: 'guest',
        timestamp: new Date().toISOString()
      })
    }

    // 좋아요 수 증가
    const { data: videos, error: fetchError } = await supabase
      .from('coversong_videos')
      .select(`id, arena_likes, guest_likes`)
      .eq('id', videoId)


    if (fetchError || !videos || videos.length === 0) {
      console.error('비디오 조회 실패:', fetchError)
      return res.status(500).json({ 
        success: false, 
        message: '비디오 정보를 가져올 수 없습니다.' 
      })
    }

    const video = videos[0]

    // 좋아요 증가
    const newLikes = {
      arena_likes: video.arena_likes,
      guest_likes: video.guest_likes
    }
    
    if (likeType === 'arena') {
      newLikes.arena_likes = (video.arena_likes || 0) + 1
    } else {
      newLikes.guest_likes = (video.guest_likes || 0) + 1
    }

    const { error: incrementError } = await supabase
      .from('coversong_videos')
      .update(newLikes)
      .eq('id', videoId)

    if (incrementError) {
      console.error('좋아요 업데이트 실패:', incrementError)
      return res.status(500).json({ 
        success: false, 
        message: '좋아요 업데이트에 실패했습니다.' 
      })
    }

    console.log('✅ 투표 완료:', {
      videoId,
      arena_likes: newLikes.arena_likes,
      guest_likes: newLikes.guest_likes
    })
    
    res.status(200).json({ 
      success: true, 
      message: '투표가 완료되었습니다.',
      arena_likes: newLikes.arena_likes,
      guest_likes: newLikes.guest_likes
    })
  } catch (error) {
    console.error('투표 처리 오류:', error)
    res.status(500).json({ 
      success: false, 
      message: '투표 처리 중 오류가 발생했습니다.' 
    })
  }
}
