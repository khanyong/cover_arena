"""Run after publication-integration.py on a fresh isolated null-owner fixture.
Uses real GoTrue sessions and PostgREST; never sets JWT claims or disables guards.
"""
import importlib.util, pathlib, json, unittest, uuid
from concurrent.futures import ThreadPoolExecutor
spec = importlib.util.spec_from_file_location('dbtest', pathlib.Path(__file__).with_name('database-integration.py'))
d = importlib.util.module_from_spec(spec)
spec.loader.exec_module(d)
pub = json.loads((d.P / 'published.json').read_text())
project = '707e3ae1-0817-467a-bb42-5401c646151e'

class AuthorityLifecycle(unittest.TestCase):
    def test_01_mutation_denial_preserves_state(self):
        self.assertEqual(d.sql(f"select owner_id is null from public.revision_projects where id='{project}'"), 't')
        calls = [
            ('ros_bilingual_stage', d.request),
            ('ros_bilingual_publish', {'p_request_id': str(uuid.uuid4()), 'p_release_id': pub['release_id']}),
            ('ros_bilingual_restore_publication', {'p_request_id': str(uuid.uuid4()), 'p_publication_id': pub['publication_id']}),
        ]
        for actor in [None, 'outsider']:
            for name, body in calls:
                with self.subTest(actor=actor, path=name):
                    before = d.counts()
                    status, result = d.rpc(name, body, actor)
                    self.assertIn(status, [401, 403], result)
                    self.assertEqual(d.counts(), before)

    def test_02_restore_and_concurrent_reads(self):
        import threading
        barrier = threading.Barrier(3)
        body = {'p_request_id': str(uuid.uuid4()), 'p_publication_id': pub['publication_id']}
        def read():
            barrier.wait()
            observations = []
            for _ in range(12):
                status, result = d.capture()
                if status == 409:
                    self.assertIn(result['message'], ['CAPTURE_DOCUMENT_CHANGED','CAPTURE_SCENE_CHANGED']); observations.append(['RETRY']); continue
                self.assertEqual(status, 200, result)
                sizes = [len(x['data']['chapters'][1]['scenes'][0]['paragraphs']) for x in result['documents'] if x['id'].endswith('act-2')]
                self.assertIn(sizes, [[67, 67], [79, 79]])
                observations.append(sizes)
            return observations
        def restore():
            barrier.wait()
            return d.rpc('ros_bilingual_restore_publication', body)
        with ThreadPoolExecutor(max_workers=3) as pool:
            a, b, c = pool.submit(read), pool.submit(read), pool.submit(restore)
            status, result = c.result()
            self.assertEqual(status, 200, result)
            self.assertEqual(result['status'], 'RESTORED')
            observations = a.result() + b.result()
        before = d.counts()
        status, replay = d.rpc('ros_bilingual_restore_publication', body)
        self.assertEqual(status, 200, replay)
        self.assertTrue(replay['replayed'])
        self.assertEqual(before, d.counts())
        self.assertEqual(d.sql("select data->>'otherScene' from public.novel_documents where id='quantum-vibration-novel-en-act-2'"), 'later edit retained')
        (d.P / 'authority-lifecycle-results.json').write_text(json.dumps({'restore': result, 'read_pairs': observations}))

if __name__ == '__main__':
    unittest.main(verbosity=2)
