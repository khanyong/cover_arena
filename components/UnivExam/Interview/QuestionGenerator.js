import React, { useState } from 'react';
import QuestionList from './QuestionList';
import AnswerEditor from './AnswerEditor';
import { questionTemplates, activityQuestions, keywordQuestionMap } from '../Data/questionTemplates';

/**
 * 예상 질문 생성기 컴포넌트
 */
const QuestionGenerator = ({
  studentRecord,
  selectedUniversities,
  generatedQuestions,
  setGeneratedQuestions
}) => {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [generationOptions, setGenerationOptions] = useState({
    includeGeneral: true,
    includeMajor: true,
    includeAcademic: true,
    includePotential: true,
    includeCharacter: true,
    includeUniversitySpecific: true
  });

  // 질문 생성 함수
  const generateQuestions = (university) => {
    const newQuestions = [];
    let questionId = generatedQuestions.length + 1;

    // 대학 평가기준별 질문 생성
    university.evaluationCriteria.forEach(criterion => {
      const criterionName = criterion.criterion;
      const weight = criterion.weight;

      // 비중에 따라 질문 수 결정 (비중이 높을수록 더 많은 질문)
      const questionCount = Math.ceil(weight / 15);

      // 평가기준과 매칭되는 템플릿 찾기
      let templates = [];

      if (criterionName.includes('전공') || criterionName.includes('계열')) {
        templates = questionTemplates.major;
      } else if (criterionName.includes('학업')) {
        templates = questionTemplates.academic;
      } else if (criterionName.includes('발전') || criterionName.includes('잠재')) {
        templates = questionTemplates.potential;
      } else if (criterionName.includes('인성') || criterionName.includes('사회성')) {
        templates = questionTemplates.character;
      } else if (criterionName.includes('창의')) {
        templates = questionTemplates.creativity;
      } else if (criterionName.includes('자기주도')) {
        templates = questionTemplates.selfDirection;
      } else if (criterionName.includes('연구')) {
        templates = questionTemplates.research;
      }

      // 생활기록부 기반 질문 생성
      for (let i = 0; i < questionCount && i < templates.length; i++) {
        const template = templates[i];
        const relatedActivities = findRelatedActivities(template.keywords);

        if (relatedActivities.length > 0) {
          const activity = relatedActivities[0];
          let questionText = template.template
            .replace('{activity}', activity.title)
            .replace('{major}', studentRecord.studentInfo.targetMajor)
            .replace('{university}', university.name)
            .replace('{department}', university.department)
            .replace('{subject}', activity.subject || '정보')
            .replace('{project}', activity.project || '프로젝트')
            .replace('{club}', activity.club || '동아리');

          newQuestions.push({
            id: `q${questionId++}`,
            universityId: university.id,
            universityName: university.name,
            criterion: criterionName,
            weight: weight,
            questionText: questionText,
            relatedActivities: [activity],
            answer: '',
            keywords: template.keywords,
            preparationStatus: 'not_started' // not_started, in_progress, completed
          });
        }
      }
    });

    // 일반 질문 추가
    if (generationOptions.includeGeneral) {
      const generalTemplates = questionTemplates.general.slice(0, 3);
      generalTemplates.forEach(template => {
        let questionText = template.template
          .replace('{university}', university.name)
          .replace('{department}', university.department);

        newQuestions.push({
          id: `q${questionId++}`,
          universityId: university.id,
          universityName: university.name,
          criterion: '전체',
          weight: 0,
          questionText: questionText,
          relatedActivities: [],
          answer: '',
          keywords: template.keywords,
          preparationStatus: 'not_started'
        });
      });
    }

    return newQuestions;
  };

  // 관련 활동 찾기
  const findRelatedActivities = (keywords) => {
    const activities = [];

    studentRecord.records.forEach(record => {
      if (record.activities) {
        record.activities.forEach(activity => {
          const matchScore = keywords.filter(keyword =>
            activity.keywords?.some(ak => ak.includes(keyword)) ||
            activity.title.includes(keyword) ||
            activity.description.includes(keyword)
          ).length;

          if (matchScore > 0) {
            activities.push({
              ...activity,
              year: record.year,
              category: record.category,
              matchScore
            });
          }
        });
      }
    });

    return activities.sort((a, b) => b.matchScore - a.matchScore);
  };

  // 대학별 질문 생성
  const handleGenerateForUniversity = (university) => {
    // 이미 생성된 질문이 있는지 확인
    const existing = generatedQuestions.filter(q => q.universityId === university.id);

    if (existing.length > 0) {
      const confirm = window.confirm(
        `${university.name}에 대한 질문이 이미 ${existing.length}개 있습니다. 추가로 생성하시겠습니까?`
      );
      if (!confirm) return;
    }

    const newQuestions = generateQuestions(university);
    setGeneratedQuestions([...generatedQuestions, ...newQuestions]);

    alert(`${university.name}에 대한 예상 질문 ${newQuestions.length}개가 생성되었습니다.`);
  };

  // 모든 대학에 대한 질문 일괄 생성
  const handleGenerateForAll = () => {
    if (selectedUniversities.length === 0) {
      alert('먼저 대학을 선택해주세요.');
      return;
    }

    const allNewQuestions = [];
    selectedUniversities.forEach(university => {
      const newQuestions = generateQuestions(university);
      allNewQuestions.push(...newQuestions);
    });

    setGeneratedQuestions([...generatedQuestions, ...allNewQuestions]);
    alert(`총 ${allNewQuestions.length}개의 예상 질문이 생성되었습니다.`);
  };

  // 질문 삭제
  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('이 질문을 삭제하시겠습니까?')) {
      setGeneratedQuestions(generatedQuestions.filter(q => q.id !== questionId));
      if (selectedQuestion?.id === questionId) {
        setSelectedQuestion(null);
      }
    }
  };

  // 답변 저장
  const handleSaveAnswer = (questionId, answer, status) => {
    setGeneratedQuestions(
      generatedQuestions.map(q =>
        q.id === questionId
          ? { ...q, answer, preparationStatus: status }
          : q
      )
    );
  };

  return (
    <div className="question-generator">
      <div className="generator-header">
        <h2>면접 예상 질문 생성 및 관리</h2>
        <p className="subtitle">
          대학별 평가기준과 생활기록부를 분석하여 맞춤형 예상 질문을 생성합니다
        </p>
      </div>

      {selectedUniversities.length === 0 ? (
        <div className="empty-state">
          <p>먼저 '대학 관리' 메뉴에서 지원 대학을 선택해주세요.</p>
        </div>
      ) : (
        <>
          {/* 질문 생성 섹션 */}
          <div className="generation-section">
            <h3>질문 생성하기</h3>

            <div className="university-buttons">
              {selectedUniversities.map((university, index) => {
                const questionCount = generatedQuestions.filter(
                  q => q.universityId === university.id
                ).length;

                return (
                  <button
                    key={university.id}
                    className="university-gen-btn"
                    onClick={() => handleGenerateForUniversity(university)}
                  >
                    <div className="btn-content">
                      <span className="univ-rank">{index + 1}지망</span>
                      <span className="univ-name">{university.name}</span>
                      {questionCount > 0 && (
                        <span className="question-count">
                          {questionCount}개 질문
                        </span>
                      )}
                    </div>
                    <span className="gen-icon">⚡</span>
                  </button>
                );
              })}
            </div>

            <button
              className="btn-generate-all"
              onClick={handleGenerateForAll}
            >
              🎯 모든 대학 질문 일괄 생성
            </button>
          </div>

          {/* 생성된 질문 목록 */}
          {generatedQuestions.length > 0 && (
            <div className="questions-section">
              <div className="section-split">
                {/* 왼쪽: 질문 목록 */}
                <div className="questions-list-panel">
                  <QuestionList
                    questions={generatedQuestions}
                    selectedQuestion={selectedQuestion}
                    onSelectQuestion={setSelectedQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                    universities={selectedUniversities}
                  />
                </div>

                {/* 오른쪽: 답변 에디터 */}
                <div className="answer-editor-panel">
                  {selectedQuestion ? (
                    <AnswerEditor
                      question={selectedQuestion}
                      onSaveAnswer={handleSaveAnswer}
                      studentRecord={studentRecord}
                    />
                  ) : (
                    <div className="no-selection">
                      <p>👈 왼쪽에서 질문을 선택하여 답변을 작성하세요</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionGenerator;
