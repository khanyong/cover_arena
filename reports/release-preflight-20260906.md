# GitHub 브랜치 푸시 사전 검증 보고서

## 범위와 승인

- 기준일: 2026-09-06 KST.
- 대상 저장소: `khanyong/cover_arena` (public).
- 대상 브랜치: `chore/supabase-migration-baseline` → 동일한 `origin` 브랜치.
- 사용자는 전체 코드와 `exports/` 원고, `reports/` DB·보안 증적의 커밋·푸시를 승인했다.
- 사용자는 새 Matrix 경로 차단 및 저장소 n8n 예제의 하드코딩 키를 환경변수로 전환하는 로컬 안전조치를 승인했다.
- `main` 병합, 운영 배포 승격, 운영 DB/키/n8n 변경, Git 이력 재작성은 이번 범위가 아니다.

이 문서는 커밋 전 검증 결과다. 커밋·푸시 성공과 Vercel 배포 결과는 별도 후속 확인으로 보고한다. 아래 기록을 운영 배포 완료 또는 미실행 SQL의 적용 승인으로 해석하지 않는다.

## 포함하는 변경

1. 소설 전체 정독 화면의 해당 영문 Scene에 한정된 문자형 문단 구분자 표시 보정. 저장 원문을 바꾸지 않으며 단일 이스케이프 및 LaTeX 명령은 보존한다.
2. Mosaic 화면과 텍스트 추출에서 Scene 제목·경계 표시 보완.
3. 관계형 개정 작업공간, 조회·명령 모듈, 기존 감사/시드/적용/검증 스크립트와 관련 문서.
4. 전체 원고 export, 기존 감사 결과, 승인된 Scene 반영 원문·DB 재조회·SQL 실행 증적. 기존 증적은 과거 수행 결과이며 이번에 재실행하지 않았다.
5. 기존 Migration 11개를 `legacy_sql_editor_migrations/`로 이동. Git은 모두 내용 동일한 `R100` 이동으로 확인했다. 새 보관 SQL 및 `pending_gateway/` 초안도 버전 관리하되 실행하지 않는다.
6. `pages/editor/matrix.tsx`에 서버 측 `getServerSideProps` 404 차단 추가. 일반 경로와 Next.js 데이터 경로를 모두 막는다. 쿼리나 환경변수로 열 수 없으며, 별도 인증·쓰기 Gateway 검토와 승인 없이는 차단 코드를 제거하지 않는다. 이 조치는 DB 접근통제 자체를 교체하지 않는다.
7. 기존 n8n 예제 4개의 Supabase 고권한 키 문자열을 `$env.SUPABASE_SERVICE_ROLE_KEY`로 전환. 전체 추적 파일 점검에서 추가 발견한 YouTube 키 사용 위치 5개도 정리했다: 실행 예제 3개는 `$env.YOUTUBE_API_KEY`, 기술 문서와 `env.example`은 자리표시자를 사용한다. 사용 위치 수는 서로 다른 키 수를 뜻하지 않는다.
8. n8n 환경변수가 없거나 접근이 차단되면 요청 전에 중단한다. 실제 n8n 설정을 변경하거나 환경변수 접근 제한을 해제하지 않았다. 접근 통제에 관한 참고: [n8n 공식 보안 환경변수 문서](https://docs.n8n.io/hosting/configuration/environment-variables/security/).
9. `.env.*`, `.vercel/`, 빌드 캐시 및 Supabase CLI 임시 파일을 Git 제외 대상으로 추가했다. 이미 추적되던 `tsconfig.tsbuildinfo`, `supabase/.temp/cli-latest` 두 파일은 추적만 해제했고 로컬 파일은 보존했다.

## 검증 결과

| 검사 | 결과 및 한계 |
|---|---|
| 최종 `npm run build` | 성공, Next.js 16.1.0, TypeScript 및 정적 페이지 39개 생성 완료 |
| 오프라인 안전 검사 | `node --test scripts/tests/prepush-safety.test.mjs` — 10/10 통과 |
| 원고 보존 | 승인 파일·작업본 재조회·Reader 재조회 3개 파일의 SHA-256 유지 |
| 논문 컴파일 | 논문 Markdown 및 `paperData.ts` 변경 없음. 조건부 컴파일 불필요, 실행하지 않음 |
| Cover Arena | 관련 API 라우트 변경 없음. 정적 검토 및 투표 API GET 405 확인. 투표 POST·대회 실행·데이터 갱신 호출 없음 |
| 삼체 데이터 | 노드 36개, 이벤트 7개. 중복 ID·없는 부모·없는 이벤트 끝점·누락 상세정보 없음 |
| 눈물을 마시는 새 | 현재 구현은 독립 좌표 JSON이 아닌 JSX 내 지형 목록. 지형 8개 및 참조 이미지 파일 존재 확인 |
| JSON 구문 | 당시 파일 목록의 JSON 39개 파싱 성공 |
| 로컬 서버 | 별도 127.0.0.1:3001 생산 빌드 서버에서 메인 200, 내부 배너 17개 경로 200 확인 |
| Matrix 차단 | 일반 URL·우회 쿼리·`/_next/data/<buildId>/editor/matrix.json` 모두 404 |
| 브라우저 | 별도 세션으로 데스크톱/390px 모바일 랜딩 표시 및 10개 프로젝트 카드 확인. 페이지 오류 없음. `/api/**` 및 외부 도메인 요청을 차단하여 원격 쓰기 방지 |
| 외부 링크 | BLL Pro 지정 URL 200. KyyQuant 지정 URL은 www 주소로 리다이렉트 후 200. DOM의 URL이 설정과 일치 |
| 키 문자열 검사 | Git index 전체 텍스트 파일을 대상으로 비공개 JWT, Google/provider 키 형식, 개인키 PEM, Credential URL, 로컬 비공개 환경값 일치 검사. 정리 후 탐지 0. 공개 anon 키는 비밀값 판정에서 제외 |

보존한 승인본 SHA-256:

```text
6d237aef954677bb7a942ee87f64c45f143f8fe0e58f8f1da86c88e641baa47a
```

브라우저 CLI가 처음에는 설치되어 있지 않았고 연결된 브라우저 도구도 사용 불가했다. `npx` 임시 CLI와 기존 Chrome 실행 파일로 별도 세션을 사용했으며 프로젝트 의존성·lockfile은 변경하지 않았다. 검증용 브라우저와 3001번 서버는 종료했다. 기존 3000번 개발 서버와 개발 락은 건드리지 않았다. 화면 캡처는 임시 폴더에서 직접 관찰했으며 이 보고서의 첨부 파일로 커밋하지 않는다.

## 남은 경고와 제외 사항

- **과거 Git 이력에는 기존 키가 남는다.** 현재 파일의 문자열 제거는 공급자 폐기·회전이나 이력 정리의 증거가 아니다. 실제 키 종류·유효성·소비처 조사 및 필요한 공급자 조치는 별도 보안 과제로 남는다. 이력 재작성·force push는 하지 않는다.
- 전체 키 검사는 패턴 및 알려진 환경값 기반이다. 모든 비밀 형식·바이너리·과거 이력을 망라하는 보안 감사라고 주장하지 않는다.
- 새 Matrix 경로의 차단은 완료했으나 기존 API·RLS 전체의 안전성이 확정된 것은 아니다. P0 containment와 Gateway SQL은 미실행 상태를 유지한다.
- 로컬 빌드에는 다중 lockfile로 인한 workspace root 추정 경고와 오래된 caniuse-lite 경고가 남아 있다. 빌드는 성공했으며 부모 폴더 lockfile 삭제나 의존성 갱신은 하지 않았다.
- 모바일 랜딩 상단 내비게이션 일부가 잘리는 기존 표시 문제가 관찰됐다. 별도 UI 수정 대상으로 남기며 이번에 임의 수정하지 않았다.
- BLL Pro/KyyQuant 링크 응답은 확인했으나 소개의 완료율·데이터 건수 등 최신 운영 지표는 독립 검증하지 못했다. 값을 추정해 고치지 않았다.
- 기존 원고·Markdown hard break·감사 템플릿·SQL에는 `git diff --check` 공백 경고가 있다. 정확한 원문 및 과거 자료 보존을 위해 일괄 포맷팅하지 않았다.
- 기존 `e2e/revision-matrix-a1.spec.ts`는 실제 DB UPDATE/DELETE를 시도하는 테스트다. 이번에는 실행하지 않았다. 새 오프라인 검사만 실행했다.
- 실제 주문·투표·영상 생성·업로드·댓글·원고 저장·Migration 실행·키 발급·메일 발송은 수행하지 않았다.

## 배포 인계

Vercel CLI에서 `khanyong-portfolio` 프로젝트와 기존 production URL `https://khanyong-portfolio.vercel.app`을 확인했다. 프로젝트 설정은 Next.js, Node 22.x, `npm install --legacy-peer-deps`이다. 로컬 검증 Node는 20.10.0이므로 최종 호스팅 빌드 결과는 별도 확인해야 한다.

이번에는 현재 작업 브랜치만 푸시한다. 해당 커밋의 자동 Preview 상태를 확인하되, `main` 병합이나 production 승격은 사용자 최종 승인 전까지 수행하지 않는다. 승인 원고의 저장·표시와 공개 배포 결과도 혼동하지 않는다.
