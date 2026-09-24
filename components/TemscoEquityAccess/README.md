# Private equity report

`/temsco/equity` and `/temsco/equity/evidence` are data-free login shells.
The API verifies each access token with Supabase `auth.getUser` and rejects
anonymous accounts. Every signed-in, non-anonymous user may read the report;
this is not an administrator or email allowlist.

This repository is public. Confidential report source, financial models,
fixtures, and model tests MUST remain Git-ignored. Never import them into a
Next.js page, even through a dynamic import: that would publish their content
in a JavaScript chunk.

## Encrypted publication

`private/temsco/equity-report.enc.json` contains an AES-256-GCM encrypted browser
bundle and an encrypted source backup. This ciphertext is safe to commit.
`TEMSCO_EQUITY_REPORT_KEY` is a server-only secret: keep it in ignored
`.env.local` for local work and in the intended Vercel environment. Never use
a `NEXT_PUBLIC_` prefix or commit/print its value.

The API authenticates before reading/decrypting the artifact. It returns only
the browser bundle, styles, and source hash, with `private, no-store` headers.
It never returns the source backup. Missing/wrong keys fail closed.

`npm run build` regenerates ciphertext if private sources are present. A clean
public checkout validates the committed ciphertext in memory and builds
without restoring confidential files. The secret must therefore also be
available to the build. The encrypted file is traced into the API function,
never placed under `public`.

## Local authoring

Keep a secure backup of the key. To recover authoring sources on a new machine,
provide the key in `.env.local`, then run:

```sh
node scripts/temsco/restore-private-equity-report.mjs
npm run dev
```

Restore refuses to overwrite existing files. `npm run dev` watches restored
private sources; reload the browser after editing a report page. When Next was
started directly, run `npm run temsco:equity:watch` alongside it, or generate
once with `npm run temsco:equity:build`. Commit the updated ciphertext, never
the recovered plaintext. Do not force-add ignored private source paths.

## Verification

```sh
node --test scripts/temsco/test-equity-security.mjs scripts/temsco/test-equity-lifecycle.mjs scripts/tests/auth-return-path.test.mjs
node scripts/temsco/test-equity-bundle-isolation.mjs --production
```

The second check requires a completed production build and the server key.
Check anonymous access (login prompt / API 401) and an existing signed-in
browser (slides, simulations, detailed evidence). Do not add an auth bypass
for preview, local development, exports, or tests.
