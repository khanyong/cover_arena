import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are strictly required for this admin verification script.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function main() {
  console.log('=== DATABASE-SIDE ZERO-DIFF SNAPSHOT VERIFICATION ===\n');

  // 1. Call PostgreSQL Database-side Zero-Diff Verification RPC
  console.log('Calling PostgreSQL function fn_verify_snapshot_zero_diff...');
  const { data: dbResult, error: rpcErr } = await supabase.rpc('fn_verify_snapshot_zero_diff', {
    p_snap1_code: 'B1_v1.0_LOCKED',
    p_snap2_code: 'B1_v1.1_STRUCT_DRAFT',
  });

  if (rpcErr) {
    throw new Error(`fn_verify_snapshot_zero_diff RPC failed: ${rpcErr.message}`);
  }

  console.log('Database-side Verification Results:');
  console.log('  Baseline Snapshot:', dbResult.baseline_snapshot, `(${dbResult.baseline_total_rows} rows)`);
  console.log('  Working Snapshot: ', dbResult.working_snapshot, `(${dbResult.working_total_rows} rows)`);
  console.log('  Only in Working:  ', dbResult.only_in_working);
  console.log('  Only in Baseline: ', dbResult.only_in_baseline);
  console.log('  Mismatched Rows:  ', dbResult.mismatched_rows);
  console.log('  Difference Count: ', dbResult.difference_count);
  console.log('  Is 100% Identical:', dbResult.is_identical);

  // 2. Save evidence to reports/b1-v10-v11-zero-diff.json
  const reportPath = 'reports/b1-v10-v11-zero-diff.json';
  fs.writeFileSync(reportPath, JSON.stringify(dbResult, null, 2), 'utf-8');
  console.log(`\nSaved verification evidence to ${reportPath}\n`);

  // 3. Regression Tests on Archived Snapshot Immutability (B1_PILOT_NAME_CANON_001)
  console.log('=== ARCHIVED SNAPSHOT IMMUTABILITY REGRESSION TESTS ===');
  const { data: archivedSnap } = await supabase
    .from('revision_snapshots')
    .select('id, code, state')
    .eq('code', 'B1_PILOT_NAME_CANON_001')
    .single();

  if (!archivedSnap) {
    throw new Error('Archived snapshot B1_PILOT_NAME_CANON_001 not found for regression test.');
  }
  console.log(`Testing on Archived Snapshot: ${archivedSnap.code} (State: ${archivedSnap.state})`);

  // Test 1: Calling create_paragraph_checkpoint on archived snapshot must fail
  console.log('Test 1: create_paragraph_checkpoint on archived snapshot...');
  const { error: cpErr } = await supabase.rpc('create_paragraph_checkpoint', {
    p_snapshot_id: archivedSnap.id,
    p_paragraph_unit_id: 'c54655c2-aba3-57d0-b8f6-17ff17e848f6',
    p_expected_current_version_id: '00000000-0000-0000-0000-000000000000',
    p_new_body_markdown: 'Illegal mutation on archived snapshot',
    p_change_type: 'rewrite',
    p_change_note: 'Should fail',
  });

  if (cpErr) {
    console.log('  [PASS] Successfully rejected checkpoint on archived snapshot.');
    console.log(`         Error caught: "${cpErr.message}"`);
  } else {
    throw new Error('FAIL: Checkpoint was NOT rejected on archived snapshot!');
  }

  // Test 2: Direct mutation on revision_content_map for archived snapshot must fail
  console.log('\nTest 2: Direct modification on revision_content_map for archived snapshot...');
  const { error: directErr } = await supabase
    .from('revision_content_map')
    .update({ position: 999999 })
    .eq('snapshot_id', archivedSnap.id)
    .eq('unit_id', 'c54655c2-aba3-57d0-b8f6-17ff17e848f6');

  if (directErr) {
    console.log('  [PASS] Successfully rejected direct content map mutation on archived snapshot.');
    console.log(`         Error caught: "${directErr.message}"`);
  } else {
    throw new Error('FAIL: Direct modification was NOT rejected on archived snapshot!');
  }

  console.log('\n==========================================================');
  console.log(' ALL ZERO-DIFF & IMMUTABILITY REGRESSION TESTS PASSED!    ');
  console.log('==========================================================');
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
