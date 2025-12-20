import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import '../styles/globals.css'
import '../styles/UnivExam.css'
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
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1분간 데이터는 신선한 것으로 간주 (재요청 안함)
        refetchOnWindowFocus: true, // 창 포커스 시 자동 갱신
      },
    },
  }))

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

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
} 
