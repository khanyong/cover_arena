import { getV4PdfSourceHash, verifyV4PdfArtifact } from '../../lib/temsco/v4-pdf-artifact.mjs'
import { exportDeckPdf } from './export-deck-pdf.mjs'

exportDeckPdf({
  label: 'TEMSCO V4',
  prefix: 'TEMSCO-V4',
  artifactDirectory: 'public/temsco/v4/pdf',
  route: '/temsco/deck-v4?slide=01',
  containerSelector: '.temsco-slide-container',
  slideSelector: '.temsco-slide',
  getSourceHash: getV4PdfSourceHash,
  verifyArtifact: verifyV4PdfArtifact,
}).catch(error => { console.error(error.message); process.exitCode = 1 })
