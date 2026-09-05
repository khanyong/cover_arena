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
  console.log('=== PASS 1 ACT 1 AUDIT AMENDMENT A01 RUNNER ===\n');

  // 1. Fetch Project, Snapshots and Base Audit
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: baseAudit } = await supabase.from('audit_runs').select('*').eq('code', 'B1_PASS1_ACT1_001').single();
  const { data: act1Unit } = await supabase.from('content_units').select('id').eq('source_path', 'act-4').single();

  if (!baseAudit) throw new Error('Base audit B1_PASS1_ACT1_001 not found.');
  console.log(`Base Audit: ${baseAudit.code} (${baseAudit.id}) - Status: ${baseAudit.status}`);

  // 2. Register Platform Incident: PLATFORM_INCIDENT_SNAPSHOT_CLONE_001
  console.log('Registering Platform Incident PLATFORM_INCIDENT_SNAPSHOT_CLONE_001...');
  const { error: incErr } = await supabase
    .from('platform_incidents')
    .upsert({
      code: 'PLATFORM_INCIDENT_SNAPSHOT_CLONE_001',
      severity: 'CRITICAL',
      category: 'SNAPSHOT_COMPLETENESS',
      source_snapshot_id: baseSnap.id,
      target_snapshot_id: targetSnap.id,
      details: {
        expected_mapping_count: 45647,
        missing_rows_detected: 11070,
        inferred_pre_repair_count: 34577,
        detection_method: 'fn_verify_snapshot_zero_diff / verify-zero-diff.ts',
        repair_method: 'fn_complete_snapshot_copy',
        repair_inserted_count: 11070,
        post_repair_zero_diff: {
          baseline_rows: 45647,
          working_rows: 45647,
          only_in_working: 0,
          only_in_baseline: 0,
          mismatched_rows: 0,
          difference_count: 0,
          is_identical: true,
        },
        content_loss_confirmed: 'NONE',
        root_cause: 'OPEN / TO BE DETERMINED (Investigating batch offset / pagination client drop)',
      },
      status: 'REPAIRED',
      resolved_at: new Date().toISOString(),
    }, { onConflict: 'code' });

  if (incErr) throw new Error(`Incident registration failed: ${incErr.message}`);
  console.log('Incident registered: PLATFORM_INCIDENT_SNAPSHOT_CLONE_001 (Status: REPAIRED)\n');

  // 3. Register Provenance Record: B1_PASS1_PROVENANCE_001
  console.log('Registering Provenance Record B1_PASS1_PROVENANCE_001...');
  const { error: provErr } = await supabase
    .from('provenance_records')
    .upsert({
      code: 'B1_PASS1_PROVENANCE_001',
      record_type: 'SNAPSHOT_AUTHENTICITY',
      statement: 'All prior Pass 1 audits are analytically grounded in B1_v1.0_LOCKED. The repaired target snapshot has been independently verified via PostgreSQL zero-diff as fully identical to the locked source.',
      evidence_reference: 'reports/b1-v10-v11-zero-diff.json',
      details: {
        source_snapshot: 'B1_v1.0_LOCKED',
        target_snapshot: 'B1_v1.1_STRUCT_DRAFT',
        verified_rows: 45647,
        mismatches: 0,
        zero_diff_status: 'IDENTICAL',
      }
    }, { onConflict: 'code' });

  if (provErr) throw new Error(`Provenance record failed: ${provErr.message}`);
  console.log('Provenance recorded: B1_PASS1_PROVENANCE_001\n');

  // 4. Register Repetition Debt: REPETITION_DEBT_PRO_S5_ACT1_S1_001
  console.log('Registering Repetition Debt REPETITION_DEBT_PRO_S5_ACT1_S1_001...');
  const { error: repErr } = await supabase
    .from('repetition_debts')
    .upsert({
      code: 'REPETITION_DEBT_PRO_S5_ACT1_S1_001',
      source_scope: 'Prologue / Chapter 3 / Scene 5: Exile and the Geometric Boundary',
      target_scope: 'Act 1 / Chapter 1 / Scene 1: The Calculus of Isolation',
      description: 'Atmospheric infrastructure and Coats Observatory Scottish landscape description duplicated between Prologue and Act 1.',
      recommended_action: 'Trim descriptive redundancies and Coats references in Act 1 Scene 1; focus Act 1 on Ian 6-year measurement rigor and internal discipline.',
      status: 'OPEN',
    }, { onConflict: 'code' });

  if (repErr) throw new Error(`Repetition debt failed: ${repErr.message}`);
  console.log('Repetition Debt registered: REPETITION_DEBT_PRO_S5_ACT1_S1_001 (Status: OPEN)\n');

  // 5. Create Additive Audit Amendment B1_PASS1_ACT1_001_A01
  const A01_CODE = 'B1_PASS1_ACT1_001_A01';
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
      scope_unit_id: act1Unit.id,
      scope_name: 'ACT 1: THE RETURNING SIGNATURE (A01 AMENDMENT)',
      criteria_version: '1.1.0',
      status: 'in_review',
      amendment_reason: 'Sarah Hayes name & systems authority role correction, institutional validation reframe, three observational domains definition, elimination of Betti/Euler invariants, 0.23c/9.6y reattribution to Scene 9, measured vs unmeasured causal arrows in Scene 10, protected failure assets registration.',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (a01Err) throw new Error(`Amendment creation failed: ${a01Err.message}`);
  console.log(`Amendment Run created: ${a01Run.code} (${a01Run.id})\n`);

  // 6. Update 4 Chapter Gates with Architect-Revised Questions & Answers
  console.log('Updating Act 1 Chapter Gates with Architect-Revised Answers...');
  const { data: ch1 } = await supabase.from('content_units').select('id').eq('source_path', 'act-4/ch-1').single();
  const { data: ch2 } = await supabase.from('content_units').select('id').eq('source_path', 'act-4/ch-2').single();
  const { data: ch3 } = await supabase.from('content_units').select('id').eq('source_path', 'act-4/ch-3').single();
  const { data: ch4 } = await supabase.from('content_units').select('id').eq('source_path', 'act-4/ch-4').single();

  const AMENDED_CHAPTER_GATES = [
    {
      chapter_unit_id: ch1.id,
      local_question: '다중기기·다중 epoch의 천문학적 candidate가 instrument-specific morphology와 Ian 자신의 기대를 제거한 뒤에도 살아남는가?',
      answer: 'candidate residual은 instrument-independent quantities, external reduction, archival baseline, prospective epoch를 거치며 생존한다. 이는 일부 계통오차를 약화하고 시간구조를 부여하지만, 모든 관측오차와 천체물리적 대안을 제거하거나 물리적 원인을 확립하지는 않는다.',
      larger_question: 'Geneva와의 비교 전에, 천문 residual과 독립적인 시간영역에서도 호환 가능한 구조가 존재하는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — KEEP_COMPRESS (Target: 5,070 words, -16.0%).',
    },
    {
      chapter_unit_id: ch2.id,
      local_question: '천문 anomaly와 독립적으로 생성된 PTA 자료를 사후 방향조정 없이 검증할 수 있으며, 기관은 그 검증을 막는가 아니면 제한적으로 허용하는가?',
      answer: 'Sarah는 방향정보가 제거된 frozen PTA inputs를 가져오고 adversarial tests를 설계한다. low-significance timing residual은 astrometric anomaly와 통계적으로 호환되지만 물리적 해석은 승인되지 않는다. Sterling은 raw archive 전체가 아니라 제한된 Geneva record를 정식 chain of custody로 열어 준다.',
      larger_question: '서로 다른 세 관측영역에서 instrument-specific 형태를 버린 뒤에도 하나의 reduced dynamical structure가 남는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — KEEP_REFRAME_COMPRESS (Target: 6,830 words, -18.2%).',
    },
    {
      chapter_unit_id: ch3.id,
      local_question: 'astrometry, PTA, Geneva처럼 단위·시간척도·측정방식이 다른 세 domain에서 무엇을 정직하게 비교할 수 있는가?',
      answer: '직접 waveform match는 실패하고 최초 cross-domain solve는 식별 불가능하다. 연구팀은 absolute amplitude, absolute time, image morphology를 버리고 independently measurable reduced features를 비교한다. 하나의 frozen global dilation 아래 일부 관계가 생존하지만 PTA는 저해상도 validation domain일 뿐이며 인과 방향은 미확정이다.',
      larger_question: 'scale과 instrument representation을 제거한 뒤 남는 circulation-like structure는 실제 위상적 제약인가, reconstruction artifact인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — PROTECTED FAILURE RECORD (Target: 7,660 words, -16.7%).',
    },
    {
      chapter_unit_id: ch4.id,
      local_question: 'representation이 다른 측정에서 공통 geometric constraint가 지지되는가, 그리고 그로부터 어떤 propagation model까지 정당화할 수 있는가?',
      answer: 'Geneva closed-loop accumulation과 천문자료의 circulation proxy는 공통 reduced geometry 후보를 지지하지만 정확한 topological invariant나 동일 존재론을 확립하지 않는다. 세 phenomenological propagation class가 남고, inward nonlinear branch가 현재 가장 적은 자유변수를 요구한다. 약 0.23c와 9.6년 intercept는 그 branch가 맞을 때만 성립하며, 실제로 측정된 causal arrow는 remote region에서 Earth observer로 도달한 정보뿐이다.',
      larger_question: '불확실한 model projection을 바탕으로 어느 정도의 산업적·공학적 선행 투자가 정당화되는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — CLAIM REATTRIBUTION REQUIRED (Target: 8,350 words, -16.8%).',
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
  console.log('Act 1 Chapter Gates updated successfully.\n');

  // 7. Update Act 1 Scene Matrices & Proposals with Precise Epistemic Boundaries & Failure Assets
  console.log('Updating Act 1 Scene Matrices with Precise Epistemic Boundaries and Failure Assets...');
  const SCENE_AMENDMENTS = [
    {
      scene_unit_id: 'a0e5b198-48d4-5b0c-95aa-1c5f746379d0', // Sc 1: The Calculus of Isolation
      repetition_notes: 'Prologue Scene 5(Exile and the Geometric Boundary)와의 Coats Observatory 및 스코틀랜드 지형 묘사 중복 가지치기. Ian의 6년간 측정 중심성과 내적 규율 확립.',
    },
    {
      scene_unit_id: 'ae93c354-6b25-5549-a266-51d7cd9da5cd', // Sc 3: Bureaucratic Suppression
      action: 'KEEP_REFRAME_COMPRESS',
      epistemic_boundary: {
        known: 'Timing consortium은 방향성 잔차를 즉시 공표하지 않고 독립 검증을 수행하며, 기술문서도 현재 어떤 물리적 해석도 승인하지 않는다고 제한함.',
        inferred: '제도는 과학을 단순히 억압(suppress)하는 것이 아니라, 검증 속도를 늦추고(delayed to test it) 프로토콜을 통제함.',
        forbidden_conclusion: '기관이 거대 음모에 포섭되어 고의로 은폐하고 있다는 단순 억압 서사.',
      },
    },
    {
      scene_unit_id: 'ca209ef9-e5bc-5517-8987-6139ea13a846', // Sc 4: Arrival and the Hidden Node
      protected_assets: [
        'Sarah Hayes: independent systems and data-integrity authority',
        'Frozen PTA inputs preservation and directional contamination prevention',
        'Blind and adversarial reconstruction protocol',
        'Ian의 명사를 observable로 축소하고 실패한 분석을 기록하도록 강제하는 Sarah의 역할',
      ],
      epistemic_boundary: {
        known: 'Sarah Hayes는 방향 정보가 오염되지 않은 frozen PTA inputs와 metadata를 확보하여 도착함.',
        character_lens: 'Systems / Safety / Data Integrity',
        forbidden_conclusion: 'Sarah를 단순 조수나 분광학 분석가로 축소하는 것.',
      },
    },
    {
      scene_unit_id: '625fd20e-619e-57b9-92ca-67ab3a62fb54', // Sc 6: The Second Clock
      protected_assets: [
        'PTA IS A VALIDATION DOMAIN, NOT THE HIGH-RESOLUTION FINGERPRINT DOMAIN.',
        'Pulse-arrival residuals sampled across years',
        'Three observational domains: Astrometry (ruler across months), PTA (clock across years), Geneva (machine clock across milliseconds)',
      ],
      epistemic_boundary: {
        known: 'PTA 신호는 저유의성(low-significance), 희소(sparse), 모델 의존적(model-dependent)이며 고해상도 지문이 아님.',
        forbidden_conclusion: '신호 속도(0.23c)와 전파 지연(9.6년)이 Scene 6에서 관측 또는 도출되었다는 오류(Scene 9로 귀속됨).',
      },
    },
    {
      scene_unit_id: '34fdc60b-0382-5797-ada8-bee911f1d0a6', // Sc 7: The Third Clock and Decomposition
      protected_assets: [
        'SOLUTION NOT IDENTIFIABLE UNDER CURRENT PARAMETERIZATION',
        'The first comparison failed.',
        'Tested terrestrial-clock, chromatic, receiver, pulsar-subset, and solar-system-reference systematics alter the result but do not fully reproduce cross-domain correspondence',
      ],
      epistemic_boundary: {
        known: '직접 waveform matching은 실패하였고 최초 cross-domain solve는 식별 불가능함. absolute amplitude, absolute time, image morphology를 버리고 reduced features를 비교함.',
        inferred: 'shared-reference explanation은 소멸한(dead) 것이 아니라 축소된(shrinking) 상태임.',
        forbidden_conclusion: '4대 전자기적 대안 모델이 완전히 기각되었다는 과장.',
      },
    },
    {
      scene_unit_id: 'a02f4623-d146-58ad-a297-9dfce8f29035', // Sc 8: Topological Invariants Match
      protected_assets: [
        'It is data consistent with winding.',
        'It was not a true continuum line integral. It was a finite-sampling proxy.',
        'Geneva closed-loop phase accumulation is nonzero, consistent with +1 winding-like index within uncertainty',
        'Astronomical displacement supports nonzero circulation proxy of Geneva-compatible sign',
      ],
      epistemic_boundary: {
        known: 'Geneva의 폐회로 위상 누적과 천문자료의 이산적 다각형 순환(circulation proxy)이 호환 가능한 부호와 축소 기하학을 지지함.',
        not_established: 'A mathematically exact topological invariant; a common physical object; a shared ontology; Betti-number or Euler-characteristic identity.',
        forbidden_conclusion: '위상 수학적 지문이 같으므로 동일한 물리적 실체나 Betti수/오일러 지표가 일치한다는 단정.',
      },
    },
    {
      scene_unit_id: 'dd878a38-c82a-508a-9ce5-93c82a764b8c', // Sc 9: The Calculus of Rupture
      protected_assets: [
        'MODEL-INFERRED NONLINEAR BRANCH',
        'IF INWARD-PROPAGATING BRANCH MODEL IS CORRECT',
        'MODEL-PROJECTED EARTH INTERCEPT',
        '~0.23c nonlinear-branch pattern speed (Model-Derived)',
        '~9.6-year model-projected Earth intercept (Conditional Projection)',
        'Three viable phenomenological models: 1. inward nonlinear branch, 2. expanding or oblique shell, 3. localized evolving source with unknown Geneva coupling',
      ],
      epistemic_boundary: {
        model_derived: '~0.23c nonlinear-branch pattern speed; ~9.6-year Earth intercept.',
        not_observed: 'Radial motion toward Earth. 현재 관측된 저진폭 이상(low-amplitude anomaly)은 파괴적인 비선형 상태(destructive nonlinear state) 자체가 아님.',
        forbidden_conclusion: '0.23c와 9.6년을 직접 관측된 우주 단층선의 전파 속도로 선언하는 것.',
      },
    },
    {
      scene_unit_id: '74633433-4c73-5fa9-a7b5-335d7dc13482', // Sc 10: The Causal Limit
      protected_assets: [
        'Which arrow have you measured?',
        'Direction of causation: unknown.',
        'Sterling causal diagram: G (Geneva), R (Remote anomaly), O (Earth observer), X (Unknown cause)',
        'Measured arrow: R -> O (arriving photons & astrometry) + PTA timing observable',
        'Unmeasured arrows: G -> R, R -> G, X -> G, X -> R',
      ],
      epistemic_boundary: {
        primary_question: 'Which causal relationship has actually been measured?',
        known: 'Photons carried information from remote region to Earth. PTA supplied independent timing observable.',
        unknown: 'Whether Geneva caused remote event; whether remote event caused Geneva; whether third cause X produced both; whether either region propagates toward the other.',
        forbidden_conclusion: 'Act 1이 경로 단축 공학(path-shortening engineering)이나 초자연적 즉시 통신을 확립했다는 비약.',
      },
    }
  ];

  for (const sa of SCENE_AMENDMENTS) {
    const updateData: any = {};
    if (sa.repetition_notes) updateData.repetition_notes = sa.repetition_notes;
    if (sa.protected_assets) updateData.protected_assets = sa.protected_assets;
    if (sa.epistemic_boundary) updateData.epistemic_boundary = sa.epistemic_boundary;

    if (Object.keys(updateData).length > 0) {
      const { error: smErr } = await supabase
        .from('scene_matrices')
        .update(updateData)
        .eq('snapshot_id', baseSnap.id)
        .eq('scene_unit_id', sa.scene_unit_id);
      if (smErr) throw new Error(`Scene Matrix update failed for ${sa.scene_unit_id}: ${smErr.message}`);
    }

    if (sa.action) {
      await supabase
        .from('structure_change_proposals')
        .update({ action: sa.action })
        .eq('audit_run_id', baseAudit.id)
        .eq('scene_unit_id', sa.scene_unit_id);
    }
  }
  console.log('Act 1 Scene Matrices and Proposals amended with exact epistemic definitions.\n');

  // 8. Calculate SHA-256 Amendment Hash and Lock B1_PASS1_ACT1_001_A01
  console.log('Calculating A01 Amendment Hash and locking B1_PASS1_ACT1_001_A01...');
  const a01Payload = JSON.stringify({
    parent_audit: baseAudit.code,
    amendment_code: A01_CODE,
    incident_reference: 'PLATFORM_INCIDENT_SNAPSHOT_CLONE_001',
    provenance_reference: 'B1_PASS1_PROVENANCE_001',
    repetition_debt: 'REPETITION_DEBT_PRO_S5_ACT1_S1_001',
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
  console.log(' PASS 1 ACT 1 AUDIT AMENDMENT A01 LOCKED SUCCESSFULLY!     ');
  console.log('===========================================================');
  console.log(`Amendment Code: ${A01_CODE}`);
  console.log(`Parent Audit Code: ${baseAudit.code}`);
  console.log(`A01 Hash (SHA-256): ${a01Hash}`);
  console.log(`Status: LOCKED (Act 1 Epistemic & Narrative Boundaries Fully Aligned)`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
