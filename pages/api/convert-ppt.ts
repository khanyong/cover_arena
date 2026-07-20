import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'temp');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024,
  });

  return new Promise<void>((resolve) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing file upload:', err);
        res.status(500).json({ error: 'Failed to process file upload' });
        return resolve();
      }

      const fileKey = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!fileKey) {
        res.status(400).json({ error: 'No file uploaded under key "file"' });
        return resolve();
      }

      const htmlFilePath = fileKey.filepath;
      const originalFilename = fileKey.originalFilename || 'document.html';
      const cleanBasename = path.basename(originalFilename, path.extname(originalFilename));
      const pptxFilename = `${cleanBasename}.pptx`;
      const pptxFilePath = path.join(uploadDir, pptxFilename);

      const pythonScriptPath = path.join(process.cwd(), 'scripts', 'html_to_pptx.py');
      const cmd = `python3 "${pythonScriptPath}" "${htmlFilePath}" "${pptxFilePath}"`;

      exec(cmd, (execErr, stdout, stderr) => {
        if (stdout) console.log('[Python STDOUT]:', stdout);
        if (stderr) console.error('[Python STDERR]:', stderr);

        if (execErr) {
          console.error('Conversion process execution failed:', execErr);
          res.status(500).json({ error: 'Failed to execute conversion script.' });
          
          if (fs.existsSync(htmlFilePath)) fs.unlinkSync(htmlFilePath);
          if (fs.existsSync(pptxFilePath)) fs.unlinkSync(pptxFilePath);
          return resolve();
        }

        if (!fs.existsSync(pptxFilePath)) {
          res.status(500).json({ error: 'Conversion script ran successfully, but no output PPTX was generated.' });
          if (fs.existsSync(htmlFilePath)) fs.unlinkSync(htmlFilePath);
          return resolve();
        }

        const fileStream = fs.createReadStream(pptxFilePath);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(pptxFilename)}"`);
        
        fileStream.pipe(res);

        fileStream.on('end', () => {
          try {
            if (fs.existsSync(htmlFilePath)) fs.unlinkSync(htmlFilePath);
            if (fs.existsSync(pptxFilePath)) fs.unlinkSync(pptxFilePath);
          } catch (cleanupErr) {
            console.error('Error deleting temp files:', cleanupErr);
          }
          resolve();
        });

        fileStream.on('error', (streamErr) => {
          console.error('Error streaming PPTX file:', streamErr);
          res.status(500).end();
          resolve();
        });
      });
    });
  });
}
