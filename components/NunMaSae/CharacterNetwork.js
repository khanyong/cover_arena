import React, { useState } from 'react';

const CHARACTERS = [
  {
    name: '케이건 드라카',
    race: '인간',
    title: '키탈저 사냥꾼',
    desc: '구출대의 길잡이. 아내인 여름을 나가에게 잃고 생나가를 산 채로 씹어먹는 전설적인 키탈저 사냥꾼이 되었다. 냉철하고 과묵하며 고대 아라짓어에 능통하다.',
    images: [
      '/images/nun-ma-sae/kaygan_1.png',
      '/images/nun-ma-sae/kaygan_2.png',
      '/images/nun-ma-sae/kaygan_3.png',
      '/images/nun-ma-sae/kaygan_4.png'
    ],
    relations: ['여름(아내/사별)', '륜 페이(구출대상)', '티나한(동료)']
  },
  {
    name: '티나한',
    race: '레콘',
    title: '대적자',
    desc: '구출대의 대적자. 모든 숙원 중 으뜸이라 불리는 하늘치 발굴을 평생의 목표로 삼은 호탕한 거인. 물을 두려워하지만 동료를 위해 두려움을 극복하곤 한다.',
    images: [
      '/images/nun-ma-sae/tinahan_1.jpg',
      '/images/nun-ma-sae/tinahan_2.png'
    ],
    relations: ['별철 무기(상징)', '케이건(길잡이)', '비형(동료)']
  },
  {
    name: '비형 스라블',
    race: '도깨비',
    title: '요술쟁이',
    desc: '구출대의 요술쟁이. 즈믄누리의 성주를 모시며 밝고 쾌활하다. 불을 자유자재로 다루는 엄청난 위력을 가졌으나 피를 보면 기절할 정도로 극단적인 평화주의자이다.',
    images: [
      '/images/nun-ma-sae/bihyung_1.png',
      '/images/nun-ma-sae/bihyung_2.png'
    ],
    relations: ['즈믄누리 성주(군주)', '케이건(동료)', '티나한(동료)']
  },
  {
    name: '륜 페이',
    race: '나가',
    title: '도망자',
    desc: '구출대가 한계선에서 맞이해야 하는 유일한 구출 대상 나가 소년. 심장 적출의 의식을 거부하고 쫓기고 있으며, 향후 아라짓 왕국의 비밀을 쥐게 될 잠재력을 가졌다.',
    images: [
      '/images/nun-ma-sae/ryun_pei.png'
    ],
    relations: ['사모 페이(누이/원수)', '케이건(구조자 및 공포의 대상)']
  },
  {
    name: '사모 페이',
    race: '나가',
    title: '군단장',
    desc: '륜 페이의 친누나이자 나가 사회 최강의 전사 중 하나. 전통적인 나가의 관습에 따라 적출을 피한 동생의 심장을 뺏어야 하는 입장이 되며, 북부 정벌의 선봉장이 된다.',
    images: [
      '/images/nun-ma-sae/samo_pei.png',
      '/images/nun-ma-sae/Amo_Paye1.png',
      '/images/nun-ma-sae/Amo_Paye2.png'
    ],
    relations: ['륜 페이(남동생)', '갈로텍(정적/협력자)']
  },
  {
    name: '오레놀 대덕',
    race: '인간',
    title: '하인샤 대사원 승려',
    desc: '하인샤 대사원의 최고위 승려로 세계의 변화를 읽어내어 세 종족으로 이루어진 구출대 결성을 발의한 존경받는 인물이다.',
    images: [
      '/images/nun-ma-sae/orenol.png'
    ],
    relations: ['어디에도 없는 신(섬기는 신)', '구출대(명령 하달)']
  },
  {
    name: '규리하 변경백',
    race: '인간',
    title: '북부의 실력자',
    desc: '북부 대륙 규리하 가문을 다스리는 백작. 냉혹한 결단력과 강력한 카리스마를 지녔으며, 나가의 침공 방어 등 군사적인 면에서 핵심적인 역할을 맡는다.',
    images: [
      '/images/nun-ma-sae/gyuriha.png'
    ],
    relations: ['아라짓 왕국(충성)', '사모 페이(적군)']
  },
  {
    name: '아스화리탈',
    race: '용',
    title: '식물을 다루는 자',
    desc: '전설 속의 고대 생물. 인간형 변이가 가능하며 모든 대자연과 식물의 만개, 피어남을 조율하는 신비로운 힘을 지녔지만 어떤 비운의 사건을 겪게 된다.',
    images: [
      '/images/nun-ma-sae/ashwarital.png'
    ],
    relations: ['마루나래(유사체)', '케이건(관찰자)']
  },
  {
    name: '대호왕',
    race: '인간',
    title: '전설의 왕',
    desc: '과거 세 선민종족을 규합하여 옛 아라짓 왕국을 건국했던 전설상의 군주. 호랑이를 타고 다녔다는 구전 기록이 있으며, 현재 비어있는 왕좌의 원주인.',
    images: [
      'https://picsum.photos/seed/king/600/600'
    ],
    relations: ['어디에도 없는 신(수호신)', '아라짓 전사들']
  }
];

// 캐러셀 썸네일 전용 컴포넌트
function ImageCarousel({ images, altName, onOpenModal }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = (e) => {
    e.stopPropagation(); 
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation(); 
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="relative h-64 overflow-hidden border-b-2 border-[#d4c3b3] p-1 bg-[#efe0c8] group cursor-zoom-in"
      onClick={() => onOpenModal(currentIndex)}
    >
      <img 
        src={images[currentIndex]} 
        alt={`${altName} - ${currentIndex + 1}`} 
        className="w-full h-full object-cover object-top filter sepia-[.2] contrast-125 hover:sepia-0 group-hover:scale-105 transition-all duration-700 rounded-sm"
        loading="lazy"
      />
      
      {/* 우상단 확대 돋보기 아이콘 힌트 */}
      <div className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
        🔍
      </div>
      
      {/* 사진 개수 인디케이터 */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full border border-white/50 ${i === currentIndex ? 'bg-white' : 'bg-black/40'}`}
            />
          ))}
        </div>
      )}

      {/* 좌우 버튼 */}
      {images.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            &#10094;
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            &#10095;
          </button>
        </>
      )}
    </div>
  );
}

// 전역 모달 뷰포트
function FullscreenModal({ data, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(data.index);
  const { images, altName } = data;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 cursor-zoom-out animate-fade-in"
      onClick={onClose}
    >
      <div className="relative max-w-7xl w-full flex flex-col items-center animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <img 
          src={images[currentIndex]} 
          alt={`${altName} - 원본`} 
          className="max-w-full max-h-[85vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-[#8c7456] rounded-sm bg-[#1a1412]"
        />
        
        {/* 타이틀 및 닫기 */}
        <div className="absolute -top-12 left-0 right-0 flex justify-between items-center text-[#eaddc5]">
          <span className="text-xl font-bold font-serif tracking-widest bg-black/50 px-3 py-1 rounded-sm">{altName}</span>
          <button 
            className="text-4xl hover:text-white transition-colors cursor-pointer w-10 h-10 flex items-center justify-center bg-black/50 rounded-full"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* 모달용 좌우 컨트롤 */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="fixed left-2 md:left-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 border border-white/20 text-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center backdrop-blur-sm text-2xl transition-all shadow-lg"
            >
              &#10094;
            </button>
            <button 
              onClick={handleNext}
              className="fixed right-2 md:right-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 border border-white/20 text-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center backdrop-blur-sm text-2xl transition-all shadow-lg"
            >
              &#10095;
            </button>
            <div className="text-white/60 font-serif tracking-widest text-sm mt-4">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CharacterNetwork() {
  const [modalData, setModalData] = useState(null);

  return (
    <>
    <div className="p-4 md:p-8 font-serif">
      <div className="mb-14 text-center">
        <h2 className="text-4xl font-extrabold mb-4" style={{ color: '#5d1c1c' }}>인물 도감</h2>
        <p className="text-[#5c4a3d] max-w-2xl mx-auto text-lg leading-relaxed">
          고대 서고의 보관소에서 끄집어낸 위대한 등장인물들의 생생한 기록표입니다. 
          사진에 마우스를 올리면 좌우 화살표(&#10094; &#10095;)를 눌러 여러 스케치를 넘겨볼 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {CHARACTERS.map((char, index) => (
          <div key={index} className="bg-[#fcf8e8] rounded-none overflow-hidden shadow-lg border-2 border-[#d4c3b3] hover:border-[#8b3a3a] hover:-translate-y-1 transition-all duration-300 flex flex-col relative before:absolute before:inset-0 before:border before:border-[#bba382] before:m-1 before:pointer-events-none">
            
            {/* 고풍스러운 초상화 프레임 (캐러셀) */}
            <ImageCarousel images={char.images} altName={char.name} onOpenModal={(idx) => setModalData({ images: char.images, index: idx, altName: char.name })} />
            
            {/* 종족 뱃지 귀족풍 */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-[#fffdf0] text-[#5d1c1c] border border-[#a37222] text-xs font-bold uppercase shadow-[2px_2px_5px_rgba(0,0,0,0.2)] z-10 pointer-events-none">
              {char.race}
            </div>

            <div className="p-7 flex-1 flex flex-col z-10 relative bg-[#fcf8e8]">
              <div className="mb-1 text-[#a37222] font-black text-xs tracking-widest">{char.title}</div>
              <h3 className="text-2xl font-black text-[#3e2723] mb-4">{char.name}</h3>
              
              <p className="text-[#4a3627] text-sm leading-8 flex-1">
                {char.desc}
              </p>

              {/* 하단 관계망 서류 마감 느낌 */}
              <div className="border-t-[1.5px] border-dashed border-[#bba382] pt-5 mt-6">
                <h4 className="text-xs text-[#8d6e63] uppercase tracking-widest mb-3 font-bold">주요 관계망 (Relations)</h4>
                <div className="flex flex-wrap gap-2">
                  {char.relations.map((rel, rIdx) => (
                    <span key={rIdx} className="text-xs bg-[#f4e6d3] border border-[#c5b399] text-[#5d4037] px-2 py-1 shadow-sm font-semibold">
                      {rel}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div> {/* 누락된 최상위 div 닫기 */}

    {/* 포털 없이 최상위 레이아웃에서 독립적으로 그리는 모달 컨테이너 */}
      {modalData && (
        <FullscreenModal data={modalData} onClose={() => setModalData(null)} />
      )}
    </>
  );
}
