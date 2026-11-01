import React,{useState} from 'react';
export default function ReviewFinalization({state,language,mode,onRead,onAction,onShowFinal,onCorrespondence}:{state:any;language:string;mode:string;onRead:()=>void;onAction:(input:any)=>Promise<void>;onShowFinal:(id:string)=>void;onCorrespondence:()=>void}){
 const [ack,setAck]=useState(false),[paired,setPaired]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const candidate=state.candidates[language],confirmed=state.confirmed?.[language];
 const current=confirmed?.contentHash===candidate.contentHash&&confirmed?.compositionHash===candidate.compositionHash;
 const both=['en','ko'].every(l=>state.confirmed?.[l]?.contentHash===state.candidates[l].contentHash&&state.confirmed?.[l]?.compositionHash===state.candidates[l].compositionHash);
 const act=async(input:any)=>{setBusy(true);setMessage('');try{await onAction(input);setAck(false);setPaired(false);setMessage('정확한 전문과 버전 이력을 저장했습니다. 온라인 게시는 변경하지 않았습니다.');}catch(e){setMessage(e instanceof Error?e.message:'저장 실패');}finally{setBusy(false);}};
 const languageName=language==='ko'?'국문':'영문';
 const languageStatus=(l:string)=>{const saved=state.confirmed?.[l],value=state.candidates[l];return !saved?'미확정':saved.contentHash===value.contentHash&&saved.compositionHash===value.compositionHash?'현재 문안 확정 완료':'추가 수정 있음 · 재확정 필요';};
 const origin={before:'수정 전',after:'수정 후',custom:'추가 수정·혼합 편집본'};
 return <section aria-label="장면 버전 확정" style={{border:'1px solid #0ea5e9',padding:16,margin:'16px 0'}}>
  <h2>장면 버전 확정</h2><p>최신 작업본: {origin[candidate.origin]} · {language==='ko'?'국문':'영문'} {current?'전문 확정됨':'검토 중'} · {candidate.paragraphs.length}문단</p>
  <button onClick={onRead}>선택·수정 반영된 {languageName} 전문 다시 보기</button>
  <p>아래 확정은 선택·수정을 반영한 {languageName} 전체 {candidate.paragraphs.length}문단에 적용됩니다. {language==='ko'?'영문':'국문'}은 함께 확정되지 않습니다.</p>
  <label style={{display:'block',margin:'12px 0'}}><input type="checkbox" disabled={busy||current} checked={current||ack} onChange={e=>setAck(e.target.checked)}/> {languageName} 검토를 완료했으며, 현재 선택·수정 문안으로 확정합니다.</label><button type="button" style={{display:"block",width:"100%",margin:"12px 0",padding:"14px 18px",border:"2px solid #38bdf8",borderRadius:8,background:ack&&!current?"#0369a1":"#334155",color:"#fff",fontSize:16,fontWeight:700,opacity:1}} disabled={!ack||busy||current} onClick={()=>void act({action:'confirm-language',language,contentHash:candidate.contentHash,compositionHash:candidate.compositionHash})}>{current?`${languageName} 확정 완료`:`${languageName} 검토 완료·현재 선택 문안 확정`}</button>
  {!current&&!ack&&<p>위 체크박스를 선택한 다음, 파란 테두리의 확정 버튼을 눌러 주세요.</p>}
  <p role="status">국문: {languageStatus('ko')} / 영문: {languageStatus('en')}</p>
  <details open={mode==='correspondence'}><summary>영한 공동 최종 채택 — 두 언어 검토 후 진행</summary>
  <button disabled={!both||busy} onClick={onCorrespondence}>확정 후보 영한 대응 읽기</button><label style={{display:'block'}}><input type="checkbox" disabled={!both||busy||mode!=='correspondence'} checked={paired} onChange={e=>setPaired(e.target.checked)}/> 영한 전문과 구간별 의미·문단 대응을 확인했습니다.</label>
  <button disabled={!both||!paired||busy||mode!=='correspondence'} onClick={()=>void act({action:'adopt-bilingual',enId:state.confirmed.en.id,koId:state.confirmed.ko.id,correspondenceReviewed:true})}>영한 장면 최종 채택</button></details>
  <p>최종 채택본: {state.adopted?.id||'없음 · 이번 회차 미채택'} {state.adopted&&`· EN ${origin[state.adopted.en.origin]} / KO ${origin[state.adopted.ko.origin]} · 최종 채택본`}</p>
  {state.confirmationHistory?.some(v=>v.language===language)&&<label>언어별 전문 확정 이력 <select aria-label="전문 확정 이력" defaultValue="" onChange={e=>{if(e.target.value)onShowFinal(e.target.value);}}><option value="">확정 전문 읽기 선택</option>{state.confirmationHistory.filter(v=>v.language===language).slice().reverse().map(v=><option key={v.id} value={v.id}>{v.id} · {origin[v.origin]}</option>)}</select></label>}
  {state.adoptionHistory?.length>0&&<label>채택 이력 <select aria-label="최종 채택 이력" defaultValue="" onChange={e=>{if(e.target.value)onShowFinal(e.target.value);}}><option value="">채택본 읽기 선택</option>{[...state.adoptionHistory].reverse().map(v=><option key={v.id} value={v.id}>{v.id} · {v.adoptedAt}</option>)}</select></label>}
  <p role="status">{message}</p>
 </section>;
}
