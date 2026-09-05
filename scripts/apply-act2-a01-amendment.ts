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
  console.log('=== PASS 1 ACT 2 AUDIT AMENDMENT A01 RUNNER ===\n');

  // 1. Fetch Project, Snapshots and Base Audit
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: baseAudit } = await supabase.from('audit_runs').select('*').eq('code', 'B1_PASS1_ACT2_001').single();
  const { data: act2Unit } = await supabase.from('content_units').select('id').eq('source_path', 'act-5').single();

  if (!baseAudit) throw new Error('Base audit B1_PASS1_ACT2_001 not found.');
  console.log(`Base Audit: ${baseAudit.code} (${baseAudit.id}) - Status: ${baseAudit.status}`);

  // 2. Register Series Debts
  console.log('Registering Act 2 Series Debts...');
  const DEBTS = [
    {
      code: 'SCIENCE_DEBT_ACT2_TEST14_PREDICTION_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'Test Fourteen Frozen Quantitative Prediction Miss',
      source_scope: 'Act 2 / Chapter 3 / Scene 1: Test Fourteen',
      target_scope: 'Pass 3 Scientific Revision',
      established_in_source: 'Ian froze a quantitative prediction of 11-14% increase over Test 13 (~118 ps -> 130.98-134.52 ps). Observed response was ~141 ps (19.5% increase).',
      forbidden_in_target: 'Rescuing the numerical miss as "approximately correct" without a pre-registered uncertainty criterion.',
      required_in_target: 'Classify the frozen 11-14% prediction separately from the broader qualitative prediction that response would increase.',
      status: 'OPEN',
    },
    {
      code: 'EPISTEMIC_DEBT_ACT2_PHASE_FOLD_ONTOLOGY_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'Fiber Phase-Fold Device Fictional Engineering Separation',
      source_scope: 'Act 2 / Chapter 2: The Optical Delay Line',
      target_scope: 'Act 2 Narrative Guidance',
      established_in_source: 'Denver 1km SMF-28 fiber phase-fold setup is a fictional engineering extension compatible with Paper II, not directly derived from the paper.',
      forbidden_in_target: 'Claiming literal physical fiber contraction, local superluminal propagation, or spacetime metric modification from fiber delay measurements alone.',
      required_in_target: 'Maintain observation as effective optical group delay reduction (~60 ps validated, equivalent to ~12.3 mm at nominal index).',
      status: 'OPEN',
    },
    {
      code: 'FUTURE_CAPABILITY_DEBT_ACT2_TWELVE_NODES_001',
      project_id: proj.id,
      debt_type: 'SERIES_BRIDGE',
      title: 'Twelve Nodes as Study Architecture vs Constructed Network',
      source_scope: 'Act 2 / Chapter 4 / Scene 3: Twelve Nodes',
      target_scope: 'Act 4 G-DCL Commissioning',
      established_in_source: '12 nodes represent the current engineering minimum for study under distributed local execution constraints; Odysseus is a Distributed Geometric Control Study.',
      forbidden_in_target: 'Depicting a constructed planetary network, operational shield, orbital deployment, or proven planetary field in Act 2.',
      required_in_target: 'Retain twelve nodes as architecture hypothesis only in Act 2; physical twelve-node G-DCL commissioning remains strictly an Act 4 capability.',
      status: 'OPEN',
    },
    {
      code: 'AUDIT_SOURCE_INTEGRITY_ACT2_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'Audit Metadata Field Collision Prevention (14.8 ps Removal)',
      source_scope: 'Act 2 Audit Seeder',
      target_scope: 'Revision Platform Audit System',
      established_in_source: 'The 14.8 ps value in Test Forty-Two was a metadata collision from Scene 4 compression target (14.8%). Test Forty-Two actually measured 1999.6 kg tungsten support load reduction.',
      forbidden_in_target: 'Allowing compression percentages to populate physical measurement fields in audit records.',
      required_in_target: 'Anchor every numeric scientific claim to source paragraph, unit, and claim type.',
      status: 'OPEN',
    },
  ];

  for (const d of DEBTS) {
    const { error: dErr } = await supabase
      .from('series_debts')
      .upsert(d, { onConflict: 'code' });
    if (dErr) throw new Error(`Series debt upsert failed for ${d.code}: ${dErr.message}`);
  }
  console.log('4 Series Debts registered successfully.\n');

  // 3. Create Additive Audit Amendment B1_PASS1_ACT2_001_A01
  const A01_CODE = 'B1_PASS1_ACT2_001_A01';
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
      scope_unit_id: act2Unit.id,
      scope_name: 'ACT 2: THE IMPOSSIBLE INVESTMENT (A01 AMENDMENT)',
      criteria_version: '1.1.0',
      status: 'in_review',
      amendment_reason: 'Remove HFT/arbitrage framing, replace vacuum tunnel with 1km SMF-28 fiber, remove 14.8 ps erroneous collision, reassign Test 42 to 1999.6kg tungsten support load (19.61 kN -> <=0.08 kN), register Test 14 prediction debt (11-14% vs 141 ps), controlled quench, ordinary inertial response with 1 kJ damper dissipation, twelve nodes as architecture hypothesis only.',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (a01Err) throw new Error(`Amendment creation failed: ${a01Err.message}`);
  console.log(`Amendment Run created: ${a01Run.code} (${a01Run.id})\n`);

  // 4. Update Act 2 Chapter Gates with Architect-Revised Questions & Answers
  console.log('Updating Act 2 Chapter Gates with Architect-Revised Answers...');
  const { data: ch1 } = await supabase.from('content_units').select('id').eq('source_path', 'act-5/ch-1').single();
  const { data: ch2 } = await supabase.from('content_units').select('id').eq('source_path', 'act-5/ch-2').single();
  const { data: ch3 } = await supabase.from('content_units').select('id').eq('source_path', 'act-5/ch-3').single();
  const { data: ch4 } = await supabase.from('content_units').select('id').eq('source_path', 'act-5/ch-4').single();

  const AMENDED_CHAPTER_GATES = [
    {
      chapter_unit_id: ch1.id,
      local_question: '과학적 필요성이 아직 확정되지 않은 상태에서 장기 산업 리드타임에 대비하는 행위는 어떻게 정당화될 수 있는가?',
      answer: 'Vance는 과학적 결론과 산업적 준비를 분리한다. 그는 12노드 시스템이나 행성방어체계를 발주하지 않고, 도태되어도 손실이 제한적인 conductor capacity, test stand, cryogenic capability, alternate supplier, metrology와 전문인력의 옵션을 먼저 확보한다. 이 과정에서 physics latency, control latency, industrial latency가 서로 다른 시스템의 동일한 지연 문제로 제시된다.',
      larger_question: '독립적인 실험이 실제로 collider 밖에서도 제어와 상관된 propagation response를 보여주는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — KEEP_COMPRESS (Target: 6,430 words, -16.4%).',
    },
    {
      chapter_unit_id: ch2.id,
      local_question: '물리적 길이 변화나 공통 계측오류로 설명되지 않는 가역적 propagation-delay response를 실험실에서 재현할 수 있는가?',
      answer: '밀봉·열제어된 1km SMF-28 광섬유와 독립 timing chain에서 약 60 ps의 가역적 field-correlated delay reduction이 측정된다. 양방향 계측과 phase reversal은 단순 launch/receive artifact 및 열적 설명을 약화하지만, 결과는 local superluminal propagation, fiber contraction 또는 metric modification을 직접 확립하지 않는다.',
      larger_question: '더 강한 제어영역에서도 이 광학적 반응이 유지되며, 그것을 발생시키는 하드웨어가 살아남을 수 있는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — CLAIM-STRENGTH CORRECTION REQUIRED (Target: 5,170 words, -15.7%).',
    },
    {
      chapter_unit_id: ch3.id,
      local_question: '광학적 phase response는 더 강한 장에서 유지되며, 어떤 하드웨어 구조가 이를 반복적으로 생성할 수 있는가?',
      answer: 'Test Fourteen은 더 큰 광학반응을 생성하지만 frozen numerical prediction을 초과하고, 예상 밖의 AC loss가 current sharing과 통제된 quench를 일으킨다. 물리적 반응은 남지만 기존 impregnated Nb3Sn 구조는 scaling article로 폐기된다. CICC 기반 Mark II와 executed-state control로 재설계한 뒤, Test Forty-Two는 1999.6kg 텅스텐 질량에서 재현 가능한 phase-state-correlated support-force reduction을 검출한다.',
      larger_question: '거의 지지되지 않는 질량은 관성까지 잃는가, 그리고 그 효과는 물체에 남는가 아니면 제어된 공간영역에 속하는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — PROTECTED FAILURE / PREDICTION DEBT (Target: 10,200 words, -17.2%).',
    },
    {
      chapter_unit_id: ch4.id,
      local_question: '지지하중이 거의 사라진 제어상태에서 질량의 관성응답과 경계 통과 특성은 어떻게 변하는가?',
      answer: '텅스텐 질량은 여러 힘·방향·제어세기에서 대략 정상적인 관성응답을 유지한다. support response는 제어영역과의 공간적 overlap에 따라 연속적으로 복귀하고, 물체에 지속적인 상태변화나 검출 가능한 에너지·운동량 불연속은 남지 않는다. 이 공간적 경계성은 대규모 폐곡면 제어가 가능하다면 fast local execution과 slow global coordination이 필요하다는 distributed architecture hypothesis로 이어진다. 12라는 수는 현재 모델의 연구용 engineering knee일 뿐 물리상수나 구축된 시스템이 아니다.',
      larger_question: '자연적으로 발생하는 거시적 anomaly는 실험실에서 정의한 support·propagation·orientation 제어축과 어떤 관계를 갖는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — FUTURE-CAPABILITY BOUNDARY PROTECTED (Target: 10,350 words, -17.2%).',
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
  console.log('Act 2 Chapter Gates updated successfully.\n');

  // 5. Update Act 2 Scene Matrices with Exact Epistemic Boundaries & Protected Assets
  console.log('Updating Act 2 Scene Matrices with Exact Epistemic Boundaries...');
  const SCENE_AMENDMENTS = [
    {
      scene_unit_id: 'a5e4bb6e-b810-5e9d-aac3-2f142996253a', // Sc 1: The Man Who Owns Delay
      protected_assets: [
        '“The wall displayed no stock prices. A supply-chain map.”',
        '“Science tells me what is true. Manufacturing tells me when truth becomes useful.”',
        '“The first thing with a lead time longer than the time we can afford to discover we need it.”',
        '“I’m comparing reversible loss with irreversible delay.”',
        '“Waiting is also a control decision. But acting early does not make the model more true.”',
      ],
      epistemic_boundary: {
        known: 'Marcus Vance는 주가나 금융 차익거래가 아니라 도체 빌렛, 구리 가닥, Nb3Sn, 용광로 슬롯, 극저온 압축기, 전력 반도체, 인증 리드타임 등 산업 역량 지도를 관리함.',
        investment_principle: '가역적 손실(reversible loss)은 비가역적 지연(irreversible delay)을 줄이기 위해 정당화될 수 있으나, 선행 투자가 과학적 모델을 더 참되게 만들지는 않음.',
        forbidden_conclusion: '초단타 매매나 금융 차익거래를 위한 12개 노드 구축 계약이라는 왜곡.',
      },
    },
    {
      scene_unit_id: 'f53d41ed-51ad-5d2e-b76c-f7e6d7aff1a7', // Sc 2: Apocalypse and Latency
      protected_assets: [
        'Contract terms: reversible architecture-agnostic manufacturing capacity reservation',
        'Three latencies: physics latency, control latency, industrial latency',
        'Sarah Hayes enforces data integrity audit clauses into the corporate charter',
      ],
      epistemic_boundary: {
        known: 'Vance는 12개 노드나 행성 방어체계를 계약하는 것이 아니라, 가역적 제조 옵션만을 선행 확보함.',
        forbidden_conclusion: '12개 노드 건설 또는 물리적 행성망 배치 계약 체결.',
      },
    },
    {
      scene_unit_id: '73a67014-cd4a-5b6b-a04d-b871dd914f24', // Ch 2 Sc 1: The Sealed Kilometer
      protected_assets: [
        'Sealed, thermally controlled 1 km commercial SMF-28 optical fiber wound on a mandrel',
        'Pressure-monitored enclosure with separate optical bench and independent timing chains',
        '“The first empty-bench test failed.”',
      ],
      epistemic_boundary: {
        known: '실험 장치는 고진공 터널이 아니라 밀봉·열제어된 1km 상용 SMF-28 단일모드 광섬유 시스템임.',
        forbidden_conclusion: '1km 고진공 터널 간섭계라는 오인.',
      },
    },
    {
      scene_unit_id: '61c8f2ab-e98a-5179-9de3-106312c64c3e', // Ch 2 Sc 2: The Phase Fold
      protected_assets: [
        '“Any measured delay change refers initially to effective optical path / group propagation time.”',
        '“No physical contraction of fiber is implied without independent length measurement.”',
        '“No claim of local superluminal propagation.”',
        '“No claim yet of a spacetime metric modification.”',
        'Validated state: ~60 ps reversible field-correlated delay reduction (~12.3 mm equivalent optical length)',
      ],
      epistemic_boundary: {
        observed: '약 60 ps의 가역적 전파 지연 감소 (고정 nominal group index 환산 시 약 12.3 mm 상당 광로).',
        not_established: '광섬유의 실제 물리적 수축, 국소 초광속 전파, 시공간 메트릭 변형.',
      },
    },
    {
      scene_unit_id: '984b038a-3d0a-525b-afb5-1e90d948beab', // Ch 3 Sc 1: Test Fourteen
      protected_assets: [
        '“Bulk isn’t where coils die.”',
        '“Yesterday’s conductor is gone.”',
        '“Physics success does not imply hardware viability.”',
        '“The equation had survived. The conductor had not.”',
        'Frozen quantitative prediction: 11-14% increase over Test 13 (~118 ps -> 130.98-134.52 ps)',
        'Observation: ~141 ps before abort (~19.5% increase, quantitative prediction failed)',
      ],
      epistemic_boundary: {
        nature_of_failure: 'Controlled quench with localized conductor damage (NOT a catastrophic or destructive quench).',
        safety_status: 'Cryogenic pressure, ground fault, insulation, and personnel remained within safety limits; main winding energy dumped safely.',
        debt_link: 'SCIENCE_DEBT_ACT2_TEST14_PREDICTION_001',
      },
    },
    {
      scene_unit_id: 'f69327d2-29d5-5118-aa1a-32ceac117618', // Ch 3 Sc 2: The Current-Sharing Boundary
      protected_assets: [
        '“Analyze the executed geometry.”',
        'Current-sharing boundary (전류 분배 한계) in high-field superconducting architecture',
        'Mark II redesign: Cable-in-Conduit Conductor (CICC) with central cooling channel',
      ],
      epistemic_boundary: {
        known: '초전도체의 전류 분배 한계(current-sharing boundary)가 하드웨어 스케일링의 핵심 제약으로 확인됨.',
        typo_fixed: '전류 분유 한계 -> 전류 분배 한계 / current sharing',
      },
    },
    {
      scene_unit_id: 'ab3816ac-7ba0-5dc7-a779-26ddf714fb0e', // Ch 3 Sc 3: Test Forty-Two
      protected_assets: [
        '“No direct measurement of gravitational field strength was performed.”',
        '“No direct measurement of inertial mass was performed.”',
        '“No claim of zero gravitational mass is justified from support-force data alone.”',
        'Test Forty-Two: support-load reduction for 1999.6 kg tungsten test mass',
        'Support load: 19.61 kN baseline -> residual ~0.08 kN or less at maximum validated state',
      ],
      epistemic_boundary: {
        observed: '1999.6 kg 텅스텐 질량에 대한 기계적 지지 하중이 19.61 kN에서 0.08 kN 이하로 99% 이상 감소함.',
        removed_error: '14.8 ps 단축 언급 완전 삭제 (압축률 14.8% 필드 혼입 오류 제거).',
        not_established: '중력 질량 소멸, 중력장 강도 직접 측정, 관성 질량 직접 측정.',
      },
    },
    {
      scene_unit_id: 'dbd87850-5f27-5640-89d9-27d2f2115fd2', // Ch 4 Sc 1: The Weightless Block
      protected_assets: [
        'THE WEIGHTLESS BLOCK -> crossed out -> SUPPORT-DECOUPLED MASS',
        '“We measure force and acceleration. Not mass.”',
        '“The object carries its inertia through the boundary.”',
        'Horizontal force of 300 N produces ~0.15 m/s² acceleration (F/a ≈ 2000 kg, ordinary inertial response)',
      ],
      epistemic_boundary: {
        observed: '지지 하중이 99% 이상 감소한 제어 영역 안에서도 수평 관성 응답(F/a ≈ 2000 kg)은 대략 정상적으로 유지됨.',
        not_established: '내재적 질량 변화, 등가원리 위반, 관성 이상.',
      },
    },
    {
      scene_unit_id: '8a430f33-e32a-57b4-a1dc-9f4da25a5fcb', // Ch 4 Sc 2: The Mass That Remained
      protected_assets: [
        'Continuous return of gravitational support response during boundary exit',
        'Descending into instrumented cradle (6 cm drop)',
        '~1 kJ mechanical energy dissipation through hydraulic and crush-energy system',
        '“No unresolved momentum or energy discontinuity was detected within present experimental precision.”',
      ],
      epistemic_boundary: {
        energy_path: '지지 복귀 시 약 1 kJ의 기계적 에너지가 유압/완충 댐퍼 시스템을 통해 안전하게 소산됨.',
        removed_error: '텅스텐 밸러스트에 미지의 반작용 에너지가 방출되었다는 표현 삭제.',
      },
    },
    {
      scene_unit_id: '629127c5-400f-57ba-8bd8-d9463ae1255f', // Ch 4 Sc 3: Twelve Nodes
      protected_assets: [
        'PLANETARY FAST GLOBAL FEEDBACK: IMPOSSIBLE',
        '12 = CURRENT ENGINEERING MINIMUM FOR STUDY / NOT FUNDAMENTAL',
        'ODYSSEUS: DISTRIBUTED GEOMETRIC CONTROL STUDY (NOT Planetary Shield)',
        'Fast local execution vs slow global coordination architectural principle',
      ],
      epistemic_boundary: {
        status: '12개 노드는 대규모 제어를 위한 분산 아키텍처 연구 가설(architecture hypothesis)일 뿐임.',
        future_boundary: '12개 노드 물리적 구축 및 가동(commissioning)은 Act 4의 영역임. Act 2에서 행성 방어망 구축은 엄격히 금지됨.',
        debt_link: 'FUTURE_CAPABILITY_DEBT_ACT2_TWELVE_NODES_001',
      },
    },
  ];

  for (const sa of SCENE_AMENDMENTS) {
    const updateData: any = {};
    if (sa.protected_assets) updateData.protected_assets = sa.protected_assets;
    if (sa.epistemic_boundary) updateData.epistemic_boundary = sa.epistemic_boundary;

    const { error: smErr } = await supabase
      .from('scene_matrices')
      .update(updateData)
      .eq('snapshot_id', baseSnap.id)
      .eq('scene_unit_id', sa.scene_unit_id);
    if (smErr) throw new Error(`Scene Matrix update failed for ${sa.scene_unit_id}: ${smErr.message}`);
  }
  console.log('Act 2 Scene Matrices amended with exact epistemic definitions.\n');

  // 6. Calculate SHA-256 Amendment Hash and Lock B1_PASS1_ACT2_001_A01
  console.log('Calculating A01 Amendment Hash and locking B1_PASS1_ACT2_001_A01...');
  const a01Payload = JSON.stringify({
    parent_audit: baseAudit.code,
    amendment_code: A01_CODE,
    debts: DEBTS.map(d => d.code),
    gates: AMENDED_CHAPTER_GATES,
    scene_amendments: SCENE_AMENDMENTS,
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
  console.log(' PASS 1 ACT 2 AUDIT AMENDMENT A01 LOCKED SUCCESSFULLY!     ');
  console.log('===========================================================');
  console.log(`Amendment Code: ${A01_CODE}`);
  console.log(`Parent Audit Code: ${baseAudit.code}`);
  console.log(`A01 Hash (SHA-256): ${a01Hash}`);
  console.log(`Status: LOCKED (Act 2 Epistemic, Scientific & Industrial Boundaries Fully Aligned)`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
