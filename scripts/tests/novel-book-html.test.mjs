import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBookHtml, renderBookParagraph } from '../../lib/novel-book/bookHtml.mjs';

const snapshot = () => ({ slug: 'quantum-vibration-novel', language: 'ko', title: '<title>경계의 주인</title>',
  subtitle: '', author: 'Author & Author', capturedAt: '2026-10-24T00:00:00Z', counts: { scenes: 2, paragraphs: 3 },
  acts: [{ number: 1, title: '표지', chapters: [{ number: 1, title: '시작', scenes: [{ id: 'a', title: 'Opening',
    paragraphs: [{ text: '표지 본문' }] }] }] }, { number: 9, title: '부록', chapters: [{ number: 1, title: '부록 B',
    scenes: [{ id: 'b', title: 'Opening', paragraphs: [{ text: '$$\nE=mc^2\n$$' }, { text: '[DOI](https://doi.org/10.1234/test)' }] }] }] }] });

test('all acts including first and Appendix and exact block count enter layout', () => {
  const html = buildBookHtml(snapshot());
  assert.equal((html.match(/class="body-block"/g) || []).length, 3);
  assert.ok(html.includes('표지 본문') && html.includes('부록 B'));
  assert.equal((html.match(/<h3>Opening<\/h3>/g) || []).length, 2);
  assert.ok(html.includes('href="#act-1-chapter-0"'));
  assert.ok(html.includes('katex-display') && html.includes('https://doi.org/10.1234/test'));
  assert.ok(html.includes('&lt;title&gt;경계의 주인&lt;/title&gt;'));
});
test('manuscript raw HTML cannot become executable elements or network resources', () => {
  const html = renderBookParagraph('<script>alert(1)</script>\n\n<img src="http://127.0.0.1/secret">\n\n![image](http://host/image)\n\n[x](javascript:alert(1))');
  assert.doesNotMatch(html, /<script|<img|<[^>]+src=|href="javascript:/);
  assert.match(html, /image/);
});
test('untrusted math HTML commands do not embed images', () => {
  assert.throws(() => renderBookParagraph('$$\n\\includegraphics{https://example.com/image}\n$$'), /BOOK_MATH_RENDER_FAILED/);
  assert.throws(() => renderBookParagraph('$\\foo$'), /BOOK_MATH_RENDER_FAILED/);
});
test('invalid options and dropped content fail closed', () => {
  assert.throws(() => buildBookHtml(snapshot(), { fontSize: 99 }), /INVALID_BOOK_OPTIONS/);
  const altered = snapshot(); altered.counts.paragraphs = 4;
  assert.throws(() => buildBookHtml(altered), /BOOK_LAYOUT_COUNT_MISMATCH/);
});
test('paper and language are deterministic', () => {
  assert.match(buildBookHtml(snapshot()), /size: 6in 9in/);
  const en = snapshot(); en.slug += '-en'; en.language = 'en';
  const html = buildBookHtml(en, { pageSize: 'A4', fontSize: 12 });
  assert.match(html, /size: 210mm 297mm/); assert.match(html, /ENGLISH EDITION/);
  assert.match(html, /font-size: 12pt/);
});
