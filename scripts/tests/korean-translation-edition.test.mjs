import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import test from 'node:test';
import {
  getKoreanTranslationEditionCandidate,
  matchesKoreanTranslationEdition,
} from '../../shared/lib/koreanTranslationEdition.js';

// Public-safe synthetic fixtures only: no manuscript, reports, credentials,
// database client, or network. These hashes identify the initial editions;
// synthetic initial bodies cannot satisfy them. Synthetic rewrite fixtures
// model a verified loader result to test subsequent current-body recognition.
const OPENING_SHA = 'fe10190e78bd64a70bfea632d491601f2a3b8bbd9e04c168ca03becf7e1a642d';
const CH1_SHA = 'fe3c492c1fed62b6707fa8ac105e0bbe4b0e180688a69b6b3491251e5b4cfea6';
const MANAGED_CONTRACTS = [
  { id: '3b301af5', actNumber: 2, sourceKey: 'PRO/CH02/SC01', blocks: 139, sha256: 'b14e21ebabf5be416218d39f694ab983d78b8cde8a547747287b8e91aabb34f4' },
  { id: '30ad0834', actNumber: 2, sourceKey: 'PRO/CH02/SC02', blocks: 246, sha256: '5490825c03dfb707869a5f2b06b5fb07c44ba48be581cf3f66d53e65ab39b5a8' },
  { id: '2212e1af', actNumber: 2, sourceKey: 'PRO/CH03/SC01', blocks: 207, sha256: 'faf2439b944b52b59a641b3ea4a743b3d6430d866e7a7539fa4a299fefed7c84' },
  { id: 'fb17794c', actNumber: 2, sourceKey: 'PRO/CH03/SC02', blocks: 126, sha256: 'c8b69101f5832ddaae14ec1a25ec8b494f5b098576cda30bc80369bc2010bc9d' },
  { id: '836ceb36', actNumber: 3, sourceKey: 'A0/CH01/SC01', blocks: 225, sha256: '7cd068fed7d05b07c1fd7ebf5a087c94c1635e5a1be53ab6fe36ebaf9f48e7bf' },
  { id: '89b8150d', actNumber: 3, sourceKey: 'A0/CH01/SC02', blocks: 294, sha256: 'c13b36b424d9a50f9be44119557846029e6f1da6f3b89eaabe1052b09ac2c326' },
  { id: 'f53f1704', actNumber: 3, sourceKey: 'A0/CH02/SC01', blocks: 367, sha256: 'd4781c1eec9c1ba0cda81cac409ef20d8734ff9292e97d43d0e7fc3f85cfd821' },
  { id: '605986cc', actNumber: 3, sourceKey: 'A0/CH02/SC02', blocks: 360, sha256: '6913332a604d6929b7b3358ae829623dce25e85970efbe1ab8c2d4c1ff6a7c78' },
  { id: 'dd5e34a3', actNumber: 3, sourceKey: 'A0/CH03/SC01', blocks: 261, sha256: '54486b4a9293eed4c64c68ecd0991bdbb6728364f11130ee6e1c019f36dc7fff' },
  { id: '6e1f0f9c', actNumber: 3, sourceKey: 'A0/CH03/SC02', blocks: 310, sha256: '46d789fad4d9f25132d9beac18018861f2bc6ddd5c3d0f8db60614681be85c97' },
  { id: 'ce917762', actNumber: 3, sourceKey: 'A0/CH04/SC01', blocks: 211, sha256: '8523a50bb186ac310c0da9867b3f7f93f0d560f82150a1a9a1f7e7ce5f32abab' },
  { id: '03a2c338', actNumber: 3, sourceKey: 'A0/CH04/SC02', blocks: 247, sha256: 'aa3e84b8fd12ea7b8e71efd1dcfd32ad43743d7d7c80d3522de18dd8b1f438ba' },
  { id: '74eb2b3c', actNumber: 4, sourceKey: 'A1/CH01/SC01', blocks: 133, sha256: '0b73c59b29a545b1743676257c7810c2ac4e698c2d1f9bc74bb20ec1cd6a14af' },
  { id: 'e1ea29cd', actNumber: 4, sourceKey: 'A1/CH01/SC02', blocks: 170, sha256: '7e9ea71af04e2c6f827140ff2af63a54038a5bda46888fdbc5e9810abb865a60' },
  { id: '039dff61', actNumber: 4, sourceKey: 'A1/CH02/SC01', blocks: 227, sha256: '7878905be4d0859c923565679343fb6a813184267af7f0a0dda1a05702151f38' },
  { id: 'f18137d0', actNumber: 4, sourceKey: 'A1/CH02/SC02', blocks: 259, sha256: '1b3a5db487c0274598d9a4c3e7dde246a94e8545141f0d067753910bb2e7001a' },
  { id: 'b8ced2bc', actNumber: 4, sourceKey: 'A1/CH03/SC01', blocks: 162, sha256: '53493b4a09fabdc84988fe129ea10fa0af2dfb51f6ba767a2165333e2b7f93cc' },
  { id: '43676a32', actNumber: 4, sourceKey: 'A1/CH03/SC02', blocks: 159, sha256: '5bbdd0c3fb19208080c2c3c43d42d9dabd234ec3430f8a86da2acbb96207258f' },
  { id: '2a1a4b0d', actNumber: 4, sourceKey: 'A1/CH03/SC03', blocks: 200, sha256: 'eeb63dc2a42cea83a1f64711fdaf0846eed26ca4853e2436091d0192f3a6b004' },
  { id: 'e858f9a3', actNumber: 4, sourceKey: 'A1/CH04/SC01', blocks: 156, sha256: 'fe1c25e081181170763bf1760ebd7d2484653dfd9dcd30d234e079aba4595544' },
  { id: 'b3d54f9e', actNumber: 4, sourceKey: 'A1/CH04/SC02', blocks: 240, sha256: '3b97bc16fed3bd6d57fe5d7ada73546bc87c04241fc631986164fda745d151bd' },
  { id: '2571b97a', actNumber: 5, sourceKey: 'A2/CH02/SC02', blocks: 184, sha256: 'e2c0766a4051b8669c9aef02425d6a4e081eef2d3ae5aa1d2ed9929e1d4c8328' },
  { id: '7b33b295', actNumber: 5, sourceKey: 'A2/CH03/SC03', blocks: 227, sha256: '4625e05907c63d71a4e64dfb43ebeacb596046926b5375b64474f71707e0dcf2' },
];
const ROOT_SLUG = 'quantum-vibration-novel';
const COMPOSITION = '00000000-0000-4000-8000-000000000001';
const digest = (body) => createHash('sha256').update(body, 'utf8').digest('hex');
const syntheticUuid = (number) => `00000000-0000-4000-8000-${String(number).padStart(12, '0')}`;

if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });

function opening() {
  return {
    id: 'd9766afa',
    paragraphs: [{
      id: 'synthetic-opening-paragraph',
      activeVersion: 'v_ko-r01',
      versions: {
        'v_ko-r01': { content: 'Synthetic opening fixture.\n\n표시 검증용 문장.' },
        'v_en': { content: 'Synthetic English alternative.' },
      },
    }],
  };
}

function chapterOne() {
  return {
    id: 'b48a4f04',
    storageModel: 'ros-ko-block-v1',
    managedSceneId: '00000000-0000-4000-8000-000000000002',
    compositionRevisionId: COMPOSITION,
    managedReviewCompositionId: COMPOSITION,
    managedViewKey: COMPOSITION,
    managedReadOnly: false,
    canonicalBodySha256: CH1_SHA,
    terminalLf: 0,
    paragraphs: Array.from({ length: 79 }, (_, index) => ({
      id: `synthetic-block-${index + 1}`,
      activeVersion: 'review',
      versions: {
        review: { content: `Synthetic block ${index + 1}: 한글 α $x^2$.` },
        old: { content: `Synthetic prior block ${index + 1}.` },
      },
      separatorAfter: index < 78 ? '\n\n' : '',
    })),
  };
}

function managedChapter(contract) {
  return {
    ...chapterOne(),
    id: contract.id,
    generation: 1,
    canonicalBodySha256: contract.sha256,
    managedHistory: [{
      compositionId: COMPOSITION, revisionNo: 1, manuscriptVersion: 'r01',
      bodySha256: contract.sha256, isReview: true,
    }],
    paragraphs: Array.from({ length: contract.blocks }, (_, index) => ({
      id: syntheticUuid(index + 100),
      unitId: syntheticUuid(index + 100),
      revisionVersionId: syntheticUuid(index + 1000),
      sourceKey: `KO/${contract.sourceKey}/B${String(index + 1).padStart(4, '0')}`,
      storageModel: 'ros-ko-block-v1',
      compositionRevisionId: COMPOSITION,
      generation: 1,
      activeVersion: 'review',
      versions: {
        review: { content: `Synthetic ${contract.sourceKey} block ${index + 1}: 한글 α $x^2$.`, revisionVersionId: syntheticUuid(index + 1000) },
        old: { content: `Synthetic previous ${contract.sourceKey} block ${index + 1}.` },
      },
      separatorAfter: index < contract.blocks - 1 ? '\n\n' : '',
    })),
  };
}

function rewrittenManagedChapter(contract) {
  const scene = managedChapter(contract);
  scene.compositionRevisionId = syntheticUuid(3);
  scene.managedReviewCompositionId = scene.compositionRevisionId;
  scene.managedViewKey = scene.compositionRevisionId;
  scene.generation = 2;
  for (const paragraph of scene.paragraphs) {
    paragraph.compositionRevisionId = scene.compositionRevisionId;
    paragraph.generation = 2;
  }
  scene.paragraphs[0].revisionVersionId = syntheticUuid(5000);
  scene.paragraphs[0].versions.review.revisionVersionId = syntheticUuid(5000);
  scene.paragraphs[0].versions.review.content += ' Synthetic rewrite.';
  scene.canonicalBodySha256 = digest(scene.paragraphs.map(p => p.versions.review.content + p.separatorAfter).join(''));
  scene.managedHistory[0].isReview = false;
  scene.managedHistory.unshift({
    compositionId: scene.compositionRevisionId, revisionNo: 2, manuscriptVersion: 'r01',
    bodySha256: scene.canonicalBodySha256, isReview: true,
  });
  return scene;
}

const fixtureAct = scene => MANAGED_CONTRACTS.find(contract => contract.id === scene?.id)?.actNumber ?? 2;
const candidate = (scene, overrides = {}) => getKoreanTranslationEditionCandidate({
  novelSlug: ROOT_SLUG, actNumber: fixtureAct(scene), scene, ...overrides,
});
const freezeDeep = (value) => {
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) freezeDeep(child);
    Object.freeze(value);
  }
  return value;
};

for (const [name, fixture, expectedSha] of [
  ['Opening', opening, OPENING_SHA],
  ['CH1', chapterOne, CH1_SHA],
  ...MANAGED_CONTRACTS.map(contract => [contract.sourceKey, () => managedChapter(contract), contract.sha256]),
]) {
  test(`${name}: structural candidate preserves selected body bytes and pins the approved SHA`, () => {
    const scene = fixture();
    const result = candidate(scene);
    assert.deepEqual(result, {
      body: scene.paragraphs.map((paragraph) => paragraph.versions[paragraph.activeVersion].content
        + (name !== 'Opening' ? paragraph.separatorAfter : '')).join(''),
      sha256: expectedSha,
    });
  });

  test(`${name}: a metadata claim cannot make a synthetic body display the real edition badge`, async () => {
    const result = candidate(fixture());
    assert.notEqual(digest(result.body), expectedSha);
    assert.equal(await matchesKoreanTranslationEdition(result), false);
  });

  test(`${name}: document and ACT scope are exact, including shared EN Scene identities`, () => {
    for (const novelSlug of [undefined, '', 'quantum-vibration-novel-en', 'quantum-vibration-novel-act-2', 'quantum-vibration-novel-act-3', 'quantum-vibration-novel-en-act-3', 'quantum-vibration-vol2', `${ROOT_SLUG}/en`]) {
      assert.equal(candidate(fixture(), { novelSlug }), null, `unexpected slug: ${novelSlug}`);
    }
    for (const actNumber of [undefined, null, 0, 1, 2, 3, 4, '2', '3'].filter(value => value !== fixtureAct(fixture()))) {
      assert.equal(candidate(fixture(), { actNumber }), null, `unexpected ACT: ${actNumber}`);
    }
  });

  test(`${name}: an explicit current selection is allowed, but another or missing version is rejected`, () => {
    const scene = fixture();
    const paragraph = scene.paragraphs[0];
    const sameSelection = { [paragraph.id]: paragraph.activeVersion };
    assert.deepEqual(candidate(scene, { customVersionMap: sameSelection }), candidate(scene));
    for (const selected of ['old', 'v_en', 'not-a-version']) {
      assert.equal(candidate(scene, { customVersionMap: { [paragraph.id]: selected } }), null);
    }
    assert.deepEqual(candidate(scene, { customVersionMap: { unrelated: 'old' } }), candidate(scene));
  });

  test(`${name}: an inactive approved version cannot relabel the active edition`, () => {
    const scene = fixture();
    const paragraph = scene.paragraphs[0];
    const priorActive = paragraph.activeVersion;
    paragraph.activeVersion = 'old';
    paragraph.versions.old = { content: paragraph.versions[priorActive].content };
    assert.equal(candidate(scene), null);
    assert.equal(candidate(scene, { customVersionMap: { [paragraph.id]: priorActive } }), null);
  });

  test(`${name}: malformed paragraphs and non-string bodies fail closed`, () => {
    const missing = fixture();
    delete missing.paragraphs;
    assert.equal(candidate(missing), null);
    assert.equal(candidate({ ...fixture(), paragraphs: {} }), null);
    assert.equal(candidate({ ...fixture(), paragraphs: [] }), null);
    for (const invalid of [null, undefined]) {
      const scene = fixture();
      scene.paragraphs[0] = invalid;
      assert.equal(candidate(scene), null);
    }
    for (const body of [null, undefined, 0, {}, ['text']]) {
      const scene = fixture();
      const paragraph = scene.paragraphs[0];
      paragraph.versions[paragraph.activeVersion].content = body;
      assert.equal(candidate(scene), null);
    }
    const noVersions = fixture();
    delete noVersions.paragraphs[0].versions;
    assert.equal(candidate(noVersions), null);
  });

  test(`${name}: read-only and legacy views never receive the current edition badge`, () => {
    assert.equal(candidate({ ...fixture(), managedReadOnly: true }), null);
    assert.equal(candidate({ ...fixture(), managedViewKey: 'legacy' }), null);
  });

  test(`${name}: structural and hash checks do not mutate scene, versions, selection, or candidate`, async () => {
    const scene = fixture();
    scene.title = 'Synthetic unchanged title';
    scene.publication = { editorial_version: 'synthetic-existing', approved_sha256: 'a'.repeat(64), applied_at: '2000-01-01T00:00:00Z' };
    const customVersionMap = { [scene.paragraphs[0].id]: scene.paragraphs[0].activeVersion };
    const options = { novelSlug: ROOT_SLUG, actNumber: fixtureAct(scene), scene, customVersionMap };
    const before = structuredClone(options);
    freezeDeep(options);
    const result = getKoreanTranslationEditionCandidate(options);
    const resultBefore = structuredClone(result);
    freezeDeep(result);
    assert.equal(await matchesKoreanTranslationEdition(result), false);
    assert.deepEqual(options, before);
    assert.deepEqual(result, resultBefore);
  });
}

test('legacy managed chapters and unregistered or prototype-like Scene IDs cannot gain tags through dates or titles', () => {
  for (const id of [...MANAGED_CONTRACTS.map(contract => contract.id), 'unknown', 'constructor', '__proto__', 'toString', undefined]) {
    const scene = { ...opening(), id, title: '[국문 v1]', updatedAt: '2026-10-06', createdAt: '2026-10-05' };
    assert.equal(candidate(scene), null);
  }
  assert.equal(candidate(null), null);
  assert.equal(candidate(undefined), null);
});

for (const contract of MANAGED_CONTRACTS) {
  test(`${contract.sourceKey}: a normal current r01 rewrite verifies against its new hash, without relabeling history`, async () => {
    const scene = rewrittenManagedChapter(contract);
    const before = structuredClone(scene);
    freezeDeep(scene);
    const result = candidate(scene);
    assert.notEqual(result.sha256, contract.sha256);
    assert.equal(result.sha256, scene.managedHistory[0].bodySha256);
    assert.equal(await matchesKoreanTranslationEdition(result), true);
    assert.deepEqual(scene, before);
    const stale = structuredClone(scene);
    Object.assign(stale, { compositionRevisionId: COMPOSITION, managedViewKey: COMPOSITION });
    assert.equal(candidate(stale), null);
    assert.equal(candidate({ ...scene, managedReadOnly: true }), null);
    assert.equal(candidate({ ...scene, managedViewKey: 'legacy' }), null);
  });

  test(`${contract.sourceKey}: later review generations retain recognition and leave earlier compositions unchanged`, async () => {
    const scene = rewrittenManagedChapter(contract);
    const previous = structuredClone(scene);
    scene.generation = 3;
    scene.compositionRevisionId = syntheticUuid(4);
    scene.managedReviewCompositionId = scene.compositionRevisionId;
    scene.managedViewKey = scene.compositionRevisionId;
    for (const paragraph of scene.paragraphs) {
      paragraph.compositionRevisionId = scene.compositionRevisionId;
      paragraph.generation = scene.generation;
    }
    const rewritten = scene.paragraphs.at(-1);
    rewritten.revisionVersionId = syntheticUuid(5001);
    rewritten.versions.review.revisionVersionId = rewritten.revisionVersionId;
    rewritten.versions.review.content += ' A subsequent synthetic rewrite.';
    scene.canonicalBodySha256 = digest(scene.paragraphs.map(p => p.versions.review.content + p.separatorAfter).join(''));
    scene.managedHistory[0].isReview = false;
    scene.managedHistory.unshift({
      compositionId: scene.compositionRevisionId, revisionNo: 3, manuscriptVersion: 'r01',
      bodySha256: scene.canonicalBodySha256, isReview: true,
    });
    const before = structuredClone(scene);
    freezeDeep(scene);
    const result = candidate(scene);
    assert.equal(result.sha256, scene.canonicalBodySha256);
    assert.notEqual(result.sha256, previous.canonicalBodySha256);
    assert.equal(await matchesKoreanTranslationEdition(result), true);
    assert.deepEqual(scene, before);
    assert.deepEqual(scene.managedHistory.slice(1), previous.managedHistory.map(item => ({ ...item, isReview: false })));
    assert.equal(candidate({ ...previous, managedReviewCompositionId: scene.compositionRevisionId }), null);
  });

  test(`${contract.sourceKey}: current SHA must match actual displayed bytes after a rewrite`, async () => {
    const scene = rewrittenManagedChapter(contract);
    for (const index of [0, Math.floor(contract.blocks / 2), contract.blocks - 1]) {
      const changed = structuredClone(scene);
      changed.paragraphs[index].versions.review.content += ' Unexpected edit.';
      assert.equal(await matchesKoreanTranslationEdition(candidate(changed)), false);
    }
    assert.equal(candidate(scene, { customVersionMap: { [scene.paragraphs.at(-1).id]: 'old' } }), null);
  });

  test(`${contract.sourceKey}: missing or inconsistent managed DB identity fails closed`, () => {
    for (const changes of [
      { storageModel: undefined }, { storageModel: 'legacy' },
      { managedSceneId: undefined }, { managedSceneId: 'invented-id' },
      { compositionRevisionId: undefined }, { compositionRevisionId: 'invented-id' },
      { managedReviewCompositionId: undefined }, { managedReviewCompositionId: syntheticUuid(90) },
      { managedViewKey: undefined }, { managedViewKey: syntheticUuid(90) },
      { managedReadOnly: undefined }, { managedReadOnly: true },
      { generation: undefined }, { generation: 0 }, { generation: '1' },
      { terminalLf: undefined }, { terminalLf: 1 },
      { canonicalBodySha256: undefined }, { canonicalBodySha256: contract.sha256.toUpperCase() },
      { managedHistory: undefined }, { managedHistory: [] }, { managedHistory: {} }, { managedHistory: [null] },
    ]) assert.equal(candidate({ ...managedChapter(contract), ...changes }), null, JSON.stringify(changes));
  });

  test(`${contract.sourceKey}: the imported r01 anchor and selected current edition must both be proved`, () => {
    for (const mutate of [
      scene => { scene.managedHistory.pop(); },
      scene => { scene.managedHistory[1].bodySha256 = '0'.repeat(64); },
      scene => { scene.managedHistory[1].manuscriptVersion = 'r00'; },
      scene => { scene.managedHistory[1].compositionId = 'invented-id'; },
      scene => { scene.managedHistory[1].revisionNo = 0; },
      scene => { scene.managedHistory[0].manuscriptVersion = 'r02'; },
      scene => { scene.managedHistory[0].revisionNo = '2'; },
      scene => { scene.managedHistory[0].revisionNo = 0; },
      scene => { scene.managedHistory[0].bodySha256 = contract.sha256; },
      scene => { scene.managedHistory[0].isReview = false; },
      scene => { scene.managedHistory[1].isReview = true; },
      scene => { scene.managedHistory.push(structuredClone(scene.managedHistory[0])); },
      scene => { scene.managedHistory.push(structuredClone(scene.managedHistory[1])); },
    ]) {
      const scene = rewrittenManagedChapter(contract);
      mutate(scene);
      assert.equal(candidate(scene), null);
    }
    // Re-hashing an unrelated first import cannot make it the authorized r01.
    const unrelated = managedChapter(contract);
    unrelated.canonicalBodySha256 = digest('unrelated import');
    unrelated.managedHistory[0].bodySha256 = unrelated.canonicalBodySha256;
    assert.equal(candidate(unrelated), null);
  });

  test(`${contract.sourceKey}: every block stays bound to its KO source, Unit, Version and composition`, () => {
    for (const index of [0, Math.floor(contract.blocks / 2), contract.blocks - 1]) {
      for (const changes of [
        { storageModel: undefined }, { sourceKey: undefined }, { sourceKey: `EN/${contract.sourceKey}/B0001` },
        { sourceKey: `KO/PRO/CH01/SC01/B${String(index + 1).padStart(4, '0')}` },
        { unitId: undefined }, { unitId: 'invented-id' }, { id: 'invented-id' },
        { revisionVersionId: undefined }, { revisionVersionId: syntheticUuid(90) },
        { compositionRevisionId: undefined }, { compositionRevisionId: syntheticUuid(90) },
        { generation: undefined }, { generation: 2 },
      ]) {
        const scene = managedChapter(contract);
        Object.assign(scene.paragraphs[index], changes);
        assert.equal(candidate(scene), null, `block ${index + 1}: ${JSON.stringify(changes)}`);
      }
      const scene = managedChapter(contract);
      delete scene.paragraphs[index].versions.review.revisionVersionId;
      assert.equal(candidate(scene), null);
    }
    for (const field of ['unit', 'version']) {
      const scene = managedChapter(contract);
      if (field === 'unit') {
        scene.paragraphs[1].id = scene.paragraphs[0].id;
        scene.paragraphs[1].unitId = scene.paragraphs[0].unitId;
      } else {
        scene.paragraphs[1].revisionVersionId = scene.paragraphs[0].revisionVersionId;
        scene.paragraphs[1].versions.review.revisionVersionId = scene.paragraphs[0].revisionVersionId;
      }
      assert.equal(candidate(scene), null);
    }
    const reordered = managedChapter(contract);
    [reordered.paragraphs[0], reordered.paragraphs[1]] = [reordered.paragraphs[1], reordered.paragraphs[0]];
    assert.equal(candidate(reordered), null);
  });

  test(`${contract.sourceKey}: exact block count and every separator are required`, () => {
    for (const count of [1, 79, contract.blocks - 1, contract.blocks + 1]) {
      const scene = managedChapter(contract);
      scene.paragraphs = Array.from({ length: count }, (_, index) => scene.paragraphs[index % contract.blocks]);
      assert.equal(candidate(scene), null);
    }
    for (let index = 0; index < contract.blocks; index += 1) {
      for (const separatorAfter of [undefined, '\n', '\r\n\r\n', index < contract.blocks - 1 ? '' : '\n\n']) {
        const scene = managedChapter(contract);
        scene.paragraphs[index].separatorAfter = separatorAfter;
        assert.equal(candidate(scene), null, `block ${index + 1}`);
      }
    }
    const terminal = rewrittenManagedChapter(contract);
    terminal.paragraphs.at(-1).versions.review.content += '\n';
    assert.equal(candidate(terminal), null);
  });
}

test('Opening requires exactly one paragraph', () => {
  const scene = opening();
  scene.paragraphs.push(structuredClone(scene.paragraphs[0]));
  assert.equal(candidate(scene), null);
});

test('CH1 requires exactly 79 blocks, not a partial or extended scene', () => {
  for (const count of [1, 78, 80, 139, 246]) {
    const scene = chapterOne();
    scene.paragraphs = Array.from({ length: count }, (_, index) => ({
      ...structuredClone(scene.paragraphs[index % 79]),
      separatorAfter: index < count - 1 ? '\n\n' : '',
    }));
    assert.equal(candidate(scene), null, `unexpected block count: ${count}`);
  }
});

test('CH1 requires managed storage and the current review composition', () => {
  for (const storageModel of [undefined, '', 'legacy']) assert.equal(candidate({ ...chapterOne(), storageModel }), null);
  for (const changes of [
    { compositionRevisionId: undefined },
    { compositionRevisionId: '' },
    { managedReviewCompositionId: undefined },
    { managedReviewCompositionId: '' },
    { compositionRevisionId: 'prior-composition' },
  ]) assert.equal(candidate({ ...chapterOne(), ...changes }), null);
});

test('CH1 rejects a missing, changed, or caller-computed canonical hash', () => {
  for (const canonicalBodySha256 of [undefined, '', '0'.repeat(64), CH1_SHA.toUpperCase(), digest('synthetic-body')]) {
    assert.equal(candidate({ ...chapterOne(), canonicalBodySha256 }), null);
  }
});

test('CH1 validates every one of the 78 separators and the exact empty final separator', () => {
  for (let index = 0; index < 79; index += 1) {
    for (const separatorAfter of [undefined, '\n', '\r\n\r\n', ' ', index < 78 ? '' : '\n\n']) {
      const scene = chapterOne();
      scene.paragraphs[index].separatorAfter = separatorAfter;
      assert.equal(candidate(scene), null, `invalid separator at block ${index + 1}`);
    }
  }
  const result = candidate(chapterOne());
  assert.equal(result.body.split('\n\n').length - 1, 78);
  assert.equal(result.body.endsWith('\n'), false);
});

test('a non-first CH1 block with another active or selected version is rejected', () => {
  for (const index of [1, 38, 78]) {
    const scene = chapterOne();
    assert.equal(candidate(scene, { customVersionMap: { [scene.paragraphs[index].id]: 'old' } }), null);
    scene.paragraphs[index].activeVersion = 'old';
    assert.equal(candidate(scene), null);
  }
});

test('the async verifier matches the independent known SHA-256 vector', async () => {
  const vector = freezeDeep({ body: 'abc', sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' });
  assert.equal(await matchesKoreanTranslationEdition(vector), true);
  assert.equal(await matchesKoreanTranslationEdition({ ...vector, body: 'abcd' }), false);
  assert.equal(await matchesKoreanTranslationEdition({ ...vector, sha256: '0'.repeat(64) }), false);
});

test('hash verification is exact UTF-8 without trimming, newline conversion, or Unicode normalization', async () => {
  const body = '  Synthetic 한글 café α $x^2$.\n\nSecond block.  ';
  const sha256 = digest(body);
  assert.equal(await matchesKoreanTranslationEdition({ body, sha256 }), true);
  for (const changed of [body.trim(), `${body}\n`, body.replaceAll('\n', '\r\n'), body.normalize('NFD'), body.replace('Second', 'Changed')]) {
    assert.notEqual(changed, body);
    assert.equal(await matchesKoreanTranslationEdition({ body: changed, sha256 }), false);
  }
});

test('invalid hash candidates fail closed', async () => {
  for (const value of [null, undefined, {}, { body: null, sha256: OPENING_SHA }, { body: 5, sha256: CH1_SHA }, { body: 'abc' }, { body: 'abc', sha256: null }, { body: 'abc', sha256: 'not-a-hash' }]) {
    assert.equal(await matchesKoreanTranslationEdition(value), false);
  }
});

// Synthetic three-line formulas exercise block boundaries, not manuscript
// contents or live DB state. Each formula is one selected Version body.
function arrivalWithMultilineFormulas() {
  const scene = rewrittenManagedChapter(MANAGED_CONTRACTS.find(contract => contract.id === 'f18137d0'));
  scene.paragraphs[85].versions.review.content = '$$\na_{86} = \\frac{b}{c}\n$$';
  scene.paragraphs[143].versions.review.content = '$$\nz_{144} = \\sum_k x_k\n$$';
  scene.canonicalBodySha256 = digest(scene.paragraphs.map(p => p.versions.review.content + p.separatorAfter).join(''));
  scene.managedHistory[0].bodySha256 = scene.canonicalBodySha256;
  return scene;
}

test('Arrival: 259 selected blocks preserve two three-line formulas and LF520 without flattening', async () => {
  const scene = arrivalWithMultilineFormulas();
  const before = structuredClone(scene);
  freezeDeep(scene);
  const result = candidate(scene);
  assert.equal(scene.paragraphs.length, 259);
  assert.equal(result.body.split('\n\n').length, 259);
  assert.equal((result.body.match(/\n/g) || []).length, 520);
  assert.equal(scene.paragraphs.reduce((total, p) => total + (p.separatorAfter.match(/\n/g) || []).length, 0), 516);
  for (const [index, paragraph] of scene.paragraphs.entries()) {
    const content = paragraph.versions.review.content;
    assert.equal((content.match(/\n/g) || []).length, [85, 143].includes(index) ? 2 : 0);
    assert.equal(result.body.split('\n\n')[index], content);
  }
  assert.equal(result.body.endsWith('\n'), false);
  assert.equal(await matchesKoreanTranslationEdition(result), true);
  assert.deepEqual(scene, before);
});

test('Arrival: formula flattening, double escaping, line-ending changes and three-block splitting cannot verify', async () => {
  const current = arrivalWithMultilineFormulas();
  for (const index of [85, 143]) {
    for (const transform of [
      text => text.replaceAll('\n', ' '),
      text => text.replaceAll('\n', '\\n'),
      text => text.replaceAll('\n', '\r\n'),
      text => text.replaceAll('\\', '\\\\'),
    ]) {
      const changed = structuredClone(current);
      changed.paragraphs[index].versions.review.content = transform(changed.paragraphs[index].versions.review.content);
      assert.equal(await matchesKoreanTranslationEdition(candidate(changed)), false);
    }
    const split = structuredClone(current);
    const formula = split.paragraphs[index];
    split.paragraphs.splice(index, 1, ...formula.versions.review.content.split('\n').map(content => ({
      ...structuredClone(formula), versions: { review: { ...formula.versions.review, content } },
    })));
    assert.equal(split.paragraphs.length, 261);
    assert.equal(candidate(split), null);
  }
  assert.equal(await matchesKoreanTranslationEdition(candidate(current)), true);
});
