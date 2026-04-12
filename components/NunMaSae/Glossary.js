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
    terms: [
      {
        term: '소메로 마케로우 (Somero Makerow)',
        pronunciation: '[소메-로 마-케-로우]',
        definition: '마케로우 가문 전체를 총괄하는 절대적인 대모. 가문의 번영과 안위를 위해 냉철하고 권위적인 태도로 딸들을 다스리며, 복잡한 정치적 폭풍 속에서도 마케로우의 입지를 굳건히 지킨다.'
      },
      {
        term: '두세나 마케로우 (Dusena Makerow)',
        pronunciation: '[두세-나 마-케-로우]',
        definition: '마케로우 가문의 일원이자 소메로의 딸. 거대한 가문의 자매들 사이에서 자신만의 위치와 서사를 만들어가는 인물 중 하나다.'
      },
      {
        term: '비아스 마케로우 (Bias Makerow)',
        pronunciation: '[비-아-스 마-케-로우]',
        definition: '마케로우 가문의 극도로 탐욕스럽고 야심 넘치는 나가 여성. 화리트 마케로우의 모친이기도 하며, 가문 내에서 주도권을 쥐기 위해 수단과 방법을 가리지 않고 음모를 꾸미는 냉혹함을 가졌다.'
      },
      {
        term: '스바치 (Sbachi)',
        pronunciation: '[스바-치]',
        definition: '카루와 함께 무력조로 활약하며 임무를 수행하는 요란하지만 유쾌한 남자 나가. 카린돌 마케로우와 애정을 나누는 연인 관계이며, 이후 가문과 얽힌 사건 전개에서 독자적인 발자취를 남긴다.'
      },
      {
        term: '카루 (Karu)',
        pronunciation: '[카-루]',
        definition: '스바치와 항상 함께 행동하는 전투원이자 과묵하고 날렵한 남자 나가. 위험에 처하거나 돌파구가 필요할 때는 극한의 약물인 \'소드락\'을 망설임 없이 복용하여 적진을 초토화시키는 초인적인 면모를 보여준다.'
      },
      {
        term: '발자국 없는 여신 (The Goddess Without Footprints)',
        pronunciation: '[발자-국 없는 여-신]',
        definition: '대륙의 네 선민종족 중 하나인 \'인간\'을 굽어살피는 자애로운 신. 바람을 관장한다고도 일컬어지며, 과거 하인샤 대사원의 승려들을 비롯한 인간들의 영적 기원이 되는 존재이다.'
      },
      {
        term: '비스그라쥬 (Visgraju)',
        pronunciation: '[비스-그라-쥬]',
        definition: '온도를 필사적으로 유지해야 하는 나가들에게 치명적인 북쪽 한계선 부근에 건설된 최북단의 전초 도시. 풍부한 금광이 자리잡고 있어 추위를 감수하고서라도 확보해야만 하는 전략적 가치가 높은 황금의 요새다.'
      },
      {
        term: '불신자들의 도시 카라보사 (Carabosa, The City of Non-believers)',
        pronunciation: '[카-라-보-사]',
        definition: '여신의 교리와 전통적 신앙을 철저하게 거부한 이단의 나가들이 은밀하게 모여 구축한 비밀스러운 도시. 종교와 율법의 지배를 받지 않아 독자적이고 변칙적인 문화를 형성하고 있다.'
      },
      {
        term: '한계선 (The Limit Line)',
        pronunciation: '[한계-선]',
        definition: '냉혈동물인 나가가 스스로 열을 내지 못해 생리학적으로 생존할 수 있는 북쪽의 한계 마지노선. 철저하게 오직 \'기온\'에 의해서만 결정되며, 이곳을 넘는 순간 엄청난 추위로 인해 나가들은 강제적인 동면(가사 휴면)에 빠지거나 얼어 죽게 된다.'
      },
      {
        term: '소드락 (Soderak)',
        pronunciation: '[소드-락]',
        definition: '신체에 극도의 과부하를 주는 대신 육체 능력을 초인적으로 폭주시키는 강력한 약물. 나가들이 복용할 경우 반사신경, 사고 속도, 재생력이 한계 이상으로 끓어올라 잠시나마 레콘에 필적하는 공포스러운 기동성을 손에 넣게 된다.'
      },
      {
        term: '도깨비 감투 (Dokkaebi Gamtu)',
        pronunciation: '[도깨-비 감-투]',
        definition: '평화와 불규칙을 사랑하는 도깨비들이 발명한 기상천외한 물건들 중 하나. 머리에 착용하면 주변의 빛을 기면적으로 굴절 및 동화시켜 대상을 완벽한 투명 인간 상태로 만들어준다.'
      },
      {
        term: '카린돌 마케로우 (Karindol Makerow)',
        pronunciation: '[카린-돌 마-케-로우]',
        definition: '화리트의 누나이자 마케로우 가문의 중요 인물. 전대 \'보늬\'로서의 특수한 책무를 짊어지고 있으며, 무인 스바치와 사랑에 빠져 딸(그리미)을 낳고 극의 서정적이고 비극적인 한 획을 긋는 매력적인 여인이다.'
      },
      {
        term: '지커엔 페이 (Jikeoen Pei)',
        pronunciation: '[지커-엔 페-이]',
        definition: '명성 높은 페이 가문의 절대적인 가주. 륜 페이와 사모 페이의 어머니로서 가문의 안위가 벼랑 끝에 몰린 상황 속에서도 위엄을 잃지 않고 냉정하게 가문을 수호하는 대모의 품격을 지녔다.'
      },
      {
        term: '심장탑의 수호자들 (Guardians of the Heart Tower)',
        pronunciation: '[심장-탑의 수호-자들]',
        definition: '하텐그라쥬의 심장탑을 철통같이 방어하는 최정예 나가 무사들. 환상계단을 다루거나 침입자를 막아내는 특수한 진법과 무력을 지녔다.'
      },
      {
        term: '모티 (Moti)',
        pronunciation: '[모티]',
        definition: '최북단 인근에 위치한 \'마지막 주막\' 주인의 아들. 눈치가 빠르고 영악한 소년으로, 케이건 드라카에게 그가 의뢰한 기괴한 식사(나가 탕)를 내오며 심부름을 하는 입체적인 단역이다.'
      },
      {
        term: '판막음 (Panmageum)',
        pronunciation: '[판막-음]',
        definition: '대륙 북부에서 무력 분쟁이나 결투가 발생했을 때, 살아남은 승자가 어설픈 자비 없이 피로서 완벽한 맺음을 짓는 행위를 뜻하는 삭막하고도 무자비한 결투 용어.'
      },
      {
        term: '무룬 강 (Murun River)',
        pronunciation: '[무룬 강]',
        definition: '대륙을 가로지르는 주요 수맥 중 하나. 거대한 물줄기로 인해, 물을 극도로 공포스러워하는 레콘 종족에게는 통과하기 몹시 까다롭고 위험한 자연적 장벽으로 작용한다.'
      },
      {
        term: '펠도리 강 (Peldori River)',
        pronunciation: '[펠도-리 강]',
        definition: '거대한 무룬 강의 지류. 작중 구출대 일행이 이동하는 경로에서 만나게 되는 또 하나의 지리적 난관이자 주요 지형지물이다.'
      },
      {
        term: '수목애호가 (Tree Lovers / Arborists)',
        pronunciation: '[수목-애호-가]',
        definition: '키보렌의 밀림을 고향으로 둔 나가 사회에서 대자연(특히 나무)을 광적으로 숭배하거나 아끼는 성향을 지닌 이들을 일컫는 말. 이들은 숲을 훼손하거나 벌목하는 행위를 극도로 금기시하고 증오한다.'
      },
      {
        term: '쌍신검 / 썅신검 (Ssangsingeom / Twin Deity Sword)',
        pronunciation: '[쌍신-검]',
        definition: '등장인물들이 케이건의 무기 \'바라기\'를 뜻칭할 때 쓰이기도 하는 검의 형태. 하나의 손잡이에 두 개의 서늘한 칼날이 나란히 붙어 있는 고대 무기로, 작중 누군가의 억센 발음 또는 욕설이 섞인 감탄사로 \'썅신검(...)\' 이라 불리기도 한다.'
      },
      {
        term: '은루 (Silver Tear)',
        pronunciation: '[은루]',
        definition: '소설 제2장의 부제이자 핵심적인 메타포. 보통 눈물을 흘릴 수 없다고 알려진 냉혈 종족 \'나가\'가 극도의 감정적 한계나 극한 상황에 달했을 때 흘린다는 전설적인 은빛 눈물을 일컫는다.'
      },
      {
        term: '요스비 (Yoseubi)',
        pronunciation: '[요스-비]',
        definition: '하텐그라쥬 출신의 남성 나가이자 주인공 륜 페이의 친아버지. 매우 특이하게도 인간인 케이건 드라카와 가장 깊고 끈끈한 우정을 나눈 사이이며, 케이건의 서사에 막대한 비극적 영향을 미친 중요 인물이다.'
      },
      {
        term: '두억시니 (Dueoksini)',
        pronunciation: '[두억-시-니]',
        definition: '고대 선민종족 중 하나였으나 어느 시점부터 자아와 지성을 잃고 미치광이 종족으로 전락한 신비로운 존재. 자신들의 수호신을 상실한 탓에, 빛과 따스함을 병적으로 무서워하며 짐승처럼 흉폭하게 날뛴다.'
      },
      {
        term: '쏘바 (Ssoba / Sova)',
        pronunciation: '[쏘-바]',
        definition: '주인공 륜 페이의 심장 적출식 거행일 무렵, 륜을 호위하거나 수색하는 임무에 속해 있던 늙고 충직한 나가 병사.'
      },
      {
        term: '디듀스류노 라르간드 페이 (Didyusuryuno Largand Pei)',
        pronunciation: '[디듀스류노 라-르-간드 페-이]',
        definition: '페이 가문의 핵심 일원이자 사모 페이와 륜 페이의 첫째 누나. 나가 사회의 삼엄한 규칙과 가문의 무거운 의무 속에서 동생들과 복잡 미묘한 궤적을 그리는 주요 혈연이다.'
      },
      {
        term: '라르간드 (Largand)',
        pronunciation: '[라-르-간드]',
        definition: '륜 페이의 첫째 누나인 "디듀스류노 라르간드 페이"를 축약해서 부르는 호칭. 간혹 그 파생어나 은유적 이름으로 쓰이기도 한다.'
      },
      {
        term: '유벡스 (Yubex)',
        pronunciation: '[유-벡-스]',
        definition: '하텐그라쥬 심장탑 도서관에서 방대한 지식과 장서를 관리하던 사서. 잔혹한 비아스 마케로우 일파에 의해 무참히 도륙당하며 극 전개의 중요한 참극을 남긴다.'
      },
      {
        term: '쥬타기 대선사 (Great Master Jutagi)',
        pronunciation: '[쥬타-기 대-선-사]',
        definition: '하인샤 대사원을 정신적으로 이끄는 최고위 권위의 인간 승려. 도래할 재앙을 예견하여 세 종족 연합 구출대의 결성을 안배하고 대륙의 운명을 이끈 진정한 현자이다.'
      },
      {
        term: '수호자 세리스마 (Guardian Serisma)',
        pronunciation: '[수호-자 세리스-마]',
        definition: '하텐그라쥬 심장탑 55층에 거주하는 고위 수호자. 늙은 거미나 뱀에 비유될 정도로 음모와 계략에 능하며, 자신의 목적을 위해 상황을 무섭도록 조종하는 입체적인 인물이다.'
      },
      {
        term: '세파빌 (Sefavil)',
        pronunciation: '[세파-빌]',
        definition: '주인공 륜 페이의 절친한 친구이자 수호자 수련생인 "화리트 마케로우"가 발자국 없는 여신으로부터 받은 신명(神名).'
      },
      {
        term: '아스화리탈 세파빌 마케로우 (Aswarital Sefavil Makerow)',
        pronunciation: '[아스화-리-탈 세파-빌 마-케-로우]',
        definition: '륜 페이와 유년 시절부터 가장 가까운 벗이었던 수련생 "화리트"의 기나긴 전체 본명이다.'
      },
      {
        term: '라토 센 (Lato Sen)',
        pronunciation: '[라-토 센]',
        definition: '나가 명장이자 전통 있는 센 가문의 가주로서 나가 평의회 의장을 역임할 정도로 막강한 정치적 실권자이다.'
      },
      {
        term: '수이신 센 (Suisin Sen)',
        pronunciation: '[수이-신 센]',
        definition: '센 가문에 속한 장녀이자 극의 조각을 맞추어 나가는 주요 인물 가계도 중 하나.'
      },
      {
        term: '라디올 센 (Radiol Sen)',
        pronunciation: '[라디-올 센]',
        definition: '센 가문의 일원으로, 스스로를 천재 극작가이자 훌륭한 극배우로 자칭하지만 실제 예술적 소질은 형편없어서 주변의 무시를 받는 코믹한 여성이다.'
      },
      {
        term: '솜나니 페이 (Somnani Pei)',
        pronunciation: '[솜나-니 페-이]',
        definition: '지커엔 페이의 자식이자 명망 높은 페이 가문의 장녀. 륜과 사모 페이의 가족 구성원 중 한 명이다.'
      },
      {
        term: '복수권 (Right of Vengeance)',
        pronunciation: '[복수-권]',
        definition: '"쇼자인테쉬크톨"을 지칭하는 우리말 표현. 다른 이름으로 "암살자 지명권"이라고도 하며, 비극적으로 억울하게 죽은 자의 친족이 정당한 복수를 합법적으로 이행할 수 있도록 하는 권리이다.'
      },
      {
        term: '몸빠진살',
        pronunciation: '[몸빠-진-살]',
        definition: '오랜 시간 덧씌워진 고유의 은어로 파악되며, 다음 속담을 위한 핵심적인 무기 비유구로 작용한다.'
      },
      {
        term: '몸빠진살로 용을 잡는다',
        pronunciation: '[몸빠-진-살-로 용-을 잡-는다]',
        definition: '터무니없고 보잘것없이 작은 일격만으로 거대하고 무시무시한 목표를 쓰러뜨리는, 도저히 믿기 어려운 위업을 비유할 때 쓰이는 아라짓 격언.'
      },
      {
        term: '히참마의 잎 (Hichamma Leaves)',
        pronunciation: '[히참-마-의 잎]',
        definition: '눈으로 보기엔 평범한 들풀 같지만, 어떤 단단한 쇠붙이라도 문지르기만 하면 녹슨 과자처럼 물러지게 하여 부술 수 있게 만드는 무시무시하고 신비한 풀. 투옥되었을 때 결정적인 열쇠 역할을 한다.'
      }
    ]
  },
  {
    chapterId: 'chapter_3',
    chapterTitle: '제3장 눈물처럼 흐르는 죽음',
    terms: [
      {
        term: '가이너카쉬냅의 "생각하는 동물들"',
        pronunciation: '[가이너카쉬-냅의 생-각하는 동-물-들]',
        definition: '소설 내에 존재하는 가상의 철학서 또는 우화 모음집. 세계를 살아가는 네 선민종족의 존재 양식과 삶과 죽음에 대한 깊은 철학적 은유와 통찰을 제공한다.'
      },
      {
        term: '펠도리 강 (Peldori River)',
        pronunciation: '[펠-도-리 강]',
        definition: '아라짓 대륙 북부를 가로지르는 거대하고 웅장한 물줄기인 무룬 강의 수많은 지류 중 하나.'
      },
      {
        term: '나늬 (Nanui)',
        pronunciation: '[나-늬]',
        definition: '도깨비 요술쟁이 "비형 스라블"이 타고 다니고 보살피는 거대한 수레 딱정벌레의 이름. 무시무시한 생김새와 달리 비형과 유쾌하고 끈끈한 유대를 자랑하는 친근한 반려 곤충이다.'
      },
      {
        term: '영웅왕 (Hero King)',
        pronunciation: '[영웅-왕]',
        definition: '과거 세 선민종족을 규합해 아라짓 왕국을 건국했던 전설적인 위대한 군주. 스스로 호랑이를 타고 다녔다 하여 대호왕이라고도 불렸다.'
      },
      {
        term: '하야로비 (Hayarobi)',
        pronunciation: '[하야로-비]',
        definition: '케이건 드라카가 들려주는 옛이야기 속에 등장하는 고대 부족 라호친의 처녀 이름. 퀴도부리타 용이 사랑에 빠졌다고 전해지는 "하늘치" 전설의 기원이 되는 존재이다.'
      },
      {
        term: '대확장 전쟁 (Great Expansion War)',
        pronunciation: '[대-확-장 전-쟁]',
        definition: '과거 북부의 인간 등 선민종족들과 남부의 나가들이 벌였던 참혹하고 거대한 영토 분쟁. 이 끔찍한 대전쟁의 여파로 남북을 가르는 현재의 한계선이 획정되었다.'
      },
      {
        term: '아스화리탈 (Aswarital) - 용근',
        pronunciation: '[아스화-리-탈]',
        definition: '륜 페이가 극적으로 확보한 용화(식물 상태의 용)의 잎과 뿌리(용근)에 붙인 이름. 자신의 희생된 소중한 친구 "아스화리탈 세파빌 마케로우"를 애도하고 기리기 위해 그대로 지어준 것이다.'
      },
      {
        term: '정신 억압자 (Mind Suppressor)',
        pronunciation: '[정-신 억-압-자]',
        definition: '강력한 니름(텔레파시) 능력을 활용하여 조류나 야생 짐승 따위의 정신을 강제로 억압하고 조종해 수족처럼 부리는 나가들의 특수 주술 부대나 그 능력자를 일컫는 말.'
      },
      {
        term: '퀴도부리타 (Kwidoburita)',
        pronunciation: '[퀴도-부리-타]',
        definition: '작중 전설 속에 자주 등장하는 명망 높은 용 중 하나. 거대한 하늘치를 라호친 처녀 "하야로비"로 착각하여 평생을 바쳐 맹목적인 사랑에 빠진 낭만적이면서도 어리석은 용이다.'
      },
      {
        term: '대호 별비 (Great Tiger Byeolbi)',
        pronunciation: '[대-호 별-비]',
        definition: '"별을 쓸어담는 빗자루"라는 시적인 뜻을 지닌 전설의 거대 호랑이(대호). 역대 키탈저 사냥꾼들이 무려 3대에 걸쳐 한 몸을 쫓고 사냥하려 했을 만큼 무시무시하고 신비로운 야수이다.'
      },
      {
        term: '아라짓 전사 (Arajit Warrior)',
        pronunciation: '[아라-짓 전-사]',
        definition: '전설의 군주 영웅왕(대호왕)을 모시며 검을 휘둘렀던 아라짓 제국의 최정예 기사 집단. 제국이 무너지고 오랜 세월이 지난 지금도 잃어버린 영광과 그 맥을 잇고자 하는 긍지 열렬한 무사들이 암약하고 있다.'
      },
      {
        term: '시모그라쥬 (Shimograju)',
        pronunciation: '[시모-그-라쥬]',
        definition: '나가들의 고향인 한계선 이남 수목선 지대에 기둥을 두고 있는 거대하고 유서 깊은 유력 도시 중 한 곳이다.'
      },
      {
        term: '군령자 (Gunryeongja)',
        pronunciation: '[군령-자]',
        definition: '죽은 자들의 영을 육신으로 빨아들여 한 육체 안에 수많은 자아와 영혼을 가두고 통제하며, 그들의 기억이나 인격을 꺼내 쓸 수 있는 기이하고 파괴적인 권능의 소유자를 일컫는다.'
      }
    ]
  },
  {
    chapterId: 'chapter_4',
    chapterTitle: '제4장 왕 잡아먹는 괴물',
    terms: [
      {
        term: '파름 평원 (Param Plains)',
        pronunciation: '[파-름 평-원]',
        definition: '일행이 거쳐가게 되는 드넓은 평야 지역 중 하나. 과거 고대 아라짓 시대의 무대였으며 광활한 자연이 펼쳐져 있는 장소이다.'
      },
      {
        term: '카시다 사원 (Kashida Temple/City)',
        pronunciation: '[카시-다 사-원]',
        definition: '과거 번성했으나 제2차 대확장 전쟁으로 멸망하여 폐허만 남게 된 전설적인 유적지이자 사원. 입구의 암각문이 특히 유명하다.'
      },
      {
        term: '데호라 대사 (Great Master Dehora)',
        pronunciation: '[데호-라 대-사]',
        definition: '하인샤 대사원에 소속된 높은 권위의 승려. 아라짓 시대의 잊힌 고어나 고문서 파악에 굉장히 능통한 인물이다.'
      },
      {
        term: '조타 중대사 (Medium Master Jota)',
        pronunciation: '[조-타 중-대사]',
        definition: '대사원에 적을 두고 있는 또다른 핵심 승려. 주요 사건의 단서를 제공하거나 일행과 접점을 맺는다.'
      },
      {
        term: '무적왕 토디 시노크 (Todi Shinok, the Invincible King)',
        pronunciation: '[무-적-왕 토-디 시노-크]',
        definition: '스스로를 영웅왕의 49대손이자 정의왕의 아들인 자칭 "무적왕"이라 주장하는 제왕병자. 겉보기엔 그럴싸하나 본질은 피혁상 출신의 뼛속 깊은 장사꾼이다.'
      },
      {
        term: '페치렌 (Pechiren)',
        pronunciation: '[페-치-렌]',
        definition: '무적왕을 가장한 피혁상 토디 시노크의 고향이자 그가 본업을 하던 상업 지역의 명칭.'
      },
      {
        term: '운수 (Unsu)',
        pronunciation: '[운-수]',
        definition: '발자국 없는 여신을 섬기는 끈질긴 수호자. 륜을 뒤쫓거나 서늘한 임무를 수행하는 암살자 중 한 명이다.'
      },
      {
        term: '정의왕 (King of Justice)',
        pronunciation: '[정의-왕]',
        definition: '토디 시노크가 황당무계하게도 자신의 아버지라 일컬으며 들먹이는 아라짓 제국 전설상의 위대한 또 다른 왕.'
      },
      {
        term: '사이커 (Saiker)',
        pronunciation: '[사-이-커]',
        definition: '나가들이 전통적으로 벼려 사용하는 무시무시한 장검. 형태가 무척 날카로워 타 종족은 암살용 검인 "쉬크톨"과 도무지 구분하지 못한다.'
      },
      {
        term: '쉬크톨 (Shikhtol)',
        pronunciation: '[쉬-크-톨]',
        definition: '복수권(쇼자인테쉬크톨)의 발동과 함께 나가가 쥐게 되는 암살과 복수 목적의 전용 검. 검신 자체가 피비린내 나는 권리를 상징한다.'
      },
      {
        term: '디듀스류노 (Didyusuryuno)',
        pronunciation: '[디-듀-스-류-노]',
        definition: '륜 페이의 첫째 누나인 "디듀스류노 라르간드 페이"의 이름 윗부분을 떼어 상징적으로 부르거나 쓸 때 쓰이는 호칭.'
      },
      {
        term: '외눈의 예언자 (One-Eyed Prophet)',
        pronunciation: '[외-눈의 예-언-자]',
        definition: '세상의 거대한 흐름과 재앙의 단면을 한쪽 눈으로만 꿰뚫고 예언했다는 신비로운 존재 또는 그런 상징적 대명사.'
      },
      {
        term: '현명왕 (Wise King)',
        pronunciation: '[현명-왕]',
        definition: '과거 위대했던 아라짓 제국을 다스리며 "현명함"의 상징으로 추앙받던 전설 속의 어진 왕.'
      }
    ]
  },
  {
    chapterId: 'chapter_5',
    chapterTitle: '제5장 철혈',
    terms: [
      {
        term: '철혈암 (Iron Blood Rock)',
        pronunciation: '[철-혈-암]',
        definition: '하인샤 대사원 내에 있는 특이한 바위. 케이건 드라카가 사원에 시주한 것으로 알려져 있으며, 이름처럼 뜨거운 피와 단단한 철을 상징하는 극적인 장소다.'
      },
      {
        term: '파름산 (Mount Param)',
        pronunciation: '[파-름-산]',
        definition: '아라짓 대륙 북부에 위치한 거친 산세. 웅장하고 험준한 환경을 배경으로 한 극 중의 여정이나 지리적 거점으로 빈번히 언급된다.'
      },
      {
        term: '철권왕 (Iron Fist King)',
        pronunciation: '[철-권-왕]',
        definition: '과거 위대했던 아라짓 제국을 다스리던 왕 중 한 명. 강철 같은 무력과 압도적인 힘으로 대륙을 평정했다고 전해지는 전설 속의 기골 장대한 군주이다.'
      },
      {
        term: '자보로 (Jaboro)',
        pronunciation: '[자보-로]',
        definition: '인간의 땅 북부에 널리 퍼져 있는 유력한 씨족이자 세력 거점. 호전적이고 의리가 두터우며, 마립간의 통치 아래 용맹한 전사들을 배출하는 호탕한 곳이다.'
      },
      {
        term: '세도 마립간 (Sedo Maripgan)',
        pronunciation: '[세-도 마립-간]',
        definition: '자보로 씨족을 다스렸던 전대 지배자(마립간). 북부 특유의 호쾌함과 무력을 겸비한 인물로 후대에까지 영향을 미친 군주이다.'
      },
      {
        term: '판막음 (Panmageum)',
        pronunciation: '[판막-음]',
        definition: '북부의 살벌한 결투 관습. 분쟁이나 시합에서 살아남은 승자가 어설픈 자비를 베풀지 않고 확실하게 피로서 마무리를 짓는 것을 뜻하는 용어다.'
      },
      {
        term: '시구리아트 산맥 (Siguriat Mountains)',
        pronunciation: '[시구리-아-트 산-맥]',
        definition: '북부를 횡단하는 광대하고 험난한 대산맥. 일반적인 경로로는 넘기 힘들며, 이곳을 가로지르는 유일하고 안전한 길은 유료도로당이 꽉 잡고 있다.'
      },
      {
        term: '위엄왕 (King of Dignity)',
        pronunciation: '[위엄-왕]',
        definition: '아라짓 제국의 역대 왕 중 한 명. 타의 추종을 불허하는 권위와 무게감을 지녔다고 칭송받는 전설 속 제왕이다.'
      },
      {
        term: '지그림 자보로 (Jigrim Jaboro)',
        pronunciation: '[지그-림 자보-로]',
        definition: '자보로 가문의 핵심 인물이자 후계자 또는 마립간. 씨족의 성향을 빼닮아 거칠지만 호전적인 북부인의 면모를 훌륭히 보여준다.'
      },
      {
        term: '슈라도스 (Shurados)',
        pronunciation: '[슈라도-스]',
        definition: '자보로 지역에서 언급되는 이름. 자보로 병사나 특정 인물 혹은 군견/군마 같은 동물일 가능성이 큰 소소한 등장 개체.'
      },
      {
        term: '메헴 (Mehem)',
        pronunciation: '[메헴]',
        definition: '자보로 휘하의 병사이자 부대원 중 한 명으로서 짧게 등장하는 조연급 인물이다.'
      },
      {
        term: '다거트 슈라이트 (Dagert Shright)',
        pronunciation: '[다거-트 슈라이-트]',
        definition: '자보로 지역의 신입 풋내기 병사. 마립간의 지시에 의해 씨름 시합에서 터무니없는 패배 연기를 수행하며 익살을 자아내는 감초 역할을 한다.'
      },
      {
        term: '키타타 자보로 - 자보로 대장군 (Kitata Jaboro, General Jaboro)',
        pronunciation: '[키타-타 자보-로 대-장-군]',
        definition: '자보로의 맹장. "자보로 대장군"으로 널리 알려져 있으며 엄청나게 괄괄한 성격, 불도저 같은 통솔력, 지칠 줄 모르는 맹렬함으로 유명한 호걸이다.'
      },
      {
        term: '별비 (Byeolbi)',
        pronunciation: '[별-비]',
        definition: '북부 전설에 언급되는 신비하고 거대한 호랑이(대호). 역대 사냥꾼들의 궁극적인 목표였으며 별을 쓸어 담는 듯한 자태라는 수려한 별칭이다.'
      },
      {
        term: '무라 마립간 (Mura Maripgan)',
        pronunciation: '[무-라 마립-간]',
        definition: '자보로의 역대 권위자 중 한 명. 마립간의 호칭을 물려받아 북부 무사들의 존경과 충성을 한몸에 받았던 인물이다.'
      },
      {
        term: '하크렌 (Hakren)',
        pronunciation: '[하크-렌]',
        definition: '자보로의 소속 병사이거나 가문의 수행원으로서 극에 짧게 등장하여 씬을 엮어 가는 조연 중 하나.'
      },
      {
        term: '함수초 (Hamsucho / Mimosa)',
        pronunciation: '[함수-초]',
        definition: '미모사와 같이 손을 대면 나뭇잎이 부끄러운 듯 오므라드는 신비한 식물. 자보로 사내들의 파괴적인 행보와 대조되는 은유적 장치로 언급된다.'
      },
      {
        term: '라디올 센 (Radiol Sen)',
        pronunciation: '[라디-올 센]',
        definition: '나가 평의회 의장을 지낸 명문 센 가문의 일원. 스스로를 위대한 극작가라 여기지만 예술적 재능이 처참해 주변을 피곤하게 만드는 코믹한 여성이다.'
      },
      {
        term: '수이신 센 (Suisin Sen)',
        pronunciation: '[수이-신 센]',
        definition: '센 가문에 소속된 장녀. 라디올 센 등과 함께 나가 측 파트의 서사 조각을 맞추며 가문의 권위로 얽혀들어간다.'
      },
      {
        term: '갈로텍 - 심장탑의 수호자 (Galotek, Guardian of the Heart Tower)',
        pronunciation: '[갈로-텍]',
        definition: '하텐그라쥬 심장탑을 지키는 강력한 수호자 중 한 명. 세리스마에 필적할 만큼 위험하고 음험한 계략을 꾸미며 다른 종족에게 막강한 위협이 되는 실력자다.'
      },
      {
        term: '히참마 (Hichamma)',
        pronunciation: '[히참-마]',
        definition: '일단 문지르기만 하면 아무리 강도 높은 강철조차 녹슨 과자처럼 바스라지도록 무르게 만드는 무시무시한 북부의 자생 풀.'
      },
      {
        term: '카시다의 나뭇꾼 (Woodcutter of Kashida)',
        pronunciation: '[카시-다의 나뭇-꾼]',
        definition: '폐허가 된 옛 도시 카시다 주변부에서 유래된 속담이나 옛이야기 구절로, 고집스럽거나 특정 상황의 은유로 입에 오르내리는 표현 중 하나다.'
      },
      {
        term: '시구리아트 유료 도로 (Siguriat Toll Road)',
        pronunciation: '[시구리-아-트 유-료 도-로]',
        definition: '시구리아트 산맥을 뚫고 지나가는 유일무이하고 안전한 통행로. 당주 보르보 삼귀가 이끄는 "유료도로당"이 무력으로 철저하게 점거하고 한 치 오차 없는 통행료를 거두어들인다.'
      },
      {
        term: '산양 연모자 (Goat Lover)',
        pronunciation: '[산양 연모-자]',
        definition: '동물(산양)과 교접하는 자라는 뜻으로, 북부의 척박한 땅에서 호전적인 사내들이 상대방을 밑바닥까지 깎아내릴 때 내뱉는 극히 원색적이고 악질적인 욕설이다.'
      },
      {
        term: '마루나래 (Marunarae)',
        pronunciation: '[마루-나-래]',
        definition: '과거 영웅왕(대호왕)을 태우고 날아다녔다는 전설 속의 압도적인 용. 퀴도부리타 용이 사랑에 빠진 상대이기도 하며 나중에는 하늘치가 되었다는 흥미로운 전설과 결부된 신물이기도 하다.'
      }
    ]
  },
  {
    chapterId: 'chapter_6',
    chapterTitle: '제6장 길을 준비하는 자',
    terms: [
      {
        term: '라호친 (Lahochin)',
        pronunciation: '[라호-친]',
        definition: '아라짓 제국 건국 이전 혹은 초창기에 존재했다고 전해지는 고대 인간 부족. 전설 속 처녀 하야로비의 출신지로 알려져 있다.'
      },
      {
        term: '주퀘도 (Juquedo)',
        pronunciation: '[주퀘-도]',
        definition: '천재적인 전략가이자 ‘죽음의 거장’이라 불린 주퀘도 사마르크를 지칭하는 이름. 작중에서는 이미 고인이 되어 군령의 형태로 등장한다.'
      },
      {
        term: '그라쉐 (Grashay)',
        pronunciation: '[그라-쉐]',
        definition: '나가 수호자 갈로텍의 육체에 깃들어 있는 수많은 군령들 중 하나. 주퀘도 등과 더불어 주요 군령으로 활약한다.'
      },
      {
        term: '극연왕 (King of Asceticism)',
        pronunciation: '[극연-왕]',
        definition: '아라짓 역대 왕 중 유일한 여왕이자 78년이라는 최장기 집권을 한 군주. 도로왕이라 불릴 만큼 대륙 곳곳에 수많은 도로를 건설한 업적이 있다.'
      },
      {
        term: '유료 도로당 (Toll Road Party)',
        pronunciation: '[유료 도-로-당]',
        definition: '천연의 험지 시구리아트 산맥을 관통하는 유일한 안전 도로를 무력으로 점거하고 관리하는 막강한 무장 단체. 철저하고 융통성 없는 통행료 징수로 악명이 높으나, 요금만 내면 대륙 최고의 안전을 보장한다.'
      },
      {
        term: '주케도 사마르크 (Jukedo Samark)',
        pronunciation: '[주케-도 사마르-크]',
        definition: '약 250년 전 활약했던 \'죽음의 거장\'. 제왕병자로서 독자적인 세력을 구축하려 했으나 유료도로당 요새를 무리하게 공격하다 몰락했다. 현재는 갈로텍의 몸 안에 깃든 최상의 전술적 두뇌 군령으로 쓰인다.'
      },
      {
        term: '아르히 (Arhi)',
        pronunciation: '[아르-히]',
        definition: '대륙 북부나 유료도로당 인근 등에서 찾아볼 수 있는 지독하게 독한 증류주. 얼어붙을 듯한 추위 속에서 몸을 덥히기 위해 마시는 강렬한 술이다.'
      },
      {
        term: '보늬 - 나늬의 언니 (Boneui)',
        pronunciation: '[보-늬]',
        definition: '도깨비 요술쟁이 비형 스라블이 데리고 다니는 거대한 수레 딱정벌레 "나늬"의 언니 개체 명칭. 친숙하고 충직한 거대 곤충 자매 중 하나이다.'
      },
      {
        term: '만민회의 (Assembly of All)',
        pronunciation: '[만민-회-의]',
        definition: '과거 아라짓 왕국 후반기 어지러운 정국을 타개하기 위해 열렸던 전설적인 회의. 키탈저 사냥꾼들이 왕실을 도우려 참석했으나 암군이었던 권능왕이 이들을 모욕해 내쫓으면서 왕국 멸망의 도화선이 된 비극적 사건이다.'
      },
      {
        term: '바라기의 실종 (Disappearance of Baragi)',
        pronunciation: '[바라-기의 실종]',
        definition: '과거 아라짓 전사들의 충성을 한데 모았던 구심점이자 상징적인 거대한 쌍신검 "바라기"가 홀연히 사라져 버린 역사적 사건. 이 실종으로 인해 왕국은 상징성을 잃고 쇠락의 길을 걸었다.'
      },
      {
        term: '아킨스로우 협곡 - 10만명 몰살 사건 (Akinsrow Canyon Massacre)',
        pronunciation: '[아킨-스로-우 협-곡 십만-명 몰살 사-건]',
        definition: '대확장 전쟁 당시 지형적 이점과 전술이 극적으로 맞물려, 그곳을 지나려던 나가 군단 약 10만 명이 참혹하게 몰살당했다고 전해지는 끔찍한 전투 전승.'
      },
      {
        term: '하르체 도빈 (Harche Dobin)',
        pronunciation: '[하르-체 도빈]',
        definition: '시구리아트 유료도로당의 고급 당원이자 천년요새를 지키는 관문 당원들의 우두머리. 산양을 굉장히 아끼고 사랑(?)하는 기행을 일삼으나, 당무결재자로서의 책임감과 긍지는 대단하다.'
      },
      {
        term: '노기 하수언 (Nogi Hasueon)',
        pronunciation: '[노기 하-수-언]',
        definition: '갈로텍의 몸 안에 머물고 있는 도깨비 영혼. 생전 당대 최고의 천재 대장장이였으며, 갈로텍이 필요로 하는 기계적 지식과 무기 설계에 결정적인 기여를 한다.'
      },
      {
        term: '칠푼디 (Chilpundi)',
        pronunciation: '[칠-푼-디]',
        definition: '유료도로당에 소속된 또 다른 고위 당원. 위기가 닥쳤을 때도 유료도로당원 특유의 강박적일 만큼 당당한 태도와 규정을 앞세워 난관을 마주하는 인물이다.'
      },
      {
        term: '케이 (Kei)',
        pronunciation: '[케-이]',
        definition: '유료도로당 당주 보르보 삼귀의 최측근 보좌관. 78세의 노인이지만 당을 사실상 조율하고 이끄는 지혜로운 실권자이며, 극의 서사에 깊이 연결되어 있는 숨겨진 배경을 지녔다.'
      }
    ]
  },
  {
    chapterId: 'chapter_7',
    chapterTitle: '제7장 여신의 신랑',
    terms: [
      {
        term: '페니나 시에도 (Penina Shiedo)',
        pronunciation: '[페니-나 시-에-도]',
        definition: '하텐그라쥬 소속의 나가 여성 대장장이. 자신의 처지를 비관하며 약간은 비굴한 성향을 보이지만 작중의 인물들과 교섭하며 스토리에 감초 역할을 한다.'
      },
      {
        term: '그로스 (Gros)',
        pronunciation: '[그로-스]',
        definition: '작중에 등장하거나 언급되는 인물 중 하나. 하인샤 대사원과 관련된 승려이거나 세계관 내 특정 집단의 일원으로 서사에 등장한다.'
      },
      {
        term: '이주무 선사 (Zen Master Ijumoo)',
        pronunciation: '[이주-무 선-사]',
        definition: '과거 하인샤 대사원을 지키기 위해 승려의 신분임에도 굳세게 무기를 들었던 전설적인 검승. 그가 남긴 유품(무기)은 벽월암에 보관되어 있다가 케이건 드라카에 의해 수리되어 다시금 전장에 나서게 된다.'
      },
      {
        term: '페라 대선 (Great Master Pera)',
        pronunciation: '[페-라 대-선]',
        definition: '어디에도 없는 신을 모시는 하인샤 대사원의 고위 승려 중 한 명. 대사원의 주요 실무나 회의 자리에서 이름이 언급되는 대덕승이다.'
      },
      {
        term: '라샤린 선사 (Zen Master Rasharin)',
        pronunciation: '[라샤-린 선-사]',
        definition: '하인샤 대사원의 대소사를 총괄하는 주지. 극단적으로 검박한 산중 수행 탓에 바싹 마른 외모를 가졌으며, 때로는 불심에 맞지 않는 거친 언행을 내뱉기도 하지만 대사원을 흔들림 없이 수호하는 정신적 지주이다.'
      }
    ]
  },
  {
    chapterId: 'chapter_8',
    chapterTitle: '제8장 열독',
    terms: [
      {
        term: '하모리 마립간 (Hamori Maripgan)',
        pronunciation: '[하모-리 마립-간]',
        definition: '아라짓 제국 멸망 이후 칭제건원하지 못한 북부의 수많은 지배자, 영주, 혹은 족장들이 군주의 권위를 나타내기 위해 대체하여 쓰던 북부의 전통적인 칭호, 혹은 당시 그 칭호를 썼던 특정 군주의 이름이다.'
      },
      {
        term: '지코마 성주 - 칼리도의 성주 (Lord Jikoma, Lord of Kalido)',
        pronunciation: '[지코-마 성-주]',
        definition: '쟁룡해에 접한 칼리도 지방을 굳건히 다스리는 성주. 타인의 마음을 읽는 듯한 감수성과 높은 지성을 갖췄으나 피비린내 나는 전란 속에서 전쟁 공포증 등으로 무너져가는 입체적이고 비극적인 영주이다.'
      },
      {
        term: '세미쿼 추장 (Chief Semiquo)',
        pronunciation: '[세미-쿼 추-장]',
        definition: '에시올 산맥의 어느 부족을 다스리는 괄괄한 족장. 제2차 대확장 전쟁 당시 북부 군단의 장군으로 합류하여 치열한 전장을 누볐다. 동료인 무핀토 추장과는 사사건건 부딪히는 앙숙지간이다.'
      },
      {
        term: '무핀토 추장 (Chief Mupinto)',
        pronunciation: '[무핀-토 추-장]',
        definition: '에시올 산맥 내 또 다른 부족의 족장. 북부 보병대를 거느리며 참전했으며 세미쿼 추장과 끊임없이 신경전을 벌이는 호전적이고 고집 센 지휘관이다.'
      },
      {
        term: '코네도 빌파 대족장 (Great Chieftain Conedo Vilpa)',
        pronunciation: '[코네-도 빌-파 대-족-장]',
        definition: '광활하고 혹독한 발케네 지역을 호령하는 대족장. 북부의 유력 군웅 중 한 명으로 거친 발케네 사내들을 묶어두는 막강한 카리스마와 통솔력을 지니고 있다.'
      },
      {
        term: '지러쿼터 산맥 (Jirugweoteo Mountains)',
        pronunciation: '[지-러-쿼-터 산-맥]',
        definition: '규리하 변경백령 동부 등에 웅장하게 뻗어 있는 북부의 거대한 산맥 지대. 북부 무사들의 험난한 여정과 야성을 대변하는 광대한 자연경관이다.'
      },
      {
        term: '발케네 (Valkene)',
        pronunciation: '[발케-네]',
        definition: '코네도 빌파 대족장이 지배하는 최북단 인근의 유력한 거점. 이 지역 출신들은 태생적으로 호전적이고 용감무쌍한 북부 전사의 기질을 유감없이 발휘한다.'
      },
      {
        term: '토카리 (Tokari)',
        pronunciation: '[토카-리]',
        definition: '코네도 빌파 대족장의 둘째 아들. 아비의 호전성과 발케네의 기상을 이어받아 훗날 대륙의 전란 속에서 굵직한 족적을 남기게 된다.'
      },
      {
        term: '그룸 (Grum)',
        pronunciation: '[그-룸]',
        definition: '코네도 빌파의 첫째 아들이자 가문의 계승자격 인물. 아버지를 도와 발케네와 북부 전선의 굳건한 방패 역할을 수행한다.'
      },
      {
        term: '원추리 (Daylily)',
        pronunciation: '[원추-리]',
        definition: '이름 그대로 현실의 식물이지만 작중에서는 "근심을 잊게 해 준다"는 서정적인 상징과 함께 은유적으로 등장하는 꽃. 피비린내 나는 여정 속에 대비되는 감성적 장치로 쓰인다.'
      },
      {
        term: '그로스 (Gros)',
        pronunciation: '[그로-스]',
        definition: '하인샤 대사원과 관련된 대덕이거나 승려. 성스러운 대사원의 내부 사정이나 규율의 무게감을 드러내는 장면에 종종 거론되는 인물 명칭이다.'
      },
      {
        term: '보트린 (Votrin)',
        pronunciation: '[보트-린]',
        definition: '나가 수호자 중 한 명. 심장탑 시스템과 수호자들의 복잡한 정치적 관계망 내에서 활동하며 음험하거나 혹은 비밀스러운 계획 속에서 이름이 거론된다.'
      },
      {
        term: '괄하이드 변경백 (Margrave Gwalhaid)',
        pronunciation: '[괄하-이-드 변-경-백]',
        definition: '규리하 영지를 다스리는 영주인 괄하이드 규리하가 역임하고 있는 군벌 직책. 국경을 수호하는 막대한 권한과 무력을 상징하는 북부의 핵심 지위이다.'
      },
      {
        term: '괄하이드 규리하 (Gwalhaid Gyuriha)',
        pronunciation: '[괄하-이-드 규리-하]',
        definition: '북부 제일의 기사이자 규리하의 변경백. 유쾌하고 시원시원한 호걸형 노장으로, 아라짓 제국 재건의 뼈대를 세우며 북부를 결속시킨 구심점 같은 인물이다.'
      },
      {
        term: '후사린 규리하 (Husarin Gyuriha)',
        pronunciation: '[후사-린 규리-하]',
        definition: '명문 무가(武家)인 규리하 가문의 일원. 막강한 규리하 기사단의 일각을 이루거나 가문의 무거움을 짊어지는 핵심 인물 중 하나로 칭해진다.'
      },
      {
        term: '과텔 (Gwatel)',
        pronunciation: '[과-텔]',
        definition: '규리하 변경백 휘하 혹은 북부 세력망 내에서 등장하는 기사 혹은 인물. 강력한 규리하의 영향력을 대변하는 구성원이다.'
      },
      {
        term: '케나린 규리하 (Kenarin Gyuriha)',
        pronunciation: '[케나-린 규리-하]',
        definition: '기사도의 상징인 규리하 가문의 직계 혈족이거나 핵심 기사. 괄하이드 규리하의 불같은 기사도 기질을 이어받아 전장과 정치망 속에서 활약한다.'
      },
      {
        term: '가이너 카쉬냅 (Gainer Kashnap)',
        pronunciation: '[가이-너 카-쉬-냅]',
        definition: '대륙 전역의 네 선민종족을 철학적으로 탐구한 가상의 사상서 《생각하는 동물들》의 저자. 깊은 통찰력으로 문명과 종족의 본질을 꿰뚫은 위대하고 신비로운 사상가이다.'
      },
      {
        term: '베카린도렌 마케로우 (Bekarindoren Makerow)',
        pronunciation: '[베카-린-도-렌 마-케-로우]',
        definition: '비극적인 운명의 여인 \'카린돌 마케로우\'의 길고 정식인 본명. 마케로우 가문의 전대 "보늬"이기도 했으며, 한 여성의 짊어진 거대한 숙명을 대변하는 무거운 칭호이기도 하다.'
      },
      {
        term: '디듀스류노 라르간드 페이 (Didiusryuno Largand Pei)',
        pronunciation: '[디듀-스-류-노 라-르-간-드 페-이]',
        definition: '명망 높은 페이 가문의 장녀. 모친 지커엔 페이와 함께 륜, 그리고 사모 페이의 곁에서 때로는 냉엄한 나가 사회의 규칙과 혈육의 정 사이에서 갈등을 보여주는 입체적 인물이다.'
      }
    ]
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
