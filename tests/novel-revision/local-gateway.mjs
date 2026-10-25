// Local test transport only: forwards unmodified tokens to actual GoTrue/REST.
import http from 'node:http';
const auth=new URL(process.env.ROS_EXEC02_AUTH),rest=new URL(process.env.ROS_EXEC02_REST);
for(const u of [auth,rest]) if(u.hostname!=='127.0.0.1'||!/^554\d\d$/.test(u.port)) throw Error('Local isolated services required');
http.createServer((req,res)=>{
 // Supabase's API gateway supplies CORS in a full stack. This isolated proxy
 // permits only the local Next test origin; authentication is still upstream.
 const allowedOrigins=new Set(['http://127.0.0.1:3003','http://localhost:3003']);
 const cors=allowedOrigins.has(req.headers.origin)?{
  'access-control-allow-origin':req.headers.origin,
  'access-control-allow-methods':'GET,POST,OPTIONS',
  'access-control-allow-headers':'authorization,apikey,content-type,x-client-info,x-supabase-api-version,prefer,range,range-unit,accept-profile,content-profile',
  'vary':'Origin',
 }:{};
 if(req.method==='OPTIONS'){res.writeHead(204,cors);res.end();return;}

 const prefix=req.url.startsWith('/auth/v1/')?'/auth/v1':req.url.startsWith('/rest/v1/')?'/rest/v1':null;
 if(!prefix){res.writeHead(404);res.end();return;}
 const target=prefix==='/auth/v1'?auth:rest;
 const upstream=http.request({hostname:target.hostname,port:target.port,path:req.url.slice(prefix.length),method:req.method,headers:req.headers},reply=>{
  res.writeHead(reply.statusCode,{...reply.headers,...cors});reply.pipe(res);
 });
 upstream.on('error',()=>{res.writeHead(503);res.end();});req.pipe(upstream);
}).listen(Number(process.env.ROS_EXEC02_GATEWAY_PORT || 55445),'127.0.0.1',()=>console.log('Isolated Auth/REST gateway ready'));
