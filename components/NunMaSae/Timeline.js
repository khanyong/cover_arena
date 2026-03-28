import React from 'react';

const TIMELINE_DATA = [
  {
    year: '태초',
    title: '네 선민종족의 탄생',
    desc: '신성한 네 신(어디에도 없는 신, 발자국 없는 여신, 모든 이보다 낮은 여신, 자신을 죽이는 신)에 의해 인간, 나가, 레콘, 도깨비가 탄생하다.',
    type: 'myth'
  },
  {
    year: '약 1000년 전',
    title: '옛 아라짓 왕국과 영웅왕',
    desc: '영웅왕이 나타나 아라짓 왕국을 건국하고 북부를 통일하다. 무력과 지혜로 나가의 침공을 일시적으로 막아내었으나, 이후 왕국의 쇠퇴와 함께 전설로 남게 된다.',
    type: 'history'
  },
  {
    year: '제1차 대확장 전쟁',
    title: '나가들의 북상과 한계선 형성',
    desc: '심장 적출법을 통해 반불사의 몸이 된 나가 종족이 북부로 영토 확장을 시도하다. 혹독한 추위 등 환경적 요인으로 한계선(Limit Line)이 설정되며 북부와 남부가 나뉘다.',
    type: 'history'
  },
  {
    year: '본편 시작',
    title: '하인샤 대사원의 호출',
    desc: `세계의 위기를 감지한 하인샤 대사원은 세 명의 구출대(인간 케이건 드라카, 레콘 티나한, 도깨비 비형 스라블)를 남부 한계선으로 보내 '단 한 명의 나가'를 데려오라는 임무를 내린다.`,
    type: 'event'
  },
  {
    year: '남하 완료 및 조우',
    title: '륜 페이와의 조우',
    desc: '구출대는 남하 중 쫓기는 신세가 된 나가 소년 \'륜 페이\'를 만난다. 륜은 심장 적출을 거부하고 도망친 도망자였으며, 세계를 바꿀 운명을 짊어지고 있었다.',
    type: 'event'
  },
  {
    year: '본편 진행',
    title: '제2차 대확장 전쟁 발발',
    desc: '사모 페이가 이끄는 나가 군단이 북부를 향해 대대적인 침공을 개시하며 제2차 대확장 전쟁이 시작된다. 구출대는 왕을 찾기 위한 험난한 여정을 떠난다.',
    type: 'event'
  }
];

export default function Timeline() {
  return (
    <div className="p-4 md:p-8 font-serif">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black mb-4 tracking-tight" style={{ color: '#5d1c1c' }}>발자취 타임라인 (연대기)</h2>
        <p className="text-lg text-[#5c4a3d] max-w-2xl mx-auto leading-relaxed">
          태초의 신화부터 제2차 대확장 전쟁까지, 눈물을 마시는 새 세계관의 주요 역사적 흐름과 
          구출대의 험난한 여정을 기록한 고서적 연대기 양피지입니다.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto py-8">
        {/* 중앙선 (잉크 줄 긋기 느낌) */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-[#c5b399] transform md:-translate-x-1/2 shadow-sm rounded-full"></div>
        
        {TIMELINE_DATA.map((item, idx) => (
          <div key={idx} className={`relative flex items-center justify-between mb-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} flex-col md:flex-row`}>
            
            {/* 타이밍 인장 (인장 도장 느낌) */}
            <div className="absolute left-4 md:left-1/2 w-5 h-5 rounded-full border-[3px] border-[#fbf4eb] shadow-md transform -translate-x-2 md:-translate-x-1/2 z-10" 
                 style={{ backgroundColor: item.type === 'myth' ? '#5a4674' : item.type === 'history' ? '#8b2e2e' : '#2e5b4b' }}>
            </div>

            {/* 날짜 컨테이너 */}
            <div className="w-full md:w-5/12 ml-14 md:ml-0 hidden md:block">
              <span className={`block font-bold text-xl ${idx % 2 === 0 ? 'text-left pl-10' : 'text-right pr-10'}`} style={{ color: '#7a5230' }}>
                {item.year}
              </span>
            </div>

            {/* 컨텐츠 카드 (양피지 문서 조각) */}
            <div className="w-full ml-14 md:ml-0 md:w-5/12 mt-2 md:mt-0 relative">
              <div className="p-7 rounded-md bg-[#fffcf3] border-2 border-[#e6d5b8] shadow-[2px_4px_10px_rgba(93,64,55,0.08)] hover:shadow-[4px_6px_15px_rgba(139,0,0,0.1)] transition-shadow duration-300 relative overflow-hidden group">
                
                {/* 카드 우측 상단 오래된 접힌 종이 효과 장식 */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#e6d5b8] to-transparent opacity-50 border-l border-b border-[#e6d5b8] rounded-bl-lg"></div>

                <div className="md:hidden block mb-3 font-bold text-[#7a5230] border-b border-dashed border-[#d4c3b3] pb-2">{item.year}</div>
                <h3 className="text-2xl font-bold mb-3 text-[#3e2723] group-hover:text-[#8b0000] transition-colors">{item.title}</h3>
                <p className="text-[#5d4037] leading-relaxed text-base">
                  {item.desc}
                </p>
                
                <div className="mt-5 inline-block px-3 py-1 rounded text-xs font-bold bg-[#f3e5d8] text-[#8b4513] border border-[#d4c3b3] uppercase tracking-widest">
                  {item.type}
                </div>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
