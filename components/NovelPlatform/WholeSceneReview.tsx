import React,{useEffect,useState} from 'react';
import {supabase} from '../../shared/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
const scenes={'605986cc':'A0-C02-S02','dd5e34a3':'A0-C03-S01','6e1f0f9c':'A0-C03-S02','ce917762':'A0-C04-S01','03a2c338':'A0-C04-S02'};
export default function WholeSceneReview({sceneId}:{sceneId:string}){
 const scene=scenes[sceneId];
 const [open,setOpen]=useState(false),[state,setState]=useState<any>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const [setId,setSetId]=useState(''),[mode,setMode]=useState('ko'),[note,setNote]=useState(''),[read,setRead]=useState(false);
 async function request(body?:any){
  const {data}=await supabase.auth.getSession();
  if(!data.session)throw Error('로그인이 필요합니다.');
  const r=await fetch(`/api/novel-whole-scene?scene=${scene}`,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${data.session.access_token}`,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const value=await r.json();if(!r.ok)throw Error(value.error);return value;
 }
 useEffect(()=>{if(!open||!scene)return;let active=true;setError('');setState(null);
  request().then(s=>{if(active){setState(s);setSetId(s.sets.at(-1)?.id||'');}}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};
 },[open,scene]);
 if(!scene||process.env.NODE_ENV!=='development')return null;
 const pair=state?.sets.find(s=>s.id===setId);
 const languages=mode==='both'?['ko','en']:[mode];
 async function decide(language,decision){setBusy(true);setError('');try{
  const v=state.versions.find(v=>v.id===pair[language]);
  const next=await request({action:'decide',revision:state.revision,setId,language,decision,sha256:v.sha256,note});setState(next);setRead(false);
 }catch(e){setError(e.message);}finally{setBusy(false);}}
 return <section className="my-4 rounded border border-sky-800 p-4">
  <button type="button" aria-expanded={open} className="text-sky-300 underline" onClick={()=>setOpen(!open)}>{open?'장례 개정판 닫기 · 현행판은 아래에 표시':'장례 개정판 · 장면 전체 검토'}</button>
  {open&&<div className="mt-4 space-y-4">
   {error&&<p role="alert">불러오기 또는 저장 실패: {error}</p>}
   {!state&&!error&&<p role="status">불러오는 중…</p>}
   {state&&!pair&&<p>새 영한 전문 수령 전입니다. 등록·채택·게시된 장례 개정판이 없습니다.</p>}
   {pair&&<>
    <p>장례 개정 검토판 · 공개 게시와 별도 · 현행판은 아래에 유지됩니다.</p>
    <label>문안 세트 <select className="bg-zinc-900" value={setId} onChange={e=>{setSetId(e.target.value);setRead(false);setNote('');}}>{state.sets.map(s=><option key={s.id} value={s.id}>{s.family} · {s.id.slice(0,8)}</option>)}</select></label>
    <label> 읽기 <select className="bg-zinc-900" value={mode} onChange={e=>{setMode(e.target.value);setRead(false);}}><option value="ko">국문 전문</option><option value="en">영문 전문</option><option value="both">영한 전문 나란히</option></select></label>
    {mode==='both'&&<p>문장별 대응 미정렬 — 두 전문을 독립적으로 표시합니다.</p>}
    <div className={mode==='both'?'grid gap-6 lg:grid-cols-2':'space-y-4'}>{languages.map(language=>{const v=state.versions.find(v=>v.id===pair[language]);const d=[...state.decisions].reverse().find(d=>d.versionId===v.id&&d.language===language);return <article key={language}>
     <p className="text-sm text-sky-300">{language==='ko'?'국문':'영문'} · {d?.decision==='adopt-whole'?'전체 채택 기록 있음':d?.decision==='request-revision'?'추가 수정 요청':d?.decision==='keep-current'?'현행판 유지':'미채택'} · {v.id.slice(0,8)}</p>
     <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{v.text}</ReactMarkdown>
    </article>;})}</div>
    <textarea aria-label="장면 전체 검토 의견" className="w-full bg-zinc-900 p-2" value={note} onChange={e=>setNote(e.target.value)} placeholder="추가 수정 요청 또는 결정 의견"/>
    <label><input type="checkbox" checked={read} onChange={e=>setRead(e.target.checked)}/> 현재 표시한 전문을 읽고 장면 전체로 결정합니다.</label>
    {languages.map(language=><div key={language} className="flex flex-wrap gap-3"><strong>{language==='ko'?'국문':'영문'} 결정</strong>{[['adopt-whole','장면 전체 채택'],['keep-current','현행판 유지'],['request-revision','추가 수정 요청']].map(([action,label])=><button type="button" className="rounded border px-3 py-2 disabled:opacity-40" key={action} disabled={busy||!read} onClick={()=>void decide(language,action)}>{label}</button>)}</div>)}
   </>}
  </div>}
 </section>;
}
