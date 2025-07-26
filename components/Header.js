import { useState, useEffect } from 'react'
import { auth, supabase } from '../lib/supabase'

export default function Header({ mainTitle, onTopicChange, user }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Admin 권한 확인
    if (user) {
      const checkAdminStatus = async () => {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
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
      }
      checkAdminStatus()
    } else {
      setIsAdmin(false)
    }
  }, [user])

  const handleLogout = async () => {
    await auth.signOut()
  }

  return (
    <header className="bg-gray-800 border-b border-gray-600 shadow-sm">
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

          {/* 현재 주제 - 심플한 디자인 */}
          <div className="text-center bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-blue-400 text-sm">●</span>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">현재 주제</p>
            </div>
            <p className="text-white font-bold text-xl tracking-wide mb-1">{mainTitle || '주제가 설정되지 않았습니다'}</p>
            <div className="inline-block px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">
              LIVE
            </div>
          </div>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <a 
                href="/admin"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
              >
                Admin
              </a>
            )}
            {user ? (
              <>
                <span className="text-white">안녕하세요, {user.user_metadata?.username || user.email}!</span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <a 
                  href="/auth"
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
                >
                  로그인
                </a>
                <a 
                  href="/auth?mode=signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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