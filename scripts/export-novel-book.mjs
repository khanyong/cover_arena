/** Offline export of a validated book snapshot JSON; never connects to or writes the DB. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { createWriteStream } from 'node:fs';
import { renderBookPdf } from '../lib/novel-book/renderBookPdf.mjs';

const [input, output, pageSize = 'book'] = process.argv.slice(2);
if (!input || !output || !['book', 'A4'].includes(pageSize)) {
  throw new Error('Usage: node scripts/export-novel-book.mjs snapshot.json output.pdf [book|A4]');
}
const snapshot = JSON.parse(await fs.readFile(input, 'utf8'));
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 270000);
let result;
try {
  result = await renderBookPdf(snapshot, { pageSize, fontSize: 11 }, { signal: controller.signal });
  await fs.mkdir(path.dirname(path.resolve(output)), { recursive: true, mode: 0o700 });
  await pipeline(Readable.fromWeb(result.stream), createWriteStream(output, { flags: 'wx', mode: 0o600 }));
  console.log(JSON.stringify({ output, scenes: snapshot.counts.scenes, paragraphs: snapshot.counts.paragraphs,
    capturedAt: snapshot.capturedAt, bytes: (await fs.stat(output)).size }));
} finally {
  clearTimeout(timer); await result?.close();
}
