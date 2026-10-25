import { readFile, writeFile } from 'node:fs/promises';
import { buildBilingualPlan } from '../../lib/novel-revision/bilingual-plan.mjs';
// Offline preparation only. No credentials, database writes or network calls.
const [proposalFile, expectedFile, currentFile, approvalDigest, outputFile] = process.argv.slice(2);
if (!outputFile) throw new Error('Usage: node scripts/novel-revision/preflight-r01.mjs proposal.json expected.json current.json TRUSTED_APPROVAL_SHA256 output.json');
const [proposal, expected, current] = await Promise.all([proposalFile, expectedFile, currentFile].map(async p => JSON.parse(await readFile(p, 'utf8'))));
const plan = buildBilingualPlan({ proposal, expected, current, trustedApprovalDigest: approvalDigest });
await writeFile(outputFile, JSON.stringify(plan, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'OFFLINE_PREFLIGHT_PASS', executable: false, pairs: plan.result_pairs.length, retained: plan.retained_pairs }));
