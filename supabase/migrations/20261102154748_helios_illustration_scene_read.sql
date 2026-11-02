create policy "helios_illustration_scene_read" on storage.objects
for select to authenticated
using (
 bucket_id = 'novel-assets'
 and name = 'illustrations/A0-C01-S02/helios-complex/v1/Helios Complex Architectural Sketch.png'
 and auth.uid() is not null
 and public.ros_ko_can_read_scene('4bba9b4b-5abf-46a7-9235-fe44de51de20'::uuid)
);
