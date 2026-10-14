// Manuscript-free migration-ledger reconciliation check for A2/CH02/SC02.
// The expected digests are of Supabase's stored statement bodies, including
// the single terminal LF retained byte-for-byte in the repository files.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const migrations = [
  ['20261014083453', 'ros_ko_a2_ch02_sc02_delegated_admin', 'b86b62c4d832792b109cb79d5999002e9ccba6ca62ccae4fccb7c71a95fbc325'],
  ['20261014083551', 'ros_ko_a2_ch02_sc02_delegated_admin_contract_fix', '57ecf3f894366649cc280582046e83d1fa50f66a2d08ad1af5ac47a7909ac2fa'],
  ['20261014083631', 'ros_ko_a2_ch02_sc02_delegated_admin_contract_fix_2', '5818b429c1143ec26d223cb2ed789b4f06fec529044f79e4bd5b7f08bd6d7e0d'],
  ['20261014083710', 'ros_ko_a2_ch02_sc02_delegated_admin_contract_fix_3', '74f66e545e61c87bd508e251edbc00bc72387ee21c1558c26d90927a94b1b724']
];
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const results = [];

for (const [version, name, expectedSha256] of migrations) {
  const file = path.join(root, 'supabase/migrations', `${version}_${name}.sql`);
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.at(-1), 0x0a, `${path.basename(file)} must retain the ledger terminal LF`);
  assert.notEqual(bytes.at(-2), 0x0a, `${path.basename(file)} must not append a blank line`);
  const ledgerBody = bytes;
  assert.equal(sha(ledgerBody), expectedSha256, `${path.basename(file)} ledger statement digest`);
  results.push({ version, name, ledger_body_bytes: ledgerBody.length, ledger_body_sha256: expectedSha256 });
}

const synthetic = path.join(root, 'supabase/migrations/20261014190000_ros_ko_a2_ch02_sc02_delegated_admin.sql');
assert.equal(fs.existsSync(synthetic), false, 'unapplied synthetic version must not remain active');
const final = fs.readFileSync(path.join(root, 'supabase/migrations/20261014083710_ros_ko_a2_ch02_sc02_delegated_admin_contract_fix_3.sql'), 'utf8');
for (const functionName of ['migrate_a2_ch02_sc02_delegated', 'rename_a2_ch02_sc02_scene_delegated']) {
  assert.equal((final.match(new RegExp(`CREATE OR REPLACE FUNCTION ros_ko_private\\.${functionName}\\(`, 'g')) || []).length, 1, `${functionName} final definition`);
  assert.match(final, new RegExp(`REVOKE ALL ON FUNCTION ros_ko_private\\.${functionName}\\([\\s\\S]+?FROM PUBLIC,anon,authenticated,service_role;`));
  assert.match(final, new RegExp(`GRANT EXECUTE ON FUNCTION ros_ko_private\\.${functionName}\\([\\s\\S]+?TO postgres;`));
}
assert.equal((final.match(/SECURITY INVOKER SET search_path = ''/g) || []).length, 2, 'two final SECURITY INVOKER functions');

console.log(JSON.stringify({
  status: 'PASS',
  scope: 'MANUSCRIPT_FREE_REPOSITORY_MIGRATION_LEDGER_RECONCILIATION',
  migrations,
  results,
  unapplied_synthetic_version_present: false,
  final_functions: 2,
  final_security_invoker_functions: 2
}, null, 2));
