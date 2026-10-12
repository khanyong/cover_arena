import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Synthetic SSR and source-contract tests only. No browser session, DB, original
// manuscript, environment file, or output file is read or written by this test.
const require = createRequire(import.meta.url);
const readerPath = fileURLToPath(new URL('../../components/NovelPlatform/NovelFullReader.tsx', import.meta.url));
const parallelPath = fileURLToPath(new URL('../../components/NovelPlatform/NovelParallelReader.tsx', import.meta.url));
const pagePath = fileURLToPath(new URL('../../pages/novel/[...slug].tsx', import.meta.url));
const readerSource = await readFile(readerPath, 'utf8');
const pageSource = await readFile(pagePath, 'utf8');
const parse = (path, source) => ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const readerAst = parse(readerPath, readerSource);
const pageAst = parse(pagePath, pageSource);

function nodes(root, predicate) {
  const matches = [];
  function visit(node) {
    if (predicate(node)) matches.push(node);
    ts.forEachChild(node, visit);
  }
  visit(root);
  return matches;
}

function initializer(root, name) {
  const matches = nodes(root, node => ts.isVariableDeclaration(node) && node.name.getText(root) === name);
  assert.equal(matches.length, 1, `Expected one ${name} declaration`);
  return matches[0].initializer;
}

const identifiers = node => new Set(nodes(node, ts.isIdentifier).map(item => item.text));
const calls = (node, name) => nodes(node, item => ts.isCallExpression(item) && item.expression.getText(readerAst) === name);

const bundle = await build({
  stdin: { contents: `export { NovelFullReader } from ${JSON.stringify(readerPath)}; export { NovelParallelReader } from ${JSON.stringify(parallelPath)};`, resolveDir: fileURLToPath(new URL('../../', import.meta.url)), loader: 'js' },
  bundle: true, write: false, platform: 'node', format: 'cjs',
  external: ['react', 'react-dom', 'react-dom/*'], logLevel: 'silent',
  plugins: [{
    name: 'no-reader-network',
    setup(builder) {
      builder.onResolve({ filter: /\.module\.css$/ }, args => ({ path: args.path, namespace: 'reader-test-css' }));
      builder.onLoad({ filter: /.*/, namespace: 'reader-test-css' }, () => ({
        contents: 'export default { readerRoot: "readerRoot", readingSheet: "readingSheet", readingColumn: "readingColumn" };',
        loader: 'js',
      }));
      builder.onResolve({ filter: /(?:^|\/)supabase(?:\.js)?$/ }, () => ({ path: 'no-reader-network', namespace: 'test' }));
      builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({
        contents: `
          const forbidden = () => { throw new Error('SSR test attempted a network or auth operation'); };
          export const supabase = { rpc: forbidden, from: forbidden, auth: new Proxy({}, { get: () => forbidden }) };
          export const novels = new Proxy({}, { get: () => forbidden });
        `,
        loader: 'js',
      }));
    },
  }],
});
assert.equal(bundle.errors.length, 0);
assert.equal(bundle.warnings.length, 0);
const module = { exports: {} };
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(require, module, module.exports);
const { NovelFullReader, NovelParallelReader } = module.exports;
const uuid = n => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const freeze = value => {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
};

function scene(id, number, extra = {}) {
  return {
    id, number, title: `Synthetic scene ${number}`,
    paragraphs: [{
      id: `${id}-paragraph`, activeVersion: 'current',
      versions: {
        current: { version: 'current', content: `Current synthetic text ${id}.`, createdAt: '2026-01-01T00:00:00Z' },
        earlier: { version: 'earlier', content: `Selected earlier text ${id}.`, createdAt: '2025-01-01T00:00:00Z' },
      },
    }],
    ...extra,
  };
}

function novel(slug) {
  return {
    id: slug, slug, title: 'Synthetic novel', subtitle: '', author: 'Test author', updatedAt: '2026-01-01',
    acts: [{ number: 3, title: 'Synthetic act', chapters: [{ number: 4, title: 'Synthetic chapter', scenes: [
      scene('synthetic-legacy', 1),
      scene('synthetic-history', 2, { managedSceneId: uuid(1), compositionRevisionId: uuid(2), storageModel: 'ros-ko-block-v1', managedReadOnly: true, managedViewKey: 'legacy' }),
      scene('synthetic-unmapped', 3),
      scene('synthetic-future', 4),
    ] }] }],
    characters: [], locations: [], world: [], versionHistory: [],
  };
}

function render(value, customVersionMap = {}) {
  return renderToStaticMarkup(React.createElement(NovelFullReader, {
    novel: value, customVersionMap,
    onAddNewVersion: () => { throw new Error('Unexpected body write'); },
    onParagraphVersionChange: () => { throw new Error('Unexpected selection mutation'); },
  }));
}

for (const slug of ['quantum-vibration-novel', 'quantum-vibration-novel-en']) {
  test(`${slug}: every legacy, historical, unmapped and future Scene has a comparison entry`, () => {
    const value = freeze(novel(slug));
    const before = JSON.stringify(value);
    const html = render(value);
    const buttons = [...html.matchAll(/<button\b([^>]*)>영한 비교<\/button>/g)];
    assert.equal(buttons.length, 4, 'Entry must not depend on the old three-scene allowlist or managed storage');
    for (const [, attributes] of buttons) {
      assert.match(attributes, /type="button"/);
      assert.match(attributes, /aria-pressed="false"/);
      assert.doesNotMatch(attributes, /\bdisabled(?:=|\s|$)/);
    }
    const scenes = value.acts[0].chapters[0].scenes;
    for (let index = 0; index < scenes.length; index += 1) {
      const start = html.indexOf(`id="scene-${scenes[index].id}"`);
      const end = index + 1 < scenes.length ? html.indexOf(`id="scene-${scenes[index + 1].id}"`) : html.length;
      assert.ok(start >= 0 && end > start);
      assert.match(html.slice(start, end), />영한 비교<\/button>/);
    }
    assert.equal(JSON.stringify(value), before, 'Rendering cannot mutate a frozen manuscript');
  });
}

test('comparison entries preserve the currently selected legacy Version', () => {
  const value = freeze(novel('quantum-vibration-novel'));
  const html = render(value, freeze({ 'synthetic-legacy-paragraph': 'earlier' }));
  assert.match(html, /Selected earlier text synthetic-legacy\./);
  assert.doesNotMatch(html, /Current synthetic text synthetic-legacy\./);
  assert.equal([...html.matchAll(/>영한 비교<\/button>/g)].length, 4);
});

test('an unrelated novel does not fabricate a bilingual counterpart entry', () => {
  assert.doesNotMatch(render(freeze(novel('synthetic-unrelated-novel'))), />영한 비교<\/button>/);
});

test('parallel comparison renders independent language regions and both reading-unit options', () => {
  const comparison = freeze({
    format: 'novel-parallel-reading-v1', sceneId: 'synthetic-legacy', currentLanguage: 'en',
    scope: { actNumber: 3, chapterNumber: 4, sceneNumber: 1 },
    ko: { title: '합성 국문 제목', body: '합성 첫 문단.\n\n합성 둘째 문단.', paragraphs: [], terminalLf: 0 },
    en: { title: 'Synthetic English title', body: 'One synthetic paragraph.', paragraphs: [], terminalLf: 0 },
  });
  const html = renderToStaticMarkup(React.createElement(NovelParallelReader, {
    scene: scene('synthetic-legacy', 1), comparison, loading: false, error: '', fontSizeClass: 'text-base',
    onRetry() {}, onClose() {},
  }));
  assert.match(html, /aria-label="한국어 독립 읽기 칸"/);
  assert.match(html, /aria-label="영어 독립 읽기 칸"/);
  assert.match(html, /aria-label="한국어 단락 본문 · 독립 스크롤"/);
  assert.match(html, /aria-label="영어 단락 본문 · 독립 스크롤"/);
  assert.match(html, /<option value="paragraph" selected="">단락<\/option>/);
  assert.match(html, /<option value="sentence">문장<\/option>/);
  assert.equal([...html.matchAll(/data-parallel-language="ko"/g)].length, 2);
  assert.equal([...html.matchAll(/data-parallel-language="en"/g)].length, 1);
  assert.match(html, /검증된 1:1 번역 대응표가 아니며/);
  assert.match(html, /모두 읽기 전용/);
  assert.match(html, /현재 선택 판본/);
  assert.match(html, /조회 시점 Reader 판본/);
});

for (const state of [{ loading: true, error: '' }, { loading: false, error: 'Synthetic unavailable counterpart' }]) {
  test(`parallel ${state.loading ? 'loading' : 'failure'} state never renders captured manuscript columns`, () => {
    const html = renderToStaticMarkup(React.createElement(NovelParallelReader, {
      scene: scene('synthetic-legacy', 1), comparison: null, ...state, fontSizeClass: 'text-base',
      onRetry() {}, onClose() {},
    }));
    assert.doesNotMatch(html, /data-parallel-language=/);
    assert.match(html, state.loading ? /role="status"/ : /role="alert"/);
    if (state.error) assert.match(html, /없는 번역이나 대응 관계를 제목·배열 순서로 추정하지 않습니다/);
  });
}

test('page navigation uses loaded Scene membership, with a visible first-Scene fallback', () => {
  const target = initializer(pageAst, 'comparisonTargetId');
  assert.equal(ts.isConditionalExpression(target), true);
  assert.match(target.condition.getText(pageAst), /readerSceneIds\.includes\(activeSceneId\)/);
  assert.equal(target.whenTrue.getText(pageAst), 'activeSceneId');
  assert.equal(target.whenFalse.getText(pageAst), 'readerSceneIds[0]');
  const requestProp = nodes(pageAst, node => ts.isJsxAttribute(node) && node.name.getText(pageAst) === 'requestedComparisonSceneId');
  assert.equal(requestProp.length, 1);
  const requestIds = identifiers(requestProp[0]);
  assert.ok(requestIds.has('readerSceneIds'));
  assert.ok(requestIds.has('includes'));
  assert.equal(requestIds.has('supportsTranslationComparisonSceneId'), false);
  assert.equal(nodes(pageAst, node => ts.isIdentifier(node) && node.text === 'supportsTranslationComparisonSceneId').length, 0);
});

test('top comparison link keeps the current language route and can reopen the reader', () => {
  const hrefs = nodes(pageAst, node => ts.isJsxAttribute(node) && node.name.getText(pageAst) === 'href'
    && node.getText(pageAst).includes('?compare='));
  assert.equal(hrefs.length, 1);
  const href = hrefs[0].getText(pageAst);
  assert.match(href, /lang\s*===\s*'en'\s*\?\s*'\/en'\s*:\s*''/);
  assert.match(href, /encodeURIComponent\(comparisonTargetId\)/);
  const link = hrefs[0].parent.parent;
  assert.ok(identifiers(link).has('setComparisonRequestKey'));
  assert.ok(identifiers(link).has('setMainTab'));
  assert.ok(identifiers(link).has('setActiveTab'));
});

test('parallel read invalidation includes actor, document, Scene, composition and selected bytes', () => {
  const selection = identifiers(initializer(readerAst, 'parallelSelection'));
  for (const name of ['parallelScene', 'customVersionMap', 'id', 'activeVersion', 'versions', 'content', 'separatorAfter']) {
    assert.ok(selection.has(name), `Missing selection fingerprint input: ${name}`);
  }
  const scope = identifiers(initializer(readerAst, 'parallelScope'));
  for (const name of ['commentActorId', 'novel', 'slug', 'parallelScene', 'id', 'compositionRevisionId', 'title', 'terminalLf', 'parallelLocation', 'parallelSelection']) {
    assert.ok(scope.has(name), `Missing read scope input: ${name}`);
  }
  const location = identifiers(initializer(readerAst, 'parallelLocation'));
  for (const name of ['novel', 'acts', 'chapters', 'scenes', 'id', 'number']) {
    assert.ok(location.has(name), `Missing ownership fingerprint input: ${name}`);
  }
  const reads = nodes(readerAst, node => ts.isCallExpression(node) && node.expression.getText(readerAst) === 'novels.getNovelBySlug');
  assert.equal(reads.length, 1);
  let effect = reads[0];
  while (effect && !(ts.isCallExpression(effect) && effect.expression.getText(readerAst) === 'useEffect')) effect = effect.parent;
  assert.ok(effect);
  const guardIds = identifiers(effect);
  for (const name of ['cancelled', 'sequence', 'parallelReadSequence', 'commentActorRef', 'commentActorId', 'activeParallelScope', 'parallelScope']) {
    assert.ok(guardIds.has(name), `Missing stale response guard: ${name}`);
  }
  assert.equal(calls(effect, 'setParallelState').length, 3, 'Both successful and rejected reads must use scoped state');
});

test('Scene selector and previous/next controls are based on the full novel Scene list', () => {
  const navigation = initializer(readerAst, 'navigateBilingualComparison');
  assert.ok(identifiers(navigation).has('allScenes'));
  assert.ok(identifiers(navigation).has('setComparisonSceneId'));
  assert.ok(identifiers(navigation).has('onComparisonSceneChange'));
  const selectors = nodes(readerAst, node => ts.isJsxOpeningElement(node) && node.tagName.getText(readerAst) === 'select'
    && node.getText(readerAst).includes('comparison-navigation-'));
  assert.equal(selectors.length, 1);
  const selectBody = selectors[0].parent;
  for (const name of ['novel', 'acts', 'chapters', 'scenes', 'navigateBilingualComparison']) {
    assert.ok(identifiers(selectBody).has(name), `Missing complete Scene navigation input: ${name}`);
  }
  assert.match(readerSource, />이전 Scene<\/button>/);
  assert.match(readerSource, />다음 Scene<\/button>/);
});

test('a selected non-composition Version uses independent reading, not a false verified pair', () => {
  const predicate = initializer(readerAst, 'isComparableScene').getText(readerAst);
  assert.match(predicate, /supportsSceneTranslationComparison\(scene\)/);
  assert.match(predicate, /scene\.paragraphs\.every/);
  assert.match(predicate, /customVersionMap\[paragraph\.id\] === paragraph\.activeVersion/);
});

test('Scene navigation persists its comparison target in the URL without a page reload', () => {
  const callback = nodes(pageAst, node => ts.isJsxAttribute(node) && node.name.getText(pageAst) === 'onComparisonSceneChange');
  assert.equal(callback.length, 1);
  const text = callback[0].getText(pageAst);
  assert.match(text, /router\.replace/);
  assert.match(text, /compare: sceneId/);
  assert.match(text, /shallow: true/);
  assert.match(text, /scroll: false/);
});

test('the reading-unit preference can survive Scene component remounts', () => {
  const comparison = {
    format: 'novel-parallel-reading-v1', sceneId: 'synthetic-legacy', currentLanguage: 'ko',
    scope: { actNumber: 3, chapterNumber: 4, sceneNumber: 1 },
    ko: { title: '합성', body: '첫 문장. 둘째 문장.', paragraphs: [], terminalLf: 0 },
    en: { title: 'Synthetic', body: 'First sentence. Second sentence.', paragraphs: [], terminalLf: 0 },
  };
  const html = renderToStaticMarkup(React.createElement(NovelParallelReader, {
    scene: scene('synthetic-legacy', 1), comparison, readingUnit: 'sentence', loading: false, error: '', fontSizeClass: 'text-base',
    onRetry() {}, onClose() {},
  }));
  assert.match(html, /<option value="sentence" selected="">문장<\/option>/);
  assert.equal([...html.matchAll(/data-parallel-language="ko"/g)].length, 2);
  assert.equal([...html.matchAll(/data-parallel-language="en"/g)].length, 2);
  const unitProp = nodes(readerAst, node => ts.isJsxAttribute(node) && node.name.getText(readerAst) === 'readingUnit');
  assert.equal(unitProp.length, 1);
  assert.ok(identifiers(unitProp[0]).has('parallelReadingUnit'));
});
