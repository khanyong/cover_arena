import { isExpectedNovelFragment } from './novelFragmentIdentity.js';
import { postgresJsonbText, sha256Hex } from './rosKoBlockModel.js';

export const BOOK_ROOT_SLUGS = Object.freeze(['quantum-vibration-novel', 'quantum-vibration-novel-en']);
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string';
const id = value => text(value) && value.length > 0 && value.length <= 256;
const hash = value => /^[a-f0-9]{64}$/.test(value || '');
const encoder = new TextEncoder();

export class BookSnapshotError extends Error {
  constructor(code, status = 422) { super(code); this.name = 'BookSnapshotError'; this.code = code; this.status = status; }
}
const requireValue = (condition, code = 'BOOK_SOURCE_INVALID') => {
  if (!condition) throw new BookSnapshotError(code);
};
const unique = values => new Set(values).size === values.length;
const list = (value, maximum) => Array.isArray(value) && value.length <= maximum;

export function validateBookPdfRequest(body) {
  if (!object(body) || !own(body, 'slug') || !BOOK_ROOT_SLUGS.includes(body.slug)
    || Object.keys(body).some(key => !['slug', 'options'].includes(key))) {
    throw new BookSnapshotError('INVALID_BOOK_REQUEST', 400);
  }
  const options = body.options === undefined ? {} : body.options;
  if (!object(options) || Object.keys(options).some(key => !['pageSize', 'fontSize'].includes(key))
    || (own(options, 'pageSize') && !['book', 'A4'].includes(options.pageSize))
    || (own(options, 'fontSize') && ![10, 11, 12].includes(options.fontSize))) {
    throw new BookSnapshotError('INVALID_BOOK_OPTIONS', 400);
  }
  return { slug: body.slug, options: { pageSize: options.pageSize ?? 'book', fontSize: options.fontSize ?? 11 } };
}

export function getBookFragmentSlugs(root, slug) {
  requireValue(BOOK_ROOT_SLUGS.includes(slug) && object(root) && root.id === slug && root.slug === slug,
    'BOOK_ROOT_IDENTITY_MISMATCH');
  const data = root.data;
  requireValue(object(data) && (data.slug ? data.slug === slug : !data.id || data.id === slug),
    'BOOK_ROOT_IDENTITY_MISMATCH');
  requireValue(list(data.acts, 64) && data.acts.length > 0 && data.acts.every(act => object(act)
    && Number.isSafeInteger(act.number) && act.number >= 0) && unique(data.acts.map(act => act.number)),
  'BOOK_ACT_STRUCTURE_INVALID');
  return data.acts.map(act => `${slug}-act-${act.number}`);
}

/** Strict fragments: never fall back to incomplete root stubs or another language. */
export function assembleBookActs(root, fragments, slug) {
  const slugs = getBookFragmentSlugs(root, slug);
  requireValue(list(fragments, 64) && fragments.length === slugs.length
    && unique(fragments.map(row => row?.slug)), 'BOOK_FRAGMENT_INCOMPLETE');
  const rows = new Map(fragments.map(row => [row.slug, row]));
  return root.data.acts.map((stub, index) => {
    const row = rows.get(slugs[index]);
    requireValue(isExpectedNovelFragment(row, slugs[index], stub.number), 'BOOK_FRAGMENT_IDENTITY_MISMATCH');
    requireValue(list(row.data.chapters, 512), 'BOOK_CHAPTER_STRUCTURE_INVALID');
    for (const chapter of row.data.chapters) {
      requireValue(object(chapter) && Number.isSafeInteger(chapter.number) && list(chapter.scenes, 1024),
        'BOOK_CHAPTER_STRUCTURE_INVALID');
      for (const scene of chapter.scenes) requireValue(object(scene) && id(scene.id), 'BOOK_SCENE_INVALID');
    }
    requireValue(unique(row.data.chapters.map(chapter => chapter.number)), 'BOOK_CHAPTER_STRUCTURE_INVALID');
    return row.data;
  });
}

export function getBookManagedMarkers(acts) {
  const scenes = acts.flatMap(act => act.chapters.flatMap(chapter => chapter.scenes));
  requireValue(scenes.length > 0 && scenes.length <= 4096 && unique(scenes.map(scene => scene.id)), 'BOOK_SCENE_INVALID');
  const markers = scenes.filter(scene => scene.storageModel === 'ros-ko-block-v1');
  requireValue(markers.every(scene => id(scene.managedSceneId))
    && unique(markers.map(scene => scene.managedSceneId)), 'BOOK_MANAGED_MARKER_INVALID');
  return markers;
}

export const bookSourceFingerprint = value => sha256Hex(postgresJsonbText(value));

function selectedParagraph(paragraph) {
  requireValue(object(paragraph) && id(paragraph.id) && id(paragraph.activeVersion)
    && object(paragraph.versions) && own(paragraph.versions, paragraph.activeVersion), 'BOOK_PARAGRAPH_SELECTION_INVALID');
  const version = paragraph.versions[paragraph.activeVersion];
  requireValue(object(version) && text(version.content), 'BOOK_PARAGRAPH_SELECTION_INVALID');
  const versionId = paragraph.revisionVersionId ?? version.revisionVersionId ?? paragraph.activeVersion;
  requireValue(id(versionId), 'BOOK_PARAGRAPH_SELECTION_INVALID');
  // No trim, normalization, source-title filtering, or caller-supplied version selection.
  return { id: paragraph.id, versionId, text: version.content };
}

async function managedParagraphs(scene, managed) {
  const composition = managed?.composition;
  requireValue(object(managed) && managed.scene_id === scene.id && managed.managed_scene_id === scene.managedSceneId,
    'BOOK_MANAGED_IDENTITY_MISMATCH');
  // Export is a read operation. Current composition/selection identity matters;
  // a reader-only capability must not be mistaken for a historical selection.
  requireValue(managed.display_mode === 'composition'
    && id(managed.source_key)
    && id(managed.review_composition_id) && managed.requested_composition_id === managed.review_composition_id
    && object(composition) && composition.id === managed.review_composition_id
    && composition.managed_scene_id === scene.managedSceneId && composition.status === 'sealed'
    && Number.isSafeInteger(managed.generation) && managed.generation > 0,
  'BOOK_CURRENT_REVIEW_UNAVAILABLE');
  requireValue(list(managed.paragraphs, 50000) && managed.paragraphs.length === composition.block_count
    && hash(managed.projection_sha256) && hash(composition.body_sha256), 'BOOK_MANAGED_INTEGRITY_FAILED');
  const paragraphs = managed.paragraphs.map((paragraph, index) => {
    requireValue(paragraph.storageModel === 'ros-ko-block-v1' && paragraph.unitId === paragraph.id
      && paragraph.activeVersion === 'review' && id(paragraph.revisionVersionId)
      && paragraph.versions?.review?.revisionVersionId === paragraph.revisionVersionId
      && paragraph.compositionRevisionId === composition.id && paragraph.generation === managed.generation
      && paragraph.sourceKey === `KO/${managed.source_key}/B${String(index + 1).padStart(4, '0')}`
      && paragraph.separatorAfter === (index + 1 < managed.paragraphs.length ? '\n\n' : ''),
    'BOOK_MANAGED_MAPPING_INVALID');
    return selectedParagraph(paragraph);
  });
  requireValue(unique(paragraphs.map(paragraph => paragraph.id)), 'BOOK_MANAGED_MAPPING_INVALID');
  const body = paragraphs.map((paragraph, index) => paragraph.text + managed.paragraphs[index].separatorAfter).join('');
  requireValue(await bookSourceFingerprint(managed.paragraphs) === managed.projection_sha256
    && await sha256Hex(body) === composition.body_sha256
    && composition.body_bytes === encoder.encode(body).length
    && composition.body_lf === (body.match(/\n/g) || []).length
    && composition.terminal_lf === (body.match(/\n*$/)?.[0].length || 0), 'BOOK_MANAGED_INTEGRITY_FAILED');
  return paragraphs;
}

/** Pure projection. Raw DB records, inactive versions, prompts and notes never enter the book model. */
export async function buildBookSnapshot({ slug, root, fragments, managedResults = new Map(), capturedAt = new Date().toISOString() }) {
  const sourceActs = assembleBookActs(root, fragments, slug);
  const markers = getBookManagedMarkers(sourceActs);
  requireValue(managedResults instanceof Map && managedResults.size === markers.length, 'BOOK_MANAGED_MAPPING_INVALID');
  requireValue(!Number.isNaN(Date.parse(capturedAt)), 'BOOK_CAPTURE_TIME_INVALID');
  const stringField = value => { requireValue(value === undefined || value === null || text(value)); return value ?? ''; };
  const counts = { scenes: 0, paragraphs: 0 };
  const allParagraphIds = new Set();
  let totalBytes = 0;
  const acts = [];
  for (const act of sourceActs) {
    const chapters = [];
    for (const chapter of act.chapters) {
      const scenes = [];
      for (const scene of chapter.scenes) {
        const managed = scene.storageModel === 'ros-ko-block-v1' ? managedResults.get(scene.managedSceneId) : null;
        let paragraphs;
        if (scene.storageModel === 'ros-ko-block-v1') paragraphs = await managedParagraphs(scene, managed);
        else {
          requireValue(!scene.storageModel && list(scene.paragraphs, 50000), 'BOOK_SCENE_INVALID');
          paragraphs = scene.paragraphs.map(selectedParagraph);
        }
        for (const paragraph of paragraphs) {
          requireValue(!allParagraphIds.has(paragraph.id), 'BOOK_DUPLICATE_PARAGRAPH');
          allParagraphIds.add(paragraph.id);
          totalBytes += encoder.encode(paragraph.text).length;
        }
        counts.scenes += 1; counts.paragraphs += paragraphs.length;
        requireValue(counts.paragraphs <= 50000 && totalBytes <= 16 * 1024 * 1024, 'BOOK_SOURCE_TOO_LARGE');
        scenes.push({ id: scene.id, title: stringField(scene.title), compositionId: managed?.requested_composition_id ?? null,
          paragraphs, ...(managed ? { generation: managed.generation, bodySha256: managed.composition.body_sha256 } : {}) });
      }
      chapters.push({ number: chapter.number, title: stringField(chapter.title), scenes });
    }
    acts.push({ number: act.number, title: stringField(act.title), chapters });
  }
  requireValue(counts.paragraphs > 0, 'BOOK_SOURCE_EMPTY');
  return { slug, language: slug.endsWith('-en') ? 'en' : 'ko', title: stringField(root.data.title),
    subtitle: stringField(root.data.subtitle), author: stringField(root.data.author), capturedAt, acts, counts };
}
