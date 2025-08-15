// 브라우저 콘솔에서 실행할 테스트 코드
// 실제 videoId와 competitionId로 변경 필요

async function testVote() {
  // 현재 로그인한 사용자 정보 가져오기
  const { data: { user } } = await window.supabase.auth.getUser();
  console.log('Current user:', user);
  
  // 실제 비디오 ID와 competition ID로 변경
  const testData = {
    videoId: 'YOUR_VIDEO_ID',  // 실제 video ID로 변경
    competitionId: 1,           // 실제 competition ID로 변경
    userId: user?.id || null,
    likeType: 'arena'
  };
  
  console.log('Sending vote request:', testData);
  
  try {
    const response = await fetch('/api/vote-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (!response.ok) {
      console.error('Vote failed:', data.message);
    } else {
      console.log('Vote successful!');
    }
  } catch (error) {
    console.error('Request error:', error);
  }
}

// 실행
testVote();