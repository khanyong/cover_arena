import { createPdfArtifact } from './pdf-artifact.mjs'

const artifact = createPdfArtifact({
  artifactDirectory: 'public/temsco/v4/pdf',
  prefix: 'TEMSCO-V4',
  label: 'TEMSCO V4',
  repairCommand: 'npm run temsco:pdf',
  sourceEntries: ['pages/temsco/deck-v4.tsx', 'scripts/temsco/export-v4-pdf.mjs'],
  assetDirectories: ['public/temsco/v4/technology'],
})

export const getV4PdfSourceGraph = artifact.getSourceGraph
export const getV4PdfSourceHash = artifact.getSourceHash
export const readV4PdfManifest = artifact.readManifest
export const verifyV4PdfArtifact = artifact.verifyArtifact
