'use client';

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

  // 데이터 계산 (useMemo로 최적화) - studentRecord가 없으면 빈 배열 반환
  const allKeywords = useMemo(() => {
    if (!studentRecord || !studentRecord.recordByYear) return [];
    return extractAllKeywords(studentRecord);
  }, [studentRecord]);

  const activities = useMemo(() => {
    if (!studentRecord || !studentRecord.recordByYear) return [];
    return mapKeywordsToActivities(studentRecord);
  }, [studentRecord]);

  const keywordConnections = useMemo(() => {
    if (!activities || activities.length === 0) return {};
    return analyzeKeywordConnections(activities);
  }, [activities]);

  // 카테고리별 필터링
  const categories = ['전체', '전공/학문', '철학자/사상가', '개념/이론', '주제/이슈', '활동유형'];
  const filteredKeywords = filterCategory === '전체'
    ? allKeywords
    : allKeywords.filter(k => k.category === filterCategory);

  // 키워드 클릭 핸들러
  const handleKeywordClick = (keyword) => {
    setSelectedKeyword(keyword);
  };

  // 네트워크 그래프 데이터 생성
  const networkData = useMemo(() => {
    // 상위 20개 키워드만 표시 (너무 많으면 복잡함)
    const topKeywords = filteredKeywords.slice(0, 20);

    // 원형 레이아웃으로 노드 배치
    const centerX = 400;
    const centerY = 350;
    const radius = 280; // 원의 반지름을 크게

    const nodes = topKeywords.map((kw, idx) => {
      const angle = (idx / topKeywords.length) * 2 * Math.PI - Math.PI / 2; // -90도부터 시작
      return {
        id: kw.keyword,
        keyword: kw.keyword,
        count: kw.count,
        category: kw.category,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // 엣지(연결선) 생성 - 같은 활동에 등장한 키워드끼리 연결
    const edges = [];
    const edgeMap = new Map();

    activities.forEach(activity => {
      const activityKeywords = activity.keywords || [];
      // 이 활동에 등장한 상위 키워드들끼리 연결
      for (let i = 0; i < activityKeywords.length; i++) {
        for (let j = i + 1; j < activityKeywords.length; j++) {
          const kw1 = activityKeywords[i].keyword;
          const kw2 = activityKeywords[j].keyword;

          // 둘 다 상위 20개 키워드에 포함되는 경우만
          if (topKeywords.find(k => k.keyword === kw1) && topKeywords.find(k => k.keyword === kw2)) {
            const edgeKey = [kw1, kw2].sort().join('-');

            if (!edgeMap.has(edgeKey)) {
              edgeMap.set(edgeKey, {
                source: kw1,
                target: kw2,
                strength: 0
              });
            }
            edgeMap.get(edgeKey).strength++;
          }
        }
      }
    });

    return {
      nodes,
      edges: Array.from(edgeMap.values()).filter(e => e.strength > 0)
    };
  }, [filteredKeywords, activities]);

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

          {/* 키워드 네트워크 그래프 */}
          <div className="keyword-network-section">
            <h3>키워드 연결 네트워크 ({networkData.nodes.length}개 키워드, {networkData.edges.length}개 연결)</h3>
            <p className="network-hint">💡 키워드를 클릭하면 관련 활동을 볼 수 있습니다</p>

            <svg className="network-graph" viewBox="0 0 800 700" xmlns="http://www.w3.org/2000/svg">
              {/* 연결선 (엣지) */}
              <g className="edges">
                {networkData.edges.map((edge, idx) => {
                  const sourceNode = networkData.nodes.find(n => n.id === edge.source);
                  const targetNode = networkData.nodes.find(n => n.id === edge.target);

                  if (!sourceNode || !targetNode) return null;

                  const isHighlighted = selectedKeyword &&
                    (selectedKeyword.keyword === edge.source || selectedKeyword.keyword === edge.target);

                  return (
                    <line
                      key={idx}
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      className={`edge ${isHighlighted ? 'highlighted' : ''}`}
                      strokeWidth={Math.min(edge.strength * 1.5 + 2, 8)} // 더 굵게 (최소 2px, 최대 8px)
                      opacity={isHighlighted ? 0.9 : Math.min(edge.strength * 0.15 + 0.3, 0.6)} // 불투명도도 증가
                    />
                  );
                })}
              </g>

              {/* 노드 (키워드) */}
              <g className="nodes">
                {networkData.nodes.map((node) => {
                  const isSelected = selectedKeyword?.keyword === node.id;
                  const isConnected = selectedKeyword && networkData.edges.some(
                    e => (e.source === selectedKeyword.keyword && e.target === node.id) ||
                         (e.target === selectedKeyword.keyword && e.source === node.id)
                  );
                  const radius = Math.min(Math.max(node.count * 4 + 20, 30), 50); // 크기를 더 크게

                  return (
                    <g
                      key={node.id}
                      className={`node ${isSelected ? 'selected' : ''} ${isConnected ? 'connected' : ''}`}
                      onClick={() => handleKeywordClick(node)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius}
                        className={`node-circle category-${node.category.replace(/[\/\s]/g, '-')}`}
                      />
                      <text
                        x={node.x}
                        y={node.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="node-label"
                        fontSize={16} // 고정된 읽기 쉬운 크기
                        fontWeight="500"
                      >
                        {node.keyword}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* 범례 */}
            <div className="network-legend">
              <h4>카테고리</h4>
              <div className="legend-items">
                {categories.filter(c => c !== '전체').map(cat => (
                  <div key={cat} className="legend-item">
                    <div className={`legend-color category-${cat.replace(/[\/\s]/g, '-')}`}></div>
                    <span>{cat}</span>
                  </div>
                ))}
              </div>
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
