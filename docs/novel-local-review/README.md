# Local author review

Workflow: bilingual proposal → source mapping/conflict check → immutable private before/after snapshots → local author comparison and continuous reading → author decision for a particular revision/hash → separately authorized production publication.

`/novel-local-review?id=PRO-C02-S02-r01&lang=en&mode=compare` uses an authenticated local API. `mode=read&side=after` is continuous reading; `mode=bilingual` compares languages of the same snapshot. Review data is never in this repository or page SSR props.

Run from the repository with its existing `.env.local`:

```sh
node node_modules/next/dist/bin/next dev --webpack --hostname 127.0.0.1 --port 3000
node --test tests/novel-local-review/store.test.mjs
node node_modules/typescript/bin/tsc --noEmit
```

The normal reader/authentication still uses the configured Supabase project. Review snapshots and comments use `ROS_LOCAL_REVIEW_ROOT`, defaulting to `../ros-local-review-store`. Do not place that directory in public assets, a deployment checkout, or Git. Page and API reject non-development requests and non-loopback peers/hosts. The API verifies the user's session using the existing authentication helper, requires the private manifest's account allowlist, and checks normal user-scoped scene access. There is no service-role fallback and no manuscript publication call.

Each immutable revision directory contains `before.json`, `after.json`, `rows.json`, and `manifest.json`. The manifest records source mapping digest, official snapshot/composition identifiers, authorized account IDs, and SHA-256 of the three files. `readReview` verifies each digest. `immutable` reuses byte-identical files and rejects overwrite. Comments are append-only in a separate local file and carry scene, revision, baseline and change references. Production comments are untouched.

To prepare another revision, verify the submitted source digest and current official baseline first. Use `buildDraft(report, baseline)` to preserve the mapped merge groups; persist both full snapshots and grouped rows with `immutable`, then read them back with `readReview`. Never fake an APPROVED record. Store a new r02 directory instead of replacing r01. Keep original operating-baseline and preceding-proposal comparisons distinct; do not label a newly rebased proposal as the prior fixed revision. The current Reader shortcut covers only the first author-review scene; add shortcuts only for actually prepared scenes. No bulk generation is authorized.

Before sharing code, inspect only selected files for manuscript/secrets. Production builds cannot serve this feature even if the branch receives an automatic Preview deployment. Do not merge or promote this branch as part of local-review preparation.
