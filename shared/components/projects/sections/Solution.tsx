interface SolutionProps {
  solution: string
}

export default function Solution({ solution }: SolutionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">솔루션</h2>
      <p className="text-gray-300 leading-relaxed">{solution}</p>
    </section>
  )
}
