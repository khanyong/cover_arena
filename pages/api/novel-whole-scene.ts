import {authenticateBookRequest} from '../../lib/novel-book/loadBookSnapshot.mjs';
import {localRequest,storeRoot} from '../../lib/novel-local-review/store.mjs';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {SCENES,readWhole,changeWhole} from '../../lib/novel-whole-scene/store.mjs';
export const config={api:{bodyParser:{sizeLimit:'3mb'}}};
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');
 if(!localRequest(req))return res.status(404).end();
 if(!['GET','POST'].includes(req.method))return res.status(405).end();
 try{
  const {client,userId}=await authenticateBookRequest(req.headers.authorization);
  const scene=req.query.scene;if(!SCENES.includes(scene))return res.status(400).json({error:'INVALID_SCOPE'});
  // Existing owner allow-list and normal remote scene permission, never a service-role fallback.
  const manifest=JSON.parse(await readFile(resolve(storeRoot(),scene+'-r01','manifest.json'),'utf8'));
  if(!manifest.allowedUserIds.includes(userId))return res.status(403).json({error:'ACCESS_DENIED'});
  const {data,error}=await client.rpc('ros_ko_get_scene',{p_managed_scene_id:manifest.managedSceneId,p_composition_id:null,p_include_legacy:false});
  if(error||!data)return res.status(403).json({error:'ACCESS_DENIED'});
  if(req.method==='POST'&&req.headers.origin!==`http://${req.headers.host}`)return res.status(403).json({error:'ORIGIN_DENIED'});
  const state=req.method==='POST'?await changeWhole(scene,userId,req.body):await readWhole(scene,userId);
  return res.json({scene,managedSceneId:manifest.managedSceneId,storage:'private-local-whole-scene',...state});
 }catch(e){const status=[400,401,403,409].includes(e.status)?e.status:503;return res.status(status).json({error:status===503?'WHOLE_SCENE_UNAVAILABLE':e.message});}
}
