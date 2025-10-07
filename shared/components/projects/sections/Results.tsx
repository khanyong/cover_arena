interface ResultsProps {
  results: string
}

export default function Results({ results }: ResultsProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">성과 및 결과</h2>
      <p className="text-gray-300 leading-relaxed">{results}</p>
    </section>
  )
}
