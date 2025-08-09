export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 사이트 정보 */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-3">Cover Arena</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              최고의 커버 영상을 발굴하고 평가하는<br />
              공정하고 투명한 커버 경연 플랫폼
            </p>
          </div>
          
          {/* 빠른 링크 */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-3">서비스</h3>
            <ul className="space-y-2">
              <li>
                <a href="#ranking" className="text-gray-400 hover:text-white transition-colors text-sm">
                  실시간 랭킹
                </a>
              </li>
              <li>
                <a href="#competition" className="text-gray-400 hover:text-white transition-colors text-sm">
                  경연 아레나
                </a>
              </li>
              <li>
                <a href="#videos" className="text-gray-400 hover:text-white transition-colors text-sm">
                  영상 목록
                </a>
              </li>
            </ul>
          </div>
          
          {/* 연락처 정보 */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
            <p className="text-gray-400 text-sm mb-2">
              문의사항이 있으신가요?
            </p>
            <a 
              href="mailto:bll-pro@bll-pro.com" 
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
            >
              bll-pro@bll-pro.com
            </a>
          </div>
        </div>
        
        {/* 구분선 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-xs text-center md:text-left">
              © {currentYear} Cover Arena. All Rights Reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">
                이용약관
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">
                개인정보처리방침
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">
                운영정책
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}