# Bilingual r01 preparation

`bilingual-plan.mjs` is an offline, side-effect-free preparation module for
ROS-STYLE-PRO-C01-S01-r01. It validates an independently supplied approval digest,
full captured baseline, seven exact bilingual replacements, ordered alignment,
retained objects and full-scene before/after SHA-256. It returns a 67-pair plan,
with separate historical predecessor groups and current bilingual pair keys.
It never allocates official IDs or relocates comments automatically.

**This is not a publish API.** `executable: false` and `pending` are intentional.
The approval digest is a content commitment, not proof of actor authentication.
A production caller must retrieve an authorized approval record independently;
it must not trust a digest or actor ID from an HTTP request. Approval remains
valid from EXEC-01; no further author approval is required for the same wording.

## Reproduce with the private review inputs

Set ROS_R01_PROPOSAL to the original CHANGESET JSON and ROS_R01_MANIFEST to the
reviewed REVIEW-MANIFEST.json. The verified r01 content digest is:
`823cf88be9224b3b54ca4b92b58eff19e0445507bad3a45f6c7509e48387826f`.
Set ROS_R01_APPROVAL_DIGEST to that value, then run:

```
node --test tests/novel-revision/bilingual-plan.test.mjs
node scripts/novel-revision/preflight-r01.mjs proposal.json expected.json current.json APPROVAL_SHA256 plan.json
```

Missing fixtures fail rather than silently skip. Manuscript fixtures are not
copied into the application bundle. CLI output uses exclusive creation to avoid
overwriting previous evidence. Tests use the captured baseline, not a fresh
production read. A successful plan is not authority to write it to production.

## Remaining integration

- Authenticated EN and KO scene capability checks and independent approval lookup.
- Transactional re-read/lock, normal Unit/Version allocation, composition,
  explicit 1:1 alignment, audit and bilingual publication in one transaction.
- Durable idempotency and conflict handling for whole-document/head changes.
- Historical review anchors and explicit unresolved-anchor records.
- Reader/comparison/export edition pinning; real database failure and rollback
  tests; authenticated production read-back and regenerated PDF/EPUB tests.

Do not call the existing KO-only single-block rewrite sequentially to simulate
this transaction. Do not change managed documents through administrative SQL.
No migration, endpoint, RLS change or production mutation is included here.
