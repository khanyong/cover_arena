import test from 'node:test';
import assert from 'node:assert/strict';
import { renderBookParagraph, buildBookHtml } from '../../lib/novel-book/bookHtml.mjs';
import { equationCommentaryIndex as index, normalizeDisplayMath } from '../../shared/lib/equationCommentary.js';
test('all approved note headings render distinct boxes and complete forward links',()=>{
 for(const g of index.groups) for(const language of ['en','ko']) {
  const html=renderBookParagraph(`Before.\n\n> **${g.titles[language]}**\n>\n> Exact commentary.\n\nAfter.`);
  assert.match(html,/class="equation-commentary"/);
  for(const n of g.equations) assert.ok(html.includes(`href="#equation-detail-${language}-${n}"`));
  assert.ok(html.indexOf('Before.')<html.indexOf('<blockquote'));assert.ok(html.indexOf('</blockquote>')<html.indexOf('After.'));
 }
 assert.equal(index.groups.length,61);assert.equal(new Set(index.groups.flatMap(g=>g.equations)).size,110);
});
test('ordinary quotations are unchanged and cannot acquire note navigation',()=>{
 const h=renderBookParagraph('> **Ordinary dialogue**\n>\n> A quotation.');assert.ok(!h.includes('equation-commentary'));assert.ok(!h.includes('Detailed notes'));
});
test('all companion entries have language-specific anchors and occurrence-specific returns',()=>{
 for(const e of index.equations) for(const l of ['en','ko']) {
  const h=renderBookParagraph(`## ${e.number}. ${e.titles[l]}\n\n$$\\alpha^2$$\n\nDetails.\n\nConditions.`);
  assert.ok(h.includes(`id="equation-detail-${l}-${e.number}"`));assert.ok(h.includes(`href="#paragraph-${e.source[l].unit}"`));assert.ok(h.indexOf('Conditions.')<h.indexOf('href='));
 }
});
test('inline-on-a-line display delimiters render display math without changing source',()=>{
 const source='$$ V_{\\epsilon}(r) \\sim \\frac{1}{r^2+\\epsilon^2} $$';assert.match(renderBookParagraph(source),/katex-display/);assert.equal(normalizeDisplayMath(source),'$$\nV_{\\epsilon}(r) \\sim \\frac{1}{r^2+\\epsilon^2}\n$$');
});
test('EPUB destinations accept only generated chapter targets; unsafe links remain blocked',()=>{
 const h=renderBookParagraph(`> **${index.groups[0].titles.en}**\n>\n> Body.`,'mathml',{resolve:()=> 'chapter-56.xhtml#equation-detail-en-1'});assert.ok(h.includes('href="chapter-56.xhtml#equation-detail-en-1"'));
 assert.ok(!renderBookParagraph('[x](javascript:alert%281%29)').includes('href="javascript:'));
});
