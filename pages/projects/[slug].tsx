import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { PROJECTS, Project } from '../../shared/data/projects'
import styles from '../../shared/components/projects/styles/ProjectDetail.module.css'

interface ProjectDetailProps {
  project: Project
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div className={styles.loading}>Loading...</div>
  }

  const statusColors = {
    active: styles.statusActive,
    development: styles.statusDevelopment,
    archived: styles.statusArchived
  }

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.subtitle}>{project.subtitle}</p>
          </div>
          <div className={styles.meta}>
            <span className={`${styles.status} ${statusColors[project.status]}`}>
              {project.status}
            </span>
            <span className={styles.category}>{project.category}</span>
            <span className={styles.year}>{project.year}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Executive Summary */}
        {project.executiveSummary && (
          <section className={styles.section}>
            <div className={styles.executiveSummary}>
              {project.executiveSummary}
            </div>
          </section>
        )}

        {/* Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <section className={styles.section}>
            <div className={styles.metricsGrid}>
              {project.metrics.map((metric, index) => (
                <div key={index} className={styles.metricCard}>
                  <div className={styles.metricValue}>{metric.value}</div>
                  <div className={styles.metricLabel}>{metric.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Overview */}
        {project.overview && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Overview</h2>
            <p className={styles.text}>{project.overview}</p>
          </section>
        )}

        {/* Problem Statement */}
        {project.problemStatement && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Problem Statement</h2>
            <p className={styles.text}>{project.problemStatement}</p>
          </section>
        )}

        {/* Solution */}
        {project.solution && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Solution</h2>
            <p className={styles.text}>{project.solution}</p>
          </section>
        )}

        {/* Technical Highlights */}
        {project.technicalHighlights && project.technicalHighlights.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Technical Highlights</h2>
            <ul className={styles.list}>
              {project.technicalHighlights.map((highlight, index) => (
                <li key={index} className={styles.listItem}>{highlight}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Key Features</h2>
            <div className={styles.featuresGrid}>
              {project.features.map((feature, index) => (
                <div key={index} className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDesc}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tech Stack */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tech Stack</h2>
          <div className={styles.techStack}>
            {project.tech.map((tech, index) => (
              <span key={index} className={styles.techBadge}>
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Results */}
        {project.results && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Results</h2>
            <p className={styles.text}>{project.results}</p>
          </section>
        )}

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          {project.path ? (
            <a
              href={project.path}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaPrimary}
            >
              Visit Live Site →
            </a>
          ) : (
            <div className={styles.comingSoon}>
              Coming Soon
            </div>
          )}
          <Link href="/" className={styles.ctaSecondary}>
            Back to Projects
          </Link>
        </section>
      </main>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = PROJECTS.map((project) => ({
    params: { slug: project.slug }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project = PROJECTS.find((p) => p.slug === params?.slug)

  if (!project) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      project
    }
  }
}
