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
          <span className={styles.titleBlock}>Building real-time, data-driven</span>
          <span className={styles.gradientText}>web experiences</span>
        </h1>

        {/* Description */}
        <p className={styles.description}>
          실시간 시스템, 데이터 시각화, 서버리스 아키텍처에 강한 풀스택 엔지니어.
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
