import styles from './styles/CharacterProfiles.module.css'

const characters = [
  {
    initial: '예',
    name: '예원제',
    chinese: '葉文潔',
    role: '천체물리학자, 삼체-지구 조직 창립자, 인류 배신자',
    actions: [
      '아버지 예저타이의 죽음 목격',
      '레이더 피크에서 삼체 문명과 첫 접촉',
      '삼체-지구 조직(ETO) 창립',
      '인류 위치 노출 신호 송신'
    ],
    fate: '나노와이어 작전으로 사망',
    background: '문화대혁명 시기 아버지를 잃고 인류에 대한 신뢰를 상실. 삼체 문명이 인류보다 더 나은 사회를 건설할 것이라 믿음.'
  },
  {
    initial: '마',
    name: '마이크 에반스',
    chinese: 'Mike Evans',
    role: 'ETO 수장, 환경보호주의자',
    actions: [
      'ETO 실질적 운영자로 활동',
      '구세파와 구도파 조직 형성',
      '삼체와 지구 간 통신 중계',
      '심판자호를 이용한 삼체 협력'
    ],
    fate: '나노와이어 작전으로 사망',
    background: '극단적 환경보호주의자로 인류의 환경 파괴에 절망. 삼체를 통한 지구 정화를 꿈꿈. ETO를 구세파(삼체 완전 승리)와 구도파(인류 자구책)로 분열.'
  },
  {
    initial: '뤄',
    name: '뤄지',
    chinese: '羅輯',
    role: '사회학자, 면벽자, 검잡이, 2부 주인공',
    actions: [
      '우주사회학 연구',
      '암흑의 숲 이론 발견',
      '삼체 함대 위협으로 지구 구원',
      '62년간 검잡이 역할 수행'
    ],
    fate: '검잡이 임무 완수 후 은퇴',
    background: '처음엔 평범한 천문학자였으나 면벽자로 선정되며 운명이 바뀜. 암흑의 숲 이론을 통해 우주의 본질을 깨달음.'
  },
  {
    initial: '정',
    name: '정청신',
    chinese: '程心',
    role: '우주항공공학자, 검잡이, 3부 주인공',
    actions: [
      '계단 프로젝트 제안',
      '검잡이 임명',
      '위협 해제 결정 (치명적 실수)',
      '광속 추진 프로젝트 중단',
      '소우주에서 우주 재시작 참여'
    ],
    fate: '관이판과 함께 소우주에 남아 우주 재시작에 기여',
    background: '선량하고 사랑이 넘치는 인물이지만, 그 선량함이 인류를 멸망으로 이끄는 비극적 인물. 결국 사랑을 통해 구원받음.'
  },
  {
    initial: '왕',
    name: '왕먀오',
    chinese: '汪淼',
    role: '나노재료 연구자, 1부 주인공',
    actions: [
      '카운트다운 현상 경험',
      '삼체 게임 참여',
      '나노와이어 개발',
      '삼체 조직 소탕 작전 참여'
    ],
    fate: '생존, 과학 연구 지속',
    background: '평범한 과학자에서 삼체 위기의 핵심 인물로 성장. 나노기술로 인류를 구하는 영웅이 됨.'
  },
  {
    initial: '윈',
    name: '윈톈밍',
    chinese: '云天明',
    role: '정청신의 첫사랑, 삼체 세계 포로',
    actions: [
      '뇌만 삼체 세계로 전송됨',
      '삼체인과 공존',
      '동화를 통해 인류에게 경고 전달',
      '정청신에게 별 하나를 선물'
    ],
    fate: '삼체 세계에서 생존, 궁극적으로 행복한 삶',
    background: '죽음을 앞둔 순간 정청신에 대한 사랑으로 인류를 구하기 위한 계획에 참여. 가장 낭만적이고 비극적인 사랑 이야기.'
  },
  {
    initial: '토',
    name: '토마스 웨이드',
    chinese: '托马斯·维德',
    role: 'PIA 국장, 광속 추진 지지자',
    actions: [
      '광속 추진 연구 추진',
      '정청신과 이념적 갈등',
      '무력으로 광속 추진 강행 시도',
      '인류 생존을 위한 냉혹한 결정'
    ],
    fate: '반란 실패 후 체포',
    background: '냉혹한 현실주의자. "우리는 별들을 향해 전진한다"는 신념으로 인류의 생존을 최우선시. 정청신과 대비되는 캐릭터.'
  },
  {
    initial: '장',
    name: '장베이하이',
    chinese: '章北海',
    role: '우주군 정치위원, 도망주의자',
    actions: [
      '태양계 탈출을 위한 준비',
      '우주선 탈취',
      '인류 종족 보존 시도',
      '최후의 도망'
    ],
    fate: '우주 전투에서 전사',
    background: '인류의 패배를 확신하고 종족 보존을 위해 행동. 진정한 영웅인지 배신자인지 논란이 되는 인물.'
  },
  {
    initial: '관',
    name: '관이판',
    chinese: '關一帆',
    role: '이론물리학자, 정청신의 동반자',
    actions: [
      '우주 법칙 연구',
      '정청신과 동행',
      '소우주 발견',
      '우주 재시작 프로젝트 참여'
    ],
    fate: '정청신과 함께 소우주에 남아 새로운 우주 탄생에 기여',
    background: '정청신의 여정에 함께하며 우주의 비밀을 탐구. 최종적으로 사랑과 희생을 통해 구원에 이름.'
  },
  {
    initial: '창',
    name: '창웨이스',
    chinese: '常伟思',
    role: '우주군 장군, 현실적 방어주의자',
    actions: [
      '우주 함대 방어 체계 구축',
      '장베이하이와 전략적 대립',
      '현실적 방어 전략 수립',
      '말일 전투 참전'
    ],
    fate: '말일 전투에서 전사',
    background: '장베이하이와 대비되는 현실주의자. 패배주의가 아닌 현실적 준비를 주장하며 인류의 방어 능력을 믿음.'
  },
  {
    initial: '세',
    name: '세이',
    chinese: 'Say',
    role: 'UN 사무총장, 정치 지도자',
    actions: [
      'UN 삼체 위기 대응 총괄',
      '면벽 계획 승인 및 지원',
      '국제 협력 조율',
      '인류 생존 전략 정치적 리더십'
    ],
    fate: '임기 후 생존',
    background: '삼체 위기 상황에서 인류의 정치적 통합을 이끈 지도자. 면벽자 제도를 승인하고 국제 협력을 주도.'
  },
  {
    initial: '켄',
    name: '켄트',
    chinese: 'Kent',
    role: '외교관, 면벽 계획 조율자',
    actions: [
      '면벽자와 UN 간 소통',
      '국제 외교 조율',
      '뤄지 지원 및 협력',
      '삼체 대응 전략 외교적 실행'
    ],
    fate: '생존',
    background: '면벽 계획의 실무적 조율자. 특히 뤄지와 긴밀히 협력하며 암흑의 숲 전략 실행을 지원.'
  },
  {
    initial: '가',
    name: '가라닛',
    chinese: 'Garranin',
    role: 'PDC 의장, 행성방위이사회 수장',
    actions: [
      'PDC 전략 결정 주도',
      '면벽자 감시 및 지원',
      '인류 방위 자원 배분',
      '삼체 대응 최고 의사결정'
    ],
    fate: '임기 후 생존',
    background: '행성방위이사회(PDC)를 이끌며 인류의 생존 전략을 최고 수준에서 결정. 면벽자들의 활동을 총괄 감독.'
  },
  {
    initial: '둥',
    name: '둥펑웨이',
    chinese: '東方延續',
    role: '여성 함대 사령관, 개척자',
    actions: [
      '아시아 함대 지휘',
      '여성 최초 함대 사령관',
      '우주 전투 전략 수립',
      '말일 전투 참전'
    ],
    fate: '말일 전투에서 전사',
    background: '인류 역사상 최초의 여성 우주 함대 사령관. 뛰어난 전술 능력과 리더십으로 존경받음.'
  },
  {
    initial: '타',
    name: '프레데릭 타일러',
    chinese: 'Frederick Tyler',
    role: '미국 전 국방부 장관, 면벽자',
    actions: [
      '면벽자 선정',
      '군사 전략 수립',
      '파벽인에 의해 전략 노출',
      '면벽 계획 실패'
    ],
    fate: '전략 실패 후 사임',
    background: '군사 전문가로서 면벽자가 되었으나 삼체의 파벽인에게 전략이 간파되어 실패. 인간의 전략적 한계를 보여줌.'
  },
  {
    initial: '레',
    name: '마누엘 레이디아즈',
    chinese: 'Manuel Rey Diaz',
    role: '베네수엘라 대통령, 면벽자',
    actions: [
      '수성 핵폭탄 계획 수립',
      '극단적 전략으로 논란',
      '파벽인에 의해 계획 노출',
      '면벽 계획 실패 후 자살'
    ],
    fate: '계획 실패 후 자살',
    background: '가장 과격한 면벽자. 수성을 거대한 핵폭탄으로 만들어 삼체 함대를 파괴하려 했으나 실패하고 자살.'
  },
  {
    initial: '하',
    name: '빌 하인즈',
    chinese: 'Bill Hines',
    role: '영국 뇌과학자, 면벽자',
    actions: [
      '사고강인 프로젝트 추진',
      '인류 심리 개조 시도',
      '파벽인에 의해 계획 노출',
      '면벽 계획 실패'
    ],
    fate: '계획 실패 후 은퇴',
    background: '뇌과학을 이용해 인류를 전쟁에 적합하게 개조하려 했으나 실패. 가장 과학적이었으나 윤리적 논란이 가장 큰 면벽자.'
  },
  {
    initial: '우',
    name: '우웨이',
    chinese: '吳岳',
    role: '우주군 함장, 블루스페이스호 지휘관',
    actions: [
      '블루스페이스호 함장',
      '우주 탐험 임무 수행',
      '암흑의 숲 법칙 직접 경험',
      '인류 생존자 그룹 형성'
    ],
    fate: '우주 깊은 곳에서 생존 지속',
    background: '장베이하이와 함께 도망주의를 실천한 인물. 블루스페이스호를 이끌고 태양계를 탈출하여 새로운 인류 문명의 씨앗이 됨.'
  },
  {
    initial: '벤',
    name: '벤저 시트',
    chinese: 'Scott',
    role: '우주군 장교, 자연선택호 함장',
    actions: [
      '자연선택호 지휘',
      '블루스페이스호와 암흑 전투',
      '생존을 위한 극단적 선택',
      '인류의 어두운 면 직면'
    ],
    fate: '우주에서 생존, 도덕적 딜레마 직면',
    background: '생존을 위해 동족을 죽여야 하는 극한 상황에 직면. 인류의 도덕과 생존 본능 사이의 갈등을 상징.'
  }
]

export default function CharacterProfiles() {
  return (
    <div className={styles.characterProfiles}>
      {characters.map((char, index) => (
        <div key={index} className={styles.characterCard}>
          <div className={styles.characterHeader}>
            <div className={styles.characterAvatar}>{char.initial}</div>
            <div>
              <div className={styles.characterName}>{char.name}</div>
              <div className={styles.characterChinese}>{char.chinese}</div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>역할</div>
            <div className={styles.sectionContent}>{char.role}</div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>배경</div>
            <div className={styles.sectionContent}>{char.background}</div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>주요 행동</div>
            <ul className={styles.actionList}>
              {char.actions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>최종 운명</div>
            <div className={styles.sectionContent}>{char.fate}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
