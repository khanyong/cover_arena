import React, { useState } from 'react';

export const CitationGenerator: React.FC = () => {
  const [activeFormat, setActiveFormat] = useState<'bibtex' | 'ieee' | 'apa'>('bibtex');
  const [copied, setCopied] = useState(false);

  const citationData = {
    title: "Mechanics of Spatial Vibration I: Origin of Wave-Particle Duality and Reinterpretation of Trajectories in the Double-Slit Experiment",
    authors: "Kim, Khanyong",
    journal: "Journal of Advanced Geometrical Dynamics",
    volume: "12",
    number: "3",
    pages: "201-218",
    year: "2026",
    url: "https://cover-arena.khanyong.net/papers/spatial-vibration-1"
  };

  const getCitationText = () => {
    switch (activeFormat) {
      case 'bibtex':
        return `@article{kim2026spatial1,
  author  = {${citationData.authors}},
  title   = {${citationData.title}},
  journal = {${citationData.journal}},
  year    = {${citationData.year}},
  volume  = {${citationData.volume}},
  number  = {${citationData.number}},
  pages   = {${citationData.pages}},
  url     = {${citationData.url}}
}`;
      case 'ieee':
        return `K. Kim, "${citationData.title}," ${citationData.journal}, vol. ${citationData.volume}, no. ${citationData.number}, pp. ${citationData.pages}, ${citationData.year}.`;
      case 'apa':
        return `Kim, K. (${citationData.year}). ${citationData.title}. ${citationData.journal}, ${citationData.volume}(${citationData.number}), ${citationData.pages}. ${citationData.url}`;
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCitationText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  return (
    <div className="bg-zinc-50 border border-zinc-250 rounded-sm p-5 md:p-6 my-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 font-serif">
          <span>📚</span> 논문 인용 학술 포맷 복사 (Cite this Paper)
        </h3>
        <span className="text-[10px] text-zinc-450 font-mono">Format Selector</span>
      </div>

      <div className="flex gap-1.5">
        {(['bibtex', 'ieee', 'apa'] as const).map((format) => (
          <button
            key={format}
            onClick={() => setActiveFormat(format)}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-sm uppercase transition-all border ${
              activeFormat === format
                ? 'bg-[#8b1a1a] text-white border-[#8b1a1a] shadow-xs'
                : 'bg-white text-zinc-650 hover:text-zinc-900 border-zinc-200'
            }`}
          >
            {format}
          </button>
        ))}
      </div>

      <div className="relative bg-white border border-zinc-200 rounded-sm p-4">
        <pre className="text-xs text-zinc-800 font-mono whitespace-pre-wrap break-all select-all leading-relaxed bg-zinc-50/20 p-2 border border-zinc-100 rounded-xs">
          {getCitationText()}
        </pre>

        <button
          onClick={handleCopy}
          className="absolute top-6 right-6 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-semibold rounded-sm border border-zinc-300 transition-all flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <span className="text-emerald-600">✓</span> 복사 완료
            </>
          ) : (
            <>
              <span>📋</span> 클립보드 복사
            </>
          )}
        </button>
      </div>
    </div>
  );
};
