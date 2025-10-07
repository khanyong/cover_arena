interface TechHighlightsProps {
  technicalHighlights: string[]
}

export default function TechHighlights({ technicalHighlights }: TechHighlightsProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">기술적 하이라이트</h2>
      <ul className="space-y-3">
        {technicalHighlights.map((highlight, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-400 mr-3 mt-1">▸</span>
            <span className="text-gray-300 leading-relaxed">{highlight}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
