import type { NextApiRequest, NextApiResponse } from 'next'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { authorizeEquityReport, type EquityReportAuthorization } from '../../../lib/temsco/equity-report-auth'
import { decryptEquityReport } from '../../../lib/temsco/equity-report-crypto.mjs'

type ReportArtifact = { schemaVersion: 1; javascript: string; css: string; sourceHash: string }
type Dependencies = {
  authorize?: (header: string | string[] | undefined) => Promise<EquityReportAuthorization>
  readArtifact?: () => Promise<unknown>
}

async function readArtifact(): Promise<unknown> {
  // Authentication happens before this function: even decryption is protected.
  const file = path.join(process.cwd(), 'private', 'temsco', 'equity-report.enc.json')
  return decryptEquityReport(JSON.parse(await readFile(file, 'utf8')))
}

function validArtifact(value: unknown): value is ReportArtifact {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const artifact = value as Partial<ReportArtifact>
  return artifact.schemaVersion === 1
    && typeof artifact.javascript === 'string' && artifact.javascript.trim().length > 0
    && typeof artifact.css === 'string' && artifact.css.trim().length > 0
    && typeof artifact.sourceHash === 'string' && /^[a-f0-9]{64}$/i.test(artifact.sourceHash)
}

/** Dependency injection only supports local tests; no request can bypass auth. */
export function createEquityReportHandler(dependencies: Dependencies = {}) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'private, no-store, max-age=0')
    res.setHeader('CDN-Cache-Control', 'no-store')
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store')
    res.setHeader('Vary', 'Authorization')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ error: 'GET 요청만 지원합니다.' })
    }

    try {
      const authorization = await (dependencies.authorize || authorizeEquityReport)(req.headers.authorization)
      if (authorization.ok === false) {
        if (authorization.status === 401) {
          res.setHeader('WWW-Authenticate', 'Bearer')
          return res.status(401).json({ error: '로그인이 필요합니다.' })
        }
        return res.status(503).json({ error: '로그인 상태를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.' })
      }

      const artifact = await (dependencies.readArtifact || readArtifact)()
      if (!validArtifact(artifact)) throw new Error('Invalid report artifact')
      // Return only the public contract, excluding accidental build metadata.
      return res.status(200).json({
        schemaVersion: artifact.schemaVersion,
        javascript: artifact.javascript,
        css: artifact.css,
        sourceHash: artifact.sourceHash,
      })
    } catch {
      return res.status(503).json({ error: '보고서를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.' })
    }
  }
}

export default createEquityReportHandler()
