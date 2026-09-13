import type { NextApiRequest, NextApiResponse } from 'next'
import manifest from '../../../public/temsco/v4/pdf/manifest.json'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'GET 요청만 지원합니다.' })
  }

  try {
    // Production assets are validated before next build; source files are not
    // required inside a deployed serverless function. Dev edits are checked now.
    const current = process.env.NODE_ENV === 'production'
      ? manifest
      : (await import('../../../lib/temsco/v4-pdf-artifact.mjs')).verifyV4PdfArtifact()
    return res.status(200).json({
      url: `/temsco/v4/pdf/${current.fileName}`,
      pageCount: current.pageCount,
      generatedAt: current.generatedAt,
    })
  } catch {
    return res.status(409).json({
      error: '현재 편집본의 PDF 갱신이 필요합니다. 갱신 후 다시 이용해 주세요. 현재 화면은 Chrome·Edge의 인쇄로 저장할 수 있습니다.',
    })
  }
}
