import { useState } from 'react'
import CrossReferenceLink from './CrossReferenceLink'
import styles from './styles/ScienceConcepts.module.css'

const scienceConcepts = [
  {
    id: 1,
    title: '암흑의 숲 법칙',
    titleEn: 'Dark Forest Theory',
    category: '우주사회학',
    difficulty: '심화',
    shortDesc: '우주는 암흑의 숲이며, 모든 문명은 숨어있는 사냥꾼이다',
    simpleExplanation: '우주에는 수많은 문명이 있지만, 서로를 발견하면 생존을 위해 먼저 공격해야 한다는 이론입니다. 마치 어두운 숲 속에서 총을 든 사냥꾼들이 서로를 조심하는 것과 같습니다.',
    detailedExplanation: `뤄지가 발견한 우주사회학의 핵심 이론. 두 가지 공리에서 출발한다:

1) 생존은 문명의 제1욕구
2) 문명은 계속 확장하지만 우주 물질의 총량은 불변

이 두 공리로부터 다음을 도출할 수 있다:
- 우주에 두 문명이 있을 때, 한 문명이 다른 문명을 발견하면 의사소통이 불가능하다
- 상대의 의도(선의/악의)를 판단할 수 없고, 기술 발전 속도도 예측 불가능하다
- 따라서 유일한 합리적 선택은 "먼저 공격하는 것"이다

이것이 페르미 역설(외계 문명이 왜 보이지 않는가?)에 대한 암울한 답이다. 모두가 숨어있기 때문이다.`,
    formula: '문명 A는 문명 B를 발견 → A는 B의 의도를 알 수 없음 → 기술 폭발 가능성 → 선제공격이 유일한 생존 전략',
    realWorldConnection: '게임 이론의 "죄수의 딜레마"와 유사. 냉전 시대의 핵무기 경쟁도 비슷한 논리를 따른다.',
    relatedCharacters: ['뤄지', '정청신', '장베이하이'],
    relatedEvents: ['암흑의 숲 이론 발견', '검잡이 체제 시작', '삼체 멸망', '태양계 이차원화'],
    keyQuote: '"우주는 어두운 숲이다. 모든 문명은 총을 든 사냥꾼이다. 다른 생명을 발견하면 할 수 있는 일은 단 한 가지, 발사하는 것이다." - 뤄지',
    applications: [
      '삼체 함대를 막는 유일한 방법',
      '검잡이 체제의 이론적 근거',
      '광속 우주선이 필요한 이유'
    ]
  },
  {
    id: 2,
    title: '소폰 (지자, 智子)',
    titleEn: 'Sophon',
    category: '기술',
    difficulty: '보통',
    shortDesc: '양성자를 2차원으로 전개하여 만든 초지능 AI',
    simpleExplanation: '삼체 문명이 만든 초소형 슈퍼컴퓨터입니다. 양성자만한 크기지만 엄청난 계산 능력을 가지고 있어요. 지구에 보내져서 모든 과학 실험을 방해하고 정보를 수집합니다.',
    detailedExplanation: `소폰(Sophon)은 양성자(proton)를 11차원에서 2차원으로 전개하여 그 표면에 회로를 새긴 후 다시 접어 4차원으로 만든 초지능 AI다.

**제작 과정:**
1. 양성자를 11차원에서 2차원 평면으로 전개 (면적이 행성만큼 커짐)
2. 2차원 표면에 양자 회로 각인
3. 다시 4차원으로 접음
4. 광속으로 지구에 발사

**기능:**
- 지구의 모든 입자 가속기 실험 결과 조작
- 인류의 기초 과학 발전 봉쇄
- 삼체에 실시간 정보 전송
- 물리적 공격은 불가능하지만 감시는 완벽

**한계:**
- 인간의 "생각"은 읽을 수 없음 (이것이 면벽 계획의 근거)
- 양자 수준 간섭만 가능
- 직접적인 물리 공격 불가`,
    formula: '11차원 양성자 → 2차원 전개 → 회로 각인 → 4차원 재접기 → 지구 도달',
    realWorldConnection: '양자 컴퓨터와 나노 기술의 극한 버전. 현재 우리는 3차원에서 2차원 칩을 만들지만, 소폰은 차원 조작을 통해 더 높은 기술을 구현한다.',
    relatedCharacters: ['양둥', '딩이', '왕먀오', '예원제'],
    relatedEvents: ['과학자 연쇄 자살 사건', '물리학 법칙 붕괴', '면벽자 프로젝트 시작'],
    keyQuote: '"물리학은 존재하지 않는다. 우리는 이미 졌다." - 양둥',
    applications: [
      '인류 과학 발전 봉쇄',
      '실시간 지구 감시',
      '면벽 계획의 필요성 입증'
    ]
  },
  {
    id: 3,
    title: '차원 타격',
    titleEn: 'Dimensional Strike',
    category: '무기',
    difficulty: '심화',
    shortDesc: '고차원 공간을 저차원으로 붕괴시키는 궁극의 우주 무기',
    simpleExplanation: '3차원 세계를 2차원 평면으로 만들어버리는 무기입니다. 태양계가 공격받았을 때 모든 것이 종이처럼 평평해져버렸어요. 피할 방법이 없고, 광속으로 퍼집니다.',
    detailedExplanation: `우주는 원래 10차원이었으나, 수많은 문명 간 전쟁으로 차원이 계속 붕괴되어 현재 3차원이 되었다. 차원 타격은 이 과정을 인위적으로 가속하는 무기다.

**작동 원리:**
1. "이차원 박편"이라는 물체를 목표에 발사
2. 박편은 공간의 차원을 3차원 → 2차원으로 붕괴시킴
3. 붕괴는 광속으로 확산됨
4. 모든 물질이 2차원 평면에 펼쳐짐

**특징:**
- 방어 불가능 (광속보다 빠를 수 없음)
- 공격자도 위험 (연쇄 반응 가능)
- 되돌릴 수 없음
- 우주 전체를 파괴할 수 있는 "종말 무기"

**차원 붕괴의 역사:**
- 10차원 → 9차원 → ... → 3차원 (현재)
- 최종적으로 1차원으로 붕괴 예정
- 이것이 우주 종말의 원인

**유일한 대응책:**
"죽은 선(Dead Line)" - 광속을 낮춰 안전 선언하기`,
    formula: '3D 공간 + 이차원 박편 → 2D 평면 (광속 확산)',
    realWorldConnection: '블랙홀의 "정보 역설"과 유사. 3차원 정보가 2차원 표면(사건의 지평선)에 저장된다는 이론.',
    relatedCharacters: ['정청신', '관이판', '뤄지'],
    relatedEvents: ['삼체 멸망', '태양계 이차원화', '죽은 선 생성'],
    keyQuote: '"우주는 한때 10차원의 낙원이었다. 하지만 전쟁이 차원을 파괴했다." - 관이판',
    applications: [
      '삼체 항성계 파괴',
      '태양계 파괴',
      '우주 종말의 원인'
    ]
  },
  {
    id: 4,
    title: '워터 드롭',
    titleEn: 'Water Droplet / Droplet',
    category: '무기',
    difficulty: '보통',
    shortDesc: '삼체가 보낸 완벽한 강체 탐사선. 인류 함대 2000척을 단독 격파',
    simpleExplanation: '물방울처럼 생긴 작고 아름다운 우주선입니다. 하지만 실제로는 무시무시한 무기로, 인류의 모든 우주 함대를 혼자서 파괴했어요. 어떤 무기로도 부술 수 없을 만큼 단단합니다.',
    detailedExplanation: `워터 드롭은 삼체 문명이 보낸 무인 탐사선으로, 인류 역사상 가장 치명적인 무기였다.

**물리적 특성:**
- 크기: 3.5미터 (사람 키 정도)
- 형태: 완벽한 물방울 모양
- 재질: 강입자(Strong interaction material) - 원자핵을 묶는 강한 핵력으로 만든 물질
- 표면: 완벽하게 매끄러움 (거울처럼 반사)
- 온도: 절대영도
- 밀도: 상상을 초월

**능력:**
- 어떤 무기로도 파괴 불가능
- 광속에 가까운 속도로 가속 가능
- 관성 조작 가능 (질량 변환)
- 2000척의 우주 함대를 2시간 만에 전멸

**말일 전투:**
워터 드롭 단 1기가 인류의 2000척 우주 함대를 체계적으로 파괴했다. 초고속으로 함선들을 관통하며 200만 명이 사망했다. 이것이 인류에게 "기술 격차"의 진실을 깨닫게 한 사건이다.`,
    formula: '강입자 물질 + 관성 조작 + 광속 기동 = 무적의 무기',
    realWorldConnection: '중성자별 물질의 밀도와 유사. 이론적으로 강한 핵력으로 물질을 만들면 워터 드���과 같은 특성을 가질 수 있다.',
    relatedCharacters: ['창웨이스', '장베이하이', '둥펑웨이'],
    relatedEvents: ['워터 드롭 발견', '말일 전투', '암흑 전투'],
    keyQuote: '"그것은 너무 아름다웠다. 마치 예술 작품처럼. 하지만 그 아름다움이 우리를 죽였다." - 생존자',
    applications: [
      '인류 함대 전멸',
      '기술 격차 입증',
      '도망주의 정당화'
    ]
  },
  {
    id: 5,
    title: '곡률 추진 (광속 우주선)',
    titleEn: 'Curvature Drive',
    category: '기술',
    difficulty: '보통',
    shortDesc: '공간의 곡률을 변형시켜 광속으로 이동하는 기술',
    simpleExplanation: '우주선 앞의 공간을 압축하고 뒤의 공간을 확장시켜 빛의 속도로 날아가는 기술입니다. 우주선 자체는 움직이지 않고 공간이 움직여요. 마치 파도를 타는 것처럼요.',
    detailedExplanation: `곡률 추진은 공간 자체의 기하학적 구조를 변형시켜 이동하는 기술이다.

**작동 원리:**
1. 우주선 앞쪽 공간을 압축 (곡률 증가)
2. 우주선 뒤쪽 공간을 확장 (곡률 감소)
3. 공간의 흐름에 따라 우주선이 "서핑"하듯 이동
4. 우주선 자체는 정지 상태 (상대성 이론 위배 없음)

**특징:**
- 빛보다 빠른 이동 가능 (상대론 위배 없음)
- 항적(Trail)을 남김 → "죽은 선(Dead Line)"
- 항적 내부는 광속이 낮아짐
- 엄청난 에너지 필요

**죽은 선(Dead Line):**
곡률 추진 우주선이 남긴 항적은 그 영역의 광속을 영구적으로 낮춘다. 이것은 일종의 "안전 선언"이다:
- "우리는 이 영역을 영구적으로 느리게 만들었으므로 위협이 아니다"
- 차원 타격으로부터 보호하는 유일한 방법

**인류의 실패:**
정청신이 광속 우주선 개발을 막은 것이 인류 멸망의 결정적 원인이 되었다.`,
    formula: '공간 압축(앞) + 공간 확장(뒤) = 광속 이동 + 항적',
    realWorldConnection: 'NASA의 "Alcubierre Warp Drive" 이론과 동일. 아직 이론 단계이지만 물리 법칙에는 위배되지 않는다.',
    relatedCharacters: ['토마스 웨이드', '정청신', '관이판'],
    relatedEvents: ['광속 우주선 개발 은폐', '광속 추진 연구 재개', '중력호 완성'],
    keyQuote: '"우리는 별들을 향해 전진한다. 전진만이 있을 뿐!" - 토마스 웨이드',
    applications: [
      '태양계 탈출',
      '죽은 선 생성 (안전 선언)',
      '차원 타격 회피'
    ]
  },
  {
    id: 6,
    title: '면벽 계획',
    titleEn: 'Wallfacer Project',
    category: '전략',
    difficulty: '쉬움',
    shortDesc: '소폰의 감시를 피하기 위해 생각만으로 전략을 숨기는 계획',
    simpleExplanation: '소폰이 모든 것을 감시하지만 사람의 생각만은 읽을 수 없어요. 그래서 4명의 특별한 사람이 선택되어 자신의 머릿속에만 비밀 작전을 숨깁니다. 누구에게도 말하지 않아요.',
    detailedExplanation: `소폰이 지구의 모든 정보를 실시간으로 삼체에 전송하지만, "인간의 사고"만은 읽을 수 없다는 약점을 이용한 전략.

**4명의 면벽자:**
1. **프레드릭 타일러** - 수소폭탄 우주전함 (실패)
2. **마누엘 레이디아즈** - 수성 핵폭탄 (실패 후 자살)
3. **빌 하인즈** - 사고강인 프로젝트 (실패)
4. **뤄지** - 암흑의 숲 위협 (성공!)

**규칙:**
- 면벽자는 자신의 진짜 계획을 누구에게도 말하지 않음
- 전 인류의 자원을 마음대로 동원 가능
- 설명할 의무 없음
- "나도 내 계획을 모른다"고 말해도 됨

**파벽자(Wallbreaker):**
ETO가 각 면벽자에게 배정한 대응자. 면벽자의 행동을 분석하여 진짜 의도를 밝혀낸다.

**결과:**
타일러, 레이디아즈, 하인즈 모두 실패. 오직 뤄지만이 성공하여 암흑의 숲 이론으로 인류를 구원했다.`,
    formula: '소폰의 감시 - 사고 독해 불가 = 면벽자의 비밀 전략',
    realWorldConnection: '냉전 시대의 핵무기 전략과 유사. "전략적 모호성"을 유지하는 것이 억지력이 된다.',
    relatedCharacters: ['뤄지', '타일러', '레이디아즈', '하인즈'],
    relatedEvents: ['면벽자 프로젝트 시작', '암흑의 숲 이론 발견'],
    keyQuote: '"당신의 계획은 무엇입니까? - 그것은 비밀입니다. 나조차 아직 모릅니다." - 면벽자',
    applications: [
      '소폰 감시 우회',
      '전략적 불확실성 유지',
      '삼체의 심리전 대응'
    ]
  },
  {
    id: 7,
    title: '검잡이 (Swordholder)',
    titleEn: 'Swordholder',
    category: '전략',
    difficulty: '쉬움',
    shortDesc: '암흑의 숲 타격 스위치를 쥔 자. 삼체와 지구를 동시에 파괴할 수 있는 힘',
    simpleExplanation: '검잡이는 버튼 하나로 삼체와 지구의 위치를 우주에 알릴 수 있는 사람이에요. 그러면 둘 다 다른 문명에게 공격받아 멸망합니다. 이 무서운 위협 덕분에 평화가 유지되었어요.',
    detailedExplanation: `검잡이는 상호확증파괴(MAD, Mutual Assured Destruction) 체제의 핵심이다.

**역할:**
- 손에 암흑의 숲 타격 스위치를 쥠
- 스위치를 누르면 삼체와 지구의 좌표가 우주로 브로드캐스트됨
- 두 문명 모두 다른 우주 문명의 타격을 받아 멸망
- 매 순간 결단력이 요구됨

**역대 검잡이:**

**1대: 뤄지 (62년간)**
- 암흑의 숲 이론 발견자
- 강력한 위협 의지
- 삼체를 후퇴시킴
- 황금 시대를 만듦
- 평가: 완벽한 검잡이

**2대: 정청신 (15분)**
- 사랑과 책임감이 넘치는 인물
- 위협을 실행할 결단력 부족
- 삼체가 즉시 간파함
- 지구 재침공 허용
- 평가: 치명적 실패

**요구되는 자질:**
- 냉혹한 결단력
- 두 문명을 파괴할 의지
- 도덕적 부담을 견딜 정신력
- "악마"가 될 각오

**결과:**
정청신의 실패로 인류는 호주에 격리되고, 광속 우주선 연구가 금지되었다. 이것이 인류 멸망의 시작이었다.`,
    formula: '강한 위협 의지 = 평화 유지 / 약한 의지 = 즉시 침공',
    realWorldConnection: '냉전 시대 핵무기 억지력과 동일. "미친 사람 이론(Madman Theory)" - 상대가 당신을 예측 불가능하고 위험하다고 믿게 만드는 것이 전략.',
    relatedCharacters: ['뤄지', '정청신'],
    relatedEvents: ['검잡이 체제 시작', '검잡이 교체와 위협 해제', '지구 재침공'],
    keyQuote: '"나는 검을 들고 있다. 두 세계를 겨냥하고." - 뤄지',
    applications: [
      '62년 평화 유지',
      '삼체 기술 이전',
      '황금 시대 도래'
    ]
  },
  {
    id: 8,
    title: '우주사회학',
    titleEn: 'Cosmic Sociology',
    category: '우주사회학',
    difficulty: '심화',
    shortDesc: '우주 문명 간 상호작용을 연구하는 학문. 암흑의 숲 이론의 기초',
    simpleExplanation: '우주에 있는 서로 다른 문명들이 어떻게 행동할지 연구하는 학문이에요. 뤄지가 이것을 연구해서 "암흑의 숲" 이론을 발견했습니다.',
    detailedExplanation: `뤄지가 창시한 학문으로, 우주 규모에서 문명 간 상호작용을 연구한다.

**두 가지 공리:**

**공리 1: 생존은 문명의 제1욕구**
- 모든 문명은 우선 생존을 추구한다
- 생존을 위해서는 모든 것을 희생할 수 있다
- 도덕, 윤리도 생존 앞에서는 부차적

**공리 2: 문명은 계속 확장하지만 우주 물질의 총량은 불변**
- 모든 문명은 자원을 필요로 한다
- 우주의 자원은 한정되어 있다
- 확장하는 문명들은 결국 충돌한다

**이로부터 도출되는 결론:**

**의심의 사슬 (Chain of Suspicion):**
- 문명 A가 문명 B를 발견
- A는 B의 의도(선의/악의)를 알 수 없음
- B도 A가 자신을 어떻게 생각하는지 알 수 없음
- 이 불확실성은 영원히 해소 불가능
- 유일한 해법: 선제공격

**기술 폭발 (Technological Explosion):**
- 문명의 기술은 예측 불가능하게 급성장할 수 있다
- 지금은 약해 보이는 문명이 100년 후 위협이 될 수 있다
- 따라서 발견 즉시 제거해야 한다

**결론: 암흑의 숲 법칙**
우주는 암흑의 숲이며, 모든 문명은 총을 든 사냥꾼이다.`,
    formula: '생존 제1 + 자원 한정 + 의심의 사슬 + 기술 폭발 = 암흑의 숲',
    realWorldConnection: '국제정치학의 "현실주의(Realism)" 이론과 유사. 무정부 상태에서는 힘만이 생존을 보장한다.',
    relatedCharacters: ['뤄지'],
    relatedEvents: ['암흑의 숲 이론 발견', '검잡이 체제 시작'],
    keyQuote: '"문명 사이에는 영원한 의심의 사슬이 존재한다." - 뤄지',
    applications: [
      '암흑의 숲 이론',
      '검잡이 체제',
      '페르미 역설 해석'
    ]
  },
  {
    id: 9,
    title: '나노와이어',
    titleEn: 'Nanofiber',
    category: '기술',
    difficulty: '쉬움',
    shortDesc: '왕먀오가 개발한 극도로 얇고 강한 나노 재료. ETO 소탕에 사용',
    simpleExplanation: '머리카락보다 훨씬 얇지만 엄청나게 강한 실입니다. 이것으로 ETO의 배를 67조각으로 잘라서 정보를 빼앗았어요. "심판의 날" 작전이라고 불려요.',
    detailedExplanation: `왕먀오가 개발한 탄소 나노튜브 기반 초강력 섬유.

**특성:**
- 두께: 나노미터 수준 (거의 보이지 않음)
- 강도: 다이아몬드보다 강함
- 인장 강도: 수십 GPa
- 모든 물질을 절단 가능

**심판의 날 작전 (Judgment Day):**
1. ETO 본부가 있는 유조선 "심판자호"를 표적으로 지정
2. 파나마 운하 양쪽에 나노와이어 그물 설치
3. 배가 통과하면서 67개 층으로 수평 절단
4. ETO 데이터 확보, 예원제와 에반스 사망

**윤리적 논란:**
- 수백 명이 잔혹하게 사망
- "괴물과 싸우기 위해 괴물이 되었다" - Thomas Wade
- 목적을 위해 수단을 정당화할 수 있는가?

**이후 활용:**
나노와이어 기술은 우주 엘리베이터, 우주선 구조재 등에 활용됨.`,
    formula: '탄소 나노튜브 + 극한 강도 = 나노와이어',
    realWorldConnection: '실제로 탄소 나노튜브는 이론상 철보다 100배 강하고 구리보다 전기 전도성이 높다. 하지만 아직 대량 생산이 어렵다.',
    relatedCharacters: ['왕먀오', '스창', '토마스 웨이드', '마이크 에반스', '예원제'],
    relatedEvents: ['나노와이어 작전', 'ETO 1차 소탕'],
    keyQuote: '"우리는 괴물과 싸우기 위해 괴물이 되었다." - Thomas Wade',
    applications: [
      'ETO 소탕',
      '우주 엘리베이터',
      '우주선 구조재'
    ]
  },
  {
    id: 10,
    title: '죽은 선 (Dead Line)',
    titleEn: 'Dead Line / Reduced Light Speed Trail',
    category: '전략',
    difficulty: '보통',
    shortDesc: '광속을 낮춘 우주 영역. 차원 타격으로부터 보호하는 안전 선언',
    simpleExplanation: '광속 우주선이 지나간 자리는 빛의 속도가 영원히 느려져요. 이것은 다른 문명에게 "우리는 위협이 아니에요"라고 말하는 거예요. 차원 타격을 피할 수 있는 유일한 방법입니다.',
    detailedExplanation: `곡률 추진 우주선이 남긴 항적으로, 그 영역의 광속을 영구적으로 낮춘다.

**생성 원리:**
1. 곡률 추진 엔진이 공간 구조를 변형
2. 우주선이 지나간 항적의 광속이 낮아짐
3. 일반적으로 광속의 16.7km/s까지 낮아짐
4. 되돌릴 수 없음 (영구적 변화)

**전략적 의미:**

**안전 선언 (Safety Statement):**
- "우리는 이 영역을 영구적으로 느리게 만들었다"
- "우리는 외부로 나갈 수 없다"
- "우리는 위협이 아니다"

**차원 타격 방어:**
차원 타격(3D→2D 붕괴)은 광속으로 확산된다. 하지만 광속이 낮아진 영역에서는:
- 타격 확산 속도가 느려짐
- 내부 문명이 탈출할 시간을 벌 수 있음
- 사실상 차원 타격의 유일한 대응책

**인류의 실패:**
정청신이 광속 우주선 개발을 막았기 때문에, 태양계는 죽은 선을 만들지 못했다. 결국 태양계는 차원 타격을 받아 이차원화되었다.

**블랙 도메인 (Black Domain):**
광속을 극한까지 낮춰(시속 16.7km) 만든 궁극의 안전 영역. 외부와 완전히 단절되지만 내부는 안전.`,
    formula: '곡률 추진 항적 → 광속 감소 → 안전 선언 + 차원 타격 방어',
    realWorldConnection: '일반 상대성 이론에 따르면 중력장이 강한 곳에서는 시간이 느리게 간다. 죽은 선은 이를 극단적으로 확장한 개념.',
    relatedCharacters: ['관이판', '정청신', '토마스 웨이드'],
    relatedEvents: ['광속 우주선 개발', '태양계 이차원화', '중력호 완성'],
    keyQuote: '"우리는 스스로를 어둠 속에 가둔다. 영원히." - 관이판',
    applications: [
      '안전 선언',
      '차원 타격 방어',
      '고립된 생존'
    ]
  },
  {
    id: 11,
    title: '카이퍼 벨트',
    titleEn: 'Kuiper Belt',
    category: '천문학',
    difficulty: '쉬움',
    shortDesc: '해왕성 궤도 밖에 있는 얼음 천체들의 고리 지대',
    simpleExplanation: '태양계 끝자락에 있는 얼음 덩어리들이 모여있는 지역이에요. 명왕성도 여기에 있습니다. 태양계가 만들어질 때 남은 재료들이 모여있는 곳이라고 생각하면 됩니다.',
    detailedExplanation: `카이퍼 벨트는 해왕성 궤도(태양으로부터 약 30AU) 너머에 위치한 천체들의 원반 모양 지대다.

**위치와 범위:**
- 거리: 태양으로부터 30AU ~ 50AU (1AU = 지구-태양 거리)
- 해왕성 궤도 바로 밖에서 시작
- 원반 모양의 구조
- 태양계 형성 초기 물질의 보고

**구성:**
- 주로 얼음과 암석으로 이루어진 소천체들
- 수십만 개 이상의 천체 존재
- 지름 100km 이상 천체도 다수
- 혜성의 주요 공급원

**주요 천체:**
- 명왕성 (준왕성, 2006년 행성 지위 박탈)
- 에리스 (준왕성)
- 마케마케 (준왕성)
- 하우메아 (준왕성)

**과학적 의미:**
- 태양계 초기 형성 물질 연구
- 행성 형성 과정 이해
- 단주기 혜성의 기원
- 태양계 외곽 경계 정의

**삼체 소설 속 카이퍼 벨트:**
린저-피츠로이 관측소가 소행성대 외측의 태양 궤도상에 있다고 언급되는데, 이는 카이퍼 벨트 근처나 그 너머 지역을 의미할 수 있다. 태양계 외곽의 중요한 우주 관측 거점으로 묘사된다.`,
    formula: '해왕성 궤도(30AU) ~ 50AU = 카이퍼 벨트 영역',
    realWorldConnection: '1992년 처음 발견되었으며, 2006년 명왕성이 행성에서 준왕성으로 재분류된 계기가 되었다. NASA의 뉴호라이즌스 탐사선이 2015년 명왕성을 지나 카이퍼 벨트를 탐사했다.',
    relatedCharacters: ['켄', '로빈슨', '앨버트 린저'],
    relatedEvents: [],
    keyQuote: '"태양계의 끝자락, 그곳에서 우리는 우주를 관찰한다." - 관측소 과학자들',
    applications: [
      '린저-피츠로이 관측소 위치',
      '태양계 외곽 관측 거점',
      '우주 망원경 설치 위치'
    ]
  },
  {
    id: 12,
    title: '3항성계 (삼체 문제)',
    titleEn: 'Three-Body Problem',
    category: '천문학',
    difficulty: '심화',
    shortDesc: '3개의 항성이 서로 중력 작용하는 혼돈 시스템',
    simpleExplanation: '삼체 문명의 고향은 3개의 태양이 있어요. 이 3개의 태양이 복잡하게 움직여서 언제 어디에 나타날지 예측할 수 없습니다. 그래서 행성의 기후가 극도로 불안정해요.',
    detailedExplanation: `3항성계는 삼체 문명이 살고 있는 항성계로, 3개의 태양이 복잡한 중력 상호작용을 하는 혼돈 시스템이다.

**물리학적 배경:**
고전 역학의 유명한 난제. 2개 천체는 궤도 예측 가능하지만, 3개 이상은 해석적 해가 없다.

**삼체계의 특징:**
- 3개의 항성이 불규칙하게 배치
- 예측 불가능한 궤도 운동
- 주기적 패턴 없음

**행성 환경:**

혼돈 시대 (Chaotic Era):
- 태양이 여러 개 뜨거나 없어짐
- 극한의 온도 변화
- 모든 생명체가 탈수하여 생존
- 문명 파괴 반복

항정 시대 (Stable Era):
- 짧은 안정기
- 문명 발전 가능
- 언제 끝날지 예측 불가능

**삼체 문명의 대응:**
- 200번 이상의 문명 멸망과 재건
- 탈수/복수화 능력 진화
- 극한 환경 생존 기술
- 지구 침공 결정의 배경`,
    formula: '3개 천체의 중력 방정식 = 해석적 해 없음 (혼돈 시스템)',
    realWorldConnection: '실제 3체 문제는 앙리 푸앵카레가 혼돈 이론의 시작점이 되었다. 태양계도 장기적으로는 혼돈 시스템이지만 단기적으로는 안정적이다.',
    relatedCharacters: ['예원제', '왕먀오'],
    relatedEvents: ['삼체 게임', '삼체와의 첫 접촉'],
    keyQuote: '"이것이 우리의 세계다. 혼돈의 3항성계. 우리는 200번의 문명을 잃었다." - 삼체인',
    applications: [
      '삼체 문명의 환경 이해',
      '혼돈 이론 적용',
      '지구 침공 동기'
    ]
  },
  {
    id: 13,
    title: '강입자 물질',
    titleEn: 'Strong Interaction Material',
    category: '물리학',
    difficulty: '심화',
    shortDesc: '강한 핵력으로 만든 물질. 워터 드롭의 재질',
    simpleExplanation: '원자핵을 묶고 있는 가장 강한 힘으로 만든 물질이에요. 워터 드롭이 이것으로 만들어져서 어떤 무기로도 부술 수 없었어요. 중성자별의 물질과 비슷합니다.',
    detailedExplanation: `강입자 물질은 원자핵 내부를 묶는 "강한 핵력(Strong Nuclear Force)"으로 만든 물질이다.

**4가지 기본 힘:**
1. 중력 (가장 약함)
2. 전자기력
3. 약한 핵력
4. 강한 핵력 (가장 강함)

**강입자 물질의 특성:**

구조:
- 일반 물질: 원자 → 분자 (전자기력으로 결합)
- 강입자 물질: 핵자들이 강한 핵력으로 직접 결합
- 중성자별 물질과 유사

물리적 특성:
- 밀도: 상상을 초월 (1cm³가 수십억 톤)
- 강도: 어떤 힘으로도 파괴 불가능
- 표면: 완벽하게 매끄러움
- 온도: 절대영도 유지 가능

**워터 드롭:**
삼체 문명이 강입자 물질로 만든 탐사선. 크기는 3.5m지만 2000척 함대를 전멸시켰다.`,
    formula: '강한 핵력으로 핵자 직접 결합 = 최강 물질',
    realWorldConnection: '중성자별은 실제로 강한 핵력으로 묶인 물질 덩어리다. 밀도는 설탕 한 스푼이 지구 전체 인구 무게와 같다.',
    relatedCharacters: ['창웨이스', '장베이하이'],
    relatedEvents: ['워터 드롭 발견', '말일 전투'],
    keyQuote: '"그것은 완벽했다. 너무 완벽해서 우리는 죽었다."',
    applications: [
      '워터 드롭 제작',
      '무적의 무기',
      '기술 격차 증명'
    ]
  },
  {
    id: 14,
    title: '차원 전개',
    titleEn: 'Dimensional Unfolding',
    category: '물리학',
    difficulty: '심화',
    shortDesc: '고차원 물체를 저차원으로 펼치는 기술. 소폰 제작 원리',
    simpleExplanation: '양성자를 종이처럼 평평하게 펼치는 기술이에요. 11차원 양성자를 2차원으로 펼치면 표면적이 엄청나게 커져서 거기에 회로를 그릴 수 있어요. 그리고 다시 접으면 소폰이 됩니다.',
    detailedExplanation: `차원 전개는 고차원 공간에 존재하는 물체를 저차원으로 펼치는 삼체 문명의 핵심 기술이다.

**이론적 배경:**

끈 이론 (String Theory):
- 우주는 10~11차원
- 우리가 보는 건 3차원만
- 나머지 차원은 극도로 작게 말려있음
- 하지만 원리적으로는 펼칠 수 있음

**소폰 제작 과정:**

1단계: 11차원 → 2차원 전개
- 양성자를 11차원에서 2차원으로 전개
- 표면적이 행성 크기로 확대

2단계: 회로 각인
- 2차원 표면에 양자 회로 새김
- 회로 복잡도: 초AI 수준

3단계: 재접기
- 2차원 → 4차원으로 재접기
- 크기: 다시 양성자 크기로
- 하지만 회로는 그대로 보존

4단계: 발사
- 광속으로 지구에 발사`,
    formula: '11D 양성자 → 2D 전개 → 회로 각인 → 4D 재접기 = 소폰',
    realWorldConnection: '끈 이론은 실제 물리학 이론이다. 우주가 10~11차원이라는 가설을 제시하지만, 아직 실험적 증명은 없다.',
    relatedCharacters: ['양둥', '딩이', '왕먀오'],
    relatedEvents: ['소폰 발사', '과학자 자살 사건'],
    keyQuote: '"우주는 2차원으로 펼쳐졌다. 우리는 양성자 표면에 회로를 새겼다." - 삼체 과학자',
    applications: [
      '소폰 제작',
      '초소형 슈퍼컴퓨터',
      '차원 조작 기술'
    ]
  },
  {
    id: 15,
    title: '탈수와 복수화',
    titleEn: 'Dehydration and Rehydration',
    category: '생물학',
    difficulty: '보통',
    shortDesc: '삼체인의 생존 기술. 물을 빼서 보존하고 다시 살아남',
    simpleExplanation: '삼체 행성은 환경이 너무 불안정해서 생명체가 물을 모두 빼내고 말라버려서 보관됩니다. 안정기가 오면 다시 물을 넣어서 살아나요. 마치 식물 씨앗처럼요.',
    detailedExplanation: `탈수와 복수화는 삼체 문명이 혼돈 시대를 생존하기 위해 진화시킨 독특한 생리 메커니즘이다.

**탈수 과정:**
- 체내 물 전부 배출
- 세포 구조 보존
- 섬유질 상태로 변환
- 수백 년 보존 가능

**복수화 과정:**
- 안정기 확인
- 탈수체에 물 투입
- 세포 재구성
- 의식 회복, 기억 유지

**문명적 영향:**
- 대부분의 인구 탈수 보관
- 필요한 인구만 활동
- 자원 효율 극대화

**전쟁 전략:**
- 군대를 탈수하여 이동
- 적지에서 복수화하여 공격`,
    formula: '생명체 - 물 = 보존 가능 / 보존체 + 물 = 소생',
    realWorldConnection: '실제로 곰벌레(Tardigrade)는 극한 환경에서 탈수 상태로 수십 년 생존 가능. 물을 주면 다시 살아난다.',
    relatedCharacters: ['예원제', '왕먀오'],
    relatedEvents: ['삼체 게임'],
    keyQuote: '"비가 내리고 있다. 그들이 다시 살아날 것이다." - 삼체 게임',
    applications: [
      '혼돈 시대 생존',
      '장기 보존',
      '우주 이동 전략'
    ]
  },
  {
    id: 16,
    title: '소행성대',
    titleEn: 'Asteroid Belt',
    category: '천문학',
    difficulty: '쉬움',
    shortDesc: '화성과 목성 사이의 소천체 밀집 지역',
    simpleExplanation: '화성과 목성 사이에 수많은 돌덩어리들이 떠다니는 지역이에요. 태양계가 만들어질 때 행성이 되지 못한 재료들이 남아있는 곳입니다.',
    detailedExplanation: `소행성대는 화성과 목성 궤도 사이에 위치한 소천체들의 밀집 지역이다.

**위치와 특징:**
- 거리: 태양으로부터 2.2 ~ 3.2 AU
- 화성 궤도 바깥 ~ 목성 궤도 안쪽
- 폭: 약 1억 5천만 km

**구성:**
- 수십만 개의 소행성
- 크기: 수 m ~ 수백 km
- 가장 큰 소행성: 세레스 (지름 950km, 준왕성)

**형성 원인:**
- 태양계 초기에 행성으로 뭉치려 했음
- 하지만 목성의 강력한 중력 때문에 실패
- 행성이 되지 못한 잔해

**소설 속 소행성대:**
린저-피츠로이 관측소가 "소행성대 외측"에 있다고 언급. 이는 화성-목성 사이를 넘어 더 먼 우주 공간을 의미.`,
    formula: '화성 궤도 ~ 목성 궤도 사이 = 소행성대',
    realWorldConnection: 'NASA의 던(Dawn) 탐사선이 2007-2018년 소행성대를 탐사했다. 베스타와 세레스를 근접 관찰했다.',
    relatedCharacters: ['켄', '로빈슨', '앨버트 린저'],
    relatedEvents: [],
    keyQuote: '"소행성대를 넘어, 우리는 더 깊은 우주를 관찰한다." - 우주 망원경 과학자',
    applications: [
      '우주 관측소 위치 참조',
      '태양계 구조 이해',
      '항성 간 항해 경로'
    ]
  }
]

export default function ScienceConcepts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [selectedConcept, setSelectedConcept] = useState(null)
  const [showSimple, setShowSimple] = useState(true)

  // Get unique categories
  const categories = ['all', ...new Set(scienceConcepts.map(c => c.category))]
  const difficulties = ['all', '쉬움', '보통', '심화']

  // Filter concepts
  const filteredConcepts = scienceConcepts.filter(concept => {
    const matchesSearch = concept.title.includes(searchTerm) ||
                         concept.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         concept.shortDesc.includes(searchTerm)
    const matchesCategory = categoryFilter === 'all' || concept.category === categoryFilter
    const matchesDifficulty = difficultyFilter === 'all' || concept.difficulty === difficultyFilter
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className={styles.conceptsContainer}>
      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="개념 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.select}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? '전체 카테고리' : cat}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className={styles.select}
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff === 'all' ? '전체 난이도' : diff}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.resultCount}>
          {filteredConcepts.length}개의 개념
        </div>
      </div>

      {/* Concepts Grid */}
      <div className={styles.conceptsGrid}>
        {filteredConcepts.map((concept, index) => (
          <div
            key={concept.id}
            className={`${styles.conceptCard} ${selectedConcept === concept.id ? styles.expanded : ''}`}
            onClick={() => setSelectedConcept(selectedConcept === concept.id ? null : concept.id)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={styles.conceptHeader}>
              <div className={styles.conceptTitle}>{concept.title}</div>
              <div className={styles.badges}>
                <span className={styles.categoryBadge}>{concept.category}</span>
                <span className={`${styles.difficultyBadge} ${styles[concept.difficulty]}`}>
                  {concept.difficulty}
                </span>
              </div>
            </div>

            <div className={styles.conceptTitleEn}>{concept.titleEn}</div>
            <div className={styles.conceptShortDesc}>{concept.shortDesc}</div>

            {selectedConcept === concept.id && (
              <div className={styles.conceptDetails}>
                {/* Toggle Simple/Detailed */}
                <div className={styles.toggleView}>
                  <button
                    className={`${styles.toggleButton} ${showSimple ? styles.active : ''}`}
                    onClick={(e) => { e.stopPropagation(); setShowSimple(true); }}
                  >
                    쉬운 설명
                  </button>
                  <button
                    className={`${styles.toggleButton} ${!showSimple ? styles.active : ''}`}
                    onClick={(e) => { e.stopPropagation(); setShowSimple(false); }}
                  >
                    심화 설명
                  </button>
                </div>

                <div className={styles.explanation}>
                  {showSimple ? concept.simpleExplanation : concept.detailedExplanation}
                </div>

                {concept.formula && (
                  <div className={styles.formulaSection}>
                    <h4>공식/원리</h4>
                    <div className={styles.formula}>{concept.formula}</div>
                  </div>
                )}

                {concept.keyQuote && (
                  <div className={styles.quoteSection}>
                    <h4>명대사</h4>
                    <blockquote className={styles.quote}>{concept.keyQuote}</blockquote>
                  </div>
                )}

                {concept.applications && (
                  <div className={styles.applicationsSection}>
                    <h4>적용 사례</h4>
                    <ul className={styles.applicationsList}>
                      {concept.applications.map((app, i) => (
                        <li key={i}>{app}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {concept.relatedCharacters && concept.relatedCharacters.length > 0 && (
                  <div className={styles.relatedSection}>
                    <h4>관련 인물</h4>
                    <div className={styles.relatedTags}>
                      {concept.relatedCharacters.map((char, i) => (
                        <CrossReferenceLink key={i} type="character" name={char} />
                      ))}
                    </div>
                  </div>
                )}

                {concept.relatedEvents && concept.relatedEvents.length > 0 && (
                  <div className={styles.relatedSection}>
                    <h4>관련 사건</h4>
                    <div className={styles.relatedTags}>
                      {concept.relatedEvents.map((event, i) => (
                        <CrossReferenceLink key={i} type="event" name={event} />
                      ))}
                    </div>
                  </div>
                )}

                {concept.realWorldConnection && (
                  <div className={styles.realWorldSection}>
                    <h4>🌍 현실 세계와의 연결</h4>
                    <p>{concept.realWorldConnection}</p>
                  </div>
                )}
              </div>
            )}

            <div className={styles.expandHint}>
              {selectedConcept === concept.id ? '클릭하여 접기 ▲' : '클릭하여 상세보기 ▼'}
            </div>
          </div>
        ))}
      </div>

      {filteredConcepts.length === 0 && (
        <div className={styles.noResults}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
