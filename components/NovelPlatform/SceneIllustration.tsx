import React, {useEffect,useState} from 'react';
import {supabase} from '../../shared/lib/supabase';
const path='illustrations/A0-C01-S02/helios-complex/v1/Helios Complex Architectural Sketch.png';
export default function SceneIllustration({sceneId,language}:{sceneId:string;language:'ko'|'en'}) {
 const [url,setUrl]=useState(''),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{
  if(sceneId!=='89b8150d')return;
  let active=true,sequence=0;
  const load=async()=>{
   const request=++sequence;
   try {
    const {data:session}=await supabase.auth.getSession();
    if(!session.session)throw Error('LOGIN_REQUIRED');
    const {data,error}=await supabase.storage.from('novel-assets').createSignedUrl(path,3600);
    if(error||!data?.signedUrl)throw Error('UNAVAILABLE');
    if(active&&request===sequence){setUrl(data.signedUrl);setError(false);}
   }catch{if(active&&request===sequence){setUrl('');setError(true);}}
  };
  void load();
  const timer=setInterval(()=>void load(),45*60*1000);
  const {data:listener}=supabase.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'){sequence++;setUrl('');setError(true);}});
  return()=>{active=false;clearInterval(timer);listener.subscription.unsubscribe();};
 },[sceneId,retry]);
 if(sceneId!=='89b8150d')return null;
 const caption=language==='ko'?'헬리오스 단지 — 붕괴 전 건축 스케치':'Helios Complex — Architectural Sketch Before the Collapse';
 return <figure className="mx-auto my-8 w-full max-w-[680px]" data-scene-illustration="helios-complex-v1">
  {url?<a href={url} target="_blank" rel="noopener noreferrer" aria-label={language==='ko'?'헬리오스 삽화 크게 보기 (새 탭)':'Enlarge Helios illustration (new tab)'}>
   <img src={url} alt={caption} width={1254} height={1254} loading="lazy" className="h-auto w-full rounded border border-zinc-700" onError={()=>{setUrl('');setError(true);}}/>
  </a>:error?<p role="alert">{language==='ko'?'삽화를 불러오지 못했습니다.':'Illustration unavailable.'} <button type="button" className="underline" onClick={()=>setRetry(n=>n+1)}>{language==='ko'?'다시 불러오기':'Retry'}</button></p>:<p role="status">{language==='ko'?'삽화 불러오는 중…':'Loading illustration…'}</p>}
  <figcaption className="mt-2 text-center text-sm text-zinc-400">{caption}</figcaption>
 </figure>;
}
