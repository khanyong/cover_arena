import React from 'react';
import { criterionColors } from '../Data/universityData';

/**
 * 분석 및 통계 대시보드 컴포넌트
 */
const AnalysisDashboard = ({
  studentRecord,
  selectedUniversities,
  generatedQuestions
}) => {
  // 전체 준비도 계산
  const calculateOverallReadiness = () => {
    if (generatedQuestions.length === 0) return 0;

    const completedCount = generatedQuestions.filter(
      q => q.preparationStatus === 'completed'
    ).length;

    return Math.round((completedCount / generatedQuestions.length) * 100);
  };

  // 대학별 준비도
  const getUniversityReadiness = () => {
    return selectedUniversities.map(univ => {
      const univQuestions = generatedQuestions.filter(q => q.universityId === univ.id);
      const completed = univQuestions.filter(q => q.preparationStatus === 'completed').length;
      const readiness = univQuestions.length > 0
        ? Math.round((completed / univQuestions.length) * 100)
        : 0;

      return {
        university: univ,
        totalQuestions: univQuestions.length,
        completed: completed,
        inProgress: univQuestions.filter(q => q.preparationStatus === 'in_progress').length,
        notStarted: univQuestions.filter(q => q.preparationStatus === 'not_started').length,
        readiness: readiness
      };
    });
  };

  // 평가기준별 준비도
  const getCriterionReadiness = () => {
    const criterionData = {};

    generatedQuestions.forEach(q => {
      if (!criterionData[q.criterion]) {
        criterionData[q.criterion] = {
          total: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0
        };
      }

      criterionData[q.criterion].total++;
      if (q.preparationStatus === 'completed') {
        criterionData[q.criterion].completed++;
      } else if (q.preparationStatus === 'in_progress') {
        criterionData[q.criterion].inProgress++;
      } else {
        criterionData[q.criterion].notStarted++;
      }
    });

    return Object.entries(criterionData).map(([criterion, data]) => ({
      criterion,
      ...data,
      readiness: Math.round((data.completed / data.total) * 100)
    })).sort((a, b) => b.readiness - a.readiness);
  };

  // 강점 분석
  const analyzeStrengths = () => {
    const strengths = [];

    // 전공 관련 활동 분석
    const majorKeywords = ['프로그래밍', '알고리즘', 'AI', '코딩', '소프트웨어'];
    let majorActivityCount = 0;

    studentRecord.records.forEach(record => {
      if (record.activities) {
        record.activities.forEach(activity => {
          if (activity.keywords?.some(k => majorKeywords.some(mk => k.includes(mk)))) {
            majorActivityCount++;
          }
        });
      }
    });

    if (majorActivityCount >= 5) {
      strengths.push({
        title: '전공 관련 활동 풍부',
        description: `${majorActivityCount}개의 ${studentRecord.studentInfo.targetMajor} 관련 활동`,
        score: 5
      });
    }

    // 리더십 경험
    const leadershipKeywords = ['리더십', '부장', '회장', '팀장'];
    let leadershipCount = 0;

    studentRecord.records.forEach(record => {
      if (record.activities) {
        record.activities.forEach(activity => {
          if (activity.keywords?.some(k => leadershipKeywords.some(lk => k.includes(lk))) ||
              activity.title.includes('부장')) {
            leadershipCount++;
          }
        });
      }
    });

    if (leadershipCount >= 2) {
      strengths.push({
        title: '리더십 경험',
        description: `${leadershipCount}개의 리더십 활동 경험`,
        score: 4
      });
    }

    // 지속성
    const yearlyActivities = { 1: 0, 2: 0, 3: 0 };
    studentRecord.records.forEach(record => {
      if (record.activities) {
        yearlyActivities[record.year] += record.activities.length;
      }
    });

    if (yearlyActivities[1] > 0 && yearlyActivities[2] > 0 && yearlyActivities[3] > 0) {
      strengths.push({
        title: '3년간 꾸준한 활동',
        description: '학년별로 지속적인 활동 참여',
        score: 4
      });
    }

    return strengths.sort((a, b) => b.score - a.score);
  };

  // 개선 제안
  const generateImprovements = () => {
    const improvements = [];
    const criterionReadiness = getCriterionReadiness();

    // 답변 준비도가 낮은 평가기준
    const weakCriteria = criterionReadiness.filter(c => c.readiness < 50);
    if (weakCriteria.length > 0) {
      weakCriteria.forEach(criterion => {
        improvements.push({
          priority: 'high',
          title: `${criterion.criterion} 답변 준비 필요`,
          description: `현재 ${criterion.readiness}% 준비 완료. ${criterion.notStarted}개 질문 미작성`,
          action: `${criterion.criterion} 관련 질문에 대한 답변을 우선적으로 작성하세요.`
        });
      });
    }

    // 대학별 준비도
    const univReadiness = getUniversityReadiness();
    const weakUniversities = univReadiness.filter(u => u.readiness < 50 && u.totalQuestions > 0);

    if (weakUniversities.length > 0) {
      weakUniversities.forEach(univ => {
        improvements.push({
          priority: 'medium',
          title: `${univ.university.name} 준비 강화 필요`,
          description: `${univ.readiness}% 준비 완료 (${univ.completed}/${univ.totalQuestions})`,
          action: `${univ.university.name}의 예상 질문에 대한 답변을 작성하세요.`
        });
      });
    }

    // 생성된 질문이 없는 경우
    if (generatedQuestions.length === 0) {
      improvements.push({
        priority: 'high',
        title: '예상 질문 생성 필요',
        description: '아직 생성된 예상 질문이 없습니다.',
        action: '면접 준비 메뉴에서 대학별 예상 질문을 생성하세요.'
      });
    }

    return improvements;
  };

  const overallReadiness = calculateOverallReadiness();
  const universityReadiness = getUniversityReadiness();
  const criterionReadiness = getCriterionReadiness();
  const strengths = analyzeStrengths();
  const improvements = generateImprovements();

  // 준비도에 따른 색상
  const getReadinessColor = (readiness) => {
    if (readiness >= 80) return '#10b981';
    if (readiness >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="analysis-dashboard">
      <div className="dashboard-header">
        <h2>분석 및 통계</h2>
        <p className="subtitle">면접 준비 현황을 분석하고 개선 방향을 제시합니다</p>
      </div>

      {/* 전체 준비도 */}
      <div className="overall-readiness-section">
        <h3>전체 준비도</h3>
        <div className="readiness-circle-container">
          <div
            className="readiness-circle"
            style={{
              background: `conic-gradient(
                ${getReadinessColor(overallReadiness)} ${overallReadiness * 3.6}deg,
                #e5e7eb ${overallReadiness * 3.6}deg
              )`
            }}
          >
            <div className="readiness-inner">
              <span className="readiness-percentage">{overallReadiness}%</span>
              <span className="readiness-label">준비 완료</span>
            </div>
          </div>
        </div>

        <div className="readiness-stats">
          <div className="stat-item">
            <span className="stat-value">{generatedQuestions.length}</span>
            <span className="stat-label">총 질문 수</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" style={{ color: '#10b981' }}>
              {generatedQuestions.filter(q => q.preparationStatus === 'completed').length}
            </span>
            <span className="stat-label">완료</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" style={{ color: '#f59e0b' }}>
              {generatedQuestions.filter(q => q.preparationStatus === 'in_progress').length}
            </span>
            <span className="stat-label">작성중</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" style={{ color: '#94a3b8' }}>
              {generatedQuestions.filter(q => q.preparationStatus === 'not_started').length}
            </span>
            <span className="stat-label">미작성</span>
          </div>
        </div>
      </div>

      {/* 대학별 준비도 */}
      {universityReadiness.length > 0 && (
        <div className="university-readiness-section">
          <h3>대학별 준비 현황</h3>
          <div className="university-readiness-grid">
            {universityReadiness.map((univ, index) => (
              <div key={univ.university.id} className="university-readiness-card">
                <div className="card-header">
                  <div className="univ-info">
                    <span className="univ-rank">{index + 1}지망</span>
                    <h4>{univ.university.name}</h4>
                    <p>{univ.university.department}</p>
                  </div>
                  <div
                    className="readiness-badge"
                    style={{ color: getReadinessColor(univ.readiness) }}
                  >
                    {univ.readiness}%
                  </div>
                </div>

                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${univ.readiness}%`,
                      backgroundColor: getReadinessColor(univ.readiness)
                    }}
                  />
                </div>

                <div className="card-stats">
                  <span>총 {univ.totalQuestions}개</span>
                  <span>│</span>
                  <span className="completed-stat">완료 {univ.completed}</span>
                  <span>│</span>
                  <span className="progress-stat">작성중 {univ.inProgress}</span>
                  <span>│</span>
                  <span className="notstarted-stat">미작성 {univ.notStarted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 평가기준별 준비도 */}
      {criterionReadiness.length > 0 && (
        <div className="criterion-readiness-section">
          <h3>평가기준별 준비 현황</h3>
          <div className="criterion-readiness-list">
            {criterionReadiness.map(criterion => {
              const color = criterionColors[criterion.criterion] || '#94a3b8';
              return (
                <div key={criterion.criterion} className="criterion-readiness-item">
                  <div className="criterion-info">
                    <div
                      className="criterion-color-dot"
                      style={{ backgroundColor: color }}
                    />
                    <span className="criterion-name">{criterion.criterion}</span>
                    <span className="criterion-count">({criterion.total}개 질문)</span>
                  </div>

                  <div className="criterion-progress-container">
                    <div
                      className="criterion-progress-bar"
                      style={{
                        width: `${criterion.readiness}%`,
                        backgroundColor: color
                      }}
                    >
                      <span className="progress-text">{criterion.readiness}%</span>
                    </div>
                  </div>

                  <div className="criterion-breakdown">
                    <span className="completed">✅ {criterion.completed}</span>
                    <span className="in-progress">⏳ {criterion.inProgress}</span>
                    <span className="not-started">⚪ {criterion.notStarted}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 강점 분석 */}
      {strengths.length > 0 && (
        <div className="strengths-section">
          <h3>✨ 강점 분석</h3>
          <div className="strengths-grid">
            {strengths.map((strength, index) => (
              <div key={index} className="strength-card">
                <div className="strength-score">
                  {'⭐'.repeat(strength.score)}
                </div>
                <h4>{strength.title}</h4>
                <p>{strength.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 개선 제안 */}
      {improvements.length > 0 && (
        <div className="improvements-section">
          <h3>🎯 개선 제안</h3>
          <div className="improvements-list">
            {improvements.map((improvement, index) => (
              <div
                key={index}
                className={`improvement-card priority-${improvement.priority}`}
              >
                <div className="improvement-header">
                  <span className="priority-badge">
                    {improvement.priority === 'high' ? '🔴 높음' :
                     improvement.priority === 'medium' ? '🟡 중간' : '🟢 낮음'}
                  </span>
                  <h4>{improvement.title}</h4>
                </div>
                <p className="improvement-description">{improvement.description}</p>
                <p className="improvement-action">
                  <strong>권장 조치:</strong> {improvement.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 추가 인사이트 */}
      <div className="insights-section">
        <h3>💡 추가 인사이트</h3>
        <div className="insights-content">
          <div className="insight-item">
            <h4>면접까지 남은 시간 활용</h4>
            <p>
              현재 준비도가 {overallReadiness}%입니다.
              {overallReadiness < 50 && ' 아직 준비가 부족하니 더 집중적으로 준비하세요.'}
              {overallReadiness >= 50 && overallReadiness < 80 && ' 절반 이상 준비되었습니다. 남은 질문들에 집중하세요.'}
              {overallReadiness >= 80 && ' 잘 준비되고 있습니다! 작성한 답변들을 반복해서 연습하세요.'}
            </p>
          </div>

          <div className="insight-item">
            <h4>우선순위 설정</h4>
            <p>
              평가 비중이 높은 항목의 질문들을 우선적으로 준비하세요.
              특히 각 대학의 주요 평가기준에 해당하는 질문에 집중하는 것이 효율적입니다.
            </p>
          </div>

          <div className="insight-item">
            <h4>모의 면접 연습</h4>
            <p>
              답변 작성이 완료된 질문들은 실제로 소리내어 말하는 연습을 하세요.
              타이머를 사용하여 제한 시간 내에 답변하는 연습도 병행하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
