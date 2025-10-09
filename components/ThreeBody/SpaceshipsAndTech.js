import { useState } from 'react'
import styles from './styles/SpaceshipsAndTech.module.css'

const spaceships = [
  {
    id: 1,
    name: '자연선택호',
    nameEn: 'Natural Selection',
    type: '우주선',
    category: '인류 함대',
    image: '🚀',
    specs: {
      length: '3.2km',
      crew: '2000명',
      propulsion: '핵융합 추진',
      weapons: '전자기 레일건, 핵미사일',
      speed: '광속의 15%',
      construction: '2180년대'
    },
    description: `장베이하이가 탈취한 우주 전함. 말일 전투 당시 살아남은 5척 중 하나로, 암흑 전투에서 중요한 역할을 했다.`,
    detailedInfo: `자연선택호는 인류 우주군의 주력 전함 중 하나였다. 장베이하이는 이 함선을 이용해 자신의 도망주의 계획을 실행하려 했다.

**주요 사건:**
- 말일 전투에서 워터 드롭을 피해 살아남음
- 암흑 전투 참전
- 장베이하이 전사 후 우주 깊은 곳으로 도주

**특징:**
- 당시 인류의 최신 기술 집약
- 200년간의 기술 발전 결과물
- 하지만 워터 드롭에는 무력

**상징성:**
인류의 오만함과 기술 격차를 보여주는 상징. 200년간 노력했지만 삼체의 탐사선 하나를 막지 못했다.`,
    relatedCharacters: ['장베이하이', '창웨이스'],
    relatedEvents: ['말일 전투', '암흑 전투', '도망주의'],
    keyQuote: '"전진! 전진! 죽음을 두려워하지 말고 전진!" - 창웨이스',
    fate: '암흑 전투 후 우주 깊은 곳으로 도주'
  },
  {
    id: 2,
    name: '블루스페이스호',
    nameEn: 'Blue Space',
    type: '우주선',
    category: '인류 함대',
    image: '🛸',
    specs: {
      length: '3.5km',
      crew: '1847명',
      propulsion: '핵융합 추진 → 광속 추진(후기)',
      weapons: '전자기 레일건, 핵미사일',
      speed: '광속의 15% → 광속',
      construction: '2180년대'
    },
    description: `말일 전투와 암흑 전투에서 살아남은 함선. 이후 광속 우주선으로 개조되어 삼체와 지구의 좌표를 브로드캐스트했다.`,
    detailedInfo: `블루스페이스호는 인류 역사상 가장 중요한 함선이 되었다.

**여정:**
1. **말일 전투** - 워터 드롭을 피해 생존
2. **암흑 전투** - 생존을 위해 다른 함선 공격
3. **우주 방랑** - 수십 년간 우주 깊은 곳 탐험
4. **광속 추진** - 외계 기술로 광속 우주선 개조
5. **최후의 방송** - 삼체와 지구 좌표 동시 브로드캐스트

**함장 우웨이:**
장베이하이의 뜻을 이어받아 인류 종족의 씨앗을 우주에 퍼뜨리려 했다.

**결정적 행동:**
블루스페이스호가 좌표를 브로드캐스트한 것이 삼체 멸망과 태양계 이차원화의 직접적 원인이 되었다. 이것은 암흑의 숲 법칙의 실제 증명이었다.`,
    relatedCharacters: ['우웨이', '장베이하이'],
    relatedEvents: ['말일 전투', '암흑 전투', '삼체 멸망', '암흑의 숲 타격'],
    keyQuote: '"우리는 씨앗이다. 인류의 마지막 희망이다." - 우웨이',
    fate: '광속 우주선으로 개조, 좌표 브로드캐스트 후 도주'
  },
  {
    id: 3,
    name: '중력호',
    nameEn: 'Gravity',
    type: '우주선',
    category: '인류 함대',
    image: '✨',
    specs: {
      length: '1.2km',
      crew: '500명',
      propulsion: '곡률 추진 (광속)',
      weapons: '없음 (탐사선)',
      speed: '광속',
      construction: '2272년'
    },
    description: `정청신과 관이판이 개발한 인류 최초의 광속 우주선. 곡률 추진 엔진을 탑재하여 빛의 속도로 이동 가능.`,
    detailedInfo: `중력호는 인류가 만든 최후의 걸작이자 최후의 희망이었다.

**개발 배경:**
- 토마스 웨이드의 비밀 프로젝트
- 정청신의 방해로 한때 중단
- 삼체 멸망 후 재개
- 관이판과 정청신이 완성

**곡률 추진:**
공간의 곡률을 변형시켜 광속으로 이동. 항적(죽은 선)을 남겨 그 영역의 광속을 영구적으로 낮춘다.

**주요 임무:**
1. 태양계 탈출
2. 죽은 선 생성 (안전 선언)
3. 윈톈밍 구출
4. 우주 재시작 프로젝트 참여

**비극:**
정청신이 더 일찍 개발을 허용했다면 수백만 명이 탈출할 수 있었다. 하지만 그녀의 결정으로 인류는 멸망했고, 중력호만이 태양계를 탈출했다.`,
    relatedCharacters: ['정청신', '관이판', '토마스 웨이드'],
    relatedEvents: ['광속 우주선 개발', '태양계 이차원화', '우주 재시작'],
    keyQuote: '"우리는 별들을 향해 전진한다. 전진만이 있을 뿐!" - 토마스 웨이드',
    fate: '태양계 탈출 성공, 소우주에서 우주 재시작 참여'
  },
  {
    id: 4,
    name: '워터 드롭',
    nameEn: 'Water Droplet',
    type: '무기',
    category: '삼체',
    image: '💧',
    specs: {
      length: '3.5m',
      crew: '무인',
      propulsion: '관성 조작',
      weapons: '물리적 충돌',
      speed: '광속에 근접',
      construction: '삼체 문명'
    },
    description: `삼체가 보낸 완벽한 강체 탐사선. 단 1기로 인류의 2000척 함대를 전멸시켰다.`,
    detailedInfo: `워터 드롭은 인류 역사상 가장 치명적인 무기였다.

**물리적 특성:**
- **재질:** 강입자(Strong interaction material)
  - 원자핵을 묶는 강한 핵력으로 만든 물질
  - 어떤 무기로도 파괴 불가능
- **표면:** 완벽하게 매끄러움 (절대 반사)
- **온도:** 절대영도
- **형태:** 완벽한 물방울 모양

**능력:**
- 관성 조작으로 질량 변환 가능
- 광속에 가까운 속도로 가속
- 초고속 기동 (관성 무시)
- 함선을 관통하며 파괴

**말일 전투:**
2205년, 워터 드롭 단 1기가:
- 2000척의 우주 함대 공격
- 2시간 만에 전멸
- 200만 명 사망
- 인류 우주 전력 99% 상실

**의미:**
"기술 격차"의 잔인한 증명. 인류는 200년간 준비했지만, 삼체의 탐사선 하나를 막지 못했다.`,
    relatedCharacters: ['창웨이스', '장베이하이', '둥펑웨이'],
    relatedEvents: ['워터 드롭 발견', '말일 전투', '암흑 전투'],
    keyQuote: '"그것은 너무 아름다웠다. 마치 예술 작품처럼. 하지만 그 아름다움이 우리를 죽였다."',
    fate: '임무 완수 후 태양계 궤도에 대기'
  },
  {
    id: 5,
    name: '삼체 함대',
    nameEn: 'Trisolaran Fleet',
    type: '함대',
    category: '삼체',
    image: '👽',
    specs: {
      length: '10km (각 함선)',
      crew: '미상',
      propulsion: '광속의 10%',
      weapons: '워터 드롭, 소폰',
      speed: '광속의 10%',
      construction: '1979년 출발'
    },
    description: `삼체 문명이 지구 침공을 위해 보낸 함대. 1000척 이상의 함선으로 구성. 450년간 비행 예정.`,
    detailedInfo: `삼체 함대는 삼체 문명의 생존을 건 마지막 희망이었다.

**출발:**
- 1979년: 예원제의 답신 수신
- 즉시 지구를 향해 출발
- 도착 예정: 2429년 (450년 비행)

**구성:**
- 1000척 이상의 전함
- 수십 개의 워터 드롭
- 소폰 2기를 선발대로 발송

**전략:**
1. **소폰 발송** - 인류 과학 봉쇄
2. **ETO 조직** - 내부 공작
3. **워터 드롭** - 함대 파괴
4. **본대 도착** - 식민지화

**운명:**
- 뤄지의 암흑의 숲 위협으로 후퇴
- 검잡이 체제 하에서 62년간 대기
- 정청신 시대에 재침공 시도
- 하지만 블루스페이스호의 좌표 브로드캐스트�� 삼체 본성이 파괴됨
- 함대는 목적지를 잃고 우주를 떠돎

**아이러니:**
450년을 날아왔지만 도착하지 못했다. 고향은 파괴되었고, 지구도 이차원화되었다.`,
    relatedCharacters: ['예원제', '뤄지', '정청신'],
    relatedEvents: ['삼체 문명과의 첫 접촉', '검잡이 체제', '삼체 멸망'],
    keyQuote: '"우리는 오고 있다. 450년 후에." - 삼체 함대',
    fate: '삼체 멸망 후 목적지 상실, 우주 방랑'
  }
]

const technologies = [
  {
    id: 101,
    name: '나노와이어',
    nameEn: 'Nanofiber',
    type: '기술',
    category: '인류',
    image: '🧵',
    inventor: '왕먀오',
    description: '극도로 얇고 강한 탄소 나노튜브 섬유. 거의 모든 물질을 절단할 수 있다.',
    specs: {
      thickness: '나노미터 수준',
      strength: '다이아몬드보다 강함',
      usage: 'ETO 소탕, 우주 엘리베이터',
      yearDeveloped: '2007년'
    },
    applications: [
      '심판의 날 작전 (유조선 절단)',
      '우주 엘리베이터 케이블',
      '우주선 구조재'
    ],
    detailedInfo: `왕먀오가 개발한 혁명적 재료. 나노미터 수준의 두께이지만 다이아몬드보다 강하다.

**심판의 날 작전:**
파나마 운하에 나노와이어 그물을 설치하여 ETO의 유조선 "심판자호"를 67개 층으로 수평 절단. ETO 핵심 정보를 획득했다.

**윤리적 논쟁:**
수백 명이 잔혹하게 사망했다. 토마스 웨이드는 "괴물과 싸우기 위해 괴물이 되었다"고 말했다.`,
    relatedCharacters: ['왕먀오', '스창', '토마스 웨이드'],
    relatedEvents: ['나노와이어 작전'],
    keyQuote: '"이것은 과학의 승리가 아니다. 필사의 승리다." - 왕먀오'
  },
  {
    id: 102,
    name: '소폰 (지자, 智子)',
    nameEn: 'Sophon',
    type: '기술',
    category: '삼체',
    image: '🔮',
    inventor: '삼체 문명',
    description: '양성자를 2차원으로 전개하여 회로를 새긴 후 접은 초지능 AI. 지구 감시 및 과학 봉쇄.',
    specs: {
      size: '양성자 크기',
      speed: '광속',
      intelligence: '초AI',
      quantity: '2기',
      yearArrived: '2007년'
    },
    applications: [
      '입자 가속기 실험 결과 조작',
      '지구 실시간 감시',
      '삼체 통신 중계'
    ],
    detailedInfo: `삼체 문명의 최고 걸작. 11차원 양성자를 2차원으로 전개(표면적이 행성만큼 커짐)하여 양자 회로를 각인한 후 다시 4차원으로 접었다.

**능력:**
- 모든 입자 실험 결과 조작
- 인류 과학 발전 봉쇄
- 지구 실시간 감시
- 광속 이동

**한계:**
인간의 "생각"은 읽을 수 없다. 이것이 면벽 계획의 근거가 되었다.

**영향:**
소폰 때문에 인류는 450년 동안 기초 과학을 발전시킬 수 없었다. 기술만 개선할 수 있었고, 새로운 이론은 불가능했다.`,
    relatedCharacters: ['양둥', '딩이', '왕먀오'],
    relatedEvents: ['과학자 연쇄 자살', '면벽자 프로젝트'],
    keyQuote: '"물리학은 존재하지 않는다." - 양둥'
  },
  {
    id: 103,
    name: '곡률 추진',
    nameEn: 'Curvature Drive',
    type: '기술',
    category: '고등 문명',
    image: '🌊',
    inventor: '고등 우주 문명',
    description: '공간의 곡률을 변형시켜 광속으로 이동하는 기술. 항적(죽은 선)을 남긴다.',
    specs: {
      speed: '광속',
      sideEffect: '광속 감소 항적',
      energySource: '곡률 엔진',
      danger: '매우 높음',
      yearDeveloped: '2272년 (인류)'
    },
    applications: [
      '광속 이동',
      '죽은 선 생성 (안전 선언)',
      '차원 타격 회피'
    ],
    detailedInfo: `공간의 기하학적 구조를 변형시켜 이동하는 기술.

**원리:**
1. 우주선 앞쪽 공간 압축
2. 우주선 뒤쪽 공간 확장
3. 공간의 흐름을 타고 이동
4. 우주선 자체는 정지 (상대론 위배 없음)

**죽은 선 (Dead Line):**
곡률 추진 우주선의 항적은 그 영역의 광속을 영구적으로 낮춘다.
- 일종의 "안전 선언"
- "우리는 밖으로 나갈 수 없다"
- 차원 타격 방어의 유일한 방법

**인류의 비극:**
정청신이 개발을 막아서 태양계는 죽은 선을 만들지 못했다. 결과: 태양계 이차원화.`,
    relatedCharacters: ['토마스 웨이드', '정청신', '관이판'],
    relatedEvents: ['광속 우주선 개발', '태양계 이차원화'],
    keyQuote: '"전진만이 있을 뿐! 죽음을 두려워하지 말고 전진!" - 토마스 웨이드'
  },
  {
    id: 104,
    name: '차원 무기 (이차원 박편)',
    nameEn: 'Dimensional Weapon',
    type: '기술',
    category: '고등 문명',
    image: '📄',
    inventor: '고등 우주 문명',
    description: '3차원 공간을 2차원으로 붕괴시키는 궁극의 무기. 되돌릴 수 없다.',
    specs: {
      effectRadius: '광속 확산',
      power: '문명 멸종',
      defense: '불가능 (광속 항적만 가능)',
      sideEffect: '차원 영구 붕괴',
      danger: '우주 파괴 수준'
    },
    applications: [
      '삼체 항성계 파괴',
      '태양계 파괴',
      '우주 종말의 원인'
    ],
    detailedInfo: `우주에서 가장 파괴적인 무기. 공간의 차원을 영구적으로 붕괴시킨다.

**작동:**
"이차원 박편"을 목표에 발사하면:
1. 접촉한 공간이 3D → 2D로 붕괴
2. 붕괴는 광속으로 확산
3. 모든 물질이 2차원 평면에 펼쳐짐
4. 되돌릴 수 없음

**우주의 역사:**
- 원래 10차원
- 문명 간 전쟁으로 차원 계속 붕괴
- 현재 3차원
- 최종적으로 1차원까지 붕괴 예정 → 우주 종말

**희생자:**
- 삼체 항성계 (2271년)
- 태양계 (2273년)
- 수십억 개의 항성계

**유일한 대응:**
죽은 선(광속 감소 영역) 생성. 하지만 외부와 영원히 단절된다.`,
    relatedCharacters: ['정청신', '관이판'],
    relatedEvents: ['삼체 멸망', '태양계 이차원화'],
    keyQuote: '"우주는 한때 10차원의 낙원이었다. 하지만 전쟁이 차원을 파괴했다." - 관이판'
  },
  {
    id: 105,
    name: '태양 증폭 시스템',
    nameEn: 'Solar Amplification System',
    type: '기술',
    category: '인류',
    image: '☀️',
    inventor: '예원제',
    description: '태양을 전파 증폭기로 사용하여 신호를 수천 배 증폭. 삼체와의 첫 접촉 수단.',
    specs: {
      amplification: '수천 배',
      range: '4.2광년 (삼체계)',
      power: '태양 출력 이용',
      location: '홍안 기지',
      yearDiscovered: '1969년'
    },
    applications: [
      '삼체와의 통신',
      '외계 문명 탐색',
      '은하계 규모 신호 전송'
    ],
    detailedInfo: `예원제가 홍안 기지에서 발견한 혁명적 기술.

**원리:**
1. 태양의 전자기 구조 이용
2. 태양을 거대한 전파 증폭기로 사용
3. 신호 강도 수천 배 증폭
4. 은하계 규모 통신 가능

**역사적 순간:**
1979년, 예원제는 이 시스템을 사용하여:
- 삼체에 신호 전송
- 경고 메시지 수신 ("답하지 마라!")
- 무시하고 답신
- 지구 좌표 전송
→ 인류 위기의 시작

**상징성:**
인류 최고의 기술적 성취가 동시에 최악의 결정을 가능하게 했다.`,
    relatedCharacters: ['예원제', '양웨이닝'],
    relatedEvents: ['홍안 기지 건설', '삼체와의 첫 접촉'],
    keyQuote: '"답하지 마라! 답하지 마라! 답하지 마라!" - 삼체 평화주의자'
  }
]

export default function SpaceshipsAndTech() {
  const [activeCategory, setActiveCategory] = useState('spaceships')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState([])

  const currentData = activeCategory === 'spaceships' ? spaceships : technologies
  const categories = ['all', ...new Set(currentData.map(item => item.category))]

  // Filter
  const filteredItems = currentData.filter(item => {
    const matchesSearch = item.name.includes(searchTerm) ||
                         item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.includes(searchTerm)
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Compare toggle
  const toggleCompare = (item) => {
    if (selectedForCompare.find(i => i.id === item.id)) {
      setSelectedForCompare(selectedForCompare.filter(i => i.id !== item.id))
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare([...selectedForCompare, item])
    }
  }

  return (
    <div className={styles.container}>
      {/* Tab Switch */}
      <div className={styles.tabSwitch}>
        <button
          className={`${styles.tabButton} ${activeCategory === 'spaceships' ? styles.active : ''}`}
          onClick={() => {
            setActiveCategory('spaceships')
            setCategoryFilter('all')
            setSelectedItem(null)
            setCompareMode(false)
            setSelectedForCompare([])
          }}
        >
          🚀 우주선
        </button>
        <button
          className={`${styles.tabButton} ${activeCategory === 'technologies' ? styles.active : ''}`}
          onClick={() => {
            setActiveCategory('technologies')
            setCategoryFilter('all')
            setSelectedItem(null)
            setCompareMode(false)
            setSelectedForCompare([])
          }}
        >
          ⚙️ 기술
        </button>
      </div>

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="검색..."
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

          <button
            onClick={() => {
              setCompareMode(!compareMode)
              setSelectedForCompare([])
            }}
            className={`${styles.compareButton} ${compareMode ? styles.active : ''}`}
          >
            {compareMode ? '비교 종료' : '비교 모드'}
          </button>
        </div>

        <div className={styles.resultCount}>
          {filteredItems.length}개 {compareMode && selectedForCompare.length > 0 && `(${selectedForCompare.length}개 선택)`}
        </div>
      </div>

      {/* Compare Panel */}
      {compareMode && selectedForCompare.length > 0 && (
        <div className={styles.comparePanel}>
          <h3>선택된 항목 비교</h3>
          <div className={styles.compareGrid}>
            {selectedForCompare.map(item => (
              <div key={item.id} className={styles.compareCard}>
                <button
                  className={styles.removeCompare}
                  onClick={() => toggleCompare(item)}
                >
                  ✕
                </button>
                <div className={styles.compareIcon}>{item.image}</div>
                <h4>{item.name}</h4>
                <p>{item.category}</p>
                {item.specs && (
                  <div className={styles.compareSpecs}>
                    {Object.entries(item.specs).slice(0, 3).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className={styles.itemsGrid}>
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.itemCard} ${selectedItem === item.id ? styles.expanded : ''} ${selectedForCompare.find(i => i.id === item.id) ? styles.selected : ''}`}
            onClick={() => !compareMode && setSelectedItem(selectedItem === item.id ? null : item.id)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {compareMode && (
              <div
                className={styles.selectBadge}
                onClick={(e) => { e.stopPropagation(); toggleCompare(item); }}
              >
                {selectedForCompare.find(i => i.id === item.id) ? '✓' : '+'}
              </div>
            )}

            <div className={styles.itemIcon}>{item.image}</div>
            <h3 className={styles.itemName}>{item.name}</h3>
            <div className={styles.itemNameEn}>{item.nameEn}</div>
            <div className={styles.categoryBadge}>{item.category}</div>
            <p className={styles.itemDesc}>{item.description}</p>

            {selectedItem === item.id && (
              <div className={styles.itemDetails}>
                {item.specs && (
                  <div className={styles.specsSection}>
                    <h4>제원</h4>
                    <div className={styles.specsGrid}>
                      {Object.entries(item.specs).map(([key, value]) => (
                        <div key={key} className={styles.specItem}>
                          <span className={styles.specKey}>{key}</span>
                          <span className={styles.specValue}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.detailedInfo && (
                  <div className={styles.detailSection}>
                    <h4>상세 정보</h4>
                    <p>{item.detailedInfo}</p>
                  </div>
                )}

                {item.applications && (
                  <div className={styles.applicationsSection}>
                    <h4>적용 사례</h4>
                    <ul>
                      {item.applications.map((app, i) => (
                        <li key={i}>{app}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.relatedCharacters && (
                  <div className={styles.relatedSection}>
                    <h4>관련 인물</h4>
                    <div className={styles.relatedTags}>
                      {item.relatedCharacters.map((char, i) => (
                        <span key={i} className={styles.relatedTag}>{char}</span>
                      ))}
                    </div>
                  </div>
                )}

                {item.relatedEvents && (
                  <div className={styles.relatedSection}>
                    <h4>관련 사건</h4>
                    <div className={styles.relatedTags}>
                      {item.relatedEvents.map((event, i) => (
                        <span key={i} className={styles.relatedTag}>{event}</span>
                      ))}
                    </div>
                  </div>
                )}

                {item.keyQuote && (
                  <div className={styles.quoteSection}>
                    <h4>명대사</h4>
                    <blockquote>{item.keyQuote}</blockquote>
                  </div>
                )}

                {item.fate && (
                  <div className={styles.fateSection}>
                    <h4>최종 운명</h4>
                    <p>{item.fate}</p>
                  </div>
                )}
              </div>
            )}

            {!compareMode && (
              <div className={styles.expandHint}>
                {selectedItem === item.id ? '클릭하여 접기 ▲' : '클릭하여 상세보기 ▼'}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className={styles.noResults}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
