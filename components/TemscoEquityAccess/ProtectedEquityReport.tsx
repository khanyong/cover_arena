import Head from 'next/head'
import Link from 'next/link'
import {useEffect, useRef, useState} from 'react'
import type {Session} from '@supabase/supabase-js'
import {supabase} from '../../shared/lib/supabase'

type PrivateReport = {mount: (element: HTMLElement, view: 'deck' | 'evidence') => () => void}
declare global { interface Window { TemscoPrivateReport?: PrivateReport } }

/** Public shell: report text, figures and models must never be imported here. */
export default function ProtectedEquityReport({view}: {view: 'deck' | 'evidence'}) {
  const host = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'login' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const [loginUrl, setLoginUrl] = useState('/auth?next=%2Ftemsco%2Fequity')

  useEffect(() => {
    let active = true
    let generation = 0
    let controller: AbortController | undefined
    let unmount: (() => void) | undefined
    let script: HTMLScriptElement | undefined
    let style: HTMLStyleElement | undefined
    let objectUrl: string | undefined
    let currentToken = ''
    const next = `${window.location.pathname}${window.location.search}${window.location.hash}`
    setLoginUrl(`/auth?next=${encodeURIComponent(next)}`)

    const clear = () => {
      controller?.abort()
      unmount?.()
      unmount = undefined
      script?.remove()
      style?.remove()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      script = undefined
      style = undefined
      objectUrl = undefined
      window.TemscoPrivateReport = undefined
      host.current?.replaceChildren()
    }

    const load = async (session: Session | null) => {
      if (!active) return
      const token = session?.access_token
      if (!token || session.user.is_anonymous) {
        currentToken = ''
        generation++
        clear()
        setState('login')
        return
      }
      if (token === currentToken) return
      currentToken = token
      const request = ++generation
      clear()
      setState('loading')
      controller = new AbortController()
      try {
        const response = await fetch('/api/temsco/equity-report', {
          headers: {Authorization: `Bearer ${token}`},
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!active || request !== generation) return
        if (response.status === 401) {
          clear()
          currentToken = ''
          setState('login')
          return
        }
        if (!response.ok) throw new Error('Report unavailable')
        const artifact = await response.json()
        if (!active || request !== generation) return
        if (artifact.schemaVersion !== 1 || typeof artifact.javascript !== 'string' || typeof artifact.css !== 'string') throw new Error('Invalid report')
        style = document.createElement('style')
        style.dataset.privateEquityReport = 'true'
        style.textContent = artifact.css
        document.head.appendChild(style)
        objectUrl = URL.createObjectURL(new Blob([artifact.javascript], {type: 'text/javascript'}))
        script = document.createElement('script')
        script.src = objectUrl
        script.onload = () => {
          if (!active || request !== generation || !host.current) return
          if (!window.TemscoPrivateReport?.mount) {
            clear(); currentToken = ''; setState('error'); return
          }
          try {
            unmount = window.TemscoPrivateReport.mount(host.current, view)
          } catch {
            clear(); currentToken = ''; setState('error'); return
          }
          setState('ready')
          if (objectUrl) URL.revokeObjectURL(objectUrl)
          objectUrl = undefined
          script?.remove()
          script = undefined
          window.TemscoPrivateReport = undefined
        }
        script.onerror = () => {
          if (!active || request !== generation) return
          clear(); currentToken = ''; setState('error')
        }
        document.body.appendChild(script)
      } catch {
        if (!active || request !== generation) return
        clear(); currentToken = ''; setState('error')
      }
    }

    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      // Avoid invoking Supabase auth methods inside its session lock.
      void load(session)
    })
    void supabase.auth.getSession().then(({data, error}) => {
      if (!active || generation !== 0) return
      if (error) { setState('login'); return }
      void load(data.session)
    })
    return () => {
      active = false
      generation++
      subscription.unsubscribe()
      clear()
    }
  }, [view, attempt])

  return <>
    <Head>
      <title>주당가치 산정과 임원 지분 배분 방안 | TEMSCO</title>
      <meta name="robots" content="noindex,nofollow,noarchive"/>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    </Head>
    {state !== 'ready' && <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#f3f6fb',padding:24}}>
      <section style={{maxWidth:520,background:'#fff',padding:40,borderRadius:16,color:'#102a46',textAlign:'center'}} aria-live="polite">
        <p style={{fontSize:13,fontWeight:700,letterSpacing:2,marginBottom:16}}>TEMSCO · PRIVATE REPORT</p>
        <h1 style={{fontSize:24,fontWeight:700,marginBottom:20}}>주당가치 산정과 임원 지분 배분 방안</h1>
        {state === 'loading' && <p>로그인 상태를 확인하고 있습니다.</p>}
        {state === 'login' && <><p>로그인한 사용자만 열람할 수 있습니다.</p><a href={loginUrl} style={{display:'inline-block',marginTop:24,padding:'12px 26px',background:'#2563eb',borderRadius:8,color:'#fff'}}>로그인 후 열람</a></>}
        {state === 'error' && <><p>보고서를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p><button onClick={()=>setAttempt(n=>n+1)} style={{marginTop:24,padding:12}}>다시 시도</button></>}
        <div style={{marginTop:24}}><Link href="/temsco">템스코 홈</Link></div>
      </section>
    </main>}
    <div ref={host}/>
  </>
}
