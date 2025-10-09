import { useState } from 'react'
import CrossReferenceLink from './CrossReferenceLink'
import styles from './styles/FleetRoster.module.css'

const fleetData = [
  {
    id: 1,
    shipName: '자연선택호',
    shipNameEn: 'Natural Selection',
    class: '항성급 전함',
    length: '3.2km',
    crew: 2000,
    construction: '2180년대',
    status: '암흑 전투 생존',
    description: '아시아 함대 소속 주력 전함. 장베이하이가 탈취하여 도망주의를 실현했다.',
    officers: [
      {
        name: '둥팡옌쉬',
        nameEn: 'Dongfang Yanxu',
        rank: '함장',
        role: 'Captain',
        bio: '여성 최초 함대 사령관. 뛰어난 전술 능력과 리더십으로 존경받음.',
        fate: '말일 전투에서 전사'
      },
      {
        name: '레빈',
        nameEn: 'Levin',
        rank: '제1부함장',
        role: 'First Officer',
        bio: '함장을 보좌하는 부함장',
        fate: '말일 전투에서 전사'
      },
      {
        name: '이노우에 아키라',
        nameEn: 'Inoue Akira',
        rank: '제2부함장',
        role: 'Second Officer',
        bio: '함장을 보좌하는 부함장',
        fate: '말일 전투에서 전사'
      },
      {
        name: '장베이하이',
        nameEn: 'Zhang Beihai',
        rank: '집행함장',
        role: 'Executive Officer',
        bio: '우주군 정치위원. 도망주의를 실현하기 위해 자연선택호를 탈취했다.',
        fate: '암흑 전투에서 전사'
      }
    ],
    keyEvents: [
      '말일 전투에서 살아남음',
      '장베이하이의 탈취',
      '암흑 전투 참전',
      '인류의 씨앗으로 우주 깊은 곳으로 도주'
    ],
    armament: [
      '전자기 레일건',
      '핵미사일',
      '레이저 방어 시스템'
    ],
    propulsion: '핵융합 추진 엔진'
  },
  {
    id: 2,
    shipName: '블루스페이스호',
    shipNameEn: 'Blue Space',
    class: '항성급 전함',
    length: '3.5km',
    crew: 1847,
    construction: '2180년대',
    status: '광속 우주선으로 개조 후 생존',
    description: '아시아 함대 소속 주력 전함. 말일 전투와 암흑 전투를 생존하여 광속 우주선으로 개조되었다.',
    officers: [
      {
        name: '우웨이',
        nameEn: 'Wu Yue',
        rank: '함장',
        role: 'Captain',
        bio: '해군 대령 출신. 장베이하이의 도망주의를 계승하여 인류의 씨앗을 우주에 퍼뜨렸다.',
        fate: '우주 깊은 곳에서 생존'
      },
      {
        name: '아키 박사',
        nameEn: 'Dr. Aki',
        rank: '과학관',
        role: 'Science Officer',
        bio: '함대 과학 연구 담당',
        fate: '우주 깊은 곳에서 생존'
      }
    ],
    keyEvents: [
      '말일 전투에서 살아남음',
      '암흑 전투를 시작함 (먼저 공격)',
      '외계 유적 발견',
      '광속 우주선으로 개조',
      '삼체와 지구 좌표 브로드캐스트'
    ],
    armament: [
      '전자기 레일건',
      '핵미사일',
      '곡률 추진 엔진 (후기)'
    ],
    propulsion: '핵융합 → 곡률 추진'
  },
  {
    id: 3,
    shipName: '중력호',
    shipNameEn: 'Gravity',
    class: '광속 탐사선',
    length: '1.2km',
    crew: 500,
    construction: '2272년',
    status: '태양계 탈출 성공',
    description: '인류 최초의 광속 우주선. 정청신과 관이판이 개발했으며, 태양계 이차원화를 피해 탈출했다.',
    officers: [
      {
        name: '정청신',
        nameEn: 'Cheng Xin',
        rank: '함장',
        role: 'Captain',
        bio: '전 검잡이. 우주공학자. 인류애와 책임감이 넘치는 인물.',
        fate: '소우주에서 우주 재시작 참여'
      },
      {
        name: '관이판',
        nameEn: 'Guan Yifan',
        rank: '부함장 겸 조종사',
        role: 'Pilot & First Officer',
        bio: '광속 우주선 개발자. 우주 탐험가.',
        fate: '소우주에서 정청신과 함께'
      },
      {
        name: 'AA',
        nameEn: 'AA',
        rank: '생활 관리관',
        role: 'Life Support Officer',
        bio: '정청신의 친구이자 보호자',
        fate: '태양계 이차원화로 사망'
      }
    ],
    keyEvents: [
      '곡률 추진 엔진 탑재',
      '태양계 탈출',
      '죽은 선 생성',
      '윈톈밍 구출',
      '소우주 발견',
      '우주 재시작 프로젝트 참여'
    ],
    armament: [
      '무장 없음 (탐사선)'
    ],
    propulsion: '곡률 추진 엔진'
  },
  {
    id: 4,
    shipName: '엔터프라이즈호',
    shipNameEn: 'Enterprise',
    class: '항성급 전함',
    length: '3.0km',
    crew: 2000,
    construction: '2180년대',
    status: '말일 전투에서 전멸',
    description: '북미 함대 소속 주력 전함. 말일 전투에서 워터 드롭에 의해 파괴되었다.',
    officers: [
      {
        name: '조지 피츠로이',
        nameEn: 'George Fitzroy',
        rank: '함장',
        role: 'Captain',
        bio: '미국 장군 출신. 경험 많은 지휘관.',
        fate: '말일 전투에서 전사'
      }
    ],
    keyEvents: [
      '태양계 방어 함대 편성',
      '워터 드롭 발견 및 접근',
      '말일 전투에서 파괴됨'
    ],
    armament: [
      '전자기 레일건',
      '핵미사일'
    ],
    propulsion: '핵융합 추진'
  },
  {
    id: 5,
    shipName: '당탕호',
    shipNameEn: 'Tang',
    class: '항성급 전함',
    length: '3.1km',
    crew: 2000,
    construction: '2180년대',
    status: '말일 전투에서 전멸',
    description: '아시아 함대 소속 전함. 창웨이스 사령관이 탑승했던 함선.',
    officers: [
      {
        name: '창웨이스',
        nameEn: 'Chang Weisi',
        rank: '함대 사령관',
        role: 'Fleet Admiral',
        bio: '우주군 초대 사령관. 현실적 방어주의자. "전진! 전진!"을 외쳤다.',
        fate: '말일 전투에서 전사'
      }
    ],
    keyEvents: [
      '우주 함대 총지휘',
      '워터 드롭 발견 시 승리 확신',
      '말일 전투에서 파괴됨'
    ],
    armament: [
      '전자기 레일건',
      '핵미사일',
      '함대 지휘 시스템'
    ],
    propulsion: '핵융합 추진'
  },
  {
    id: 6,
    shipName: '양자호',
    shipNameEn: 'Quantum',
    class: '항성급 전함',
    length: '3.3km',
    crew: 2000,
    construction: '2180년대',
    status: '암흑 전투에서 파괴됨',
    description: '유럽 함대 소속 주력 전함. 말일 전투에서 살아남았으나 암흑 전투에서 다른 함선들에게 공격받아 파괴되었다.',
    officers: [
      {
        name: '마르티네스',
        nameEn: 'Martinez',
        rank: '함장',
        role: 'Captain',
        bio: '유럽 함대 출신 지휘관. 암흑 전투의 비극을 직면했다.',
        fate: '암흑 전투에서 전사'
      },
      {
        name: '이사벨라',
        nameEn: 'Isabella',
        rank: '과학관',
        role: 'Science Officer',
        bio: '함대 천체물리학자',
        fate: '암흑 전투에서 전사'
      }
    ],
    keyEvents: [
      '말일 전투에서 살아남음',
      '태양계로의 귀환 시도',
      '연료 부족으로 암흑 전투 참전',
      '블루스페이스호와 자연선택호에게 공격받아 파괴됨'
    ],
    armament: [
      '전자기 레일건',
      '핵미사일',
      '레이저 방어 시스템'
    ],
    propulsion: '핵융합 추진'
  },
  {
    id: 7,
    shipName: '당랑호',
    shipNameEn: 'Mantis',
    class: '소형 무인 우주선 (채굴선)',
    length: '50m',
    crew: 0,
    construction: '2200년대 초',
    status: '삼체 탐측기 포획 작전 투입',
    description: '소행성대에서 광물 표본을 채취하는 소형 무인 우주선. 기다란 로봇 팔을 장착하여 워터 드롭(삼체 탐측기) 포획 작전에 투입되었다.',
    officers: [
      {
        name: '원격 조종팀',
        nameEn: 'Remote Control Team',
        rank: '지상 관제',
        role: 'Ground Control',
        bio: '지구에서 원격으로 당랑호를 조종하는 관제팀',
        fate: '생존'
      }
    ],
    keyEvents: [
      '소행성대 광물 채굴 임무',
      '워터 드롭 포획 작전 투입',
      '로봇 팔로 탐측기 접근 시도',
      '워터 드롭의 완벽한 표면에 접촉 실패'
    ],
    armament: [
      '무장 없음 (채굴선)',
      '대형 로봇 팔 (채굴/포획용)'
    ],
    propulsion: '소형 추진 엔진'
  }
]

export default function FleetRoster() {
  const [selectedFleet, setSelectedFleet] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Get unique statuses
  const statuses = ['all', ...new Set(fleetData.map(f => f.status))]

  // Filter fleets
  const filteredFleets = fleetData.filter(fleet => {
    const matchesSearch = fleet.shipName.includes(searchTerm) ||
                         fleet.shipNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fleet.officers.some(officer =>
                           officer.name.includes(searchTerm) ||
                           officer.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesStatus = statusFilter === 'all' || fleet.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>함대 명부</h1>
        <p className={styles.subtitle}>
          삼체 전쟁에 참전한 주요 함선과 승무원 정보
        </p>
      </div>

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="함선명 또는 승무원 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.select}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? '전체 상태' : status}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.resultCount}>
          {filteredFleets.length}척의 함선
        </div>
      </div>

      {/* Fleet Cards */}
      <div className={styles.fleetGrid}>
        {filteredFleets.map((fleet, index) => (
          <div
            key={fleet.id}
            className={`${styles.fleetCard} ${selectedFleet === fleet.id ? styles.expanded : ''}`}
            onClick={() => setSelectedFleet(selectedFleet === fleet.id ? null : fleet.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.shipInfo}>
                <h2 className={styles.shipName}>{fleet.shipName}</h2>
                <div className={styles.shipNameEn}>{fleet.shipNameEn}</div>
                <div className={styles.shipClass}>{fleet.class}</div>
              </div>
              <div className={styles.shipIcon}>🚀</div>
            </div>

            <div className={styles.quickStats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>전장</span>
                <span className={styles.statValue}>{fleet.length}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>승무원</span>
                <span className={styles.statValue}>{fleet.crew}명</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>건조</span>
                <span className={styles.statValue}>{fleet.construction}</span>
              </div>
            </div>

            <div className={styles.statusBadge}>{fleet.status}</div>

            <p className={styles.description}>{fleet.description}</p>

            {selectedFleet === fleet.id && (
              <div className={styles.fleetDetails}>
                {/* Officers Section */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    👥 승무원 ({fleet.officers.length}명)
                  </h3>
                  <div className={styles.officersList}>
                    {fleet.officers.map((officer, idx) => (
                      <div key={idx} className={styles.officerCard}>
                        <div className={styles.officerHeader}>
                          <div className={styles.officerName}>
                            <CrossReferenceLink type="character" name={officer.name} />
                            <span className={styles.officerNameEn}>({officer.nameEn})</span>
                          </div>
                          <div className={styles.officerRank}>{officer.rank}</div>
                        </div>
                        <div className={styles.officerRole}>{officer.role}</div>
                        <p className={styles.officerBio}>{officer.bio}</p>
                        <div className={styles.officerFate}>
                          <strong>최종 운명:</strong> {officer.fate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Events */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>📅 주요 사건</h3>
                  <ul className={styles.eventsList}>
                    {fleet.keyEvents.map((event, idx) => (
                      <li key={idx}>{event}</li>
                    ))}
                  </ul>
                </div>

                {/* Specifications */}
                <div className={styles.specsSection}>
                  <div className={styles.specColumn}>
                    <h4>무장</h4>
                    <ul>
                      {fleet.armament.map((weapon, idx) => (
                        <li key={idx}>{weapon}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.specColumn}>
                    <h4>추진 시스템</h4>
                    <p>{fleet.propulsion}</p>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.expandHint}>
              {selectedFleet === fleet.id ? '클릭하여 접기 ▲' : '클릭하여 상세보기 ▼'}
            </div>
          </div>
        ))}
      </div>

      {filteredFleets.length === 0 && (
        <div className={styles.noResults}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
