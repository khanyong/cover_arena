import assert from 'node:assert/strict';
import { createCipheriv, createHash } from 'node:crypto';
import test from 'node:test';
import {
  decryptEquityReport,
  encryptEquityReport,
  isAllowedReportSourcePath,
  validateReportArtifact,
  validateSourceBackup,
} from '../../lib/temsco/equity-report-crypto.mjs';

// Fixtures are synthetic. Always pass an explicit test key so these tests never
// read deployment credentials or depend on a developer's environment.
const key = Buffer.alloc(32, 0x42).toString('base64');
const otherKey = Buffer.alloc(32, 0x24).toString('base64');
const sha256 = content => createHash('sha256').update(content).digest('hex');
const sourceFile = (path = 'components/TemscoEquity/equityModel.ts', content = 'export const fixture = "synthetic-source";') => ({ path, content, sha256: sha256(content) });
const backup = () => ({ schemaVersion: 1, files: [sourceFile()] });
const artifact = () => ({
  schemaVersion: 1,
  javascript: 'window.syntheticReport = "fixture-only-report";',
  css: '.synthetic-report { color: black; }',
  sourceHash: sha256('synthetic source bundle'),
  sourceBackup: backup(),
});

function flipBase64(value) {
  const bytes = Buffer.from(value, 'base64');
  bytes[0] ^= 1;
  return bytes.toString('base64');
}

// An independent sealer exercises validation after successful authentication,
// which cannot be reached by asking the production encryptor to accept bad data.
function sealText(text) {
  const iv = Buffer.alloc(12, 0x18);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(key, 'base64'), iv);
  cipher.setAAD(Buffer.from('TEMSCO_PRIVATE_EQUITY_REPORT_V1', 'utf8'));
  const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return { schemaVersion: 1, algorithm: 'aes-256-gcm', iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), ciphertext: ciphertext.toString('base64') };
}

test('encryption round-trips the full report and source backup using the declared envelope format', () => {
  const payload = artifact();
  const envelope = encryptEquityReport(payload, key);
  assert.deepEqual(Object.keys(envelope).sort(), ['algorithm', 'ciphertext', 'iv', 'schemaVersion', 'tag']);
  assert.equal(envelope.schemaVersion, 1);
  assert.equal(envelope.algorithm, 'aes-256-gcm');
  assert.equal(Buffer.from(envelope.iv, 'base64').length, 12);
  assert.equal(Buffer.from(envelope.tag, 'base64').length, 16);
  assert.ok(Buffer.from(envelope.ciphertext, 'base64').length > 0);
  for (const field of ['iv', 'tag', 'ciphertext']) {
    assert.equal(Buffer.from(envelope[field], 'base64').toString('base64'), envelope[field]);
  }
  assert.doesNotMatch(JSON.stringify(envelope), /fixture-only-report|synthetic-source|equityModel/);
  assert.deepEqual(decryptEquityReport(JSON.parse(JSON.stringify(envelope)), key), payload);
});

test('repeated encryption uses fresh IVs and different ciphertexts', () => {
  const payload = artifact();
  const envelopes = Array.from({ length: 8 }, () => encryptEquityReport(payload, key));
  assert.equal(new Set(envelopes.map(value => value.iv)).size, envelopes.length);
  assert.equal(new Set(envelopes.map(value => value.ciphertext)).size, envelopes.length);
  for (const envelope of envelopes) assert.deepEqual(decryptEquityReport(envelope, key), payload);
});

test('a different key cannot decrypt the report', () => {
  assert.throws(() => decryptEquityReport(encryptEquityReport(artifact(), key), otherKey));
});

test('missing, malformed, noncanonical and incorrectly sized keys fail closed', () => {
  const envelope = encryptEquityReport(artifact(), key);
  const invalidKeys = [null, '', ' ', 42, {}, Buffer.alloc(32), 'not a base64 key', Buffer.alloc(31).toString('base64'), Buffer.alloc(33).toString('base64'), key.slice(0, -1), `${key}\n`, `${key}=`];
  for (const value of invalidKeys) {
    assert.throws(() => encryptEquityReport(artifact(), value));
    assert.throws(() => decryptEquityReport(envelope, value));
  }
});

for (const field of ['iv', 'tag', 'ciphertext']) {
  test(`changing a valid-length ${field} is rejected by authenticated decryption`, () => {
    const envelope = encryptEquityReport(artifact(), key);
    assert.throws(() => decryptEquityReport({ ...envelope, [field]: flipBase64(envelope[field]) }, key));
  });
}

test('malformed envelopes, unsupported versions and algorithms are rejected', () => {
  const envelope = encryptEquityReport(artifact(), key);
  for (const value of [null, [], {}, { ...envelope, schemaVersion: 2 }, { ...envelope, schemaVersion: '1' }, { ...envelope, algorithm: 'aes-256-cbc' }, { ...envelope, algorithm: 'AES-256-GCM' }]) {
    assert.throws(() => decryptEquityReport(value, key));
  }
  for (const field of ['iv', 'tag', 'ciphertext']) {
    const missing = { ...envelope };
    delete missing[field];
    assert.throws(() => decryptEquityReport(missing, key));
    for (const value of ['', null, 42, '%%%invalid%%%', `${envelope[field]}\n`]) {
      assert.throws(() => decryptEquityReport({ ...envelope, [field]: value }, key));
    }
  }
  for (const [field, length] of [['iv', 11], ['iv', 13], ['tag', 15], ['tag', 17]]) {
    assert.throws(() => decryptEquityReport({ ...envelope, [field]: Buffer.alloc(length).toString('base64') }, key));
  }
});

test('authenticated ciphertext still must contain valid JSON and a valid report', () => {
  assert.deepEqual(decryptEquityReport(sealText(JSON.stringify(artifact())), key), artifact());
  for (const plaintext of ['invalid JSON', 'null', '[]', '{}', JSON.stringify({ ...artifact(), sourceBackup: undefined }), JSON.stringify({ ...artifact(), javascript: '' })]) {
    assert.throws(() => decryptEquityReport(sealText(plaintext), key));
  }
});

test('report validation preserves valid data and rejects malformed contract fields', () => {
  const payload = artifact();
  assert.equal(validateReportArtifact(payload), payload);
  for (const value of [null, [], {}, { ...payload, schemaVersion: 2 }, { ...payload, schemaVersion: '1' }, { ...payload, javascript: '' }, { ...payload, javascript: {} }, { ...payload, css: '' }, { ...payload, css: [] }, { ...payload, sourceHash: 'a'.repeat(63) }, { ...payload, sourceHash: 'g'.repeat(64) }, { ...payload, sourceBackup: undefined }]) {
    assert.throws(() => validateReportArtifact(value));
    assert.throws(() => encryptEquityReport(value, key));
  }
});

test('source restore accepts only the supported report source locations', () => {
  const allowed = [
    'components/TemscoEquity/equityModel.ts',
    'components/TemscoEquity/EquityDeck.tsx',
    'components/TemscoEquity/EquityDeck.module.css',
    'components/TemscoEquityPrivate/entry.tsx',
    'components/TemscoEquityPrivate/Head.tsx',
    'components/TemscoEquityPrivate/Link.tsx',
    'components/TemscoV5/ValuationSlideFrame.tsx',
    'components/TemscoV5/CorporateSlideFrame.module.css',
    'components/TemscoV5/AccountingValuationSlides.module.css',
    'scripts/temsco/test-equity-model.mjs',
    'scripts/temsco/test-equity-legal-model.mjs',
    'scripts/temsco/test-equity-dividend-model.mjs',
    'scripts/temsco/test-equity-reassessment-model.mjs',
    'scripts/temsco/fixtures/equity-workbook-calculations.json',
  ];
  for (const path of allowed) assert.equal(isAllowedReportSourcePath(path), true, path);
  const sources = { schemaVersion: 1, files: allowed.map(path => sourceFile(path)) };
  assert.equal(validateSourceBackup(sources), sources);
});

test('source restore rejects traversal, absolute paths, nested paths and unapproved writes', () => {
  const forbidden = [
    '../components/TemscoEquity/equityModel.ts',
    '/components/TemscoEquity/equityModel.ts',
    'C:\\components\\TemscoEquity\\equityModel.ts',
    'components\\TemscoEquity\\equityModel.ts',
    'components/TemscoEquity/../auth.ts',
    'components/TemscoEquity/../../pages/auth.js',
    'components/TemscoEquity/nested/equityModel.ts',
    'components/TemscoEquity//equityModel.ts',
    './components/TemscoEquity/equityModel.ts',
    'components/TemscoEquity/.hidden.ts',
    'components/TemscoEquity/equityModel.ts\0',
    'components/TemscoEquity/equityModel.ts\n',
    'components/TemscoEquity/equityModel.js',
    'components/TemscoEquityPrivate/other.tsx',
    'components/TemscoV5/OtherSlide.tsx',
    'scripts/temsco/test-equity-security.mjs',
    'scripts/temsco/fixtures/other.json',
    'pages/api/temsco/equity-report.ts',
    'package.json',
    '.env.local',
    '',
  ];
  for (const path of forbidden) {
    assert.equal(isAllowedReportSourcePath(path), false, path);
    assert.throws(() => validateSourceBackup({ schemaVersion: 1, files: [sourceFile(path)] }), path);
  }
  for (const path of [null, undefined, 42, {}]) assert.equal(isAllowedReportSourcePath(path), false);
});

test('source backup rejects empty, duplicated, malformed or hash-mismatched files', () => {
  const file = sourceFile();
  for (const value of [
    null, [], {}, { schemaVersion: 2, files: [file] }, { schemaVersion: 1, files: [] }, { schemaVersion: 1, files: {} },
    { schemaVersion: 1, files: [file, { ...file }] },
    ...[null, {}, { ...file, content: null }, { ...file, content: {} }, { ...file, content: `${file.content} changed` }, { ...file, sha256: 'a'.repeat(64) }, { ...file, sha256: 'g'.repeat(64) }, { ...file, sha256: undefined }].map(invalidFile => ({ schemaVersion: 1, files: [invalidFile] })),
  ]) assert.throws(() => validateSourceBackup(value));
});
