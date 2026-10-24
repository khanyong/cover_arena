import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { renderBookEpub } from '../../lib/novel-book/renderBookEpub.mjs';
const snapshot = {slug:'quantum-vibration-novel',language:'ko',title:'공명 & Space',author:'Author',capturedAt:'2026-10-24T03:00:00.000Z',counts:{scenes:1,paragraphs:2},acts:[{title:'Act',chapters:[{title:'Chapter',scenes:[{id:'scene-1',paragraphs:[{id:'ko-1',versionId:'v1',text:'한글 **강조** & <script>bad()</script>\n\n$x^2$'},{id:'ko-2',versionId:'v2',text:'둘째 문장.\n\n$$\\frac{1}{r^2}$$'}]}]}]}]};
async function bytes(result){return Buffer.from(await new Response(result.stream).arrayBuffer());}
test('EPUB has first uncompressed mimetype, reading order, Kindle math images and exact review identities',async()=>{
 const result=await renderBookEpub(snapshot); const buffer=await bytes(result);
 assert.equal(buffer.readUInt16LE(8),0);assert.equal(buffer.subarray(30,58).toString(),'mimetypeapplication/epub+zip');
 const zip=await JSZip.loadAsync(buffer,{checkCRC32:true});
 const opf=await zip.file('EPUB/package.opf').async('string');assert.doesNotMatch(opf,/properties="mathml"/);assert.match(opf,/id="math-/);assert.match(opf,/idref="chapter-1"/);
 const chapter=await zip.file('EPUB/chapter-1.xhtml').async('string');assert.doesNotMatch(chapter,/<math/);assert.match(chapter,/<img class="math-inline"/);assert.ok(Object.keys(zip.files).some(n=>n.startsWith("EPUB/images/math-") && n.endsWith(".png")));assert.match(chapter,/한글/);assert.doesNotMatch(chapter,/<script/);assert.doesNotMatch(chapter,/katex-html/);
 const map=JSON.parse(await zip.file('EPUB/review-map.json').async('string'));assert.equal(map.blocks.length,2);assert.equal(map.blocks[0].paragraphId,'ko-1');assert.equal(map.blocks[0].versionId,'v1');assert.match(map.blocks[0].sha256,/^[0-9a-f]{64}$/);
 const second=await renderBookEpub({...snapshot,capturedAt:'2026-10-24T03:01:00.000Z'}); assert.equal(second.filename,result.filename);
 const changed=structuredClone(snapshot);changed.acts[0].chapters[0].scenes[0].paragraphs[0].text+=' changed';const changedZip=await JSZip.loadAsync(await bytes(await renderBookEpub(changed))); assert.notEqual(JSON.parse(await changedZip.file('EPUB/review-map.json').async('string')).edition,map.edition);
 assert.match(opf,/properties="cover-image"/); assert.match(opf,/<meta name="cover" content="cover-image"/); assert.ok(zip.file('EPUB/images/cover.png')); assert.match(await zip.file('EPUB/cover.xhtml').async('string'),/<img src="images\/cover.png"/); assert.doesNotMatch(opf,/<dc:title>[^<]*2026/); assert.match(result.filename,/^The Resonance of Space/);
});
test('count mismatches and cancelled exports fail closed',async()=>{
 await assert.rejects(renderBookEpub({...snapshot,counts:{scenes:1,paragraphs:3}}),/BOOK_LAYOUT_COUNT_MISMATCH/);
 await assert.rejects(renderBookEpub(snapshot,{}, {signal:AbortSignal.abort()}),/BOOK_REQUEST_ABORTED/);
});
