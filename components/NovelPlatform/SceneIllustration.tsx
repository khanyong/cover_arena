import React, {useEffect,useState} from 'react';
import {supabase} from '../../shared/lib/supabase';

export function StoredIllustration({path,caption,language,assetId,width,height}:{path:string;caption:string;language:'ko'|'en';assetId:string;width:number;height:number}) {
 const [url,setUrl]=useState(''),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{

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
 },[path,retry]);

 return <figure className="mx-auto my-8 w-full max-w-[680px]" data-scene-illustration={assetId}>
  {url?<a href={url} target="_blank" rel="noopener noreferrer" aria-label={language==='ko'?'삽화 크게 보기 (새 탭)':'Enlarge illustration (new tab)'}>
   <img src={url} alt={caption} width={width} height={height} loading="lazy" className="h-auto w-full rounded border border-zinc-700" onError={()=>{setUrl('');setError(true);}}/>
  </a>:error?<p role="alert">{language==='ko'?'삽화를 불러오지 못했습니다.':'Illustration unavailable.'} <button type="button" className="underline" onClick={()=>setRetry(n=>n+1)}>{language==='ko'?'다시 불러오기':'Retry'}</button></p>:<p role="status">{language==='ko'?'삽화 불러오는 중…':'Loading illustration…'}</p>}
  <figcaption className="mt-2 text-center text-sm text-zinc-400">{caption}</figcaption>
 </figure>;
}

export default function SceneIllustration({sceneId,language}:{sceneId:string;language:'ko'|'en'}) {
 if(sceneId!=='89b8150d')return null;
 return <StoredIllustration path="illustrations/A0-C01-S02/helios-complex/v1/Helios Complex Architectural Sketch.png" assetId="helios-complex-v1" width={1254} height={1254} language={language} caption={language==='ko'?'헬리오스 단지 — 붕괴 전 건축 스케치':'Helios Complex — Architectural Sketch Before the Collapse'}/>;
}
export function PrologueIllustrations({language}:{language:'ko'|'en'}) {
 return <section style={{scrollMarginTop:440}} id="prologue-illustrations" aria-label={language==='ko'?'프롤로그 시설 안내':'Prologue facility illustrations'}>
  <StoredIllustration path="illustrations/prologue/ngc-facility/v1/ngc-geneva-basin-aerial-v1.png" assetId="ngc-aerial-v1" width={1448} height={1086} language={language} caption={language==='ko'?'NGC 시설 조감도 — 중앙 통제 센터와 검출기 부지의 개념적 배치.':'NGC aerial view — conceptual layout of the central control center and detector site.'}/>
  <StoredIllustration path="illustrations/prologue/ngc-facility/v1/ngc-detector-control-cutaway-v1.png" assetId="ngc-cutaway-v1" width={1536} height={1024} language={language} caption={language==='ko'?'NGC 지하 검출기와 제어 시설 — 지상 지원 시설·광섬유 연결·로컬 제어 및 보호 계통.':'NGC underground detector and control facilities — surface support, fiber links, local control and protection.'}/>
  <p className="text-center text-sm text-zinc-400">{language==='ko'?'시설 외관과 배치는 개념적 표현이며, 거리·깊이·크기는 축척을 따르지 않습니다.':'Conceptual illustration; distances, depths and sizes are not to scale.'}</p>
 </section>;
}
