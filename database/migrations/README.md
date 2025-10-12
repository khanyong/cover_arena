# 삼체 커뮤니티 데이터베이스 마이그레이션 가이드

## 🚀 빠른 시작

Supabase 대시보드에서 다음 SQL 파일들을 **순서대로** 실행하세요:

### 1단계: 스키마 생성
```bash
파일: threebody-community-schema.sql
```

이 파일은 다음을 생성합니다:
- 7개 테이블 (wallfacer_plans, discussions, comments 등)
- Row Level Security (RLS) 정책
- 인덱스 (성능 최적화)
- UNIQUE constraints (중복 방지)

### 2단계: RPC 함수 생성
```bash
파일: threebody-rpc-functions.sql
```

이 파일은 다음을 생성합니다:
- increment/decrement 함수 (좋아요, 댓글 수 증가/감소)
- SECURITY DEFINER 권한 (안전한 카운터 업데이트)

---

## 📋 상세 실행 방법

### Supabase 대시보드 사용

1. **Supabase 프로젝트 열기**
   - https://supabase.com 접속
   - 프로젝트 선택

2. **SQL Editor 열기**
   - 왼쪽 메뉴에서 "SQL Editor" 클릭
   - "+ New query" 버튼 클릭

3. **스키마 파일 실행**
   - `threebody-community-schema.sql` 내용 복사
   - SQL Editor에 붙여넣기
   - "Run" 버튼 클릭 (또는 Ctrl+Enter)
   - 성공 메시지 확인

4. **RPC 함수 파일 실행**
   - 새 쿼리 생성 ("+ New query")
   - `threebody-rpc-functions.sql` 내용 복사
   - SQL Editor에 붙여넣기
   - "Run" 버튼 클릭
   - 성공 메시지 확인

5. **테이블 확인**
   - 왼쪽 메뉴에서 "Table Editor" 클릭
   - 다음 테이블들이 보이는지 확인:
     - threebody_wallfacer_plans
     - threebody_plan_likes
     - threebody_discussions
     - threebody_comments
     - threebody_discussion_likes
     - threebody_comment_likes
     - threebody_strategy_votes

---

## 🔒 Row Level Security (RLS) 정책

### wallfacer_plans 테이블:
- ✅ **SELECT**: 모든 사용자 허용
- ✅ **INSERT**: 인증된 사용자만 (본인 user_id)
- ✅ **UPDATE**: 작성자만 (user_id 일치)
- ✅ **DELETE**: 작성자만 (user_id 일치)

### discussions 테이블:
- ✅ **SELECT**: 모든 사용자 허용
- ✅ **INSERT**: 인증된 사용자만
- ✅ **UPDATE**: 작성자만
- ✅ **DELETE**: 작성자만

### comments 테이블:
- ✅ **SELECT**: 모든 사용자 허용
- ✅ **INSERT**: 인증된 사용자만
- ✅ **UPDATE**: 작성자만
- ✅ **DELETE**: 작성자만

### likes 테이블들:
- ✅ **SELECT**: 모든 사용자 허용
- ✅ **INSERT**: 인증된 사용자만 (본인 user_id)
- ✅ **DELETE**: 본인만 (user_id 일치)

---

## 🧪 테스트 데이터 (선택사항)

테스트용 샘플 데이터를 추가하려면:

```sql
-- 테스트 면벽 계획
INSERT INTO threebody_wallfacer_plans
  (user_id, username, title, strategy_type, description, detailed_plan, success_probability)
VALUES
  (auth.uid(), 'TestUser', '양자 통신 네트워크 구축', '기술',
   '삼체의 소폰이 감지할 수 없는 양자 얽힘 통신 네트워크를 구축한다.',
   '1단계: 궤도 양자 위성 100기 배치\n2단계: 지상 양자 중계소 1000곳 설치\n3단계: 완전 암호화된 통신망 완성',
   75);

-- 테스트 토론
INSERT INTO threebody_discussions
  (user_id, username, title, category, content)
VALUES
  (auth.uid(), 'TestUser', '뤄지는 정말 영웅인가?', '인물 분석',
   '뤄지가 암흑의 숲 타격으로 인류를 구했지만, 우주 전체에 지구 위치를 노출시킨 것은 옳은 선택이었을까요?');

-- 테스트 댓글
INSERT INTO threebody_comments
  (discussion_id, user_id, username, content, parent_id)
VALUES
  ((SELECT id FROM threebody_discussions LIMIT 1),
   auth.uid(), 'TestUser', '뤄지는 다른 선택의 여지가 없었습니다.', NULL);
```

⚠️ **주의**: 테스트 데이터는 로그인한 상태에서만 추가 가능합니다.

---

## 🔧 유용한 SQL 쿼리

### 전체 통계 확인:
```sql
SELECT
  (SELECT COUNT(*) FROM threebody_wallfacer_plans) as total_plans,
  (SELECT COUNT(*) FROM threebody_discussions) as total_discussions,
  (SELECT COUNT(*) FROM threebody_comments) as total_comments,
  (SELECT COUNT(*) FROM threebody_plan_likes) as total_plan_likes,
  (SELECT COUNT(*) FROM threebody_discussion_likes) as total_discussion_likes;
```

### 인기 있는 면벽 계획 TOP 10:
```sql
SELECT title, username, likes_count, views_count
FROM threebody_wallfacer_plans
ORDER BY likes_count DESC
LIMIT 10;
```

### 가장 활발한 토론 TOP 10:
```sql
SELECT title, username, comments_count, likes_count
FROM threebody_discussions
ORDER BY comments_count DESC
LIMIT 10;
```

### 오늘 생성된 콘텐츠 수:
```sql
SELECT
  (SELECT COUNT(*) FROM threebody_wallfacer_plans WHERE created_at::date = CURRENT_DATE) as plans_today,
  (SELECT COUNT(*) FROM threebody_discussions WHERE created_at::date = CURRENT_DATE) as discussions_today,
  (SELECT COUNT(*) FROM threebody_comments WHERE created_at::date = CURRENT_DATE) as comments_today;
```

---

## 🗑️ 롤백 (삭제)

만약 처음부터 다시 시작하고 싶다면:

```sql
-- 주의: 모든 데이터가 삭제됩니다!

DROP TABLE IF EXISTS threebody_strategy_votes CASCADE;
DROP TABLE IF EXISTS threebody_comment_likes CASCADE;
DROP TABLE IF EXISTS threebody_discussion_likes CASCADE;
DROP TABLE IF EXISTS threebody_comments CASCADE;
DROP TABLE IF EXISTS threebody_discussions CASCADE;
DROP TABLE IF EXISTS threebody_plan_likes CASCADE;
DROP TABLE IF EXISTS threebody_wallfacer_plans CASCADE;

DROP FUNCTION IF EXISTS increment_plan_likes(UUID);
DROP FUNCTION IF EXISTS decrement_plan_likes(UUID);
DROP FUNCTION IF EXISTS increment_discussion_likes(UUID);
DROP FUNCTION IF EXISTS decrement_discussion_likes(UUID);
DROP FUNCTION IF EXISTS increment_discussion_comments(UUID);
DROP FUNCTION IF EXISTS decrement_discussion_comments(UUID);
DROP FUNCTION IF EXISTS increment_comment_likes(UUID);
DROP FUNCTION IF EXISTS decrement_comment_likes(UUID);
```

---

## 🐛 트러블슈팅

### 문제: "permission denied for table"
**해결**: RLS 정책이 제대로 적용되지 않았을 수 있습니다.
```sql
-- RLS 활성화 확인
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'threebody%';
```

### 문제: "duplicate key value violates unique constraint"
**해결**: 이미 좋아요를 누른 항목입니다. (정상 동작)

### 문제: "null value in column user_id violates not-null constraint"
**해결**: 로그인이 필요합니다. auth.uid()가 null입니다.

### 문제: RPC 함수 호출 실패
**해결**: 함수가 제대로 생성되었는지 확인:
```sql
SELECT proname
FROM pg_proc
WHERE proname LIKE 'increment%' OR proname LIKE 'decrement%';
```

---

## 📊 성능 최적화

이미 적용된 인덱스:
- `threebody_wallfacer_plans(created_at DESC)`
- `threebody_wallfacer_plans(likes_count DESC)`
- `threebody_discussions(created_at DESC)`
- `threebody_discussions(category)`
- `threebody_comments(discussion_id)`
- `threebody_comments(parent_id)`

추가 인덱스가 필요하다면:
```sql
-- 예: 사용자별 콘텐츠 조회 최적화
CREATE INDEX idx_plans_user_id ON threebody_wallfacer_plans(user_id);
CREATE INDEX idx_discussions_user_id ON threebody_discussions(user_id);
CREATE INDEX idx_comments_user_id ON threebody_comments(user_id);
```

---

## ✅ 마이그레이션 체크리스트

- [ ] Supabase 프로젝트 생성/접속
- [ ] `threebody-community-schema.sql` 실행
- [ ] `threebody-rpc-functions.sql` 실행
- [ ] Table Editor에서 7개 테이블 확인
- [ ] RLS 정책 활성화 확인
- [ ] (선택) 테스트 데이터 추가
- [ ] 환경 변수 설정 확인:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

완료되면 애플리케이션에서 커뮤니티 기능 사용 가능! 🎉

---

**작성일**: 2025-10-12
