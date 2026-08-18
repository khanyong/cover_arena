import React, { useState } from 'react';
import { NovelDetails, getParagraphText } from './novelData';

interface NovelMosaicMixerProps {
  novel: NovelDetails;
  customVersionMap: Record<string, string>; // paragraphId -> selected version
}

export const NovelMosaicMixer: React.FC<NovelMosaicMixerProps> = ({
  novel,
  customVersionMap
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedDownloadAct, setSelectedDownloadAct] = useState<string>('all');

  // 선택된 버전들의 조합으로 완성된 전체 소설 마스터 텍스트 빌드
  const buildFullNovelText = () => {
    let fullText = `# ${novel.title}\n`;
    if (novel.subtitle) fullText += `## ${novel.subtitle}\n`;
    fullText += `저자: ${novel.author}\n\n`;
    fullText += `---\n\n`;

    for (const act of novel.acts) {
      fullText += `# ${act.title}\n\n`;
      if (act.summary) {
        fullText += `${act.summary}\n\n`;
      }
      for (const ch of act.chapters) {
        fullText += `## ${ch.title}\n\n`;
        if (ch.synopsis) {
          fullText += `${ch.synopsis}\n\n`;
        }
        for (const scene of ch.scenes || []) {
          for (const p of scene.paragraphs || []) {
            const versionKey = customVersionMap[p.id] || p.activeVersion;
            const pText = getParagraphText(p, versionKey);
            fullText += `${pText}\n\n`;
          }
        }
      }
    }
    return fullText;
  };

  const masterText = buildFullNovelText();

  const handleCopy = () => {
    navigator.clipboard.writeText(masterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([masterText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${novel.title}_최종조합본.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const buildActText = (act: any) => {
    let actText = `# ${act.title}\n\n`;
    if (act.summary) {
      actText += `${act.summary}\n\n`;
    }
    for (const ch of act.chapters) {
      actText += `## ${ch.title}\n\n`;
      if (ch.synopsis) {
        actText += `${ch.synopsis}\n\n`;
      }
      for (const scene of ch.scenes || []) {
        for (const p of scene.paragraphs || []) {
          const versionKey = customVersionMap[p.id] || p.activeVersion;
          const pText = getParagraphText(p, versionKey);
          actText += `${pText}\n\n`;
        }
      }
    }
    return actText;
  };

  const handleDownloadAct = (act: any) => {
    const actText = buildActText(act);
    const element = document.createElement("a");
    const file = new Blob([actText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${novel.title}_${act.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
            <span>✨</span> 소설 단락 조합 & 최종본 스튜디오 (Master Draft)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            각 막·장·단락별로 선택된 최고의 버전을 조합하여 완성된 소설의 마스터 텍스트입니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 border border-zinc-700 shrink-0"
          >
            {copied ? '✅ 클립보드 복사 완료!' : '📋 전체 복사'}
          </button>
          
          <div className="flex items-center gap-2 border-l border-zinc-700 pl-3">
            <select 
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-3 py-2 rounded-lg font-medium outline-none cursor-pointer focus:border-amber-500"
              value={selectedDownloadAct}
              onChange={(e) => setSelectedDownloadAct(e.target.value)}
            >
              <option value="all">전체 소설 포함</option>
              {novel.acts.map(act => (
                <option key={act.number} value={act.number.toString()}>
                  {act.title}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => {
                if (selectedDownloadAct === 'all') {
                  handleDownload();
                } else {
                  const act = novel.acts.find(a => a.number === parseInt(selectedDownloadAct));
                  if (act) handleDownloadAct(act);
                }
              }}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/10 shrink-0"
            >
              📥 텍스트 저장 (.txt)
            </button>
          </div>
        </div>
      </div>

      {/* 구성 조합 요약 테이블 */}
      <div className="mb-6 bg-zinc-900/80 rounded-xl p-4 border border-zinc-800">
        <h3 className="text-xs font-semibold text-zinc-300 mb-3 flex items-center gap-1">
          <span>🧩</span> 선택된 단락별 버전 구성 조합 (Mosaic Version Selection):
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {novel.acts.flatMap(a => a.chapters.flatMap(c => (c.scenes || []).flatMap(s => s.paragraphs || []))).map(p => {
            const ver = customVersionMap[p.id] || p.activeVersion;
            return (
              <div key={p.id} className="bg-zinc-950 px-3 py-2 rounded border border-zinc-800 flex justify-between items-center">
                <span className="font-mono text-zinc-400">{p.id}</span>
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                  {ver}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 마스터 텍스트 최종 뷰어 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-h-[500px] overflow-y-auto font-sans leading-relaxed text-zinc-200 space-y-4">
        {novel.acts.map(act => (
          <div key={act.number} className="space-y-4 mb-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-lg font-bold text-amber-400">
                {act.title}
              </h3>
            </div>
            {act.chapters.map(ch => (
              <div key={ch.number} className="space-y-3 pl-2">
                <h4 className="text-base font-semibold text-zinc-300 flex items-center gap-2">
                  {ch.title}
                  <span className="text-xs font-normal bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                    {(() => {
                      const chText = (ch.scenes || []).flatMap(s => s.paragraphs || []).map(p => getParagraphText(p, customVersionMap[p.id] || p.activeVersion)).join(' ');
                      const charCount = chText.replace(/\s/g, '').length;
                      const wordCount = chText.trim() === '' ? 0 : chText.trim().split(/\s+/).length;
                      return `${wordCount}단어 / 공백제외 ${charCount}자`;
                    })()}
                  </span>
                </h4>
                {(ch.scenes || []).flatMap(s => s.paragraphs || []).map(p => {
                  const verKey = customVersionMap[p.id] || p.activeVersion;
                  const text = getParagraphText(p, verKey);
                  return (
                    <p key={p.id} className="text-zinc-100 text-sm leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-amber-500/30">
                      {text}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

