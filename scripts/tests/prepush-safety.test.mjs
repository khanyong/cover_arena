import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import test from 'node:test';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

// Inspect only pure initializers, without importing a page or its DB client.
function initializer(file, name) {
  const source = read(file);
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const declaration = statement.declarationList.declarations.find((d) => d.name.getText(ast) === name);
    if (declaration?.initializer) {
      return ts.transpileModule(`(${declaration.initializer.getText(ast)})`, {
        compilerOptions: { target: ts.ScriptTarget.ES2022 },
      }).outputText;
    }
  }
  throw new Error(`Missing ${name} in ${file}`);
}

test('matrix server gate denies direct and client data requests without querying DB', async () => {
  const gate = vm.runInNewContext(initializer('pages/editor/matrix.tsx', 'getServerSideProps'), {});
  for (const query of [{}, { enabled: 'true', preview: 'true', scene: 'act-2/ch-2/sc-1' }]) {
    assert.equal(JSON.stringify(await gate({ query })), '{"notFound":true}');
  }
});

const snippets = [
  'n8n-code-final-with-history.js',
  'n8n-code-node-final-processing-fixed.js',
  'n8n-code-node-final-processing.js',
  'n8n-code-with-direct-insert.js',
];

for (const name of snippets) {
  test(`${name}: syntax and fail-closed credential setup (no workflow execution)`, () => {
    const source = read(`scripts/n8n/${name}`);
    // Compile, but never execute the full workflow: it contains remote mutations.
    new vm.Script(`(async function () {\n${source}\n})`);
    assert.equal(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(source), false);
    const prefix = source.slice(source.indexOf('try {') + 5, source.indexOf('  function safeParseInt'));
    const getKey = `${prefix}\nSUPABASE_SERVICE_ROLE_KEY;`;
    for (const context of [{}, { $env: {} }, { $env: { SUPABASE_SERVICE_ROLE_KEY: ' ' } }]) {
      assert.throws(() => vm.runInNewContext(getKey, context), /not configured/);
    }
    const denied = new Proxy({}, { get() { throw new Error('environment access denied'); } });
    assert.throws(() => vm.runInNewContext(getKey, { $env: denied }), /access denied/);
    assert.equal(vm.runInNewContext(getKey, { $env: { SUPABASE_SERVICE_ROLE_KEY: 'test-only-placeholder' } }), 'test-only-placeholder');
  });
}

for (const name of ['youtube-search-diversified.js', 'youtube-search-integration-improved.js', 'youtube-search-with-pagination.js']) {
  test(`${name}: YouTube credential setup fails closed without executing the workflow`, () => {
    const source = read(`scripts/n8n/${name}`);
    new vm.Script(`(async function () {\n${source}\n})`);
    assert.equal(/AIza[0-9A-Za-z_-]{35}/.test(source), false);
    const setup = source.slice(0, source.indexOf('try {'));
    const guard = source.slice(source.indexOf('try {') + 5, source.indexOf('  console.log'));
    for (const context of [{}, { $env: {} }, { $env: { YOUTUBE_API_KEY: ' ' } }]) {
      assert.throws(() => vm.runInNewContext(setup + guard, context), /not configured/);
    }
    const denied = new Proxy({}, { get() { throw new Error('environment access denied'); } });
    assert.throws(() => vm.runInNewContext(setup + guard, { $env: denied }), /access denied/);
    assert.equal(vm.runInNewContext(setup + guard + '\nYOUTUBE_API_KEYS.KEY_1;', { $env: { YOUTUBE_API_KEY: 'test-only-placeholder' } }), 'test-only-placeholder');
  });
}

test('display-only paragraph repair preserves LaTeX and single escaped newline', () => {
  const normalize = vm.runInNewContext(initializer('components/NovelPlatform/NovelFullReader.tsx', 'normalizeEscapedParagraphBreaks'), {});
  assert.equal(normalize(String.raw`First.\n\nSecond.`), 'First.\n\nSecond.');
  assert.equal(normalize(String.raw`First.\r\n\r\nSecond.`), 'First.\n\nSecond.');
  assert.equal(normalize(String.raw`\nabla \nu \neq \frac{1}{r^2+\epsilon^2}`), String.raw`\nabla \nu \neq \frac{1}{r^2+\epsilon^2}`);
  assert.equal(normalize(String.raw`literal\ntext`), String.raw`literal\ntext`);
  assert.equal(normalize('First.\n\nSecond.'), 'First.\n\nSecond.');
});

test('approved Scene and preserved DB readbacks remain byte-identical', () => {
  const folder = 'reports/scene-publication/PRO-CH1-SC1-RESTART-D1';
  for (const name of ['approved.md', 'db-working-readback.md', 'db-reader-readback.md']) {
    const bytes = fs.readFileSync(path.join(root, folder, name));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), '6d237aef954677bb7a942ee87f64c45f143f8fe0e58f8f1da86c88e641baa47a');
  }
});
