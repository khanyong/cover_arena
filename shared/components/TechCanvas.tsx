import { useEffect, useRef } from 'react'

const TECH_WORDS = [
  'REACT', 'NEXT.JS', 'TYPESCRIPT', 'DATABASE', 'API', 'REALTIME', 'SUPABASE',
  'SERVERLESS', 'CLOUD', 'ANALYTICS', 'DASHBOARD', 'VISUALIZATION', 'D3.JS',
  'POSTGRESQL', 'RESPONSIVE', 'PERFORMANCE', 'OPTIMIZATION', 'MACHINE LEARNING'
]

interface TextElement {
  text: string
  x: number
  y: number
  opacity: number
  fontSize: number
  speed: number
  direction: number
}

export default function TechCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // Render static version
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const textElements: TextElement[] = []
      for (let i = 0; i < 8; i++) {
        textElements.push({
          text: TECH_WORDS[Math.floor(Math.random() * TECH_WORDS.length)],
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          opacity: Math.random() * 0.03 + 0.01,
          fontSize: Math.random() * 20 + 10,
          speed: 0,
          direction: 0
        })
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      textElements.forEach(elem => {
        ctx.font = `300 ${elem.fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
        ctx.fillStyle = `rgba(156, 163, 175, ${elem.opacity})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(elem.text, elem.x, elem.y)
      })

      return
    }

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()

    const textElements: TextElement[] = []
    const density = 8

    for (let i = 0; i < density; i++) {
      textElements.push({
        text: TECH_WORDS[Math.floor(Math.random() * TECH_WORDS.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        opacity: Math.random() * 0.03 + 0.01,
        fontSize: Math.random() * 20 + 10,
        speed: Math.random() * 0.3 + 0.1,
        direction: Math.random() > 0.5 ? 1 : -1
      })
    }

    let animationId: number

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      textElements.forEach(elem => {
        elem.x += elem.speed * elem.direction

        // Wrap around
        if (elem.direction > 0 && elem.x > canvas.width + 200) {
          elem.x = -200
        } else if (elem.direction < 0 && elem.x < -200) {
          elem.x = canvas.width + 200
        }

        ctx.save()
        ctx.font = `300 ${elem.fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
        ctx.fillStyle = `rgba(156, 163, 175, ${elem.opacity})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(elem.text, elem.x, elem.y)
        ctx.restore()
      })

      animationId = requestAnimationFrame(animate)
    }

    // Use requestIdleCallback if available for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => animate())
    } else {
      animate()
    }

    window.addEventListener('resize', setCanvasSize)
    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}
