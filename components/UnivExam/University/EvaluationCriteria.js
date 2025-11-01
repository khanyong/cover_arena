import React from 'react';
import { criterionColors } from '../Data/universityData';

/**
 * 평가항목 및 비중 표시 컴포넌트
 */
const EvaluationCriteria = ({ criteria, universityName }) => {
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <div className="evaluation-criteria">
      <div className="criteria-header">
        <h4>📊 면접 평가 기준</h4>
        <p className="criteria-note">
          총 {criteria.length}개 항목 (합계: {totalWeight}%)
        </p>
      </div>

      {/* 평가 항목 차트 */}
      <div className="criteria-chart">
        <div className="chart-bars">
          {criteria.map((criterion) => {
            const color = criterionColors[criterion.criterion] || '#94a3b8';
            return (
              <div
                key={criterion.id}
                className="chart-bar"
                style={{
                  flex: criterion.weight,
                  backgroundColor: color
                }}
                title={`${criterion.criterion}: ${criterion.weight}%`}
              >
                <span className="bar-label">{criterion.weight}%</span>
              </div>
            );
          })}
        </div>
        <div className="chart-legend">
          {criteria.map((criterion) => {
            const color = criterionColors[criterion.criterion] || '#94a3b8';
            return (
              <div key={criterion.id} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: color }}
                />
                <span className="legend-text">{criterion.criterion}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 평가 항목 상세 */}
      <div className="criteria-details">
        {criteria
          .sort((a, b) => b.weight - a.weight)
          .map((criterion) => {
            const color = criterionColors[criterion.criterion] || '#94a3b8';
            return (
              <div
                key={criterion.id}
                className="criterion-card"
                style={{ borderLeftColor: color }}
              >
                <div className="criterion-header">
                  <h5>{criterion.criterion}</h5>
                  <span
                    className="criterion-weight-badge"
                    style={{ backgroundColor: `${color}30`, color: color }}
                  >
                    {criterion.weight}%
                  </span>
                </div>

                <p className="criterion-description">{criterion.description}</p>

                {criterion.keyPoints && criterion.keyPoints.length > 0 && (
                  <div className="criterion-keypoints">
                    <strong>평가 포인트:</strong>
                    <ul>
                      {criterion.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* 중요도 분석 */}
      <div className="criteria-analysis">
        <h5>💡 평가 비중 분석</h5>
        <div className="analysis-insights">
          {criteria[0] && (
            <p>
              ✅ <strong>{criteria.sort((a, b) => b.weight - a.weight)[0].criterion}</strong>이(가)
              가장 높은 비중({criteria.sort((a, b) => b.weight - a.weight)[0].weight}%)을 차지합니다.
            </p>
          )}
          {criteria.filter(c => c.weight >= 30).length > 0 && (
            <p>
              📌 {criteria.filter(c => c.weight >= 30).map(c => c.criterion).join(', ')}에
              특히 집중하여 답변을 준비하세요.
            </p>
          )}
          {criteria.filter(c => c.weight < 15).length > 0 && (
            <p>
              ℹ️ {criteria.filter(c => c.weight < 15).map(c => c.criterion).join(', ')}은(는)
              상대적으로 낮은 비중이지만 균형잡힌 준비가 필요합니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationCriteria;
