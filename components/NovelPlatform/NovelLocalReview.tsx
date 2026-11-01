import Body from './ReviewBody';
import React,{useEffect,useState} from 'react';
import Head from 'next/head';
import FinalEditionDownloads from './FinalEditionDownloads';
import ReviewFinalization from './ReviewFinalization';
import ReviewChoice from './ReviewChoice';
import {useRouter} from 'next/router';
import {supabase} from '../../shared/lib/supabase';


export default function NovelLocalReview({embedded=false,reviewId,initialLanguage}:{embedded?:boolean;reviewId?:string;initialLanguage?:'en'|'ko'}){
 const router=useRouter();const [review,setReview]=useState<any>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 const [language,setLanguage]=useState('ko'),[mode,setMode]=useState('compare'),[side,setSide]=useState('after'),[only,setOnly]=useState(true),[highlight,setHighlight]=useState(true),[item,setItem]=useState('R01');
 const [comment,setComment]=useState(''),[feedback,setFeedback]=useState('');
 const id=reviewId||(typeof router.query.id==='string'?router.query.id:'');
 const [dirtyRows,setDirtyRows]=useState<string[]>([]);
 const [finalId,setFinalId]=useState('');
 const [savingChoice,setSavingChoice]=useState(false);
 const [catalog,setCatalog]=useState<any[]>([]);
 const loadedCatalog=catalog.filter(c=>c.loaded!==false);
 const sceneIndex=loadedCatalog.findIndex(c=>c.id===id);
 const adjacent=(delta:number)=>loadedCatalog[sceneIndex+delta];
 const sceneLink=(c:any)=>`/novel-local-review?id=${encodeURIComponent(c.id)}&lang=${language}&mode=${mode}&side=${side}`;
 const revision=review?.manifest.id.split('-').at(-1)||'';
 const decision=review?.manifest.status==='AUTHOR_UNREVIEWED'?'작가 미검토':review?.manifest.status||'';
 const request=async(method='GET',body?:any)=>{
  const {data}=await supabase.auth.getSession();if(!data.session)throw new Error('로그인이 필요합니다.');
  const response=await fetch(`/api/novel-local-review?id=${encodeURIComponent(id)}`,{method,cache:'no-store',headers:{Authorization:`Bearer ${data.session.access_token}`,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const result=await response.json();if(!response.ok)throw new Error(response.status===401?'로그인이 필요합니다.':response.status===403?'이 검토판의 조회 권한이 없습니다.':`검토판을 불러올 수 없습니다 (${result.error}).`);return result;
 };
 useEffect(()=>{if(!router.isReady)return;setLanguage(initialLanguage||(router.query.lang==='en'?'en':'ko'));setMode(['read','bilingual','candidate','correspondence'].includes(String(router.query.mode))?String(router.query.mode):'compare');setSide(router.query.side==='before'?'before':'after');},[router.isReady]);
 useEffect(()=>{
  if(!router.isReady)return;let active=true;let generation=0;
  const load=async()=>{if(!id){setReview(null);setLoading(false);setError('검토판 목록에서 Scene과 리비전을 선택해 주세요.');return;}const current=++generation;setLoading(true);setReview(null);setError('');try{const r=await request();if(active&&current===generation)setReview(r);}catch(e){if(active&&current===generation)setError(e.message);}finally{if(active&&current===generation)setLoading(false);}};
  setFinalId('');setItem('R01');setComment('');setFeedback('');setOnly(true);setHighlight(true);
  void load();const {data:{subscription}}=supabase.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'){generation++;setLoading(false);setReview(null);setCatalog([]);setError('로그인이 필요합니다.');}if(event==='SIGNED_IN')setTimeout(()=>{if(active)void load();},0);});
  return()=>{active=false;subscription.unsubscribe();};
 },[router.isReady,id]);
 useEffect(()=>{let active=true;void supabase.auth.getSession().then(async({data})=>{if(!data.session)return;const r=await fetch('/api/novel-local-review?list=1',{headers:{Authorization:`Bearer ${data.session.access_token}`},cache:'no-store'});if(r.ok){const result=await r.json();if(active)setCatalog(result.readingOrder||result.reviews);}}).catch(()=>{});return()=>{active=false;};},[id,review?.manifest.id,review?.decisions?.revision]);
 const go=(key:string)=>{setItem(key);document.getElementById(`${id}-${key}`)?.scrollIntoView({block:'start'});};
 const changes=review?.rows.filter(r=>r.changed)||[];
 const bilingualRows=review?.rows.flatMap(row=>row.content.en[side].map((en,i)=>({en,ko:row.content.ko[side][i],change:row.changed?row.id:null,anchor:i===0?row.id:undefined})))||[];
 const move=(delta:number)=>{const i=changes.findIndex(r=>r.id===item);go(changes[Math.max(0,Math.min(changes.length-1,i+delta))].id);};
 const save=async()=>{setFeedback('저장 중…');try{const entry=await request('POST',{item,text:comment});setReview(r=>({...r,comments:[...r.comments,entry]}));setComment('');setFeedback('이 장면·리비전·기준판·수정 항목에 검토 의견을 저장했습니다.');}catch(e){setFeedback(e.message);}};
 const candidateTexts=(row:any,lang:string)=>{const choice=review.decisions?.choices[`${lang}:${row.id}`];return choice?.choice==='custom'?choice.texts:row.content[lang][choice?.choice||'after'];};
 const selectChoice=async(row:any,choice:string,texts?:string[])=>{
  setSavingChoice(true);const target=id;
  try{const decisions=await request('POST',{action:'decision',item:row.id,language,choice,texts,revision:review.decisions.revision,basis:review.decisions.basis});setReview(r=>r?.manifest.id===target?{...r,decisions}:r);}catch(e){throw new Error('선택을 저장하지 못했습니다. 다른 창에서 변경했을 수 있습니다. 새로고침 후 다시 확인하세요.');}finally{setSavingChoice(false);}
 };
 const finalAction=async(input:any)=>{const decisions=await request('POST',{...input,revision:review.decisions.revision,basis:review.decisions.basis});setReview(r=>({...r,decisions}));};
 const finalVersion=review?.decisions?.adoptionHistory?.find(v=>v.id===finalId)||review?.decisions?.confirmationHistory?.find(v=>v.id===finalId);
 const login=`/auth?next=${encodeURIComponent(router.asPath)}`;
 const downloadLocal = async () => {
  try {
   const {data}=await supabase.auth.getSession();if(!data.session)throw new Error('로그인이 필요합니다.');
   const response=await fetch(`/api/novel-local-review?export=1&lang=${language}`,{headers:{Authorization:`Bearer ${data.session.access_token}`},cache:'no-store'});
   if(!response.ok)throw new Error('수정본 다운로드 실패');
   const url=URL.createObjectURL(await response.blob());const a=document.createElement('a');a.href=url;a.download=`ROS_로컬수정후판모음_${language}.txt`;a.click();URL.revokeObjectURL(url);
  }catch(e){setError(e instanceof Error?e.message:'다운로드 실패');}
 };
 return <main onClickCapture={e=>{if(dirtyRows.length&&(e.target as HTMLElement).closest('a')&&!window.confirm('저장하지 않은 수정이 있습니다. 버리고 이동할까요?'))e.preventDefault();}} className={`local-review ${embedded?'embedded':''}`}>{!embedded&&<Head><title>{`${review?.manifest.title||'로컬 검토 목록'} · 작가 검토`}</title><meta name="robots" content="noindex,nofollow"/></Head>}
  <header>{catalog.length>0&&<nav aria-label="로컬 검토판 목록" className="scene-list"><ol>{catalog.map(c=><li key={c.id} aria-current={c.id===id?'page':undefined}>{c.loaded===false?<><span>{c.scene} · {c.title} · 로컬 검토판 미적재 (누락)</span>{c.readerPath&&<> · <a href={c.readerPath}>기존 Reader·게시 이력</a></>}</>:<a href={`/novel-local-review?id=${encodeURIComponent(c.id)}&lang=${language}&mode=${mode}&side=${side}`}>{c.scene} · {c.title} · {c.id.split('-').at(-1)} · {c.finalAdoptionId?'영한 최종 채택':c.confirmedLanguages?.length?c.confirmedLanguages.join('/')+' 전문 확정':'이번 회차 미채택'}</a>}</li>)}</ol></nav>}<h1>수정 전 · 수정 후 비교</h1><p>이번 회차 영한 최종 채택 {catalog.filter(c=>c.finalAdoptionId).length}/52 · 과거 채택·게시 이력은 별도입니다.</p><FinalEditionDownloads language={language}/><p>이번 재검토: 국문부터 선택·수정할 수 있습니다. 미선택 구간은 수정 후를 유지합니다. 구간 선택은 영한 장면 전체 최종 채택이나 게시가 아닙니다. 아래 다운로드는 기존 수정 후판이며 저장한 선택·직접 수정은 포함하지 않습니다.</p><button onClick={downloadLocal}>로컬 수정 후판 모음 다운로드 (현재 언어)</button><p>적재된 수정 후판을 모읍니다. 미적재 장면은 본문 없이 누락으로 표시합니다. 전권 조합은 마스터 조합본에서 이용하세요.</p><p>{review?.manifest.scene} · {review?.manifest.title} · {revision} / 과거 검토 상태: {decision} / 운영 기존판 유지</p>
   {review&&<><details><summary>고정 기준판·검토판 정보</summary><p>검토판: {review.manifest.id}</p><p>기준판: {review.manifest.baselineId}</p><p>제안문: {review.manifest.proposalId}</p><p>기준 확인: {review.manifest.baselineCheckedAt}</p></details>
   {review.baselineChanged&&<p role="alert">운영 구성에 후속 변경이 있습니다. 이 화면은 고정된 검토판을 유지합니다.</p>}
   <nav><label>언어 <select aria-label="검토 언어" value={language} onChange={e=>{if(!dirtyRows.length||window.confirm('저장하지 않은 수정을 버리고 언어를 바꿀까요?'))setLanguage(e.target.value);}}><option value="ko">한국어</option><option value="en">English</option></select></label>
   <label>읽기 방식 <select aria-label="읽기 방식" value={mode} onChange={e=>{if(!dirtyRows.length||window.confirm('저장하지 않은 수정을 버리고 읽기 방식을 바꿀까요?'))setMode(e.target.value);}}><option value="compare">수정 전 ↔ 수정 후</option><option value="read">장면 전체 읽기</option><option value="candidate">선택·수정 반영 전체 읽기</option>{finalId&&<option value="final">저장된 확정본 읽기</option>}<option value="bilingual">영문 ↔ 국문 대응</option><option value="correspondence">선택 후보 영한 대응</option></select></label>
   {mode!=='compare'&&mode!=='candidate'&&mode!=='final'&&mode!=='correspondence'&&<label>판본 <select aria-label="판본" value={side} onChange={e=>setSide(e.target.value)}><option value="before">수정 전 · 고정 기준판</option><option value="after">{revision} 수정 후 · {decision}</option></select></label>}
   {mode==='compare'&&<label><input type="checkbox" checked={only} onChange={e=>setOnly(e.target.checked)}/> 변경 구간만</label>}
   <label><input aria-label="변경 강조" type="checkbox" checked={highlight} onChange={e=>setHighlight(e.target.checked)}/> 변경 강조</label>
   </nav><nav><button onClick={()=>move(-1)} disabled={item===changes[0]?.id}>이전 변경</button><select aria-label="수정 구간" value={item} onChange={e=>go(e.target.value)}>{changes.map(c=><option key={c.id} value={c.id}>{c.id} · {c.title}</option>)}</select><button onClick={()=>move(1)} disabled={item===changes.at(-1)?.id}>다음 변경</button></nav>
   <div className={mode==='read'||mode==='candidate'?'':'columns'}><b>{mode==='compare'?'수정 전 · 매핑 기준 원문':mode==='bilingual'?'English':mode==='candidate'?'선택·수정 반영 후보 · 최종 채택 전':side==='after'?`${revision} 수정 후 · ${decision}`:'수정 전 · 고정 기준판'}</b>{mode!=='read'&&mode!=='candidate'&&<b>{mode==='compare'?`${revision} 수정 후 · ${decision}`:'한국어'}</b>}</div></>}
  </header>
  {loading&&<p role="status">로그인과 검토판 접근권한을 확인하고 있습니다.</p>}
  {error&&<div role="alert">{error} <a href={login}>로그인</a></div>}
  {review&&<>
   {review.decisions?.candidates&&<fieldset disabled={dirtyRows.length>0||savingChoice}><ReviewFinalization key={`${id}-${language}-${review.decisions.revision}`} state={review.decisions} language={language} mode={mode} onRead={()=>setMode('candidate')} onCorrespondence={()=>setMode('correspondence')} onAction={finalAction} onShowFinal={value=>{setFinalId(value);setMode('final');}}/></fieldset>}
   {mode==='correspondence'?<article>{review.rows.map(row=><section key={row.id}><h3>{row.id} · 후보 대응</h3><div className="columns"><div><Body texts={candidateTexts(row,'en')}/></div><div><Body texts={candidateTexts(row,'ko')}/></div></div></section>)}</article>:mode==='final'&&finalVersion?<article className="reading"><h2>{finalVersion.id} · {finalVersion.language?'언어별 전문 확정본':'영한 최종 채택본'}</h2><Body texts={finalVersion.language?finalVersion.paragraphs:finalVersion[language].paragraphs}/></article>:mode==='compare'?review.rows.filter(r=>!only||r.changed).map(row=><section id={`${id}-${row.id}`} key={row.id} data-review-row={row.id} className={highlight&&row.changed?'changed':''}>
    {row.changed&&<p className="label">{row.id} · {row.title} · {row.content.en.before.length===row.content.en.after.length?'교체':'병합'} {row.content.en.before.length}→{row.content.en.after.length}</p>}
    <>{row.changed&&<ReviewChoice key={`${id}-${row.id}-${language}`} row={row} language={language} onDirty={dirty=>setDirtyRows(old=>dirty?(old.includes(row.id)?old:[...old,row.id]):old.includes(row.id)?old.filter(v=>v!==row.id):old)} decision={review.decisions?.choices[`${language}:${row.id}`]} disabled={savingChoice} onSave={(choice,texts)=>selectChoice(row,choice,texts)}/>}</><div className="columns">{['before','after'].map(s=><div key={s} data-review-side={s} className="version-column">{row.changed&&JSON.stringify(row.content[language].before)!==JSON.stringify(row.content[language].after)&&<div className={`version-label ${s}`}><strong>{s==='before'?'수정 전':'수정 후'}</strong><span>{s==='before'?'고정 기준 원문':`${revision} 수정 제안`} · {language==='ko'?'국문':'영문'}</span></div>}<Body texts={row.content[language][s]}/></div>)}</div>
   </section>):mode==='read'||mode==='candidate'?<article className="reading">{review.rows.map(row=><section id={`${id}-${row.id}`} key={row.id} data-review-row={row.id} className={highlight&&row.changed?'changed':''}>{highlight&&row.changed&&<p className="label">{row.id} · {row.title}</p>}<Body texts={mode==='candidate'?candidateTexts(row,language):row.content[language][side]}/></section>)}</article>:<article>{bilingualRows.map((pair,i)=><section id={pair.anchor?`${id}-${pair.anchor}`:undefined} key={i} data-bilingual-row={i+1} className={highlight&&pair.change?'changed':''}><div className="columns"><div><Body texts={[pair.en]}/></div><div><Body texts={[pair.ko]}/></div></div></section>)}</article>}
   <nav aria-label="장면 이어 읽기">{adjacent(-1)&&<a href={sceneLink(adjacent(-1))}>← 이전 적재 장면: {adjacent(-1).title}</a>}{adjacent(1)&&<a href={sceneLink(adjacent(1))}>다음 적재 장면: {adjacent(1).title} →</a>}</nav><details className="comments"><summary>이 검토판에 의견 남기기 ({review.comments.length})</summary><p>{id} · {item} · 고정 기준판에 연결됩니다. 기존 운영 댓글은 변경하지 않습니다.</p><textarea aria-label="검토 의견" value={comment} onChange={e=>setComment(e.target.value)} maxLength={4000}/><button disabled={!comment.trim()} onClick={save}>검토 의견 저장</button><p role="status">{feedback}</p>{review.comments.map((c,i)=><p key={i}>{c.item} · {c.createdAt} · {c.text}</p>)}</details>
  </>}
  <style jsx>{`.local-review{background:#09090b;color:#e4e4e7;padding:16px;max-width:1600px;margin:16px auto;border:1px solid #0369a1;border-radius:12px}.local-review:not(.embedded){min-height:100vh}.scene-list ol{padding-left:24px;width:100%;font-size:13px}.scene-list li{margin:8px 0}.scene-list [aria-current=page]{font-weight:700}header{padding-bottom:12px}h1{font-size:inherit;font-weight:700}header p,summary{font-size:12px;color:#a1a1aa;margin:8px 0}details p{overflow-wrap:anywhere}nav{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:12px 0}button,select{border:1px solid #3f3f46;border-radius:4px;padding:8px;background:#27272a;color:#e4e4e7;font:inherit}button:disabled{opacity:.4}.columns{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}.columns>div{min-width:0}.version-column{border:1px solid #52525b;border-radius:6px;padding:12px}.version-label{position:sticky;top:0;z-index:1;display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 12px;margin:-12px -12px 16px;border-bottom:2px solid #71717a;background:#27272a}.version-label strong{font-size:16px;white-space:nowrap}.version-label span{font-size:12px;color:#d4d4d8}.version-label.after{background:#0c2940;border-bottom-color:#38bdf8}.version-label.after strong{color:#7dd3fc}section{scroll-margin-top:420px;padding:16px 0;border-top:1px solid #3f3f46;line-height:1.625;overflow-wrap:anywhere}.label{font-size:12px;color:#7dd3fc;margin-bottom:8px}.changed .label{font-weight:600}.reading{max-width:800px;margin:auto}.reading section{border:0;padding:0}.comments{margin:32px 0}.comments textarea{display:block;width:100%;min-height:100px;border:1px solid #52525b;background:#27272a;color:#e4e4e7}`}</style>
  <style jsx global>{`.local-review blockquote{border:1px solid #52525b;background:#18181b;padding:14px;margin:12px 0}.local-review .katex-display{overflow-x:auto;overflow-y:hidden}.local-review a{color:#7dd3fc;text-decoration:underline}`}</style>
 </main>;
}
