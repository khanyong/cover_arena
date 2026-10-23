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
  '52902ef2': Object.freeze({
    actNumber: 4,
    blocks: 183,
    sha256: '4a7a718d5048f3785e77be90f0d18e79d3e7f1c461b738a508ecb6db3c69a42b',
    version: 'review',
    sourceKey: 'A1/CH04/SC03',
  }),
  b7c0daf4: Object.freeze({
    actNumber: 5,
    blocks: 311,
    sha256: 'c47576d4113d76ae934a85896f0c8f5a69cdf50dba8a168447873d81d299bbde',
    version: 'review',
    sourceKey: 'A2/CH01/SC01',
  }),
  '7795c33b': Object.freeze({
    actNumber: 5,
    blocks: 235,
    sha256: '595578fbf7bc6305782ac9d1904082f79e2f81b7b51cf0be1fec7ef28bc4a67e',
    version: 'review',
    sourceKey: 'A2/CH01/SC02',
  }),
  e9c8ba2a: Object.freeze({
    actNumber: 5,
    blocks: 215,
    sha256: 'a940132fe25d3dedab7c0d6fb1a9a738123b1b4158fc2116727777c9dc9a1f38',
    version: 'review',
    sourceKey: 'A2/CH02/SC01',
  }),
  '2571b97a': Object.freeze({
    actNumber: 5,
    blocks: 184,
    sha256: 'e2c0766a4051b8669c9aef02425d6a4e081eef2d3ae5aa1d2ed9929e1d4c8328',
    version: 'review',
    sourceKey: 'A2/CH02/SC02',
  }),
  f7cf08b2: Object.freeze({
    actNumber: 5,
    blocks: 264,
    sha256: '87de1979abf329b8c88a88e377a23fa52618b3d7ff273873003b6dc98decb598',
    version: 'review',
    sourceKey: 'A2/CH03/SC01',
  }),
  ec639075: Object.freeze({
    actNumber: 5,
    blocks: 228,
    sha256: 'd822ba9c702cce5eb72a3758d5d6b9d4573a842991cbb89b123f2a920d27459b',
    version: 'review',
    sourceKey: 'A2/CH03/SC02',
  }),
  '7b33b295': Object.freeze({
    actNumber: 5,
    blocks: 227,
    sha256: '4625e05907c63d71a4e64dfb43ebeacb596046926b5375b64474f71707e0dcf2',
    version: 'review',
    sourceKey: 'A2/CH03/SC03',
  }),
  '7999ed7c': Object.freeze({
    actNumber: 5,
    blocks: 209,
    sha256: '7a0ee31aa11f0f481e699c94ae49ce63b1e9bf8e5c46779e018541f4e7a9d283',
    version: 'review',
    sourceKey: 'A2/CH04/SC01',
  }),
  '8ea1c60e': Object.freeze({
    actNumber: 5,
    blocks: 237,
    sha256: '0929aa984e94ba627f2f3bcf50b31fc29c26500cb1b6954219982bdc19869df7',
    version: 'review',
    sourceKey: 'A2/CH04/SC02',
  }),
  '309ff3fd': Object.freeze({
    actNumber: 5,
    blocks: 295,
    sha256: '7e8f17de29c28b6193285720b10313798470556e592f37f87392370b19bc2789',
    version: 'review',
    sourceKey: 'A2/CH04/SC03',
  }),
  ab4c188e: Object.freeze({
    // Literary ACT 3 is stored under internal Act 6.
    actNumber: 6,
    blocks: 306,
    sha256: 'ad0585a3c3b0eebb67c36d97cfa740a40b0767b9d8e02f5a4b6259fc9c204eb0',
    version: 'review',
    sourceKey: 'A3/CH01/SC01',
  }),
  b4394323: Object.freeze({
    // Literary ACT 3 is stored under internal Act 6.
    actNumber: 6,
    blocks: 305,
    sha256: '1ec398fa321a3d1da561cc884a5a0c33366b51ef8a78172449b8f6674527cf6d',
    version: 'review',
    sourceKey: 'A3/CH01/SC02',
  }),
  '91c868b6': Object.freeze({
    // Literary ACT 3 is stored under internal Act 6.
    actNumber: 6,
    blocks: 359,
    sha256: 'e4002627c74c9fb0f599afac82c5e657e5eafbae43ac42a09ce5c02b4c9bcd3d',
    version: 'review',
    sourceKey: 'A3/CH02/SC01',
  }),
  e01a745e: Object.freeze({
    // Literary ACT 3 is stored under internal Act 6.
    actNumber: 6,
    blocks: 325,
    sha256: '6827412f7c51d7de5a473dec69642fdaa050944436d0f4a09994b86739ab54f6',
    version: 'review',
    sourceKey: 'A3/CH02/SC02',
  }),
  c7e45423: Object.freeze({
    // Literary ACT 3 is stored under internal Act 6.
    actNumber: 6,
    blocks: 277,
    sha256: '89990a3fb4686d80847ea93b89fd98eda87f822654a7b9dc63d88f54f804570f',
    version: 'review',
    sourceKey: 'A3/CH03/SC01',
  }),
  e32996cf: Object.freeze({
    // Literary ACT 3 is stored under internal Act 6.
    actNumber: 6,
    blocks: 274,
    sha256: '56fa03d80eeec11f368118c3f463205d08263773847d85b3501cb30baa94be85',
    version: 'review',
    sourceKey: 'A3/CH03/SC02',
  }),
  '6ca38002': Object.freeze({
    // Literary ACT 3 is stored under internal Act 6.
    actNumber: 6,
    blocks: 368,
    sha256: '3842f0a9b0c650c52b24db9e554feb12ce15cf31267de57e54377a5829c503fe',
    version: 'review',
    sourceKey: 'A3/CH04/SC01',
  }),
  '128383c2': Object.freeze({
    // Literary ACT 3 is stored under internal Act 6.
    actNumber: 6,
    blocks: 392,
    sha256: '803c654db89fa19567910bb9c4d9cb5cb02efb64784d88adbe6489f251daeb86',
    version: 'review',
    sourceKey: 'A3/CH04/SC02',
  }),
  d4ffadd2: Object.freeze({
    // Literary ACT 4 is stored under internal Act 7.
    actNumber: 7,
    blocks: 485,
    sha256: '8a1d23e859696a6a4267b9b5cff8f472274d99112c79121662d753dd6cfc0b5a',
    version: 'review',
    sourceKey: 'A4/CH01/SC01',
  }),
  '21a0304d': Object.freeze({
    // Literary ACT 4 is stored under internal Act 7.
    actNumber: 7,
    blocks: 276,
    sha256: 'b254987e0f16d53a0f09662efddf23383787e71910f13d06c5c8237fcf014d31',
    version: 'review',
    sourceKey: 'A4/CH01/SC02',
  }),
  bafe9c6c: Object.freeze({
    // Literary ACT 4 is stored under internal Act 7.
    actNumber: 7,
    blocks: 369,
    sha256: '9257a00a6db9aaa15797d21e418d5f331b32d3696f0301dc103a547d4d27d55d',
    version: 'review',
    sourceKey: 'A4/CH02/SC01',
  }),
  '306dfaf6': Object.freeze({
    // Literary ACT 4 is stored under internal Act 7.
    actNumber: 7,
    blocks: 263,
    sha256: '67f59de9bb2718c64b84298df335ca728132c1e43355a5d01373ef6bc89946e8',
    version: 'review',
    sourceKey: 'A4/CH02/SC02',
  }),
  '39b026fa': Object.freeze({
    // Literary ACT 4 is stored under internal Act 7.
    actNumber: 7,
    blocks: 334,
    sha256: '7712f1920ef37d835820738a027f0d9f3de7eecab6795bcdb57bd1db31330d80',
    version: 'review',
    sourceKey: 'A4/CH03/SC01',
  }),
  '7dee80a6': Object.freeze({
    // Literary ACT 4 is stored under internal Act 7.
    actNumber: 7,
    blocks: 191,
    sha256: 'd2438cc1429b92717b911bb338b45680982e72f0257fd9b115e248aceec9c33e',
    version: 'review',
    sourceKey: 'A4/CH03/SC03',
  }),
  bc44ce05: Object.freeze({
    // Literary ACT 4 is stored under internal Act 7.
    actNumber: 7,
    blocks: 257,
    sha256: '961cda21d33102e47f882274f38e7a1f2e599aec4d30fc0820309b28939f7606',
    version: 'review',
    sourceKey: 'A4/CH04/SC01',
  }),
  'ca627c7e': Object.freeze({
    // Literary ACT 4 is stored under internal Act 7.
    actNumber: 7,
    blocks: 291,
    sha256: 'ccb661756dfc48fc1599efed9c00555d94de5bd1de2ee5ecf44a5dd915131620',
    version: 'review',
    sourceKey: 'A4/CH04/SC02',
  }),
  '5a97bdf6': Object.freeze({
    // Literary ACT 4 is stored under internal Act 7.
    actNumber: 7,
    blocks: 394,
    sha256: '3d4884fede7eef0752c410fabcb44f7884874f1e1ab57766fae172143c914fed',
    version: 'review',
    sourceKey: 'A4/CH04/SC03',
  }),
  '0ec4d373': Object.freeze({
    // The epilogue is stored under internal Act 8.
    actNumber: 8,
    blocks: 217,
    sha256: 'a11d11ccb64567d2bd308bd40057f57f77a0911f7d8f68187fa978df0ec81f9a',
    version: 'review',
    sourceKey: 'EPILOGUE/OPENING',
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
