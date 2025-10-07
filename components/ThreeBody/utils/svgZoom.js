// SVG 줌 & 패닝 유틸리티
export function enableZoomPan(svgElement, containerElement, onTransformChange) {
  let isPanning = false
  let startPoint = { x: 0, y: 0 }
  let scale = 1
  let translateX = 0
  let translateY = 0

  const MIN_SCALE = 0.3
  const MAX_SCALE = 3

  function updateTransform() {
    svgElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
    svgElement.style.transformOrigin = '0 0'

    // Notify transform change
    if (onTransformChange) {
      onTransformChange({ scale, translateX, translateY })
    }
  }

  // 마우스 휠 줌
  function handleWheel(e) {
    e.preventDefault()

    const rect = containerElement.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta))

    // 마우스 위치를 중심으로 줌
    const scaleChange = newScale / scale
    translateX = mouseX - (mouseX - translateX) * scaleChange
    translateY = mouseY - (mouseY - translateY) * scaleChange
    scale = newScale

    updateTransform()
  }

  // 마우스 드래그 패닝
  function handleMouseDown(e) {
    // 왼쪽 버튼만
    if (e.button !== 0) return

    isPanning = true
    startPoint = {
      x: e.clientX - translateX,
      y: e.clientY - translateY
    }
    containerElement.style.cursor = 'grabbing'
    e.preventDefault()
  }

  function handleMouseMove(e) {
    if (!isPanning) return

    translateX = e.clientX - startPoint.x
    translateY = e.clientY - startPoint.y
    updateTransform()
  }

  function handleMouseUp() {
    isPanning = false
    containerElement.style.cursor = 'grab'
  }

  // 터치 제스처 지원
  let touchStartDistance = 0
  let touchStartScale = 1

  function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.hypot(dx, dy)
  }

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      touchStartDistance = getTouchDistance(e.touches)
      touchStartScale = scale
      e.preventDefault()
    } else if (e.touches.length === 1) {
      isPanning = true
      startPoint = {
        x: e.touches[0].clientX - translateX,
        y: e.touches[0].clientY - translateY
      }
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 2) {
      e.preventDefault()
      const currentDistance = getTouchDistance(e.touches)
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE,
        touchStartScale * (currentDistance / touchStartDistance)))

      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2
      const rect = containerElement.getBoundingClientRect()
      const mx = centerX - rect.left
      const my = centerY - rect.top

      const scaleChange = newScale / scale
      translateX = mx - (mx - translateX) * scaleChange
      translateY = my - (my - translateY) * scaleChange
      scale = newScale

      updateTransform()
    } else if (e.touches.length === 1 && isPanning) {
      translateX = e.touches[0].clientX - startPoint.x
      translateY = e.touches[0].clientY - startPoint.y
      updateTransform()
    }
  }

  function handleTouchEnd() {
    isPanning = false
    touchStartDistance = 0
  }

  // 리셋 함수
  function reset() {
    scale = 1
    translateX = 0
    translateY = 0
    updateTransform()
  }

  // 이벤트 리스너 등록
  containerElement.addEventListener('wheel', handleWheel, { passive: false })
  containerElement.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  containerElement.addEventListener('touchstart', handleTouchStart, { passive: false })
  containerElement.addEventListener('touchmove', handleTouchMove, { passive: false })
  containerElement.addEventListener('touchend', handleTouchEnd)

  containerElement.style.cursor = 'grab'
  containerElement.style.overflow = 'hidden'

  // Navigate to specific coordinates
  function navigateTo(targetX, targetY) {
    const rect = containerElement.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    translateX = centerX - targetX * scale
    translateY = centerY - targetY * scale
    updateTransform()
  }

  // cleanup 함수 반환
  return {
    reset,
    navigateTo,
    getTransform: () => ({ scale, translateX, translateY }),
    cleanup: () => {
      containerElement.removeEventListener('wheel', handleWheel)
      containerElement.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      containerElement.removeEventListener('touchstart', handleTouchStart)
      containerElement.removeEventListener('touchmove', handleTouchMove)
      containerElement.removeEventListener('touchend', handleTouchEnd)
    }
  }
}
