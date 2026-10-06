import type { NextApiRequest, NextApiResponse } from 'next'
import manifest from '../../../public/temsco/v5/abridged-pdf/manifest.json'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'GET 요청만 지원합니다.' })
  }
  try {
    const current = process.env.NODE_ENV === 'production' ? manifest
      : (await import('../../../lib/temsco/v5-abridged-pdf-artifact.mjs')).verifyAbridgedPdfArtifact()
    return res.status(200).json({ url: `/temsco/v5/abridged-pdf/${current.fileName}`, pageCount: current.pageCount, generatedAt: current.generatedAt })
  } catch {
    return res.status(409).json({ error: '제외본 PDF 갱신이 필요합니다. 갱신 후 다시 이용해 주세요.' })
  }
}
