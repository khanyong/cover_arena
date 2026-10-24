import { equationTarget, equationCommentaryIndex } from '../../shared/lib/equationCommentary.js';
import JSZip from 'jszip';
import { embedKindleMathImages } from './kindleMathImages.mjs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { escapeHtml as esc, renderBookParagraph, sectorFourEntryIndex } from './bookHtml.mjs';
import { BookSnapshotError } from '../../shared/lib/novelBookSnapshot.mjs';
const sha = text => createHash('sha256').update(text).digest('hex');
const check = signal => { if (signal?.aborted) throw new BookSnapshotError('BOOK_REQUEST_ABORTED', 504); };
const css = `body{font-family:serif;line-height:1.6;margin:0 5%;}p{margin:0 0 .8em;}h1,h2,h3{line-height:1.3;page-break-after:avoid;}h1{font-size:1.7em;}h2{font-size:1.4em;}h3{font-size:1.1em;margin-top:2em;}a{color:inherit;}blockquote{margin:1em;}pre{white-space:pre-wrap;}table{border-collapse:collapse;max-width:100%;}td,th{border:1px solid;padding:.3em;}.body-block{margin-bottom:.7em;}.equation-commentary{border:1px solid #555;padding:.8em;margin:1em 0;page-break-inside:avoid;font-style:normal;}.equation-commentary-links{font-size:.85em;}math[display=block]{display:block;margin:1em 0;}nav ol{list-style:none;padding-left:1em;}.cover{text-align:center;margin:0;page-break-after:always;}.cover img{display:block;width:100%;height:auto;max-width:100%;}.title-page{text-align:center;margin-top:3em;page-break-after:always;}`;

export async function renderBookEpub(snapshot, _options = {}, { signal } = {}) {
  check(signal);
  const zip = new JSZip();
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
  zip.file('META-INF/container.xml', '<?xml version="1.0" encoding="utf-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  const ko = snapshot.language === 'ko';
  const identity = sha(JSON.stringify([snapshot.slug,snapshot.title,snapshot.subtitle,snapshot.author,snapshot.acts]));
  const edition = `${snapshot.capturedAt.slice(0,10)} · ${identity.slice(0,10)}`;
  const cleanTitle = snapshot.title.replace(/^\[(?:KO|EN)\]\s*/i, '').trim();
  const title = `${cleanTitle}${ko ? ' — Korean Edition' : ''}`;
  const cover = await readFile(path.join(process.cwd(), 'assets/book-covers/ros-cover-v1.png'));
  zip.file('EPUB/images/cover.png', cover);
  const publicationId = sha(`${identity}:cover-v1:${sha(cover)}`);
  const xhtml = (name,body) => `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${snapshot.language}" lang="${snapshot.language}"><head><title>${esc(name)}</title><link rel="stylesheet" type="text/css" href="book.css"/></head><body>${body}</body></html>`;
  zip.file('EPUB/book.css',css+'\n.glossary-entry{break-inside:avoid;page-break-inside:avoid;}');
  const items=[['cover','cover.xhtml',''],['title-page','title.xhtml',''],['nav','nav.xhtml','nav'],['css','book.css','']];
  const spine=['cover','title-page','nav'];
  const toc=[]; const ncx=[]; const mapping=[];
  const targetFiles = new Map(); let targetChapter = 0;
  for (const act of snapshot.acts) for (const chapter of act.chapters) {
    const file = `chapter-${++targetChapter}.xhtml`;
    for (const scene of chapter.scenes) for (const paragraph of scene.paragraphs) {
      targetFiles.set(`paragraph-${paragraph.id}`, file);
      for (const e of equationCommentaryIndex.equations) if (paragraph.text.includes(`## ${e.number}. ${e.titles[snapshot.language]}\n`))
        targetFiles.set(equationTarget(snapshot.language, 'detail', e.number), file);
    }
  }
  const commentaryOptions = { resolve: (language, kind, number) => {
    const id = equationTarget(language, kind, number);
    const file = targetFiles.get(id);
    if (!file) throw new BookSnapshotError('BOOK_COMMENTARY_TARGET_MISSING');
    return `${file}#${id}`;
  } };
  let blocks=0, scenes=0, chapters=0;
  zip.file('EPUB/cover.xhtml',xhtml(title,`<section class="cover" epub:type="cover"><img src="images/cover.png" alt="${esc(cleanTitle)} — ${esc(snapshot.author || 'Kwang Yong Yoo')}"/></section>`));
  zip.file('EPUB/title.xhtml',xhtml(title,`<section class="title-page"><h1>${esc(title)}</h1><p>${esc(snapshot.subtitle)}</p><p>${esc(snapshot.author)}</p><p>${ko?'국문':'English'} · ${esc(edition)}</p></section><section><h2>${ko?'이 판본에 대하여':'About this edition'}</h2><p>${ko?'생성 시점의 최신 저장본입니다. 저장하지 않은 편집은 포함하지 않습니다.':'The latest saved Reader edition at export time. Unsaved edits are not included.'}</p><p>${esc(snapshot.capturedAt)}</p></section>`));
  for(const [ai,act] of snapshot.acts.entries()) {
    const chapterLinks=[];
    for(const chapter of act.chapters) {
      check(signal);
      const file=`chapter-${++chapters}.xhtml`, item=`chapter-${chapters}`;
      let body=`<h1>${esc(act.title)}</h1><h2>${esc(chapter.title)}</h2>`;
      for(const scene of chapter.scenes) {
        scenes++;
        body+=`<section id="scene-${scenes}"><h3>${esc(scene.title)}</h3>`;
        const glossaryStart=sectorFourEntryIndex(chapter,scene,snapshot.language);
        for(const [paragraphIndex,paragraph] of scene.paragraphs.entries()) {
          if(++blocks % 100 === 0) { await new Promise(resolve => setTimeout(resolve, 0)); check(signal); }
          const anchor=`paragraph-${paragraph.id}`;
          // React's HTML serializer uses a bare boolean attribute on GFM checkboxes.
          // Convert it to XML syntax for EPUB XHTML; raw manuscript HTML is disabled.
          const rendered=renderBookParagraph(paragraph.text,'mathml',commentaryOptions).replace(/ disabled=""/g,' disabled="disabled"');
          body+=`${paragraphIndex===glossaryStart?'<div class="glossary-entry">':''}<div class="body-block" id="${anchor}">${rendered}</div>${glossaryStart>=0&&paragraphIndex===glossaryStart+1?'</div>':''}`;
          mapping.push({sceneId:scene.id,compositionId:scene.compositionId,paragraphId:paragraph.id,versionId:paragraph.versionId,sha256:sha(paragraph.text),href:`${file}#${anchor}`});
        }
        body+='</section>';
      }
      zip.file(`EPUB/${file}`,xhtml(chapter.title,body));
      items.push([item,file,body.includes('<math')?'mathml':'']); spine.push(item);
      chapterLinks.push(`<li><a href="${file}">${esc(chapter.title)}</a></li>`);
      ncx.push(`<navPoint id="n${chapters}" playOrder="${chapters}"><navLabel><text>${esc(act.title)} — ${esc(chapter.title)}</text></navLabel><content src="${file}"/></navPoint>`);
    }
    toc.push(`<li><span>${esc(act.title)}</span><ol>${chapterLinks.join('')}</ol></li>`);
  }
  if(blocks!==snapshot.counts.paragraphs||scenes!==snapshot.counts.scenes) throw new BookSnapshotError('BOOK_LAYOUT_COUNT_MISMATCH');
  zip.file('EPUB/nav.xhtml',xhtml(ko?'목차':'Contents',`<nav epub:type="toc" id="toc"><h1>${ko?'목차':'Contents'}</h1><ol>${toc.join('')}</ol></nav>`));
  zip.file('EPUB/toc.ncx',`<?xml version="1.0" encoding="utf-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="urn:sha256:${publicationId}"/></head><docTitle><text>${esc(title)}</text></docTitle><navMap>${ncx.join('')}</navMap></ncx>`);
  zip.file('EPUB/review-map.json',JSON.stringify({schema:'ros-epub-review-map/v1',slug:snapshot.slug,language:snapshot.language,capturedAt:snapshot.capturedAt,edition:identity,source:snapshot.source,blocks:mapping},null,2));
  zip.file('EPUB/package.opf',`<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">urn:sha256:${publicationId}</dc:identifier><dc:title>${esc(title)}</dc:title><dc:language>${snapshot.language}</dc:language><meta name="cover" content="cover-image"/><dc:creator>${esc(snapshot.author||'Kwang Yong Yoo')}</dc:creator><meta property="dcterms:modified">${new Date(snapshot.capturedAt).toISOString().replace(/\.\d{3}Z$/,'Z')}</meta></metadata><manifest>${items.map(([id,href,properties])=>`<item id="${id}" href="${href}" media-type="${href.endsWith('.css')?'text/css':'application/xhtml+xml'}"${properties?` properties="${properties}"`:''}/>`).join('')}<item id="cover-image" href="images/cover.png" media-type="image/png" properties="cover-image"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="review-map" href="review-map.json" media-type="application/json"/></manifest><spine toc="ncx">${spine.map(id=>`<itemref idref="${id}"/>`).join('')}</spine><guide><reference type="cover" title="Cover" href="cover.xhtml"/></guide></package>`);
  check(signal);
  await embedKindleMathImages(zip, { signal });
  const bytes=await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:6}},()=>check(signal));
  check(signal);
  return {filename:`The Resonance of Space - Architects of Spacetime${ko ? " - Korean Edition" : ""}.epub`,stream:new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(bytes)); controller.close(); } }),close:async()=>{}};
}
