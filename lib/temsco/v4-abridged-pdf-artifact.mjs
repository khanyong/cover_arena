import { createPdfArtifact } from './pdf-artifact.mjs'

const artifact = createPdfArtifact({
  artifactDirectory: 'public/temsco/v4/abridged-pdf',
  prefix: 'TEMSCO-V4-ABRIDGED', label: 'TEMSCO V4 abridged',
  repairCommand: 'npm run temsco:pdf:abridged',
  sourceEntries: ['pages/temsco/deck-v4.tsx', 'scripts/temsco/export-v4-abridged-pdf.mjs'],
  assetDirectories: ['public/temsco/v4/technology'],
})
export const getAbridgedSourceHash = artifact.getSourceHash
export const verifyAbridgedPdfArtifact = artifact.verifyArtifact
