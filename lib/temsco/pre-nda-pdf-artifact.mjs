import { createPdfArtifact } from './pdf-artifact.mjs'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const artifact = createPdfArtifact({
  artifactDirectory: 'public/temsco/pre-nda/pdf',
  prefix: 'TEMSCO-PRE-NDA',
  label: 'TEMSCO NDA 이전',
  repairCommand: 'npm run temsco:pdf:pre-nda',
  sourceEntries: [
    'pages/temsco/pre-nda.tsx', 'pages/api/temsco/pre-nda-pdf.ts',
    'scripts/temsco/export-pre-nda-pdf.mjs', 'scripts/temsco/redact-pre-nda.py',
    'scripts/temsco/redaction-requirements.txt',
    'projects/temsco/v4/pre-nda/redaction-config.json',
    'projects/temsco/v4/pre-nda/source/approved-v4.pdf',
  ],
  forbiddenSourcePrefixes: [
    'components/TemscoV4/',
    'pages/temsco/deck-v4.tsx',
    'lib/temsco/v4-slide-catalog.ts',
    'projects/temsco/v3/',
    'projects/temsco/v4/model/',
  ],
})

export const getPreNdaPdfSourceGraph = artifact.getSourceGraph
export const getPreNdaPdfSourceHash = artifact.getSourceHash
export function readPreNdaPdfManifest(root = process.cwd()) {
  const manifest = artifact.readManifest(root)
  if (manifest.pageCount !== 40 || manifest.previewUrl !== `/temsco/pre-nda/editions/${manifest.sourceHash.slice(0, 12)}/preview.json` ||
      !/^[a-f0-9]{64}$/.test(manifest.previewHash ?? '')) throw new Error('40페이지 비공개 처리본의 미리보기 정보 오류')
  return manifest
}

export function verifyPreNdaPdfArtifact(root = process.cwd()) {
  artifact.verifyArtifact(root)
  const manifest = readPreNdaPdfManifest(root)
  const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  const previewPath = path.join(root, 'public', manifest.previewUrl)
  if (hash(previewPath) !== manifest.previewHash) throw new Error('NDA 이전 미리보기 무결성 오류')
  const preview = JSON.parse(fs.readFileSync(previewPath, 'utf8'))
  if (preview.pageCount !== manifest.pageCount || preview.pages?.length !== manifest.pageCount) throw new Error('미리보기 페이지 수 오류')
  for (const [i, page] of preview.pages.entries()) {
    const expected = `/temsco/pre-nda/editions/${manifest.sourceHash.slice(0, 12)}/page-${String(i + 1).padStart(2, '0')}.png`
    if (page.page !== i + 1 || page.url !== expected || hash(path.join(root, 'public', expected)) !== page.sha256) {
      throw new Error(`NDA 이전 미리보기 ${i + 1}페이지 순서 또는 무결성 오류`)
    }
  }
  return manifest
}
