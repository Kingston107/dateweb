/**
 * CelebrationScreen — Step 3: shown after user clicks YES.
 *
 * Reuses: FloatingHeart, HEART_CONFIGS, DateButton (already in codebase).
 * New: party popper SVG (inline, no image needed).
 *
 * Layout (top → bottom, centered):
 *   1. Floating hearts (absolute bg — reuse existing component)
 *   2. Party popper illustration
 *   3. "YOU SAID YES???" heading
 *   4. Subtext
 *   5. "okay okay!" button
 */
import { motion } from 'framer-motion'
import { FloatingHeart } from './FloatingHeart'
import { DateButton } from './DateButton'
import { HEART_CONFIGS } from '../data/heartConfig'

/* ─── Framer Motion stagger ─────────────────────────────── */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
}

const rise = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const pop = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 340, damping: 22 } },
}

/* ─── Party Popper SVG ──────────────────────────────────── */
function PartyPopper() {
  return (
    <motion.div
      variants={pop}
      style={{ fontSize: 96, lineHeight: 1, userSelect: 'none' }}
      aria-label="Party popper"
      role="img"
      animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
      transition={{ duration: 1.8, delay: 0.6, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
    >
      🎉
    </motion.div>
  )
}

/* ─── Component ─────────────────────────────────────────── */

const PAGE_BG: React.CSSProperties = {
  background: 'linear-gradient(160deg in oklab, #FFF5F8 0%, #FFF0F5 35%, #FDE8F0 65%, #FBCFE8 100%)',
}

interface CelebrationScreenProps {
  onNext?: () => void
}

export function CelebrationScreen({ onNext }: CelebrationScreenProps) {
  return (
    <motion.main
      id="celebration-screen"
      className="relative h-screen w-full overflow-hidden"
      style={PAGE_BG}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-label="Celebration screen"
    >
      {/* ── Floating hearts (reuse existing component + data) ── */}
      {HEART_CONFIGS.map((cfg) => (
        <FloatingHeart
          key={cfg.id}
          left={cfg.left}
          top={cfg.top}
          size={cfg.size * 1.4}
          duration={cfg.duration * 0.7}
          delay={cfg.delay}
          opacity={cfg.opacity * 1.6}
        />
      ))}

      {/* ── Main content ─────────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Party popper */}
        <PartyPopper />

        {/* Heading */}
        <motion.h1
          variants={rise}
          className="mt-6 max-w-[560px]"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 800,
            color: '#C84D75',
            fontSize: 'clamp(2.5rem, 6.5vw, 4rem)',
            lineHeight: 1.12,
            textWrap: 'balance',
          } as React.CSSProperties}
        >
          YOU SAID YES???
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={rise}
          className="mt-4 max-w-[360px]"
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontWeight: 500,
            color: '#E0739A',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}
        >
          okay playing it cool
          <br />
          playing it cool
        </motion.p>

        {/* CTA button */}
        <motion.div variants={pop} className="mt-10">
          <DateButton variant="yes" onClick={onNext}>
            okay okay!
          </DateButton>
        </motion.div>
      </motion.div>

      {/* Bottom vignette — reuse same pattern as LandingPage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background: 'linear-gradient(to top in oklab, rgba(251,207,232,0.4) 0%, transparent 100%)',
        }}
      />
    </motion.main>
  )
}
