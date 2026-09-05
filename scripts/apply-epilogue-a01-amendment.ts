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
  console.log('=== PASS 1 EPILOGUE AUDIT AMENDMENT A01 RUNNER ===\n');

  // 1. Fetch Project, Snapshots and Epilogue Base Audit
  const { data: proj } = await supabase.from('revision_projects').select('id').eq('slug', 'the-resonance-of-space-book-1').single();
  const { data: baseSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.0_LOCKED').single();
  const { data: targetSnap } = await supabase.from('revision_snapshots').select('id').eq('code', 'B1_v1.1_STRUCT_DRAFT').single();
  const { data: baseAudit } = await supabase.from('audit_runs').select('*').eq('code', 'B1_PASS1_EPILOGUE_001').single();
  const { data: epiUnit } = await supabase.from('content_units').select('id').eq('source_path', 'act-8').single();

  if (!baseAudit) throw new Error('Base audit B1_PASS1_EPILOGUE_001 not found.');
  console.log(`Base Audit: ${baseAudit.code} (${baseAudit.id}) - Status: ${baseAudit.status}`);

  // 2. Create Audit Amendment B1_PASS1_EPILOGUE_001_A01
  const A01_CODE = 'B1_PASS1_EPILOGUE_001_A01';
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
      scope_unit_id: epiUnit.id,
      scope_name: 'EPILOGUE: THE OWNER OF THE BOUNDARY (A01 AMENDMENT)',
      criteria_version: '1.1.0',
      status: 'in_review',
      amendment_reason: 'Precision corrections to Epilogue epistemic claims (no Geneva/Seoul recurrence, later Pacific disturbances ordinary but original event unresolved, no destructive front observed approaching Earth, persistence of A-173 and PTA residuals), classification of Ian rationalization ladder as semantic summary, and exact text protection for terminal declaration.',
    }, { onConflict: 'code' })
    .select()
    .single();

  if (a01Err) throw new Error(`Amendment creation failed: ${a01Err.message}`);
  console.log(`Amendment Run created: ${a01Run.code} (${a01Run.id})\n`);

  // 3. Define Precise Epistemic Boundaries and Exact Assets
  const SCENE_UNIT_ID = 'e2799232-0787-5d97-841d-d0705712559e';
  const EXACT_PROTECTED_ASSETS = [
    '“No one should own the boundary.”',
    '“A dangerous argument could still be correct.”',
    '“Point. Radius. Boundary.”',
    '“The dangerous variable was no longer the geometry. It was the hand that chose the center.”',
    '“I must control it.” (Exact Text Protected Asset / Terminal Line of Book 1)',
    '“Three months after Geneva, gravity had become boring again.”',
    '“The world had resumed spending certainty it had never actually possessed.”',
    '“That absence had become evidence of nothing. Correctly.”',
    '“No countdown appeared. No front was observed approaching Earth. No theory won.”',
  ];

  const PRECISE_EPISTEMIC_BOUNDARY = {
    known_facts: [
      'No additional Geneva- or Seoul-class event was recorded during the three-month interval.',
      'Several later Pacific acoustic disturbances were attributable to ordinary causes; the original Pacific event remained unresolved.',
      'No destructive front was observed approaching Earth (absence of observation is not proof of non-existence).',
      'A-173 residual persisted; PTA compatibility persisted.',
      'The inward model survived some data and failed to sharpen under other data.',
      'No theory won.',
      'Node Four was repaired 18 days prior, operating under restricted envelope pending repeated thermal cycling.',
      'No portable or planetary implementation exists.',
    ],
    inferences: [
      'Bounded-control capability raises inevitable resource-allocation and ownership questions beyond science.',
      'Future miniaturization and dual-use cannot be prevented entirely by institutional design.',
      'The target state of the boundary is not provided by nature; someone must decide what reality is allowed to become.',
    ],
    character_arc: {
      type: 'SEMANTIC CHARACTER-ARC SUMMARY',
      rationalization_ladder: [
        'No one should own the boundary.',
        'Therefore someone must prevent unilateral ownership.',
        'Therefore Ian must remain technically ahead.',
        'Only until institutions are strong enough.',
        'Only until the world understands.',
        'Therefore: I must control it.',
      ],
      epistemic_status: 'Selected certainty and self-authorization, NOT an objective mathematical proof.',
    },
    target_budget_semantics: {
      narrative_baseline_words: 217463,
      narrative_target_words: 180000,
      planned_reduction_words: 37463,
      planned_reduction_percent: 17.23,
      actual_reduction_words: 0,
      target_status: 'allocated_planning_budget_only',
      execution_status: 'not_started',
      non_narrative_reserve_words: 513,
      total_baseline_words: 217976,
    }
  };

  // 4. Update Epilogue Scene Matrix and Proposal
  console.log('Updating Epilogue Scene Matrix and Proposal with precise epistemic metadata...');
  const { error: smErr } = await supabase
    .from('scene_matrices')
    .update({
      protected_assets: EXACT_PROTECTED_ASSETS,
      epistemic_boundary: PRECISE_EPISTEMIC_BOUNDARY,
      notes: 'Fine-grained: KEEP_REFRAME_COMPRESS_PROTECTED | Editorial Range: 3,200-3,550 words | Target: 3,250 words',
    })
    .eq('snapshot_id', baseSnap.id)
    .eq('scene_unit_id', SCENE_UNIT_ID);

  if (smErr) throw new Error(`Scene Matrix update failed: ${smErr.message}`);

  const { error: scpErr } = await supabase
    .from('structure_change_proposals')
    .update({
      dependency_notes: 'Fine-grained: KEEP_REFRAME_COMPRESS_PROTECTED | Editorial Range: 3,200-3,550 words | Target Budget: 3,250 words (Narrative Budget Complete)',
    })
    .eq('audit_run_id', baseAudit.id)
    .eq('scene_unit_id', SCENE_UNIT_ID);

  if (scpErr) throw new Error(`Proposal update failed: ${scpErr.message}`);
  console.log('Epilogue Scene Matrix & Proposal updated successfully.\n');

  // 5. Update Epilogue Chapter Gate
  console.log('Updating Epilogue Chapter Gate with Architect-Approved Answer...');
  const { data: ch1 } = await supabase.from('content_units').select('id').eq('source_path', 'act-8/ch-1').single();

  const { error: cgErr } = await supabase
    .from('chapter_gates')
    .update({
      answer: '제도적 답은 분산권한·독립관측·복수 veto·공개 실패이지만, Ian은 누구도 boundary를 소유해서는 안 된다는 명제에서 출발해 자신이 unilateral ownership을 막기 위해 기술적으로 앞서 있어야 한다는 결론으로 이동한다. 그는 자신의 주장을 proof가 아니라 선택된 확신으로 인식하면서도, 결국 "I must control it"이라고 결정한다.',
      verdict: 'PASS',
      verdict_notes: 'PASS — KEEP_REFRAME_COMPRESS_PROTECTED (Target: 3,250 words, -17.9%).',
    })
    .eq('audit_run_id', baseAudit.id)
    .eq('chapter_unit_id', ch1.id);

  if (cgErr) throw new Error(`Chapter gate update failed: ${cgErr.message}`);
  console.log('Epilogue Chapter Gate updated successfully.\n');

  // 6. Calculate SHA-256 Amendment Hash and Lock B1_PASS1_EPILOGUE_001_A01
  console.log('Calculating A01 Amendment Hash and locking B1_PASS1_EPILOGUE_001_A01...');
  const a01Payload = JSON.stringify({
    parent_audit: baseAudit.code,
    amendment_code: A01_CODE,
    scene_unit_id: SCENE_UNIT_ID,
    assets: EXACT_PROTECTED_ASSETS,
    boundaries: PRECISE_EPISTEMIC_BOUNDARY,
    target_words: 3250,
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
  console.log(' PASS 1 EPILOGUE AUDIT AMENDMENT A01 LOCKED SUCCESSFULLY!  ');
  console.log('===========================================================');
  console.log(`Amendment Code: ${A01_CODE}`);
  console.log(`Parent Audit Code: ${baseAudit.code}`);
  console.log(`A01 Hash (SHA-256): ${a01Hash}`);
  console.log(`Status: LOCKED (Epilogue Epistemic Metadata & Budget Semantics Aligned)`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
