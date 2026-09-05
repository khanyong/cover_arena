import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('=== PASS 1 PROLOGUE SCENE INVENTORY SEEDER ===\n');

  // 1. Fetch project & snapshots
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: act2 } = await supabase.from('content_units').select('id').eq('source_path', 'act-2').single();

  console.log(`Project: ${proj.id}`);
  console.log(`Source Snapshot (Baseline): ${baseSnap.id}`);
  console.log(`Target Snapshot (Draft): ${targetSnap.id}`);

  // 2. Fetch Chapters of Prologue
  const { data: ch1 } = await supabase.from('content_units').select('id').eq('source_path', 'act-2/ch-2').single();
  const { data: ch2 } = await supabase.from('content_units').select('id').eq('source_path', 'act-2/ch-3').single();
  const { data: ch3 } = await supabase.from('content_units').select('id').eq('source_path', 'act-2/ch-4').single();

  // 3. Upsert Audit Run B1_PASS1_PROLOGUE_001
  const AUDIT_CODE = 'B1_PASS1_PROLOGUE_001';
  console.log(`Creating Audit Run ${AUDIT_CODE}...`);

  const { data: auditRun, error: arErr } = await supabase
    .from('audit_runs')
    .upsert({
      code: AUDIT_CODE,
      project_id: proj.id,
      source_snapshot_id: baseSnap.id,
      target_snapshot_id: targetSnap.id,
      pass_number: 1,
      scope_unit_id: act2.id,
      scope_name: 'PROLOGUE',
      criteria_version: '1.0.0',
      status: 'in_review',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (arErr) throw new Error(`Audit run creation failed: ${arErr.message}`);
  console.log(`Audit Run ID: ${auditRun.id}`);

  // 4. Exact Diagnostic Records for the 5 Canonical Prologue Scenes
  const SCENE_DIAGNOSTICS = [
    {
      scene_unit_id: '55b46292-0335-5fbc-ab9e-baa44d3bea70', // Scene 1: The Architecture of Consensus
      current_words: 1842,
      target_words: 1610, // ~12.6% compression
      compression_percent: 12.6,
      action: 'KEEP_COMPRESS',
      pov_character: 'Sarah 중심, Sterling 보조',
      local_question: '승인된 Epsilon 제어구조는 최대에너지 실험을 안전하게 모델 경계까지 운용할 수 있는가?',
      new_evidence: '아직 이상현상은 없음. 정상 baseline과 제어 아키텍처가 확립됨.',
      model_movement: 'Epsilon은 vacuum의 근본이론이 아니라 phenomenological model로 제시됨. Ian의 대안 모델이 도입됨.',
      capability: '초기 bunch crossing의 측정으로 후속 crossing 조건을 조절하는 중앙 feedback.',
      constraint: '느린 주자석, 제한된 fast corrector, 중앙 통신 의존, Ian solver의 미검증 상태.',
      character_decision: 'Sarah가 Sterling의 금지에도 불구하고 local FPGA sandbox에 solver를 보존함.',
      power_shift: '아직 실행 권력은 Sterling에게 있으나, Sarah가 비인가 local contingency를 생성함.',
      final_consequence: 'NGC가 숨겨진 대안 제어수단을 가진 상태로 실험에 진입함.',
      next_problem: 'Epsilon이 실제 이상현상을 억제할 것인가, 오히려 증폭할 것인가.',
      protected_status: 'Structural',
      protected_assets: [
        'Epsilon이 fundamental theory가 아니라 phenomenological model이라는 한계',
        '느린 주자석과 빠른 보조 actuator의 구분',
        'Sarah가 코드를 audit했다는 사실',
        'sandbox가 중앙제어권을 갖지 않는다는 사실',
        'A fire extinguisher for a fire she did not believe existed.',
        'The mathematics alone did nothing to the collider. The machine did.'
      ],
      repetition_notes: 'NGC 조직·예산·설비에 관한 중복 설명 압축. Epsilon의 수학적 설명과 operational translation의 동의어 반복 압축. 정상 상태 유사 계측값 축약.',
      future_book_notes: 'Sarah의 현장 FPGA sandbox 보존은 후반 G-DCL 분산제어의 원형이므로 하드웨어 세대 보존 필수.',
      rationale: '이후 모든 갈등에 필요한 3대 구조(Sterling 중앙합의, Sarah 안전렌즈, 비인가 샌드박스)를 설치하므로 Scene 필수 유지 및 10~15% 압축.',
    },
    {
      scene_unit_id: 'd08d2485-7457-522e-b928-e4067b535080', // Scene 2: The Accumulating Residual
      current_words: 2104,
      target_words: 1788, // ~15.0% compression
      compression_percent: 15.0,
      action: 'KEEP_COMPRESS',
      pov_character: 'Sarah',
      local_question: '승인된 feedback가 새 residual을 안정화할 수 있는가?',
      new_evidence: '독립 optical baselines의 상관된 proper-length residual, clock-distance disagreement, actuator intervention 뒤의 증폭.',
      model_movement: 'Epsilon saturation model이 약화됨. Epsilon correction이 parametric driver라는 설명이 강하게 지지됨.',
      capability: '중앙 abort와 local protection이 존재하지만 동일한 causal timing을 유지하지 못함.',
      constraint: '중앙–Sector Four 사이 effective propagation delay 증가, actuator margin 고갈, quench와 energy extraction 지연.',
      character_decision: 'Sarah가 Epsilon feedback를 차단하려 하고, Sterling은 독립 observable을 요구한 뒤 abort를 결정함.',
      power_shift: '중앙 control이 실행력을 잃고 local protection domain이 상대적으로 중요해짐.',
      final_consequence: '중앙 명령은 Sector Four에 도달하지 못하고, local sandbox만 shear 내부에서 작동 가능한 상태가 됨.',
      next_problem: '미검증 Ian solver에 제한적 actuator authority를 부여할 것인가.',
      protected_status: 'Structural',
      protected_assets: [
        'Epsilon intervention 이후 residual이 더 커지는 인과관계',
        'The physical path existed. Its timing no longer did.',
        'quench detection과 energy extraction의 구분',
        'The quench itself was not catastrophic. The failure to remove the stored energy was.',
        'main magnet field가 명령 즉시 사라지지 않는 공학적 순서',
        'SANDBOX: LOCAL / CENTRAL HEARTBEAT: LOST',
        'unlike them, it was already on the other side of the shear'
      ],
      repetition_notes: '밀리초 단위 타임스탬프(401, 403, 405, 411...) 나열 강도 완화. 센서 독립성 재확인 및 actuator authority 수치 반복 압축. 미래 복선(Aris Thorne...) 제거.',
      future_book_notes: '인과 지연 및 quench 물리 시퀀스 보존.',
      rationale: '새로운 관측 -> 중앙 인과구조 붕괴 -> quench -> 권한 위기의 에스컬레이션을 완성하므로 유지 및 12~18% 압축.',
    },
    {
      scene_unit_id: 'ac0e469c-713c-536d-a29c-2ca833aad7d1', // Scene 3: Local Execution
      current_words: 3118,
      target_words: 2650, // ~15.0% compression
      compression_percent: 15.0,
      action: 'KEEP_COMPRESS_PROTECTED',
      pov_character: '운영상 Sarah, 이론상 Ian',
      local_question: '미검증 local counter-field가 hardware envelope 안에서 runaway를 멈추고 보호계통을 복구할 수 있는가?',
      new_evidence: 'local sensor domain의 내부 일관성, leading mismatch 감소, residual plateau, beam extraction 복구, native residual의 단계적 완화.',
      model_movement: 'leading asymptotic cancellation은 지지됨. 완전한 closure, finite residual, network decoherence 예측은 실패 또는 미완성.',
      capability: 'central timestamp나 global coordinate 없이 local proper interval로 실행되는 bounded autonomous control.',
      constraint: 'actuator hard limit, 중앙 revocation 불확실, 주자석 응답 불가, finite residual, 영구적 장비손상.',
      character_decision: 'Sarah가 actuator envelope과 non-overridable abort를 설정하고, Sterling이 미검증 solver의 실행을 승인함.',
      power_shift: 'Sterling의 단일 중앙권한이 Sarah의 release authority와 local FPGA execution authority로 분해됨.',
      final_consequence: 'leading runaway가 정지하고 보호계통이 beam과 stored energy를 제거하지만, residual과 손상이 남음.',
      next_problem: '이 결과가 무엇을 의미하며, 누가 그 의미를 말할 권리를 갖는가.',
      protected_status: 'Canon',
      protected_assets: [
        'The machine isn’t blind. We are.',
        'Ian에게 직접 actuator authority가 없다는 사실',
        'You write the geometry, Ian. I decide what the machine can execute.',
        'solver가 main magnet, beam energy, cryogenic plant를 소유하지 않는다는 제한',
        'hardware-level abort가 solver보다 상위라는 조건',
        'doing nothing도 하나의 intervention이 된다는 Sterling의 판단',
        'leading asymptotic mismatch의 실측',
        'residual이 0이 아니라 plateau에 머무는 결과',
        'beam dump와 magnetic energy extraction이 별개의 절차라는 점',
        'weak bias를 5% 남기는 보수적 결정',
        'Ian이 finite residual, network decoherence, quench를 예측하지 못했다고 인정하는 장면',
        'That proves your counter-field worked. It does not prove the universe is deterministic.'
      ],
      repetition_notes: 'local frame과 central frame 중복 설명 압축. Q_s, C_s 수식 해설의 반복 beat 제거. mismatch 4%->3%->2% 및 ramp-down 모든 단계의 과도한 서술 압축.',
      future_book_notes: 'Paper I 선도 발산항 상쇄 수학 모델과 유한 잔차의 엄밀성 100% 보존 필수.',
      rationale: 'Prologue의 핵심 하드 SF 클라이맥스로서 5자 권한 분리와 과학적 정합성을 엄격히 보호하며 12~18% 압축.',
    },
    {
      scene_unit_id: '7f4ea026-c161-5929-884e-aa03c9a2fa53', // Scene 4: The Official Record
      current_words: 1682,
      target_words: 1387, // ~17.5% compression
      compression_percent: 17.5,
      action: 'KEEP_COMPRESS',
      pov_character: 'Sarah 중심, Sterling과 Ian의 대립',
      local_question: '사고 후 증거는 무엇까지 말할 수 있으며, 누가 그 기록에 접근할 수 있는가?',
      new_evidence: 'local causal ordering 복원, sensor-family 제거 후에도 남는 residual, incomplete local buffer의 한계.',
      model_movement: 'intervention effect는 강화되지만 fundamental cause와 external propagation은 미확립.',
      capability: 'volatile local buffer를 보존하고 institutional copy와 engineering copy를 생성.',
      constraint: '한 시설, 한 사건, 외부 관측소 없음, independent replication 없음, local cartridge는 full experiment가 아님.',
      character_decision: 'Ian이 전체 사건 설명을 멈추고, Sarah가 claim을 줄이며, Sterling이 raw data 보존과 public exclusion을 동시에 결정.',
      power_shift: 'Sterling과 institution이 archive access와 public reconstruction을 통제하고, Sarah가 제한적 독립 사본을 보존.',
      final_consequence: 'measurement는 보존되지만 public meaning과 검증 접근권은 제한됨.',
      next_problem: 'Ian의 suspension, evidence custody, 독립연구의 가능성.',
      protected_status: 'Structural',
      protected_assets: [
        'Authoritative? / Complete. / Those are not the same word.',
        'raw data를 삭제하지 않는 Sterling',
        'local buffer가 무엇을 포함하고 무엇을 포함하지 않는지',
        'institutional copy와 engineering safety copy',
        'I will call it unresolved.',
        'anomaly channel이 public high-level product에서 제외되는 과정',
        'You didn’t erase the evidence. You just removed the question.',
        'The measurement survived. Access to its meaning did not.'
      ],
      repetition_notes: '데이터 3분류(particle/machine/metrology) 압축. 센서 패밀리 제거 반복 압축. 서술자의 직접 해설 문장 축소하여 대화 자체의 서브텍스트로 전달.',
      future_book_notes: 'Sterling의 과학적 인식론적 정당성과 독점성을 동시에 보존.',
      rationale: '사고의 해석권 통제 및 제도적 권력 갈등을 다루므로 유지 및 15~20% 압축.',
    },
    {
      scene_unit_id: 'a91813d6-bc60-56b8-86d7-114fee4c761e', // Scene 5: Exile and the Geometric Boundary
      current_words: 1682,
      target_words: 1345, // ~20.0% compression
      compression_percent: 20.0,
      action: 'KEEP_REFRAME_COMPRESS',
      pov_character: 'Ian, 초반에는 Sarah와 공동',
      local_question: '제도적 접근권을 잃은 Ian은 불완전한 증거와 불확실성을 어떻게 다룰 것인가?',
      new_evidence: 'suspension의 정당한 근거, cartridge의 제한, numerical reconstruction을 바꾸어도 남는 finite residual.',
      model_movement: 'local control law는 재현 가능한 분석대상이지만 ontology는 선택되지 않음.',
      capability: '외부 기관에 의존하지 않는 offline analysis environment 구축.',
      constraint: 'cartridge는 full event가 아님, 외부 검증 없음, 완전한 고립은 경제·물류적으로 불가능.',
      character_decision: 'Sarah가 조건부로 cartridge를 넘기고, Ian은 incomplete evidence를 과장하지 않기로 함.',
      power_shift: 'institution이 Ian의 공식 권한을 박탈하고, Ian은 자신의 연구경계와 인프라를 직접 구축함.',
      final_consequence: 'Ian이 CAUSE UNKNOWN과 TEST REQUIRED를 기록하고 외부 propagation 가능성을 연구과제로 남김.',
      next_problem: '왜 Ian이 인간 제도보다 물리법칙을 신뢰하게 되었는지를 Act 0이 설명하고, Act 1은 외부 관측을 시작함.',
      protected_status: 'Structural',
      protected_assets: [
        'suspension의 내용이 기술적으로 방어 가능하다는 점',
        'Sarah가 Ian의 행동을 retroactively authorized로 만들지 않는다는 점',
        'Sterling buried access.',
        'cartridge가 exoneration이나 proof of causation이 아니라는 조건',
        'Only the actuator’s memory of the moment geometry stopped behaving.',
        'observatory의 network footprint = zero와 economic footprint ≠ zero',
        'The fantasy of complete isolation ended wherever physics required infrastructure.',
        'The NGC had selected a control law. It had not selected an ontology.',
        'CAUSE UNKNOWN',
        'TEST REQUIRED',
        'compass의 중심이 진리 자체가 아니라 측정의 출발점일 수 있다는 변화',
        'no instrument … had been configured to ask whether anything had propagated beyond the stabilized interaction region'
      ],
      repetition_notes: '행정적 제약 문서 나열 축소. 스코틀랜드 시설 장비 목록(GPU, 광섬유 등) 압축. Act 1의 The Calculus of Isolation과의 중복 서술 사전 축약.',
      future_book_notes: 'Act 0 회상 및 Act 1 외부 관측으로의 교량 역할.',
      rationale: '제네바 처벌에서 스코틀랜드 독립 연구소로의 시공간 전환을 선명히 재구성(Reframe)하고 18~22% 압축.',
    }
  ];

  // 5. Seed Scene Matrices & Structure Change Proposals
  console.log('Seeding Scene Matrices and Structure Change Proposals...');
  for (const diag of SCENE_DIAGNOSTICS) {
    // A. Upsert Scene Matrix
    const { error: smErr } = await supabase
      .from('scene_matrices')
      .upsert({
        audit_run_id: auditRun.id,
        snapshot_id: baseSnap.id,
        scene_unit_id: diag.scene_unit_id,
        pov_character: diag.pov_character,
        local_question: diag.local_question,
        new_evidence: diag.new_evidence,
        model_movement: diag.model_movement,
        capability: diag.capability,
        constraint: diag.constraint,
        character_decision: diag.character_decision,
        power_shift: diag.power_shift,
        final_consequence: diag.final_consequence,
        next_problem: diag.next_problem,
        action: diag.action.startsWith('KEEP') ? 'Keep' : 'Compress',
        compression_target_words: diag.target_words,
        compression_target_percent: diag.compression_percent,
        protected_status: diag.protected_status,
        protected_assets: diag.protected_assets,
        repetition_notes: diag.repetition_notes,
        future_book_notes: diag.future_book_notes,
        status: 'Structure Approved',
        notes: diag.rationale,
      }, { onConflict: 'snapshot_id,scene_unit_id' });

    if (smErr) throw new Error(`Scene Matrix upsert failed for ${diag.scene_unit_id}: ${smErr.message}`);

    // B. Upsert Structure Change Proposal
    const delta = diag.target_words - diag.current_words;
    const { error: scpErr } = await supabase
      .from('structure_change_proposals')
      .upsert({
        audit_run_id: auditRun.id,
        scene_unit_id: diag.scene_unit_id,
        action: diag.action,
        rationale: diag.rationale,
        current_word_count: diag.current_words,
        target_word_count: diag.target_words,
        projected_word_delta: delta,
        target_compression_percent: diag.compression_percent,
        approval_status: 'approved',
      }, { onConflict: 'audit_run_id,scene_unit_id' });

    if (scpErr) throw new Error(`Proposal upsert failed for ${diag.scene_unit_id}: ${scpErr.message}`);
  }
  console.log(`Successfully seeded 5 Scene Matrices and 5 Structure Change Proposals.`);

  // 6. Seed Chapter Gates
  console.log('Seeding Chapter Gates for Chapters 1, 2, 3...');
  const CHAPTER_GATES = [
    {
      chapter_unit_id: ch1.id,
      local_question: '어떤 이론과 권력구조가 NGC를 통제하고 있으며, 승인된 체계 밖에는 어떤 대안이 존재하는가?',
      answer: 'Epsilon은 공식 중앙제어체계이고 Sterling이 권한을 보유하지만, Sarah는 미검증 local solver를 독립 sandbox에 보존했습니다.',
      larger_question: '승인된 controller가 실제 anomaly를 만났을 때 안전하게 동작할 것인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — compression required (10~15% compression required on organizational and theoretical repetition).',
    },
    {
      chapter_unit_id: ch2.id,
      local_question: '중앙 controller가 anomaly를 억제할 수 있는가?',
      answer: '아닙니다. 중앙 Epsilon feedback는 mode를 증폭하고, 중앙–현장 사이의 causal timing이 붕괴합니다. 제한된 local control만이 runaway를 멈추고 보호계통의 실행 가능성을 복원합니다.',
      larger_question: '성공한 intervention은 무엇을 증명하며, 누가 그 의미를 결정하는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — protected scientific and engineering core (Paper I physics and 5-tier authority envelope protected).',
    },
    {
      chapter_unit_id: ch3.id,
      local_question: '사고 후의 증거와 해석권은 누구에게 귀속되는가?',
      answer: 'raw measurement는 보존되지만 institution이 접근과 public interpretation을 통제합니다. Ian은 공식 권한을 잃지만 제한된 local evidence를 보유하고 독립 연구경계를 만듭니다.',
      larger_question: 'local residual은 장비 내부에만 남은 것인가, 아니면 instrumented region 밖으로 전파되었는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — substantial repetition compression required (18~22% reduction on administrative lists and infrastructure details).',
    }
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

    if (cgErr) throw new Error(`Chapter gate upsert failed for ${cg.chapter_unit_id}: ${cgErr.message}`);
  }
  console.log(`Successfully seeded 3 Chapter Gates.`);

  // 7. Calculate Audit Hash and Lock the Audit Run
  console.log('Calculating Audit Hash and locking B1_PASS1_PROLOGUE_001...');
  const auditPayload = JSON.stringify({
    code: AUDIT_CODE,
    scenes: SCENE_DIAGNOSTICS,
    gates: CHAPTER_GATES,
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

  if (lockErr) throw new Error(`Audit run locking failed: ${lockErr.message}`);

  console.log('\n========================================');
  console.log(' PASS 1 PROLOGUE AUDIT RUN LOCKED!      ');
  console.log('========================================');
  console.log(`Audit Run Code: ${AUDIT_CODE}`);
  console.log(`Audit Hash (SHA-256): ${auditHash}`);
  console.log(`Baseline Words: 10,428`);
  console.log(`Target Words: 8,780 (Total Reduction: -1,648 words / -15.8%)`);
  console.log(`Status: LOCKED (Ready for Pass 2 execution)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
