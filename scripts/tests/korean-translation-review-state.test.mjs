import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  getKoreanTranslationEditionCandidate,
  matchesKoreanTranslationEdition,
} from '../../shared/lib/koreanTranslationEdition.js';
import {
  captureKoreanReviewScenes,
  getKoreanReviewScene,
  invalidateKoreanReviewScene,
  reconcileKoreanReviewScene,
} from '../../shared/lib/koreanTranslationReviewState.js';

// Entirely synthetic, public-safe fixtures. Initial hashes identify the known
// imports; later bodies have independently computed real SHA-256 values.
const SLUG = 'quantum-vibration-novel';
const CONTRACTS = [
  { id: '2212e1af', act: 2, source: 'PRO/CH03/SC01', count: 207, hash: 'faf2439b944b52b59a641b3ea4a743b3d6430d866e7a7539fa4a299fefed7c84' },
  { id: 'fb17794c', act: 2, source: 'PRO/CH03/SC02', count: 126, hash: 'c8b69101f5832ddaae14ec1a25ec8b494f5b098576cda30bc80369bc2010bc9d' },
  { id: '836ceb36', act: 3, source: 'A0/CH01/SC01', count: 225, hash: '7cd068fed7d05b07c1fd7ebf5a087c94c1635e5a1be53ab6fe36ebaf9f48e7bf' },
  { id: '89b8150d', act: 3, source: 'A0/CH01/SC02', count: 294, hash: 'c13b36b424d9a50f9be44119557846029e6f1da6f3b89eaabe1052b09ac2c326' },
  { id: 'f53f1704', act: 3, source: 'A0/CH02/SC01', count: 367, hash: 'd4781c1eec9c1ba0cda81cac409ef20d8734ff9292e97d43d0e7fc3f85cfd821' },
  { id: '605986cc', act: 3, source: 'A0/CH02/SC02', count: 360, hash: '6913332a604d6929b7b3358ae829623dce25e85970efbe1ab8c2d4c1ff6a7c78' },
  { id: 'dd5e34a3', act: 3, source: 'A0/CH03/SC01', count: 261, hash: '54486b4a9293eed4c64c68ecd0991bdbb6728364f11130ee6e1c019f36dc7fff' },
  { id: '6e1f0f9c', act: 3, source: 'A0/CH03/SC02', count: 310, hash: '46d789fad4d9f25132d9beac18018861f2bc6ddd5c3d0f8db60614681be85c97' },
];
const uuid = number => `00000000-0000-4000-8000-${String(number).padStart(12, '0')}`;
const digest = body => createHash('sha256').update(body, 'utf8').digest('hex');
if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
const fixtureAct = scene => CONTRACTS.find(contract => contract.id === scene?.id)?.act ?? 2;
const candidate = (scene, customVersionMap = {}) => getKoreanTranslationEditionCandidate({
  novelSlug: SLUG, actNumber: fixtureAct(scene), scene, customVersionMap,
});
const read = (snapshot, scene, slug = SLUG, act = fixtureAct(scene)) => getKoreanReviewScene(snapshot, slug, act, scene);
const reconcile = (snapshot, scene, slug = SLUG, act = fixtureAct(scene)) => reconcileKoreanReviewScene(snapshot, slug, act, scene);
const novel = (scenes, slug = SLUG) => ({
  slug,
  acts: [...new Set(scenes.map(fixtureAct))].map(number => ({
    number, chapters: [{ number: number === 3 ? 1 : 3, scenes: scenes.filter(scene => fixtureAct(scene) === number) }],
  })),
});
const capture = (...scenes) => captureKoreanReviewScenes(novel(scenes));
const deepFreeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

function currentScene(contract = CONTRACTS[0], generation = 2) {
  // Real managed Scenes have disjoint identities; keep synthetic selections
  // equally disjoint so cross-Scene tests cannot hide leaked version choices.
  const namespace = CONTRACTS.indexOf(contract) * 10000;
  const composition = uuid(namespace + generation);
  const scene = {
    id: contract.id,
    number: 1,
    title: 'Synthetic scene title',
    storageModel: 'ros-ko-block-v1',
    managedSceneId: uuid(namespace + 90),
    compositionRevisionId: composition,
    managedReviewCompositionId: composition,
    managedViewKey: composition,
    managedReadOnly: false,
    generation,
    terminalLf: 0,
    managedHistory: [{
      compositionId: uuid(namespace + 1), revisionNo: 1, manuscriptVersion: 'r01',
      bodySha256: contract.hash, isReview: false,
    }],
    paragraphs: Array.from({ length: contract.count }, (_, index) => ({
      id: uuid(namespace + index + 100),
      unitId: uuid(namespace + index + 100),
      revisionVersionId: uuid(namespace + index + 1000),
      sourceKey: `KO/${contract.source}/B${String(index + 1).padStart(4, '0')}`,
      storageModel: 'ros-ko-block-v1',
      compositionRevisionId: composition,
      generation,
      activeVersion: 'review',
      versions: {
        review: { content: `Synthetic generation ${generation}, block ${index + 1}: 한글 α.`, revisionVersionId: uuid(namespace + index + 1000) },
        old: { content: `Synthetic previous block ${index + 1}.` },
      },
      separatorAfter: index < contract.count - 1 ? '\n\n' : '',
    })),
  };
  scene.canonicalBodySha256 = digest(scene.paragraphs.map(p => p.versions.review.content + p.separatorAfter).join(''));
  scene.managedHistory.unshift({
    compositionId: composition, revisionNo: generation, manuscriptVersion: 'r01',
    bodySha256: scene.canonicalBodySha256, isReview: true,
  });
  return scene;
}

function historicalScene(current, viewKey = 'legacy') {
  const initialComposition = current.managedHistory.find(item => item.revisionNo === 1).compositionId;
  return {
    ...structuredClone(current),
    compositionRevisionId: initialComposition,
    managedViewKey: viewKey === 'legacy' ? 'legacy' : initialComposition,
    managedReadOnly: true,
    canonicalBodySha256: 'a'.repeat(64),
    paragraphs: [{ id: 'synthetic-old-fulltext', activeVersion: 'old', versions: { old: { content: 'Synthetic historical full text.' } } }],
  };
}

function opening() {
  return {
    id: 'd9766afa',
    paragraphs: [{
      id: 'synthetic-opening', activeVersion: 'v_ko-r01',
      versions: {
        'v_ko-r01': { content: 'Synthetic opening. 한글.' },
        old: { content: 'Synthetic old opening.' },
      },
    }],
  };
}

for (const contract of CONTRACTS) {
  test(`${contract.source}: cloned current-review snapshot verifies the full synthetic body`, async () => {
    const scene = currentScene(contract);
    const snapshot = capture(scene);
    assert.equal(snapshot.novelSlug, SLUG);
    assert.deepEqual(Object.keys(snapshot.scenes), [`${contract.act}:${scene.id}`]);
    const cached = read(snapshot, scene);
    assert.deepEqual(cached, scene);
    assert.notEqual(cached, scene);
    assert.notEqual(cached.paragraphs, scene.paragraphs);
    assert.notEqual(cached.paragraphs[0].versions, scene.paragraphs[0].versions);
    assert.equal(await matchesKoreanTranslationEdition(candidate(cached)), true);
    assert.notEqual(candidate(cached).sha256, contract.hash);
  });

  for (const selection of ['legacy', 'old-composition']) {
    test(`${contract.source}: ${selection} keeps verified TOC baseline but cannot label the visible header`, async () => {
      const scene = currentScene(contract);
      const snapshot = capture(scene);
      const historical = historicalScene(scene, selection);
      assert.equal(candidate(historical), null);
      assert.equal(reconcile(snapshot, historical), snapshot);
      assert.equal(await matchesKoreanTranslationEdition(candidate(read(snapshot, historical))), true);
      // History alone never seeds a current-review snapshot.
      const empty = capture(historical);
      assert.deepEqual(empty.scenes, {});
      assert.equal(read(empty, historical), null);
      assert.equal(reconcile(empty, historical), empty);
    });
  }

  test(`${contract.source}: loaded new generation replaces the baseline without changing the old snapshot`, async () => {
    const first = currentScene(contract);
    const snapshot = deepFreeze(capture(first));
    const next = currentScene(contract, 3);
    const updated = reconcile(snapshot, deepFreeze(next));
    assert.notEqual(updated, snapshot);
    assert.notEqual(updated.scenes, snapshot.scenes);
    assert.notEqual(updated.scenes[`${contract.act}:${next.id}`], next);
    assert.deepEqual(read(snapshot, first), first);
    assert.equal(read(snapshot, next), null);
    assert.deepEqual(read(updated, next), next);
    assert.equal(read(updated, first), null);
    assert.equal(await matchesKoreanTranslationEdition(candidate(read(updated, next))), true);
    assert.deepEqual(read(updated, historicalScene(next)), next);
  });

  test(`${contract.source}: missing or changed current identity invalidates only its own Scene`, () => {
    const scene = currentScene(contract);
    const other = opening();
    const snapshot = deepFreeze(capture(scene, other));
    for (const changes of [
      { managedSceneId: undefined }, { managedSceneId: uuid(99) },
      { managedReviewCompositionId: undefined }, { managedReviewCompositionId: uuid(99) },
      { generation: undefined }, { generation: 0 }, { generation: 3 },
      { storageModel: undefined },
    ]) {
      const historical = { ...historicalScene(scene), ...changes };
      assert.equal(read(snapshot, historical), null);
      const updated = reconcile(snapshot, historical);
      assert.equal(read(updated, scene), null);
      assert.deepEqual(read(updated, other), other);
      assert.deepEqual(read(snapshot, scene), scene);
    }
  });

  test(`${contract.source}: partial loads and invalid hash metadata cannot retain a prior current candidate`, () => {
    const scene = currentScene(contract);
    const snapshot = capture(scene);
    for (const mutate of [
      value => { value.paragraphs.pop(); },
      value => { delete value.paragraphs[0].versions.review; },
      value => { value.paragraphs[0].sourceKey = 'EN/PRO/CH03/SC01/B0001'; },
      value => { value.canonicalBodySha256 = 'not-a-sha'; },
      value => { value.canonicalBodySha256 = '0'.repeat(64); },
      value => { value.managedHistory[1].bodySha256 = '0'.repeat(64); },
      value => { value.managedHistory = []; },
      value => { value.managedReadOnly = true; },
      value => { value.managedViewKey = undefined; },
    ]) {
      const invalid = structuredClone(scene);
      mutate(invalid);
      assert.deepEqual(capture(invalid).scenes, {});
      assert.equal(read(snapshot, invalid), null);
      assert.equal(read(reconcile(snapshot, invalid), scene), null);
    }
  });

  test(`${contract.source}: actual hash mismatches remain unverified and never reuse the earlier cached bytes`, async () => {
    const scene = currentScene(contract);
    const snapshot = capture(scene);
    const corrupt = structuredClone(scene);
    corrupt.paragraphs.at(-1).versions.review.content += ' Synthetic byte mismatch.';
    // Structural capture intentionally makes no asynchronous SHA assertion.
    const updated = reconcile(snapshot, corrupt);
    const cached = read(updated, corrupt);
    assert.ok(cached);
    assert.equal(candidate(cached).body, candidate(corrupt).body);
    assert.equal(await matchesKoreanTranslationEdition(candidate(cached)), false);
    assert.equal(await matchesKoreanTranslationEdition(candidate(read(snapshot, scene))), true);
  });
}

test('exact document, ACT, and Scene scope prevent shared EN identities and unregistered fallback', () => {
  const scene = currentScene();
  const snapshot = capture(scene);
  for (const slug of [undefined, '', 'quantum-vibration-novel-en', 'quantum-vibration-novel-act-2']) {
    assert.equal(getKoreanReviewScene(snapshot, slug, 2, scene), null);
    assert.equal(reconcileKoreanReviewScene(snapshot, slug, 2, scene), null);
    assert.equal(invalidateKoreanReviewScene(snapshot, slug, 2, scene.id), null);
    assert.deepEqual(captureKoreanReviewScenes({ ...novel([scene]), slug })?.scenes ?? {}, {});
  }
  for (const act of [undefined, null, 1, 3, '2']) {
    assert.equal(getKoreanReviewScene(snapshot, SLUG, act, scene), null);
    assert.equal(reconcileKoreanReviewScene(snapshot, SLUG, act, scene), snapshot);
  }
  for (const id of ['unknown', '__proto__', 'constructor', CONTRACTS[1].id]) {
    assert.equal(read(snapshot, { ...scene, id }), null);
    assert.deepEqual(capture({ ...scene, id }).scenes, {});
    assert.equal(reconcile(snapshot, { ...scene, id }), snapshot);
  }
});

test('Opening and managed TOC baseline ignore paragraph version selections while header candidates reject them', () => {
  for (const scene of [opening(), currentScene()]) {
    const snapshot = capture(scene);
    const selectedVersions = { [scene.paragraphs[0].id]: 'old' };
    assert.equal(candidate(scene, selectedVersions), null);
    assert.deepEqual(read(snapshot, scene), scene);
    assert.ok(candidate(read(snapshot, scene)));
    assert.deepEqual(selectedVersions, { [scene.paragraphs[0].id]: 'old' });
  }
});

test('capture and reconcile do not mutate inputs or alias their nested data', () => {
  const scene = currentScene();
  const loaded = novel([scene]);
  const before = structuredClone(loaded);
  const snapshot = captureKoreanReviewScenes(deepFreeze(loaded));
  assert.deepEqual(loaded, before);
  const mutable = currentScene(CONTRACTS[1]);
  const mutableBefore = structuredClone(mutable);
  const updated = reconcile(deepFreeze(snapshot), mutable);
  mutable.paragraphs[0].versions.review.content = 'Unrelated mutation';
  mutable.managedHistory[0].bodySha256 = '0'.repeat(64);
  assert.deepEqual(updated.scenes[`2:${mutable.id}`], mutableBefore);
  assert.deepEqual(snapshot.scenes[`2:${scene.id}`], before.acts[0].chapters[0].scenes[0]);
  const source = currentScene();
  const captured = capture(source);
  source.paragraphs[0].versions.review.content = 'Post-capture source mutation';
  assert.notEqual(captured.scenes[`2:${source.id}`].paragraphs[0].versions.review.content, source.paragraphs[0].versions.review.content);
});

test('explicit invalidation removes only the requested entry and is null safe', () => {
  const first = currentScene();
  const second = currentScene(CONTRACTS[1]);
  const snapshot = deepFreeze(capture(first, second));
  const updated = invalidateKoreanReviewScene(snapshot, SLUG, 2, first.id);
  assert.equal(read(updated, first), null);
  assert.deepEqual(read(updated, second), second);
  assert.deepEqual(read(snapshot, first), first);
  assert.equal(invalidateKoreanReviewScene(snapshot, SLUG, 2, 'missing'), snapshot);
  assert.equal(invalidateKoreanReviewScene(snapshot, SLUG, 2, null), snapshot);
  assert.equal(invalidateKoreanReviewScene(null, SLUG, 2, first.id), null);
  assert.equal(reconcile(null, first), null);
  assert.equal(read(null, first), null);
  assert.equal(read(snapshot, null), null);
  assert.equal(reconcile(snapshot, null), snapshot);
  assert.equal(captureKoreanReviewScenes(null), null);
  assert.deepEqual(captureKoreanReviewScenes({ slug: SLUG, acts: [null, { chapters: [null] }] }).scenes, {});
});

test('Act2 and Act3 default reviews stay separate through history, selection, update, and refresh', async () => {
  const act2 = currentScene(CONTRACTS[0]);
  const act3 = currentScene(CONTRACTS[2]);
  const snapshot = deepFreeze(capture(act2, act3));
  assert.deepEqual(Object.keys(snapshot.scenes), [`2:${act2.id}`, `3:${act3.id}`]);
  assert.equal(await matchesKoreanTranslationEdition(candidate(read(snapshot, act2))), true);
  assert.equal(await matchesKoreanTranslationEdition(candidate(read(snapshot, act3))), true);

  const oldAct3 = historicalScene(act3);
  assert.equal(candidate(oldAct3), null);
  assert.deepEqual(read(snapshot, oldAct3), act3);
  assert.equal(reconcile(snapshot, oldAct3), snapshot);
  const selected = { [act3.paragraphs.at(-1).id]: 'old' };
  assert.equal(candidate(act3, selected), null);
  assert.deepEqual(read(snapshot, act3), act3);

  const nextAct3 = currentScene(CONTRACTS[2], 3);
  const updated = reconcile(snapshot, nextAct3);
  assert.deepEqual(read(updated, act2), act2);
  assert.deepEqual(read(snapshot, act3), act3);
  assert.equal(read(updated, act3), null);
  assert.deepEqual(read(updated, nextAct3), nextAct3);
  assert.equal(await matchesKoreanTranslationEdition(candidate(read(updated, nextAct3))), true);

  const refreshed = captureKoreanReviewScenes(structuredClone(novel([act2, nextAct3])));
  assert.deepEqual(refreshed, updated);
  assert.notEqual(refreshed.scenes[`3:${act3.id}`], updated.scenes[`3:${act3.id}`]);
  const refreshedWithoutAct3 = capture(act2);
  assert.equal(read(refreshedWithoutAct3, nextAct3), null);
  assert.deepEqual(read(refreshedWithoutAct3, act2), act2);
  const refreshedInHistory = capture(act2, historicalScene(nextAct3));
  assert.equal(read(refreshedInHistory, nextAct3), null);
  assert.deepEqual(read(refreshedInHistory, act2), act2);
});

test('A0 cannot seed a badge under Act2, another root document, or an EN document', () => {
  const act2 = currentScene(CONTRACTS[0]);
  const act3 = currentScene(CONTRACTS[2]);
  const snapshot = capture(act2, act3);
  for (const act of [0, 1, 2, 4, '3']) {
    assert.equal(getKoreanReviewScene(snapshot, SLUG, act, act3), null);
    assert.equal(reconcileKoreanReviewScene(snapshot, SLUG, act, act3), snapshot);
    const misplaced = { slug: SLUG, acts: [{ number: act, chapters: [{ scenes: [act3] }] }] };
    assert.deepEqual(captureKoreanReviewScenes(misplaced).scenes, {});
  }
  for (const slug of ['quantum-vibration-novel-en', 'quantum-vibration-novel-en-act-3', 'quantum-vibration-novel-act-3', 'another-root']) {
    assert.equal(getKoreanReviewScene(snapshot, slug, 3, act3), null);
    assert.equal(reconcileKoreanReviewScene(snapshot, slug, 3, act3), null);
    assert.deepEqual(captureKoreanReviewScenes(novel([act3], slug)).scenes, {});
  }
  const wrongKey = { ...snapshot, scenes: { ...snapshot.scenes, [`2:${act3.id}`]: act3 } };
  assert.equal(getKoreanReviewScene(wrongKey, SLUG, 2, act3), null);
  assert.deepEqual(read(snapshot, act2), act2);
});

test('a different Scene block or history cannot contaminate A0 while Act2 remains intact', () => {
  const act2 = currentScene(CONTRACTS[0]);
  const act3 = currentScene(CONTRACTS[2]);
  const snapshot = deepFreeze(capture(act2, act3));
  for (const mutate of [
    scene => { scene.paragraphs[0] = structuredClone(act2.paragraphs[0]); },
    scene => { scene.managedHistory = structuredClone(act2.managedHistory); },
    scene => { scene.id = act2.id; },
  ]) {
    const contaminated = structuredClone(act3);
    mutate(contaminated);
    assert.equal(getKoreanTranslationEditionCandidate({ novelSlug: SLUG, actNumber: 3, scene: contaminated }), null);
    assert.deepEqual(captureKoreanReviewScenes({ slug: SLUG, acts: [{ number: 3, chapters: [{ scenes: [contaminated] }] }] }).scenes, {});
    const updated = reconcileKoreanReviewScene(snapshot, SLUG, 3, contaminated);
    assert.deepEqual(read(updated, act2), act2);
    assert.deepEqual(read(snapshot, act3), act3);
    if (contaminated.id === act3.id) assert.equal(read(updated, act3), null);
  }
  const invalidated = invalidateKoreanReviewScene(snapshot, SLUG, 3, act3.id);
  assert.equal(read(invalidated, act3), null);
  assert.deepEqual(read(invalidated, act2), act2);
});

test('Act3 225/294 Scene navigation keeps TOC reviews and selected header versions separate after refresh', async () => {
  const compass = currentScene(CONTRACTS[2]);
  const collapse = currentScene(CONTRACTS[3]);
  const before = structuredClone([compass, collapse]);
  const snapshot = deepFreeze(capture(compass, collapse));
  assert.deepEqual(Object.keys(snapshot.scenes), [`3:${compass.id}`, `3:${collapse.id}`]);
  assert.equal(compass.paragraphs.length, 225);
  assert.equal(collapse.paragraphs.length, 294);
  assert.notEqual(compass.paragraphs[0].id, collapse.paragraphs[0].id);

  const compassSelection = { [compass.paragraphs[0].id]: 'old' };
  const collapseSelection = { [collapse.paragraphs.at(-1).id]: 'old' };
  assert.equal(candidate(compass, compassSelection), null);
  assert.equal(candidate(collapse, collapseSelection), null);
  assert.equal(await matchesKoreanTranslationEdition(candidate(collapse, compassSelection)), true);
  assert.equal(await matchesKoreanTranslationEdition(candidate(compass, collapseSelection)), true);

  // A visible legacy/old-composition header has no current badge. Navigation
  // leaves both default-review TOC entries and their independent counts intact.
  for (const visible of [collapse, compass, historicalScene(collapse), historicalScene(compass, 'old-composition'), collapse]) {
    assert.deepEqual(reconcile(snapshot, visible), snapshot);
    assert.equal(candidate(visible) !== null, !visible.managedReadOnly);
    for (const current of [compass, collapse]) {
      assert.deepEqual(read(snapshot, visible.id === current.id ? visible : current), current);
      assert.equal(await matchesKoreanTranslationEdition(candidate(read(snapshot, current))), true);
    }
  }

  const refreshed = captureKoreanReviewScenes(structuredClone(novel([compass, collapse])));
  assert.deepEqual(refreshed, snapshot);
  assert.notEqual(read(refreshed, collapse), read(snapshot, collapse));
  assert.deepEqual(read(refreshed, historicalScene(collapse)), collapse);
  assert.equal(candidate(historicalScene(collapse)), null);
  assert.deepEqual([compass, collapse], before);
  assert.deepEqual(compassSelection, { [compass.paragraphs[0].id]: 'old' });
  assert.deepEqual(collapseSelection, { [collapse.paragraphs.at(-1).id]: 'old' });
});

test('a one-block Collapse rewrite keeps the other 293 blocks and Compass review without reverting r01', async () => {
  const compass = currentScene(CONTRACTS[2]);
  const collapse = currentScene(CONTRACTS[3]);
  const snapshot = deepFreeze(capture(compass, collapse));
  const next = structuredClone(collapse);
  const nextComposition = uuid(39003);
  Object.assign(next, {
    generation: 3, compositionRevisionId: nextComposition,
    managedReviewCompositionId: nextComposition, managedViewKey: nextComposition,
  });
  for (const paragraph of next.paragraphs) {
    paragraph.generation = 3;
    paragraph.compositionRevisionId = nextComposition;
  }
  const edited = next.paragraphs[147];
  edited.revisionVersionId = uuid(39500);
  edited.versions.review.revisionVersionId = edited.revisionVersionId;
  edited.versions.review.content += ' Synthetic later author edit.';
  next.canonicalBodySha256 = digest(next.paragraphs.map(p => p.versions.review.content + p.separatorAfter).join(''));
  next.managedHistory[0].isReview = false;
  next.managedHistory.unshift({
    compositionId: nextComposition, revisionNo: 3, manuscriptVersion: 'r01',
    bodySha256: next.canonicalBodySha256, isReview: true,
  });
  const nextBefore = structuredClone(next);
  const updated = reconcile(snapshot, deepFreeze(next));
  assert.equal(await matchesKoreanTranslationEdition(candidate(read(updated, next))), true);
  assert.notEqual(candidate(next).sha256, collapse.canonicalBodySha256);
  assert.notEqual(candidate(next).sha256, CONTRACTS[3].hash);
  assert.deepEqual(read(updated, compass), compass);
  assert.deepEqual(read(snapshot, collapse), collapse);
  assert.equal(read(updated, collapse), null);
  assert.deepEqual(read(updated, historicalScene(next)), next);
  assert.equal(candidate(historicalScene(next)), null);
  assert.deepEqual(next.managedHistory.slice(1), collapse.managedHistory.map(item => ({ ...item, isReview: false })));
  for (let index = 0; index < 294; index += 1) {
    if (index === 147) continue;
    assert.equal(next.paragraphs[index].id, collapse.paragraphs[index].id);
    assert.equal(next.paragraphs[index].revisionVersionId, collapse.paragraphs[index].revisionVersionId);
    assert.deepEqual(next.paragraphs[index].versions, collapse.paragraphs[index].versions);
    assert.equal(next.paragraphs[index].separatorAfter, collapse.paragraphs[index].separatorAfter);
  }
  assert.deepEqual(next, nextBefore);
  const refreshed = captureKoreanReviewScenes(structuredClone(novel([compass, next])));
  assert.deepEqual(refreshed, updated);
});

test('Act3 Scenes reject swapped blocks, history and counts without changing the other Scene', () => {
  const compass = currentScene(CONTRACTS[2]);
  const collapse = currentScene(CONTRACTS[3]);
  const snapshot = deepFreeze(capture(compass, collapse));
  for (const mutate of [
    scene => { scene.paragraphs[0] = structuredClone(compass.paragraphs[0]); },
    scene => { scene.managedHistory = structuredClone(compass.managedHistory); },
    scene => { scene.paragraphs = scene.paragraphs.slice(0, 225); },
    scene => { scene.id = compass.id; },
  ]) {
    const changed = structuredClone(collapse);
    mutate(changed);
    assert.equal(candidate(changed), null);
    assert.deepEqual(capture(changed).scenes, {});
    // Exercise per-Scene invalidation only while the original Scene ID remains;
    // the swapped-ID case above tests contract rejection, not update routing.
    if (changed.id === collapse.id) {
      const updated = reconcile(snapshot, changed);
      assert.equal(read(updated, collapse), null);
      assert.deepEqual(read(updated, compass), compass);
    }
    assert.deepEqual(read(snapshot, compass), compass);
    assert.deepEqual(read(snapshot, collapse), collapse);
  }
});

test('Act3 225/294/367 Scene navigation keeps review tags separate across chapter boundaries and refresh', async () => {
  const compass = currentScene(CONTRACTS[2]);
  const collapse = currentScene(CONTRACTS[3]);
  const raid = currentScene(CONTRACTS[4]);
  const scenes = [compass, collapse, raid];
  const before = structuredClone(scenes);
  const loaded = {
    slug: SLUG,
    acts: [{ number: 3, chapters: [
      { number: 1, scenes: [compass, collapse] },
      { number: 2, scenes: [raid] },
    ] }],
  };
  const snapshot = deepFreeze(captureKoreanReviewScenes(loaded));
  assert.deepEqual(Object.keys(snapshot.scenes), scenes.map(scene => `3:${scene.id}`));
  assert.deepEqual(scenes.map(scene => scene.paragraphs.length), [225, 294, 367]);
  assert.equal(new Set(scenes.flatMap(scene => scene.paragraphs.map(p => p.id))).size, 886);

  for (const selectedScene of scenes) {
    const selected = { [selectedScene.paragraphs.at(-1).id]: 'old' };
    for (const visible of scenes) {
      assert.equal(await matchesKoreanTranslationEdition(candidate(visible, selected)), visible !== selectedScene);
      assert.equal(await matchesKoreanTranslationEdition(candidate(read(snapshot, visible))), true);
    }
  }
  for (const visible of [raid, compass, historicalScene(raid), collapse, historicalScene(raid, 'old-composition'), raid]) {
    assert.deepEqual(reconcile(snapshot, visible), snapshot);
    assert.equal(candidate(visible) !== null, !visible.managedReadOnly);
    for (const scene of scenes) {
      assert.deepEqual(read(snapshot, visible.id === scene.id ? visible : scene), scene);
      assert.equal(await matchesKoreanTranslationEdition(candidate(read(snapshot, scene))), true);
    }
  }
  const refreshed = captureKoreanReviewScenes(structuredClone(loaded));
  assert.deepEqual(refreshed, snapshot);
  assert.notEqual(read(refreshed, raid), read(snapshot, raid));
  assert.equal(candidate(historicalScene(raid)), null);
  assert.deepEqual(read(refreshed, historicalScene(raid)), raid);
  assert.deepEqual(scenes, before);
});

test('one Raid block rewrite preserves the other 366 blocks and preceding Scene reviews', async () => {
  const compass = currentScene(CONTRACTS[2]);
  const collapse = currentScene(CONTRACTS[3]);
  const raid = currentScene(CONTRACTS[4]);
  const snapshot = deepFreeze(capture(compass, collapse, raid));
  const next = structuredClone(raid);
  const composition = uuid(49003);
  Object.assign(next, {
    generation: 3, compositionRevisionId: composition,
    managedReviewCompositionId: composition, managedViewKey: composition,
  });
  for (const paragraph of next.paragraphs) {
    paragraph.generation = 3;
    paragraph.compositionRevisionId = composition;
  }
  const edited = next.paragraphs[183];
  edited.revisionVersionId = uuid(49500);
  edited.versions.review.revisionVersionId = edited.revisionVersionId;
  edited.versions.review.content += ' Synthetic later author edit.';
  next.canonicalBodySha256 = digest(next.paragraphs.map(p => p.versions.review.content + p.separatorAfter).join(''));
  next.managedHistory[0].isReview = false;
  next.managedHistory.unshift({
    compositionId: composition, revisionNo: 3, manuscriptVersion: 'r01',
    bodySha256: next.canonicalBodySha256, isReview: true,
  });
  const nextBefore = structuredClone(next);
  const updated = reconcile(snapshot, deepFreeze(next));
  assert.equal(await matchesKoreanTranslationEdition(candidate(read(updated, next))), true);
  assert.notEqual(candidate(next).sha256, raid.canonicalBodySha256);
  assert.notEqual(candidate(next).sha256, CONTRACTS[4].hash);
  for (const scene of [compass, collapse]) assert.deepEqual(read(updated, scene), scene);
  assert.deepEqual(read(snapshot, raid), raid);
  assert.equal(read(updated, raid), null);
  assert.deepEqual(read(updated, historicalScene(next)), next);
  assert.equal(candidate(historicalScene(next)), null);
  assert.deepEqual(next.managedHistory.slice(1), raid.managedHistory.map(item => ({ ...item, isReview: false })));
  for (let index = 0; index < 367; index += 1) {
    if (index === 183) continue;
    assert.equal(next.paragraphs[index].id, raid.paragraphs[index].id);
    assert.equal(next.paragraphs[index].revisionVersionId, raid.paragraphs[index].revisionVersionId);
    assert.deepEqual(next.paragraphs[index].versions, raid.paragraphs[index].versions);
    assert.equal(next.paragraphs[index].separatorAfter, raid.paragraphs[index].separatorAfter);
  }
  assert.deepEqual(next, nextBefore);
  assert.deepEqual(capture(compass, collapse, next), updated);
});

test('Raid rejects preceding Scene identity, blocks, history and counts without invalidating those Scenes', () => {
  const compass = currentScene(CONTRACTS[2]);
  const collapse = currentScene(CONTRACTS[3]);
  const raid = currentScene(CONTRACTS[4]);
  const snapshot = deepFreeze(capture(compass, collapse, raid));
  for (const other of [compass, collapse]) {
    for (const mutate of [
      scene => { scene.paragraphs[0] = structuredClone(other.paragraphs[0]); },
      scene => { scene.managedHistory = structuredClone(other.managedHistory); },
      scene => { scene.paragraphs = scene.paragraphs.slice(0, other.paragraphs.length); },
      scene => { scene.id = other.id; },
    ]) {
      const changed = structuredClone(raid);
      mutate(changed);
      assert.equal(candidate(changed), null);
      assert.deepEqual(capture(changed).scenes, {});
      if (changed.id === raid.id) {
        const updated = reconcile(snapshot, changed);
        assert.equal(read(updated, raid), null);
        for (const preceding of [compass, collapse]) assert.deepEqual(read(updated, preceding), preceding);
      }
      for (const scene of [compass, collapse, raid]) assert.deepEqual(read(snapshot, scene), scene);
    }
  }
});

test('Act3 225/294/367/360 navigation keeps default reviews and selected headers separate across chapters and refresh', async () => {
  const scenes = CONTRACTS.slice(2, 6).map(contract => currentScene(contract));
  const [compass, collapse, raid, verdict] = scenes;
  const before = structuredClone(scenes);
  const loaded = {
    slug: SLUG,
    acts: [{ number: 3, chapters: [
      { number: 1, scenes: [compass, collapse] },
      { number: 2, scenes: [raid, verdict] },
    ] }],
  };
  const snapshot = deepFreeze(captureKoreanReviewScenes(loaded));
  assert.deepEqual(Object.keys(snapshot.scenes), scenes.map(scene => `3:${scene.id}`));
  assert.deepEqual(scenes.map(scene => scene.paragraphs.length), [225, 294, 367, 360]);
  assert.equal(new Set(scenes.flatMap(scene => scene.paragraphs.map(p => p.id))).size, 1246);
  for (const selectedScene of scenes) {
    const selected = { [selectedScene.paragraphs.at(-1).id]: 'old' };
    for (const visible of scenes) {
      assert.equal(await matchesKoreanTranslationEdition(candidate(visible, selected)), visible !== selectedScene);
      assert.equal(await matchesKoreanTranslationEdition(candidate(read(snapshot, visible))), true);
    }
  }
  for (const visible of [verdict, raid, historicalScene(verdict), compass, collapse, historicalScene(verdict, 'old-composition'), verdict]) {
    assert.deepEqual(reconcile(snapshot, visible), snapshot);
    assert.equal(candidate(visible) !== null, !visible.managedReadOnly);
    for (const scene of scenes) {
      assert.deepEqual(read(snapshot, visible.id === scene.id ? visible : scene), scene);
      assert.equal(await matchesKoreanTranslationEdition(candidate(read(snapshot, scene))), true);
    }
  }
  const refreshed = captureKoreanReviewScenes(structuredClone(loaded));
  assert.deepEqual(refreshed, snapshot);
  assert.notEqual(read(refreshed, verdict), read(snapshot, verdict));
  assert.equal(candidate(historicalScene(verdict)), null);
  assert.deepEqual(read(refreshed, historicalScene(verdict)), verdict);
  assert.deepEqual(scenes, before);
});

test('one Verdict block rewrite preserves the other 359 blocks and preceding Scene reviews', async () => {
  const scenes = CONTRACTS.slice(2, 6).map(contract => currentScene(contract));
  const verdict = scenes.at(-1);
  const preceding = scenes.slice(0, -1);
  const snapshot = deepFreeze(capture(...scenes));
  const next = structuredClone(verdict);
  const composition = uuid(59003);
  Object.assign(next, {
    generation: 3, compositionRevisionId: composition,
    managedReviewCompositionId: composition, managedViewKey: composition,
  });
  for (const paragraph of next.paragraphs) {
    paragraph.generation = 3;
    paragraph.compositionRevisionId = composition;
  }
  const edited = next.paragraphs[180];
  edited.revisionVersionId = uuid(59500);
  edited.versions.review.revisionVersionId = edited.revisionVersionId;
  edited.versions.review.content += ' Synthetic later author edit.';
  next.canonicalBodySha256 = digest(next.paragraphs.map(p => p.versions.review.content + p.separatorAfter).join(''));
  next.managedHistory[0].isReview = false;
  next.managedHistory.unshift({
    compositionId: composition, revisionNo: 3, manuscriptVersion: 'r01',
    bodySha256: next.canonicalBodySha256, isReview: true,
  });
  const nextBefore = structuredClone(next);
  const updated = reconcile(snapshot, deepFreeze(next));
  assert.equal(await matchesKoreanTranslationEdition(candidate(read(updated, next))), true);
  assert.notEqual(candidate(next).sha256, verdict.canonicalBodySha256);
  assert.notEqual(candidate(next).sha256, CONTRACTS[5].hash);
  for (const scene of preceding) assert.deepEqual(read(updated, scene), scene);
  assert.deepEqual(read(snapshot, verdict), verdict);
  assert.equal(read(updated, verdict), null);
  assert.deepEqual(read(updated, historicalScene(next)), next);
  assert.equal(candidate(historicalScene(next)), null);
  assert.deepEqual(next.managedHistory.slice(1), verdict.managedHistory.map(item => ({ ...item, isReview: false })));
  for (let index = 0; index < 360; index += 1) {
    if (index === 180) continue;
    assert.equal(next.paragraphs[index].id, verdict.paragraphs[index].id);
    assert.equal(next.paragraphs[index].revisionVersionId, verdict.paragraphs[index].revisionVersionId);
    assert.deepEqual(next.paragraphs[index].versions, verdict.paragraphs[index].versions);
    assert.equal(next.paragraphs[index].separatorAfter, verdict.paragraphs[index].separatorAfter);
  }
  assert.deepEqual(next, nextBefore);
  assert.deepEqual(capture(...preceding, next), updated);
});

test('Verdict rejects preceding Scene identity, blocks, history and counts without invalidating those Scenes', () => {
  const scenes = CONTRACTS.slice(2, 6).map(contract => currentScene(contract));
  const verdict = scenes.at(-1);
  const preceding = scenes.slice(0, -1);
  const snapshot = deepFreeze(capture(...scenes));
  for (const other of preceding) {
    for (const mutate of [
      scene => { scene.paragraphs[0] = structuredClone(other.paragraphs[0]); },
      scene => { scene.managedHistory = structuredClone(other.managedHistory); },
      scene => { scene.paragraphs = Array.from({ length: other.paragraphs.length }, (_, index) => scene.paragraphs[index % 360]); },
      scene => { scene.id = other.id; },
    ]) {
      const changed = structuredClone(verdict);
      mutate(changed);
      assert.equal(candidate(changed), null);
      assert.deepEqual(capture(changed).scenes, {});
      if (changed.id === verdict.id) {
        const updated = reconcile(snapshot, changed);
        assert.equal(read(updated, verdict), null);
        for (const scene of preceding) assert.deepEqual(read(updated, scene), scene);
      }
      for (const scene of scenes) assert.deepEqual(read(snapshot, scene), scene);
    }
  }
});

test('Act3 Chapter3 261/310 navigation keeps both review tags and selected headers separate after refresh', async () => {
  const scenes = CONTRACTS.slice(2, 8).map(contract => currentScene(contract));
  const [compass, collapse, raid, verdict, first, second] = scenes;
  const before = structuredClone(scenes);
  const loaded = {
    slug: SLUG,
    acts: [{ number: 3, chapters: [
      { number: 1, scenes: [compass, collapse] },
      { number: 2, scenes: [raid, verdict] },
      { number: 3, scenes: [first, second] },
    ] }],
  };
  const snapshot = deepFreeze(captureKoreanReviewScenes(loaded));
  assert.deepEqual(Object.keys(snapshot.scenes), scenes.map(scene => `3:${scene.id}`));
  assert.deepEqual([first.paragraphs.length, second.paragraphs.length], [261, 310]);
  assert.equal(new Set(scenes.flatMap(scene => scene.paragraphs.map(p => p.id))).size, 1817);
  for (const selectedScene of [first, second]) {
    const selected = { [selectedScene.paragraphs.at(-1).id]: 'old' };
    for (const visible of scenes) {
      assert.equal(await matchesKoreanTranslationEdition(candidate(visible, selected)), visible !== selectedScene);
      assert.equal(await matchesKoreanTranslationEdition(candidate(read(snapshot, visible))), true);
    }
  }
  for (const visible of [second, first, historicalScene(first), second, historicalScene(second, 'old-composition'), first]) {
    assert.deepEqual(reconcile(snapshot, visible), snapshot);
    assert.equal(candidate(visible) !== null, !visible.managedReadOnly);
    for (const scene of scenes) {
      assert.deepEqual(read(snapshot, visible.id === scene.id ? visible : scene), scene);
      assert.equal(await matchesKoreanTranslationEdition(candidate(read(snapshot, scene))), true);
    }
  }
  const refreshed = captureKoreanReviewScenes(structuredClone(loaded));
  assert.deepEqual(refreshed, snapshot);
  for (const scene of [first, second]) {
    assert.notEqual(read(refreshed, scene), read(snapshot, scene));
    assert.equal(candidate(historicalScene(scene)), null);
    assert.deepEqual(read(refreshed, historicalScene(scene)), scene);
  }
  assert.deepEqual(scenes, before);
});

for (const contract of CONTRACTS.slice(6, 8)) {
  test(`${contract.source}: Chapter and Scene title changes preserve the same verified review badge`, async () => {
    const scene = currentScene(contract);
    const sibling = currentScene(CONTRACTS.find(other => other.source.startsWith('A0/CH03/') && other !== contract));
    const loaded = {
      slug: SLUG,
      acts: [{ number: 3, chapters: [{ number: 3, title: 'Synthetic original chapter', scenes: [scene, sibling] }] }],
    };
    const initial = deepFreeze(captureKoreanReviewScenes(loaded));
    const originalScene = structuredClone(scene);
    const updated = structuredClone(loaded);
    updated.acts[0].chapters[0].title = 'Synthetic updated chapter';
    const renamed = updated.acts[0].chapters[0].scenes[0];
    renamed.title = 'Synthetic updated scene';
    const refreshed = captureKoreanReviewScenes(updated);
    assert.deepEqual(candidate(renamed), candidate(scene));
    assert.equal(await matchesKoreanTranslationEdition(candidate(renamed)), true);
    assert.equal(await matchesKoreanTranslationEdition(candidate(read(refreshed, renamed))), true);
    assert.deepEqual(read(refreshed, renamed).paragraphs, originalScene.paragraphs);
    assert.deepEqual(read(refreshed, renamed).managedHistory, originalScene.managedHistory);
    assert.deepEqual(read(initial, scene), originalScene);
    assert.deepEqual(read(refreshed, sibling), sibling);
    assert.equal(renamed.number, originalScene.number);
    assert.equal(renamed.compositionRevisionId, originalScene.compositionRevisionId);
    assert.equal(renamed.generation, originalScene.generation);
    assert.equal(loaded.acts[0].chapters[0].title, 'Synthetic original chapter');
  });

  test(`${contract.source}: one block rewrite preserves the other ${contract.count - 1} blocks and every other review`, async () => {
    const scenes = CONTRACTS.slice(2, 8).map(item => currentScene(item));
    const current = scenes.find(scene => scene.id === contract.id);
    const others = scenes.filter(scene => scene.id !== contract.id);
    const snapshot = deepFreeze(capture(...scenes));
    const next = structuredClone(current);
    const namespace = CONTRACTS.indexOf(contract) * 10000;
    const composition = uuid(namespace + 9003);
    Object.assign(next, {
      generation: 3, compositionRevisionId: composition,
      managedReviewCompositionId: composition, managedViewKey: composition,
    });
    for (const paragraph of next.paragraphs) {
      paragraph.generation = 3;
      paragraph.compositionRevisionId = composition;
    }
    const changedIndex = Math.floor(contract.count / 2);
    const edited = next.paragraphs[changedIndex];
    edited.revisionVersionId = uuid(namespace + 9500);
    edited.versions.review.revisionVersionId = edited.revisionVersionId;
    edited.versions.review.content += ' Synthetic later author edit.';
    next.canonicalBodySha256 = digest(next.paragraphs.map(p => p.versions.review.content + p.separatorAfter).join(''));
    next.managedHistory[0].isReview = false;
    next.managedHistory.unshift({
      compositionId: composition, revisionNo: 3, manuscriptVersion: 'r01',
      bodySha256: next.canonicalBodySha256, isReview: true,
    });
    const before = structuredClone(next);
    const updated = reconcile(snapshot, deepFreeze(next));
    assert.equal(await matchesKoreanTranslationEdition(candidate(read(updated, next))), true);
    assert.notEqual(candidate(next).sha256, current.canonicalBodySha256);
    assert.notEqual(candidate(next).sha256, contract.hash);
    for (const other of others) assert.deepEqual(read(updated, other), other);
    assert.deepEqual(read(snapshot, current), current);
    assert.equal(read(updated, current), null);
    assert.deepEqual(read(updated, historicalScene(next)), next);
    assert.equal(candidate(historicalScene(next)), null);
    assert.deepEqual(next.managedHistory.slice(1), current.managedHistory.map(item => ({ ...item, isReview: false })));
    for (let index = 0; index < contract.count; index += 1) {
      if (index === changedIndex) continue;
      assert.equal(next.paragraphs[index].id, current.paragraphs[index].id);
      assert.equal(next.paragraphs[index].revisionVersionId, current.paragraphs[index].revisionVersionId);
      assert.deepEqual(next.paragraphs[index].versions, current.paragraphs[index].versions);
      assert.equal(next.paragraphs[index].separatorAfter, current.paragraphs[index].separatorAfter);
    }
    assert.deepEqual(next, before);
    assert.deepEqual(capture(...scenes.map(scene => scene.id === next.id ? next : scene)), updated);
  });
}

test('Chapter3 261/310 contracts reject exchanged IDs, blocks, history and counts without disturbing other Scenes', () => {
  const scenes = CONTRACTS.slice(2, 8).map(contract => currentScene(contract));
  const snapshot = deepFreeze(capture(...scenes));
  for (const current of scenes.slice(-2)) {
    for (const other of scenes.filter(scene => scene.id !== current.id)) {
      for (const mutate of [
        scene => { scene.paragraphs[0] = structuredClone(other.paragraphs[0]); },
        scene => { scene.managedHistory = structuredClone(other.managedHistory); },
        scene => { scene.paragraphs = Array.from({ length: other.paragraphs.length }, (_, index) => scene.paragraphs[index % current.paragraphs.length]); },
        scene => { scene.id = other.id; },
      ]) {
        const changed = structuredClone(current);
        mutate(changed);
        assert.equal(candidate(changed), null);
        assert.deepEqual(capture(changed).scenes, {});
        if (changed.id === current.id) {
          const updated = reconcile(snapshot, changed);
          assert.equal(read(updated, current), null);
          for (const unaffected of scenes.filter(scene => scene.id !== current.id)) assert.deepEqual(read(updated, unaffected), unaffected);
        }
        for (const original of scenes) assert.deepEqual(read(snapshot, original), original);
      }
    }
  }
});

test('Chapter3 missing or partial refresh does not retain a stale tag or discard its sibling review', () => {
  const first = currentScene(CONTRACTS[6]);
  const second = currentScene(CONTRACTS[7]);
  const snapshot = deepFreeze(capture(first, second));
  for (const [missing, remaining] of [[first, second], [second, first]]) {
    const refreshed = capture(remaining);
    assert.equal(read(refreshed, missing), null);
    assert.deepEqual(read(refreshed, remaining), remaining);
    const partial = structuredClone(missing);
    partial.paragraphs.pop();
    const invalidated = reconcile(snapshot, partial);
    assert.equal(read(invalidated, missing), null);
    assert.deepEqual(read(invalidated, remaining), remaining);
    assert.equal(read(capture(remaining, partial), missing), null);
    assert.deepEqual(read(snapshot, missing), missing);
  }
});

test('Reader TOC uses the current review title while the header keeps the selected historical title', async () => {
  // The source checks bind this synthetic regression to the actual consumers;
  // no manuscript, private capture, database, or network is read.
  const page = readFileSync(new URL('../../pages/novel/[...slug].tsx', import.meta.url), 'utf8');
  const reader = readFileSync(new URL('../../components/NovelPlatform/NovelFullReader.tsx', import.meta.url), 'utf8');
  assert.match(page, /getSceneTitle\(reviewScene \|\| scene, reviewScene \? \{\} : customVersionMap\)/);
  assert.match(reader, /<KoreanTranslationBadge[^\n]*scene=\{scene\}[^\n]*customVersionMap=\{customVersionMap\}[^\n]*\/>\s*\{getSceneTitle\(scene, customVersionMap\)\}/);
  for (const contract of CONTRACTS.filter(item => item.source.startsWith('A0/CH03/'))) {
    const current = currentScene(contract);
    current.title = 'Synthetic current Korean title';
    const snapshot = deepFreeze(capture(current));
    for (const viewKey of ['legacy', 'initial']) {
      const historical = historicalScene(current, viewKey);
      historical.title = 'Synthetic historical title';
      const reviewScene = read(snapshot, historical);
      assert.equal(reviewScene.title, current.title);
      assert.notEqual(reviewScene.title, historical.title);
      assert.equal(await matchesKoreanTranslationEdition(candidate(reviewScene)), true);
      assert.equal(candidate(historical), null);
      assert.equal(historical.title, 'Synthetic historical title');
      assert.equal(read(null, historical), null);
      assert.deepEqual(read(snapshot, current), current);
    }
  }
});
