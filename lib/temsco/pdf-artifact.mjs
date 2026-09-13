import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.css']
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')

/** Independent artifact configuration; shared implementation contains no deck content. */
export function createPdfArtifact(config) {
  const { artifactDirectory, sourceEntries, assetDirectories = [], forbiddenSourcePrefixes = [], prefix, label, repairCommand } = config
  const artifactError = message => new Error(`${label} PDF: ${message}. PDF 재생성: ${repairCommand}`)

  /** Resolve the deck's own source graph, shared print/build inputs and approved assets. */
  function getSourceGraph(root = process.cwd()) {
    root = fs.realpathSync(path.resolve(root))
    const ts = require('typescript')
    const files = new Set()
    const excluded = path.join(root, artifactDirectory)
    const configPath = ['tsconfig.json', 'jsconfig.json'].map(name => path.join(root, name)).find(fs.existsSync)
    let compilerOptions = {}
    if (configPath) {
      const config = ts.readConfigFile(configPath, ts.sys.readFile)
      if (config.error) throw artifactError(`설정 읽기 실패: ${path.basename(configPath)}`)
      compilerOptions = ts.convertCompilerOptionsFromJson(config.config.compilerOptions ?? {}, root).options
    }

    function localPath(file) {
      const absolute = path.resolve(file)
      const relative = path.relative(root, absolute)
      if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        throw artifactError(`프로젝트 밖의 소스 참조: ${file}`)
      }
      return absolute
    }

    function resolveImport(specifier, importer) {
      if (specifier.startsWith('.')) {
        const base = localPath(path.resolve(path.dirname(importer), specifier))
        const candidates = [base, ...sourceExtensions.map(ext => base + ext), ...sourceExtensions.map(ext => path.join(base, 'index' + ext))]
        const found = candidates.find(file => fs.existsSync(file) && fs.statSync(file).isFile())
        if (!found) throw artifactError(`로컬 import 확인 실패: ${path.relative(root, importer)} → ${specifier}`)
        return found
      }
      // Resolve project aliases as well; package contents are pinned by the lockfile.
      const resolved = ts.resolveModuleName(specifier, importer, compilerOptions, ts.sys).resolvedModule
      if (!resolved || resolved.isExternalLibraryImport || resolved.resolvedFileName.includes(`${path.sep}node_modules${path.sep}`)) return null
      return localPath(resolved.resolvedFileName)
    }

    function add(file) {
      file = localPath(file)
      if (file === excluded || file.startsWith(excluded + path.sep) || files.has(file)) return
      if (!fs.existsSync(file)) throw artifactError(`필수 소스 없음: ${path.relative(root, file)}`)
      const stat = fs.statSync(file)
      if (stat.isDirectory()) {
        for (const name of fs.readdirSync(file).sort()) add(path.join(file, name))
        return
      }
      localPath(fs.realpathSync(file))
      files.add(file)
      const extension = path.extname(file)
      if (!sourceExtensions.includes(extension) || extension === '.json') return
      const text = fs.readFileSync(file, 'utf8')
      if (extension === '.css') {
        const references = [...text.matchAll(/(?:@import\s+["']([^"']+)["']|url\(\s*["']?([^\s"')]+)["']?\s*\))/g)]
        for (const match of references) {
          const reference = (match[1] ?? match[2]).split(/[?#]/)[0]
          if (!reference || /^(?:[a-z]+:|\/\/)/i.test(reference)) continue
          add(reference.startsWith('/') ? path.join(root, 'public', reference) : path.resolve(path.dirname(file), reference))
        }
        return
      }
      for (const reference of ts.preProcessFile(text, true, true).importedFiles) {
        const dependency = resolveImport(reference.fileName, file)
        if (dependency) add(dependency)
      }
    }

    for (const entry of sourceEntries) add(path.join(root, entry))
    for (const name of ['_app', '_document']) {
      for (const extension of ['.js', '.jsx', '.ts', '.tsx']) {
        const file = path.join(root, 'pages', name + extension)
        if (fs.existsSync(file)) add(file)
      }
    }
    for (const name of fs.readdirSync(root)) {
      if (/^(?:next|tailwind|postcss)\.config\.(?:js|mjs|cjs|ts)$/.test(name) ||
          /^(?:package\.json|package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|tsconfig\.json|jsconfig\.json)$/.test(name)) add(path.join(root, name))
    }
    for (const directory of assetDirectories) {
      const assets = path.join(root, directory)
      if (fs.existsSync(assets)) add(assets)
    }
    const graph = [...files].sort().map(file => path.relative(root, file).split(path.sep).join('/'))
    const forbidden = graph.find(file => forbiddenSourcePrefixes.some(prefix => file.startsWith(prefix)))
    if (forbidden) throw artifactError(`허용 범위를 벗어난 자료 의존성: ${forbidden}`)
    return graph
  }

  function getSourceHash(root = process.cwd()) {
    const hash = createHash('sha256').update(`${prefix}-pdf-source-v2\0`)
    for (const relative of getSourceGraph(root)) {
      hash.update(relative).update('\0')
      hash.update(sha256(fs.readFileSync(path.join(root, relative)))).update('\0')
    }
    return hash.digest('hex')
  }

  /** Read and validate manifest shape; production freshness is enforced before build. */
  function readManifest(root = process.cwd()) {
    const directory = path.join(path.resolve(root), artifactDirectory)
    let manifest
    try {
      manifest = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.json'), 'utf8'))
    } catch {
      throw artifactError('PDF manifest가 없거나 올바르지 않음')
    }
    if (!manifest || !/^[a-f0-9]{64}$/.test(manifest.sourceHash ?? '') || !/^[a-f0-9]{64}$/.test(manifest.pdfHash ?? '') ||
        typeof manifest.fileName !== 'string' || manifest.fileName !== `${prefix}-${manifest.sourceHash.slice(0, 12)}.pdf` ||
        !Number.isInteger(manifest.pageCount) || manifest.pageCount < 1 ||
        typeof manifest.generatedAt !== 'string' || !Number.isFinite(Date.parse(manifest.generatedAt))) {
      throw artifactError('PDF manifest 형식 또는 파일명이 올바르지 않음')
    }
    return manifest
  }

  /** Throw on missing, stale, non-A4, unordered or damaged artifacts. */
  function verifyArtifact(root = process.cwd()) {
    const directory = path.join(path.resolve(root), artifactDirectory)
    const manifest = readManifest(root)
    const sourceHash = getSourceHash(root)
    if (manifest.sourceHash !== sourceHash) throw artifactError('현재 코드와 PDF의 소스 버전 불일치')
    let bytes
    try {
      bytes = fs.readFileSync(path.join(directory, manifest.fileName))
    } catch {
      throw artifactError('manifest에 지정된 PDF 파일 없음')
    }
    if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-' || sha256(bytes) !== manifest.pdfHash) {
      throw artifactError('PDF 파일 형식 또는 무결성 검증 실패')
    }
    validateChromiumPdf(bytes, manifest.pageCount)
    return manifest
  }
  return { getSourceGraph, getSourceHash, readManifest, verifyArtifact }
}

/** Chromium exports uncompressed page dictionaries. Fail closed for unsupported layouts. */
export function validateChromiumPdf(bytes, expectedPages) {
  if (!Number.isInteger(expectedPages) || expectedPages < 1 || bytes.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error('PDF 형식 또는 예상 페이지 수 오류')
  }
  const text = bytes.toString('latin1')
  // The local Chromium authoring path must expose every page and MediaBox.
  if (/\/Type\s*\/ObjStm\b/.test(text)) throw new Error('지원하지 않는 PDF 객체 스트림')
  const pages = [...text.matchAll(/\/Type\s*\/Page\b/g)]
  const boxes = [...text.matchAll(/\/MediaBox\s*\[([^\]]+)\]/g)]
  if (pages.length !== expectedPages || boxes.length !== expectedPages) throw new Error('PDF 실제 페이지 수와 슬라이드 수 불일치')
  for (const match of boxes) {
    const values = match[1].trim().split(/\s+/).map(Number)
    const width = values[2] - values[0], height = values[3] - values[1]
    if (values.length !== 4 || values.some(value => !Number.isFinite(value)) ||
        Math.abs(width - 297 / 25.4 * 72) > 1 || Math.abs(height - 210 / 25.4 * 72) > 1) {
      throw new Error('PDF 페이지가 A4 가로 규격과 불일치')
    }
  }
  return { pageCount: pages.length, format: 'A4 landscape' }
}
