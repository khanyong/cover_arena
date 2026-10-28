import { createHash } from 'node:crypto';

export class RevisionConflict extends Error {
  constructor(code) { super(code); this.name = 'RevisionConflict'; this.code = code; }
}
const requireThat = (value, code) => { if (!value) throw new RevisionConflict(code); };
export const sha256 = text => createHash('sha256').update(text, 'utf8').digest('hex');
const canonical = value => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  requireThat(value !== undefined && typeof value !== 'function', 'INVALID_JSON');
  return JSON.stringify(value);
};
export const digest = value => sha256(canonical(value));

// This is a pure preparation module, NOT an authorization or publication boundary.
// The trusted approval digest must come from the reviewed server configuration,
// never from the same request that supplies the candidate proposal.
export function approvalContent(proposal) {
  return {
    proposal_id: proposal.proposal_id, revision: proposal.proposal_revision,
    scope: proposal.scope,
    changes: proposal.changes.map(c => ({
      key: c.editorial_change_key,
      en: { before: c.en.source_excerpt_before, after: c.en.proposed_after },
      ko: { before: c.ko.source_excerpt_before, after: c.ko.proposed_after },
    })),
  };
}
export function stateDigest(manifest) {
  return digest({
    managed_scene: manifest.managed_scene, selection: manifest.selection,
    composition: manifest.composition, en_snapshot: manifest.en_snapshot,
    documents: manifest.documents, ordered_alignment: manifest.ordered_alignment,
  });
}
const contracts = {
 'ROS-STYLE-PRO-C01-S01-r01': {scene:'b48a4f04',source:'PRO/CH01/SC01',id:'13a795ae-456e-4623-9714-b302c9db9585',before:79,after:67,retained:56,counts:[[5,3],[3,1],[2,1],[3,2],[1,1],[8,2],[1,1]]},
 'ROS-STYLE-PRO-C02-S01-r01': {scene:'3b301af5',source:'PRO/CH02/SC01',id:'87320aa9-fbd3-4672-8694-cc5fde2bf7e8',before:139,after:129,retained:116,counts:[[1,1],[1,1],[3,1],[4,4],[3,1],[5,2],[2,1],[4,2]]},
};
const languages = ['en', 'ko'];

export function buildBilingualPlan({ proposal, expected, current, trustedApprovalDigest, trustedContract }) {
  // Additional scene contracts may ONLY come from an immutable server approval,
  // never from the incoming request/proposal. Existing two-scene contracts remain.
  if (trustedContract) {
    requireThat(trustedContract.proposal_id === proposal?.proposal_id
      && trustedContract.revision === 1
      && typeof trustedContract.id === 'string' && typeof trustedContract.scene === 'string'
      && typeof trustedContract.source === 'string'
      && typeof trustedContract.document === 'string' && typeof trustedContract.en_project === 'string'
      && Number.isInteger(trustedContract.before) && trustedContract.before > 0
      && Number.isInteger(trustedContract.after) && trustedContract.after > 0
      && Number.isInteger(trustedContract.retained) && trustedContract.retained >= 0
      && Array.isArray(trustedContract.counts) && trustedContract.counts.length > 0
      && trustedContract.counts.every(c => Array.isArray(c) && c.length === 2
        && c.every(n => Number.isInteger(n) && n > 0)), 'INVALID_TRUSTED_CONTRACT');
  }
  const contract = trustedContract || contracts[proposal?.proposal_id];
  requireThat(contract && proposal.proposal_revision === 1 && proposal.changes?.length === contract.counts.length, 'WRONG_PROPOSAL');
  const {counts} = contract;
  requireThat(/^[a-f0-9]{64}$/.test(trustedApprovalDigest || '')
    && digest(approvalContent(proposal)) === trustedApprovalDigest, 'APPROVAL_DIGEST_MISMATCH');
  requireThat(current?.managed_scene?.scene_id === contract.scene
    && current.managed_scene.source_key === contract.source
    && current.managed_scene.id === contract.id
    && current.managed_scene.document_id === (contract.document || 'quantum-vibration-novel-act-2')
    && current.en_snapshot?.project_id === (contract.en_project || '707e3ae1-0817-467a-bb42-5401c646151e'), 'WRONG_TARGET');
  requireThat(stateDigest(current) === stateDigest(expected), 'STALE_BASELINE');
  const rows = current.ordered_alignment;
  requireThat(rows.length === contract.before && expected.changes.length === counts.length, 'INVALID_COMPOSITION');
  const seen = new Set();
  for (const [index, row] of rows.entries()) {
    requireThat(row.position === index + 1 && row.alignment_id, 'INVALID_ALIGNMENT');
    for (const key of [row.alignment_id, ...languages.flatMap(l => [row[l].unit_id, row[l].version_id])]) {
      requireThat(typeof key === 'string' && key.length > 0 && !seen.has(key), 'DUPLICATE_ID'); seen.add(key);
    }
    for (const lang of languages) requireThat(sha256(row[lang].body) === row[lang].sha256, 'BODY_HASH_MISMATCH');
  }
  const replacements = new Map();
  const consumed = new Set();
  const lineage = [];
  for (const [i, change] of proposal.changes.entries()) {
    const key = `R${String(i + 1).padStart(2, '0')}`;
    requireThat(change.editorial_change_key.endsWith(key), 'CHANGE_ORDER_MISMATCH');
    const mapping = expected.changes[i];
    requireThat(mapping.edit_id === key, 'MAPPING_MISMATCH');
    const [start, end] = mapping.before_positions;
    requireThat(Number.isInteger(start) && Number.isInteger(end) && start >= 1 && end <= contract.before
      && end - start + 1 === counts[i][0], 'INVALID_RANGE');
    const before = rows.slice(start - 1, end);
    requireThat(digest(before) === digest(mapping.before_pairs), 'MAPPING_MISMATCH');
    for (let p = start; p <= end; p++) {
      requireThat(!consumed.has(p), 'OVERLAPPING_CHANGES'); consumed.add(p);
    }
    const after = {};
    for (const lang of languages) {
      const source = change[lang];
      requireThat(before.map(r => r[lang].body).join('\n\n') === source.source_excerpt_before, 'BEFORE_MISMATCH');
      requireThat(sha256(source.source_excerpt_before) === source.source_excerpt_before_sha256
        && sha256(source.proposed_after) === source.proposed_after_sha256, 'SOURCE_HASH_MISMATCH');
      after[lang] = source.after_paragraphs;
      requireThat(Array.isArray(after[lang]) && after[lang].length === counts[i][1]
        && after[lang].every(p => typeof p === 'string' && p.length > 0)
        && after[lang].join('\n\n') === source.proposed_after, 'AFTER_STRUCTURE_MISMATCH');
    }
    replacements.set(start, after.en.map((body, j) => ({
      kind: 'replacement', local_pair_key: `${key}:${j + 1}`, change_key: key,
      en: { body, sha256: sha256(body) }, ko: { body: after.ko[j], sha256: sha256(after.ko[j]) },
    })));
    lineage.push({ change_key: key, predecessor_pairs: before.map(r => ({ alignment_id: r.alignment_id,
      en_unit_id: r.en.unit_id, en_version_id: r.en.version_id, ko_unit_id: r.ko.unit_id, ko_version_id: r.ko.version_id })),
    successor_keys: after.en.map((_, j) => `${key}:${j + 1}`), anchor_policy: 'PRESERVE_HISTORICAL_REQUIRE_MANUAL_REVIEW' });
  }
  const output = rows.flatMap(row => replacements.get(row.position)
    || (consumed.has(row.position) ? [] : [{ kind: 'retained', original: structuredClone(row) }]));
  requireThat(output.length === contract.after && output.filter(r => r.kind === 'retained').length === contract.retained, 'RESULT_COUNT_MISMATCH');
  for (const lang of languages) {
    const beforeText = rows.map(r => r[lang].body + (r[lang].separator_after ?? (r.position < contract.before ? '\n\n' : ''))).join('');
    requireThat(sha256(beforeText) === expected.before_sha256[lang], 'SCENE_BEFORE_MISMATCH');
    const afterText = output.map((r, i) => r.kind === 'retained'
      ? r.original[lang].body + (r.original[lang].separator_after ?? (i < output.length - 1 ? '\n\n' : ''))
      : r[lang].body + '\n\n').join('');
    requireThat(sha256(afterText) === expected.after_sha256[lang], 'SCENE_AFTER_MISMATCH');
  }
  return { ...(trustedContract ? { contract: structuredClone(trustedContract) } : {}), format: 'ros-bilingual-preflight-plan-v1', executable: false,
    baseline_digest: stateDigest(current), approval_digest: trustedApprovalDigest,
    proposal_id: proposal.proposal_id, revision: 1, result_pairs: output, lineage,
    retained_pairs: contract.retained, replaced_pairs: consumed.size, new_pairs: output.length-contract.retained,
    pending: ['AUTHENTICATED_DATABASE_TRANSACTION', 'ID_ALLOCATION', 'ANCHOR_REVIEW', 'PUBLICATION', 'READER_AND_OUTPUT_VALIDATION'] };
}
