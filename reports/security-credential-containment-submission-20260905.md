# 보안 Credential 조사·공급자 봉쇄 수행 결과 제출보고서

## 1. 문서 정보

| 항목 | 내용 |
|---|---|
| 보고 기준일 | 2026-09-05 KST |
| 보고 목적 | n8n Credential 사용 조사와 노출 Credential의 공급자 측 봉쇄 수행 내역 제출 |
| 조사 범위 | n8n 9개 Workflow, 범용 HTTP Request 노드 52개 |
| 관련 작업 ID | `A-IR-1-N8N-CREDENTIAL-USAGE-001`, `A-IR-P0-MEDIA-KEYS-001`, `A-IR-P0-CREATOMATE-001` |
| 현재 운영 단계 | Phase A — Remote Write Freeze 유지 |
| 비밀정보 처리 | API 키·토큰·Bearer 값 및 일부 값은 기록하지 않음 |
| 최종 상태 | `PARTIAL_CONTAINMENT_COMPLETE_REMEDIATION_OPEN` |

이 문서는 사용자 제출 화면, 사용자 확인 결과, 공급자 관리 화면에서 직접 관찰한 비밀값 없는 메타데이터를 종합한 제출본이다. 공급자 화면 확인과 실제 API 인증 거부 테스트는 서로 다른 증거 수준으로 구분한다.

---

## 2. 요약 판정

1. 9개 Workflow와 52개 범용 HTTP Request 노드에 대한 직접 Credential 참조 조사는 보고된 범위 안에서 완료되었다.
2. 조사 대상 n8n Credential `Supabase API`(`91xITuCWyxPdzxSt`)의 직접 참조는 52개 대상 노드에서 발견되지 않았다.
3. 이 결과는 해당 Credential의 전체 소비처 부재나 안전한 삭제를 증명하지 않는다. 전체 A-IR 소비처 인벤토리는 아직 완료되지 않았다.
4. FAL 노출 키 1개는 사용자 확인에 따라 공급자 측 폐기 완료로 기록한다. 대체 키는 만들지 않았다.
5. Google Cloud의 `CoverSongCompetition` YouTube Data API 키 1개는 사용자 확인에 따라 삭제 상태로 기록한다. 대체 키는 만들지 않았고 YouTube OAuth Credential은 변경하지 않았다.
6. Creatomate의 기존 `Youtube Shorts` 연결 프로젝트와 기존 키는 더 이상 기존 프로젝트 경계에서 접근되지 않았다. 다만 재로그인 과정에서 새 `Default Project`와 새 API 키가 자동 생성된 것이 관찰되었다.
7. Creatomate 계정 및 관련 데이터 전체 삭제 요청 메일을 `support@creatomate.com`에 발송했다. 공급자의 최종 처리 회신을 기다리며 추가 로그인·키 회전·프로젝트 조작은 중단했다.
8. n8n Workflow 수정·저장·실행·활성화, Supabase 원격 변경, P0 SQL 실행, 거래·렌더·업로드·댓글 테스트는 수행하지 않았다.

### 현재 상태표

| 대상 | 상태 | 증거 수준 |
|---|---|---|
| n8n 9개 Workflow·52개 HTTP 노드 조사 | `COMPLETE_WITHIN_REPORTED_SCOPE` | 사용자 제출 UI 조사 보고 및 화면 |
| `Supabase API` Credential 직접 참조 | `0 FOUND IN REVIEWED SCOPE` | 사용자 제출 UI 조사 보고 |
| `Supabase API` Credential 삭제 가능 여부 | `NOT ESTABLISHED` | 전체 소비처 인벤토리 미완료 |
| FAL 노출 키 1개 | `PROVIDER_REVOCATION_CONFIRMED_BY_USER_REPORT` | 사용자 공급자 화면 확인 |
| Google YouTube Data API 키 1개 | `PROVIDER_DELETION_CONFIRMED_BY_USER_REPORT` | 사용자 공급자 화면 확인 |
| Creatomate 기존 프로젝트·키 | `LEGACY_PROJECT/KEY NO LONGER ACCESSIBLE` | 공급자 UI 새로고침 및 프로젝트 ID 변경 관찰 |
| Creatomate 새 Default Project·키 | `PRESENT_PENDING_ACCOUNT_DELETION` | 공급자 UI 직접 관찰 |
| Creatomate 계정 삭제 | `REQUESTED_PROVIDER_RESPONSE_PENDING` | Gmail 발송 완료 확인 |
| Supabase P0 containment SQL | `NOT_EXECUTED` | 로컬 파일 존재만 확인 |
| 전체 사고 대응 | `OPEN` | 잔여 위험 및 후속 결정 존재 |

---

## 3. 조사 식별자 정정

초기 제출 기록에서 Edge Function Secrets 조사와 n8n Credential 참조 조사에 같은 식별자가 사용된 문제가 있었다. 원본 기록은 보존하고 n8n 조사는 다음 식별자로 분리한다.

```text
Reported investigation ID:
A-IR-1-EF-SECRETS-001

Correct investigation ID:
A-IR-1-N8N-CREDENTIAL-USAGE-001

Correction reason:
Edge Function Secrets 조사와 n8n Credential 참조 조사의 식별자 중복
```

---

## 4. 조사된 Workflow 목록

당시 n8n 목록 화면에는 총 9개 Workflow가 표시되었으며 모두 `Inactive` 상태였다.

| 번호 | Workflow | 조사 상태 | 실행·변경 |
|---:|---|---|---|
| 1 | Workflow V8-3 Fixed: Auto Cancel Orders (Corrected) | 범위 내 검토 완료 | 없음 |
| 2 | Workflow V8-2: Buy Order Creation (Corrected) | 범위 내 검토 완료 | 없음 |
| 3 | Workflow V8-4: Batch Optimized (Stable) | 범위 내 검토 완료 | 없음 |
| 4 | 시장 현재가 업데이트 v3 (모의투자용) | 범위 내 검토 완료 | 없음 |
| 5 | auto-trading-with-capital-validation-v44 | 범위 내 검토 완료 | 없음 |
| 6 | Youtube Shorts Auto Upload | 범위 내 검토 완료 | 없음 |
| 7 | Youtube Shorts | 범위 내 검토 완료 | 없음 |
| 8 | Cover_Arena | 범위 내 검토 완료 | 없음 |
| 9 | MPT Answers Email Alert | 범위 내 검토 완료 | 없음 |

따라서 위 9개 목록을 기준으로 한 미검토 Workflow는 `0`이다. 다만 이 판정은 9개 목록과 52개 범용 HTTP Request 노드에 한정되며, 다른 프로젝트·Credential 종류·비범용 전용 노드·외부 소비처까지 조사됐다는 뜻은 아니다.

---

## 5. n8n Credential 직접 참조 조사 결과

### 5.1 대상 Credential

```text
Credential display name: Supabase API
Credential management ID: 91xITuCWyxPdzxSt
Reviewed scope: 9 workflows / 52 generic HTTP Request nodes
Direct references found: 0
Result: COMPLETE_NO_REFERENCE_FOUND_IN_SCOPE
Credential safe to delete: NOT ESTABLISHED
Overall A-IR consumer inventory: INCOMPLETE
```

### 5.2 조사 중 발견된 Credential 사용 위치

| 발견사항 | 확인된 위치 수 | 해석 |
|---|---:|---|
| FAL Authorization 키 사용 위치 | 11개 노드 | 사용 위치 수이며 서로 다른 키 11개를 의미하지 않음 |
| `SUPABASE_SERVICE_ROLE_KEY` 이름 참조 | 12개 위치 | 이름 참조 위치 수이며 서로 다른 관리자 키 12개를 의미하지 않음 |
| `Env Config` 참조 | 복수 | 실제 공급원이 OS 환경변수, 노드 평문, Secret Store 중 무엇인지는 미확인 |
| Kiwoom App Key/Secret 참조 | 확인됨 | 앱 자격증명 참조이며 런타임 Access Token과 구분 필요 |
| 런타임 Bearer Access Token | 확인됨 | 토큰 발급 결과 사용이며 정적 원본 Secret과 구분 필요 |
| Creatomate Bearer 토큰 | 1개 연결에서 확인 | 공급자 측 별도 봉쇄 조사 대상으로 분리 |
| Google YouTube Data API 키 | 1개 대상 키로 식별 | YouTube OAuth Credential과 별개 |

`service_role` 또는 secret key는 서버용 고권한 Credential이며 RLS를 우회할 수 있다. 그러나 n8n 서버에서 참조한다는 사실만으로 외부 유출이 확정되는 것은 아니다. 저장 방식, 접근 범위, 로그·화면 노출, 실제 값의 키 종류를 별도로 확인해야 한다.

---

## 6. 화면으로 확인한 주요 노드 설정

아래는 제출된 UI 화면에서 직접 확인된 설정이다. 실제 키·토큰 값은 의도적으로 제외했다.

### 6.1 자동매매·시세 관련

| 노드 | 동작 | 확인된 설정 | 주요 보안·기능 관찰 |
|---|---|---|---|
| 키움 토큰 발급 | `POST` OAuth 토큰 발급 | Kiwoom mock API, JSON body에서 `Env Config`의 App Key/Secret 참조 | 원천 Secret 공급 방식 미확인. 실행하지 않음 |
| 자동매매 전략 조회 | `POST` Supabase RPC | `get_active_strategies_with_universe`, `apikey`와 `Authorization`에 `SUPABASE_SERVICE_ROLE_KEY` 참조 | 관리자급 키 사용 위치. 최소 권한 구조 검토 필요 |
| 키움 초기 조회 (3초 간격) | `POST` 시장조건/종목 조회 | 런타임 Bearer 토큰, continuation headers, API ID, 1건/3초 batching | 주문 호출 아님. 실행하지 않음 |
| 종목명 조회 | `GET` Supabase REST | `stock_metadata`, 종목코드 필터, service-role 계열 header 참조 | 읽기에도 고권한 키 사용 후보 |
| 전일종가 조회 | `GET` Supabase REST | `kw_price_daily`, 최신 거래일 1건 조회, service-role 계열 header 참조 | 최소 권한 조회 구조 검토 필요 |
| 종목 마스터 저장 | `POST` Supabase REST upsert | `kw_stock_master`, `on_conflict=stock_code`, merge-duplicates, representation 반환 | `Never Error` 활성화로 실패 은폐 가능 |
| 현재가 저장 | `POST` Supabase REST upsert | `kw_price_current`, `on_conflict=stock_code`, merge-duplicates | `Never Error` 활성화로 실패 은폐 가능 |

### 6.2 `Youtube Shorts Auto Upload`

확인된 흐름:

```text
Schedule Trigger
→ Get row(s) in sheet
→ HTTP Request-다운로드
→ HTTP Request-업로드 준비
→ Code-병합
→ HTTP Request-영상 업로드
→ Code-구글 시트 업데이트 데이터 구성
→ Update row in sheet
```

| 노드 | 확인된 설정 | 관찰 |
|---|---|---|
| HTTP Request-다운로드 | 입력 `URL`을 `GET`, 응답 형식 File, binary field `data` | 외부 URL 파일 다운로드. SSRF·신뢰 URL 검증 여부는 미확인 |
| HTTP Request-업로드 준비 | YouTube resumable upload 초기화 `POST`, YouTube OAuth2 Credential | 영상 업로드 권한은 API 키가 아닌 OAuth 영역 |
| HTTP Request-영상 업로드 | 업로드 URL로 `PUT`, `video/mp4`, binary body 사용 | 화면의 `undefined` 표시는 입력 미실행 상태에서 식 평가가 안 된 것으로 보이며 런타임 결함으로 확정하지 않음 |

### 6.3 `Youtube Shorts`

Canvas에서 Narration, Image Creation, Video Creation, Merge & Update, YouTube Upload 그룹과 별도 하단 체인이 확인되었다.

| 영역 | 확인된 외부 서비스·노드 | 보안 관찰 |
|---|---|---|
| Narration | FAL ElevenLabs TTS 요청, 대기, 상태조회 | Authorization 값이 노드 header에 직접 설정된 사용 위치 확인 |
| Image Creation | OpenAI prompt 생성, FAL Recraft 이미지 요청·상태조회·결과 가져오기 | FAL Authorization 직접 설정. 생성 테스트 미실행 |
| Video Creation | FAL Kling image-to-video 요청·상태조회·결과 가져오기 | FAL Authorization 직접 설정. 생성 테스트 미실행 |
| Sound Creation | OpenAI sound prompt, FAL sound-effects 요청·상태조회·결과 가져오기 | FAL Authorization 직접 설정. 생성 테스트 미실행 |
| Merge & Update | Merge, Aggregate, URL 결합, Creatomate Final Video Composer, Sheet 업데이트 | Creatomate Bearer 토큰이 노드에 직접 설정된 연결 확인 |
| YouTube Upload | Sheet 조회, 다운로드, resumable upload 준비, binary upload, Sheet 업데이트 | YouTube OAuth2 Credential 사용. 변경하지 않음 |
| 하단 별도 체인 | Sheet 조회, HTTP 다운로드, YouTube 업로드, 첫 댓글 HTTP 요청 | 첫 댓글 노드에 빈 JSON body와 `Content-Type`의 Query Parameter 배치가 보여 설정 결함 후보로 등록 |

Creatomate 연결의 비밀값 없는 식별 근거는 다음과 같다.

```text
Workflow: Youtube Shorts
Workflow ID: QCe9RR3qhHLrVDLb
Node: HTTP Request - Final Video Composer
Endpoint: POST api.creatomate.com/v1/renders
Template ID: b9b23802-cf0b-4ac6-a3ff-c60356f6a735
```

### 6.4 `MPT Answers Email Alert`

확인된 흐름:

```text
Webhook
→ HTTP Request
→ Code
→ Send Email
→ Code1
→ Respond to Webhook
```

HTTP Request 노드는 Webhook payload의 record ID를 사용해 Supabase REST의 `mpt_answers` 레코드를 조회하도록 설정되어 있었다. 선택 필드에는 `id`, `user_id`, `set_id`, `answer_content`, `submission_time`, `remaining_time`, `evaluation_status`, `score`가 포함되었다.

`apikey` 및 Bearer Authorization 값이 노드 설정에 직접 입력되어 있었으므로 정적 Credential 노출 후보로 등록했다. 화면만으로 해당 값이 `anon`·publishable인지 `service_role`·secret인지 최종 분류하지 않았고, 값을 보고서에 기록하지 않았다.

---

## 7. 공급자 측 봉쇄 수행 내역

### 7.1 FAL

| 항목 | 결과 |
|---|---|
| Task | `A-IR-P0-MEDIA-KEYS-001` |
| 대상 | 노출이 보고된 FAL API 키 1개 |
| 대상 키 식별 | 완료 — 사용자 공급자 화면 확인 기준 |
| 공급자 측 폐기 | `CONFIRMED_BY_USER_REPORT` |
| 대체 키 | `NOT_CREATED` |
| 소비처 전환 | `NOT_PERFORMED` |
| 런타임 인증 거부 테스트 | `NOT_PERFORMED` |
| n8n 변경·실행 | 없음 |

해당 연결은 사용하지 않기로 결정했으므로 신규 키를 발급하지 않았다.

### 7.2 Google Cloud / YouTube Data API

| 항목 | 결과 |
|---|---|
| Task | `A-IR-P0-MEDIA-KEYS-001` |
| 대상 | `CoverSongCompetition` 프로젝트에서 식별된 YouTube Data API 키 1개 |
| 공급자 측 삭제 | `CONFIRMED_BY_USER_REPORT` |
| 대체 키 | `NOT_CREATED` |
| YouTube OAuth2 Credential | 변경 없음 |
| 소비처 전환 | `NOT_PERFORMED` |
| 런타임 인증 거부 테스트 | `NOT_PERFORMED` |
| n8n 변경·실행 | 없음 |

삭제된 과거 키는 복원하지 않는 것을 운영 규칙으로 유지한다. Google 공급자 정책상 삭제 직후 일정 기간 복원 가능성이 있을 수 있으므로, 보고서에서는 영구 소거가 아니라 공급자 관리 화면의 삭제 상태로 한정한다.

### 7.3 Creatomate

#### 7.3.1 대상 식별

| 항목 | 확인 결과 |
|---|---|
| Task | `A-IR-P0-CREATOMATE-001` |
| 대상 Workflow | `Youtube Shorts` |
| 대상 노드 | `HTTP Request - Final Video Composer` |
| 기존 프로젝트 | `1st Project` |
| 기존 프로젝트 ID | `fb8f386f-7a38-4ff9-ab19-e025df42d153` |
| 연결 근거 | n8n endpoint, 템플릿 ID, 공급자 프로젝트 메타데이터 |
| API 구조 | 프로젝트별 고유 API 키 |
| Webhook | 프로젝트 기본 Webhook이 설정되지 않은 상태로 관찰됨 |
| 사용량 | 표시된 화면에서 최근 사용 없음으로 관찰됨 |

#### 7.3.2 수행 과정

1. Creatomate 계정과 `1st Project`의 관계를 읽기 전용으로 확인했다.
2. 프로젝트 API 설정에서 API 키 관리 방식이 `Rotate` 중심임을 확인했다. 회전은 새 키를 생성하므로 사용하지 않았다.
3. 사용자가 모든 Creatomate 프로젝트·키·계정 삭제를 명시적으로 허용했다.
4. 유일한 마지막 프로젝트 삭제를 시도했으나 공급자 UI가 “최소 1개 프로젝트 유지” 제약으로 차단했다.
5. 계정 설정 화면에서 직접적인 계정 삭제 제어를 찾지 못했다.
6. 계정 소유 이메일에서 `support@creatomate.com`으로 영구 삭제 요청 메일을 발송했다.
7. 발송 시각은 2026-09-05 22:08 KST이며 Gmail에서 발송 완료를 확인했다.
8. 요청 범위에는 계정, 프로젝트, 템플릿, feeds, renders, logs, assets, API keys/tokens, webhooks, MCP, team, billing 관련 데이터의 삭제·무효화가 포함되며 법적 보존 의무가 있는 최소 기록은 예외로 했다.
9. 대체 키나 대체 계정은 요청하지 않았다.

#### 7.3.3 후속 확인

1. 기존 프로젝트 URL을 새로고침했을 때 Creatomate 로그인 화면으로 전환되어 기존 세션과 기존 프로젝트 접근이 무효화된 상태를 확인했다.
2. 로그인 화면은 계정이 없으면 새 계정을 만들 수 있다고 안내했다.
3. 이후 동일 로그인으로 접근했을 때 기존 `1st Project`가 아니라 새 `Default Project`가 생성되어 있었다.
4. 새 프로젝트 ID는 `5463aa5a-8a9b-45d8-96c0-0baafbc4f005`이며, 새 프로젝트에 새 API 키가 자동 발급된 것이 확인됐다.
5. 따라서 “기존 노출 키 폐기”는 UI·프로젝트 경계에서 확인되지만, “현재 API 키가 하나도 없음”은 사실이 아니다.
6. 사용자는 이미 계정 삭제 요청 메일을 발송했으므로 공급자 처리를 기다리고 추가 작업을 하지 않기로 최종 결정했다.

#### 7.3.4 현재 판정

```text
Legacy project/key:
NO LONGER ACCESSIBLE AT PREVIOUS PROJECT BOUNDARY

Runtime rejection test:
NOT PERFORMED

Newly recreated default project/key:
PRESENT

Account deletion request:
SENT

Provider deletion confirmation:
PENDING

Additional login/rotation/deletion:
DO NOT PERFORM

Replacement credential:
NOT REQUESTED FOR RETIRED WORKFLOW
```

Creatomate의 서버측 영구 삭제 완료는 지원팀 회신 또는 공급자 측 별도 확인 전까지 확정하지 않는다. 재로그인은 새 계정과 키를 다시 생성할 수 있으므로 수행하지 않는다.

---

## 8. 수행하지 않은 작업

다음 작업은 조사 및 봉쇄 범위 밖이거나 사용자가 금지·보류했으므로 수행하지 않았다.

- n8n Credential 생성, 편집, 삭제
- n8n Workflow 수정, 저장, 실행, 활성화
- n8n 원본 Workflow JSON export
- 폐기된 키 문자열의 n8n 노드 내 제거
- 이미지, 영상, 음성 생성 요청
- YouTube 영상 업로드, 수정, 삭제, 댓글 작성 테스트
- Kiwoom 주문, 취소, 계좌 또는 거래 관련 호출
- OAuth client, refresh token, YouTube OAuth Credential 변경
- Creatomate 렌더 생성 또는 기존 렌더 재실행
- Creatomate 신규 키의 의도적 발급 또는 회전
- Supabase 키 폐기 또는 일괄 비활성화
- Supabase Edge Function 변경 또는 호출
- Supabase DB 원격 조회·변경
- P0 SQL 실행 또는 Migration 적용
- Gateway, Recovery, Exact Import 작업
- 감사 로그, 실행 기록, 공급자 사용량 기록 삭제
- 비밀값을 문서, 채팅, 코드, Git에 기록

---

## 9. Supabase P0 보안 작업 상태

로컬 파일 `supabase/legacy_sql_editor_migrations/20260904_p0_security_containment_prebaseline.sql`에는 다음 containment 조치 초안이 존재한다.

- `agent_access_tokens` RLS 활성화 및 `PUBLIC`·`anon`·`authenticated` 권한 회수
- `novel_documents`의 브라우저 역할을 읽기 전용으로 제한
- `paragraph_version_lineage`의 공개 쓰기 권한 차단
- `paragraph_versions`, `revision_content_map`의 공개 mutation 권한 차단
- 공개 호출 가능한 `SECURITY DEFINER` mutation RPC 네 개의 `PUBLIC`·`anon`·`authenticated` 실행 권한 회수
- Gateway Cutover 전까지 `service_role` 임시 권한 유지

이 SQL은 이번 작업에서 실행·수정·검증하지 않았다. 파일명에 `prebaseline`이 포함된 검토 전 초안이며, 실제 적용 전에는 대상 객체·정책·함수 시그니처, 기존 의존 소비처, 트랜잭션 영향, rollback 절차를 별도로 검토해야 한다.

```text
Supabase P0 SQL state: NOT_EXECUTED
Remote database changes: NONE
Migration history changes: NONE
Verification query: NOT_PERFORMED
```

---

## 10. 남은 위험과 미해결 항목

| 우선순위 | 항목 | 현재 위험 | 필요한 다음 결정 |
|---:|---|---|---|
| P0 | Creatomate 새 계정·프로젝트·키 | 계정 삭제 요청 처리 전까지 새 Credential이 존재 | 공급자 회신 대기. 추가 로그인 금지 |
| P0 | n8n에 남은 과거 Secret 문자열 | 공급자에서 폐기됐어도 저장된 값과 노출 흔적이 남음 | 별도 승인 후 비활성 Workflow에서 Secret 제거 |
| P0 | Supabase 관리자급 키 참조 12곳 | 실제 값·프로젝트·공급 경로·권한 범위가 미확인 | 읽기 전용 공급 경로 조사 |
| P0 | Supabase 공개 접근통제 | prebaseline SQL은 있으나 미실행 | SQL 리뷰·검증·적용 여부 결정 |
| P1 | `Never Error` 사용 | API·DB 실패가 정상 흐름처럼 통과할 가능성 | 오류 처리 설계 검토 |
| P1 | 잘못된 또는 빈 요청 구성 | YouTube 첫 댓글 노드 등 기능 결함 후보 | 실행 없는 정적 수정 검토 또는 격리 테스트 승인 |
| P1 | 동적 다운로드 URL | 입력 URL 신뢰 경계와 SSRF 방어 미확인 | allowlist·URL 검증 설계 검토 |
| P1 | 전체 Credential 소비처 | 52개 HTTP 노드 밖의 소비처가 미확인 | Credential·환경변수·전용 노드·코드·외부 서비스 인벤토리 확장 |

`Supabase API` Credential의 직접 참조가 0이라는 결과는 유지하되, 이를 삭제 승인으로 해석하지 않는다.

---

## 11. 증적과 한계

### 증적 유형

- n8n Workflow 목록 및 노드 설정 화면
- 사용자 제출 조사 보고서
- FAL·Google 공급자 조치에 대한 사용자 확인
- Creatomate 프로젝트·API 설정·계정 설정의 직접 UI 관찰
- Creatomate 삭제 요청 Gmail 발송 완료 화면
- 기존 Creatomate 프로젝트 URL 새로고침 및 재로그인 후 프로젝트 ID 변경 관찰
- 로컬 Supabase P0 prebaseline SQL 파일의 존재와 내용

### 확인 한계

- 폐기된 키로 실제 API 호출을 보내 인증 거부를 확인하지 않았다.
- FAL·Google의 공급자 감사 로그를 별도로 보존하거나 조회하지 않았다.
- Creatomate 지원팀의 계정 삭제 완료 회신은 아직 확인되지 않았다.
- n8n DB나 export 파일을 직접 분석하지 않았으며 제출된 UI 조사 범위에 의존한다.
- Supabase 원격 DB·Dashboard·Edge Function 상태를 이번 보고서 작성 단계에서 확인하지 않았다.
- 제3자가 Secret을 획득했는지 또는 실제 악용했는지는 확인되지 않았다.

---

## 12. 변경 기록

| 대상 | 변경 내용 |
|---|---|
| FAL | 대상 노출 키 1개 공급자 측 폐기 — 사용자 확인 기준 |
| Google Cloud | 대상 YouTube Data API 키 1개 삭제 — 사용자 확인 기준 |
| Creatomate | 계정 및 데이터 영구 삭제 요청 이메일 발송 |
| n8n | 변경 없음 |
| Supabase | 변경 없음 |
| 로컬 프로젝트 | 이 제출보고서 파일만 추가 |

---

## 13. 인계 지시사항

현재 단계에서는 다음 작업을 자동으로 진행하지 않는다.

```text
1. Creatomate 계정 삭제 요청의 공급자 회신을 기다린다.
2. 확인을 위해 Creatomate에 다시 로그인하지 않는다.
3. 공급자 회신이 도착하면 비밀값 없이 처리 완료 여부와 시각만 기록한다.
4. FAL·Google 키 재발급 또는 과거 키 복원은 하지 않는다.
5. n8n, Supabase, SQL, Gateway 작업은 별도 명시적 지시 전까지 수행하지 않는다.
6. 다음 담당자는 본 보고서의 증거 수준을 유지하고 UI 확인과 런타임 검증을 혼동하지 않는다.
```

### 다음 지시 대기 상태

```text
Creatomate provider processing: PENDING
Additional Creatomate action: PAUSED BY USER DECISION
n8n remediation: NOT AUTHORIZED
Supabase credential investigation: OPEN, NOT STARTED IN THIS PHASE
P0 SQL review/execution: OPEN, NOT AUTHORIZED
Overall incident response: OPEN
```

---

## 14. 최종 확인문

보고된 범위의 n8n 직접 참조 조사는 완료되었다. FAL과 Google의 대상 노출 키는 사용자 공급자 화면 확인을 기준으로 봉쇄됐고 대체 키는 생성하지 않았다. Creatomate의 기존 프로젝트·키는 기존 경계에서 접근되지 않지만 재로그인으로 새 프로젝트·키가 생성됐으며, 계정 전체 삭제 요청은 공급자 지원팀 처리 대기 상태다. 모든 Workflow와 원격 Supabase 자산은 이번 작업에서 변경하거나 실행하지 않았다.

따라서 현재의 적절한 종료점은 **추가 조작 없이 Creatomate 지원팀 회신을 대기하고, 별도 승인 전까지 n8n·Supabase 후속 조치를 보류하는 것**이다.
