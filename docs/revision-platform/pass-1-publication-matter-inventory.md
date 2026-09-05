# Pass 1: Publication Matter (Front Matter, Epigraph & Appendices) Audit Record

**프로젝트:** 『The Resonance of Space』 제1권 2차 수정본 통합 관리 플랫폼  
**감사 식별자:** `B1_PASS1_FRONTMATTER_APPENDIX_001` (`588f10d0-7093-4f29-837d-5faf7d14609e` / LOCKED)  
**기준본 (Baseline Source):** `B1_v1.0_LOCKED` (217,976단어, 영구 불변)  
**작업본 (Target Working Draft):** `B1_v1.1_STRUCT_DRAFT` (텍스트 수정 0건, v1.0 동일 유지)  
**적용 범위:** 출판 및 부록 단위 (7개 소스 Unit, 9개 논리적 Publication Block)  
**핵심 원칙:** *"부록이 본문보다 더 많은 것을 안다고 주장하지 못하게 한다 (The manuscript should never know more than the instruments prove)."*

---

## 1. 9대 출판 블록(Publication Block) 감사 및 조치 사양

| # | Publication Block | 원천 경로 / 식별자 | 승인 액션 | 핵심 조치 사양 |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Front Cover | `act-1/ch-2/sc-1` (`1fdc864a`) | `KEEP_REFRAME_CLAIMS` | 장르 라벨(하드 SF), 연구 기원 라벨(논문 틀에서 발전), 문학적 태그라인(*A novel of topology, memory, and the fracture of reality*)으로 엄격히 분류. 저자명 `Kwang Yong Yoo (유광용)` 영구 보호. |
| 2 | Half-title / Title Page | `act-1/ch-1/sc-1` (`fdbb38b1`) | `KEEP_NORMALIZE_METADATA` | 표제 및 부제 정규화. 연구 기원 노트 추가: *"A hard science-fiction novel developed from the speculative framework of Mechanics of Spatial Vibration I–V"*. |
| 3 | Copyright Page | `act-1/ch-2/sc-2` (`997e900d`) | `KEEP_PRODUCTION_CLEANUP` | 제작 스캐폴딩 문구(*Printed manuscript copy*)는 출판용 리더 익스포트에서 제거하고 아카이브용으로 격리 (`PRODUCTION_DEBT_COPYRIGHT_001`). 저자명 정규화 배제. |
| 4 | Table of Contents | `nested/generated` | `REGENERATE_AFTER_PASS2` | 내부 제작용 브래킷(*[Scene 1: ...]*) 및 UUID를 독자용 조판에서 완전 제거. 페이지 번호는 Pass 9 조판 후 동적 갱신 (`PUBLICATION_DEBT_TOC_SCENE_LABELS_001`). |
| 5 | Prologue Epigraph | `act-2/ch-1/sc-3` (`bae8fe68`) | `KEEP_PROTECTED_EPIGRAPH` | *"Science is ruthless with obsolete theories..."* 저자적/허구적 에피그래프로 메타데이터 분류. 원문 완벽 보존 (`EXACT_TEXT_PROTECTED`). |
| 6 | Appendix A: In-Universe Working Terminology | `act-9/ch-1/sc-1` (`128c6328`) | `REWRITE_EPISTEMIC_GLOSSARY` | 명칭 개정(*In-Universe Working Terminology*). 필수 범위 노트 추가. *Tensor Fluid, Cosmic Shear*는 가설 모델 언어로 규정. *Epsilon* 중립화. *Comoving Metric Neighborhood* 삭제 또는 후속권 이관. *Standing Wave Node*의 중력 무효화 주장 박탈. 실증 용어(*Bounded Local Response Control, Executed State, Support-Decoupled Mass*) 추가. |
| 7 | Appendix B: Selected Source-Model Equations | `act-9/ch-2/sc-1` (`9e0f6234`) | `REWRITE_EQUATION_INTEGRITY` | 명칭 개정(*Selected Source-Model Equations and Fictional Control Relations*). $\lim_{r\to0}[Q_s+C_s]=q_0+c_0\to0$ 삭제 및 유한 잔차($q_0+c_0$) 보존. 확률밀도 연속방정식($\rho=R^2, v=\nabla S/m$) 엄밀 정의. $h \to \hbar$ 정정. 비앙키 항등식과 유효 보존조건 분리. |
| 8 | Appendix C: Research Origins & References | `act-9/ch-3/sc-1` (`e7a7ed8a`) | `VERIFY_AND_REWRITE_REFERENCES` | Zenodo DOI 레지스트리(컨셉 DOI vs 버전 DOI) 분류. 이론적 틀과 소설의 허구 공학 분리 노트 추가. Paper IV(하드론 매듭, Book IV 영역) 및 Paper V(쿠프레이트 GL 유추, 대형 자석 공학 근거 아님) 위상 한정. |
| 9 | Back Cover Copy | `nested/after_appendix_c` | `REWRITE_MARKETING_CLAIMS` | 접근하는 우주 단층선 및 탈주 엔지니어 문구 삭제. 승인된 검증 카피로 전면 교체 (*"인간의 개입이 실재의 국소 반응 일부를 변경할 수 있다. 다음 질문은 무엇이 참인가만이 아니라, 누가 경계를 선택하는가이다."*). |

---

## 2. 등록된 출판 부채 및 인식론적 경계 (Debts Registered)

1. `EPISTEMIC_DEBT_APPENDIX_GLOSSARY_001` (용어사전 인식론적 분류)
2. `EQUATION_INTEGRITY_DEBT_APPENDIX_001` (수식 유한 잔차 보존 및 $\hbar$ 정정)
3. `REFERENCE_INTEGRITY_DEBT_APPENDIX_001` (연구 기원 및 Zenodo DOI 레지스트리)
4. `PAPER_SCOPE_DEBT_APPENDIX_V_001` (Paper IV 및 Paper V 시리즈 위상 한정)
5. `PRODUCTION_DEBT_BROKEN_GLYPHS_001` (깨진 한글 글리프 `(ffiffi...)` 영구 박멸, Export 기준 결함 0건)
6. `PUBLICATION_DEBT_TOC_SCENE_LABELS_001` (독자용 목차 브래킷 제거 및 Pass 9 조판 갱신)
7. `MARKETING_CLAIM_DEBT_BACK_COVER_001` (뒷표지 마케팅 카피의 과학적 절제)
8. `PRODUCTION_DEBT_COPYRIGHT_001` (판권면 작업 표기 제거 및 저자명 유광용 보호)
9. `PUBLICATION_DECISION_ACT0_LABEL_001` (ACT 0 표기 결정)

---

## 3. 최종 감사 상태 (Final Audit Verdict)

```text
B1_PASS1_FRONTMATTER_APPENDIX_001

SOURCE UNITS AUDITED:         7 UNITS
LOGICAL PUBLICATION BLOCKS:   9 BLOCKS
STRUCTURAL ACTIONS:           FINAL PASS
EPISTEMIC BOUNDARIES:         FINAL PASS (GLOSSARY / EQUATIONS / REFERENCES / BACK COVER)
AUTHOR NAME CANON PROTECTION: Kwang Yong Yoo (유광용) PROTECTED
AUDIT HASH (SHA-256):         e5799d458ae02d5ee768fca469f3f15d8794b1b7776e3663c081ad8024a81916
STATUS:                       LOCKED
TEXT MUTATION:                0 (IN B1_v1.1_STRUCT_DRAFT)
STRUCTURE MUTATION:           0
PRE-GLOBAL-LOCK PREREQUISITE: SATISFIED (ALL 14 AUDIT RUNS IN DATABASE LOCKED)
READY FOR GLOBAL AUDIT RUN:   YES (B1_PASS1_GLOBAL_001)
PASS 2 REWRITE:               NOT STARTED
```
