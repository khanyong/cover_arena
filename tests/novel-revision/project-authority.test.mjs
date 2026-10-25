import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const dir=process.env.ROS_EXEC02_FIXTURE_DIR,db=process.env.ROS_EXEC02_DB;
assert.match(db,/^ros_exec02_run[0-9]+$/);
const docker='/usr/local/bin/docker';
assert.equal(execFileSync(docker,['inspect','ros-exec02-db','--format','{{index .Config.Labels "ros.scope"}}'],{encoding:'utf8'}).trim(),'exec02-nonproduction');
const sql=q=>execFileSync(docker,['exec','ros-exec02-db','psql','-U','supabase_admin','-d',db,'-At','-v','ON_ERROR_STOP=1','-c',q],{encoding:'utf8'}).trim();
const secret=JSON.parse(readFileSync(dir+'/../local-secrets.json'));
const request=JSON.parse(readFileSync(dir+'/fixture.request.json'));
const project='707e3ae1-0817-467a-bb42-5401c646151e';
const login=async who=>{const r=await fetch('http://127.0.0.1:55463/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:who+'@exec02.test',password:secret.password})});assert.equal(r.status,200);return r.json();};
const context=async token=>fetch('http://127.0.0.1:55464/rpc/ros_bilingual_stage_context',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({p_approval_id:request.p_approval_id})});
test('existing EN owner policy: owner and unowned accepted; foreign project and unapproved actor denied',async()=>{
 const owner=await login('owner'),outsider=await login('outsider');
 const prior=sql(`select owner_id from public.revision_projects where id='${project}'`);
 try{
  assert.equal((await context(owner.access_token)).status,200);
  sql(`update public.revision_projects set owner_id=null where id='${project}'`);
  assert.equal((await context(owner.access_token)).status,200);
  assert.equal((await context(outsider.access_token)).status,403);
  sql(`update public.revision_projects set owner_id='${outsider.user.id}' where id='${project}'`);
  assert.equal((await context(owner.access_token)).status,403);
 }finally{sql(`update public.revision_projects set owner_id=${prior?"'"+prior+"'":'null'} where id='${project}'`);}
});
