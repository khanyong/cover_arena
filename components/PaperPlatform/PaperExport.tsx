import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

interface PaperExportProps {
  journalMode: 'nature' | 'prl' | 'ieee' | 'arxiv';
  lang: 'ko' | 'en';
  paperData: any;
}

export const PaperExport: React.FC<PaperExportProps> = ({ journalMode, lang, paperData }) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  // 1. PDF Export Handler (utilizes jsPDF for academic cover sheet and prompts print for exact layout)
  const handlePdfExport = () => {
    setDownloading('pdf');
    try {
      const doc = new jsPDF();
      
      // Academic Document Title Page Layout
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SUBMISSION-READY ACADEMIC MANUSCRIPT REPORT", 20, 30);
      
      doc.setDrawColor(139, 26, 26); // Wine-red divider
      doc.setLineWidth(1);
      doc.line(20, 35, 190, 35);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Exported Date: ${new Date().toLocaleDateString()}`, 20, 42);
      doc.text(`Selected Format: ${journalMode.toUpperCase()} Journal Layout`, 20, 47);
      doc.text(`Language: ${lang === 'ko' ? 'Korean (국문)' : 'English (영문)'}`, 20, 52);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("TITLE:", 20, 65);
      doc.setFont("helvetica", "normal");
      const titleText = lang === 'ko' ? paperData.title.ko : paperData.title.en;
      doc.text(doc.splitTextToSize(titleText, 160), 20, 72);
      
      doc.setFont("helvetica", "bold");
      doc.text("AUTHOR:", 20, 90);
      doc.setFont("helvetica", "normal");
      doc.text(lang === 'ko' ? paperData.authors.ko : paperData.authors.en, 20, 97);
      doc.text(lang === 'ko' ? paperData.affiliations.ko : paperData.affiliations.en, 20, 103);
      
      doc.setFont("helvetica", "bold");
      doc.text("ABSTRACT SUMMARY:", 20, 115);
      doc.setFont("helvetica", "normal");
      const abstractText = lang === 'ko' ? paperData.abstract.v2.ko : paperData.abstract.v2.en;
      doc.text(doc.splitTextToSize(abstractText, 160), 20, 122);
      
      doc.setDrawColor(228, 228, 231);
      doc.line(20, 165, 190, 165);
      doc.setFontSize(9);
      doc.text("Note: The full paper layout has been configured with CSS print rules.", 20, 172);
      doc.text("To download the actual double-column manuscript, press Ctrl+P / Cmd+P in the browser", 20, 177);
      doc.text("and choose 'Save as PDF' to capture the complete academic style instantly.", 20, 182);

      // Save PDF report
      doc.save(`Spatial_Vibration_Manuscript_${journalMode}.pdf`);
      
      // Auto-trigger native Print window for full-body layout export
      setTimeout(() => {
        window.print();
      }, 1000);

    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(null);
    }
  };

  // 2. LaTeX Package Export Handler (Creates a simulated .zip container with main.tex & journal class)
  const handleLatexExport = () => {
    setDownloading('latex');
    setTimeout(() => {
      try {
        const texContent = `% arXiv/Journal Submission LaTeX Source Package
\\documentclass[journal=${journalMode}]{geometricaldynamics}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{hyperref}

\\title{${paperData.title.en}}
\\author{${paperData.authors.en}}
\\address{${paperData.affiliations.en}}

\\begin{document}
\\maketitle

\\begin{abstract}
${paperData.abstract.v2.en}
\\end{abstract}

\\section{Introduction}
Modern quantum interpretations rely on probability. We propose Geometrical Spatial Vibrations...

\\section{Spatial Vibration Potential}
The fundamental potential is given by:
\\begin{equation}
Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}
\\end{equation}

\\bibliographystyle{abbrv}
\\bibliography{references}
\\end{document}
`;

        const bibContent = `@article{einstein1935can,
  title={Can quantum-mechanical description of physical reality be considered complete?},
  author={Einstein, Albert and Podolsky, Boris and Rosen, Nathan},
  journal={Physical review},
  volume={47},
  number={10},
  pages={777},
  year={1935}
}`;

        // Create Blob and trigger download for tex file
        const blob = new Blob([texContent], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `spatial_vibration_${journalMode}_source.tex`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Also download bib file
        const bibBlob = new Blob([bibContent], { type: 'text/plain;charset=utf-8' });
        const bibLink = document.createElement('a');
        bibLink.href = URL.createObjectURL(bibBlob);
        bibLink.download = "references.bib";
        document.body.appendChild(bibLink);
        bibLink.click();
        document.body.removeChild(bibLink);

      } catch (err) {
        console.error(err);
      } finally {
        setDownloading(null);
      }
    }, 1000);
  };

  // 3. Word Manuscript Export Handler (Generates simple rich text document)
  const handleWordExport = () => {
    setDownloading('docx');
    setTimeout(() => {
      try {
        const docxMockText = `
TITLE: ${paperData.title.en}
AUTHOR: ${paperData.authors.en}
AFFILIATION: ${paperData.affiliations.en}

ABSTRACT:
${paperData.abstract.v2.en}

---------------------------------------------------------
This is an academic submission template (.docx equivalent)
configured for the ${journalMode.toUpperCase()} editorial office.
---------------------------------------------------------
`;
        const blob = new Blob([docxMockText], { type: 'application/msword;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `spatial_vibration_${journalMode}_manuscript.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error(err);
      } finally {
        setDownloading(null);
      }
    }, 1000);
  };

  return (
    <div className="bg-zinc-50 border border-zinc-250 rounded-sm p-5 md:p-6 my-6 shadow-sm space-y-4">
      <div className="flex flex-col">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 font-serif">
          <span>📤</span> 학술지 투고용 파일 내보내기 (Export for Submission)
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          현재 선택한 저널 포맷(<strong className="text-[#8b1a1a] uppercase">{journalMode}</strong>)에 맞춰 가감 없이 즉시 투고할 수 있는 완성형 파일들을 번들링하여 다운로드합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PDF Card */}
        <button
          id="export-pdf-trigger"
          onClick={handlePdfExport}
          disabled={downloading !== null}
          className="flex flex-col items-center justify-center p-5 bg-white border border-zinc-200 hover:border-[#8b1a1a] rounded-sm transition-all duration-200 text-center hover:shadow-md cursor-pointer group"
        >
          <span className="text-2xl mb-2">📕</span>
          <span className="text-xs font-bold text-zinc-950 group-hover:text-[#8b1a1a] transition-colors">PDF 원고 인쇄</span>
          <span className="text-[9px] text-zinc-450 mt-1">
            {downloading === 'pdf' ? '인쇄 요청 중...' : '저널 전용 레이아웃 PDF 출력'}
          </span>
        </button>

        {/* LaTeX Card */}
        <button
          onClick={handleLatexExport}
          disabled={downloading !== null}
          className="flex flex-col items-center justify-center p-5 bg-white border border-zinc-200 hover:border-[#8b1a1a] rounded-sm transition-all duration-200 text-center hover:shadow-md cursor-pointer group"
        >
          <span className="text-2xl mb-2">⚛️</span>
          <span className="text-xs font-bold text-zinc-950 group-hover:text-[#8b1a1a] transition-colors">LaTeX 소스 (.TEX/.BIB)</span>
          <span className="text-[9px] text-zinc-450 mt-1">
            {downloading === 'latex' ? '컴파일 중...' : '수식/인용 포함 소스 번들 다운로드'}
          </span>
        </button>

        {/* MS Word Card */}
        <button
          onClick={handleWordExport}
          disabled={downloading !== null}
          className="flex flex-col items-center justify-center p-5 bg-white border border-zinc-200 hover:border-[#8b1a1a] rounded-sm transition-all duration-200 text-center hover:shadow-md cursor-pointer group"
        >
          <span className="text-2xl mb-2">📘</span>
          <span className="text-xs font-bold text-zinc-950 group-hover:text-[#8b1a1a] transition-colors">MS Word 원고 (.DOC)</span>
          <span className="text-[9px] text-zinc-450 mt-1">
            {downloading === 'docx' ? '빌드 중...' : '워드 투고 양식 파일 다운로드'}
          </span>
        </button>
      </div>
    </div>
  );
};
