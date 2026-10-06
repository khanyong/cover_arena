import { createPdfArtifact } from './pdf-artifact.mjs'

const artifact = createPdfArtifact({
  artifactDirectory: 'public/temsco/v5/pdf',
  prefix: 'TEMSCO-V5',
  label: 'TEMSCO V5',
  repairCommand: 'node scripts/temsco/export-v5-pdf.mjs',
  sourceEntries: ['pages/temsco/deck-v5.tsx', 'scripts/temsco/export-v5-pdf.mjs'],
  assetDirectories: ['public/temsco/v5/technology', 'public/temsco/v5/customer-logos'],
  forbiddenSourcePrefixes: ['components/TemscoV4/', 'projects/temsco/v4/', 'public/temsco/v4/', 'pages/temsco/deck-v4.tsx'],
})

export const getV5PdfSourceGraph = artifact.getSourceGraph
export const getV5PdfSourceHash = artifact.getSourceHash
export const readV5PdfManifest = artifact.readManifest
export const verifyV5PdfArtifact = artifact.verifyArtifact
