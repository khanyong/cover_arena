import { useState } from 'react'
import CrossReferenceLink from './CrossReferenceLink'
import styles from './styles/Glossary.module.css'

const glossaryTerms = [
  {
    id: 1,
    term: '안개 우산 프로젝트',
    termEn: 'Fog Umbrella Project',
    category: '기술',
    shortDesc: '태양과 지구 사이에 먼지막을 형성하여 온실효과를 완화하는 프로젝트',
    definition: `핵폭발을 이용해 기름막을 증발시켜 태양과 지구 사이에 인공으로 기름막 먼지를 생성시키고, 이를 통해 지구에 대한 태양복사를 줄여 지구의 온실효과를 완화하겠다는 계획.`,
    detailedExplanation: `안개 우산 프로젝트는 지구의 온실효과를 완화하기 위한 대규모 지구공학 프로젝트다.

**기름막 물질 발견:**
해왕성의 띠에서 발견된 특수한 물질로, 다음과 같은 특징을 가진다:
- 고온에서 기체로 변해 빠르게 확산
- 우주에서 미세한 나노 입자로 응집되어 우주먼지가 됨
- 작은 기름방울이 물 위에서 퍼져나가 기름막을 형성하는 것과 유사
- 소량으로도 아주 넓은 면적에 걸쳐 먼지 생성 가능

**기름막 먼지의 특징:**
일반 우주먼지와 다른 독특한 성질:
- 태양풍이 불어와도 잘 흩어지지 않음
- 안정적으로 태양-지구 사이에 머무름
- 태양복사를 효과적으로 차단

**프로젝트 작동 원리:**
1. 핵폭발로 기름막 물질을 증발시킴
2. 증발된 물질이 우주로 확산
3. 나노 입자로 응집되어 먼지막 형성
4. 태양-지구 사이에 거대한 차폐막 생성
5. 태양복사 감소로 지구 온도 하강

**프로젝트의 목적:**
- 지구 온실효과 완화
- 기후변화 대응
- 지구 환경 조절

**과학적 배경:**
지구공학(Geoengineering)의 한 방법으로, 태양복사관리(Solar Radiation Management)에 해당한다.`,
    origin: '해왕성의 띠에서 발견',
    usage: '온실효과 완화, 기후 조절',
    relatedCharacters: [],
    relatedEvents: ['안개 우산 프로젝트 계획'],
    relatedConcepts: ['지구공학', '태양복사관리'],
    realWorldConnection: '실제로 지구공학 분야에서 태양복사관리(SRM)는 연구되고 있다. 성층권에 황산염 에어로졸을 살포하여 태양빛을 반사시키는 방법 등이 제안되었지만, 예상치 못한 부작용 때문에 논란이 많다.',
    notes: '기름막 물질의 발견으로 프로젝트 성공 가능성이 크게 높아졌다.'
  },
  {
    id: 2,
    term: '홍안 기지',
    termEn: 'Red Coast Base',
    category: '장소',
    shortDesc: '외계 문명 탐색을 위한 비밀 군사 기지',
    definition: `문화대혁명 시기 중국이 건설한 외계 문명 탐색 및 통신 기지. 예원제가 여기서 삼체 문명에 신호를 보내 인류 위기를 초래했다.`,
    detailedExplanation: `홍안 기지는 중국 산악 지대에 건설된 비밀 군사 시설로, 외계 문명 탐색 프로젝트의 중심이었다.

**건설 배경:**
- 문화대혁명 시기 건설
- 명목: 외계 방어 체계 구축
- 실제: SETI (외계지적생명체탐사) 프로젝트

**주요 시설:**
- 거대한 전파 안테나
- 태양 증폭 시스템
- 예원제가 근무하던 통신실

**역사적 순간:**
1979년, 예원제는 홍안 기지에서:
- 태양을 증폭기로 사용하는 방법 발견
- 삼체 문명에 신호 송신
- "답하지 마라"는 경고 수신하고 무시
- 지구 좌표 전송 → 인류 위기의 시작`,
    origin: '문화대혁명 시기 중국 정부',
    usage: '외계 통신, SETI 프로젝트',
    relatedCharacters: ['예원제', '양웨이닝'],
    relatedEvents: ['삼체와의 첫 접촉', 'ETO 창립'],
    relatedConcepts: ['태양 증폭 시스템', 'SETI'],
    realWorldConnection: '실제 SETI 프로젝트는 1960년대부터 시작되었다. 중국은 2016년 세계 최대 전파망원경 FAST를 완성하여 외계 신호 탐색에 참여하고 있다.',
    notes: '소설의 모든 비극이 시작된 장소'
  },
  {
    id: 3,
    term: '면벽자',
    termEn: 'Wallfacer',
    category: '역할',
    shortDesc: '소폰의 감시를 피하기 위해 생각만으로 전략을 숨기는 자',
    definition: `소폰이 모든 것을 감시하지만 인간의 사고만은 읽을 수 없다는 약점을 이용해, 자신의 머릿속에만 비밀 전략을 숨기고 전 인류의 자원을 동원할 수 있는 권한을 가진 4명의 전략가.`,
    detailedExplanation: `면벽자는 면벽 계획(Wallfacer Project)의 핵심 요원이다.

**4명의 면벽자:**
1. 프레드릭 타일러 (美 국방장관) - 실패
2. 마누엘 레이디아즈 (베네수엘라 대통령) - 실패 후 자살
3. 빌 하인즈 (英 뇌과학자) - 실패
4. 뤄지 (중국 사회학자) - 유일한 성공

**특권:**
- 전 인류의 자원을 마음대로 동원
- 계획 설명 의무 없음
- "나도 내 계획을 모른다"고 말해도 됨

**대응자: 파벽인 (Wallbreaker)**
ETO가 각 면벽자에게 배정한 분석가. 면벽자의 행동을 분석하여 진짜 의도를 밝혀내려 함.`,
    origin: 'UN 행성방위이사회',
    usage: '삼체 대응 전략',
    relatedCharacters: ['뤄지', '타일러', '레이디아즈', '하인즈'],
    relatedEvents: ['면벽 계획 시작', '암흑의 숲 이론 발견'],
    relatedConcepts: ['소폰', '파벽인', '암흑의 숲'],
    realWorldConnection: '냉전 시대의 "전략적 모호성" 개념과 유사. 상대가 예측할 수 없게 만드는 것이 억지력이 된다.',
    notes: '중국어 원제는 面壁者 (면벽자) - 벽을 마주하고 사색하는 자'
  },
  {
    id: 4,
    term: '파벽인',
    termEn: 'Wallbreaker',
    category: '역할',
    shortDesc: '면벽자의 진짜 계획을 분석하여 밝혀내는 자',
    definition: `ETO가 각 면벽자에게 배정한 대응자. 면벽자의 모든 행동을 분석하여 숨겨진 진짜 의도를 밝혀내고, 그 계획을 무력화시키는 역할.`,
    detailedExplanation: `파벽인은 면벽자의 천적이다.

**역할:**
- 면벽자의 모든 행동 추적
- 패턴 분석으로 진짜 의도 추론
- 계획 폭로 ("나는 당신의 벽을 깼다!")
- 전략 무력화

**주요 파벽인:**
각 면벽자마다 1명씩 배정되었으나, 뤄지의 파벽인은 실패했다.

**방법론:**
- 심리 분석
- 행동 패턴 연구
- 자원 배분 추적
- 역공학적 추론`,
    origin: 'ETO (지구삼체조직)',
    usage: '면벽 계획 무력화',
    relatedCharacters: ['면벽자들'],
    relatedEvents: ['면벽 계획 실패'],
    relatedConcepts: ['면벽자', 'ETO'],
    realWorldConnection: '정보기관의 "행동 분석"과 유사. CIA, MI6 등이 사용하는 HUMINT 기법.',
    notes: '중국어 원제는 破壁人 (파벽인) - 벽을 깨는 자'
  },
  {
    id: 5,
    term: '검잡이',
    termEn: 'Swordholder',
    category: '역할',
    shortDesc: '암흑의 숲 타격 스위치를 쥔 자',
    definition: `버튼 하나로 삼체와 지구의 좌표를 우주에 브로드캐스트할 수 있는 권한을 가진 자. 상호확증파괴 체제의 핵심.`,
    detailedExplanation: `검잡이는 두 세계의 운명을 손에 쥔 자다.

**역대 검잡이:**
- 1대: 뤄지 (62년간) - 완벽한 검잡이
- 2대: 정청신 (15분) - 치명적 실패

**권한:**
- 암흑의 숲 타격 스위치 보유
- 스위치 누르면 삼체+지구 좌표 브로드캐스트
- 두 문명 모두 멸망

**요구되는 자질:**
- 냉혹한 결단력
- 두 문명을 파괴할 의지
- 도덕적 부담을 견딜 정신력
- "악마"가 될 각오

**결과:**
- 뤄지 시대: 62년 평화, 황금시대
- 정청신 시대: 즉시 침공, 인류 격리`,
    origin: '암흑의 숲 이론 발견 후',
    usage: '삼체 억지, 평화 유지',
    relatedCharacters: ['뤄지', '정청신'],
    relatedEvents: ['검잡이 체제 시작', '지구 재침공'],
    relatedConcepts: ['암흑의 숲', '상호확증파괴'],
    realWorldConnection: '냉전 시대 핵무기 억지력 개념의 극단적 버전. MAD (Mutual Assured Destruction) 이론.',
    notes: '"나는 검을 들고 있다. 두 세계를 겨냥하고." - 뤄지'
  },
  {
    id: 6,
    term: '말일 전투',
    termEn: 'Doomsday Battle',
    category: '사건',
    shortDesc: '워터 드롭 1기가 인류 2000척 함대를 전멸시킨 전투',
    definition: `2205년, 삼체의 워터 드롭 탐사선 단 1기가 인류의 2000척 우주 함대를 2시간 만에 전멸시킨 역사상 가장 일방적인 학살. 200만 명 사망.`,
    detailedExplanation: `말일 전투는 인류에게 "기술 격차"의 진실을 깨닫게 한 비극이다.

**전투 개요:**
- 일시: 2205년
- 인류: 2000척 우주 함대
- 삼체: 워터 드롭 1기
- 결과: 인류 99% 전멸

**전투 경과:**
1. 워터 드롭 발견, 인류는 승리 확신
2. 워터 드롭 1기가 광속으로 가속
3. 함선들을 하나씩 관통하며 파괴
4. 2시간 만에 2000척 전멸
5. 생존: 장베이하이의 자연선택호 등 5척

**의미:**
- 인류의 오만함 증명
- 200년 준비는 무의미했음
- 도망주의자들이 옳았음
- 기술 격차는 절대적

**생존자:**
장베이하이가 미리 탈취한 자연선택호가 살아남아 인류의 씨앗이 되었다.`,
    origin: '2205년 태양계 외곽',
    usage: '삼체의 압도적 우위 증명',
    relatedCharacters: ['창웨이스', '장베이하이', '둥팡옌쉬'],
    relatedEvents: ['워터 드롭 발견', '암흑 전투'],
    relatedConcepts: ['워터 드롭', '강입자 물질', '도망주의'],
    realWorldConnection: '기술 격차로 인한 일방적 전투의 예. 16세기 스페인 정복자들과 아즈텍 제국의 관계와 유사.',
    notes: '이날은 "말일(Doomsday)"로 기록되었다'
  },
  {
    id: 7,
    term: '암흑 전투',
    termEn: 'Dark Battle',
    category: '사건',
    shortDesc: '생존을 위해 인류끼리 서로를 공격한 전투',
    definition: `말일 전투 후 살아남은 5척의 함선이 연료와 보급품 부족으로 서로를 공격하여 블루스페이스호와 자연선택호만 살아남은 비극적 전투.`,
    detailedExplanation: `암흑 전투는 인류의 어두운 면을 드러낸 사건이다.

**배경:**
- 말일 전투 후 5척 생존
- 태양계로 돌아가기엔 연료 부족
- 우주에서 생존하려면 다른 함선의 자원 필요

**전투 경과:**
1. 블루스페이스호가 먼저 공격 시작
2. 다른 함선들도 서로 공격
3. 결국 블루스페이스호와 자연선택호만 생존
4. 두 함선은 우주 깊은 곳으로 도주

**심리적 충격:**
- 동료 인류를 살해한 죄책감
- 하지만 유일한 생존 방법
- "도덕 vs 생존"의 극한 딜레마

**의미:**
암흑의 숲 법칙이 인류 내부에서도 작동함을 증명. 생존 앞에서는 모든 것이 무너진다.`,
    origin: '2205년 태양계 외곽',
    usage: '생존주의의 극한',
    relatedCharacters: ['우웨이', '장베이하이', '벤저 시트'],
    relatedEvents: ['말일 전투', '도망주의 실현'],
    relatedConcepts: ['암흑의 숲', '도망주의', '생존 본능'],
    realWorldConnection: '극한 상황에서의 인간 본성. "구명보트 윤리" 딜레마.',
    notes: '블루스페이스호와 자연선택호는 인류의 마지막 씨앗이 되었다'
  },
  {
    id: 8,
    term: '혼돈 시대',
    termEn: 'Chaotic Era',
    category: '환경',
    shortDesc: '삼체 행성의 극한 환경 시기',
    definition: `3항성계의 예측 불가능한 운동으로 인해 태양이 여러 개 뜨거나 사라져 극한의 온도 변화가 일어나는 시기. 모든 생명이 탈수하여 생존해야 함.`,
    detailedExplanation: `혼돈 시대는 삼체 문명의 생존을 위협하는 극한 환경이다.

**특징:**
- 태양이 3개 동시에 뜨거나 모두 사라짐
- 온도: -200°C ~ 수천 °C
- 예측 불가능한 기간
- 모든 생명체 멸종 위험

**생존 전략:**
- 탈수: 물을 빼내 섬유질로 보존
- 보관: 수백 년 보존 가능
- 복수화: 항정 시대 도래 시 물 공급하여 소생

**문명에 미친 영향:**
- 200번 이상 문명 파괴와 재건
- 극단적 생존주의 발전
- 지구 침공 결정의 배경`,
    origin: '3항성계의 혼돈 역학',
    usage: '삼체 문명의 환경',
    relatedCharacters: ['예원제', '왕먀오'],
    relatedEvents: ['삼체 게임', '탈수와 복수화'],
    relatedConcepts: ['3항성계', '항정 시대', '탈수'],
    realWorldConnection: '혼돈 이론과 생존 전략의 결합. 극한 환경 적응의 극단적 예.',
    notes: '삼체 VR 게임에서 이 환경을 시뮬레이션'
  },
  {
    id: 9,
    term: '항정 시대',
    termEn: 'Stable Era',
    category: '환경',
    shortDesc: '삼체 행성의 짧은 안정기',
    definition: `3항성계에서 일시적으로 안정된 궤도가 유지되어 온도가 정상적인 시기. 문명 활동이 가능하지만 언제 끝날지 예측 불가능.`,
    detailedExplanation: `항정 시대는 삼체 문명이 발전할 수 있는 유일한 시기다.

**특징:**
- 일시적 안정 기후
- 정상적인 온도
- 문명 활동 가능
- 지속 기간 예측 불가

**활동:**
- 탈수된 인구 복수화
- 문명 재건
- 과학 기술 발전
- 다음 혼돈 시대 대비

**위험:**
언제 혼돈 시대로 돌입할지 모르기 때문에, 항상 탈수 준비를 해야 함.

**의미:**
이 불안정성이 삼체 문명을 강하게 만들었지만, 동시에 안정적인 지구를 침공하려는 동기가 되었다.`,
    origin: '3항성계의 일시적 안정',
    usage: '삼체 문명의 발전기',
    relatedCharacters: ['삼체인'],
    relatedEvents: ['문명 재건'],
    relatedConcepts: ['혼돈 시대', '3항성계'],
    realWorldConnection: '빙하기와 간빙기의 관계와 유사. 인류도 간빙기에만 문명을 발전시킬 수 있었다.',
    notes: '항정 시대의 길이를 예측하는 것이 삼체 문명의 최대 과제'
  },
  {
    id: 10,
    term: '미래사학파',
    termEn: 'Future History School',
    category: '사상',
    shortDesc: '장베이하이 부친이 창시한 역사 예측 학파',
    definition: `장베이하이의 아버지가 세운 역사학파로, 과거 역사 데이터와 패턴을 분석하여 인류 미래를 예측하고자 한 학문적 시도.`,
    detailedExplanation: `미래사학파는 역사의 패턴을 통해 미래를 예측할 수 있다는 신념에서 출발한 학파다.

**창시자:**
- 장베이하이의 아버지 (장씨 성을 가진 역사학자)
- 시기: 삼체 위기 이전

**핵심 사상:**
역사는 반복되며, 과거의 패턴을 분석하면 미래를 예측할 수 있다는 믿음:
- 역사적 사건의 통계적 분석
- 인류 행동 패턴의 규칙성
- 문명 발전의 주기성
- 위기 대응의 반복성

**방법론:**
1. 과거 역사 데이터 수집
2. 패턴과 주기 분석
3. 통계적 모델 구축
4. 미래 시나리오 예측
5. 대응 전략 수립

**장베이하이에게 미친 영향:**
아버지의 미래사학 사상은 장베이하이의 세계관 형성에 결정적 영향을 미쳤다:
- **역사적 사고**: 현재를 역사적 맥락에서 이해
- **장기적 안목**: 수백 년 후를 내다보는 시각
- **패턴 인식**: 인류의 반복되는 실수 간파
- **냉철한 예측**: 감정이 아닌 데이터 기반 판단

**삼체 위기에서의 적용:**
장베이하이는 아버지의 학문을 삼체 위기에 적용했다:
1. **패배 예측**: 역사상 기술 격차가 큰 전쟁의 결과 분석
   - 아스텍 vs 스페인
   - 원주민 vs 서양 문명
   - 결론: 기술 차이는 극복 불가능

2. **인류 행동 예측**: 위기 상황에서 인류의 반응 패턴
   - 초반 공포 → 중반 적응 → 후반 오만
   - 승리주의의 함정
   - 낙관적 편향

3. **도망주의 정당성**: 역사적 교훈
   - 멸망한 문명의 공통점: 현실 부정
   - 생존한 집단의 공통점: 조기 탈출
   - 종족 보존이 최우선

**한계와 비판:**
미래사학파의 예측에도 한계가 있었다:
- 암흑의 숲 법칙 같은 우주적 규칙은 예측 못함
- 뤄지의 등장 같은 개인의 천재성은 변수
- 워터 드롭의 압도적 기술력은 상상 밖

**장베이하이의 실천:**
아버지의 학문을 실천에 옮긴 장베이하이:
1. **200년 계획**: 멘탈 스탬프로 신념 위장
2. **작동유체 논쟁**: 과학자 암살로 방향 결정
3. **자연선택호 탈취**: 도망 계획 실행
4. **종족 보존**: 인류의 씨앗 확보

**역사적 의의:**
미래사학파는 단순한 학문이 아니라, 장베이하이를 "가장 먼 미래를 내다본 인간"으로 만든 사상적 기반이었다. 그의 모든 행동은 아버지의 학문에서 나왔다.

**현실 연결:**
실제 역사학에서도 미래 예측은 중요한 주제다:
- 토인비의 문명 주기론
- 아널드 토인비의 도전-응전 이론
- 이븐 할둔의 문명 흥망 이론
하지만 미래사학파는 이를 극단까지 밀어붙인 학파다.`,
    origin: '장베이하이의 아버지',
    usage: '미래 예측, 역사 패턴 분석',
    relatedCharacters: ['장베이하이', '창웨이스'],
    relatedEvents: ['작동유체 논쟁', '자연선택호 탈취', '도망주의'],
    relatedConcepts: ['도망주의', '패배주의', '종족 보존'],
    realWorldConnection: '역사철학, 문명 주기론, 예측 모델링. 실제로 많은 역사학자들이 역사의 패턴을 통해 미래를 예측하려 시도했다. 스펭글러의 "서구의 몰락", 토인비의 "역사의 연구" 등이 대표적이다.',
    notes: '장베이하이의 모든 행동과 결정의 사상적 기반. 그를 가장 먼 미래를 내다본 인물로 만든 원천.'
  },
  {
    id: 11,
    term: '동곽족',
    termEn: 'Dongguo Tribe',
    category: '사회',
    shortDesc: '햇볕 계획을 지지하는 자들을 비난하는 명칭',
    definition: `동면에서 깨어난 사람들이 삼체와의 평화 공존을 주장하는 이들을 비난할 때 사용하는 경멸적 호칭. 중국 전래 민화 "동곽 선생과 늑대"의 주인공에서 유래.`,
    detailedExplanation: `동곽족은 삼체 위기 시대의 정치적 논쟁에서 등장한 비난 용어다.

**어원:**
중국 전래 민화 "동곽 선생과 늑대(東郭先生與狼)"에서 유래:

**원전 이야기:**
- 동곽 선생이 사냥꾼에게 쫓기는 늑대를 불쌍히 여겨 자루에 숨겨줌
- 위기가 지나가자 늑대는 배고프다며 은인인 동곽 선생을 잡아먹으려 함
- 동곽 선생은 늑대의 배신에 당황하며 후회함
- 교훈: 악한 자에게 자비를 베푸는 것은 어리석음

**삼체 위기에서의 의미:**
동곽족 = 삼체(늑대)에게 자비를 베풀려는 순진한 사람들

**역사적 배경:**
말일 전투 이후, 인류 사회는 두 진영으로 분열되었다:

1. **강경파 (동면자들):**
   - 200년 동안 동면하며 삼체와 싸울 준비를 한 사람들
   - 삼체의 배신을 직접 경험
   - 워터 드롭의 공포를 목격
   - 삼체는 절대 신뢰할 수 없다고 확신

2. **온건파 (현대인들):**
   - 삼체 위기 이후 태어난 세대
   - 직접적인 전쟁 경험 없음
   - 평화 시대에 성장
   - 삼체와의 공존 가능성 믿음

**햇볕 계획 논쟁:**
검잡이 시대(억제기원)에 등장한 정책 논쟁:

- **햇볕 계획 (Sunshine Policy)**: 삼체에 대한 우호 정책
  - 삼체와의 문화 교류
  - 기술 협력
  - 평화 공존 모색
  - 상호 이해 증진

- **강경파의 반대**: "늑대에게 먹이를 주는 것"
  - 삼체는 위협이 사라지면 즉시 배신할 것
  - 과거 ETO의 배신 상기
  - 말일 전투의 교훈 망각
  - 현대인들의 순진함 비판

**동곽족의 특징:**
강경파가 보는 온건파의 문제점:
1. **역사 망각**: 200년 전 배신을 잊음
2. **순진한 이상주의**: 삼체의 본성 오판
3. **평화 도취**: 현실 위험 무시
4. **세대 차이**: 직접 경험 부재

**사용 예시:**
- "그들은 동곽족이다. 늑대를 애완동물로 키우려 한다"
- "동곽 선생처럼 자루에 늑대를 숨겨주다가 잡아먹힐 것"
- "햇볕 계획은 동곽족의 망상일 뿐"

**논쟁의 핵심:**
동곽족 논쟁은 근본적 질문을 던진다:
- **신뢰 vs 경계**: 적을 신뢰할 수 있는가?
- **용서 vs 복수**: 과거 배신을 용서할 수 있는가?
- **이상 vs 현실**: 평화 공존이 가능한가?
- **세대 갈등**: 경험한 자 vs 경험 못한 자

**정청신과 동곽족:**
정청신이 검잡이가 된 것도 이 논쟁과 관련:
- 온건파는 그녀의 평화주의를 환영
- 강경파는 그녀를 "전형적 동곽족"으로 비판
- 결과: 정청신의 위협 실패가 강경파의 우려 입증

**역설:**
동곽족 논쟁의 비극적 역설:
- 강경파가 옳았다: 삼체는 정말 배신했다
- 하지만 증오만으로는 생존 못함
- 결국 인류도 삼체도 모두 멸망
- 진정한 답은 "암흑의 숲" 너머에 있었다

**현실 연결:**
동곽족 개념은 현실 정치의 은유:
- **햇볕 정책**: 실제 남북관계 용어와 동일
- **강경파 vs 온건파**: 대북정책, 대중정책 등
- **세대 갈등**: 전쟁 세대 vs 평화 세대
- **신뢰 딜레마**: 국제관계의 영원한 질문

**문학적 장치:**
류츠신은 중국 고전을 활용해:
1. 복잡한 정치 논쟁을 단순화
2. 중국 독자에게 즉각적 공감
3. 선악 이분법의 함정 지적
4. 현실 정치 풍자`,
    origin: '중국 전래 민화 "동곽 선생과 늑대"',
    usage: '삼체 평화론자를 비난하는 용어',
    relatedCharacters: ['정청신', '뤄지', '토마스 웨이드'],
    relatedEvents: ['햇볕 계획', '검잡이 교체', '삼체 재침공'],
    relatedConcepts: ['검잡이', '억제기원', '강경파', '온건파'],
    realWorldConnection: '남북관계의 햇볕정책, 유화정책 논쟁과 직접적 연관. "악당에게 자비를 베푸는 것은 선량한 사람에 대한 잔인함"이라는 논쟁은 동서양 공통.',
    notes: '동곽족 논쟁은 정청신 시대의 핵심 갈등. 그녀를 동곽족으로 본 강경파의 우려가 현실이 되었다.'
  },
  {
    id: 12,
    term: 'ETO',
    termEn: 'Earth-Trisolaris Organization',
    category: '조직',
    shortDesc: '지구삼체조직 - 삼체 침공을 돕는 인류 배신자 집단',
    definition: `삼체 문명의 지구 침공을 환영하고 돕는 지구인들의 비밀 조직. 예원제와 마이크 에반스가 창립했으며, 강림파와 구원파로 나뉜다.`,
    detailedExplanation: `ETO는 인류 역사상 가장 극단적인 배신 조직이다.

**창립:**
- 창립자: 예원제, 마이크 에반스
- 시기: 1980년대
- 목적: 삼체 침공 지원

**두 파벌:**

강림파 (Adventists):
- 리더: 마이크 에반스
- 목표: 인류 완전 멸망
- 신념: 인류는 구원받을 가치 없음

구원파 (Redemptionists):
- 리더: 예원제 (초기)
- 목표: 삼체의 지도로 인류 개조
- 신념: 삼체와 공존 가능

**주요 활동:**
- 과학자 암살 (자살로 위장)
- 소폰 협력
- 삼체 통신 중계
- 인류 방어 방해

**최후:**
심판의 날 작전으로 본부 파괴, 주요 인물 사망`,
    origin: '1980년대 예원제와 에반스',
    usage: '삼체 침공 지원',
    relatedCharacters: ['예원제', '마이크 에반스'],
    relatedEvents: ['나노와이어 작전', '심판의 날'],
    relatedConcepts: ['강림파', '구원파', '소폰'],
    realWorldConnection: '극단적 환경보호주의와 인류혐오주의의 결합. 실제로도 "자발적 인류 멸종 운동" 같은 극단적 사상이 존재한다.',
    notes: '중국어 원제는 地球三体组织 (지구삼체조직)'
  }
]

// Category icons
const categoryIcons = {
  '기술': '⚙️',
  '사건': '⚡',
  '환경': '🌍',
  '조직': '👥',
  '사상': '💭',
  '사회': '🏛️'
}

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedTerm, setSelectedTerm] = useState(null)

  // Get unique categories
  const categories = ['all', ...new Set(glossaryTerms.map(t => t.category))]

  // Filter terms
  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.includes(searchTerm) ||
                         term.termEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.shortDesc.includes(searchTerm)
    const matchesCategory = categoryFilter === 'all' || term.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Sort alphabetically by Korean term
  const sortedTerms = [...filteredTerms].sort((a, b) => a.term.localeCompare(b.term, 'ko'))

  return (
    <div className={styles.glossaryContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>삼체 용어 사전</h1>
        <p className={styles.subtitle}>
          소설에 등장하는 주요 용어와 개념을 정리한 사전
        </p>
      </div>

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="용어 검색..."
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
        </div>

        <div className={styles.resultCount}>
          {sortedTerms.length}개의 용어
        </div>
      </div>

      {/* Terms List */}
      <div className={styles.termsList}>
        {sortedTerms.map((term, index) => (
          <div
            key={term.id}
            className={`${styles.termCard} ${selectedTerm === term.id ? styles.expanded : ''}`}
            onClick={() => setSelectedTerm(selectedTerm === term.id ? null : term.id)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={styles.termHeader}>
              <div className={styles.termMain}>
                <h3 className={styles.termTitle}>
                  <span className={styles.categoryIcon}>{categoryIcons[term.category] || '📚'}</span>
                  {term.term}
                </h3>
                <div className={styles.termTitleEn}>{term.termEn}</div>
              </div>
              <span className={styles.categoryBadge}>{term.category}</span>
            </div>

            <div className={styles.termShortDesc}>{term.shortDesc}</div>

            {selectedTerm !== term.id && (
              <div className={styles.expandHint}>
                클릭하여 상세보기 ▼
              </div>
            )}

            {selectedTerm === term.id && (
              <div className={styles.termDetails}>
                <div className={styles.detailSection}>
                  <h4>정의</h4>
                  <p className={styles.definition}>{term.definition}</p>
                </div>

                {term.detailedExplanation && (
                  <div className={styles.detailSection}>
                    <h4>상세 설명</h4>
                    <div className={styles.explanation}>
                      {term.detailedExplanation.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}

                {term.origin && (
                  <div className={styles.detailSection}>
                    <h4>출처/기원</h4>
                    <p>{term.origin}</p>
                  </div>
                )}

                {term.usage && (
                  <div className={styles.detailSection}>
                    <h4>사용처</h4>
                    <p>{term.usage}</p>
                  </div>
                )}

                {term.relatedCharacters && term.relatedCharacters.length > 0 && (
                  <div className={styles.relatedSection}>
                    <h4>관련 인물</h4>
                    <div className={styles.relatedTags}>
                      {term.relatedCharacters.map((char, i) => (
                        <CrossReferenceLink key={i} type="character" name={char} />
                      ))}
                    </div>
                  </div>
                )}

                {term.relatedEvents && term.relatedEvents.length > 0 && (
                  <div className={styles.relatedSection}>
                    <h4>관련 사건</h4>
                    <div className={styles.relatedTags}>
                      {term.relatedEvents.map((event, i) => (
                        <span key={i} className={styles.relatedTag}>{event}</span>
                      ))}
                    </div>
                  </div>
                )}

                {term.relatedConcepts && term.relatedConcepts.length > 0 && (
                  <div className={styles.relatedSection}>
                    <h4>관련 개념</h4>
                    <div className={styles.relatedTags}>
                      {term.relatedConcepts.map((concept, i) => (
                        <span key={i} className={styles.relatedTag}>{concept}</span>
                      ))}
                    </div>
                  </div>
                )}

                {term.realWorldConnection && (
                  <div className={styles.realWorldSection}>
                    <h4>🌍 현실 세계와의 연결</h4>
                    <p>{term.realWorldConnection}</p>
                  </div>
                )}

                {term.notes && (
                  <div className={styles.notesSection}>
                    <h4>📝 참고</h4>
                    <p>{term.notes}</p>
                  </div>
                )}

                <div className={styles.expandHint}>
                  클릭하여 접기 ▲
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sortedTerms.length === 0 && (
        <div className={styles.noResults}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}

      {/* Alphabet Index - for future expansion */}
      <div className={styles.indexHelp}>
        <p>💡 팁: 용어를 클릭하면 상세 설명을 볼 수 있습니다.</p>
      </div>
    </div>
  )
}
