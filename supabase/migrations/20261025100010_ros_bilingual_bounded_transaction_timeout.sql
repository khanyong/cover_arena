-- Full-book snapshots currently contain 45,783 map rows. Copying the current
-- map preserves unrelated edits and all row guards; the default 8s RPC budget
-- is insufficient. Bound only these three authorized transactions to 45s.
-- No role/global timeout, lock, RLS, trigger or authorization change.
alter function public.ros_bilingual_stage(uuid,uuid,jsonb,text) set statement_timeout='45s';
alter function public.ros_bilingual_publish(uuid,uuid) set statement_timeout='45s';
alter function public.ros_bilingual_restore_publication(uuid,uuid) set statement_timeout='45s';
notify pgrst,'reload schema';
