import React,{useEffect,useState} from 'react';
import type {GetServerSideProps} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {supabase} from '../shared/lib/supabase';
import {normalizeDisplayMath,remarkEquationCommentary} from '../shared/lib/equationCommentary';

export const getServerSideProps:GetServerSideProps=async({req,res})=>{
 const {localRequest}=await import('../lib/novel-local-review/store.mjs');
 res.setHeader('Cache-Control','private, no-store');
 return localRequest(req)?{props:{}}:{notFound:true};
};
function Body({texts}:{texts:string[]}){return <>{texts.map((text,i)=><div key={i} data-review-block style={{marginBottom:18}}>{/^\d+\.$/.test(text.trim())?<p>{text}</p>:<ReactMarkdown remarkPlugins={[remarkMath,remarkEquationCommentary]} rehypePlugins={[rehypeKatex]}>{normalizeDisplayMath(text)}</ReactMarkdown>}</div>)}</>;}
export default function LocalReview(){
 const router=useRouter();const [review,setReview]=useState<any>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 const [language,setLanguage]=useState('ko'),[mode,setMode]=useState('compare'),[side,setSide]=useState('after'),[only,setOnly]=useState(false),[highlight,setHighlight]=useState(true),[item,setItem]=useState('R01');
 const [comment,setComment]=useState(''),[feedback,setFeedback]=useState('');
 const id=typeof router.query.id==='string'?router.query.id:'PRO-C02-S02-r01';
 const request=async(method='GET',body?:any)=>{
  const {data}=await supabase.auth.getSession();if(!data.session)throw new Error('로그인이 필요합니다.');
  const response=await fetch(`/api/novel-local-review?id=${encodeURIComponent(id)}`,{method,cache:'no-store',headers:{Authorization:`Bearer ${data.session.access_token}`,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const result=await response.json();if(!response.ok)throw new Error(response.status===401?'로그인이 필요합니다.':response.status===403?'이 검토판의 조회 권한이 없습니다.':`검토판을 불러올 수 없습니다 (${result.error}).`);return result;
 };
 useEffect(()=>{if(!router.isReady)return;setLanguage(router.query.lang==='en'?'en':'ko');setMode(['read','bilingual'].includes(String(router.query.mode))?String(router.query.mode):'compare');setSide(router.query.side==='before'?'before':'after');},[router.isReady]);
 useEffect(()=>{
  if(!router.isReady)return;let active=true;
  const load=async()=>{setLoading(true);setReview(null);setError('');try{const r=await request();if(active)setReview(r);}catch(e){if(active)setError(e.message);}finally{if(active)setLoading(false);}};
  void load();const {data:{subscription}}=supabase.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'){setReview(null);setError('로그인이 필요합니다.');}if(event==='SIGNED_IN')setTimeout(()=>{if(active)void load();},0);});
  return()=>{active=false;subscription.unsubscribe();};
 },[router.isReady,id]);
 const go=(key:string)=>{setItem(key);document.getElementById(key)?.scrollIntoView({block:'start'});};
 const changes=review?.rows.filter(r=>r.changed)||[];
 const bilingualRows=review?.rows.flatMap(row=>row.content.en[side].map((en,i)=>({en,ko:row.content.ko[side][i],change:row.changed?row.id:null,anchor:i===0?row.id:undefined})))||[];
 const move=(delta:number)=>{const i=changes.findIndex(r=>r.id===item);go(changes[Math.max(0,Math.min(changes.length-1,i+delta))].id);};
 const save=async()=>{setFeedback('저장 중…');try{const entry=await request('POST',{item,text:comment});setReview(r=>({...r,comments:[...r.comments,entry]}));setComment('');setFeedback('이 장면·리비전·기준판·수정 항목에 검토 의견을 저장했습니다.');}catch(e){setFeedback(e.message);}};
 const login=`/auth?next=${encodeURIComponent(router.asPath)}`;
 return <main className="local-review"><Head><title>로컬 실행 · 작가 검토</title><meta name="robots" content="noindex,nofollow"/></Head>
  <header><h1>로컬 실행 r01 · 작가 검토</h1><p>PROLOGUE → Chapter 2 → Scene 2 · 검토판 / 작가 미검토 / 운영 기존판 유지</p>
   {review&&<><details><summary>고정 기준판·검토판 정보</summary><p>검토판: {review.manifest.id}</p><p>기준판: {review.manifest.baselineId}</p><p>제안문: {review.manifest.proposalId}</p><p>기준 확인: {review.manifest.baselineCheckedAt}</p></details>
   {review.baselineChanged&&<p role="alert">운영 구성에 후속 변경이 있습니다. 이 화면은 고정된 검토판을 유지합니다.</p>}
   <nav><label>언어 <select aria-label="검토 언어" value={language} onChange={e=>setLanguage(e.target.value)}><option value="ko">한국어</option><option value="en">English</option></select></label>
   <label>읽기 방식 <select aria-label="읽기 방식" value={mode} onChange={e=>setMode(e.target.value)}><option value="compare">수정 전 ↔ 수정 후</option><option value="read">장면 전체 읽기</option><option value="bilingual">영문 ↔ 국문 대응</option></select></label>
   {mode!=='compare'&&<label>판본 <select aria-label="판본" value={side} onChange={e=>setSide(e.target.value)}><option value="before">수정 전 · 고정 기준판</option><option value="after">r01 수정 후 · 작가 검토용·미채택</option></select></label>}
   {mode==='compare'&&<label><input type="checkbox" checked={only} onChange={e=>setOnly(e.target.checked)}/> 변경 구간만</label>}
   <label><input aria-label="변경 강조" type="checkbox" checked={highlight} onChange={e=>setHighlight(e.target.checked)}/> 변경 강조</label>
   </nav><nav><button onClick={()=>move(-1)} disabled={item===changes[0]?.id}>이전 변경</button><select aria-label="수정 구간" value={item} onChange={e=>go(e.target.value)}>{changes.map(c=><option key={c.id} value={c.id}>{c.id} · {c.title}</option>)}</select><button onClick={()=>move(1)} disabled={item===changes.at(-1)?.id}>다음 변경</button></nav>
   <div className={mode==='read'?'':'columns'}><b>{mode==='compare'?'수정 전 · 매핑 기준 원문':mode==='bilingual'?'English':side==='after'?'r01 수정 후 · 작가 검토용·미채택':'수정 전 · 고정 기준판'}</b>{mode!=='read'&&<b>{mode==='compare'?'r01 수정 후 · 작가 검토용·미채택':'한국어'}</b>}</div></>}
  </header>
  {loading&&<p role="status">로그인과 검토판 접근권한을 확인하고 있습니다.</p>}
  {error&&<div role="alert">{error} <a href={login}>로그인</a></div>}
  {review&&<>
   {mode==='compare'?review.rows.filter(r=>!only||r.changed).map(row=><section id={row.id} key={row.id} data-review-row={row.id} className={highlight&&row.changed?'changed':''}>
    {row.changed&&<p className="label">{row.id} · {row.title} · {row.content.en.before.length===row.content.en.after.length?'교체':'병합'} {row.content.en.before.length}→{row.content.en.after.length}</p>}
    <div className="columns">{['before','after'].map(s=><div key={s} data-review-side={s}><Body texts={row.content[language][s]}/></div>)}</div>
   </section>):mode==='read'?<article className="reading">{review.rows.map(row=><section id={row.id} key={row.id} data-review-row={row.id} className={highlight&&row.changed?'changed':''}>{highlight&&row.changed&&<p className="label">{row.id} · {row.title}</p>}<Body texts={row.content[language][side]}/></section>)}</article>:<article>{bilingualRows.map((pair,i)=><section id={pair.anchor} key={i} data-bilingual-row={i+1} className={highlight&&pair.change?'changed':''}><div className="columns"><div><Body texts={[pair.en]}/></div><div><Body texts={[pair.ko]}/></div></div></section>)}</article>}
   <details className="comments"><summary>이 검토판에 의견 남기기 ({review.comments.length})</summary><p>{id} · {item} · 고정 기준판에 연결됩니다. 기존 운영 댓글은 변경하지 않습니다.</p><textarea aria-label="검토 의견" value={comment} onChange={e=>setComment(e.target.value)} maxLength={4000}/><button disabled={!comment.trim()} onClick={save}>검토 의견 저장</button><p role="status">{feedback}</p>{review.comments.map((c,i)=><p key={i}>{c.item} · {c.createdAt} · {c.text}</p>)}</details>
  </>}
  <style jsx>{`.local-review{background:#faf9f6;color:#222;min-height:100vh;padding:24px;max-width:1600;margin:auto}header{position:sticky;top:0;background:#faf9f6;z-index:1;padding-bottom:12px;border-bottom:1px solid #bbb}h1{font-size:24px;font-weight:700}header p,summary{font-size:13px}details p{overflow-wrap:anywhere}nav{display:flex;gap:18px;align-items:center;flex-wrap:wrap;margin:10px 0}button,select{border:1px solid #aaa;border-radius:4px;padding:4px;background:white;color:#222}button:disabled{opacity:.4}.columns{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px}.columns>div{min-width:0}section{scroll-margin-top:300px;padding:16px 8px;border-bottom:1px solid #ddd;line-height:1.9;overflow-wrap:anywhere}.changed{background:#fff2cf;border-left:3px solid #a76b00}.label{font-size:12px;color:#754500;margin-bottom:8px}.reading{max-width:800px;margin:auto}.reading section{border:0;padding:0 8px}.comments{margin:32px 0}.comments textarea{display:block;width:100%;min-height:100px;border:1px solid #aaa;background:white}`}</style>
  <style jsx global>{`.local-review blockquote{border:1px solid #aaa;background:#f0eee8;padding:14px;margin:12px 0}.local-review .katex-display{overflow-x:auto;overflow-y:hidden}.local-review a{color:#075b9c;text-decoration:underline}`}</style>
 </main>;
}
