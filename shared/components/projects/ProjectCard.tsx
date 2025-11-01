import Link from 'next/link'
import type { Project } from '../../data/projects'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    development: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
          <p className="text-gray-400 text-sm">{project.subtitle}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>

      {project.executiveSummary && (
        <p className="text-gray-300 mb-4 leading-relaxed">{project.executiveSummary}</p>
      )}

      {project.metrics && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {project.metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-blue-400">{metric.value}</div>
              <div className="text-xs text-gray-500">{metric.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.slice(0, 4).map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium"
          >
            {tech}
          </span>
        ))}
        {project.tech.length > 4 && (
          <span className="px-3 py-1 text-gray-500 text-xs">+{project.tech.length - 4} more</span>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/projects/${project.slug}`}
          className="flex-1 text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
        >
          자세히 보기 →
        </Link>
        {project.path && (
          <Link
            href={project.path}
            target={project.path.startsWith('http') ? '_blank' : undefined}
            rel={project.path.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white font-medium"
          >
            ▶
          </Link>
        )}
      </div>
    </div>
  )
}
