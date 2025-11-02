import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { auth, supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function UnivExamAuth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (router.query.mode === 'signup') {
      setIsLogin(false);
    }
  }, [router.query.mode]);

  useEffect(() => {
    // 이미 로그인된 사용자는 univexam 페이지로 리다이렉트
    const checkUser = async () => {
      const user = await auth.getCurrentUser()
      if (user) {
        router.push('/univ-exam')
      }
    }
    checkUser()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        // 로그인
        const { error } = await auth.signIn(email, password)
        if (error) {
          setMessage(error.message)
          console.error('로그인 에러:', error)
        } else {
          router.push('/univ-exam')
        }
      } else {
        // 회원 가입
        const { data, error } = await auth.signUp(email, password, username)
        console.log('회원가입 응답:', { data, error });
        if (error) {
          setMessage(error.message)
          console.error('회원가입 에러:', error)
        } else {
          // 회원가입 성공 시 profiles 테이블에 row 생성/업데이트
          const user = data.user;
          if (user) {
            try {
              await supabase
                .from('profiles')
                .upsert({
                  id: user.id,         // PK
                  username: username,
                  email: email,
                  site_id: "univexam"  // univexam 사이트 구분
                });
            } catch (upsertError) {
              console.error('profiles upsert 에러:', upsertError);
            }
          }
          setMessage('회원 가입이 완료되었습니다! 이메일을 확인해주세요.')
          setIsLogin(true)
        }
      }
    } catch (error) {
      setMessage('오류가 발생했습니다.')
      console.error('회원가입 처리 중 예외:', error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
      <Head>
        <title>{isLogin ? '로그인' : '회원가입'} - InterviewCoach 수시면접 준비</title>
      </Head>

      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 w-96">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? '🔐 로그인' : '📝 회원가입'}
          </h1>
          <p className="text-gray-300">
            InterviewCoach 수시면접 준비 시스템에 {isLogin ? '로그인' : '가입'}하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-300 text-sm mb-2">사용자명</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="사용자명을 입력하세요"
                required={!isLogin}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-300 text-sm mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              minLength={6}
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('완료') ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
              loading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setMessage('')
              setEmail('')
              setPassword('')
              setUsername('')
            }}
            className="text-gray-300 hover:text-white transition-colors"
          >
            {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link href="/univ-exam" className="text-gray-300 hover:text-white">
            ← InterviewCoach 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
