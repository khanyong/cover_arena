import { useState } from 'react'
import CrossReferenceLink from './CrossReferenceLink'
import styles from './styles/DoomsdayBattle.module.css'

// 워터 드롭 공격 순서
const attackSequence = [
  {
    phase: '탐색 및 접근',
    order: 0,
    ships: [
      {
        name: '당랑호',
        nameEn: 'Mantis',
        type: '소형 무인 채굴선',
        fate: '포획 시도 실패, 워터 드롭의 완벽한 표면 확인',
        details: '로봇 팔로 워터 드롭 접촉 시도. 절대 매끄러운 표면에 접촉 불가능'
      }
    ]
  },
  {
    phase: '1열 함대 - 첫 번째 공격',
    order: 1,
    ships: [
      { name: '피니트호', nameEn: 'Finite', type: '항성급 전함', fate: '전멸', details: '1열 선두함, 워터 드롭의 첫 번째 타깃' },
      { name: '디스턴스호', nameEn: 'Distance', type: '항성급 전함', fate: '전멸', details: '1열 함대' },
      { name: '포그혼호', nameEn: 'Foghorn', type: '항성급 전함', fate: '전멸', details: '1열 함대' },
      { name: '남극호', nameEn: 'Antarctic', type: '항성급 전함', fate: '전멸', details: '1열 함대' },
      { name: '극한호', nameEn: 'Ultimate', type: '항성급 전함', fate: '전멸', details: '1열 함대' }
    ]
  },
  {
    phase: '2열 함대 - 대규모 학살',
    order: 2,
    ships: [
      { name: '갠지스호', nameEn: 'Ganges', type: '항성급 전함', fate: '전멸', details: '2열 함대' },
      { name: '콜롬비아호', nameEn: 'Columbia', type: '항성급 전함', fate: '전멸', details: '2열 함대' },
      { name: '정의호', nameEn: 'Justice', type: '항성급 전함', fate: '전멸', details: '2열 함대' },
      { name: '마사다호', nameEn: 'Masada', type: '항성급 전함', fate: '전멸', details: '2열 함대' },
      { name: '양성자호', nameEn: 'Proton', type: '항성급 전함', fate: '전멸', details: '2열 함대' },
      { name: '염제호', nameEn: 'Yan Emperor', type: '항성급 전함', fate: '전멸', details: '2열 함대' },
      { name: '대서양호', nameEn: 'Atlantic', type: '항성급 전함', fate: '전멸', details: '2열 함대' },
      { name: '시리우스호', nameEn: 'Sirius', type: '항성급 전함', fate: '전멸', details: '2열 함대' },
      { name: '추수감사절호', nameEn: 'Thanksgiving', type: '항성급 전함', fate: '전멸', details: '2열 함대' },
      { name: '전진호', nameEn: 'Advance', type: '항성급 전함', fate: '전멸', details: '2열 함대' },
      { name: '한호', nameEn: 'Han', type: '항성급 전함', fate: '전멸', details: '2열 함대' },
      { name: '폭풍우호', nameEn: 'Storm', type: '항성급 전함', fate: '전멸', details: '2열 함대' },
      { name: '메이지호', nameEn: 'Meiji', type: '항성급 전함', fate: '전멸', details: '2열 함대' }
    ]
  },
  {
    phase: '3열 함대',
    order: 3,
    ships: [
      { name: '뉴턴호', nameEn: 'Newton', type: '항성급 전함', fate: '전멸', details: '3열 함대' },
      { name: '계몽호', nameEn: 'Enlightenment', type: '항성급 전함', fate: '전멸', details: '3열 함대' },
      { name: '백악기호', nameEn: 'Cretaceous', type: '항성급 전함', fate: '전멸', details: '3열 함대' }
    ]
  },
  {
    phase: '통신 및 관측 함대',
    order: 4,
    ships: [
      {
        name: '북방호',
        nameEn: 'Northern',
        type: '항성급 전함',
        fate: '전멸',
        officer: '자오신 소위 (목표식별 장교)',
        details: '워터 드롭과의 교신 시도. 자오신 소위는 6만 생환자 중 한 명으로 생존'
      },
      {
        name: '만년공붕호',
        nameEn: 'Eternal',
        type: '항성급 전함',
        fate: '전멸',
        officer: '리웨이 대위 (전자기 무기 시스템 제어 장교)',
        details: '워터 드롭 파악을 위한 교신. 리웨이 대위는 6만 생환자 중 한 명으로 생존'
      }
    ]
  },
  {
    phase: '저지 시도 함대',
    order: 5,
    ships: [
      { name: '넬슨호', nameEn: 'Nelson', type: '항성급 전함', fate: '전멸', details: '최초로 워터 드롭 저지 시도 - 레이저 발사. 무효과' },
      { name: '그린호', nameEn: 'Green', type: '항성급 전함', fate: '전멸', details: '전자기포 발사 시도. 워터 드롭에 아무 피해 없음' }
    ]
  },
  {
    phase: '혼란 속 상호 충돌',
    order: 6,
    ships: [
      { name: '히말라야호', nameEn: 'Himalaya', type: '항성급 전함', fate: '토르호와 충돌하여 파괴', details: '긴급 회피 중 토르호와 충돌' },
      { name: '토르호', nameEn: 'Thor', type: '항성급 전함', fate: '히말라야호와 충돌하여 파괴', details: '긴급 회피 중 히말라야호와 충돌' },
      { name: '메신저호', nameEn: 'Messenger', type: '항성급 전함', fate: '창세기호와 충돌하여 파괴', details: '혼란 속 창세기호와 충돌' },
      { name: '창세기호', nameEn: 'Genesis', type: '항성급 전함', fate: '메신저호와 충돌하여 파괴', details: '혼란 속 메신저호와 충돌' }
    ]
  },
  {
    phase: '탈출 시도 - 전진4 가속',
    order: 7,
    ships: [
      {
        name: '아인슈타인호',
        nameEn: 'Einstein',
        type: '항성급 전함',
        fate: '승무원 전원 사망',
        details: '심해 상태 진입 없이 전진4 가속 시행. 고중력으로 승무원 전원 압사'
      },
      {
        name: '하호',
        nameEn: 'Xia',
        type: '항성급 전함',
        fate: '승무원 전원 사망',
        details: '심해 상태 진입 없이 전진4 가속 시행. 고중력으로 승무원 전원 압사'
      }
    ]
  },
  {
    phase: '생존 함대 - 전진4 성공',
    order: 8,
    ships: [
      {
        name: '양자호',
        nameEn: 'Quantum',
        type: '항성급 전함',
        fate: '생존 (딩 박사 건의로 심해상태 유지)',
        details: '딩 박사의 건의로 심해 상태를 유지한 채 전진4 돌입 성공. 암흑 전투에서 파괴됨'
      },
      {
        name: '청동시대호',
        nameEn: 'Bronze Age',
        type: '항성급 전함',
        fate: '생존 (딩 박사 건의로 심해상태 유지)',
        details: '딩 박사의 건의로 심해 상태를 유지한 채 전진4 돌입 성공. 최종 생존'
      }
    ]
  },
  {
    phase: '최후의 함선',
    order: 9,
    ships: [
      {
        name: '방주호',
        nameEn: 'Ark',
        type: '항성급 전함',
        fate: '전멸',
        details: '워터 드롭이 공격한 마지막 함선. 2시간에 걸친 학살의 종결'
      }
    ]
  }
]

// 워터 드롭 스펙
const waterdropSpec = {
  name: '워터 드롭 (물방울 탐측기)',
  nameEn: 'Waterdrop / Droplet',
  type: '삼체 무인 탐측기',
  material: '강입자 물질 (Strong Interaction Material)',
  properties: [
    '절대 매끄러운 표면 (원자 수준)',
    '완벽한 강체 - 어떤 무기로도 파괴 불가',
    '거울처럼 반사하는 표면',
    '온도: 절대영도에 가까움'
  ],
  armament: '반물질 무기',
  speed: '초속 170km (제3우주속도의 3배 이상)',
  tactics: '초고속으로 함선을 관통하며 파괴',
  result: '2000척 함대를 2시간 만에 전멸'
}

// 전투 통계
const battleStats = {
  totalFleet: 2000,
  destroyed: 1998,
  survived: 2,
  casualties: 1940000,
  survivors: 60000,
  duration: '약 2시간',
  waterdropCount: 1,
  humanWeaponEffectiveness: '0%'
}

export default function DoomsdayBattle() {
  const [selectedPhase, setSelectedPhase] = useState(null)
  const [showStats, setShowStats] = useState(true)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>말일 전투 - 인류 함대의 전멸</h1>
        <p className={styles.subtitle}>
          2205년, 워터 드롭 1기가 2000척 함대를 2시간 만에 전멸시킨 비극
        </p>
      </div>

      {/* 전투 통계 */}
      {showStats && (
        <div className={styles.statsPanel}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>총 함대</div>
              <div className={styles.statValue}>{battleStats.totalFleet}척</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>파괴됨</div>
              <div className={styles.statValue}>{battleStats.destroyed}척</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>생존</div>
              <div className={styles.statValue}>{battleStats.survived}척</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>사망자</div>
              <div className={styles.statValue}>{battleStats.casualties.toLocaleString()}명</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>생환자</div>
              <div className={styles.statValue}>{battleStats.survivors.toLocaleString()}명</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>전투 시간</div>
              <div className={styles.statValue}>{battleStats.duration}</div>
            </div>
          </div>
        </div>
      )}

      {/* 워터 드롭 정보 */}
      <div className={styles.waterdropInfo}>
        <h2 className={styles.sectionTitle}>💧 워터 드롭 (물방울 탐측기)</h2>
        <div className={styles.specGrid}>
          <div className={styles.specItem}>
            <strong>재질:</strong> {waterdropSpec.material}
          </div>
          <div className={styles.specItem}>
            <strong>무장:</strong> {waterdropSpec.armament}
          </div>
          <div className={styles.specItem}>
            <strong>속도:</strong> {waterdropSpec.speed}
          </div>
          <div className={styles.specItem}>
            <strong>전술:</strong> {waterdropSpec.tactics}
          </div>
        </div>
        <div className={styles.properties}>
          <h3>특성:</h3>
          <ul>
            {waterdropSpec.properties.map((prop, idx) => (
              <li key={idx}>{prop}</li>
            ))}
          </ul>
        </div>
        <div className={styles.effectiveness}>
          인류 무기 효과: <span className={styles.zero}>{battleStats.humanWeaponEffectiveness}</span>
        </div>
      </div>

      {/* 공격 순서 */}
      <div className={styles.attackSequence}>
        <h2 className={styles.sectionTitle}>⚔️ 공격 순서</h2>
        <div className={styles.timeline}>
          {attackSequence.map((phase, index) => (
            <div
              key={index}
              className={`${styles.phaseCard} ${selectedPhase === index ? styles.expanded : ''}`}
              onClick={() => setSelectedPhase(selectedPhase === index ? null : index)}
            >
              <div className={styles.phaseHeader}>
                <div className={styles.phaseNumber}>{phase.order === 0 ? '준비' : `제${phase.order}단계`}</div>
                <h3 className={styles.phaseName}>{phase.phase}</h3>
                <div className={styles.phaseCount}>{phase.ships.length}척</div>
              </div>

              {selectedPhase === index && (
                <div className={styles.shipsList}>
                  {phase.ships.map((ship, idx) => (
                    <div key={idx} className={styles.shipCard}>
                      <div className={styles.shipHeader}>
                        <div className={styles.shipName}>
                          {ship.name}
                          <span className={styles.shipNameEn}>({ship.nameEn})</span>
                        </div>
                        <div className={styles.shipType}>{ship.type}</div>
                      </div>
                      {ship.officer && (
                        <div className={styles.officer}>
                          👤 {ship.officer}
                        </div>
                      )}
                      <div className={styles.shipDetails}>{ship.details}</div>
                      <div className={styles.shipFate}>
                        <strong>운명:</strong> {ship.fate}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.expandHint}>
                {selectedPhase === index ? '클릭하여 접기 ▲' : '클릭하여 함선 목록 보기 ▼'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 생환자 정보 */}
      <div className={styles.survivors}>
        <h2 className={styles.sectionTitle}>🎖️ 주요 생환자</h2>
        <div className={styles.survivorCards}>
          <div className={styles.survivorCard}>
            <div className={styles.survivorName}>자오신 소위</div>
            <div className={styles.survivorRole}>북방호 목표식별 장교</div>
            <div className={styles.survivorFate}>6만 생환자 중 1명</div>
          </div>
          <div className={styles.survivorCard}>
            <div className={styles.survivorName}>리웨이 대위</div>
            <div className={styles.survivorRole}>만년공붕호 전자기 무기 시스템 제어 장교</div>
            <div className={styles.survivorFate}>6만 생환자 중 1명</div>
          </div>
        </div>
      </div>

      {/* 전투의 교훈 */}
      <div className={styles.lessons}>
        <h2 className={styles.sectionTitle}>📖 말일 전투의 교훈</h2>
        <div className={styles.lessonsList}>
          <div className={styles.lesson}>
            <strong>기술 격차의 절대성:</strong> 200년의 준비는 삼체의 기술 앞에 무의미했다. 워터 드롭은 단 1기로 인류의 모든 우주 전력을 무력화했다.
          </div>
          <div className={styles.lesson}>
            <strong>오만함의 대가:</strong> 인류는 2000척 함대를 보유하며 승리를 확신했다. 하지만 그것은 근거 없는 낙관이었다.
          </div>
          <div className={styles.lesson}>
            <strong>도망주의의 정당성:</strong> 장베이하이가 탈취한 자연선택호는 살아남았다. 도망은 수치가 아니라 생존의 전략이었다.
          </div>
          <div className={styles.lesson}>
            <strong>강입자 물질의 공포:</strong> 완벽한 강체는 어떤 인류의 무기로도 파괴할 수 없었다. 물리 법칙의 차원이 달랐다.
          </div>
        </div>
      </div>
    </div>
  )
}
