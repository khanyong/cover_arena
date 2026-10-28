import { readFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';

// Fail before making any HTTP request; never include fixture contents or tokens
// in diagnostics. The HTTP suite must target an explicitly configured local app.
export function loadHttpFixture(env = process.env) {
  const dir = env.ROS_EXEC02_FIXTURE_DIR;
  if (!dir || !isAbsolute(dir)) throw new Error('ROS_EXEC02_FIXTURE_DIR must be an absolute private fixture directory');
  const endpoint = new URL(env.ROS_EXEC02_HTTP_URL || 'http://127.0.0.1:3003');
  if (endpoint.protocol !== 'http:' || endpoint.hostname !== '127.0.0.1' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || endpoint.pathname !== '/') {
    throw new Error('ROS_EXEC02_HTTP_URL must be a loopback HTTP origin');
  }
  function read(name) {
    try { return JSON.parse(readFileSync(join(dir, name), 'utf8')); }
    catch (error) { throw new Error(`Invalid or unreadable fixture ${name}: ${error.code || 'INVALID_JSON'}`); }
  }
  const input = read('fixture.request.json');
  const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(value);
  if (!uuid(input.p_request_id) || !uuid(input.p_approval_id) || !Array.isArray(input.p_proposal?.changes) || !input.p_proposal.changes.length) throw new Error('fixture.request.json has an invalid request contract');
  const tokens = Object.fromEntries(['owner', 'outsider', 'expired'].map(name => {
    const session = read(`${name}-session.json`);
    if (typeof session.access_token !== 'string' || !session.access_token) throw new Error(`Invalid session fixture: ${name}`);
    return [name, session.access_token];
  }));
  return { endpoint: new URL('/api/novel-bilingual-stage', endpoint).href,
    body: { request_id: input.p_request_id, approval_id: input.p_approval_id, proposal: input.p_proposal }, tokens };
}
