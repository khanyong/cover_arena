import { useState, useEffect } from 'react'
import { auth, supabase } from '../lib/supabase'

export default function Header({ currentTopic }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const getCurrentUser = async () => {
      const currentUser = await auth.getCurrentUser()
      setUser(currentUser)
      
              // Admin 권한 확인
        if (currentUser) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', currentUser.id)
              .single()
            
            if (profile && profile.is_admin) {
              setIsAdmin(true)
            }
          } catch (error) {
            console.error('Admin 권한 확인 오류:', error)
          }
        }
    }
    getCurrentUser()

    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      
              // 인증 상태 변경 시 Admin 권한 재확인
        if (session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', session.user.id)
              .single()
            
            if (profile && profile.is_admin) {
              setIsAdmin(true)
            } else {
              setIsAdmin(false)
            }
          } catch (error) {
            console.error('Admin 권한 확인 오류:', error)
            setIsAdmin(false)
          }
        } else {
          setIsAdmin(false)
        }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await auth.signOut()
  }

  return (
    <header className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 backdrop-blur-md border-b border-neutral-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* 로고 */}
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🎵</div>
            <div>
              <h1 className="text-xl font-bold text-white">Cover Battle Arena 100</h1>
              <p className="text-sm text-gray-300">100개 실시간 커버송 competition</p>
            </div>
          </div>

          {/* 현재 주제 */}
          <div className="text-center">
            <p className="text-sm text-gray-300">현재 주제</p>
            <p className="text-white font-semibold">{currentTopic}</p>
          </div>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <a 
                href="/admin"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                👨‍💼 Admin
              </a>
            )}
            {user ? (
              <>
                <span className="text-white">안녕하세요, {user.user_metadata?.username || user.email}!</span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-lg hover:from-rose-700 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <a 
                  href="/auth"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  로그인
                </a>
                <a 
                  href="/auth?mode=signup"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  회원가입
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 