import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { NovelParagraph, NovelScene } from './novelData';

export interface TranslationComparisonRow {
  position: number;
  ko_unit_id: string;
  ko_version_id: string;
  ko_body: string;
  separator_after: string;
  alignment_id: string;
  en_unit_id: string;
  en_version_id: string;
  en_body: string;
  en_body_sha256: string;
  en_latest_version_id: string | null;
  en_latest_body: string | null;
  en_latest_body_sha256: string | null;
  en_status: 'unchanged' | 'changed' | 'unavailable';
}

export interface TranslationComparison {
  format: string;
  managed_scene_id: string;
  scene_id: string;
  source_key: string;
  ko_composition_id: string;
  ko_body_sha256: string;
  ko_body: string;
  ko_title: string;
  en_document_id: string;
  en_document_slug: string;
  en_scene_id: string;
  en_title: string;
  en_body: string;
  en_body_sha256: string;
  en_terminal_lf: number;
  changed_count: number;
  unavailable_count?: number;
  en_latest_structure_changed?: boolean;
  latest_status: string;
  rows: TranslationComparisonRow[];
}

const buttonClass = 'rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 disabled:opacity-40 disabled:cursor-not-allowed';

export function BilingualBlockText({ body }: { body: string }) {
  return <div className="novel-math-prose prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed">
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{body}</ReactMarkdown>
  </div>;
}

interface Props {
  scene: NovelScene;
  comparison: TranslationComparison | null;
  loading: boolean;
  error: string;
  fontSizeClass: string;
  comments: any[];
  onRetry: () => void;
  onClose: () => void;
  onSelectBlock: (paragraph: NovelParagraph) => void;
  onOpenBlock: (paragraph: NovelParagraph) => void;
  onBuildPacket: () => Promise<{ payload: any; markdown: string }>;
}

/** One shared grid row per verified block pair; English is never an editor target. */
export function NovelBilingualReader({ scene, comparison, loading, error, fontSizeClass, comments, onRetry, onClose, onSelectBlock, onOpenBlock, onBuildPacket }: Props) {
  const [englishMode, setEnglishMode] = useState<'source' | 'latest'>('source');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [packet, setPacket] = useState<{ payload: any; markdown: string } | null>(null);
  const [packetBusy, setPacketBusy] = useState(false);
  const [packetError, setPacketError] = useState('');
  const captureSequence = React.useRef(0);
  const paragraphsByUnit = React.useMemo(() => new Map(scene.paragraphs.map(paragraph => [paragraph.unitId || paragraph.id, paragraph])), [scene.paragraphs]);
  const commentCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const comment of comments) if (!['resolved', 'withdrawn'].includes(comment.status)) counts.set(comment.block_unit_id, (counts.get(comment.block_unit_id) || 0) + 1);
    return counts;
  }, [comments]);
  React.useEffect(() => () => { captureSequence.current += 1; }, []);

  const capturePacket = async () => {
    const sequence = ++captureSequence.current;
    setPacketBusy(true); setPacketError(''); setPacket(null);
    try {
      const next = await onBuildPacket();
      if (sequence === captureSequence.current) setPacket(next);
    } catch (caught) {
      if (sequence === captureSequence.current) setPacketError(caught instanceof Error ? caught.message : '영한 검토 패키지를 만들지 못했습니다.');
    } finally {
      if (sequence === captureSequence.current) setPacketBusy(false);
    }
  };
  const download = (kind: 'md' | 'json') => {
    if (!packet) return;
    const text = kind === 'md' ? packet.markdown : `${JSON.stringify(packet.payload, null, 2)}\n`;
    const objectUrl = URL.createObjectURL(new Blob([text], { type: kind === 'md' ? 'text/markdown;charset=utf-8' : 'application/json;charset=utf-8' }));
    const link = document.createElement('a');
    const packetId = String(packet.payload.packet_id || 'captured').replace(/[^a-zA-Z0-9_-]/g, '-');
    link.href = objectUrl; link.download = `${scene.id}-bilingual-review-${packetId}.${kind}`;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  return <section aria-label="영한 번역 비교" data-bilingual-scene-id={scene.id} data-ko-composition-id={comparison?.ko_composition_id} className="space-y-4 rounded-xl border border-sky-800/60 bg-zinc-950/40 p-3 sm:p-4">
    <header className="space-y-3 border-b border-zinc-800 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><h5 className="font-semibold text-sky-200">영한 비교 · 같은 Scene / 대응 블록</h5><button type="button" className={buttonClass} onClick={onClose}>국문 읽기로 돌아가기</button></div>
      <p className="text-xs leading-5 text-zinc-400">문장 수가 같다는 뜻이 아닙니다. 고정된 영문 Unit·Version 대응으로 문단·대사·수식을 함께 읽습니다. 오른쪽 영문은 읽기 전용이며, 코멘트와 수정은 한국어에만 저장합니다.</p>
      {comparison && <>
        <dl className="grid gap-2 break-all text-xs text-zinc-400 md:grid-cols-2"><div><dt className="text-zinc-200">KO {scene.managedReadOnly ? '과거 구성 · 읽기 전용' : '표시 중인 review 구성'}</dt><dd>{comparison.ko_composition_id}</dd><dd>SHA {comparison.ko_body_sha256}</dd></div><div><dt className="text-zinc-200">EN 번역 기준 · 각 블록의 고정 Version</dt><dd>{comparison.en_title} · {comparison.en_document_slug}</dd><dd>SHA {comparison.en_body_sha256} · 끝 LF {comparison.en_terminal_lf}</dd></div></dl>
        <div className="flex flex-wrap items-center gap-2"><label className="text-xs text-zinc-300" htmlFor={`english-mode-${scene.id}`}>오른쪽 영문</label><select id={`english-mode-${scene.id}`} value={englishMode} onChange={event => setEnglishMode(event.target.value as 'source' | 'latest')} className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200"><option value="source">번역 기준 영문 (고정)</option><option value="latest">조회 시점의 최신 EN Reader</option></select><span className="text-xs text-amber-200">기준 이후 변경 {comparison.changed_count}블록 · 미확인 {comparison.unavailable_count || 0}블록</span></div>
        {comparison.en_latest_structure_changed && <p className="text-xs text-amber-200">최신 EN의 블록 구성·순서가 기준과 다릅니다. 아래는 고정 대응의 순서이며 최신 EN Scene 전체를 재현한 배열이 아닙니다.</p>}
        {englishMode === 'latest' && <p className="text-xs text-amber-200">최신 영문은 번역 기준이 아닐 수 있습니다. 대응을 확인할 수 없는 블록은 미확인으로 표시하며 기준 영문으로 자동 대체하지 않습니다.</p>}
        <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"><div className="flex flex-wrap gap-2"><button type="button" className={buttonClass} disabled={packetBusy || scene.managedReadOnly} onClick={() => void capturePacket()}>{packetBusy ? '검토본 확인 중…' : packet ? '새 영한 검토 패키지 만들기' : '영한 검토 패키지 만들기'}</button><button type="button" className={buttonClass} disabled={!packet || packetBusy} onClick={() => download('md')}>동일 묶음 MD 다운로드</button><button type="button" className={buttonClass} disabled={!packet || packetBusy} onClick={() => download('json')}>동일 묶음 JSON 다운로드</button></div><p className="text-xs leading-5 text-zinc-400">국문 전문·고정 기준 영문·대응표·포함 지침/코멘트를 한 번 캡처합니다. 두 다운로드는 같은 묶음을 사용합니다. 이후 저장한 변경을 포함하려면 새로 만드세요. 최신 EN 비교 선택은 번역 기준을 바꾸지 않습니다.</p>{packet && <p className="break-all text-xs text-sky-200">묶음 ID: {packet.payload.packet_id || '미기록'} · 캡처된 검토본이며 이후 최신성은 보장하지 않습니다.</p>}{packetError && <p role="alert" className="text-sm text-red-300">{packetError}</p>}</div>
      </>}
    </header>
    {loading && <p role="status" className="p-4 text-sm text-sky-200">권한과 구성·영한 대응을 확인하고 있습니다…</p>}
    {error && <div role="alert" className="space-y-2 rounded-lg border border-red-900 bg-red-950/30 p-4 text-sm text-red-200"><p>{error}</p><p className="text-xs">확인하지 못한 영문을 제목·배열 순서로 추정해 표시하지 않습니다.</p><button type="button" onClick={onRetry} className={buttonClass}>다시 확인</button></div>}
    {!loading && !error && comparison && <div className="space-y-4">
      <div className="hidden grid-cols-2 gap-4 text-sm font-semibold text-zinc-300 md:grid"><p>한국어 · 검토/수정</p><p>영어 · {englishMode === 'source' ? '번역 기준' : '조회 시점 최신'} · 읽기 전용</p></div>
      {comparison.rows.map(row => {
        const paragraph = paragraphsByUnit.get(row.ko_unit_id);
        if (!paragraph) return null; // The client validator rejects this before rendering.
        const isSelected = selectedId === row.ko_unit_id;
        const englishBody = englishMode === 'source' ? row.en_body : row.en_latest_body;
        const englishVersion = englishMode === 'source' ? row.en_version_id : row.en_latest_version_id;
        const commentCount = commentCounts.get(row.ko_unit_id) || 0;
        const choose = () => { setSelectedId(row.ko_unit_id); onSelectBlock(paragraph); };
        return <article key={row.ko_unit_id} data-alignment-id={row.alignment_id} data-bilingual-position={row.position} className={`grid gap-0 overflow-hidden rounded-lg border md:grid-cols-2 ${isSelected ? 'border-sky-400 bg-sky-950/20 ring-1 ring-sky-500/30' : 'border-zinc-800 bg-zinc-900/20'}`}>
          <div id={`paragraph-${paragraph.id}`} data-managed-block-id={paragraph.id} data-managed-unit-id={row.ko_unit_id} data-managed-position={paragraph.sourceKey} onClick={choose} className={`min-w-0 space-y-3 p-4 ${fontSizeClass}`}>
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-sky-300">KO B{String(row.position).padStart(4, '0')}{commentCount ? ` · 💬 ${commentCount}` : ''}</span><button type="button" className={buttonClass} disabled={scene.managedReadOnly} onClick={event => { event.stopPropagation(); choose(); onOpenBlock(paragraph); }} aria-label={`B${String(row.position).padStart(4, '0')} 한국어 검토 및 수정`}>{scene.managedReadOnly ? '과거판 · 읽기 전용' : '검토 · 수정'}</button></div>
            <BilingualBlockText body={row.ko_body} />
            <details className="text-[10px] text-zinc-500"><summary className="cursor-pointer">KO Unit·Version</summary><p className="break-all">{row.ko_unit_id}<br />{row.ko_version_id}</p></details>
          </div>
          <div lang="en" data-en-unit-id={row.en_unit_id} data-en-version-id={englishVersion || undefined} onClick={choose} className={`min-w-0 space-y-3 border-t border-zinc-800 bg-zinc-950/40 p-4 md:border-l md:border-t-0 ${fontSizeClass}`}>
            <p className="text-xs text-emerald-300">EN · {englishMode === 'source' ? '고정 기준' : '조회 시점 최신'} · 읽기 전용 {row.en_status === 'changed' ? '· 기준 이후 변경 있음' : row.en_status === 'unavailable' ? '· 최신 대응 미확인' : ''}</p>
            {typeof englishBody === 'string' ? <BilingualBlockText body={englishBody} /> : <p role="status" className="text-sm text-amber-200">최신 EN 대응을 확인할 수 없습니다. 고정 기준은 위 선택기에서 별도로 확인하세요.</p>}
            <details className="text-[10px] text-zinc-500"><summary className="cursor-pointer">EN Unit·Version</summary><p className="break-all">{row.en_unit_id}<br />{englishVersion || '미확인'}</p></details>
          </div>
        </article>;
      })}
    </div>}
  </section>;
}
