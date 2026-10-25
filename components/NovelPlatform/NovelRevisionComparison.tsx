import React, {useEffect,useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {supabase} from '../../shared/lib/supabase';
import {revisionComparisonRows} from '../../shared/lib/novelRevisionComparison.mjs';
import {remarkEquationCommentary,normalizeDisplayMath} from '../../shared/lib/equationCommentary';

export function NovelRevisionComparison({managedSceneId}:{managedSceneId:string}) {
 const [localDraft,setLocalDraft]=useState(false);
 const [history,setHistory]=useState<any[]>([]),[selected,setSelected]=useState('');
 const [language,setLanguage]=useState('en'),[changesOnly,setChangesOnly]=useState(true);
 const [error,setError]=useState(''),[loading,setLoading]=useState(true);
 useEffect(()=>{
  const draft=process.env.NODE_ENV==='development' && ['localhost','127.0.0.1','[::1]'].includes(window.location.hostname) && managedSceneId==='21a8aa06-4311-4dbf-80dd-fe7f5dc48eff';
  setLocalDraft(draft);
  if(draft){setLoading(false);return;}
  let active=true;setLoading(true);setHistory([]);setSelected('');setError('');
  Promise.resolve(supabase.rpc('ros_bilingual_revision_history',{p_managed_scene_id:managedSceneId})).then(({data,error})=>{
   if(!active)return;
   if(error)setError('이력 조회가 불가능합니다. 로그인·접근권한 및 비교 기능 적용 상태를 확인해 주세요.');
   else {setHistory(data||[]);setSelected(data?.[0]?.id||'');}setLoading(false);
  }).catch(()=>{if(active){setError('이력을 불러오지 못했습니다.');setLoading(false);}});
  return()=>{active=false;};
 },[managedSceneId]);
 if(localDraft)return <section aria-label="수정 전후 비교" className="my-4 rounded-xl border border-sky-700 p-4">
  <h5 className="font-bold">로컬 실행 r01 · 수정 전후 검토</h5>
  <p className="my-2 text-sm">게시 전 검토용 초안입니다. 왼쪽은 매핑 기준 원문, 오른쪽은 r01 수정안입니다.</p>
  <a className="text-sky-400 underline" href="/novel-local-review" target="_blank" rel="noreferrer">큰 화면에서 비교하기 ↗</a>
  <iframe title="로컬 실행 r01 수정 전후 비교" src="/novel-local-review" style={{width:'100%',height:'80vh',border:0,marginTop:12}} />
 </section>;
 const publication=history.find(p=>p.id===selected);
 let rows:any[]=[];let mappingError=false;
 try{if(publication)rows=revisionComparisonRows(publication,language);}catch{mappingError=true;}
 return <section style={{scrollMarginTop:420}} aria-label="수정 전후 비교" className="my-4 rounded-xl border border-sky-700 bg-zinc-950 p-4 text-zinc-200">
  <h5 className="font-bold">수정 전 · 수정 후 비교</h5>
  <p className="text-xs text-zinc-400 my-2">조회만 수행합니다. 과거판을 선택해도 현재 게시 문안은 바뀌지 않습니다.</p>
  {loading?<p role="status">이력을 불러오는 중…</p>:error?<p role="alert">{error}</p>:!history.length?<p>아직 비교할 공동 게시 이력이 없습니다.</p>:<>
   <div className="flex flex-wrap gap-3 my-3">
    <label>비교 판본 <select aria-label="비교 판본" value={selected} onChange={e=>setSelected(e.target.value)} className="bg-zinc-800 p-2 rounded">{history.map(p=><option key={p.id} value={p.id}>r{p.revision} · {new Date(p.created_at).toLocaleString()} · {p.current?'현재 게시판':'과거 게시 이력'}</option>)}</select></label>
    <label>언어 <select aria-label="비교 언어" value={language} onChange={e=>setLanguage(e.target.value)} className="bg-zinc-800 p-2 rounded"><option value="en">English</option><option value="ko">한국어</option></select></label>
    <label className="self-center"><input type="checkbox" checked={changesOnly} onChange={e=>setChangesOnly(e.target.checked)}/> 변경된 부분만</label>
   </div>
   {mappingError?<p role="alert">이전·이후 문단의 대응을 검증할 수 없어 비교를 표시하지 않습니다.</p>:<div className="overflow-x-auto">
    <div className="min-w-[640px]">
     <div className="grid grid-cols-2 gap-4 font-bold py-3"><div>수정 전</div><div>수정 후{publication.current?' · 현재 게시판':' · 선택한 과거 게시판'}</div></div>
     {rows.filter(r=>!changesOnly||r.changed).map(row=><article key={row.key} data-revision-row={row.key} className="border-t border-zinc-700 py-4">
      <div className="text-xs text-sky-300 mb-2">{row.changed?`${row.key} · ${row.before.length} → ${row.after.length}문단`:'변경 없음'}</div>
      <div className="grid grid-cols-2 gap-4 items-start">{['before','after'].map(side=><div key={side} data-revision-side={side} className="min-w-0 space-y-4 leading-relaxed break-words">{row[side].map((body:string,i:number)=><div key={i}><ReactMarkdown remarkPlugins={[remarkMath,remarkEquationCommentary]} rehypePlugins={[rehypeKatex]}>{normalizeDisplayMath(body)}</ReactMarkdown></div>)}</div>)}</div>
     </article>)}
    </div>
   </div>}
  </>}
 </section>;
}
