import { useState } from 'react'
import styles from './styles/StaircaseProject.module.css'

// 세 가지 주요 생존 프로젝트
const projects = [
  {
    id: 1,
    name: '벙커 프로젝트',
    nameEn: 'Bunker Project',
    nameChinese: '掩体计划',
    period: '방송기원 초기',
    initiator: '인류 연합',
    purpose: '목성, 토성, 천왕성, 해왕성 등 거대 행성 뒤에 숨어 삼체의 암흑의 숲 타격으로부터 생존',
    background: `블루스페이스호가 삼체와 지구의 좌표를 우주로 브로드캐스트하면서 태양계는 암흑의 숲 법칙에 따라 공격받을 위험에 처했다.

인류는 공격이 태양을 겨냥할 것으로 예상하고, 거대 가스 행성들의 뒤편에 우주 도시를 건설하여 태양의 폭발로부터 보호받고자 했다. 4개의 거대 행성 주변에 우주 도시를 건설하고, 수십억 명의 인류를 이주시키는 대규모 프로젝트였다.`,
    keyFeatures: [
      '목성, 토성, 천왕성, 해왕성 궤도에 우주 도시 건설',
      '거대 행성을 태양 폭발의 방패로 사용',
      '수십억 명 규모의 대규모 이주',
      '자급자족 가능한 우주 거주 시설 구축'
    ],
    technicalDetails: {
      cities: '각 행성당 수백 개의 우주 도시',
      population: '총 40억 명 이상 이주',
      construction: '20년 이상 소요',
      infrastructure: '핵융합 발전, 식량 생산 시설, 생명 유지 시스템'
    },
    result: {
      success: false,
      reason: '차원 공격(이차원 박편)',
      details: `인류는 태양을 파괴하는 물리적 공격을 예상했지만, 실제 공격은 3차원 공간 자체를 2차원으로 압축하는 차원 무기였다.

이차원 박편이 태양계에 도착하자 태양계 전체가 2차원 평면으로 붕괴되기 시작했다. 거대 행성들의 뒤에 숨는 것은 아무 의미가 없었다. 벙커 세계의 수십억 명은 모두 2차원 세계로 떨어졌다.

유일한 생존자는 광속 우주선을 타고 탈출한 극소수뿐이었다. 벙커 프로젝트는 완전히 실패했고, 인류의 대부분이 사망했다.`,
      survivors: '광속 우주선 탑승자만 생존 (중력호, 일부 탈출선)',
      lesson: '암흑의 숲 타격의 형태를 예측할 수 없다. 유일한 생존 방법은 광속 탈출뿐이다.'
    },
    characters: ['정청신', '관이판', '뤄지'],
    tags: ['실패', '차원 공격', '대규모 이주']
  },
  {
    id: 2,
    name: '블랙 도메인 프로젝트 (블랙존 프로젝트)',
    nameEn: 'Black Domain Project',
    nameChinese: '黑域计划',
    period: '방송기원 중기',
    initiator: '토마스 웨이드, 과학자 그룹',
    purpose: '광속을 극도로 낮춰 태양계를 저광속 블랙홀로 만들어 암흑의 숲 타격으로부터 보호',
    background: `윈톈밍의 세 번째 동화 "공주의 장미"에 숨겨진 개념.

블랙 도메인(Black Domain)은 특정 공간의 광속을 극도로 낮춰서 그 공간을 우주의 다른 문명에게 "죽은 공간"으로 보이게 만드는 기술이다. 광속이 낮으면 그 공간은 과학기술 발전이 불가능하고, 위협이 되지 않는다.

이것은 일종의 "안전 선언"이다: "우리는 스스로를 감옥에 가두었습니다. 우리는 위협이 아닙니다." 암흑의 숲 법칙 하에서 다른 문명들은 이런 공간을 공격할 필요가 없다고 판단한다.`,
    keyFeatures: [
      '광속을 초당 16.7km (빛의 속도의 1/18000)로 낮춤',
      '태양계 전체를 저광속 블랙홀로 변환',
      '시간 팽창 효과 - 내부에서 1년이 외부에서는 수천 년',
      '영구적 격리 - 한번 생성되면 되돌릴 수 없음'
    ],
    technicalDetails: {
      method: '대규모 곡률 추진 엔진 배열로 공간 곡률 조작',
      range: '태양계 전체 (오르트 구름까지)',
      effect: '광속 감소 + 시간 팽창',
      reversibility: '불가역적 - 한번 생성되면 영원히 갇힘'
    },
    controversy: {
      pros: [
        '암흑의 숲 타격으로부터 완벽한 보호',
        '영구적 안전 보장',
        '우주의 다른 문명에게 위협이 아님을 증명'
      ],
      cons: [
        '인류의 영원한 격리와 감금',
        '과학기술 발전 불가능 (광속이 너무 낮음)',
        '우주 탐험 불가능',
        '자유의 완전한 포기',
        '되돌릴 수 없는 선택'
      ]
    },
    result: {
      success: null,
      status: '프로젝트 중단',
      reason: '정청신의 반대',
      details: `토마스 웨이드는 블랙 도메인 프로젝트를 비밀리에 추진했지만, 정청신은 이를 발견하고 반대했다.

정청신은 "인류를 영원한 감옥에 가두는 것은 생존이 아니라 죽음과 같다"고 주장했다. 그녀는 인류의 자유와 미래를 포기할 수 없다고 믿었다.

웨이드는 "생존이 최우선이다. 자유는 살아있을 때만 의미가 있다"고 반박했지만, 결국 정청신의 압력으로 프로젝트는 중단되었다.

이후 태양계가 이차원화 공격을 받았을 때, 많은 사람들이 블랙 도메인을 만들었어야 했다고 후회했다.`,
      alternativeUse: 'DX3906 항성계에 소규모 블랙존 생성 (윈톈밍과 AA 보호용)'
    },
    philosophicalDebate: {
      question: '자유와 안전 중 무엇을 선택할 것인가?',
      웨이드입장: '살아남지 못하면 자유도 의미가 없다. 생존이 최우선이다.',
      정청신입장: '영원한 감옥에 갇혀 사는 것은 진정한 생존이 아니다. 인류의 미래와 가능성을 포기할 수 없다.',
      독자질문: '당신이라면 어떤 선택을 했을까?'
    },
    characters: ['토마스 웨이드', '정청신', '윈톈밍'],
    tags: ['논쟁', '자유vs안전', '미완성']
  },
  {
    id: 3,
    name: '광속 우주선 프로젝트 (곡률 추진 프로젝트)',
    nameEn: 'Lightspeed Spaceship Project / Curvature Drive Project',
    nameChinese: '光速飞船计划 / 曲率驱动',
    period: '방송기원 초기~중기',
    initiator: '토마스 웨이드',
    purpose: '곡률 추진 엔진으로 광속에 가까운 속도로 항해하여 암흑의 숲 타격으로부터 도망',
    background: `윈톈밍의 두 번째 동화 "심해의 왕자"에 숨겨진 핵심 기술.

곡률 추진(Curvature Drive)은 공간 자체의 곡률을 조작하여 우주선을 광속에 가깝게 가속시키는 기술이다. 우주선 앞의 공간을 수축시키고 뒤의 공간을 팽창시켜, 우주선은 정지해 있지만 공간이 움직이는 원리다.

곡률 추진 우주선은 항해하면서 뒤에 "죽은 선(dead line)"이라는 광속 항적을 남긴다. 이 항적은 주변 공간의 광속을 영구적으로 낮춘다. 이것은 "안전 선언"의 역할을 한다.`,
    keyFeatures: [
      '광속의 99% 이상 도달 가능',
      '상대론적 시간 팽창 효과로 장거리 우주 여행 가능',
      '뒤에 죽은 선(Safe Statement) 생성',
      '암흑의 숲 타격으로부터 도망칠 수 있는 유일한 수단'
    ],
    technicalDetails: {
      principle: '공간 곡률 조작 - 앞 공간 수축, 뒤 공간 팽창',
      speed: '광속의 99.99% (실제로는 광속에 무한히 근접)',
      trailEffect: '죽은 선 - 광속을 낮추는 항적',
      energySource: '진공 영점 에너지 또는 고밀도 물질 엔진'
    },
    developmentHistory: [
      {
        phase: '1단계: 이론 개발',
        period: '억제기원',
        description: '윈톈밍의 동�� 해독 후 곡률 추진 이론 정립',
        keyPeople: ['과학자 그룹', '팔레르모 언어학자']
      },
      {
        phase: '2단계: 비밀 개발',
        period: '방송기원 초기',
        description: '토마스 웨이드가 명왕성 외곽에서 비밀리에 중력호 개발',
        keyPeople: ['토마스 웨이드', '관이판', '과학자들'],
        location: '명왕성 외곽, 태양계 변두리'
      },
      {
        phase: '3단계: 프로젝트 중단',
        period: '방송기원 중기',
        description: '정청신이 삼체와의 평화 협정을 이유로 프로젝트 중단 요구',
        conflict: '웨이드 vs 정청신 무력 대치',
        result: '정청신의 승리, 프로젝트 강제 중단'
      },
      {
        phase: '4단계: 삼체 멸망 후 재개',
        period: '방송기원 후기',
        description: '삼체 멸망 후 광속 추진 금지령 해제, 개발 재개',
        result: '중력호 완성 (관이판 주도)'
      },
      {
        phase: '5단계: 태양계 탈출',
        period: '2273년',
        description: '이차원화 공격 직전 중력호로 태양계 탈출 성공',
        survivors: '정청신, 관이판, 소수의 탈출선'
      }
    ],
    controversy: {
      웨이드주장: [
        '광속 우주선은 인류 생존의 유일한 수단',
        '삼체의 금지는 인류를 멸망시키려는 음모',
        '평화보다 생존 준비가 우선',
        '수백만 명을 구할 수 있다'
      ],
      정청신주장: [
        '삼체와의 평화 협정 위반',
        '무력 충돌 위험',
        '도덕적 책임 - 전쟁을 막아야 함',
        '다른 해결책을 찾을 수 있다'
      ]
    },
    historicalJudgment: {
      정청신결정: '광속 우주선 개발 중단 (방송기원 중기)',
      결과: '태양계 이차원화 시 수십억 명 사망',
      후회: '정청신은 평생 이 결정을 후회함',
      교훈: '"때로는 냉혹한 생존 준비가 선량한 의도보다 중요하다"',
      역사평가: '정청신의 두 번째 치명적 실수. 인류 멸망의 직접적 원인'
    },
    successfulShips: [
      {
        name: '중력호 (Gravity)',
        captain: '모로비치 (위협의 세기), 관이판 (방송기원 이후)',
        status: '태양계 탈출 성공',
        achievement: 'DX3906 항성계에 죽은 선 생성'
      },
      {
        name: '블루스페이스호 (Blue Space)',
        captain: '추옌',
        status: '광속 우주선으로 개조 후 생존',
        achievement: '외계 문명 유적 발견, 생존'
      }
    ],
    deadLineEffect: {
      name: '죽은 선 (Dead Line / Safe Statement)',
      description: '곡률 추진 우주선이 남긴 광속 항적. 이 선 안의 공간은 광속이 낮아진다.',
      meaning: '"나는 차원 무기를 가지고 있지만 사용하지 않는다. 나는 위협이 아니다"',
      function: '암흑의 숲 법칙 하에서 안전 선언',
      example: 'DX3906 항성계 - 윈톈밍이 사는 별 주변에 죽은 선 생성하여 보호'
    },
    characters: ['토마스 웨이드', '정청신', '관이판', '모로비치'],
    tags: ['성공', '논쟁', '생존의 열쇠']
  }
]

export default function SurvivalProjects() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>인류 생존 프로젝트</h1>
        <p className={styles.subtitle}>
          삼체 3부에서 인류가 암흑의 숲 타격으로부터 생존하기 위해 시도한 세 가지 주요 프로젝트
        </p>
      </div>

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <div
            key={project.id}
            className={`${styles.projectCard} ${selectedProject?.id === project.id ? styles.selected : ''}`}
            onClick={() => setSelectedProject(project)}
          >
            <div className={styles.projectHeader}>
              <h2 className={styles.projectName}>{project.name}</h2>
              <div className={styles.projectNameEn}>{project.nameEn}</div>
            </div>
            <div className={styles.projectPeriod}>{project.period}</div>
            <p className={styles.projectPurpose}>{project.purpose}</p>

            {project.result && (
              <div className={`${styles.resultBadge} ${project.result.success === false ? styles.failed : project.result.success === true ? styles.success : styles.incomplete}`}>
                {project.result.success === false ? '❌ 실패' : project.result.success === true ? '✅ 성공' : '⚠️ 중단'}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <h2>{selectedProject.name}</h2>
            <button onClick={() => setSelectedProject(null)} className={styles.closeBtn}>✕</button>
          </div>

          <div className={styles.tabs}>
            <button
              className={activeTab === 'overview' ? styles.activeTab : ''}
              onClick={() => setActiveTab('overview')}
            >
              개요
            </button>
            <button
              className={activeTab === 'technical' ? styles.activeTab : ''}
              onClick={() => setActiveTab('technical')}
            >
              기술 상세
            </button>
            <button
              className={activeTab === 'result' ? styles.activeTab : ''}
              onClick={() => setActiveTab('result')}
            >
              결과
            </button>
            {selectedProject.controversy && (
              <button
                className={activeTab === 'controversy' ? styles.activeTab : ''}
                onClick={() => setActiveTab('controversy')}
              >
                논쟁
              </button>
            )}
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div>
                <h3>배경</h3>
                <p className={styles.background}>{selectedProject.background}</p>

                <h3>주요 특징</h3>
                <ul>
                  {selectedProject.keyFeatures.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>

                <h3>관련 인물</h3>
                <div className={styles.characterTags}>
                  {selectedProject.characters.map((char, idx) => (
                    <span key={idx} className={styles.tag}>{char}</span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'technical' && (
              <div>
                <h3>기술 상세</h3>
                {selectedProject.technicalDetails && (
                  <div className={styles.technicalGrid}>
                    {Object.entries(selectedProject.technicalDetails).map(([key, value]) => (
                      <div key={key} className={styles.technicalItem}>
                        <strong>{key}:</strong> {value}
                      </div>
                    ))}
                  </div>
                )}

                {selectedProject.developmentHistory && (
                  <>
                    <h3>개발 과정</h3>
                    <div className={styles.timeline}>
                      {selectedProject.developmentHistory.map((phase, idx) => (
                        <div key={idx} className={styles.timelineItem}>
                          <div className={styles.timelinePhase}>{phase.phase}</div>
                          <div className={styles.timelinePeriod}>{phase.period}</div>
                          <p>{phase.description}</p>
                          {phase.keyPeople && (
                            <div className={styles.keyPeople}>
                              <strong>주요 인물:</strong> {phase.keyPeople.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {selectedProject.deadLineEffect && (
                  <>
                    <h3>죽은 선 효과</h3>
                    <div className={styles.specialEffect}>
                      <h4>{selectedProject.deadLineEffect.name}</h4>
                      <p>{selectedProject.deadLineEffect.description}</p>
                      <p><strong>의미:</strong> {selectedProject.deadLineEffect.meaning}</p>
                      <p><strong>기능:</strong> {selectedProject.deadLineEffect.function}</p>
                      <p><strong>예시:</strong> {selectedProject.deadLineEffect.example}</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'result' && (
              <div>
                <h3>프로젝트 결과</h3>
                {selectedProject.result && (
                  <div className={styles.resultSection}>
                    <div className={`${styles.statusBadge} ${selectedProject.result.success === false ? styles.failed : selectedProject.result.success === true ? styles.success : styles.incomplete}`}>
                      {selectedProject.result.success === false ? '실패' : selectedProject.result.success === true ? '성공' : '중단'}
                    </div>

                    {selectedProject.result.reason && (
                      <p><strong>이유:</strong> {selectedProject.result.reason}</p>
                    )}

                    <p className={styles.resultDetails}>{selectedProject.result.details}</p>

                    {selectedProject.result.lesson && (
                      <div className={styles.lesson}>
                        <strong>교훈:</strong> {selectedProject.result.lesson}
                      </div>
                    )}

                    {selectedProject.result.survivors && (
                      <p><strong>생존자:</strong> {selectedProject.result.survivors}</p>
                    )}
                  </div>
                )}

                {selectedProject.historicalJudgment && (
                  <>
                    <h3>역사적 평가</h3>
                    <div className={styles.judgment}>
                      {Object.entries(selectedProject.historicalJudgment).map(([key, value]) => (
                        <p key={key}><strong>{key}:</strong> {value}</p>
                      ))}
                    </div>
                  </>
                )}

                {selectedProject.successfulShips && (
                  <>
                    <h3>성공한 우주선</h3>
                    <div className={styles.shipsList}>
                      {selectedProject.successfulShips.map((ship, idx) => (
                        <div key={idx} className={styles.shipCard}>
                          <h4>{ship.name}</h4>
                          <p><strong>함장:</strong> {ship.captain}</p>
                          <p><strong>상태:</strong> {ship.status}</p>
                          <p><strong>업적:</strong> {ship.achievement}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'controversy' && selectedProject.controversy && (
              <div>
                <h3>논쟁의 핵심</h3>

                {selectedProject.controversy.웨이드주장 && (
                  <div className={styles.argumentSection}>
                    <h4>토마스 웨이드의 주장</h4>
                    <ul>
                      {selectedProject.controversy.웨이드주장.map((arg, idx) => (
                        <li key={idx}>{arg}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProject.controversy.정청신주장 && (
                  <div className={styles.argumentSection}>
                    <h4>정청신의 주장</h4>
                    <ul>
                      {selectedProject.controversy.정청신주장.map((arg, idx) => (
                        <li key={idx}>{arg}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProject.controversy.pros && (
                  <>
                    <div className={styles.argumentSection}>
                      <h4>장점 (Pros)</h4>
                      <ul>
                        {selectedProject.controversy.pros.map((pro, idx) => (
                          <li key={idx}>{pro}</li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.argumentSection}>
                      <h4>단점 (Cons)</h4>
                      <ul>
                        {selectedProject.controversy.cons.map((con, idx) => (
                          <li key={idx}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {selectedProject.philosophicalDebate && (
                  <div className={styles.philosophicalSection}>
                    <h3>철학적 질문</h3>
                    <p className={styles.bigQuestion}>{selectedProject.philosophicalDebate.question}</p>
                    <div className={styles.positions}>
                      <div className={styles.position}>
                        <h4>웨이드의 입장</h4>
                        <p>{selectedProject.philosophicalDebate.웨이드입장}</p>
                      </div>
                      <div className={styles.position}>
                        <h4>정청신의 입장</h4>
                        <p>{selectedProject.philosophicalDebate.정청신입장}</p>
                      </div>
                    </div>
                    <p className={styles.readerQuestion}>{selectedProject.philosophicalDebate.독자질문}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
