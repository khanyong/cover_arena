import type { NextApiRequest, NextApiResponse } from 'next'
import manifest from '../../../public/temsco/pre-nda/pdf/manifest.json'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'GET 요청만 지원합니다.' })
  }

  try {
    // Full source, PDF and preview checks run before next build. Production
    // needs only the validated manifest, not the authoring/source scanner.
    const current = process.env.NODE_ENV === 'production'
      ? manifest
      : (await import('../../../lib/temsco/pre-nda-pdf-artifact.mjs')).verifyPreNdaPdfArtifact()
    return res.status(200).json({
      url: `/temsco/pre-nda/pdf/${current.fileName}`,
      pageCount: current.pageCount,
      generatedAt: current.generatedAt,
      previewUrl: current.previewUrl,
    })
  } catch {
    return res.status(409).json({
      error: '현재 NDA 이전 자료의 가림 처리본을 준비 중입니다. 갱신 후 다시 이용해 주세요.',
    })
  }
}
