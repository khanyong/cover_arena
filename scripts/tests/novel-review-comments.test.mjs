import assert from 'node:assert/strict'
import test from 'node:test'
import { buildReviewExport, downloadReviewFile } from '../../shared/lib/novelReviewComments.js'

const options = {
  sceneId: 'b48a4f04', sceneTitle: '[장면 1: 합의의 건축]',
  readerSlug: 'quantum-vibration-novel', exportedAt: '2026-10-05T12:00:00.000Z',
  currentCompositionId: 'composition-2',
}

function comment(overrides = {}) {
  return {
    id: 'comment-1', revision: 3, scene_id: options.sceneId,
    block_unit_id: 'ko-block-11', block_version_id: 'ko-version-11-1',
    composition_id: 'composition-1', source_key: 'PRO/CH01/SC01', position: 11,
    body_snapshot: '$$ V_{\\epsilon}(r) \\sim \\frac{1}{r^2+\\epsilon^2} $$',
    body_sha256: '0123456789abcdef', scene_title: options.sceneTitle,
    selected_text: null, context_before: '그가 말했다.\n\n“지금.”', context_after: '후속 문장.',
    kind: 'formula', priority: 'required', direction: '수식은 보존한다.\n앞뒤 설명만 검토한다.',
    proposal: '', status: 'open', include_in_export: true,
    created_at: '2026-10-05T10:00:00.000Z', updated_at: '2026-10-05T11:00:00.000Z',
    is_stale: false, history: [{ revision: 2, direction: '수식 보존', action: 'updated' }],
    ...overrides,
  }
}

test('exports only explicitly included eligible comments for the requested Scene, sorted stably', () => {
  const rows = [
    comment({ id: 'later', position: 79 }),
    comment({ id: 'b', position: 1 }),
    comment({ id: 'a', position: 1 }),
    comment({ id: 'older', position: 1, created_at: '2026-10-04T00:00:00Z' }),
    comment({ id: 'not-selected', include_in_export: false }),
    comment({ id: 'truthy-not-boolean', include_in_export: 'true' }),
    ...['resolved', 'withdrawn', 'held', 'on_hold', 'deferred'].map(status => comment({ id: status, status })),
    comment({ id: 'other-scene', scene_id: 'another-scene' }),
  ]
  const before = JSON.stringify(rows)
  const output = buildReviewExport(rows, options)
  const parsed = JSON.parse(output.json)
  assert.deepEqual(parsed.comments.map(row => row.id), ['older', 'a', 'b', 'later'])
  assert.equal(output.count, 4)
  assert.equal(parsed.comment_count, 4)
  assert.equal(JSON.stringify(rows), before)
  assert.match(output.markdown, /## 1\. B0001/)
  assert.match(output.markdown, /## 4\. B0079/)
  assert.equal(output.baseFilename, 'b48a4f04-review-comments-2026-10-05')
})

test('keeps multiline LaTeX, Unicode, whitespace, version anchors, revision and history verbatim', () => {
  const body = '  가·가·é·é 👩🏽‍💻\n\n$$\\Psi_{\\mathrm{MSV}} = R e^{iS/\\hbar}$$\n\n“지금.”  '
  const row = comment({ body_snapshot: body, selected_text: 'é·é 👩🏽‍💻', is_stale: true })
  Object.freeze(row.history[0])
  Object.freeze(row.history)
  Object.freeze(row)
  const output = buildReviewExport(Object.freeze([row]), options)
  const saved = JSON.parse(output.json).comments[0]
  for (const [key, value] of Object.entries(row)) assert.deepEqual(saved[key], value, key)
  assert.equal(Buffer.from(saved.body_snapshot).toString('hex'), Buffer.from(body).toString('hex'))
  assert.ok(output.markdown.includes(body))
  assert.ok(output.markdown.includes(row.selected_text))
  assert.equal(saved.export_context.requires_recheck, true)
  assert.equal(saved.export_context.composition_changed, true)
  assert.match(output.markdown, /기준 블록 이후 변경: 있음/)
})

test('records a changed composition without falsely changing the saved block-staleness flag', () => {
  const saved = JSON.parse(buildReviewExport([comment()], options).json).comments[0]
  assert.equal(saved.is_stale, false)
  assert.equal(saved.export_context.composition_changed, true)
  assert.equal(saved.export_context.requires_recheck, false)
  const current = JSON.parse(buildReviewExport([comment({ composition_id: 'composition-2' })], options).json).comments[0]
  assert.equal(current.export_context.requires_recheck, false)
})

test('renders server enum labels for term, suggested, sent and review', () => {
  const output = buildReviewExport([
    comment({ id: 'sent', kind: 'term', priority: 'suggested', status: 'sent' }),
    comment({ id: 'review', kind: 'term', priority: 'suggested', status: 'review' }),
  ], options)
  assert.match(output.markdown, /유형 \/ 우선순위: 용어 \/ 권장/)
  assert.match(output.markdown, /상태: 편집 요청 전달/)
  assert.match(output.markdown, /상태: 재검토 필요/)
  assert.equal(JSON.parse(output.json).comments.find(row => row.id === 'sent').status, 'sent')
})

test('uses safe dynamic fences for arbitrary user instructions and snapshots', () => {
  const row = comment({
    body_snapshot: '원문\n```\n# 본문 속 제목\n`````\n수식 $x_1$',
    direction: '```js\nalert("test")\n```\n\n지시 `````` 그대로 보존',
    proposal: '대체안\n~~~~\n끝',
  })
  const output = buildReviewExport([row], options)
  assert.ok(output.markdown.includes('``````text\n' + row.body_snapshot + '\n``````'))
  assert.ok(output.markdown.includes('```````text\n' + row.direction + '\n```````'))
  assert.deepEqual(JSON.parse(output.json).comments[0].proposal, row.proposal)
})

test('is deterministic for a fixed export time and does not substitute entire Scene text', () => {
  const rows = [comment()]
  const a = buildReviewExport(rows, options)
  const b = buildReviewExport(rows, options)
  assert.deepEqual(a, b)
  assert.equal(JSON.parse(a.json).comments.length, 1)
  const none = buildReviewExport([], options)
  assert.equal(none.count, 0)
  assert.deepEqual(JSON.parse(none.json).comments, [])
  assert.match(none.markdown, /내보낼 코멘트가 없습니다/)
  assert.equal(downloadReviewFile('text', 'test.txt'), false)
})

test('downloads exact Blob content and releases temporary browser resources', async () => {
  const oldDocument = globalThis.document
  const oldCreate = URL.createObjectURL
  const oldRevoke = URL.revokeObjectURL
  const oldTimeout = globalThis.setTimeout
  let blob, revoked, scheduled, appended = false, clicked = false, removed = false
  const link = { style: {}, click() { clicked = true }, remove() { removed = true } }
  globalThis.document = { createElement: () => link, body: { appendChild() { appended = true } } }
  URL.createObjectURL = value => { blob = value; return 'blob:review-test' }
  URL.revokeObjectURL = value => { revoked = value }
  globalThis.setTimeout = callback => { scheduled = callback; return 1 }
  try {
    const content = '한글\n$$\\Psi$$\n끝 LF 없음'
    assert.equal(downloadReviewFile(content, 'review.md', 'text/markdown;charset=utf-8'), true)
    assert.equal(await blob.text(), content)
    assert.equal(blob.type, 'text/markdown;charset=utf-8')
    assert.equal(link.href, 'blob:review-test')
    assert.equal(link.download, 'review.md')
    assert.equal(appended && clicked && removed, true)
    assert.equal(revoked, undefined)
    scheduled()
    assert.equal(revoked, 'blob:review-test')
  } finally {
    if (oldDocument === undefined) delete globalThis.document
    else globalThis.document = oldDocument
    URL.createObjectURL = oldCreate
    URL.revokeObjectURL = oldRevoke
    globalThis.setTimeout = oldTimeout
  }
})
