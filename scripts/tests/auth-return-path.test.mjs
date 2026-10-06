import assert from 'node:assert/strict'
import test from 'node:test'
import { getSafeAuthReturnPath } from '../../shared/lib/authReturnPath.js'

test('returns either protected route with its query and fragment unchanged', () => {
  for (const path of ['/temsco/equity', '/temsco/equity/evidence']) {
    for (const suffix of ['', '?year=2026', '#sources', '?company=%ED%85%9C%EC%8A%A4%EC%BD%94&source=%2Freport#source-2']) {
      assert.equal(getSafeAuthReturnPath(path + suffix), path + suffix)
    }
  }
})

test('returns only the novel index and a lowercase slug with optional en suffix, preserving query and fragment', () => {
  for (const path of ['/novel', '/novel/a', '/novel/a1-b2', '/novel/quantum-vibration-novel', '/novel/quantum-vibration-novel/en']) {
    for (const suffix of ['', '?scene=3b301af5', '#scene-1', '?scene=30ad0834&label=%ED%95%A9%EC%84%B1#review']) {
      assert.equal(getSafeAuthReturnPath(path + suffix), path + suffix)
    }
  }
})

test('rejects arbitrary novel subpaths, external returns, encoding tricks and path traversal', () => {
  for (const path of [
    '/novel/', '/novels', '/novel//a', '/novel/A', '/novel/Upper-Case',
    '/novel/a_b', '/novel/-a', '/novel/a-', '/novel/a--b',
    '/novel/a/ko', '/novel/a/edit', '/novel/a/en/', '/novel/a/en/extra',
    '/novel/./a', '/novel/../auth', '/novel/a/../b',
    '/novel/%61', '/novel/%2e%2e', '/novel/%252e%252e', '/novel/a%2fen',
    '/novel/a%2f..%2fauth', '/novel/a%5c..%5cauth', '/novel/a%00',
    '/novel/a%3fnext=//outside.example', '/novel/a%23review',
    '//outside.example/novel/a', 'https://outside.example/novel/a',
    '/\\outside.example/novel/a', ' /novel/a', '/novel/a\n',
    '/novel/a?x=\r\n//outside.example', '/novel/a#\\outside.example',
  ]) {
    assert.equal(getSafeAuthReturnPath(path), '/', path)
  }
})

test('rejects absent, repeated, or non-string next parameters', () => {
  for (const value of [undefined, null, '', ['/temsco/equity'], ['/temsco/equity', '//evil.example'], {}, 1]) {
    assert.equal(getSafeAuthReturnPath(value), '/')
  }
})

test('rejects external, unlisted, normalized, and encoded path tricks', () => {
  for (const value of [
    'https://evil.example/temsco/equity',
    '//evil.example/temsco/equity',
    '/\\evil.example/temsco/equity',
    'javascript:alert(1)',
    '/auth?next=/temsco/equity',
    '/temsco/equity-other',
    '/temsco/equity/evidence/extra',
    '/temsco/equity/',
    '/temsco/./equity',
    '/temsco/equity/../equity',
    '/TEMsco/equity',
    '%2Ftemsco%2Fequity',
    '%252Ftemsco%252Fequity',
    '/%74emsco/equity',
    '/temsco%2fequity',
    '/temsco/equity%3fredirect=//evil.example',
    '/temsco/equity%23fragment',
    '/temsco/equity%2f..%2fauth',
    '/temsco/equity%5c..%5cauth',
    '/temsco/equity%00',
    ' /temsco/equity',
    '/temsco/equity\n',
    '/temsco/equity?x=\r\n//evil.example',
    '/temsco/equity#\\evil.example',
  ]) {
    assert.equal(getSafeAuthReturnPath(value), '/', value)
  }
})
