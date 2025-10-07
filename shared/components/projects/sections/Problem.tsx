interface ProblemProps {
  problemStatement: string
}

export default function Problem({ problemStatement }: ProblemProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">문제 정의</h2>
      <p className="text-gray-300 leading-relaxed">{problemStatement}</p>
    </section>
  )
}
