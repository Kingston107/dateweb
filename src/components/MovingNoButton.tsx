/**
 * MovingNoButton — a playful NO button that dodges the cursor.
 *
 * On load: renders as a normal button in the flex row (visible, aligned with YES).
 * On first proximity: captures its position and breaks out to fixed positioning.
 * After that: dodges the cursor on proximity, never on load.
 * Mobile: no dodging, tappable normally.
 */
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/* ─── Constants ──────────────────────────────────────────── */

const BTN_W = 180
const BTN_H = 50
const MARGIN = 20
const PROXIMITY = 90
const HEADING_SAFE_Y = 0.62

/* ─── Helpers ────────────────────────────────────────────── */

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by)
}

function randomPos(
  avoidRect: DOMRect | null,
  headingSafeY: number,
): { x: number; y: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const minY = Math.round(vh * headingSafeY)

  const xLo = MARGIN
  const xHi = vw - BTN_W - MARGIN
  const yLo = minY
  const yHi = vh - BTN_H - MARGIN

  for (let attempt = 0; attempt < 40; attempt++) {
    const x = Math.random() * (xHi - xLo) + xLo
    const y = Math.random() * (yHi - yLo) + yLo

    if (avoidRect) {
      const overlap =
        x < avoidRect.right + MARGIN &&
        x + BTN_W > avoidRect.left - MARGIN &&
        y < avoidRect.bottom + MARGIN &&
        y + BTN_H > avoidRect.top - MARGIN
      if (overlap) continue
    }
    return { x, y }
  }
  return { x: xHi, y: yHi }
}

function dodgePos(
  btnCx: number,
  btnCy: number,
  cursorX: number,
  cursorY: number,
  avoidRect: DOMRect | null,
  headingSafeY: number,
): { x: number; y: number } {
  let dx = btnCx - cursorX
  let dy = btnCy - cursorY
  const len = Math.hypot(dx, dy) || 1
  
  // Push it firmly away
  const pushDist = PROXIMITY * 1.8
  dx = (dx / len) * pushDist
  dy = (dy / len) * pushDist

  const vw = window.innerWidth
  const vh = window.innerHeight
  const minY = Math.round(vh * headingSafeY)

  let x = clamp(btnCx + dx - BTN_W / 2, MARGIN, vw - BTN_W - MARGIN)
  let y = clamp(btnCy + dy - BTN_H / 2, minY, vh - BTN_H - MARGIN)

  // If cornered and still too close, teleport randomly
  if (dist(x + BTN_W / 2, y + BTN_H / 2, cursorX, cursorY) < PROXIMITY) {
    return randomPos(avoidRect, headingSafeY)
  }

  // Avoid YES button
  if (avoidRect) {
    const overlap =
      x < avoidRect.right + MARGIN &&
      x + BTN_W > avoidRect.left - MARGIN &&
      y < avoidRect.bottom + MARGIN &&
      y + BTN_H > avoidRect.top - MARGIN
    if (overlap) return randomPos(avoidRect, headingSafeY)
  }

  return { x, y }
}

/* ─── Props ──────────────────────────────────────────────── */

interface MovingNoButtonProps {
  yesRef: React.RefObject<HTMLElement | null>
}

/* ─── Component ──────────────────────────────────────────── */

export function MovingNoButton({ yesRef }: MovingNoButtonProps) {
  const shouldReduce = useReducedMotion()
  const btnRef = useRef<HTMLButtonElement>(null)

  // null = still sitting in the flex row (not dodging yet)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [transform, setTransform] = useState({ scale: 1, rotate: 0 })
  const [emoji, setEmoji] = useState<string | null>(null)

  const dodgeCount = useRef(0)
  const lastDodge = useRef(0)
  const emojiTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dodge = useCallback(
    (cursorX: number, cursorY: number) => {
      if (shouldReduce || !btnRef.current) return
      if (window.matchMedia('(pointer: coarse)').matches) return

      const now = Date.now()
      if (now - lastDodge.current < 40) return // Throttle

      const r = btnRef.current.getBoundingClientRect()
      const btnCx = r.left + r.width / 2
      const btnCy = r.top + r.height / 2

      if (dist(btnCx, btnCy, cursorX, cursorY) > PROXIMITY) return

      lastDodge.current = now
      dodgeCount.current += 1
      const n = dodgeCount.current

      const yesRect = yesRef.current?.getBoundingClientRect() ?? null
      const next = dodgePos(btnCx, btnCy, cursorX, cursorY, yesRect, HEADING_SAFE_Y)

      setPos(next)

      // Effects
      if (n % 4 === 0) {
        const effects = ['😅', '🏃', '💨', 'nope!', '🙈']
        setEmoji(effects[Math.floor(Math.random() * effects.length)])
        if (emojiTimer.current) clearTimeout(emojiTimer.current)
        emojiTimer.current = setTimeout(() => setEmoji(null), 1200)
        setTransform({ scale: 0.9, rotate: (Math.random() - 0.5) * 40 })
      } else {
        setTransform({ scale: 1, rotate: (Math.random() - 0.5) * 15 })
      }
    },
    [shouldReduce, yesRef]
  )

  // Mobile tap: tap lands ON the button so dodgePos gets ~zero vector.
  // Use randomPos directly — guaranteed to jump somewhere valid.
  // onClick fires reliably on all mobile browsers including iOS Safari.
  const tapDodge = useCallback(() => {
    if (shouldReduce) return
    const yesRect = yesRef.current?.getBoundingClientRect() ?? null
    const next = randomPos(yesRect, HEADING_SAFE_Y)
    lastDodge.current = Date.now()
    dodgeCount.current += 1
    const n = dodgeCount.current
    setPos(next)
    const effects = ['😅', '🏃', '💨', 'nope!', '🙈']
    if (n % 3 === 0) {
      setEmoji(effects[Math.floor(Math.random() * effects.length)])
      if (emojiTimer.current) clearTimeout(emojiTimer.current)
      emojiTimer.current = setTimeout(() => setEmoji(null), 1200)
      setTransform({ scale: 0.9, rotate: (Math.random() - 0.5) * 40 })
    } else {
      setTransform({ scale: 1, rotate: (Math.random() - 0.5) * 18 })
    }
  }, [shouldReduce, yesRef])

  useEffect(() => {
    if (shouldReduce) return
    const onMove = (e: PointerEvent) => dodge(e.clientX, e.clientY)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [shouldReduce, dodge])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      ;(e.currentTarget as HTMLElement).blur()
    }
  }

  // Phase 1: sitting in the flex row, visible, normal button
  if (!pos) {
    return (
      <button
        ref={btnRef}
        style={NO_BTN_STYLE}
        aria-label="No thank you"
        onClick={tapDodge}
      >
        NO
      </button>
    )
  }

  // Phase 2: dodging — fixed position, spring animated
  const stiffness = Math.min(280 + dodgeCount.current * 10, 600)
  const damping = Math.max(26 - dodgeCount.current * 0.4, 14)

  return (
    <div style={{ position: 'relative', width: BTN_W, height: BTN_H, pointerEvents: 'none' }}>
      {/* Invisible spacer keeps the flex row from collapsing */}
      <div style={{ width: BTN_W, height: BTN_H }} aria-hidden="true" />

      {emoji && (
        <motion.span
          key={emoji}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -16 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            left: pos.x + BTN_W / 2 - 14,
            top: pos.y - 32,
            fontSize: 24,
            fontWeight: 'bold',
            color: '#C84D75',
            pointerEvents: 'none',
            zIndex: 9999,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {emoji}
        </motion.span>
      )}

      <motion.button
        ref={btnRef}
        aria-label="No thank you"
        onKeyDown={onKeyDown}
        onClick={tapDodge}
        initial={false}
        animate={{
          x: pos.x,
          y: pos.y,
          scale: transform.scale,
          rotate: transform.rotate,
        }}
        transition={{ type: 'spring', stiffness, damping, mass: 0.8 }}
        style={{
          ...NO_BTN_STYLE,
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 9998,
          pointerEvents: 'auto',
        }}
        whileHover={{ scale: 1.05 }}
        whileFocus={{ outline: '2px solid #C84D75', outlineOffset: 3 }}
      >
        NO
      </motion.button>
    </div>
  )
}

const NO_BTN_STYLE: React.CSSProperties = {
  width: BTN_W,
  height: BTN_H,
  borderRadius: 9999,
  border: '2px solid #C84D75',
  background: '#ffffff',
  color: '#C84D75',
  fontSize: '1.125rem',
  fontWeight: 600,
  fontFamily: '"Inter", system-ui, sans-serif',
  letterSpacing: '0.06em',
  cursor: 'default',
  boxShadow: '0 2px 12px 0 rgba(200, 77, 117, 0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  outline: 'none',
  willChange: 'transform',
}
