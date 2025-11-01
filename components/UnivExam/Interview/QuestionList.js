import React, { useState } from 'react';
import { criterionColors } from '../Data/universityData';

/**
 * 질문 목록 관리 컴포넌트
 */
const QuestionList = ({
  questions,
  selectedQuestion,
  onSelectQuestion,
  onDeleteQuestion,
  universities
}) => {
  const [filterUniversity, setFilterUniversity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCriterion, setFilterCriterion] = useState('all');

  // 필터링된 질문 목록
  const getFilteredQuestions = () => {
    return questions.filter(q => {
      const universityMatch = filterUniversity === 'all' || q.universityId === filterUniversity;
      const statusMatch = filterStatus === 'all' || q.preparationStatus === filterStatus;
      const criterionMatch = filterCriterion === 'all' || q.criterion === filterCriterion;

      return universityMatch && statusMatch && criterionMatch;
    });
  };

  // 고유한 평가기준 목록
  const getUniqueCriteria = () => {
    const criteria = new Set(questions.map(q => q.criterion));
    return Array.from(criteria);
  };

  // 상태별 아이콘 및 색상
  const getStatusBadge = (status) => {
    const badges = {
      not_started: { icon: '⚪', label: '미작성', color: '#94a3b8' },
      in_progress: { icon: '🟡', label: '작성중', color: '#f59e0b' },
      completed: { icon: '🟢', label: '완료', color: '#10b981' }
    };
    return badges[status] || badges.not_started;
  };

  const filteredQuestions = getFilteredQuestions();
  const criteria = getUniqueCriteria();

  return (
    <div className="question-list">
      <div className="list-header">
        <h3>
          예상 질문 목록
          <span className="question-count">({filteredQuestions.length}/{questions.length})</span>
        </h3>

        {/* 필터 */}
        <div className="list-filters">
          {/* 대학 필터 */}
          <select
            value={filterUniversity}
            onChange={(e) => setFilterUniversity(e.target.value)}
            className="filter-select"
          >
            <option value="all">모든 대학</option>
            {universities.map(univ => (
              <option key={univ.id} value={univ.id}>
                {univ.name}
              </option>
            ))}
          </select>

          {/* 평가기준 필터 */}
          <select
            value={filterCriterion}
            onChange={(e) => setFilterCriterion(e.target.value)}
            className="filter-select"
          >
            <option value="all">모든 평가기준</option>
            {criteria.map(criterion => (
              <option key={criterion} value={criterion}>
                {criterion}
              </option>
            ))}
          </select>

          {/* 상태 필터 */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">모든 상태</option>
            <option value="not_started">미작성</option>
            <option value="in_progress">작성중</option>
            <option value="completed">완료</option>
          </select>
        </div>
      </div>

      {/* 질문 목록 */}
      <div className="questions-list-container">
        {filteredQuestions.length === 0 ? (
          <div className="no-questions">
            <p>필터 조건에 맞는 질문이 없습니다.</p>
          </div>
        ) : (
          filteredQuestions.map((question, index) => {
            const statusBadge = getStatusBadge(question.preparationStatus);
            const criterionColor = criterionColors[question.criterion] || '#94a3b8';
            const isSelected = selectedQuestion?.id === question.id;

            return (
              <div
                key={question.id}
                className={`question-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectQuestion(question)}
              >
                <div className="question-item-header">
                  <span className="question-number">Q{index + 1}</span>
                  <span
                    className="status-badge"
                    style={{ color: statusBadge.color }}
                  >
                    {statusBadge.icon} {statusBadge.label}
                  </span>
                  <button
                    className="btn-delete-question"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteQuestion(question.id);
                    }}
                    title="삭제"
                  >
                    🗑️
                  </button>
                </div>

                <div className="question-meta">
                  <span className="university-tag">
                    {question.universityName}
                  </span>
                  <span
                    className="criterion-tag"
                    style={{
                      backgroundColor: `${criterionColor}30`,
                      color: criterionColor
                    }}
                  >
                    {question.criterion}
                    {question.weight > 0 && ` (${question.weight}%)`}
                  </span>
                </div>

                <p className="question-text">{question.questionText}</p>

                {question.relatedActivities && question.relatedActivities.length > 0 && (
                  <div className="related-activities-info">
                    📌 관련 활동: {question.relatedActivities[0].title}
                    {question.relatedActivities[0].year && (
                      <span> ({question.relatedActivities[0].year}학년)</span>
                    )}
                  </div>
                )}

                {question.answer && (
                  <div className="answer-preview">
                    <strong>답변 미리보기:</strong>
                    <p>{question.answer.substring(0, 100)}...</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 통계 */}
      <div className="list-footer">
        <div className="stats">
          <span>미작성: {questions.filter(q => q.preparationStatus === 'not_started').length}</span>
          <span>작성중: {questions.filter(q => q.preparationStatus === 'in_progress').length}</span>
          <span>완료: {questions.filter(q => q.preparationStatus === 'completed').length}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
