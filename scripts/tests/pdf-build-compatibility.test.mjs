import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { createPdfArtifact } from '../../lib/temsco/pdf-artifact.mjs'

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-build-compatibility-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  fs.mkdirSync(path.join(root, 'pdf'))
  fs.mkdirSync(path.join(root, 'assets'))
  fs.writeFileSync(path.join(root, 'deck.js'), 'export const title = "Approved deck"\n')
  fs.writeFileSync(path.join(root, 'package.json'), '{"scripts":{"build":"next build"}}\n')
  const artifact = createPdfArtifact({ artifactDirectory: 'pdf', sourceEntries: ['deck.js'], assetDirectories: ['assets'], prefix: 'TEST', label: 'Test', repairCommand: 'regenerate' })
  const sourceHash = artifact.getSourceHash(root)
  const bytes = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Page /MediaBox [0 0 841.89 595.28] >>\nendobj\n%%EOF\n')
  const manifest = { sourceHash, pdfHash: createHash('sha256').update(bytes).digest('hex'), fileName: `TEST-${sourceHash.slice(0, 12)}.pdf`, pageCount: 1, generatedAt: '2026-09-25T00:00:00.000Z' }
  const pdfPath = path.join(root, 'pdf', manifest.fileName)
  fs.writeFileSync(pdfPath, bytes)
  const save = () => fs.writeFileSync(path.join(root, 'pdf/manifest.json'), JSON.stringify(manifest))
  save()
  const approveBuildChange = () => {
    fs.writeFileSync(path.join(root, 'package.json'), '{"scripts":{"build":"next build","prebuild":"node private-bundle.mjs"}}\n')
    manifest.buildCompatibility = { baseSourceHash: sourceHash, sourceHash: artifact.getSourceHash(root), reason: 'Reviewed build-only private bundle script; approved deck content is unchanged.' }
    save()
  }
  return { root, artifact, manifest, bytes, pdfPath, save, approveBuildChange }
}

test('original artifact and one exact reviewed build hash pass without changing PDF identity', t => {
  const f = fixture(t)
  const original = { ...f.manifest }
  assert.deepEqual(f.artifact.verifyArtifact(f.root), original)
  f.approveBuildChange()
  assert.deepEqual(f.artifact.verifyArtifact(f.root), f.manifest)
  for (const [key, value] of Object.entries(original)) assert.equal(f.manifest[key], value)
})

test('existing guarded source changes and newly added guarded files invalidate compatibility', t => {
  const f = fixture(t)
  f.approveBuildChange()
  fs.appendFileSync(path.join(f.root, 'deck.js'), 'export const modified = true\n')
  assert.throws(() => f.artifact.verifyArtifact(f.root), /소스 버전 불일치/)
  fs.writeFileSync(path.join(f.root, 'deck.js'), 'export const title = "Approved deck"\n')
  fs.writeFileSync(path.join(f.root, 'assets/new-figure.svg'), '<svg/>')
  assert.throws(() => f.artifact.verifyArtifact(f.root), /소스 버전 불일치/)
})

test('compatibility cannot authorize a different base or malformed hash or reason', t => {
  const f = fixture(t)
  f.approveBuildChange()
  const approved = { ...f.manifest.buildCompatibility }
  for (const invalid of [
    null, [], { ...approved, baseSourceHash: '0'.repeat(64) },
    { ...approved, sourceHash: '*' }, { ...approved, reason: ' ' },
    { ...approved, allowAnySource: true },
  ]) {
    f.manifest.buildCompatibility = invalid
    f.save()
    assert.throws(() => f.artifact.verifyArtifact(f.root), /빌드 호환성 기록/)
  }
})

test('compatibility still rejects damaged PDF bytes and an incorrect page count', t => {
  const f = fixture(t)
  f.approveBuildChange()
  fs.appendFileSync(f.pdfPath, '\ncorrupted')
  assert.throws(() => f.artifact.verifyArtifact(f.root), /무결성 검증 실패/)
  fs.writeFileSync(f.pdfPath, f.bytes)
  f.manifest.pageCount = 2
  f.save()
  assert.throws(() => f.artifact.verifyArtifact(f.root), /페이지 수/)
})
