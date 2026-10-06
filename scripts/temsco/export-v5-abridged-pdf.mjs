import { getAbridgedSourceHash, verifyAbridgedPdfArtifact } from '../../lib/temsco/v5-abridged-pdf-artifact.mjs'
import { exportDeckPdf } from './export-v5-deck-pdf.mjs'

exportDeckPdf({
  label: 'TEMSCO V5 abridged', prefix: 'TEMSCO-V5-ABRIDGED',
  artifactDirectory: 'public/temsco/v5/abridged-pdf',
  route: '/temsco/deck-v5?slide=01',
  containerSelector: '.temsco-slide-container', slideSelector: '.temsco-slide',
  excludeSlideIds: ['valuation-peers', 'valuation-scenarios', 'investor-exit'],
  excludeChapterIds: ['appendix'],
  omitSourceNotes: true,
  getSourceHash: getAbridgedSourceHash, verifyArtifact: verifyAbridgedPdfArtifact,
}).catch(error => { console.error(error.message); process.exitCode = 1 })
