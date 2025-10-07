import styles from '../styles/LandingPage.module.css'

export default function AboutSection() {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.aboutContent}>
        <h2 className={styles.aboutTitle}>Let's Build Something Great</h2>
        <p className={styles.aboutDescription}>
          Passionate about creating elegant solutions to complex problems.
          <br className="hidden md:block" />
          Always open to discussing new projects, creative ideas, or opportunities.
        </p>
        <a href="mailto:contact@example.com" className={styles.aboutCta}>
          Contact Me
        </a>
      </div>
    </section>
  )
}
