const RETURN_PATHS = new Set(['/temsco/equity', '/temsco/equity/evidence'])

// Next has already decoded the `next` query parameter. Require an exact path
// before its query/hash; do not normalize or decode a second time.
export function getSafeAuthReturnPath(value) {
  if (typeof value !== 'string' || /[\u0000-\u0020\u007f\\]/.test(value)) return '/'

  const pathname = value.split(/[?#]/, 1)[0]
  return RETURN_PATHS.has(pathname) ? value : '/'
}
