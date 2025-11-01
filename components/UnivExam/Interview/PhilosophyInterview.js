import React, { useState } from 'react';
import { philosophyInterviewData } from '../Data/philosophyInterviewData';

/**
 * 철학과 면접 준비 컴포넌트
 * 예상 질문과 모범 답변을 카테고리별로 정리하여 표시
 */
const PhilosophyInterview = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showSubjectDetails, setShowSubjectDetails] = useState(false);

  const { interviewQuestions, subjectDetails } = philosophyInterviewData;

  // 카테고리 목록 추출
  const categories = ['전체', ...new Set(interviewQuestions.map(q => q.category))];

  // 필터링된 질문 목록
  const filteredQuestions = selectedCategory === '전체'
    ? interviewQuestions
    : interviewQuestions.filter(q => q.category === selectedCategory);

  // 질문 토글
  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  return (
    <div className="spanish-interview-container">
      {/* 헤더 섹션 */}
      <div className="spanish-interview-header">
        <h2>🧠 철학과 면접 준비</h2>
        <p className="header-description">
          학생기록부의 세부능력 및 특기사항을 바탕으로 작성된 예상 질문과 모범 답변입니다.
          각 답변은 실제 활동 경험과 연계되어 있습니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="interview-stats">
        <div className="stat-card">
          <div className="stat-icon">❓</div>
          <div className="stat-content">
            <div className="stat-value">
              {interviewQuestions.length + interviewQuestions.filter(q => q.followUpQuestion).length}
            </div>
            <div className="stat-label">총 질문</div>
            <div className="stat-detail">기본 {interviewQuestions.length}, 심화 {interviewQuestions.filter(q => q.followUpQuestion).length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-value">{categories.length - 1}</div>
            <div className="stat-label">질문 카테고리</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{Object.keys(subjectDetails).length}</div>
            <div className="stat-label">관련 교과목</div>
          </div>
        </div>
      </div>

      {/* 세부능력 및 특기사항 보기 버튼 */}
      <div className="subject-details-toggle">
        <button
          className="btn-toggle-details"
          onClick={() => setShowSubjectDetails(!showSubjectDetails)}
        >
          {showSubjectDetails ? '📖 세부능력 및 특기사항 숨기기' : '📖 세부능력 및 특기사항 보기'}
        </button>
      </div>

      {/* 세부능력 및 특기사항 섹션 */}
      {showSubjectDetails && (
        <div className="subject-details-section">
          <h3>📋 세부능력 및 특기사항</h3>
          <p className="section-description">
            면접 답변의 근거가 되는 학생기록부 내용입니다.
          </p>
          <div className="subject-details-grid">
            {Object.entries(subjectDetails).map(([subject, content]) => (
              <div key={subject} className="subject-detail-card">
                <h4 className="subject-name">{subject}</h4>
                <div className="subject-content">{content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 카테고리 필터 */}
      <div className="category-filter">
        <h3>질문 카테고리</h3>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              {category !== '전체' && (
                <span className="category-count">
                  {interviewQuestions.filter(q => q.category === category).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 질문 목록 */}
      <div className="questions-section">
        <div className="questions-header">
          <h3>예상 질문 및 답변</h3>
          <p className="questions-count">
            총 {filteredQuestions.length}개의 질문
          </p>
        </div>

        <div className="questions-list">
          {filteredQuestions.map((question, index) => (
            <div
              key={question.id}
              className={`question-card ${expandedQuestion === question.id ? 'expanded' : ''}`}
            >
              {/* 질문 헤더 */}
              <div
                className="question-header"
                onClick={() => toggleQuestion(question.id)}
              >
                <div className="question-header-left">
                  <span className="question-number">Q{index + 1}</span>
                  <span className="question-category-badge">{question.category}</span>
                </div>
                <div className="question-text">{question.question}</div>
                <div className="question-toggle-icon">
                  {expandedQuestion === question.id ? '▲' : '▼'}
                </div>
              </div>

              {/* 답변 내용 */}
              {expandedQuestion === question.id && (
                <div className="answer-section">
                  {/* Thinking Process */}
                  {question.thinkingProcess && (
                    <div className="thinking-process">
                      <div className="thinking-process-header">
                        <span className="thinking-icon">💭</span>
                        <span className="thinking-label">답변 흐름 (Thinking Process)</span>
                      </div>
                      <div className="thinking-steps">
                        {question.thinkingProcess.map((step, idx) => (
                          <div key={idx} className="thinking-step">
                            <span className="step-number">{idx + 1}</span>
                            <span className="step-text">{step}</span>
                            {idx < question.thinkingProcess.length - 1 && (
                              <span className="step-arrow">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="answer-label">
                    <span className="answer-icon">💬</span>
                    <span>모범 답변</span>
                  </div>
                  <div className="answer-text">{question.answer}</div>

                  {/* 관련 교과목 태그 */}
                  <div className="related-info">
                    <div className="related-subjects">
                      <span className="related-label">📚 관련 교과목:</span>
                      <div className="subject-tags">
                        {question.relatedSubjects.map(subject => (
                          <span key={subject} className="subject-tag">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 키워드 태그 */}
                    <div className="keywords">
                      <span className="related-label">🔑 핵심 키워드:</span>
                      <div className="keyword-tags">
                        {question.keywords.map(keyword => (
                          <span key={keyword} className="keyword-tag">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 심화 질문 */}
                  {question.followUpQuestion && (
                    <div className="follow-up-section">
                      <div className="follow-up-header">
                        <span className="follow-up-icon">🔍</span>
                        <span className="follow-up-label">심화 질문</span>
                      </div>
                      <div className="follow-up-question">
                        {question.followUpQuestion.question}
                      </div>
                      <div className="follow-up-answer-label">
                        <span className="answer-icon">💬</span>
                        <span>심화 질문 모범 답변</span>
                      </div>
                      <div className="follow-up-answer">
                        {question.followUpQuestion.answer}
                      </div>
                    </div>
                  )}

                  {/* 답변 팁 */}
                  <div className="answer-tips">
                    <div className="tip-icon">💡</div>
                    <div className="tip-content">
                      <strong>면접 TIP:</strong> 이 답변은 실제 활동 경험을 바탕으로 작성되었습니다.
                      면접관의 추가 질문에 대비하여 관련된 세부능력 및 특기사항 내용을 숙지하세요.
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 준비 가이드 */}
      <div className="preparation-guide">
        <h3>📌 면접 준비 가이드</h3>
        <div className="guide-cards">
          <div className="guide-card">
            <div className="guide-icon">1️⃣</div>
            <div className="guide-content">
              <h4>질문 숙지하기</h4>
              <p>각 카테고리별 질문을 충분히 읽고 이해합니다.</p>
            </div>
          </div>
          <div className="guide-card">
            <div className="guide-icon">2️⃣</div>
            <div className="guide-content">
              <h4>답변 연습하기</h4>
              <p>모범 답변을 참고하되, 자신의 언어로 표현하는 연습을 합니다.</p>
            </div>
          </div>
          <div className="guide-card">
            <div className="guide-icon">3️⃣</div>
            <div className="guide-content">
              <h4>근거 확인하기</h4>
              <p>세부능력 및 특기사항을 다시 읽으며 구체적인 사례를 기억합니다.</p>
            </div>
          </div>
          <div className="guide-card">
            <div className="guide-icon">4️⃣</div>
            <div className="guide-content">
              <h4>모의면접 실시</h4>
              <p>친구나 선생님과 함께 실제 면접처럼 연습합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhilosophyInterview;
