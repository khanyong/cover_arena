import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { buildBilingualPlan } from '../../lib/novel-revision/bilingual-plan.mjs';
// Generates private SQL only; never commits manuscript fixtures or credentials.
const [manifestFile,proposalFile,actor,outputPrefix] = process.argv.slice(2);
if(!outputPrefix) throw Error('manifest proposal local-auth-user-id output-prefix required');
const m=JSON.parse(readFileSync(manifestFile)), proposal=JSON.parse(readFileSync(proposalFile));
const q=x=>x===null?'null':"'"+String(typeof x==='object'?JSON.stringify(x):x).replaceAll("'","''")+"'";
const sql=[];const insert=(table,row)=>sql.push(`insert into ${table}(${Object.keys(row).join(',')}) values(${Object.values(row).map(q).join(',')});`);
const en=m.en_snapshot.project_id, ko=m.managed_scene.logical_project_id;
m.managed_scene.owner_id=actor; m.selection.updated_by=actor;m.composition.created_by=actor;
for(const [id,project] of [['quantum-vibration-novel-en-act-2',en],['quantum-vibration-novel-act-2',ko]]) {
 insert('public.novel_documents',{id,slug:id,title:'PRIVATE TEST',data:{number:2,chapters:[{id:'untouched-chapter',number:1,scenes:[]},{id:'test-chapter',number:2,scenes:[{id:m.managed_scene.scene_id,...(project===ko?{storageModel:'ros-ko-block-v1',managedSceneId:m.managed_scene.id}:{}),paragraphs:m.ordered_alignment.map(r=>{const x=r[project===en?'en':'ko'];return {id:x.unit_id,unitId:x.unit_id,revisionVersionId:x.version_id,activeVersion:'review',versions:{review:{version:'review',content:x.body}}};})}]}],otherScene:'preserve me'}});
 insert('public.revision_projects',{id:project,slug:project,title:'PRIVATE TEST',source_document_id:id,owner_id:actor});
}
for(const slug of ['quantum-vibration-novel','quantum-vibration-novel-en']) insert('public.novel_documents',{id:slug,slug,title:'PRIVATE TEST',data:{id:slug,slug,title:'Private acceptance fixture',author:'Private test',logline:'',synopsis:'',characters:[],scenes:[],locations:[],versionHistory:['review'],updatedAt:'2026-10-25',acts:[{number:2}]}});
for(const lang of ['en','ko']) {
 const parent=randomUUID();
 insert('public.content_units',{id:parent,project_id:lang==='en'?en:ko,unit_type:'scene',source_key:`test/${lang}/scene`,source_path:`test/${lang}/scene`});
 for(const r of m.ordered_alignment) {
 const x=r[lang];insert('public.content_units',{id:x.unit_id,project_id:lang==='en'?en:ko,unit_type:'paragraph',source_key:lang==='ko'?`KO/${m.managed_scene.source_key}/B${String(r.position).padStart(4,'0')}`:`test/${lang}/${r.position}`,source_path:`test/${lang}/${r.position}`,original_parent_id:parent,original_position:r.position});
 insert('public.paragraph_versions',{id:x.version_id,paragraph_unit_id:x.unit_id,body_markdown:x.body,body_hash:x.sha256,created_by:actor});
 }
}
insert('public.revision_snapshots',{id:m.en_snapshot.id,project_id:en,code:'private-test-baseline',name:'private test',is_primary_working:true});
for(const r of m.ordered_alignment) insert('public.revision_content_map',{snapshot_id:m.en_snapshot.id,unit_id:r.en.unit_id,position:r.position,paragraph_version_id:r.en.version_id,is_included:true});
const ms={...m.managed_scene};delete ms.scene_path;
sql.push(`insert into public.ko_managed_scenes select * from jsonb_populate_record(null::public.ko_managed_scenes,${q(m.managed_scene)}::jsonb);`);
insert('ros_ko_private.ko_scene_authorizations',{actor_id:actor,document_id:m.managed_scene.document_id,scene_id:m.managed_scene.scene_id,can_read:true,can_rewrite:true,can_restore:true});
const comp={...m.composition,parent_revision_id:null,status:'assembling',manifest_sha256:'0'.repeat(64)};
sql.push(`insert into public.ko_scene_composition_revisions select * from jsonb_populate_record(null::public.ko_scene_composition_revisions,${q(comp)}::jsonb);`);
for(const r of m.ordered_alignment) {
 insert('public.ko_scene_composition_blocks',{composition_id:comp.id,position:r.position,block_unit_id:r.ko.unit_id,block_version_id:r.ko.version_id,source_key:`KO/${m.managed_scene.source_key}/B${String(r.position).padStart(4,'0')}`,separator_after:r.ko.separator_after});
 insert('public.ko_en_block_alignments',{id:r.alignment_id,ko_block_unit_id:r.ko.unit_id,managed_scene_id:m.managed_scene.id,en_block_unit_id:r.en.unit_id,en_block_version_id:r.en.version_id,evidence_manifest_sha256:'0'.repeat(64)});
}
sql.push(`update public.ko_scene_composition_revisions set manifest_sha256=public.ros_ko_sha256_text(public.ros_ko_composition_manifest_text(id)),status='sealed';`);
insert('public.ko_scene_display_selections',{...m.selection,legacy_archive_id:null});
// Head hashes below are PostgreSQL JSONB hashes. Update the captured baseline
// fixture using the same canonical representation, never production documents.
sql.push(`select jsonb_build_object('documents',(select jsonb_agg(jsonb_build_object('id',id,'document_sha256',public.ros_ko_sha256_text(data::text))) from public.novel_documents where id in ('quantum-vibration-novel-en-act-2','quantum-vibration-novel-act-2')),'composition',(select to_jsonb(c) from public.ko_scene_composition_revisions c where id=${q(comp.id)})) as fixture_state;`);
writeFileSync(outputPrefix+'.sql',sql.join('\n')+'\n');
writeFileSync(outputPrefix+'.manifest.json',JSON.stringify(m));
