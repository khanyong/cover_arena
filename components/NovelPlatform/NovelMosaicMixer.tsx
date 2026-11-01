import React, { useState } from 'react';
import {supabase} from '../../shared/lib/supabase';
import { NovelDetails, getParagraphText, getSceneTitle } from './novelData';

interface NovelMosaicMixerProps {
  novel: NovelDetails;
  language?: string;
  customVersionMap: Record<string, string>; // paragraphId -> selected version
}

export const NovelMosaicMixer: React.FC<NovelMosaicMixerProps> = ({
  novel,
  customVersionMap, language = 'ko'
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedDownloadAct, setSelectedDownloadAct] = useState<string>('all');

  const [exportStatus, setExportStatus] = useState('');
  const [exporting, setExporting] = useState(false);
  const downloadRevised = async () => {
    setExporting(true); setExportStatus('권한과 수정 후판을 확인하고 있습니다…');
    try {
      const {data} = await supabase.auth.getSession();
      if (!data.session) throw new Error('로그인이 필요합니다.');
      const headers = {Authorization: `Bearer ${data.session.access_token}`};
      const catalogResponse = await fetch('/api/novel-local-review?list=1', {headers, cache:'no-store'});
      if (!catalogResponse.ok) throw new Error('로컬 검토판 목록을 읽을 수 없습니다.');
      const catalog = await catalogResponse.json();
      const reviews = new Map<string, any>();
      for (const item of catalog.reviews) {
        const response = await fetch(`/api/novel-local-review?id=${encodeURIComponent(item.id)}`, {headers, cache:'no-store'});
        if (!response.ok) throw new Error(`${item.id} 조회 실패 — 다운로드를 중단했습니다.`);
        const review = await response.json();
        const key = review.manifest.managedSceneId;
        if (reviews.has(key)) throw new Error('동일 장면에 여러 리비전이 있습니다. 적용판을 확정해야 합니다.');
        reviews.set(key, review);
      }
      const audit:string[] = [], body:string[] = [`# ${novel.title}`];
      const used = new Set<string>();
      for (const act of novel.acts) {
        body.push(`# ${act.title}`);
        for (const chapter of act.chapters) {
          body.push(`## ${chapter.title}`);
          for (const scene of chapter.scenes || []) {
            const review = reviews.get(scene.managedSceneId || '') || [...reviews.values()].find(r => r.manifest.scene === scene.managedSourceKey || r.manifest.legacySceneId === scene.id);
            body.push(`### ${getSceneTitle(scene, customVersionMap) || scene.title || scene.id}`);
            if (review) {
              used.add(review.manifest.id);
              body.push(...review.after.map((block:any) => block[language === 'en' ? 'en' : 'ko']));
              audit.push(`${review.manifest.id} | 로컬 수정 후판 | ${review.manifest.files.after}`);
            } else {
              body.push(...scene.paragraphs.map(p => getParagraphText(p, customVersionMap[p.id] || p.activeVersion)));
              audit.push(`${scene.id} | 로컬 후판 미적용 — 현재 Reader 선택 본문 유지`);
            }
          }
        }
      }
      const unmatched = [...reviews.values()].filter(r => !used.has(r.manifest.id));
      if (unmatched.length) throw new Error(`Reader에 연결되지 않은 검토판 ${unmatched.length}개: ${unmatched.map(r=>r.manifest.id).join(', ')}. 불완전한 전권 다운로드를 중단했습니다.`);
      const text = ['비공개 전권 검토 조합본 — 문안 채택·온라인 게시 아님', ...audit, '---', ...body].join('\n\n');
      const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
      const link = document.createElement('a'); link.href=url; link.download=`ROS_로컬수정후판_${language}.txt`; link.click(); URL.revokeObjectURL(url);
      setExportStatus(`로컬 후판 ${used.size}장면 적용. 나머지는 파일 머리말에 현재 Reader 본문 유지로 표시했습니다.`);
    } catch (error) { setExportStatus(error instanceof Error ? error.message : '다운로드 실패'); }
    finally { setExporting(false); }
  };

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
          const sceneTitle = getSceneTitle(scene, customVersionMap);
          if (sceneTitle) {
            fullText += `### ${sceneTitle}\n\n`;
          }
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
        const sceneTitle = getSceneTitle(scene, customVersionMap);
        if (sceneTitle) {
          actText += `### ${sceneTitle}\n\n`;
        }
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

      {process.env.NODE_ENV === 'development' && <div className="mb-5 p-4 border border-emerald-700 rounded-xl">
        <button disabled={exporting} onClick={downloadRevised} className="bg-emerald-700 px-4 py-2 rounded text-white disabled:opacity-50">{exporting ? '수정본 구성 중…' : '📥 로컬 수정 후판 포함 · 전권 다운로드'}</button>
        <p className="text-xs text-zinc-300 mt-2">현재 언어의 비공개 검토본입니다. 로컬 후판이 없는 장면·부록은 현재 Reader 본문을 유지하며, 적용 목록을 파일에 포함합니다.</p>
        <p role="status" className="text-sm mt-2">{exportStatus}</p>
      </div>}
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
                {(ch.scenes || []).map(scene => {
                  const sTitle = getSceneTitle(scene, customVersionMap);
                  return (
                    <div key={scene.id} className="space-y-3 pt-2">
                      {sTitle && (
                        <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 pt-2 pb-1 border-t border-zinc-800/80">
                          <span className="text-[10px] text-zinc-500 font-mono">SCENE</span>
                          {sTitle}
                        </h5>
                      )}
                      {(scene.paragraphs || []).map(p => {
                        const verKey = customVersionMap[p.id] || p.activeVersion;
                        const text = getParagraphText(p, verKey);
                        return (
                          <p key={p.id} className="text-zinc-100 text-sm leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-amber-500/30">
                            {text}
                          </p>
                        );
                      })}
                    </div>
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

