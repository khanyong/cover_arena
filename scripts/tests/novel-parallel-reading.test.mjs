import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildParallelReading, segmentParallelText, PARALLEL_READING_FORMAT } from '../../shared/lib/novelParallelReading.js';

const hash = body => createHash('sha256').update(body).digest('hex');
const paragraph = (id, body) => ({ id, activeVersion: 'v1', versions: { v1: { content: body }, v2: { content: `revised ${body}` } } });
function fixture() {
  const scene = { id: 'scene-any-chapter', number: 2, title: '[장면 2: 임시 시험]', paragraphs: [paragraph('ko1', '첫 단락. 두 문장.\n\n다음 단락.\n')] };
  const enScene = { id: scene.id, number: 2, title: '[Scene 2: Fixture]', paragraphs: [paragraph('en1', 'First paragraph. Another sentence.'), paragraph('en2', 'A different paragraph.'), paragraph('en3', 'Final paragraph.')] };
  const novel = { slug: 'quantum-vibration-novel', acts: [{ number: 17, chapters: [{ number: 9, scenes: [scene] }] }] };
  const counterpartNovel = { slug: 'quantum-vibration-novel-en', acts: [{ number: 17, chapters: [{ number: 9, scenes: [enScene] }] }] };
  return { novel, counterpartNovel, sceneId: scene.id, scene, enScene };
}

test('all chapters can be read without a Scene whitelist or equal paragraph counts', () => {
  const f = fixture();
  const result = buildParallelReading(f);
  assert.equal(result.format, PARALLEL_READING_FORMAT);
  assert.deepEqual(result.scope, { actNumber: 17, chapterNumber: 9, sceneNumber: 2 });
  assert.equal(result.ko.paragraphs.length, 1);
  assert.equal(result.en.paragraphs.length, 3);
  assert.equal(result.ko.body, f.scene.paragraphs[0].versions.v1.content);
  assert.equal(result.en.body, f.enScene.paragraphs.map(p => p.versions.v1.content).join('\n\n'));
});

test('custom current version is honored, no source mutated, results do not share editable paragraph objects', () => {
  const f = fixture();
  const before = JSON.stringify(f);
  const result = buildParallelReading({ ...f, customVersionMap: { ko1: 'v2', en1: 'v2' } });
  assert.equal(result.ko.body, f.scene.paragraphs[0].versions.v2.content);
  assert.equal(result.en.paragraphs[0].body, f.enScene.paragraphs[0].versions.v1.content);
  result.ko.paragraphs[0].body = 'not a manuscript mutation';
  assert.equal(JSON.stringify(f), before);
});

test('EN entry orients KO left and applies custom versions only to EN', () => {
  const f = fixture();
  const result = buildParallelReading({ novel: f.counterpartNovel, counterpartNovel: f.novel, sceneId: f.sceneId, customVersionMap: { en1: 'v2', ko1: 'v2' } });
  assert.equal(result.currentLanguage, 'en');
  assert.equal(result.en.paragraphs[0].versionId, 'v2');
  assert.equal(result.ko.paragraphs[0].versionId, 'v1');
});

test('managed separators and explicit terminal LF are retained exactly', () => {
  const f = fixture();
  f.scene.paragraphs = [paragraph('a', '  한글\r\n줄\t'), paragraph('b', '끝\n')];
  f.scene.paragraphs[0].separatorAfter = '\n\n';
  f.scene.paragraphs[1].separatorAfter = '';
  f.scene.terminalLf = 1;
  const result = buildParallelReading(f);
  assert.equal(result.ko.body, '  한글\r\n줄\t\n\n끝\n\n');
  assert.equal(hash(result.ko.body), hash('  한글\r\n줄\t\n\n끝\n\n'));
});

for (const [name, mutate, expected] of [
  ['missing counterpart Scene', f => { f.enScene.id = 'other'; }, /같은 Scene ID/],
  ['same title is not an identity', f => { f.enScene.id = 'other'; f.enScene.title = f.scene.title; }, /같은 Scene ID/],
  ['wrong counterpart document', f => { f.counterpartNovel.slug = 'another-novel-en'; }, /문서의 식별값/],
  ['wrong act', f => { f.counterpartNovel.acts[0].number = 18; }, /소속이 서로 달라/],
  ['wrong chapter', f => { f.counterpartNovel.acts[0].chapters[0].number = 8; }, /소속이 서로 달라/],
  ['wrong scene number', f => { f.enScene.number = 1; }, /소속이 서로 달라/],
  ['duplicate counterpart ID across scopes', f => { f.counterpartNovel.acts.push({ number: 20, chapters: [{ number: 1, scenes: [structuredClone(f.enScene)] }] }); }, /여러 개/],
  ['duplicate current Scene ID', f => { f.novel.acts[0].chapters[0].scenes.push(structuredClone(f.scene)); }, /여러 개/],
  ['missing active version', f => { f.enScene.paragraphs[0].activeVersion = 'missing'; }, /선택된 Version/],
  ['duplicate paragraph ID', f => { f.enScene.paragraphs[1].id = 'en1'; }, /중복/],
  ['unknown separator', f => { f.enScene.paragraphs[0].separatorAfter = '\r\n'; }, /구분자/],
  ['empty counterpart', f => { f.enScene.paragraphs = []; }, /문단이 없습니다/],
]) test(`refuses ${name}`, () => {
  const f = fixture(); mutate(f); const before = JSON.stringify(f);
  assert.throws(() => buildParallelReading(f), expected);
  assert.equal(JSON.stringify(f), before);
});

test('missing custom selection is not silently replaced with active version', () => {
  assert.throws(() => buildParallelReading({ ...fixture(), customVersionMap: { ko1: 'missing' } }), /선택된 Version/);
  assert.throws(() => buildParallelReading({ ...fixture(), customVersionMap: { ko1: '' } }), /선택된 Version/);
});

for (const body of [
  '', '  첫 문장. 다음 문장!\n\n끝.\n', '\n\nLeading blank.\r\n \r\n\tIndented.\r\n\r\n',
  'No punctuation', '“왜?” 그녀가 말했다.\t“He left.”  Then stopped.',
  'Escaped \\n\\n remains literal. Unicode e\u0301 가.\t\n',
  'Before.\n\n$$\na = b.\n\nc = d!\n$$\n\nAfter.',
  'Inline $a.b$ stays in its paragraph. Next sentence.\n\nAnother.',
  'Before\n\n\\[a.\n\nb.\\]\n\nAfter.',
]) for (const mode of ['paragraph', 'sentence']) test(`${mode} segmentation is byte-lossless ${hash(body).slice(0, 8)}`, () => {
  for (const options of [{}, { Segmenter: null }]) {
    const segmented = segmentParallelText(body, mode, 'ko', options);
    assert.equal(segmented.segments.join(''), body);
    assert.equal(hash(segmented.segments.join('')), hash(body));
  }
});

test('a long legacy paragraph can be read as real blank-line paragraphs or sentences', () => {
  const body = 'First sentence. Second sentence!\n\nNext paragraph. Last sentence.';
  assert.equal(segmentParallelText(body).segments.length, 2);
  assert.equal(segmentParallelText(body, 'sentence', 'en').segments.length, 4);
  assert.equal(segmentParallelText(body, 'sentence', 'en', { Segmenter: null }).method, 'sentence-fallback');
});

test('display math with internal blank lines is never fragmented; sentence mode keeps inline math block', () => {
  const formula = '$$\na = b.\n\nc = d!\n$$\n\n';
  const body = `Before.\n\n${formula}After. More.`;
  for (const mode of ['paragraph', 'sentence']) assert.ok(segmentParallelText(body, mode).segments.includes(formula));
  const inline = 'First $a.b$ equation. Next sentence.\n\n';
  assert.equal(segmentParallelText(`${inline}Other.`, 'sentence').segments[0], inline);
});

test('broken or lossy browser segmentation safely falls back without losing characters', () => {
  class BrokenSegmenter { segment() { throw new Error('broken'); } }
  class LossySegmenter { segment() { return [{ segment: 'wrong' }]; } }
  for (const Segmenter of [BrokenSegmenter, LossySegmenter]) {
    const result = segmentParallelText('Hello.  World.\n', 'sentence', 'en', { Segmenter });
    assert.equal(result.method, 'sentence-fallback');
    assert.equal(result.segments.join(''), 'Hello.  World.\n');
  }
});
