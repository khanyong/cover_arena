// Arena 투표 디버깅 스크립트
// 브라우저 콘솔에서 실행하세요

console.log('%c=== Arena 투표 디버깅 시작 ===', 'color: blue; font-size: 16px; font-weight: bold');

// 원본 fetch 저장
const originalFetch = window.fetch;

// fetch 인터셉트
window.fetch = async function(...args) {
    const [url, options] = args;
    
    // vote-video API 호출 감지
    if (url && url.includes('/api/vote-video')) {
        console.group('%c📮 투표 API 호출 감지', 'color: green; font-weight: bold');
        console.log('URL:', url);
        console.log('Method:', options?.method);
        console.log('Body:', options?.body);
        
        if (options?.body) {
            try {
                const bodyData = JSON.parse(options.body);
                console.log('파싱된 데이터:', bodyData);
                console.log('Video ID:', bodyData.videoId);
                console.log('User ID:', bodyData.userId);
                console.log('Like Type:', bodyData.likeType);
            } catch (e) {
                console.error('Body 파싱 실패:', e);
            }
        }
        console.groupEnd();
    }
    
    // 원본 fetch 실행
    const response = await originalFetch.apply(this, args);
    
    // vote-video 응답 로깅
    if (url && url.includes('/api/vote-video')) {
        const clonedResponse = response.clone();
        try {
            const responseData = await clonedResponse.json();
            console.group(`%c📨 투표 API 응답 (${response.status})`, response.ok ? 'color: green' : 'color: red');
            console.log('응답 데이터:', responseData);
            if (responseData.message) {
                console.log('메시지:', responseData.message);
            }
            console.groupEnd();
        } catch (e) {
            console.error('응답 파싱 실패:', e);
        }
    }
    
    return response;
};

// 현재 사용자 정보 확인
const checkUserInfo = () => {
    // Supabase 세션 확인
    const supabaseAuth = localStorage.getItem('supabase.auth.token');
    if (supabaseAuth) {
        try {
            const authData = JSON.parse(supabaseAuth);
            console.group('%c👤 사용자 정보', 'color: purple; font-weight: bold');
            console.log('로그인 상태: 로그인됨');
            console.log('User ID:', authData?.currentSession?.user?.id);
            console.log('Email:', authData?.currentSession?.user?.email);
            console.groupEnd();
        } catch (e) {
            console.log('로그인 상태: 비로그인');
        }
    } else {
        console.log('로그인 상태: 비로그인');
    }
};

// votedVideos Set 모니터링
const monitorVotedVideos = () => {
    // React DevTools에서 컴포넌트 상태 찾기
    const reactRoot = document.getElementById('__next')?._reactRootContainer || 
                     document.getElementById('__next')?._reactRootFiber ||
                     document.querySelector('#__next')?._reactInternalFiber;
    
    if (reactRoot) {
        console.log('%c🎯 React 컴포넌트 트리 발견', 'color: orange');
        // 여기서는 수동으로 확인이 필요합니다
        console.log('React DevTools를 사용하여 CompetitionArena 컴포넌트의 votedVideos state를 확인하세요');
    }
};

// 로컬 스토리지 확인
const checkLocalStorage = () => {
    console.group('%c💾 로컬 스토리지 투표 기록', 'color: teal; font-weight: bold');
    const keys = Object.keys(localStorage).filter(key => key.includes('vote') || key.includes('guest'));
    if (keys.length > 0) {
        keys.forEach(key => {
            console.log(`${key}:`, localStorage.getItem(key));
        });
    } else {
        console.log('투표 관련 데이터 없음');
    }
    console.groupEnd();
};

// 버튼 상태 모니터링
const monitorButtons = () => {
    const buttons = document.querySelectorAll('button');
    const arenaButtons = Array.from(buttons).filter(btn => 
        btn.textContent.includes('Arena') || 
        btn.textContent.includes('투표')
    );
    
    console.group('%c🔘 Arena 투표 버튼 상태', 'color: brown; font-weight: bold');
    console.log(`총 ${arenaButtons.length}개의 투표 버튼 발견`);
    
    arenaButtons.forEach((btn, index) => {
        console.log(`버튼 ${index + 1}:`, {
            text: btn.textContent,
            disabled: btn.disabled,
            className: btn.className,
            onclick: btn.onclick ? '있음' : '없음'
        });
    });
    console.groupEnd();
};

// 실행
checkUserInfo();
checkLocalStorage();
monitorButtons();
monitorVotedVideos();

console.log('%c=== 디버깅 준비 완료 ===', 'color: blue; font-size: 16px; font-weight: bold');
console.log('이제 투표 버튼을 클릭하면 상세 로그가 출력됩니다.');