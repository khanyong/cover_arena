import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { getPreNdaPdfSourceHash, verifyPreNdaPdfArtifact } from '../../lib/temsco/pre-nda-pdf-artifact.mjs'

// Independent, pinned disclosure edition. Never print the detailed live route to this public file.
const root = process.cwd()
if (process.argv.includes('--check')) {
  console.log(JSON.stringify(verifyPreNdaPdfArtifact(root), null, 2))
} else {
  const sourceHash = getPreNdaPdfSourceHash(root)
  const edition = sourceHash.slice(0, 12)
  const directory = path.join(root, 'public/temsco/pre-nda/pdf')
  const fileName = `TEMSCO-PRE-NDA-${edition}.pdf`
  const pdf = path.join(directory, fileName)
  const previewUrl = `/temsco/pre-nda/editions/${edition}/preview.json`
  const previewDir = path.dirname(path.join(root, 'public', previewUrl))
  const result = spawnSync(process.env.TEMSCO_PYTHON ?? 'python3', [
    'scripts/temsco/redact-pre-nda.py', '--pdf', pdf, '--preview-dir', previewDir,
    '--edition', edition, '--audit', `projects/temsco/v4/pre-nda/verification/redaction-${edition}.json`,
  ], { cwd: root, env: process.env, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error('가림 처리 실패. scripts/temsco/redaction-requirements.txt의 Python 의존성을 확인하세요.')
  if (getPreNdaPdfSourceHash(root) !== sourceHash) throw new Error('생성 중 소스 변경. 다시 실행하세요.')
  const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  const manifest = {
    sourceHash, pdfHash: sha(pdf), fileName, pageCount: 40,
    generatedAt: new Date().toISOString(), previewUrl,
    previewHash: sha(path.join(previewDir, 'preview.json')),
  }
  fs.mkdirSync(directory, { recursive: true })
  const temporary = path.join(directory, 'manifest.json.tmp')
  fs.writeFileSync(temporary, JSON.stringify(manifest, null, 2) + '\n')
  fs.renameSync(temporary, path.join(directory, 'manifest.json'))
  console.log(JSON.stringify(verifyPreNdaPdfArtifact(root), null, 2))
}
