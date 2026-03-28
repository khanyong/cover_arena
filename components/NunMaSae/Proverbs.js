import React from 'react';

const BIRDS = [
  {
    name: '피를 마시는 새',
    desc: '가장 오래 사는 새입니다. 피비린내 때문에 아무도 그 새의 곁으로 오지 않아서 외롭지만, 누구보다 가장 강인하고 끈질기게 살아남습니다.',
    color: 'from-[#8b0000] to-[#5d1c1c]',
    icon: '🦅'
  },
  {
    name: '눈물을 마시는 새',
    desc: '가장 일찍 죽는 새입니다. 남의 눈물을 마시기에 그 슬픔과 고통에 짓눌려 단명하지만, 그 노래 소리는 모든 새들 중 가장 아름답습니다.',
    color: 'from-[#194b75] to-[#0f2d47]',
    icon: '🕊️'
  },
  {
    name: '물을 마시는 새',
    desc: '가장 빨리 나는 새입니다. 무색무취한 물처럼 아무런 집착도 얽매임도 없기 때문에 하늘을 가볍고 자유롭게 날 수 있습니다.',
    color: 'from-[#607d8b] to-[#455a64]',
    icon: '🦢'
  },
  {
    name: '독을 마시는 새',
    desc: '추가적인 비유로 언급되는 개념. 그 끔찍한 고통에도 불구하고 스스로 독을 품고 나아가는 자들에 대한 은유입니다.',
    color: 'from-[#2e5b4b] to-[#1a332a]',
    icon: '🦉'
  }
];

const QUOTES = [
  {
    text: "왕은 눈물을 마시는 새요. 가장 화려하고 아름답지만, 가장 빨리 죽소.",
    speaker: "케이건 드라카",
    context: "아라짓 왕국과 희생의 본질을 논하며"
  },
  {
    text: "나는 어디에도 없는 신의 노리개다.",
    speaker: "케이건 드라카",
    context: "가장 절망적인 순간, 자신의 처지를 한탄하며"
  },
  {
    text: "사람들이 이렇다. 어떤 우울한 결론이 나오면 그것이 진짜라고 믿어 버려. 그것이 비극이니까. 비극은 진실같아 보이지.",
    speaker: "비형 스라블",
    context: "즈믄누리의 도깨비로서 세상을 바라보는 시각"
  },
  {
    text: "나는 당신들의 신을 믿지 않소. 하지만 당신들의 노래는 믿소.",
    speaker: "티나한",
    context: "레콘의 숙원인 하늘치를 목전에 두고 구출대에 대한 결의를 보이며"
  }
];

export default function Proverbs() {
  return (
    <div className="p-4 md:p-8 font-serif">
      <div className="mb-14 text-center">
        <h2 className="text-4xl font-extrabold mb-5" style={{ color: '#5d1c1c' }}>형제새의 전설과 어록</h2>
        <p className="text-lg text-[#5c4a3d] max-w-3xl mx-auto leading-relaxed">
          판타지 서사시의 기저를 이루는 철학적인 명언들입니다.
          어느 현자가 남긴 오래된 양피지 조각에 각인된 '네 마리의 새'와 대적자들의 말을 조명합니다.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* The Four Birds Section */}
        <h3 className="text-3xl font-black text-[#3e2723] mb-8 border-l-[6px] border-[#a37222] pl-4 tracking-wide shadow-sm">네 마리의 형제새</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-20">
          {BIRDS.map((bird, idx) => (
            <div key={idx} className={`bg-gradient-to-b ${bird.color} p-1.5 shadow-[2px_10px_20px_rgba(93,64,55,0.25)] transform hover:scale-105 transition-transform duration-300 cursor-pointer`}>
              <div className="bg-[#fff9f0] bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] h-full w-full p-6 flex flex-col justify-center text-center relative overflow-hidden group border-2 border-[#e6d5b8]">
                
                {/* 배경 워터마크 새 아이콘 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10 group-hover:opacity-20 transition-opacity drop-shadow-md">
                  {bird.icon}
                </div>
                
                <h4 className="text-xl font-bold text-[#5d1c1c] mb-4 z-10 tracking-wider font-serif">{bird.name}</h4>
                <div className="w-12 h-0.5 bg-[#d4c3b3] mx-auto mb-4 z-10"></div>
                
                <p className="text-[#4a3627] font-medium text-[0.9rem] leading-7 w-full whitespace-normal z-10">{bird.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quotes Section */}
        <h3 className="text-3xl font-black text-[#3e2723] mb-8 border-l-[6px] border-[#a37222] pl-4 tracking-wide shadow-sm">오래된 어록</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {QUOTES.map((quote, idx) => (
            <div key={idx} className="bg-[#fdf6e3] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] p-8 rounded-sm shadow-[0_5px_15px_rgba(62,39,35,0.08)] relative border-[3px] border-double border-[#d7ccc8]">
              
              <div className="absolute -top-7 -left-3 text-7xl text-[#c5a059] opacity-40 select-none font-serif">“</div>
              
              <blockquote className="text-xl italic text-[#3e2723] mb-8 leading-9 mt-4 z-10 relative">
                {quote.text}
              </blockquote>
              
              <div className="flex items-end justify-between border-t border-dashed border-[#d4c3b3] pt-5">
                <div className="flex flex-col">
                  <span className="text-[#8b0000] font-black tracking-widest uppercase text-sm">{quote.speaker}</span>
                  <span className="text-[#8d6e63] font-medium text-xs mt-1 italic">{quote.context}</span>
                </div>
                {/* 깃펜 아이콘 장식 */}
                <div className="text-3xl opacity-70 filter sepia">
                  ✒️
                </div>
              </div>

            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
