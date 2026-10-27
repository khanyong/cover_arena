export const config={api:{bodyParser:{sizeLimit:'16kb'}}};
export default async function handler(req,res){
  if(process.env.NODE_ENV!=='development')return res.status(404).end();
  const {default:localHandler}=await import('../../lib/novel-local-review/handler');
  return localHandler(req,res);
}
