import React from 'react';
import { recordCategories } from '../Data/sampleStudentRecord';

/**
 * 활동 분석 및 인사이트 컴포넌트
 */
const ActivityAnalysis = ({ records, studentInfo, specialNotes }) => {
  // 카테고리별 활동 수 계산
  const getCategoryDistribution = () => {
    const distribution = {};

    recordCategories.forEach(category => {
      const categoryRecords = records.filter(r => r.category === category.id);
      const count = categoryRecords.reduce((sum, record) => {
        return sum + (record.activities?.length || record.subjects?.length || 0);
      }, 0);

      distribution[category.id] = {
        name: category.name,
        count: count,
        color: category.color
      };
    });

    return distribution;
  };

  // 학년별 활동 추이
  const getYearlyTrend = () => {
    const trend = { 1: 0, 2: 0, 3: 0 };

    records.forEach(record => {
      if (record.activities) {
        trend[record.year] = (trend[record.year] || 0) + record.activities.length;
      }
      if (record.subjects && record.category !== '행동특성') {
        trend[record.year] = (trend[record.year] || 0) + record.subjects.length;
      }
    });

    return trend;
  };

  // 키워드 분석
  const getKeywordAnalysis = () => {
    const keywordCount = {};

    records.forEach(record => {
      if (record.activities) {
        record.activities.forEach(activity => {
          if (activity.keywords) {
            activity.keywords.forEach(keyword => {
              keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
            });
          }
        });
      }
    });

    return Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  // 전공 관련 활동 분석
  const getMajorRelatedActivities = () => {
    const majorKeywords = ['프로그래밍', '알고리즘', 'AI', '코딩', '소프트웨어', 'SW', '웹개발', '앱개발'];
    let count = 0;
    const activities = [];

    records.forEach(record => {
      if (record.activities) {
        record.activities.forEach(activity => {
          const isMajorRelated = activity.keywords?.some(keyword =>
            majorKeywords.some(mk => keyword.includes(mk))
          ) || activity.title.includes('프로그래밍') || activity.title.includes('코딩');

          if (isMajorRelated) {
            count++;
            activities.push({
              year: record.year,
              title: activity.title,
              category: record.category
            });
          }
        });
      }

      if (record.category === '전공관련교과' && record.subjects) {
        count += record.subjects.length;
        record.subjects.forEach(subject => {
          activities.push({
            year: record.year,
            title: subject.name,
            category: '전공관련교과'
          });
        });
      }
    });

    return { count, activities };
  };

  // 리더십 활동 분석
  const getLeadershipActivities = () => {
    const leadershipKeywords = ['리더십', '부장', '회장', '팀장', '리더', '운영', '기획'];
    const activities = [];

    records.forEach(record => {
      if (record.activities) {
        record.activities.forEach(activity => {
          const isLeadership = activity.keywords?.some(keyword =>
            leadershipKeywords.some(lk => keyword.includes(lk))
          ) || activity.title.includes('부장') || activity.title.includes('리더');

          if (isLeadership) {
            activities.push({
              year: record.year,
              title: activity.title,
              description: activity.description
            });
          }
        });
      }
    });

    return activities;
  };

  const distribution = getCategoryDistribution();
  const yearlyTrend = getYearlyTrend();
  const topKeywords = getKeywordAnalysis();
  const majorRelated = getMajorRelatedActivities();
  const leadershipActivities = getLeadershipActivities();

  const maxCount = Math.max(...Object.values(distribution).map(d => d.count));
  const maxYearCount = Math.max(...Object.values(yearlyTrend));

  return (
    <div className="activity-analysis">
      <h3>활동 분석 및 인사이트</h3>

      {/* 전체 통계 */}
      <div className="analysis-summary">
        <div className="summary-card">
          <div className="summary-number">
            {Object.values(distribution).reduce((sum, d) => sum + d.count, 0)}
          </div>
          <div className="summary-label">총 활동 수</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{majorRelated.count}</div>
          <div className="summary-label">전공 관련 활동</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{leadershipActivities.length}</div>
          <div className="summary-label">리더십 활동</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{topKeywords.length}</div>
          <div className="summary-label">핵심 키워드</div>
        </div>
      </div>

      {/* 카테고리별 분포 */}
      <div className="analysis-section">
        <h4>📊 카테고리별 활동 분포</h4>
        <div className="category-distribution">
          {Object.entries(distribution).map(([categoryId, data]) => (
            <div key={categoryId} className="distribution-item">
              <div className="distribution-label">
                <span>{data.name}</span>
                <span className="distribution-count">{data.count}개</span>
              </div>
              <div className="distribution-bar-container">
                <div
                  className="distribution-bar"
                  style={{
                    width: `${(data.count / maxCount) * 100}%`,
                    backgroundColor: data.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 학년별 추이 */}
      <div className="analysis-section">
        <h4>📈 학년별 활동 추이</h4>
        <div className="yearly-trend">
          {Object.entries(yearlyTrend).map(([year, count]) => (
            <div key={year} className="trend-item">
              <div className="trend-label">{year}학년</div>
              <div className="trend-bar-container">
                <div
                  className="trend-bar"
                  style={{
                    height: `${(count / maxYearCount) * 100}%`
                  }}
                >
                  <span className="trend-count">{count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="trend-insight">
          {yearlyTrend[3] > yearlyTrend[1] ? (
            <p>✅ 학년이 올라갈수록 활동이 증가하여 지속적인 성장을 보여줍니다.</p>
          ) : yearlyTrend[3] < yearlyTrend[1] ? (
            <p>⚠️ 3학년 활동이 다소 감소했습니다. 수시 준비로 인한 자연스러운 현상일 수 있습니다.</p>
          ) : (
            <p>📊 학년별로 고른 활동 분포를 보이고 있습니다.</p>
          )}
        </div>
      </div>

      {/* 핵심 키워드 */}
      <div className="analysis-section">
        <h4>🔑 핵심 키워드 Top 10</h4>
        <div className="keyword-cloud">
          {topKeywords.map(([keyword, count], index) => (
            <div
              key={keyword}
              className="keyword-item"
              style={{
                fontSize: `${14 + (10 - index) * 0.5}px`,
                opacity: 1 - index * 0.05
              }}
            >
              {keyword} <span className="keyword-count">({count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* 전공 관련 활동 */}
      <div className="analysis-section">
        <h4>💻 전공({studentInfo.targetMajor}) 관련 활동</h4>
        <p className="section-description">
          총 {majorRelated.count}개의 전공 관련 활동이 확인되었습니다.
        </p>
        <div className="major-activities-list">
          {majorRelated.activities.map((activity, index) => (
            <div key={index} className="major-activity-item">
              <span className="activity-year">{activity.year}학년</span>
              <span className="activity-title">{activity.title}</span>
              <span className="activity-category">{activity.category}</span>
            </div>
          ))}
        </div>
        <div className="insight">
          {majorRelated.count >= 8 ? (
            <p>✅ 전공에 대한 관심과 준비가 매우 잘 되어 있습니다.</p>
          ) : majorRelated.count >= 5 ? (
            <p>✅ 전공 관련 활동이 충분히 확보되어 있습니다.</p>
          ) : (
            <p>⚠️ 전공 관련 활동을 더 강조할 필요가 있습니다.</p>
          )}
        </div>
      </div>

      {/* 리더십 활동 */}
      <div className="analysis-section">
        <h4>👥 리더십 및 협업 활동</h4>
        <p className="section-description">
          총 {leadershipActivities.length}개의 리더십 활동이 확인되었습니다.
        </p>
        <div className="leadership-activities">
          {leadershipActivities.map((activity, index) => (
            <div key={index} className="leadership-item">
              <div className="leadership-header">
                <span className="activity-year">{activity.year}학년</span>
                <h5>{activity.title}</h5>
              </div>
              <p className="leadership-description">{activity.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 종합 평가 */}
      {specialNotes && (
        <div className="analysis-section">
          <h4>📝 종합 평가</h4>
          <div className="special-notes-box">
            <ul>
              {specialNotes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 면접 대비 인사이트 */}
      <div className="analysis-section insight-box">
        <h4>💡 면접 대비 인사이트</h4>
        <div className="insights">
          <div className="insight-item">
            <strong>강점:</strong>
            <ul>
              <li>3년간 일관된 {studentInfo.targetMajor} 관련 활동</li>
              {leadershipActivities.length > 0 && (
                <li>다양한 리더십 및 협업 경험</li>
              )}
              <li>자기주도적 학습 및 프로젝트 수행</li>
            </ul>
          </div>
          <div className="insight-item">
            <strong>면접 시 강조할 점:</strong>
            <ul>
              <li>전공에 대한 지속적인 관심과 깊이 있는 학습</li>
              <li>이론과 실습의 균형잡힌 접근</li>
              <li>협업과 리더십 경험을 통한 성장</li>
              <li>실패를 통한 학습과 성장 마인드셋</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityAnalysis;
