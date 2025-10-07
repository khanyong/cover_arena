import styles from '../styles/Navigation.module.css'

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navContent}>
          <div className={styles.navBrand}>
            <div className={styles.navLogo}>
              <span className={styles.navLogoText}>D</span>
            </div>
            <div>
              <div className={styles.navTitle}>Developer</div>
              <div className={styles.navSubtitle}>PORTFOLIO</div>
            </div>
          </div>
          <div className={styles.navLinks}>
            <a href="#projects" className={styles.navLink}>Projects</a>
            <a href="#about" className={styles.navLink}>About</a>
            <a
              href="mailto:bll-pro@bll-pro.com"
              className={styles.navButton}
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
