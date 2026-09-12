import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function initializer(file, name) {
  const source = read(file);
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const declaration = statement.declarationList.declarations.find((item) => item.name.getText(ast) === name);
    if (declaration?.initializer) {
      return ts.transpileModule(`(${declaration.initializer.getText(ast)})`, {
        compilerOptions: { target: ts.ScriptTarget.ES2022 },
      }).outputText;
    }
  }
  throw new Error(`Missing ${name} in ${file}`);
}

test('matrix route remains server-gated without evaluating database code', async () => {
  const gate = vm.runInNewContext(initializer('pages/editor/matrix.tsx', 'getServerSideProps'), {});
  for (const query of [{}, { enabled: 'true', preview: 'true', scene: 'act-2/ch-2/sc-1' }]) {
    assert.equal(JSON.stringify(await gate({ query })), '{"notFound":true}');
  }
});

const supabaseSnippets = [
  'n8n-code-final-with-history.js',
  'n8n-code-node-final-processing-fixed.js',
  'n8n-code-node-final-processing.js',
  'n8n-code-with-direct-insert.js',
];

for (const name of supabaseSnippets) {
  test(`${name}: credentials fail closed without workflow execution`, () => {
    const source = read(`scripts/n8n/${name}`);
    new vm.Script(`(async function () {\n${source}\n})`);
    assert.equal(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(source), false);
    const prefix = source.slice(source.indexOf('try {') + 5, source.indexOf('  function safeParseInt'));
    const getKey = `${prefix}\nSUPABASE_SERVICE_ROLE_KEY;`;
    for (const context of [{}, { $env: {} }, { $env: { SUPABASE_SERVICE_ROLE_KEY: ' ' } }]) {
      assert.throws(() => vm.runInNewContext(getKey, context), /not configured/);
    }
    const denied = new Proxy({}, { get() { throw new Error('environment access denied'); } });
    assert.throws(() => vm.runInNewContext(getKey, { $env: denied }), /access denied/);
  });
}

for (const name of ['youtube-search-diversified.js', 'youtube-search-integration-improved.js', 'youtube-search-with-pagination.js']) {
  test(`${name}: YouTube credentials fail closed without workflow execution`, () => {
    const source = read(`scripts/n8n/${name}`);
    new vm.Script(`(async function () {\n${source}\n})`);
    assert.equal(/AIza[0-9A-Za-z_-]{35}/.test(source), false);
    const setup = source.slice(0, source.indexOf('try {'));
    const guard = source.slice(source.indexOf('try {') + 5, source.indexOf('  console.log'));
    for (const context of [{}, { $env: {} }, { $env: { YOUTUBE_API_KEY: ' ' } }]) {
      assert.throws(() => vm.runInNewContext(setup + guard, context), /not configured/);
    }
  });
}

test('display-only paragraph repair preserves LaTeX and ordinary escapes', () => {
  const normalize = vm.runInNewContext(
    initializer('components/NovelPlatform/NovelFullReader.tsx', 'normalizeEscapedParagraphBreaks'),
    {},
  );
  assert.equal(normalize(String.raw`First.\n\nSecond.`), 'First.\n\nSecond.');
  assert.equal(normalize(String.raw`First.\r\n\r\nSecond.`), 'First.\n\nSecond.');
  assert.equal(normalize(String.raw`\nabla \nu \neq \frac{1}{r^2+\epsilon^2}`), String.raw`\nabla \nu \neq \frac{1}{r^2+\epsilon^2}`);
  assert.equal(normalize(String.raw`literal\ntext`), String.raw`literal\ntext`);
});

test('public release excludes raw publication and migration payloads', () => {
  const excluded = [
    'reports/scene-publication',
    'supabase/migrations/20260907163153_remote_schema.sql',
    'supabase/migrations/20260911052131_correct_all_current_snapshots.sql',
  ];
  for (const item of excluded) {
    assert.equal(fs.existsSync(path.join(root, item)), false, `${item} must not be published`);
  }
});
