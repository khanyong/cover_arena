import {spawn, spawnSync} from 'node:child_process'
import {existsSync} from 'node:fs'
import {fileURLToPath} from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
// Generate once before Next starts, then keep the private bundle current.
const initial = spawnSync(process.execPath, ['scripts/temsco/build-private-equity-report.mjs'], {cwd: root, stdio: 'inherit'})
if (initial.status !== 0) process.exit(initial.status ?? 1)
const children = []
if (existsSync(new URL('../../components/TemscoEquityPrivate/entry.tsx', import.meta.url))) {
  children.push(spawn(process.execPath, ['scripts/temsco/build-private-equity-report.mjs', '--watch'], {cwd: root, stdio: 'inherit'}))
}
children.push(spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', ...process.argv.slice(2)], {cwd: root, stdio: 'inherit'}))
let stopping = false
function stop(code) {
  if (stopping) return
  stopping = true
  for (const child of children) child.kill('SIGTERM')
  process.exitCode = code
}
for (const child of children) {
  child.on('error', () => stop(1))
  child.on('exit', code => stop(code ?? 1))
}
process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
