/** Read-only, lossless parallel reading. This is NOT a translation alignment. */
export const PARALLEL_READING_FORMAT = 'novel-parallel-reading-v1';

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

function locateScene(novel, sceneId, language) {
  const matches = [];
  for (const act of novel.acts || []) {
    for (const chapter of act.chapters || []) {
      for (const scene of chapter.scenes || []) {
        if (scene.id === sceneId) matches.push({ act, chapter, scene });
      }
    }
  }
  requireValue(matches.length === 1, matches.length
    ? `${language}에 같은 Scene ID가 여러 개 있어 비교 대상을 확정할 수 없습니다.`
    : `${language}에서 같은 Scene ID의 본문을 찾지 못했습니다. 번역을 추정해 표시하지 않습니다.`);
  const { act, chapter, scene } = matches[0];
  requireValue([act.number, chapter.number, scene.number].every(Number.isInteger),
    `${language} Scene의 막·장·장면 소속을 확인할 수 없습니다.`);
  return { scene, scope: { actNumber: act.number, chapterNumber: chapter.number, sceneNumber: scene.number } };
}

function readScene(scene, language, customVersionMap) {
  requireValue(Array.isArray(scene.paragraphs) && scene.paragraphs.length > 0,
    `${language} Scene에 읽을 수 있는 문단이 없습니다.`);
  const seen = new Set();
  const paragraphs = scene.paragraphs.map((paragraph, index) => {
    requireValue(typeof paragraph.id === 'string' && paragraph.id.length > 0 && !seen.has(paragraph.id),
      `${language} 문단 식별값이 없거나 중복되어 본문을 확인할 수 없습니다.`);
    seen.add(paragraph.id);
    const versionId = Object.prototype.hasOwnProperty.call(customVersionMap, paragraph.id)
      ? customVersionMap[paragraph.id] : paragraph.activeVersion;
    requireValue(typeof versionId === 'string' && versionId.length > 0
      && Object.prototype.hasOwnProperty.call(paragraph.versions || {}, versionId)
      && typeof paragraph.versions[versionId]?.content === 'string',
    `${language} 문단의 선택된 Version을 찾지 못했습니다. 다른 판본으로 자동 대체하지 않습니다.`);
    const separatorAfter = paragraph.separatorAfter === undefined
      ? (index < scene.paragraphs.length - 1 ? '\n\n' : '') : paragraph.separatorAfter;
    requireValue(separatorAfter === '' || separatorAfter === '\n\n', `${language} 문단 구분자를 확인할 수 없습니다.`);
    return { id: paragraph.id, versionId, body: paragraph.versions[versionId].content, separatorAfter };
  });
  requireValue(scene.terminalLf === undefined || scene.terminalLf === 0 || scene.terminalLf === 1,
    `${language} 본문 끝 개행 정보를 확인할 수 없습니다.`);
  const terminalLf = scene.terminalLf || 0;
  return {
    title: typeof scene.title === 'string' ? scene.title : '',
    body: paragraphs.map(paragraph => paragraph.body + paragraph.separatorAfter).join('') + '\n'.repeat(terminalLf),
    paragraphs,
    terminalLf,
  };
}

/** Exact Scene ID + numeric hierarchy only; titles and array positions never select peers. */
export function buildParallelReading({ novel, sceneId, counterpartNovel, customVersionMap = {} }) {
  requireValue(typeof novel?.slug === 'string' && novel.slug.length > 0
    && typeof sceneId === 'string' && sceneId.length > 0, '비교할 문서와 Scene을 확인할 수 없습니다.');
  /** @type {'ko' | 'en'} */
  const currentLanguage = novel.slug.endsWith('-en') ? 'en' : 'ko';
  const expectedSlug = currentLanguage === 'en' ? novel.slug.slice(0, -3) : `${novel.slug}-en`;
  requireValue(counterpartNovel?.slug === expectedSlug, '반대 언어 문서의 식별값이 일치하지 않습니다.');
  const current = locateScene(novel, sceneId, currentLanguage.toUpperCase());
  const counterpart = locateScene(counterpartNovel, sceneId, currentLanguage === 'ko' ? 'EN' : 'KO');
  requireValue(Object.keys(current.scope).every(key => current.scope[key] === counterpart.scope[key]),
    '같은 Scene ID의 막·장·장면 소속이 서로 달라 비교 대상을 확정할 수 없습니다.');
  const currentBody = readScene(current.scene, currentLanguage.toUpperCase(), customVersionMap);
  const counterpartBody = readScene(counterpart.scene, currentLanguage === 'ko' ? 'EN' : 'KO', {});
  return {
    format: PARALLEL_READING_FORMAT,
    sceneId,
    currentLanguage,
    scope: current.scope,
    ko: currentLanguage === 'ko' ? currentBody : counterpartBody,
    en: currentLanguage === 'en' ? currentBody : counterpartBody,
  };
}

export function hasParallelMath(body) {
  return /\$|\\\[|\\\(|\\begin\{/.test(body);
}

function paragraphSegments(body) {
  // Blank lines inside display math are not paragraph boundaries.
  const mathRanges = [...body.matchAll(/\$\$[\s\S]*?(?:\$\$|$)|\\\[[\s\S]*?(?:\\\]|$)|\\\([\s\S]*?(?:\\\)|$)|\\begin\{([^}]+)\}[\s\S]*?\\end\{\1\}/g)]
    .map(match => [match.index, match.index + match[0].length]);
  const segments = [];
  let start = 0;
  for (const match of body.matchAll(/(?:\r\n|\n|\r)[\t ]*(?:\r\n|\n|\r)(?:[\t ]*(?:\r\n|\n|\r))*/g)) {
    if (mathRanges.some(([from, to]) => match.index >= from && match.index < to)) continue;
    const end = match.index + match[0].length;
    segments.push(body.slice(start, end));
    start = end;
  }
  if (start < body.length) segments.push(body.slice(start));
  return segments;
}

function fallbackSentences(body) {
  const segments = [];
  let start = 0;
  for (const match of body.matchAll(/[.!?。！？]["'”’」』）)\]]*(?:[\t \r\n]+|$)/g)) {
    const end = match.index + match[0].length;
    segments.push(body.slice(start, end));
    start = end;
  }
  if (start < body.length) segments.push(body.slice(start));
  return segments;
}

function attachWhitespace(parts) {
  const segments = [];
  let pending = '';
  for (const part of parts) {
    if (/^\s+$/.test(part)) { pending += part; continue; }
    if (pending && segments.length) segments[segments.length - 1] += pending;
    segments.push((segments.length ? '' : pending) + part);
    pending = '';
  }
  if (pending && segments.length) segments[segments.length - 1] += pending;
  else if (pending) segments.push(pending);
  return segments;
}

/** Joining segments always reconstructs the original string, including all whitespace. */
export function segmentParallelText(body, mode = 'paragraph', locale = 'ko', options = {}) {
  requireValue(typeof body === 'string', '읽기 본문이 문자열이 아닙니다.');
  requireValue(mode === 'paragraph' || mode === 'sentence', '지원하지 않는 읽기 단위입니다.');
  if (!body) return { segments: [], method: 'empty' };
  const paragraphs = paragraphSegments(body);
  if (mode === 'paragraph') return { segments: paragraphs, method: 'paragraph-breaks' };
  const Segmenter = Object.prototype.hasOwnProperty.call(options, 'Segmenter') ? options.Segmenter : globalThis.Intl?.Segmenter;
  let segmenter;
  try { segmenter = Segmenter ? new Segmenter(locale, { granularity: 'sentence' }) : null; } catch { segmenter = null; }
  let usedFallback = false;
  let keptMath = false;
  const segments = paragraphs.flatMap(paragraph => {
    if (hasParallelMath(paragraph)) { keptMath = true; return [paragraph]; }
    if (segmenter) {
      try {
        const parts = Array.from(segmenter.segment(paragraph), entry => entry.segment);
        if (parts.length && parts.join('') === paragraph) return attachWhitespace(parts);
      } catch { /* Use a transparent, lossless display-only fallback. */ }
    }
    usedFallback = true;
    return fallbackSentences(paragraph);
  });
  requireValue(segments.join('') === body, '읽기 단위 분리 중 원본 보존 검증에 실패했습니다.');
  return { segments, method: keptMath ? 'mixed' : usedFallback ? 'sentence-fallback' : 'intl-sentence' };
}
