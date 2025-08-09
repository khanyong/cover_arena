import '../styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Google Analytics 페이지 뷰 추적
const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    })
  }
}

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // 페이지 변경시 추적
    const handleRouteChange = (url) => {
      trackPageView(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return <Component {...pageProps} />
} 