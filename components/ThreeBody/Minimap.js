import { useEffect, useRef } from 'react'
import styles from './styles/Minimap.module.css'

export default function Minimap({ svgViewBox, currentTransform, onNavigate }) {
  const canvasRef = useRef(null)
  const minimapRef = useRef(null)

  useEffect(() => {
    if (!svgViewBox || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const [vbX, vbY, vbW, vbH] = svgViewBox.split(' ').map(Number)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw viewport indicator
    const scaleX = canvas.width / vbW
    const scaleY = canvas.height / vbH

    const { scale = 1, translateX = 0, translateY = 0 } = currentTransform

    // Visible viewport in original coordinates
    const viewW = vbW / scale
    const viewH = vbH / scale
    const viewX = -translateX / scale
    const viewY = -translateY / scale

    // Map to minimap coordinates
    const mmX = viewX * scaleX
    const mmY = viewY * scaleY
    const mmW = viewW * scaleX
    const mmH = viewH * scaleY

    ctx.strokeStyle = '#4ecdc4'
    ctx.lineWidth = 2
    ctx.strokeRect(mmX, mmY, mmW, mmH)
    ctx.fillStyle = 'rgba(78, 205, 196, 0.15)'
    ctx.fillRect(mmX, mmY, mmW, mmH)
  }, [svgViewBox, currentTransform])

  const handleMinimapClick = (e) => {
    if (!svgViewBox || !canvasRef.current || !onNavigate) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    const [, , vbW, vbH] = svgViewBox.split(' ').map(Number)
    const scaleX = canvas.width / vbW
    const scaleY = canvas.height / vbH

    // Convert to original coordinates
    const targetX = clickX / scaleX
    const targetY = clickY / scaleY

    onNavigate(targetX, targetY)
  }

  return (
    <div ref={minimapRef} className={styles.minimap} onClick={handleMinimapClick}>
      <canvas ref={canvasRef} width={320} height={180} className={styles.minimapCanvas} />
    </div>
  )
}
