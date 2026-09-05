import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  console.log('===========================================================');
  console.log('  PASS 2B-0: PROLOGUE STRUCTURAL REVISION BLOCK MAP SEEDER ');
  console.log('===========================================================\n');

  // 1. Fetch Snapshots and Parent Global Plan
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('*').eq('code', 'B1_PASS2A_CANON_NORMALIZED_LOCKED').single();
  const { data: draftSnap } = await supabase.from('revision_snapshots').select('*').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: globalPlan } = await supabase.from('audit_runs').select('*').eq('code', 'B1_PASS1_GLOBAL_001').single();

  if (!proj || !baseSnap || !draftSnap || !globalPlan) {
    throw new Error('Required snapshots or Global Plan missing.');
  }

  console.log(`Baseline Snapshot (Pass 2B Immediate Baseline): ${baseSnap.code} (LOCKED)`);
  console.log(`Working Draft (Pass 2B Execution Branch):       ${draftSnap.code} (DRAFT)`);
  console.log(`Parent Global Plan:                             ${globalPlan.code} (LOCKED)\n`);

  // 2. Register/Update Repetition Debt Resolution
  console.log('1. Registering Resolution for REPETITION_DEBT_PRO_S5_ACT1_S1_001...');
  const repetitionResolution = {
    resolution_principle: 'Prologue preserves origin of isolation; Act 1 preserves operational consequence of isolation.',
    prologue_scope: [
      'Personal and institutional cost of exile',
      'Sarah Hayes limited initial evidence packet handoff',
      'Ian initial decision to construct personal research boundary',
      'Anchoring of CAUSE UNKNOWN and TEST REQUIRED epistemic markers',
      'Initial realization that absolute geometric isolation from planetary environment is physically impossible'
    ],
    act1_scope: [
      'Six-year mature operational consequences and routine',
      'Mature Scottish Coats Observatory setup and local FPGA array',
      'Long-term accumulating A-173 residual data',
      'Rigorous independent data reduction workflow'
    ],
    status: 'RESOLUTION_LOCKED'
  };

  await supabase
    .from('repetition_debts')
    .update({
      recommended_action: JSON.stringify(repetitionResolution),
      status: 'OPEN' // Marked with locked resolution, closed when Act 1 is edited
    })
    .eq('code', 'REPETITION_DEBT_PRO_S5_ACT1_S1_001');

  console.log('   Repetition debt allocation boundary locked.\n');

  // 3. Register Audit Run B1_PASS2B_PROLOGUE_001
  const AUDIT_CODE = 'B1_PASS2B_PROLOGUE_001';
  console.log(`2. Registering Audit Run ${AUDIT_CODE}...`);

  const { data: auditRun, error: arErr } = await supabase
    .from('audit_runs')
    .upsert({
      code: AUDIT_CODE,
      parent_audit_id: globalPlan.id,
      run_type: 'formal',
      project_id: proj.id,
      source_snapshot_id: baseSnap.id,
      target_snapshot_id: draftSnap.id,
      pass_number: 2,
      scope_name: 'PROLOGUE: THE BROKEN VARIABLE & ISOLATION ORIGIN (PASS 2B-0 BLOCK MAP)',
      criteria_version: '2.0.0',
      status: 'in_review',
      amendment_reason: 'Pass 2B-0 Paragraph Block Mapping across 5 Prologue scenes establishing compression actions (KEEP, COMPRESS, CUT, BRIDGE) with zero manuscript mutation.',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (arErr) throw new Error(`Audit run creation failed: ${arErr.message}`);
  console.log(`   Audit Run registered: ${auditRun.code} (${auditRun.id})\n`);

  // 4. Define Prologue Scene Block Mappings
  const PROLOGUE_SCENES = [
    {
      scene_number: 1,
      id: '55b46292-0335-5fbc-ab9e-baa44d3bea70',
      title: 'Scene 1: The Architecture of Consensus',
      baseline_words: 1842,
      target_words: 1610,
      delta: -232,
      compression_percent: 12.6,
      blocks: [
        {
          block_order: 1,
          label: 'Block 1.1: CERN Molasse & Infrastructure Establishing',
          action: 'COMPRESS',
          target_words: 340,
          function: 'Atmospheric establishment of underground ring and consensus-driven physics.',
          rationale: 'Tighten repetitive physical description of subterranean architecture.'
        },
        {
          block_order: 2,
          label: 'Block 1.2: Committee Chamber & Administrative Politics',
          action: 'COMPRESS',
          target_words: 520,
          function: 'Institutional politics, committee hierarchy, and defensive bureaucracy.',
          rationale: 'Reduce list-like recitation of committee attendees; emphasize political rigidity.'
        },
        {
          block_order: 3,
          label: 'Block 1.3: Sarah & Ian Clash on Theoretical Framework',
          action: 'KEEP',
          target_words: 750,
          function: 'Core character dynamic and epistemic debate on anomaly dismissal.',
          rationale: 'Protected dialogue and character beats defining early conflict.'
        }
      ]
    },
    {
      scene_number: 2,
      id: 'd08d2485-7457-522e-b928-e4067b535080',
      title: 'Scene 2: The Accumulating Residual',
      baseline_words: 2104,
      target_words: 1788,
      delta: -316,
      compression_percent: 15.0,
      blocks: [
        {
          block_order: 1,
          label: 'Block 2.1: Calibration Data and Drift Logs',
          action: 'COMPRESS',
          target_words: 450,
          function: 'Detector telemetry and anomalous baseline shift.',
          rationale: 'Compress technical sensor calibration lists while retaining mathematical drift.'
        },
        {
          block_order: 2,
          label: 'Block 2.2: Late-Night Sector 4 Investigation',
          action: 'KEEP',
          target_words: 820,
          function: 'Solo investigation of physical tunnel and persistent baseline shift.',
          rationale: 'Atmospheric tension and physical engagement with hardware.'
        },
        {
          block_order: 3,
          label: 'Block 2.3: Initial Discovery of A-173 Anomaly Pattern',
          action: 'COMPRESS',
          target_words: 518,
          function: 'Initial mathematical recognition of non-random noise signature.',
          rationale: 'Streamline intermediate data processing paragraphs.'
        }
      ]
    },
    {
      scene_number: 3,
      id: 'ac0e469c-713c-536d-a29c-2ca833aad7d1',
      title: 'Scene 3: Local Execution',
      baseline_words: 3118,
      target_words: 2650,
      delta: -468,
      compression_percent: 15.0,
      blocks: [
        {
          block_order: 1,
          label: 'Block 3.1: Pre-Run Safety Briefing and Cold Commissioning',
          action: 'COMPRESS',
          target_words: 620,
          function: 'Operational setup and protocol constraints before high-field ramp.',
          rationale: 'Trim redundant safety checklist details; preserve Tier-5 authorization ladder.'
        },
        {
          block_order: 2,
          label: 'Block 3.2: High-Field Ramp and Thermal Signature Anomaly',
          action: 'KEEP',
          target_words: 1250,
          function: 'Primary scientific anomaly occurrence; protected sensor sequences.',
          rationale: 'Protected core physics sequence (Paper I physics and magnet telemetry).'
        },
        {
          block_order: 3,
          label: 'Block 3.3: Emergency Quench and Control Room Confrontation',
          action: 'COMPRESS',
          target_words: 780,
          function: 'Immediate institutional reaction, cover-up initiation, and Ian dismissal.',
          rationale: 'Tighten post-quench procedural arguments; heighten dramatic momentum.'
        }
      ]
    },
    {
      scene_number: 4,
      id: '7f4ea026-c161-5929-884e-aa03c9a2fa53',
      title: 'Scene 4: The Official Record',
      baseline_words: 1682,
      target_words: 1387,
      delta: -295,
      compression_percent: 17.5,
      blocks: [
        {
          block_order: 1,
          label: 'Block 4.1: Report Sanitization and Bureaucratic Erasure',
          action: 'COMPRESS',
          target_words: 480,
          function: 'Institutional silencing and deletion of raw anomaly telemetry.',
          rationale: 'Cut bureaucratic document formatting fluff; focus on deliberate erasure.'
        },
        {
          block_order: 2,
          label: 'Block 4.2: Sarah Quiet Delivery of Raw Logs',
          action: 'KEEP',
          target_words: 550,
          function: 'Subtle institutional dissent and handover of evidence packet.',
          rationale: 'Protected character trust beat between Sarah and Ian.'
        },
        {
          block_order: 3,
          label: 'Block 4.3: Final Institutional Repudiation',
          action: 'COMPRESS',
          target_words: 357,
          function: 'Formal severance of Ian credentials and academic exile order.',
          rationale: 'Condense administrative exit procedures into sharp dramatic break.'
        }
      ]
    },
    {
      scene_number: 5,
      id: 'a91813d6-bc60-56b8-86d7-114fee4c761e',
      title: 'Scene 5: Exile and the Geometric Boundary',
      baseline_words: 1682,
      target_words: 1345,
      delta: -337,
      compression_percent: 20.0,
      blocks: [
        {
          block_order: 1,
          label: 'Block 5.1: Arrival in Scotland & Emotional Cost of Exile',
          action: 'COMPRESS',
          target_words: 380,
          function: 'Direct human and professional cost of exile; physical displacement.',
          rationale: 'Strictly focus on human cost; remove mature observatory operational setup.'
        },
        {
          block_order: 2,
          label: 'Block 5.2: Establishing the Research Boundary & Epistemic Tags',
          action: 'KEEP',
          target_words: 580,
          function: 'Decision to construct independent model; anchoring CAUSE UNKNOWN and TEST REQUIRED.',
          rationale: 'Protected philosophical and epistemic foundation of Ian entire arc.'
        },
        {
          block_order: 3,
          label: 'Block 5.3: The Realization of Impossible Isolation',
          action: 'COMPRESS',
          target_words: 385,
          function: 'Realization that Earth background noise cannot be filtered out.',
          rationale: 'Trim Coats technical equipment details; defer mature telemetry to Act 1.'
        }
      ]
    }
  ];

  console.log('3. Writing Scene Block Mappings...');
  const blockMapSummary = {
    audit_code: AUDIT_CODE,
    parent_plan: globalPlan.code,
    immediate_baseline: baseSnap.code,
    working_draft: draftSnap.code,
    status: 'BLOCK_MAP_PROPOSED',
    total_baseline_words: 10428,
    total_target_words: 8780,
    planned_reduction_words: 1648,
    planned_reduction_percent: 15.8,
    scenes_count: 5,
    total_blocks_count: 15,
    repetition_debt_resolution: 'REPETITION_DEBT_PRO_S5_ACT1_S1_001',
    scenes: PROLOGUE_SCENES
  };

  fs.writeFileSync('reports/pass-2b-prologue-block-map.json', JSON.stringify(blockMapSummary, null, 2), 'utf-8');
  fs.writeFileSync('exports/B1_PASS2B_PROLOGUE_001.block-map.json', JSON.stringify(blockMapSummary, null, 2), 'utf-8');

  // Write docs/revision-platform/pass-2b-prologue-block-plan.md
  const markdownPlan = `# Pass 2B-0: Prologue Structural Revision Block Plan

**프로젝트:** 『The Resonance of Space』 제1권 2차 수정본 통합 관리 플랫폼  
**실행 계획 식별자:** \`${AUDIT_CODE}\`  
**상위 계획:** \`${globalPlan.code}\` (PLAN_LOCK / LOCKED)  
**직접 비교 기준본 (Immediate Baseline):** \`${baseSnap.code}\` (LOCKED / 가족 이름 정규화 완료)  
**작업본 (Working Draft):** \`${draftSnap.code}\` (DRAFT)  
**역사적 기준본 (Historical Reference):** \`B1_v1.0_LOCKED\` (LOCKED / 원형 보존)  
**적용 범위:** 프롤로그 5개 정식 서사 장면 (10,428단어 ➔ 목표 8,780단어 / -15.8%)  
**현재 본문 텍스트 변경:** **0건 (0.00% / Pass 2B-0 구조 블록 맵 설계 단계)**  

---

## 1. 전권 반복 부채 해결안 (\`REPETITION_DEBT_PRO_S5_ACT1_S1_001\`)

설계자의 분배 원칙에 따라 프롤로그 Scene 5와 Act 1 Scene 1의 서술 경계를 확정하였습니다:

* **프롤로그 Scene 5 (\`Exile and the Geometric Boundary\`):**
  * 추방의 직접적 인간적·정치적 비용
  * Sarah가 넘긴 최초의 제한된 증거 패킷
  * Ian이 자신의 연구 경계를 긋는 최초의 결정
  * \`CAUSE UNKNOWN\`, \`TEST REQUIRED\` 인식론적 앵커 보존
  * 지구 환경으로부터의 완전한 기하학적 고립은 불가능하다는 최초의 인식
* **Act 1 Scene 1 (\`The Calculus of Isolation\`):**
  * 6년간의 실제 운영 결과 및 스코틀랜드 Coats 관측소 성숙한 환경
  * 장기 누적 A-173 잔차 데이터
  * Ian의 일상화된 데이터 축약 워크플로 및 연구 방법론의 결실

---

## 2. 프롤로그 5개 씬별 15대 문단 블록(Paragraph Block) 분할 맵

| 씬 번호 | 씬 제목 | 블록 식별자 | 블록 명칭 | 승인 액션 | 목표 단어 | 핵심 기능 및 감축 근거 |
| :-: | :--- | :---: | :--- | :---: | :---: | :--- |
| **Sc 1** | The Architecture of Consensus | Blk 1.1 | CERN Molasse & Infrastructure | \`COMPRESS\` | 340 | 지하 링 구조의 과도한 물리적 묘사 압축. |
| | | Blk 1.2 | Committee Chamber & Politics | \`COMPRESS\` | 520 | 위원회 참석자 나열 압축, 관료적 경직성에 집중. |
| | | Blk 1.3 | Sarah & Ian Debate | \`KEEP\` | 750 | 보호 대화 및 초기 인물 갈등 핵심 보존. |
| **Sc 2** | The Accumulating Residual | Blk 2.1 | Calibration Data & Drift Logs | \`COMPRESS\` | 450 | 센서 보정 리스트 압축, 수학적 표류 보존. |
| | | Blk 2.2 | Late-Night Sector 4 Investigation | \`KEEP\` | 820 | 4구역 현장 물리적 조사 및 긴장감 보존. |
| | | Blk 2.3 | Initial Discovery of A-173 | \`COMPRESS\` | 518 | 중간 계산 및 데이터 처리 문단 간결화. |
| **Sc 3** | Local Execution | Blk 3.1 | Safety Briefing & Commissioning | \`COMPRESS\` | 620 | 안전 체크리스트 압축, Tier-5 권한 사다리 보존. |
| | | Blk 3.2 | High-Field Ramp & Thermal Anomaly | \`KEEP\` | 1,250 | 핵심 물리 이상 현상 및 센서 시퀀스 완벽 보존. |
| | | Blk 3.3 | Quench & Control Room Clash | \`COMPRESS\` | 780 | 퀜치 직후 절차적 논쟁 압축, 극적 속도감 고조. |
| **Sc 4** | The Official Record | Blk 4.1 | Report Sanitization & Erasure | \`COMPRESS\` | 480 | 보고서 서식 군더더기 삭제, 의도적 은폐에 집중. |
| | | Blk 4.2 | Sarah Quiet Delivery of Raw Logs | \`KEEP\` | 550 | Sarah와 Ian 간의 신뢰 및 원천 데이터 전달 보존. |
| | | Blk 4.3 | Final Institutional Repudiation | \`COMPRESS\` | 357 | 행정적 추방 통보 간결화, 날카로운 결별 확립. |
| **Sc 5** | Exile and Geometric Boundary | Blk 5.1 | Arrival in Scotland & Exile Cost | \`COMPRESS\` | 380 | 인간적 추방 비용 집중, 성숙한 관측소 서술 배제. |
| | | Blk 5.2 | Establishing Research Boundary | \`KEEP\` | 580 | \`CAUSE UNKNOWN\` / \`TEST REQUIRED\` 원문 보존. |
| | | Blk 5.3 | The Impossible Isolation | \`COMPRESS\` | 385 | Coats 기술 서술 압축, 장기 운영 서술 Act 1 이관. |

---

## 3. 합격 기준 및 다음 단계 (Pass 2B-1 Execution Criteria)

1. **Pass 2B-0 Block Map 동결:** 설계자 승인 후 Block Map 잠금.
2. **Pass 2B-1 문단 압축 실행:**
   * 5개 정식 씬 순서 및 구조 100% 보존.
   * 목표 예산: 8,780단어 (±5% 허용 오차).
   * 가족 이름 Canon 완벽 보존 (김지만/유서연 잔재 0건).
   * 보호 자산(Protected Assets) 및 Exact Text 변형 0건.
   * 신규 생성 Paragraph Version 전량 추적 및 Orphan Version 0건.
`;

  fs.writeFileSync('docs/revision-platform/pass-2b-prologue-block-plan.md', markdownPlan, 'utf-8');

  console.log('\n===========================================================');
  console.log('       PASS 2B-0 PROLOGUE BLOCK MAP SEEDED!                ');
  console.log('===========================================================');
  console.log(`Plan Code:           ${AUDIT_CODE}`);
  console.log(`Baseline Snapshot:   ${baseSnap.code} (Immediate Baseline)`);
  console.log(`Working Draft:       ${draftSnap.code}`);
  console.log(`Prologue Target:     8,780 words (-15.8%)`);
  console.log(`Blocks Defined:      15 Paragraph Blocks across 5 Scenes`);
  console.log(`Status:              PROPOSED / READY FOR ARCHITECT REVIEW`);
  console.log(`Manuscript Mutation: 0 (Strict Pass 2B-0 Zero Mutation)\n`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
