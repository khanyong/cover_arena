import ProjectCard from '../../projects/ProjectCard'
import type { Project } from '../../../data/projects'
import styles from '../styles/LandingPage.module.css'

interface ProjectsSectionProps {
  projects: Project[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.projectsContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderInner}>
            <div className={styles.sectionSubtitle}>PORTFOLIO</div>
            <h2 className={styles.sectionTitle}>Featured Work</h2>
          </div>
          <p className={styles.sectionDescription}>
            Selected projects showcasing technical expertise and innovation
          </p>
        </div>

        {/* Project Grid */}
        <div className={styles.projectsGrid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
