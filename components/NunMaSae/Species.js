import React from 'react';

const SPECIES = [
  {
    name: '인간 (Human)',
    god: '어디에도 없는 신',
    element: '바람',
    features: [
      '신체적 능력이 가장 약하나 개체수가 가장 많음',
      '다른 종족과 달리 "왕"이라는 구심점을 끊임없이 갈망함',
      '말과 바람을 상징하며, 발자취를 남기지 않으려 함'
    ],
    color: 'from-[#607d8b] to-[#78909c]',
    icon: '🌬️'
  },
  {
    name: '레콘 (Recon)',
    god: '모든 이보다 낮은 여신',
    element: '땅',
    features: [
      '인간보다 2배 이상 거대한 조류형 거인 (닭, 독수리 등)',
      '태어나며 부여받은 별철(성철) 무기를 평생 동안 소지함',
      '지구상의 어떤 물질보다 강하나, 물을 극한의 공포로 여김'
    ],
    color: 'from-[#795548] to-[#8d6e63]',
    icon: '🪨'
  },
  {
    name: '도깨비 (Dokkaebi)',
    god: '자신을 죽이는 신',
    element: '불',
    features: [
      '피를 극도로 두려워하는 피 공포증(Hemophobia) 집단',
      '불을 다루는 데 천부적인 재능이 있어 파멸적인 위력을 냄',
      '죽은 후 "어르신"이라는 불멸의 정령이 되어 즈믄누리를 지킴'
    ],
    color: 'from-[#6a1b9a] to-[#8e24aa]',
    icon: '🔥'
  },
  {
    name: '나가 (Naga)',
    god: '발자국 없는 여신',
    element: '물',
    features: [
      '파충류 기반 반인반사(半人半蛇)로 밀림인 "키보렌"에 서식',
      '변온동물이며 추위를 못 견디고 북부를 두려워함 (한계선)',
      '성인식 때 심장을 적출(심장탑)하여 반불사의 생명력을 얻음',
      '육성 언어 대신 "니름"이라는 텔레파시로 소통함'
    ],
    color: 'from-[#004d40] to-[#00695c]',
    icon: '💧'
  }
];

export default function Species() {
  return (
    <div className="p-4 md:p-8 font-serif">
      <div className="mb-14 text-center">
        <h2 className="text-4xl font-extrabold mb-5" style={{ color: '#5d1c1c' }}>4대 선민명족 고문서</h2>
        <p className="text-lg text-[#5c4a3d] max-w-3xl mx-auto leading-relaxed">
          과거의 학자들이 집대성한 "눈물을 마시는 새" 세계관의 4가지 고유 종족 설정표입니다. 
          오래된 도서관의 비밀스런 서고에서 꺼내어진 듯한 종족들의 치명적인 약점과 강점을 열람하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {SPECIES.map((spec, idx) => (
          <div key={idx} className="bg-[#fff9f0] rounded-sm overflow-hidden shadow-xl border border-[#d4c3b3] hover:border-[#a37222] transition-colors duration-500 group relative">
            
            {/* 고서적 가죽 바인딩 느낌의 상단 헤더 */}
            <div className={`h-36 bg-gradient-to-r ${spec.color} p-7 flex items-end justify-between relative overflow-hidden border-b-4 border-[#3e2723]`}>
              
              {/* 장식 패턴 */}
              <div className="absolute inset-0 opacity-10 background-pattern-bookshelf" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cartographer.png')"}}></div>

              <div className="absolute top-4 right-8 text-7xl opacity-20 transform group-hover:scale-110 transition-transform duration-500 saturate-50">
                {spec.icon}
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-[#fffdf0] mb-2 tracking-wide text-shadow-md">{spec.name}</h3>
                <div className="text-[#eaddc5] text-sm font-bold tracking-widest uppercase">
                  주관원소 : {spec.element}
                </div>
              </div>
            </div>

            <div className="p-8 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
              <div className="mb-7 pb-4 border-b-2 border-dashed border-[#d4c3b3] flex justify-between items-center">
                <span className="text-[#8d6e63] font-black uppercase tracking-widest text-sm">섬기는 신 (Deity)</span>
                <span className="text-[#8b0000] font-extrabold text-xl font-serif">{spec.god}</span>
              </div>
              
              <h4 className="text-[#5d4037] font-bold uppercase tracking-widest text-sm mb-5">종족 문헌 해설</h4>
              <ul className="space-y-5">
                {spec.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start text-[#3e2723] leading-7 font-medium">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#bd4b24] mt-2 mr-4 flex-shrink-0 shadow-sm border border-[#7c1a1a]"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 고서적 인장 마크 */}
            <div className="absolute bottom-4 right-6 opacity-5 font-serif text-8xl pointer-events-none text-[#5d1c1c]">
              §
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
