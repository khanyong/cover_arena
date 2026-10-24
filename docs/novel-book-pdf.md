# ROS book PDF download

The full Korean and English Readers expose **전권 PDF 다운로드** in both reading
and editing mode. Choose 6 × 9 inch or A4, and 10, 11 or 12 pt body text. Save or
close an open editor first. Generation requires a valid signed-in user.

## Export selection

- Only `quantum-vibration-novel` and `quantum-vibration-novel-en` are supported.
- The server loads all root-ordered Act fragments through the caller's RLS
  identity. Managed Korean scenes use `ros_ko_get_scene`'s latest saved review.
- Unsaved text and temporary historical-version choices in the browser are not
  exported. No source, permissions, final/accepted state or Notion page is changed.
- Counts, current composition/position/version identity, body SHA and managed
  projection SHA are checked before rendering. Missing fragments fail closed.
- Repeated document and selection fingerprints detect observed concurrent edits
  and return 409. This is not a transactional whole-database snapshot or a backup.
- All source Acts, including front matter, empty scenes, epilogue and Appendix,
  remain in the book. Existing titles such as `Unknown Act`/`Opening` are preserved,
  not silently translated or removed. The cover uses stored title/author metadata.

## Local use

Use Node **24.x** and the project's installed dependencies. Existing public
Supabase configuration is required: `NEXT_PUBLIC_SUPABASE_URL` and either
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
Never supply a service-role/secret key to this export path.

Run the site's normal local development command, sign in, open either full Reader,
and download. Chrome is discovered on common macOS/Linux/Windows paths; an
unusual local install can use the server-only `BOOK_PDF_CHROME_EXECUTABLE` path.
No Pandoc, TeX, macOS-only API or external PDF service is needed.

For an offline validated book-snapshot JSON (not a raw database dump):

```sh
node scripts/export-novel-book.mjs snapshot.json output/pdf/reading-copy.pdf book
```

The CLI refuses to overwrite an existing output. Do not commit snapshots/PDFs;
`tmp/pdfs` and `output/pdf` are ignored by Git and excluded from Vercel uploads.

## Online runtime

`POST /api/novel-book-pdf` accepts only `{slug, options:{pageSize,fontSize}}` and a
Bearer session token. The token is verified with `auth.getUser`. A fresh public-key
Supabase client preserves user RLS; the privileged shared server client is not used.

On Vercel, pinned `@sparticuz/chromium` 153 and Puppeteer 25.16 run in a Node
function. Next output tracing explicitly includes Chromium, licensed Korean fonts
and KaTeX WOFF2 assets. No external font/download service receives the manuscript.
The function has a 300-second budget (270-second request abort). Confirm the
target plan/runtime's memory and duration support during deployment.
Local output was verified with Chrome 155. Puppeteer 25.16's preferred browser is
Chrome 156; the serverless Chromium 153/CDP combination still requires an actual
Linux deployment smoke test before production readiness is asserted.

Each request has an isolated browser and an HTTP PDF stream, not a persistent
public file. Successful and failed responses are private/no-store. Streaming is
necessary because full-book PDFs can exceed 4.5 MB. Disconnects/timeouts close the
browser; one renderer per process bounds local memory. This is **not** a
distributed quota or rate limiter. Deployment-level abuse protection is separate.

Raw HTML and remote images cannot execute/fetch; renderer JavaScript is disabled,
all network requests except embedded data assets are denied, and mathematical
parsing is validated before export. Font files are embedded in the resulting PDF.
Contents links and PDF outlines are clickable; the contents does not list page
numbers. Footers show page/total. This is a reading edition, not print-press-ready
imposition or a byte-exact archive.

## Deployment boundary

Development/testing does not publish this feature. Merge/deploy approval and a
real authenticated download of each edition on the production host remain
separate steps. Verify Linux Chromium launch, traced assets, streaming beyond
4.5 MB, production RLS, cancellation and actual browser download there.

The previous `/api/generate-pdf` is unchanged, including its existing public-PDF
protection tests; the Reader no longer calls it. Its older public outputs are not
treated as a current export. No DB migration or new storage bucket is required.

The existing TEMSCO PDF guards include global package/build files. Their manifests
add one exact `buildCompatibility` fingerprint for this dependency/config change.
Both original source identities, PDF hashes, preview hashes and page checks remain
unchanged. Only package.json, package-lock.json and next.config.js changed within
those source graphs, and no previously pinned dependency version changed.
