import {useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {supabase} from '../shared/lib/supabase';

// Operator UI uses the same normal signed-in user API/RPC paths as the tests.
// No service key, impersonation, approval registration, or manuscript editing.
export default function RevisionExecute(){
 const [approval,setApproval]=useState('');
 const [context,setContext]=useState<any>(null);
 const [release,setRelease]=useState<any>(null);
 const [publication,setPublication]=useState<any>(null);
 const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
 const [keys,setKeys]=useState(()=>({stage:crypto.randomUUID(),publish:crypto.randomUUID(),restore:crypto.randomUUID()}));
 const rpc=async(name:string,args:any)=>{const {data,error}=await supabase.rpc(name,args);if(error)throw new Error(error.message);return data;};
 const api=async(path:string,body:any)=>{
  const {data,error}=await supabase.auth.getSession();if(error||!data.session)throw new Error('정상 로그인이 필요합니다.');
  const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${data.session.access_token}`},body:JSON.stringify(body)});
  const result=await r.json();if(!r.ok)throw new Error(`${r.status}: ${result.error}`);return result;
 };
 const run=async(fn:()=>Promise<void>)=>{setBusy(true);setMessage('처리 중');try{await fn();}catch(e){setMessage(e instanceof Error?e.message:'실행 실패');}finally{setBusy(false);}};
 const load=()=>run(async()=>{setContext(null);setRelease(null);setPublication(null);const c=await rpc('ros_bilingual_stage_context',{p_approval_id:approval});setContext(c);setMessage('등록된 승인 자료를 확인했습니다.');});
 const stage=()=>run(async()=>{
  const r=await api('/api/novel-bilingual-stage',{request_id:keys.stage,approval_id:approval,proposal:context.proposal});
  const read=await rpc('ros_bilingual_read_staged',{p_release_id:r.release_id});
  const expected=context.plan.result_pairs;
  if(read.pairs.length!==expected.length||read.pairs.some((p:any,i:number)=>['en','ko'].some(l=>p[l+'_body']!==(expected[i].kind==='retained'?expected[i].original[l].body:expected[i][l].body))))throw new Error('영한 전문 재조회 불일치: 게시하지 않았습니다.');
  setRelease(read);setMessage('영한 공동 저장 및 전체 전문 read-back 일치. 아직 게시하지 않았습니다.');
 });
 const prepareRepublish=()=>run(async()=>{const read=await rpc('ros_bilingual_read_staged',{p_release_id:release.release_id});const expected=context.plan.result_pairs;if(read.pairs.length!==expected.length||read.pairs.some((p:any,i:number)=>['en','ko'].some(l=>p[l+'_body']!==(expected[i].kind==='retained'?expected[i].original[l].body:expected[i][l].body))))throw new Error('영한 전문 재조회 불일치');setRelease(read);setKeys(k=>({...k,publish:crypto.randomUUID(),restore:crypto.randomUUID()}));setPublication(null);setMessage('기존 저장 판본 전문 확인 완료. 서버가 복원 이후 변경 여부를 검사합니다.');});
 const validateCapture=()=>run(async()=>{const result=await api('/api/novel-bilingual-book',{});setMessage('영한 전권 조회 검증 완료: '+JSON.stringify(result));});
 const publish=()=>run(async()=>{setMessage('현재 영한 전권 조회 검증 중');await api('/api/novel-bilingual-book',{});const p=await api('/api/novel-bilingual-publication',{action:'publish',request_id:keys.publish,target_id:release.release_id});setPublication(p);setMessage('영한 공동 게시 완료. 기본 Reader에서 확인하세요.');});
 const restore=()=>run(async()=>{const p=await api('/api/novel-bilingual-publication',{action:'restore',request_id:keys.restore,target_id:publication.publication_id});setPublication(p);setMessage('영한 공동 복원 완료.');});
 return <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8 max-w-4xl mx-auto"><Head><title>승인 원고 공동 반영</title></Head><h1 className="text-2xl mb-4">승인 원고 공동 반영</h1>
 <p className="mb-4">현재 로그인 계정의 기존 권한으로 서버에 등록된 승인만 실행합니다. 문안 편집이나 승인 등록 기능이 아닙니다.</p>
 <Link href="/auth?next=%2Fnovel-revision-execute">로그인</Link>
 <label className="block my-4">공식 승인 ID<input className="block bg-zinc-800 p-2 w-full" value={approval} onChange={e=>{setApproval(e.target.value);setContext(null);setRelease(null);setPublication(null);}} disabled={busy||!!release}/></label>
 <div className="flex gap-3 flex-wrap"><button disabled={busy} onClick={validateCapture}>전권 조회만 검증</button><button disabled={busy||!approval||!!release} onClick={load}>승인 자료 조회</button><button disabled={busy||!context||!!release} onClick={stage}>영한 공동 저장·전문 검증</button><button disabled={busy||!release||!!publication} onClick={publish}>검증된 판본 공동 게시</button><button disabled={busy||!publication||publication.status==='RESTORED'} onClick={restore}>이번 게시 공동 복원</button>{publication?.status==='RESTORED'&&<button disabled={busy} onClick={prepareRepublish}>복원판 재게시 준비·전문 검증</button>}</div>
 {context&&<p className="my-4">{context.proposal.proposal_id} · 리비전 {context.proposal.proposal_revision} · 결과 {context.plan.result_pairs.length}쌍 · 변경 밖 {context.plan.retained_pairs}쌍</p>}
 <p role="status" className="my-4 whitespace-pre-wrap">{message}</p>
 <pre className="whitespace-pre-wrap break-all">{JSON.stringify(publication||release&&{release_id:release.release_id,en_snapshot_id:release.en_snapshot_id,ko_composition_id:release.ko_composition_id},null,2)}</pre>
 <p className="mt-6"><Link href="/novel/quantum-vibration-novel/en#scene-b48a4f04">영문 Reader</Link> · <Link href="/novel/quantum-vibration-novel#scene-b48a4f04">국문 Reader</Link></p>
 </main>;
}
