export interface ScenePublication {
  editorial_version: string;
  approved_sha256: string;
  applied_at: string;
}

export interface SceneRevisionMetadata {
  publication?: ScenePublication;
  publicationHistory?: Array<{ scene?: SceneRevisionMetadata }>;
}

const isAppliedPublication = (value?: ScenePublication): value is ScenePublication =>
  !!value && typeof value.editorial_version === 'string' &&
  value.editorial_version.trim().length > 0 &&
  typeof value.approved_sha256 === 'string' && /^[a-f0-9]{64}$/i.test(value.approved_sha256) &&
  typeof value.applied_at === 'string' && Number.isFinite(Date.parse(value.applied_at));

// Display-only count of distinct applied Scene editions, not paragraph versions,
// draft suffixes (D1/D3), or the author's final screen acceptance.
export function getSceneRevisionNumber(scene: SceneRevisionMetadata): number | null {
  if (!isAppliedPublication(scene.publication)) return null;
  const editions = new Set<string>();
  const visited = new Set<SceneRevisionMetadata>();
  const pending = [scene];
  while (pending.length) {
    const current = pending.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);
    if (isAppliedPublication(current.publication)) editions.add(current.publication.editorial_version);
    for (const entry of current.publicationHistory ?? []) {
      if (entry.scene) pending.push(entry.scene);
    }
  }
  return editions.size;
}
