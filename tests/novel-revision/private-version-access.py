"""T01 direct Data API boundary, after staging with production EN policy parity.
Only status/counts are logged; never logs unpublished prose or credentials.
"""
import importlib.util, pathlib, json, unittest, urllib.request, uuid
spec = importlib.util.spec_from_file_location('dbtest', pathlib.Path(__file__).with_name('database-integration.py'))
d = importlib.util.module_from_spec(spec)
spec.loader.exec_module(d)

class PrivateVersionAccess(unittest.TestCase):
    def rows(self, actor, version):
        token = json.loads((d.P / (actor + '-session.json')).read_text())['access_token']
        req = urllib.request.Request(d.REST + '/paragraph_versions?id=eq.' + version + '&select=id', headers={'Authorization': 'Bearer ' + token})
        with urllib.request.urlopen(req) as response:
            return json.load(response)

    def test_01_unapproved_actor_cannot_select_staged_version(self):
        version = d.sql("select p->>'en_version_id' from ros_bilingual_private.releases r cross join lateral jsonb_array_elements(r.pairs) p where not exists(select 1 from ros_bilingual_private.publications x where x.release_id=r.id) and exists(select 1 from public.paragraph_versions v where v.id=(p->>'en_version_id')::uuid and v.version_no>1) limit 1")
        self.assertTrue(version, 'Requires an unpublished staged rewrite')
        self.assertEqual(len(self.rows('outsider', version)), 0, 'Unapproved actor can directly select an unpublished staged EN version')
        self.assertEqual(len(self.rows('owner', version)), 1, 'Approved reader lost staged access')
        baseline = d.sql("select baseline#>>'{ordered_alignment,0,en,version_id}' from ros_bilingual_private.releases limit 1")
        self.assertEqual(len(self.rows('outsider', baseline)), 1, 'Existing shared EN access was narrowed')
        type(self).version = version

    def test_02_publication_and_history_preserve_existing_read_access(self):
        release = d.sql('select id from ros_bilingual_private.releases limit 1')
        status, publication = d.rpc('ros_bilingual_publish', {'p_request_id': str(uuid.uuid4()), 'p_release_id': release})
        self.assertEqual(status, 200, publication)
        self.assertEqual(len(self.rows('outsider', self.version)), 1)
        status, restored = d.rpc('ros_bilingual_restore_publication', {'p_request_id': str(uuid.uuid4()), 'p_publication_id': publication['publication_id']})
        self.assertEqual(status, 200, restored)
        self.assertEqual(len(self.rows('outsider', self.version)), 1, 'Published historical version became inaccessible after restore')

if __name__ == '__main__':
    unittest.main(verbosity=2)
