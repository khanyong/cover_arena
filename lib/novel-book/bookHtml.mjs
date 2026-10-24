import { remarkEquationCommentary, normalizeDisplayMath, equationTarget } from '../../shared/lib/equationCommentary.js';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import katex from 'katex';
import { BookSnapshotError, validateBookPdfRequest } from '../../shared/lib/novelBookSnapshot.mjs';

export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

function safeUrl(url) {
  return /^(https?:|mailto:|#)/i.test(url) || /^chapter-\d+\.xhtml#(?:equation-detail-(?:en|ko)-\d+|paragraph-[a-zA-Z0-9-]+)$/.test(url) ? url : '';
}

function validateMath() {
  return tree => {
    const walk = node => {
      if (node.type === 'math' || node.type === 'inlineMath') {
        try {
          katex.renderToString(node.value, { displayMode: node.type === 'math', trust: () => { throw new Error('Untrusted math command'); },
            strict: 'ignore', throwOnError: true, maxExpand: 1000 });
        } catch { throw new BookSnapshotError('BOOK_MATH_RENDER_FAILED'); }
      }
      for (const child of node.children || []) walk(child);
    };
    walk(tree);
  };
}

// No raw HTML, embedded resources, script, arbitrary CSS or remote image requests.
// Math is rendered locally with trust=false; external hyperlinks remain clickable.
export function renderBookParagraph(text, output = 'htmlAndMathml', commentaryOptions = { resolve: (language, kind, number) => '#' + equationTarget(language, kind, number) }) {
  return renderToStaticMarkup(createElement(ReactMarkdown, {
    remarkPlugins: [remarkMath, remarkGfm, validateMath, [remarkEquationCommentary, commentaryOptions]],
    rehypePlugins: [[rehypeKatex, { output, trust: false, strict: 'ignore', throwOnError: true, maxExpand: 1000 }]],
    urlTransform: safeUrl,
    components: {
      img: ({ alt }) => createElement('span', { className: 'image-alt' }, alt || ''),
      a: ({ href, children }) => createElement('a', { href: safeUrl(href || ''), rel: 'noreferrer' }, children),
    },
  }, normalizeDisplayMath(text)));
}

export function buildBookHtml(snapshot, inputOptions = {}, assetCss = '') {
  const { options } = validateBookPdfRequest({ slug: snapshot.slug, options: inputOptions });
  const ko = snapshot.language === 'ko';
  const toc = [], sections = [];
  let sceneCount = 0, paragraphCount = 0;
  for (const [a, act] of snapshot.acts.entries()) {
    const actId = `act-${a}`;
    toc.push(`<li class="toc-act"><a href="#${actId}">${escapeHtml(act.title)}</a><ol>`);
    const chapters = [];
    for (const [c, chapter] of act.chapters.entries()) {
      const chapterId = `${actId}-chapter-${c}`;
      toc.push(`<li><a href="#${chapterId}">${escapeHtml(chapter.title)}</a></li>`);
      const scenes = [];
      for (const [s, scene] of chapter.scenes.entries()) {
        sceneCount += 1;
        const paragraphs = scene.paragraphs.map(paragraph => {
          paragraphCount += 1;
          return `<div class="body-block" id="paragraph-${escapeHtml(paragraph.id)}" data-block="${paragraphCount}">${renderBookParagraph(paragraph.text)}</div>`;
        }).join('\n');
        scenes.push(`<section class="scene" id="${chapterId}-scene-${s}"><h3>${escapeHtml(scene.title)}</h3>${paragraphs}</section>`);
      }
      chapters.push(`<section class="chapter" id="${chapterId}"><h2>${escapeHtml(chapter.title)}</h2>${scenes.join('\n')}</section>`);
    }
    toc.push('</ol></li>');
    sections.push(`<section class="act" id="${actId}"><h1>${escapeHtml(act.title)}</h1>${chapters.join('\n')}</section>`);
  }
  if (sceneCount !== snapshot.counts.scenes || paragraphCount !== snapshot.counts.paragraphs) {
    throw new BookSnapshotError('BOOK_LAYOUT_COUNT_MISMATCH');
  }
  const date = new Date(snapshot.capturedAt).toISOString();
  const size = options.pageSize === 'A4' ? '210mm 297mm' : '6in 9in';
  return `<!doctype html><html lang="${ko ? 'ko' : 'en'}"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; font-src data:; img-src data:; base-uri 'none'; form-action 'none'">
<title>${escapeHtml(snapshot.title)}</title><style>${assetCss}
@page { size: ${size}; margin: 18mm 17mm 19mm; }
* { box-sizing: border-box; }
html { color: #20242a; background: white; }
body { margin: 0; font-family: 'Book Serif', serif; font-size: ${options.fontSize}pt; line-height: 1.72; overflow-wrap: anywhere; }
h1,h2,h3 { font-weight: 700; line-height: 1.35; break-after: avoid; overflow-wrap: anywhere; }
h1 { font-size: 25pt; margin: 13mm 0 15mm; }
h2 { font-size: 18pt; margin: 4mm 0 12mm; }
h3 { font-size: 12pt; margin: 9mm 0 5mm; }
p { margin: 0 0 .72em; widows: 3; orphans: 3; }
strong { font-weight: 700; } em { font-style: italic; }
a { color: inherit; text-decoration: underline; text-underline-offset: .15em; overflow-wrap: anywhere; }
.cover { break-after: page; min-height: 155mm; display: flex; flex-direction: column; justify-content: center; text-align: center; }
.cover h1 { font-size: 31pt; margin: 12mm 0 8mm; }
.cover .subtitle { font-size: 15pt; line-height: 1.55; }
.eyebrow { font-size: 9pt; letter-spacing: .15em; }
.author { margin-top: 15mm; font-size: 13pt; }
.edition { font-size: 9pt; margin-top: 12mm; color: #555; }
.colophon { break-after: page; font-size: 9pt; }
.toc { break-after: page; font-size: 10pt; }
.toc ol { list-style: none; padding-left: 4mm; margin: 3mm 0 6mm; }
.toc > ol { padding: 0; }.toc-act { margin-top: 5mm; }.toc a { text-decoration: none; }
.toc-act > a { font-weight: 700; }.toc li { break-inside: avoid; }
.act { break-before: page; }.chapter + .chapter { break-before: page; }
blockquote { margin: 4mm 0 4mm 5mm; padding-left: 4mm; border-left: .4mm solid #bbc0c5; }
.equation-commentary { border: .4pt solid #555; padding: 3mm 4mm; margin: 4mm 0; break-inside: avoid; font-style: normal; }
.equation-commentary-links { font-size: .8em; }
pre { white-space: pre-wrap; font-size: .85em; } code { overflow-wrap: anywhere; }
table { border-collapse: collapse; width: 100%; font-size: .85em; } td,th { border: .2mm solid #ddd; padding: 2mm; }
tr { break-inside: avoid; }.katex-display { break-inside: avoid; margin: 1.2em 0; overflow: visible; }
.katex { font-size: 1.06em; }.katex-display > .katex { max-width: 100%; }
.katex .hangul_fallback,.katex .cjk_fallback { font-family: 'Book Serif', serif; }
.katex-error { white-space: pre-wrap; font-family: 'Book Serif', serif; color: #20242a !important; }
.scene { margin-bottom: 8mm; }.body-block:empty { min-height: .7em; }
</style></head><body>
<section class="cover"><div class="eyebrow">${ko ? '한국어판' : 'ENGLISH EDITION'}</div><h1>${escapeHtml(snapshot.title)}</h1>
${snapshot.subtitle ? `<div class="subtitle">${escapeHtml(snapshot.subtitle)}</div>` : ''}
${snapshot.author ? `<div class="author">${escapeHtml(snapshot.author)}</div>` : ''}
<div class="edition">${ko ? '현재 저장본 · 개인 열람용' : 'Current saved edition · Reading copy'}</div></section>
<section class="colophon"><h2>${ko ? '이 파일에 대하여' : 'About this file'}</h2><p>${ko
  ? '이 PDF는 생성 시점에 접근 가능한 저장본으로 구성했습니다. 국문 관리 장면은 최신 review 선택본이며, 문학적 최종 확정이나 DB final/accepted 전환을 뜻하지 않습니다. 화면의 임시 편집·개별 과거 버전 선택은 포함하지 않습니다.'
  : 'This PDF contains the accessible saved edition at export time. It does not include unsaved edits or temporary historical-version selections and does not change editorial acceptance.'}</p>
<p>${escapeHtml(date)} (UTC)<br>${sceneCount} scenes · ${paragraphCount} content blocks</p>
<p>${ko ? '읽기용 조판본입니다. 바이트 단위 복원에는 별도 원본 보관 패키지를 사용하세요.' : 'This is a typeset reading copy. Use the separate source archive for byte-exact restoration.'}</p></section>
<nav class="toc"><h1>${ko ? '목차' : 'Contents'}</h1><ol>${toc.join('\n')}</ol></nav>
<main>${sections.join('\n')}</main></body></html>`;
}
