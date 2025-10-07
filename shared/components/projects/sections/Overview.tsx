interface OverviewProps {
  overview: string
}

export default function Overview({ overview }: OverviewProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">개요</h2>
      <p className="text-gray-300 leading-relaxed">{overview}</p>
    </section>
  )
}
