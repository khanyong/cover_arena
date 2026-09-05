# PRO-CH1-SC1-RESTART-D1 반영 결과

## 1. 최종 판정

승인된 Scene 전체를 문안 교정 없이 작업본과 원격 DB의 기존 Reader 데이터에 반영했다. 커밋 후 별도 조회한 양쪽 원문을 승인 파일과 바이트 단위로 대조하여 일치를 확인했다.

| 단계 | 결과 |
|---|---|
| 문안 | 사용자 승인본 `PRO-CH1-SC1-RESTART-D1`만 사용 |
| 작업본 저장 | 완료 — `B1_v1.1_STRUCT_DRAFT` |
| 원격 DB 반영 | 완료 — 해당 Scene의 버전·매핑 및 기존 Reader 데이터 |
| 기존 사이트 표시 | 확인 완료 — 로그인된 Chrome의 localhost 전체 정독 화면 |
| 외부 도메인·비로그인 독자 공개 | 이번 작업에서 별도 검증하지 않음 |
| 배포·접근 권한 변경 | 수행하지 않음 |

실제 적용 트랜잭션 기록 시각은 **2026-09-06 00:02:24.883896 KST**이다. 이는 DB의 트랜잭션 시작 시각이며 정확한 커밋 완료 시각과 구분한다.

## 2. 반영 대상과 경계

| 항목 | 값 |
|---|---|
| 작품 | The Resonance of Space: Architects of Spacetime — English |
| 구간 | PROLOGUE: THE NODE / Chapter 1 |
| Chapter 제목 | The Cathedral in the Molasse |
| Scene 제목 | The Architecture of Consensus |
| 적용 범위 | 승인본 첫 문장부터 마지막 `"Mark."`까지 |
| Supabase 프로젝트 | `khanyong_projects` / `iklsghevdtqqkjuaympc` |
| 관계형 Scene ID | `55b46292-0335-5fbc-ab9e-baa44d3bea70` |
| 관계형 경로 | `act-2/ch-2/sc-1` |
| 작업 Snapshot ID | `66cda81f-6a3a-4c8b-a226-c7169ffd2710` |
| Reader document ID | `quantum-vibration-novel-en-act-2` |
| Reader Scene ID | `b48a4f04` |
| Reader JSON 경로 | `{chapters,1,scenes,0}` |

관계형 ID와 Reader ID는 서로 다른 저장 계층의 식별자다. 제목·계층·기존 원문을 대조하여 동일 Scene임을 확인했다. 기존 Reader의 문자형 문단 구분자를 실제 줄바꿈으로 해석한 결과는 기존 관계형 작업본 87개 블록과 일치했다. 이 비교는 기존 원문 식별을 위한 것으로, 새 승인문을 재작성하거나 과거 Block 문안을 섞는 데 사용하지 않았다.

에피그래프, Chapter/Scene 제목, Chapter 2 및 다른 Scene은 변경하지 않았다.

## 3. 승인 원문 동일성

검증 기준은 사용자 제공 APPROVED 파일이다. 별도 편집 설명은 본문에 저장하지 않았다.

| 검사 | 결과 |
|---|---|
| UTF-8 / BOM 없음 / LF | 일치 |
| 파일 끝 LF 1개 | 일치 |
| 콘텐츠 블록 사이 빈 줄 1개 | 일치 |
| 산문·대화·상태 표시 문단 | 75개 |
| 독립 수식 | 4개 |
| 전체 콘텐츠 블록 | 79개 |
| 단어 수 — 공백 구분, `$$` 제외 | 1,089 |
| 재구성 원문 크기 | 7,955 bytes |
| 작업본 재조회 원문 | 승인 파일과 바이트 단위 일치 |
| Reader 재조회 원문 | 승인 파일과 바이트 단위 일치 |
| 문자형 문단 구분자 `\n\n` | 승인본 및 재구성 원문에 없음 |

세 파일의 SHA-256은 모두 다음 값이다.

```text
6d237aef954677bb7a942ee87f64c45f143f8fe0e58f8f1da86c88e641baa47a
```

검증 파일:

- [승인 파일 사본](approved.md)
- [작업본 DB 재조회 원문](db-working-readback.md)
- [Reader DB 재조회 원문](db-reader-readback.md)

재구성 방법은 저장된 블록을 순서대로 읽어 `LF LF`로 연결하고 끝에 LF 1개를 붙이는 것이다. 비교 전에 철자·공백·문장부호·LaTeX를 정규화하지 않았다. 승인본 원파일과 사본, 전달서 원파일과 사본도 일치한다.

## 4. 버전관리 및 기존본 보존

| 항목 | 처리 결과 |
|---|---|
| 변경 없는 기존 paragraph version 재사용 | 47개 |
| 새 paragraph version 생성 | 32개 |
| 새 lineage 관계 | 38개 |
| 신규 content unit | 없음 |
| 적용 전 Scene 매핑 | 87개 |
| 적용 후 포함 매핑 | 79개 |
| 적용 후 제외 매핑 | 8개 — 기존 행·버전 보존 |
| 기존 paragraph version·lineage | 변경 없음 |
| 기존 잠긴 기준본·보관 Snapshot | 변경 없음 |

제외한 8개 매핑은 삭제하지 않았다. 새 승인본의 포함 여부를 기록하고, 정렬 충돌을 피하기 위해 제외 위치만 `100000 + 기존 위치`로 옮겼다. 승인본 내부 문단 경계는 바꾸지 않았다. 각 새 버전의 이전 버전 참조와 필요한 병합 계보를 기록했다.

반영 전 작업본 전체의 매핑 **45,647개**를 별도 잠긴 체크포인트에 복사했다.

```text
Checkpoint code: PRE_PRO_CH1_SC1_RESTART_D1
Checkpoint ID: 0008ec22-fcf1-4d13-8fd4-3091104dc73f
State: locked
Kind: audit
Canonical/current-release/primary-working flags: false
```

이 체크포인트는 **revision_content_map 보존본**이다. 별도 scene_matrices 복제본이나 전체 시스템 백업이라고 주장하지 않는다. 기존 scene_matrices는 변경하지 않았다.

기존 Reader Scene 전체 JSON은 해당 Scene의 `publicationHistory[0].scene`에 보존했다. 기존본과 동일함을 커밋 후 재조회로 확인했다. 새 Reader의 79개 블록에는 승인 버전명과 실제 관계형 version ID를 연결했다.

작업 Snapshot의 단어 수 합계와 manifest_hash는 갱신된 매핑으로 다시 계산했다. manifest_hash는 parent·position·unit 순서로 정렬한 `unit_id:body_hash:position` 연결 문자열의 SHA-256이다. 기존 Snapshot의 값은 체크포인트에 보존했으며, 작품 전체의 canonical/release 지정은 변경하지 않았다.

## 5. 트랜잭션과 범위 검증

Supabase 및 PostgreSQL 스킬의 안전한 변경 절차에 따라, 원문 사전조건 검사·제한된 잠금·원자적 트랜잭션·재조회 검증을 사용했다.

1. 첫 ROLLBACK 시험은 마지막 보존 검사에서 30초 제한에 도달했다.
2. 후속 읽기에서 체크포인트 0개, 새 버전 0개, 기존 Reader 해시 유지로 미반영을 확인했다.
3. 해당 트랜잭션의 시간 제한만 50초로 조정하여 동일 시험을 다시 수행했다. 모든 검사가 성공한 뒤 ROLLBACK했다.
4. 동일 적용 SQL을 COMMIT으로 실행했다.
5. 커밋과 별개인 후속 SELECT로 원문·백업·버전 수·범위 밖 데이터 보존을 검증했다.

검증 결과:

```text
workingEqualsApproved: true
readerEqualsApproved: true
backupEqualsOld: true
historyEqualsOld: true
backupState: locked
backupMapCount: 45647
otherDocumentsUnchanged: true
outsideWorkingMapUnchanged: true
newVersions: 32
lineageEdges: 38
locked_baselines_preserved: true
existing_versions_preserved: true
outside_scene_changes: 0
```

여기서 outside_scene_changes는 기존 다른 Scene 본문·매핑·Reader 내용 변경이 없다는 의미다. 위에 명시한 체크포인트 추가와 작업 Snapshot 집계 메타데이터 갱신은 수행했다.

신규 키, 권한 변경, RLS 변경, 일반 Migration, P0 SQL, n8n 또는 Creatomate 작업은 수행하지 않았다. 이번 반영을 위해 애플리케이션 코드를 새로 수정하거나 배포하지 않았다. 기존 로컬 변경사항과 보안 제출보고서는 그대로 두었다.

## 6. 화면 확인과 한계

확인 화면: `http://localhost:3000/novel/quantum-vibration-novel/en`의 기존 로그인 세션, 전체 정독 화면.

새로고침 후 접근성 트리와 실제 화면을 확인했다.

- 승인본 첫 문단과 마지막 `"Mark."` 표시 확인.
- 79개 블록이 개별 단위로 표시되며 문단 간 간격 유지.
- 문자형 `\n\n`이 본문에 노출되던 문제 없음.
- 첫 번째 수식 및 중간의 나머지 세 수식 렌더링 확인.
- 마지막 문단 이후 Chapter 2와 다음 Scene 경계 확인.
- 제목과 에피그래프는 기존 값 유지.

화면 확인은 DB 원문 동일성 검증을 대신하지 않는다. 위 3절의 바이트 대조를 별도로 수행했다. 화면 캡처는 도구 응답으로 관찰했으며, 이 폴더에 별도 이미지 증적 파일을 저장하지는 않았다.

**남은 표시 차이:** Chapter 카운터는 `$$` 구분자 8개도 단어로 세어 **1,097단어**라고 표시한다. 승인 기준은 이를 제외한 **1,089단어**다. 실제 원문이 8단어 늘어난 것이 아니며, 카운터에 맞추려고 원문을 변경하지 않았다. 공통 단어 수 계산 코드 변경은 이번에 수행하지 않았다.

**공개 게재 한계:** 원격 DB의 기존 Reader 데이터 갱신과 localhost 로그인 화면 표시까지 확인했다. 외부 운영 도메인의 캐시·배포 상태 및 비로그인 독자 접근 여부는 별도 확인하지 않았다. 인증·공개 범위를 넓히거나 전체 프로젝트 배포를 수행하지 않았다.

## 7. 증적과 다음 인계

- [사용자 전달서 사본](site-handoff.md)
- [반영 전 원문·매핑·적용 계획](preflight.json)
- [실행한 트랜잭션 SQL — 재실행 금지](apply.sql)
- [커밋 결과와 독립 DB 재조회 증적](db-readback.json)

`apply.sql`은 이미 성공한 실행의 증적이다. 재실행하지 않는다. 체크포인트 존재 시 중단하도록 되어 있다. 되돌리기가 필요하면 기존본 보존 자료를 기준으로 별도 승인된 복원 절차를 수립해야 하며, 이 보고서가 자동 복원을 승인하지는 않는다.

현행 Scene 본문은 `PRO-CH1-SC1-RESTART-D1`이다. 이전 Block별 수정안은 추가 적용하지 않았다. 다음 Scene의 편집은 이 기술 작업과 독립적으로 계속할 수 있다.
