import styles from './styles/Factions.module.css'

const factions = [
  {
    title: '삼체-지구 조직 (ETO)',
    description: '인류를 배신하고 삼체 문명의 지구 침공을 돕는 조직. 구세파와 구도파로 분열',
    members: [
      { name: '예원제', role: '천체물리학자, 조직 창립자' },
      { name: '마이크 에반스', role: 'ETO 수장, 환경보호주의자' }
    ],
    ideology: '인류의 타락과 환경 파괴를 이유로 삼체 문명이 더 나은 사회를 건설할 것이라 믿음'
  },
  {
    title: '구세파 (Adventist)',
    description: 'ETO 내 극단주의 분파. 삼체의 완전한 승리와 인류 정복 지지',
    members: [
      { name: '마이크 에반스', role: '구세파 지도자' },
      { name: '판한', role: '생물학자, 인류 멸종 지지' }
    ],
    ideology: '인류는 구원받을 가치가 없으며 삼체가 지구를 완전히 정복해야 한다고 믿음. 가장 극단적인 삼체 숭배자들'
  },
  {
    title: '구도파 (Redemptionist)',
    description: 'ETO 내 온건 분파. 삼체와 인류의 공존 추구',
    members: [
      { name: '셴위', role: '구도파 지도부' }
    ],
    ideology: '삼체 문명의 도움으로 인류 사회를 개혁하고 공존을 모색. 구세파보다 온건하지만 여전히 인류 배신자'
  },
  {
    title: '면벽자 프로젝트',
    description: '삼체의 지자 감시를 피해 독립적으로 방어 계획을 수행하는 4명의 전략가',
    members: [
      { name: '뤄지', role: '사회학자, 성공한 면벽자 (암흑의 숲 이론)' },
      { name: '프레드릭 타일러', role: '전 미국 국방장관 (실패)' },
      { name: '마누엘 레이디아즈', role: '베네수엘라 대통령 (실패)' },
      { name: '빌 하인즈', role: '신경과학자 (실패)' }
    ],
    ideology: '지자의 감시를 피해 생각만으로 전략을 수립하고 실행. 오직 뤄지만이 성공'
  },
  {
    title: '검잡이',
    description: '암흑의 숲 타격 스위치를 가진 자, 삼체를 위협하여 평화 유지',
    members: [
      { name: '뤄지', role: '초대 검잡이, 62년간 평화 유지' },
      { name: '정청신', role: '2대 검잡이, 위협 실패로 인류 멸망 위기 초래' }
    ],
    ideology: '상호확증파괴(MAD) 개념으로 삼체와 지구의 균형 유지. 검잡이의 의지와 결단이 핵심'
  },
  {
    title: '과학자 그룹',
    description: '삼체 위기에 맞서 과학적 해법을 찾는 과학자들',
    members: [
      { name: '왕먀오', role: '나노재료 연구자, 나노와이어 개발' },
      { name: '양둥', role: '이론물리학자, 예원제의 딸' },
      { name: '딩이', role: '이론물리학자, 물리학 법칙 붕괴 발견' },
      { name: '관이판', role: '이론물리학자, 우주 법칙 연구' }
    ],
    ideology: '과학을 통한 인류 생존. 그러나 지자에 의해 과학 발전이 봉쇄됨'
  },
  {
    title: '정부 및 국제기구',
    description: '삼체 위기에 대응하는 각국 정부와 국제기구',
    members: [
      { name: '세이', role: 'UN 사무총장, 정치 지도자' },
      { name: '켄트', role: '외교관, 면벽 계획 조율자' },
      { name: '가라닛', role: 'PDC 의장, 행성방위이사회 수장' },
      { name: '토마스 웨이드', role: 'PIA 국장, 광속 추진 지지자' }
    ],
    ideology: '인류 생존을 위한 현실주의적 접근. 때로는 냉혹한 결정도 불사'
  },
  {
    title: '우주군',
    description: '삼체 함대와의 전투를 준비하는 우주 전력',
    members: [
      { name: '장베이하이', role: '우주군 정치위원, 극단적 생존주의자' },
      { name: '창웨이스', role: '우주군 장군, 현실적 방어주의자' },
      { name: '둥펑웨이', role: '여성 함대 사령관' },
      { name: '우웨이', role: '블루스페이스호 함장' },
      { name: '벤저 시트', role: '자연선택호 함장' }
    ],
    ideology: '인류의 우주 탈출과 생존. 장베이하이의 도망주의 vs 창웨이스의 방어주의'
  },
  {
    title: '삼체 문명',
    description: '혼돈의 3항성계에서 온 외계 문명',
    members: [
      { name: '삼체 평화주의자', role: '지구에 경고 신호를 보낸 삼체인' },
      { name: '윈톈밍', role: '삼체에 포로로 잡힌 인간, 동화로 경고 전달' },
      { name: '지자(智子)', role: '양자 입자 기반 AI, 지구 감시' }
    ],
    ideology: '생존을 위한 필사적 노력. 3항성계의 불안정성으로 새로운 행성 필요'
  },
  {
    title: '최종 생존자',
    description: '우주의 종말을 넘어 새로운 시작에 기여하는 자들',
    members: [
      { name: '정청신', role: '소우주에 남아 우주 재시작 참여' },
      { name: '관이판', role: '정청신과 함께 새로운 우주 탄생에 기여' }
    ],
    ideology: '사랑과 희생을 통한 구원. 우주의 재시작과 새로운 시작'
  }
]

export default function Factions() {
  return (
    <div className={styles.factionGrid}>
      {factions.map((faction, index) => (
        <div key={index} className={styles.factionCard}>
          <div className={styles.factionTitle}>{faction.title}</div>
          <div className={styles.factionDescription}>{faction.description}</div>
          <div className={styles.factionIdeology}>
            <strong>이념:</strong> {faction.ideology}
          </div>
          <ul className={styles.factionMembers}>
            {faction.members.map((member, i) => (
              <li key={i}>
                <div className={styles.memberName}>{member.name}</div>
                <div className={styles.memberRole}>{member.role}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
