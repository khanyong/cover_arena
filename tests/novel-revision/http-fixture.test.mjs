import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadHttpFixture } from './http-fixture.mjs';

test('fixture preflight rejects missing path and remote endpoints before network use', () => {
  assert.throws(() => loadHttpFixture({}), /absolute private fixture/);
  assert.throws(() => loadHttpFixture({ROS_EXEC02_FIXTURE_DIR:'/tmp', ROS_EXEC02_HTTP_URL:'https://example.com'}), /loopback/);
});
test('fixture preflight validates files and does not disclose malformed input', () => {
  const dir=mkdtempSync(join(tmpdir(),'ros-http-fixture-'));
  try {
    const env={ROS_EXEC02_FIXTURE_DIR:dir};
    assert.throws(()=>loadHttpFixture(env), /fixture.request.json: ENOENT/);
    writeFileSync(join(dir,'fixture.request.json'),'SECRET-SENTINEL');
    assert.throws(()=>loadHttpFixture(env), error=>!error.message.includes('SECRET-SENTINEL') && error.message.includes('INVALID_JSON'));
    writeFileSync(join(dir,'fixture.request.json'),JSON.stringify({p_request_id:'70200000-0000-4000-8000-000000000002',p_approval_id:'70200000-0000-4000-8000-000000000001',p_proposal:{changes:[{}]}}));
    for(const name of ['owner','outsider','expired']) writeFileSync(join(dir,`${name}-session.json`),JSON.stringify({access_token:'SYNTHETIC'}));
    const result=loadHttpFixture(env);
    assert.equal(result.endpoint,'http://127.0.0.1:3003/api/novel-bilingual-stage');
    assert.equal(result.body.proposal.changes.length,1);
  } finally { rmSync(dir,{recursive:true}); }
});
