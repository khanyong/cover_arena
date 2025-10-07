import styles from '../styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <span className={styles.footerLogoText}>D</span>
            </div>
            <div>
              <div className={styles.footerTitle}>Developer Portfolio</div>
              <div className={styles.footerCopyright}>© 2024 All rights reserved</div>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              LinkedIn
            </a>
            <a href="mailto:bll-pro@bll-pro.com" className={styles.footerLink}>
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
