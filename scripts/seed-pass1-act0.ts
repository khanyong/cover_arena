import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('=== PASS 1 ACT 0 SCENE INVENTORY & SERIES DEBT SEEDER ===\n');

  // 1. Fetch project & snapshots
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: act0 } = await supabase.from('content_units').select('id').eq('source_path', 'act-3').single();

  console.log(`Project: ${proj.id}`);
  console.log(`Source Snapshot (Baseline): ${baseSnap.id}`);
  console.log(`Target Snapshot (Draft): ${targetSnap.id}`);
  console.log(`Act 0 Scope Unit: ${act0.id}\n`);

  // 2. Fetch Chapters of Act 0
  const { data: ch1 } = await supabase.from('content_units').select('id').eq('source_path', 'act-3/ch-1').single();
  const { data: ch2 } = await supabase.from('content_units').select('id').eq('source_path', 'act-3/ch-2').single();
  const { data: ch3 } = await supabase.from('content_units').select('id').eq('source_path', 'act-3/ch-3').single();
  const { data: ch4 } = await supabase.from('content_units').select('id').eq('source_path', 'act-3/ch-4').single();

  // 3. Upsert Audit Run B1_PASS1_ACT0_001
  const AUDIT_CODE = 'B1_PASS1_ACT0_001';
  console.log(`Creating Audit Run ${AUDIT_CODE}...`);

  const { data: auditRun, error: arErr } = await supabase
    .from('audit_runs')
    .upsert({
      code: AUDIT_CODE,
      project_id: proj.id,
      source_snapshot_id: baseSnap.id,
      target_snapshot_id: targetSnap.id,
      pass_number: 1,
      scope_unit_id: act0.id,
      scope_name: 'ACT 0: THE BROKEN VARIABLE',
      criteria_version: '1.0.0',
      status: 'in_review',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (arErr) throw new Error(`Audit run creation failed: ${arErr.message}`);
  console.log(`Audit Run ID: ${auditRun.id}\n`);

  // 4. Seed the 3 Series Debts
  console.log('Seeding Series Debts...');
  const SERIES_DEBTS = [
    {
      code: 'SERIES_DEBT_A0_B2_URN_001',
      project_id: proj.id,
      debt_type: 'SERIES_BRIDGE',
      title: 'Thermal Timeline & Cremation Custody Chronology Contradiction',
      source_scope: 'Book 1 / Act 0 / The Thermal Timeline (Scene 5)',
      target_scope: 'Book 2 / Opening',
      established_in_source: 'Physically impossible custody chronology established: cremation completed at 19:48, cooling hold ended at 20:30, but electronic barcode scan occurred at 18:29 and transfer completed at 18:30. Cause strictly left UNKNOWN in Book 1. Father legally presumed dead.',
      forbidden_in_target: 'Book 2 opening must NOT rediscover the 18:30 / 20:30 discrepancy as new information, nor jump from this timeline discrepancy to "father is alive / state extracted him".',
      required_in_target: 'Book 2 must reactivate the old unresolved chronology with genuinely new present-tense evidence (e.g. recent biometric access, living-body authentication, contemporary procurement, facility movement).',
      status: 'OPEN',
    },
    {
      code: 'CONTINUITY_DEBT_FAMILY_NAME_001',
      project_id: proj.id,
      debt_type: 'CONTINUITY',
      title: 'Father Surname Canonization: Kim Ji-man vs Yoo Ji-man',
      source_scope: 'Book 1 / Act 0 / Official Verdict & Cremation Records',
      target_scope: 'Books 2–4 Series-wide',
      established_in_source: 'Father is officially named Kim Ji-man in Book 1 (cremation records, silver compass, official briefings). Ian Yoo uses the maternal surname Yoo.',
      forbidden_in_target: 'Inconsistently referring to father as Yoo Ji-man in subsequent books without in-universe legal explanation.',
      required_in_target: 'Confirm canonical decision: Father is Kim Ji-man, Ian legally or socially uses maternal surname Yoo. Provide subtle grounding in Book 1 and normalize across Books 2–4.',
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

  for (const debt of SERIES_DEBTS) {
    const { error: dErr } = await supabase
      .from('series_debts')
      .upsert(debt, { onConflict: 'code' });
    if (dErr) throw new Error(`Series Debt upsert failed for ${debt.code}: ${dErr.message}`);
  }
  console.log(`Successfully seeded 3 Series Debts.\n`);

  // 5. Exact Act 0 Diagnostics for 8 Scenes
  const ACT0_SCENES = [
    {
      scene_unit_id: '3c72e09c-e060-5756-8c71-5bde34cfbc54', // Scene 1: The Silver Compass
      chapter_unit_id: ch1.id,
      current_words: 2589,
      target_words: 2250,
      compression_percent: 13.1,
      action: 'KEEP_COMPRESS',
      pov_character: 'Ian (유년기 회상) / Ji-man',
      local_question: '아버지는 Ian에게 완벽이 아닌 무엇을 가르쳤으며, silver compass는 어떤 원칙을 담고 있는가?',
      new_evidence: 'Ji-man의 설계 철학(인간이 만든 것은 결코 완벽하지 않으며, 결함이 알려지고 제한되고 생존 가능해야 함), 은색 나침반의 수여.',
      model_movement: '완벽한 통제라는 환상 대신 "known, bounded, survivable imperfection"의 공학 철학 확립.',
      capability: '구조물의 고유진동수와 응력을 손과 나침반으로 감지하는 계측적 직관.',
      constraint: '인간의 시공과 재료는 항상 결함을 내포함. 중심축(pivot)을 움직이지 않는 것만이 오류를 제한함.',
      character_decision: 'Ji-man이 Ian에게 중심을 지키되 완벽을 가장하지 말 것을 당부하고 은색 나침반을 넘김.',
      power_shift: '부자간의 기술적 신뢰와 평생의 인식론적 기준점 전수.',
      final_consequence: 'Ian이 평생 지니게 될 측정 기준점(은색 나침반)과 불완전성 수용 철학의 원형이 각인됨.',
      next_problem: '이 철학이 현실의 거대한 건축적 부패와 붕괴 앞에서 어떻게 시험받을 것인가.',
      protected_status: 'Canon',
      protected_assets: [
        'known, bounded, survivable imperfection',
        'Do not move the pivot.',
        'The compass does not show what you wish to see. It shows where the field points.',
        '아버지가 완벽을 요구하지 않았다는 사실',
        '은색 나침반의 바늘과 중심축'
      ],
      epistemic_boundary: {
        known: 'Ji-man은 완벽주의자가 아니라 결함 한계 제어주의자였다.',
        inferred: 'Ian의 훗날 통제 집착은 아버지의 가르침이 상실을 겪으며 왜곡된 결과이다.',
        unknown: 'Ji-man이 당시 설계 결함을 이미 감지하고 있었는가.',
        forbidden_conclusion: '나침반이 초자연적이거나 신비주의적 물건이라는 해석.'
      },
      relationship_movement: {
        ian_jiman: '스승이자 아버지로서의 절대적 신뢰 형성',
        ian_seoyeon: '아직 미개입',
        seoyeon_jiman: '아직 미개입',
        ian_institution: '미개입'
      },
      repetition_notes: '나침반에 대한 과도한 미사여구 축약. 아버지 설명 중복 압축.',
      future_book_notes: 'Prologue Scene 5의 Scotland observatory 나침반 묘사와 기원 연결.',
      rationale: 'Ian의 전 생애를 지배하는 인식론적 기준점이자 공학 철학의 원형을 제공하므로 유지 및 13.1% 압축.',
    },
    {
      scene_unit_id: '9d37d99c-9471-5a3c-9cd0-edf60c36bb24', // Scene 2: The Collapse
      chapter_unit_id: ch1.id,
      current_words: 3017,
      target_words: 2530,
      compression_percent: 16.1,
      action: 'KEEP_COMPRESS',
      pov_character: 'Ian',
      local_question: '설계 한계를 초과한 구조적 붕괴는 어떻게 시작되며, Ian은 아버지의 이론이 깨지는 순간을 어떻게 목격하는가?',
      new_evidence: '비정상적 저주파 진동, 콘크리트 미세균열 패턴, 층간 전단 파괴 실측.',
      model_movement: 'bounded imperfection의 한계를 넘어선 시스템 붕괴의 잔혹한 현실성.',
      capability: '붕괴 직전 구조적 비정상을 감지하지만 대피 이상의 개입 능력 부재.',
      constraint: '대형 구조물의 관성과 취약성, 인명 탈출 시간의 절대적 부족.',
      character_decision: 'Ian이 경고를 외치며 붕괴 현장에서 생존자를 이끌어내려 함.',
      power_shift: '자연법칙과 공학적 결함이 모든 인간의 의지를 압도함.',
      final_consequence: '대형 참사 발생, 아버지의 현장 고립/실종, Ian의 세계 붕괴.',
      next_problem: '붕괴의 원인은 자연재해인가, 시공 결함인가, 아니면 인위적 은폐인가.',
      protected_status: 'Structural',
      protected_assets: [
        '붕괴가 전지적 서술이 아닌 Ian의 직접 감각(소리, 진동, 시야 제한)으로 전달되는 점',
        '기억 속 설계도와 실제 파괴의 잔혹한 대조',
        'The building did not fall because gravity changed. It fell because someone lied about the steel.'
      ],
      epistemic_boundary: {
        known: '구조물이 설계 한계를 초과하여 붕괴했다.',
        inferred: '시공 과정에 미승인 변경이나 부패가 개입되었을 가능성.',
        unknown: '최초 파괴점(failure trigger) 및 아버지의 정확한 최종 위치.',
        forbidden_conclusion: 'Ian이 현장에서 붕괴의 배후를 즉시 알아차렸다는 서술.'
      },
      relationship_movement: {
        ian_jiman: '물리적 단절 발생',
        ian_seoyeon: '미개입',
        seoyeon_jiman: '미개입',
        ian_institution: '국가 안전체계에 대한 원초적 의심 태동'
      },
      repetition_notes: 'Act 3의 대규모 재난 묘사와 리듬 중복 방지를 위해 공학적 구조파괴 묘사 간결화.',
      future_book_notes: '후반 참사 장면들과의 서술 차별화 유지.',
      rationale: '참사의 직접적 충격을 Ian의 제한된 시야로 전달하며 16.1% 압축.',
    },
    {
      scene_unit_id: '9da3ac4e-d7ab-5fae-94d2-5a4713b59b6e', // Scene 3: The Raid
      chapter_unit_id: ch2.id,
      current_words: 3909,
      target_words: 3250,
      compression_percent: 16.9,
      action: 'KEEP_COMPRESS',
      pov_character: 'Ian / Seo-yeon 중심',
      local_question: '사고 직후 국가·기관은 어떤 절차로 증거와 연구실을 압류하며, Seo-yeon은 어떻게 법적·물리적 방어선을 구축하는가?',
      new_evidence: '정부 합동조사반/수사관들의 영장 없는 연구실 압수수색, 하드웨어와 문서 선별 압류.',
      model_movement: '국가 기관은 완벽한 악의가 아니라 관료적 절차와 책임 회피의 집합체로 작동함.',
      capability: 'Seo-yeon의 기록 보존(체크리스트, 사본 분산, 압류 목록 대조).',
      constraint: '공권력의 물리적 강제력, 영장 및 행정 권한의 불평등.',
      character_decision: 'Seo-yeon이 핵심 로컬 백업과 노트를 숨기고, Ian에게 합법적 절차의 틈을 이용해 침묵을 지킬 것을 지시함.',
      power_shift: '국가 기관이 연구소를 봉쇄하지만, 서연이 필수 증거의 1차 사본을 사수함.',
      final_consequence: '연구실 봉쇄, Ji-man의 연구자료 공식 압류, Ian의 제도적 고립 심화.',
      next_problem: '공식 발표가 진실을 어떻게 왜곡할 것인가.',
      protected_status: 'Structural',
      protected_assets: [
        '서연이 해커가 아니라 법률·기록·절차 전문가로 행동함',
        '국가를 단일한 전지적 악당으로 묘사하지 않는 복합성',
        'You do not fight a subpoena with noise. You fight it with receipts.'
      ],
      epistemic_boundary: {
        known: '수사관들이 특정 설계 데이터만을 선별 압류하고 있다.',
        inferred: '상부의 사전 가이드라인이 존재함.',
        unknown: '수사 명령의 최종 발신자.',
        forbidden_conclusion: '서연이 수사관들의 시스템을 실시간 해킹한다는 식의 첩보 연출.'
      },
      relationship_movement: {
        ian_jiman: '남겨진 유산 보존 의무',
        ian_seoyeon: '보호자-의뢰인을 넘어 기록 동맹의 시초 형성',
        seoyeon_jiman: '전문가로서의 유가족 보호 책무',
        ian_institution: '공권력의 물리적 폭력성 체감'
      },
      repetition_notes: '압수수색 대치 장면의 장황한 설전 압축.',
      future_book_notes: '서연의 현실적 조사 렌즈 확립.',
      rationale: '서연의 현실적 전문성과 국가 관료제 압박을 확립하며 16.9% 압축.',
    },
    {
      scene_unit_id: 'ba701488-a4da-52c1-9ac8-33f60adccdb9', // Scene 4: The Official Verdict
      chapter_unit_id: ch2.id,
      current_words: 4751,
      target_words: 3850,
      compression_percent: 19.0,
      action: 'KEEP_COMPRESS',
      pov_character: 'Ian 중심, Seo-yeon',
      local_question: '기관은 사망 원인을 어떻게 조작하지 않고도 편향된 결론(자살/개인 과실)으로 유도하는가?',
      new_evidence: '합동브리핑 공식 결론(개인 과실 및 비관 투신), 유서 없는 사망 판정, 고소공포증 병력과의 모순.',
      model_movement: '기관은 거짓말을 만들기보다 맥락을 제거하고 편리한 추론을 공식 결론으로 채택함.',
      capability: '서연과 Ian의 부검/수사 기록 원본 입수 및 분석.',
      constraint: '반론을 제기할 공식 언론 및 제도적 통로 전무.',
      character_decision: 'Ian이 공식 결론을 거부하고 개인적 조사를 결심함. 서연은 감정적 반발 대신 증거 대조를 시작함.',
      power_shift: '언론과 공공 인식이 아버지의 과실로 기울어짐.',
      final_consequence: 'Kim Ji-man의 명예 실추, 수사 종결, 독립 검증의 필요성 대두.',
      next_problem: '공식 타임라인과 실제 유해 처리 과정 사이에 물리적 불일치가 존재하는가.',
      protected_status: 'Structural',
      protected_assets: [
        '고소공포증은 사실이 아닌 추론의 충돌로만 제한',
        '아버지 공식 성씨 Kim Ji-man',
        '기관이 데이터를 지우지 않고 맥락을 제거하는 방식',
        'They did not lie. They simply selected which truth was permitted to survive.'
      ],
      epistemic_boundary: {
        known: '공식 발표는 자살/개인 과실이다. Ji-man은 심각한 고소공포증이 있었다.',
        inferred: '고소공포증 환자가 자발적으로 난간에서 투신했을 가능성은 극히 희박하다.',
        unknown: '그가 추락한 정확한 물리적 경위(밀림, 실족, 유인 등).',
        forbidden_conclusion: '타살범의 신원을 단정하는 행위.'
      },
      relationship_movement: {
        ian_jiman: '오명에 맞선 진실 규명 결의',
        ian_seoyeon: '감정적 Ian과 이성적 서연의 균형 확립',
        seoyeon_jiman: '고인의 명예를 문서로 복원하려는 책무',
        ian_institution: '공식 제도에 대한 영구적 신뢰 상실'
      },
      repetition_notes: '언론 브리핑 기사 인용 및 미디어 반응의 방대한 나열 대폭 축약.',
      future_book_notes: 'Kim/Yoo 성씨 표기 연속성 보존 (CONTINUITY_DEBT_FAMILY_NAME_001).',
      rationale: '장면 분량(4,751단어)이 과도하므로 미디어 중복을 대폭 정제하여 19.0% 압축.',
    },
    {
      scene_unit_id: '897cef16-f551-501c-858d-4c74e5add72c', // Scene 5: The Thermal Timeline
      chapter_unit_id: ch3.id,
      current_words: 3462,
      target_words: 2980,
      compression_percent: 13.9,
      action: 'KEEP_COMPRESS',
      pov_character: 'Seo-yeon & Ian',
      local_question: '화장장 전산 타임라인과 열역학적 물리 한계는 왜 서로 공존할 수 없는가?',
      new_evidence: '화장 종료 19:48, 냉각 종료 20:30, 전산 바코드 스캔 18:29, 전산 인계 완료 18:30, 물리적 유골 인도 21:08.',
      model_movement: '사망 조작이나 생존으로 비약하지 않고, "물리적으로 불가능한 인계 순서(Physically impossible custody chronology)"라는 좁고 완벽한 관측 사실 확립.',
      capability: '공정 물리 순서와 서로 다른 전산 시스템의 데이터베이스 대조.',
      constraint: '18:30에 스캔된 유골함의 실체와 행방을 추적할 권한 부재.',
      character_decision: '서연과 Ian이 결론을 과장하지 않고, 원인을 UNKNOWN으로 남기며 타임라인 데이터를 보존함.',
      power_shift: '공식 기록의 무오성이라는 환상이 물리 법칙 앞에서 붕괴함.',
      final_consequence: '유골함의 내용물이 Ji-man의 실제 화장 유골일 수 없다는 물리적 확정, 그러나 생존 여부는 미정으로 남음.',
      next_problem: '이 모순을 뒷받침하는 또 다른 배후 물류(물자 사전 배치)가 존재하는가.',
      protected_status: 'Canon',
      protected_assets: [
        '19:48 화장 종료 / 20:30 냉각 종료 / 18:29 스캔 / 18:30 인계 타임스탬프',
        'Not false record, but physically impossible chronology.',
        '서연의 교정: Do not call it living. Call it an unresolved physical contradiction.'
      ],
      epistemic_boundary: {
        known: '18:30 전산 인계된 유골함은 19:48에 끝난 화장의 결과물일 수 없다.',
        inferred: '유골함이 사전에 대체되었거나 전산 처리가 날조되었다.',
        unknown: '아버지가 살아있는가, 시신이 다른 곳에 있는가, 단순한 행정 오류인가.',
        forbidden_conclusion: '아버지가 100% 생존해 있으며 국가가 추출했다는 단정.'
      },
      relationship_movement: {
        ian_jiman: '물리적 죽음에 대한 근본적 의문',
        ian_seoyeon: '비약하려는 Ian의 충동을 서연의 엄밀한 방법론이 제어함',
        seoyeon_jiman: '유골함 진위의 법적 모순 포착',
        ian_institution: '국가 전산망의 기만성 포착'
      },
      repetition_notes: '서류 번호 대조 과정의 반복 비트 압축.',
      future_book_notes: '제2권 오프닝의 중복 재발견 금지 및 브리지 부채 등록 (SERIES_DEBT_A0_B2_URN_001).',
      rationale: 'Act 0의 인식론적 핵심 장면으로서 과학적 엄밀성을 완벽히 보호하며 13.9% 압축.',
    },
    {
      scene_unit_id: '4d4f7754-aff7-5887-ac2f-36ceb02921c8', // Scene 6: The Inverted Logistics
      chapter_unit_id: ch3.id,
      current_words: 4709,
      target_words: 3900,
      compression_percent: 17.2,
      action: 'KEEP_COMPRESS',
      pov_character: 'Seo-yeon 중심, Ian',
      local_question: '사고 현장 주변의 사전 물류 이동(차량, 자재, 봉쇄 장비)은 사고 전부터 준비되었는가?',
      new_evidence: '사고 발생 36시간 전 특수 수송차량 배차, 사고 12시간 전 격리 펜스 자재 이동 승인 내역.',
      model_movement: '사전 물류 준비가 곧 참사의 원인은 아님(contingency preparation vs causation 구분).',
      capability: '화물 송장, 고속도로 톨게이트 기록, 기업 물류 전산 분석.',
      constraint: '배차 지시를 내린 부서의 암호화된 계약 주체 미확인.',
      character_decision: 'Ian이 국가 계획 음모로 비약하려 하자 서연이 "위험 인지와 참사 기획은 다르다"며 정밀 교정함.',
      power_shift: '참사가 우발적 사고가 아니라 사전 인지된 위험의 결과였음이 드러남.',
      final_consequence: '단순 부실공사가 아닌 대규모 조직적 사태 은폐 구조 확인.',
      next_problem: '국내에서 더 이상 안전하게 조사를 지속할 수 없는 상황 도래.',
      protected_status: 'Structural',
      protected_assets: [
        'contingency preparation과 causation의 엄격한 구분',
        '서연의 반박: Do not make the government an omnipotent intelligence.',
        'The invoices survived because logistics cannot exist without carbon copies.'
      ],
      epistemic_boundary: {
        known: '사고 전 격리 장비와 특수 수송이 사전 발주되었다.',
        inferred: '기관 내부 일부는 붕괴 위험을 사전에 인지하고 있었다.',
        unknown: '고의적 붕괴 유도인가, 단순 은폐 대비인가.',
        forbidden_conclusion: '국가 전체가 단일 의도로 음모를 기획했다는 비약.'
      },
      relationship_movement: {
        ian_jiman: '아버지의 고립 배경 이해',
        ian_seoyeon: '서연의 엄밀한 조사 원칙이 Ian의 과학적 방법론에 결정적 영향',
        seoyeon_jiman: '배후 진실 추적',
        ian_institution: '사전 은폐 구조 확인'
      },
      repetition_notes: '물류 송장 나열의 지루한 열거 압축 (4,709단어 대폭 정제).',
      future_book_notes: '서연의 현실적 조사자 정체성 수호 (CHARACTER_DEBT_SEOYEON_METHOD_001).',
      rationale: '장대하고 장황한 물류 데이터 나열을 서사적 긴장감 위주로 17.2% 압축.',
    },
    {
      scene_unit_id: '63e8557e-16c2-509b-a3f6-067a1aa257bc', // Scene 7: Departure Horizon
      chapter_unit_id: ch4.id,
      current_words: 3236,
      target_words: 2750,
      compression_percent: 15.0,
      action: 'KEEP_COMPRESS',
      pov_character: 'Ian / Seo-yeon',
      local_question: '밀항이나 불법 침투가 아닌 합법적 행정·기업 통로를 통해 어떻게 감시망을 빠져나가는가?',
      new_evidence: '서연이 설계한 기업 연구파견 계약, 보험 승인, 여권 및 법적 통관 기록.',
      model_movement: '탈출은 영웅적 액션이 아니라 행정적 맹점(administrative blind spots)을 이용한 정밀 이동임.',
      capability: '법인 위장 파견, 화물 적재 목록 합법 등록, 출입국 승인 획득.',
      constraint: '출국 직전 감시망의 조여옴, 한 번 떠나면 영구히 귀국하기 어려운 단절의 비용.',
      character_decision: 'Ian이 조국과 일상을 포기하고 스위스/해외로 떠나기로 최종 결심함.',
      power_shift: '감시 세력의 레이더망을 합법 서류의 틈으로 우회 통과함.',
      final_consequence: '합법적 클린 출국 성공, 서연과의 물리적 작별.',
      next_problem: '새로운 연구 환경에서 무엇을 기준으로 삼을 것인가.',
      protected_status: 'Structural',
      protected_assets: [
        '첩보 영화식 해킹이 아닌 정식 corporate manifest 및 합법 통관을 통한 clean departure',
        '서연과의 이별에서 발생하는 감정적 부채',
        'A clean exit leaves no broken locks. It leaves only signed paper.'
      ],
      epistemic_boundary: {
        known: '출국 절차는 합법적 서류로 완결되었다.',
        inferred: '당국은 Ian을 주요 범죄자가 아닌 중요도 낮은 파견자로 분류했다.',
        unknown: '서연이 국내에 남아 치러야 할 행정적·정치적 대가.',
        forbidden_conclusion: '공항 전산망을 해킹해 도주했다는 묘사.'
      },
      relationship_movement: {
        ian_jiman: '유산의 망명',
        ian_seoyeon: '지리적 단절, 서로의 생존을 위한 침묵의 서약',
        seoyeon_jiman: '후계자 보호 완수',
        ian_institution: '국경을 통한 물리적 탈출'
      },
      repetition_notes: '출국 심사 대기 중의 사소한 절차 묘사 압축.',
      future_book_notes: '서연의 조력과 희생 비용 보존.',
      rationale: '클린 디파처의 긴장감을 유지하며 15.0% 압축.',
    },
    {
      scene_unit_id: '3d005e08-1f42-521b-be86-b6fb3efe0326', // Scene 8: The Absolute Boundary
      chapter_unit_id: ch4.id,
      current_words: 3765,
      target_words: 3120,
      compression_percent: 17.1,
      action: 'KEEP_COMPRESS',
      pov_character: 'Ian',
      local_question: '인간과 제도에 대한 신뢰를 잃은 Ian은 왜 물리 법칙과 수학만을 유일한 진리로 삼게 되는가?',
      new_evidence: '비행기 안에서 주머니 속 은색 나침반을 쥐는 Ian, 인간의 언어는 왜곡되지만 나침반의 바늘은 거짓말하지 않는다는 깨달음.',
      model_movement: '인간의 증언은 불확실하지만 보존된 물리 법칙만이 유일한 진실 기준점이라는 세계관 완성.',
      capability: '주관적 기억을 배제하고 오직 측정 가능한 수치와 물리량만을 믿는 절대적 경계 설정.',
      constraint: '완전한 인간 불신과 정서적 고립, 타인에 대한 통제욕의 씨앗.',
      character_decision: 'Ian이 진실의 규명을 사람에게 묻지 않고 오직 가속기와 계측기에 묻겠다고 맹세함.',
      power_shift: '피해자/유가족에서 냉철한 물리학자이자 통제자로의 내적 전환.',
      final_consequence: 'Act 0 종료, Prologue의 제네바 NGC 및 Act 1 스코틀랜드 코츠 천문대로 이어지는 인과적 동기 완성.',
      next_problem: '이 냉혹한 통제관이 NGC에서 anomaly를 만났을 때 무엇을 겪게 될 것인가.',
      protected_status: 'Canon',
      protected_assets: [
        'Humans lie. The compass does not.',
        '아버지의 피벗 원칙이 극단적 물리주의로 전환되는 심리적 과정',
        'CAUSE UNKNOWN / TEST REQUIRED의 심리적 기초'
      ],
      epistemic_boundary: {
        known: '아버지는 사라졌고 기록은 오염되었으며 나침반만이 남았다.',
        inferred: '진실은 오직 재현 가능한 물리적 검증을 통해서만 회복될 수 있다.',
        unknown: '아버지가 남긴 나침반의 최종 의미.',
        forbidden_conclusion: 'Ian이 단순한 인간 혐오자나 소시오패스로 전락하는 것.'
      },
      relationship_movement: {
        ian_jiman: '가르침의 왜곡된 수용',
        ian_seoyeon: '물리적 고립 속 기억',
        seoyeon_jiman: '미개입',
        ian_institution: '인간 사회 전체에서 물리적 실재로 충성 대상 전환'
      },
      repetition_notes: '내면 독백의 철학적 선언 반복 압축.',
      future_book_notes: 'Prologue 및 Act 1과의 감정적·인식론적 연결고리 확립.',
      rationale: 'Act 0의 거대한 마무리이자 Ian의 인물 변곡점이므로 핵심 선언을 수호하며 17.1% 압축.',
    }
  ];

  // 6. Seed Scene Matrices & Structure Change Proposals
  console.log('Seeding Act 0 Scene Matrices and Structure Change Proposals...');
  for (const diag of ACT0_SCENES) {
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
        epistemic_boundary: diag.epistemic_boundary,
        relationship_movement: diag.relationship_movement,
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
  console.log(`Successfully seeded 8 Scene Matrices and 8 Structure Proposals.\n`);

  // 7. Seed Act 0 Chapter Gates
  console.log('Seeding Chapter Gates for Act 0 Chapters 1, 2, 3, 4...');
  const ACT0_CHAPTER_GATES = [
    {
      chapter_unit_id: ch1.id, // The Architectural Flaw
      local_question: 'Ji-man의 불완전성 제어 철학은 붕괴 현장에서 어떻게 증명되고 깨지는가?',
      answer: 'Ji-man은 완벽이 아닌 한계 제어를 가르쳤으나, 설계 한계를 넘은 구조적 붕괴는 모든 것을 파괴하고 아버지를 삼킵니다.',
      larger_question: '붕괴는 단순 사고인가, 설계 결함인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — protected emotional core and engineering imperfection philosophy. Compression ~14.7% target.',
    },
    {
      chapter_unit_id: ch2.id, // The Shadow Quarantine
      local_question: '국가는 사고를 어떻게 처리하며, 공식 발표는 왜 의심스러운가?',
      answer: '수사관들은 선별 압류하고, 공식 브리핑은 맥락을 거세하여 고소공포증 환자를 자살로 종결합니다.',
      larger_question: '공식 기록을 거부할 정당한 물리적 근거가 존재하는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — substantial repetition compression required (18% reduction on media briefings and raid debates).',
    },
    {
      chapter_unit_id: ch3.id, // The Contradictions of the Ledger
      local_question: '유골함 인계와 현장 물류 기록은 어떤 물리적 불가능성을 드러내는가?',
      answer: '18:30 전산 인계는 19:48 화장 종료와 물리적으로 양립할 수 없으며, 사고 36시간 전부터 사전 격리 물류가 발주되었습니다.',
      larger_question: '불가능한 기록은 생존을 증명하는가, 은폐를 증명하는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — protected epistemic boundary. Thermal timeline and invoice carbon copies protected.',
    },
    {
      chapter_unit_id: ch4.id, // Escape Velocity
      local_question: 'Ian은 어떻게 탈출하며, 무엇을 유일한 신뢰 기준으로 삼게 되는가?',
      answer: '서연의 합법 기업 파견 통로로 클린 출국하고, 주머니 속 은색 나침반을 쥐며 인간 대신 물리 법칙만을 믿기로 맹세합니다.',
      larger_question: '물리법칙만을 신뢰하는 Ian은 가속기에서 어떤 위기를 맞이할 것인가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — clean departure preserved. Transition to extreme physicalism canonized.',
    }
  ];

  for (const cg of ACT0_CHAPTER_GATES) {
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
  console.log(`Successfully seeded 4 Chapter Gates.\n`);

  // 8. Calculate SHA-256 Audit Hash and Lock B1_PASS1_ACT0_001
  console.log('Calculating Audit Hash and locking B1_PASS1_ACT0_001...');
  const auditPayload = JSON.stringify({
    code: AUDIT_CODE,
    scenes: ACT0_SCENES,
    gates: ACT0_CHAPTER_GATES,
    debts: SERIES_DEBTS,
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
  console.log(' PASS 1 ACT 0 AUDIT RUN LOCKED!         ');
  console.log('========================================');
  console.log(`Audit Run Code: ${AUDIT_CODE}`);
  console.log(`Audit Hash (SHA-256): ${auditHash}`);
  console.log(`Baseline Words: 29,438`);
  console.log(`Target Words: 24,630 (Total Reduction: -4,808 words / -16.3%)`);
  console.log(`Series Debts Registered: 3`);
  console.log(`Status: LOCKED (Pass 1 Act 0 Inventory Complete)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
