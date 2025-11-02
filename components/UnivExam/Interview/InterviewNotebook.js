import React, { useState, useMemo } from 'react';
import {
  extractAllKeywords,
  mapKeywordsToActivities,
  analyzeKeywordConnections,
  getKeywordDetails
} from '../Utils/keywordExtractor';

/**
 * 면접 단권화 노트 컴포넌트
 * Phase 1: 키워드 네트워크, 활동 타임라인
 * Phase 2: 개념/쟁점/배경지식 카드
 */
const InterviewNotebook = ({ studentRecord }) => {
  const [activeTab, setActiveTab] = useState('keywords'); // 'keywords', 'timeline', 'concepts'
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [filterCategory, setFilterCategory] = useState('전체');

  // 데이터 계산 (useMemo로 최적화)
  const allKeywords = useMemo(() => extractAllKeywords(studentRecord), [studentRecord]);
  const activities = useMemo(() => mapKeywordsToActivities(studentRecord), [studentRecord]);
  const keywordConnections = useMemo(() => analyzeKeywordConnections(activities), [activities]);

  // 카테고리별 필터링
  const categories = ['전체', '전공/학문', '철학자/사상가', '개념/이론', '주제/이슈', '활동유형'];
  const filteredKeywords = filterCategory === '전체'
    ? allKeywords
    : allKeywords.filter(k => k.category === filterCategory);

  // 키워드 클릭 핸들러
  const handleKeywordClick = (keyword) => {
    setSelectedKeyword(keyword);
    // 해당 키워드가 포함된 활동들 필터링
  };

  // 활동별 그룹핑
  const activitiesByYear = useMemo(() => {
    const grouped = { '1학년': [], '2학년': [], '3학년': [] };
    activities.forEach(activity => {
      if (grouped[activity.year]) {
        grouped[activity.year].push(activity);
      }
    });
    return grouped;
  }, [activities]);

  return (
    <div className="interview-notebook-container">
      <div className="notebook-header">
        <h2>📚 면접 단권화 노트</h2>
        <p className="subtitle">
          생활기록부 핵심 키워드와 활동을 체계적으로 정리하여 면접을 준비하세요
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="notebook-tabs">
        <button
          className={`tab-btn ${activeTab === 'keywords' ? 'active' : ''}`}
          onClick={() => setActiveTab('keywords')}
        >
          🔑 키워드 네트워크
        </button>
        <button
          className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          📅 활동 타임라인
        </button>
        <button
          className={`tab-btn ${activeTab === 'concepts' ? 'active' : ''}`}
          onClick={() => setActiveTab('concepts')}
        >
          📖 개념 정리
        </button>
      </div>

      {/* Tab 1: 키워드 네트워크 */}
      {activeTab === 'keywords' && (
        <div className="keywords-tab">
          {/* 카테고리 필터 */}
          <div className="category-filter-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
                {cat !== '전체' && (
                  <span className="count">
                    {allKeywords.filter(k => k.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 키워드 클라우드 */}
          <div className="keyword-cloud-section">
            <h3>핵심 키워드 ({filteredKeywords.length}개)</h3>
            <div className="keyword-cloud">
              {filteredKeywords.map(({ keyword, count, category }) => {
                const size = Math.min(Math.max(count * 0.3 + 1, 1), 3);
                const isSelected = selectedKeyword?.keyword === keyword;

                return (
                  <button
                    key={keyword}
                    className={`keyword-bubble ${isSelected ? 'selected' : ''}`}
                    style={{
                      fontSize: `${size}rem`,
                      opacity: isSelected ? 1 : 0.7 + count * 0.1
                    }}
                    onClick={() => handleKeywordClick({ keyword, count, category })}
                    title={`${category} • ${count}회 등장`}
                  >
                    {keyword}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 선택된 키워드 상세 정보 */}
          {selectedKeyword && (
                <div className="keyword-detail-panel">
              <div className="panel-header">
                <h4>{selectedKeyword.keyword}</h4>
                <button
                  className="close-btn"
                  onClick={() => setSelectedKeyword(null)}
                >
                  ✕
                </button>
              </div>
              <div className="panel-content">
                <div className="keyword-meta">
                  <span className="category-badge">{selectedKeyword.category}</span>
                  <span className="frequency">📊 {selectedKeyword.count}회 등장</span>
                </div>

                {/* 연결된 활동들 */}
                <div className="related-activities">
                  <h5>🔗 관련 활동</h5>
                  <div className="activity-list">
                    {activities
                      .filter(a => a.keywords.some(k => k.keyword === selectedKeyword.keyword))
                      .map(activity => (
                        <div key={activity.id} className="activity-item">
                          <div className="activity-header">
                            <span className="year-badge">{activity.year}</span>
                            <span className="type-badge">{activity.type}</span>
                          </div>
                          <p className="activity-title">{activity.title}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 연결된 다른 키워드들 */}
                <div className="connected-keywords">
                  <h5>🌐 함께 등장하는 키워드</h5>
                  <div className="connection-list">
                    {keywordConnections
                      .filter(conn =>
                        conn.source === selectedKeyword.keyword ||
                        conn.target === selectedKeyword.keyword
                      )
                      .slice(0, 5)
                      .map((conn, idx) => {
                        const otherKeyword = conn.source === selectedKeyword.keyword
                          ? conn.target
                          : conn.source;
                        return (
                          <div key={idx} className="connection-item">
                            <button
                              className="connected-keyword-btn"
                              onClick={() => {
                                const kw = allKeywords.find(k => k.keyword === otherKeyword);
                                if (kw) handleKeywordClick(kw);
                              }}
                            >
                              {otherKeyword}
                            </button>
                            <span className="connection-strength">
                              {conn.strength}회 함께 등장
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 활동 타임라인 */}
      {activeTab === 'timeline' && (
        <div className="timeline-tab">
          <div className="timeline-legend">
            <div className="legend-item">
              <span className="legend-dot 자율활동"></span>
              <span>자율활동</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot 동아리활동"></span>
              <span>동아리활동</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot 진로활동"></span>
              <span>진로활동</span>
            </div>
          </div>

          <div className="timeline-container">
            {Object.entries(activitiesByYear).map(([year, yearActivities]) => (
              <div key={year} className="timeline-year-section">
                <div className="year-marker">
                  <div className="year-circle">{year}</div>
                  <div className="year-line"></div>
                </div>

                <div className="year-activities">
                  <h3 className="year-title">{year}</h3>
                  <div className="activities-grid">
                    {yearActivities.map(activity => (
                      <div
                        key={activity.id}
                        className={`activity-card ${activity.type}`}
                        onClick={() => setSelectedActivity(activity)}
                      >
                        <div className="activity-card-header">
                          <span className="type-badge">{activity.type}</span>
                          <div className="keyword-pills">
                            {activity.keywords.slice(0, 3).map((kw, idx) => (
                              <span key={idx} className="keyword-pill">
                                {kw.keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="activity-card-title">{activity.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 선택된 활동 상세 */}
          {selectedActivity && (
            <div className="activity-detail-modal">
              <div className="modal-overlay" onClick={() => setSelectedActivity(null)}></div>
              <div className="modal-content">
                <div className="modal-header">
                  <div>
                    <span className="year-badge">{selectedActivity.year}</span>
                    <span className="type-badge">{selectedActivity.type}</span>
                  </div>
                  <button
                    className="close-btn"
                    onClick={() => setSelectedActivity(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <h4>{selectedActivity.title}</h4>
                  <p className="activity-content">{selectedActivity.content}</p>

                  <div className="activity-keywords">
                    <h5>핵심 키워드</h5>
                    <div className="keyword-tags">
                      {selectedActivity.allKeywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="keyword-tag"
                          onClick={() => {
                            setSelectedActivity(null);
                            setActiveTab('keywords');
                            handleKeywordClick(kw);
                          }}
                        >
                          {kw.keyword} ({kw.count})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: 개념 정리 (Phase 2) */}
      {activeTab === 'concepts' && (
        <div className="concepts-tab">
          <div className="concepts-intro">
            <h3>💡 핵심 개념 정리</h3>
            <p>면접에서 자주 다뤄지는 개념, 쟁점, 배경지식을 정리했습니다.</p>
          </div>

          <div className="concepts-grid">
            {allKeywords
              .filter(kw =>
                ['철학자/사상가', '개념/이론', '주제/이슈'].includes(kw.category)
              )
              .slice(0, 20)
              .map(({ keyword, category, count }) => {
                const details = getKeywordDetails(keyword);

                return (
                  <div key={keyword} className="concept-card">
                    <div className="concept-header">
                      <h4>{keyword}</h4>
                      <span className="category-tag">{category}</span>
                    </div>

                    <div className="concept-section">
                      <h5>📌 개념</h5>
                      <p>{details.개념}</p>
                    </div>

                    <div className="concept-section">
                      <h5>⚡ 쟁점</h5>
                      <p>{details.쟁점}</p>
                    </div>

                    <div className="concept-section">
                      <h5>📚 배경지식</h5>
                      <p>{details.배경지식}</p>
                    </div>

                    <div className="concept-footer">
                      <span className="usage-count">
                        생기부 {count}회 언급
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewNotebook;
