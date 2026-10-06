import { createPdfArtifact } from './pdf-artifact.mjs'

const artifact = createPdfArtifact({
  artifactDirectory: 'public/temsco/v5/abridged-pdf',
  prefix: 'TEMSCO-V5-ABRIDGED', label: 'TEMSCO V5 abridged',
  repairCommand: 'node scripts/temsco/export-v5-abridged-pdf.mjs',
  sourceEntries: ['pages/temsco/deck-v5.tsx', 'scripts/temsco/export-v5-abridged-pdf.mjs'],
  assetDirectories: ['public/temsco/v5/technology', 'public/temsco/v5/customer-logos'],
  forbiddenSourcePrefixes: ['components/TemscoV4/', 'projects/temsco/v4/', 'public/temsco/v4/', 'pages/temsco/deck-v4.tsx'],
})
export const getAbridgedSourceHash = artifact.getSourceHash
export const verifyAbridgedPdfArtifact = artifact.verifyArtifact
