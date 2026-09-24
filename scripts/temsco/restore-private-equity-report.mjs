import {lstat, mkdir, readFile, realpath, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import dotenv from 'dotenv'
import {decryptEquityReport} from '../../lib/temsco/equity-report-crypto.mjs'

const root = await realpath(fileURLToPath(new URL('../../', import.meta.url)))
if (!process.env.VERCEL && process.env.CI !== 'true') dotenv.config({path: path.join(root, '.env.local'), override: false, quiet: true})
const envelope = JSON.parse(await readFile(path.join(root, 'private/temsco/equity-report.enc.json'), 'utf8'))
const artifact = decryptEquityReport(envelope)

async function inspectParents(relative) {
  let directory = root
  for (const part of relative.split('/').slice(0, -1)) {
    directory = path.join(directory, part)
    const stat = await lstat(directory).catch(error => { if (error.code === 'ENOENT') return null; throw error })
    if (stat && (!stat.isDirectory() || stat.isSymbolicLink())) throw new Error('Restore refused: source parent is not a real directory')
  }
}

// Preflight every allowlisted, hash-validated path before writing anything.
// Existing identical files are retained; differing files are never overwritten.
const pending = []
for (const file of artifact.sourceBackup.files) {
  await inspectParents(file.path)
  const target = path.join(root, file.path)
  const stat = await lstat(target).catch(error => { if (error.code === 'ENOENT') return null; throw error })
  if (stat) {
    if (!stat.isFile() || stat.isSymbolicLink() || await readFile(target, 'utf8') !== file.content) throw new Error(`Restore refused: existing source differs at ${file.path}`)
  } else pending.push(file)
}
for (const file of pending) {
  const target = path.join(root, file.path)
  await mkdir(path.dirname(target), {recursive: true})
  await inspectParents(file.path)
  await writeFile(target, file.content, {encoding: 'utf8', flag: 'wx', mode: 0o600})
}
console.log(`Restored ${pending.length} private source files; retained ${artifact.sourceBackup.files.length - pending.length} identical files. No existing files were overwritten.`)
