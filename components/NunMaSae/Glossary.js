import React, { useState } from 'react';

const GLOSSARY_CHAPTERS = [
  {
    chapterId: 'chapter_1',
    chapterTitle: '제1장 구출대',
    terms: [
      {
        term: '하텐그라쥬 (Hatengraju)',
        pronunciation: '[하텐-그라쥬]',
        definition: '나가들의 고향이자 정신적, 군사적 중심이 되는 거대 도시. 수많은 층으로 이루어진 입체적 도시망을 구축하고 있으며, 성인식을 치르고 적출된 심장을 안전하게 보관하는 절대 성역 "심장탑"이 존재한다.'
      },
      {
        term: '륜 페이 (Ryun Pei)',
        pronunciation: '[륜 페이]',
        definition: '사모 페이의 친동생인 나가 소년. 하텐그라쥬에서의 심장 적출 성인식을 앞두고 의문의 살인 누명을 써 키보렌을 탈출하게 된 "도망자". 온대 지방에서의 추위를 못 견디는 나가의 특성에도 불구하고 구출대와 함께 북상하는 핵심 인물.'
      },
      {
        term: '화리트 (Hwarit)',
        pronunciation: '[화리트]',
        definition: '륜 페이의 친우이자 전도유망한 젊은 나가. 륜의 누명과 암살 사건의 시발점이 되는 비운의 인물로, 륜이 도망의 길을 택하게 된 결정적인 기폭제가 된다.'
      },
      {
        term: '페시론 섬 (Peshiron Island)',
        pronunciation: '[페시론 섬]',
        definition: '키보렌 인근 해역에 있는 섬. 작중에서 구출대와 륜 페이 일행의 이동 경로에 얽힌 중요 지점.'
      },
      {
        term: '아킨스로우 협곡 (Akinsrow Canyon)',
        pronunciation: '[아킨스로우 협곡]',
        definition: '가파른 절벽과 험난한 지형으로 이루어진 험로. 키보렌 내부에서 이동하거나 검문망을 피할 때 이용되는 지리적 요충지이며 나가들의 추격대가 도달하기 힘든 환경을 자랑한다.'
      },
      {
        term: '키보렌 (Kiboren)',
        pronunciation: '[키보렌]',
        definition: '하텐그라쥬를 품광 세계의 절반을 뒤덮은 남부의 거대 열대 우림. 나무 꼭대기가 숲 바닥에 햇빛조차 허락하지 않아 "대지를 떠난 숲"이라고 불린다. 독사, 식인 식물, 표범 등 온갖 치명적인 생태계로 이루어져 있어 타 종족에게는 마경 그 자체다.'
      },
      {
        term: '레콘 (Recon)',
        pronunciation: '[레콘]',
        definition: '4대 선민종족 중 하나. 거대한 수탉, 독수리 형태를 한 반인반조 거인족. 모든 물질 중 가장 가볍고 단단한 "별철"을 제련한 평생 무기를 다루며, 군대조차 혈혈단신으로 격파하는 무력을 지녔다. 단, 생리적으로 "물"을 극도로 공포하는 약점이 있다.'
      },
      {
        term: '케이건 드라카 (Kaygan Draka)',
        pronunciation: '[케이건 드라카]',
        definition: '인간 길잡이이자 전설적인 "키탈저 사냥꾼". 아내 "여름"을 나가에게 잃은 복수심 하나로 수십 년간 숲의 생나가를 사냥하며 살아온 인간이다. 아라짓어(고대어)에 능통하며, 무기로는 불길을 뿜어내는 수천 년 된 고대 검 "바라기"를 지니고 있다.'
      },
      {
        term: '푼텐 사막 (Punten Desert)',
        pronunciation: '[푼텐 사막]',
        definition: '대륙의 지형 중 극도로 메마르고 뜨거운 거대 사막지대. 생명체가 버티기 힘든 기후로 인해 종족들의 물리적 교류나 진군을 차단하는 자연적인 장벽 역할을 한다.'
      },
      {
        term: '카라보라 (Karabora)',
        pronunciation: '[카라보라]',
        definition: '작중 언급되는 주요 지역 및 요새 주변부 지명.'
      },
      {
        term: '샤나가 성 (Shanaga Castle)',
        pronunciation: '[샤나가 성]',
        definition: '소설 내 주요 거점이 되는 성채 지역.'
      },
      {
        term: '심장탑 (Heart Tower)',
        pronunciation: '[심장탑]',
        definition: '나가들이 일정 연령에 다다르면 심장 적출식(성인식)을 치르고 얻은 수만 개의 적출된 심장을 모종의 약물과 함께 영구히 보관하는 철옹성. 심장탑이 파괴되지 않는 한 적출된 나가는 물리적으로 거의 불사에 가까운 재생력을 지닌다.'
      },
      {
        term: '니름 (Neam)',
        pronunciation: '[니름]',
        definition: '나가 종족 고유의 의사소통 방식(텔레파시). 입술이나 성대를 움직이지 않고 타인의 머릿속에 직접 의사를 뚜렷하게 전달한다. 나가 사회에서는 육성으로 소리를 내어 말하는 행위를 매우 상스럽고 원시적인 것으로 여긴다.'
      },
      {
        term: '비에나가 (Bienaga)',
        pronunciation: '[비-에-나가]',
        definition: '22세 성인 연령이 지났음에도 심장 적출을 치르지 않은 나가를 지칭하는 극도의 멸칭. "나가가 아닌데 나가의 형상을 한 괴물"이라는 뜻을 담고 있다. 수컷 비에나가의 경우 가문의 보호를 받지 못해 다른 나가들에게 무참히 잡아먹히는 운명에 처하며, 주인공 륜 페이가 바로 이 끔찍한 처지로 몰리게 된다.'
      },
      {
        term: '키준 산맥 (Kijun Mountains)',
        pronunciation: '[키준 산맥]',
        definition: '북부 대륙에 길고 거대하게 뻗어 있는 험준한 산맥. 아라짓 왕국 멸망 이후 여러 군벌이나 생명체들이 은거하거나 세력을 다투는 거칠고 스케일 큰 무대 역할을 한다.'
      },
      {
        term: '바이소 산 (Mount Baiso)',
        pronunciation: '[바이소 산]',
        definition: '북부에 위치한 무시무시한 활화산. 불을 자유자재로 다루는 도깨비들조차 범접하기 힘든 뜨거운 화구 깊숙한 곳에는 레콘들의 무기를 제련하는 전설적인 "최후의 대장간"이 숨겨져 있다.'
      },
      {
        term: '하늘치 (Haneulchi / Sky Fish)',
        pronunciation: '[하늘-치]',
        definition: '성 하나를 통째로 짊어질 만큼 거대하며, 평생 구름 위를 느릿느릿 유영하는 신비로운 공중 생명체. 그 넓고 평평한 등 위에는 고대의 식물과 폐허가 자리 잡고 있어, 티나한을 비롯한 레콘 종족들에게는 평생에 한 번 오르고 싶은 불굴의 탐험 숙원이자 성지로 여겨진다.'
      },
      {
        term: '롭스 (Lops)',
        pronunciation: '[롭스]',
        definition: '티나한의 하늘치 유적 발굴을 돕는 실무 책임자. 그 정체는 다수의 혼(영)을 몸에 담고 있는 "군령자"로, 상황에 따라 레콘의 혼을 내세워 막무가내인 티나한을 다루기도 하는 등 뛰어난 처세술과 실무 능력을 보여준다.'
      },
      {
        term: '오레놀 (Orenol)',
        pronunciation: '[오레놀]',
        definition: '인간들을 굽어살피는 "어디에도 없는 신"을 모시는 하인샤 대사원의 최고위 승려(대덕). 다가올 세계의 위협을 막기 위해 구출대 작전을 계획하고 발의하는 핵심적인 인물이다.'
      },
      {
        term: '티나한 (Tinahan)',
        pronunciation: '[티나-한]',
        definition: '구출대에서 "대적자"의 명운을 짊어지고 합류하게 된 거대한 수탉 형태의 레콘. 모든 물과 액체를 극도로 두려워하지만, 오직 하늘치 등 위를 밟겠다는 거대한 일생일대의 숙원 하나만을 바라보고 전진하는 호탕한 성격의 소유자다.'
      },
      {
        term: '하인샤 대사원 (Hainsya Temple)',
        pronunciation: '[하인-샤 대-사-원]',
        definition: '인간의 땅 북부에서 가장 거대하고 성스러운 신앙의 중심 권역. 륜 페이를 모셔오라는 구출대의 임무가 최초로 결의되고 선포된 곳으로, 아라짓 세계관의 주요 정보가 모이는 지식과 권능의 성소이다.'
      },
      {
        term: '킴 (Kim)',
        pronunciation: '[킴]',
        definition: '군령자 "롭스"의 몸 안에 담겨 있는 영혼들 중 하나로, 도깨비의 영혼이다. 롭스가 유들유들하게 상황을 무마하거나 예를 갖춰야 할 때 주로 바깥으로 꺼내 쓰는 인격이기도 하다.'
      },
      {
        term: '군령자 (Gunryeongja - Lord of Spirits)',
        pronunciation: '[군령-자]',
        definition: '죽은 자들의 영을 빨아들여 한 사람의 육신 안에 수많은 혼을 동시에 거느리고 다스리는 기이한 자들. 보유하고 있는 영혼과 인격을 상황에 맞추어 바꿔가며 표면에 내세울 수 있는 무섭고도 신비한 능력을 가졌다.'
      }
    ]
  }
];

export default function Glossary() {
  const [activeChapter, setActiveChapter] = useState(GLOSSARY_CHAPTERS[0].chapterId);

  return (
    <div className="p-4 md:p-8 font-serif">
      <div className="mb-14 text-center">
        <h2 className="text-4xl font-extrabold mb-5" style={{ color: '#5d1c1c' }}>고대어 백과사전</h2>
        <p className="text-lg text-[#5c4a3d] max-w-3xl mx-auto leading-relaxed">
          책갈피를 한 장씩 넘길 때마다 등장하는 낯선 고유명사와 지명, 개념들을 정리한 
          마법 도서관의 색인(Index) 문서입니다.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto items-start">
        
        {/* Chapter Index Sidebar (오래된 도서관의 장부 느낌) */}
        <div className="lg:w-1/4 sticky top-6">
          <div className="bg-[#fbf4eb] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] rounded-sm p-6 border-2 border-[#d4c3b3] shadow-[0_10px_20px_rgba(93,64,55,0.1)]">
            
            <h3 className="text-[#8b0000] font-black uppercase tracking-widest text-sm mb-6 pb-2 border-b-2 border-dashed border-[#bba382]">
              책갈피 (Chapters Index)
            </h3>
            
            <ul className="flex flex-col gap-3">
              {GLOSSARY_CHAPTERS.map(chapter => (
                <li key={chapter.chapterId}>
                  <button
                    onClick={() => setActiveChapter(chapter.chapterId)}
                    className={`w-full text-left px-5 py-4 font-bold border rounded-sm transition-all duration-300 ${
                      activeChapter === chapter.chapterId 
                        ? 'bg-[#eaddc5] border-[#a37222] text-[#5d1c1c] shadow-inner font-serif' 
                        : 'bg-transparent border-transparent text-[#5d4037] hover:bg-[#efe0c8] hover:border-[#d4c3b3]'
                    }`}
                  >
                    🔖 {chapter.chapterTitle}
                  </button>
                </li>
              ))}
              
              <li className="mt-6 px-4 py-4 border border-dashed border-[#d4c3b3] text-[#8d6e63] text-sm text-center italic cursor-not-allowed bg-[#fcf8e8]">
                ... 서고의 다음 페이지는 <br/>비어 있습니다 ...
              </li>
            </ul>
          </div>
        </div>

        {/* Terminology List Content (양피지 문서의 낱장들) */}
        <div className="lg:w-3/4">
          {GLOSSARY_CHAPTERS.map(chapter => (
            chapter.chapterId === activeChapter && (
              <div key={chapter.chapterId} className="animate-fade-in-up">
                
                <div className="mb-10 pb-4 border-b-4 border-double border-[#8c7456]">
                  <h3 className="text-4xl font-extrabold text-[#3e2723] tracking-wide font-serif">{chapter.chapterTitle}</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-8">
                  {chapter.terms.map((item, idx) => (
                    <div key={idx} className="bg-[#fcf8e8] p-8 rounded-sm border-[1.5px] border-[#d4c3b3] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
                      
                      {/* 오래된 책 페이지 둥근 귀퉁이 장식 */}
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#bba382] opacity-50"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#bba382] opacity-50"></div>

                      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4 border-b border-[#eaddc5] pb-3">
                        <h4 className="text-2xl font-black text-[#8b0000] font-serif tracking-wide">{item.term}</h4>
                        {item.pronunciation && (
                          <span className="text-sm font-medium text-[#7a5230] bg-[#efe0c8] px-3 py-1 rounded-full shadow-inner mt-2 md:mt-0">{item.pronunciation}</span>
                        )}
                      </div>
                      <p className="text-[#3e2723] leading-9 text-base font-medium">
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            )
          ))}
        </div>

      </div>
    </div>
  );
}
