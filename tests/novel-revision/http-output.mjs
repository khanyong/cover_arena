import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
const dir=process.env.ROS_EXEC02_FIXTURE_DIR;
const actor=process.env.ROS_EXEC02_ACTOR||'owner';
assert.ok(['owner','reader'].includes(actor));
const token=JSON.parse(readFileSync(dir+'/'+actor+'-session.json')).access_token;
const post=(path,body)=>fetch('http://127.0.0.1:3003/api/'+path,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(body)});
const response=await post('novel-bilingual-book',{});assert.equal(response.status,200,await response.clone().text());
const {captureId}=await response.json();const evidence=[];mkdirSync(dir+'/output',{recursive:true});
for(const lang of ['EN','KO'])for(const format of ['pdf','epub']){
 const r=await post('novel-book-'+format,{slug:'quantum-vibration-novel'+(lang==='EN'?'-en':''),captureId});
 assert.equal(r.status,200,r.ok?'':await r.text());assert.equal(r.headers.get('X-ROS-Book-Capture'),captureId);
 const bytes=Buffer.from(await r.arrayBuffer());
 if(format==='pdf')assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
 else{const zip=await JSZip.loadAsync(bytes,{checkCRC32:true});assert.equal(await zip.file('mimetype').async('string'),'application/epub+zip');}
 writeFileSync(dir+'/output/'+lang+'.'+format,bytes);evidence.push({language:lang,format,bytes:bytes.length,captureId});
 console.log('PASS actual HTTP download',lang,format,bytes.length);
}
writeFileSync(dir+'/output-results.json',JSON.stringify(evidence,null,2));
