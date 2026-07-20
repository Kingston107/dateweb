/**
 * ConfettiExplosion — canvas-based confetti burst.
 *
 * Draws once on mount, animates ~120 particles falling with gravity/drag.
 * Uses requestAnimationFrame — no external lib needed.
 * Canvas is pointer-events:none and absolutely fills its container.
 */
import { useEffect, useRef } from 'react'

const COLORS = ['#C84D75', '#E0739A', '#F5A7C0', '#FBCFE8', '#FFF0F5', '#A83360', '#FF6B9D', '#FFB7D5']
const COUNT = 120

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  opacity: number
  shape: 'rect' | 'circle'
}

export function ConfettiExplosion() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width = window.innerWidth
    const H = canvas.height = window.innerHeight

    // Burst from center-ish
    const ox = W / 2
    const oy = H * 0.55

    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const angle = (Math.random() * Math.PI * 2)
      const speed = 4 + Math.random() * 10
      return {
        x: ox, y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6, // bias upward
        size: 6 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        shape: Math.random() < 0.5 ? 'rect' : 'circle',
      }
    })

    let raf: number
    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      let alive = false
      for (const p of particles) {
        p.vy += 0.25       // gravity
        p.vx *= 0.99       // drag
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.opacity -= 0.008

        if (p.opacity <= 0) continue
        alive = true

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        }
        ctx.restore()
      }
      if (alive) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    />
  )
}
