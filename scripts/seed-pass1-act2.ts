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
  console.log('=== PASS 1 SCENE INVENTORY SEEDER: ACT 2 (THE IMPOSSIBLE INVESTMENT) ===\n');

  // 1. Fetch Project, Snapshots and Act 2 Unit
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: act2Unit } = await supabase.from('content_units').select('id').eq('source_path', 'act-5').single();

  if (!act2Unit) throw new Error('Act 2 unit (act-5) not found.');

  // 2. Create Audit Run B1_PASS1_ACT2_001
  const AUDIT_CODE = 'B1_PASS1_ACT2_001';
  console.log(`Creating Audit Run ${AUDIT_CODE}...`);

  const { data: auditRun, error: arErr } = await supabase
    .from('audit_runs')
    .upsert({
      code: AUDIT_CODE,
      project_id: proj.id,
      source_snapshot_id: baseSnap.id,
      target_snapshot_id: targetSnap.id,
      pass_number: 1,
      scope_unit_id: act2Unit.id,
      scope_name: 'ACT 2: THE IMPOSSIBLE INVESTMENT',
      criteria_version: '1.0.0',
      status: 'in_review',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (arErr) throw new Error(`Audit run creation failed: ${arErr.message}`);
  console.log(`Audit Run created: ${auditRun.code} (${auditRun.id})\n`);

  // 3. Act 2 10 Canonical Scenes Definition
  const ACT2_SCENES = [
    {
      scene_unit_id: 'a5e4bb6e-b810-5e9d-aac3-2f142996253a', // Ch 1 Sc 1: The Man Who Owns Delay
      title: '[Scene 1: The Man Who Owns Delay]',
      pov: 'Ian Yoo',
      local_question: 'Elena Vance와 Marcus Vance의 상업적·물류적 동기가 단순한 탐욕이 아니라, 밀리초 단위의 지연(latency)을 지배하는 금융 인프라 독점 논리로 정교하게 전개되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 4500,
      target_words: 3750,
      delta: -750,
      compression_percent: 16.7,
      protected_status: 'Structural',
      protected_assets: [
        'Marcus Vance and Elena Vance logistical empire definition',
        'Latency arbitration economics: the monetization of microseconds',
        'Private fiber and microwave transmission network topography',
      ],
      epistemic_boundary: {
        known: 'Vance 자본은 통신 지연의 비대칭성을 활용한 초단타 매매와 글로벌 물류 네트워크를 통제함.',
        inferred: '그들이 Ian의 연구에 투자하는 이유는 순수 과학이 아니라 광속 경로 단축이 가져올 파괴적 금융 우위 때문임.',
        forbidden_conclusion: 'Vance 가문이 외계 신호의 배후를 이미 알고 있었다는 식의 비약.',
      },
    },
    {
      scene_unit_id: 'f53d41ed-51ad-5d2e-b76c-f7e6d7aff1a7', // Ch 1 Sc 2: Apocalypse and Latency
      title: '[Scene 2: Apocalypse and Latency]',
      pov: 'Ian Yoo',
      local_question: '우주론적 위기(Apocalypse)와 상업적 지연 시간(Latency)의 긴장이 어떻게 계약과 자본 조달의 협상으로 구체화되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 3194,
      target_words: 2680,
      delta: -514,
      compression_percent: 16.1,
      protected_status: 'Canon',
      protected_assets: [
        'Contract terms: funding quantum vs data ownership clauses',
        'Ian refuses to yield theoretical sovereignty to Vance capital',
        'Sarah Hayes enforces data integrity audit clauses into the corporate charter',
      ],
      epistemic_boundary: {
        known: 'Ian은 12개 노드 구축 자금을 확보하기 위해 Vance 사모펀드와 조건부 지연시간 인프라 계약을 체결함.',
        forbidden_conclusion: 'Ian이 자본의 요구에 굴복하여 데이터 조작을 허용했다는 해석.',
      },
    },
    {
      scene_unit_id: '73a67014-cd4a-5b6b-a04d-b871dd914f24', // Ch 2 Sc 1: The Sealed Kilometer
      title: '[Scene 1: The Sealed Kilometer]',
      pov: 'Ian Yoo',
      local_question: '1km 진공 광학 지연관(Optical Delay Line)의 물리적 건설 현장이 공학적 리얼리즘을 갖추고 묘사되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 3410,
      target_words: 2850,
      delta: -560,
      compression_percent: 16.4,
      protected_status: 'Structural',
      protected_assets: [
        '1-kilometer ultra-high vacuum optical delay line engineering specs',
        'Thermal gradient compensation and seismic isolation bedrock stabilization',
      ],
      epistemic_boundary: {
        known: '지하 1km 진공 터널에서 레이저 간섭계를 이용한 펄스 지연 및 위상 전송 시험 라인이 완공됨.',
        forbidden_conclusion: '실험 장치가 아무런 물리적 한계 없이 완벽하게 작동했다는 이상화.',
      },
    },
    {
      scene_unit_id: '61c8f2ab-e98a-5179-9de3-106312c64c3e', // Ch 2 Sc 2: The Phase Fold
      title: '[Scene 2: The Phase Fold]',
      pov: 'Ian Yoo',
      local_question: '위상 접힘(Phase Fold) 현상이 광속 초과가 아닌 기하학적 위상 지연 변조(Phase modulation)로 정확히 렌더링되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 2722,
      target_words: 2320,
      delta: -402,
      compression_percent: 14.8,
      protected_status: 'Canon',
      protected_assets: [
        'Phase folding optical interference pattern measurements',
        'Paper II geometrical path-shortening laboratory scale manifestation',
      ],
      epistemic_boundary: {
        known: '광학 지연관 내부에서 위상 접힘에 의한 간섭 무늬의 비선형 변위가 관측됨.',
        inference: '국소적 유전율 섭동 또는 메트릭 왜곡 가능성.',
        forbidden_conclusion: '빛이 터널 반대편에 시간적으로 거슬러 올라가 도달했다는 타임 패러독스 주장.',
      },
    },
    {
      scene_unit_id: '984b038a-3d0a-525b-afb5-1e90d948beab', // Ch 3 Sc 1: Test Fourteen
      title: '[Scene 1: Test Fourteen]',
      pov: 'Ian Yoo',
      local_question: '테스트 14의 처참한 하드웨어 실패(초전도 코일 퀜치 및 폭발)가 과학적 진실로서 숨김없이 기록되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 4245,
      target_words: 3500,
      delta: -745,
      compression_percent: 17.5,
      protected_status: 'Canon',
      protected_assets: [
        'Superconducting magnet violent quench event and helium pressure blowout',
        'Failure remains visible: the mechanical limits of copper and niobium-tin',
        'Elena Vance threatens contract termination over hardware loss',
      ],
      epistemic_boundary: {
        known: '고자기장 임계치를 초과한 초전도 마그넷이 퀜치되며 실험 장비 일부가 물리적으로 파괴됨.',
        forbidden_conclusion: '실패가 외부 공작이나 사보타주에 의한 것이라고 책임을 전가하는 것.',
      },
    },
    {
      scene_unit_id: 'f69327d2-29d5-5118-aa1a-32ceac117618', // Ch 3 Sc 2: The Current-Sharing Boundary
      title: '[Scene 2: The Current-Sharing Boundary]',
      pov: 'Ian Yoo',
      local_question: '전류 분유 경계(Current-Sharing Boundary)에서 재료 공학과 이론 물리학의 타협할 수 없는 마찰이 부각되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 3796,
      target_words: 3180,
      delta: -616,
      compression_percent: 16.2,
      protected_status: 'Structural',
      protected_assets: [
        'Current-sharing temperature margin calculations in high-Tc superconductors',
        'Father Yoo Ji-man bounded imperfection philosophy recalled: survival within margins',
      ],
      epistemic_boundary: {
        known: '초전도체의 저항 전이 직전 전류 분유 한계가 실험의 물리적 최대 경계조건을 규정함.',
        forbidden_conclusion: '재료의 열역학적 한계를 의지력이나 이론적 천재성으로 극복했다는 식의 비현실적 서술.',
      },
    },
    {
      scene_unit_id: 'ab3816ac-7ba0-5dc7-a779-26ddf714fb0e', // Ch 3 Sc 3: Test Forty-Two
      title: '[Scene 3: Test Forty-Two]',
      pov: 'Ian Yoo',
      local_question: '테스트 42의 성공이 마법적 도약이 아니라, 수십 번의 파괴와 경계 조정 끝에 얻어진 극미한 안정 영역의 발견으로 묘사되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 4277,
      target_words: 3520,
      delta: -757,
      compression_percent: 17.7,
      protected_status: 'Canon',
      protected_assets: [
        'Test Forty-Two: first stable phase-locking at reduced power threshold',
        'Repeatable 14.8 picosecond propagation advancement under geometric shortening',
      ],
      epistemic_boundary: {
        known: '1km 튜브 내에서 14.8 피코초 수준의 재현 가능한 전파 시간 지연 감소가 계측됨.',
        inference: '진공 내 유효 광로(effective path length)가 기하학적으로 미세하게 단축되었을 가능성.',
        forbidden_conclusion: '이 실험이 즉각적인 성간 워프 항법을 가능케 한다는 과장.',
      },
    },
    {
      scene_unit_id: 'dbd87850-5f27-5640-89d9-27d2f2115fd2', // Ch 4 Sc 1: The Weightless Block
      title: '[Scene 1: The Weightless Block]',
      pov: 'Ian Yoo',
      local_question: '관성 질량과 중력 질량의 미세 비대칭 계측이 기존 물리학의 등가원리(Equivalence Principle)와 충돌하는 인식론적 충격을 다루는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 3143,
      target_words: 2650,
      delta: -493,
      compression_percent: 15.7,
      protected_status: 'Canon',
      protected_assets: [
        'Eötvös balance torsion measurements during phase fold pulse',
        'Apparent micro-gram inertia anomaly vs sensor thermal noise floor',
      ],
      epistemic_boundary: {
        known: '위상 펄스 인가 시 비틀림 저울에서 미세한 관성 응답 불일치가 일시적으로 기록됨.',
        forbidden_conclusion: '반중력 장치가 개발되었다거나 중력이 완전히 사라졌다는 센세이셔널한 주장.',
      },
    },
    {
      scene_unit_id: '8a430f33-e32a-57b4-a1dc-9f4da25a5fcb', // Ch 4 Sc 2: The Mass That Remained
      title: '[Scene 2: The Mass That Remained]',
      pov: 'Ian Yoo',
      local_question: '관성 이상 뒤에 남겨진 보존 법칙(에너지-운동량 보존)의 가혹한 반작용이 현실적으로 확인되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 4429,
      target_words: 3650,
      delta: -779,
      compression_percent: 17.6,
      protected_status: 'Canon',
      protected_assets: [
        'Energy-momentum conservation recoil momentum dissipation',
        'Stress cracks in the tungsten ballast foundation',
      ],
      epistemic_boundary: {
        known: '관성 변위의 반작용 에너지가 진공관 지지대의 텅스텐 밸러스트에 열과 응력으로 방출됨.',
        forbidden_conclusion: '에너지 보존 법칙이 깨졌다는 영구기관적 환상.',
      },
    },
    {
      scene_unit_id: '629127c5-400f-57ba-8bd8-d9463ae1255f', // Ch 4 Sc 3: Twelve Nodes
      title: '[Scene 3: Twelve Nodes]',
      pov: 'Ian Yoo',
      local_question: '단일 실험실에서 지구 전역 12개 노드 분산 네트워크로의 확장이 거대한 산업적·정치적 스케일로 전환되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 4935,
      target_words: 4050,
      delta: -885,
      compression_percent: 17.9,
      protected_status: 'Canon',
      protected_assets: [
        'The global 12-node topology map (Geneva, Atacama, Hanford, Livingston, etc.)',
        'Elena Vance authorizes full-scale multi-billion capital release',
        'Sarah Hayes locks the global node validation protocol',
      ],
      epistemic_boundary: {
        known: '지구 전역 12개 주요 관측 기지에 광학 지연 라인 및 위상 고정 노드를 구축하는 다국적 프로젝트가 공식 발족함.',
        forbidden_conclusion: '12개 노드가 가동되자마자 전 지구적 방어막이 형성되었다는 식의 공상과학적 과장.',
      },
    },
  ];

  // 4. Upsert Act 2 Scene Matrices and Proposals
  console.log('Seeding Act 2 Scene Matrices and Structure Proposals (10 Scenes)...');
  let twBaseline = 0;
  let twTarget = 0;

  for (const s of ACT2_SCENES) {
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
      }, { onConflict: 'snapshot_id,scene_unit_id' });

    if (smErr) throw new Error(`Scene Matrix upsert failed for ${s.title}: ${smErr.message}`);

    // Upsert Structure Proposal
    const { error: scpErr } = await supabase
      .from('structure_change_proposals')
      .upsert({
        audit_run_id: auditRun.id,
        scene_unit_id: s.scene_unit_id,
        action: s.action,
        current_word_count: s.baseline_words,
        target_word_count: s.target_words,
        projected_word_delta: s.delta,
        target_compression_percent: s.compression_percent,
        target_tolerance_percent: 5.00,
        target_type: 'editorial_guidance',
        is_hard_limit: false,
        rationale: s.local_question,
      }, { onConflict: 'audit_run_id,scene_unit_id' });

    if (scpErr) throw new Error(`Proposal upsert failed for ${s.title}: ${scpErr.message}`);
  }

  console.log(`Successfully seeded 10 Scene Matrices and Proposals for Act 2.`);
  console.log(`Baseline Words: ${twBaseline} | Target Words: ${twTarget} | Delta: ${twTarget - twBaseline} (${((twBaseline - twTarget) / twBaseline * 100).toFixed(1)}% reduction)\n`);

  // 5. Seed Act 2 Chapter Gates (4 Chapters)
  console.log('Seeding Act 2 Chapter Gates (4 Chapters)...');
  const { data: ch1 } = await supabase.from('content_units').select('id').eq('source_path', 'act-5/ch-1').single();
  const { data: ch2 } = await supabase.from('content_units').select('id').eq('source_path', 'act-5/ch-2').single();
  const { data: ch3 } = await supabase.from('content_units').select('id').eq('source_path', 'act-5/ch-3').single();
  const { data: ch4 } = await supabase.from('content_units').select('id').eq('source_path', 'act-5/ch-4').single();

  const CHAPTER_GATES = [
    {
      chapter_unit_id: ch1.id,
      local_question: 'Vance 자본의 지연시간 상업화 욕망은 Ian의 우주론적 검증과 어떻게 결합하는가?',
      answer: '초단타 통신 지연의 단축을 노리는 Vance 제국과 실험실 자금이 절박한 Ian이 상호 의심 속에 12개 노드 선행 투자 계약을 체결한다.',
      larger_question: '상업 자본의 이익 추구는 순수 과학적 검증을 가속하는가, 아니면 연구의 방향성을 오염시키는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — 지연시간 차익거래의 금융공학적 리얼리즘 보존 및 계약 조항 압축 (Target: 6,430 words, -16.4%).',
    },
    {
      chapter_unit_id: ch2.id,
      local_question: '1km 진공 터널에서 측정된 위상 접힘은 실제 물리적 공간의 변형인가, 기기 간섭계의 착시인가?',
      answer: '고진공 간섭계에서 펄스 지연 변조가 계측되어 국소적 기하 단축 효과를 지지하지만, 광속 c의 국소 불변성은 깨지지 않는다.',
      larger_question: '실험실 규모의 위상 변조가 거대 우주적 섭동의 축소판이라는 가설은 타당한가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — 광학 지연관 하드웨어 스펙 보존 및 터널 공사 묘사 압축 (Target: 5,170 words, -15.7%).',
    },
    {
      chapter_unit_id: ch3.id,
      local_question: '초전도 마그넷의 파괴적 퀜치(Test 14)를 극복하고 얻어낸 14.8피코초의 단축(Test 42)은 무엇을 증명하는가?',
      answer: '재료의 열역학적 임계 한계를 인내한 끝에 재현 가능한 극미한 전파 시간 단축을 얻어내며, 거대 투자에 대한 최소한의 물리적 증거를 확보한다.',
      larger_question: '하드웨어의 파괴를 감수하는 극한 실험은 과학적 엄밀성을 높이는가, 재앙의 전조인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — Test 14의 처참한 실패와 Test 42의 경계 한계 보존 (Target: 10,200 words, -17.2%).',
    },
    {
      chapter_unit_id: ch4.id,
      local_question: '관성 응답 이상과 반작용 응력은 12개 글로벌 노드로의 확장을 공학적으로 정당화하는가?',
      answer: '국소 관성 비대칭과 가혹한 반작용 에너지가 확인된 후, 단일 관측소를 넘어 지구 스케일의 12개 노드 분산 네트워크가 불가피함이 확립된다.',
      larger_question: '지구 전체를 단일 간섭계로 묶는 투자는 다가오는 위기를 막을 수 있는가, 지구 자체를 공진체로 만드는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — 12개 노드 전 지구적 토폴로지 확립 및 Act 2 피날레 클라이맥스 (Target: 10,350 words, -17.2%).',
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
  console.log('Act 2 Chapter Gates seeded successfully.\n');

  // 6. Calculate SHA-256 Audit Hash and Lock B1_PASS1_ACT2_001
  console.log('Calculating SHA-256 Audit Hash and locking B1_PASS1_ACT2_001...');
  const auditPayload = JSON.stringify({
    code: AUDIT_CODE,
    scope: 'ACT 2: THE IMPOSSIBLE INVESTMENT',
    scenes: ACT2_SCENES,
    gates: CHAPTER_GATES,
    metrics: {
      baseline_words: twBaseline,
      target_words: twTarget,
      delta: twTarget - twBaseline,
      compression_percent: ((twBaseline - twTarget) / twBaseline * 100).toFixed(1),
      tolerance_percent: 5.0,
      preferred_range: '30,500-33,000',
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
  console.log(' PASS 1 ACT 2 AUDIT RUN LOCKED SUCCESSFULLY!               ');
  console.log('===========================================================');
  console.log(`Audit Run Code: ${AUDIT_CODE}`);
  console.log(`Scope: ACT 2: THE IMPOSSIBLE INVESTMENT (10 Scenes)`);
  console.log(`Audit Hash (SHA-256): ${auditHash}`);
  console.log(`Baseline Words: ${twBaseline} | Target Words: ${twTarget} (-6,501 words / -16.8%)`);
  console.log(`Status: LOCKED (Pass 1 Scene Inventory for Act 2 Complete)`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
