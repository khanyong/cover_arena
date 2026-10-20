const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Imported Reader ACT fragments can retain their immutable UUID row ID while
// exposing the canonical fragment slug. Keep the slug and ACT number strict;
// only the physical row ID may use the legacy UUID form.
export function isExpectedNovelFragment(row, expectedSlug, expectedNumber) {
  if (!row || typeof expectedSlug !== 'string' || !Number.isInteger(expectedNumber)) return false;
  if (row.slug !== expectedSlug || !row.data || row.data.number !== expectedNumber) return false;
  if (row.data.slug != null && row.data.slug !== expectedSlug) return false;

  return row.id === expectedSlug || (
    typeof row.id === 'string' && UUID_PATTERN.test(row.id)
  );
}
