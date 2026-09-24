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
