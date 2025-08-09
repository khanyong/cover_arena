import { supabase } from '../../lib/supabase'
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { page_path, referrer } = req.body
    
    // 익명 방문자 식별을 위한 핑거프린트 생성
    const clientIP = req.headers['x-forwarded-for'] || 
                    req.headers['x-real-ip'] || 
                    req.connection.remoteAddress || 
                    'unknown'
    const userAgent = req.headers['user-agent'] || 'unknown'
    
    // 간단한 핑거프린트 (IP + User-Agent 해시)
    const fingerprint = crypto
      .createHash('sha256')
      .update(clientIP + userAgent)
      .digest('hex')
      .substring(0, 16) // 짧게 자름

    // 방문 기록 저장
    const { error } = await supabase
      .from('coversong_page_visits')
      .insert({
        page_path: page_path || '/',
        visitor_fingerprint: fingerprint,
        referrer: referrer || null
      })

    if (error) {
      console.error('Visit tracking error:', error)
      return res.status(500).json({ error: 'Failed to track visit' })
    }

    res.status(200).json({ success: true, fingerprint })
  } catch (error) {
    console.error('Visit tracking error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
