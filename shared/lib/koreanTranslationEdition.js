import { sha256Hex } from './rosKoBlockModel.js';

// Display-only recognition. Managed support is conditional on loaded DB
// evidence; registering a contract here does not mean its import has happened.
// This is neither publication metadata nor a new manuscript/storage version.
// Do not infer a new translation from updatedAt, a title, or a reused EN Scene ID.
const editions = Object.freeze({
  d9766afa: Object.freeze({
    actNumber: 2,
    blocks: 1,
    sha256: 'fe10190e78bd64a70bfea632d491601f2a3b8bbd9e04c168ca03becf7e1a642d',
    version: 'v_ko-r01',
  }),
  b48a4f04: Object.freeze({
    actNumber: 2,
    blocks: 79,
    sha256: 'fe3c492c1fed62b6707fa8ac105e0bbe4b0e180688a69b6b3491251e5b4cfea6',
    version: 'review',
  }),
  '3b301af5': Object.freeze({
    actNumber: 2,
    blocks: 139,
    sha256: 'b14e21ebabf5be416218d39f694ab983d78b8cde8a547747287b8e91aabb34f4',
    version: 'review',
    sourceKey: 'PRO/CH02/SC01',
  }),
  '30ad0834': Object.freeze({
    actNumber: 2,
    blocks: 246,
    sha256: '5490825c03dfb707869a5f2b06b5fb07c44ba48be581cf3f66d53e65ab39b5a8',
    version: 'review',
    sourceKey: 'PRO/CH02/SC02',
  }),
  '2212e1af': Object.freeze({
    actNumber: 2,
    blocks: 207,
    sha256: 'faf2439b944b52b59a641b3ea4a743b3d6430d866e7a7539fa4a299fefed7c84',
    version: 'review',
    sourceKey: 'PRO/CH03/SC01',
  }),
  fb17794c: Object.freeze({
    actNumber: 2,
    blocks: 126,
    sha256: 'c8b69101f5832ddaae14ec1a25ec8b494f5b098576cda30bc80369bc2010bc9d',
    version: 'review',
    sourceKey: 'PRO/CH03/SC02',
  }),
  '836ceb36': Object.freeze({
    // Literary ACT 0 is stored under internal Act 3, not the Prologue Act.
    actNumber: 3,
    blocks: 225,
    sha256: '7cd068fed7d05b07c1fd7ebf5a087c94c1635e5a1be53ab6fe36ebaf9f48e7bf',
    version: 'review',
    sourceKey: 'A0/CH01/SC01',
  }),
  '89b8150d': Object.freeze({
    actNumber: 3,
    blocks: 294,
    sha256: 'c13b36b424d9a50f9be44119557846029e6f1da6f3b89eaabe1052b09ac2c326',
    version: 'review',
    sourceKey: 'A0/CH01/SC02',
  }),
  f53f1704: Object.freeze({
    actNumber: 3,
    blocks: 367,
    sha256: 'd4781c1eec9c1ba0cda81cac409ef20d8734ff9292e97d43d0e7fc3f85cfd821',
    version: 'review',
    sourceKey: 'A0/CH02/SC01',
  }),
  '605986cc': Object.freeze({
    actNumber: 3,
    blocks: 360,
    sha256: '6913332a604d6929b7b3358ae829623dce25e85970efbe1ab8c2d4c1ff6a7c78',
    version: 'review',
    sourceKey: 'A0/CH02/SC02',
  }),
  dd5e34a3: Object.freeze({
    actNumber: 3,
    blocks: 261,
    sha256: '54486b4a9293eed4c64c68ecd0991bdbb6728364f11130ee6e1c019f36dc7fff',
    version: 'review',
    sourceKey: 'A0/CH03/SC01',
  }),
  '6e1f0f9c': Object.freeze({
    actNumber: 3,
    blocks: 310,
    sha256: '46d789fad4d9f25132d9beac18018861f2bc6ddd5c3d0f8db60614681be85c97',
    version: 'review',
    sourceKey: 'A0/CH03/SC02',
  }),
  ce917762: Object.freeze({
    actNumber: 3,
    blocks: 211,
    sha256: '8523a50bb186ac310c0da9867b3f7f93f0d560f82150a1a9a1f7e7ce5f32abab',
    version: 'review',
    sourceKey: 'A0/CH04/SC01',
  }),
  '03a2c338': Object.freeze({
    actNumber: 3,
    blocks: 247,
    sha256: 'aa3e84b8fd12ea7b8e71efd1dcfd32ad43743d7d7c80d3522de18dd8b1f438ba',
    version: 'review',
    sourceKey: 'A0/CH04/SC02',
  }),
  '74eb2b3c': Object.freeze({
    actNumber: 4,
    blocks: 133,
    sha256: '0b73c59b29a545b1743676257c7810c2ac4e698c2d1f9bc74bb20ec1cd6a14af',
    version: 'review',
    sourceKey: 'A1/CH01/SC01',
  }),
  e1ea29cd: Object.freeze({
    actNumber: 4,
    blocks: 170,
    sha256: '7e9ea71af04e2c6f827140ff2af63a54038a5bda46888fdbc5e9810abb865a60',
    version: 'review',
    sourceKey: 'A1/CH01/SC02',
  }),
  '039dff61': Object.freeze({
    actNumber: 4,
    blocks: 227,
    sha256: '7878905be4d0859c923565679343fb6a813184267af7f0a0dda1a05702151f38',
    version: 'review',
    sourceKey: 'A1/CH02/SC01',
  }),
  f18137d0: Object.freeze({
    actNumber: 4,
    blocks: 259,
    sha256: '1b3a5db487c0274598d9a4c3e7dde246a94e8545141f0d067753910bb2e7001a',
    version: 'review',
    sourceKey: 'A1/CH02/SC02',
  }),
  b8ced2bc: Object.freeze({
    actNumber: 4,
    blocks: 162,
    sha256: '53493b4a09fabdc84988fe129ea10fa0af2dfb51f6ba767a2165333e2b7f93cc',
    version: 'review',
    sourceKey: 'A1/CH03/SC01',
  }),
  '43676a32': Object.freeze({
    actNumber: 4,
    blocks: 159,
    sha256: '5bbdd0c3fb19208080c2c3c43d42d9dabd234ec3430f8a86da2acbb96207258f',
    version: 'review',
    sourceKey: 'A1/CH03/SC02',
  }),
  '2a1a4b0d': Object.freeze({
    actNumber: 4,
    blocks: 200,
    sha256: 'eeb63dc2a42cea83a1f64711fdaf0846eed26ca4853e2436091d0192f3a6b004',
    version: 'review',
    sourceKey: 'A1/CH03/SC03',
  }),
  e858f9a3: Object.freeze({
    actNumber: 4,
    blocks: 156,
    sha256: 'fe1c25e081181170763bf1760ebd7d2484653dfd9dcd30d234e079aba4595544',
    version: 'review',
    sourceKey: 'A1/CH04/SC01',
  }),
  b3d54f9e: Object.freeze({
    actNumber: 4,
    blocks: 240,
    sha256: '3b97bc16fed3bd6d57fe5d7ada73546bc87c04241fc631986164fda745d151bd',
    version: 'review',
    sourceKey: 'A1/CH04/SC02',
  }),
  '2571b97a': Object.freeze({
    actNumber: 5,
    blocks: 184,
    sha256: 'e2c0766a4051b8669c9aef02425d6a4e081eef2d3ae5aa1d2ed9929e1d4c8328',
    version: 'review',
    sourceKey: 'A2/CH02/SC02',
  }),
  ec639075: Object.freeze({
    actNumber: 5,
    blocks: 228,
    sha256: 'd822ba9c702cce5eb72a3758d5d6b9d4573a842991cbb89b123f2a920d27459b',
    version: 'review',
    sourceKey: 'A2/CH03/SC02',
  }),
});

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hash = /^[0-9a-f]{64}$/;

const currentManagedEditionHash = (scene, edition) => {
  // The managed loader verifies the RPC projection and body before exposing
  // this history. Initial r01 identifies the imported edition; later ordinary
  // block rewrites retain r01 but receive their own composition and body hash.
  if (!uuid.test(scene.managedSceneId || '') || !uuid.test(scene.compositionRevisionId || '')
    || scene.managedViewKey !== scene.compositionRevisionId || scene.managedReadOnly !== false
    || !Number.isSafeInteger(scene.generation) || scene.generation < 1 || scene.terminalLf !== 0
    || !hash.test(scene.canonicalBodySha256 || '') || !Array.isArray(scene.managedHistory)) return null;
  const imports = scene.managedHistory.filter((item) => item?.revisionNo === 1);
  const reviews = scene.managedHistory.filter((item) => item?.isReview === true);
  const selected = scene.managedHistory.filter((item) => item?.compositionId === scene.compositionRevisionId);
  if (imports.length !== 1 || reviews.length !== 1 || selected.length !== 1) return null;
  const initial = imports[0];
  const current = selected[0];
  if (!uuid.test(initial.compositionId || '') || initial.manuscriptVersion !== 'r01'
    || initial.bodySha256 !== edition.sha256 || current !== reviews[0]
    || current.manuscriptVersion !== 'r01' || !Number.isSafeInteger(current.revisionNo)
    || current.revisionNo < 1 || current.bodySha256 !== scene.canonicalBodySha256) return null;
  return current.bodySha256;
};

export function getKoreanTranslationEditionCandidate({ novelSlug, actNumber, scene, customVersionMap = {} }) {
  if (novelSlug !== 'quantum-vibration-novel' || !scene) return null;
  if (typeof scene.id !== 'string') return null;
  const edition = Object.hasOwn(editions, scene.id) ? editions[scene.id] : null;
  if (!edition || actNumber !== edition.actNumber
    || !Array.isArray(scene.paragraphs) || scene.paragraphs.length !== edition.blocks) return null;
  if (scene.managedReadOnly || scene.managedViewKey === 'legacy') return null;

  const managed = edition.version === 'review';
  if (managed && (
    scene.storageModel !== 'ros-ko-block-v1' ||
    !scene.compositionRevisionId ||
    scene.compositionRevisionId !== scene.managedReviewCompositionId
  )) return null;
  const expectedSha256 = edition.sourceKey ? currentManagedEditionHash(scene, edition) : edition.sha256;
  if (!expectedSha256 || (managed && scene.canonicalBodySha256 !== expectedSha256)) return null;

  const blocks = [];
  const unitIds = new Set();
  const versionIds = new Set();
  for (const [index, paragraph] of scene.paragraphs.entries()) {
    const selected = customVersionMap[paragraph?.id] || paragraph?.activeVersion;
    if (paragraph?.activeVersion !== edition.version || selected !== edition.version) return null;
    const body = paragraph.versions?.[selected]?.content;
    if (typeof body !== 'string') return null;
    const separator = managed && index < edition.blocks - 1 ? '\n\n' : '';
    if (managed && paragraph.separatorAfter !== separator) return null;
    if (edition.sourceKey) {
      if (paragraph.storageModel !== 'ros-ko-block-v1'
        || paragraph.sourceKey !== `KO/${edition.sourceKey}/B${String(index + 1).padStart(4, '0')}`
        || paragraph.compositionRevisionId !== scene.compositionRevisionId || paragraph.generation !== scene.generation
        || !uuid.test(paragraph.unitId || '') || paragraph.id !== paragraph.unitId
        || !uuid.test(paragraph.revisionVersionId || '')
        || paragraph.versions[selected].revisionVersionId !== paragraph.revisionVersionId
        || unitIds.has(paragraph.unitId) || versionIds.has(paragraph.revisionVersionId)) return null;
      unitIds.add(paragraph.unitId);
      versionIds.add(paragraph.revisionVersionId);
    }
    blocks.push(body + separator);
  }
  const body = blocks.join('');
  if (edition.sourceKey && body.endsWith('\n')) return null;
  return { body, sha256: expectedSha256 };
}

export async function matchesKoreanTranslationEdition(candidate) {
  if (!candidate || typeof candidate.body !== 'string' || typeof candidate.sha256 !== 'string') return false;
  return await sha256Hex(candidate.body) === candidate.sha256;
}
