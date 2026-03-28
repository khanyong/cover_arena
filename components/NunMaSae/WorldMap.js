import React, { useState } from 'react';

const LOCATIONS = [
  {
    name: '키보렌 (Kiboren)',
    subtitle: '나가들의 영토, 남부의 거대한 밀림',
    desc: '세상의 절반 이상을 뒤덮고 있는 거대한 밀림이자 나가들의 터전. 다른 종족들에게는 식인 식물과 맹수들이 우글거리는 마경으로 인식되나, 나가들에게는 생명의 요람이다. 햇빛이 바닥에 닿지 않을 정도로 울창하다.',
    images: ['/images/nun-ma-sae/kiboren.png'],
    type: '대륙'
  },
  {
    name: '하인샤 대사원 (Hainsya Temple)',
    subtitle: '파괴됨 없는 숭고한 성역',
    desc: '"어디에도 없는 신"을 모시는 북부 최대의 대사원. 구출대의 결성부터 온갖 위대한 사상의 원류가 되는 곳이며, 수천 명의 승려 대중들이 거주하는 장엄한 구역이다.',
    images: ['/images/nun-ma-sae/hainsya.png'],
    type: '성역'
  },
  {
    name: '마지막 주막',
    subtitle: '한계선 이북의 첫 안식처',
    desc: '키보렌의 끔찍한 정글과 한계선의 추위를 넘어온 여행자들을 가장 먼저 맞이해주는 상징적인 장소. 수많은 모험가와 상인, 이스시(뱀) 사냥꾼들이 거쳐가는 만남의 광장이다.',
    images: ['/images/nun-ma-sae/last_inn.png'],
    type: '거점'
  },
  {
    name: '유료도로당',
    subtitle: '세상에서 가장 평평한 사설 도로',
    desc: '산과 계곡이 가로막더라도 놀라운 기술력으로 그 위를 평탄하게 뚫어버린 거대한 도로 시스템. 요금을 내면 평화롭고 신속한 통행을 보장받으나 요금을 내지 않는 칩입자에게는 자비 없는 무력을 투사한다.',
    images: ['/images/nun-ma-sae/toll_road.png'],
    type: '거점'
  },
  {
    name: '바이소 산 & 최후의 대장간',
    subtitle: '레콘 무기의 산실',
    desc: '북부에 위치한 웅장하고 거대한 산맥과 그 안에 뚫려 있는 불가사의한 화산 분화구 지대. 뜨거운 증기와 용암을 이겨내며 쇳물을 쳐서 레콘들의 숙원인 별철 무기를 벼려내는 "최후의 대장간"이 숨 쉬고 있다.',
    images: [
      '/images/nun-ma-sae/baiso_mt.png',
      '/images/nun-ma-sae/last_forge.png'
    ],
    type: '지형'
  },
  {
    name: '한계선 (Limit Line)',
    subtitle: '북부와 남부를 가르는 결계',
    desc: '키보렌 북쪽 가장자리를 따라 형성된 눈과 얼음의 경계선. 변온동물 체질인 나가는 이 선을 넘으면 체온이 떨어져 활동이 매우 제한되기에, 수백 년 동안 남북간의 자연스러운 군사적 완충지대 역할을 하였다.',
    images: ['https://picsum.photos/seed/limitline/600/400'],
    type: '경계'
  },
  {
    name: '하텐그라쥬',
    subtitle: '나가 사회의 중심, 심장탑',
    desc: '키보렌 내에서 가장 거대하고 중요한 나가들의 수도. 성인식을 맞이한 나가들의 심장을 적출하여 보관하는 신성한 "심장탑"이 있으며, 수호자들과 가문들이 모여 권력을 다투는 심장부이다.',
    images: ['https://picsum.photos/seed/haten/600/400'],
    type: '수도'
  },
  {
    name: '즈믄누리',
    subtitle: '도깨비 성주가 다스리는 요새',
    desc: '구출대에 참가한 비형 스라블의 고향. 평화롭고 낙천적인 도깨비들의 거처이자, 과거 즈믄누리 성주가 구축한 강력하고 상상을 초월하는 방어 기믹들로 이루어진 난공불락의 성이다.',
    images: ['https://picsum.photos/seed/jeumeun/600/400'],
    type: '성채'
  }
];

// 캐러셀 이미지 컴포넌트
function ImageCarousel({ images, altName }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full h-full relative group bg-black">
      <img 
        src={images[currentIndex]} 
        alt={`${altName} - ${currentIndex + 1}`} 
        className="w-full h-full object-cover filter sepia-[.15] contrast-100 hover:sepia-0 hover:scale-105 transition-all duration-700"
        loading="lazy"
      />
      
      {/* 사진 개수 인디케이터 */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full border border-white/50 ${i === currentIndex ? 'bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]' : 'bg-black/60'}`}
            />
          ))}
        </div>
      )}

      {/* 좌우 버튼 */}
      {images.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            &#10094;
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            &#10095;
          </button>
        </>
      )}
    </div>
  );
}

export default function WorldMap() {
  return (
    <div className="p-4 md:p-8 font-serif">
      <div className="mb-14 text-center">
        <h2 className="text-4xl font-extrabold mb-5" style={{ color: '#5d1c1c' }}>아라짓 지리 고문서</h2>
        <p className="text-lg text-[#5c4a3d] max-w-3xl mx-auto leading-relaxed">
          먼 옛날 탐험가들이 양피지 두루마리에 섬세한 잉크 펜슬로 기록해 둔 웅대하고 가혹한 세계지도와 
          비밀스러운 장소들의 삽화 기록입니다. 여러 장의 삽화가 있는 경우 화살표를 눌러 넘겨보세요.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* 아날로그 액자 맵 컨테이너 */}
        <div className="relative w-full h-80 md:h-[500px] mb-14 border-[6px] border-[#8c7456] shadow-[0_10px_20px_rgba(93,64,55,0.2)] rounded-sm group overflow-hidden bg-black">
          <img 
            src="/images/nun-ma-sae/world_map.png" 
            alt="눈마새 세계지도" 
            className="w-full h-full object-cover filter contrast-125 sepia-[.1] duration-1000 origin-center cursor-crosshair transform hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a1b14] via-transparent to-transparent opacity-80 pointer-events-none"></div>
          
          <div className="absolute bottom-8 left-10 border-l-[3px] border-[#daaa6c] pl-5 pointer-events-none">
            <h3 className="text-4xl font-black text-[#fdf6e3] mb-2 tracking-widest text-shadow-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">아라짓의 대지</h3>
            <p className="text-[#e2c7a1] font-semibold text-sm uppercase tracking-widest drop-shadow-md">공식 세계지도 원본 문서 탑재 완료</p>
          </div>
        </div>

        {/* Locations List (오래된 우편엽서 / 삽화 카드 컨셉) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {LOCATIONS.map((loc, idx) => (
            <div key={idx} className="flex flex-col md:flex-row bg-[#fbf5e9] rounded-sm overflow-hidden border border-[#d4c3b3] shadow-lg hover:shadow-[0_8px_25px_rgba(93,64,55,0.15)] transition-shadow">
              
              <div className="md:w-5/12 h-64 md:h-auto overflow-hidden relative border-b-2 md:border-b-0 md:border-r-2 border-dashed border-[#d4c3b3]">
                {/* 갤러리 슬라이더 이식 */}
                <ImageCarousel images={loc.images} altName={loc.name} />
                <div className="absolute top-4 left-4 bg-[#fdf6e3]/90 px-3 py-1 rounded-sm text-xs text-[#8b0000] font-black border border-[#d4c3b3] shadow-[2px_2px_0px_rgba(93,64,55,0.1)] z-10 pointer-events-none">
                  {loc.type}
                </div>
              </div>

              <div className="p-7 md:w-7/12 flex flex-col justify-center bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] relative z-10">
                <h4 className="text-2xl font-black text-[#5d1c1c] mb-2">{loc.name}</h4>
                <div className="text-xs font-bold text-[#8d6e63] mb-5 tracking-widest uppercase">{loc.subtitle}</div>
                <p className="text-[#3e2723] text-[0.95rem] leading-[1.8] font-medium whitespace-pre-line flex-1">
                  {loc.desc}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
