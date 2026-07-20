/**
 * EnvelopeIllustration — an SVG envelope with a small heart,
 * wrapped in a Framer Motion floating animation.
 *
 * Self-contained — no external images required.
 * Uses only `transform` animation for GPU compositing.
 */
import { motion, useReducedMotion } from 'framer-motion'

interface EnvelopeIllustrationProps {
  /** Size of the illustration in px (applied as width; height is auto) */
  size?: number
}

export function EnvelopeIllustration({ size = 180 }: EnvelopeIllustrationProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      aria-label="Envelope illustration"
      role="img"
      animate={
        shouldReduce
          ? {}
          : {
              y: [0, -14, 0],
            }
      }
      transition={{
        duration: 3.6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      <svg
        width={size}
        height={size * 0.75}
        viewBox="0 0 240 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="20"
          y="40"
          width="200"
          height="120"
          rx="8"
          fill="#FBCFE8"
        />
        <path
          d="M20 48 L120 110 L220 48 L220 40 Q220 32 212 32 L28 32 Q20 32 20 40 Z"
          fill="#F9A8D4"
        />
        <line x1="20" y1="160" x2="100" y2="100" stroke="#F9A8D4" strokeWidth="1.5" />
        <line x1="220" y1="160" x2="140" y2="100" stroke="#F9A8D4" strokeWidth="1.5" />
        <path
          d="M120 120
             C120 120 102 105 102 94
             C102 87 108 83 114 86
             C117 88 120 91 120 91
             C120 91 123 88 126 86
             C132 83 138 87 138 94
             C138 105 120 120 120 120Z"
          fill="#BE185D"
        />
      </svg>
    </motion.div>
  )
}
