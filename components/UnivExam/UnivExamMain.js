import React, { useState, useEffect } from 'react';
import RecordOverview from './StudentRecord/RecordOverview';
import CreativeActivities from './AdmissionData/CreativeActivities';
import SubjectPerformance from './AdmissionData/SubjectPerformance';
import UniversitySelector from './University/UniversitySelector';
import UniversityDetail from './University/UniversityDetail';
import QuestionGenerator from './Interview/QuestionGenerator';
import SpanishInterview from './Interview/SpanishInterview';
import PhilosophyInterview from './Interview/PhilosophyInterview';
import AnalysisDashboard from './Analysis/AnalysisDashboard';
import { sampleStudentRecord } from './Data/sampleStudentRecord';
import { universityDatabase } from './Data/universityData';

/**
 * UnivExam 메인 컴포넌트
 * 2026 대학입학 수시면접 준비 시스템의 메인 페이지
 */
const UnivExamMain = () => {
  // 상태 관리
  const [studentRecord, setStudentRecord] = useState(sampleStudentRecord);
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [currentView, setCurrentView] = useState('overview'); // overview, creative-activities, subject-performance, university, interview, analysis
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState(['admission-data']); // 확장된 메뉴 ID 배열
  const [sidebarOpen, setSidebarOpen] = useState(false); // 모바일 사이드바 토글

  // 초기 데이터 로드
  useEffect(() => {
    // LocalStorage에서 저장된 데이터 로드
    const savedData = localStorage.getItem('univExamData');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.studentRecord) setStudentRecord(data.studentRecord);
      if (data.selectedUniversities) setSelectedUniversities(data.selectedUniversities);
      if (data.generatedQuestions) setGeneratedQuestions(data.generatedQuestions);
    }
  }, []);

  // 데이터 저장
  useEffect(() => {
    const dataToSave = {
      studentRecord,
      selectedUniversities,
      generatedQuestions
    };
    localStorage.setItem('univExamData', JSON.stringify(dataToSave));
  }, [studentRecord, selectedUniversities, generatedQuestions]);

  // 네비게이션 메뉴 (계층형 구조)
  const navigationMenu = [
    { id: 'overview', label: '전체 개요', icon: '', type: 'single' },
    {
      id: 'admission-data',
      label: '대입전형자료',
      icon: '',
      type: 'parent',
      children: [
        { id: 'creative-activities', label: '창의적 체험활동상황', icon: '' },
        { id: 'subject-performance', label: '교과학습발달상황', icon: '' }
      ]
    },
    {
      id: 'university',
      label: '지원대학',
      icon: '',
      type: 'parent',
      children: [
        { id: 'univ-hufs', label: '한국외국어대학교 스페인어과', icon: '' },
        { id: 'univ-kyunghee', label: '경희대학교 스페인어학과', icon: '' },
        { id: 'univ-uos', label: '서울시립대학교 철학과', icon: '' },
        { id: 'univ-konkuk', label: '건국대학교 철학과', icon: '' },
        { id: 'univ-hanyang', label: '한양대학교 글로벌문화통상학부', icon: '' },
        { id: 'univ-myongji', label: '명지대학교 영어영문학과', icon: '' }
      ]
    },
    {
      id: 'interview-prep',
      label: '면접 준비',
      icon: '',
      type: 'parent',
      children: [
        { id: 'interview', label: '예상 질문 생성', icon: '' },
        { id: 'spanish-interview', label: '스페인어과', icon: '' },
        { id: 'philosophy-interview', label: '철학과', icon: '' }
      ]
    },
    { id: 'analysis', label: '분석 및 통계', icon: '', type: 'single' }
  ];

  // 메뉴 토글
  const toggleMenu = (menuId) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  // 사이드바 토글 (모바일)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 사이드바 닫기
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // 메뉴 클릭 시 사이드바 닫기 (모바일)
  const handleMenuClick = (viewId) => {
    setCurrentView(viewId);
    closeSidebar();
  };

  // 뷰 렌더링
  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return (
          <div className="overview-section">
            <h2>전체 개요</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>학생 정보</h3>
                <p><strong>이름:</strong> {studentRecord.studentInfo.name}</p>
                <p><strong>학교:</strong> {studentRecord.studentInfo.school}</p>
                <p><strong>학년:</strong> {studentRecord.studentInfo.currentGrade}학년</p>
                <p><strong>희망 전공:</strong> {studentRecord.studentInfo.targetMajor}</p>
              </div>

              <div className="overview-card">
                <h3>지원 대학 현황</h3>
                <div className="university-list">
                  <p><strong>한국외국어대학교</strong> - 스페인어과</p>
                  <p><strong>경희대학교</strong> - 스페인어과</p>
                  <p><strong>서울시립대학교</strong> - 철학과</p>
                  <p><strong>건국대학교</strong> - 철학과</p>
                  <p><strong>한양대학교</strong> - 글로벌문화통상학부</p>
                  <p><strong>명지대학교</strong> - 영어영문학과</p>
                </div>
              </div>

              <div className="overview-card">
                <h3>대입전형자료</h3>
                <div className="data-summary">
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['admission-data']);
                      setCurrentView('creative-activities');
                    }}
                  >
                    📋 창의적 체험활동상황 →
                  </button>
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['admission-data']);
                      setCurrentView('subject-performance');
                    }}
                  >
                    📚 교과학습발달상황 →
                  </button>
                </div>
              </div>

              <div className="overview-card">
                <h3>면접 준비</h3>
                <div className="interview-summary">
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['interview-prep']);
                      setCurrentView('spanish-interview');
                    }}
                  >
                    🗣️ 스페인어과 면접 준비 →
                  </button>
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['interview-prep']);
                      setCurrentView('philosophy-interview');
                    }}
                  >
                    🧠 철학과 면접 준비 →
                  </button>
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['interview-prep']);
                      setCurrentView('interview');
                    }}
                  >
                    💡 예상 질문 생성 →
                  </button>
                </div>
              </div>
            </div>

            <div className="university-details-grid">
              <h3>지원 대학 상세 정보</h3>
              <div className="university-cards">
                <div className="univ-card" onClick={() => setCurrentView('univ-hufs')}>
                  <h4>한국외국어대학교</h4>
                  <p className="univ-dept">스페인어과</p>
                  <p className="univ-type">학생부종합 (면접형)</p>
                  <span className="view-detail">상세보기 →</span>
                </div>
                <div className="univ-card" onClick={() => setCurrentView('univ-kyunghee')}>
                  <h4>경희대학교</h4>
                  <p className="univ-dept">스페인어과</p>
                  <p className="univ-type">학생부종합 (네오르네상스)</p>
                  <span className="view-detail">상세보기 →</span>
                </div>
                <div className="univ-card" onClick={() => setCurrentView('univ-uos')}>
                  <h4>서울시립대학교</h4>
                  <p className="univ-dept">철학과</p>
                  <p className="univ-type">학생부종합</p>
                  <span className="view-detail">상세보기 →</span>
                </div>
                <div className="univ-card" onClick={() => setCurrentView('univ-konkuk')}>
                  <h4>건국대학교</h4>
                  <p className="univ-dept">철학과</p>
                  <p className="univ-type">학생부종합</p>
                  <span className="view-detail">상세보기 →</span>
                </div>
                <div className="univ-card" onClick={() => setCurrentView('univ-hanyang')}>
                  <h4>한양대학교</h4>
                  <p className="univ-dept">글로벌문화통상학부</p>
                  <p className="univ-type">학생부종합</p>
                  <span className="view-detail">상세보기 →</span>
                </div>
                <div className="univ-card" onClick={() => setCurrentView('univ-myongji')}>
                  <h4>명지대학교</h4>
                  <p className="univ-dept">영어영문학과</p>
                  <p className="univ-type">학생부종합</p>
                  <span className="view-detail">상세보기 →</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'creative-activities':
        return <CreativeActivities />;

      case 'subject-performance':
        return <SubjectPerformance />;

      case 'record':
        return <RecordOverview studentRecord={studentRecord} />;

      case 'university':
        return (
          <UniversitySelector
            selectedUniversities={selectedUniversities}
            setSelectedUniversities={setSelectedUniversities}
            universityDatabase={universityDatabase}
          />
        );

      // 개별 대학 상세 페이지
      case 'univ-hufs':
        return <UniversityDetail universityId="hufs" />;

      case 'univ-kyunghee':
        return <UniversityDetail universityId="kyunghee-suwon" />;

      case 'univ-uos':
        return <UniversityDetail universityId="silimdae" />;

      case 'univ-konkuk':
        return <UniversityDetail universityId="konkuk" />;

      case 'univ-hanyang':
        return <UniversityDetail universityId="hanyang-erica" />;

      case 'univ-myongji':
        return <UniversityDetail universityId="myongji-seoul" />;

      case 'interview':
        return (
          <QuestionGenerator
            studentRecord={studentRecord}
            selectedUniversities={selectedUniversities}
            generatedQuestions={generatedQuestions}
            setGeneratedQuestions={setGeneratedQuestions}
          />
        );

      case 'spanish-interview':
        return <SpanishInterview />;

      case 'philosophy-interview':
        return <PhilosophyInterview />;

      case 'analysis':
        return (
          <AnalysisDashboard
            studentRecord={studentRecord}
            selectedUniversities={selectedUniversities}
            generatedQuestions={generatedQuestions}
          />
        );

      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };

  // 통계 계산 함수들
  const calculateAnsweredQuestions = () => {
    return generatedQuestions.filter(q => q.answer && q.answer.trim() !== '').length;
  };

  const calculateReadiness = () => {
    if (generatedQuestions.length === 0) return 0;
    return Math.round((calculateAnsweredQuestions() / generatedQuestions.length) * 100);
  };

  // 하단 탭 바 네비게이션 (모바일)
  const bottomTabItems = [
    { id: 'overview', label: '개요', icon: '🏠' },
    { id: 'admission-data', label: '자료', icon: '📚' },
    { id: 'university', label: '대학', icon: '🎓' },
    { id: 'interview-prep', label: '면접', icon: '💼' },
    { id: 'analysis', label: '분석', icon: '📊' }
  ];

  // 하단 탭 클릭 핸들러
  const handleBottomTabClick = (tabId) => {
    if (tabId === 'admission-data') {
      // 대입전형자료: 첫 번째 자식으로 이동
      setExpandedMenus(['admission-data']);
      setCurrentView('creative-activities');
    } else if (tabId === 'university') {
      // 지원대학: 첫 번째 대학으로 이동
      setExpandedMenus(['university']);
      setCurrentView('univ-hufs');
    } else if (tabId === 'interview-prep') {
      // 면접 준비: 스페인어과로 이동
      setExpandedMenus(['interview-prep']);
      setCurrentView('spanish-interview');
    } else {
      // 단일 페이지 (개요, 분석)
      setCurrentView(tabId);
    }
    closeSidebar();
  };

  // 현재 활성 탭 확인 함수
  const isBottomTabActive = (tabId) => {
    if (tabId === 'overview') return currentView === 'overview';
    if (tabId === 'admission-data') return ['creative-activities', 'subject-performance'].includes(currentView);
    if (tabId === 'university') return currentView.startsWith('univ-');
    if (tabId === 'interview-prep') return ['interview', 'spanish-interview', 'philosophy-interview'].includes(currentView);
    if (tabId === 'analysis') return currentView === 'analysis';
    return false;
  };

  return (
    <div className="univ-exam-container-sidebar">
      {/* 오버레이 배경 (모바일) */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* 좌측 사이드바 */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* 로고 및 헤더 */}
        <div className="sidebar-header">
          <h1 className="sidebar-logo">🎓 UnivExam</h1>
          <p className="sidebar-subtitle">수시면접 준비</p>
        </div>

        {/* 학생 정보 요약 */}
        <div className="sidebar-student-info">
          <div className="student-avatar">
            {studentRecord.studentInfo.name.charAt(0)}
          </div>
          <div className="student-details">
            <p className="student-name">{studentRecord.studentInfo.name}</p>
            <p className="student-school">{studentRecord.studentInfo.school}</p>
            <p className="student-major">{studentRecord.studentInfo.targetMajor}</p>
          </div>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="sidebar-nav">
          {navigationMenu.map(item => (
            <div key={item.id}>
              {item.type === 'single' ? (
                <button
                  className={`sidebar-nav-item ${currentView === item.id ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              ) : (
                <>
                  <button
                    className={`sidebar-nav-item parent ${expandedMenus.includes(item.id) ? 'expanded' : ''}`}
                    onClick={() => toggleMenu(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-arrow">{expandedMenus.includes(item.id) ? '▼' : '▶'}</span>
                  </button>
                  {expandedMenus.includes(item.id) && (
                    <div className="sidebar-submenu">
                      {item.children.map(child => (
                        <button
                          key={child.id}
                          className={`sidebar-nav-item child ${currentView === child.id ? 'active' : ''}`}
                          onClick={() => handleMenuClick(child.id)}
                        >
                          <span className="nav-icon">{child.icon}</span>
                          <span className="nav-label">{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        {/* 준비도 요약 */}
        <div className="sidebar-progress">
          <h4>전체 준비도</h4>
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar-fill"
              style={{ width: `${calculateReadiness()}%` }}
            >
              <span className="progress-text">{calculateReadiness()}%</span>
            </div>
          </div>
          <div className="progress-stats">
            <div className="stat-item">
              <span className="stat-label">총 질문</span>
              <span className="stat-value">{generatedQuestions.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">완료</span>
              <span className="stat-value">{calculateAnsweredQuestions()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">대학</span>
              <span className="stat-value">{selectedUniversities.length}/5</span>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="sidebar-footer">
          <p className="auto-save-note">💾 자동 저장 활성화</p>
          <p className="copyright">© 2025 UnivExam</p>
        </div>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <div className="main-wrapper">
        {/* 상단 헤더 바 */}
        <header className="main-header">
          <div className="header-left">
            {/* 햄버거 메뉴 버튼 (모바일) */}
            <button className="mobile-menu-button" onClick={toggleSidebar} aria-label="메뉴 열기">
              <span className="hamburger-icon">☰</span>
            </button>
            <h2 className="page-title">
              {(() => {
                // 먼저 단일 메뉴에서 찾기
                const singleMenu = navigationMenu.find(item => item.id === currentView);
                if (singleMenu) return singleMenu.label;

                // 자식 메뉴에서 찾기
                for (const parent of navigationMenu) {
                  if (parent.children) {
                    const childMenu = parent.children.find(child => child.id === currentView);
                    if (childMenu) return childMenu.label;
                  }
                }
                return '페이지';
              })()}
            </h2>
          </div>
          <div className="header-right">
            <div className="header-info">
              <span className="info-badge">
                📅 {new Date().toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="main-content-area">
          {renderView()}
        </main>
      </div>

      {/* 하단 탭 바 (모바일 전용) */}
      <nav className="bottom-tab-bar">
        {bottomTabItems.map(tab => (
          <button
            key={tab.id}
            className={`bottom-tab-item ${isBottomTabActive(tab.id) ? 'active' : ''}`}
            onClick={() => handleBottomTabClick(tab.id)}
            aria-label={tab.label}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default UnivExamMain;
