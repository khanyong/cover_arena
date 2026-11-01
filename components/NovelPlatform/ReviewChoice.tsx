import React,{useEffect,useState} from 'react';
export default function ReviewChoice({row,language,decision,onSave,disabled}:{row:any;language:string;decision:any;onSave:(choice:string,texts?:string[])=>Promise<void>;disabled:boolean}){
 const [editing,setEditing]=useState(false),[texts,setTexts]=useState<string[]>([]),[error,setError]=useState('');
 useEffect(()=>{if(!editing)return;const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[editing]);
 const save=async(choice:string,values?:string[])=>{setError('');try{await onSave(choice,values);setEditing(false);}catch(e){setError(e instanceof Error?e.message:'저장 실패');}};
 return <fieldset disabled={disabled} style={{border:'1px solid #64748b',padding:12,marginBottom:16}}>
  <legend>{row.id} · {language==='ko'?'국문':'영문'} 후보 문안 선택</legend>
  {(['before','after'] as const).map(choice=><label key={choice} style={{marginRight:20,display:'inline-block'}}><input type="radio" name={`${row.id}-${language}-choice`} checked={(decision?.choice||'after')===choice} onChange={()=>{}} onClick={()=>void save(choice)}/> {choice==='before'?'수정 전 사용':'수정 후 사용'}</label>)}
  <button type="button" onClick={()=>{setTexts(decision?.choice==='custom'?[...decision.texts]:[...row.content[language][decision?.choice||'after']]);setEditing(true);}}>직접 수정</button>
  <p role="status">{disabled?'저장 중…':decision?`✓ ${decision.choice==='custom'?'직접 수정':decision.choice==='before'?'수정 전':'수정 후'} 선택 저장됨`:'수정 후 기본 유지 · 개별 선택 기록 없음'} · 장면 최종 채택 전</p>
  {editing&&<div><p>문단 전체를 수정해 저장합니다. 원래 전·후 문안과 이전 선택은 보존됩니다.</p>{texts.map((text,index)=><textarea key={index} aria-label={`${row.id} ${language} 직접 수정 문단 ${index+1}`} value={text} onChange={e=>setTexts(values=>values.map((v,i)=>i===index?e.target.value:v))} style={{display:'block',width:'100%',minHeight:150,background:'#18181b',color:'#fafafa',padding:12,marginBottom:8}}/>)}
  {![row.content[language].before.length,row.content[language].after.length].includes(texts.length)&&<p role="alert">이 구간은 전후 문단 구조가 다릅니다. 직접 수정은 수정 후 문단 구성에서 시작해 주세요.</p>}
  <button type="button" disabled={texts.some(t=>!t.trim())||![row.content[language].before.length,row.content[language].after.length].includes(texts.length)} onClick={()=>void save('custom',texts)}>수정 문안 저장·선택</button> <button type="button" onClick={()=>setEditing(false)}>취소</button></div>}
  {decision?.choice==='custom'&&!editing&&<div>{decision.texts.map((text,i)=><p key={i} style={{whiteSpace:'pre-wrap'}}> {text}</p>)}</div>}
  {error&&<p role="alert">{error}</p>}
 </fieldset>;
}
