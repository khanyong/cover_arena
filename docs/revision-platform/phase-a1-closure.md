# Phase A1 공식 완료 및 종결 보고서 (Closure Record)

**프로젝트:** 『The Resonance of Space』 제1권 2차 수정본 통합 관리 플랫폼  
**문서 상태:** 승인 종결 (Closure Approved)  
**기록 일자:** 2026-09-03  
**대상 스냅샷:** `B1_v1.0_LOCKED` (`1f54a517-1921-5d5d-8a16-048597a41a93`)

---

## 1. 8대 필수 Closure 항목 완료 기록

| # | 항목 | 판정 | 완료 내용 및 검증 결과 |
| :---: | :--- | :---: | :--- |
| **1** | **Prologue Scene 수 확정** | **완료** | • **정식 서사 씬: 5개**<br>• **권두 에피그래프 노드: 1개** (`act-2/ch-1/sc-3`, *"Science is ruthless with obsolete theories..."*)<br>• 레거시 파서가 챕터 시작 전 인용구를 개별 노드로 처리했던 원인을 규명하고 [pilot-a2-prologue-manifest.md](./pilot-a2-prologue-manifest.md)에 정식 5대 씬 확정. |
| **2** | **Scene 식별자 UUID 전환** | **완료** | • 제목이나 텍스트 경로(`source_path`) 대신 불변의 `content_units.id` UUID를 기본 키로 채택.<br>• Matrix UI 및 쿼리 API(`getSceneUnit`)가 UUID를 우선 해석하도록 수정 완료.<br>• 예: Local Execution = `ac0e469c-713c-536d-a29c-2ca833aad7d1`. |
| **3** | **문단 버전 통계 분리** | **완료** | • **Imported Baseline Paragraph Versions:** 45,549개<br>• **Pilot-created Paragraph Versions:** 1개 (`c64e9c05-7355-4197-9a2d-c1b01166f2d5`)<br>• **Current Total Paragraph Versions in DB:** 45,550개<br>• **Draft Mappings Differing from Baseline:** 0개 (테스트 후 클린 복원). |
| **4** | **전권 Round-trip 검증** | **완료** | • 제1권 전체 59개 씬(45,549문단, 217,976단어)에 대해 `exports/B1_v1.0_LOCKED.clean.md` 재조립 검증.<br>• 원본 `novel_documents` 대비 **불일치 0건 (100% Exact Byte-for-Byte Match)** 달성. |
| **5** | **Manifest Hash 규격 명시** | **완료** | • **알고리즘:** MD5 복합 해시 (전체 유닛 ID + 본문 해시 + 포지션 정렬 결합).<br>• **Schema Version:** `1.0.0`<br>• **정규화 규칙:** 문단별 `/\n\s*\n/` 분할, `.trim()`, 결합 시 `\n\n` 유지.<br>• **기준본 해시:** `5e4e3a00f14ee25efe3433974dab45ef`. |
| **6** | **Snapshot Clone 원자성 보장** | **완료** | • 대규모 데이터(45,647 매핑 행) 복제 시 Postgres statement timeout을 방지하는 배치 트랜잭션 도구(`scripts/clone-snapshot.ts`) 구축 및 검증 완료. |
| **7** | **브라우저 DML 차단 (하드닝)** | **완료** | • [20260903_004_phase_a1_hardening.sql](../../supabase/migrations/20260903_004_phase_a1_hardening.sql) 작성.<br>• 클라이언트의 직접적인 `INSERT`/`UPDATE`/`DELETE` 권한을 박탈하고, 오직 `SECURITY DEFINER` RPC(`create_paragraph_checkpoint`)를 통해서만 쓰기 허용. |
| **8** | **Pilot 격리 및 Snapshot 계보** | **완료** | • `B1_v1.1_PILOT_DRAFT`를 `B1_PILOT_A1_ARCHIVED`로 개칭 및 아카이브(`snapshot_kind = 'pilot'`, `is_canonical = false`, `state = 'archived'`).<br>• 정식 개정본은 오직 깨끗한 `B1_v1.0_LOCKED`에서만 분기하도록 격리. |

---

## 2. 공식 산출물 및 아티팩트 목록

1. **데이터베이스 마이그레이션 (Git 추적):**
   * [`supabase/migrations/20260903_001_revision_core.sql`](../../supabase/migrations/20260903_001_revision_core.sql): 8대 테이블 정의.
   * [`supabase/migrations/20260903_002_revision_constraints_functions.sql`](../../supabase/migrations/20260903_002_revision_constraints_functions.sql): 불변성 트리거 및 원자적 RPC.
   * [`supabase/migrations/20260903_003_revision_rls.sql`](../../supabase/migrations/20260903_003_revision_rls.sql): 기본 RLS 정책.
   * [`supabase/migrations/20260903_004_phase_a1_hardening.sql`](../../supabase/migrations/20260903_004_phase_a1_hardening.sql): 스냅샷 메타데이터, 아카이빙, 브라우저 DML 차단.
2. **원고 내보내기 및 검증 리포트 (Exports & Reports):**
   * [`exports/B1_v1.0_LOCKED.manifest.json`](../../exports/B1_v1.0_LOCKED.manifest.json): 전체 원고 정식 매니페스트.
   * [`exports/B1_v1.0_LOCKED.scene-hashes.json`](../../exports/B1_v1.0_LOCKED.scene-hashes.json): 59개 씬별 고유 해시 목록.
   * [`exports/B1_v1.0_LOCKED.clean.md`](../../exports/B1_v1.0_LOCKED.clean.md): 제작용 토큰이 제거된 정제 원고 전문.
   * [`reports/phase-a1-verification.json`](../../reports/phase-a1-verification.json): 기계 검증 결과 JSON.
3. **독립 회귀 테스트 스위트:**
   * [`supabase/tests/revision-phase-a1.sql`](../../supabase/tests/revision-phase-a1.sql): 잠금 및 불변성 DB 테스트.
   * [`e2e/revision-matrix-a1.spec.ts`](../../e2e/revision-matrix-a1.spec.ts): E2E/통합 검증 스펙.
4. **차기 단계 매니페스트:**
   * [`docs/revision-platform/pilot-a2-prologue-manifest.md`](./pilot-a2-prologue-manifest.md): Prologue 정식 5대 씬 규격 및 A2 검증 시나리오.

---

## 3. 권장 스냅샷 계보도 (Snapshot Lineage)

```text
B1_v1.0_LOCKED (State: LOCKED, Words: 217,976, Canonical: TRUE)
├── B1_PILOT_A1_ARCHIVED (State: ARCHIVED, Canonical: FALSE)  <-- A1 파일럿 격리
├── B1_PILOT_A2_PROLOGUE (State: DRAFT -> ARCHIVED)           <-- A2 검증용 임시 브랜치
└── B1_v1.1_STRUCT_DRAFT (State: DRAFT, Canonical: TRUE)      <-- Pass 1~2 정식 구조 개정본
```

---

## 4. 최종 결론

Pilot A1의 모든 하드닝 및 클로저 조건이 충족되었으므로, **Pilot A2(Prologue 전체 5대 서사 씬에 대한 다각도 워크플로 검증)**로 안전하게 진입할 수 있습니다.
