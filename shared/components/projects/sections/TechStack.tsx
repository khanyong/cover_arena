interface TechStackProps {
  tech: string[]
}

export default function TechStack({ tech }: TechStackProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">기술 스택</h2>
      <div className="flex flex-wrap gap-2">
        {tech.map((technology, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20"
          >
            {technology}
          </span>
        ))}
      </div>
    </section>
  )
}
