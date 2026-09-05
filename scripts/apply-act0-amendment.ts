import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('=== PASS 1 ACT 0 AUDIT AMENDMENT RUNNER (B1_PASS1_ACT0_001_A01) ===\n');

  // 1. Fetch project & parent audit run
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: parentRun } = await supabase.from('audit_runs').select('*').eq('code', 'B1_PASS1_ACT0_001').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: act0 } = await supabase.from('content_units').select('id').eq('source_path', 'act-3').single();

  if (!parentRun) throw new Error('Parent audit run B1_PASS1_ACT0_001 not found.');
  console.log(`Parent Audit Run: ${parentRun.code} (${parentRun.id}) - Status: ${parentRun.status}`);

  // 2. Create Additive Amendment Audit Run B1_PASS1_ACT0_001_A01
  const AMENDMENT_CODE = 'B1_PASS1_ACT0_001_A01';
  console.log(`Creating Amendment Audit Run ${AMENDMENT_CODE}...`);

  const { data: amendRun, error: arErr } = await supabase
    .from('audit_runs')
    .upsert({
      code: AMENDMENT_CODE,
      parent_audit_id: parentRun.id,
      run_type: 'amendment',
      project_id: proj.id,
      source_snapshot_id: baseSnap.id,
      target_snapshot_id: targetSnap.id,
      pass_number: 1,
      scope_unit_id: act0.id,
      scope_name: 'ACT 0: THE BROKEN VARIABLE (AMENDMENT)',
      criteria_version: '1.1.0',
      status: 'in_review',
      amendment_reason: 'Epistemic-boundary corrections, protected text precision, and series-continuity additions',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (arErr) throw new Error(`Amendment run creation failed: ${arErr.message}`);
  console.log(`Amendment Run ID: ${amendRun.id}\n`);

  // 3. Upsert Updated & New Series Debts (Total 5 Debts)
  console.log('Seeding and Updating Series Debts (5 Total)...');
  const AMENDED_DEBTS = [
    {
      code: 'SERIES_DEBT_A0_B2_URN_001',
      project_id: proj.id,
      debt_type: 'SERIES_BRIDGE',
      title: 'Thermal Timeline & Cremation Custody Chronology Contradiction',
      source_scope: 'Book 1 / Act 0 / The Thermal Timeline (Scene 5)',
      target_scope: 'Book 2 / Opening',
      established_in_source: 'Physically impossible custody chronology established: cremation completed at 19:48, cooling hold ended at 20:30, but electronic barcode scan occurred at 18:29 and transfer completed at 18:30. Cause strictly left UNKNOWN in Book 1. Father legally presumed dead.',
      forbidden_in_target: 'Book 2 opening must NOT rediscover the 18:30 / 20:30 discrepancy as new information, nor jump from this timeline discrepancy to "father is definitely alive / state extracted him".',
      required_in_target: 'Book 2 Evidence Gate must follow: Step 1 (Contemporary anomaly) -> Step 2 (Liveness-dependent evidence requiring live perfusion/pulse/challenge-response) -> Step 3 (Independent logistics corroboration) -> Step 4 (Survival inference) -> Step 5 (Physical confirmation).',
      status: 'OPEN',
    },
    {
      code: 'SERIES_DEBT_A0_B2_BODY_IDENTITY_001',
      project_id: proj.id,
      debt_type: 'SERIES_BRIDGE',
      title: 'Visual Body Identification vs Survival Contradiction',
      source_scope: 'Book 1 / Act 0 / The Official Verdict (Scene 4)',
      target_scope: 'Book 2 / Overall Arc',
      established_in_source: 'Ian and Seo-yeon visually viewed a body presented as Kim Ji-man at the forensic morgue. The face was mostly intact, Seo-yeon touched his hair, Ian saw his hands. Manner of death ruled undetermined.',
      forbidden_in_target: 'Revealing Ji-man alive in Book 2 while ignoring or hand-waving the viewed body. Treating the urn discrepancy as sufficient proof of survival.',
      required_in_target: 'Book 2 must provide a rigorous explanation of whose body was viewed, how it passed institutional identification, and provide evidence stronger than the urn chronology alone.',
      status: 'OPEN',
    },
    {
      code: 'SERIES_DEBT_A0_B2_MASS_PROOF_001',
      project_id: proj.id,
      debt_type: 'EPISTEMIC',
      title: 'WIM Vehicle Mass Measurement vs Personal Identity Verification',
      source_scope: 'Book 1 / Act 0 / The Inverted Logistics (Scene 6) & Book 2 Investigations',
      target_scope: 'Book 2 / Convoy Tracking',
      established_in_source: 'One convoy vehicle carried unexplained additional mass. A single mass measurement cannot identify an individual passenger due to multiple physical variables (fuel, cargo, crew, baseline variance).',
      forbidden_in_target: 'Declaring that +82.4 kg weight match conclusively proves Ji-man was in the vehicle.',
      required_in_target: 'Require multi-layer corroboration: RFID/transponder records + repeated multi-station WIM + vehicle-specific baseline + passenger/load accounting + route continuity before inferring presence.',
      status: 'OPEN',
    },
    {
      code: 'CONTINUITY_DEBT_FAMILY_NAME_001',
      project_id: proj.id,
      debt_type: 'CONTINUITY',
      title: 'Father Surname Canonization: Kim Ji-man vs Yoo Ji-man',
      source_scope: 'Book 1 / Act 0 / Official Verdict & Cremation Records',
      target_scope: 'Books 2–4 Series-wide',
      established_in_source: 'Father is officially named Kim Ji-man in Book 1 (narrative identification, police records, cremation records). Ian Yoo uses maternal surname Yoo (mother: Yoo Seo-yeon).',
      forbidden_in_target: 'Inconsistently referring to father as Yoo Ji-man in subsequent books without in-universe explanation.',
      required_in_target: 'Confirm canonical decision: Father is Kim Ji-man, Ian uses maternal surname Yoo. Provide subtle grounding in Book 1 and normalize across Books 2–4.',
      status: 'OPEN',
    },
    {
      code: 'CHARACTER_DEBT_SEOYEON_METHOD_001',
      project_id: proj.id,
      debt_type: 'CHARACTER_LENS',
      title: "Seo-yeon's Canonical Investigative Lens: Records, Logistics, Invoices",
      source_scope: 'Book 1 / Act 0 (The Raid, Inverted Logistics, Departure Horizon)',
      target_scope: 'Books 2–4 Series-wide',
      established_in_source: "Seo-yeon investigates strictly via records, invoices, access logs, timetables, contracts, corporate manifests, and physical sequence cross-referencing. She explicitly rejects 'conspiracy' leaps and demands narrow conclusions.",
      forbidden_in_target: 'Degrading Seo-yeon into an omnipotent cyberpunk hacker who penetrates military networks or biometric mainframes directly.',
      required_in_target: 'Preserve her authentic methodology: procurement tracking, chain-of-custody audits, legal records, commercial manifests, document authentication.',
      status: 'OPEN',
    }
  ];

  for (const debt of AMENDED_DEBTS) {
    const { error: dErr } = await supabase.from('series_debts').upsert(debt, { onConflict: 'code' });
    if (dErr) throw new Error(`Series debt upsert failed for ${debt.code}: ${dErr.message}`);
  }
  console.log('Successfully seeded/updated 5 Series Debts.\n');

  // 4. Update Chapter Gates with Architect-Revised Questions and Answers
  console.log('Updating Act 0 Chapter Gates...');
  const { data: ch1 } = await supabase.from('content_units').select('id').eq('source_path', 'act-3/ch-1').single();
  const { data: ch2 } = await supabase.from('content_units').select('id').eq('source_path', 'act-3/ch-2').single();
  const { data: ch3 } = await supabase.from('content_units').select('id').eq('source_path', 'act-3/ch-3').single();
  const { data: ch4 } = await supabase.from('content_units').select('id').eq('source_path', 'act-3/ch-4').single();

  const AMENDED_CHAPTER_GATES = [
    {
      chapter_unit_id: ch1.id,
      local_question: 'Ji-man의 검증 가능한 가정과 생존 가능한 불완전성의 원칙은 Ian에게 어떻게 전달되며, Helios 붕괴는 그 원칙을 어떻게 인식론적 상처로 변환하는가?',
      answer: 'Ji-man은 완벽보다 알려지고 제한되며 생존 가능한 불완전성을 가르친다. Helios는 그 실제 원인이 확립되지 않은 채 붕괴하고, Ian은 도면·기억·실제 구조 사이의 간극을 경험한다.',
      larger_question: 'Ian이 기억하는 구조적 우려와 실제 붕괴 순서는 같은 원인을 가리키는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — protected emotional core and engineering imperfection philosophy. Target 14.7% compression (±5% tolerance).',
    },
    {
      chapter_unit_id: ch2.id,
      local_question: '기관의 제한된 공식 언어는 언론과 대중의 반복을 거치면서 어떻게 확정된 자살 서사로 변하는가?',
      answer: '법의학과 공식 브리핑은 추락 사실과 미확정된 사망 방식(Undetermined)만을 제시하지만, 언론은 잘린 공학 노트와 추락 사실을 결합하여 자살·자백 서사로 빠르게 고정한다.',
      larger_question: '감정적 개연성을 넘어 공식 기록 자체를 반박할 물리적 모순이 존재하는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — substantial repetition compression required (19% target with ±5% tolerance on media briefings and raid debates).',
    },
    {
      chapter_unit_id: ch3.id,
      local_question: '서로 독립된 신체처리 기록과 국가 물류 기록은 공식 연대기의 어떤 한계를 드러내는가?',
      answer: '유골함 전산 기록은 실제 화장공정과 물리적으로 양립하지 않고, 정부 연계 readiness의 일부는 Helios보다 먼저 시작되었다. 그러나 두 이상이 하나의 원인에서 발생했는지는 확립되지 않는다.',
      larger_question: '서로 다른 시계들이 같은 음모를 가리키는가, 아니면 일부만 연결되어 있는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — protected epistemic boundary. Thermal timeline and invoice carbon copies protected.',
    },
    {
      chapter_unit_id: ch4.id,
      local_question: '불완전한 증거를 가지고 떠나는 Ian은 어떤 인식론적 결론을 선택하는가?',
      answer: '그는 하나의 물리적 역사와 불완전한 관측을 구분하는 데 성공하지만, 완전한 상태정보가 있다면 모든 모호성을 제거할 수 있다는 미확인 결정론을 자신의 중심으로 선택한다.',
      larger_question: '결정론적 진실에 대한 심리적 요구는 실제 과학적 검증을 강화할 것인가, 통제 욕망으로 변할 것인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — clean departure preserved. Transition to psychologically motivated determinism canonized.',
    }
  ];

  for (const cg of AMENDED_CHAPTER_GATES) {
    const { error: cgErr } = await supabase
      .from('chapter_gates')
      .upsert({
        audit_run_id: parentRun.id,
        chapter_unit_id: cg.chapter_unit_id,
        local_question: cg.local_question,
        answer: cg.answer,
        larger_question: cg.larger_question,
        verdict: cg.verdict,
        verdict_notes: cg.verdict_notes,
      }, { onConflict: 'audit_run_id,chapter_unit_id' });
    if (cgErr) throw new Error(`Chapter gate update failed: ${cgErr.message}`);
  }
  console.log('Successfully updated 4 Chapter Gates.\n');

  // 5. Update Epistemic Boundaries & Protected Assets for Act 0 Scenes
  console.log('Updating Epistemic Boundaries & Protected Assets in Scene Matrices...');

  const SCENE_AMENDMENTS = [
    {
      scene_unit_id: '3c72e09c-e060-5756-8c71-5bde34cfbc54', // Scene 1: The Silver Compass
      protected_assets: [
        'Set the center before you draw, Ian.',
        'If you keep moving the center every time the line becomes inconvenient, the circle means nothing.',
        'Nothing built by people is perfect. The question is whether the imperfection is known, bounded, and survivable.',
        '아버지가 완벽을 요구하지 않았다는 사실',
        '은색 나침반의 바늘과 중심축'
      ],
      epistemic_boundary: {
        known: 'Ji-man은 완벽주의자가 아니라 결함 한계 제어주의자였다.',
        inferred: 'Ian의 훗날 통제 집착은 아버지의 가르침이 상실을 겪으며 왜곡된 결과이다.',
        unknown: 'Ji-man이 당시 설계 결함을 이미 감지하고 있었는가.',
        forbidden_conclusion: '나침반이 초자연적이거나 신비주의적 물건이라는 해석.'
      },
      action: 'KEEP_COMPRESS',
    },
    {
      scene_unit_id: '9d37d99c-9471-5a3c-9cd0-edf60c36bb24', // Scene 2: The Collapse
      protected_assets: [
        '붕괴가 전지적 서술이 아닌 Ian의 직접 감각(소리, 진동, 시야 제한)으로 전달되는 점',
        '기억 속 설계도와 실제 파괴의 잔혹한 대조',
        'Ian이 현장에서 아는 것은 실제 건물이 아니라 과거의 도면이라는 간극'
      ],
      epistemic_boundary: {
        known: '하부 transfer level에서 비대칭적 붕괴가 시작되었다.',
        inferred: '설계도상 취약점과 실제 최초 파괴 위치가 일치하지 않을 가능성.',
        unknown: '실제 붕괴 메커니즘 및 아버지의 정확한 최종 위치.',
        forbidden_conclusion: '설계 한계를 초과했다거나 배후를 현장에서 즉시 알아차렸다는 단정.'
      },
      action: 'KEEP_COMPRESS',
    },
    {
      scene_unit_id: 'ba701488-a4da-52c1-9ac8-33f60adccdb9', // Scene 4: The Official Verdict
      protected_assets: [
        '공식 브리핑은 사인을 추락 외상으로만 밝히고 사망 방식을 Undetermined로 기록한 점',
        '언론이 공학 노트와 추락을 결합해 자살 서사로 변환한 차이',
        '아버지 공식 성씨 Kim Ji-man (경찰/부검 기록: Mr. Kim / Kim Ji-man)'
      ],
      epistemic_boundary: {
        known: 'Ji-man은 추락 외상으로 사망했다. 예비 법의학 보고서에서 사망 방식은 Undetermined로 남았다. Ji-man은 심각한 고소공포증이 있었다. 공식 재구성은 11초의 관측 공백을 포함한다. 언론이 증거보다 앞서 자살로 규정했다.',
        inference: '자발적 투신은 Ji-man의 기존 행동 패턴과 일치하지 않는 것으로 보인다.',
        limit: '급성 위기 상황에서의 행동은 고소공포증만으로 완전히 재구성할 수 없다.',
        unknown: '그가 자발적으로 뛰었는지, 강요받았는지, 밀렸는지, 사전에 교체되었는지 여부.',
        forbidden_conclusion: '공식 법의학 보고서가 자살로 확정했다는 단정; 고소공포증이 살인을 증명한다는 단정.'
      },
      action: 'KEEP_COMPRESS',
    },
    {
      scene_unit_id: '897cef16-f551-501c-858d-4c74e5add72c', // Scene 5: The Thermal Timeline
      protected_assets: [
        'It is a record containing a physically impossible chronology.',
        'The official chronology was broken.',
        '19:48 화장 종료 / 20:30 냉각 종료 / 18:29 스캔 / 18:30 인계 타임스탬프',
        'Not false record, but physically impossible chronology (Semantic)'
      ],
      epistemic_boundary: {
        known: '19:48 화장 종료, 20:30 냉각 종료, 18:29-18:30 전산 인계. 이 전산 기록은 Ji-man 유골의 물리적 처리를 나타낼 수 없다.',
        inferred: '적어도 하나의 기록된 이벤트는 그것이 주장하는 물리적 사건을 나타내지 않는다.',
        hypotheses: ['Fabrication', 'Pre-staging', 'Database corruption', 'Workflow misassignment', 'Credential misuse', 'Administrative error'],
        unknown: '어느 가설이 옳은지, 불일치가 고의적이었는지, 누구의 유골이 처리되었는지, Ji-man이 생존했는지.',
        forbidden_conclusion: '기록이 고의로 조작되었다; 유골함이 확실히 대체되었다; Ji-man은 확실히 생존해 있다.'
      },
      action: 'KEEP_COMPRESS',
    },
    {
      scene_unit_id: '4d4f7754-aff7-5887-ac2f-36ceb02921c8', // Scene 6: The Inverted Logistics
      protected_assets: [
        '36시간 전은 물류 발주가 아닌 인프라 안보 inquiry 시작 시점임',
        'T-17h 군용 수송, T-15h 상업 제한, T-14h 긴급 화물, T-12h 중철도, T-10h 연료, T-8h 다중항만, T-4h 연행, T0 붕괴 타임라인',
        '서연의 교정: Do not make the government an omnipotent intelligence.'
      ],
      epistemic_boundary: {
        known: '정부 연계 수송·연료·인프라 readiness가 Helios 이전에 가속화되었다. 목적지 패턴은 주로 Helios를 향한 긴급 대응이 아니었다.',
        inferred: '일부 당국은 중대한 비상사태(contingency)를 예상하고 있었다.',
        unknown: '예상된 비상사태의 실체; 어느 기관이 무슨 정보를 가졌는지; Helios가 구체적으로 예상되었는지; 연행과 readiness와 붕괴가 하나의 원인을 공유하는지.',
        forbidden_conclusion: '정부가 Helios 붕괴를 알고 있었다; 모든 사전 이동이 단일 음모의 일부였다; 물류 순서가 자작극(false flag)을 증명한다.'
      },
      action: 'KEEP_COMPRESS',
    },
    {
      scene_unit_id: '3d005e08-1f42-521b-be86-b6fb3efe0326', // Scene 8: The Absolute Boundary
      protected_assets: [
        'One reality. Incomplete observation.',
        'Uncertainty belongs to the observer, not necessarily to the event.',
        'If all relevant variables were known, the ambiguity would disappear. (Arc-protected; unproven sentence noted by manuscript as UNCONFIRMED)',
        'Ian이 단일한 물리적 역사를 완전한 인식 가능성의 약속으로 착각하는 내적 전환'
      ],
      epistemic_boundary: {
        known: '사건은 하나의 물리적 역사만을 가지며, 관측자는 불완전하게 접근한다.',
        inferred: '모든 상태변수를 알면 모호성이 사라질 것이라는 Ian의 주관적 신념(UNCONFIRMED).',
        epistemic_status: 'Psychologically motivated extrapolation; not established truth.',
        forbidden_conclusion: '작품의 물리학 자체가 라플라스적 결정론을 진리로 확립했다는 단정.'
      },
      action: 'KEEP_REFRAME_COMPRESS',
    }
  ];

  for (const sca of SCENE_AMENDMENTS) {
    const { error: smErr } = await supabase
      .from('scene_matrices')
      .update({
        protected_assets: sca.protected_assets,
        epistemic_boundary: sca.epistemic_boundary,
      })
      .eq('snapshot_id', baseSnap.id)
      .eq('scene_unit_id', sca.scene_unit_id);

    if (smErr) throw new Error(`Scene matrix amendment update failed for ${sca.scene_unit_id}: ${smErr.message}`);

    // Update proposal with tolerance and target_type
    const { error: scpErr } = await supabase
      .from('structure_change_proposals')
      .update({
        action: sca.action,
        target_tolerance_percent: 5.00,
        target_type: 'editorial_guidance',
        is_hard_limit: false,
      })
      .eq('audit_run_id', parentRun.id)
      .eq('scene_unit_id', sca.scene_unit_id);

    if (scpErr) throw new Error(`Proposal update failed for ${sca.scene_unit_id}: ${scpErr.message}`);
  }
  console.log('Successfully updated Epistemic Boundaries and Proposals in Database.\n');

  // 6. Calculate Amendment Hash & Lock B1_PASS1_ACT0_001_A01
  console.log('Calculating Amendment Hash and locking B1_PASS1_ACT0_001_A01...');
  const amendPayload = JSON.stringify({
    parent_run: parentRun.code,
    amendment_code: AMENDMENT_CODE,
    debts: AMENDED_DEBTS,
    gates: AMENDED_CHAPTER_GATES,
    scene_amendments: SCENE_AMENDMENTS,
  });
  const amendHash = crypto.createHash('sha256').update(amendPayload).digest('hex');

  const { error: lockErr } = await supabase
    .from('audit_runs')
    .update({
      status: 'locked',
      audit_hash: amendHash,
      locked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', amendRun.id);

  if (lockErr) throw new Error(`Amendment run locking failed: ${lockErr.message}`);

  console.log('======================================================');
  console.log(' PASS 1 ACT 0 AUDIT AMENDMENT LOCKED SUCCESSFULLY!    ');
  console.log('======================================================');
  console.log(`Amendment Code: ${AMENDMENT_CODE}`);
  console.log(`Parent Audit Code: ${parentRun.code}`);
  console.log(`Amendment Hash (SHA-256): ${amendHash}`);
  console.log(`Series Debts Total: 5 (2 Critical Added)`);
  console.log(`Status: LOCKED (Pass 1 Act 0 Epistemic Amendment Complete)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
