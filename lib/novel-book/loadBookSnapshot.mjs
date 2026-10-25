import { loadBilingualBookCapture } from './loadBilingualBookCapture.mjs';
import { createClient } from '@supabase/supabase-js';
import { BookSnapshotError, assembleBookActs, bookSourceFingerprint, buildBookSnapshot,
  getBookFragmentSlugs, getBookManagedMarkers } from '../../shared/lib/novelBookSnapshot.mjs';

function publicKey(key) {
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) return true;
  try {
    const parts = key.split('.');
    return parts.length === 3 && JSON.parse(Buffer.from(parts[1], 'base64url').toString()).role === 'anon';
  } catch { return false; }
}

/**
 * Request-scoped user client only. There is deliberately no service-role fallback.
 * @param {string | string[] | undefined} authorization
 * @param {{env?: NodeJS.ProcessEnv, signal?: AbortSignal, clientFactory?: typeof createClient, fetchImpl?: typeof fetch, requestTimeoutMs?: number}} [dependencies]
 */
export async function authenticateBookRequest(authorization, { env = process.env, signal, clientFactory = createClient,
  fetchImpl = globalThis.fetch, requestTimeoutMs = 20000 } = {}) {
  const match = typeof authorization === 'string' && authorization.length <= 16384
    ? /^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/i.exec(authorization) : null;
  if (!match) throw new BookSnapshotError('BOOK_AUTH_REQUIRED', 401);
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();
  let parsed;
  try { parsed = new URL(url); } catch { /* fail closed below */ }
  if (!parsed || !['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || !key || !publicKey(key)) {
    throw new BookSnapshotError('BOOK_AUTH_UNAVAILABLE', 503);
  }
  const client = clientFactory(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      headers: { Authorization: `Bearer ${match[1]}` },
      fetch: async (input, init) => {
        try {
          const signals = [signal, init?.signal, AbortSignal.timeout(requestTimeoutMs)].filter(Boolean);
          return await fetchImpl(input, { ...init, signal: AbortSignal.any(signals), cache: 'no-store' });
        } catch {
          // Avoid SDK logs of token-bearing Request/fetch errors.
          return new Response('{"message":"Book source unavailable"}', {
            status: 503, headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  });
  let result;
  try { result = await client.auth.getUser(match[1]); }
  catch { throw new BookSnapshotError('BOOK_AUTH_UNAVAILABLE', 503); }
  if (result.error) {
    const invalid = [400, 401, 403, 404, 422].includes(result.error.status)
      && result.error.code !== 'invalid_api_key' && !/invalid api key/i.test(result.error.message || '');
    throw new BookSnapshotError(invalid ? 'BOOK_AUTH_REQUIRED' : 'BOOK_AUTH_UNAVAILABLE', invalid ? 401 : 503);
  }
  const user = result.data?.user;
  if (!user || typeof user.id !== 'string' || !user.id || user.is_anonymous === true) {
    throw new BookSnapshotError('BOOK_AUTH_REQUIRED', 401);
  }
  return { client, userId: user.id };
}

const aborted = signal => { if (signal?.aborted) throw new BookSnapshotError('BOOK_REQUEST_ABORTED', 504); };
async function read(query, signal) {
  aborted(signal);
  let result;
  try { result = await (signal && query.abortSignal ? query.abortSignal(signal) : query); }
  catch { throw new BookSnapshotError('BOOK_SOURCE_UNAVAILABLE', 503); }
  aborted(signal);
  if (result.error) {
    const denied = ['42501', 'PGRST301', 'PGRST302'].includes(result.error.code);
    throw new BookSnapshotError(denied ? 'BOOK_ACCESS_DENIED' : 'BOOK_SOURCE_UNAVAILABLE', denied ? 403 : 503);
  }
  return result.data;
}

async function readDocuments(client, slug, signal) {
  const roots = await read(client.from('novel_documents').select('id,slug,data').eq('slug', slug), signal);
  if (!Array.isArray(roots) || roots.length !== 1) throw new BookSnapshotError('BOOK_ACCESS_OR_SOURCE_UNAVAILABLE', 403);
  const root = roots[0];
  const fragmentSlugs = getBookFragmentSlugs(root, slug);
  const fragments = await read(client.from('novel_documents').select('id,slug,data').in('slug', fragmentSlugs), signal);
  const acts = assembleBookActs(root, fragments, slug);
  return { root, fragments, markers: getBookManagedMarkers(acts) };
}

async function readManaged(client, markers, signal) {
  // Bounded parallel reads: no 55-request burst, and no privileged shared client.
  const results = new Map();
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(4, markers.length) }, async () => {
    while (next < markers.length) {
      const scene = markers[next++];
      const payload = await read(client.rpc('ros_ko_get_scene', { p_managed_scene_id: scene.managedSceneId,
        p_composition_id: null, p_include_legacy: false }), signal);
      if (payload?.scene_id === 'b48a4f04' && payload.composition?.block_count === 67) {
        payload.bilingual_publication = await read(client.rpc('ros_bilingual_read_published', {
          p_managed_scene_id: scene.managedSceneId, p_composition_id: payload.requested_composition_id,
        }), signal);
        if (!payload.bilingual_publication) throw new BookSnapshotError('BOOK_PUBLICATION_UNAVAILABLE',409);
      }
      results.set(scene.managedSceneId, payload);
    }
  }));
  return results;
}

const documentFingerprint = documents => bookSourceFingerprint([documents.root,
  [...documents.fragments].sort((a, b) => a.slug.localeCompare(b.slug))]);
const managedFingerprint = results => bookSourceFingerprint([...results.entries()].sort(([a], [b]) => a.localeCompare(b)));

async function recheckDocuments(client, slug, signal) {
  try { return await readDocuments(client, slug, signal); }
  catch (error) {
    if (error instanceof BookSnapshotError && error.status === 422) throw new BookSnapshotError('BOOK_SOURCE_CHANGED', 409);
    throw error;
  }
}

/**
 * Two unchanged read passes, not a single transactional DB dump. Any observed edit aborts.
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @param {string} slug
 * @param {{signal?: AbortSignal, now?: () => string, captureId?: string}} [options]
 */
export async function loadBookSnapshot(client, slug, { signal, now = () => new Date().toISOString(), captureId } = {}) {
  if (captureId) {
    const captured = await loadBilingualBookCapture(client,{signal,now});
    if (captured.captureId !== captureId) throw new BookSnapshotError('BOOK_SOURCE_CHANGED',409);
    return captured.books[slug === 'quantum-vibration-novel-en' ? 'EN' : 'KO'];
  }
  const before = await readDocuments(client, slug, signal);
  const firstManaged = await readManaged(client, before.markers, signal);
  const fingerprint = await documentFingerprint(before);
  const selectedFingerprint = await managedFingerprint(firstManaged);
  const snapshot = await buildBookSnapshot({ slug, ...before, managedResults: firstManaged, capturedAt: now() });
  const after = await recheckDocuments(client, slug, signal);
  if (fingerprint !== await documentFingerprint(after)) throw new BookSnapshotError('BOOK_SOURCE_CHANGED', 409);
  const lastManaged = await readManaged(client, after.markers, signal);
  if (selectedFingerprint !== await managedFingerprint(lastManaged)) throw new BookSnapshotError('BOOK_SOURCE_CHANGED', 409);
  // Check document titles/structure once more after the final managed read batch.
  const end = await recheckDocuments(client, slug, signal);
  if (fingerprint !== await documentFingerprint(end)) throw new BookSnapshotError('BOOK_SOURCE_CHANGED', 409);
  aborted(signal);
  snapshot.capturedAt = now();
  snapshot.source = { documentFingerprint: fingerprint, selectionFingerprint: selectedFingerprint,
    consistency: 'unchanged-read-passes', managedScenes: before.markers.length };
  return snapshot;
}
