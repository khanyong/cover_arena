import React, { useState, useEffect } from 'react';
import RecordOverview from './StudentRecord/RecordOverview';
import CreativeActivities from './AdmissionData/CreativeActivities';
import SubjectPerformance from './AdmissionData/SubjectPerformance';
import ReadingActivities from './AdmissionData/ReadingActivities';
import VolunteerActivities from './AdmissionData/VolunteerActivities';
import UniversitySelector from './University/UniversitySelector';
import UniversityDetail from './University/UniversityDetail';
import QuestionGenerator from './Interview/QuestionGenerator';
import EssentialQuestions from './Interview/EssentialQuestions';
import CategoryQuestions from './Interview/CategoryQuestions';
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
        { id: 'subject-performance', label: '교과학습발달상황', icon: '' },
        { id: 'reading-activities', label: '독서활동상황', icon: '' },
        { id: 'volunteer-activities', label: '봉사활동상황', icon: '' }
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
        { id: 'essential-questions', label: '필수질문', icon: '' },
        { id: 'category-questions', label: '항목별 예상질문', icon: '' },
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
            <h2>📊 2026 수시면접 준비 현황</h2>

            {/* 전체 준비도 요약 */}
            <div className="overview-hero">
              <div className="hero-stat">
                <div className="hero-stat-number">{calculateReadiness()}%</div>
                <div className="hero-stat-label">전체 준비도</div>
              </div>
              <div className="hero-stats-grid">
                <div className="hero-mini-stat">
                  <span className="mini-stat-icon">✅</span>
                  <span className="mini-stat-value">78개</span>
                  <span className="mini-stat-label">작성완료</span>
                </div>
                <div className="hero-mini-stat">
                  <span className="mini-stat-icon">🔍</span>
                  <span className="mini-stat-value">20개</span>
                  <span className="mini-stat-label">검증필요</span>
                </div>
                <div className="hero-mini-stat">
                  <span className="mini-stat-icon">➕</span>
                  <span className="mini-stat-value">20개</span>
                  <span className="mini-stat-label">추가예정</span>
                </div>
              </div>
            </div>

            <div className="overview-grid">
              <div className="overview-card">
                <h3>👤 수험생 정보</h3>
                <div className="student-info-detail">
                  <p><strong>이름:</strong> {studentRecord.studentInfo.name}</p>
                  <p><strong>학교:</strong> {studentRecord.studentInfo.school}</p>
                  <p><strong>학년:</strong> {studentRecord.studentInfo.currentGrade}학년</p>
                  <p><strong>희망전공:</strong> 스페인어과, 철학과, 글로벌문화통상학부, 영어영문학과</p>
                </div>
              </div>

              <div className="overview-card">
                <h3>🎓 지원 대학 현황 (6개교)</h3>
                <div className="university-list">
                  <div className="univ-list-item">
                    <span className="univ-badge spanish">스페인어</span>
                    <span>한국외국어대학교 스페인어과</span>
                  </div>
                  <div className="univ-list-item">
                    <span className="univ-badge spanish">스페인어</span>
                    <span>경희대학교 스페인어학과</span>
                  </div>
                  <div className="univ-list-item">
                    <span className="univ-badge philosophy">철학</span>
                    <span>서울시립대학교 철학과</span>
                  </div>
                  <div className="univ-list-item">
                    <span className="univ-badge philosophy">철학</span>
                    <span>건국대학교 철학과</span>
                  </div>
                  <div className="univ-list-item">
                    <span className="univ-badge global">문화통상</span>
                    <span>한양대학교 글로벌문화통상학부</span>
                  </div>
                  <div className="univ-list-item">
                    <span className="univ-badge english">영어영문</span>
                    <span>명지대학교 영어영문학과</span>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>📋 대입전형자료</h3>
                <div className="data-summary">
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['admission-data']);
                      setCurrentView('creative-activities');
                    }}
                  >
                    <span className="btn-icon">📋</span>
                    <span className="btn-content">
                      <span className="btn-title">창의적 체험활동상황</span>
                      <span className="btn-desc">자율/동아리/봉사/진로활동</span>
                    </span>
                    <span className="btn-arrow">→</span>
                  </button>
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['admission-data']);
                      setCurrentView('subject-performance');
                    }}
                  >
                    <span className="btn-icon">📚</span>
                    <span className="btn-content">
                      <span className="btn-title">교과학습발달상황</span>
                      <span className="btn-desc">세부능력 및 특기사항</span>
                    </span>
                    <span className="btn-arrow">→</span>
                  </button>
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['admission-data']);
                      setCurrentView('reading-activities');
                    }}
                  >
                    <span className="btn-icon">📖</span>
                    <span className="btn-content">
                      <span className="btn-title">독서활동상황</span>
                      <span className="btn-desc">3년간 독서기록</span>
                    </span>
                    <span className="btn-arrow">→</span>
                  </button>
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['admission-data']);
                      setCurrentView('volunteer-activities');
                    }}
                  >
                    <span className="btn-icon">🤝</span>
                    <span className="btn-content">
                      <span className="btn-title">봉사활동상황</span>
                      <span className="btn-desc">68시간 봉사활동 기록</span>
                    </span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>

              <div className="overview-card">
                <h3>💬 면접 준비 현황</h3>
                <div className="interview-summary">
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['interview-prep']);
                      setCurrentView('essential-questions');
                    }}
                  >
                    <span className="btn-icon">⭐</span>
                    <span className="btn-content">
                      <span className="btn-title">필수질문 (30개)</span>
                      <span className="btn-desc">5개 질문 x 6개 대학</span>
                    </span>
                    <span className="btn-arrow">→</span>
                  </button>
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['interview-prep']);
                      setCurrentView('category-questions');
                    }}
                  >
                    <span className="btn-icon">📑</span>
                    <span className="btn-content">
                      <span className="btn-title">항목별 예상질문 (42개)</span>
                      <span className="btn-desc">8개 카테고리별 질문</span>
                    </span>
                    <span className="btn-arrow">→</span>
                  </button>
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['interview-prep']);
                      setCurrentView('spanish-interview');
                    }}
                  >
                    <span className="btn-icon">🗣️</span>
                    <span className="btn-content">
                      <span className="btn-title">스페인어과 면접 (6개)</span>
                      <span className="btn-desc">전공적합성 심화질문</span>
                    </span>
                    <span className="btn-arrow">→</span>
                  </button>
                  <button
                    className="overview-link-btn"
                    onClick={() => {
                      setExpandedMenus(['interview-prep']);
                      setCurrentView('philosophy-interview');
                    }}
                  >
                    <span className="btn-icon">🧠</span>
                    <span className="btn-content">
                      <span className="btn-title">철학과 면접 (6개)</span>
                      <span className="btn-desc">철학적 사고 심화질문</span>
                    </span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="university-details-grid">
              <h3>🎯 지원 대학 상세 정보</h3>
              <div className="university-cards">
                <div className="univ-card spanish" onClick={() => setCurrentView('univ-hufs')}>
                  <div className="univ-card-header">
                    <h4>한국외국어대학교</h4>
                    <span className="univ-badge-small">스페인어과</span>
                  </div>
                  <p className="univ-dept">스페인어과</p>
                  <p className="univ-type">학생부종합 (면접형)</p>
                  <div className="univ-highlights">
                    <span className="highlight-tag">통번역 심��</span>
                    <span className="highlight-tag">교환학생</span>
                  </div>
                  <span className="view-detail">상세보기 →</span>
                </div>
                <div className="univ-card spanish" onClick={() => setCurrentView('univ-kyunghee')}>
                  <div className="univ-card-header">
                    <h4>경희대학교</h4>
                    <span className="univ-badge-small">스페인어학과</span>
                  </div>
                  <p className="univ-dept">스페인어학과</p>
                  <p className="univ-type">학생부종합 (네오르네상스)</p>
                  <div className="univ-highlights">
                    <span className="highlight-tag">문화세계창조</span>
                    <span className="highlight-tag">인문학중심</span>
                  </div>
                  <span className="view-detail">상세보기 →</span>
                </div>
                <div className="univ-card philosophy" onClick={() => setCurrentView('univ-uos')}>
                  <div className="univ-card-header">
                    <h4>서울시립대학교</h4>
                    <span className="univ-badge-small">철학과</span>
                  </div>
                  <p className="univ-dept">철학과</p>
                  <p className="univ-type">학생부종합</p>
                  <div className="univ-highlights">
                    <span className="highlight-tag">실천철학</span>
                    <span className="highlight-tag">사회철학</span>
                  </div>
                  <span className="view-detail">상세보기 →</span>
                </div>
                <div className="univ-card philosophy" onClick={() => setCurrentView('univ-konkuk')}>
                  <div className="univ-card-header">
                    <h4>건국대학교</h4>
                    <span className="univ-badge-small">철학과</span>
                  </div>
                  <p className="univ-dept">철학과</p>
                  <p className="univ-type">학생부종합</p>
                  <div className="univ-highlights">
                    <span className="highlight-tag">동서양융합</span>
                    <span className="highlight-tag">응용윤리</span>
                  </div>
                  <span className="view-detail">상세보기 →</span>
                </div>
                <div className="univ-card global" onClick={() => setCurrentView('univ-hanyang')}>
                  <div className="univ-card-header">
                    <h4>한양대학교</h4>
                    <span className="univ-badge-small">문화통상</span>
                  </div>
                  <p className="univ-dept">글로벌문화통상학부</p>
                  <p className="univ-type">학생부종합</p>
                  <div className="univ-highlights">
                    <span className="highlight-tag">문화+경제</span>
                    <span className="highlight-tag">글로벌</span>
                  </div>
                  <span className="view-detail">상세보기 →</span>
                </div>
                <div className="univ-card english" onClick={() => setCurrentView('univ-myongji')}>
                  <div className="univ-card-header">
                    <h4>명지대학교</h4>
                    <span className="univ-badge-small">영어영문</span>
                  </div>
                  <p className="univ-dept">영어영문학과</p>
                  <p className="univ-type">학생부종합</p>
                  <div className="univ-highlights">
                    <span className="highlight-tag">교직이수</span>
                    <span className="highlight-tag">영어교육</span>
                  </div>
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

      case 'reading-activities':
        return <ReadingActivities />;

      case 'volunteer-activities':
        return <VolunteerActivities />;

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

      case 'essential-questions':
        return <EssentialQuestions />;

      case 'category-questions':
        return <CategoryQuestions />;

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
  const calculateReadiness = () => {
    let totalItems = 0;
    let completedItems = 0;

    // 1. 필수질문 준비도 (5개 필수질문 x 6개 대학 = 30개)
    totalItems += 30;
    completedItems += 25; // 작성 완료했지만 검증 필요

    // 2. 항목별 예상질문 준비도 (카테고리별 질문들)
    // 자기소개(5), 지원동기(5), 학업계획(5), 장단점(4), 생기부(10), 시사(5), 상황(5), 마무리(3) = 총 42개
    totalItems += 42;
    completedItems += 35; // 작성 완료했지만 검증 및 추가 필요

    // 3. 스페인어과 면접 준비 (6개 질문)
    totalItems += 6;
    completedItems += 5; // 작성 완료했지만 검증 필요

    // 4. 철학과 면접 준비 (6개 질문)
    totalItems += 6;
    completedItems += 5; // 작성 완료했지만 검증 필요

    // 5. 대입전형자료 확인 (4개 섹션)
    totalItems += 4;
    completedItems += 4; // 자료 확인 완료

    // 6. 지원대학 정보 확인 (6개 대학)
    totalItems += 6;
    completedItems += 4; // 일부 대학 정보 확인 완료

    // 7. 추가 예상질문 및 검증 작업 (예정)
    totalItems += 20;
    completedItems += 0; // 아직 시작 안 함

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
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
              <span className="stat-label">작성완료</span>
              <span className="stat-value">78개</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">검증필요</span>
              <span className="stat-value">20개</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">추가예정</span>
              <span className="stat-value">20개</span>
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
