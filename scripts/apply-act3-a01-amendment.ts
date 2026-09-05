import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are strictly required for admin operations.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log('=== PASS 1 ACT 3 AUDIT AMENDMENT A01 RUNNER ===\n');

  // 1. Fetch Project, Snapshots and Base Audit
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: baseAudit } = await supabase.from('audit_runs').select('*').eq('code', 'B1_PASS1_ACT3_001').single();
  const { data: act3Unit } = await supabase.from('content_units').select('id').eq('source_path', 'act-6').single();

  if (!baseAudit) throw new Error('Base audit B1_PASS1_ACT3_001 not found.');
  console.log(`Base Audit: ${baseAudit.code} (${baseAudit.id}) - Status: ${baseAudit.status}`);

  // 2. Register Repetition Debt: REPETITION_DEBT_ACT3_DISASTER_PATTERN_001
  console.log('Registering Repetition Debt REPETITION_DEBT_ACT3_DISASTER_PATTERN_001...');
  const { error: repErr } = await supabase
    .from('repetition_debts')
    .upsert({
      code: 'REPETITION_DEBT_ACT3_DISASTER_PATTERN_001',
      source_scope: 'Pacific / Seoul / Flight 702',
      target_scope: 'Act 3 Narrative Rhythm & Compression',
      description: 'Three disaster chapters share an identical algorithmic structure: baseline -> first anomaly -> cross-check -> conventional exclusion -> escalation -> cautious report -> Denver comparison.',
      recommended_action: 'Pacific focuses on sound/pressure sensor mediation; Seoul focuses on structural load and height-dependent gradient; Flight 702 moves at fast operational speed prioritizing air data and crew survival.',
      status: 'OPEN',
    }, { onConflict: 'code' });

  if (repErr) throw new Error(`Repetition debt failed: ${repErr.message}`);
  console.log('Repetition Debt registered: REPETITION_DEBT_ACT3_DISASTER_PATTERN_001 (Status: OPEN)\n');

  // 3. Register Act 3 Series Debts
  console.log('Registering Act 3 Series Debts...');
  const DEBTS = [
    {
      code: 'EPISTEMIC_DEBT_ACT3_ACOUSTIC_RANGE_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'Acoustic Travel Time vs Range and Distance Disappearance',
      source_scope: 'Act 3 / Chapter 1: The Soaring Sea',
      target_scope: 'Act 3 Manuscript Guidance',
      established_in_source: 'Anomalously reduced acoustic travel times preceded loss of coherent long-path ranging; deep vehicles rose; differential pressure collapsed.',
      forbidden_in_target: 'Converting travel-time loss into literal physical distance disappearance or global gravity inversion.',
      required_in_target: 'Distinguish observed acoustic travel time from model-inferred effective path shortening. Keep event classification as Acoustic Void, Cause Unknown.',
      status: 'OPEN',
    },
    {
      code: 'EPISTEMIC_DEBT_ACT3_FRAME_TRANSPORT_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'Spatial Gradient vs Peak Angle in Seoul Support-Direction Shift',
      source_scope: 'Act 3 / Chapter 2: Topological Torsion',
      target_scope: 'Act 3 & Act 4 Controller Architecture',
      established_in_source: 'Best-instrumented upper floor reached ~177.8 degrees; structural gyros showed no macroscopic rigid-body rotation; damage correlated with spatial gradient, not peak angle.',
      forbidden_in_target: 'Claiming critical saturation at exact 180 degrees or physical building rotation.',
      required_in_target: 'Model C Local Frame-Transport is model-inferred and post-hoc. Controller must manage orientation and spatial gradient, not merely magnitude.',
      status: 'OPEN',
    },
    {
      code: 'EPISTEMIC_DEBT_ACT3_MISSING_MILLISECOND_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'Flight 702 Continuity Distinction (Surveillance Gap vs Transit Time)',
      source_scope: 'Act 3 / Chapter 3: Flight 702',
      target_scope: 'Act 3 Aviation Forensics',
      established_in_source: '475 ms was surveillance/report interval; <1 ms was GNSS receiver solution window; onboard time and dynamics remained continuous within instrument resolution.',
      forbidden_in_target: 'Treating 475 ms or 1 ms as physical transit times, claiming perfect velocity continuity, or labeling event as teleportation / time-travel.',
      required_in_target: 'Maintain identity continuity as strong but initially incomplete; preserve approximate dynamical state transport.',
      status: 'OPEN',
    },
    {
      code: 'NARRATIVE_LABEL_AUDIT_ACT3_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'Narrative and Dramatic Title Separation from Scientific Claims',
      source_scope: 'Act 3 Titles and Labels',
      target_scope: 'Revision Platform Audit System',
      established_in_source: 'Titles like "The Water That Fell Upward", "One Hundred Eighty Degrees", and "The Missing Millisecond" are human metaphors and media labels.',
      forbidden_in_target: 'Allowing dramatic titles to be treated as verified scientific mechanism statements in audit records.',
      required_in_target: 'Audit records must explicitly expose the distinction between literary labels and measured quantities.',
      status: 'OPEN',
    },
    {
      code: 'CHARACTER_ARC_BOUNDARY_ACT3_001',
      project_id: proj.id,
      debt_type: 'CHARACTER_LENS',
      title: 'Ian Yoo Epistemic Restraint vs Unrelinquished Control Ambition',
      source_scope: 'Act 3 / Chapter 4 / Scene 1: I Don\'t Know',
      target_scope: 'Ian Character Arc across Series',
      established_in_source: 'Ian admits evidential limits ("I don\'t know"), but converts ignorance into design requirements and future control architecture.',
      forbidden_in_target: 'Depicting Ian as reaching philosophical humility or "letting go" before Book IV.',
      required_in_target: 'Maintain the Truth -> Control progression: Ian embraces epistemic restraint specifically to build a stronger control architecture.',
      status: 'OPEN',
    },
    {
      code: 'GOVERNANCE_PROTECTION_ACT3_MANDATE_001',
      project_id: proj.id,
      debt_type: 'SERIES_BRIDGE',
      title: 'The Mandate Strict Five Workstreams vs Shield Authorization',
      source_scope: 'Act 3 / Chapter 4 / Scene 2: The Mandate',
      target_scope: 'Act 4 Governance & Institutional Operations',
      established_in_source: 'The Mandate authorizes 5 specific workstreams: observation, replication, distributed prototypes, industrial capacity, and Odysseus study.',
      forbidden_in_target: 'Claiming orbital launch authority, planetary shield deployment, final node count, or common cosmic causation in Act 3.',
      required_in_target: 'Preserve Sarah Hayes independent validation co-chair structure and Sterling science/procurement separation.',
      status: 'OPEN',
    }
  ];

  for (const d of DEBTS) {
    const { error: dErr } = await supabase
      .from('series_debts')
      .upsert(d, { onConflict: 'code' });
    if (dErr) throw new Error(`Series debt upsert failed for ${d.code}: ${dErr.message}`);
  }
  console.log('6 Act 3 Series Debts registered successfully.\n');

  // 4. Create Additive Audit Amendment B1_PASS1_ACT3_001_A01
  const A01_CODE = 'B1_PASS1_ACT3_001_A01';
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
      scope_unit_id: act3Unit.id,
      scope_name: 'ACT 3: WHEN THE SKY LOSES ITS RULES (A01 AMENDMENT)',
      criteria_version: '1.1.0',
      status: 'in_review',
      amendment_reason: 'Acoustic travel-time vs distance separation, removal of Seoul critical saturation, gradient vs peak angle damage correlation, Flight 702 recorded onboard continuity vs surveillance gap, narrative labels separation, power shift governance metadata, and compression rebalancing.',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (a01Err) throw new Error(`Amendment creation failed: ${a01Err.message}`);
  console.log(`Amendment Run created: ${a01Run.code} (${a01Run.id})\n`);

  // 5. Update Act 3 Chapter Gates with Architect-Revised Questions & Answers
  console.log('Updating Act 3 Chapter Gates with Architect-Revised Answers...');
  const { data: ch1 } = await supabase.from('content_units').select('id').eq('source_path', 'act-6/ch-1').single();
  const { data: ch2 } = await supabase.from('content_units').select('id').eq('source_path', 'act-6/ch-2').single();
  const { data: ch3 } = await supabase.from('content_units').select('id').eq('source_path', 'act-6/ch-3').single();
  const { data: ch4 } = await supabase.from('content_units').select('id').eq('source_path', 'act-6/ch-4').single();

  const AMENDED_CHAPTER_GATES = [
    {
      chapter_unit_id: ch1.id,
      local_question: '어떤 독립 관측들이 기존 음향·압력·부력·수면 모델을 동시에 흔들며, travel time에서 physical distance 또는 gravity mechanism으로 어디까지 추론할 수 있는가?',
      answer: '비정상적으로 짧은 음향 travel time이 long-path ranging 붕괴보다 먼저 나타나고, 이후 심해 장비의 상승, 차등 압력구배의 붕괴·부분 역전, 현수하중 감소, apparent acceleration-direction 변화, kilometer-scale 수면변형이 기록된다. 이 자료는 effective path shortening 및 altered force balance와 양립하지만 물리적 거리 소멸이나 중력 자체의 반전을 직접 확립하지 않는다.',
      larger_question: '태평양에서 나타난 propagation -> support/acceleration 순서가 Denver의 실험순서와 공통 동역학을 갖는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — CLAIM PRECISION AMENDMENT REQUIRED (Target: 10,100 words, -17.5%).',
    },
    {
      chapter_unit_id: ch2.id,
      local_question: '건물 material frame이 거의 회전하지 않은 상태에서 apparent local support direction이 거의 역전될 수 있으며, 구조손상은 절대 각도와 spatial gradient 중 어느 쪽에 더 대응하는가?',
      answer: 'best-instrumented 상층부의 apparent support direction은 약 177.8도까지 이동하지만 정확한 공통 180도 상태는 확립되지 않는다. structural gyros와 survey는 이에 대응하는 macroscopic rigid-body rotation을 기록하지 않으며, bonded structure와 free object의 반응도 단순 rotated-gravity model과 다르다. 주요 구조손상은 peak angle보다 spatial gradient에 더 강하게 대응한다. Local frame-transport model은 이러한 자료와 양립하지만 model-inferred이고 post-hoc이다.',
      larger_question: 'Act 4의 controller는 magnitude뿐 아니라 orientation과 spatial gradient를 어떻게 제어할 것인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — REMOVE SATURATION CLAIM / PROTECT GRADIENT RESULT (Target: 10,300 words, -19.8%).',
    },
    {
      chapter_unit_id: ch3.id,
      local_question: '동일한 항공기가 두 멀리 떨어진 위치에서 확인되고 내부 시간·동역학 상태가 연속된 경우, 어떤 종류의 discontinuity가 실제로 관측되었는가?',
      answer: '두 독립 GNSS receiver, space-based ADS-B, terrestrial·primary radar와 착륙 후 serial identification은 동일 항공기가 Atlantic-compatible 위치에서 Alpine-compatible 위치로 바뀐 것을 지지한다. onboard time, attitude, acceleration, engine state는 계측 해상도 내에서 연속적이며 기록된 conventional acceleration이나 중간 airspace occupation은 없다. 그러나 475ms surveillance gap과 sub-millisecond receiver update는 transit time이 아니며, connectivity change와 approximate dynamical-state transport는 경쟁 모델일 뿐이다.',
      larger_question: '위치 연속성과 국소 동역학 연속성이 분리될 수 있는 기하학을 통제 실험으로 재현할 수 있는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — REMOVE "PERFECT CONTINUITY" (Target: 8,250 words, -15.1%).',
    },
    {
      chapter_unit_id: ch4.id,
      local_question: '공통 원인이 확립되지 않은 여러 재난을 바탕으로 사회는 무엇을 정당하게 준비할 수 있으며, 누가 검증·조달·실행 권한을 가져야 하는가?',
      answer: '공개 세션은 Pacific, Seoul, Flight 702가 넓은 reduced geometric-response family와 양립할 가능성만을 인정하고 common cause, Geneva causation, hostile action, approaching rupture front를 미확정으로 남긴다. Mandate는 관측·보존, 독립복제, 지상 다중노드 prototype, 산업능력, Odysseus system study를 승인하지만 shield deployment, orbital construction, final node count는 승인하지 않는다. Sarah는 독립 과학검증 구조를 이끌고, science와 procurement authority는 분리되며 Vance의 산업권한도 제한된다.',
      larger_question: '제한된 Mandate가 Act 4에서 실제 12-node system 구축과 시험으로 넘어갈 때, 연구 프로그램은 어떻게 자기정당화와 중앙권력화를 피할 것인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — GOVERNANCE AND POWER-SHIFT METADATA REQUIRED (Target: 9,350 words, -17.7%).',
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
  console.log('Act 3 Chapter Gates updated successfully.\n');

  // 6. Update Act 3 Scene Matrices & Proposals with Differentiated Targets & Exact Epistemic Boundaries
  console.log('Updating Act 3 Scene Matrices and Proposals with Differentiated Editorial Targets...');
  const SCENE_AMENDMENTS = [
    {
      scene_unit_id: '3cd61722-ba44-519a-ab74-931c9cd4be48', // Sc 1: The Acoustic Void
      action: 'KEEP_COMPRESS',
      target_words: 5050,
      delta: -1139,
      compression_percent: 18.4,
      editorial_range: '4,900-5,150',
      protected_assets: [
        '“Then don’t convert travel time to range.”',
        '“Travel time is observed. Effective path shortening is an interpretation.”',
        'EVENT CLASSIFICATION: ACOUSTIC VOID / CAUSE: UNKNOWN',
        'POSSIBLE ANALOGY TO DENVER SEQUENCE. NOT YET A MATCH.',
      ],
      epistemic_boundary: {
        observed: '비정상적으로 단축된 음향 travel time이 long-path coherent ranging 붕괴보다 먼저 나타남.',
        distinction: 'Observed travel time vs Model-inferred effective path shortening.',
        forbidden_conclusion: '“거리가 사라졌다(distance disappeared)”는 현장 문구를 문자 그대로의 물리적 거리 소멸로 단정하는 것.',
      },
    },
    {
      scene_unit_id: 'a2322291-b735-5e33-a216-2d7d7ce34efa', // Sc 2: The Water That Fell Upward
      action: 'KEEP_COMPRESS_PROTECTED_VISUAL',
      target_words: 5050,
      delta: -995,
      compression_percent: 16.5,
      editorial_range: '4,950-5,150',
      protected_assets: [
        'Mori observation ethics and forensic oceanographic data preservation',
        '“It behaved as though down had moved.” — Phenomenological description, not mechanism claim',
        'MULTI-INSTRUMENT SPATIOTEMPORAL ANOMALY / CAUSE: UNKNOWN',
      ],
      epistemic_boundary: {
        narrative_label: 'The Water That Fell Upward (Metaphor / Public Memory, NOT a mechanism claim).',
        observed: '국소 수직 기둥을 따른 대규모 해수 상승 및 차등 수압구배 부분 역전.',
        forbidden_conclusion: '지구 중력이 실제로 역전되었다는 물리적 결론 선언.',
      },
    },
    {
      scene_unit_id: '16754633-1e03-53c3-94cf-ebfec4095244', // Sc 3: The Rotating Vertical
      action: 'KEEP_REFRAME_COMPRESS',
      target_words: 5550,
      delta: -1576,
      compression_percent: 22.1,
      editorial_range: '5,400-5,700',
      protected_assets: [
        '“Rotation of apparent local vertical relative to the material frame.”',
        'No corresponding macroscopic rigid-body rotation of columns, core, or foundation',
        'Civilian evacuation and living skyscraper technical response',
      ],
      epistemic_boundary: {
        observed: '진자 및 경사계의 겉보기 수직선(apparent vertical)이 편향됨.',
        material_frame: '구조 자이로와 측량 기준선은 기저선 부근을 유지함 (기초의 거시적 강체 회전 없음).',
        compression_rationale: '가장 비대한 7,126단어 구간에서 반복적인 층별 상승 묘사를 적극 압축 (22.1% 감축).',
      },
    },
    {
      scene_unit_id: 'e14e31b9-b61a-5675-a7e7-bea56b657e21', // Sc 4: One Hundred Eighty Degrees
      action: 'KEEP_COMPRESS_PROTECTED_MODEL',
      target_words: 4750,
      delta: -966,
      compression_percent: 16.9,
      editorial_range: '4,650-4,900',
      protected_assets: [
        '“One hundred eighty degrees was a human number attached to a spatially extended event.”',
        '“Peak angle isn’t peak structural stress. Gradient. Looks like it.”',
        'MODEL C — LOCAL FRAME-TRANSPORT MODEL (MODEL-INFERRED / POST-HOC)',
        'A protective field must control orientation and spatial gradient, not merely magnitude',
      ],
      epistemic_boundary: {
        best_measurement: '상층부 재구성 최대값은 약 177.8도 (계통 불확실성 포함). 정확한 공통 180도 벡터는 미확립.',
        gradient_finding: '구조적 손상은 최대 각도(peak angle)보다 공간적 기울기(spatial gradient)에 더 강하게 상관됨.',
        removed_error: '“임계 포화(critical saturation)” 표현 삭제.',
      },
    },
    {
      scene_unit_id: 'b21394bd-4deb-5709-bdef-68bfe608c0b0', // Sc 5: The Missing Millisecond
      action: 'KEEP_REFRAME_COMPRESS',
      target_words: 4350,
      delta: -991,
      compression_percent: 18.6,
      editorial_range: '4,250-4,500',
      protected_assets: [
        'GNSS RAW-SOLUTION TRANSITION OCCURS WITHIN ONE RECEIVER UPDATE INTERVAL (<1 ms). THIS DOES NOT MEASURE PHYSICAL TRANSIT TIME.',
        'Aircraft internal clocks remain continuous across the event within recorded resolution. Position observables do not.',
        'No observation showed Flight 702 occupying the intervening airspace.',
        'The physical mechanism responsible for the position discontinuity is unknown.',
      ],
      epistemic_boundary: {
        surveillance_gap: '475 ms는 마지막 대서양 리포트와 첫 알프스 리포트 사이의 감시 공백이지 transit time이 아님.',
        receiver_window: '<1 ms는 GNSS 수신기 솔루션 전이 구간이지 물리적 이동 시간이 아님.',
        continuity_correction: '“완벽한 국소 연속성” ➔ 기록된 기내 시간 및 주요 동역학 상태의 계측 해상도 내 연속성으로 교정.',
      },
    },
    {
      scene_unit_id: 'e19c5aa4-489b-58f4-987c-0d47986fca73', // Sc 6: Mont Blanc
      action: 'KEEP_PROTECTED_COMPRESS',
      target_words: 3900,
      delta: -476,
      compression_percent: 10.9,
      editorial_range: '3,800-4,000',
      protected_assets: [
        '“The airplane is still flying. Exactly.”',
        'Approximate dynamical-state continuity after reference-frame transformation',
        'Normal physical aerodynamic hazards (air density, dynamic pressure, terrain) follow event',
        'Airframe, engine, and avionics serial confirmation after landing',
      ],
      epistemic_boundary: {
        velocity_status: '기준틀 변환 후 대략적인 동역학 상태 연속성과 호환 (완전한 4차원 속도 보존이나 순간이동 증명이 아님).',
        compression_rationale: '인간적·운항적 위기 극복의 클라이맥스이므로 가장 보수적 압축(10.9%) 적용.',
      },
    },
    {
      scene_unit_id: '0716d7fd-9261-546f-bcef-53d4b734f388', // Sc 7: I Don't Know
      action: 'KEEP_COMPRESS_PROTECTED_ARC',
      target_words: 4750,
      delta: -725,
      compression_percent: 13.2,
      editorial_range: '4,650-4,900',
      protected_assets: [
        '“Three disasters do not become one theory because we are frightened by all three.”',
        '“Similarity is not causation. Temporal proximity is not causation. Mathematical compatibility is not causation.”',
        '“I don’t know.”',
        'Ian character arc: Truth -> Control. Ignorance converted into measurement standards and control architecture.',
      ],
      epistemic_boundary: {
        character_stance: 'Ian은 불확실성을 인정하지만 포기(humility/let go)한 것이 아니며, 이를 더 엄격한 통제 시스템의 설계 요건으로 전환함.',
        isolation: 'Pacific, Seoul, Flight 702를 단일 원인으로 조기 통합하지 않음.',
      },
    },
    {
      scene_unit_id: 'd0eff232-cc3f-5e60-980d-5dfe8a993a7f', // Sc 8: The Mandate
      action: 'KEEP_REFRAME_COMPRESS',
      target_words: 4600,
      delta: -1291,
      compression_percent: 21.9,
      editorial_range: '4,500-4,750',
      protected_assets: [
        '“The mandate is not to build twelve satellites.”',
        'ANOMALOUS GEOMETRY PREPAREDNESS PROGRAM (5 Workstreams: Observation, Replication, Prototypes, Industry, Study)',
        'No full deployment. No orbital launch procurement. No planetary shield declaration. No claim of common causation.',
        'Sarah Hayes: Validation Co-Chair. Arthur Sterling: Science/Procurement separation. Marcus Vance: Information leverage without unilateral allocation.',
        'ODYSSEUS — STUDY ONLY',
      ],
      epistemic_boundary: {
        mandate_boundary: 'Mandate는 행성 방어막 구축을 승인하지 않으며, 단계적 관측·연구 프로토타입만을 승인함.',
        compression_rationale: '행정·예산·기관 협의의 반복적 서술을 대폭 압축하여 5개 워크스트림과 권력 이동을 선명하게 부각 (21.9% 감축).',
      },
    },
  ];

  let twBaseline = 0;
  let twTarget = 0;

  for (const sa of SCENE_AMENDMENTS) {
    twBaseline += sa.target_words;
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

    // Map to valid proposal action
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
  console.log('Act 3 Scene Matrices and Proposals updated with differentiated targets.\n');

  // 7. Calculate SHA-256 Amendment Hash and Lock B1_PASS1_ACT3_001_A01
  console.log('Calculating A01 Amendment Hash and locking B1_PASS1_ACT3_001_A01...');
  const a01Payload = JSON.stringify({
    parent_audit: baseAudit.code,
    amendment_code: A01_CODE,
    repetition_debt: 'REPETITION_DEBT_ACT3_DISASTER_PATTERN_001',
    series_debts: DEBTS.map(d => d.code),
    gates: AMENDED_CHAPTER_GATES,
    scene_amendments: SCENE_AMENDMENTS,
    total_target: 38000,
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
  console.log(' PASS 1 ACT 3 AUDIT AMENDMENT A01 LOCKED SUCCESSFULLY!     ');
  console.log('===========================================================');
  console.log(`Amendment Code: ${A01_CODE}`);
  console.log(`Parent Audit Code: ${baseAudit.code}`);
  console.log(`A01 Hash (SHA-256): ${a01Hash}`);
  console.log(`Status: LOCKED (Act 3 Differentiated Targets & Epistemic Boundaries Aligned)`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
