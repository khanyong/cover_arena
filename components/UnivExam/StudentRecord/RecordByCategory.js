import React, { useState } from 'react';
import { recordCategories } from '../Data/sampleStudentRecord';

/**
 * 카테고리별 생활기록부 정리 컴포넌트
 */
const RecordByCategory = ({ records }) => {
  const [selectedCategory, setSelectedCategory] = useState('자율활동');

  // 카테고리별 레코드 필터링 (전 학년)
  const getRecordsByCategory = (category) => {
    return records.filter(record => record.category === category);
  };

  // 카테고리별 통계
  const getCategoryStats = (category) => {
    const categoryRecords = getRecordsByCategory(category);
    const totalActivities = categoryRecords.reduce((sum, record) => {
      return sum + (record.activities?.length || record.subjects?.length || 0);
    }, 0);

    return {
      totalActivities,
      years: [...new Set(categoryRecords.map(r => r.year))].sort()
    };
  };

  const categoryRecords = getRecordsByCategory(selectedCategory);
  const stats = getCategoryStats(selectedCategory);
  const selectedCategoryInfo = recordCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="record-by-category">
      {/* 카테고리 선택 */}
      <div className="category-selector">
        <div className="category-buttons">
          {recordCategories.map(category => {
            const categoryStats = getCategoryStats(category.id);
            return (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                style={{
                  borderColor: selectedCategory === category.id ? category.color : '#ddd',
                  backgroundColor: selectedCategory === category.id ? `${category.color}20` : 'white'
                }}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="category-btn-content">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{categoryStats.totalActivities}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 카테고리 통계 */}
      <div className="category-stats">
        <div
          className="stats-header"
          style={{ backgroundColor: `${selectedCategoryInfo?.color}20` }}
        >
          <h3 style={{ color: selectedCategoryInfo?.color }}>
            {selectedCategoryInfo?.name}
          </h3>
          <div className="stats-info">
            <span>총 {stats.totalActivities}개 활동</span>
            <span>│</span>
            <span>{stats.years.join(', ')}학년</span>
          </div>
        </div>
      </div>

      {/* 학년별 활동 내용 */}
      <div className="category-content">
        {categoryRecords.length === 0 ? (
          <div className="no-data">
            <p>해당 카테고리의 활동이 없습니다.</p>
          </div>
        ) : (
          <div className="year-sections">
            {[1, 2, 3].map(year => {
              const yearRecords = categoryRecords.filter(r => r.year === year);
              if (yearRecords.length === 0) return null;

              return (
                <div key={year} className="year-section">
                  <h4 className="year-title">{year}학년</h4>

                  {yearRecords.map((record, index) => (
                    <div key={index} className="record-content-box">
                      {/* 활동 렌더링 */}
                      {record.activities && record.activities.map((activity, actIdx) => (
                        <div
                          key={activity.id || actIdx}
                          className="activity-card"
                          style={{ borderLeftColor: selectedCategoryInfo?.color }}
                        >
                          <div className="activity-header">
                            <h5>{activity.title}</h5>
                            {activity.period && (
                              <span className="activity-period">{activity.period}</span>
                            )}
                          </div>

                          <p className="activity-description">{activity.description}</p>

                          {activity.keywords && activity.keywords.length > 0 && (
                            <div className="activity-keywords">
                              {activity.keywords.map((keyword, kidx) => (
                                <span
                                  key={kidx}
                                  className="keyword-tag"
                                  style={{ backgroundColor: `${selectedCategoryInfo?.color}30` }}
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          )}

                          {activity.relatedSubjects && activity.relatedSubjects.length > 0 && (
                            <div className="related-subjects">
                              <strong>관련 교과:</strong> {activity.relatedSubjects.join(', ')}
                            </div>
                          )}

                          {activity.achievements && activity.achievements.length > 0 && (
                            <div className="achievements">
                              <strong>주요 성과:</strong>
                              <ul>
                                {activity.achievements.map((achievement, aidx) => (
                                  <li key={aidx}>{achievement}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* 교과 렌더링 */}
                      {record.subjects && record.subjects.map((subject, subIdx) => (
                        <div
                          key={subject.id || subIdx}
                          className="subject-card"
                          style={{ borderLeftColor: selectedCategoryInfo?.color }}
                        >
                          <div className="subject-header">
                            <h5>{subject.name}</h5>
                            {subject.grade && (
                              <span className="subject-grade-badge">{subject.grade}</span>
                            )}
                          </div>

                          <p className="subject-highlights">{subject.highlights}</p>

                          {subject.projects && subject.projects.length > 0 && (
                            <div className="subject-projects">
                              <strong>프로젝트:</strong>
                              <ul>
                                {subject.projects.map((project, pidx) => (
                                  <li key={pidx}>{project}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* 행동특성 렌더링 */}
                      {record.traits && (
                        <div className="traits-card">
                          <h5>행동특성 및 종합의견</h5>
                          <ul className="traits-list">
                            {record.traits.map((trait, tidx) => (
                              <li key={tidx}>{trait}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordByCategory;
