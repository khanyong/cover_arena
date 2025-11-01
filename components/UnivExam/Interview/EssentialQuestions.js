import React, { useState } from 'react';

/**
 * 필수질문 컴포넌트
 * 대학 면접에서 자주 나오는 필수 질문들
 */
const EssentialQuestions = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // 필수 질문 데이터
  const essentialQuestions = [
    {
      id: 1,
      category: '지원동기',
      question: '우리 대학/학과에 지원한 동기는 무엇인가요?',
      tips: [
        '학과의 특성과 연결된 구체적인 이유 제시',
        '개인적 경험이나 계기 언급',
        '대학/학과만의 차별화된 점 파악'
      ],
      keywords: ['진로목표', '학과특성', '대학비전']
    },
    {
      id: 2,
      category: '전공적합성',
      question: '이 전공을 위해 어떤 준비를 해왔나요?',
      tips: [
        '생활기록부의 구체적인 활동 언급',
        '활동을 통해 배운 점과 성장 강조',
        '전공과의 연결고리 명확히 설명'
      ],
      keywords: ['교과활동', '비교과활동', '독서활동']
    },
    {
      id: 3,
      category: '인성',
      question: '학교생활 중 가장 의미 있었던 경험은 무엇인가요?',
      tips: [
        '협력, 배려, 리더십 등 인성 관련 가치 드러내기',
        '문제해결 과정과 결과 구체적으로 설명',
        '경험을 통한 변화와 성장 언급'
      ],
      keywords: ['협력', '배려', '리더십', '문제해결']
    },
    {
      id: 4,
      category: '학업역량',
      question: '가장 흥미를 느낀 과목과 그 이유는 무엇인가요?',
      tips: [
        '전공과 연결된 과목 선택하면 유리',
        '단순한 흥미를 넘어 깊이 있는 탐구 경험 언급',
        '세부능력 및 특기사항과 연결'
      ],
      keywords: ['학업열정', '탐구능력', '전공연계']
    },
    {
      id: 5,
      category: '발전가능성',
      question: '대학 입학 후 학업 계획과 진로 목표는 무엇인가요?',
      tips: [
        '구체적이고 실현 가능한 계획 제시',
        '학과 커리큘럼과 연계된 계획 수립',
        '장기적인 비전과 단기 목표 균형있게 언급'
      ],
      keywords: ['학업계획', '진로목표', '비전']
    },
    {
      id: 6,
      category: '문제해결능력',
      question: '어려운 상황이나 갈등을 해결한 경험이 있나요?',
      tips: [
        'STAR 기법 활용 (상황-과제-행동-결과)',
        '자신의 역할과 기여도 명확히 설명',
        '해결 과정에서의 배움과 성장 강조'
      ],
      keywords: ['문제인식', '해결과정', '성찰']
    },
    {
      id: 7,
      category: '독서활동',
      question: '가장 인상 깊게 읽은 책과 그 이유는 무엇인가요?',
      tips: [
        '전공과 관련된 책 선택하면 유리',
        '단순 줄거리 요약이 아닌 깊이 있는 해석',
        '책의 내용을 자신의 경험이나 진로와 연결'
      ],
      keywords: ['독서경험', '비판적사고', '전공연계']
    },
    {
      id: 8,
      category: '사회문제인식',
      question: '최근 관심 있는 사회 문제는 무엇이며, 어떻게 생각하나요?',
      tips: [
        '전공과 연결된 사회 문제 선택',
        '단순한 의견이 아닌 근거 있는 분석',
        '해결 방안이나 자신의 역할 제시'
      ],
      keywords: ['사회문제', '비판적사고', '해결방안']
    },
    {
      id: 9,
      category: '협력경험',
      question: '팀 프로젝트나 협력 활동에서 어떤 역할을 했나요?',
      tips: [
        '구체적인 활동과 자신의 역할 명시',
        '갈등 해결이나 소통 경험 언급',
        '팀워크의 중요성과 배운 점 설명'
      ],
      keywords: ['팀워크', '소통', '리더십']
    },
    {
      id: 10,
      category: '자기성찰',
      question: '자신의 장점과 단점은 무엇이며, 단점을 어떻게 보완하고 있나요?',
      tips: [
        '장점은 전공 적합성과 연결',
        '단점은 솔직하되 개선 노력 강조',
        '구체적인 사례와 함께 설명'
      ],
      keywords: ['자기이해', '성장의지', '개선노력']
    }
  ];

  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  return (
    <div className="essential-questions-container">
      {/* 헤더 */}
      <div className="essential-questions-header">
        <h2>💡 필수 질문</h2>
        <p className="header-description">
          대학 면접에서 자주 나오는 필수 질문들입니다. 각 질문에 대한 답변을 미리 준비하세요.
        </p>
      </div>

      {/* 안내 메시지 */}
      <div className="preparation-tips">
        <h3>📌 답변 준비 TIP</h3>
        <ul>
          <li><strong>STAR 기법 활용</strong>: Situation (상황) → Task (과제) → Action (행동) → Result (결과)</li>
          <li><strong>생활기록부 기반</strong>: 모든 답변은 생활기록부 내용에 근거해야 함</li>
          <li><strong>구체성</strong>: 추상적인 표현보다 구체적인 사례와 수치 활용</li>
          <li><strong>진정성</strong>: 과장되거나 거짓된 내용 지양</li>
          <li><strong>연습</strong>: 소리 내어 반복 연습하여 자연스럽게 답변</li>
        </ul>
      </div>

      {/* 필수 질문 리스트 */}
      <div className="questions-list">
        {essentialQuestions.map((item) => (
          <div key={item.id} className="question-card">
            <div className="question-header" onClick={() => toggleQuestion(item.id)}>
              <div className="question-number">Q{item.id}</div>
              <div className="question-content">
                <div className="question-category-badge">{item.category}</div>
                <div className="question-text">{item.question}</div>
              </div>
              <div className="question-toggle-icon">
                {expandedQuestion === item.id ? '▲' : '▼'}
              </div>
            </div>

            {expandedQuestion === item.id && (
              <div className="question-details">
                <div className="answer-tips">
                  <h4>💡 답변 TIP</h4>
                  <ul>
                    {item.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="keywords-section">
                  <h4>🔑 핵심 키워드</h4>
                  <div className="keywords-list">
                    {item.keywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag">{keyword}</span>
                    ))}
                  </div>
                </div>

                <div className="practice-area">
                  <h4>✍️ 나의 답변 준비</h4>
                  <textarea
                    className="answer-textarea"
                    placeholder="이 질문에 대한 답변을 작성해보세요... (생활기록부 내용을 바탕으로)"
                    rows={6}
                  />
                  <div className="textarea-actions">
                    <button className="save-btn">💾 저장</button>
                    <button className="reset-btn">🔄 초기화</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 하단 안내 */}
      <div className="bottom-note">
        <p>
          💡 <strong>Tip:</strong> 위 질문들은 대부분의 대학 면접에서 공통적으로 나오는 질문입니다.
          각 질문에 대해 자신만의 스토리를 만들어 준비하세요.
        </p>
      </div>
    </div>
  );
};

export default EssentialQuestions;
