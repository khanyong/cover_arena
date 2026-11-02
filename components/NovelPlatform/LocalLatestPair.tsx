import React from 'react';
import {BilingualBlockText} from './NovelBilingualReader';
export function LatestReadingStatus({pair}:{pair:any}){
 return <span role="status" className="block my-3 text-sm text-sky-200" data-latest-pair={pair.pairId}>
  최신 D1 · 국문 채택됨 · 영문 대조 검토 중 · 로컬 열람 연결 (정식 DB 등록 미완료)
 </span>;
}
export default function LocalLatestPair({pair}:{pair:any}){
 return <section aria-label="최신 D1 영한 비교"><LatestReadingStatus pair={pair}/>
  <div className="grid grid-cols-2 gap-6 font-bold"><span>국문 · 채택본</span><span>English · 검토 중</span></div>
  {pair.paragraphs.map((p:any,i:number)=><article key={i} className="grid grid-cols-2 gap-6 border-t border-zinc-800 py-4" data-latest-position={i+1}>
   <div data-latest-language="ko" data-latest-source={p.ko}><BilingualBlockText body={p.ko}/></div>
   <div data-latest-language="en" data-latest-source={p.en}><BilingualBlockText body={p.en}/></div>
  </article>)}
 </section>;
}
