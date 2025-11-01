import React, { useState } from 'react';

/**
 * 항목별 예상질문 컴포넌트
 * 학생부 항목별로 예상 면접 질문을 정리
 */
const CategoryQuestions = () => {
  const [activeCategory, setActiveCategory] = useState('창의적체험활동');

  // 항목별 예상질문 데이터
  const categoryQuestions = {
    '창의적체험활동': [
      {
        question: '자율활동에서 가장 기억에 남는 활동은 무엇인가요?',
        keywords: ['자율활동', '리더십', '협력']
      },
      {
        question: '동아리 활동을 통해 배운 점은 무엇인가요?',
        keywords: ['동아리', '팀워크', '성장']
      },
      {
        question: '봉사활동 경험이 본인에게 어떤 영향을 주었나요?',
        keywords: ['봉사', '나눔', '공동체']
      }
    ],
    '교과학습발달상황': [
      {
        question: '가장 흥미를 느낀 과목과 그 이유는 무엇인가요?',
        keywords: ['학습', '관심분야', '동기']
      },
      {
        question: '어려웠던 과목을 극복한 경험이 있나요?',
        keywords: ['도전', '극복', '노력']
      },
      {
        question: '세부능력 및 특기사항에 기록된 활동 중 하나를 설명해주세요.',
        keywords: ['탐구', '심화학습', '프로젝트']
      }
    ],
    '진로및특기사항': [
      {
        question: '이 전공을 선택한 이유는 무엇인가요?',
        keywords: ['진로', '전공동기', '목표']
      },
      {
        question: '진로 목표를 위해 어떤 준비를 해왔나요?',
        keywords: ['진로탐색', '준비과정', '역량개발']
      },
      {
        question: '졸업 후 구체적인 진로 계획은 무엇인가요?',
        keywords: ['미래계획', '비전', '목표']
      }
    ],
    '독서활동': [
      {
        question: '가장 인상 깊었던 책과 그 이유는 무엇인가요?',
        keywords: ['독서', '감명', '영향']
      },
      {
        question: '독서를 통해 전공 분야에 대한 이해를 어떻게 넓혔나요?',
        keywords: ['전공탐색', '지식확장', '깊이']
      },
      {
        question: '책에서 읽은 내용을 실제로 적용해본 경험이 있나요?',
        keywords: ['실천', '적용', '연결']
      }
    ],
    '행동특성및종합의견': [
      {
        question: '선생님께서 본인의 성격을 어떻게 평가하셨다고 생각하나요?',
        keywords: ['성격', '인성', '태도']
      },
      {
        question: '학급에서 어떤 역할을 주로 맡았고, 어떻게 수행했나요?',
        keywords: ['리더십', '책임감', '기여']
      },
      {
        question: '친구들과의 관계에서 본인의 강점은 무엇이라고 생각하나요?',
        keywords: ['협력', '소통', '관계']
      }
    ],
    '수상경력': [
      {
        question: '가장 의미 있는 수상 경력과 그 이유는 무엇인가요?',
        keywords: ['수상', '성취', '노력']
      },
      {
        question: '수상을 위해 어떤 노력을 했나요?',
        keywords: ['준비과정', '도전', '열정']
      },
      {
        question: '이 수상 경험이 본인에게 어떤 변화를 가져왔나요?',
        keywords: ['성장', '깨달음', '발전']
      }
    ]
  };

  const categories = Object.keys(categoryQuestions);

  return (
    <div className="category-questions-container">
      {/* 헤더 */}
      <div className="category-questions-header">
        <h2>항목별 예상질문</h2>
        <p className="header-description">학생부 각 항목별로 정리된 예상 면접 질문입니다.</p>
      </div>

      {/* 카테고리 탭 */}
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 질문 목록 */}
      <div className="questions-section">
        <h3 className="section-title">{activeCategory}</h3>
        <div className="questions-list">
          {categoryQuestions[activeCategory].map((item, index) => (
            <div key={index} className="question-card">
              <div className="question-number">Q{index + 1}</div>
              <div className="question-content">
                <p className="question-text">{item.question}</p>
                <div className="question-keywords">
                  {item.keywords.map((keyword, idx) => (
                    <span key={idx} className="keyword-tag">#{keyword}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="guide-section">
        <h4>💡 준비 팁</h4>
        <ul>
          <li>각 질문에 대해 자신만의 경험과 생각을 구체적으로 정리하세요.</li>
          <li>학생부에 기록된 내용을 바탕으로 답변을 준비하세요.</li>
          <li>키워드를 참고하여 답변의 핵심을 파악하세요.</li>
          <li>답변은 2-3분 내로 간결하게 정리하는 것이 좋습니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryQuestions;
