const encoder = new TextEncoder();

const compareUtf8 = (left, right) => {
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  if (a.length !== b.length) return a.length - b.length;
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
};

// PostgreSQL jsonb::text ordering/spacing. This contract is used only for the
// Reader projection and archive wrappers; mutation identities use LPF-V2.
export const postgresJsonbText = (value) => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return `[${value.map(postgresJsonbText).join(', ')}]`;
  if (typeof value === 'object') {
    return `{${Object.keys(value)
      .sort(compareUtf8)
      .map((key) => `${JSON.stringify(key)}: ${postgresJsonbText(value[key])}`)
      .join(', ')}}`;
  }
  return JSON.stringify(value);
};

export const sha256Hex = async (value) => {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(value));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const encodeLpfV2 = (fields) => fields.map((field) => {
  if (field === null || typeof field === 'undefined') return 'N00000000:';
  const value = String(field);
  const byteLength = encoder.encode(value).length.toString(16).padStart(8, '0');
  return `S${byteLength}:${value}`;
}).join('');

export const findSceneById = (novel, sceneId) => {
  for (const act of novel?.acts || []) {
    for (const chapter of act.chapters || []) {
      const scene = (chapter.scenes || []).find((candidate) => candidate.id === sceneId);
      if (scene) return scene;
    }
  }
  return null;
};

export const findSceneByParagraphId = (novel, paragraphId) => {
  for (const act of novel?.acts || []) {
    for (const chapter of act.chapters || []) {
      for (const scene of chapter.scenes || []) {
        const paragraph = (scene.paragraphs || []).find((candidate) => candidate.id === paragraphId);
        if (paragraph) return { scene, paragraph };
      }
    }
  }
  return null;
};

export const hasManagedScenes = (novel) =>
  (novel?.acts || []).some((act) =>
    (act.chapters || []).some((chapter) =>
      (chapter.scenes || []).some((scene) => scene.storageModel === 'ros-ko-block-v1')
    )
  );

export const buildManagedSceneCopyText = (scene, customVersionMap, getParagraphText) =>
  (scene.paragraphs || [])
    .map((paragraph) => {
      const version = customVersionMap[paragraph.id] || paragraph.activeVersion;
      return getParagraphText(paragraph, version) + (paragraph.separatorAfter || '');
    })
    .join('');

const requestStorageKey = (managedSceneId, blockUnitId) =>
  `ros-ko-block-request:${managedSceneId}:${blockUnitId}`;

export const getOrCreateManagedRequestId = async (identity) => {
  const fingerprint = await sha256Hex(encodeLpfV2([
    'ROS-KO-CLIENT-RETRY-IDENTITY-LPF-V2',
    identity.managedSceneId,
    String(identity.generation),
    identity.compositionId,
    identity.blockUnitId,
    identity.parentVersionId,
    identity.parentBodySha256,
    identity.projectionSha256,
    String(identity.newBodyBytes),
    identity.newBodySha256,
    identity.note || '',
    'advance_review'
  ]));
  const key = requestStorageKey(identity.managedSceneId, identity.blockUnitId);

  if (typeof window !== 'undefined') {
    try {
      const previous = JSON.parse(window.sessionStorage.getItem(key) || 'null');
      if (previous?.fingerprint === fingerprint && previous?.requestId) {
        return { requestId: previous.requestId, fingerprint, key };
      }
    } catch {
      // A corrupt browser retry record is ignored; no server state is changed.
    }
  }

  const requestId = globalThis.crypto.randomUUID();
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(key, JSON.stringify({ fingerprint, requestId }));
  }
  return { requestId, fingerprint, key };
};

export const clearManagedRequestId = (key) => {
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(key);
};
