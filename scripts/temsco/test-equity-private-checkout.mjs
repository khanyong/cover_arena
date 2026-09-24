import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {encryptEquityReport} from '../../lib/temsco/equity-report-crypto.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const key = Buffer.alloc(32, 7).toString('base64');
const sourcePath = 'components/TemscoEquity/SyntheticFixture.ts';
const content = 'export const fixture = true;\n';
const payload = {
  schemaVersion: 1, javascript: 'window.fixture = true;', css: '.fixture{}', sourceHash: 'b'.repeat(64),
  sourceBackup: {schemaVersion: 1, files: [{path: sourcePath, content, sha256: createHash('sha256').update(content).digest('hex')}]},
};

async function checkout() {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'equity-private-test-'));
  for (const relative of ['scripts/temsco/build-private-equity-report.mjs', 'scripts/temsco/restore-private-equity-report.mjs', 'lib/temsco/equity-report-crypto.mjs']) {
    await fs.mkdir(path.dirname(path.join(folder, relative)), {recursive: true});
    await fs.copyFile(path.join(root, relative), path.join(folder, relative));
  }
  await fs.symlink(path.join(root, 'node_modules'), path.join(folder, 'node_modules'), 'dir');
  await fs.mkdir(path.join(folder, 'private/temsco'), {recursive: true});
  await fs.writeFile(path.join(folder, 'private/temsco/equity-report.enc.json'), JSON.stringify(encryptEquityReport(payload, key)));
  return folder;
}

function run(folder, script) {
  return spawnSync(process.execPath, [path.join(folder, 'scripts/temsco', script)], {
    cwd: folder, encoding: 'utf8', env: {PATH: process.env.PATH || '', CI: 'true', TEMSCO_EQUITY_REPORT_KEY: key},
  });
}

test('clean public checkout validates ciphertext without creating plaintext source or artifact', async () => {
  const folder = await checkout();
  try {
    const before = await fs.readFile(path.join(folder, 'private/temsco/equity-report.enc.json'), 'utf8');
    const result = run(folder, 'build-private-equity-report.mjs');
    assert.equal(result.status, 0, result.stderr);
    await assert.rejects(fs.access(path.join(folder, 'components')));
    await assert.rejects(fs.access(path.join(folder, 'private/temsco/equity-report.json')));
    assert.equal(await fs.readFile(path.join(folder, 'private/temsco/equity-report.enc.json'), 'utf8'), before);
  } finally { await fs.rm(folder, {recursive: true, force: true}); }
});

test('restore creates allowed sources, retains identical files and refuses overwrites', async () => {
  const folder = await checkout();
  try {
    const first = run(folder, 'restore-private-equity-report.mjs');
    assert.equal(first.status, 0, first.stderr);
    assert.equal(await fs.readFile(path.join(folder, sourcePath), 'utf8'), content);
    const second = run(folder, 'restore-private-equity-report.mjs');
    assert.equal(second.status, 0, second.stderr);
    await fs.writeFile(path.join(folder, sourcePath), 'local changes must survive');
    const conflict = run(folder, 'restore-private-equity-report.mjs');
    assert.notEqual(conflict.status, 0);
    assert.equal(await fs.readFile(path.join(folder, sourcePath), 'utf8'), 'local changes must survive');
  } finally { await fs.rm(folder, {recursive: true, force: true}); }
});

test('restore rejects symlinked parent directories before writing source files', async () => {
  const folder = await checkout();
  try {
    await fs.mkdir(path.join(folder, 'outside'));
    await fs.symlink(path.join(folder, 'outside'), path.join(folder, 'components'), 'dir');
    const result = run(folder, 'restore-private-equity-report.mjs');
    assert.notEqual(result.status, 0);
    assert.deepEqual(await fs.readdir(path.join(folder, 'outside')), []);
  } finally { await fs.rm(folder, {recursive: true, force: true}); }
});
