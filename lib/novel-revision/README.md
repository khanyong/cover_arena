# Bilingual r01 preparation and private transactional staging

The original `bilingual-plan.mjs` (d93500a) remains unchanged. It checks exact
r01 wording and a complete captured baseline and produces the 67-pair plan.
The new `stageBilingualRevision.mjs` retrieves an independently registered
approval using the authenticated user's Supabase client, reuses that planner,
and invokes one database transaction. `POST /api/novel-bilingual-stage` reuses
the existing `authenticateBookRequest` / `getUser` authentication path.

## Scope and security

This implements **PRIVATE_STAGED**, not public publication. No public Reader
projection, primary working snapshot, or KO display selection is advanced.
No production approval or manuscript is seeded by the migration. A reviewed
approval-registration step remains necessary in production; the only included
registrar is an explicitly nonproduction fixture generator.

The database independently verifies auth.uid(), JWT expiry/non-anonymous login,
existing KO scene rewrite capability, EN project ownership, and the actor bound
to an immutable approval record. Clients cannot write approval records. Request
actor IDs, service-role fallbacks and transaction claim injection are absent.
The proposal must equal the separately registered approved proposal. The server
also rechecks the original canonical content digest and stored plan.

Locks cover current snapshots/maps/alignments, both documents and KO selection.
Under those locks, current official versions, hashes, separators and selection
are compared again. Whole-document drift returns PT409. SQLSTATE 40001 is not
used for editorial conflicts because PostgREST automatically retries it.

One transaction creates 22 new language-specific Units/Versions, full merge
lineage, 11 current one-to-one alignments, a 67-block sealed KO composition,
a private EN snapshot, audit records, unresolved historical-anchor records,
and one PRIVATE selection. Existing 56 pairs retain their Units/Versions.
Retries bind actor + request UUID to the entire payload; a unique approval
release prevents duplicate versions even under different retry UUIDs.

`ros_bilingual_read_staged(release_id)` returns both languages from one fixed
release and rejects version-body drift. It does not change the existing Reader.
`ros_bilingual_restore_staged` atomically clears the private selection back to
the untouched bilingual baseline, with generation conflict and retry checks.
All historical versions and staged editions remain readable to the authorized
owner. Production restore/publication and automatic comment relocation are not
implemented. Merged anchors are explicitly marked MANUAL_REVIEW_REQUIRED.

## Local verification

Real PostgreSQL 15.8, GoTrue 2.196.0 and PostgREST 12.2.11 run in a separately
labelled Docker network/container, using synthetic locally registered users.
No production database is used as a test environment. Manuscript fixtures,
tokens, passwords, and SQL seed output are stored outside this worktree.
`fixture-schema.sql` supplies the minimum prerequisite revision schema; the
actual existing KO schema migration and new staging migration are loaded.
This is not proof of full production-schema or production-RLS parity.

The initial container uses the already installed official image:
`public.ecr.aws/supabase/postgres:15.8.1.073`, network `ros-exec02-test`, label
`ros.scope=exec02-nonproduction`, isolated database `ros_exec02`, and a locally
generated password. No existing containers/volumes were deleted. Subsequent
runs create fresh databases, preserving earlier failed-run evidence.

Set private input paths and local run environment (example run3):

```
ROS_EXEC02_DB=ros_exec02_run3
ROS_EXEC02_AUTH=http://127.0.0.1:55439
ROS_EXEC02_REST=http://127.0.0.1:55440
ROS_EXEC02_FIXTURE_DIR=/absolute/private/ros-style-exec02-integration/run3
ROS_R01_MANIFEST=/absolute/private/REVIEW-MANIFEST.json
ROS_R01_PROPOSAL=/absolute/private/CHANGESET-r01.dom.json
ROS_R01_APPROVAL_DIGEST=823cf88be9224b3b54ca4b92b58eff19e0445507bad3a45f6c7509e48387826f
```

Export these variables. On a fresh run (fails rather than deleting existing DB):

```
python3 tests/novel-revision/start-local-run.py
# Verify the local Auth /health endpoint is ready.
python3 tests/novel-revision/prepare-run.py
python3 tests/novel-revision/database-integration.py
node --test tests/novel-revision/server-integration.test.mjs
node --test tests/novel-revision/bilingual-plan.test.mjs
```

`start-local-run.py` requires the labelled initial test container and the private
`local-secrets.json` from its setup; it cannot create or change production access.
`server-integration.test.mjs` currently targets run3's fixed loopback ports.
DB tests deliberately install and remove a **test-only** insert-failure trigger
in the labelled disposable database. There is no production failure-injection
parameter or bypass. A discarded success response is replayed through HTTP.

## Remaining release gates

- Production-schema parity, independent migration/code review, and controlled
  approval registration backed by the already valid EXEC-01 decision.
- Public atomic selection plus Reader/comparison/cache/PDF/EPUB edition pinning.
- Complete T01–T12 (including expired real sessions, concurrent editor races,
  projection-failure injection, real anchors and production output checks).
- Production deployment, authorized r01 application, and output read-back.

Do not interpret successful private staging as RELEASED. The existing author
approval remains valid; no new wording revision or repeat author approval is
required. Do not use KO-only sequential writes or administrative projection
SQL to bypass the remaining release gates.

## EXEC-02 v3 follow-up (draft, not deployed)

The follow-up migrations preserve R05/R07 Unit IDs, allocate new Versions with
`rewritten_from`, and retain historical alignment records. Structural merges
still allocate new Units. This r01 produces 18 new Units and 22 new Versions;
67 result pairs and the 56 untouched pairs remain the acceptance criteria.

Publication is a separate immutable record, not a status edit to PRIVATE_STAGED.
`ros_bilingual_publish` rechecks the approved target, current composition and
both original/staged EN maps under locks. It clones the current non-target map
and changes only target scene paragraphs. The existing authenticated mutation
ledger and protected-document trigger remain active. Restore likewise preserves
non-target work, rejects target drift, and appends history instead of deleting it.

`ros_bilingual_read_published` pins paired Versions by composition. The Reader
uses a single-statement bilingual capture after publication; PDF/EPUB carry its
SHA-256 capture ID and reject changes with 409. Capture is SECURITY INVOKER and
preserves existing document RLS. Existing EN-only readers retain their path.
The deployed `ros_ko_get_scene` implementation is retained privately behind an
unpublished-composition guard. This wrapper requires production policy review;
do not infer full shared-reader coverage from owner-only fixture tests.

Reproduction uses private input paths in `ROS_R01_MANIFEST`, `ROS_R01_PROPOSAL`,
`ROS_R01_APPROVAL_DIGEST`, plus `ROS_EXEC02_FIXTURE_DIR`, `ROS_EXEC02_DB`,
`ROS_EXEC02_AUTH`, and `ROS_EXEC02_REST`. No fixture prose or tokens belong in Git.
Use fresh labelled databases (never reset or delete existing ones):

1. `python3 tests/novel-revision/start-local-run.py`
2. `python3 tests/novel-revision/prepare-run.py`
3. `python3 tests/novel-revision/database-integration.py`
4. `python3 tests/novel-revision/publication-integration.py`
5. `node --test tests/novel-revision/publication-read.test.mjs`
6. Add exact existing private endnotes using `add-commentary-fixture.mjs` and the
   two `ROS_EN_COMMENTARY_SNAPSHOT` / `ROS_KO_COMMENTARY_SNAPSHOT` paths.
7. Run `local-gateway.mjs` and the actual Next server on localhost:3003 using its
   localhost URL and test publishable key. Then run `http-output.mjs`,
   `browser-reader.mjs`, `check-output-links.py`, and `restore-integration.py`.

The fixture is one edited scene plus its four existing detailed notes, not the
complete production novel. The schema fixture covers selected constraints and
owner permissions; deployed shared-reader authorization, real comments/review
anchors, full production parity and independent code review remain release gates.
Production approval registration must cite the existing EXEC-01 source and fixed
approval digest, not invent a new author approval. No production approval record,
manuscript write, deployment, or operational publication is performed by tests.
