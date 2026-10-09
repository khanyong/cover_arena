import { NOVEL_TOC_KOREAN_TITLES } from './novelTocKoreanTitles.js';

// Presentation only: never write these labels back into a Novel or composition.
export const chapterTocKey = (actNumber, chapterNumber) => `act:${actNumber}:chapter:${chapterNumber}`;

function parseTitle(title, type) {
  if (typeof title !== 'string' || !title.trim()) return null;
  const inner = title.trim().replace(/^\[([\s\S]*)\]$/, '$1');
  const match = type === 'scene'
    ? inner.match(/^(?:장면|Scene)\s*(\d+)\s*[:：]\s*(.+)$/i)
    : inner.match(/^(?:제?\s*(\d+)\s*장|Chapter\s+(\d+))\s*[:：]\s*(.+)$/i);
  if (!match) return { number: null, body: inner };
  return type === 'scene'
    ? { number: Number(match[1]), body: match[2] }
    : { number: Number(match[1] || match[2]), body: match[3] };
}

function uniqueIndex(items, key) {
  const result = new Map();
  for (const item of items) {
    const id = key(item);
    result.set(id, result.has(id) ? null : item);
  }
  return result;
}

function outline(novel) {
  const chapters = [];
  const scenes = [];
  for (const act of novel?.acts || []) {
    for (const chapter of act.chapters || []) {
      const scope = { actNumber: act.number, chapterNumber: chapter.number };
      chapters.push({ ...scope, chapter });
      for (const scene of chapter.scenes || []) scenes.push({ ...scope, scene });
    }
  }
  return { chapters, scenes };
}

function formatTitle(current, english, type, structuralNumber, translation) {
  const ko = parseTitle(current, type);
  const en = parseTitle(english, type);
  const unchanged = (issue) => ({ sourceTitle: current, label: current, issue });
  if (!ko || !en || /[가-힣]/.test(en.body)) return unchanged('제목 대응 확인 필요');
  // Prologue Chapter 1 has internal chapter.number=2. Compare printed Chapter
  // numbers with the verified EN peer, never replace them with storage indexes.
  if (ko.number !== en.number || (type === 'scene' && en.number !== null && en.number !== structuralNumber)) {
    return unchanged('장·장면 번호 확인 필요');
  }
  let koreanBody = ko.body;
  if (!/[가-힣]/.test(current)) {
    if (current !== english || translation?.englishTitle !== english || !translation.koreanBody) {
      return unchanged('국문 제목 검토 필요');
    }
    koreanBody = translation.koreanBody;
  } else {
    // Remove only this exact terminal English title, not inner terms such as
    // 몰라세(Molasse), nor an author's different parenthetical wording.
    const suffix = `(${en.body})`;
    if (koreanBody.endsWith(suffix)) koreanBody = koreanBody.slice(0, -suffix.length).trimEnd();
    else if (/\([^()]*[A-Za-z][^()]*\)$/.test(koreanBody)) return unchanged('기존 영문 병기 확인 필요');
  }
  const body = `${koreanBody} (${en.body})`;
  const label = ko.number === null ? body : type === 'scene'
    ? `[장면 ${ko.number}: ${body}]` : `제${ko.number}장: ${body}`;
  return { sourceTitle: current, label, issue: null };
}

/** Exact language root, unique hierarchy and Scene IDs; no body/array-position inference. */
export function buildNovelTocTitles(novel, counterpartNovel, translations = NOVEL_TOC_KOREAN_TITLES) {
  const result = { chapters: new Map(), scenes: new Map(), issues: [] };
  if (novel?.slug !== 'quantum-vibration-novel' || counterpartNovel?.slug !== `${novel.slug}-en`) return result;
  const ko = outline(novel);
  const en = outline(counterpartNovel);
  const koActs = uniqueIndex(novel.acts || [], x => x.number);
  const enActs = uniqueIndex(counterpartNovel.acts || [], x => x.number);
  const koChapters = uniqueIndex(ko.chapters, x => chapterTocKey(x.actNumber, x.chapterNumber));
  const enChapters = uniqueIndex(en.chapters, x => chapterTocKey(x.actNumber, x.chapterNumber));
  const koScenes = uniqueIndex(ko.scenes, x => x.scene.id);
  const enScenes = uniqueIndex(en.scenes, x => x.scene.id);
  const sameScope = (a, b) => a && b && koActs.get(a.actNumber) && enActs.get(b.actNumber)
    && [a.actNumber, a.chapterNumber, b.actNumber, b.chapterNumber].every(Number.isInteger)
    && a.actNumber === b.actNumber && a.chapterNumber === b.chapterNumber;
  const sceneMatches = (a, b) => sameScope(a, b) && typeof a.scene.id === 'string' && a.scene.id.length > 0
    && koScenes.get(a.scene.id) === a && enScenes.get(a.scene.id) === b
    && Number.isInteger(a.scene.number) && a.scene.number === b.scene.number;
  const add = (map, key, item, fallbackTitle) => {
    const entry = item || { sourceTitle: fallbackTitle, label: fallbackTitle, issue: '영문 제목 대응 확인 필요' };
    map.set(key, entry);
    if (entry.issue) result.issues.push({ key, title: fallbackTitle, issue: entry.issue });
  };
  for (const a of ko.chapters) {
    const key = chapterTocKey(a.actNumber, a.chapterNumber);
    const b = enChapters.get(key);
    const ks = ko.scenes.filter(s => sameScope(s, a));
    const es = en.scenes.filter(s => sameScope(s, b));
    const bound = koChapters.get(key) === a && sameScope(a, b) && ks.length > 0
      && ks.length === es.length && ks.every(s => sceneMatches(s, enScenes.get(s.scene.id)));
    add(result.chapters, key, bound ? formatTitle(a.chapter.title, b.chapter.title, 'chapter', a.chapter.number, translations[key]) : null, a.chapter.title);
  }
  for (const a of ko.scenes) {
    const b = enScenes.get(a.scene.id);
    const key = chapterTocKey(a.actNumber, a.chapterNumber);
    const bound = koChapters.get(key) && enChapters.get(key) && sceneMatches(a, b);
    add(result.scenes, a.scene.id, bound ? formatTitle(a.scene.title, b.scene.title, 'scene', a.scene.number, translations[`scene:${a.scene.id}`]) : null, a.scene.title);
  }
  return result;
}

// Preserve a newly edited/selected title instead of hiding it behind stale labels.
export function getTocTitle(entry, currentTitle) {
  return entry?.sourceTitle === currentTitle ? entry.label : currentTitle;
}
