import { useState } from 'react'
import Image from 'next/image'

/**
 * 이미지 로딩 실패 시 자동으로 폴백을 표시하는 컴포넌트
 */
export default function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  className = '',
  objectFit = 'cover',
  priority = false,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src)
  const [error, setError] = useState(false)

  const handleError = () => {
    if (!error) {
      setError(true)
      if (fallbackSrc) {
        setImgSrc(fallbackSrc)
      }
    }
  }

  // src가 없으면 바로 fallback 사용
  const finalSrc = !src || src === '' ? fallbackSrc : imgSrc

  // 두 src 모두 없으면 기본 플레이스홀더
  if (!finalSrc) {
    return (
      <div
        className={className}
        style={{
          width: width || '100%',
          height: height || '100%',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4ecdc4',
          fontSize: '14px',
          fontWeight: 600
        }}
      >
        이미지 준비중
      </div>
    )
  }

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit }}
      onError={handleError}
      priority={priority}
      {...props}
    />
  )
}
