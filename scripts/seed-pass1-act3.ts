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
  console.log('=== PASS 1 SCENE INVENTORY SEEDER: ACT 3 (WHEN THE SKY LOSES ITS RULES) ===\n');

  // 1. Fetch Project, Snapshots and Act 3 Unit
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: act3Unit } = await supabase.from('content_units').select('id').eq('source_path', 'act-6').single();

  if (!act3Unit) throw new Error('Act 3 unit (act-6) not found.');

  // 2. Create Audit Run B1_PASS1_ACT3_001
  const AUDIT_CODE = 'B1_PASS1_ACT3_001';
  console.log(`Creating Audit Run ${AUDIT_CODE}...`);

  const { data: auditRun, error: arErr } = await supabase
    .from('audit_runs')
    .upsert({
      code: AUDIT_CODE,
      project_id: proj.id,
      source_snapshot_id: baseSnap.id,
      target_snapshot_id: targetSnap.id,
      pass_number: 1,
      scope_unit_id: act3Unit.id,
      scope_name: 'ACT 3: WHEN THE SKY LOSES ITS RULES',
      criteria_version: '1.0.0',
      status: 'in_review',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (arErr) throw new Error(`Audit run creation failed: ${arErr.message}`);
  console.log(`Audit Run created: ${auditRun.code} (${auditRun.id})\n`);

  // 3. Act 3 8 Canonical Scenes Definition
  const ACT3_SCENES = [
    {
      scene_unit_id: '3cd61722-ba44-519a-ab74-931c9cd4be48', // Ch 1 Sc 1: The Acoustic Void
      title: '[Scene 1: The Acoustic Void]',
      pov: 'Third-Person Objective / Pacific Research Vessel',
      local_question: '태평양 심해 음향 센서망의 신호 단절이 단순 통신 두절이 아니라, 음향 전파 시간(travel-time)의 파탄 현상으로 정밀하게 관측되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 6189,
      target_words: 5100,
      delta: -1089,
      compression_percent: 17.6,
      protected_status: 'Canon',
      protected_assets: [
        'Hydrophone array acoustic travel-time failure records',
        'Distinction between acoustic signal loss and physical distance elimination',
      ],
      epistemic_boundary: {
        observed: '소나 음파의 도달 시간이 비선형적으로 왜곡되며 음향 수신 거리가 비정상적으로 계산됨.',
        forbidden_conclusion: '“거리가 사라졌다(distance disappeared)”는 시적 표현을 문자 그대로의 물리적 공간 소멸(ontology)로 선언하는 것.',
      },
    },
    {
      scene_unit_id: 'a2322291-b735-5e33-a216-2d7d7ce34efa', // Ch 1 Sc 2: The Water That Fell Upward
      title: '[Scene 2: The Water That Fell Upward]',
      pov: 'Third-Person Multi-POV / Coastal Observers',
      local_question: '해수면이 솟구치는 거대 유체 이상 현상이 관측 사실과 중력 섭동 해석 사이의 경계를 엄격히 유지하며 묘사되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 6045,
      target_words: 5000,
      delta: -1045,
      compression_percent: 17.3,
      protected_status: 'Canon',
      protected_assets: [
        'Observation: seawater ascending along a localized geometric vertical column',
        'Separation between fluid motion observation and global gravity modification theory',
      ],
      epistemic_boundary: {
        observed: '해수가 국소적으로 상공으로 이동하는 현상이 계측됨.',
        forbidden_conclusion: '지구 중력 자체가 반전되었다거나 무중력 지대가 형성되었다고 단정하는 것.',
      },
    },
    {
      scene_unit_id: '16754633-1e03-53c3-94cf-ebfec4095244', // Ch 2 Sc 1: The Rotating Vertical
      title: '[Scene 1: The Rotating Vertical]',
      pov: 'Civilian & Municipal Engineering / Seoul Observers',
      local_question: '서울 도심에서 계측된 수직축 회전(Rotating Vertical)이 건물 구조체의 물리적 붕괴가 아닌 겉보기 수직선(apparent vertical)의 편향으로 명확히 구분되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 7126,
      target_words: 5850,
      delta: -1276,
      compression_percent: 17.9,
      protected_status: 'Structural',
      protected_assets: [
        'Plumb-line and inclinometer deflection measurements across Seoul high-rises',
        'Distinction between apparent vertical vector tilt and structural foundation rotation',
      ],
      epistemic_boundary: {
        observed: '진자 및 경사계의 수직 기준선(apparent vertical)이 일시적으로 기울어짐.',
        forbidden_conclusion: '서울 도심의 빌딩들이 물리적으로 기초부터 회전했다는 과장.',
      },
    },
    {
      scene_unit_id: 'e14e31b9-b61a-5675-a7e7-bea56b657e21', // Ch 2 Sc 2: One Hundred Eighty Degrees
      title: '[Scene 2: One Hundred Eighty Degrees]',
      pov: 'Municipal Engineers & Technical Responders',
      local_question: 'Scene 제목과 달리 실제 편향각이 정확히 180도에 도달하지 않고 임계치 직전에서 포화되는 물리적 불완전성이 보존되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 5716,
      target_words: 4700,
      delta: -1016,
      compression_percent: 17.8,
      protected_status: 'Canon',
      protected_assets: [
        'Critical saturation of vertical vector tilt prior to exact 180-degree inversion',
        'Scene title is literary/dramatic; physical measurement never reached exact 180°',
      ],
      epistemic_boundary: {
        observed: '수직 편향 벡터가 극단적 각도까지 변위했으나 180도 완전 반전에는 도달하지 못하고 감쇠함.',
        forbidden_conclusion: '중력이 완벽하게 180도 뒤집혀 세상이 완전히 거꾸로 뒤집혔다는 만화적 묘사.',
      },
    },
    {
      scene_unit_id: 'b21394bd-4deb-5709-bdef-68bfe608c0b0', // Ch 3 Sc 1: The Missing Millisecond
      title: '[Scene 1: The Missing Millisecond]',
      pov: 'Flight 702 Crew & Air Traffic Control',
      local_question: '702편 민항기의 위치 불연속이 기내 탑승자의 국소적 연속성(local continuity)과 외부 레이더의 불연속(external position discontinuity)의 대비로 정직하게 다루어지는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 5341,
      target_words: 4400,
      delta: -941,
      compression_percent: 17.6,
      protected_status: 'Canon',
      protected_assets: [
        'Local continuity inside cockpit vs external radar tracking discontinuity',
        'Strict rejection of teleportation, time travel, or zero-time transit labels',
      ],
      epistemic_boundary: {
        observed: '외부 레이더상에서 항공기 위치 좌표가 수 밀리초 동안 비정상 점프를 기록함.',
        forbidden_conclusion: '비행기가 순간이동(teleportation)했거나 미래/과거로 시간여행을 했다는 비약.',
      },
    },
    {
      scene_unit_id: 'e19c5aa4-489b-58f4-987c-0d47986fca73', // Ch 3 Sc 2: Mont Blanc
      title: '[Scene 2: Mont Blanc]',
      pov: 'Swiss Mountain Station & Aviation Investigators',
      local_question: '몽블랑 상공의 잔여 섭동 조사에서 태평양, 서울, 702편 사건을 조기에 단일 원인으로 비약 통합하지 않는 절제가 유지되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 4376,
      target_words: 3600,
      delta: -776,
      compression_percent: 17.7,
      protected_status: 'Structural',
      protected_assets: [
        'Atmospheric and pressure profile residual data over Mont Blanc',
        'Cross-disaster isolation: Pacific, Seoul, and Flight 702 remain separate phenomena',
      ],
      epistemic_boundary: {
        observed: '고고도 대기압 및 지자기 측정치에서 일시적인 섭동 잔차가 기록됨.',
        forbidden_conclusion: '세 대륙의 이상 현상이 하나의 단일 거대 외계 장치에 의한 것이라고 조기 단정.',
      },
    },
    {
      scene_unit_id: '0716d7fd-9261-546f-bcef-53d4b734f388', // Ch 4 Sc 1: I Don't Know
      title: '[Scene 1: I Don\'t Know]',
      pov: 'Ian Yoo',
      local_question: 'Ian의 "I don\'t know"가 과학자의 무능이 아니라, 관측 증거의 한계를 정직하게 인정하는 최상급 하드 SF의 지적 엄밀성으로 빛나는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 5475,
      target_words: 4500,
      delta: -975,
      compression_percent: 17.8,
      protected_status: 'Canon',
      protected_assets: [
        '“I don’t know.” — Ian Yoo acknowledges experimental and evidential limits',
        'Refusal to offer speculative pseudo-scientific explanations under political pressure',
      ],
      epistemic_boundary: {
        known: '기존 물리학 모델로 세 지역의 동시다발적 섭동을 인과적으로 완전히 설명할 수 없음.',
        scientific_stance: '모르는 것을 모른다고 인정하는 것이 과학적 무결성의 유일한 방어선임.',
        forbidden_conclusion: 'Ian이 갑자기 전지전능한 해답을 제시하며 영웅주의로 회귀하는 것.',
      },
    },
    {
      scene_unit_id: 'd0eff232-cc3f-5e60-980d-5dfe8a993a7f', // Ch 4 Sc 2: The Mandate
      title: '[Scene 2: The Mandate]',
      pov: 'Ian Yoo, Sarah Hayes, Global Consortia',
      local_question: '정부와 국제 컨소시엄의 위임(The Mandate)이 전 지구적 방어막 건설이 아니라, 단계화된 관측·지역 프로토타입·아키텍처 연구로 엄격히 제한되는가?',
      action: 'KEEP_COMPRESS',
      baseline_words: 5891,
      target_words: 4850,
      delta: -1041,
      compression_percent: 17.7,
      protected_status: 'Canon',
      protected_assets: [
        'The Mandate: staged observational deployment, regional prototype, and architecture study',
        'Twelve nodes retained as provisional engineering count, not a deployed planetary shield',
        'Sarah Hayes locks the international multi-agency validation protocol',
      ],
      epistemic_boundary: {
        mandate_scope: '국제 컨소시엄은 거대 방어막 건설이 아니라 "공간 기하 제어 가능성에 대한 단계적 관측 및 지역 프로토타입 연구"를 승인함.',
        forbidden_conclusion: '지구 전체를 둘러싸는 행성 방어막의 즉각적 착공 선언.',
      },
    },
  ];

  // 4. Upsert Act 3 Scene Matrices and Proposals
  console.log('Seeding Act 3 Scene Matrices and Structure Proposals (8 Scenes)...');
  let twBaseline = 0;
  let twTarget = 0;

  for (const s of ACT3_SCENES) {
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

  console.log(`Successfully seeded 8 Scene Matrices and Proposals for Act 3.`);
  console.log(`Baseline Words: ${twBaseline} | Target Words: ${twTarget} | Delta: ${twTarget - twBaseline} (${((twBaseline - twTarget) / twBaseline * 100).toFixed(1)}% reduction)\n`);

  // 5. Seed Act 3 Chapter Gates (4 Chapters)
  console.log('Seeding Act 3 Chapter Gates (4 Chapters)...');
  const { data: ch1 } = await supabase.from('content_units').select('id').eq('source_path', 'act-6/ch-1').single();
  const { data: ch2 } = await supabase.from('content_units').select('id').eq('source_path', 'act-6/ch-2').single();
  const { data: ch3 } = await supabase.from('content_units').select('id').eq('source_path', 'act-6/ch-3').single();
  const { data: ch4 } = await supabase.from('content_units').select('id').eq('source_path', 'act-6/ch-4').single();

  const CHAPTER_GATES = [
    {
      chapter_unit_id: ch1.id,
      local_question: '태평양 심해 음향 파탄과 해수의 국소 상승은 거시적 공간 왜곡의 직접 관측인가?',
      answer: '음향 전파 지연 실패와 국소 해수면 융기가 다중 센서로 확인되지만, 이를 문자 그대로의 공간 소멸이나 중력 반전으로 비약하지 않는다.',
      larger_question: '대양 규모의 유체 섭동은 지표면 전체로 확장되는 거대 위상 파열의 전조인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — 관측과 존재론 분리 및 음향 전파 파탄 보존 (Target: 10,100 words, -17.5%).',
    },
    {
      chapter_unit_id: ch2.id,
      local_question: '서울 도심의 겉보기 수직선 회전은 건물의 물리적 회전과 어떻게 구분되는가?',
      answer: '진자와 경사계의 수직 벡터 편향이 계측되나 180도 완전 반전에는 도달하지 않고 임계 포화되며, 건물 기초의 물리적 회전이 아님이 확립된다.',
      larger_question: '도시 환경의 국소적 수직 편향은 인간 문명의 인프라가 감당할 수 있는 한계를 시험하는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — 겉보기 수직선과 구조체 분리, 180도 미도달 사실 보존 (Target: 10,550 words, -17.8%).',
    },
    {
      chapter_unit_id: ch3.id,
      local_question: '702편의 밀리초 위치 불연속은 국소적 연속성과 어떻게 양립하는가?',
      answer: '조종실 내부 탑승자는 완벽한 국소적 연속성을 경험하지만 외부 레이더상 위치 좌표는 불연속을 기록하며, 순간이동이나 시간여행 주장은 엄격히 배제된다.',
      larger_question: '동시 다발적 거시 섭동들(태평양, 서울, 몽블랑)을 조기에 단일 원인으로 묶을 수 있는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — 순간이동 배제, 국소 연속성 및 다지역 사건 격리 보존 (Target: 8,000 words, -17.7%).',
    },
    {
      chapter_unit_id: ch4.id,
      local_question: 'Ian의 "I don\'t know"와 국제 컨소시엄의 위임(The Mandate)은 어떤 과학적 한계를 규정하는가?',
      answer: 'Ian은 정치적 압박 속에서도 과학적 증거 한계를 정직하게 인정하며, The Mandate는 행성 방어막 건설이 아닌 단계적 관측·지역 프로토타입 연구로 한정된다.',
      larger_question: '정치와 자본의 즉각적 해결 요구 속에서 과학적 정직성은 어떻게 생존하는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — 지적 엄밀성 수호, The Mandate 범위 제한 및 12개 노드 잠정성 보존 (Target: 9,350 words, -17.7%).',
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
  console.log('Act 3 Chapter Gates seeded successfully.\n');

  // 6. Calculate SHA-256 Audit Hash and Lock B1_PASS1_ACT3_001
  console.log('Calculating SHA-256 Audit Hash and locking B1_PASS1_ACT3_001...');
  const auditPayload = JSON.stringify({
    code: AUDIT_CODE,
    scope: 'ACT 3: WHEN THE SKY LOSES ITS RULES',
    scenes: ACT3_SCENES,
    gates: CHAPTER_GATES,
    metrics: {
      baseline_words: twBaseline,
      target_words: twTarget,
      delta: twTarget - twBaseline,
      compression_percent: ((twBaseline - twTarget) / twBaseline * 100).toFixed(1),
      tolerance_percent: 5.0,
      preferred_range: '36,500-39,500',
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
  console.log(' PASS 1 ACT 3 AUDIT RUN LOCKED SUCCESSFULLY!               ');
  console.log('===========================================================');
  console.log(`Audit Run Code: ${AUDIT_CODE}`);
  console.log(`Scope: ACT 3: WHEN THE SKY LOSES ITS RULES (8 Scenes)`);
  console.log(`Audit Hash (SHA-256): ${auditHash}`);
  console.log(`Baseline Words: ${twBaseline} | Target Words: ${twTarget} (-8,159 words / -17.7%)`);
  console.log(`Status: LOCKED (Pass 1 Scene Inventory for Act 3 Complete)`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
