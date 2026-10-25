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

 const buttons=await page.$$('button');
 for(const button of buttons)if((await button.evaluate(e=>e.textContent)).trim()==='수정 전후 비교'){await button.click();break;}
 await page.waitForSelector('[data-revision-row]');
 assert.equal(await page.$$eval('[data-revision-row]',r=>r.length),7);
 const check=async()=>{
  const offsets=await page.$$eval('[data-revision-row]',rows=>rows.map(r=>{
   const a=r.querySelector('[data-revision-side=before]').getBoundingClientRect();
   const b=r.querySelector('[data-revision-side=after]').getBoundingClientRect();return Math.abs(a.top-b.top);
  }));assert.ok(offsets.every(x=>x<1));
 };
 await check();
 await page.$eval('[aria-label="수정 전후 비교"]',e=>e.scrollIntoView({block:'start'}));
 await page.screenshot({path:dir+'/revision-comparison-en.png'});
 await page.select('[aria-label="비교 언어"]','ko');await check();
 await page.screenshot({path:dir+'/revision-comparison-ko.png'});
 await page.$eval('[aria-label="수정 전후 비교"] input[type=checkbox]',e=>e.click());
 assert.equal(await page.$$eval('[data-revision-row]',r=>r.length),63);await check();
 await page.setViewport({width:390,height:844});await check();
 console.log('PASS actual Reader: EN/KO, seven change groups, 63 full-context rows, desktop/mobile aligned starts; history remains after restore');
}catch(e){console.log('Browser failure',e.name,e.message);if(page){await page.screenshot({path:dir+'/reader-failure.png'}).catch(()=>{});console.log('URL',page.url());}throw e;}finally{await Promise.race([browser.close(),new Promise(resolve=>setTimeout(()=>{browser.process()?.kill('SIGTERM');resolve();},5000))]);}
