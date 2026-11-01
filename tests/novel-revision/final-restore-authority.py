"""Reproduce the production delegate's read/rewrite-but-not-restore contract.
This test deliberately expects denial; it is NOT a successful rollback test.
"""
import importlib.util,pathlib,json,uuid
spec=importlib.util.spec_from_file_location('dbtest',pathlib.Path(__file__).with_name('database-integration.py'))
d=importlib.util.module_from_spec(spec);spec.loader.exec_module(d)
owner=json.loads((d.P/'owner-session.json').read_text())['user']['id']
other=json.loads((d.P/'outsider-session.json').read_text())['user']['id']
assert d.sql("select owner_id from public.ko_managed_scenes")==other,'Use fixture prepared with ROS_EXEC02_DELEGATED=1'
assert d.sql("select ros_ko_private.scene_actor_has_capability(id,'"+owner+"','restore') from public.ko_managed_scenes")=='f'

pub=json.loads((d.P/'published.json').read_text());before=d.counts()
status,result=d.rpc('ros_bilingual_restore_publication',{'p_request_id':str(uuid.uuid4()),'p_publication_id':pub['publication_id']})
assert status==403,(status,result)
assert before==d.counts(),'Denied restore changed stored text'
(d.P/'final-restore-authority.json').write_text(json.dumps({'authorization_denial':'PASS','actual_restore':'NOT_CHECKED','status':status,'error':result,'operational_equivalence':'delegate read/rewrite; no generic restore'},indent=2))
print('PASS delegate restore denied without writes; operational rollback remains blocked')
