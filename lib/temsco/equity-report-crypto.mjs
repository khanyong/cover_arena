import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const algorithm = 'aes-256-gcm';
const associatedData = Buffer.from('TEMSCO_PRIVATE_EQUITY_REPORT_V1', 'utf8');
const exactSourcePaths = new Set([
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
]);

export function isAllowedReportSourcePath(value) {
  return typeof value === 'string'
    && (exactSourcePaths.has(value) || /^components\/TemscoEquity\/[A-Za-z0-9_-]+(?:\.module)?\.(?:ts|tsx|css)$/.test(value));
}

function decodeBase64(value, length) {
  if (typeof value !== 'string' || !value || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) throw new Error('Invalid encrypted report encoding');
  const bytes = Buffer.from(value, 'base64');
  if (bytes.toString('base64') !== value || (length !== undefined && bytes.length !== length)) throw new Error('Invalid encrypted report encoding');
  return bytes;
}

function reportKey(value = process.env.TEMSCO_EQUITY_REPORT_KEY) {
  if (typeof value !== 'string') throw new Error('TEMSCO_EQUITY_REPORT_KEY is required');
  try { return decodeBase64(value, 32); }
  catch { throw new Error('TEMSCO_EQUITY_REPORT_KEY must encode exactly 32 random bytes'); }
}

export function validateSourceBackup(value) {
  if (!value || value.schemaVersion !== 1 || !Array.isArray(value.files) || !value.files.length) throw new Error('Invalid private source backup');
  const seen = new Set();
  for (const file of value.files) {
    if (!file || !isAllowedReportSourcePath(file.path) || seen.has(file.path) || typeof file.content !== 'string'
      || typeof file.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(file.sha256)
      || createHash('sha256').update(file.content).digest('hex') !== file.sha256) throw new Error('Invalid private source backup entry');
    seen.add(file.path);
  }
  return value;
}

export function validateReportArtifact(value) {
  if (!value || value.schemaVersion !== 1 || typeof value.javascript !== 'string' || !value.javascript.trim()
    || typeof value.css !== 'string' || !value.css.trim() || typeof value.sourceHash !== 'string'
    || !/^[a-f0-9]{64}$/.test(value.sourceHash)) throw new Error('Invalid private report payload');
  validateSourceBackup(value.sourceBackup);
  return value;
}

export function encryptEquityReport(payload, keyValue = process.env.TEMSCO_EQUITY_REPORT_KEY) {
  validateReportArtifact(payload);
  const key = reportKey(keyValue);
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, key, iv);
  cipher.setAAD(associatedData);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  return { schemaVersion: 1, algorithm, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), ciphertext: ciphertext.toString('base64') };
}

export function decryptEquityReport(envelope, keyValue = process.env.TEMSCO_EQUITY_REPORT_KEY) {
  if (!envelope || envelope.schemaVersion !== 1 || envelope.algorithm !== algorithm) throw new Error('Invalid encrypted report envelope');
  const key = reportKey(keyValue);
  const decipher = createDecipheriv(algorithm, key, decodeBase64(envelope.iv, 12));
  decipher.setAAD(associatedData);
  decipher.setAuthTag(decodeBase64(envelope.tag, 16));
  let plaintext;
  try { plaintext = Buffer.concat([decipher.update(decodeBase64(envelope.ciphertext)), decipher.final()]); }
  catch { throw new Error('Encrypted report authentication failed'); }
  try { return validateReportArtifact(JSON.parse(plaintext.toString('utf8'))); }
  finally { plaintext.fill(0); }
}
