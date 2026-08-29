import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Generating PDF from DB...');
    
    // Run the generation script
    await new Promise((resolve, reject) => {
      exec('npx tsx scripts/build_db_pdf.ts', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          console.error(stderr);
          reject(error);
          return;
        }
        console.log(`stdout: ${stdout}`);
        resolve(stdout);
      });
    });

    const pdfName = 'The_Resonance_of_Space_Latest.pdf';
    const publicPdfPath = path.join(process.cwd(), 'public', pdfName);
    
    if (fs.existsSync(publicPdfPath)) {
      res.status(200).json({ success: true, url: `/${pdfName}` });
    } else {
      throw new Error('PDF file was not created successfully');
    }
  } catch (error: any) {
    console.error('Failed to generate PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
}
