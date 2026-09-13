import PdfDownloads from '../TemscoIR/PdfDownloads'

const documents = [
  {
    id: 'pre-nda', label: 'NDA 이전 PDF', apiUrl: '/api/temsco/pre-nda-pdf',
    artifactDirectory: '/temsco/pre-nda/pdf', filePrefix: 'TEMSCO-PRE-NDA',
    downloadName: 'TEMSCO_NDA이전_투자검토용.pdf',
  },
  {
    id: 'post-nda', label: 'NDA 이후 PDF', apiUrl: '/api/temsco/v4-pdf',
    artifactDirectory: '/temsco/v4/pdf', filePrefix: 'TEMSCO-V4',
    downloadName: 'TEMSCO_4안_NDA이후_상세검토용.pdf',
  },
]

export default function PdfDownloadControls({ showPrint = true }: { showPrint?: boolean }) {
  return <PdfDownloads documents={documents} showPrint={showPrint} />
}
