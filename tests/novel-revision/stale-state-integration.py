"""Additional T02/T07 cases on a fresh isolated fixture before any staging."""
import importlib.util, pathlib, json, unittest, uuid
spec = importlib.util.spec_from_file_location('dbtest', pathlib.Path(__file__).with_name('database-integration.py'))
d = importlib.util.module_from_spec(spec)
spec.loader.exec_module(d)

class StaleState(unittest.TestCase):
    def reject_change(self, change, undo, expected):
        d.sql(change)
        try:
            before = d.counts()
            status, result = d.rpc('ros_bilingual_stage', d.request)
            self.assertEqual(status, 409, result)
            self.assertIn(expected, result['message'])
            self.assertEqual(d.counts(), before)
        finally:
            d.sql(undo)

    def test_01_scene_generation(self):
        self.reject_change('update public.ko_managed_scenes set generation=generation+1',
                           'update public.ko_managed_scenes set generation=generation-1', 'STALE_BILINGUAL_HEAD')

    def test_02_selection_generation(self):
        self.reject_change('update public.ko_scene_display_selections set generation=generation+1',
                           'update public.ko_scene_display_selections set generation=generation-1', 'STALE_BILINGUAL_HEAD')

    def test_03_en_version_pointer(self):
        row = json.loads(d.sql("select row_to_json(m) from public.revision_content_map m where paragraph_version_id is not null order by position limit 1"))
        other = d.sql("select id from public.paragraph_versions where id<>'" + row['paragraph_version_id'] + "' limit 1")
        where = " where snapshot_id='" + row['snapshot_id'] + "' and unit_id='" + row['unit_id'] + "'"
        self.reject_change("update public.revision_content_map set paragraph_version_id='" + other + "'" + where,
                           "update public.revision_content_map set paragraph_version_id='" + row['paragraph_version_id'] + "'" + where, 'STALE_BILINGUAL_BLOCK')

    def test_04_alignment_version_pointer(self):
        row = json.loads(d.sql('select row_to_json(a) from public.ko_en_block_alignments a limit 1'))
        other = d.sql("select id from public.paragraph_versions where id<>'" + row['en_block_version_id'] + "' limit 1")
        where = " where id='" + row['id'] + "'"
        self.reject_change("update public.ko_en_block_alignments set en_block_version_id='" + other + "'" + where,
                           "update public.ko_en_block_alignments set en_block_version_id='" + row['en_block_version_id'] + "'" + where, 'STALE_BILINGUAL_BLOCK')

    def test_05_ko_document_hash(self):
        self.reject_change("update public.novel_documents set data=jsonb_set(data,'{otherScene}','\"changed\"') where id='quantum-vibration-novel-act-2'",
                           "update public.novel_documents set data=jsonb_set(data,'{otherScene}','\"preserve me\"') where id='quantum-vibration-novel-act-2'", 'STALE_DOCUMENT')

    def test_06_edit_between_stage_and_publish(self):
        status, result = d.rpc('ros_bilingual_stage', d.request)
        self.assertEqual(status, 200, result)
        d.sql('update public.ko_scene_display_selections set generation=generation+1')
        try:
            before = d.counts()
            status, result = d.rpc('ros_bilingual_publish', {'p_request_id': str(uuid.uuid4()), 'p_release_id': result['release_id']})
            self.assertEqual(status, 409, result)
            self.assertIn('STALE_BILINGUAL_HEAD', result['message'])
            self.assertEqual(d.counts(), before)
            self.assertEqual(d.sql('select count(*) from ros_bilingual_private.publications'), '0')
        finally:
            d.sql('update public.ko_scene_display_selections set generation=generation-1')

if __name__ == '__main__':
    unittest.main(verbosity=2)
