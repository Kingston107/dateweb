/**
 * FinalSummary — Step 6: "It's a date! 🎉"
 *
 * Co-located helpers: SummaryItem, SummaryCard, CopyButton, Toast
 * — all thin, single-use components not worth separate files.
 *
 * Reuses: FloatingHeart, HEART_CONFIGS, ConfettiExplosion (already in codebase).
 * Reads all state from props (lifted in App.tsx).
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingHeart } from './FloatingHeart'
import { ConfettiExplosion } from './ConfettiExplosion'
import { HEART_CONFIGS } from '../data/heartConfig'
import { FOODS } from '../data/foods'
import { ProgressDots } from './ProgressDots'

/* ─── Types ─────────────────────────────────────────────────── */
interface FinalSummaryProps {
  date: string
  time: string
  notes: string
  foods: string[]
}

/* ─── Helpers ───────────────────────────────────────────────── */

/** Format "2025-08-14" → "Wednesday, August 14, 2025" */
function formatDate(iso: string): string {
  if (!iso) return ''
  // Append T00:00 so it parses in local time, not UTC
  return new Date(`${iso}T00:00`).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

/** Format "18:30" → "6:30 PM" */
function formatTime(t: string): string {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

/** Map food IDs back to display labels with emojis */
function foodLabels(ids: string[]): string {
  return ids.map((id) => {
    const f = FOODS.find((x) => x.id === id)
    return f ? `${f.emoji} ${f.label}` : id
  }).join(', ')
}

/* ─── SummaryItem variants (hoisted — not re-created per render) ── */
const summaryItemVariants: import('framer-motion').Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
}

/* ─── Toast ─────────────────────────────────────────────────── */
function Toast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#C84D75',
            color: '#fff',
            fontFamily: '"Inter", system-ui, sans-serif',
            fontWeight: 600,
            fontSize: '0.95rem',
            padding: '12px 28px',
            borderRadius: 9999,
            boxShadow: '0 8px 24px rgba(200,77,117,0.35)',
            whiteSpace: 'nowrap',
            zIndex: 9999,
          }}
          aria-live="polite"
          role="status"
        >
          ✅ Copied to clipboard!
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── SummaryItem ────────────────────────────────────────────── */
function SummaryItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <motion.div
      variants={summaryItemVariants}
      style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}
    >
      {/* Icon circle */}
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: '#FFF0F5', border: '1.5px solid #F5A7C0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>
        {icon}
      </div>

      <div>
        <p style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: '#C84D75', marginBottom: 3,
        }}>
          {label}
        </p>
        <p style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: '1rem', fontWeight: 500, color: '#4A1A2C', lineHeight: 1.45,
        }}>
          {value}
        </p>
      </div>
    </motion.div>
  )
}

/* ─── SummaryCard ────────────────────────────────────────────── */
function SummaryCard({ date, time, notes, foods }: FinalSummaryProps) {
  const items = [
    { icon: '📅', label: 'When', value: `${formatDate(date)} at ${formatTime(time)}` },
    { icon: '🍽️', label: 'Food', value: foodLabels(foods) },
    ...(notes ? [{ icon: '📝', label: 'Notes', value: notes }] : []),
  ]

  return (
    <motion.div
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
      }}
      initial="hidden"
      animate="visible"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 24,
        border: '1px solid rgba(245,167,192,0.35)',
        boxShadow: '0 8px 48px 0 rgba(200,77,117,0.13), 0 2px 12px 0 rgba(200,77,117,0.07)',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        width: '100%',
      }}
    >
      {items.map((item) => (
        <SummaryItem key={item.label} {...item} />
      ))}
    </motion.div>
  )
}

/* ─── CopyButton ─────────────────────────────────────────────── */
function CopyButton({ text, onCopy }: { text: string; onCopy: () => void }) {
  function handleClick() {
    navigator.clipboard.writeText(text).then(onCopy).catch(() => onCopy())
  }

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.55, type: 'spring', stiffness: 340, damping: 22 }}
      whileHover={{ scale: 1.03, filter: 'brightness(1.1)' }}
      whileTap={{ scale: 0.96 }}
      style={{
        width: '100%', height: 58, borderRadius: 9999, border: 'none',
        background: 'linear-gradient(135deg in oklab, #E0739A 0%, #C84D75 60%, #A83360 100%)',
        color: '#fff',
        fontFamily: '"Inter", system-ui, sans-serif',
        fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.04em',
        cursor: 'pointer',
        boxShadow: '0 4px 24px 0 rgba(200,77,117,0.38)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        userSelect: 'none', outline: 'none', willChange: 'transform',
      }}
      aria-label="Copy plan and text"
    >
      📋 Copy plan &amp; text me
    </motion.button>
  )
}

/* ─── Page background ───────────────────────────────────────── */
const PAGE_BG: React.CSSProperties = {
  background: 'linear-gradient(160deg in oklab, #FFF5F8 0%, #FFF0F5 35%, #FDE8F0 65%, #FBCFE8 100%)',
}

/* ─── Main component ────────────────────────────────────────── */
export function FinalSummary({ date, time, notes, foods }: FinalSummaryProps) {
  const [toastVisible, setToastVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  // Auto-hide confetti after burst
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3200)
    return () => clearTimeout(t)
  }, [])

  // Auto-dismiss toast
  function handleCopy() {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2800)
  }

  const clipboardText = [
    `💌 It's a date!\n`,
    `📅 Date:\n${formatDate(date)}`,
    `🕐 Time:\n${formatTime(time)}`,
    `🍽️ Food:\n${foodLabels(foods)}`,
    ...(notes ? [`📝 Notes:\n${notes}`] : []),
    `\nCan't wait 💕`,
  ].join('\n\n')

  return (
    <>
      {showConfetti && <ConfettiExplosion />}
      <Toast visible={toastVisible} />

      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-screen w-full overflow-y-auto"
        style={PAGE_BG}
        aria-label="Final confirmation screen"
      >
        {/* Floating hearts */}
        {HEART_CONFIGS.map((cfg) => (
          <FloatingHeart
            key={cfg.id}
            left={cfg.left}
            top={cfg.top}
            size={cfg.size}
            duration={cfg.duration}
            delay={cfg.delay}
            opacity={cfg.opacity * 1.3}
          />
        ))}

        <div
          className="relative z-10 flex flex-col items-center justify-center min-h-full px-4 py-10"
          style={{ maxWidth: 520, margin: '0 auto' }}
        >
          {/* Progress — all steps done */}
          <ProgressDots />

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 800, color: '#C84D75',
              fontSize: 'clamp(2rem, 6vw, 3rem)',
              lineHeight: 1.1, textAlign: 'center', marginBottom: 12,
            }}
          >
            It's a date! 🎉
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.45 }}
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              color: '#E0739A', fontSize: '1rem', fontStyle: 'italic',
              textAlign: 'center', marginBottom: 28, lineHeight: 1.5,
            }}
          >
            cool cool cool. pretending i'm not freaking out rn 😅
          </motion.p>

          {/* Summary card */}
          <SummaryCard date={date} time={time} notes={notes} foods={foods} />

          {/* P.S. note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.45 }}
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              color: '#D4849E', fontSize: '0.8rem',
              textAlign: 'center', marginTop: 16, marginBottom: 24,
              fontStyle: 'italic',
            }}
          >
            P.S. I made this website just for you. 💕
          </motion.p>

          {/* Copy button */}
          <CopyButton text={clipboardText} onCopy={handleCopy} />
        </div>

        {/* Bottom vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 bottom-0 h-16"
          style={{
            background: 'linear-gradient(to top in oklab, rgba(251,207,232,0.4) 0%, transparent 100%)',
          }}
        />
      </motion.main>
    </>
  )
}
