import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { decryptEquityReport } from '../../lib/temsco/equity-report-crypto.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const args = process.argv.slice(2);
const production = args.includes('--production');
const buildIndex = args.indexOf('--build-dir');
const buildDir = buildIndex < 0 ? path.join(root, '.next') : path.resolve(args[buildIndex + 1]);
const privateArtifact = path.join(root, 'private/temsco/equity-report.enc.json');
const privateSources = [path.join(root, 'components/TemscoEquity/'), path.join(root, 'components/TemscoEquityPrivate/')];
const inspected = new Set();
const sourceExtensions = /\.(?:[cm]?js|jsx|tsx?|json|css)$/;

async function files(directory) {
  const output = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const name = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await files(name));
    else if (entry.isFile()) output.push(name);
  }
  return output;
}

async function resolveLocal(specifier, importer) {
  if (!specifier.startsWith('.')) return null;
  const base = path.resolve(path.dirname(importer), specifier);
  for (const suffix of ['', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.css', '/index.ts', '/index.tsx', '/index.js']) {
    const candidate = base + suffix;
    if (await fs.stat(candidate).then(stat => stat.isFile(), () => false)) return candidate;
  }
  return null;
}

async function inspectPublicGraph(file, trail = []) {
  assert.equal(privateSources.some(prefix => file.startsWith(prefix)), false,
    `Private report source enters a public page import graph: ${[...trail, file].map(value => path.relative(root, value)).join(' -> ')}`);
  assert.notEqual(file, privateArtifact, 'Private report artifact must never be imported by public pages');
  if (inspected.has(file) || !sourceExtensions.test(file)) return;
  inspected.add(file);
  if (/\.(?:css|json)$/.test(file)) return;
  const source = await fs.readFile(file, 'utf8');
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const imports = [];
  function visit(node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      imports.push(node.moduleSpecifier.text);
    }
    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === 'require')) && node.arguments.length === 1 && ts.isStringLiteral(node.arguments[0])) {
      imports.push(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  for (const specifier of imports) {
    if (specifier.startsWith('.')) {
      const unresolved = path.resolve(path.dirname(file), specifier);
      assert.equal(privateSources.some(prefix => unresolved.startsWith(prefix)), false,
        `Public source imports a confidential module: ${path.relative(root, file)}`);
    }
    const local = await resolveLocal(specifier, file);
    if (local) await inspectPublicGraph(local, [...trail, file]);
  }
}

for (const file of await files(path.join(root, 'pages'))) {
  if (!file.startsWith(path.join(root, 'pages/api/')) && /\.[jt]sx?$/.test(file)) await inspectPublicGraph(file);
}

// Derive sensitive samples in memory from the encrypted backup. The public test
// itself must never contain report figures or confidential prose.
let artifact;
const markers = [];
const normalizeEscapes = text => text.replace(/\\u([a-f0-9]{4})/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)));
if (production) {
  await fs.access(path.join(buildDir, 'BUILD_ID'));
  artifact = decryptEquityReport(JSON.parse(await fs.readFile(privateArtifact, 'utf8')));
  const reportSource = artifact.sourceBackup.files.find(file => file.path === 'components/TemscoEquity/reassessmentBrief.ts');
  assert.ok(reportSource, 'Encrypted backup lacks the report source needed for leakage checks');
  const ast = ts.createSourceFile(reportSource.path, reportSource.content, ts.ScriptTarget.Latest, true);
  const bundled = normalizeEscapes(artifact.javascript);
  function collect(node) {
    if (ts.isStringLiteral(node) && node.text.length >= 80 && /[가-힣]/.test(node.text) && !node.text.startsWith('http')) {
      const sample = node.text.slice(0, 80);
      if (bundled.includes(sample)) markers.push(sample);
    }
    ts.forEachChild(node, collect);
  }
  collect(ast);
  assert.ok(markers.length > 0, 'Encrypted report did not yield any verification samples');
  assert.doesNotMatch(artifact.javascript, /sourceMappingURL=/);
  assert.doesNotMatch(artifact.css, /sourceMappingURL=/);
}

async function scanLeaks(directory) {
  let count = 0;
  for (const file of await files(directory)) {
    if (!/\.(?:js|json|map|html|txt|css)$/.test(file)) continue;
    const source = normalizeEscapes(await fs.readFile(file, 'utf8'));
    assert.equal(markers.some(marker => source.includes(marker)), false,
      `Confidential report marker found in public output: ${path.relative(root, file)}`);
    assert.equal(path.basename(file).startsWith('equity-report.'), false,
      `Private report artifact copied into public output: ${path.relative(root, file)}`);
    count++;
  }
  return count;
}

const publicFiles = await scanLeaks(path.join(root, 'public'));
let productionFiles = 0;
if (production) {
  productionFiles = await scanLeaks(path.join(buildDir, 'static'));

  // Serverless output tracing must retain the artifact outside public assets.
  const traceFile = path.join(buildDir, 'server/pages/api/temsco/equity-report.js.nft.json');
  const trace = JSON.parse(await fs.readFile(traceFile, 'utf8'));
  assert.equal(trace.files.some(file => path.resolve(path.dirname(traceFile), file) === privateArtifact), true,
    'The API server output trace is missing its private report artifact');
}

console.log(JSON.stringify({
  status: 'PASS', publicSourceModules: inspected.size, publicFilesScanned: publicFiles,
  productionChecked: production, confidentialSamplesChecked: markers.length, productionStaticFilesScanned: productionFiles,
}, null, 2));
