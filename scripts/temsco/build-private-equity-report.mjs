import {build, context} from 'esbuild'
import {createHash} from 'node:crypto'
import {access, mkdir, readFile, readdir, rename, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import dotenv from 'dotenv'
import {decryptEquityReport, encryptEquityReport, isAllowedReportSourcePath} from '../../lib/temsco/equity-report-crypto.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
if (!process.env.VERCEL && process.env.CI !== 'true') dotenv.config({path: path.join(root, '.env.local'), override: false, quiet: true})
const target = path.join(root, 'private/temsco/equity-report.enc.json')
const exists = file => access(path.join(root, file)).then(() => true, () => false)
const sourceFolderPresent = await exists('components/TemscoEquity')
const entryPresent = await exists('components/TemscoEquityPrivate/entry.tsx')

// Public checkouts contain ciphertext only. Validate it in memory during build;
// never restore confidential source or emit plaintext into the checkout.
if (!sourceFolderPresent && !entryPresent) {
  decryptEquityReport(JSON.parse(await readFile(target, 'utf8')))
  console.log('Encrypted private report validated; no plaintext sources were restored.')
  process.exit(0)
}
if (!sourceFolderPresent || !entryPresent) throw new Error('Private source checkout is incomplete; restore its encrypted backup before editing')

async function sourceBackup() {
  const reportFiles = (await readdir(path.join(root, 'components/TemscoEquity'))).map(name => `components/TemscoEquity/${name}`)
  const names = [...reportFiles,
    'components/TemscoEquityPrivate/entry.tsx', 'components/TemscoEquityPrivate/Head.tsx', 'components/TemscoEquityPrivate/Link.tsx',
    'components/TemscoV5/ValuationSlideFrame.tsx', 'components/TemscoV5/CorporateSlideFrame.module.css', 'components/TemscoV5/AccountingValuationSlides.module.css',
    'scripts/temsco/test-equity-model.mjs', 'scripts/temsco/test-equity-legal-model.mjs',
    'scripts/temsco/test-equity-dividend-model.mjs', 'scripts/temsco/test-equity-reassessment-model.mjs',
    'scripts/temsco/fixtures/equity-workbook-calculations.json',
  ].sort()
  const files = []
  for (const name of names) {
    if (!isAllowedReportSourcePath(name)) throw new Error('Unexpected private source path; review backup allowlist')
    const content = await readFile(path.join(root, name), 'utf8')
    files.push({path: name, content, sha256: createHash('sha256').update(content).digest('hex')})
  }
  return {schemaVersion: 1, files}
}
const options = {
  absWorkingDir: root,
  entryPoints: ['components/TemscoEquityPrivate/entry.tsx'],
  outfile: 'private/temsco/equity-report.js',
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'iife',
  globalName: 'TemscoPrivateReport',
  target: ['es2020'],
  jsx: 'automatic',
  minify: true,
  charset: 'utf8',
  sourcemap: false,
  metafile: true,
  define: {'process.env.NODE_ENV': '"production"'},
  alias: {
    'next/head': './components/TemscoEquityPrivate/Head.tsx',
    'next/link': './components/TemscoEquityPrivate/Link.tsx',
  },
  plugins: [{
    name: 'private-artifact',
    setup(builder) {
      builder.onEnd(async result => {
        if (result.errors.length) return
        const javascript = result.outputFiles.find(file => file.path.endsWith('.js'))?.text
        const css = result.outputFiles.find(file => file.path.endsWith('.css'))?.text
        if (!javascript || !css) throw new Error('Private report output is incomplete')
        const hash = createHash('sha256')
        for (const source of Object.keys(result.metafile.inputs).sort()) {
          hash.update(source).update(await readFile(path.resolve(root, source)))
        }
        const artifact = {schemaVersion: 1, javascript, css, sourceHash: hash.digest('hex'), sourceBackup: await sourceBackup()}
        const encrypted = encryptEquityReport(artifact)
        await mkdir(path.dirname(target), {recursive: true})
        await writeFile(`${target}.tmp`, JSON.stringify(encrypted), {mode: 0o600})
        await rename(`${target}.tmp`, target)
        console.log(`Encrypted private report generated with ${artifact.sourceBackup.files.length} backed-up source files.`)
      })
    },
  }],
}

if (process.argv.includes('--watch')) {
  const watcher = await context(options)
  await watcher.watch()
  console.log('Watching private report sources. Reload the report after an edit.')
} else {
  await build(options)
}
