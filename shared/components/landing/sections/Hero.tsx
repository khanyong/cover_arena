import styles from '../styles/Hero.module.css'

interface HeroProps {
  projectCount: number
  activeProjectCount: number
}

export default function Hero({ projectCount, activeProjectCount }: HeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {/* Background Layers */}
      <div className={styles.background}>
        <div className={styles.gradient} />
        <div className={styles.radialGlow} aria-hidden="true" />
        <div className={styles.gridPattern} aria-hidden="true" />
      </div>

      {/* Content Container */}
      <div className={styles.container}>
        {/* Status Badge */}
        <div className={styles.badgeWrapper}>
          <span className={styles.badge}>
            <span className={styles.statusDot} />
            Available for collaborations
          </span>
        </div>

        {/* Title */}
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.titleBlock}>AI-powered vibe coding으로</span>
          <span className={styles.gradientText}>혁신적인 웹을 구축합니다</span>
        </h1>

        {/* Description */}
        <p className={styles.description}>
          빠른 프로토타이핑부터 프로덕션 배포까지, AI와 함께 실시간 데이터 중심의 웹 경험을 만듭니다.
          복잡한 문제를 사용자 중심으로 단순하게 풀어냅니다.
        </p>

        {/* CTA Buttons */}
        <div className={styles.ctaWrapper}>
          <a href="#projects" className={styles.ctaPrimary}>
            View Projects
          </a>
          <a href="mailto:bll-pro@bll-pro.com" className={styles.ctaSecondary}>
            Get in touch
          </a>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{projectCount}</div>
            <div className={styles.statLabel}>Featured projects</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>15K+</div>
            <div className={styles.statLabel}>Community votes</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>Realtime</div>
            <div className={styles.statLabel}>Systems focus</div>
          </div>
        </div>
      </div>
    </section>
  )
}
