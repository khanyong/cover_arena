import { useRouter } from 'next/router'
import TechCanvas from './TechCanvas'
import ProjectCard from './projects/ProjectCard'
import { PROJECTS } from '../data/projects'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Background Layer */}
      <TechCanvas />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-300 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">D</span>
              </div>
              <div>
                <div className="text-xl font-black text-gray-900">Developer</div>
                <div className="text-xs text-gray-500 font-semibold tracking-wide">PORTFOLIO</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#projects" className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors">Projects</a>
              <a href="#about" className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors">About</a>
              <button
                onClick={() => router.push('/auth')}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all hover:shadow-lg"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-6 min-h-screen flex items-center" style={{
        background: `linear-gradient(135deg,
          rgba(45, 45, 55, 0.98) 0%,
          rgba(60, 60, 75, 0.96) 25%,
          rgba(80, 80, 100, 0.94) 50%,
          rgba(60, 60, 75, 0.96) 75%,
          rgba(45, 45, 55, 0.98) 100%
        )`
      }}>
        {/* Radial gradient overlays */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.08) 0%, transparent 25%),
            radial-gradient(circle at 85% 85%, rgba(255, 255, 255, 0.06) 0%, transparent 30%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 40%)
          `
        }}></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{
          background: `
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255, 255, 255, 0.02) 40px, rgba(255, 255, 255, 0.02) 41px),
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255, 255, 255, 0.02) 40px, rgba(255, 255, 255, 0.02) 41px)
          `
        }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-xl mb-10 border border-gray-200">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm font-bold text-gray-800 tracking-wide">AVAILABLE FOR OPPORTUNITIES</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-10 leading-[1.1] tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
              <span className="text-gray-100">Full-Stack</span>
              <br />
              <span className="text-gray-100">Developer</span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-300 mb-16 leading-relaxed max-w-4xl mx-auto font-normal">
              Building <span className="font-bold text-indigo-300">scalable web applications</span> with modern technologies.
              <br className="hidden md:block" />
              Specialized in <span className="font-bold text-purple-300">real-time systems</span>,{' '}
              <span className="font-bold text-pink-300">data visualization</span>, and{' '}
              <span className="font-bold text-blue-300">user experience</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-5 mb-20">
              <a
                href="#projects"
                className="px-10 py-4 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-white transition-all hover:shadow-xl text-lg"
              >
                View Projects
              </a>
              <a
                href="mailto:contact@example.com"
                className="px-10 py-4 bg-transparent text-gray-100 font-bold rounded-xl hover:bg-white/10 transition-all border-2 border-gray-100 text-lg"
              >
                Get in Touch
              </a>
            </div>

            {/* Stats */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-gray-200 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Platform Content</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 mb-1">{PROJECTS.length}+</div>
                  <div className="text-sm font-semibold text-gray-600">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 mb-1">2024</div>
                  <div className="text-sm font-semibold text-gray-600">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 mb-1">{PROJECTS.filter(p => p.status === 'active').length}</div>
                  <div className="text-sm font-semibold text-gray-600">Live</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 mb-1">AI</div>
                  <div className="text-sm font-semibold text-gray-600">Powered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 relative z-10" style={{
        background: `linear-gradient(180deg,
          rgba(248, 250, 252, 1) 0%,
          rgba(241, 245, 249, 1) 50%,
          rgba(226, 232, 240, 0.8) 100%
        )`
      }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-8">
              <div className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">PORTFOLIO</div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">Featured Work</h2>
            </div>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">Selected projects showcasing technical expertise and innovation</p>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 text-white relative overflow-hidden z-10" style={{
        background: `linear-gradient(135deg,
          rgba(55, 65, 81, 0.98) 0%,
          rgba(75, 85, 99, 0.96) 50%,
          rgba(55, 65, 81, 0.98) 100%
        )`
      }}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Let's Build Something Great</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed font-normal">
            Passionate about creating elegant solutions to complex problems.
            <br className="hidden md:block" />
            Always open to discussing new projects, creative ideas, or opportunities.
          </p>
          <a
            href="mailto:contact@example.com"
            className="inline-block px-12 py-5 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all hover:shadow-xl text-lg"
          >
            Contact Me
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-white border-t border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">D</span>
              </div>
              <div>
                <div className="text-gray-900 font-black">Developer Portfolio</div>
                <div className="text-sm text-gray-500 font-semibold">© 2024 All rights reserved</div>
              </div>
            </div>
            <div className="flex gap-8">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 font-bold transition-colors uppercase text-sm tracking-wide">
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 font-bold transition-colors uppercase text-sm tracking-wide">
                LinkedIn
              </a>
              <a href="mailto:contact@example.com" className="text-gray-600 hover:text-gray-900 font-bold transition-colors uppercase text-sm tracking-wide">
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
