import { createClient } from '@supabase/supabase-js'

// Supabase client 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Supabase Storage에서 이미지 URL 가져오기
 * @param {string} bucket - Storage bucket 이름 (예: 'three-body-images')
 * @param {string} path - 이미지 경로 (예: 'characters/luo-ji.jpg')
 * @returns {string|null} - 공개 URL 또는 null
 */
export function getImageUrl(bucket, path) {
  if (!supabase) {
    console.warn('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data?.publicUrl || null
  } catch (error) {
    console.error('Error getting image URL:', error)
    return null
  }
}

/**
 * 캐릭터 이미지 URL 가져오기
 * @param {string} characterName - 캐릭터 이름 (예: '뤄지', 'luo-ji')
 * @returns {string} - 이미지 URL 또는 플레이스홀더
 */
export function getCharacterImage(characterName) {
  // 한글명을 영문 파일명으로 매핑
  const nameMap = {
    '왕먀오': 'wang-miao',
    '예원제': 'ye-wenjie',
    '뤄지': 'luo-ji',
    '장베이하이': 'zhang-beihai',
    '정청신': 'cheng-xin',
    '마이크 에반스': 'mike-evans',
    '스창': 'da-shi',
    '양둥': 'yang-dong',
    '관이판': 'guan-yifan',
    '윈톈밍': 'yun-tianming',
    '창웨이스': 'chang-weisi',
    '둥펑웨이': 'dong-fengwei',
    '우웨이': 'wu-yue',
    '딩이': 'ding-yi',
    '예저타이': 'ye-zhetai',
    '마누엘 레이디아즈': 'manuel-reidiaz',
    '빌 하인즈': 'bill-hines',
    '프레데릭 타일러': 'frederick-tyler',
    '토마스 웨이드': 'thomas-wade'
  }

  const fileName = nameMap[characterName] || characterName.toLowerCase().replace(/\s+/g, '-')
  const imageUrl = getImageUrl('three-body-images', `characters/${fileName}.jpg`)

  // 이미지가 없으면 플레이스홀더 반환
  return imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(characterName)}&size=400&background=4ecdc4&color=fff&bold=true`
}

/**
 * 명장면 이미지 URL 가져오기
 * @param {number} sceneId - 장면 ID (1-10)
 * @returns {string} - 이미지 URL 또는 플레이스홀더
 */
export function getSceneImage(sceneId) {
  const sceneFileNames = {
    1: 'ye-wenjie-betrayal',
    2: 'dark-forest-theory',
    3: 'doomsday-battle',
    4: 'swordholder-handover',
    5: 'dimensional-strike',
    6: 'operation-guzheng',
    7: 'zhang-beihai-choice',
    8: 'dark-battle',
    9: 'fairy-tales',
    10: 'universe-reset'
  }

  const fileName = sceneFileNames[sceneId]
  if (!fileName) return null

  const imageUrl = getImageUrl('three-body-images', `scenes/${fileName}.jpg`)

  // 이미지가 없으면 그라디언트 플레이스홀더
  return imageUrl || `https://via.placeholder.com/1200x675/1a1a2e/4ecdc4?text=Scene+${sceneId}`
}

/**
 * 우주선 이미지 URL 가져오기
 * @param {string} shipName - 우주선 이름
 * @returns {string} - 이미지 URL 또는 플레이스홀더
 */
export function getShipImage(shipName) {
  const shipMap = {
    '자연선택호': 'natural-selection',
    '블루스페이스호': 'blue-space',
    '중력호': 'gravity',
    '워터 드롭': 'water-drop',
    '삼체 함대': 'trisolaran-fleet'
  }

  const fileName = shipMap[shipName] || shipName.toLowerCase().replace(/\s+/g, '-')
  const imageUrl = getImageUrl('three-body-images', `ships/${fileName}.jpg`)

  return imageUrl || `https://via.placeholder.com/800x600/16213e/4ecdc4?text=${encodeURIComponent(shipName)}`
}

/**
 * 기술 이미지 URL 가져오기
 * @param {string} techName - 기술 이름
 * @returns {string} - 이미지 URL 또는 플레이스홀더
 */
export function getTechImage(techName) {
  const techMap = {
    '나노와이어': 'nanofiber',
    '소폰': 'sophon',
    '곡률 추진': 'curvature-drive',
    '차원 무기': 'dimensional-weapon',
    '태양 증폭': 'solar-amplification'
  }

  const fileName = techMap[techName] || techName.toLowerCase().replace(/\s+/g, '-')
  const imageUrl = getImageUrl('three-body-images', `tech/${fileName}.jpg`)

  return imageUrl || `https://via.placeholder.com/800x600/0f3460/4ecdc4?text=${encodeURIComponent(techName)}`
}

/**
 * 갤러리 이미지 URL 가져오기
 * @param {string} category - 카테고리 (소설, 넷플릭스, 컨셉아트)
 * @param {string} fileName - 파일명
 * @returns {string} - 이미지 URL 또는 플레이스홀더
 */
export function getGalleryImage(category, fileName) {
  const categoryMap = {
    '소설': 'covers',
    '넷플릭스': 'netflix',
    '컨셉아트': 'concept-art'
  }

  const folder = categoryMap[category] || 'misc'
  const imageUrl = getImageUrl('three-body-images', `${folder}/${fileName}`)

  return imageUrl || `https://via.placeholder.com/600x400/1a1a2e/4ecdc4?text=${encodeURIComponent(category)}`
}

/**
 * 이미지 업로드 (관리자용)
 * @param {File} file - 업로드할 파일
 * @param {string} bucket - Storage bucket
 * @param {string} path - 저장 경로
 * @returns {Promise<{url: string, error: null} | {url: null, error: string}>}
 */
export async function uploadImage(file, bucket, path) {
  if (!supabase) {
    return { url: null, error: 'Supabase not initialized' }
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      return { url: null, error: error.message }
    }

    const publicUrl = getImageUrl(bucket, path)
    return { url: publicUrl, error: null }
  } catch (error) {
    return { url: null, error: error.message }
  }
}

export default {
  getImageUrl,
  getCharacterImage,
  getSceneImage,
  getShipImage,
  getTechImage,
  getGalleryImage,
  uploadImage
}
