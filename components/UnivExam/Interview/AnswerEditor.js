import React, { useState, useEffect } from 'react';
import { criterionColors } from '../Data/universityData';

/**
 * 답변 작성 에디터 컴포넌트
 */
const AnswerEditor = ({ question, onSaveAnswer, studentRecord }) => {
  const [answer, setAnswer] = useState(question.answer || '');
  const [status, setStatus] = useState(question.preparationStatus || 'not_started');
  const [showRelatedActivities, setShowRelatedActivities] = useState(true);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 질문이 변경되면 답변 초기화
  useEffect(() => {
    setAnswer(question.answer || '');
    setStatus(question.preparationStatus || 'not_started');
    setTimer(0);
    setIsTimerRunning(false);
  }, [question.id]);

  // 타이머
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // 답변 저장
  const handleSave = () => {
    const newStatus = answer.trim() === '' ? 'not_started' :
                     answer.length < 100 ? 'in_progress' : 'completed';

    onSaveAnswer(question.id, answer, newStatus);
    setStatus(newStatus);
    alert('답변이 저장되었습니다.');
  };

  // 자동 저장 (디바운스)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (answer !== question.answer) {
        handleSave();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [answer]);

  // 관련 활동 찾기 (더 많은 활동 찾기)
  const findAllRelatedActivities = () => {
    const activities = [];

    studentRecord.records.forEach(record => {
      if (record.activities) {
        record.activities.forEach(activity => {
          // 키워드 매칭
          const hasMatchingKeyword = question.keywords?.some(qk =>
            activity.keywords?.some(ak => ak.includes(qk) || qk.includes(ak))
          );

          // 제목/설명 매칭
          const hasMatchingText = question.keywords?.some(qk =>
            activity.title.includes(qk) || activity.description.includes(qk)
          );

          if (hasMatchingKeyword || hasMatchingText) {
            activities.push({
              ...activity,
              year: record.year,
              category: record.category
            });
          }
        });
      }
    });

    return activities;
  };

  // 답변 가이드 생성
  const generateAnswerGuide = () => {
    const relatedActivities = findAllRelatedActivities();

    let guide = `[${question.criterion}에 초점을 맞춘 답변 가이드]\n\n`;

    if (relatedActivities.length > 0) {
      guide += `관련 활동:\n`;
      relatedActivities.forEach((activity, index) => {
        guide += `${index + 1}. ${activity.title} (${activity.year}학년)\n`;
        guide += `   - ${activity.description.substring(0, 100)}...\n`;
      });
      guide += `\n`;
    }

    guide += `답변 구조 제안:\n`;
    guide += `1. 도입: 질문에 대한 명확한 답변 시작\n`;
    guide += `2. 구체적 경험: 생활기록부의 활동을 근거로 설명\n`;
    guide += `3. 배운 점: 경험을 통해 얻은 인사이트\n`;
    guide += `4. 연결: 전공/대학과의 연관성 강조\n`;

    return guide;
  };

  // 타이머 포맷
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const relatedActivities = findAllRelatedActivities();
  const criterionColor = criterionColors[question.criterion] || '#94a3b8';
  const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = answer.length;

  return (
    <div className="answer-editor">
      {/* 질문 표시 */}
      <div className="editor-question-section">
        <div className="question-header">
          <h3>질문</h3>
          <span
            className="criterion-badge"
            style={{
              backgroundColor: `${criterionColor}30`,
              color: criterionColor
            }}
          >
            {question.criterion}
            {question.weight > 0 && ` (${question.weight}%)`}
          </span>
        </div>
        <p className="question-display">{question.questionText}</p>
        <div className="question-meta">
          <span>🏫 {question.universityName}</span>
        </div>
      </div>

      {/* 관련 활동 표시 */}
      {relatedActivities.length > 0 && (
        <div className="related-activities-section">
          <div
            className="section-toggle"
            onClick={() => setShowRelatedActivities(!showRelatedActivities)}
          >
            <h4>📌 답변 근거가 될 수 있는 활동</h4>
            <span>{showRelatedActivities ? '▼' : '▶'}</span>
          </div>

          {showRelatedActivities && (
            <div className="activities-list">
              {relatedActivities.map((activity, index) => (
                <div key={index} className="activity-ref-card">
                  <div className="activity-ref-header">
                    <strong>{activity.title}</strong>
                    <span className="activity-year">{activity.year}학년 - {activity.category}</span>
                  </div>
                  <p className="activity-ref-description">{activity.description}</p>
                  {activity.keywords && (
                    <div className="activity-keywords">
                      {activity.keywords.map((kw, kidx) => (
                        <span key={kidx} className="keyword-chip">{kw}</span>
                      ))}
                    </div>
                  )}
                  <button
                    className="btn-use-activity"
                    onClick={() => {
                      const template = `\n\n[${activity.title} 활동 내용]\n${activity.description}\n\n`;
                      setAnswer(answer + template);
                    }}
                  >
                    📝 답변에 추가
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 답변 가이드 */}
      <div className="answer-guide">
        <details>
          <summary>💡 답변 작성 가이드 보기</summary>
          <pre className="guide-content">{generateAnswerGuide()}</pre>
        </details>
      </div>

      {/* 타이머 */}
      <div className="timer-section">
        <div className="timer-display">{formatTimer(timer)}</div>
        <button
          className={`btn-timer ${isTimerRunning ? 'running' : ''}`}
          onClick={() => setIsTimerRunning(!isTimerRunning)}
        >
          {isTimerRunning ? '⏸️ 일시정지' : '▶️ 타이머 시작'}
        </button>
        <button
          className="btn-timer-reset"
          onClick={() => {
            setTimer(0);
            setIsTimerRunning(false);
          }}
        >
          🔄 리셋
        </button>
      </div>

      {/* 답변 에디터 */}
      <div className="answer-input-section">
        <div className="editor-toolbar">
          <h4>답변 작성</h4>
          <div className="editor-stats">
            <span>{wordCount} 단어</span>
            <span>│</span>
            <span>{charCount} 자</span>
          </div>
        </div>

        <textarea
          className="answer-textarea"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="답변을 작성하세요...

답변 작성 팁:
- 구체적인 경험과 사례를 들어 설명하세요
- 생활기록부의 내용을 근거로 활용하세요
- 배운 점과 성장한 부분을 강조하세요
- 전공/대학과의 연관성을 명확히 하세요"
          rows={15}
        />

        {/* 답변 상태 및 저장 */}
        <div className="editor-footer">
          <div className="status-selector">
            <label>답변 상태:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-select"
            >
              <option value="not_started">미작성</option>
              <option value="in_progress">작성중</option>
              <option value="completed">완료</option>
            </select>
          </div>

          <button
            className="btn-save-answer"
            onClick={handleSave}
          >
            💾 답변 저장
          </button>
        </div>

        <p className="auto-save-note">
          💡 답변은 2초마다 자동으로 저장됩니다
        </p>
      </div>
    </div>
  );
};

export default AnswerEditor;
