import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Synthetic SSR plus executable callback/source-contract checks. This suite does
// not open a browser, load manuscripts/env files, call Auth/DB, or write fixtures.
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../../', import.meta.url));
const readerPath = `${root}components/NovelPlatform/NovelFullReader.tsx`;
const bilingualPath = `${root}components/NovelPlatform/NovelBilingualReader.tsx`;
const pagePath = `${root}pages/novel/[...slug].tsx`;
const [readerSource, bilingualSource, pageSource, css] = await Promise.all([
  readFile(readerPath, 'utf8'), readFile(bilingualPath, 'utf8'),
  readFile(pagePath, 'utf8'), readFile(`${root}components/NovelPlatform/NovelFullReader.module.css`, 'utf8'),
]);
const parse = (name, source) => ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const readerAst = parse(readerPath, readerSource);
const bilingualAst = parse(bilingualPath, bilingualSource);
const pageAst = parse(pagePath, pageSource);
function nodes(rootNode, predicate) {
  const found = [];
  const visit = node => { if (predicate(node)) found.push(node); ts.forEachChild(node, visit); };
  visit(rootNode);
  return found;
}
function initializer(ast, name) {
  const found = nodes(ast, node => ts.isVariableDeclaration(node) && node.name.getText(ast) === name);
  assert.equal(found.length, 1, `One declaration for ${name}`);
  return found[0].initializer;
}
function executableNode(node, ast, scope) {
  const javascript = ts.transpileModule(`const callback = ${node.getText(ast)};`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  return new Function(...Object.keys(scope), `${javascript}\nreturn callback;`)(...Object.values(scope));
}
const executable = (ast, name, scope) => executableNode(initializer(ast, name), ast, scope);
const forbidden = () => { throw new Error('Unexpected mutation/network callback'); };
const callbacks = Object.fromEntries([
  'onAddNewVersion', 'onParagraphVersionChange', 'onSaveAiPrompt', 'onDeleteParagraph',
  'onInsertParagraph', 'onInsertParagraphBefore', 'onInsertChapter', 'onInsertChapterBefore',
  'onDeleteChapter', 'onInsertActAfter', 'onInsertActBefore', 'onDeleteAct',
  'onUpdateActMetadata', 'onUpdateChapterMetadata', 'onInsertScene', 'onDeleteScene',
  'onUpdateSceneMetadata', 'onManagedRevisionChange', 'onReadingOnlyChange', 'onFocusModeChange',
].map(name => [name, forbidden]));
const bundle = await build({
  stdin: { contents: `export { NovelFullReader, buildSceneCopyText } from ${JSON.stringify(readerPath)}; export { NovelBilingualReader } from ${JSON.stringify(bilingualPath)};`, resolveDir: root, loader: 'js' },
  bundle: true, write: false, platform: 'node', format: 'cjs',
  external: ['react', 'react-dom', 'react-dom/*'], logLevel: 'silent',
  plugins: [{ name: 'synthetic-reader-boundaries', setup(builder) {
    builder.onResolve({ filter: /\.module\.css$/ }, args => ({ path: args.path, namespace: 'test-css' }));
    builder.onLoad({ filter: /.*/, namespace: 'test-css' }, () => ({
      contents: 'export default { readerRoot: "readerRoot", readingSheet: "readingSheet", readingColumn: "readingColumn" };', loader: 'js',
    }));
    builder.onResolve({ filter: /(?:^|\/)supabase(?:\.js)?$/ }, () => ({ path: 'forbidden-reader-network', namespace: 'test-network' }));
    builder.onLoad({ filter: /.*/, namespace: 'test-network' }, () => ({ contents: `
      const forbidden = () => { throw new Error('Unexpected network/auth operation'); };
      export const supabase = { rpc: forbidden, from: forbidden, auth: new Proxy({}, { get: () => forbidden }) };
      export const novels = new Proxy({}, { get: () => forbidden });
    `, loader: 'js' }));
  } }],
});
assert.equal(bundle.errors.length, 0);
assert.equal(bundle.warnings.length, 0);
const module = { exports: {} };
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(require, module, module.exports);
const { NovelFullReader, NovelBilingualReader, buildSceneCopyText } = module.exports;
const freeze = value => {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
};
function paragraph(id, body) {
  return { id, activeVersion: 'current', aiPrompt: 'SYNTHETIC EDIT GUIDELINE', versions: {
    current: { version: 'current', content: body, createdAt: '2026-01-01T00:00:00Z' },
    earlier: { version: 'earlier', content: `Earlier synthetic ${id}.`, createdAt: '2025-01-01T00:00:00Z' },
  } };
}
function novel(slug = 'quantum-vibration-novel') {
  return freeze({ id: slug, slug, title: 'Synthetic work', subtitle: 'Synthetic subtitle', author: 'Synthetic author', updatedAt: '2026-01-01',
    acts: [{ number: 1, title: 'Synthetic act', summary: 'SYNTHETIC ACT SUMMARY', chapters: [{ number: 1, title: 'Synthetic chapter', synopsis: 'SYNTHETIC SYNOPSIS', scenes: [
      { id: 'legacy', number: 1, title: 'Synthetic legacy title', paragraphs: [paragraph('p-legacy', 'Preserved Korean 국문 text.'), paragraph('p-math', 'Inline $x+1$ remains math.')] },
      { id: 'managed', number: 2, title: 'Synthetic managed title', storageModel: 'ros-ko-block-v1', managedSceneId: 'managed-id', compositionRevisionId: 'composition-id', managedViewKey: 'composition-id', managedHistory: [{ compositionId: 'composition-id', revisionNo: 1, manuscriptVersion: 'r01', isReview: true }], paragraphs: [{ ...paragraph('p-managed', 'Managed synthetic body.'), storageModel: 'ros-ko-block-v1', unitId: 'unit-managed', sourceKey: 'KO/SYNTHETIC/B0001' }] },
      { id: 'history', number: 3, title: 'Synthetic history title', storageModel: 'ros-ko-block-v1', managedSceneId: 'history-managed-id', managedReadOnly: true, paragraphs: [paragraph('p-history', 'Historical synthetic body.')] },
      { id: 'empty', number: 4, title: 'Synthetic empty title', paragraphs: [] },
    ] }] }], characters: [], locations: [], world: [], versionHistory: [],
  });
}
function renderReader(value = novel(), extra = {}) {
  return renderToStaticMarkup(React.createElement(NovelFullReader, { ...callbacks, novel: value, customVersionMap: {}, ...extra }));
}
const openingFor = (html, id) => {
  const opening = html.match(new RegExp(`<div\\b[^>]*id="${id}"[^>]*>`));
  assert.ok(opening, `Missing ${id}`);
  return opening[0];
};

test('FullReader defaults to read-only, while explicit edit remains available', () => {
  const quiet = renderReader();
  const edit = renderReader(novel(), { readingOnly: false });
  assert.match(quiet, /data-reading-mode="read"/);
  assert.match(quiet, /aria-pressed="true"[^>]*>읽기 전용<\/button>/);
  assert.match(edit, /data-reading-mode="edit"/);
  assert.match(edit, /aria-pressed="true"[^>]*>인라인 수정<\/button>/);
  assert.match(quiet, /READ ONLY · 읽기 전용/);
  assert.match(edit, /MASTER NOVEL READ &amp; EDIT MODE/);
});

test('quiet paragraphs have selectable text but no edit cursor, tooltip or expanding hover metadata', () => {
  const quiet = renderReader();
  for (const id of ['p-legacy', 'p-math', 'p-managed', 'p-history']) {
    const opening = openingFor(quiet, `paragraph-${id}`);
    assert.match(opening, /cursor-text select-text/);
    assert.doesNotMatch(opening, /cursor-pointer|hover:|title=|transition-all/);
  }
  assert.doesNotMatch(quiet, /group-hover:h-auto|group-hover:opacity-100|SYNTHETIC EDIT GUIDELINE|클릭하여 이 단락 수정|클릭하여 검토 코멘트/);
  const edit = renderReader(novel(), { readingOnly: false });
  assert.match(openingFor(edit, 'paragraph-p-legacy'), /cursor-pointer/);
  assert.match(edit, /group-hover:h-auto/);
  assert.match(edit, /SYNTHETIC EDIT GUIDELINE/);
});

test('quiet reading omits structural controls, editing title affordances and review clutter', () => {
  const quiet = renderReader();
  assert.doesNotMatch(quiet, /✏️ 수정|첫 막\(Act\) 이전|첫 챕터 이전|새 씬\(Scene\) 추가|새 챕터 추가|새 막 추가|씬 삭제|Scene 검토본 · 지침|SYNTHETIC ACT SUMMARY|SYNTHETIC SYNOPSIS|클릭하여 씬 제목 수정/);
  const edit = renderReader(novel(), { readingOnly: false });
  for (const text of ['첫 막(Act) 이전', '첫 챕터 이전', '새 씬(Scene) 추가', '새 챕터 추가', '새 막 추가', '씬 삭제', 'Scene 검토본 · 지침', '클릭하여 씬 제목 수정']) assert.ok(edit.includes(text), text);
});

test('reading modes preserve scene/paragraph anchors, selected bodies and original objects', () => {
  const value = novel();
  const selected = freeze({ 'p-legacy': 'earlier' });
  const before = JSON.stringify({ value, selected });
  const quiet = renderReader(value, { customVersionMap: selected });
  const edit = renderReader(value, { customVersionMap: selected, readingOnly: false });
  for (const html of [quiet, edit]) {
    for (const id of ['legacy', 'managed', 'history', 'empty']) assert.match(html, new RegExp(`id="scene-${id}"`));
    for (const id of ['p-legacy', 'p-math', 'p-managed', 'p-history']) openingFor(html, `paragraph-${id}`);
    for (const text of ['Earlier synthetic p-legacy.', 'Managed synthetic body.', 'Historical synthetic body.']) assert.ok(html.includes(text));
    assert.doesNotMatch(html, /Preserved Korean 국문 text\./);
    assert.match(html, /class="katex"/);
    assert.match(html, /id="full-act-1-ch-1"/);
  }
  assert.equal(JSON.stringify({ value, selected }), before);
  assert.equal(buildSceneCopyText(value.acts[0].chapters[0].scenes[0], selected), 'Earlier synthetic p-legacy.\n\nInline $x+1$ remains math.\n');
});

test('quiet reading keeps copy and historical composition selection without registering a version', () => {
  const html = renderReader();
  assert.equal([...html.matchAll(/data-copy-scene-id=/g)].length, 4);
  assert.match(html, /aria-label="Synthetic managed title 구성 리비전 선택"/);
  assert.match(html, /<option value="composition-id" selected="">최신 review · 구조 r1 · r01<\/option>/);
  assert.doesNotMatch(html, /새 버전 생성|단락 인라인 퀵 에디터/);
});

for (const slug of ['quantum-vibration-novel', 'quantum-vibration-novel-en']) {
  test(`${slug}: quiet mode keeps comparison entry for every managed, legacy, historical and empty scene`, () => {
    assert.equal([...renderReader(novel(slug)).matchAll(/>영한 비교<\/button>/g)].length, 4);
  });
}

test('quiet preferences expose font size, spacing, width and fonts without manuscript persistence', () => {
  const html = renderReader();
  for (const name of ['본문 폭', '줄 간격', '본문 글꼴', '글자 크기 sm', '글자 크기 base', '글자 크기 lg', '글자 크기 xl']) assert.ok(html.includes(`aria-label="${name}"`));
  assert.match(html, /data-reading-width="standard"/);
  assert.match(html, /data-reading-spacing="comfortable"/);
  assert.match(html, /data-reading-font="serif"/);
  assert.match(html, /단어 검색/);
  assert.match(html, /따뜻한 화면/);
  assert.match(html, /어두운 화면/);
  assert.doesNotMatch(renderReader(novel(), { readingOnly: false }), /aria-label="본문 폭"|aria-label="줄 간격"|aria-label="본문 글꼴"/);
});

test('focus mode has an explicit accessible escape control and cleans up the Escape listener', () => {
  const html = renderReader(novel(), { focusMode: true });
  assert.match(html, /집중 화면 해제 \(Esc\)/);
  const toolbar = html.match(/<div\b[^>]*aria-label="독서 도구"[^>]*>/)?.[0];
  assert.ok(toolbar);
  assert.match(toolbar, /style="top:8px"/);
  assert.match(toolbar, /sticky/);
  assert.match(readerSource, /if \(!focusMode\) return;/);
  assert.match(readerSource, /event\.key === 'Escape'.*onFocusModeChange\?\.\(false\)/);
  assert.match(readerSource, /removeEventListener\('keydown', exitFocus\)/);
});

test('focused quiet reading starts with compact tools and expands without replacing preferences or losing its anchor', () => {
  const focused = renderReader(novel(), { focusMode: true });
  const normal = renderReader(novel(), { focusMode: false });
  assert.match(focused, /aria-expanded="false"[^>]*>독서 도구 펼치기<\/button>/);
  assert.match(focused, /집중 화면 해제 \(Esc\)/);
  assert.match(focused, /class="hidden flex-wrap items-center gap-3"/);
  assert.match(focused, /class="hidden items-center gap-2 bg-zinc-950/);
  assert.match(focused, /<details class="hidden w-full text-sm text-zinc-300"/);
  assert.doesNotMatch(normal, /독서 도구 펼치기|class="hidden flex-wrap items-center gap-3"/);
  assert.doesNotMatch(focused, /본문은 선택·복사만 가능합니다/);
  for (const html of [focused, normal]) {
    assert.match(html, /aria-label="본문 검색"/);
    assert.match(html, /<option value="comfortable" selected="">편안하게<\/option>/);
    assert.match(html, /<option value="standard" selected="">보통<\/option>/);
    assert.match(html, /<option value="serif" selected="">명조<\/option>/);
  }
  assert.equal(initializer(readerAst, 'compactTools').getText(readerAst), 'readingOnly && focusMode && !readingToolsExpanded');
  const expand = nodes(readerAst, node => ts.isJsxOpeningElement(node) && node.tagName.getText(readerAst) === 'button' && node.getText(readerAst).includes('aria-expanded={readingToolsExpanded}'));
  assert.equal(expand.length, 1);
  const onClick = expand[0].attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.getText(readerAst) === 'onClick');
  const calls = [];
  executableNode(onClick.initializer.expression, readerAst, {
    keepReadingPosition: update => { calls.push('capture'); update(); },
    setReadingToolsExpanded: update => calls.push(update(false)),
  })();
  assert.deepEqual(calls, ['capture', true]);
});

test('scene and paragraph anchors clear both measured sticky regions, with an independently cleaned toolbar observer', () => {
  for (const prefix of ['scene-', 'paragraph-', 'full-act-']) assert.ok(css.includes(`.readerRoot [id^="${prefix}"]`));
  assert.match(css, /scroll-margin-top:\s*calc\(var\(--reader-sticky-offset, 5rem\) \+ var\(--reader-tools-height, 12rem\) \+ 16px\)/);
  assert.match(renderReader(novel(), { focusMode: true }), /class="readerRoot space-y-6 relative" style="--reader-sticky-offset:8px"/);
  assert.match(renderReader(), /style="--reader-sticky-offset:var\(--reader-header-offset, 5rem\)"/);
  const effects = nodes(readerAst, node => ts.isCallExpression(node) && node.expression.getText(readerAst) === 'useEffect' && node.arguments[0]?.getText(readerAst).includes("setProperty('--reader-tools-height'"));
  assert.equal(effects.length, 1);
  const properties = [];
  const observed = [];
  let height = 150;
  let measuredAgain;
  let disconnected = false;
  const toolbar = { getBoundingClientRect: () => ({ height }) };
  const cleanup = executableNode(effects[0].arguments[0], readerAst, {
    readerToolbar: { current: toolbar },
    readerElement: { current: { style: { setProperty: (...value) => properties.push(value) } } },
    ResizeObserver: class {
      constructor(callback) { measuredAgain = callback; }
      observe(element) { observed.push(element); }
      disconnect() { disconnected = true; }
    },
  })();
  assert.deepEqual(observed, [toolbar]);
  assert.deepEqual(properties, [['--reader-tools-height', '150px']]);
  height = 240;
  measuredAgain();
  assert.deepEqual(properties.at(-1), ['--reader-tools-height', '240px']);
  cleanup();
  assert.equal(disconnected, true);
  const observers = ast => nodes(ast, node => ts.isNewExpression(node) && node.expression.getText(ast) === 'ResizeObserver');
  assert.equal(observers(readerAst).length, 1);
  assert.equal(observers(pageAst).length, 1, 'Parent header measurement remains separate from Reader tools');
});

test('read styling controls actual prose text and scoped math overflow without disabling text selection', () => {
  assert.match(css, /\.readingSheet\s*\{/);
  assert.match(css, /--reading-measure:\s*48rem/);
  assert.match(css, /\[data-reading-width="narrow"\].*40rem/);
  assert.match(css, /\[data-reading-width="wide"\].*64rem/);
  assert.match(css, /:global\(\.novel-math-prose p\)/);
  assert.match(css, /font-family:\s*var\(--reading-font\)/);
  assert.match(css, /font-size:\s*inherit/);
  assert.match(css, /line-height:\s*var\(--reading-leading\)/);
  assert.match(css, /text-align:\s*start/);
  assert.match(css, /:global\(\.katex-display\)[\s\S]*overflow-x:\s*auto/);
  assert.doesNotMatch(css, /pointer-events:\s*none|user-select:\s*none/);
});

test('mode switching refuses to discard any open paragraph, act, chapter or scene draft', () => {
  const openEditor = initializer(readerAst, 'hasOpenEditor').getText(readerAst);
  for (const name of ['editingParagraph', 'editingAct', 'editingChapter', 'editingSceneId']) assert.ok(openEditor.includes(name));
  const calls = [];
  const scope = { hasOpenEditor: true, readingOnly: false, keepReadingPosition: update => update(), onReadingOnlyChange: value => calls.push(['read', value]), onFocusModeChange: value => calls.push(['focus', value]), setCommentPanelSceneId: value => calls.push(['comments', value]) };
  executable(readerAst, 'changeReadingMode', scope)(true);
  assert.deepEqual(calls, []);
  executable(readerAst, 'changeReadingMode', { ...scope, hasOpenEditor: false })(true);
  assert.deepEqual(calls, [['read', true], ['comments', null]]);
  calls.length = 0;
  executable(readerAst, 'changeReadingMode', { ...scope, hasOpenEditor: false, readingOnly: true })(false);
  assert.deepEqual(calls, [['read', false], ['focus', false], ['comments', null]]);
});

test('quiet paragraph click and save callbacks return before selection or writes', async () => {
  executable(readerAst, 'handleParagraphClick', { readingOnlyRef: { current: true } })({}, {});
  let prevented = false;
  await executable(readerAst, 'handleSaveParagraph', { readingOnlyRef: { current: true } })({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
});

for (const name of ['persistReviewComment', 'persistReviewGuideline']) {
  test(`${name} rejects quiet-mode writes before reading auth or invoking a client`, async () => {
    await assert.rejects(executable(readerAst, name, { readingOnlyRef: { current: true } })({}, {}, {}), /인라인 수정 모드/);
  });
}

test('quiet mode also prevents background review-comment/guideline reads', () => {
  const canRead = initializer(readerAst, 'canRead').getText(readerAst);
  assert.match(canRead, /!readingOnly/);
  assert.match(canRead, /commentActorId/);
  assert.match(readerSource, /commentsReload, readingOnly\]/);
});

test('scene title blur/Enter callbacks cannot save after reading mode became active', () => {
  const titleInput = nodes(readerAst, node => ts.isJsxSelfClosingElement(node) && node.tagName.getText(readerAst) === 'input' && node.getText(readerAst).includes('value={editingSceneTitle}'));
  assert.equal(titleInput.length, 1);
  for (const name of ['onBlur', 'onKeyDown']) {
    const attribute = titleInput[0].attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.getText(readerAst) === name);
    const arrow = attribute.initializer.expression;
    assert.match(arrow.body.statements[0].getText(readerAst), /if \(readingOnlyRef\.current\) return/);
  }
});

test('managed review dialog, legacy modal, comment panel and body callbacks are gated, not CSS-hidden', () => {
  assert.match(readerSource, /!readingOnly && editingParagraph && editingParagraphScene\?\.managedSceneId/);
  assert.match(readerSource, /!readingOnly && editingParagraph && !editingParagraphScene\?\.managedSceneId/);
  assert.match(readerSource, /!readingOnly && commentPanelScene && <SceneReviewCommentsPanel/);
  assert.match(readerSource, /onClick=\{readingOnly \? undefined : \(\) => handleParagraphClick\(p, scene\)\}/);
  assert.match(readerSource, /<NovelBilingualReader[\s\S]*?readingOnly=\{readingOnly\}/);
});

test('managed body-save callback independently returns false when quiet mode became active', async () => {
  const dialog = nodes(readerAst, node => ts.isJsxSelfClosingElement(node) && node.tagName.getText(readerAst) === 'ManagedBlockReviewDialog');
  assert.equal(dialog.length, 1);
  const attribute = dialog[0].attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.getText(readerAst) === 'onSaveBody');
  assert.equal(await executableNode(attribute.initializer.expression, readerAst, { readingOnlyRef: { current: true } })('synthetic draft', 'synthetic note'), false);
});

test('position capture preserves the signed offset inside a long visible legacy paragraph', () => {
  const before = { getBoundingClientRect: () => ({ top: -700, bottom: 50, height: 750 }) };
  const hidden = { getBoundingClientRect: () => ({ top: 200, bottom: 200, height: 0 }) };
  const visible = { getBoundingClientRect: () => ({ top: -220, bottom: 700, height: 920 }) };
  const readingAnchor = { current: null };
  let updated = false;
  executable(readerAst, 'keepReadingPosition', {
    readerToolbar: { current: { getBoundingClientRect: () => ({ bottom: 120 }) } },
    readerElement: { current: { querySelectorAll: selector => { assert.equal(selector, '[id^="paragraph-"]'); return [before, hidden, visible]; } } },
    readingAnchor, window: { innerHeight: 800 },
  })(() => { updated = true; });
  assert.equal(updated, true);
  assert.equal(readingAnchor.current.element, visible);
  assert.equal(readingAnchor.current.gap, -340, 'Do not reset long legacy paragraphs to their start');
});

test('position restore waits for layout, preserves signed offset and cleans up both animation frames', () => {
  const effects = nodes(readerAst, node => ts.isCallExpression(node) && node.expression.getText(readerAst) === 'useEffect' && node.arguments[0]?.getText(readerAst).includes('window.scrollBy'));
  assert.equal(effects.length, 1);
  const frames = new Map();
  const cancelled = [];
  const scrolls = [];
  let id = 0;
  const readingAnchor = { current: { element: { isConnected: true, getBoundingClientRect: () => ({ top: -120 }) }, gap: -340 } };
  const cleanup = executableNode(effects[0].arguments[0], readerAst, {
    readingAnchor, readerToolbar: { current: { getBoundingClientRect: () => ({ bottom: 300 }) } },
    requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: frame => cancelled.push(frame), window: { scrollBy: input => scrolls.push(input) },
  })();
  assert.deepEqual(scrolls, []);
  frames.get(1)();
  assert.deepEqual(scrolls, []);
  frames.get(2)();
  assert.deepEqual(scrolls, [{ top: -80, behavior: 'instant' }]);
  assert.equal(readingAnchor.current, null);
  cleanup();
  assert.deepEqual(cancelled, [1, 2]);
  const dependencies = effects[0].arguments[1].getText(readerAst);
  for (const dependency of ['readingOnly', 'focusMode', 'fontSize', 'readingWidth', 'readingSpacing', 'readingFont', 'viewMode', 'readingToolsExpanded']) assert.ok(dependencies.includes(dependency));
});

test('parent owns quiet/focus state and passes it to the existing Reader without selecting a new manuscript', () => {
  assert.match(pageSource, /\[readerReadingOnly, setReaderReadingOnly\] = useState\(true\)/);
  assert.match(initializer(pageAst, 'isQuietReader').getText(pageAst), /mainTab === 'story' && activeTab === 'reader' && readerReadingOnly/);
  assert.equal(initializer(pageAst, 'isFocusedReader').getText(pageAst), 'isQuietReader && readerFocusMode');
  const component = nodes(pageAst, node => ts.isJsxSelfClosingElement(node) && node.tagName.getText(pageAst) === 'NovelFullReader');
  assert.equal(component.length, 1);
  for (const prop of ['readingOnly={readerReadingOnly}', 'onReadingOnlyChange={setReaderReadingOnly}', 'focusMode={isFocusedReader}', 'onFocusModeChange={setReaderFocusMode}', 'novel={novel}', 'customVersionMap={customVersionMap}']) assert.ok(component[0].getText(pageAst).includes(prop));
  assert.match(pageSource, /!isQuietReader && <button[\s\S]*?setShowImportModal\(true\)/);
  const header = nodes(pageAst, node => ts.isJsxOpeningElement(node) && node.tagName.getText(pageAst) === 'header');
  assert.equal(header.length, 1);
  assert.match(header[0].getText(pageAst), /isFocusedReader \? 'hidden'/);
  assert.match(pageSource, /mainTab === 'story' && !isFocusedReader && \(/);
  assert.match(pageSource, /<main className=\{mainTab === 'story' && !isFocusedReader/);
});

function bilingualProps() {
  return freeze({ scene: { id: 'pair', paragraphs: [{ id: 'p-pair', unitId: 'ko-unit' }] },
    comparison: { ko_composition_id: 'composition', ko_body_sha256: 'ko-hash', en_title: 'Synthetic EN title', en_document_slug: 'synthetic-en', en_body_sha256: 'en-hash', en_terminal_lf: 0, changed_count: 1, unavailable_count: 0, rows: [{ position: 1, ko_unit_id: 'ko-unit', ko_version_id: 'ko-version', ko_body: '국문 합성 문장 $x+1$.', en_body: 'English synthetic sentence $x+1$.', en_latest_body: 'Latest synthetic sentence.', en_unit_id: 'en-unit', en_version_id: 'en-version', en_latest_version_id: 'en-latest', alignment_id: 'alignment', en_status: 'changed' }] },
    loading: false, error: '', fontSizeClass: 'text-lg', comments: [{ block_unit_id: 'ko-unit', status: 'open' }],
    onRetry: forbidden, onClose: forbidden, onSelectBlock: forbidden, onOpenBlock: forbidden, onBuildPacket: forbidden,
  });
}
const renderBilingual = extra => renderToStaticMarkup(React.createElement(NovelBilingualReader, { ...bilingualProps(), ...extra }));

test('bilingual quiet reading hides review/edit and technical details while preserving both original texts', () => {
  const props = bilingualProps();
  const before = JSON.stringify(props);
  const quiet = renderToStaticMarkup(React.createElement(NovelBilingualReader, { ...props, readingOnly: true }));
  assert.match(quiet, /한국어와 영어 모두 읽기 전용/);
  assert.doesNotMatch(quiet, /한국어 검토 및 수정|검토 · 수정|KO Unit·Version|EN Unit·Version|영한 검토 패키지 만들기|동일 묶음 MD|<details|💬|ring-sky-500/);
  for (const text of ['국문 합성 문장', 'English synthetic sentence', '번역 기준 영문 (고정)', '조회 시점의 최신 EN Reader', '국문 읽기로 돌아가기']) assert.ok(quiet.includes(text));
  assert.match(quiet, /id="paragraph-p-pair"/);
  assert.match(quiet, /data-alignment-id="alignment"/);
  assert.match(quiet, /class="katex"/);
  assert.equal(JSON.stringify(props), before);
});

test('bilingual edit mode remains the backward-compatible default', () => {
  const edit = renderBilingual({});
  for (const text of ['검토 · 수정', 'KO Unit·Version', 'EN Unit·Version', '영한 검토 패키지 만들기', '💬']) assert.ok(edit.includes(text));
  assert.match(edit, /data-reading-only="false"/);
  assert.match(edit, /한국어 검토 및 수정/);
});

test('bilingual quiet callbacks and stale packet results cannot re-enable edit or download', async () => {
  const scope = { readingOnlyRef: { current: true } };
  await executable(bilingualAst, 'capturePacket', scope)();
  executable(bilingualAst, 'download', scope)('md');
  executable(bilingualAst, 'choose', scope)();
  assert.match(bilingualSource, /!readingOnlyRef\.current && sequence === captureSequence\.current/);
  assert.match(bilingualSource, /const isSelected = !readingOnly && selectedId === row\.ko_unit_id/);
  assert.equal([...bilingualSource.matchAll(/onClick=\{readingOnly \? undefined : choose\}/g)].length, 2);
  assert.match(bilingualSource, /if \(!readingOnly\) return;[\s\S]*?captureSequence\.current \+= 1;[\s\S]*?setSelectedId\(null\);[\s\S]*?setPacket\(null\)/);
});

for (const state of [{ loading: true, error: '' }, { loading: false, error: 'Synthetic unavailable comparison' }]) {
  test(`bilingual quiet ${state.loading ? 'loading' : 'failure'} exposes status/retry without stale bodies`, () => {
    const html = renderBilingual({ ...state, readingOnly: true });
    assert.doesNotMatch(html, /국문 합성 문장|English synthetic sentence/);
    assert.match(html, state.loading ? /role="status"/ : /role="alert"/);
    if (state.error) assert.match(html, /다시 확인/);
  });
}
