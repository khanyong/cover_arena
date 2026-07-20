import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';
import axios from 'axios';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

const CONVERTER_API_URL = process.env.CONVERTER_API_URL || 'http://localhost:8000/convert';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

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
    form.parse(req, async (err, fields, files) => {
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

      if (isVercel) {
        // ==========================================
        // Vercel Serverless Production: Proxy to AWS
        // ==========================================
        try {
          const fileStream = fs.createReadStream(htmlFilePath);
          const axiosFormData = new FormData();
          axiosFormData.append('file', fileStream, {
            filename: originalFilename,
            contentType: fileKey.mimetype || 'text/html',
          });

          const apiResponse = await axios.post(CONVERTER_API_URL, axiosFormData, {
            headers: axiosFormData.getHeaders(),
            responseType: 'arraybuffer',
          });

          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
          res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(pptxFilename)}"`);
          res.status(200).send(Buffer.from(apiResponse.data));
        } catch (proxyErr: any) {
          console.error('Error forwarding to AWS converter server:', proxyErr.message);
          res.status(500).json({ error: 'Vercel Serverless is unable to run local Python scripts. Communication with the AWS Converter API failed.' });
        } finally {
          if (fs.existsSync(htmlFilePath)) fs.unlinkSync(htmlFilePath);
          resolve();
        }
      } else {
        // ==========================================
        // Local Development: Run Anaconda Python
        // ==========================================
        const pythonScriptPath = path.join(process.cwd(), 'scripts', 'html_to_pptx.py');
        const cmd = `/opt/anaconda3/bin/python3 "${pythonScriptPath}" "${htmlFilePath}" "${pptxFilePath}"`;

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
      }
    });
  });
}
