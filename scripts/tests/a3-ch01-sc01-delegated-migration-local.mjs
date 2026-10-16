// Local-only delegated administrative migration regression. No network or production connection.
// Read-only source artifacts, isolated PostgreSQL writes, JSON evidence on stdout only.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync, spawn } from 'node:child_process';
import { postgresJsonText } from '../ros-ko/build-multi-legacy-patch.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  assert.match(a, /^--(?:native-bin|native-socket)=/); const i = a.indexOf('='); return [a.slice(2, i), a.slice(i + 1)];
}));
const bin = args['native-bin'], socket = args['native-socket'];
assert.match(bin || '', /^\/private\/tmp\/ros-ko-ch04-pg15-[^/]+\/mount\/Postgres\.app\/Contents\/Versions\/15\/bin$/);
assert.match(socket || '', /^\/private\/tmp\/ros-ko-a3-ch01-sc01-delegated-pg15-[^/]+\/socket$/);
const base = 'private/ros-ko-a3-ch01-sc01-db-code-git-deploy-01';
const referenceBase = 'private/ros-ko-a1-ch01-sc01-save-title-tag-01';
const read = p => fs.readFileSync(p, 'utf8');
const json = p => JSON.parse(read(p));
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const q = s => `'${String(s).replaceAll("'", "''")}'`;
const j = v => `${q(JSON.stringify(v))}::jsonb`;
const lpf = f => f.map(v => v === null ? 'N00000000:' : `S${Buffer.byteLength(String(v)).toString(16).padStart(8, '0')}:${v}`).join('');
const run = (command, argv, input) => {
  const r = spawnSync(command, argv, { input, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: 60000 });
  if (r.status !== 0) throw Error(`${command}: ${r.status}: ${String(r.stderr || r.error).split('SQL statement')[0].slice(0,1500)}`);
  return r.stdout;
};
const runId = crypto.randomUUID();
const startedAt = new Date().toISOString();
const db = `a3ch01sc01delegated_${runId.replaceAll('-', '')}`;
const pg = (sql, database = db) => {
  const argv = ['-X', '-q', '-A', '-t', '-h', socket, '-U', 'postgres', '-d', database, '-v', 'ON_ERROR_STOP=1'];
  // Bounded statements use -c, avoiding intermittent macOS large-stdin pipe stalls.
  return Buffer.byteLength(sql) < 230000 ? run(`${bin}/psql`, [...argv,'-c',sql]) : run(`${bin}/psql`,argv,sql);
};
const data = sql => pg(sql).split('\n').filter(s => s.startsWith('{') || s.startsWith('[')).map(s => JSON.parse(s));
const pgAsync = sql => {
  const child = spawn(`${bin}/psql`, ['-X','-q','-A','-t','-h',socket,'-U','postgres','-d',db,'-v','ON_ERROR_STOP=1'], { stdio:['pipe','pipe','pipe'] });
  let stdout='', stderr='', firstResolve, firstReject, resolved=false;
  const firstJson = new Promise((resolve,reject) => { firstResolve=value=>{resolved=true;resolve(value);};firstReject=reject; });
  firstJson.catch(()=>{}); // Some expected-error workers have no JSON result.
  const timeout=setTimeout(()=>child.kill('SIGTERM'),60000);
  child.stdout.on('data', chunk => { stdout+=String(chunk);const line=stdout.split('\n').find(s=>s.startsWith('{'));if(line?.endsWith('}'))firstResolve(JSON.parse(line)); });
  child.stderr.on('data', chunk => { stderr+=String(chunk); });
  child.stdin.end(sql);
  const done = new Promise((resolve,reject)=>{child.on('error',error=>{clearTimeout(timeout);firstReject(error);reject(error);});child.on('close',code=>{clearTimeout(timeout);if(!resolved)firstReject(Error(`Local worker exited ${code}: ${stderr.slice(0,300)}`));resolve({code,stdout,stderr});});});
  return { firstJson, done };
};
const scalar = sql => pg(sql).trim();
const checks = [];
const pass = (name, detail = {}) => { checks.push({ name, status: 'PASS', ...detail }); process.stderr.write(`LOCAL_CHECK ${checks.length}: ${name}\n`); };
assert.equal(pg('show listen_addresses;', 'postgres').trim(), '');
assert.equal(pg('show unix_socket_directories;', 'postgres').trim(), socket);
pg(`create database ${db};`, 'postgres');
// Match production execution's UTC contract before timestamps enter projections.
pg(`alter database ${db} set timezone='UTC';`, 'postgres');
const owner = '3b3baba4-c608-45e5-98e9-fac61577b005';
const peer = 'd5355824-7e26-4874-8bd2-ce58ca29a5b8';
const project = '955c9b9e-146c-40b0-b57a-655195b11086';
const enProject = '707e3ae1-0817-467a-bb42-5401c646151e';
const snapshot = '66cda81f-6a3a-4c8b-a226-c7169ffd2710';
const enParent = '3cd61722-ba44-519a-ab74-931c9cd4be48';
const enChapter = 'b088cfd5-df26-50e7-a544-dcd7ec389fdc';
const enAct = 'eca7b96a-09e1-5875-a8c4-cfabb6696cd6';
const root = 'quantum-vibration-novel', doc = `${root}-act-6`, origin = `${root}-act-2`;
const enRoot = 'quantum-vibration-novel-en', enDoc = `${enRoot}-act-6`;
const sourceKey = 'A3/CH01/SC01', sceneId = 'ab4c188e';
const sceneTitle = '[Scene 1: The Acoustic Void]', chapterTitle = 'Chapter 1: The Soaring Sea';
const actTitle = 'ACT 3: WHEN THE SKY LOSES ITS RULES';
const enChapterTitle = 'Chapter 1: The Soaring Sea', enActTitle = 'ACT 3: WHEN THE SKY LOSES ITS RULES';
const stable = s => { const h = sha(`${runId}/${s}`); return `${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-8${h.slice(17,20)}-${h.slice(20,32)}`; };
const originManaged = stable('origin-managed'), request = stable('request');
const zip = 'private/ros-ko-a3-ch01-sc01-r01/ROS_KO_A3_CH01_SC01_r01_PACKAGE_20261016.zip';
assert.equal(sha(fs.readFileSync(zip)), '7ba9b73360c2686d57fd1b9df9bc56dfed531453ec5247cc72d913e3e51ef7b1');
const alignment = JSON.parse(run('/usr/bin/unzip', ['-p', zip, 'ROS_KO_A3_CH01_SC01_r01_BLOCK_ALIGNMENT_20261016.json']));
const rows = alignment.blocks.map(b => ({ position: b.position, ko: b.ko_body, en: b.en_body, separator: b.separator_after, unit: stable(`en-unit-${b.position}`), version: stable(`en-version-${b.position}`) }));
assert.equal(rows.length, 306);
const body = rows.map(r => r.ko + r.separator).join('');
assert.equal(sha(body), 'ad0585a3c3b0eebb67c36d97cfa740a40b0767b9d8e02f5a4b6259fc9c204eb0');
const emptyLegacyId = '__empty_scene_ab4c188e__';
const scene = { id: sceneId, number: 1, title: sceneTitle, paragraphs: [] };
const fixtureDoc = { id: doc, slug: doc, number: 6, title: actTitle,
  chapters: [{ number: 1, title: chapterTitle, scenes: [scene] }], metadata: { unchanged: true } };
const fixtureRoot = { id: root, slug: root, acts: [
  { number: 1, title: 'FRONT MATTER' }, { number: 2, title: 'PROLOGUE: THE NODE' },
  { number: 3, title: 'ACT 0: THE BROKEN VARIABLE' }, { number: 4, title: 'ACT 1: THE RETURNING SIGNATURE' },
  { number: 5, title: 'ACT 2: THE IMPOSSIBLE INVESTMENT' }, { number: 6, title: actTitle },
] };
const enScene = { id: sceneId, number: 1, title: sceneTitle, publication: { revision_scene_id: enParent }, paragraphs: rows.map(r => ({ id: r.unit, unitId: r.unit, revisionVersionId: r.version, activeVersion: 'review', versions: { review: { content: r.en, revisionVersionId: r.version } } })) };
const enFixtureRoot = { id: enRoot, slug: enRoot, acts: fixtureRoot.acts };
const enFixtureDoc = { id: enDoc, slug: enDoc, number: 6, title: enActTitle,
  chapters: [{ number: 1, title: enChapterTitle, scenes: [enScene] }] };
const remote = read('supabase/migrations/20260911052131_remote_schema.sql');
const tables = ['novel_documents', 'revision_projects', 'content_units', 'paragraph_versions', 'paragraph_version_lineage', 'revision_snapshots', 'revision_content_map'];
const refs = [];
for (const name of tables) { const m = remote.match(new RegExp(`CREATE TABLE IF NOT EXISTS "public"\\."${name}" \\([\\s\\S]*?\\n\\);`)); assert(m, name); refs.push(m[0]); }
for (const m of remote.matchAll(/ALTER TABLE ONLY "public"\."([^"]+)"\s+ADD CONSTRAINT[\s\S]+?;/g)) if (tables.includes(m[1])) refs.push(m[0]);
for (const name of ['fn_prevent_locked_content_map_mutation', 'fn_prevent_paragraph_version_mutation', 'fn_prevent_snapshot_unlock']) { const m = remote.match(new RegExp(`CREATE OR REPLACE FUNCTION "public"\\."${name}"\\(\\)[\\s\\S]+?\\n\\$\\$;`)); assert(m); refs.push(m[0]); }
for (const m of remote.matchAll(/CREATE OR REPLACE TRIGGER[^;]+;/g)) if (/trg_prevent_(locked_content_map_mutation|paragraph_version_mutation|snapshot_unlock)/.test(m[0])) refs.push(m[0]);
const old = json('private/ros-ko-pro-ch03-sc02-multi-legacy-db-02/installed-before.json').functions.filter(f => !f.name.startsWith('ros_ko_review_') && f.name !== 'ros_ko_get_translation_comparison');
const overrides = [...json(`${referenceBase}/preflight/contracts.json`).functions, ...json(`${referenceBase}/preflight/route.json`).definitions].filter(f => typeof f.definition === 'string');
const defs = new Map(old.map(f => [f.name, f.definition]));
for (const f of overrides) defs.set(f.name, f.definition);
const currentFunctions = fs.existsSync(`${base}/functions.json`) ? json(`${base}/functions.json`).functions : [];
let reusedDefinitionFixtureCount=0;
for (const f of currentFunctions) if(defs.has(f.name) || ['migrate_a1_ch01_sc01_delegated','migrate_a1_ch01_sc03_delegated','rename_a1_ch01_sc01_chapter_delegated','migrate_a1_ch02_sc01_delegated','rename_a1_ch02_sc01_chapter_delegated'].includes(f.name)) { assert.equal(sha(f.definition), f.sha256); defs.set(f.name, f.definition);reusedDefinitionFixtureCount++; }
const dual = read('scripts/ros-ko/dual-account-access.sql');
const setup = [
  `begin; do $$ begin if not exists(select 1 from pg_roles where rolname='anon') then create role anon nologin; end if; if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if; if not exists(select 1 from pg_roles where rolname='service_role') then create role service_role nologin; end if; end $$; create schema extensions; create extension pgcrypto with schema extensions; create schema auth; create table auth.users(id uuid primary key,role text,confirmed_at timestamptz,email_confirmed_at timestamptz,is_anonymous boolean,deleted_at timestamptz,banned_until timestamptz); create function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;`,
  refs.join('\n'), read('supabase/migrations/20261005123000_ros_ko_block_model_v2_schema.sql'), read('supabase/migrations/20261005123100_ros_ko_block_model_v2_api.sql'),
  dual.slice(dual.indexOf('create function ros_ko_private.scene_actor_has_capability('), dual.indexOf('-- Historical rows remain untouched')),
  [...defs.values()].map(s => s + ';').join('\n'),
  `alter table ros_ko_private.ko_mutation_requests drop constraint ko_mutation_requests_operation_check; alter table ros_ko_private.ko_mutation_requests add constraint ko_mutation_requests_operation_check check(operation in ('migrate','rewrite','restore','rename_title'));
  insert into auth.users values(${q(owner)},'authenticated',now(),now(),false,null,null),(${q(peer)},'authenticated',now(),now(),false,null,null);
  insert into public.revision_projects(id,slug,title,description,source_document_id,owner_id) values(${q(project)},'ros-ko-pro-ch01-sc01-blocks','ROS-KO PRO/CH01/SC01 Blocks','KO immutable block model',${q(origin)},${q(owner)}),(${q(enProject)},'local-en','Local EN',null,${q(enDoc)},null);
  insert into public.revision_snapshots(id,project_id,code,name,is_primary_working) values(${q(snapshot)},${q(enProject)},'LOCAL','LOCAL',true);
  insert into public.novel_documents(id,slug,title,data) values(${q(root)},${q(root)},'[KO] Local fixture',${j(fixtureRoot)}),(${q(origin)},${q(origin)},'[KO] Local origin',${j({ number: 2, title: 'PROLOGUE: THE NODE', chapters: [] })}),(${q(doc)},${q(doc)},'[KO] Local Act6',${j(fixtureDoc)}),(${q(enRoot)},${q(enRoot)},'[EN] Local root',${j(enFixtureRoot)}),(${q(enDoc)},${q(enDoc)},'[EN] Local Act6',${j(enFixtureDoc)});
  insert into public.ko_managed_scenes(id,logical_project_id,owner_id,root_document_id,document_id,document_slug,scene_id,scene_path,source_key,legacy_paragraph_id,manuscript_version,title_snapshot,generation) values(${q(originManaged)},${q(project)},${q(owner)},${q(root)},${q(origin)},${q(origin)},'synthetic-origin',array['chapters','0','scenes','1'],'LOCAL/ORIGIN','synthetic-p','r01','Local origin',1);
  insert into public.ko_protected_documents(document_id,document_slug,protection_reason,managed_scene_id) values(${q(root)},${q(root)},'root of managed KO block Scene',${q(originManaged)}),(${q(origin)},${q(origin)},'managed KO block Scene',${q(originManaged)});
  insert into public.content_units(id,project_id,unit_type,source_key,source_path,title) values(${q(enAct)},${q(enProject)},'act','act:6','act-6',${q(enActTitle)});
  insert into public.content_units(id,project_id,unit_type,source_key,source_path,title,original_parent_id) values(${q(enChapter)},${q(enProject)},'chapter','act:6:ch:1','act-6/ch-1',${q(enChapterTitle)},${q(enAct)});
  insert into public.content_units(id,project_id,unit_type,source_key,source_path,title,original_parent_id,original_position) values(${q(enParent)},${q(enProject)},'scene','act:6:ch:1:sc:1','act-6/ch-1/sc-1',${q(sceneTitle)},${q(enChapter)},1);`,
];
for (const r of rows) setup.push(`insert into public.content_units(id,project_id,unit_type,source_key,source_path,original_parent_id,original_position) values(${q(r.unit)},${q(enProject)},'paragraph',${q(`act:6:ch:1:sc:1:p:${r.position}`)},${q(`act-6/ch-1/sc-1/p-${String(r.position).padStart(4,'0')}`)},${q(enParent)},${r.position}); insert into public.paragraph_versions(id,paragraph_unit_id,body_markdown,body_hash,created_by) values(${q(r.version)},${q(r.unit)},${q(r.en)},${q(sha(r.en))},${q(owner)}); insert into public.revision_content_map(snapshot_id,unit_id,parent_unit_id,position,paragraph_version_id) values(${q(snapshot)},${q(r.unit)},${q(enParent)},${r.position},${q(r.version)});`);
setup.push('commit;');
pg(setup.join('\n'));
assert.equal(scalar('select auth.uid() is null;'), 't');
pass('isolated_unix_socket_pg_fixture_no_auth_claims', { database: db, copied_auth_secrets: 0 });

const baselineTables = [...tables.map(t => `public.${t}`), 'public.ko_managed_scenes', 'public.ko_protected_documents', 'ros_ko_private.ko_scene_authorizations', 'ros_ko_private.ko_scene_legacy_archives', 'ros_ko_private.ko_mutation_requests', 'public.ko_scene_composition_revisions', 'public.ko_scene_composition_blocks', 'public.ko_scene_display_selections', 'public.ko_scene_reader_projections', 'public.ko_scene_state_events', 'public.ko_en_block_alignments', 'auth.users'];
const fullState = () => data(`select jsonb_build_object(${baselineTables.flatMap(t => [q(t), `(select jsonb_build_object('count',count(*),'sha256',public.ros_ko_sha256_text(coalesce(string_agg(to_jsonb(x)::text,E'\\n' order by to_jsonb(x)::text),''))) from ${t} x)`]).join(',')});`)[0];
const contractsSQL = `select jsonb_build_object('functions',(select jsonb_agg(jsonb_build_object('signature',p.oid::regprocedure::text,'definition',pg_get_functiondef(p.oid),'acl',p.proacl,'owner',p.proowner,'config',p.proconfig,'security_definer',p.prosecdef) order by p.oid::regprocedure::text) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname in ('public','ros_ko_private') and p.proname not in ('migrate_a3_ch01_sc01_delegated','rename_a3_ch01_sc01_title_delegated','rename_a1_ch03_sc01_scene_delegated')),'triggers',(select jsonb_agg(jsonb_build_object('table',t.tgrelid::regclass::text,'name',t.tgname,'definition',pg_get_triggerdef(t.oid),'enabled',t.tgenabled) order by t.tgrelid::regclass::text,t.tgname) from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where not t.tgisinternal and n.nspname in ('public','ros_ko_private')));`;
const oldContracts = data(contractsSQL)[0];
const baseline = fullState();
const rejected = (label, statement, error, expectedState = baseline) => {
  const expected = Array.isArray(error) ? error : [error];
  pg(`begin; do $reject$ begin begin ${statement}; raise exception 'EXPECTED_ERROR_NOT_RAISED'; exception when others then if not (${expected.map(e => `position(${q(e)} in sqlerrm)>0`).join(' or ')}) then raise; end if; end; end $reject$; rollback;`);
  assert.deepEqual(fullState(), expectedState, `${label}: full state restored on separate connection`);
  pass(label, { expected_errors: expected, independent_full_state_restored: true });
};
rejected('existing_public_migration_still_requires_auth', `perform public.ros_ko_migrate_scene(${q(request)},${q('0'.repeat(64))},'{}')`, 'AUTHENTICATED_ACTOR_REQUIRED');
if (process.env.ROS_KO_LOCAL_BOOTSTRAP_ONLY === '1') {
  console.log(JSON.stringify({ status: 'BOOTSTRAP_PASS_NOT_FUNCTION_TESTED', database: db, checks }));
  process.exit(0);
}
const candidatePath = 'supabase/migrations/20261016124522_ros_ko_a3_ch01_sc01_delegated_admin.sql';
const candidate = read(candidatePath);
assert.equal((candidate.match(/CREATE(?: OR REPLACE)? FUNCTION /g)||[]).length,2);
assert(!/request\.jwt|request\.claims|set\s+role|disable\s+trigger|enable\s+replica|security\s+definer/i.test(candidate));
const migrationStages = [];
const stageSnapshot = () => data(`select jsonb_build_object(
  'captured_at',clock_timestamp(),
  'functions',coalesce((
    select jsonb_agg(jsonb_build_object(
      'signature',p.oid::regprocedure::text,
      'definition_sha256',public.ros_ko_sha256_text(pg_get_functiondef(p.oid)),
      'definition_bytes',octet_length(convert_to(pg_get_functiondef(p.oid),'UTF8')),
      'owner',pg_get_userbyid(p.proowner),
      'security_definer',p.prosecdef,
      'config',p.proconfig,
      'acl',p.proacl,
      'public_execute',has_function_privilege('public',p.oid,'execute'),
      'anon_execute',has_function_privilege('anon',p.oid,'execute'),
      'authenticated_execute',has_function_privilege('authenticated',p.oid,'execute'),
      'service_role_execute',has_function_privilege('service_role',p.oid,'execute')
    ) order by p.oid::regprocedure::text)
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='ros_ko_private' and p.proname in (
      'migrate_a3_ch01_sc01_delegated',
      'rename_a3_ch01_sc01_title_delegated'
    )
  ),'[]'::jsonb)
);`)[0];
const applyMigrationStage = (version, name, file, sql) => {
  const stageStartedAt = new Date().toISOString();
  pg(`begin;${sql}commit;`);
  migrationStages.push({
    version, name, file, sql_sha256: sha(sql),
    started_at: stageStartedAt,
    completed_at: new Date().toISOString(),
    snapshot: stageSnapshot()
  });
};
applyMigrationStage('20261016124522','ros_ko_a3_ch01_sc01_delegated_admin',candidatePath,candidate);
assert.deepEqual(migrationStages.map(stage => stage.version),['20261016124522']);
assert.deepEqual(migrationStages.map(stage => stage.snapshot.functions.length),[2]);
pass('target_migration_applied_in_one_local_transaction_with_definition_acl_snapshot',{
  versions:migrationStages.map(stage => stage.version),
  local_only:true
});
assert.deepEqual(data(contractsSQL)[0], oldContracts);
pass('new_private_invoker_only_public_functions_acl_triggers_unchanged');
const adminFunction = 'ros_ko_private.migrate_a3_ch01_sc01_delegated(uuid,text,jsonb)';
const titleFunctions = ['ros_ko_private.rename_a3_ch01_sc01_title_delegated(uuid,text,jsonb)'];
const acl = data(`select jsonb_build_object('owner',pg_get_userbyid(proowner),'security_definer',prosecdef,'config',proconfig,'acl',proacl,'anon',has_function_privilege('anon',oid,'execute'),'authenticated',has_function_privilege('authenticated',oid,'execute'),'service_role',has_function_privilege('service_role',oid,'execute')) from pg_proc where oid=${q(adminFunction)}::regprocedure;`)[0];
assert.equal(acl.owner,'postgres'); assert.equal(acl.security_definer,false); assert.deepEqual(acl.config,['search_path=""']);
assert.deepEqual(acl.acl,['postgres=X/postgres']);
for (const role of ['anon','authenticated','service_role']) assert.equal(acl[role],false);
for(const titleFunction of titleFunctions){const titleAcl=data(`select jsonb_build_object('owner',pg_get_userbyid(proowner),'security_definer',prosecdef,'config',proconfig,'acl',proacl,'anon',has_function_privilege('anon',oid,'execute'),'authenticated',has_function_privilege('authenticated',oid,'execute'),'service_role',has_function_privilege('service_role',oid,'execute')) from pg_proc where oid=${q(titleFunction)}::regprocedure;`)[0]; assert.equal(titleAcl.owner,'postgres');assert.equal(titleAcl.security_definer,false);assert.deepEqual(titleAcl.config,['search_path=""']);assert.deepEqual(titleAcl.acl,['postgres=X/postgres']);for(const role of ['anon','authenticated','service_role'])assert.equal(titleAcl[role],false);}
pass('no_public_anon_authenticated_service_role_execute', { acl });
const blockRows = rows.map(r => ({ position:r.position, ko_source_key:`KO/${sourceKey}/B${String(r.position).padStart(4,'0')}`, body:r.ko, body_bytes:Buffer.byteLength(r.ko),body_sha256:sha(r.ko),separator_after:r.separator,en_unit_id:r.unit,en_version_id:r.version,en_body_sha256:sha(r.en),en_source_key:`act:6:ch:1:sc:1:p:${r.position}`,en_source_path:`act-6/ch-1/sc-1/p-${String(r.position).padStart(4,'0')}`,en_original_position:r.position,en_current_position:r.position }));
const makeReview = blocks => lpf(['ROS-KO-MIGRATION-REVIEW-MANIFEST-LPF-V2',sourceKey,sceneId,sceneTitle,'r01','ros-ko-block-v1','306',...blocks.flatMap(r=>[String(r.position).padStart(6,'0'),r.ko_source_key,null,null,r.body_sha256,r.separator_after,r.en_unit_id,r.en_version_id,r.en_body_sha256])]);
const review = makeReview(blockRows);
const audit = { original_instruction_id:'ROS-KO-A3-CH01-SC01-DB-CODE-GIT-DEPLOY-01', original_instruction_sha256:'6c3ccc387746506cc81d4cf3720782866f279aa975685c5883879eddc478950a' };
const docHash = id => scalar(`select public.ros_ko_sha256_text(data::text) from public.novel_documents where id=${q(id)};`);
const expectedDoc = docHash(doc);
const payload = { root_document_id:root,project_slug:'ros-ko-pro-ch01-sc01-blocks',project_title:'ROS-KO PRO/CH01/SC01 Blocks',document_id:doc,document_slug:doc,scene_path:['chapters','0','scenes','0'],scene_path_lpf:'chapters/0/scenes/0',scene_id:sceneId,source_key:sourceKey,legacy_paragraph_id:emptyLegacyId,manuscript_version:'r01',title_snapshot:sceneTitle,block_count:306,terminal_lf:0,body_bytes:42366,body_lf:610,body_sha256:sha(body),expected_document_sha256:expectedDoc,expected_projection_sha256:sha(postgresJsonText([])),expected_legacy_scene_sha256:sha(postgresJsonText(scene)),expected_root_data_sha256:docHash(root),expected_en_root_data_sha256:docHash(enRoot),expected_en_document_sha256:docHash(enDoc),en_primary_snapshot_id:snapshot,en_parent_id:enParent,en_project_id:enProject,delegated_audit:audit,review_manifest_sha256:sha(review),blocks:blockRows };
const invoke = (p = payload, expected = expectedDoc, req = request) => `ros_ko_private.migrate_a3_ch01_sc01_delegated(${q(req)}::uuid,${q(expected)},${j(p)})`;
const beforeDocuments = data('select jsonb_agg(to_jsonb(d) order by id) from public.novel_documents d;')[0];
const result = data(`begin;select ${invoke()};set constraints all immediate;rollback;`)[0];
assert.equal(result.block_count,306); assert.equal(result.body_sha256,sha(body)); assert.equal(result.generation,1);
assert.deepEqual(fullState(),baseline);
pass('successful_306_migration_rollback_independent_complete_restoration');
// Replay the unsealed generator draft against this local database only. Replace
// the live preimages and EN IDs with fixture identities, not manuscript bytes or
// actual source/original/current-position evidence. No production request is used.
const unsealedDraft = fs.existsSync(`${base}/db-apply/payload.json`) ? json(`${base}/db-apply/payload.json`) : payload;
const fixtureOnlyFields = new Set(['expected_document_sha256','expected_projection_sha256',
  'expected_legacy_scene_sha256','expected_root_data_sha256','expected_en_root_data_sha256',
  'expected_en_document_sha256','review_manifest_sha256','blocks']);
assert.deepEqual(Object.keys(unsealedDraft).sort(),Object.keys(payload).sort());
for(const key of Object.keys(payload)) if(!fixtureOnlyFields.has(key)) assert.deepEqual(unsealedDraft[key],payload[key],`draft ${key}`);
const mappedDraft=structuredClone(unsealedDraft);
for(const key of fixtureOnlyFields) if(!['blocks','review_manifest_sha256'].includes(key)) mappedDraft[key]=payload[key];
for(const [index,b] of mappedDraft.blocks.entries()) {
  const local=blockRows[index];
  assert.deepEqual(Object.keys(b).sort(),Object.keys(local).sort());
  for(const key of ['position','ko_source_key','body','body_bytes','body_sha256','separator_after','en_body_sha256','en_current_position']) assert.deepEqual(b[key],local[key],`draft block ${index+1} ${key}`);
  assert.ok(Number.isInteger(b.en_original_position)&&b.en_original_position>0);
  assert.equal(typeof b.en_source_key,'string'); assert.ok(b.en_source_key.length>0);
  assert.equal(typeof b.en_source_path,'string'); assert.ok(b.en_source_path.length>0);
  for(const key of ['en_unit_id','en_version_id']) assert.match(b[key],/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  b.en_unit_id=local.en_unit_id;b.en_version_id=local.en_version_id;
}
assert.equal(new Set(mappedDraft.blocks.map(b=>b.en_original_position)).size,306);
assert.equal(unsealedDraft.review_manifest_sha256,sha(makeReview(unsealedDraft.blocks)));
mappedDraft.review_manifest_sha256=sha(makeReview(mappedDraft.blocks));
const mapDraftSql=mappedDraft.blocks.map(b=>`update public.content_units set original_position=${b.en_original_position},source_key=${q(b.en_source_key)},source_path=${q(b.en_source_path)} where id=${q(b.en_unit_id)};`).join('\n');
const draftResult=data(`begin;update public.content_units set source_key='fixture-staging-'||id::text,source_path='fixture-staging-'||id::text where original_parent_id=${q(enParent)};${mapDraftSql}select ${invoke(mappedDraft,expectedDoc,stable('unsealed-draft-fixture-request'))};set constraints all immediate;rollback;`)[0];
assert.equal(draftResult.block_count,306);assert.equal(draftResult.body_sha256,sha(body));assert.deepEqual(fullState(),baseline);
pass('actual_unsealed_generator_draft_306_body_and_original_positions_execute_with_fixture_IDs_and_preimages_only',{
  draft_sha256:fs.existsSync(`${base}/db-apply/payload.json`) ? sha(read(`${base}/db-apply/payload.json`)) : null, actual_original_position_differences:mappedDraft.blocks.filter(b=>b.en_original_position!==b.position).length,
  original_operational_request_used:false,complete_restoration_on_separate_connection:true,
});
const originalPosition = structuredClone(payload);Object.assign(originalPosition.blocks[1],{en_original_position:700,en_source_key:'act:6:ch:1:sc:1:p:700',en_source_path:'act-6/ch-1/sc-1/p-0700'});
assert.equal(data(`begin;update public.content_units set original_position=700,source_key='act:6:ch:1:sc:1:p:700',source_path='act-6/ch-1/sc-1/p-0700' where id=${q(rows[1].unit)};select ${invoke(originalPosition)};set constraints all immediate;rollback;`)[0].block_count,306);assert.deepEqual(fullState(),baseline);
pass('original_EN_import_position_distinct_current_position_supported_without_reordering');
for (const role of ['anon','authenticated','service_role']) rejected(`${role}_actual_execute_denied`,`set local role ${role};perform ${invoke()}`,'permission denied');
for (const [label, changes, error] of [
  ['other_scene',{scene_id:'74eb2b3c'},'DELEGATED_EXACT_TARGET_CONTRACT_REQUIRED'],
  ['other_document',{document_id:origin},'DELEGATED_EXACT_TARGET_CONTRACT_REQUIRED'],
  ['other_path',{scene_path:['chapters','1','scenes','0']},'DELEGATED_EXACT_TARGET_CONTRACT_REQUIRED'],
  ['other_project_slug',{project_slug:'another-project'},'DELEGATED_EXACT_TARGET_CONTRACT_REQUIRED'],
  ['other_title',{title_snapshot:'other'},'DELEGATED_EXACT_TARGET_CONTRACT_REQUIRED'],
  ['other_en_parent',{en_parent_id:stable('wrong-en')},'DELEGATED_EXACT_TARGET_CONTRACT_REQUIRED'],
  ['bad_count',{block_count:132},'DELEGATED_EXACT_TARGET_CONTRACT_REQUIRED'],
  ['missing_blocks',{blocks:[]},'DELEGATED_PREIMAGE_CONTRACT_INVALID'],
  ['changed_direct_instruction',{delegated_audit:{...audit,original_instruction_sha256:'0'.repeat(64)}},'DELEGATED_DIRECT_INSTRUCTION_REQUIRED'],
  ['previous_scene_instruction_hash_rejected',{delegated_audit:{...audit,original_instruction_sha256:'faf48263dd5cba328b103a5b836f9314eaa8c4c5f9a58c1bc8383362497f75ab'}},'DELEGATED_DIRECT_INSTRUCTION_REQUIRED'],
  ['stale_root',{expected_root_data_sha256:'0'.repeat(64)},'STALE_DOCUMENT_PREIMAGE'],
  ['stale_en_doc',{expected_en_document_sha256:'0'.repeat(64)},'STALE_DOCUMENT_PREIMAGE'],
  ['stale_legacy',{expected_legacy_scene_sha256:'0'.repeat(64)},'STALE_LEGACY_SCENE'],
  ['stale_projection',{expected_projection_sha256:'0'.repeat(64)},'STALE_LEGACY_SCENE'],
  ['review_manifest_tampered',{review_manifest_sha256:'0'.repeat(64)},'REVIEW_MANIFEST'],
  ['payload_expected_document_mismatch',{expected_document_sha256:'0'.repeat(64)},'DELEGATED_EXACT_TARGET_CONTRACT_REQUIRED'],
]) rejected(label,`perform ${invoke({...payload,...changes})}`,error);
rejected('private_function_role_guard_even_if_fixture_granted',`grant usage on schema ros_ko_private to authenticated;grant execute on function ${adminFunction} to authenticated;set local role authenticated;perform ${invoke()}`,'NORMAL_POSTGRES_ADMIN_REQUIRED');
rejected('replica_trigger_mode_rejected',`set local session_replication_role='replica';perform ${invoke()}`,'NORMAL_TRIGGER_EXECUTION_REQUIRED');
rejected('stale_act_preimage',`perform ${invoke({...payload,expected_document_sha256:'0'.repeat(64)},'0'.repeat(64))}`,'STALE_DOCUMENT_PREIMAGE');
for (const [label, index, patch, error] of [
  ['body_without_hash',0,{body:blockRows[0].body+' changed'},'BLOCK_PAYLOAD_INTEGRITY_FAILED'],
  ['body_consistent_hash_but_not_original',0,{body:blockRows[0].body+' changed',body_bytes:Buffer.byteLength(blockRows[0].body+' changed'),body_sha256:sha(blockRows[0].body+' changed')},'SCENE_BODY_CONTRACT_MISMATCH'],
  ['separator_changed',1,{separator_after:'\n'},'BLOCK_PAYLOAD_INTEGRITY_FAILED'],
  ['position_changed',1,{position:3},'BLOCK_PAYLOAD_INTEGRITY_FAILED'],
  ['en_position_changed',1,{en_current_position:3},'BLOCK_PAYLOAD_INTEGRITY_FAILED'],
  ['en_original_position_changed',1,{en_original_position:500},'EN_ALIGNMENT_PREIMAGE_CHANGED'],
  ['en_version_changed',1,{en_version_id:blockRows[0].en_version_id},'EN_ALIGNMENT_PREIMAGE_CHANGED'],
]) { const changed=structuredClone(payload);Object.assign(changed.blocks[index],patch);changed.review_manifest_sha256=sha(makeReview(changed.blocks));rejected(label,`perform ${invoke(changed)}`,error); }
for(const [label,statement,error]of [
  ['owner_mismatch',`update public.revision_projects set owner_id=${q(peer)} where id=${q(project)}`,'EXISTING_KO_PROJECT_OWNER_MISMATCH'],
  ['project_source_changed',`update public.revision_projects set source_document_id=${q(doc)} where id=${q(project)}`,'EXISTING_KO_PROJECT_OWNER_MISMATCH'],
  ['owner_disabled',`update auth.users set banned_until=now()+interval '1 hour' where id=${q(owner)}`,'DESIGNATED_ACCOUNT_NOT_USABLE'],
  ['peer_unconfirmed',`update auth.users set confirmed_at=null where id=${q(peer)}`,'DESIGNATED_ACCOUNT_NOT_USABLE'],
  ['peer_deleted',`update auth.users set deleted_at=now() where id=${q(peer)}`,'DESIGNATED_ACCOUNT_NOT_USABLE'],
  ['peer_anonymous',`update auth.users set is_anonymous=true where id=${q(peer)}`,'DESIGNATED_ACCOUNT_NOT_USABLE'],
  ['explicit_target_denial',`insert into ros_ko_private.ko_scene_authorizations(actor_id,document_id,scene_id,can_read,can_migrate,can_rewrite,can_restore)values(${q(owner)},${q(doc)},${q(sceneId)},false,false,false,false)`,'EXISTING_TARGET_CAPABILITY_CONFLICT'],
  ['peer_excessive_privilege',`insert into ros_ko_private.ko_scene_authorizations(actor_id,document_id,scene_id,can_read,can_migrate,can_rewrite,can_restore)values(${q(peer)},${q(doc)},${q(sceneId)},true,true,true,true)`,'EXISTING_TARGET_CAPABILITY_CONFLICT'],
  ['en_primary_changed',`update public.revision_snapshots set is_primary_working=false where id=${q(snapshot)}`,'EN_PRIMARY_SNAPSHOT_CHANGED'],
  ['en_mapping_excluded',`update public.revision_content_map set is_included=false where unit_id=${q(rows[0].unit)}`,'EN_CURRENT_MAPPING_COUNT_CHANGED'],
  ['en_ancestry_changed',`update public.content_units set title='changed' where id=${q(enParent)}`,'EN_ANCESTRY_CHANGED'],
  ['partial_ko_unit',`insert into public.content_units(project_id,unit_type,source_key,source_path)values(${q(project)},'paragraph','KO/A3/CH01/SC01/B0001','A3/CH01/SC01/partial')`,'PARTIAL_TARGET_UNITS_REQUIRE_REVIEW'],
  ['unfinished_different_request',`insert into ros_ko_private.ko_mutation_requests(owner_id,request_id,operation,input_spec_id,request_input_sha256,request_input_text,request_input_hex)values(${q(owner)},${q(stable('other-running'))},'migrate','LOCAL-TEST',public.ros_ko_sha256_text(public.ros_ko_lpf_v2(${q(doc)},${q(sceneId)})),public.ros_ko_lpf_v2(${q(doc)},${q(sceneId)}),encode(convert_to(public.ros_ko_lpf_v2(${q(doc)},${q(sceneId)}),'UTF8'),'hex'))`,'UNFINISHED_TARGET_REQUEST_REQUIRES_REVIEW'],
  ['unfinished_other_owner_same_request',`insert into ros_ko_private.ko_mutation_requests(owner_id,request_id,operation,input_spec_id,request_input_sha256,request_input_text,request_input_hex)values(${q(peer)},${q(request)},'migrate','LOCAL-TEST',public.ros_ko_sha256_text(public.ros_ko_lpf_v2(${q(doc)},${q(sceneId)})),public.ros_ko_lpf_v2(${q(doc)},${q(sceneId)}),encode(convert_to(public.ros_ko_lpf_v2(${q(doc)},${q(sceneId)}),'UTF8'),'hex'))`,'UNFINISHED_TARGET_REQUEST_REQUIRES_REVIEW'],
  ['missing_root_registry',`delete from public.ko_protected_documents where document_id=${q(root)}`,'SHARED_KO_PROTECTION_SCOPE_MISMATCH'],
])rejected(label,`${statement};perform ${invoke()}`,error);
const reusedCaps=data(`begin;insert into ros_ko_private.ko_scene_authorizations(actor_id,document_id,scene_id,can_read,can_migrate,can_rewrite,can_restore)values(${q(owner)},${q(doc)},${q(sceneId)},true,true,true,true),(${q(peer)},${q(doc)},${q(sceneId)},true,false,true,false);select ${invoke()};set constraints all immediate;rollback;`)[0];
assert.deepEqual(reusedCaps.delegated_audit.capabilities_added_for,[]);assert.deepEqual(fullState(),baseline);pass('identical_existing_target_capabilities_reused_not_overwritten');
for(const [label,table,event]of [['archive','ros_ko_private.ko_scene_legacy_archives','before insert'],['blocks','public.ko_scene_composition_blocks','after insert'],['projection','public.ko_scene_reader_projections','before insert']]){
  pg(`create function public.local_test_failure() returns trigger language plpgsql as $$ begin raise exception 'LOCAL_INJECTED_FAILURE'; end $$;create trigger local_failure ${event} on ${table} for each row execute function public.local_test_failure();`);
  rejected(`atomic_${label}_failure`, `perform ${invoke()}`, 'LOCAL_INJECTED_FAILURE');
  pg(`drop trigger local_failure on ${table};drop function public.local_test_failure();`);
}
pg(`create function public.local_deferred_failure() returns trigger language plpgsql as $$ begin raise exception 'LOCAL_DEFERRED_FAILURE'; end $$;create constraint trigger local_deferred_failure after insert on public.ko_scene_state_events deferrable initially deferred for each row execute function public.local_deferred_failure();`);
rejected('ALL_IMMEDIATE_evaluates_deferred_failure_and_restores_all_rows',`perform ${invoke()};set constraints all immediate`,'LOCAL_DEFERRED_FAILURE');
pg('drop trigger local_deferred_failure on public.ko_scene_state_events;drop function public.local_deferred_failure();');
pg(`create function public.local_completion_failure() returns trigger language plpgsql as $$ begin if new.status='completed' then raise exception 'LOCAL_COMPLETION_FAILURE';end if;return new;end $$;create trigger local_completion_failure before update on ros_ko_private.ko_mutation_requests for each row execute function public.local_completion_failure();`);
rejected('atomic_final_request_completion_failure',`perform ${invoke()}`,'LOCAL_COMPLETION_FAILURE');
pg('drop trigger local_completion_failure on ros_ko_private.ko_mutation_requests;drop function public.local_completion_failure();');
// Two real independent connections: A holds its completed initialization uncommitted;
// B starts from the same sealed preimage with a distinct request and must not duplicate it.
const concurrentA=pgAsync(`set application_name='a3-ch01-sc01-concurrent-A';begin;select ${invoke()};set constraints all immediate;select pg_sleep(1);commit;`);
const committed=await concurrentA.firstJson;
const concurrentB=pgAsync(`set application_name='a3-ch01-sc01-concurrent-B';begin;select ${invoke(payload,expectedDoc,stable('concurrent-other-request'))};set constraints all immediate;commit;`);
let observedLockWait=false;
for(let attempt=0;attempt<20;attempt++) { if(scalar("select exists(select 1 from pg_stat_activity where application_name='a3-ch01-sc01-concurrent-B' and wait_event_type='Lock');")==='t'){observedLockWait=true;break;}await new Promise(resolve=>setTimeout(resolve,20)); }
const [raceA,raceB]=await Promise.all([concurrentA.done,concurrentB.done]);
assert.equal(raceA.code,0,raceA.stderr);assert.notEqual(raceB.code,0);assert.match(raceB.stderr,/STALE_DOCUMENT_PREIMAGE/);assert.equal(observedLockWait,true);
assert.equal(scalar(`select count(*) from ros_ko_private.ko_mutation_requests where request_id=${q(stable('concurrent-other-request'))}`),'0');
assert.equal(scalar(`select count(*) from public.ko_managed_scenes where document_id=${q(doc)} and scene_id=${q(sceneId)}`),'1');
pass('concurrent_distinct_requests_one_commit_other_stale_no_partial_or_duplicate',{actual_second_connection_lock_wait_observed:observedLockWait});
assert.equal(committed.block_count,306); assert.equal(committed.body_sha256,sha(body));
const after = data(`select jsonb_build_object('scene',(select data#>'{chapters,0,scenes,0}' from public.novel_documents where id=${q(doc)}),'chapter_title',(select data#>>'{chapters,0,title}' from public.novel_documents where id=${q(doc)}),'archive',(select to_jsonb(a) from ros_ko_private.ko_scene_legacy_archives a where id=${q(committed.legacy_archive_id)}),'request',(select to_jsonb(r) from ros_ko_private.ko_mutation_requests r where request_id=${q(request)}),'selection',(select to_jsonb(s) from public.ko_scene_display_selections s where id=${q(committed.selection_id)}),'event',(select to_jsonb(e) from public.ko_scene_state_events e where request_id=${q(request)}),'caps',(select jsonb_agg(to_jsonb(a) order by actor_id) from ros_ko_private.ko_scene_authorizations a where document_id=${q(doc)} and scene_id=${q(sceneId)}),'mapping',(select jsonb_agg(jsonb_build_object('position',b.position,'unit_id',b.block_unit_id,'version_id',b.block_version_id,'body',v.body_markdown,'separator',b.separator_after,'en_unit',a.en_block_unit_id,'en_version',a.en_block_version_id) order by b.position) from public.ko_scene_composition_blocks b join public.paragraph_versions v on v.id=b.block_version_id join public.ko_en_block_alignments a on a.ko_block_unit_id=b.block_unit_id where b.composition_id=${q(committed.composition_id)}));`)[0];
assert.equal(after.scene.paragraphs.length,306); assert.equal(after.scene.title,sceneTitle);assert.equal(after.chapter_title,chapterTitle);
assert.equal(after.scene.paragraphs.map(p=>p.versions.review.content+p.separatorAfter).join(''),body);
assert.equal(after.mapping.length,306);assert.equal(new Set(after.mapping.map(r=>r.unit_id)).size,306);assert.equal(new Set(after.mapping.map(r=>r.version_id)).size,306);
for(const [i,r]of after.mapping.entries()){assert.equal(r.position,i+1);assert.equal(r.body,rows[i].ko);assert.equal(r.separator,rows[i].separator);assert.equal(r.en_unit,rows[i].unit);assert.equal(r.en_version,rows[i].version);}
assert.equal(after.selection.final_composition_id,null);assert.equal(after.selection.review_composition_id,committed.composition_id);
assert.deepEqual(after.archive.source_scene_json,scene);assert.equal(after.archive.legacy_paragraph_json,null);
for(const prefix of['source_row','source_scene','legacy_paragraph']){assert.equal(sha(after.archive[prefix+'_text']),after.archive[prefix+'_sha256']);assert.equal(Buffer.byteLength(after.archive[prefix+'_text']),after.archive[prefix+'_bytes']);assert.equal(Buffer.from(after.archive[prefix+'_text']).toString('hex'),after.archive[prefix+'_hex']);assert.deepEqual(JSON.parse(after.archive[prefix+'_text']),after.archive[prefix+'_json']);}
assert.deepEqual(after.mapping.filter(r=>r.body.includes('\n')).map(r=>r.position),[]);
assert.equal(body.split('\n').length-1,610);
pass('committed_local_306_exact_KO_EN_zero_formula_LF_order_version_projection_and_empty_legacy_vectors');
const ar=after.request;assert.equal(ar.owner_id,owner);assert.equal(ar.status,'completed');assert.equal(sha(ar.request_input_text),ar.request_input_sha256);assert.equal(Buffer.from(ar.request_input_text).toString('hex'),ar.request_input_hex);assert.equal(sha(ar.result_manifest_text),ar.result_manifest_sha256);assert.equal(Buffer.from(ar.result_manifest_text).toString('hex'),ar.result_manifest_hex);
assert.deepEqual(ar.result,committed);const ad=ar.result.delegated_audit;assert.equal(ad.session_user,'postgres');assert.equal(ad.current_user,'postgres');assert.equal(ad.authenticated_actor_id,null);assert.equal(ad.delegated_audit_principal,owner);assert.equal(ad.mode,'delegated_admin_not_login');assert.equal(ad.original_instruction_sha256,audit.original_instruction_sha256);assert.deepEqual(after.event.detail.delegated_audit,ad);assert.equal(after.event.actor_id,owner);assert.ok(ar.completed_at);assert.ok(ad.started_at);
for(const a of after.caps){assert.equal(a.can_read,true);assert.equal(a.can_rewrite,true);assert.equal(a.can_migrate,a.actor_id===owner);assert.equal(a.can_restore,a.actor_id===owner);}assert.equal(after.caps.length,2);
assert.equal(scalar('select auth.uid() is null;'),'t');
pass('request_and_event_record_actual_postgres_NULL_auth_delegated_owner_direct_instruction_and_exact_caps');
const afterDocs=data('select jsonb_agg(to_jsonb(d) order by id) from public.novel_documents d;')[0];
for(const d of beforeDocuments){if(d.id!==doc)assert.deepEqual(afterDocs.find(a=>a.id===d.id),d);}
const exactExpectedDoc=structuredClone(fixtureDoc);exactExpectedDoc.chapters[0].scenes[0]=after.scene;assert.deepEqual(afterDocs.find(a=>a.id===doc).data,exactExpectedDoc);
const preserved=fullState();for(const t of ['public.revision_projects','public.revision_snapshots','public.revision_content_map','auth.users'])assert.deepEqual(preserved[t],baseline[t]);
assert.equal(preserved['public.ko_protected_documents'].count,baseline['public.ko_protected_documents'].count+1);
assert.equal(data(`select jsonb_build_object('root_managed',managed_scene_id) from public.ko_protected_documents where document_id=${q(root)};`)[0].root_managed,originManaged);
assert.equal(data(`select jsonb_build_object('act_managed',managed_scene_id) from public.ko_protected_documents where document_id=${q(doc)};`)[0].act_managed,committed.managed_scene_id);
pass('root_protection_reused_new_Act6_protection_targeted_other_documents_titles_accounts_unchanged');
const replay = data(`begin;select ${invoke()};rollback;`)[0];assert.equal(replay.replayed,true);assert.deepEqual(fullState(),preserved);
pg(`begin;do $replay_changed$ begin begin perform ${invoke({...payload,extra:'changed input'})};raise exception 'EXPECTED_ERROR_NOT_RAISED';exception when others then if position('IDEMPOTENCY_KEY_REUSE' in sqlerrm)=0 then raise;end if;end;end $replay_changed$;rollback;`);assert.deepEqual(fullState(),preserved);
pass('same_request_replay_no_mutation_changed_payload_rejected');


let currentComposition=committed.composition_id;
const titleResults=[];
for(const [scope,generation,oldTitle,newTitle] of [
  ['act',1,'ACT 3: WHEN THE SKY LOSES ITS RULES','제3막: 하늘이 법칙을 잃을 때'],
  ['chapter',2,'Chapter 1: The Soaring Sea','제1장: 솟구치는 바다'],
  ['scene',3,'[Scene 1: The Acoustic Void]','[장면 1: 음향 공백]'],
]){
  const titleBefore=fullState();
  const titlePayload={delegated_audit:audit,scope,old_title:oldTitle,new_title:newTitle,
    expected_managed_scene_id:committed.managed_scene_id,expected_composition_id:currentComposition,
    generation,expected_root_data_sha256:docHash(root),
    expected_en_root_data_sha256:docHash(enRoot),expected_en_document_sha256:docHash(enDoc)};
  const titleReq=stable(`${scope}-title-request`);
  const titleCall=`ros_ko_private.rename_a3_ch01_sc01_title_delegated(${q(titleReq)}::uuid,${q(docHash(doc))},${j(titlePayload)})`;
  const rollbackResult=data(`begin;select ${titleCall};set constraints all immediate;rollback;`)[0];
  assert.equal(rollbackResult.scope,`${scope}_title_only`);
  assert.deepEqual(fullState(),titleBefore);
  pass(`${scope}_title_rollback_restores_all_rows`);
  const titleResult=data(`begin;select ${titleCall};set constraints all immediate;commit;`)[0];
  assert.equal(titleResult.scope,`${scope}_title_only`);
  assert.equal(titleResult.new_body_versions,0);
  assert.equal(titleResult.generation,generation+1);
  titleResults.push(titleResult);
  currentComposition=titleResult.composition_id;
  pass(`${scope}_title_commit_reuses_306_versions_advances_review_generation${generation+1}`);
}
const titleAfter=data(`select jsonb_build_object('act_title',d.data->>'title','chapter_title',d.data#>>'{chapters,0,title}','title',d.data#>>'{chapters,0,scenes,0,title}','reader_count',jsonb_array_length(d.data#>'{chapters,0,scenes,0,paragraphs}'),'managed',(select to_jsonb(m) from public.ko_managed_scenes m where m.id=${q(committed.managed_scene_id)}),'selection',(select to_jsonb(s) from public.ko_scene_display_selections s where s.managed_scene_id=${q(committed.managed_scene_id)}),'compositions',(select jsonb_agg(to_jsonb(c) order by revision_no) from public.ko_scene_composition_revisions c where c.managed_scene_id=${q(committed.managed_scene_id)}),'versions',(select count(*) from public.paragraph_versions v join public.ko_scene_composition_blocks b on b.block_version_id=v.id join public.ko_scene_composition_revisions c on c.id=b.composition_id where c.managed_scene_id=${q(committed.managed_scene_id)}),'distinct_versions',(select count(distinct b.block_version_id) from public.ko_scene_composition_blocks b join public.ko_scene_composition_revisions c on c.id=b.composition_id where c.managed_scene_id=${q(committed.managed_scene_id)}),'body_sha',(select public.ros_ko_sha256_text(string_agg(v.body_markdown||b.separator_after,'' order by b.position)) from public.ko_scene_composition_blocks b join public.paragraph_versions v on v.id=b.block_version_id where b.composition_id=(select review_composition_id from public.ko_scene_display_selections where managed_scene_id=${q(committed.managed_scene_id)}))) from public.novel_documents d where d.id=${q(doc)};`)[0];
assert.equal(titleAfter.act_title,'제3막: 하늘이 법칙을 잃을 때');assert.equal(titleAfter.chapter_title,'제1장: 솟구치는 바다');assert.equal(titleAfter.title,'[장면 1: 음향 공백]');assert.equal(titleAfter.reader_count,306);assert.equal(titleAfter.managed.generation,4);assert.equal(titleAfter.selection.generation,4);assert.equal(titleAfter.selection.final_composition_id,null);assert.equal(titleAfter.compositions.length,4);assert.deepEqual(titleAfter.compositions.map(c=>c.title_snapshot),['[Scene 1: The Acoustic Void]','[Scene 1: The Acoustic Void]','[Scene 1: The Acoustic Void]','[장면 1: 음향 공백]']);assert.equal(titleAfter.versions,1224);assert.equal(titleAfter.distinct_versions,306);assert.equal(titleAfter.body_sha,'ad0585a3c3b0eebb67c36d97cfa740a40b0767b9d8e02f5a4b6259fc9c204eb0');pass('ordered_three_titles_final_generation4_reuses_306_versions');

assert.deepEqual(data(contractsSQL)[0],oldContracts);
pass('all_preexisting_function_definitions_ACL_and_triggers_still_identical');
const report={status:'PASS',scope:'LOCAL_ISOLATED_PG_ONLY_NOT_PRODUCTION_NOT_BROWSER',database:db,native_bin:bin,native_socket:socket,network:'TASK_SCOPED_LOCAL_CONTAINER',auth_fixture:'fixed NULL; minimal synthetic account-state rows, no copied secrets and no JWT/session claims',manuscript_fixture:'Immutable supplied ZIP EN/KO306; empty legacy/IDs are synthetic, no production DB manuscript dump',run_id:runId,started_at:startedAt,migration_application_mode:'ONE_TARGET_MIGRATION_LOCAL_ONLY',migration_stages:migrationStages,candidate_sha256:{migration:sha(candidate)},runner_sha256:sha(read('scripts/tests/a3-ch01-sc01-delegated-migration-local.mjs')),checks_count:checks.length,checks,production_operations:0,local_initialization_commits:1,local_initialization_rollback_success:8,reused_current_definition_fixture_count:reusedDefinitionFixtureCount,completed_at:new Date().toISOString()};
const reportPath=process.env.ROS_KO_LOCAL_REPORT_PATH||`${base}/local-isolated-pg-regression.json`;
assert.equal(fs.existsSync(reportPath),false,`refusing to overwrite existing report: ${reportPath}`);
fs.writeFileSync(reportPath,`${JSON.stringify(report,null,2)}\n`,{mode:0o600});
console.log(JSON.stringify(report,null,2));
