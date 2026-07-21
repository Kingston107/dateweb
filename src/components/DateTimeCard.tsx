/**
 * DateTimeCard — Step 4: "So... when are you free?"
 *
 * Sub-components (DateInput, TimeInput, NotesInput) are co-located here
 * since each is a thin styled wrapper — no reason to scatter them across
 * 3 files when they share the same style token and are only used here.
 *
 * Reuses: FloatingHeart, HEART_CONFIGS (already in codebase).
 * State lifted to parent via onSubmit callback.
 */
import { motion } from 'framer-motion'
import { FloatingHeart } from './FloatingHeart'
import { HEART_CONFIGS } from '../data/heartConfig'
import { ProgressDots } from './ProgressDots'

/* ─── Shared input style ───────────────────────────────────── */
const INPUT_BASE: React.CSSProperties = {
  width: '100%',
  height: 52,
  borderRadius: 14,
  border: '1.5px solid #F5A7C0',
  background: '#FFF5F8',
  color: '#7A2A45',
  fontSize: '1rem',
  fontFamily: '"Inter", system-ui, sans-serif',
  fontWeight: 500,
  padding: '0 44px 0 16px',
  outline: 'none',
  boxSizing: 'border-box',
  appearance: 'none',
  WebkitAppearance: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

/* ─── DateInput ────────────────────────────────────────────── */
export function DateInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const minDate = `${yyyy}-${mm}-${dd}`

  return (
    <input
      id="date-picker"
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => {
        try {
          e.currentTarget.showPicker()
        } catch (err) {}
      }}
      style={{
        ...INPUT_BASE,
        colorScheme: 'light',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#C84D75'
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,77,117,0.12)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#F5A7C0'
        e.currentTarget.style.boxShadow = 'none'
      }}
    />
  )
}

/* ─── TimeInput ────────────────────────────────────────────── */
export function TimeInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      id="time-picker"
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => {
        try {
          e.currentTarget.showPicker()
        } catch (err) {}
      }}
      style={{
        ...INPUT_BASE,
        colorScheme: 'light',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#C84D75'
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,77,117,0.12)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#F5A7C0'
        e.currentTarget.style.boxShadow = 'none'
      }}
    />
  )
}

/* ─── NotesInput ───────────────────────────────────────────── */
export function NotesInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <textarea
      id="notes-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Anything I should know? (optional)"
      rows={3}
      style={{
        width: '100%',
        borderRadius: 14,
        border: '1.5px solid #F5A7C0',
        background: '#FFF5F8',
        color: '#7A2A45',
        fontSize: '1rem',
        fontFamily: '"Inter", system-ui, sans-serif',
        fontWeight: 500,
        padding: '12px 16px',
        outline: 'none',
        resize: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        lineHeight: 1.5,
      } as React.CSSProperties}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#C84D75'
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,77,117,0.12)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#F5A7C0'
        e.currentTarget.style.boxShadow = 'none'
      }}
    />
  )
}

/* ─── Framer Motion variants ───────────────────────────────── */
const cardVariants: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const fieldVariant: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
}

const btnVariant: import('framer-motion').Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 340, damping: 22 } },
}

/* ─── Page background (same as other screens) ──────────────── */
const PAGE_BG: React.CSSProperties = {
  background: 'linear-gradient(160deg in oklab, #FFF5F8 0%, #FFF0F5 35%, #FDE8F0 65%, #FBCFE8 100%)',
}

/* ─── Props ────────────────────────────────────────────────── */
interface DateTimeCardProps {
  date: string
  time: string
  notes: string
  onUpdate: (updates: { date?: string; time?: string; notes?: string }) => void
  onNext: () => void
}

/* ─── Main component ───────────────────────────────────────── */
export function DateTimeCard({ date, time, notes, onUpdate, onNext }: DateTimeCardProps) {

  const canProceed = date !== '' && time !== ''

  const NEXT_BTN: React.CSSProperties = {
    width: '100%',
    height: 56,
    borderRadius: 9999,
    border: 'none',
    background: canProceed
      ? 'linear-gradient(135deg in oklab, #E0739A 0%, #C84D75 60%, #A83360 100%)'
      : 'linear-gradient(135deg in oklab, #F5C6D6 0%, #EBA3BA 60%, #D989A8 100%)',
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: 700,
    fontFamily: '"Inter", system-ui, sans-serif',
    letterSpacing: '0.05em',
    cursor: canProceed ? 'pointer' : 'not-allowed',
    boxShadow: canProceed
      ? '0 4px 20px 0 rgba(200, 77, 117, 0.38)'
      : '0 2px 8px 0 rgba(200, 77, 117, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    outline: 'none',
    transition: 'box-shadow 0.25s, background 0.25s',
    willChange: 'transform',
  }

  return (
    <main
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden px-6"
      style={PAGE_BG}
      aria-label="Date and time selection"
    >
      {/* Floating hearts — reuse directly */}
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

      {/* Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 28,
          boxShadow: '0 8px 48px 0 rgba(200,77,117,0.14), 0 2px 12px 0 rgba(200,77,117,0.08)',
          border: '1px solid rgba(245,167,192,0.35)',
          padding: '36px 32px 32px',
        }}
      >
        {/* Progress indicator */}
        <ProgressDots step={1} />

        {/* Title */}
        <motion.h1
          variants={fieldVariant}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 800,
            color: '#C84D75',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            lineHeight: 1.2,
            marginBottom: 28,
            textAlign: 'center',
          }}
        >
          So... when are you free? 🗓️
        </motion.h1>

        {/* Fields with stagger */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {/* Date */}
          <motion.div variants={fieldVariant}>
            <label
              htmlFor="date-picker"
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#C84D75',
                marginBottom: 6,
                fontFamily: '"Inter", system-ui, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Date
            </label>
            <DateInput value={date} onChange={v => onUpdate({ date: v })} />
          </motion.div>

          {/* Time */}
          <motion.div variants={fieldVariant}>
            <label
              htmlFor="time-picker"
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#C84D75',
                marginBottom: 6,
                fontFamily: '"Inter", system-ui, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Time
            </label>
            <TimeInput value={time} onChange={v => onUpdate({ time: v })} />
          </motion.div>

          {/* Notes */}
          <motion.div variants={fieldVariant}>
            <label
              htmlFor="notes-input"
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#C84D75',
                marginBottom: 6,
                fontFamily: '"Inter", system-ui, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Notes <span style={{ opacity: 0.5, fontWeight: 400, textTransform: 'none' }}>(optional)</span>
            </label>
            <NotesInput value={notes} onChange={v => onUpdate({ notes: v })} />
          </motion.div>

          {/* Button */}
          <motion.div variants={btnVariant}>
            <motion.button
              style={NEXT_BTN}
              disabled={!canProceed}
              onClick={() => canProceed && onNext()}
              whileHover={canProceed ? { scale: 1.03, filter: 'brightness(1.08)' } : {}}
              whileTap={canProceed ? { scale: 0.97 } : {}}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              aria-label="Proceed to next step"
            >
              okay next 🗓️
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom vignette — same as all other screens */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background: 'linear-gradient(to top in oklab, rgba(251,207,232,0.4) 0%, transparent 100%)',
        }}
      />
    </main>
  )
}
