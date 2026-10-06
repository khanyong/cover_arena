import { getAbridgedSourceHash, verifyAbridgedPdfArtifact } from '../../lib/temsco/v4-abridged-pdf-artifact.mjs'
import { exportDeckPdf } from './export-deck-pdf.mjs'

exportDeckPdf({
  label: 'TEMSCO V4 abridged', prefix: 'TEMSCO-V4-ABRIDGED',
  artifactDirectory: 'public/temsco/v4/abridged-pdf',
  route: '/temsco/deck-v4?slide=01',
  containerSelector: '.temsco-slide-container', slideSelector: '.temsco-slide',
  includePages: Array.from({ length: 36 }, (_, i) => i + 1).filter(n => n !== 28 && n !== 29),
  omitSourceNotes: true,
  getSourceHash: getAbridgedSourceHash, verifyArtifact: verifyAbridgedPdfArtifact,
}).catch(error => { console.error(error.message); process.exitCode = 1 })
