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
  console.log('=== PASS 1 SCENE INVENTORY SEEDER: ACT 4 (THE CANCELLATION HORIZON) ===\n');

  // 1. Fetch Project, Snapshots and Act 4 Unit
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: act4Unit } = await supabase.from('content_units').select('id').eq('source_path', 'act-7').single();

  if (!act4Unit) throw new Error('Act 4 unit (act-7) not found.');

  // 2. Create Audit Run B1_PASS1_ACT4_001
  const AUDIT_CODE = 'B1_PASS1_ACT4_001';
  console.log(`Creating Audit Run ${AUDIT_CODE}...`);

  const { data: auditRun, error: arErr } = await supabase
    .from('audit_runs')
    .upsert({
      code: AUDIT_CODE,
      project_id: proj.id,
      source_snapshot_id: baseSnap.id,
      target_snapshot_id: targetSnap.id,
      pass_number: 1,
      scope_unit_id: act4Unit.id,
      scope_name: 'ACT 4: THE CANCELLATION HORIZON',
      criteria_version: '1.0.0',
      status: 'in_review',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (arErr) throw new Error(`Audit run creation failed: ${arErr.message}`);
  console.log(`Audit Run created: ${auditRun.code} (${auditRun.id})\n`);

  // 3. Act 4 10 Canonical Scenes Definition
  const ACT4_SCENES = [
    {
      scene_unit_id: '49916110-98cb-511f-9c6f-6a9552fe7c17', // Ch 1 Sc 1: The Machine They Left Behind
      title: '[Scene 1: The Machine They Left Behind]',
      pov: 'Ian Yoo',
      local_question: 'Geneva 복귀 후 가동되는 대형 콜라이더 인프라와 지상 12개 노드 분산 시스템의 물리적 실체가 공학적으로 엄밀하게 렌더링되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 6460,
      target_words: 5300,
      delta: -1160,
      compression_percent: 18.0,
      editorial_range: '5,100-5,450',
      protected_status: 'Structural',
      protected_assets: [
        'The physical commissioning of the twelve-node G-DCL terrestrial network',
        'CICC superconductor cooling infrastructure, vacuum lines, and local dump resistors',
        'Sarah Hayes locks the independent multi-agency validation protocol before countdown',
      ],
      epistemic_boundary: {
        commissioned: '지상 12개 노드 분산 기하 제어 라인(G-DCL)이 물리적으로 구축·가동됨.',
        limitations: '12개 노드는 전지전능하거나 순간적인 완벽한 행성 차폐막이 아니며, 국소 제어 지연과 공학적 한계를 지님.',
      },
    },
    {
      scene_unit_id: '4059051c-6515-5881-9e38-f50c32f5fd77', // Ch 1 Sc 2: Every Node Gets to Disagree
      title: '[Scene 2: Every Node Gets to Disagree]',
      pov: 'Sarah Hayes & Distributed Station Engineers',
      local_question: '중앙 집중식 단일 명령 체계의 불가능성과 각 노드의 국소적 판단 및 거부권(local execution and veto)이 시스템 생존 원칙으로 확립되는가?',
      action: 'KEEP_COMPRESS_PROTECTED',
      baseline_words: 4413,
      target_words: 3650,
      delta: -763,
      compression_percent: 17.3,
      editorial_range: '3,500-3,800',
      protected_status: 'Canon',
      protected_assets: [
        '“Every node gets to disagree.” — Distributed local safety and execution principle',
        'No controller may know the complete instantaneous planetary state',
        'Autonomous quench-protection FPGA override authority at each node',
      ],
      epistemic_boundary: {
        architectural_rule: '중앙 컨트롤러는 즉각적인 행성 전체 상태를 알 수 없으며(상대론적 인과 한계), 각 노드는 로컬 마그넷 안전을 위해 중앙 요구 상태를 거부할 수 있음.',
      },
    },
    {
      scene_unit_id: '01389b2b-d9fc-5a63-b516-c9c7400ae336', // Ch 2 Sc 1: The First Warning
      title: '[Scene 1: The First Warning]',
      pov: 'Ian Yoo, Sarah Hayes, Global Monitoring',
      local_question: '다가오는 거시 기하학적 섭동의 사전 경보가 사전 밀봉된(pre-sealed) 예측 창과 성공 기준에 의해 정직하게 검증되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 5989,
      target_words: 4900,
      delta: -1089,
      compression_percent: 18.2,
      editorial_range: '4,750-5,050',
      protected_status: 'Canon',
      protected_assets: [
        'Pre-sealed prospective prediction window and quantitative criteria logged before arrival',
        'G-4A initial prediction parameters vs incoming astronomical signature',
      ],
      epistemic_boundary: {
        prediction_rigor: '사후 끼워맞추기가 아닌 사전 등록된 예측 윈도우 프로토콜이 엄격히 준수됨.',
      },
    },
    {
      scene_unit_id: '2caba919-0064-5339-8b2c-a64213ed3ca8', // Ch 2 Sc 2: Twenty-Three Minutes
      title: '[Scene 2: Twenty-Three Minutes]',
      pov: 'Control Room Personnel & Ian Yoo',
      local_question: '23분의 리드타임 동안 벌어지는 물리적·제어적·인간적 카운트다운의 긴장이 기술적 진실성을 잃지 않고 전개되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 4519,
      target_words: 3700,
      delta: -819,
      compression_percent: 18.1,
      editorial_range: '3,550-3,850',
      protected_status: 'Structural',
      protected_assets: [
        'Twenty-three-minute physical lead time countdown telemetry',
        'Energy storage charging sequence, cryogenic compressor margins, and capacitor bank interlocks',
      ],
      epistemic_boundary: {
        operational_reality: '23분은 임의의 서사적 타이머가 아니라 감지된 광학적 이상으로부터 도출된 물리적 전파 여유 시간임.',
      },
    },
    {
      scene_unit_id: 'c6f9393a-87c8-5a1a-bad3-83e957529282', // Ch 3 Sc 1: The Wrong Solution
      title: '[Scene 1: The Wrong Solution]',
      pov: 'Ian Yoo & Control Team',
      local_question: '첫 번째 중앙/글로벌 제어 솔루션(G-4A)의 파탄과 실패가 명백하게 보존되어 후속 성공에 의해 지워지지 않는가?',
      action: 'KEEP_COMPRESS_PROTECTED',
      baseline_words: 6709,
      target_words: 5500,
      delta: -1209,
      compression_percent: 18.0,
      editorial_range: '5,300-5,700',
      protected_status: 'Canon',
      protected_assets: [
        'G-4A FAILURE REMAINS VISIBLE: The first global centralized control solution failed',
        'Over-constraining the global boundary led to severe phase destabilization',
        'Ian acknowledges the failure of the centralized assumption under fire',
      ],
      epistemic_boundary: {
        failure_preservation: '첫 번째 솔루션 G-4A는 명백한 실패이며, G-4B의 후속 성공이 G-4A의 과오나 오버피팅을 덮어버리지 않음.',
      },
    },
    {
      scene_unit_id: 'd85c990f-cf14-5fc7-b8f7-a69b7604e2cc', // Ch 3 Sc 2: Local Execution
      title: '[Scene 2: Local Execution]',
      pov: 'Node Engineers & Distributed Stations',
      local_question: '국소 실행(Local Execution)으로 전환된 후 노드 4의 치명적 퀜치(Node Four Quench)가 실제 영구 손실로 솔직하게 다루어지는가?',
      action: 'KEEP_COMPRESS_PROTECTED',
      baseline_words: 5137,
      target_words: 4200,
      delta: -937,
      compression_percent: 18.2,
      editorial_range: '4,050-4,350',
      protected_status: 'Canon',
      protected_assets: [
        'NODE FOUR QUENCH: FAIL SILENT / PROTECTED OFFLINE (Actual loss, not a temporary glitch)',
        'Local execution algorithm adapts to the permanent loss of an entire node',
        'Stored magnetic energy dump into massive water resistors',
      ],
      epistemic_boundary: {
        hardware_loss: '노드 4는 일시적으로 꺼졌다가 편리하게 돌아오는 것이 아니라, 완전한 퀜치로 오프라인 격리되는 실제 하드웨어 손실임.',
      },
    },
    {
      scene_unit_id: '94a9a8c3-f6ce-5ddb-8d5c-a474e52586f0', // Ch 3 Sc 3: The Boundary Holds
      title: '[Scene 3: The Boundary Holds]',
      pov: 'Ian Yoo, Sarah Hayes, Field Sensors',
      local_question: '경계 유지의 성공이 단순한 흑백 논리(차폐 성공/실패)가 아니라, 외부의 극단적 편향(~98°)과 내부의 잔여 편향(~13–14°)이라는 두 개의 다른 측정 영역의 상호작용으로 정밀 렌더링되는가?',
      action: 'KEEP_COMPRESS_PROTECTED',
      baseline_words: 4760,
      target_words: 3950,
      delta: -810,
      compression_percent: 17.0,
      editorial_range: '3,800-4,100',
      protected_status: 'Canon',
      protected_assets: [
        'External ~98-degree deflection vs Internal ~13-14-degree residual across distinct measurement zones',
        'Exact cancellation applies only to the matched leading nodal divergence, NOT all finite residuals',
        'No simplistic scalar suppression ratio: two distinct boundary zones',
      ],
      epistemic_boundary: {
        cancellation_scope: 'Paper I에 따른 상쇄(cancellation)는 선행 노달 발산 성분(leading divergence)에만 적용되며, 유한한 잔차나 현실 자체를 마법처럼 지워버리는 것이 아님.',
      },
    },
    {
      scene_unit_id: '60aad8d4-2589-59a8-ac55-bc42605db7ae', // Ch 4 Sc 1: What Changed When We Acted
      title: '[Scene 1: What Changed When We Acted]',
      pov: 'Forensic Scientists, Sarah Hayes, Ian Yoo',
      local_question: '개입이 국소적 반응의 일부를 인과적으로 변형시켰다는 사실과, 우주적 근본 원인을 규명했다는 주장이 엄격히 분리되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 6007,
      target_words: 4900,
      delta: -1107,
      compression_percent: 18.4,
      editorial_range: '4,750-5,050',
      protected_status: 'Canon',
      protected_assets: [
        'Intervention causally modified a local component of the measured response',
        'Intervention did NOT establish the ultimate mechanism or common cosmic cause',
        'Stored energy, structural stress, and actuator authority accounting',
      ],
      epistemic_boundary: {
        causation_limit: '인간의 기하학적 제어 개입이 국소 관측치를 변화시켰음은 입증되었으나, 다가오는 우주 섭동의 근본 원인(X)이 무엇인지는 여전히 알 수 없음.',
      },
    },
    {
      scene_unit_id: 'c5df358b-d927-523e-b8f5-f7c256cfcf9b', // Ch 4 Sc 2: The First Thing We Can Say
      title: '[Scene 2: The First Thing We Can Say]',
      pov: 'Sarah Hayes & The Verification Board',
      local_question: '공식 과학 성명이 목격된 시각적 스케일보다 훨씬 좁고 절제된 어휘로 작성되는 지적 진정성이 수호되는가?',
      action: 'KEEP_COMPRESS_PROTECTED',
      baseline_words: 4766,
      target_words: 3900,
      delta: -866,
      editorial_range: '3,800-4,050',
      compression_percent: 18.2,
      protected_status: 'Canon',
      protected_assets: [
        'The official scientific statement remains narrower than the dramatic scale of the event',
        'Sarah Hayes enforces strict observable-based language in the public communique',
        'Refusal to declare "victory over space" or "planetary defense operational"',
      ],
      epistemic_boundary: {
        public_communique: '과학적 성명은 관측된 기하학적 상쇄와 잔차의 존재만을 보고하며, 미증명된 우주론적 승리 선언을 거부함.',
      },
    },
    {
      scene_unit_id: '50b43df2-df3b-5165-99a7-e52f63814e43', // Ch 4 Sc 3: The Cost of Control
      title: '[Scene 3: The Cost of Control]',
      pov: 'Ian Yoo',
      local_question: 'Ian의 최종 아크가 "겸손과 체념(Humility)"이 아니라, 위험하고도 대가를 치른 "더 거대한 통제(Truth -> Control)"로의 결단으로 피날레를 장식하는가?',
      action: 'KEEP_COMPRESS_PROTECTED',
      baseline_words: 6462,
      target_words: 5280,
      delta: -1182,
      compression_percent: 18.3,
      editorial_range: '5,100-5,450',
      protected_status: 'Canon',
      protected_assets: [
        '“I must control it.” — Ian Yoo earned, dangerous, and definitive conclusion',
        'Truth -> Control: Ian embraces the terrifying responsibility of engineered geometry',
        'The physical, human, and moral cost of controlling the resonance of space',
        'Father Yoo Ji-man silver compass recalled: the cost of holding a direction against the void',
      ],
      epistemic_boundary: {
        character_arc_finale: 'Ian은 영웅적 승리감에 도취되지도, 무기력한 겸손으로 물러서지도 않음. 그는 공간의 공진을 인위적으로 통제하는 것이 가져올 가혹한 대가를 직시하며 제1권의 종막을 선언함.',
      },
    },
  ];

  // 4. Upsert Act 4 Scene Matrices and Proposals
  console.log('Seeding Act 4 Scene Matrices and Structure Proposals (10 Scenes)...');
  let twBaseline = 0;
  let twTarget = 0;

  for (const s of ACT4_SCENES) {
    twBaseline += s.baseline_words;
    twTarget += s.target_words;

    // Upsert Scene Matrix
    const { error: smErr } = await supabase
      .from('scene_matrices')
      .upsert({
        snapshot_id: baseSnap.id,
        scene_unit_id: s.scene_unit_id,
        audit_run_id: auditRun.id,
        pov_character: s.pov,
        local_question: s.local_question,
        action: 'Compress',
        compression_target_words: s.target_words,
        compression_target_percent: s.compression_percent,
        protected_status: s.protected_status,
        protected_assets: s.protected_assets,
        epistemic_boundary: s.epistemic_boundary,
        notes: `Differentiated Editorial Range: ${s.editorial_range}`,
      }, { onConflict: 'snapshot_id,scene_unit_id' });

    if (smErr) throw new Error(`Scene Matrix upsert failed for ${s.title}: ${smErr.message}`);

    // Map proposal action
    let propAction = 'KEEP_COMPRESS';
    if (s.action.includes('REFRAME')) propAction = 'KEEP_REFRAME_COMPRESS';
    else if (s.action.includes('PROTECTED')) propAction = 'KEEP_COMPRESS_PROTECTED';

    // Upsert Structure Proposal
    const { error: scpErr } = await supabase
      .from('structure_change_proposals')
      .upsert({
        audit_run_id: auditRun.id,
        scene_unit_id: s.scene_unit_id,
        action: propAction,
        current_word_count: s.baseline_words,
        target_word_count: s.target_words,
        projected_word_delta: s.delta,
        target_compression_percent: s.compression_percent,
        target_tolerance_percent: 5.00,
        target_type: 'editorial_guidance',
        is_hard_limit: false,
        rationale: s.local_question,
        dependency_notes: `Differentiated range: ${s.editorial_range}`,
      }, { onConflict: 'audit_run_id,scene_unit_id' });

    if (scpErr) throw new Error(`Proposal upsert failed for ${s.title}: ${scpErr.message}`);
  }

  console.log(`Successfully seeded 10 Scene Matrices and Proposals for Act 4.`);
  console.log(`Baseline Words: ${twBaseline} | Target Words: ${twTarget} | Delta: ${twTarget - twBaseline} (${((twBaseline - twTarget) / twBaseline * 100).toFixed(1)}% reduction)\n`);

  // 5. Seed Act 4 Chapter Gates (4 Chapters)
  console.log('Seeding Act 4 Chapter Gates (4 Chapters)...');
  const { data: ch1 } = await supabase.from('content_units').select('id').eq('source_path', 'act-7/ch-1').single();
  const { data: ch2 } = await supabase.from('content_units').select('id').eq('source_path', 'act-7/ch-2').single();
  const { data: ch3 } = await supabase.from('content_units').select('id').eq('source_path', 'act-7/ch-3').single();
  const { data: ch4 } = await supabase.from('content_units').select('id').eq('source_path', 'act-7/ch-4').single();

  const CHAPTER_GATES = [
    {
      chapter_unit_id: ch1.id,
      local_question: '12개 지상 노드의 물리적 가동과 분산 제어 철학(Every node gets to disagree)은 어떻게 정합되는가?',
      answer: '지상 12개 노드 G-DCL이 물리적으로 가동되지만 중앙 컨트롤러의 즉각적 전 지구적 장악은 상대론적으로 불가능하며, 각 노드의 국소 안전 거부권이 핵심 생존 원칙으로 확립된다.',
      larger_question: '분산 시스템은 중앙의 인과적 한계를 극복하고 일관된 거시 제어를 생성할 수 있는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — 지상 12개 노드 G-DCL 물리적 구축 및 국소 거부권 아키텍처 확립 (Target: 8,950 words, -17.7%).',
    },
    {
      chapter_unit_id: ch2.id,
      local_question: '23분의 리드타임과 사전 밀봉된 예측 창은 사후 모델 조작을 어떻게 원천 차단하는가?',
      answer: '입사 신호 도달 23분 전 사전 등록된 정량 예측 기준과 파라미터가 동결되며, 카운트다운 동안 마그넷 에너지 충전과 극저온 여유 마진이 실시간으로 검증된다.',
      larger_question: '사전 밀봉된 과학적 예측은 거대한 미지의 우주적 섭동 앞에서 생존할 수 있는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — 사전 동결 예측 창 엄격 적용 및 23분 카운트다운 공학 리얼리즘 (Target: 8,600 words, -18.2%).',
    },
    {
      chapter_unit_id: ch3.id,
      local_question: 'G-4A의 실패와 노드 4의 퀜치를 딛고 달성된 국소 실행의 상쇄 경계는 무엇을 의미하는가?',
      answer: '첫 중앙 솔루션 G-4A는 실패하고 노드 4가 완전 퀜치로 소실되지만, 국소 실행으로 전환된 잔여 노드들이 외부 98도 편향 대비 내부 13-14도 잔차로 선행 노달 발산을 성공적으로 상쇄한다.',
      larger_question: '부분적 물리적 상쇄의 성공은 공간 자체의 공진을 완전히 통제했다는 증거인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — G-4A 실패 및 노드 4 퀜치 손실 보존, 외부 98° vs 내부 13-14° 분리 (Target: 13,650 words, -17.8%).',
    },
    {
      chapter_unit_id: ch4.id,
      local_question: '개입의 국소 인과 증명과 절제된 공식 발표 뒤에, Ian의 결단은 어디로 향하는가?',
      answer: '인간의 기하 개입이 국소 계측치를 인과적으로 변형시켰음이 확인되고 공식 성명은 절제된 관측 사실만을 보고하지만, Ian은 공간의 공진을 통제해야 한다는 위험하고 명확한 결론(Truth -> Control)에 도달한다.',
      larger_question: '공간의 공진을 통제하려는 인간의 의지는 문명의 구원인가, 더 거대한 파열의 방아쇠인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — 공식 성명의 절제, 인과 한계 수호, Ian의 최종 아크 "I must control it" 결단 (Target: 14,080 words, -18.3%).',
    },
  ];

  for (const cg of CHAPTER_GATES) {
    const { error: cgErr } = await supabase
      .from('chapter_gates')
      .upsert({
        audit_run_id: auditRun.id,
        chapter_unit_id: cg.chapter_unit_id,
        local_question: cg.local_question,
        answer: cg.answer,
        larger_question: cg.larger_question,
        verdict: cg.verdict,
        verdict_notes: cg.verdict_notes,
      }, { onConflict: 'audit_run_id,chapter_unit_id' });

    if (cgErr) throw new Error(`Chapter gate failed: ${cgErr.message}`);
  }
  console.log('Act 4 Chapter Gates seeded successfully.\n');

  // 6. Calculate SHA-256 Audit Hash and Lock B1_PASS1_ACT4_001
  console.log('Calculating SHA-256 Audit Hash and locking B1_PASS1_ACT4_001...');
  const auditPayload = JSON.stringify({
    code: AUDIT_CODE,
    scope: 'ACT 4: THE CANCELLATION HORIZON',
    scenes: ACT4_SCENES,
    gates: CHAPTER_GATES,
    metrics: {
      baseline_words: twBaseline,
      target_words: twTarget,
      delta: twTarget - twBaseline,
      compression_percent: ((twBaseline - twTarget) / twBaseline * 100).toFixed(1),
      tolerance_percent: 5.0,
      preferred_range: '43,500-47,000',
    }
  });

  const auditHash = crypto.createHash('sha256').update(auditPayload).digest('hex');

  const { error: lockErr } = await supabase
    .from('audit_runs')
    .update({
      status: 'locked',
      audit_hash: auditHash,
      locked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', auditRun.id);

  if (lockErr) throw new Error(`Audit locking failed: ${lockErr.message}`);

  console.log('===========================================================');
  console.log(' PASS 1 ACT 4 AUDIT RUN LOCKED SUCCESSFULLY!               ');
  console.log('===========================================================');
  console.log(`Audit Run Code: ${AUDIT_CODE}`);
  console.log(`Scope: ACT 4: THE CANCELLATION HORIZON (10 Scenes)`);
  console.log(`Audit Hash (SHA-256): ${auditHash}`);
  console.log(`Baseline Words: ${twBaseline} | Target Words: ${twTarget} (-9,942 words / -18.0%)`);
  console.log(`Status: LOCKED (Pass 1 Scene Inventory for Act 4 Complete)`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
