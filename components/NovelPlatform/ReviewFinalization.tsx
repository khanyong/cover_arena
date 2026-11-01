import React,{useState} from 'react';
export default function ReviewFinalization({state,language,mode,onRead,onAction,onShowFinal,onCorrespondence}:{state:any;language:string;mode:string;onRead:()=>void;onAction:(input:any)=>Promise<void>;onShowFinal:(id:string)=>void;onCorrespondence:()=>void}){
 const [ack,setAck]=useState(false),[paired,setPaired]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const candidate=state.candidates[language],confirmed=state.confirmed?.[language];
 const current=confirmed?.contentHash===candidate.contentHash&&confirmed?.compositionHash===candidate.compositionHash;
 const both=['en','ko'].every(l=>state.confirmed?.[l]?.contentHash===state.candidates[l].contentHash&&state.confirmed?.[l]?.compositionHash===state.candidates[l].compositionHash);
 const act=async(input:any)=>{setBusy(true);setMessage('');try{await onAction(input);setAck(false);setPaired(false);setMessage('정확한 전문과 버전 이력을 저장했습니다. 온라인 게시는 변경하지 않았습니다.');}catch(e){setMessage(e instanceof Error?e.message:'저장 실패');}finally{setBusy(false);}};
 const origin={before:'수정 전',after:'수정 후',custom:'추가 수정·혼합 편집본'};
 return <section aria-label="장면 버전 확정" style={{border:'1px solid #0ea5e9',padding:16,margin:'16px 0'}}>
  <h2>장면 버전 확정</h2><p>최신 작업본: {origin[candidate.origin]} · {language==='ko'?'국문':'영문'} {current?'전문 확정됨':'검토 중'} · {candidate.paragraphs.length}문단</p>
  <button onClick={onRead}>현재 후보 전문 읽기</button>
  {mode==='candidate'&&<><label style={{display:'block'}}><input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)}/> 현재 언어의 후보 전문을 확인했고 이 문안으로 확정합니다.</label><button disabled={!ack||busy||current} onClick={()=>void act({action:'confirm-language',language,contentHash:candidate.contentHash,compositionHash:candidate.compositionHash})}>현재 {language==='ko'?'국문':'영문'} 전문 확정</button></>}
  <p>국문: {state.confirmed?.ko?'확정 이력 있음':'미확정'} / 영문: {state.confirmed?.en?'확정 이력 있음':'미확정'}. 이후 수정된 후보는 다시 확정해야 합니다.</p>
  <button disabled={!both||busy} onClick={onCorrespondence}>확정 후보 영한 대응 읽기</button><label style={{display:'block'}}><input type="checkbox" disabled={!both||busy||mode!=='correspondence'} checked={paired} onChange={e=>setPaired(e.target.checked)}/> 영한 전문과 구간별 의미·문단 대응을 확인했습니다.</label>
  <button disabled={!both||!paired||busy||mode!=='correspondence'} onClick={()=>void act({action:'adopt-bilingual',enId:state.confirmed.en.id,koId:state.confirmed.ko.id,correspondenceReviewed:true})}>영한 장면 최종 채택</button>
  <p>최종 채택본: {state.adopted?.id||'없음 · 이번 회차 미채택'} {state.adopted&&`· EN ${origin[state.adopted.en.origin]} / KO ${origin[state.adopted.ko.origin]} · 최종 채택본`}</p>
  {state.confirmationHistory?.some(v=>v.language===language)&&<label>언어별 전문 확정 이력 <select aria-label="전문 확정 이력" defaultValue="" onChange={e=>{if(e.target.value)onShowFinal(e.target.value);}}><option value="">확정 전문 읽기 선택</option>{state.confirmationHistory.filter(v=>v.language===language).slice().reverse().map(v=><option key={v.id} value={v.id}>{v.id} · {origin[v.origin]}</option>)}</select></label>}
  {state.adoptionHistory?.length>0&&<label>채택 이력 <select aria-label="최종 채택 이력" defaultValue="" onChange={e=>{if(e.target.value)onShowFinal(e.target.value);}}><option value="">채택본 읽기 선택</option>{[...state.adoptionHistory].reverse().map(v=><option key={v.id} value={v.id}>{v.id} · {v.adoptedAt}</option>)}</select></label>}
  <p role="status">{message}</p>
 </section>;
}
