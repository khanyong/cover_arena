const OMITTED_EXPORT_STATUSES = new Set(['resolved', 'withdrawn', 'held', 'on_hold', 'deferred'])

const KIND_LABELS = {
  style: '문체', translation: '번역', term: '용어', terminology: '용어', dialogue: '대사',
  fact: '사실', continuity: '연결', formula: '수식', other: '기타',
}
const PRIORITY_LABELS = { required: '필수', suggested: '권장', recommended: '권장', question: '질문' }
const STATUS_LABELS = {
  open: '검토 중', sent: '편집 요청 전달', requested: '편집 요청 전달', applied: '반영 후 재검토',
  review: '재검토 필요', needs_review: '재검토 필요', resolved: '완료', withdrawn: '철회', held: '보류',
}

// Fences must be longer than any run in user text, including literal Markdown.
function verbatim(value) {
  const text = value == null ? '' : String(value)
  const longestRun = Math.max(0, ...(text.match(/`+/g) || []).map(run => run.length))
  const fence = '`'.repeat(Math.max(3, longestRun + 1))
  return `${fence}text\n${text}${text.endsWith('\n') ? '' : '\n'}${fence}`
}

function plainLabel(value) {
  return String(value ?? '미기록').replace(/[\r\n\u2028\u2029]+/g, ' ').replace(/[\\`*_{}[\]<>#|]/g, '\\$&')
}

function textOrder(left, right) {
  const a = String(left ?? '')
  const b = String(right ?? '')
  return a < b ? -1 : a > b ? 1 : 0
}

function positionOf(comment) {
  return Number.isFinite(Number(comment.position)) && comment.position != null
    ? Number(comment.position) : Number.MAX_SAFE_INTEGER
}

function safeFilename(value) {
  return String(value || 'scene').replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/^[-.]+|[-.]+$/g, '').slice(0, 100) || 'scene'
}

/**
 * Export only the chosen comments and their saved source snapshots.
 * Callers supply current block-version staleness in is_stale. A changed Scene
 * composition is recorded separately: it may only reflect another block edit.
 * No text trimming, Unicode normalization, source reconstruction, or mutation.
 */
export function buildReviewExport(comments, {
  sceneId = '',
  sceneTitle = '',
  readerSlug = '',
  exportedAt = new Date().toISOString(),
  currentCompositionId = null,
} = {}) {
  const selected = (Array.isArray(comments) ? comments : [])
    .filter(comment => comment && comment.include_in_export === true
      && !OMITTED_EXPORT_STATUSES.has(comment.status)
      && (!sceneId || !comment.scene_id || comment.scene_id === sceneId))
    .slice()
    .sort((a, b) => positionOf(a) - positionOf(b)
      || textOrder(a.created_at, b.created_at) || textOrder(a.id, b.id))

  const exportedComments = selected.map(comment => {
    const compositionChanged = Boolean(currentCompositionId && comment.composition_id
      && currentCompositionId !== comment.composition_id)
    return {
      ...comment,
      export_context: {
        current_composition_id: currentCompositionId,
        composition_changed: compositionChanged,
        requires_recheck: comment.is_stale === true,
      },
    }
  })

  const payload = {
    format: 'novel-review-comments-v1',
    exported_at: exportedAt,
    reader_slug: readerSlug ?? null,
    scene_id: sceneId ?? null,
    scene_title: sceneTitle ?? null,
    current_composition_id: currentCompositionId,
    comment_count: exportedComments.length,
    comments: exportedComments,
  }

  const lines = [
    `# ${plainLabel(sceneTitle || sceneId || 'Scene')} — 편집 요청`,
    '',
    `- Reader: ${plainLabel(readerSlug)}`,
    `- Scene ID: ${plainLabel(sceneId)}`,
    `- 현재 구성: ${plainLabel(currentCompositionId)}`,
    `- 내보낸 시각: ${plainLabel(exportedAt)}`,
    `- 선택 코멘트: ${exportedComments.length}개`,
    '',
    '본문은 각 코멘트를 작성할 때 보존한 원문입니다. 코멘트와 제안 문안은 편집 요청 자료이며 저장된 소설 본문이 아닙니다.',
    '기준 버전 변경 표시가 있으면 최신 본문과 대조한 뒤 편집하세요. 이 파일을 내려받아도 코멘트 상태나 본문은 변경되지 않습니다.',
  ]

  exportedComments.forEach((comment, index) => {
    const position = Number.isFinite(Number(comment.position)) && comment.position != null
      ? `B${String(comment.position).padStart(4, '0')}` : '위치 미기록'
    lines.push(
      '', `## ${index + 1}. ${position}`, '',
      `- 코멘트 ID / 리비전: ${plainLabel(comment.id)} / ${plainLabel(comment.revision)}`,
      `- 내용 위치: ${plainLabel(comment.source_key)}`,
      `- 블록 ID: ${plainLabel(comment.block_unit_id)}`,
      `- 기준 블록 Version: ${plainLabel(comment.block_version_id)}`,
      `- 기준 Scene 구성: ${plainLabel(comment.composition_id)}`,
      `- 기준 본문 SHA-256: ${plainLabel(comment.body_sha256)}`,
      `- 유형 / 우선순위: ${plainLabel(KIND_LABELS[comment.kind] || comment.kind)} / ${plainLabel(PRIORITY_LABELS[comment.priority] || comment.priority)}`,
      `- 상태: ${plainLabel(STATUS_LABELS[comment.status] || comment.status)}`,
      `- 작성 / 수정: ${plainLabel(comment.created_at)} / ${plainLabel(comment.updated_at)}`,
      `- 대상 범위: ${comment.selected_text ? '선택 문장' : '블록 전체'}`,
      `- 기준 블록 이후 변경: ${comment.is_stale === true ? '있음 — 대상 재확인 필요' : comment.is_stale === false ? '없음' : '미확인'}`,
      `- 작성 후 Scene 구성 변경: ${comment.export_context.composition_changed ? '있음 — 다른 블록 변경일 수 있음' : '변경 확인 없음'}`,
      '', '### 작성 당시 블록 전문', '', verbatim(comment.body_snapshot),
    )
    if (comment.selected_text) {
      lines.push('', '### 선택한 문장', '', verbatim(comment.selected_text))
    }
    if (comment.context_before != null && comment.context_before !== '') {
      lines.push('', '### 앞 문맥', '', verbatim(comment.context_before))
    }
    if (comment.context_after != null && comment.context_after !== '') {
      lines.push('', '### 뒤 문맥', '', verbatim(comment.context_after))
    }
    lines.push('', '### 수정 방향', '', verbatim(comment.direction))
    if (comment.proposal != null && comment.proposal !== '') {
      lines.push('', '### 제안 문안', '', verbatim(comment.proposal))
    } else {
      lines.push('', '### 제안 문안', '', '없음 — 위 수정 방향을 기준으로 검토합니다.')
    }
  })

  if (!exportedComments.length) lines.push('', '내보낼 코멘트가 없습니다.')

  return {
    json: `${JSON.stringify(payload, null, 2)}\n`,
    markdown: `${lines.join('\n')}\n`,
    count: exportedComments.length,
    baseFilename: `${safeFilename(sceneId || sceneTitle)}-review-comments-${safeFilename(String(exportedAt).slice(0, 10))}`,
  }
}

/** Browser-only download. Return false when no browser download API exists. */
export function downloadReviewFile(text, filename, mime = 'text/plain;charset=utf-8') {
  if (typeof document === 'undefined' || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return false
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  try {
    document.body.appendChild(link)
    link.click()
  } finally {
    link.remove()
    // Delayed revocation lets browsers consume the blob after the click event.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return true
}
