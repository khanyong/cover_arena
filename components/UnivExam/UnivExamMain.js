import React, { useState, useEffect } from 'react';
import RecordOverview from './StudentRecord/RecordOverview';
import CreativeActivities from './AdmissionData/CreativeActivities';
import SubjectPerformance from './AdmissionData/SubjectPerformance';
import UniversitySelector from './University/UniversitySelector';
import UniversityDetail from './University/UniversityDetail';
import QuestionGenerator from './Interview/QuestionGenerator';
import SpanishInterview from './Interview/SpanishInterview';
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
        { id: 'univ-hufs', label: '한국외국어대학교-스페인어과', icon: '' },
        { id: 'univ-kyunghee', label: '경희대-스페인어과', icon: '' },
        { id: 'univ-uos', label: '시립대-철학과', icon: '' },
        { id: 'univ-konkuk', label: '건국대-철학과', icon: '' },
        { id: 'univ-hanyang', label: '한양대-글로벌문화통상학부', icon: '' },
        { id: 'univ-myongji', label: '명지대학교-영어영문', icon: '' }
      ]
    },
    {
      id: 'interview-prep',
      label: '면접 준비',
      icon: '',
      type: 'parent',
      children: [
        { id: 'interview', label: '예상 질문 생성', icon: '' },
        { id: 'spanish-interview', label: '스페인어과', icon: '' }
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
                <h3>생활기록부 통계</h3>
                <p><strong>총 활동 수:</strong> {calculateTotalActivities()}개</p>
                <p><strong>동아리 활동:</strong> {calculateClubActivities()}개</p>
                <p><strong>진로 활동:</strong> {calculateCareerActivities()}개</p>
              </div>

              <div className="overview-card">
                <h3>지원 대학</h3>
                <p><strong>선택된 대학:</strong> {selectedUniversities.length}개 / 5개</p>
                {selectedUniversities.length < 5 && (
                  <button
                    className="btn-primary"
                    onClick={() => setCurrentView('university')}
                  >
                    대학 추가하기
                  </button>
                )}
              </div>

              <div className="overview-card">
                <h3>면접 준비 현황</h3>
                <p><strong>생성된 질문:</strong> {generatedQuestions.length}개</p>
                <p><strong>답변 작성:</strong> {calculateAnsweredQuestions()}개</p>
                <p><strong>준비도:</strong> {calculateReadiness()}%</p>
              </div>
            </div>

            <div className="quick-actions">
              <h3>빠른 시작</h3>
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={() => setCurrentView('creative-activities')}
                >
                  🎨 창의적 체험활동 확인하기
                </button>
                <button
                  className="action-btn"
                  onClick={() => setCurrentView('subject-performance')}
                >
                  📚 교과학습발달 확인하기
                </button>
                <button
                  className="action-btn"
                  onClick={() => setCurrentView('university')}
                >
                  🏫 지원 대학 설정하기
                </button>
                <button
                  className="action-btn"
                  onClick={() => setCurrentView('interview')}
                  disabled={selectedUniversities.length === 0}
                >
                  💼 예상 질문 생성하기
                </button>
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
  const calculateTotalActivities = () => {
    return studentRecord.records.reduce((total, record) => {
      if (record.activities) {
        return total + record.activities.length;
      }
      return total;
    }, 0);
  };

  const calculateClubActivities = () => {
    return studentRecord.records.filter(r => r.category === '동아리활동')
      .reduce((total, record) => total + (record.activities?.length || 0), 0);
  };

  const calculateCareerActivities = () => {
    return studentRecord.records.filter(r => r.category === '진로활동')
      .reduce((total, record) => total + (record.activities?.length || 0), 0);
  };

  const calculateAnsweredQuestions = () => {
    return generatedQuestions.filter(q => q.answer && q.answer.trim() !== '').length;
  };

  const calculateReadiness = () => {
    if (generatedQuestions.length === 0) return 0;
    return Math.round((calculateAnsweredQuestions() / generatedQuestions.length) * 100);
  };

  return (
    <div className="univ-exam-container-sidebar">
      {/* 좌측 사이드바 */}
      <aside className="sidebar">
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
                  onClick={() => setCurrentView(item.id)}
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
                          onClick={() => setCurrentView(child.id)}
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
    </div>
  );
};

export default UnivExamMain;
