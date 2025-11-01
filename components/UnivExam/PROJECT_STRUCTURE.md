# UnivExam 프로젝트 구조 요약

## 📁 디렉토리 구조

```
UnivExam/
├── README.md                          # 프로젝트 전체 설명
├── PROJECT_STRUCTURE.md               # 이 파일
├── UnivExamMain.js                    # 메인 페이지 컴포넌트
│
├── StudentRecord/                     # 생활기록부 관리
│   ├── RecordOverview.js             # 생활기록부 전체 요약
│   ├── RecordByGrade.js              # 학년별 활동 정리
│   ├── RecordByCategory.js           # 카테고리별 활동 정리
│   └── ActivityAnalysis.js           # 활동 분석 및 인사이트
│
├── University/                        # 대학별 면접 준비
│   ├── UniversitySelector.js         # 5개 대학 선택 및 관리
│   ├── UniversityProfile.js          # 대학별 면접 정보 프로필
│   └── EvaluationCriteria.js         # 평가항목 및 비중 표시
│
├── Interview/                         # 면접 질문 및 답변
│   ├── QuestionGenerator.js          # 예상 질문 생성기
│   ├── QuestionList.js               # 질문 목록 관리
│   └── AnswerEditor.js               # 답변 작성 에디터
│
├── Analysis/                          # 분석 및 통계
│   └── AnalysisDashboard.js          # 종합 분석 대시보드
│
├── Data/                              # 데이터 관리
│   ├── sampleStudentRecord.js        # 샘플 생활기록부 데이터
│   ├── universityData.js             # 대학별 면접 정보
│   └── questionTemplates.js          # 질문 템플릿
│
└── styles/                            # 스타일
    └── UnivExam.css                  # 전역 스타일
```

## 🎯 주요 기능

### 1. 생활기록부 분석 (StudentRecord)
- **RecordOverview.js**: 생활기록부 전체 뷰 관리 및 뷰 모드 전환
- **RecordByGrade.js**: 1, 2, 3학년별로 활동 정리 및 표시
- **RecordByCategory.js**: 자율/동아리/진로/교과/행동특성 카테고리별 정리
- **ActivityAnalysis.js**:
  - 카테고리별 활동 분포 차트
  - 학년별 활동 추이 분석
  - 핵심 키워드 추출
  - 전공 관련 활동 및 리더십 활동 분석
  - 면접 대비 인사이트 제공

### 2. 대학 관리 (University)
- **UniversitySelector.js**:
  - 최대 5개 대학 선택
  - 대학 추가/제거/순서 변경
  - 대학별 상세 정보 표시
- **UniversityProfile.js**:
  - 면접 기본 정보 (형식, 시간)
  - 기출 면접 질문 예시
  - 대학별 맞춤 면접 팁
- **EvaluationCriteria.js**:
  - 평가기준 및 비중 시각화
  - 평가 포인트 상세 설명
  - 평가 비중 분석 및 인사이트

### 3. 면접 준비 (Interview)
- **QuestionGenerator.js**:
  - 대학별 평가기준 기반 질문 자동 생성
  - 생활기록부 키워드 매칭
  - 평가 비중에 따른 질문 수 조절
  - 일괄 생성 기능
- **QuestionList.js**:
  - 질문 목록 표시 및 필터링
  - 대학/평가기준/상태별 필터
  - 준비 상태 관리 (미작성/작성중/완료)
- **AnswerEditor.js**:
  - 답변 작성 에디터
  - 관련 활동 자동 매칭 및 표시
  - 답변 가이드 제공
  - 답변 시간 측정 타이머
  - 자동 저장 기능

### 4. 분석 및 통계 (Analysis)
- **AnalysisDashboard.js**:
  - 전체 준비도 원형 차트
  - 대학별 준비 현황 카드
  - 평가기준별 준비도 진행바
  - 강점 분석 (전공 활동, 리더십, 지속성)
  - 개선 제안 (우선순위별)
  - 추가 인사이트 및 팁

## 📊 데이터 구조

### 생활기록부 (sampleStudentRecord.js)
```javascript
{
  studentInfo: {
    name, school, currentGrade, targetMajor
  },
  records: [
    {
      year: 1/2/3,
      category: "자율활동" | "동아리활동" | "진로활동" | "전공관련교과" | "그외교과" | "행동특성",
      activities: [...],
      subjects: [...],
      traits: [...]
    }
  ],
  specialNotes: [...]
}
```

### 대학 정보 (universityData.js)
```javascript
{
  id, name, department, type, duration,
  evaluationCriteria: [
    {
      criterion, weight, description, keyPoints: [...]
    }
  ],
  interviewQuestions: [...]
}
```

### 생성된 질문 (QuestionGenerator)
```javascript
{
  id, universityId, universityName,
  criterion, weight, questionText,
  relatedActivities: [...],
  answer, keywords,
  preparationStatus: "not_started" | "in_progress" | "completed"
}
```

## 🔄 데이터 흐름

1. **초기화**: UnivExamMain에서 LocalStorage 데이터 로드
2. **생활기록부**: StudentRecord 컴포넌트들에서 분석 및 표시
3. **대학 선택**: UniversitySelector에서 5개 대학 관리
4. **질문 생성**: QuestionGenerator가 대학 평가기준 + 생활기록부 분석하여 질문 생성
5. **답변 작성**: AnswerEditor에서 관련 활동 참고하여 답변 작성
6. **진행 추적**: 모든 변경사항 자동 저장 (LocalStorage)
7. **분석**: AnalysisDashboard에서 전체 현황 분석 및 개선 제안

## 🎨 스타일링

- **색상 테마**:
  - 주요 색상: #667eea (보라-파랑)
  - 보조 색상: #764ba2 (보라)
  - 평가기준별 고유 색상 (criterionColors)

- **반응형**: 모바일/태블릿/데스크톱 대응

- **컴포넌트 스타일**:
  - 카드 기반 레이아웃
  - 그라데이션 배경
  - 부드러운 그림자 및 호버 효과
  - 시각적 피드백 강조

## 🚀 사용 흐름

1. **생활기록부 확인**: StudentRecord 메뉴에서 본인의 활동 확인 및 분석
2. **대학 설정**: University 메뉴에서 지원할 5개 대학 선택
3. **질문 생성**: Interview 메뉴에서 대학별 예상 질문 생성
4. **답변 작성**: 생성된 질문에 대해 생활기록부 근거로 답변 작성
5. **진행 관리**: 답변 상태를 미작성/작성중/완료로 관리
6. **분석 확인**: Analysis 메뉴에서 준비도 확인 및 개선점 파악
7. **반복 연습**: 완성된 답변으로 모의 면접 연습

## 💡 핵심 알고리즘

### 질문 생성 알고리즘
1. 대학의 평가기준 및 비중 파악
2. 비중에 따라 질문 수 결정 (weight / 15)
3. 평가기준에 맞는 질문 템플릿 선택
4. 생활기록부에서 관련 활동 찾기 (키워드 매칭)
5. 템플릿에 실제 활동 정보 삽입
6. 질문 생성 및 저장

### 관련 활동 매칭
1. 질문의 키워드 추출
2. 생활기록부의 모든 활동 순회
3. 활동의 키워드/제목/설명과 매칭
4. 매칭 점수 계산
5. 점수 순으로 정렬하여 반환

### 준비도 계산
- 전체 준비도 = (완료된 답변 수 / 전체 질문 수) × 100
- 대학별 준비도 = 각 대학의 질문에 대한 완료율
- 평가기준별 준비도 = 각 평가기준 질문에 대한 완료율

## 🔧 확장 가능성

### 추가 가능한 기능
1. **RecordUploader.js**: PDF/Excel 형식의 생활기록부 파일 업로드
2. **InterviewSimulator.js**: 실시간 모의 면접 시뮬레이터
3. **VideoRecorder.js**: 답변 영상 녹화 및 피드백
4. **PracticeSession.js**: 연습 세션 기록 및 관리
5. **UniversityComparison.js**: 대학별 평가기준 비교 차트
6. **exportHelper.js**: PDF로 답변 모음집 내보내기
7. **AI 답변 피드백**: AI를 활용한 답변 개선 제안
8. **시간 관리**: 면접 날짜 카운트다운 및 학습 계획

## 📝 개발 노트

- **상태 관리**: React useState + LocalStorage
- **자동 저장**: 2초 디바운스로 자동 저장
- **필터링**: 다중 필터 지원 (대학/평가기준/���태)
- **반응형**: CSS Grid 및 Flexbox 활용
- **접근성**: 시맨틱 HTML 및 키보드 네비게이션 지원

## 🎓 활용 방법

### 학생
1. 자신의 생활기록부 내용을 입력
2. 지원할 대학 5곳 선택
3. 예상 질문 생성 및 답변 작성
4. 반복 연습 및 개선

### 교사/상담사
1. 학생의 생활기록부 분석
2. 대학별 맞춤 질문 제공
3. 답변 검토 및 피드백
4. 준비도 추적 및 관리

## 🔒 데이터 보안

- 모든 데이터는 브라우저 LocalStorage에 저장
- 서버 전송 없음 (완전한 클라이언트 사이드)
- 개인정보 보호 강화

---

**개발 완료일**: 2025-11-01
**버전**: 1.0.0
**개발자**: Claude Code
