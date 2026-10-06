import PdfDownloads from './PdfDownloads'

const documents = [
  {
    id: 'abridged', label: '5안 제외본 PDF', apiUrl: '/api/temsco/v5-abridged-pdf',
    artifactDirectory: '/temsco/v5/abridged-pdf', filePrefix: 'TEMSCO-V5-ABRIDGED',
    downloadName: 'TEMSCO_5안_투자제안서_제외본.pdf',
  },
  {
    id: 'full', label: '5안 전체 PDF', apiUrl: '/api/temsco/v5-pdf',
    artifactDirectory: '/temsco/v5/pdf', filePrefix: 'TEMSCO-V5',
    downloadName: 'TEMSCO_5안_투자제안서.pdf',
  },
]

export default function PdfDownloadControls({ showPrint = true }: { showPrint?: boolean }) {
  return <PdfDownloads documents={documents} showPrint={showPrint} />
}
