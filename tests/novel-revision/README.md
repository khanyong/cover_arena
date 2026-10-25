# Isolated bilingual regression runs

Use the existing labelled `ros-exec02-db` container and `ros-exec02-test` network.
Never use a production URL, service key, production database, or delete an existing run.
Keep approved proposal/manifest, sessions, output books and `local-secrets.json` outside Git.
The preparation script creates only synthetic local accounts and records the exact
migration/fixture order and SHA-256 values in `applied-files.json`.

Set these variables to a new run directory/database and unused loopback ports:

```sh
export ROS_EXEC02_FIXTURE_DIR=/private/path/runN
export ROS_EXEC02_DB=ros_exec02_runN
export ROS_EXEC02_AUTH=http://127.0.0.1:55471
export ROS_EXEC02_REST=http://127.0.0.1:55472
export ROS_R01_MANIFEST=/private/path/REVIEW-MANIFEST.json
export ROS_R01_PROPOSAL=/private/path/CHANGESET.json
export ROS_NODE=/absolute/path/to/node
python3 tests/novel-revision/start-local-run.py
python3 tests/novel-revision/prepare-run.py
python3 tests/novel-revision/database-integration.py
"$ROS_NODE" --test tests/novel-revision/shared-reader.test.mjs
python3 tests/novel-revision/publication-integration.py
ROS_EXEC02_PHASE=published "$ROS_NODE" --test tests/novel-revision/shared-reader.test.mjs
python3 tests/novel-revision/authority-lifecycle.py
"$ROS_NODE" --test tests/novel-revision/revision-comparison.test.mjs tests/novel-revision/project-authority.test.mjs
```

Replace N with a numeric unused suffix. The lifecycle suite ends RESTORED.
Use another fresh prepared run for `stale-state-integration.py`; it changes heads
and stages a private release as part of its tests. Do not run stage acceptance
again against an already staged fixture.

`production-read-policy-fixture.sql` reproduces the deployed read/rewrite/restore
predicates and legacy null-owner EN policy. It is TEST ONLY, not a production
migration and not a complete production schema clone. Shared readers receive
read-only synthetic grants. The fixture owner can restore; this does not prove
that a delegated production rewrite actor can restore. Check the actual actor's
restore capability before operational publication, without changing grants.

For the delegated actor case, set `ROS_EXEC02_DELEGATED=1` before preparation
and database integration. This seeds a distinct scene owner from the start;
it never changes an existing owner or grants generic restore. After publication,
run `scoped-self-restore.py` to check the explicit r01 opt-in, unauthorized denial,
later-edit conflict, joint restore, and idempotent retry. It ends RESTORED.
The opt-in table is empty on migration installation and requires separate,
documented approval registration. No other changeset receives this exception.

With the isolated app connected to the same run, `ROS_EXEC02_ACTOR=reader` selects
the real reader session for `http-output.mjs`. Its books contain the test fixture,
not the production full manuscript. `add-commentary-fixture.mjs` optionally adds
privately supplied note fixtures. Never label those outputs as production books.
