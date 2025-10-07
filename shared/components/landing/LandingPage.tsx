import Navigation from './sections/Navigation'
import Hero from './sections/Hero'
import ProjectsSection from './sections/ProjectsSection'
import AboutSection from './sections/AboutSection'
import Footer from './sections/Footer'
import { PROJECTS } from '../../data/projects'

export default function LandingPage() {
  const activeProjects = PROJECTS.filter(p => p.status === 'active')

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero projectCount={PROJECTS.length} activeProjectCount={activeProjects.length} />
      <ProjectsSection projects={PROJECTS} />
      <AboutSection />
      <Footer />
    </div>
  )
}
