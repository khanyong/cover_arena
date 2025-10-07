import { useEffect, useState } from 'react'
import Head from 'next/head'
import LandingPage from '../shared/components/landing/LandingPage'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>Developer Portfolio | Full-Stack Web Applications</title>
        <meta name="description" content="Professional portfolio showcasing full-stack web applications with real-time systems, data visualization, and machine learning" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LandingPage />
    </>
  )
}
