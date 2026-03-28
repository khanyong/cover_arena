import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

// 초성 추출기 (ㄱ, ㄲ, ㄴ, ㄷ, ...)
function getChosung(str) {
  const cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const code = str.charCodeAt(0) - 44032;
  if (code > -1 && code < 11172) return cho[Math.floor(code / 588)];
  
  return str.charAt(0).toUpperCase();
}

const CONSONANTS = ["전체", "ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ", "기타"];

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
        definition: '인간 길잡이이자 전설적인 "키탈저 사냥꾼". 아내 "여름"을 나가에게 잃은 복수심 하나로 수십 년간 숲의 생나가를 사냥하며 살아온 인간이다. 아라짓어(고대어)에 능통하다. 참고로 그의 이름인 \'케이건\'과 \'드라카\'는 키탈저 사냥어로 각각 흑사자(Black Lion)와 용(Dragon)을 뜻한다.'
      },
      {
        term: '바라기 (Baragi)',
        pronunciation: '[바라-기]',
        definition: '케이건 드라카가 등에 짊어지고 다니는 거대한 고대의 검. 검신이 붉고 거대하며, 칼날에 묻은 피가 마르기 전까지는 사람의 얼굴을 비추지 않는 기괴한 특성을 지녔다. 케이건의 몸에서 뿜어지는 살기와 결합되어 나가들에게는 끔찍한 죽음의 상징으로 여겨진다.'
      },
      {
        term: '키탈저의 호랑이 사냥꾼 (Tiger Hunters of Kitaljeo)',
        pronunciation: '[키탈-저의 호랑-이 사냥-꾼]',
        definition: '과거 북부의 험준한 산맥에서 가장 거대하고 위험한 맹수인 호랑이(대호)를 전문적으로 사냥하던 전설적인 인간 사냥꾼들의 집단. 호랑이를 잡기 위해 인간의 한계를 뛰어넘는 극도의 인내력, 생존술, 침묵을 연마했다. 현재는 명맥이 끊겼고 케이건 드라카가 그 무서운 사냥술을 나가들에게 사용하고 있다.'
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
      },
      {
        term: '밤의 다섯 딸 (The Five Daughters of the Night)',
        pronunciation: '[밤의 다-섯 딸]',
        definition: '혼란, 매혹, 감금, 은닉, 꿈으로 이루어진 존재들. 즈믄누리의 복잡하고 괴랄한 성 건축에 깊이 관여했다고 전해진다. 혼란은 성의 내부를, 매혹은 외형을, 감금은 수많은 미궁과 미로 및 함정을, 은닉은 비밀통로와 비밀문 및 암호를 결정했으며, 마지막 딸인 "꿈"이 성 건축에 구체적으로 어떤 개입을 했는지에 대해서는 아직까지도 불확실하게 남아 있다.'
      },
      {
        term: '즈믄누리 성의 구조 (Structure of Jeumeunnuri Castle)',
        pronunciation: '[즈믄-누-리 성의 구-조]',
        definition: '물리 법칙과 상식을 완벽히 파괴하는 기괴한 건축 양식. 본관 4층은 항상 7층에서 위로 올라가야만 도달할 수 있으며, 성 안 어디에서든 모퉁이를 오른쪽으로 세 번 돌면 무조건 대식당에 도달한다. 또한 동쪽 탑 어느 꼭대기에 서서 왼쪽으로 딱 두 바퀴를 돌고 나면 반드시 눈앞에 공간이 점프되어 성주의 서재 바닥에 엉덩방아를 찧게 되는 기상천외한 구조를 지녔다.'
      },
      {
        term: '사빈 하수언 (Sabin Hasueon)',
        pronunciation: '[사-빈 하-수-언]',
        definition: '즈믄누리의 무사장을 맡고 있는 도깨비. 피를 혐오하는 평화주의 종족임에도 무사장이라는 직책을 맡고 있으며, 성주를 친구 다루듯 짓궂게 놀려먹는 한량 같은 모습을 보이지만 성주와 매우 깊고 허물없는 신뢰 관계를 유지한다.'
      },
      {
        term: '바우 머리돌 (Bau Meoridol)',
        pronunciation: '[바우 머리-돌]',
        definition: '도깨비 요새 즈믄누리의 11대 성주. 평소에는 어딘가 나사가 빠져 보이는 기상천외한 농담과 철학적 장난을 일삼지만, 그 가벼움 이면에는 즈믄누리를 수호하고 세계의 섭리를 꿰뚫어 보는 자비롭고 깊은 통찰력을 지니고 있다.'
      }
    ]
  },
  {
    chapterId: 'chapter_2',
    chapterTitle: '제2장 은루',
    terms: [] // 이제부터 은루 챕터의 세계관 용어들이 여기에 차곡차곡 쌓일 예정입니다!
  }
];

// 각 단어 객체에 출처 챕터 정보를 심어주면서 평탄화(Flatten) 합니다.
const ALL_TERMS_WITH_CHAPTERS = GLOSSARY_CHAPTERS.flatMap(chapter => 
  chapter.terms.map(term => ({ 
    ...term, 
    chapterId: chapter.chapterId, 
    chapterTitle: chapter.chapterTitle 
  }))
).sort((a, b) => a.term.localeCompare(b.term, 'ko'));

export default function Glossary() {
  const router = useRouter();
  const searchParam = router.query.search || '';
  const detailPanelRef = useRef(null);

  const [activeChapterFilter, setActiveChapterFilter] = useState('ALL');
  const [activeChosung, setActiveChosung] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(ALL_TERMS_WITH_CHAPTERS[0]);

  // 모바일에서 목록 클릭 시 자동으로 아래쪽 상세문서로 부드럽게 스크롤
  useEffect(() => {
    if (selectedTerm && window.innerWidth <= 1024) {
      setTimeout(() => {
        detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [selectedTerm]);

  useEffect(() => {
    if (searchParam) {
      setSearchQuery(searchParam);
      const found = ALL_TERMS_WITH_CHAPTERS.find(t => t.term.includes(searchParam) || t.definition.includes(searchParam));
      if (found) {
        setSelectedTerm(found);
        setActiveChosung('전체');
        setActiveChapterFilter('ALL');
      }
    }
  }, [searchParam]);

  // 장(Chapter), 검색어, 초성을 모두 적용한 필터링 엔진
  const filteredTerms = useMemo(() => {
    return ALL_TERMS_WITH_CHAPTERS.filter(item => {
      // 1. 챕터 분류 필터링
      if (activeChapterFilter !== 'ALL' && item.chapterId !== activeChapterFilter) return false;

      // 2. 텍스트 검색 
      const keyword = searchQuery.toLowerCase();
      const matchSearch = item.term.toLowerCase().includes(keyword) || item.definition.toLowerCase().includes(keyword);
      if (!matchSearch) return false;

      // 3. 초성 카테고리
      if (activeChosung !== '전체') {
        const firstConsonant = getChosung(item.term);
        const isKoreanConsonant = /^[ㄱ-ㅎ]$/.test(firstConsonant);
        if (activeChosung === '기타') {
          return !isKoreanConsonant;
        } else {
          return firstConsonant === activeChosung;
        }
      }
      
      return true;
    });
  }, [searchQuery, activeChosung, activeChapterFilter]);

  const displayTermName = selectedTerm?.term.split('(')[0].trim() || '';
  const displayEngName = selectedTerm?.term.includes('(') ? selectedTerm.term.split('(')[1].replace(')', '') : '';

  return (
    <div className="p-4 md:p-6 font-serif h-full">
      <div className="mb-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold mb-3" style={{ color: '#5d1c1c' }}>고대어 대사전 (Encyclopedia)</h2>
        <p className="text-sm lg:text-md text-[#5c4a3d] max-w-2xl mx-auto leading-relaxed">
          수십 권의 장(Chapter)에 기록된 방대한 단어장입니다. 왼쪽 색인에서 챕터나 초성으로 단어를 찾아 상세 문헌을 열람하십시오.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[75vh] min-h-[650px] max-w-[1400px] mx-auto">
        
        {/* ======================= 왼쪽 색인 & 분류 영역 ======================= */}
        <div className="w-full lg:w-1/3 flex flex-col bg-[#fcf8e8] border-[3px] border-[#8c7456] rounded-sm shadow-[0_15px_30px_rgba(93,64,55,0.2)] overflow-hidden relative h-[55vh] lg:h-full">
          
          <div className="p-0 bg-[#eaddc5] border-b-[3px] border-[#8c7456] z-10 shadow-sm flex flex-col">
            
            {/* 챕터 필터 드롭다운 탭 */}
            <div className="flex items-center gap-0 w-full overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setActiveChapterFilter('ALL')}
                className={`py-3 px-4 flex-1 text-xs font-black tracking-widest uppercase border-r border-[#cbbca9] ${activeChapterFilter === 'ALL' ? 'bg-[#5d1c1c] text-[#fbf5e9]' : 'bg-[#eaddc5] text-[#7a5230] hover:bg-[#d4c3b3]'}`}
              >
                전체 서고
              </button>
              {GLOSSARY_CHAPTERS.map(chapter => (
                <button 
                  key={chapter.chapterId}
                  onClick={() => setActiveChapterFilter(chapter.chapterId)}
                  className={`py-3 px-3 min-w-[100px] flex-none text-xs font-bold tracking-widest border-r border-[#cbbca9] ${activeChapterFilter === chapter.chapterId ? 'bg-[#5d1c1c] text-[#fbf5e9] shadow-inner' : 'bg-[#eaddc5] text-[#7a5230] hover:bg-[#d4c3b3]'}`}
                >
                  {chapter.chapterTitle.replace('제', '').trim()} {/* "1장 구출대" 등 축약 형태로 표시 */}
                </button>
              ))}
            </div>

            {/* 검색바 및 초성 패널 */}
            <div className="p-4 bg-[#fbf4eb] border-t border-[#cbbca9]">
              <div className="relative mb-3">
                <input 
                  type="text" 
                  placeholder="단어 검색 (ex. 도망자)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 px-4 pr-10 bg-[#fdfaf3] border-2 border-[#bba382] rounded-sm text-[#4a3627] font-bold focus:outline-none focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000] transition-colors"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bba382] hover:text-[#8b0000] font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1 justify-center">
                {CONSONANTS.map(cho => (
                  <button
                    key={cho}
                    onClick={() => setActiveChosung(cho)}
                    className={`px-2 py-1 text-[0.65rem] font-black border rounded-sm transition-colors ${
                      activeChosung === cho 
                        ? 'bg-[#8b0000] text-[#fbf5e9] border-[#5d1c1c]' 
                        : 'bg-[#fbf5e9] text-[#7a5230] border-[#cbbca9] hover:bg-[#8c7456] hover:text-white'
                    }`}
                  >
                    {cho}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 중앙 목록 리스트부 */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#8c7456] scrollbar-track-[#fcf8e8] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
            {filteredTerms.length === 0 ? (
              <div className="p-10 text-center text-[#8d6e63] font-bold italic">
                {activeChapterFilter === 'chapter_2' ? "아직 은루의 서고에 쌓인 문서가 없습니다." : "검색된 문서가 서고에 없습니다."}
              </div>
            ) : (
              <ul className="flex flex-col">
                {filteredTerms.map((item, idx) => {
                  const isSelected = selectedTerm?.term === item.term;
                  return (
                    <li key={idx} className="border-b border-[#dfcfbd]">
                      <button 
                        onClick={() => setSelectedTerm(item)}
                        className={`w-full text-left px-5 py-4 transition-all duration-200 group flex items-center justify-between ${
                          isSelected 
                            ? 'bg-[#8c7456] text-white shadow-inner font-extrabold cursor-default' 
                            : 'bg-transparent text-[#5d4037] hover:bg-[#efe0c8] font-semibold'
                        }`}
                      >
                        <span className="truncate">{item.term}</span>
                        {!isSelected && <span className="text-[#cbbca9] group-hover:text-[#a37222] font-black opacity-50">▶</span>}
                        {isSelected && <span className="text-[#eaddc5] font-black animate-pulse">●</span>}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          
          <div className="bg-[#eaddc5] border-t-[3px] border-[#8c7456] p-2 flex justify-between px-4 text-xs font-bold text-[#8c7456]">
            <span>{activeChapterFilter === 'ALL' ? '전체 서고 열람중' : `${GLOSSARY_CHAPTERS.find(c => c.chapterId === activeChapterFilter)?.chapterTitle} 내부`}</span>
            <span>총 {filteredTerms.length} 권 검색됨</span>
          </div>
        </div>

        {/* ======================= 오른쪽 매머드급 상세 정보 영역 ======================= */}
        <div ref={detailPanelRef} className="w-full lg:w-2/3 relative group overflow-hidden bg-[#fdfaf3] border-[3px] border-[#8c7456] rounded-sm shadow-[0_15px_30px_rgba(93,64,55,0.2)] flex flex-col min-h-[60vh] lg:min-h-auto">
          
          {/* 그윽한 양피지 질감 오버레이 */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none opacity-80 mix-blend-multiply"></div>
          
          {selectedTerm ? (
            <div className="flex-1 overflow-y-auto p-6 md:p-14 z-10 animate-fade-in-up">
              
              {/* 타이틀 및 발음, 출처부 */}
              <div className="border-b-4 border-double border-[#bba382] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex flex-col lg:flex-row lg:items-end gap-2 lg:gap-4 mb-3">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#5d1c1c] tracking-tight text-shadow-sm">
                      {displayTermName}
                    </h1>
                    {displayEngName && (
                      <span className="text-2xl font-bold text-[#8c7456] tracking-widest uppercase mb-1">
                        {displayEngName}
                      </span>
                    )}
                  </div>
                  
                  {selectedTerm.pronunciation && (
                    <div className="inline-block bg-[#efe0c8] border border-[#d4c3b3] text-[#5d4037] px-4 py-1.5 rounded-full font-bold shadow-sm">
                      🔊 발음기호: {selectedTerm.pronunciation}
                    </div>
                  )}
                </div>

                {/* 우측 상단 챕터 출처 뱃지 */}
                <div className="mt-4 md:mt-0 text-right">
                   <div className="inline-block px-3 py-1 bg-[#8b0000] text-amber-50 text-xs font-black tracking-widest border border-amber-900 shadow-md transform rotate-1">
                     📚 {selectedTerm.chapterTitle}
                   </div>
                </div>
              </div>

              {/* 본문 디테일 */}
              <div className="prose prose-lg max-w-none text-[#3e2723]">
                <p className="text-[1.15rem] leading-[2] font-medium whitespace-pre-wrap first-letter:text-6xl first-letter:font-black first-letter:text-[#8b0000] first-letter:mr-3 first-letter:float-left first-letter:leading-[1.1]">
                  {selectedTerm.definition}
                </p>
              </div>

              <div className="mt-16 pt-8 border-t border-dashed border-[#d4c3b3] flex justify-end opacity-50">
                <div className="text-right">
                  <p className="text-[#8b0000] font-black text-xl tracking-[0.3em] uppercase">아라짓 공인 기록</p>
                  <p className="text-[#5d4037] text-sm font-bold">인증 번호: #{Math.floor(Math.random() * 90000) + 10000}</p>
                </div>
              </div>
              
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 z-10 opacity-70">
              <div className="text-[100px] mb-6">📖</div>
              <h3 className="text-3xl font-black text-[#8c7456] mb-3">양피지가 덮여 있습니다.</h3>
              <p className="text-[#5d4037] font-bold">왼쪽 목록에서 열람하실 단어를 선택해주십시오.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
