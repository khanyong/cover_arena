# Pilot A2: Prologue Canonical Manifest & Verification Plan

**프로젝트:** 『The Resonance of Space』 제1권 2차 수정본 통합 관리 플랫폼  
**적용 범위:** Pilot A2 (Prologue 전체 워크플로 다각도 검증)  
**기준 스냅샷:** `B1_v1.0_LOCKED` (`1f54a517-1921-5d5d-8a16-048597a41a93`)  
**작업 스냅샷:** `B1_PILOT_A2_PROLOGUE` (새로운 독립 테스트 브랜치)

---

## 1. Prologue 씬 구조 감사 (5개 정식 씬 vs 1개 권두 에피그래프)

레거시 JSON 파서(`import_novel_en.ts`)에서 Prologue 본문 시작 전의 권두 에피그래프(Epigraph: *"Science is ruthless with obsolete theories..."*)를 별도의 더미 챕터/씬으로 파싱하여 총 6개 노드가 생성되었습니다.

* **정식 서사 씬 (Canonical Narrative Scenes):** **총 5개**
* **권두 에피그래프 노드 (Synthetic Epigraph Node):** 1개 (`act-2/ch-1/sc-3`)

### 정식 5대 씬 식별자 및 규격표

| Canonical # | 영구 식별자 (UUID) | 계층 경로 (`source_path`) | 정식 씬 제목 | 문단 수 | 단어 수 | 검증 목표 |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **Epigraph** | `bae8fe68-32e4-5325-85a0-c586e01bb24f` | `act-2/ch-1/sc-3` | `Opening` (Epigraph) | 1 | 35 | 인용구 이탤릭 및 인라인 렌더링 |
| **Scene 1** | `55b46292-0335-5fbc-ab9e-baa44d3bea70` | `act-2/ch-2/sc-1` | `[Scene 1: The Architecture of Consensus]` | 129 | 1,842 | 일반 산문 문단 편집 및 문체 조정 |
| **Scene 2** | `d08d2485-7457-522e-b928-e4067b535080` | `act-2/ch-3/sc-1` | `[Scene 1: The Accumulating Residual]` | 268 | 2,104 | 긴 계측·기술 설명 문단 렌더링 및 diff |
| **Scene 3** | `ac0e469c-713c-536d-a29c-2ca833aad7d1` | `act-2/ch-3/sc-2` | `[Scene 2: Local Execution]` | 439 | 3,118 | KaTeX 수식, 동시성 충돌, 대규모 439문단 성능 |
| **Scene 4** | `7f4ea026-c161-5929-884e-aa03c9a2fa53` | `act-2/ch-4/sc-1` | `[Scene 1: The Official Record]` | 275 | 1,682 | 관료적 기록 문단과 Scene Matrix 감사 저장 |
| **Scene 5** | `a91813d6-bc60-56b8-86d7-114fee4c761e` | `act-2/ch-4/sc-2` | `[Scene 2: Exile and the Geometric Boundary]` | 292 | 1,682 | 복원(Revert) 및 씬 전환 간 에디터 상태 유지 |

* **Prologue 총합:** 5개 정식 씬 + 1개 에피그래프 = 총 1,404개 문단, 10,463 단어.

---

## 2. Pilot A2 테스트 매트릭스 및 검증 시나리오

Pilot A2의 목적은 **"실제 소설 개정이 아니라, 한 씬에서 성공한 워크플로가 프롤로그의 다양한 문체·기술 장면 유형에서도 동일하게 무결성을 유지하는지 확인"**하는 것입니다.

### 시나리오 1: 일반 산문 편집 (Scene 1: The Architecture of Consensus)
* **대상 URL:** `/editor/matrix?scene=55b46292-0335-5fbc-ab9e-baa44d3bea70`
* **검증:** 일상적 서술 및 대화 문단 수정 -> Checkpoint 생성 -> `paragraph_versions`에 `version_no = 2` 등록 -> diff 하이라이트 확인.

### 시나리오 2: 긴 계측 기술 문단 (Scene 2: The Accumulating Residual)
* **대상 URL:** `/editor/matrix?scene=d08d2485-7457-522e-b928-e4067b535080`
* **검증:** 복잡한 기술 단위 및 센서 수치가 포함된 문단의 줄바꿈/공백 보존 검증.

### 시나리오 3: 수식 및 낙관적 동시성 (Scene 3: Local Execution)
* **대상 URL:** `/editor/matrix?scene=ac0e469c-713c-536d-a29c-2ca833aad7d1`
* **검증:** 439개 문단 스크롤 성능, KaTeX 수식 인라인 렌더링, stale expected_current_version_id 충돌 거부 재확인.

### 시나리오 4: 관료 기록 및 Scene Matrix (Scene 4: The Official Record)
* **대상 URL:** `/editor/matrix?scene=7f4ea026-c161-5929-884e-aa03c9a2fa53`
* **검증:** 17개 Matrix 필드(Status: Reviewed, Action: Compress 등) 입력 후 DB 저장 및 새로고침 후 복원 확인.

### 시나리오 5: 원본 복원 및 씬 전환 상태 (Scene 5: Exile and the Geometric Boundary)
* **대상 URL:** `/editor/matrix?scene=a91813d6-bc60-56b8-86d7-114fee4c761e`
* **검증:** 문단 수정 후 `Revert to v1.0` 실행 시 draft buffer가 baseline 텍스트로 복원되는지 확인. Scene 전환 시 URL 쿼리 파라미터(`?scene=UUID`) 기반 상태 동기화 확인.

---

## 3. 격리 및 아카이빙 방침

* Pilot A2 완료 후, 테스트용 스냅샷 `B1_PILOT_A2_PROLOGUE`는 `state = 'archived'`, `is_canonical = false`로 즉시 동결/아카이브 처리합니다.
* 정식 제1권 구조 개정은 오직 깨끗한 `B1_v1.0_LOCKED`에서 새로 생성된 `B1_v1.1_STRUCT_DRAFT`에서만 시작됩니다.
