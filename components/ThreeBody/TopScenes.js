import { useState } from 'react'
import CrossReferenceLink from './CrossReferenceLink'
import ImageWithFallback from './ImageWithFallback'
import styles from './styles/TopScenes.module.css'

const topScenes = [
  {
    id: 1,
    rank: 1,
    title: '예원제의 첫 번째 배신',
    titleEn: 'Ye Wenjie\'s First Betrayal',
    book: '1부: 삼체',
    chapter: '홍안 기지',
    image: '📡',
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/1a1a2e/ff6b6b?text=예원제의+배신',
    impact: 10,
    emotionalWeight: 10,
    category: '결정적 순간',
    shortDesc: '예원제가 삼체 문명에게 "지구로 오라"는 답신을 보내는 순간',
    fullDescription: `1979년 10월, 홍안 기지. 예원제는 삼체 평화주의자의 경고 메시지를 받는다:

"답하지 마라. 답하지 마라. 답하지 마라!!!"

그러나 문화대혁명으로 인류에 절망한 그녀는 망설임 없이 답신을 보낸다:

"이리 오십시오. 나는 이 세계를 정복하는 것을 도와드리겠습니다. 우리 문명은 스스로를 구원할 수 없습니다."

이 한 번의 클릭으로 인류의 운명이 결정되었다. 삼체 함대는 400년의 여정을 시작했고, 지구는 종말의 카운트다운에 들어갔다.

**영향력:**
- 인류 역사상 가장 중대한 배신
- 삼체 침공의 직접적 원인
- ETO 조직 창설의 계기`,
    relatedCharacters: ['예원제', '마이크 에반스', '삼체 평화주의자'],
    relatedEvents: ['홍안 기지 신호 발신', 'ETO 창설', '삼체 함대 출발'],
    relatedConcepts: ['태양 증폭', '소폰'],
    quote: '"이리 오십시오. 나는 이 세계를 정복하는 것을 도와드리겠습니다." - 예원제',
    whyGreat: '개인의 트라우마가 인류 전체의 운명을 바꾸는 SF 역사상 가장 강렬한 순간 중 하나',
    votes: 9847
  },
  {
    id: 2,
    rank: 2,
    title: '암흑의 숲 이론 공개',
    titleEn: 'Dark Forest Theory Revelation',
    book: '2부: 암흑의 숲',
    chapter: '뤄지의 주문',
    image: '🌲',
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/0f3460/4ecdc4?text=암흑의+숲',
    impact: 10,
    emotionalWeight: 9,
    category: '깨달음',
    shortDesc: '뤄지가 우주의 본질을 깨닫고 삼체를 위협하는 순간',
    fullDescription: `뤄지는 두 가지 공리로부터 우주의 잔혹한 진실을 도출한다:

**공리 1:** 생존은 문명의 제1욕구
**공리 2:** 문명은 확장하지만 우주 물질은 유한

→ **결론:** 우주는 암흑의 숲. 모든 문명은 숨어있는 사냥꾼. 발견되면 즉시 파괴.

뤄지는 이 이론으로 삼체를 위협한다: "너희 좌표를 우주에 알리겠다." 삼체는 즉시 공포에 떨며 후퇴한다.

**영향력:**
- 페르미 역설의 가장 암울한 해답
- 면벽 계획의 유일한 성공 사례
- 검잡이 체제의 이론적 기반`,
    relatedCharacters: ['뤄지', '정청신', '장베이하이'],
    relatedEvents: ['암흑의 숲 이론 발견', '검잡이 체제 시작', '삼체 함대 후퇴'],
    relatedConcepts: ['암흑의 숲 법칙', '검잡이', '면벽 계획'],
    quote: '"우주는 어두운 숲이다. 모든 문명은 총을 든 사냥꾼이다." - 뤄지',
    whyGreat: '우주사회학이라는 새로운 개념을 만들어낸 SF 문학의 걸작 아이디어',
    votes: 9654
  },
  {
    id: 3,
    rank: 3,
    title: '말일 전투 (Doomsday Battle)',
    titleEn: 'Battle of Doomsday',
    book: '2부: 암흑의 숲',
    chapter: '말일 전투',
    image: '💥',
    imagePath: '/images/three-body/scenes/droplet.png',
    fallback: 'https://via.placeholder.com/1200x675/16213e/ff6b6b?text=말일+전투',
    impact: 9,
    emotionalWeight: 10,
    category: '전투',
    shortDesc: '인류 우주 함대 2000척이 단 하나의 워터 드롭에 전멸당하는 참사',
    fullDescription: `인류는 삼체의 워터 드롭 탐사선 1대를 포위했다. 완벽한 거울면을 가진 아름다운 비행체.

**전력 차이:**
- 인류 함대: 2000척의 최신 우주전함
- 삼체: 단 1대의 워터 드롭 (무인 탐사선)

전투 시작 37분 만에 인류 함대 전멸.

워터 드롭은 광속의 1/4로 함대를 관통하며 모든 함선을 파괴했다. 인류는 단 한 발도 쏘지 못했다. 마치 활과 화살로 무장한 원시인이 현대 전투기를 상대하는 것과 같았다.

**생존자:**
- 블루스페이스호
- 브론즈에이지호
(이들은 우연히 전장을 벗어나 있었음)

**영향력:**
- 인류의 오만함이 초래한 최악의 패배
- 과학 기술 봉쇄(소폰)의 무서움 증명
- 도망주의의 정당성 입증`,
    relatedCharacters: ['장베이하이', '창웨이스', '둥펑웨이'],
    relatedEvents: ['말일 전투', '암흑 전투', '블루스페이스호 도주'],
    relatedConcepts: ['워터 드롭', '소폰', '나노와이어'],
    quote: '"앞으로! 앞으로! 우리는 포기하지 않는다!" - 장베이하이',
    whyGreat: '기술 격차의 절망감을 완벽하게 표현한 SF 전투의 명장면',
    votes: 9234
  },
  {
    id: 4,
    rank: 4,
    title: '검잡이 교체 - 62년간의 평화 종료',
    titleEn: 'Swordholder Handover',
    book: '3부: 사신의 영생',
    chapter: '검잡이 교체',
    image: '⚔️',
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/1a1a2e/ffce56?text=검잡이+교체',
    impact: 10,
    emotionalWeight: 8,
    category: '결정적 순간',
    shortDesc: '뤄지에서 정청신으로 검잡이가 교체되고 15분 만에 인류 멸망 위기',
    fullDescription: `**뤄지 시대 (62년):**
- 냉혹한 검잡이
- "버튼을 누를 수 있는 자"
- 삼체는 감히 공격하지 못함
- 완벽한 억지력 = 평화

**정청신 시대 (15분):**
- 사랑과 평화를 상징하는 여성
- "버튼을 누를 수 없는 자"
- 삼체는 즉시 간파함
- 15분 만에 지구 점령

교체 15분 후:
1. 소폰이 정청신에게 나타남
2. "당신은 버튼을 누를 수 없다"
3. 삼체 함대 즉시 공격 재개
4. 지구 전체가 삼체에게 항복
5. 인류는 호주로 강제 이주 선고

**교훈:**
평화를 지키려면 전쟁을 각오한 자가 필요하다. 선의만으로는 부족하다.`,
    relatedCharacters: ['뤄지', '정청신', '관이판', '소폰'],
    relatedEvents: ['검잡이 교체', '삼체 침공 재개', '호주 이주 선고'],
    relatedConcepts: ['검잡이', '암흑의 숲 법칙', '소폰'],
    quote: '"나는 버튼을 누를 수 없어요. 두 세계를 파괴하는 것은... 사랑이 아니에요." - 정청신',
    whyGreat: '핵 억지력과 평화주의의 딜레마를 완벽하게 형상화한 장면',
    votes: 8967
  },
  {
    id: 5,
    rank: 5,
    title: '차원 타격 - 태양계의 종말',
    titleEn: 'Dimensional Strike',
    book: '3부: 사신의 영생',
    chapter: '태양계 2차원화',
    image: '🎨',
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/0f3460/ff6b6b?text=차원+타격',
    impact: 10,
    emotionalWeight: 10,
    category: '우주적 재앙',
    shortDesc: '태양계 전체가 3차원에서 2차원으로 붕괴하는 우주적 재앙',
    fullDescription: `한 장의 작은 종이쪽지 크기의 "이차원 조각"이 태양계에 진입한다.

**과정:**
1. 작은 점으로 시작
2. 주변 공간을 2차원으로 전환
3. 멈출 수 없는 연쇄 반응
4. 태양계 전체가 평면이 됨

**속도:**
광속으로 확산. 피할 방법 없음.

**3D → 2D 변환:**
- 모든 물질이 평면이 됨
- 태양은 거대한 평면 원반으로
- 행성들은 예술작품처럼 아름다운 평면으로
- 생명체는... 평면 위의 패턴으로

**생존자:**
- 광속 우주선으로 도망친 소수만 생존
- 지구는 2차원 평면 위의 아름다운 화석이 됨

**철학적 의미:**
우주 전쟁은 물리 법칙 자체를 무기로 사용한다. 3차원은 단지 일시적 상태일 뿐.`,
    relatedCharacters: ['정청신', '관이판', '로지', '아아'],
    relatedEvents: ['태양계 이차원화', '우주 안전 선언', '광속 탈출'],
    relatedConcepts: ['차원 타격', '곡률 추진', '암흑의 숲 법칙'],
    quote: '"태양계는 이제 예술작품이 되었다. 평면 위의 거대한 그림." - 정청신',
    whyGreat: 'SF 역사상 가장 창의적이고 아름다운 종말 장면',
    votes: 8745
  },
  {
    id: 6,
    rank: 6,
    title: '심판의 날 작전 - 나노와이어 절단',
    titleEn: 'Operation Guzheng',
    book: '1부: 삼체',
    chapter: '고증(古筝) 작전',
    image: '🧵',
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/1a1a2e/4ecdc4?text=심판의+날',
    impact: 8,
    emotionalWeight: 9,
    category: '작전',
    shortDesc: '나노와이어로 ETO 본부 유조선을 67개 층으로 절단하는 잔혹한 작전',
    fullDescription: `왕먀오가 개발한 나노와이어를 이용해 ETO 본부가 있는 유조선 "심판의 날"호를 절단하는 작전.

**작전 개요:**
1. 파나마 운하를 통과하는 순간 실행
2. 운하 양쪽에 나노와이어 설치
3. 배가 통과하면서 67개 층으로 절단
4. 컴퓨터 하드 드라이브만 온전히 보존

**결과:**
- 배는 완벽하게 67개 층으로 절단됨
- 수백 명의 ETO 요원 사망
- 마이크 에반스 사망
- 삼체와의 모든 통신 기록 확보

**윤리적 딜레마:**
- 필요한 작전이었나?
- 인간성을 잃지 않았나?
- 괴물과 싸우기 위해 괴물이 되어야 하는가?

Thomas Wade: "우리는 괴물과 싸우기 위해 괴물이 되었다."`,
    relatedCharacters: ['왕먀오', '스창', '마이크 에반스'],
    relatedEvents: ['심판의 날 작전', 'ETO 괴멸', '삼체 통신 기록 확보'],
    relatedConcepts: ['나노와이어'],
    quote: '"필요하다면 나는 악마가 될 것이다." - Thomas Wade',
    whyGreat: '목적을 위한 수단의 정당성을 묻는 도덕적 딜레마의 완벽한 형상화',
    votes: 8234
  },
  {
    id: 7,
    rank: 7,
    title: '장베이하이의 선택 - 자연선택호 탈취',
    titleEn: 'Zhang Beihai\'s Choice',
    book: '2부: 암흑의 숲',
    chapter: '도주',
    image: '🚀',
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/1a1a2e/4ecdc4?text=장베이하이의+선택',
    impact: 9,
    emotionalWeight: 9,
    category: '결정적 순간',
    shortDesc: '장베이하이가 자연선택호를 탈취하여 인류의 씨앗을 우주로 보내다',
    fullDescription: `우주군 정치위원 장베이하이는 인류의 패배를 200년 전부터 예견했다.

**그의 신념:**
"인류는 삼체에게 질 것이다. 따라서 일부라도 살아남아야 한다."

**행동:**
1. 자연선택호의 함장이 됨
2. 말일 전투 와중에 함대를 탈취
3. 우주 깊은 곳으로 도주
4. 추격하는 4척의 함선과 대치

**최후:**
장베이하이는 블루스페이스호와의 전투에서 패배하여 사망한다. 그러나 그의 희생으로:
- 블루스페이스호와 자연선택호는 살아남음
- "암흑 전투"를 통해 인류의 씨앗 보존
- 그의 도망주의가 결국 옳았음이 증명됨

**유언:**
"앞으로! 앞으로!! 포기하지 마라!!!"

**평가:**
배신자인가? 영웅인가? 그는 인류의 미래를 구한 선견지명의 소유자였다.`,
    relatedCharacters: ['장베이하이', '창웨이스', '둥펑웨이', '우웨이'],
    relatedEvents: ['자연선택호 탈취', '암흑 전투', '말일 전투'],
    relatedConcepts: ['워터 드롭'],
    quote: '"앞으로! 앞으로! 우리는 포기하지 않는다!" - 장베이하이',
    whyGreat: '배신과 영웅주의의 경계를 묻는 SF 캐릭터의 걸작',
    votes: 7986
  },
  {
    id: 8,
    rank: 8,
    title: '암흑 전투 (Dark Battle)',
    titleEn: 'Dark Battle',
    book: '2부: 암흑의 숲',
    chapter: '암흑 전투',
    image: '⚫',
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/1a1a2e/4ecdc4?text=암흑+전투',
    impact: 8,
    emotionalWeight: 10,
    category: '전투',
    shortDesc: '우주를 도주하던 5척의 함선이 생존을 위해 서로를 공격하는 비극',
    fullDescription: `말일 전투에서 살아남은 5척의 함선이 우주 깊은 곳으로 도주한다.

**상황:**
- 5척의 함선, 식량은 10년치
- 지구로 돌아갈 수 없음 (워터 드롭이 태양계 봉쇄)
- 가장 가까운 별까지 수십 년
- 생존 방법: 다른 함선을 공격하여 자원 확보

**전개:**
1. 블루스페이스호가 먼저 공격 시작
2. 다른 4척을 파괴하고 자원 약탈
3. 자연선택호도 공격하려 했으나 늦음

**결과:**
- 블루스페이스호 승리
- 수천 명의 동료 우주인 살해
- 인류는 서로를 잡아먹는 괴물이 됨

**철학:**
이것이 우주의 진실이다. 암흑의 숲 법칙은 인류 내부에도 적용된다. 생존은 도덕보다 우선한다.

**장베이하이의 평가:**
"그들은 옳았다. 이것이 우주의 법칙이다."`,
    relatedCharacters: ['우웨이', '벤저 시트', '장베이하이'],
    relatedEvents: ['암흑 전투', '말일 전투', '블루스페이스호 도주'],
    relatedConcepts: ['암흑의 숲 법칙'],
    quote: '"용서해주십시오. 하지만 생존은 도덕보다 앞선다." - 블루스페이스호 함장',
    whyGreat: '극한 상황에서 인간성의 붕괴를 보여주는 잔혹한 장면',
    votes: 7654
  },
  {
    id: 9,
    rank: 9,
    title: '윈톈밍의 동화 경고',
    titleEn: 'Yun Tianming\'s Fairy Tales',
    book: '3부: 사신의 영생',
    chapter: '세 개의 동화',
    image: '📖',
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/1a1a2e/4ecdc4?text=윈톈밍+동화',
    impact: 9,
    emotionalWeight: 7,
    category: '깨달음',
    shortDesc: '삼체에 포로로 잡힌 윈톈밍이 동화 속에 숨긴 우주 생존의 비밀',
    fullDescription: `윈톈밍은 뇌만 남은 상태로 삼체에게 포로로 잡혀 있다. 삼체는 그를 지구로 보내 메시지를 전하게 한다.

**세 개의 동화:**
1. **왕과 화가의 이야기** - 차원 무기 힌트
2. **공주와 우주의 바다** - 곡률 추진 힌트
3. **만능 우산의 이야기** - 우주 안전 선언 힌트

**암호 해독:**
정청신과 과학자들은 수년에 걸쳐 동화 속 메시지를 해독한다:
- **핵심 메시지:** "광속으로 도망쳐라"
- **경고:** 우주에는 차원 무기가 있다
- **희망:** 곡률 추진으로 탈출 가능

**결과:**
- 인류는 광속 우주선 개발 시작
- 일부는 태양계 2차원화 이전에 탈출 성공
- 윈톈밍의 희생으로 인류의 일부가 생존

**사랑:**
윈톈밍은 정청신을 사랑했다. 그는 자신의 뇌를 정청신에게 선물했고, 포로 상태에서도 그녀와 인류를 구하려 했다.`,
    relatedCharacters: ['윈톈밍', '정청신', '관이판', '아아'],
    relatedEvents: ['윈톈밍의 동화', '광속 우주선 개발', '태양계 탈출'],
    relatedConcepts: ['차원 타격', '곡률 추진'],
    quote: '"나는 당신에게 별 하나를 선물했습니다." - 윈톈밍',
    whyGreat: '사랑과 희생, 그리고 암호를 통한 인류 구원의 아름다운 이야기',
    votes: 7432
  },
  {
    id: 10,
    rank: 10,
    title: '우주의 재시작 - 정청신의 선택',
    titleEn: 'Universe Reset',
    book: '3부: 사신의 영생',
    chapter: '우주의 귀환',
    image: '♾️',
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/1a1a2e/4ecdc4?text=우주+재시작',
    impact: 10,
    emotionalWeight: 10,
    category: '결말',
    shortDesc: '정청신이 소우주에 남아 우주 재시작에 기여하는 마지막 장면',
    fullDescription: `우주는 팽창에서 수축으로 전환되고 있다. 모든 문명은 "우주 귀환 운동"에 동참해야 한다.

**우주의 상황:**
- 원래 우주: 10차원, 광속 무한대
- 현재 우주: 3차원, 광속 30만km/s
- 원인: 수십억 년간의 우주 전쟁

**귀환 방법:**
모든 소우주의 질량을 대우주로 돌려보내야 빅 크런치 → 빅 뱅 → 새로운 우주 탄생 가능.

**정청신의 선택:**
1. 관이판과 함께 소우주에 남음
2. 대부분의 질량을 대우주로 돌려보냄
3. 단 5kg만 남김 (추억의 물건들)
4. 우주 재시작을 위해 희생

**마지막 장면:**
정청신은 죽어가는 우주 속에서 관이판과 함께 사라진다. 새로운 우주가 탄생할 것이다. 언젠가.

**메시지:**
"시간 앞에서 우리는 모두 아이들입니다."`,
    relatedCharacters: ['정청신', '관이판', '로지', '윈톈밍'],
    relatedEvents: ['우주 재시작', '소우주 귀환', '태양계 이차원화'],
    relatedConcepts: ['차원 타격', '곡률 추진', '암흑의 숲 법칙'],
    quote: '"시간 앞에서 우리는 모두 아이들입니다." - 정청신',
    whyGreat: 'SF 역사상 가장 장엄하고 아름다운 결말',
    votes: 9123
  }
]

export default function TopScenes() {
  const [selectedScene, setSelectedScene] = useState(null)
  const [filterBook, setFilterBook] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('rank')

  // Extract unique books and categories
  const books = ['all', ...new Set(topScenes.map(s => s.book))]
  const categories = ['all', ...new Set(topScenes.map(s => s.category))]

  // Filter scenes
  const filteredScenes = topScenes.filter(scene => {
    if (filterBook !== 'all' && scene.book !== filterBook) return false
    if (filterCategory !== 'all' && scene.category !== filterCategory) return false
    return true
  })

  // Sort scenes
  const sortedScenes = [...filteredScenes].sort((a, b) => {
    if (sortBy === 'rank') return a.rank - b.rank
    if (sortBy === 'impact') return b.impact - a.impact
    if (sortBy === 'emotion') return b.emotionalWeight - a.emotionalWeight
    if (sortBy === 'votes') return b.votes - a.votes
    return 0
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>삼체 명장면 TOP 10</h1>
        <p className={styles.subtitle}>팬들이 뽑은 가장 인상 깊은 장면들</p>
      </div>

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <div className={styles.filterGroup}>
          <select
            value={filterBook}
            onChange={(e) => setFilterBook(e.target.value)}
            className={styles.select}
          >
            {books.map(book => (
              <option key={book} value={book}>
                {book === 'all' ? '전체 책' : book}
              </option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={styles.select}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? '전체 카테고리' : cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.select}
          >
            <option value="rank">랭킹순</option>
            <option value="impact">영향력순</option>
            <option value="emotion">감정적 무게순</option>
            <option value="votes">투표순</option>
          </select>
        </div>

        <div className={styles.resultCount}>
          {sortedScenes.length}개의 장면
        </div>
      </div>

      {/* Scenes List */}
      <div className={styles.scenesList}>
        {sortedScenes.map((scene, index) => (
          <div
            key={scene.id}
            className={`${styles.sceneCard} ${selectedScene === scene.id ? styles.expanded : ''}`}
            onClick={() => setSelectedScene(selectedScene === scene.id ? null : scene.id)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={styles.sceneImageWrapper}>
              <ImageWithFallback
                src={scene.imagePath}
                fallbackSrc={scene.fallback}
                alt={scene.title}
                width={1200}
                height={675}
                className={styles.sceneImage}
              />
              <div className={styles.rankOverlay}>#{scene.rank}</div>
            </div>

            <div className={styles.sceneHeader}>
              <div className={styles.sceneInfo}>
                <h2 className={styles.sceneTitle}>{scene.title}</h2>
                <p className={styles.sceneTitleEn}>{scene.titleEn}</p>
                <div className={styles.sceneMeta}>
                  <span className={styles.bookBadge}>{scene.book}</span>
                  <span className={styles.categoryBadge}>{scene.category}</span>
                  <span className={styles.chapterBadge}>{scene.chapter}</span>
                </div>
              </div>
            </div>

            <p className={styles.shortDesc}>{scene.shortDesc}</p>

            <div className={styles.metrics}>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>영향력</div>
                <div className={styles.metricBar}>
                  <div className={styles.metricFill} style={{ width: `${scene.impact * 10}%` }} />
                </div>
                <div className={styles.metricValue}>{scene.impact}/10</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>감정적 무게</div>
                <div className={styles.metricBar}>
                  <div className={styles.metricFill} style={{ width: `${scene.emotionalWeight * 10}%` }} />
                </div>
                <div className={styles.metricValue}>{scene.emotionalWeight}/10</div>
              </div>
            </div>

            <div className={styles.voteCount}>👍 {scene.votes.toLocaleString()} votes</div>

            {selectedScene === scene.id && (
              <div className={styles.expandedContent}>
                <div className={styles.fullDescription}>{scene.fullDescription}</div>

                <div className={styles.quoteSection}>
                  <h4>명대사</h4>
                  <blockquote className={styles.quote}>{scene.quote}</blockquote>
                </div>

                <div className={styles.whyGreatSection}>
                  <h4>⭐ 왜 위대한가?</h4>
                  <p>{scene.whyGreat}</p>
                </div>

                {scene.relatedCharacters && scene.relatedCharacters.length > 0 && (
                  <div className={styles.relatedSection}>
                    <h4>관련 인물</h4>
                    <div className={styles.relatedTags}>
                      {scene.relatedCharacters.map((char, i) => (
                        <CrossReferenceLink key={i} type="character" name={char} />
                      ))}
                    </div>
                  </div>
                )}

                {scene.relatedEvents && scene.relatedEvents.length > 0 && (
                  <div className={styles.relatedSection}>
                    <h4>관련 사건</h4>
                    <div className={styles.relatedTags}>
                      {scene.relatedEvents.map((event, i) => (
                        <CrossReferenceLink key={i} type="event" name={event} />
                      ))}
                    </div>
                  </div>
                )}

                {scene.relatedConcepts && scene.relatedConcepts.length > 0 && (
                  <div className={styles.relatedSection}>
                    <h4>관련 개념</h4>
                    <div className={styles.relatedTags}>
                      {scene.relatedConcepts.map((concept, i) => (
                        <CrossReferenceLink key={i} type="concept" name={concept} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className={styles.expandHint}>
              {selectedScene === scene.id ? '클릭하여 접기 ▲' : '클릭하여 자세히 보기 ▼'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
