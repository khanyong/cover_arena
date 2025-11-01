import { useEffect, useState } from 'react'
import Head from 'next/head'
import UnivExamMain from '../../components/UnivExam/UnivExamMain'

export default function UnivExamPage() {
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
        <title>UnivExam - 2026 대학입학 수시면접 준비 시스템</title>
        <meta
          name="description"
          content="2026년 대학입학 수시면접을 체계적으로 준비하세요. 생활기록부 분석, 대학별 맞춤 예상 질문 생성, 답변 작성 지원"
        />
        <meta name="keywords" content="수시면접, 대학입학, 생활기록부, 면접 준비, 예상 질문" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UnivExamMain />
    </>
  )
}
