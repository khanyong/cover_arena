import { useState } from 'react'
import Head from 'next/head'
import Timeline from '../../components/ThreeBody/Timeline'
import CharacterNetwork from '../../components/ThreeBody/CharacterNetwork'
import NetflixCharacterNetwork from '../../components/ThreeBody/NetflixCharacterNetwork'
import CharacterProfiles from '../../components/ThreeBody/CharacterProfiles'
import Factions from '../../components/ThreeBody/Factions'
import QuoteQuiz from '../../components/ThreeBody/QuoteQuiz'
import ImageGallery from '../../components/ThreeBody/ImageGallery'
import KeyIssues from '../../components/ThreeBody/KeyIssues'
import ScienceConcepts from '../../components/ThreeBody/ScienceConcepts'
import SpaceshipsAndTech from '../../components/ThreeBody/SpaceshipsAndTech'
import TopScenes from '../../components/ThreeBody/TopScenes'
import MathVideos from '../../components/ThreeBody/MathVideos'
import Glossary from '../../components/ThreeBody/Glossary'
import FleetRoster from '../../components/ThreeBody/FleetRoster'
import DoomsdayBattle from '../../components/ThreeBody/DoomsdayBattle'
import { CrossReferenceProvider } from '../../components/ThreeBody/CrossReferenceContext'
import styles from '../../components/ThreeBody/styles/ThreeBody.module.css'

export default function ThreeBodyPage() {
  const [activeTab, setActiveTab] = useState('timeline')
  const [novelExpanded, setNovelExpanded] = useState(true)
  const [netflixExpanded, setNetflixExpanded] = useState(false)
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Handle cross-reference navigation
  const handleNavigation = (tab, itemName = null) => {
    setActiveTab(tab)
    if (itemName) {
      setSearchTerm(itemName)
      // Reset search term after a short delay to allow component to filter
      setTimeout(() => setSearchTerm(''), 100)
    }
  }

  return (
    <CrossReferenceProvider onNavigate={handleNavigation}>
      <Head>
        <title>삼체 3부작 분석 - Three Body Universe</title>
        <meta name="description" content="류츠신의 삼체 3부작 인물 관계도, 시간흐름도, 세력 분석" />
      </Head>

      <div className={styles.pageLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>삼체 Universe</h2>
          </div>
          <nav className={styles.sidebarNav}>
            {/* 소설 삼체 - 상위 메뉴 */}
            <button
              className={`${styles.sidebarButton} ${styles.parentMenu}`}
              onClick={() => setNovelExpanded(!novelExpanded)}
            >
              <span className={styles.label}>소설 삼체</span>
              <span className={styles.expandIcon}>{novelExpanded ? '▼' : '▶'}</span>
            </button>

            {/* 소설 삼체 하위 메뉴 */}
            {novelExpanded && (
              <div className={styles.submenuContainer}>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'timeline' ? styles.active : ''}`}
                  onClick={() => setActiveTab('timeline')}
                >
                  <span className={styles.label}>시간흐름도</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'network' ? styles.active : ''}`}
                  onClick={() => setActiveTab('network')}
                >
                  <span className={styles.label}>인물 관계도</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'profiles' ? styles.active : ''}`}
                  onClick={() => setActiveTab('profiles')}
                >
                  <span className={styles.label}>인물 프로필</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'factions' ? styles.active : ''}`}
                  onClick={() => setActiveTab('factions')}
                >
                  <span className={styles.label}>세력 분석</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'quiz' ? styles.active : ''}`}
                  onClick={() => setActiveTab('quiz')}
                >
                  <span className={styles.label}>명대사 퀴즈</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'gallery' ? styles.active : ''}`}
                  onClick={() => setActiveTab('gallery')}
                >
                  <span className={styles.label}>이미지 갤러리</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'issues' ? styles.active : ''}`}
                  onClick={() => setActiveTab('issues')}
                >
                  <span className={styles.label}>주요 이슈 & 논쟁</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'concepts' ? styles.active : ''}`}
                  onClick={() => setActiveTab('concepts')}
                >
                  <span className={styles.label}>과학 개념 사전</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'ships' ? styles.active : ''}`}
                  onClick={() => setActiveTab('ships')}
                >
                  <span className={styles.label}>우주선 & 기술 도감</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'scenes' ? styles.active : ''}`}
                  onClick={() => setActiveTab('scenes')}
                >
                  <span className={styles.label}>명장면 TOP 10</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'math' ? styles.active : ''}`}
                  onClick={() => setActiveTab('math')}
                >
                  <span className={styles.label}>삼체의 수학적 이해</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'glossary' ? styles.active : ''}`}
                  onClick={() => setActiveTab('glossary')}
                >
                  <span className={styles.label}>용어 사전</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'fleet' ? styles.active : ''}`}
                  onClick={() => setActiveTab('fleet')}
                >
                  <span className={styles.label}>함대 명부</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'doomsday' ? styles.active : ''}`}
                  onClick={() => setActiveTab('doomsday')}
                >
                  <span className={styles.label}>말일 전투</span>
                </button>
              </div>
            )}

            {/* 넷플릭스 삼체 - 동일 레벨 메뉴 */}
            <button
              className={`${styles.sidebarButton} ${styles.parentMenu}`}
              onClick={() => setNetflixExpanded(!netflixExpanded)}
            >
              <span className={styles.label}>넷플릭스 삼체</span>
              <span className={styles.expandIcon}>{netflixExpanded ? '▼' : '▶'}</span>
            </button>

            {/* 넷플릭스 삼체 하위 메뉴 */}
            {netflixExpanded && (
              <div className={styles.submenuContainer}>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'netflix-episodes' ? styles.active : ''}`}
                  onClick={() => setActiveTab('netflix-episodes')}
                >
                  <span className={styles.label}>에피소드 가이드</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'netflix-characters' ? styles.active : ''}`}
                  onClick={() => setActiveTab('netflix-characters')}
                >
                  <span className={styles.label}>인물 관계도</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'netflix-differences' ? styles.active : ''}`}
                  onClick={() => setActiveTab('netflix-differences')}
                >
                  <span className={styles.label}>원작과의 차이점</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'netflix-analysis' ? styles.active : ''}`}
                  onClick={() => setActiveTab('netflix-analysis')}
                >
                  <span className={styles.label}>평론 및 분석</span>
                </button>
              </div>
            )}
          </nav>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            {activeTab === 'timeline' && <Timeline />}
            {activeTab === 'network' && <CharacterNetwork />}
            {activeTab === 'profiles' && <CharacterProfiles />}
            {activeTab === 'factions' && <Factions />}
            {activeTab === 'quiz' && <QuoteQuiz />}
            {activeTab === 'gallery' && <ImageGallery />}
            {activeTab === 'issues' && <KeyIssues />}
            {activeTab === 'concepts' && <ScienceConcepts />}
            {activeTab === 'ships' && <SpaceshipsAndTech />}
            {activeTab === 'scenes' && <TopScenes />}
            {activeTab === 'math' && <MathVideos />}
            {activeTab === 'glossary' && <Glossary />}
            {activeTab === 'fleet' && <FleetRoster />}
            {activeTab === 'doomsday' && <DoomsdayBattle />}

            {/* 넷플릭스 콘텐츠 */}
            {activeTab === 'netflix-episodes' && (
              <div className={styles.netflixContent}>
                <h1 className={styles.sectionTitle}>에피소드 가이드</h1>
                <div className={styles.episodeGrid}>
                  {[
                    {
                      ep: 1,
                      title: "Ye Wenjie",
                      desc: "천체물리학자 예원제의 과거와 외계 문명과의 첫 접촉",
                      runtime: "56분",
                      rating: "8.2/10",
                      plot: "1966년 문화대혁명 시기, 어린 예원제는 아버지가 홍위병에게 살해당하는 것을 목격한다. 현재, 옥스퍼드 대학의 과학자들이 알 수 없는 이유로 자살하기 시작하고, 나노과학자 Auggie는 자신의 실험 결과가 이상하게 변하는 현상을 발견한다.",
                      keyScenes: [
                        "문화대혁명 중 예원제 아버지의 처형",
                        "홍안 기지에서의 첫 외계 신호 수신",
                        "Auggie의 입자 가속기 실험 실패"
                      ],
                      quote: "\"문명이 스스로를 구원할 수 없다면, 외부의 힘이 필요하다.\" - 예원제"
                    },
                    {
                      ep: 2,
                      title: "Red Coast",
                      desc: "홍안 기지에서의 비밀 프로젝트와 인류의 운명",
                      runtime: "49분",
                      rating: "8.5/10",
                      plot: "1977년, 예원제는 홍안 기지에서 외계 문명 탐색 프로젝트에 참여한다. 그녀는 태양을 증폭기로 사용하여 외계로 신호를 보내는 방법을 발견하고, 삼체 문명으로부터 경고 메시지를 받는다. 현재, Jin과 Jack은 VR 게임 '삼체'에 빠져든다.",
                      keyScenes: [
                        "태양 증폭 신호 발견",
                        "삼체 문명의 첫 응답 수신",
                        "VR 게임 '삼체' 속 혼돈의 세계"
                      ],
                      quote: "\"답하지 마라. 답하지 마라. 답하지 마라!\" - 삼체 평화주의자의 경고"
                    },
                    {
                      ep: 3,
                      title: "Destroyer of Worlds",
                      desc: "옥스퍼드 5인의 등장과 나노섬유 사건",
                      runtime: "53분",
                      rating: "8.7/10",
                      plot: "옥스퍼드 5인의 과거가 드러난다. Auggie는 나노섬유 기술을 개발하지만, ETO의 위협을 받고 연구를 중단한다. Jin은 삼체 게임을 클리어하고 ETO의 존재를 알게 된다. Thomas Wade는 ETO를 추적하기 시작한다.",
                      keyScenes: [
                        "옥스퍼드 5인의 첫 만남 (과거)",
                        "Auggie의 나노섬유 실험 성공",
                        "ETO 본부 발견"
                      ],
                      quote: "\"과학은 죽었다. 우리는 이제 무엇을 믿어야 하는가?\" - Jack Rooney"
                    },
                    {
                      ep: 4,
                      title: "Our Lord",
                      desc: "ETO(지구삼체조직)의 정체와 목적 드러남",
                      runtime: "47분",
                      rating: "8.4/10",
                      plot: "ETO의 구조와 목적이 드러난다. Mike Evans가 이끄는 ETO는 인류 멸망을 환영하며 삼체 문명의 도래를 준비한다. 노년의 예원제가 Jin을 만나 진실을 고백한다. Wade는 나노섬유를 이용한 작전을 계획한다.",
                      keyScenes: [
                        "Mike Evans의 ETO 연설",
                        "예원제와 Jin의 대면",
                        "작전명 '심판의 날' 계획"
                      ],
                      quote: "\"주님께서 오신다. 우리는 구원받을 것이다.\" - ETO 신도"
                    },
                    {
                      ep: 5,
                      title: "Judgment Day",
                      desc: "작전명 심판의 날 - 나노섬유 절단 작전",
                      runtime: "51분",
                      rating: "9.1/10",
                      plot: "Wade의 계획대로 Auggie의 나노섬유로 ETO 본부가 있는 유조선을 절단하는 작전이 실행된다. 배는 67개 층으로 완벽하게 잘리고, ETO의 정보가 확보된다. 하지만 수백 명이 죽는 잔혹한 장면이 펼쳐진다.",
                      keyScenes: [
                        "나노섬유 설치 작전",
                        "유조선 67층 절단 (시리즈 최고 시각 효과)",
                        "ETO 데이터 확보"
                      ],
                      quote: "\"우리는 괴물과 싸우기 위해 괴물이 되었다.\" - Thomas Wade"
                    },
                    {
                      ep: 6,
                      title: "The Stars Our Destination",
                      desc: "소폰(Sophon)의 존재와 인류 과학의 봉쇄",
                      runtime: "54분",
                      rating: "8.9/10",
                      plot: "삼체 문명이 보낸 소폰(智子, 양성자 크기의 AI)이 지구에 도달했음이 밝혀진다. 소폰은 모든 입자 실험을 방해하여 인류의 과학 발전을 봉쇄한다. Will은 불치병 진단을 받고, Jin에게 특별한 부탁을 한다.",
                      keyScenes: [
                        "소폰의 정체 공개",
                        "입자 실험 결과 조작 메커니즘",
                        "Will의 병세 악화"
                      ],
                      quote: "\"그들은 우리에게 400년을 주었지만, 우리가 발전하는 것은 원치 않는다.\" - 과학자 회의"
                    },
                    {
                      ep: 7,
                      title: "Only Advance",
                      desc: "면벽 계획(Wallfacer Project) 시작",
                      runtime: "48분",
                      rating: "8.6/10",
                      plot: "소폰이 모든 것을 감시하지만 인간의 '생각'만은 읽을 수 없다는 점을 이용해 면벽 계획이 시작된다. 4명의 면벽자가 각자의 방식으로 삼체에 대항할 비밀 전략을 구상한다. Will은 냉동 인간 프로젝트에 지원한다.",
                      keyScenes: [
                        "UN 면벽 계획 발표",
                        "4명의 면벽자 선정",
                        "Will의 냉동 인간 실험 동의"
                      ],
                      quote: "\"당신의 계획은 무엇입니까? - 그것은 비밀입니다. 나조차 아직 모릅니다.\" - 면벽자"
                    },
                    {
                      ep: 8,
                      title: "Wallfacers",
                      desc: "4명의 면벽자 선정과 미래를 위한 전략",
                      runtime: "63분",
                      rating: "9.0/10",
                      plot: "시즌 피날레. Jin이 면벽자로 선정된다. 예원제가 처형당하고, Jin은 그녀로부터 특별한 동화책을 전해받는다. Will은 냉동되어 미래로 떠나고, 삼체 함대가 지구를 향해 출발한다. 인류의 400년 대장정이 시작된다.",
                      keyScenes: [
                        "Jin의 면벽자 선정",
                        "예원제의 처형",
                        "Will의 냉동 절차",
                        "동화책 속 숨겨진 메시지",
                        "삼체 함대 출발 (400년 후 도착 예정)"
                      ],
                      quote: "\"별들이 우리의 목적지다. 하지만 먼저 살아남아야 한다.\" - Jin Cheng"
                    }
                  ].map(ep => (
                    <div
                      key={ep.ep}
                      className={`${styles.episodeCard} ${selectedEpisode === ep.ep ? styles.episodeCardExpanded : ''}`}
                      onClick={() => setSelectedEpisode(selectedEpisode === ep.ep ? null : ep.ep)}
                    >
                      <div className={styles.episodeHeader}>
                        <div className={styles.episodeNumber}>EP {ep.ep}</div>
                        <div className={styles.episodeRating}>{ep.rating}</div>
                      </div>
                      <h3 className={styles.episodeTitle}>{ep.title}</h3>
                      <p className={styles.episodeDesc}>{ep.desc}</p>
                      <div className={styles.episodeRuntime}>{ep.runtime}</div>

                      {selectedEpisode === ep.ep && (
                        <div className={styles.episodeDetails}>
                          <div className={styles.detailSection}>
                            <h4>줄거리</h4>
                            <p>{ep.plot}</p>
                          </div>
                          <div className={styles.detailSection}>
                            <h4>주요 장면</h4>
                            <ul>
                              {ep.keyScenes.map((scene, idx) => (
                                <li key={idx}>{scene}</li>
                              ))}
                            </ul>
                          </div>
                          <div className={styles.detailSection}>
                            <h4>명대사</h4>
                            <blockquote>{ep.quote}</blockquote>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'netflix-characters' && <NetflixCharacterNetwork />}

            {activeTab === 'netflix-differences' && (
              <div className={styles.netflixContent}>
                <h1 className={styles.sectionTitle}>원작과의 차이점</h1>
                <div className={styles.diffTable}>
                  <div className={styles.diffRow}>
                    <div className={styles.diffLabel}>시간적 배경</div>
                    <div className={styles.diffNovel}>소설: 중국 현대 (2000년대)</div>
                    <div className={styles.diffNetflix}>Netflix: 영국/글로벌 (2024년)</div>
                  </div>
                  <div className={styles.diffRow}>
                    <div className={styles.diffLabel}>주인공</div>
                    <div className={styles.diffNovel}>왕먀오 (Wang Miao) - 나노과학자 1인</div>
                    <div className={styles.diffNetflix}>옥스퍼드 5인 - 집단 주인공 구조</div>
                  </div>
                  <div className={styles.diffRow}>
                    <div className={styles.diffLabel}>스토리 전개</div>
                    <div className={styles.diffNovel}>1부 완결형, 예원제 중심</div>
                    <div className={styles.diffNetflix}>1부+2부 혼합, 면벽 계획까지 확장</div>
                  </div>
                  <div className={styles.diffRow}>
                    <div className={styles.diffLabel}>문화적 배경</div>
                    <div className={styles.diffNovel}>문화대혁명, 중국 역사</div>
                    <div className={styles.diffNetflix}>보편적 과학계, 서구 시각</div>
                  </div>
                  <div className={styles.diffRow}>
                    <div className={styles.diffLabel}>액션 요소</div>
                    <div className={styles.diffNovel}>철학적, 과학적 사색 중심</div>
                    <div className={styles.diffNetflix}>나노섬유 절단 등 시각적 액션 강화</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'netflix-analysis' && (
              <div className={styles.netflixContent}>
                <h1 className={styles.sectionTitle}>평론 및 분석</h1>

                <div className={styles.analysisSection}>
                  <h2>각색의 성공과 한계</h2>
                  <div className={styles.prosCons}>
                    <div className={styles.pros}>
                      <h3>성공적인 부분</h3>
                      <ul>
                        <li>복잡한 과학 개념의 시각화 (소폰, 나노섬유)</li>
                        <li>집단 주인공 구조로 다양한 관점 제시</li>
                        <li>2부 "암흑의 숲" 내용까지 선행 배치</li>
                        <li>글로벌 관객을 위한 보편적 테마 강조</li>
                      </ul>
                    </div>
                    <div className={styles.cons}>
                      <h3>아쉬운 부분</h3>
                      <ul>
                        <li>문화대혁명 배경 축소로 예원제 동기 약화</li>
                        <li>왕먀오 캐릭터 분산으로 몰입도 분산</li>
                        <li>철학적 깊이보다 액션에 치중</li>
                        <li>원작 팬들의 "서구화" 비판</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={styles.analysisSection}>
                  <h2>글로벌 vs 로컬</h2>
                  <p className={styles.analysisText}>
                    넷플릭스 버전은 중국 특정 역사(문화대혁명)를 보편적 인류 문제로 확장하려 했으나,
                    이 과정에서 원작의 핵심 동기인 "특정 역사적 트라우마"가 희석됨.
                    반면 옥스퍼드 5인 구조는 다양한 윤리적 딜레마를 동시에 탐구할 수 있는 장점 제공.
                  </p>
                </div>

                <div className={styles.analysisSection}>
                  <h2>시즌 2 전망</h2>
                  <p className={styles.analysisText}>
                    면벽 계획을 시즌 1 마지막에 배치함으로써 시즌 2는 "암흑의 숲" 본격 전개 예상.
                    진청의 면벽자 역할과 뤄지(원작 주인공)의 등장 여부가 관건.
                    제작진은 4개 시즌으로 3부작 완결 계획 공개.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </CrossReferenceProvider>
  )
}
