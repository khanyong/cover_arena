// Exercises the real handler with isolated process/filesystem mocks. Never generates a PDF.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import ts from 'typescript';

const source = await readFile(new URL('../../pages/api/generate-pdf.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
});

function isolatedHandler({ processError = null, pdfExists = true } = {}) {
  const calls = []; const fileReads = []; const logs = [];
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    require(name) {
      if (name === 'child_process') return {
        execFile(file, args, options, callback) {
          calls.push({ file, args: Array.from(args), options: { ...options } });
          callback(processError, 'PRIVATE_STDOUT', 'PRIVATE_STDERR');
        },
        exec() { throw new Error('Shell execution is forbidden'); },
      };
      if (name === 'path') return path;
      if (name === 'fs') return { existsSync(file) { fileReads.push(file); return pdfExists; } };
      throw new Error(`Unexpected handler dependency: ${name}`);
    },
    process: { cwd: () => '/isolated-pdf-test' },
    console: { log: (...args) => logs.push(args), error: (...args) => logs.push(args) },
  }, { filename: 'generate-pdf.test.cjs' });
  const invoke = async (body, method = 'POST') => {
    const result = { status: 200, body: null, headers: {} };
    const res = {
      setHeader(name, value) { result.headers[name] = value; return res; },
      status(code) { result.status = code; return res; },
      json(value) { result.body = JSON.parse(JSON.stringify(value)); return res; },
    };
    await exports.default({ method, body }, res);
    assert.equal(result.headers['Cache-Control'], 'private, no-store, max-age=0');
    assert.equal(result.headers['CDN-Cache-Control'], 'no-store');
    assert.equal(result.headers['Vercel-CDN-Cache-Control'], 'no-store');
    return result;
  };
  return { invoke, calls, fileReads, logs };
}

test('exact KO root and Act2 slugs return 403 without process execution or public file lookup', async () => {
  for (const slug of [
    'quantum-vibration-novel', 'quantum-vibration-novel-act-2',
  ]) {
    const scope = isolatedHandler(); const result = await scope.invoke({ slug });
    assert.equal(result.status, 403, slug);
    assert.equal(result.body.url, undefined);
    assert.deepEqual(scope.calls, []);
    assert.deepEqual(scope.fileReads, []);
    assert.deepEqual(scope.logs, []);
  }
});

test('unsafe and malformed slug values are rejected before process execution', async () => {
  for (const slug of [
    null, 2, [], {}, '', '-slug', 'a--b', 'a-', 'a'.repeat(161),
    'quantum-vibration-novel;pwd', '$(pwd)', '`pwd`', '../novel',
    'novel/act-2', 'novel%2Fact-2', 'novel_act_2', 'novel%25',
    'Novel', 'novel slug', 'novel\n', 'novel\r', 'novel\u0000',
  ]) {
    const scope = isolatedHandler(); const result = await scope.invoke({ slug });
    assert.equal(result.status, 400, JSON.stringify(slug));
    assert.deepEqual(scope.calls, []);
    assert.deepEqual(scope.fileReads, []);
  }
  for (const body of [null, [], 'quantum-vibration-novel', 2]) {
    const scope = isolatedHandler(); const result = await scope.invoke(body);
    assert.equal(result.status, 400);
    assert.deepEqual(scope.calls, []);
  }
});

test('existing EN, other KO Acts and unrelated valid slugs retain safe argument-array execution', async () => {
  for (const slug of [
    undefined, 'quantum-vibration-novel-en', 'quantum-vibration-novel-en-act-2',
    'quantum-vibration-novel-act-1', 'quantum-vibration-novel-act-3', 'another-novel',
  ]) {
    const scope = isolatedHandler(); const result = await scope.invoke(slug === undefined ? {} : { slug });
    assert.equal(result.status, 200);
    assert.deepEqual(result.body, { success: true, url: '/The_Resonance_of_Space_Latest.pdf' });
    assert.deepEqual(scope.calls, [{
      file: 'npx', args: ['tsx', 'scripts/build_db_pdf.ts', slug ?? 'quantum-vibration-novel-en'],
      options: { shell: false },
    }]);
    assert.deepEqual(scope.fileReads, ['/isolated-pdf-test/public/The_Resonance_of_Space_Latest.pdf']);
    assert.deepEqual(scope.logs, []);
  }
});

test('process errors and missing output fail without returning stale paths, logs or error details', async () => {
  for (const options of [{ processError: new Error('PRIVATE_MANUSCRIPT TOKEN=PRIVATE_TOKEN') }, { pdfExists: false }]) {
    const scope = isolatedHandler(options); const result = await scope.invoke({ slug: 'quantum-vibration-novel-en' });
    assert.equal(result.status, 500);
    assert.deepEqual(result.body, { error: 'Failed to generate PDF' });
    assert.deepEqual(scope.logs, []);
    assert.doesNotMatch(JSON.stringify(result), /PRIVATE_|details|\.pdf/);
    if (options.processError) assert.deepEqual(scope.fileReads, []);
  }
});

test('unsupported methods fail before process execution with uncached responses', async () => {
  const scope = isolatedHandler(); const result = await scope.invoke({}, 'GET');
  assert.equal(result.status, 405);
  assert.deepEqual(scope.calls, []);
  assert.deepEqual(scope.fileReads, []);
});
