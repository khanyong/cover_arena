import React, { useState } from 'react';

const LINEAGE_DATA = [
  {
    generation: '1',
    title: '1대 영웅왕',
    period: '아라짓 건국 1년 ~ 47년',
    desc: '아라짓의 시조. 위대한 전사이며 모험가. 레콘에 한정지어 놓고 보더라도 역사상 그보다 더 강대한 전사는 아마도 없을 것이다…….',
    page: '408'
  },
  {
    generation: '2-3',
    title: '2, 3대 왕 (불명)',
    period: '불명',
    desc: '역사적 기록이 소실되거나 파괴되어 왕명과 주요 업적이 전해지지 않는다.',
    page: '408',
    isUnknown: true
  },
  {
    generation: '4',
    title: '4대 복수왕',
    period: '아라짓 건국 79년 ~ 92년',
    desc: '왕국 아라짓에 대해 반역을 꾀하고 스스로를 왕이라 참칭한 마지막 반란자 기로인을 엔거에서 처단한다. ‘하늘에 두 태양이 없다. 두 번째 태양은 떨어져야 한다.’는 말로 유명하다. 당시 왕국 내에 손꼽히는 도시 중 하나였던 엔거는 복수왕의 가혹한 공격에 의해 파괴되어 황량한 평원으로 바뀌고 말았다. (현재의 엔거는 고대 도시 엔거와는 아무런 관련이 없는 도시다.) ……이후 지상에 왕이라 불리는 존재는 아라짓의 왕밖에 없게 된다.',
    page: '408'
  },
  {
    generation: '5',
    title: '5대 왕 (불명)',
    period: '불명',
    desc: '역사적 기록이 소실되거나 파괴되어 왕명과 주요 업적이 전해지지 않는다.',
    page: '408',
    isUnknown: true
  },
  {
    generation: '6',
    title: '6대 엄격왕',
    period: '아라짓 건국 164년 ~ 195년',
    desc: '판사이의 육형제 탑을 건설함.',
    page: '409'
  },
  {
    generation: '7',
    title: '7대 전통왕',
    period: '아라짓 건국 195년 ~ 208년',
    desc: '왕위 세습의 기틀을 쌓은 왕이다. 하지만 이후에도 아라짓의 왕위는 여러 번에 걸쳐 비혈족에게 계승된다. 또한 최초로 만민회의를 개최한 왕이기도 하다. 아라짓 건국 200년을 기념하는 행사로 열린 만민회의는 도깨비들의 즈믄누리와……. 이후로 50년마다 개최되는 정례 행사가 되었다.',
    page: '409'
  },
  {
    generation: '8-10',
    title: '8, 9, 10대 왕 (불명)',
    period: '불명',
    desc: '역사적 기록이 소실되거나 파괴되어 왕명과 주요 업적이 전해지지 않는다.',
    page: '409',
    isUnknown: true
  },
  {
    generation: '11',
    title: '11대 인식왕',
    period: '아라짓 건국 264년 ~ 284년',
    desc: '이름은 발케네 쿠스. 이름이 알려진 몇 되지 않는 왕들 중 하나다. 당시엔 미지의 땅이었던 지러쿼터 산맥 이북을 탐험하고 자신의 이름을 따 그 지역을 발케네라 명명했다.',
    page: '409'
  },
  {
    generation: '12',
    title: '12대 법전왕',
    period: '아라짓 건국 284년 ~ 295년',
    desc: '법전왕은 칙령과 조례로 구성되어 있던 아라짓의 법전을 통일하고 정립하였다. 군법의 성격이 강했던 그 이전까지 아라짓의 법규들에 비해 보다 일반사법에 가까운 법전이 등장할 수 있었던 것은 수백 년의 투쟁에 의해 나가들의 세력을 상당히 위축시킬 수 있었기 때문이다.',
    page: '409'
  },
  {
    generation: '13',
    title: '13대 왕 (불명)',
    period: '불명',
    desc: '역사적 기록이 소실되거나 파괴되어 왕명과 주요 업적이 전해지지 않는다.',
    page: '410',
    isUnknown: true
  },
  {
    generation: '14',
    title: '14대 자애왕',
    period: '아라짓 건국 322년 ~ 330년',
    desc: '왕명과 어울리지 않게도 자애왕의 시대에는 역사상 최악의 재난이 일어났다. ……결국 즈믄누리는 페시론 섬의 악당들에게 무사장을 파견하기로 결정했다. 재고를 부탁하는 자애왕의 강력한 요청은 묵살되었다. 어떤 부탁이라도 즐겨 받아들이는 도깨비들이지만 무사장의 파견 결정만큼은 번복하지 않았다. 무사장의 출전은 결정된 순간 절대로 돌이킬 수 없는 것이었다. 단신으로 페시론 섬에 상륙한 즈믄누리의 무사장은 그 후 한 시간에 걸쳐 페시론 섬의 생명체를 하나 남김없이 불태웠다. 쥐새끼 한 마리도 페시론 섬에서 살아나가지 못했다.',
    page: '410'
  },
  {
    generation: '15',
    title: '15대 침묵왕',
    period: '아라짓 건국 330년 ~ 337년',
    desc: '……적을 잘 알고 싶어한 그의 욕망은 왕국의 백성들을 생각하는 훌륭한 태도였지만, 니름을 터득할 수 있다는 믿음은 조금 지나친 것이었다. 당연히 성공하지 못했다.',
    page: '410'
  },
  {
    generation: '16-17',
    title: '16, 17대 왕 (불명)',
    period: '불명',
    desc: '역사적 기록이 소실되거나 파괴되어 왕명과 주요 업적이 전해지지 않는다.',
    page: '410',
    isUnknown: true
  },
  {
    generation: '18',
    title: '18대 야명왕',
    period: '아라짓 건국 366년 ~ 383년',
    desc: '……준동하고 있는 나가들을 견제하기 위해 천도를 단행했다. 천도 이후 이전 수도가 있던 지역은 상토(上土)로, 그리고 그에 대비하여 새로운 수도가 있는 지역은 하토(下土)로 불리게 되었다. 현재 상고토와 하고토로 불리는 지역이 바로 그곳들이다.',
    page: '410'
  },
  {
    generation: '19-20',
    title: '19, 20대 왕 (불명)',
    period: '불명',
    desc: '역사적 기록이 소실되거나 파괴되어 왕명과 주요 업적이 전해지지 않는다.',
    page: '411',
    isUnknown: true
  },
  {
    generation: '21',
    title: '21대 극연왕',
    period: '아라짓 건국 434년 ~ 512년',
    desc: '어린 나이에 왕위에 오른 극연왕은 이후 78년이라는 아라짓 역사상 가장 긴 기간 동안 왕국을 통치했다. 왕위를 이을 예정이었던 그녀의 오라비가 그 자리를 고사했기에 어린 나이에 왕위에 오를 수밖에 없었던 것 같다. 가장 긴 재위 기간뿐만 아니라 가장 많은 치적으로도 유명하다. 새로이 세력을 키우고 있던 나가들을 기습적으로 공격하여 남쪽으로 멀리 몰아내었고…….',
    page: '411'
  },
  {
    generation: '22',
    title: '22대 독서왕',
    period: '아라짓 건국 512년 ~ 547년',
    desc: '극연왕의 뒤를 이어 왕위에 오를 당시 독서왕은 예순일겁 세였다. 극연왕의 재위 중에 태어난 셈이었고, 그 점은 그 시대의 사람들 또한 마찬가지였다. 가장 나이 많은 노인들 외에는 나가의 공포를 아는 자들이 별로 없었고 사람들은 극연왕이 이룩한 안정을 사랑했다. 그 때문에 아라짓 역사상 최고령의 왕위 계승자가 대관식에 설 수 있었다. 사람들은 독서왕이 위대한 선왕과 비교될 시간도, 혹은 선왕이 이룩한 업적을 깎아먹을 시간도 별로 없을 거라 생각했던 것 같다. 하지만 독서왕은 의외로 장수했다. 그리고 그 외에는 별다른 특기 사항을 남기지도 못했다…….',
    page: '411'
  },
  {
    generation: '23',
    title: '23대 탐미왕',
    period: '아라짓 건국 547년 ~ 583년',
    desc: '독서왕과는 달리 많은 특기 사항을 남겼지만 그 대부분이 사람들을 불쾌하게 만드는 것들이었다 한다. ……사후에 행해진 기록 파괴와 나가의 준동에 의해 그 악행에 대한 많은 기록이 사라졌다.',
    page: '411'
  },
  {
    generation: '24',
    title: '24대 추풍왕',
    period: '아라짓 건국 583년 ~ 611년',
    desc: '……탐미왕의 기록이 제대로 남지 못했던 것은 추풍왕 시절에 일어난 나가들의 대공세 때문이기도 하다. 극연왕에 의해 극도로 위축되었던 나가의 세력은 백오십여 년이 지난 후에야 복구되었다. 하지만 다시 되살아나게 되자 나가들은 북부를 향해 무서운 공격을 퍼부었다. 사람들은 거의 잊고 있었던 적들에 대한 기억을 힘겹게 되새겼지만, 이미 사라진 아라짓 전사는 되살릴 수 없었다. 추풍왕은 나가들을 막아섰던 가장 용맹한 전사들이 없는 상황에서 나가의 대공세를 맞이해야 했다.',
    page: '412'
  },
  {
    generation: '25',
    title: '25대 잔혹왕',
    period: '아라짓 건국 611년 ~ 614년',
    desc: '아라짓 왕가에 단 두 명 존재했던 미치광이 중 하나다. (이 표현은 가이너 카쉬냅의 것이며 또 한 명의 미치광이는, 많은 사람들이 탐미왕이라고 추측하기는 하지만 누군지 정확하지 않다.) 스스로 잔혹왕이라는 왕명을 정한 이 정신병자는……. 잔혹왕을 암살한 자가 가이너 카쉬냅이라는 가설은 끊임없이 제시되지만, 가이너 카쉬냅 자신의 생몰연도마저 불명확하거니와 다른 확실한 증거도 없다. 이후 왕국은 걷잡을 수 없는 혼란에 빠져든다.',
    page: '412'
  },
  {
    generation: '26-30',
    title: '26, 27, 28, 29, 30대 왕 (불명)',
    period: '불명',
    desc: '역사적 기록이 소실되거나 파괴되어 왕명과 주요 업적이 전해지지 않는다.',
    page: '412',
    isUnknown: true
  },
  {
    generation: '31',
    title: '31대 권능왕',
    period: '아라짓 건국 689년 ~ 701년',
    desc: '……이 참혹했던 시절, 왕국의 사람들에게는 단 두 가지 희망만이 남아 있었다. 다가오는 만민회의와 왕국의 북부를 지키고 있던 용장 후사린 규리하가 두 희망이었다. ……50년 만에 개최된 만민회의는 어이없는 파행으로 치달았다. 후사린 규리하가 왕국을 위해 목숨처럼 지키던 명예를 버리고 변경백령을 떠났지만, 왕국의 몰락을 되돌리기에는 너무 늦은 시점이었다.',
    page: '412 ~ 413'
  }
];

export default function RoyalLineage() {
  return (
    <div className="p-4 md:p-8 font-serif bg-[#0a0f18] min-h-screen text-[#e2e8f0]">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black mb-4 tracking-wider" style={{ color: '#cbd5e1', textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
          고대 아라짓 왕국의 계보
        </h2>
        <p className="text-sm md:text-base text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
          영웅왕에 의한 건국부터 왕국의 몰락을 초래한 권능왕의 시기까지, 
          찬란했던 고대 아라짓 왕국을 통치한 역대 왕들의 전설과 역사를 담은 서첩입니다.
        </p>
      </div>

      <div className="max-w-4xl mx-auto py-4">
        <div className="relative">
          {/* 세로 타임라인 라인 (다크 스틸 톤) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-[#1e293b] transform md:-translate-x-1/2 shadow-inner rounded-full"></div>

          {LINEAGE_DATA.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex items-center justify-between mb-8 md:mb-12 ${
                idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
              } flex-col md:flex-row`}
            >
              {/* 타임라인 원형 노드 */}
              <div
                className="absolute left-6 md:left-1/2 w-6 h-6 rounded-full border-[3px] border-[#0a0f18] shadow-md transform -translate-x-3 md:-translate-x-1/2 z-10 flex items-center justify-center text-[10px] font-bold text-white transition-transform hover:scale-125"
                style={{
                  backgroundColor: item.isUnknown ? '#475569' : '#ef4444',
                }}
                title={item.title}
              >
                {item.generation.split('-')[0]}
              </div>

              {/* 대수/연도 정보 (PC용) */}
              <div className="w-full md:w-5/12 ml-16 md:ml-0 hidden md:block">
                <div className={`px-4 ${idx % 2 === 0 ? 'text-left pl-8' : 'text-right pr-8'}`}>
                  <span className="block font-black text-2xl text-[#cbd5e1]">
                    {item.isUnknown ? `${item.generation}대` : `${item.generation}대 왕`}
                  </span>
                  <span className="block text-xs mt-1 text-[#64748b] font-sans tracking-wider font-semibold">
                    {item.period}
                  </span>
                </div>
              </div>

              {/* 계보 내용 카드 (다크 메탈 판타지 스타일) */}
              <div className="w-full ml-16 md:ml-0 md:w-5/12 mt-2 md:mt-0 relative">
                <div
                  className={`p-6 rounded-md border-2 shadow-[0_10px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(239,68,68,0.12)] transition-all duration-300 relative overflow-hidden group ${
                    item.isUnknown
                      ? 'bg-[#151c28]/60 border-[#1e293b] opacity-80'
                      : 'bg-[#111622] border-[#1e293b] hover:border-[#ef4444]'
                  }`}
                >
                  {/* 카드 코너 접힘 장식 */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-[#1e293b] to-transparent opacity-50 border-l border-b border-[#1e293b] rounded-bl-lg"></div>

                  {/* 모바일 화면용 대수/연도 정보 */}
                  <div className="md:hidden block mb-2 font-bold border-b border-dashed border-[#1e293b] pb-2">
                    <span className="text-lg font-black text-[#cbd5e1]">
                      {item.title}
                    </span>
                    <span className="block text-xs text-[#64748b] mt-1 font-sans">{item.period}</span>
                  </div>

                  <h3 className={`hidden md:block text-xl font-bold mb-3 text-[#f1f5f9] group-hover:text-[#ef4444] transition-colors`}>
                    {item.title}
                  </h3>
                  <p className="text-[#cbd5e1] leading-relaxed text-sm md:text-base whitespace-pre-line">
                    {item.desc}
                  </p>

                  <div className="mt-4 flex justify-between items-center text-xs text-[#64748b]">
                    <span className="bg-[#1e293b] px-2.5 py-0.5 rounded border border-[#334155] font-sans text-amber-200/70">
                      부록 p.{item.page}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
