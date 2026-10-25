import puppeteer from 'puppeteer-core';
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
const dir=process.env.ROS_EXEC02_FIXTURE_DIR;
const secret=JSON.parse(readFileSync(dir+'/../local-secrets.json'));
const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
let page;
try{
 console.log('Browser launched');page=await browser.newPage();page.on('console',m=>{if(m.text().startsWith('Access to fetch'))console.log('CORS',m.text());});page.on('requestfailed',r=>{const u=new URL(r.url());console.log('Network failure',u.origin+u.pathname,r.failure()?.errorText);});await page.setViewport({width:1440,height:1000});
 await page.goto('http://127.0.0.1:3003/auth?next=%2Fnovel%2Fquantum-vibration-novel',{waitUntil:'networkidle0',timeout:60000});
 console.log('Auth page loaded');await page.waitForSelector('input[type=email]');await page.type('input[type=email]','owner@exec02.test');await page.type('input[type=password]',secret.password);
 console.log('Login form filled');await page.click('button[type=submit]');
 await new Promise(resolve=>setTimeout(resolve,3000));
 await page.screenshot({path:dir+'/auth-result.png'});
 assert.equal(await page.$eval('input[type=email]',e=>e.value).catch(()=> 'owner@exec02.test'),'owner@exec02.test');
 console.log('Auth diagnostic',JSON.stringify(await page.evaluate(()=>({path:location.pathname,error:document.querySelector('.bg-red-600')?.textContent,submit:document.querySelector('button[type=submit]')?.textContent}))));
 await page.waitForFunction(()=>document.body.textContent.includes('Private acceptance fixture'),{timeout:45000});
 await page.screenshot({path:dir+'/reader-ko.png',fullPage:false});
 const state=await page.evaluate(()=>({url:location.pathname,buttons:[...document.querySelectorAll('button')].map(x=>x.textContent).filter(x=>/읽기|Reader|비교|전체|본문/.test(x)),alerts:[...document.querySelectorAll('[role=alert]')].map(x=>x.textContent),paragraphs:document.querySelectorAll('[data-paragraph-id]').length}));
 writeFileSync(dir+'/browser-initial.json',JSON.stringify(state,null,2));console.log(JSON.stringify(state));
 assert.equal(state.url,'/novel/quantum-vibration-novel');
 const compareButtons=await page.$$('button');
 for(const button of compareButtons)if((await button.evaluate(e=>e.textContent)).trim()==='영한 비교'){await button.click();break;}
 await page.waitForFunction(()=>document.querySelectorAll('[data-bilingual-position]').length===67,{timeout:20000});
 await page.$eval('[data-bilingual-position="1"]',e=>e.scrollIntoView({block:'center'}));
 await page.screenshot({path:dir+'/reader-comparison.png'});
 const alignments=await page.$$eval('[data-bilingual-position]',rows=>rows.map(r=>r.getAttribute('data-alignment-id')));
 assert.equal(new Set(alignments).size,67);console.log('PASS actual Reader bilingual rows',alignments.length);
 const downloadPath=dir+'/browser-downloads-'+Date.now();mkdirSync(downloadPath,{recursive:true});
 const cdp=await browser.target().createCDPSession();await cdp.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath,eventsEnabled:true});
 const results=[];
 for(const lang of ['KO','EN']){
  if(lang==='EN'){
   await page.goto('http://127.0.0.1:3003/novel/quantum-vibration-novel/en',{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>document.body.textContent.includes('Private acceptance fixture'));
   await page.screenshot({path:dir+'/reader-en.png'});
  }
  const summary=await page.$$('summary');
  for(const element of summary)if((await element.evaluate(e=>e.textContent)).includes('책 다운로드')){await element.click();break;}
  for(const format of ['pdf','epub']){
   const beforeNames=new Set(readdirSync(downloadPath));
   const responsePromise=page.waitForResponse(r=>r.url().endsWith('/api/novel-book-'+format),{timeout:60000});
   await page.click('[data-book-'+format+'-download] button');
   const response=await responsePromise;assert.equal(response.status(),200);
   const request=JSON.parse(response.request().postData());assert.match(request.captureId,/^[a-f0-9]{64}$/);
   assert.equal(response.headers()['x-ros-book-capture'],request.captureId);
   let saved;
   await page.waitForFunction(f=>document.querySelector('[data-book-'+f+'-download]').textContent.includes('다운로드를 요청했습니다.'),{timeout:15000},format);
   for(let i=0;i<40;i++){
    saved=readdirSync(downloadPath).find(name=>!beforeNames.has(name)&&name.endsWith('.'+format));if(saved)break;
    await new Promise(resolve=>setTimeout(resolve,100));
   }
   assert.ok(saved,'Browser download did not complete');const bytes=readFileSync(downloadPath+'/'+saved);
   if(format==='pdf'){assert.equal(bytes.subarray(0,5).toString(),'%PDF-');assert.ok(bytes.subarray(-64).includes(Buffer.from('%%EOF')));}
   else{const zip=await JSZip.loadAsync(bytes,{checkCRC32:true});assert.equal(await zip.file('mimetype').async('string'),'application/epub+zip');}
   results.push({language:lang,format,captureId:request.captureId,bytes:bytes.length});
   console.log('PASS actual browser download',lang,format,bytes.length);
  }
 }
 assert.equal(new Set(results.map(r=>r.captureId)).size,1);
 writeFileSync(dir+'/browser-results.json',JSON.stringify({alignments,downloads:results},null,2));

}catch(e){console.log('Browser failure',e.name,e.message);if(page){await page.screenshot({path:dir+'/reader-failure.png'}).catch(()=>{});console.log('URL',page.url());}throw e;}finally{await Promise.race([browser.close(),new Promise(resolve=>setTimeout(()=>{browser.process()?.kill('SIGTERM');resolve();},5000))]);}
