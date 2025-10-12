import { useState } from 'react'
import styles from './styles/StaircaseProject.module.css'

const projectOverview = {
  name: '계단 프로젝트',
  nameEn: 'Staircase Project / Ladder Program',
  nameChinese: '阶梯计划',
  purpose: '삼체 함대에 인류 정찰 탐사정을 보내 삼체 문명과 직접 소통하고 정보 수집',
  initiator: '정청신 (程心)',
  executor: 'PIA (행성방위정보국)',
  timeline: '위기기원 후반 ~ 억제기원 초기',
  status: '성공 - 윈톈밍이 삼체에 도착하여 인류에게 중요 정보 전달'
}

const technicalChallenges = [
  {
    challenge: '속도 제한',
    description: '당시 인류 기술로 광속의 1%에 도달하기 위해서는 극도로 작은 탑재 중량이 필요',
    solution: '핵폭탄과 나노 솔라 세일을 결합한 혁신적 추진 방식'
  },
  {
    challenge: '중량 제약',
    description: '광속 1% 달성을 위한 허용 중량은 약 2kg 이하',
    solution: '탑승자의 뇌만 냉동 보존하여 전송 (뇌 중량 약 1.5kg)'
  },
  {
    challenge: '추진 시스템',
    description: '기존 화학 로켓으로는 불가능한 초고속 가속',
    solution: '우주 경로에 미리 배치한 핵폭탄을 순차적으로 폭발시켜 나노 세일로 추진력 확보'
  },
  {
    challenge: '생존 불확실성',
    description: '삼체가 뇌를 회수하고 복원할 기술과 의지가 있는지 불명확',
    solution: '삼체의 호기심과 과학적 관심에 기대 (결과적으로 성공)'
  }
]

const projectPhases = [
  {
    phase: '1단계: 기획 및 승인',
    year: '위기기원 후반',
    description: '정청신이 PDC에 계단 프로젝트 제안. 삼체 함대와의 직접 소통 가능성에 주목하여 승인됨.',
    keyPeople: ['정청신', '토마스 웨이드'],
    outcome: 'PDC 승인 획득, PIA 주도로 프로젝트 시작'
  },
  {
    phase: '2단계: 기술 개발',
    year: '위기기원 후반',
    description: '나노 솔라 세일 개발, 핵폭탄 배치 계획 수립, 뇌 냉동 보존 기술 확립',
    keyPeople: ['토마스 웨이드', 'PIA 과학팀'],
    outcome: '광속 1% 달성 가능성 확인, 탑승자 선정 기준 마련'
  },
  {
    phase: '3단계: 탑승자 선정',
    year: '위기기원 후반 ~ 억제기원 초기',
    description: '말기 암 환자 중 자원자 모집. 윈톈밍이 정청신의 추천으로 최종 선정됨.',
    keyPeople: ['윈톈밍', '정청신'],
    outcome: '윈톈밍의 뇌 냉동 보존 및 탐사선 탑재'
  },
  {
    phase: '4단계: 발사 및 가속',
    year: '억제기원 초기 (2263년)',
    description: '우주 공간에 배치된 1000개 이상의 핵폭탄을 순차적으로 폭발시키며 나노 세일로 가속',
    keyPeople: ['PIA 발사팀'],
    outcome: '광속의 1% 달성, 삼체 함대를 향해 출발'
  },
  {
    phase: '5단계: 삼체 도착 및 회수',
    year: '억제기원 중기',
    description: '삼체 함대가 윈톈밍의 뇌를 회수하고 복원 기술로 육체 재생',
    keyPeople: ['윈톈밍', '삼체 과학자들'],
    outcome: '윈톈밍 복원 성공, 삼체 세계에서 생활 시작'
  },
  {
    phase: '6단계: 정보 전달',
    year: '억제기원 후기',
    description: '윈톈밍이 동화 세 편을 통해 암호화된 우주 생존 전략을 지구로 전송',
    keyPeople: ['윈톈밍', '정청신'],
    outcome: '곡률 추진, 블랙존, 차원 공격 회피법 등 핵심 정보 전달'
  }
]

const yunTianming = {
  name: '윈톈밍',
  chinese: '云天明',
  nameEn: 'Yun Tianming',
  background: '대학 동기였던 정청신에게 짝사랑. 말기 폐암 진단 후 안락사를 선택.',
  contribution: '정청신에게 별 하나(DX3906)를 선물한 후 계단 프로젝트 자원',
  inTrisolaris: '삼체 세계에서 육체 복원 후 동화 작가로 활동',
  fairytales: [
    {
      title: '왕국의 이야기 1 - 무혈 지배',
      hidden: '저차원 공격 개념과 차원 축소 무기의 위험성'
    },
    {
      title: '왕국의 이야기 2 - 심해의 왕자',
      hidden: '곡률 추진 우주선과 광속 항적(죽은 선)을 통한 안전 선언'
    },
    {
      title: '왕국의 이야기 3 - 공주의 장미',
      hidden: '블랙존(Black Zone) 생성을 통한 문명 은폐 방법'
    }
  ],
  fate: '정청신이 선물받은 별 DX3906 행성계에서 AA와 함께 평화롭게 생을 마감',
  significance: '인류 역사상 가장 낭만적이고 비극적인 사랑 이야기. 사랑하는 사람을 위해 자신을 희생하고, 결국 그녀를 구하는 데 핵심 역할을 함.'
}

const projectImpact = [
  {
    title: '즉각적 영향',
    description: 'PDC의 첫 번째 성공적인 삼체 접촉 프로젝트. 윈톈밍이 삼체에 무사히 도착하여 인류의 기술 수준을 과시.',
    result: '삼체가 인류를 단순한 곤충으로 보지 않게 됨'
  },
  {
    title: '정보 획득',
    description: '윈톈밍이 삼체 세계의 내부 정보와 우주 생존 전략을 동화로 암호화하여 전달',
    result: '곡률 추진, 블랙존, 차원 공격 회피법 등 인류 생존에 필수적인 지식 획득'
  },
  {
    title: '장기적 영향',
    description: '윈톈밍의 정보가 없었다면 인류는 태양계 붕괴 시 생존 전략을 전혀 모른 채 멸망했을 것',
    result: '중력호와 블루스페이스호의 광속 항적 전략이 윈톈밍의 힌트에서 비롯됨'
  },
  {
    title: '인간적 의미',
    description: '사랑하는 사람을 위한 희생과 헌신의 극치. 윈톈밍의 이야기는 차가운 우주 전쟁 속 유일한 따뜻한 감성',
    result: '정청신이 DX3906에서 윈톈밍과 재회하여 해피엔딩'
  }
]

const technicalInnovations = [
  {
    innovation: '나노 솔라 세일',
    description: '나노 기술로 제작된 초경량 초대형 돛',
    specs: '면적: 수 km², 두께: 수십 나노미터, 반사율: 99.99%',
    principle: '핵폭발의 광압과 복사압을 받아 추진력으로 전환'
  },
  {
    innovation: '순차 핵폭탄 가속',
    description: '우주 경로에 미리 배치한 핵폭탄을 순차적으로 폭발',
    specs: '핵폭탄 개수: 1000개 이상, 배치 간격: 수천 km',
    principle: '계단식으로 속도를 누적하여 최종적으로 광속 1% 달성 (3000km/s)'
  },
  {
    innovation: '뇌 냉동 보존',
    description: '뇌의 신경 구조를 완벽히 보존하는 극저온 냉동 기술',
    specs: '온도: 절대영도 근처, 보존 기간: 수십 년',
    principle: '삼체의 복원 기술을 믿고 뇌만 전송하여 중량 제약 극복'
  }
]

export default function StaircaseProject() {
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedPhase, setExpandedPhase] = useState(null)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>계단 프로젝트</h1>
        <div className={styles.subtitle}>
          <span className={styles.chinese}>{projectOverview.nameChinese}</span>
          <span className={styles.english}>{projectOverview.nameEn}</span>
        </div>
        <p className={styles.purpose}>{projectOverview.purpose}</p>
      </header>

      {/* Navigation Tabs */}
      <nav className={styles.tabNav}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          개요
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'technical' ? styles.active : ''}`}
          onClick={() => setActiveTab('technical')}
        >
          기술적 도전
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'phases' ? styles.active : ''}`}
          onClick={() => setActiveTab('phases')}
        >
          프로젝트 단계
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'yuntianming' ? styles.active : ''}`}
          onClick={() => setActiveTab('yuntianming')}
        >
          윈톈밍
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'impact' ? styles.active : ''}`}
          onClick={() => setActiveTab('impact')}
        >
          역사적 영향
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'innovations' ? styles.active : ''}`}
          onClick={() => setActiveTab('innovations')}
        >
          기술 혁신
        </button>
      </nav>

      {/* Content Sections */}
      <div className={styles.content}>
        {/* Overview */}
        {activeTab === 'overview' && (
          <section className={styles.section}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3>제안자</h3>
                <p>{projectOverview.initiator}</p>
              </div>
              <div className={styles.infoCard}>
                <h3>집행 기관</h3>
                <p>{projectOverview.executor}</p>
              </div>
              <div className={styles.infoCard}>
                <h3>시기</h3>
                <p>{projectOverview.timeline}</p>
              </div>
              <div className={styles.infoCard}>
                <h3>결과</h3>
                <p>{projectOverview.status}</p>
              </div>
            </div>

            <div className={styles.highlightBox}>
              <h3>프로젝트의 핵심</h3>
              <p>
                계단 프로젝트는 인류 역사상 가장 대담하고 낭만적인 우주 탐사 프로젝트입니다.
                광속의 1%라는 초고속을 달성하기 위해 인간의 뇌만을 우주로 보낸다는 파격적인 아이디어는
                당시 많은 논란을 불러일으켰지만, 결과적으로 인류 생존에 결정적인 역할을 했습니다.
              </p>
              <p>
                핵폭탄과 나노 솔라 세일을 결합한 "계단식 가속" 방식은 말 그대로 우주의 계단을
                하나씩 올라가듯 속도를 높이는 혁신적 기술이었습니다. 1000개 이상의 핵폭탄이
                순차적으로 폭발하며 탐사선을 가속시키는 장면은 인류 우주 탐사 역사상 가장
                장엄한 광경 중 하나로 기록되었습니다.
              </p>
            </div>
          </section>
        )}

        {/* Technical Challenges */}
        {activeTab === 'technical' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>극복해야 할 기술적 장벽</h2>
            <div className={styles.challengeGrid}>
              {technicalChallenges.map((item, idx) => (
                <div key={idx} className={styles.challengeCard}>
                  <h3 className={styles.challengeTitle}>{item.challenge}</h3>
                  <div className={styles.problemBox}>
                    <h4>문제</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className={styles.solutionBox}>
                    <h4>해결책</h4>
                    <p>{item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Project Phases */}
        {activeTab === 'phases' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>프로젝트 진행 단계</h2>
            <div className={styles.timeline}>
              {projectPhases.map((phase, idx) => (
                <div
                  key={idx}
                  className={`${styles.phaseCard} ${expandedPhase === idx ? styles.expanded : ''}`}
                  onClick={() => setExpandedPhase(expandedPhase === idx ? null : idx)}
                >
                  <div className={styles.phaseNumber}>Phase {idx + 1}</div>
                  <h3 className={styles.phaseTitle}>{phase.phase}</h3>
                  <div className={styles.phaseYear}>{phase.year}</div>
                  <p className={styles.phaseDescription}>{phase.description}</p>
                  {expandedPhase === idx && (
                    <div className={styles.phaseDetails}>
                      <div className={styles.phaseDetailSection}>
                        <h4>주요 인물</h4>
                        <div className={styles.peopleTags}>
                          {phase.keyPeople.map((person, i) => (
                            <span key={i} className={styles.personTag}>{person}</span>
                          ))}
                        </div>
                      </div>
                      <div className={styles.phaseDetailSection}>
                        <h4>결과</h4>
                        <p>{phase.outcome}</p>
                      </div>
                    </div>
                  )}
                  <div className={styles.expandHint}>
                    {expandedPhase === idx ? '클릭하여 접기 ▲' : '클릭하여 상세보기 ▼'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Yun Tianming */}
        {activeTab === 'yuntianming' && (
          <section className={styles.section}>
            <div className={styles.characterHeader}>
              <div className={styles.characterAvatar}>윈</div>
              <div>
                <h2 className={styles.characterName}>{yunTianming.name}</h2>
                <div className={styles.characterAltNames}>
                  <span>{yunTianming.chinese}</span>
                  <span>{yunTianming.nameEn}</span>
                </div>
              </div>
            </div>

            <div className={styles.characterBio}>
              <h3>배경</h3>
              <p>{yunTianming.background}</p>
              <h3>프로젝트 참여</h3>
              <p>{yunTianming.contribution}</p>
              <h3>삼체에서의 삶</h3>
              <p>{yunTianming.inTrisolaris}</p>
            </div>

            <div className={styles.fairytalesSection}>
              <h3 className={styles.fairytalesTitle}>세 가지 동화 - 암호화된 메시지</h3>
              <p className={styles.fairytalesIntro}>
                윈톈밍은 지자(智子)의 감시를 피하기 위해 동화 형식으로 핵심 정보를 전달했습니다.
                이 동화들은 겉으로는 단순한 우화처럼 보이지만, 그 안에는 인류의 생존을 위한
                우주 전략이 숨겨져 있었습니다.
              </p>
              <div className={styles.fairytalesList}>
                {yunTianming.fairytales.map((tale, idx) => (
                  <div key={idx} className={styles.fairytaleCard}>
                    <div className={styles.fairytaleNumber}>동화 {idx + 1}</div>
                    <h4 className={styles.fairytaleTitle}>{tale.title}</h4>
                    <div className={styles.hiddenMessage}>
                      <span className={styles.hiddenLabel}>숨겨진 의미:</span>
                      <p>{tale.hidden}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.characterFate}>
              <h3>최후</h3>
              <p>{yunTianming.fate}</p>
            </div>

            <div className={styles.significanceBox}>
              <h3>역사적 의의</h3>
              <p>{yunTianming.significance}</p>
            </div>
          </section>
        )}

        {/* Impact */}
        {activeTab === 'impact' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>계단 프로젝트의 역사적 영향</h2>
            <div className={styles.impactGrid}>
              {projectImpact.map((item, idx) => (
                <div key={idx} className={styles.impactCard}>
                  <h3 className={styles.impactTitle}>{item.title}</h3>
                  <p className={styles.impactDescription}>{item.description}</p>
                  <div className={styles.impactResult}>
                    <span className={styles.resultLabel}>결과:</span>
                    <p>{item.result}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.legacyBox}>
              <h3>프로젝트의 유산</h3>
              <p>
                계단 프로젝트는 단순한 우주 탐사를 넘어, 인류가 우주 문명으로서 첫 걸음을
                내딛는 상징적 사건이었습니다. 윈톈밍 한 사람의 희생이 수십억 인류의
                생존 가능성을 열었다는 점에서, 이 프로젝트는 개인의 사랑과 희생이
                문명의 운명을 바꿀 수 있음을 보여주었습니다.
              </p>
              <p>
                토마스 웨이드의 "별들을 향해 전진하라"는 정신과 정청신의 사랑과
                책임감, 그리고 윈톈밍의 헌신이 결합되어 탄생한 이 프로젝트는
                삼체 시리즈 전체에서 가장 인간적이고 감동적인 이야기로 남아있습니다.
              </p>
            </div>
          </section>
        )}

        {/* Technical Innovations */}
        {activeTab === 'innovations' && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>핵심 기술 혁신</h2>
            <div className={styles.innovationsList}>
              {technicalInnovations.map((item, idx) => (
                <div key={idx} className={styles.innovationCard}>
                  <div className={styles.innovationHeader}>
                    <span className={styles.innovationNumber}>{idx + 1}</span>
                    <h3 className={styles.innovationTitle}>{item.innovation}</h3>
                  </div>
                  <p className={styles.innovationDescription}>{item.description}</p>
                  <div className={styles.specsBox}>
                    <h4>제원</h4>
                    <p>{item.specs}</p>
                  </div>
                  <div className={styles.principleBox}>
                    <h4>원리</h4>
                    <p>{item.principle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.techSummary}>
              <h3>기술적 성과 요약</h3>
              <ul>
                <li><strong>최종 속도:</strong> 광속의 1% (약 3,000 km/s)</li>
                <li><strong>가속 시간:</strong> 수 개월</li>
                <li><strong>탑재 중량:</strong> 약 2kg (뇌 + 냉동 컨테이너)</li>
                <li><strong>도달 시간:</strong> 수십 년 (삼체 함대까지)</li>
                <li><strong>성공률:</strong> 불확실했으나 100% 성공</li>
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
