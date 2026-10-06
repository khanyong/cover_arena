import { getV5PdfSourceHash, verifyV5PdfArtifact } from '../../lib/temsco/v5-pdf-artifact.mjs'
import { exportDeckPdf } from './export-v5-deck-pdf.mjs'

exportDeckPdf({
  label: 'TEMSCO V5',
  prefix: 'TEMSCO-V5',
  artifactDirectory: 'public/temsco/v5/pdf',
  route: '/temsco/deck-v5?slide=01',
  containerSelector: '.temsco-slide-container',
  slideSelector: '.temsco-slide',
  getSourceHash: getV5PdfSourceHash,
  verifyArtifact: verifyV5PdfArtifact,
}).catch(error => { console.error(error.message); process.exitCode = 1 })
