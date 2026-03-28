import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Timeline from '../../components/NunMaSae/Timeline'
import CharacterNetwork from '../../components/NunMaSae/CharacterNetwork'
import Species from '../../components/NunMaSae/Species'
import Proverbs from '../../components/NunMaSae/Proverbs'
import WorldMap from '../../components/NunMaSae/WorldMap'
import Glossary from '../../components/NunMaSae/Glossary'
import { CrossReferenceProvider } from '../../components/NunMaSae/CrossReferenceContext'
import styles from '../../components/NunMaSae/styles/NunMaSae.module.css'

export default function NunMaSaeDynamicPage() {
  const router = useRouter()
  // router.query.tab is an array in Catch-all routes. e.g., /nun-ma-sae/network -> ['network']
  // If undefined (/nun-ma-sae), standard fallback is 'timeline'
  const activeTab = (router.query.tab && router.query.tab[0]) || 'timeline'

  const [novelStoryExpanded, setNovelStoryExpanded] = useState(true)
  const [novelWorldExpanded, setNovelWorldExpanded] = useState(true)

  // CrossReference Context에서 호출하는 깊은 네비게이션 함수 (URL Search Parameter 등을 지원하기 위함)
  const handleNavigation = (tab, itemName = null) => {
    // 탭만 아니라, 검색어가 있다면 URL 쿼리(Search Parameters)로 넘기도록 유연성 확장
    const url = `/nun-ma-sae/${tab}${itemName ? `?search=${encodeURIComponent(itemName)}` : ''}`
    router.push(url, undefined, { shallow: true })
  }

  // 사이드바 전용 빠른 네비게이션
  const navigateTab = (tab) => {
    router.push(`/nun-ma-sae/${tab}`, undefined, { shallow: true })
  }

  return (
    <CrossReferenceProvider onNavigate={handleNavigation}>
      <Head>
        <title>눈물을 마시는 새 - Universe</title>
        <meta name="description" content="이영도 작가의 눈물을 마시는 새 인물 관계도, 시간흐름도, 종족 분석" />
      </Head>

      <div className={styles.pageLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle} style={{ background: 'linear-gradient(45deg, #ff9f43, #ff4757, #e15f41)', WebkitBackgroundClip: 'text' }}>눈마새 Universe</h2>
          </div>
          <nav className={styles.sidebarNav}>
            {/* 눈마새 인물과 사건 */}
            <button
              className={`${styles.sidebarButton} ${styles.parentMenu}`}
              onClick={() => setNovelStoryExpanded(!novelStoryExpanded)}
            >
              <span className={styles.label}>스토리 & 구출대</span>
              <span className={styles.expandIcon}>{novelStoryExpanded ? '▼' : '▶'}</span>
            </button>

            {novelStoryExpanded && (
              <div className={styles.submenuContainer}>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'timeline' ? styles.active : ''}`}
                  onClick={() => navigateTab('timeline')}
                >
                  <span className={styles.label}>발자취 타임라인</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'network' ? styles.active : ''}`}
                  onClick={() => navigateTab('network')}
                >
                  <span className={styles.label}>인물 도감</span>
                </button>
              </div>
            )}

            {/* 세계관 */}
            <button
              className={`${styles.sidebarButton} ${styles.parentMenu}`}
              onClick={() => setNovelWorldExpanded(!novelWorldExpanded)}
            >
              <span className={styles.label}>세계관 탐구</span>
              <span className={styles.expandIcon}>{novelWorldExpanded ? '▼' : '▶'}</span>
            </button>

            {novelWorldExpanded && (
              <div className={styles.submenuContainer}>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'species' ? styles.active : ''}`}
                  onClick={() => navigateTab('species')}
                >
                  <span className={styles.label}>4대 선민명족</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'map' ? styles.active : ''}`}
                  onClick={() => navigateTab('map')}
                >
                  <span className={styles.label}>장소 및 지리</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'proverbs' ? styles.active : ''}`}
                  onClick={() => navigateTab('proverbs')}
                >
                  <span className={styles.label}>명대사 & 속담</span>
                </button>
                <button
                  className={`${styles.sidebarButton} ${styles.submenu} ${activeTab === 'glossary' ? styles.active : ''}`}
                  onClick={() => navigateTab('glossary')}
                >
                  <span className={styles.label}>단어사전 (Index)</span>
                </button>
              </div>
            )}
          </nav>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            {activeTab === 'timeline' && <Timeline />}
            {activeTab === 'network' && <CharacterNetwork />}
            {activeTab === 'species' && <Species />}
            {activeTab === 'map' && <WorldMap />}
            {activeTab === 'proverbs' && <Proverbs />}
            {activeTab === 'glossary' && <Glossary />}
          </div>
        </main>
      </div>
    </CrossReferenceProvider>
  )
}
