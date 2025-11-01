# UnivExam - 2026 대학입학 수시면접 준비 시스템

## 프로젝트 개요
2026년 대학입학시험 수시면접을 대비하기 위한 종합 준비 시스템
- 생활기록부 체계적 분석 및 정리
- 5개 지원 대학별 맞춤형 예상 면접질문 생성
- 생활기록부 기반 예상 답변 작성 지원

## 디렉토리 구조

```
UnivExam/
├── README.md                          # 프로젝트 설명 문서
├── UnivExamMain.js                    # 메인 페이지 컴포넌트
│
├── StudentRecord/                     # 생활기록부 관리
│   ├── RecordOverview.js             # 생활기록부 전체 요약
│   ├── RecordByGrade.js              # 학년별 활동 정리
│   ├── RecordByCategory.js           # 카테고리별 활동 정리
│   ├── ActivityAnalysis.js           # 활동 분석 및 인사이트
│   └── RecordUploader.js             # 생활기록부 파일 업로드
│
├── University/                        # 대학별 면접 준비
│   ├── UniversitySelector.js         # 5개 대학 선택 및 관리
│   ├── UniversityProfile.js          # 대학별 면접 정보 프로필
│   ├── EvaluationCriteria.js         # 평가항목 및 비중 표시
│   └── UniversityComparison.js       # 대학별 평가기준 비교
│
├── Interview/                         # 면접 질문 및 답변
│   ├── QuestionGenerator.js          # 예상 질문 생성기
│   ├── QuestionList.js               # 질문 목록 관리
│   ├── AnswerEditor.js               # 답변 작성 에디터
│   ├── AnswerReview.js               # 답변 검토 및 피드백
│   └── InterviewSimulator.js         # 모의 면접 시뮬레이터
│
├── Analysis/                          # 분석 및 통계
│   ├── StrengthWeakness.js           # 강점/약점 분석
│   ├── CategoryDistribution.js       # 활동 분포 차트
│   ├── ReadinessScore.js             # 준비도 점수
│   └── ImprovementSuggestions.js     # 개선 제안
│
├── Practice/                          # 연습 및 훈련
│   ├── PracticeSession.js            # 연습 세션 관리
│   ├── TimerControl.js               # 답변 시간 측정
│   ├── VideoRecorder.js              # 답변 영상 녹화 (선택)
│   └── PracticeHistory.js            # 연습 기록 관리
│
├── Data/                              # 데이터 관리
│   ├── sampleStudentRecord.js        # 샘플 생활기록부 데이터
│   ├── universityData.js             # 대학별 면접 정보
│   ├── questionTemplates.js          # 질문 템플릿
│   └── evaluationCriteria.js         # 평가 기준 데이터
│
└── Utils/                             # 유틸리티
    ├── recordParser.js               # 생활기록부 파싱
    ├── questionMatcher.js            # 질문-답변 매칭
    ├── scoreCalculator.js            # 점수 계산
    └── exportHelper.js               # 데이터 내보내기
```

## 주요 기능

### 1. 생활기록부 분석 (StudentRecord)
- **학년별 정리**: 1학년, 2학년, 3학년 활동 분류
- **카테고리별 정리**:
  - 자율활동
  - 동아리활동
  - 진로활동
  - 전공관련 교과
  - 그 외 교과
  - 행동특성

### 2. 대학별 맞춤 준비 (University)
- 5개 지원 대학 등록 및 관리
- 각 대학의 면접 평가항목 및 비중 설정
- 대학별 평가기준 비교 분석

### 3. 예상 질문 및 답변 (Interview)
- 대학별 평가비중을 고려한 예상 질문 생성
- 생활기록부 내용 기반 답변 작성
- 추가 조사 내용 통합
- 모의 면접 연습

### 4. 분석 및 피드백 (Analysis)
- 강점/약점 분석
- 활동 분포 시각화
- 준비도 평가
- 개선 방향 제안

### 5. 연습 및 기록 (Practice)
- 답변 시간 측정
- 연습 세션 기록
- 개선 추적

## 데이터 구조

### 생활기록부 데이터 구조
```javascript
{
  studentInfo: {
    name: "학생이름",
    school: "학교명",
    grade: 3
  },
  records: [
    {
      year: 1,
      category: "자율활동",
      activities: [
        {
          title: "활동명",
          description: "활동 내용",
          period: "2024.03 - 2024.12",
          keywords: ["키워드1", "키워드2"]
        }
      ]
    }
  ]
}
```

### 대학 데이터 구조
```javascript
{
  university: {
    name: "대학명",
    department: "학과명",
    evaluationCriteria: [
      {
        criterion: "전공적합성",
        weight: 40,
        description: "전공에 대한 관심과 이해도"
      },
      {
        criterion: "발전가능성",
        weight: 30,
        description: "학업 및 성장 잠재력"
      }
    ],
    interviewFormat: "개별면접",
    duration: 15
  }
}
```

### 면접 질문 데이터 구조
```javascript
{
  question: {
    id: "q001",
    universityId: "univ1",
    criterion: "전공적합성",
    questionText: "생활기록부의 XX활동에 대해 설명해주세요",
    relatedRecords: ["record1", "record2"],
    suggestedAnswer: "답변 가이드",
    keywords: ["키워드1", "키워드2"],
    answerTime: 3
  }
}
```

## 개발 단계

### Phase 1: 기본 구조 및 데이터 관리
1. 디렉토리 구조 생성
2. 샘플 데이터 작성
3. 기본 컴포넌트 틀 구현

### Phase 2: 생활기록부 분석 기능
1. 파일 업로드 및 파싱
2. 학년별/카테고리별 정리
3. 활동 분석 및 시각화

### Phase 3: 대학별 면접 준비
1. 대학 정보 등록
2. 평가기준 설정
3. 예상 질문 생성

### Phase 4: 답변 작성 및 연습
1. 답변 에디터
2. 모의 면접 시뮬레이터
3. 연습 기록 관리

### Phase 5: 분석 및 개선
1. 준비도 분석
2. 피드백 시스템
3. 개선 제안

## 기술 스택
- React.js (컴포넌트 기반 UI)
- Chart.js / Recharts (데이터 시각화)
- LocalStorage / IndexedDB (데이터 저장)
- React Router (페이지 라우팅)
