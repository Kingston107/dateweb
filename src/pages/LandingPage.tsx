/**
 * LandingPage — Step 1 of the date invitation flow.
 *
 * Layout (top → bottom, vertically + horizontally centered):
 *   1. Floating hearts (absolute, behind content)
 *   2. Envelope illustration (with float animation)
 *   3. Heading "Will you go on a date with me?"
 *   4. YES button  |  NO button  (stagger-animated)
 *
 * Animation strategy (all Framer Motion, compositor-only):
 *   - Page  → fade-in + slight upward translateY on mount
 *   - Envelope → continuous float (in EnvelopeIllustration)
 *   - Hearts   → continuous float (in FloatingHeart)
 *   - Buttons  → staggerChildren (0.14s apart) with spring
 */
import { useRef } from 'react'
import { motion, type Variants } from 'framer-motion'
import { EnvelopeIllustration } from '../components/EnvelopeIllustration'
import { FloatingHeart } from '../components/FloatingHeart'
import { DateButton } from '../components/DateButton'
import { MovingNoButton } from '../components/MovingNoButton'
import { HEART_CONFIGS } from '../data/heartConfig'

/* ─── Framer Motion variants ──────────────────────────────── */

/** Whole-page fade + rise on mount */
const pageVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1], // custom ease-out-expo
      when: 'beforeChildren',
      staggerChildren: 0.14,
    },
  },
}

/** Children (heading + button group) fade + slight rise */
const childVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

/** Button group stagger parent */
const buttonGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
}

/** Individual button entrance */
const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 24 },
  },
}

/* ─── Page background style (inline for oklab support) ───── */
const PAGE_BG: React.CSSProperties = {
  background:
    'linear-gradient(160deg in oklab, #FFF5F8 0%, #FFF0F5 35%, #FDE8F0 65%, #FBCFE8 100%)',
}

/* ─── Component ───────────────────────────────────────────── */

interface LandingPageProps { onYes?: () => void }

export function LandingPage({ onYes }: LandingPageProps) {
  const yesRef = useRef<HTMLElement | null>(null)
  return (
    <motion.main
      id="landing-page"
      className="relative h-screen w-full overflow-hidden"
      style={PAGE_BG}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      aria-label="Date invitation landing page"
    >
      {/* ── Floating heart decorations (behind content) ──── */}
      {HEART_CONFIGS.map((cfg) => (
        <FloatingHeart
          key={cfg.id}
          left={cfg.left}
          top={cfg.top}
          size={cfg.size}
          duration={cfg.duration}
          delay={cfg.delay}
          opacity={cfg.opacity}
        />
      ))}

      {/* ── Main content, vertically + horizontally centered ── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">

        {/* Envelope */}
        <motion.div variants={childVariants}>
          <EnvelopeIllustration size={160} />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={childVariants}
          className="mt-10 mb-[80px] max-w-[600px] text-center"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 800,
            color: '#C84D75',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            textShadow: 'none',
            fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
            textWrap: 'balance',
          } as React.CSSProperties}
        >
          Will you go out
          <br />
          with me?
        </motion.h1>

        {/* Buttons */}
        <motion.div
          variants={buttonGroupVariants}
          className="mt-0 flex flex-row items-center gap-7"
          aria-label="Response buttons"
        >
          <motion.div variants={buttonVariants} ref={yesRef as React.RefObject<HTMLDivElement>}>
            <DateButton variant="yes" onClick={onYes}>YES</DateButton>
          </motion.div>

          <motion.div variants={buttonVariants}>
            <MovingNoButton yesRef={yesRef} />
          </motion.div>
        </motion.div>

      </div>

      {/* ── Subtle bottom gradient vignette ───────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background:
            'linear-gradient(to top in oklab, rgba(251,207,232,0.4) 0%, transparent 100%)',
        }}
      />
    </motion.main>
  )
}
