// Include exact existing private endnotes 1-4 for the scene's real link targets.
// Never invent missing commentary or put its prose in public source control.
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import equationCommentaryIndex from '../../shared/lib/equationCommentaryIndex.js';
const db=process.env.ROS_EXEC02_DB;
if(!/^ros_exec02_run[6-9]$/.test(db))throw Error('Isolated fixture required');
const d='/usr/local/bin/docker';
if(execFileSync(d,['inspect','ros-exec02-db','--format','{{index .Config.Labels "ros.scope"}}'],{encoding:'utf8'}).trim()!=='exec02-nonproduction')throw Error('Wrong container');
const q=x=>"'"+JSON.stringify(x).replaceAll("'","''")+"'::jsonb";
let sql='BEGIN;';
for(const lang of ['en','ko']){
 const snapshot=JSON.parse(readFileSync(process.env['ROS_'+lang.toUpperCase()+'_COMMENTARY_SNAPSHOT']));
 const all=snapshot.acts.flatMap(a=>a.chapters.flatMap(c=>c.scenes.flatMap(s=>s.paragraphs)));
 const paragraphs=[];
 for(let n=1;n<=4;n++){
  const eq=equationCommentaryIndex.equations.find(e=>e.number===n);
  const matches=all.filter(p=>p.text.includes(`## ${n}. ${eq.titles[lang]}\n`));
  if(matches.length!==1)throw Error('Exact endnote mapping required: '+lang+'/'+n);
  const p=matches[0];paragraphs.push({id:p.id,activeVersion:'review',versions:{review:{content:p.text}}});
 }
 const slug='quantum-vibration-novel'+(lang==='en'?'-en':'');
 const data={number:9,title:'Private fixture: existing notes 1–4',chapters:[{number:1,title:'Equation commentary',scenes:[{id:'fixture-notes-'+lang,paragraphs}]}]};
 sql+=`insert into public.novel_documents(id,slug,title,data) values('${slug}-act-9','${slug}-act-9','PRIVATE TEST',${q(data)});`;
 sql+=`update public.novel_documents set data=jsonb_set(data,'{acts}',data->'acts'||'[{"number":9}]'::jsonb) where id='${slug}';`;
}
sql+='COMMIT;';
execFileSync(d,['exec','-i','ros-exec02-db','psql','-U','supabase_admin','-d',db,'-v','ON_ERROR_STOP=1'],{input:sql,stdio:['pipe','pipe','pipe']});
console.log('Exact private endnotes 1-4 included for both fixture books');
