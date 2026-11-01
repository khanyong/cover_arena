export function reviewBadgeText(draft){
 const revision=draft.id.match(/r\d+$/)?.[0]||'';
 if(draft.finalAdoptionId)return `영한 최종 채택 ${draft.finalAdoptionId.match(/v\d+$/)?.[0]||''}${draft.adoptedCandidateCurrent===false?' · 추가 수정 중':''}`;
 const confirmed=draft.confirmedLanguages||[];
 if(confirmed.includes('ko')&&confirmed.includes('en'))return '국문·영문 확정 · 최종 채택 대기';
 if(confirmed.includes('ko'))return '국문 확정 · 영문 검토 대기';
 if(confirmed.includes('en'))return '영문 확정 · 국문 검토 대기';
 if(draft.pendingConfirmationLanguages?.length)return '추가 수정 · 전문 재확정 필요';
 return `수정안 ${revision} · 미채택`;
}
