import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { isExpectedNovelFragment } from '../../shared/lib/novelFragmentIdentity.js';

const slug = 'quantum-vibration-novel-act-8';
const canonical = { id: slug, slug, data: { number: 8, title: 'Epilogue' } };
const imported = {
  id: 'ae628186-30f7-441c-bcd7-4724888e6780',
  slug,
  data: { number: 8, title: 'Epilogue' },
};

test('canonical and imported UUID fragment IDs preserve exact slug identity', () => {
  assert.equal(isExpectedNovelFragment(canonical, slug, 8), true);
  assert.equal(isExpectedNovelFragment(imported, slug, 8), true);
  assert.equal(isExpectedNovelFragment({ ...imported, data: { ...imported.data, slug } }, slug, 8), true);
});

test('fragment identity fails closed on unrelated IDs, slugs, numbers, and payload slugs', () => {
  assert.equal(isExpectedNovelFragment({ ...imported, id: 'unrelated-row' }, slug, 8), false);
  assert.equal(isExpectedNovelFragment({ ...imported, slug: `${slug}-wrong` }, slug, 8), false);
  assert.equal(isExpectedNovelFragment({ ...imported, data: { number: 9 } }, slug, 8), false);
  assert.equal(
    isExpectedNovelFragment({ ...imported, data: { number: 8, slug: `${slug}-wrong` } }, slug, 8),
    false
  );
  assert.equal(isExpectedNovelFragment(null, slug, 8), false);
});

test('Reader fragment loading uses the shared strict identity predicate', () => {
  const source = readFileSync(new URL('../../shared/lib/supabase.js', import.meta.url), 'utf8');
  assert.match(source, /import \{ isExpectedNovelFragment \} from '\.\/novelFragmentIdentity'/);
  assert.match(source, /if \(!isExpectedNovelFragment\(row, actSlug, actStub\.number\)\)/);
  assert.doesNotMatch(source, /row\.id !== actSlug \|\| row\.slug !== actSlug/);
});
