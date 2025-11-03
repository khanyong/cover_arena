# Interview Question Customization & PDF Export Feature

## Overview
이 문서는 사용자가 면접 질문과 답변을 개인화하고 PDF로 다운로드할 수 있는 새로운 기능에 대해 설명합니다.

## Features

### 1. 사용자 맞춤형 질문/답변 시스템
- 로그인한 사용자가 기본 면접 질문을 자신만의 버전으로 수정 가능
- 모범답변을 참고하여 자신만의 답변 작성 및 저장
- Supabase를 통한 안전한 데이터 저장

### 2. PDF 다운로드 기능
- 작성한 질문과 답변을 PDF 형식으로 다운로드
- 대학/학과 정보 포함
- 깔끔한 레이아웃과 읽기 쉬운 포맷

## Database Schema

### Tables Created

#### `user_interview_questions`
사용자의 맞춤형 질문 저장
- `id`: UUID (Primary Key)
- `user_id`: UUID (References auth.users)
- `original_question_id`: TEXT (e.g., "essential_1", "category_autonomous_1")
- `question_type`: TEXT ("essential" or "category")
- `category`: TEXT (Category name for category questions)
- `custom_question`: TEXT (User's customized question)
- `original_question`: TEXT (Original question for reference)
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

#### `user_interview_answers`
사용자의 답변 저장
- `id`: UUID (Primary Key)
- `user_id`: UUID (References auth.users)
- `question_id`: TEXT (Reference to the question)
- `answer`: TEXT (User's written answer)
- `keywords`: TEXT[] (Array of keywords)
- `time_spent`: INTEGER (Time spent in seconds)
- `is_completed`: BOOLEAN (Completion status)
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

#### `model_answers`
모범답변 참조용 (Optional)
- `id`: UUID (Primary Key)
- `question_id`: TEXT (Unique)
- `question_text`: TEXT
- `model_answer`: TEXT
- `keywords`: TEXT[]
- `category`: TEXT
- `source`: TEXT (생활기록부 출처)
- `created_at`: TIMESTAMPTZ

## Setup Instructions

### 1. Database Migration

Supabase 대시보드에서 SQL 실행:

```bash
# Migration file location
supabase/migrations/20250103_user_interview_data.sql
```

또는 Supabase Dashboard → SQL Editor에서 파일 내용을 복사하여 실행

### 2. Environment Variables

`.env.local` 파일에 다음 변수들이 설정되어 있는지 확인:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Install Dependencies

```bash
npm install jspdf --legacy-peer-deps
```

## Usage Guide

### For Users

#### 1. 질문 수정하기
1. 면접 준비 → 필수질문 탭으로 이동
2. 원하는 질문을 클릭하여 펼치기
3. "✏️ 나만의 질문 작성" 섹션에서 "질문 수정" 버튼 클릭
4. 질문을 자신의 스타일로 수정
5. "저장" 버튼 클릭

#### 2. 답변 작성하기
1. 질문을 펼친 상태에서 "✍️ 나만의 답변 작성" 섹션 확인
2. "답변 작성" 버튼 클릭
3. 모범답변을 참고하여 자신만의 답변 작성
4. "저장" 버튼 클릭

#### 3. PDF 다운로드
1. 페이지 상단의 "📄 PDF 다운로드" 버튼 클릭
2. 자동으로 PDF 파일이 다운로드됨
3. 파일명: `필수질문_대학명_날짜.pdf`

### For Developers

#### Service Functions

```javascript
// Import service functions
import {
  getUserQuestion,
  getUserAnswer,
  saveUserQuestion,
  saveUserAnswer,
  deleteUserQuestion,
  deleteUserAnswer,
  getUserQuestionsWithAnswers,
  getUserInterviewStats,
  getExportData
} from '@/lib/interviewService';

// Save a custom question
await saveUserQuestion({
  userId: user.id,
  originalQuestionId: 'essential_1',
  questionType: 'essential',
  customQuestion: '수정된 질문 내용',
  originalQuestion: '원본 질문'
});

// Save an answer
await saveUserAnswer({
  userId: user.id,
  questionId: 'essential_1',
  answer: '나의 답변',
  keywords: ['키워드1', '키워드2'],
  isCompleted: true
});

// Get user's questions with answers
const { data, error } = await getUserQuestionsWithAnswers(user.id);
```

#### PDF Generation

```javascript
// Import PDF functions
import {
  generateEssentialQuestionsPDF,
  generateCategoryQuestionsPDF,
  generateCompletePDF,
  downloadPDF
} from '@/lib/pdfGenerator';

// Generate PDF
const doc = generateEssentialQuestionsPDF(questionsData, {
  name: 'Student Name',
  university: 'University Name'
});

// Download
downloadPDF(doc, 'my-interview-prep.pdf');
```

## Component Structure

```
components/UnivExam/Interview/
├── EssentialQuestions.js      # Updated with edit/save/PDF features
├── CategoryQuestions.js        # To be updated
├── InterviewNotebook.js
├── SpanishInterview.js
└── PhilosophyInterview.js

lib/
├── interviewService.js         # Supabase CRUD operations
├── pdfGenerator.js            # PDF generation utilities
└── supabase.js                # Supabase client

supabase/migrations/
└── 20250103_user_interview_data.sql
```

## Security

### Row Level Security (RLS)
모든 테이블에 RLS가 활성화되어 있으며, 사용자는 자신의 데이터만 접근 가능:

- `user_interview_questions`: 사용자 본인만 CRUD 가능
- `user_interview_answers`: 사용자 본인만 CRUD 가능
- `model_answers`: 인증된 사용자 모두 읽기 가능

## Future Enhancements

### Planned Features
1. **CategoryQuestions 컴포넌트 업데이트**
   - 항목별 예상질문에도 동일한 편집/저장 기능 추가

2. **AI 답변 피드백**
   - 작성한 답변에 대한 AI 피드백 제공
   - 개선 제안 및 키워드 추천

3. **음성 녹음 기능**
   - 답변을 음성으로 녹음하여 연습
   - 발음 및 시간 관리 피드백

4. **협업 기능**
   - 멘토와 답변 공유
   - 피드백 주고받기

5. **통계 대시보드**
   - 준비 진행률 시각화
   - 작성 완료된 답변 통계

## Troubleshooting

### Common Issues

#### 1. PDF 다운로드가 작동하지 않음
- jsPDF 패키지가 설치되어 있는지 확인
- 브라우저 콘솔에서 에러 메시지 확인
- 팝업 차단 해제

#### 2. 데이터 저장 실패
- Supabase RLS 정책이 올바르게 설정되었는지 확인
- 사용자가 로그인되어 있는지 확인
- 네트워크 연결 상태 확인

#### 3. 한글 텍스트가 PDF에서 깨짐
- jsPDF는 기본적으로 한글을 지원하지 않지만, 현재 구현은 유니코드 텍스트를 처리합니다
- 더 나은 한글 지원을 위해 향후 커스텀 폰트 추가 예정

## API Reference

### interviewService.js

#### `getUserQuestions(userId, questionType)`
사용자의 맞춤형 질문 목록 조회

**Parameters:**
- `userId` (string): 사용자 ID
- `questionType` (string, optional): 질문 타입 필터 ("essential" or "category")

**Returns:** `Promise<{data, error}>`

#### `getUserQuestion(userId, originalQuestionId)`
특정 질문 조회

**Parameters:**
- `userId` (string): 사용자 ID
- `originalQuestionId` (string): 원본 질문 ID

**Returns:** `Promise<{data, error}>`

#### `saveUserQuestion(questionData)`
질문 저장 또는 업데이트

**Parameters:**
- `questionData` (object):
  - `userId` (string): 사용자 ID
  - `originalQuestionId` (string): 원본 질문 ID
  - `questionType` (string): 질문 타입
  - `category` (string, optional): 카테고리
  - `customQuestion` (string): 수정된 질문
  - `originalQuestion` (string): 원본 질문

**Returns:** `Promise<{data, error}>`

#### `getUserAnswer(userId, questionId)`
특정 답변 조회

**Parameters:**
- `userId` (string): 사용자 ID
- `questionId` (string): 질문 ID

**Returns:** `Promise<{data, error}>`

#### `saveUserAnswer(answerData)`
답변 저장 또는 업데이트

**Parameters:**
- `answerData` (object):
  - `userId` (string): 사용자 ID
  - `questionId` (string): 질문 ID
  - `answer` (string): 답변 내용
  - `keywords` (array): 키워드 배열
  - `timeSpent` (number, optional): 소요 시간(초)
  - `isCompleted` (boolean, optional): 완료 여부

**Returns:** `Promise<{data, error}>`

#### `getUserQuestionsWithAnswers(userId)`
질문과 답변을 함께 조회

**Parameters:**
- `userId` (string): 사용자 ID

**Returns:** `Promise<{data, error}>`

#### `getUserInterviewStats(userId)`
사용자의 면접 준비 통계 조회

**Parameters:**
- `userId` (string): 사용자 ID

**Returns:** `Promise<{data, error}>`
- `totalQuestions`: 총 질문 수
- `completedAnswers`: 완료된 답변 수
- `totalTimeSpent`: 총 소요 시간
- `averageAnswerLength`: 평균 답변 길이
- `totalKeywords`: 총 키워드 수

#### `getExportData(userId, questionType)`
PDF 내보내기용 데이터 조회

**Parameters:**
- `userId` (string): 사용자 ID
- `questionType` (string, optional): 질문 타입 필터

**Returns:** `Promise<{data, error}>`

### pdfGenerator.js

#### `generateEssentialQuestionsPDF(questions, userInfo)`
필수 질문 PDF 생성

**Parameters:**
- `questions` (array): 질문 배열
  - `category` (string): 질문 카테고리
  - `question` (string): 질문 내용
  - `answer` (string): 답변 내용
  - `keywords` (array): 키워드 배열
- `userInfo` (object):
  - `name` (string): 사용자 이름
  - `university` (string): 대학/학과 정보

**Returns:** `jsPDF` document instance

#### `generateCategoryQuestionsPDF(categorizedQuestions, userInfo)`
카테고리별 질문 PDF 생성

**Parameters:**
- `categorizedQuestions` (object): 카테고리별로 그룹화된 질문
- `userInfo` (object): 사용자 정보

**Returns:** `jsPDF` document instance

#### `generateCompletePDF(essentialQuestions, categoryQuestions, userInfo)`
전체 질문을 포함한 통합 PDF 생성

**Parameters:**
- `essentialQuestions` (array): 필수 질문 배열
- `categoryQuestions` (object): 카테고리 질문 객체
- `userInfo` (object): 사용자 정보

**Returns:** `jsPDF` document instance

#### `downloadPDF(doc, filename)`
PDF 파일 다운로드

**Parameters:**
- `doc` (jsPDF): PDF 문서 인스턴스
- `filename` (string): 다운로드할 파일명 (기본값: 'interview-questions.pdf')

**Returns:** void

## Example Workflow

### Complete User Flow

```javascript
// 1. User logs in
const user = await auth.getCurrentUser();

// 2. User customizes a question
await saveUserQuestion({
  userId: user.id,
  originalQuestionId: 'essential_1',
  questionType: 'essential',
  customQuestion: '제 강점을 설명해주세요.',
  originalQuestion: '자신의 강점과 노력을 중심으로 학과(계열)와의 적합성을 어필해주세요.'
});

// 3. User writes an answer
await saveUserAnswer({
  userId: user.id,
  questionId: 'essential_1',
  answer: '저는 비판적 사고력과 문제 해결 능력이 뛰어납니다...',
  keywords: ['비판적사고', '문제해결', '소통능력'],
  isCompleted: true
});

// 4. User exports to PDF
const { data: exportData } = await getExportData(user.id, 'essential');
const doc = generateEssentialQuestionsPDF(
  exportData.essential,
  {
    name: user.email,
    university: '한국외국어대학교 - 스페인어과'
  }
);
downloadPDF(doc, '면접준비_2025-01-03.pdf');
```

## Testing

### Manual Testing Steps

1. **로그인 테스트**
   - 로그인 전: 편집 버튼이 비활성화되어 있는지 확인
   - 로그인 후: 편집 버튼이 활성화되는지 확인

2. **질문 수정 테스트**
   - 질문 수정 버튼 클릭
   - 텍스트 입력 및 수정
   - 저장 버튼 클릭 후 데이터 저장 확인
   - 페이지 새로고침 후 수정 내용 유지 확인

3. **답변 작성 테스트**
   - 답변 작성 버튼 클릭
   - 텍스트 입력
   - 자동 글자 수 카운트 확인
   - 저장 후 데이터 유지 확인

4. **PDF 다운로드 테스트**
   - PDF 다운로드 버튼 클릭
   - 파일 다운로드 확인
   - PDF 내용 확인 (질문, 답변, 키워드)
   - 한글 텍스트 표시 확인

### Database Testing

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_interview_questions', 'user_interview_answers', 'model_answers');

-- Check RLS policies
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_interview_questions', 'user_interview_answers');

-- Sample query to check user data
SELECT * FROM user_interview_questions WHERE user_id = 'your-user-id';
SELECT * FROM user_interview_answers WHERE user_id = 'your-user-id';
```

## Performance Considerations

1. **Data Loading**
   - useEffect로 사용자 데이터를 로드할 때 모든 질문에 대해 개별 쿼리 실행
   - 향후 개선: 배치 쿼리로 최적화

2. **PDF Generation**
   - 큰 문서의 경우 생성 시간이 길어질 수 있음
   - 브라우저 메모리 사용량 고려

3. **Supabase Quotas**
   - Free tier의 경우 API 요청 제한 확인
   - 스토리지 용량 모니터링

## License
This feature is part of the CoverCompetition project.

## Support
이슈가 발생하면 GitHub Issues에 보고해주세요.
