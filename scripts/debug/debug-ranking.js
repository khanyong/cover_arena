// 브라우저 콘솔에서 실행할 디버그 코드
// F12를 눌러 개발자 도구를 열고, Console 탭에서 다음 코드를 붙여넣고 실행하세요

// 현재 로드된 비디오 데이터 확인
const videos = window.__NEXT_DATA__?.props?.pageProps?.videos || [];
console.log('=== TOP 5 영상 (현재 메모리) ===');
videos.slice(0, 5).forEach((v, i) => {
  console.log(`${i+1}. rank: ${v.rank}, title: ${v.title}, score: ${v.site_score}`);
});

// localStorage 캐시 확인
console.log('\n=== localStorage 캐시 ===');
const keys = Object.keys(localStorage).filter(k => k.includes('rank') || k.includes('video'));
keys.forEach(key => {
  console.log(`${key}: ${localStorage[key]?.substring(0, 100)}...`);
});

// 캐시 클리어 제안
console.log('\n=== 캐시 클리어하려면 다음 실행 ===');
console.log("localStorage.clear(); location.reload();");