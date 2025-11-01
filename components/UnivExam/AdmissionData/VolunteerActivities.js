import React, { useState } from 'react';
import { parsedStudentRecord } from '../Data/parsedStudentRecord';

/**
 * 봉사활동상황 컴포넌트
 * 학생의 봉사활동 실적을 표시
 */
const VolunteerActivities = () => {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const volunteerData = parsedStudentRecord.volunteerActivities || [];

  // 학년별 필터링
  const filteredData = selectedGrade === 'all'
    ? volunteerData
    : volunteerData.filter(item => item.학년 === parseInt(selectedGrade));

  // 학년별 통계
  const getGradeStats = (grade) => {
    const gradeActivities = volunteerData.filter(item => item.학년 === grade);
    const totalHours = gradeActivities.reduce((sum, item) => sum + item.시간, 0);
    const activityCount = gradeActivities.length;
    return { totalHours, activityCount };
  };

  const grade1Stats = getGradeStats(1);
  const grade2Stats = getGradeStats(2);
  const grade3Stats = getGradeStats(3);
  const totalStats = {
    totalHours: grade1Stats.totalHours + grade2Stats.totalHours + grade3Stats.totalHours,
    activityCount: grade1Stats.activityCount + grade2Stats.activityCount + grade3Stats.activityCount
  };

  // 활동 유형별 분류
  const getActivityType = (content) => {
    if (content.includes('환경') || content.includes('분리수거') || content.includes('재활용')) return '환경';
    if (content.includes('소양 교육')) return '교육';
    if (content.includes('영어회화') || content.includes('재능')) return '학습지원';
    if (content.includes('홍보') || content.includes('책자')) return '홍보';
    return '기타';
  };

  return (
    <div className="volunteer-activities-container">
      {/* 헤더 */}
      <div className="section-header">
        <h2>🤝 봉사활동상황</h2>
        <p className="header-description">
          고등학교 재학 중 수행한 봉사활동 실적입니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">전체 봉사시간</div>
            <div className="stat-value">{totalStats.totalHours}시간</div>
            <div className="stat-detail">총 {totalStats.activityCount}회 활동</div>
          </div>
        </div>

        <div className="stat-card grade1">
          <div className="stat-icon">1️⃣</div>
          <div className="stat-content">
            <div className="stat-label">1학년</div>
            <div className="stat-value">{grade1Stats.totalHours}시간</div>
            <div className="stat-detail">{grade1Stats.activityCount}회 활동</div>
          </div>
        </div>

        <div className="stat-card grade2">
          <div className="stat-icon">2️⃣</div>
          <div className="stat-content">
            <div className="stat-label">2학년</div>
            <div className="stat-value">{grade2Stats.totalHours}시간</div>
            <div className="stat-detail">{grade2Stats.activityCount}회 활동</div>
          </div>
        </div>

        <div className="stat-card grade3">
          <div className="stat-icon">3️⃣</div>
          <div className="stat-content">
            <div className="stat-label">3학년</div>
            <div className="stat-value">{grade3Stats.totalHours}시간</div>
            <div className="stat-detail">{grade3Stats.activityCount}회 활동</div>
          </div>
        </div>
      </div>

      {/* 필터 버튼 */}
      <div className="filter-section">
        <div className="filter-label">학년 필터:</div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedGrade === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedGrade('all')}
          >
            전체
          </button>
          <button
            className={`filter-btn ${selectedGrade === '1' ? 'active' : ''}`}
            onClick={() => setSelectedGrade('1')}
          >
            1학년
          </button>
          <button
            className={`filter-btn ${selectedGrade === '2' ? 'active' : ''}`}
            onClick={() => setSelectedGrade('2')}
          >
            2학년
          </button>
          <button
            className={`filter-btn ${selectedGrade === '3' ? 'active' : ''}`}
            onClick={() => setSelectedGrade('3')}
          >
            3학년
          </button>
        </div>
      </div>

      {/* 활동 목록 */}
      <div className="activities-list">
        <div className="list-header">
          <div className="header-cell grade">학년</div>
          <div className="header-cell date">일자/기간</div>
          <div className="header-cell location">장소</div>
          <div className="header-cell content">활동내용</div>
          <div className="header-cell hours">시간</div>
          <div className="header-cell cumulative">누계</div>
        </div>

        {filteredData.length > 0 ? (
          filteredData.map((activity, index) => (
            <div key={index} className={`activity-row grade-${activity.학년}`}>
              <div className="cell grade">
                <span className="grade-badge">{activity.학년}학년</span>
              </div>
              <div className="cell date">{activity.일자또는기간}</div>
              <div className="cell location">
                {activity.장소또는주관기관명.replace('(학교)', '')}
              </div>
              <div className="cell content">
                <div className="content-text">{activity.활동내용}</div>
                <span className={`activity-type-badge ${getActivityType(activity.활동내용)}`}>
                  {getActivityType(activity.활동내용)}
                </span>
              </div>
              <div className="cell hours">
                <span className="hours-badge">{activity.시간}시간</span>
              </div>
              <div className="cell cumulative">
                <span className="cumulative-badge">{activity.누계시간}시간</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <p>선택한 학년의 봉사활동 기록이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 활동 유형별 분석 */}
      <div className="activity-analysis">
        <h3>📌 활동 유형별 분석</h3>
        <div className="analysis-grid">
          <div className="analysis-card">
            <div className="analysis-icon">🌱</div>
            <div className="analysis-content">
              <h4>환경 보호</h4>
              <p>분리수거, 환경정화, 재활용 활동</p>
              <span className="activity-count">
                {filteredData.filter(a => getActivityType(a.활동내용) === '환경').length}회
              </span>
            </div>
          </div>

          <div className="analysis-card">
            <div className="analysis-icon">📚</div>
            <div className="analysis-content">
              <h4>학습 지원</h4>
              <p>영어회화 활동, 재능기부</p>
              <span className="activity-count">
                {filteredData.filter(a => getActivityType(a.활동내용) === '학습지원').length}회
              </span>
            </div>
          </div>

          <div className="analysis-card">
            <div className="analysis-icon">📢</div>
            <div className="analysis-content">
              <h4>홍보 활동</h4>
              <p>요강 책자 전달, 중학생 대상 홍보</p>
              <span className="activity-count">
                {filteredData.filter(a => getActivityType(a.활동내용) === '홍보').length}회
              </span>
            </div>
          </div>

          <div className="analysis-card">
            <div className="analysis-icon">🎓</div>
            <div className="analysis-content">
              <h4>봉사 교육</h4>
              <p>봉사활동 소양 교육</p>
              <span className="activity-count">
                {filteredData.filter(a => getActivityType(a.활동내용) === '교육').length}회
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 의미와 성장 */}
      <div className="reflection-section">
        <h3>💭 봉사활동을 통한 성장</h3>
        <div className="reflection-content">
          <div className="reflection-item">
            <div className="reflection-icon">🌟</div>
            <div className="reflection-text">
              <h4>환경 보호 의식</h4>
              <p>분리수거와 환경정화 활동을 통해 지속가능한 발전의 중요성을 체득했습니다.</p>
            </div>
          </div>
          <div className="reflection-item">
            <div className="reflection-icon">🤝</div>
            <div className="reflection-text">
              <h4>나눔과 배려</h4>
              <p>학습 지원과 재능기부를 통해 지식을 나누는 기쁨과 책임감을 배웠습니다.</p>
            </div>
          </div>
          <div className="reflection-item">
            <div className="reflection-icon">💪</div>
            <div className="reflection-text">
              <h4>지속적인 참여</h4>
              <p>3년간 꾸준한 봉사활동으로 작은 실천이 큰 변화를 만든다는 것을 깨달았습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerActivities;
