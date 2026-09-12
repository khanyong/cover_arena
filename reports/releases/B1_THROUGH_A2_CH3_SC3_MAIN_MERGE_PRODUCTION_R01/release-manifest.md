# B1 through A2-CH3-SC3 main release R01 — release manifest

## Preserved preflight state

- Repository: `khanyong/cover_arena`
- Source branch: `chore/supabase-migration-baseline`
- Preserved source SHA: `c57dd0e70664058f118f3ed98f5b33eae6ecafec`
- Preserved source ref: `backup/r01-source-20260913`
- Remote source SHA before release: `c7b00ebf052a957bab79957467fe6b91cc7c623a`
- Remote and local `main` before release: `d0e16c51699158c5f6dfc2636575d295eb8bf7c9`
- Preserved main ref: `backup/r01-main-pre-20260913`
- Isolated release branch: `release/b1-through-a2-ch3-sc3-r01`
- Existing Vercel project: `khanyongs-projects/khanyong-portfolio`
- Vercel project ID: `prj_9LXrxgE5Dd1mihBanXuMWpzz2fTq`
- Production alias before release: `https://khanyong-portfolio.vercel.app`
- Production deployment before release: `dpl_4XWZ6X5q22rz45cKwbnR2akZbxyb`

## Included release changes

- Reader revision badges and display-only repair of escaped paragraph boundaries while preserving LaTeX.
- Reader and Editor revision model, queries, and commands.
- A server-side hard gate for the unfinished Editor matrix route (`notFound: true` before page or database access).
- N8N examples changed from embedded credentials to environment-supplied, fail-closed configuration.
- Generated local state excluded through `.gitignore`; tracked generated artifacts removed.
- Public release authorization, manifest, and non-sensitive release safety test.

## Explicitly excluded

- `reports/scene-publication/**`, full manuscripts, database readbacks, SQL execution payloads, checkpoints, and other raw audit material.
- Supabase migrations, seeds, recovery scripts, and the database-mutating revision matrix integration test.
- Local TEMSCO work and other changes unrelated to the approved novel release.
- Manuscript/C01 reapplication and correction of the pre-existing seven-Version / 46-token discrepancy.

## Completed cumulative English scenes

The published Reader data already contains the approved cumulative sequence from the Prologue through ACT 2 / Chapter 3 / Scene 3 — Test Forty-Two. This Git release publishes the corresponding Reader/Editor implementation; it does not replay database writes.

- Prologue: The Architecture of Consensus; The Accumulating Residual; The Official Record; Exile and the Geometric Boundary.
- ACT 0: The Silver Compass; The Collapse; The Raid; The Official Verdict; The Thermal Timeline; The Inverted Logistics; Departure Horizon; The Absolute Boundary.
- ACT 1: The Calculus of Isolation; The Six-Month Correlation; Bureaucratic Suppression; Arrival and the Hidden Node; Verification and Decimation; The Second Clock; The Third Clock and Decomposition; Topological Invariants Match; The Calculus of Rupture; The Causal Limit.
- ACT 2: The Man Who Owns Delay; Apocalypse and Latency; The Sealed Kilometer; The Phase Fold; Test Fourteen; The Current-Sharing Boundary; Test Forty-Two.
- C01: 142 metadata-only `word_count` corrections for The Current-Sharing Boundary; manuscript bytes unchanged.

## ACT 2 released-body fingerprints

| Scene | Blocks | Bytes | Stored tokens | SHA-256 |
|---|---:|---:|---:|---|
| The Man Who Owns Delay | 317 | 23,123 | 3,610 | `addabfaf2a895d03cd9f9b6d3867db6cc53a09f06c4e4ebd6a2e209c5ab82e36` |
| Apocalypse and Latency | 242 | 17,226 | 2,627 | `31ef02bab5df8f4ad37c745dc4a8ff90b1eef9d27f0b5df3fb0ff9be54eb9b09` |
| The Sealed Kilometer | 230 | 19,375 | 2,847 | `eab6063f30b70bf22fb905a85e07117cdba34070fdfa163ab66a2935bec5457a` |
| The Phase Fold | 191 | 16,944 | 2,450 | `9f4f13f7af829a2b5be98bb91fecff047f3af6728cf83c831e43302005ecdea1` |
| Test Fourteen | 270 | 23,724 | 3,462 | `2b1f154f45127a8d68b15ec56929e4046185a64046228f2957ef0dc4e0a9e1b1` |
| The Current-Sharing Boundary | 230 | 21,404 | 3,183 | `759853916bd86d642db91c1d624c6f3559a69e19501496d02c475b36faa32c77` |
| Test Forty-Two | 233 | 22,894 | 3,406 | `e07f21f6d339c761dec264bb20bcaf6b8273d3bd89c0a2420a1afda0c02bc6f8` |

## Release gates

- Diff scope and credential-pattern inspection.
- Reader revision regression test.
- Release-specific gate, credential, normalization, and artifact-exclusion tests.
- Clean production build of the final release candidate.
- Normal Git push without force or history rewriting.
- Existing Vercel production deployment and domain verification.
- Read-only production data and online Reader verification; no release-time database writes.
