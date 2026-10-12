import { NextApiRequest, NextApiResponse } from 'next';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.body !== undefined && (req.body === null || typeof req.body !== 'object' || Array.isArray(req.body))) {
    return res.status(400).json({ error: 'Invalid PDF request' });
  }
  const slug = req.body?.slug === undefined ? 'quantum-vibration-novel-en' : req.body.slug;
  if (typeof slug !== 'string' || slug.length > 160 || slug.trim() !== slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return res.status(400).json({ error: 'Invalid novel slug' });
  }
  // A root export includes protected Act2; other Act documents retain their existing path.
  if (slug === 'quantum-vibration-novel' || slug === 'quantum-vibration-novel-act-2') {
    return res.status(403).json({ error: 'Public PDF export is unavailable for this novel' });
  }

  try {
    await new Promise<void>((resolve, reject) => {
      execFile('npx', ['tsx', 'scripts/build_db_pdf.ts', slug], { shell: false }, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    const pdfName = 'The_Resonance_of_Space_Latest.pdf';
    const publicPdfPath = path.join(process.cwd(), 'public', pdfName);
    
    if (fs.existsSync(publicPdfPath)) {
      res.status(200).json({ success: true, url: `/${pdfName}` });
    } else {
      throw new Error('PDF file was not created successfully');
    }
  } catch {
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
