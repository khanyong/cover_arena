import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are strictly required.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log('=== PASS 1 ACT 4 AUDIT AMENDMENT A01 RUNNER ===\n');

  // 1. Fetch Project, Snapshots and Base Audit
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: baseAudit } = await supabase.from('audit_runs').select('*').eq('code', 'B1_PASS1_ACT4_001').single();
  const { data: act4Unit } = await supabase.from('content_units').select('id').eq('source_path', 'act-7').single();

  if (!baseAudit) throw new Error('Base audit B1_PASS1_ACT4_001 not found.');
  console.log(`Base Audit: ${baseAudit.code} (${baseAudit.id}) - Status: ${baseAudit.status}`);

  // 2. Register Repetition Debt: REPETITION_DEBT_ACT4_POST_EVENT_ANALYSIS_001
  console.log('Registering Repetition Debt REPETITION_DEBT_ACT4_POST_EVENT_ANALYSIS_001...');
  const { error: repErr } = await supabase
    .from('repetition_debts')
    .upsert({
      code: 'REPETITION_DEBT_ACT4_POST_EVENT_ANALYSIS_001',
      source_scope: 'Act 4 / Chapter 4: What Changed When We Acted & The First Thing We Can Say',
      target_scope: 'Act 4 Post-Event Scientific Re-articulation',
      description: 'Causal analysis and official communique negotiation risk repeating identical epistemic boundary caveats across multiple scenes.',
      recommended_action: 'Scene 8 focuses on multi-team causal inference and physical energy/stress balance; Scene 9 strictly focuses on institutional phrasing, media containment, and Sarah Hayes public communique drafting.',
      status: 'OPEN',
    }, { onConflict: 'code' });

  if (repErr) throw new Error(`Repetition debt failed: ${repErr.message}`);
  console.log('Repetition Debt registered: REPETITION_DEBT_ACT4_POST_EVENT_ANALYSIS_001 (Status: OPEN)\n');

  // 3. Register Act 4 Series Debts & Narrative Scope
  console.log('Registering Act 4 Series Debts and Scope Audit Records...');
  const DEBTS = [
    {
      code: 'BOOK1_NARRATIVE_UNIT_SCOPE_001',
      project_id: proj.id,
      debt_type: 'CONTINUITY',
      title: 'Canonical Narrative Scenes (52) vs Database Scene Units (59) Scope Definition',
      source_scope: 'Book 1 Entire Manuscript Structure',
      target_scope: 'Revision Platform Audit Metrics & Denominators',
      established_in_source: '52 canonical narrative scenes (Prologue 5, Act 0 8, Act 1 10, Act 2 10, Act 3 8, Act 4 10, Epilogue 1). 7 units are non-narrative/front matter/appendix blocks.',
      forbidden_in_target: 'Using 59 as narrative scene denominator or claiming global lock before non-narrative unit classification.',
      required_in_target: 'Progress denominator for narrative scenes is 52. Front matter and appendix units tracked under separate scope B1_PASS1_FRONTMATTER_APPENDIX_001.',
      status: 'OPEN',
    },
    {
      code: 'EPISTEMIC_DEBT_ACT4_G4A_G4B_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'G-4A Timing Failure vs G-4B Limited Prospective Verification',
      source_scope: 'Act 4 / Chapter 2: The Prediction Window',
      target_scope: 'Act 4 Predictive Science Claims',
      established_in_source: 'G-4A timing prediction failed (macroscopic transition at ~45 min vs 15-40 min window). G-4B was an archived secondary criterion sealed at 10:48:11, satisfied 23 min 11 sec later.',
      forbidden_in_target: 'Conflating G-4A failure with centralized control optimizer failure, or claiming incoming signal countdown arrival in 23 minutes.',
      required_in_target: 'Preserve G-4A prospective timing failure. Record "Twenty-Three Minutes" as rounded narrative label for elapsed time (23m 11s) within 18-30 min window.',
      status: 'OPEN',
    },
    {
      code: 'NARRATIVE_LABEL_AUDIT_ACT4_EXACT_CANCELLATION_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'Exact Cancellation Label vs Bounded Local Response Control Result',
      source_scope: 'Act 4 / Chapter 3: Exact Cancellation',
      target_scope: 'Act 4 Official Scientific Outcomes',
      established_in_source: 'Paper I predicts leading asymptotic nodal divergence cancellation (-1/r^2 vs +1/r^2). Natural event in Act 4 only demonstrated bounded local response control.',
      forbidden_in_target: 'Claiming direct observation of nodal divergence asymptotic cancellation, universal cancellation law, or gravity cancellation.',
      required_in_target: 'Register "Exact Cancellation" as thematic / model-language title. Official scientific outcome is BOUNDED LOCAL RESPONSE CONTROL.',
      status: 'OPEN',
    },
    {
      code: 'HARDWARE_STATE_AUDIT_ACT4_NODE4_001',
      project_id: proj.id,
      debt_type: 'CONTINUITY',
      title: 'Node Four Protective Quench (Protected Offline) vs Hardware Destruction',
      source_scope: 'Act 4 / Chapter 3 / Scene 2: Local Execution',
      target_scope: 'Act 4 Hardware & Actuator Accountability',
      established_in_source: 'Current-sharing precursor triggered auxiliary zero and main bias dump. Node Four was placed PROTECTED OFFLINE; actuator contribution lost for remainder of event.',
      forbidden_in_target: 'Depicting Node Four as destroyed, burned out, or permanently obliterated coil assembly.',
      required_in_target: 'Distinguish: quench fault (occurred), actuator contribution (lost for event), protection (successful), coil assembly (survived with localized damage, repaired in Epilogue under restricted envelope).',
      status: 'OPEN',
    },
    {
      code: 'CAUSAL_HIERARCHY_ACT4_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'Four-Level Causal Hierarchy in G-DCL Intervention',
      source_scope: 'Act 4 / Chapter 4: What Changed When We Acted',
      target_scope: 'Act 4 & Future Volumes Causal Limits',
      established_in_source: 'Level 1: Directly Observed (actuator state changes, internal/external differences). Level 2: Strongly Supported Inference (intervention causally altered local physical response). Level 3: Model-Dependent. Level 4: Not Established (fundamental cosmic cause).',
      forbidden_in_target: 'Claiming direct observation of causality or discovery of the cosmic source.',
      required_in_target: 'Maintain the four-level causal hierarchy. Official statement: "A human-generated control intervention measurably altered local physical responses during an anomalous event that was already underway."',
      status: 'OPEN',
    },
    {
      code: 'CHARACTER_ARC_BOUNDARY_ACT4_001',
      project_id: proj.id,
      debt_type: 'CHARACTER_LENS',
      title: 'Act 4 Terminal Sentence vs Epilogue "I must control it" Allocation',
      source_scope: 'Act 4 / Chapter 4 / Scene 3: The Cost of Control',
      target_scope: 'Ian Yoo Terminal Arc for Book 1',
      established_in_source: 'Act 4 concludes with control capability established and ownership problem opened: "Someone would have to decide what reality was allowed to become."',
      forbidden_in_target: 'Placing the final personal commitment "I must control it" inside Act 4.',
      required_in_target: 'Ian\'s personal rationalization ladder and definitive commitment "I must control it" belongs strictly to the final line of the Epilogue.',
      status: 'OPEN',
    }
  ];

  for (const d of DEBTS) {
    const { error: dErr } = await supabase
      .from('series_debts')
      .upsert(d, { onConflict: 'code' });
    if (dErr) throw new Error(`Series debt upsert failed for ${d.code}: ${dErr.message}`);
  }
  console.log('6 Series Debts and Scope Audit Records registered successfully.\n');

  // 4. Create Additive Audit Amendment B1_PASS1_ACT4_001_A01
  const A01_CODE = 'B1_PASS1_ACT4_001_A01';
  console.log(`Creating Audit Amendment ${A01_CODE}...`);

  const { data: a01Run, error: a01Err } = await supabase
    .from('audit_runs')
    .upsert({
      code: A01_CODE,
      parent_audit_id: baseAudit.id,
      run_type: 'amendment',
      project_id: proj.id,
      source_snapshot_id: baseSnap.id,
      target_snapshot_id: targetSnap.id,
      pass_number: 1,
      scope_unit_id: act4Unit.id,
      scope_name: 'ACT 4: THE CANCELLATION HORIZON (A01 AMENDMENT)',
      criteria_version: '1.1.0',
      status: 'in_review',
      amendment_reason: 'G-DCL subterranean Geneva lattice definition, central latency chain clarification, separation of G-4A timing failure from centralized optimizer failure, Twenty-Three Minutes elapsed time distinction, Node Four protected offline status, Bounded Local Response Control claim precision, 4-level causal hierarchy, and reassigning "I must control it" to Epilogue.',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (a01Err) throw new Error(`Amendment creation failed: ${a01Err.message}`);
  console.log(`Amendment Run created: ${a01Run.code} (${a01Run.id})\n`);

  // 5. Update Act 4 Chapter Gates with Architect-Revised Questions & Answers
  console.log('Updating Act 4 Chapter Gates with Architect-Revised Answers...');
  const { data: ch1 } = await supabase.from('content_units').select('id').eq('source_path', 'act-7/ch-1').single();
  const { data: ch2 } = await supabase.from('content_units').select('id').eq('source_path', 'act-7/ch-2').single();
  const { data: ch3 } = await supabase.from('content_units').select('id').eq('source_path', 'act-7/ch-3').single();
  const { data: ch4 } = await supabase.from('content_units').select('id').eq('source_path', 'act-7/ch-4').single();

  const AMENDED_CHAPTER_GATES = [
    {
      chapter_unit_id: ch1.id,
      local_question: '서로 다른 센서·시간·하드웨어 이력을 가진 12개 node가 하나의 composite response를 만들면서도 각자의 안전 거부권을 유지할 수 있는가?',
      answer: '제네바 지하 G-DCL은 중앙에서 전달된 값을 직접 실행하는 체계가 아니라, 중앙의 supervisory target을 각 node가 자신의 국소 계측·하드웨어 margin·보호규칙에 따라 수락·제한·거부하는 체계로 동작한다. Node Seven의 의도적 wrong-state commissioning은 국소 오류 감지와 fallback이 중앙의 새로운 해법보다 먼저 작동할 수 있음을 보여준다. 어느 controller도 전체 시스템의 완전한 순간상태를 알지 못하며, distributed local authority는 global optimality보다 bounded safety를 우선한다.',
      larger_question: '자연현상이 global-state reconstruction보다 빠르게 변할 때, 중앙은 얼마의 실행권을 local nodes에 넘겨야 하는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — KEEP_REFRAME_COMPRESS (Target: 8,950 words, -17.7%).',
    },
    {
      chapter_unit_id: ch2.id,
      local_question: '실패한 첫 prospective prediction을 보존하면서, 더 약한 archived branch criterion을 사후조정 없이 실제 사건에 시험할 수 있는가?',
      answer: 'G-4A는 branch transition의 존재 가능성을 포착했지만 15–40분 timing window를 약 5분 벗어나 prospective failure로 기록된다. G-4B는 사건 이전 archive에 존재했던 더 약한 criterion이며, intervention 영향을 피하기 위해 external-only reduction으로 다시 고정된다. Criterion과 18–30분 window는 10:48:11에 봉인되고, 10:47:26의 sustained threshold 이후 23분 11초 만에 orientation-gradient criterion이 충족된다. 이는 G-4B의 제한적 prospective success이며 G-4A의 실패를 삭제하지 않는다.',
      larger_question: '유효하지만 부분적으로 틀린 모델을 사용하면서도, 과학적 검증과 안전개입을 어떻게 분리할 것인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — PREDICTION ATTRIBUTION AMENDMENT REQUIRED (Target: 8,600 words, -18.2%).',
    },
    {
      chapter_unit_id: ch3.id,
      local_question: '중앙집중형 optimizer가 변화하는 자연현상의 과거 상태를 최적화하기 시작할 때, local execution은 bounded region을 유지할 수 있으며 실제 node fault를 견딜 수 있는가?',
      answer: '중앙 optimizer는 더 깨끗한 central value를 계산하지만 local cross-coupling, gradient, hardware margin을 악화시키는 실행해법을 제안한다. 이후 fast authority가 local nodes로 이전되고, 각 node는 자신의 계측·margin·safe-state library에 따라 서로 다른 상태를 실행한다. Node Four의 protective quench로 한 actuator contribution이 사라지자 southeast sector가 악화되지만, 다른 nodes가 Four의 복귀 없이 국소적으로 재분배하여 emergency hardware envelope 안에서 bounded region을 유지한다. 원래 closure criterion은 한 sector에서 위반되었으며, 결과는 일반 one-node tolerance나 exact nodal cancellation을 확립하지 않는다.',
      larger_question: '복잡한 자연현상의 변화와 actuator intervention의 효과를 사후확신 없이 어떻게 인과적으로 분리할 것인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — REMOVE G-4A/CONTROL CONFLATION, REMOVE NODE-DESTRUCTION, REMOVE DIRECT NODAL-CANCELLATION (Target: 13,650 words, -17.8%).',
    },
    {
      chapter_unit_id: ch4.id,
      local_question: '불완전하고 변화하는 자연현상에서 intervention이 실제로 local response를 변화시켰다고 어디까지 말할 수 있으며, 그 능력은 어떤 권력 문제를 발생시키는가?',
      answer: 'blinded team analysis, 두 차례의 on/off intervention, Node Four contribution 상실, neighbor redistribution이라는 서로 다른 perturbation이 같은 인과 방향을 지지한다. 따라서 G-DCL actuation이 측정된 local response 일부를 인과적으로 변경했다는 강한 추론이 성립한다. 공식 결과는 bounded local response control이며 mechanism, spacetime control, gravity cancellation, common cause, planetary shield는 확립되지 않는다. 과학과 procurement 권한은 분리되고 local veto·multiple abort authority·mirrored archive가 제도화된다. Ian은 boundary가 geometry가 아니라 acceptable state를 선택하는 결정임을 깨닫지만, 개인적 통제 선언은 Epilogue에서 완성된다.',
      larger_question: '기술이 소형화되고 여러 국가·기업이 서로 다른 target state를 선택할 때, 누가 boundary를 소유하고 집행할 것인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — CAUSAL HIERARCHY PROTECTED, FINAL ARC LINE REASSIGNED TO EPILOGUE (Target: 14,080 words, -18.3%).',
    },
  ];

  for (const cg of AMENDED_CHAPTER_GATES) {
    const { error: cgErr } = await supabase
      .from('chapter_gates')
      .upsert({
        audit_run_id: baseAudit.id,
        chapter_unit_id: cg.chapter_unit_id,
        local_question: cg.local_question,
        answer: cg.answer,
        larger_question: cg.larger_question,
        verdict: cg.verdict,
        verdict_notes: cg.verdict_notes,
      }, { onConflict: 'audit_run_id,chapter_unit_id' });
    if (cgErr) throw new Error(`Chapter gate update failed: ${cgErr.message}`);
  }
  console.log('Act 4 Chapter Gates updated successfully.\n');

  // 6. Update Act 4 Scene Matrices & Proposals with Differentiated Editorial Ranges & Exact Boundaries
  console.log('Updating Act 4 Scene Matrices and Proposals with Differentiated Editorial Ranges...');
  const SCENE_AMENDMENTS = [
    {
      scene_unit_id: '49916110-98cb-511f-9c6f-6a9552fe7c17', // Ch 1 Sc 1: The Machine They Left Behind
      action: 'KEEP_REFRAME_COMPRESS',
      target_words: 5100,
      delta: -1360,
      compression_percent: 21.1,
      editorial_range: '4,900-5,250',
      protected_assets: [
        'Subterranean twelve-node Geneva Distributed Cancellation Lattice around bounded volume',
        'CICC superconductor cooling infrastructure and local dump resistors',
        'Sarah Hayes locks the independent multi-agency validation protocol before countdown',
      ],
      epistemic_boundary: {
        commissioned: '제네바 지하 12개 노드 분산 상쇄 격자(G-DCL) 물리 가동 (행성 규모 배치가 아님).',
        latency_chain: '중앙 지연은 단순 상대론적 전파 지연이 아니라 계측-정렬-상태추정-최적화-요청-국소검증-실행-물리응답 전 사슬에서 발생함.',
      },
    },
    {
      scene_unit_id: '4059051c-6515-5881-9e38-f50c32f5fd77', // Ch 1 Sc 2: Every Node Gets to Disagree
      action: 'KEEP_PROTECTED_LOCAL_AUTHORITY',
      target_words: 3800,
      delta: -613,
      compression_percent: 13.9,
      editorial_range: '3,700-3,950',
      protected_assets: [
        '“Every node gets to disagree with me.” — Distributed local safety and execution principle',
        '“If it’s locally unsafe, it isn’t globally executable.”',
        '“No omniscient controller.”',
        '“Simplicity was no longer the same thing as safety.”',
        'Node Seven intentional wrong-state commissioning: local error detection precedes central solution',
      ],
      epistemic_boundary: {
        local_execution_states: '각 노드는 중앙 요청을 ACCEPT, ACCEPT WITH SLEW LIMIT, ACCEPT WITH ORIENTATION MARGIN, REJECT - JOINT TREND LIMIT, ACCEPT WITH THERMAL DERATING 중 하나로 평가 실행함.',
      },
    },
    {
      scene_unit_id: '01389b2b-d9fc-5a63-b516-c9c7400ae336', // Ch 2 Sc 1: The First Warning
      action: 'KEEP_COMPRESS',
      target_words: 4850,
      delta: -1139,
      compression_percent: 19.0,
      editorial_range: '4,650-5,050',
      protected_assets: [
        'G-4A: branch correct / timing window failed (prospective failure preserved)',
        'Failure to satisfy either condition within the sealed window will count as a prospective failure',
        'No adjustment to the window or thresholds will be made during the event',
      ],
      epistemic_boundary: {
        g4a_failure: 'G-4A는 15-40분 예측창을 약 5분 초과하여 45분에 충족되었으므로 엄격한 prospective failure로 기록됨.',
      },
    },
    {
      scene_unit_id: '2caba919-0064-5339-8b2c-a64213ed3ca8', // Ch 2 Sc 2: Twenty-Three Minutes
      action: 'KEEP_PROTECTED_PREDICTION',
      target_words: 3700,
      delta: -819,
      compression_percent: 18.1,
      editorial_range: '3,550-3,850',
      protected_assets: [
        'Twenty-three minutes and eleven seconds. Inside an eighteen-to-thirty-minute window. Not predicted to the second.',
        'G-4B threshold sustained at 10:47:26, sealed at 10:48:11, satisfied at 11:10:37',
        'Scene title "Twenty-Three Minutes" is a rounded human/narrative label',
      ],
      epistemic_boundary: {
        elapsed_distinction: '23분은 입사 신호 카운트다운이 아니라, 임계 지속(10:47:26)부터 물리 기준 충족(11:10:37)까지의 경과 시간(23분 11초)임.',
      },
    },
    {
      scene_unit_id: 'c6f9393a-87c8-5a1a-bad3-83e957529282', // Ch 3 Sc 1: The Wrong Solution
      action: 'KEEP_REFRAME_COMPRESS',
      target_words: 5200,
      delta: -1509,
      compression_percent: 22.5,
      editorial_range: '5,000-5,400',
      protected_assets: [
        'The wrong solution was centralized global control optimization, NOT G-4A scientific prediction',
        '“The center is late. Then stop trying to make the center faster.”',
        '“More field is not necessarily more correction.”',
        'The wrong solution had not been a mathematical error. It had been the belief that the best global answer was always the best thing to execute.',
      ],
      epistemic_boundary: {
        optimizer_failure: '중앙 해법은 중심부 각도를 낮추려다 경사 마진과 로컬 안전 엔벨로프를 침범하는 오류를 범함 (적극 압축 22.5%).',
      },
    },
    {
      scene_unit_id: 'd85c990f-cf14-5fc7-b8f7-a69b7604e2cc', // Ch 3 Sc 2: Local Execution
      action: 'KEEP_PROTECTED_EXECUTION',
      target_words: 4400,
      delta: -737,
      compression_percent: 14.3,
      editorial_range: '4,300-4,550',
      protected_assets: [
        'FAIL SILENT / PROTECTED OFFLINE',
        'FAST AUXILIARY: ZERO / MAIN BIAS DUMP',
        'Node Four protective quench: contribution lost for event, but coil assembly survived (later repaired in Epilogue under restricted envelope)',
        'Single-node loss did not destroy bounded controlled region under this event; does not establish general single-node tolerance',
      ],
      epistemic_boundary: {
        quench_status: '노드 4는 파괴된 것이 아니라 마그넷 보호를 위해 안전 격리된 상태임 (quench fault 발생, actuator 상실, protection 성공, coil 보존).',
      },
    },
    {
      scene_unit_id: '94a9a8c3-f6ce-5ddb-8d5c-a474e52586f0', // Ch 3 Sc 3: The Boundary Holds
      action: 'KEEP_PROTECTED_HARDWARE',
      target_words: 4200,
      delta: -560,
      compression_percent: 11.8,
      editorial_range: '4,100-4,350',
      protected_assets: [
        'External ~98-degree deflection vs Internal ~13-14-degree residual across distinct measurement sectors',
        'Southeast sector reached ~15.1° (violating original commissioning envelope, held within temporary 16° emergency envelope)',
        '“The boundary held.”',
        'BOUNDED LOCAL RESPONSE CONTROL (Official Result, not direct nodal divergence exact cancellation)',
      ],
      epistemic_boundary: {
        result_name: '자연현상에서의 공식 결과는 BOUNDED LOCAL RESPONSE CONTROL이며, Paper I의 극한 상쇄(-1/r^2 vs +1/r^2)를 직접 계측한 것이 아님.',
      },
    },
    {
      scene_unit_id: '60aad8d4-2589-59a8-ac55-bc42605db7ae', // Ch 4 Sc 1: What Changed When We Acted
      action: 'KEEP_COMPRESS_CAUSAL_AUDIT',
      target_words: 4750,
      delta: -1257,
      compression_percent: 20.9,
      editorial_range: '4,550-4,950',
      protected_assets: [
        'EXECUTED CONTROL REPRESENTATION, Not COUNTER-FIELD TRUTH',
        'INSIDE != OUTSIDE IS NOT ENOUGH / BEFORE != AFTER IS NOT ENOUGH',
        'Level 2 Strongly Supported Inference: intervention causally modified part of local physical response',
        'Level 4 Not Established: fundamental cosmic cause, topological rupture, planetary scalability',
      ],
      epistemic_boundary: {
        causal_audit: '인과 개입은 직접 관측이 아니라 4단계 위계 중 Level 2(강하게 지지된 추론)에 해당함.',
      },
    },
    {
      scene_unit_id: 'c5df358b-d927-523e-b8f5-f7c256cfcf9b', // Ch 4 Sc 2: The First Thing We Can Say
      action: 'KEEP_COMPRESS_PROTECTED_CLAIM',
      target_words: 3750,
      delta: -1016,
      compression_percent: 21.3,
      editorial_range: '3,550-3,900',
      protected_assets: [
        '“A human-generated control intervention measurably altered local physical responses during an anomalous event that was already underway before actuation.”',
        'During pre-defined diagnostic interventions, primary observables changed in corrective direction',
        'Refusal of spacetime torsion, gravity cancellation, common cause, or approaching front claims',
      ],
      epistemic_boundary: {
        official_statement: '성명은 관측된 국소 물리 반응 변경과 잔차 존재만을 기술하며, 우주론적 승리 선언을 엄격히 금지함.',
      },
    },
    {
      scene_unit_id: '50b43df2-df3b-5165-99a7-e52f63814e43', // Ch 4 Sc 3: The Cost of Control
      action: 'KEEP_PROTECTED_ARC',
      target_words: 5530,
      delta: -932,
      compression_percent: 14.4,
      editorial_range: '5,400-5,800',
      protected_assets: [
        '“A boundary is not only geometry. It is a decision.”',
        '“The cost of control includes knowing when you do not have it.”',
        '“Before Geneva, the anomaly was a fact about nature. Now control is a fact about us.”',
        '“Someone would have to decide what reality was allowed to become.” (Act 4 Terminal Sentence)',
        'Father Yoo Ji-man silver compass recalled: the cost of holding a direction against the void',
      ],
      epistemic_boundary: {
        act4_terminal_arc: 'Act 4의 마지막 문장은 "Someone would have to decide what reality was allowed to become."이며, 개인적 결단 "I must control it"은 에필로그의 최종 문장으로 귀속됨.',
      },
    },
  ];

  for (const sa of SCENE_AMENDMENTS) {
    const updateData: any = {};
    if (sa.protected_assets) updateData.protected_assets = sa.protected_assets;
    if (sa.epistemic_boundary) updateData.epistemic_boundary = sa.epistemic_boundary;
    updateData.action = sa.action.includes('REFRAME') ? 'Reframe' : 'Compress';
    updateData.compression_target_words = sa.target_words;
    updateData.compression_target_percent = sa.compression_percent;
    updateData.notes = `Fine-grained action: ${sa.action} | Editorial Range: ${sa.editorial_range}`;

    const { error: smErr } = await supabase
      .from('scene_matrices')
      .update(updateData)
      .eq('snapshot_id', baseSnap.id)
      .eq('scene_unit_id', sa.scene_unit_id);
    if (smErr) throw new Error(`Scene Matrix update failed for ${sa.scene_unit_id}: ${smErr.message}`);

    let propAction = 'KEEP_COMPRESS';
    if (sa.action.includes('REFRAME')) propAction = 'KEEP_REFRAME_COMPRESS';
    else if (sa.action.includes('PROTECTED')) propAction = 'KEEP_COMPRESS_PROTECTED';

    const { error: scpErr } = await supabase
      .from('structure_change_proposals')
      .update({
        action: propAction,
        target_word_count: sa.target_words,
        projected_word_delta: sa.delta,
        target_compression_percent: sa.compression_percent,
        dependency_notes: `Fine-grained: ${sa.action} | Differentiated range: ${sa.editorial_range}`,
      })
      .eq('audit_run_id', baseAudit.id)
      .eq('scene_unit_id', sa.scene_unit_id);
    if (scpErr) throw new Error(`Proposal update failed for ${sa.scene_unit_id}: ${scpErr.message}`);
  }
  console.log('Act 4 Scene Matrices and Proposals updated with differentiated editorial targets.\n');

  // 7. Calculate SHA-256 Amendment Hash and Lock B1_PASS1_ACT4_001_A01
  console.log('Calculating A01 Amendment Hash and locking B1_PASS1_ACT4_001_A01...');
  const a01Payload = JSON.stringify({
    parent_audit: baseAudit.code,
    amendment_code: A01_CODE,
    repetition_debt: 'REPETITION_DEBT_ACT4_POST_EVENT_ANALYSIS_001',
    series_debts: DEBTS.map(d => d.code),
    gates: AMENDED_CHAPTER_GATES,
    scene_amendments: SCENE_AMENDMENTS,
    total_target: 45280,
  });

  const a01Hash = crypto.createHash('sha256').update(a01Payload).digest('hex');

  const { error: lockErr } = await supabase
    .from('audit_runs')
    .update({
      status: 'locked',
      audit_hash: a01Hash,
      locked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', a01Run.id);

  if (lockErr) throw new Error(`A01 locking failed: ${lockErr.message}`);

  console.log('===========================================================');
  console.log(' PASS 1 ACT 4 AUDIT AMENDMENT A01 LOCKED SUCCESSFULLY!     ');
  console.log('===========================================================');
  console.log(`Amendment Code: ${A01_CODE}`);
  console.log(`Parent Audit Code: ${baseAudit.code}`);
  console.log(`A01 Hash (SHA-256): ${a01Hash}`);
  console.log(`Status: LOCKED (Act 4 Differentiated Ranges & Scientific Metadata Aligned)`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
