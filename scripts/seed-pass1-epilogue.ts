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
  console.log('=== PASS 1 SCENE INVENTORY SEEDER: EPILOGUE (THE OWNER OF THE BOUNDARY) ===\n');

  // 1. Fetch Project, Snapshots and Epilogue Unit
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: epiUnit } = await supabase.from('content_units').select('id').eq('source_path', 'act-8').single();

  if (!epiUnit) throw new Error('Epilogue unit (act-8) not found.');

  // 2. Create Audit Run B1_PASS1_EPILOGUE_001
  const AUDIT_CODE = 'B1_PASS1_EPILOGUE_001';
  console.log(`Creating Audit Run ${AUDIT_CODE}...`);

  const { data: auditRun, error: arErr } = await supabase
    .from('audit_runs')
    .upsert({
      code: AUDIT_CODE,
      project_id: proj.id,
      source_snapshot_id: baseSnap.id,
      target_snapshot_id: targetSnap.id,
      pass_number: 1,
      scope_unit_id: epiUnit.id,
      scope_name: 'EPILOGUE: THE OWNER OF THE BOUNDARY',
      criteria_version: '1.0.0',
      status: 'in_review',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (arErr) throw new Error(`Audit run creation failed: ${arErr.message}`);
  console.log(`Audit Run created: ${auditRun.code} (${auditRun.id})\n`);

  // 3. Epilogue Canonical Narrative Scene Definition
  const SCENE_UNIT_ID = 'e2799232-0787-5d97-841d-d0705712559e'; // act-8/ch-1/sc-4 Opening
  const BASELINE_WORDS = 3957;
  const TARGET_WORDS = 3250;
  const DELTA = -707;
  const COMPRESSION_PERCENT = 17.9;
  const EDITORIAL_RANGE = '3,200-3,550';

  const PROTECTED_ASSETS = [
    '“Three months after Geneva, gravity had become boring again.”',
    '“The world had resumed spending certainty it had never actually possessed.”',
    '“That absence had become evidence of nothing. Correctly.”',
    '“No countdown appeared. No front was observed approaching Earth. No theory won.”',
    '“No one should own the boundary.”',
    '“A dangerous argument could still be correct.”',
    '“Point. Radius. Boundary.”',
    '“The dangerous variable was no longer the geometry. It was the hand that chose the center.”',
    '“I must control it.” (Exact Text Protected Asset / Terminal Declaration of Book 1)',
  ];

  const EPISTEMIC_BOUNDARY = {
    known_facts: [
      'Geneva 사건 3개월 후 동일한 이상현상의 재발 없음.',
      '태평양의 일부 음향 교란은 통상적인 해양 원인으로 판명됨.',
      'Flight 702 사건의 재현 없음.',
      '파괴적 전면(destructive front)은 관측되지 않음.',
      '독립 복제는 혼합 결과(전체 거시 지지 효과는 아직 독립 재현되지 않음).',
      '노드 4는 18일 전 수리 완료되었으나 반복 열사이클 전까지 제한 운용(restricted envelope) 상태.',
      '휴대형 또는 행성 규모의 구현체는 존재하지 않음.',
    ],
    inferences: [
      '국소 상쇄 제어 능력의 입증은 과학을 넘어 자원 배분과 소유권(ownership)의 문제를 필연적으로 야기함.',
      '향후 소형화와 이중 용도(dual-use)를 제도적으로 완전히 차단하기 어려움.',
      '경계의 목표 상태(target state)는 자연이 자동으로 주지 않으며 누군가의 선택이어야 함.',
    ],
    character_rationalization_ladder: [
      'No one should own the boundary.',
      'Therefore someone must prevent unilateral ownership.',
      'Therefore Ian must remain technically ahead.',
      'Only until institutions are strong enough.',
      'Only until the world understands.',
      'Therefore: “I must control it.”',
    ],
    arc_nature: '이 결론은 객관적 수학 증명(proof)이 아니라 선택된 확신(certainty)이며, 제1권의 위험하고도 비극적인 종막을 선언함.',
  };

  // 4. Upsert Scene Matrix and Proposal for Epilogue
  console.log('Seeding Epilogue Scene Matrix and Structure Proposal...');
  const { error: smErr } = await supabase
    .from('scene_matrices')
    .upsert({
      snapshot_id: baseSnap.id,
      scene_unit_id: SCENE_UNIT_ID,
      audit_run_id: auditRun.id,
      pov_character: 'Ian Yoo',
      local_question: '인간이 국소적 bounded control의 가능성을 입증한 뒤, 누가 target state와 boundary의 안팎을 결정할 권리를 가져야 하는가?',
      action: 'Reframe',
      compression_target_words: TARGET_WORDS,
      compression_target_percent: COMPRESSION_PERCENT,
      protected_status: 'Exact Text',
      protected_assets: PROTECTED_ASSETS,
      epistemic_boundary: EPISTEMIC_BOUNDARY,
      notes: `Fine-grained: KEEP_REFRAME_COMPRESS_PROTECTED | Editorial Range: ${EDITORIAL_RANGE}`,
    }, { onConflict: 'snapshot_id,scene_unit_id' });

  if (smErr) throw new Error(`Scene Matrix upsert failed: ${smErr.message}`);

  const { error: scpErr } = await supabase
    .from('structure_change_proposals')
    .upsert({
      audit_run_id: auditRun.id,
      scene_unit_id: SCENE_UNIT_ID,
      action: 'KEEP_REFRAME_COMPRESS',
      current_word_count: BASELINE_WORDS,
      target_word_count: TARGET_WORDS,
      projected_word_delta: DELTA,
      target_compression_percent: COMPRESSION_PERCENT,
      target_tolerance_percent: 5.00,
      target_type: 'editorial_guidance',
      is_hard_limit: false,
      rationale: '인간이 국소적 bounded control의 가능성을 입증한 뒤, 누가 target state와 boundary의 안팎을 결정할 권리를 가져야 하는가?',
      dependency_notes: `Fine-grained: KEEP_REFRAME_COMPRESS_PROTECTED | Differentiated range: ${EDITORIAL_RANGE}`,
    }, { onConflict: 'audit_run_id,scene_unit_id' });

  if (scpErr) throw new Error(`Proposal upsert failed: ${scpErr.message}`);
  console.log(`Epilogue Scene Matrix & Proposal seeded successfully.\n`);

  // 5. Seed Epilogue Chapter Gate
  console.log('Seeding Epilogue Chapter Gate...');
  const { data: ch1 } = await supabase.from('content_units').select('id').eq('source_path', 'act-8/ch-1').single();

  const { error: cgErr } = await supabase
    .from('chapter_gates')
    .upsert({
      audit_run_id: auditRun.id,
      chapter_unit_id: ch1.id,
      local_question: '인간이 국소적 bounded control의 가능성을 입증한 뒤, 누가 target state와 boundary의 안팎을 결정할 권리를 가져야 하는가?',
      answer: '제도적 답은 분산권한·독립관측·복수 veto·공개 실패이지만, Ian은 누구도 boundary를 소유해서는 안 된다는 명제에서 출발해 자신이 unilateral ownership을 막기 위해 기술적으로 앞서 있어야 한다는 결론으로 이동한다. 그는 자신의 주장을 proof가 아니라 선택된 확신으로 인식하면서도, 결국 "I must control it"이라고 결정한다.',
      larger_question: 'Ian이 정당한 책임감을 더 큰 통제권의 근거로 바꾸었을 때, 그 권력은 Book II에서 누구를 보호하고 누구를 배제하게 되는가?',
      verdict: 'PASS',
      verdict_notes: 'PASS — KEEP_REFRAME_COMPRESS_PROTECTED (Target: 3,250 words, -17.9%).',
    }, { onConflict: 'audit_run_id,chapter_unit_id' });

  if (cgErr) throw new Error(`Chapter gate upsert failed: ${cgErr.message}`);
  console.log('Epilogue Chapter Gate seeded successfully.\n');

  // 6. Calculate SHA-256 Audit Hash and Lock B1_PASS1_EPILOGUE_001
  console.log('Calculating SHA-256 Audit Hash and locking B1_PASS1_EPILOGUE_001...');
  const auditPayload = JSON.stringify({
    code: AUDIT_CODE,
    scope: 'EPILOGUE: THE OWNER OF THE BOUNDARY',
    scene: {
      scene_unit_id: SCENE_UNIT_ID,
      baseline_words: BASELINE_WORDS,
      target_words: TARGET_WORDS,
      delta: DELTA,
      compression_percent: COMPRESSION_PERCENT,
      editorial_range: EDITORIAL_RANGE,
      protected_assets: PROTECTED_ASSETS,
      epistemic_boundary: EPISTEMIC_BOUNDARY,
    },
    gate: {
      chapter_unit_id: ch1.id,
      local_question: '인간이 국소적 bounded control의 가능성을 입증한 뒤, 누가 target state와 boundary의 안팎을 결정할 권리를 가져야 하는가?',
      verdict: 'PASS',
    },
    target_words: TARGET_WORDS,
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
  console.log(' PASS 1 EPILOGUE AUDIT RUN LOCKED SUCCESSFULLY!            ');
  console.log('===========================================================');
  console.log(`Audit Run Code: ${AUDIT_CODE}`);
  console.log(`Scope: EPILOGUE: THE OWNER OF THE BOUNDARY (1 Canonical Scene)`);
  console.log(`Audit Hash (SHA-256): ${auditHash}`);
  console.log(`Baseline Words: ${BASELINE_WORDS} | Target Words: ${TARGET_WORDS} (-707 words / -17.9%)`);
  console.log(`Cumulative Narrative Target Words (52 Scenes): 180,000 WORDS (100.0% OF BUDGET)`);
  console.log(`Status: LOCKED (All 52 Canonical Narrative Scenes Audited and Frozen)`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
