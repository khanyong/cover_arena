# Pass 1: Act 4 (The Cancellation Horizon) Scene Inventory & Audit Record

**프로젝트:** 『The Resonance of Space』 제1권 2차 수정본 통합 관리 플랫폼  
**기본 감사 식별자:** `B1_PASS1_ACT4_001` (`a0eb3025-7bac-4ed4-98d5-a749c85248f7` / LOCKED)  
**부가 수정 식별자:** `B1_PASS1_ACT4_001_A01` (`bd3ad08c-b2b4-4d09-8cf3-659218a00a22` / LOCKED)  
**기준본 (Baseline Source):** `B1_v1.0_LOCKED` (217,976단어, 영구 불변)  
**작업본 (Target Working Draft):** `B1_v1.1_STRUCT_DRAFT` (텍스트 수정 0건, v1.0 동일 유지)  
**적용 범위:** 제4막: 상쇄의 지평선 (`act-7`, 4개 챕터, 총 10개 정식 씬)  
**글로벌 페이싱 가이드:** 1차 목표 45,280단어 (허용 오차 ±5.0%, 개별 씬 합산 범위: 43,700–47,050단어, 액트 단위 권장 범위: 43,500–47,000단어)

---

## 1. 진행률 및 서사 단위 분모(Denominator) 정밀 확립

* **정식 서사 씬 진행률 (Canonical Narrative Scene Progress):** **51 / 52 = 98.1%**
  * 전체 서사 씬 구성: Prologue(5) + Act 0(8) + Act 1(10) + Act 2(10) + Act 3(8) + Act 4(10) + Epilogue(1) = **52개 서사 씬**
  * 잔여 서사 씬: **1개 씬** (`act-8/ch-1/sc-4` Opening)
* **데이터베이스 씬 레코드(59개)와의 7개 차이 분류 (`BOOK1_NARRATIVE_UNIT_SCOPE_001`):**
  * Front Matter / 속표지: `act-1/ch-1/sc-1` (Title/Half-title), `act-1/ch-2/sc-1` (Front Cover), `act-1/ch-2/sc-2` (Copyright) [3개]
  * Part Opening / Epigraph: `act-2/ch-1/sc-3` (Opening) [1개]
  * Appendix 단위 블록: `act-9/ch-1/sc-1` (Appendix A), `act-9/ch-2/sc-1` (Appendix B), `act-9/ch-3/sc-1` (Appendix C) [3개]
  * 총 7개 비서사 단위는 `B1_PASS1_FRONTMATTER_APPENDIX_001`에서 별도 관리.
* **18만 단어 목표 예산 소진율 (서사 본문 기준):**
  * Act 4까지 누적 목표 단어: **176,750단어 (98.2%)**
  * Epilogue 배정 예산: **3,250단어**
  * **서사 본문 총합 목표: 180,000단어 (100.0% 수렴)**

---

## 2. 핵심 인식론적 교정 및 과학적 경계 (A01 반영)

1. **Chapter 1 제네바 지하 격자(Lattice) 및 지연 사슬:**
   * G-DCL은 전 지구 네트워크가 아니라, **제네바 지하 12개 노드 분산 상쇄 격자(subterranean twelve-node experimental lattice)**임.
   * 중앙 통제의 한계는 단순 빛의 속도가 아니라 **"계측 ➔ 타임스탬프 정렬 ➔ 상태 추정 ➔ 최적화 ➔ 요청 ➔ 국소 검증 ➔ 실행 ➔ 물리 응답"**의 전 지연 사슬에서 발생함.
   * 5대 국소 실행 상태 확립: `ACCEPT`, `ACCEPT WITH SLEW LIMIT`, `ACCEPT WITH ORIENTATION MARGIN`, `REJECT — JOINT TREND LIMIT`, `ACCEPT WITH THERMAL DERATING`.
2. **Chapter 2 예측 실패(G-4A)와 제한적 성공(G-4B)의 분리:**
   * **G-4A:** 거시 전이 15–40분 예측창을 약 5분 초과(약 45분)하여 명백한 **prospective timing failure**로 기록.
   * **G-4B:** 10:48:11에 외부 전용 축소 데이터로 사전 봉인되고, 10:47:26의 지속 임계 이후 **23분 11초** 만에 기준 B(기울기)가 충족됨.
   * *"Twenty-Three Minutes"*는 임의의 신호 도달 카운트다운이 아니라, 지속 임계부터 기준 충족까지의 **경과 시간(23m 11s)을 가리키는 인간적/반올림 서사 라벨**임 (`EPISTEMIC_DEBT_ACT4_G4A_G4B_001`).
3. **Chapter 3 중앙 최적화 실패, 노드 4 보호 격리, Bounded Control:**
   * *The Wrong Solution*은 G-4A가 아니라 **중앙집중형 글로벌 제어 최적화**의 실패임 (*"가장 좋은 전체 해법이 언제나 가장 실행하기 좋은 해법이라는 믿음의 오류"*).
   * **Node Four Quench:** 파괴·소실이 아니라 마그넷 보호 덤프를 거쳐 **`PROTECTED OFFLINE`**으로 격리된 것임. 코일 어셈블리는 생존하였으며 에필로그에서 수리 후 제한 엔벨로프로 운용됨 (`HARDWARE_STATE_AUDIT_ACT4_NODE4_001`).
   * **상쇄 명칭:** Act 4의 공식 과학적 결과는 Paper I의 극한 점근 상쇄 계측이 아니라 **`BOUNDED LOCAL RESPONSE CONTROL`**임. *"Exact Cancellation"*은 주제적 모델 언어임 (`NARRATIVE_LABEL_AUDIT_ACT4_EXACT_CANCELLATION_001`).
   * **외부 98° vs 내부 13–14°:** 비율이 아닌 공간적으로 분리된 측정 영역임. 동남부 구역은 15.1°까지 도달하여 원래 시운전 기준을 위반했으나 비상 하드웨어 엔벨로프(16°) 내에서 유지됨.
4. **Chapter 4 4단계 인과 위계 및 Ian의 아크 귀속 정정:**
   * **인과 위계:** Level 1 직접 관측 ➔ **Level 2 강하게 지지된 추론 (개입이 국소 물리 반응을 인과적으로 변형)** ➔ Level 3 모델 의존 ➔ Level 4 미확립 (근본 우주적 원인, 시공간 파열, 행성 확장성) (`CAUSAL_HIERARCHY_ACT4_001`).
   * **Act 4 최종 문장:** *"Someone would have to decide what reality was allowed to become."*
   * **"I must control it"의 위치:** Act 4 본편이 아니라 **에필로그의 최종 문장(Exact Text Protected Asset)**으로 귀속됨 (`CHARACTER_ARC_BOUNDARY_ACT4_001`).

---

## 3. Act 4 10대 정식 씬 차등 압축 및 편집 범위표 (A01 반영)

| # | Chapter | Scene 제목 | 영구 식별자 (UUID) | 기준 단어 | 목표 단어 | 감축량 | 압축률 | 승인 액션 | 권장 편집 범위 |
| :-: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- | :---: |
| 1 | Ch 1 | The Machine They Left Behind | `49916110-98cb-511f-9c6f-6a9552fe7c17` | 6,460 | 5,100 | -1,360 | 21.1% | `KEEP_REFRAME_COMPRESS` | 4,900–5,250 |
| 2 | Ch 1 | Every Node Gets to Disagree | `4059051c-6515-5881-9e38-f50c32f5fd77` | 4,413 | 3,800 | -613 | 13.9% | `KEEP_PROTECTED_LOCAL_AUTHORITY` | 3,700–3,950 |
| 3 | Ch 2 | The First Warning | `01389b2b-d9fc-5a63-b516-c9c7400ae336` | 5,989 | 4,850 | -1,139 | 19.0% | `KEEP_COMPRESS` | 4,650–5,050 |
| 4 | Ch 2 | Twenty-Three Minutes | `2caba919-0064-5339-8b2c-a64213ed3ca8` | 4,519 | 3,700 | -819 | 18.1% | `KEEP_PROTECTED_PREDICTION` | 3,550–3,850 |
| 5 | Ch 3 | The Wrong Solution | `c6f9393a-87c8-5a1a-bad3-83e957529282` | 6,709 | 5,200 | -1,509 | 22.5% | `KEEP_REFRAME_COMPRESS` | 5,000–5,400 |
| 6 | Ch 3 | Local Execution | `d85c990f-cf14-5fc7-b8f7-a69b7604e2cc` | 5,137 | 4,400 | -737 | 14.3% | `KEEP_PROTECTED_EXECUTION` | 4,300–4,550 |
| 7 | Ch 3 | The Boundary Holds | `94a9a8c3-f6ce-5ddb-8d5c-a474e52586f0` | 4,760 | 4,200 | -560 | 11.8% | `KEEP_PROTECTED_HARDWARE` | 4,100–4,350 |
| 8 | Ch 4 | What Changed When We Acted | `60aad8d4-2589-59a8-ac55-bc42605db7ae` | 6,007 | 4,750 | -1,257 | 20.9% | `KEEP_COMPRESS_CAUSAL_AUDIT` | 4,550–4,950 |
| 9 | Ch 4 | The First Thing We Can Say | `c5df358b-d927-523e-b8f5-f7c256cfcf9b` | 4,766 | 3,750 | -1,016 | 21.3% | `KEEP_COMPRESS_PROTECTED_CLAIM` | 3,550–3,900 |
| 10 | Ch 4 | The Cost of Control | `50b43df2-df3b-5165-99a7-e52f63814e43` | 6,462 | 5,530 | -932 | 14.4% | `KEEP_PROTECTED_ARC` | 5,400–5,800 |
| **합계** | — | **Act 4 전체 (10개 씬)** | — | **55,222** | **45,280** | **-9,942** | **18.0%** | — | **43,700–47,050** |

---

## 4. 4대 챕터 게이트(Chapter Gate) 판정 기록 (A01 반영)

### Chapter 1: The Return to Geneva
* **Question:** 서로 다른 센서·시간·하드웨어 이력을 가진 12개 node가 하나의 composite response를 만들면서도 각자의 안전 거부권을 유지할 수 있는가?
* **Answer:** 제네바 지하 G-DCL은 중앙에서 전달된 값을 직접 실행하는 체계가 아니라, 중앙의 supervisory target을 각 node가 자신의 국소 계측·하드웨어 margin·보호규칙에 따라 수락·제한·거부하는 체계로 동작한다. Node Seven의 의도적 wrong-state commissioning은 국소 오류 감지와 fallback이 중앙의 새로운 해법보다 먼저 작동할 수 있음을 보여준다. 어느 controller도 전체 시스템의 완전한 순간상태를 알지 못하며, distributed local authority는 global optimality보다 bounded safety를 우선한다.
* **Larger Question:** 자연현상이 global-state reconstruction보다 빠르게 변할 때, 중앙은 얼마의 실행권을 local nodes에 넘겨야 하는가?
* **Verdict:** `PASS — KEEP_REFRAME_COMPRESS` (목표 8,900단어 / -18.1%).

### Chapter 2: The Prediction Window
* **Question:** 실패한 첫 prospective prediction을 보존하면서, 더 약한 archived branch criterion을 사후조정 없이 실제 사건에 시험할 수 있는가?
* **Answer:** G-4A는 branch transition의 존재 가능성을 포착했지만 15–40분 timing window를 약 5분 벗어나 prospective failure로 기록된다. G-4B는 사건 이전 archive에 존재했던 더 약한 criterion이며, intervention 영향을 피하기 위해 external-only reduction으로 다시 고정된다. Criterion과 18–30분 window는 10:48:11에 봉인되고, 10:47:26의 sustained threshold 이후 23분 11초 만에 orientation-gradient criterion이 충족된다. 이는 G-4B의 제한적 prospective success이며 G-4A의 실패를 삭제하지 않는다.
* **Larger Question:** 유효하지만 부분적으로 틀린 모델을 사용하면서도, 과학적 검증과 안전개입을 어떻게 분리할 것인가?
* **Verdict:** `PASS — PREDICTION ATTRIBUTION AMENDMENT REQUIRED` (목표 8,550단어 / -18.6%).

### Chapter 3: Exact Cancellation
* **Question:** 중앙집중형 optimizer가 변화하는 자연현상의 과거 상태를 최적화하기 시작할 때, local execution은 bounded region을 유지할 수 있으며 실제 node fault를 견딜 수 있는가?
* **Answer:** 중앙 optimizer는 더 깨끗한 central value를 계산하지만 local cross-coupling, gradient, hardware margin을 악화시키는 실행해법을 제안한다. 이후 fast authority가 local nodes로 이전되고, 각 node는 자신의 계측·margin·safe-state library에 따라 서로 다른 상태를 실행한다. Node Four의 protective quench로 한 actuator contribution이 사라지자 southeast sector가 악화되지만, 다른 nodes가 Four의 복귀 없이 국소적으로 재분배하여 emergency hardware envelope 안에서 bounded region을 유지한다. 원래 closure criterion은 한 sector에서 위반되었으며, 결과는 일반 one-node tolerance나 exact nodal cancellation을 확립하지 않는다.
* **Larger Question:** 복잡한 자연현상의 변화와 actuator intervention의 효과를 사후확신 없이 어떻게 인과적으로 분리할 것인가?
* **Verdict:** `PASS — REMOVE G-4A CONFLATION / NODE DESTRUCTION / DIRECT NODAL CANCELLATION` (목표 13,800단어 / -16.9%).

### Chapter 4: The Resonance of Space
* **Question:** 불완전하고 변화하는 자연현상에서 intervention이 실제로 local response를 변화시켰다고 어디까지 말할 수 있으며, 그 능력은 어떤 권력 문제를 발생시키는가?
* **Answer:** blinded team analysis, 두 차례의 on/off intervention, Node Four contribution 상실, neighbor redistribution이라는 서로 다른 perturbation이 같은 인과 방향을 지지한다. 따라서 G-DCL actuation이 측정된 local response 일부를 인과적으로 변경했다는 강한 추론이 성립한다. 공식 결과는 bounded local response control이며 mechanism, spacetime control, gravity cancellation, common cause, planetary shield는 확립되지 않는다. 과학과 procurement 권한은 분리되고 local veto·multiple abort authority·mirrored archive가 제도화된다. Ian은 boundary가 geometry가 아니라 acceptable state를 선택하는 결정임을 깨닫지만, 개인적 통제 선언은 Epilogue에서 완성된다.
* **Larger Question:** 기술이 소형화되고 여러 국가·기업이 서로 다른 target state를 선택할 때, 누가 boundary를 소유하고 집행할 것인가?
* **Verdict:** `PASS — CAUSAL HIERARCHY PROTECTED / FINAL ARC LINE REASSIGNED TO EPILOGUE` (목표 14,030단어 / -18.6%).

---

## 5. 최종 감사 상태 (Final Audit Verdict)

```text
B1_PASS1_ACT4_001

SCENE INVENTORY:              FINAL PASS (10 SCENES)
STRUCTURAL ACTIONS:           FINAL PASS
COMPRESSION PLAN:             FINAL PASS / DIFFERENTIATED RANGES (43,700–47,050)
CHAPTER GATES:                FINAL PASS (4 CHAPTERS — A01 AMENDED)
EPISTEMIC BOUNDARIES:         FINAL PASS (10 SCENES — A01 AMENDED)
BASE AUDIT HASH (SHA-256):    7a978331e44edadca2230b4d6f005f46236b6944eed154bd3e57d2655394e5d3
A01 AUDIT HASH (SHA-256):     43073e8bd05e95c600a56e5b63f394293e8696d19b330166c1a0bb8c08ebc9f5
STATUS:                       LOCKED
TEXT MUTATION:                0 (IN B1_v1.1_STRUCT_DRAFT)
STRUCTURE MUTATION:           0
CANONICAL NARRATIVE PROGRESS: 51 / 52 SCENES (98.1%)
CUMULATIVE TARGET (A0..A4):   176,750 WORDS (98.2% of 180k target)
REMAINING EPILOGUE BUDGET:    3,250 WORDS (Baseline: 3,957 words)
READY FOR EPILOGUE AUDIT:     YES (EPILOGUE: THE OWNER OF THE BOUNDARY)
READY FOR GLOBAL PASS 1 LOCK: NOT YET (AFTER EPILOGUE + FRONT MATTER/APPENDIX)
PASS 2 REWRITE:               NOT STARTED
```
