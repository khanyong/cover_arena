import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { NovelSideBySideDiff } from '../../components/NovelPlatform/NovelSideBySideDiff';
import { novelsMap, initialNovelData } from '../../components/NovelPlatform/novelData';

export default function NovelDiffToolPage() {
  // 프리셋 소설 선택 상태
  const [selectedNovelKey, setSelectedNovelKey] = useState<string>('spatial-vibration-novel');
  const currentNovel = novelsMap[selectedNovelKey] || initialNovelData;

  // 좌측/우측에 로드할 챕터 및 버전 선택 상태 (actNumber, chapterNumber)
  const [leftActNumber, setLeftActNumber] = useState<number>(currentNovel.acts[0]?.number || 1);
  const [leftChapterNumber, setLeftChapterNumber] = useState<number>(
    currentNovel.acts[0]?.chapters[0]?.number || 1
  );
  const [leftVersion, setLeftVersion] = useState<string>('v1.0');

  const [rightActNumber, setRightActNumber] = useState<number>(currentNovel.acts[0]?.number || 1);
  const [rightChapterNumber, setRightChapterNumber] = useState<number>(
    currentNovel.acts[0]?.chapters[0]?.number || 1
  );
  const [rightVersion, setRightVersion] = useState<string>('v2.0');

  // 실제 diff에 주입되는 텍스트 상태
  const [leftText, setLeftText] = useState<string>(() => {
    return extractChapterText(currentNovel, leftActNumber, leftChapterNumber, leftVersion);
  });
  const [rightText, setRightText] = useState<string>(() => {
    return extractChapterText(currentNovel, rightActNumber, rightChapterNumber, rightVersion);
  });

  const [leftLabel, setLeftLabel] = useState<string>('버전 A (이전 초안)');
  const [rightLabel, setRightLabel] = useState<string>('버전 B (수정/신규 초안)');

  // 챕터 내 단락들을 특정 버전 기준으로 합쳐 하나의 텍스트로 추출
  function extractChapterText(
    novel: typeof currentNovel,
    actNum: number,
    chNum: number,
    ver: string
  ): string {
    const act = novel.acts.find(a => a.number === actNum);
    if (!act) return '';
    const chapter = act.chapters.find(c => c.number === chNum);
    if (!chapter) return '';

    return chapter.paragraphs
      .map(p => {
        if (p.versions && p.versions[ver]?.content) {
          return p.versions[ver].content;
        }
        if (p.activeVersion && p.versions && p.versions[p.activeVersion]?.content) {
          return p.versions[p.activeVersion].content;
        }
        const firstVer = Object.keys(p.versions || {})[0];
        return (firstVer && p.versions[firstVer]?.content) || '';
      })
      .filter(Boolean)
      .join('\n\n');
  }

  // 좌측 프리셋 로드
  const handleLoadLeftPreset = () => {
    const text = extractChapterText(currentNovel, leftActNumber, leftChapterNumber, leftVersion);
    setLeftText(text);
    const chapter = currentNovel.acts
      .find(a => a.number === leftActNumber)
      ?.chapters.find(c => c.number === leftChapterNumber);
    setLeftLabel(`${chapter?.title || '챕터'} [${leftVersion}]`);
  };

  // 우측 프리셋 로드
  const handleLoadRightPreset = () => {
    const text = extractChapterText(currentNovel, rightActNumber, rightChapterNumber, rightVersion);
    setRightText(text);
    const chapter = currentNovel.acts
      .find(a => a.number === rightActNumber)
      ?.chapters.find(c => c.number === rightChapterNumber);
    setRightLabel(`${chapter?.title || '챕터'} [${rightVersion}]`);
  };

  // 샘플 비교 텍스트 불러오기
  const handleLoadSample = () => {
    const sampleA = `제1장. 별빛의 침묵

성벽 너머로 붉은 저녁 노을이 천천히 저물어가고 있었다.
성벽 위에 선 카엘은 차가운 바람을 맞으며 말없이 검자루를 쥐었다.
"이번 겨울은 유난히 길 것 같군."
그의 곁으로 다가온 늙은 기사 바론이 나직한 목소리로 중얼거렸다.
카엘은 대답하지 않았다. 다만 북쪽의 검은 산맥을 응시할 뿐이었다.`;

    const sampleB = `제1장. 별빛의 침묵

성벽 너머로 핏빛 붉은 저녁 노을이 무겁게 가라앉고 있었다.
성벽 최상층 망루에 선 카엘은 뼛속까지 파고드는 밤바람을 맞으며 떨리는 손으로 가문의 보검을 고쳐 쥐었다.
"이번 겨울은 유난히 혹독하고 길 것 같군. 북부의 마수들이 벌써 움직이기 시작했어."
그의 등 뒤로 다가온 백전노장 바론 경이 거친 숨을 몰아쉬며 경고하듯 읊조렸다.
카엘은 침묵을 지켰다. 그의 시선은 오직 안개에 뒤덮인 채 웅크린 북쪽의 거대한 흑산맥을 향해 고정되어 있었다.
침묵 끝에, 그가 마침내 결단을 내린 듯 입을 열었다.`;

    setLeftText(sampleA);
    setRightText(sampleB);
    setLeftLabel('초기 초안 (v1.0)');
    setRightLabel('문체 보강 및 심리 묘사 수정본 (v2.0)');
  };

  // 챕터 목록 추출
  const leftAct = currentNovel.acts.find(a => a.number === leftActNumber) || currentNovel.acts[0];
  const rightAct = currentNovel.acts.find(a => a.number === rightActNumber) || currentNovel.acts[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-16">
      <Head>
        <title>소설 버전 비교 & 채택 스튜디오 | Side-by-Side Diff</title>
        <meta
          name="description"
          content="소설 챕터의 이전 버전과 현재 버전을 나란히(Side-by-Side) 놓고 라인별, 단어별 차이를 실시간 비교 및 최종 채택하는 전문 집필 도구입니다."
        />
      </Head>

      {/* 상단 네비게이션 */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/novel"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <span>←</span> 소설 목록으로
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <div>
              <h1 className="text-base font-bold text-amber-400">
                소설 버전 분할 비교 & 채택 스튜디오
              </h1>
              <p className="text-[11px] text-zinc-400">
                두 버전의 챕터를 나란히 놓고 라인별·어휘별 차이점을 비교하고 최선의 문장을 채택하세요
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSample}
            className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            💡 샘플 챕터 불러오기
          </button>
        </div>
      </header>

      {/* 프리셋 로더 & 안내 섹션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-xl p-4 mb-6 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 mb-3 border-b border-zinc-800 text-xs">
            <span className="font-bold text-zinc-300 flex items-center gap-1.5">
              <span>📚</span> 프로젝트에 등록된 챕터 로드하기
            </span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">소설 선택:</span>
              <select
                value={selectedNovelKey}
                onChange={e => setSelectedNovelKey(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 text-amber-300 font-semibold rounded px-2.5 py-1"
              >
                {Object.entries(novelsMap).map(([key, nov]) => (
                  <option key={key} value={key}>
                    {nov.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 좌측 챕터 선택 */}
            <div className="bg-zinc-950/60 p-3 rounded-lg border border-rose-500/20 flex flex-wrap items-center justify-between gap-2">
              <span className="text-rose-300 font-semibold">◀ 좌측 불러올 챕터:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <select
                  value={leftActNumber}
                  onChange={e => {
                    const num = parseInt(e.target.value, 10) || 1;
                    setLeftActNumber(num);
                    const act = currentNovel.acts.find(a => a.number === num);
                    if (act && act.chapters[0]) setLeftChapterNumber(act.chapters[0].number);
                  }}
                  className="bg-zinc-900 border border-zinc-700 text-zinc-200 rounded px-2 py-1"
                >
                  {currentNovel.acts.map(act => (
                    <option key={act.number} value={act.number}>
                      {act.title}
                    </option>
                  ))}
                </select>

                <select
                  value={leftChapterNumber}
                  onChange={e => setLeftChapterNumber(parseInt(e.target.value, 10) || 1)}
                  className="bg-zinc-900 border border-zinc-700 text-zinc-200 rounded px-2 py-1 max-w-[140px] truncate"
                >
                  {leftAct?.chapters.map(ch => (
                    <option key={ch.number} value={ch.number}>
                      {ch.title}
                    </option>
                  ))}
                </select>

                <select
                  value={leftVersion}
                  onChange={e => setLeftVersion(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-amber-300 font-mono rounded px-2 py-1"
                >
                  {currentNovel.versionHistory.map(v => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleLoadLeftPreset}
                  className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded font-medium transition-colors"
                >
                  좌측 로드
                </button>
              </div>
            </div>

            {/* 우측 챕터 선택 */}
            <div className="bg-zinc-950/60 p-3 rounded-lg border border-emerald-500/20 flex flex-wrap items-center justify-between gap-2">
              <span className="text-emerald-300 font-semibold">▶ 우측 불러올 챕터:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <select
                  value={rightActNumber}
                  onChange={e => {
                    const num = parseInt(e.target.value, 10) || 1;
                    setRightActNumber(num);
                    const act = currentNovel.acts.find(a => a.number === num);
                    if (act && act.chapters[0]) setRightChapterNumber(act.chapters[0].number);
                  }}
                  className="bg-zinc-900 border border-zinc-700 text-zinc-200 rounded px-2 py-1"
                >
                  {currentNovel.acts.map(act => (
                    <option key={act.number} value={act.number}>
                      {act.title}
                    </option>
                  ))}
                </select>

                <select
                  value={rightChapterNumber}
                  onChange={e => setRightChapterNumber(parseInt(e.target.value, 10) || 1)}
                  className="bg-zinc-900 border border-zinc-700 text-zinc-200 rounded px-2 py-1 max-w-[140px] truncate"
                >
                  {rightAct?.chapters.map(ch => (
                    <option key={ch.number} value={ch.number}>
                      {ch.title}
                    </option>
                  ))}
                </select>

                <select
                  value={rightVersion}
                  onChange={e => setRightVersion(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-emerald-300 font-mono rounded px-2 py-1"
                >
                  {currentNovel.versionHistory.map(v => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleLoadRightPreset}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded font-medium transition-colors"
                >
                  우측 로드
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 사이드 바이 사이드 Diff 메인 컴포넌트 */}
        <NovelSideBySideDiff
          initialLeftText={leftText}
          initialRightText={rightText}
          leftLabel={leftLabel}
          rightLabel={rightLabel}
          onAdoptLeft={text => {
            navigator.clipboard.writeText(text);
            alert(`[${leftLabel}]이 최종 버전으로 채택되어 클립보드에 복사되었습니다!`);
          }}
          onAdoptRight={text => {
            navigator.clipboard.writeText(text);
            alert(`[${rightLabel}]이 최종 버전으로 채택되어 클립보드에 복사되었습니다!`);
          }}
        />
      </div>
    </div>
  );
}
