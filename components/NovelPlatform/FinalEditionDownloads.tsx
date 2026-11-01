import Body from './ReviewBody';
import React,{useEffect,useState} from 'react';
import {supabase} from '../../shared/lib/supabase';
export default function FinalEditionDownloads({language}:{language:string}){
 const [edition,setEdition]=useState(''),[ack,setAck]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const [editions,setEditions]=useState<any[]>([]),[reading,setReading]=useState<any>(null);
 useEffect(()=>{let active=true;void supabase.auth.getSession().then(async({data})=>{if(!data.session)return;const r=await fetch('/api/novel-local-edition?list=1',{headers:{Authorization:`Bearer ${data.session.access_token}`},cache:'no-store'});if(r.ok&&active)setEditions((await r.json()).editions);});return()=>{active=false;};},[]);
 const run=async(format?:string)=>{
  setBusy(true);setMessage('');try{
   const {data}=await supabase.auth.getSession();if(!data.session)throw new Error('로그인이 필요합니다.');
   const response=await fetch(format?`/api/novel-local-edition?edition=${edition}&lang=${language}&format=${format==='read'?'json':format}`:'/api/novel-local-edition',{method:format?'GET':'POST',headers:{Authorization:`Bearer ${data.session.access_token}`,'Content-Type':'application/json'},...(!format?{body:JSON.stringify({confirmBookComponents:ack})}:{}),cache:'no-store'});
   if(!response.ok){const error=await response.json();throw new Error(error.error==='FINAL_52_SCENES_REQUIRED'?'52장면의 영한 최종 채택이 모두 필요합니다. 미채택 원고로 대체하지 않습니다.':error.error);}
   if(format==='read'){setReading(await response.json());setMessage('고정 판본 전문을 불러왔습니다.');}
   else if(!format){const result=await response.json();setEdition(result.id);setEditions(values=>[result,...values]);setMessage('고정 판본을 저장했습니다. 판본 ID로 다시 다운로드할 수 있습니다.');}
   else{const url=URL.createObjectURL(await response.blob()),a=document.createElement('a');a.href=url;a.download=`ROS-final-${edition.slice(0,12)}-${language}.${format}`;a.click();URL.revokeObjectURL(url);setMessage(`다운로드 응답 수신 · SHA-256 ${response.headers.get('X-Content-SHA256')||'별도 확인'} · 내용/표시 검증은 별도입니다.`);}
  }catch(e){setMessage(e instanceof Error?e.message:'출력 실패');}finally{setBusy(false);}
 };
 return <details><summary>최종 채택 전권 판본·다운로드</summary><p>52장면 모두의 영한 최종 채택본과 현재 책의 제목·목차·부록을 함께 고정합니다. 새 작업본은 자동 포함하지 않습니다.</p><label><input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)}/> 책의 표제·구성·부록을 확인했으며 이 구성으로 고정합니다.</label><button disabled={!ack||busy} onClick={()=>void run()}>최종 전권 판본 생성</button><label>고정 판본 ID <input aria-label="고정 판본 ID" value={edition} onChange={e=>setEdition(e.target.value)} style={{width:'100%',color:'#111'}}/></label><label>저장된 판본 <select value={edition} onChange={e=>setEdition(e.target.value)}><option value="">판본 선택</option>{editions.map(v=><option key={v.id} value={v.id}>{v.createdAt} · {v.id.slice(0,12)}</option>)}</select></label>{['read','txt','pdf','epub','json'].map(format=><button key={format} disabled={busy||!/^[a-f0-9]{64}$/.test(edition)} onClick={()=>void run(format)}>{format==='read'?'고정 판본 전체 읽기':format==='txt'?'마스터 TXT':format==='json'?'판본 전문·구성 JSON':format.toUpperCase()}{format==='read'?'':' 다운로드'}</button>)}<p role="status">{message}</p>{reading&&<article><h2>고정 판본 {reading.id}</h2>{reading.books[language.toUpperCase()].acts.map((a,i)=><section key={i}><h2>{a.title}</h2>{a.chapters.map((c,j)=><section key={j}><h3>{c.title}</h3>{c.scenes.map(scene=><section key={scene.id}><h4>{scene.title}</h4><Body texts={scene.paragraphs.map(p=>p.text)}/></section>)}</section>)}</section>)}</article>}</details>;
}
