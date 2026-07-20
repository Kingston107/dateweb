/**
 * FloatingHeart — a single decorative heart particle.
 *
 * Position, size, and timing are all driven by props so the parent
 * can scatter many instances pseudo-randomly without any DOM coupling.
 *
 * Uses Framer Motion `animate` with `repeat: Infinity` so each heart
 * drifts up continuously. Only `transform` and `opacity` are animated,
 * keeping everything on the compositor thread (per CSS performance guide).
 */
import { motion, useReducedMotion } from 'framer-motion'

interface FloatingHeartProps {
  /** Horizontal position as a CSS value, e.g. "12%" */
  left: string
  /** Vertical starting position as a CSS value, e.g. "70%" */
  top: string
  /** Icon size in px */
  size: number
  /** Total animation duration in seconds */
  duration: number
  /** Delay before the first loop starts (seconds) */
  delay: number
  /** Base opacity (hearts are intentionally faint) */
  opacity: number
}

export function FloatingHeart({
  left,
  top,
  size,
  duration,
  delay,
  opacity,
}: FloatingHeartProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left,
        top,
        fontSize: size,
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
        color: '#C84D75',
        opacity,
        willChange: 'transform, opacity',
      }}
      animate={
        shouldReduce
          ? {}
          : {
              y: [0, -28, 0],
              opacity: [opacity, opacity * 1.3, opacity],
              scale: [1, 1.08, 1],
            }
      }
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      ♥
    </motion.div>
  )
}
