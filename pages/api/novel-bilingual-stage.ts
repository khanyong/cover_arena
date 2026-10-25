import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateBookRequest } from '../../lib/novel-book/loadBookSnapshot.mjs';
import { stageBilingualRevision } from '../../lib/novel-revision/stageBilingualRevision.mjs';
import { RevisionConflict } from '../../lib/novel-revision/bilingual-plan.mjs';

export const config = { api: { bodyParser: { sizeLimit: '256kb' } } };
export const maxDuration = 60;
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Authorization');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' }); }
  try {
    const { client } = await authenticateBookRequest(req.headers.authorization, {requestTimeoutMs: 55000});
    const result = await stageBilingualRevision(client, req.body);
    return res.status(200).json(result);
  } catch (error) {
    // Never log user tokens, approved text, request bodies or database details.
    const e = error as Error & { status?: number };
    const status = error instanceof RevisionConflict ? 409 : [400,401,403,409,422,503].includes(e.status || 0) ? e.status! : 503;
    return res.status(status).json({ error: status === 503 ? 'BILINGUAL_STAGE_UNAVAILABLE' : 'BILINGUAL_STAGE_REJECTED' });
  }
}
