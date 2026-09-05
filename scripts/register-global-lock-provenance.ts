import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  console.log('=== REGISTERING GLOBAL LOCK PROVENANCE ===\n');

  const PROVENANCE_CODE = 'GLOBAL_LOCK_PROVENANCE_001';
  const gitCommit = '437885fc505a4aa19685dc02d7ba3a116faaca0c';
  const gitTag = 'revision-book1-pass1-global-001';

  const migSql = fs.readFileSync('supabase/migrations/20260903_013_global_plan_lock.sql', 'utf-8');
  const migHash = crypto.createHash('sha256').update(migSql).digest('hex');

  const scriptTs = fs.readFileSync('scripts/create-pass1-global-lock.ts', 'utf-8');
  const scriptHash = crypto.createHash('sha256').update(scriptTs).digest('hex');

  const provenanceDetails = {
    global_audit: 'B1_PASS1_GLOBAL_001',
    global_audit_hash: 'a2dacaee592820b6ed6fc25a68f5e92679da1b67bd40d276cd96b03287dc436d',
    git_commit_at_lock: gitCommit,
    git_tag: gitTag,
    migration_version: '20260903_013',
    migration_checksum: migHash,
    script_checksum: scriptHash,
    working_tree_clean: false, // development branch with untracked scripts and reports
    migration_history_verified: true,
    protected_asset_intersection_verified: true,
    protected_asset_conflicts: 0,
    artifact_index: 'B1_PASS1_GLOBAL_001_ARTIFACT_INDEX_001'
  };

  const { data, error } = await supabase
    .from('provenance_records')
    .upsert({
      code: PROVENANCE_CODE,
      record_type: 'GLOBAL_PASS_LOCK_PROVENANCE',
      statement: 'Pass 1 Global Plan Lock (B1_PASS1_GLOBAL_001) sealed with 15 child audits, 33 classified debts, 231 protected assets, 45,647 zero-diff mappings, and 0 protected asset conflicts for Pass 2A.',
      evidence_reference: 'exports/B1_PASS1_GLOBAL_001_ARTIFACT_INDEX_001.json',
      details: provenanceDetails,
    }, { onConflict: 'code' })
    .select()
    .single();

  if (error) throw new Error(`Provenance registration failed: ${error.message}`);
  console.log(`Provenance Record registered successfully: ${data.code} (${data.id})`);
}

main().catch(err => {
  console.error('[ERROR]:', err);
  process.exit(1);
});
