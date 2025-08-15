// 브라우저 콘솔에서 실행할 테스트 코드

async function testVoteAPI() {
  // 현재 로그인한 사용자 확인
  const { data: { user } } = await window.supabase.auth.getUser();
  console.log('Current user:', user);
  
  if (!user) {
    console.log('로그인이 필요합니다');
    return;
  }
  
  // 실제 데이터로 투표 테스트
  const voteData = {
    videoId: '2FS3JAPTKXs',  // 방금 테스트한 video ID
    competitionId: 5,
    userId: user.id,
    likeType: 'arena'
  };
  
  console.log('Sending vote request:', voteData);
  
  try {
    const response = await fetch('/api/vote-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(voteData)
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    // 이미 투표했으므로 400 에러와 함께 "이미 투표하셨습니다" 메시지가 나와야 함
    if (response.status === 400) {
      console.log('✅ 중복 투표 방지 작동 중!');
    } else if (response.ok) {
      console.log('새로운 투표가 등록되었습니다');
    } else {
      console.error('예상치 못한 에러:', data);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// 실행
testVoteAPI();