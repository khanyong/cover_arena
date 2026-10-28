-- Scope extension for explicit BATCH18 adoption only. No manuscript or approval rows inserted.
-- Existing authorization, immutable approvals, locking and publication guards stay in place.
-- Must pass isolated lifecycle tests before deployment.
alter table ros_bilingual_private.approvals drop constraint approvals_plan_check1;
alter table ros_bilingual_private.approvals add constraint approvals_plan_check1 check (
(change_key='ROS-STYLE-PRO-C01-S01-r01' and managed_scene_id='13a795ae-456e-4623-9714-b302c9db9585' and jsonb_array_length(plan->'result_pairs')=67)
 or (change_key='ROS-STYLE-PRO-C02-S01-r01' and managed_scene_id='87320aa9-fbd3-4672-8694-cc5fde2bf7e8' and jsonb_array_length(plan->'result_pairs')=129)
 or (change_key='ROS-STYLE-A0-C01-S01-r01' and revision=1 and managed_scene_id='e4c38768-259e-4098-a5ce-cc474ab16e27' and jsonb_array_length(plan->'result_pairs')=220)
 or (change_key='ROS-STYLE-A0-C01-S02-r01' and revision=1 and managed_scene_id='4bba9b4b-5abf-46a7-9235-fe44de51de20' and jsonb_array_length(plan->'result_pairs')=273)
 or (change_key='ROS-STYLE-A0-C02-S01-r01' and revision=1 and managed_scene_id='a7402eea-99c9-4e2a-92c3-5ce83ba5419f' and jsonb_array_length(plan->'result_pairs')=355)
 or (change_key='ROS-STYLE-A0-C02-S02-r01' and revision=1 and managed_scene_id='868f488c-5bd0-4479-b941-ce885d2e48cc' and jsonb_array_length(plan->'result_pairs')=351)
 or (change_key='ROS-STYLE-A0-C03-S01-r01' and revision=1 and managed_scene_id='820a026c-7c68-4292-be8d-6aa99f164956' and jsonb_array_length(plan->'result_pairs')=252)
 or (change_key='ROS-STYLE-A0-C03-S02-r01' and revision=1 and managed_scene_id='6209769a-868e-45fb-a36d-c78777e39615' and jsonb_array_length(plan->'result_pairs')=303)
 or (change_key='ROS-STYLE-A0-C04-S01-r01' and revision=1 and managed_scene_id='33c53868-822b-4953-946e-533e0a820e74' and jsonb_array_length(plan->'result_pairs')=210)
 or (change_key='ROS-STYLE-A0-C04-S02-r01' and revision=1 and managed_scene_id='a261b44f-4e4b-4242-bde2-a6456387fcfa' and jsonb_array_length(plan->'result_pairs')=247)
 or (change_key='ROS-STYLE-A1-C01-S01-r01' and revision=1 and managed_scene_id='801328b1-59be-4666-af47-071ab0094f8c' and jsonb_array_length(plan->'result_pairs')=133)
 or (change_key='ROS-STYLE-A1-C01-S02-r01' and revision=1 and managed_scene_id='83b6e2c4-0a55-49ce-b223-562c1aaebe98' and jsonb_array_length(plan->'result_pairs')=167)
 or (change_key='ROS-STYLE-A1-C02-S01-r01' and revision=1 and managed_scene_id='e620bcc0-16c1-4c6a-a8e2-0ea645009b1f' and jsonb_array_length(plan->'result_pairs')=226)
 or (change_key='ROS-STYLE-A1-C02-S02-r01' and revision=1 and managed_scene_id='20595c50-bdbc-44cf-9434-066014a58ac9' and jsonb_array_length(plan->'result_pairs')=259)
 or (change_key='ROS-STYLE-A1-C03-S01-r01' and revision=1 and managed_scene_id='c26660b8-c713-4db3-9b11-5dd96821c423' and jsonb_array_length(plan->'result_pairs')=162)
 or (change_key='ROS-STYLE-A1-C03-S03-r01' and revision=1 and managed_scene_id='4e990e38-c669-4e6c-a947-2a6c16e219f1' and jsonb_array_length(plan->'result_pairs')=200)
 or (change_key='ROS-STYLE-A1-C04-S01-r01' and revision=1 and managed_scene_id='a7637c8d-a7bd-4fc3-9613-b96c673b78fa' and jsonb_array_length(plan->'result_pairs')=155)
 or (change_key='ROS-STYLE-PRO-C02-S02-r01' and revision=1 and managed_scene_id='21a8aa06-4311-4dbf-80dd-fe7f5dc48eff' and jsonb_array_length(plan->'result_pairs')=236)
 or (change_key='ROS-STYLE-PRO-C03-S01-r01' and revision=1 and managed_scene_id='3d54bf38-7710-43f1-9091-4a5354b63d25' and jsonb_array_length(plan->'result_pairs')=180)
 or (change_key='ROS-STYLE-PRO-C03-S02-r01' and revision=1 and managed_scene_id='41381ee9-b438-4767-a2f1-5ccabd980892' and jsonb_array_length(plan->'result_pairs')=115)
);
