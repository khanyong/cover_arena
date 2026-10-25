// Memory-only binding for this Reader session. Never store tokens or manuscripts.
let selected = null;
export function rememberBookCapture(actorId,captureId) {
 if(typeof window==='undefined')return;
 if(typeof actorId!=='string'||!/^[a-f0-9]{64}$/.test(captureId))throw Error('INVALID_CAPTURE_BINDING');
 selected={actorId,captureId};
}
export function selectedBookCapture(actorId) {
 if(typeof window==='undefined')return undefined;
 return selected?.actorId===actorId?selected.captureId:undefined;
}
