import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildNovelTocTitles, chapterTocKey, getTocTitle } from '../../shared/lib/novelTocTitles.js';
import { NOVEL_TOC_KOREAN_TITLES } from '../../shared/lib/novelTocKoreanTitles.js';

function pair() {
  const make = (en) => ({ slug: `quantum-vibration-novel${en ? '-en' : ''}`, acts: [{ number: 3, chapters: [{
    number: 4, title: en ? 'Chapter 4: Escape Velocity' : '제4장: 탈출 속도', scenes: [{
      id: 'ce917762', number: 1, title: en ? '[Scene 1: Departure Horizon]' : '[장면 1: 출발의 지평]',
      paragraphs: [{ id: 'untouched', activeVersion: 'review', versions: { review: { content: '원문\n\n', title: '원래 제목' } } }],
    }],
  }] }] });
  return [make(false), make(true)];
}
const chapter = (novel) => novel.acts[0].chapters[0];
const scene = (novel) => chapter(novel).scenes[0];
const run = (ko, en, translations) => buildNovelTocTitles(ko, en, translations);

test('verified live titles format only the TOC; input/body/versions are unchanged', () => {
  const [ko, en] = pair();
  const before = JSON.stringify([ko, en]);
  const result = run(ko, en);
  assert.equal(result.chapters.get(chapterTocKey(3, 4)).label, '제4장: 탈출 속도 (Escape Velocity)');
  assert.equal(result.scenes.get('ce917762').label, '[장면 1: 출발의 지평 (Departure Horizon)]');
  assert.deepEqual(result.issues, []);
  assert.equal(JSON.stringify([ko, en]), before);
});

test('exact existing English suffix is not duplicated', () => {
  const [ko, en] = pair();
  chapter(ko).title = '제4장: 탈출 속도 (Escape Velocity)';
  scene(ko).title = '[장면 1: 출발의 지평 (Departure Horizon)]';
  assert.equal(run(ko, en).chapters.get(chapterTocKey(3, 4)).label, chapter(ko).title);
  assert.equal(run(ko, en).scenes.get('ce917762').label, scene(ko).title);
});

test('inner terminology parentheses survive; differing terminal English is not overwritten', () => {
  const [ko, en] = pair();
  chapter(ko).title = '제4장: 몰라세(Molasse) 암반 속의 대성당';
  chapter(en).title = 'Chapter 4: The Cathedral in the Molasse';
  assert.equal(run(ko, en).chapters.get(chapterTocKey(3, 4)).label, '제4장: 몰라세(Molasse) 암반 속의 대성당 (The Cathedral in the Molasse)');
  scene(ko).title = '[장면 1: 출발의 지평 (Author Title)]';
  const entry = run(ko, en).scenes.get('ce917762');
  assert.equal(entry.label, scene(ko).title);
  assert.ok(entry.issue);
});

test('printed prologue chapter number is not replaced by its internal chapter index', () => {
  const [ko, en] = pair();
  chapter(ko).number = chapter(en).number = 2;
  chapter(ko).title = '제1장: 공간의 공명';
  chapter(en).title = 'Chapter 1: The Resonance of Space';
  assert.equal(run(ko, en).chapters.get(chapterTocKey(3, 2)).label, '제1장: 공간의 공명 (The Resonance of Space)');
});

test('conflicting scene numbering stays visible as original, with an explicit issue', () => {
  const [ko, en] = pair();
  scene(ko).number = scene(en).number = 2;
  scene(ko).title = '[장면 1: 위상 불변량 일치]';
  scene(en).title = '[Scene 2: The Calculus of Rupture]';
  const result = run(ko, en);
  assert.equal(result.scenes.get('ce917762').label, scene(ko).title);
  assert.equal(result.scenes.get('ce917762').issue, '장·장면 번호 확인 필요');
});

for (const side of ['ko', 'en']) {
  for (const ambiguity of ['scene ID', 'chapter scope', 'act number']) {
    test(`${side} duplicate ${ambiguity} cannot provide a verified counterpart`, () => {
      const [ko, en] = pair();
      const target = side === 'ko' ? ko : en;
      if (ambiguity === 'scene ID') chapter(target).scenes.push(structuredClone(scene(target)));
      if (ambiguity === 'chapter scope') target.acts[0].chapters.push(structuredClone(chapter(target)));
      if (ambiguity === 'act number') target.acts.push({ number: 3, chapters: [] });
      const result = run(ko, en);
      assert.equal(result.scenes.get('ce917762').label, scene(ko).title);
      assert.ok(result.scenes.get('ce917762').issue);
      assert.ok(result.chapters.get(chapterTocKey(3, 4)).issue);
    });
  }
}

for (const change of ['missing scene', 'different ID', 'different chapter', 'different act', 'different scene number', 'noninteger scope']) {
  test(`${change} fails closed without array-position matching`, () => {
    const [ko, en] = pair();
    if (change === 'missing scene') chapter(en).scenes = [];
    if (change === 'different ID') scene(en).id = 'other';
    if (change === 'different chapter') chapter(en).number = 5;
    if (change === 'different act') en.acts[0].number = 4;
    if (change === 'different scene number') scene(en).number = 2;
    if (change === 'noninteger scope') en.acts[0].number = '3';
    const result = run(ko, en);
    assert.equal(result.scenes.get('ce917762').label, scene(ko).title);
    assert.ok(result.scenes.get('ce917762').issue);
  });
}

test('missing/wrong language root and unrelated novels do not change labels', () => {
  const [ko, en] = pair();
  for (const peer of [null, {}, { ...en, slug: 'another-en' }]) assert.equal(run(ko, peer).scenes.size, 0);
  assert.equal(run(en, ko).scenes.size, 0);
  assert.equal(run({ ...ko, slug: 'another' }, { ...en, slug: 'another-en' }).chapters.size, 0);
});

test('new translation requires both exact key and unchanged English title', () => {
  const [ko, en] = pair();
  scene(ko).title = scene(en).title;
  const translations = { 'scene:ce917762': { englishTitle: scene(en).title, koreanBody: '출발의 지평' } };
  assert.equal(run(ko, en, translations).scenes.get('ce917762').issue, null);
  assert.ok(run(ko, en, {}).scenes.get('ce917762').issue);
  scene(ko).title = '[Scene 1: Author Revision]';
  assert.equal(run(ko, en, translations).scenes.get('ce917762').label, scene(ko).title);
  scene(en).title = scene(ko).title;
  assert.ok(run(ko, en, translations).scenes.get('ce917762').issue);
});

test('unnumbered opening stays unnumbered; exact English punctuation survives', () => {
  const [ko, en] = pair();
  scene(ko).title = scene(en).title = 'Opening';
  const translations = { 'scene:ce917762': { englishTitle: 'Opening', koreanBody: '도입' } };
  assert.equal(run(ko, en, translations).scenes.get('ce917762').label, '도입 (Opening)');
  scene(ko).title = '[장면 1: 모른다]';
  scene(en).title = "[Scene 1: I Don't Know]";
  assert.equal(run(ko, en).scenes.get('ce917762').label, "[장면 1: 모른다 (I Don't Know)]");
});

test('current edited or selected title takes precedence over stale formatted labels', () => {
  const [ko, en] = pair();
  const entry = run(ko, en).scenes.get('ce917762');
  assert.equal(getTocTitle(entry, scene(ko).title), entry.label);
  assert.equal(getTocTitle(entry, '[장면 1: 저자 수정]'), '[장면 1: 저자 수정]');
  assert.equal(getTocTitle(undefined, '원래 제목'), '원래 제목');
});

test('translation catalog has 48 immutable, title-only entries', () => {
  assert.equal(Object.keys(NOVEL_TOC_KOREAN_TITLES).length, 48);
  assert.ok(Object.isFrozen(NOVEL_TOC_KOREAN_TITLES));
  for (const [key, value] of Object.entries(NOVEL_TOC_KOREAN_TITLES)) {
    assert.match(key, /^(act:\d+:chapter:\d+|scene:[a-f0-9]+)$/);
    assert.deepEqual(Object.keys(value).sort(), ['englishTitle', 'koreanBody']);
    assert.match(value.koreanBody, /[가-힣]/);
    assert.ok(Object.isFrozen(value));
  }
});

test('TOC consumer keeps session/slug guards and the existing revision badge', () => {
  const page = readFileSync(new URL('../../pages/novel/[...slug].tsx', import.meta.url), 'utf8');
  assert.match(page, /cancelled \|\| currentReaderSlug\.current !== requestedSlug/);
  assert.match(page, /meta\?\.loadedSlug !== `\$\{requestedSlug\}-en`/);
  assert.match(page, /tocEnglish\?\.requestedSlug === dbSlug \? tocEnglish\.novel : null/);
  assert.match(page, /return \(\) => \{ cancelled = true; \};/);
  assert.match(page, /<SceneRevisionBadge scene=\{scene\} \/>/);
  assert.match(page, /return <ReaderSessionBoundary><NovelStudioContent \/><\/ReaderSessionBoundary>/);
  assert.equal((page.match(/getTocTitle\(/g) || []).length, 2);
  assert.equal((page.match(/rounded-md whitespace-normal break-words duration-150/g) || []).length, 2);
});

// Title-only memory fixtures, not proof of an applied database correction.
function ruptureFrontPair() {
  const make = (en) => ({ slug: `quantum-vibration-novel${en ? '-en' : ''}`, acts: [{ number: 4, chapters: [{
    number: 4, title: en ? 'Chapter 4: The Rupture Front' : '제4장: 파열 전선 (The Rupture Front)',
    scenes: [
      { id: 'e858f9a3', number: 1, title: en ? '[Scene 1: Topological Invariants Match]' : '[장면 1: 위상 불변량 일치]', paragraphs: [] },
      { id: 'b3d54f9e', number: 2, title: en ? '[Scene 2: The Calculus of Rupture]' : '[장면 1: 위상 불변량 일치]', paragraphs: [] },
      { id: '52902ef2', number: 3, title: '[Scene 3: The Causal Limit]', paragraphs: [] },
    ],
  }] }] });
  return [make(false), make(true)];
}

test('correcting only the second Rupture Front title clears its warning without a title override', () => {
  const [ko, en] = ruptureFrontPair();
  const beforeInput = structuredClone([ko, en]);
  const before = run(ko, en);
  const target = chapter(ko).scenes.find(item => item.id === 'b3d54f9e');
  assert.deepEqual(before.issues.map(item => item.key), [target.id]);
  assert.equal(before.scenes.get(target.id).label, '[장면 1: 위상 불변량 일치]');
  assert.equal(NOVEL_TOC_KOREAN_TITLES[`scene:${target.id}`], undefined);
  assert.deepEqual([ko, en], beforeInput);

  target.title = '[장면 2: 파열의 계산법]';
  const correctedInput = structuredClone([ko, en]);
  const after = run(ko, en);
  assert.deepEqual(after.issues, []);
  assert.deepEqual(after.scenes.get(target.id), {
    sourceTitle: '[장면 2: 파열의 계산법]',
    label: '[장면 2: 파열의 계산법 (The Calculus of Rupture)]',
    issue: null,
  });
  assert.equal((after.scenes.get(target.id).label.match(/장면 2/g) || []).length, 1);
  // The header consumes the unchanged raw Scene title, not the TOC label.
  assert.equal(target.title, '[장면 2: 파열의 계산법]');
  assert.equal(getTocTitle(after.scenes.get(target.id), target.title), after.scenes.get(target.id).label);
  assert.equal(getTocTitle(before.scenes.get(target.id), target.title), target.title);
  assert.deepEqual(after.chapters, before.chapters);
  for (const id of ['e858f9a3', '52902ef2']) {
    assert.deepEqual(after.scenes.get(id), before.scenes.get(id));
    assert.deepEqual(chapter(ko).scenes.find(item => item.id === id), chapter(beforeInput[0]).scenes.find(item => item.id === id));
  }
  assert.deepEqual(en, beforeInput[1]);
  assert.deepEqual({ ...target, title: beforeInput[0].acts[0].chapters[0].scenes[1].title }, beforeInput[0].acts[0].chapters[0].scenes[1]);
  assert.deepEqual([ko, en], correctedInput);
});

test('correcting the second Rupture Front title does not suppress a separate numbering conflict', () => {
  const [ko, en] = ruptureFrontPair();
  const target = chapter(ko).scenes.find(item => item.id === 'b3d54f9e');
  const other = chapter(ko).scenes.find(item => item.id === '52902ef2');
  other.title = '[장면 1: 인과의 한계]';
  const before = run(ko, en);
  assert.deepEqual(before.issues.map(item => item.key), [target.id, other.id]);

  target.title = '[장면 2: 파열의 계산법]';
  const unchangedInput = structuredClone([ko, en]);
  const after = run(ko, en);
  assert.equal(after.scenes.get(target.id).issue, null);
  assert.deepEqual(after.issues, before.issues.filter(item => item.key !== target.id));
  assert.deepEqual(after.scenes.get(other.id), before.scenes.get(other.id));
  assert.equal(after.scenes.get(other.id).label, other.title);
  assert.equal(after.scenes.get(other.id).issue, '장·장면 번호 확인 필요');
  assert.deepEqual(after.scenes.get('e858f9a3'), before.scenes.get('e858f9a3'));
  assert.deepEqual(after.chapters, before.chapters);
  assert.deepEqual([ko, en], unchangedInput);
});
