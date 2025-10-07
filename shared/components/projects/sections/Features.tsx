import type { Feature } from '../../../data/projects'

interface FeaturesProps {
  features: Feature[]
}

export default function Features({ features }: FeaturesProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">주요 기능</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
