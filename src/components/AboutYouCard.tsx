import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingHeart } from './FloatingHeart'
import { HEART_CONFIGS } from '../data/heartConfig'
import { ProgressDots } from './ProgressDots'
import { DateButton } from './DateButton'

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

const PAGE_BG: React.CSSProperties = {
  background: 'linear-gradient(160deg in oklab, #FFF5F8 0%, #FFF0F5 35%, #FDE8F0 65%, #FBCFE8 100%)',
}

interface AboutYouCardProps {
  name: string
  gender: string
  date: string
  time: string
  food: string
  notes: string
  onUpdate: (updates: { name?: string; gender?: string }) => void
  onNext: (message: string) => void
}

type Phase = 'form' | 'loading' | 'done'

function LoadingDots() {
  const [dots, setDots] = useState(1)
  useEffect(() => {
    const id = setInterval(() => setDots(d => (d % 4) + 1), 400)
    return () => clearInterval(id)
  }, [])
  return <span style={{ fontFamily: 'monospace', color: '#C84D75', fontSize: 20 }}>{'·'.repeat(dots)}</span>
}

export function AboutYouCard({ name, gender, date, time, food, notes, onUpdate, onNext }: AboutYouCardProps) {
  const [phase, setPhase] = useState<Phase>('form')
  const [error, setError] = useState<string | null>(null)
  const canProceed = name.trim() !== '' && gender !== ''

  async function handleContinue() {
    if (!canProceed || phase !== 'form') return
    setPhase('loading')
    setError(null)

    try {
      const messagePromise = fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, gender, date, time, food, notes }),
      }).then(async (r) => {
        const data = await r.json()
        if (!r.ok || data.error) throw new Error(data.error ?? 'Request failed')
        return data.message as string
      })

      const [message] = await Promise.all([
        messagePromise,
        new Promise<void>((resolve) => setTimeout(resolve, 3000)),
      ])

      onNext(message)
    } catch {
      setPhase('form')
      setError('Something went wrong while writing your message.')
    }
  }

  return (
    <main
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden px-6"
      style={PAGE_BG}
      aria-label="About you information"
    >
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
          padding: '32px 28px 30px',
          maxWidth: 340,
        }}
      >
        <ProgressDots step={2} />

        <motion.div
          variants={fieldVariant}
          initial="hidden"
          animate="visible"
          style={{ textAlign: 'center', marginBottom: 28 }}
        >
          <motion.div 
            animate={phase === 'loading' 
              ? { y: [0, -6, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } } 
              : {}
            }
            style={{ fontSize: 40, marginBottom: 18 }}
          >
            💌
          </motion.div>
          <AnimatePresence mode="wait">
            {phase === 'form' ? (
              <motion.div key="text-form" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                <h1 style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 600,
                  color: '#3D1A26',
                  fontSize: 28,
                  lineHeight: 1.2,
                  marginBottom: 14,
                }}>
                  I have a message for you
                </h1>
                <p style={{
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontSize: 16,
                  color: '#9CA3AF',
                  lineHeight: 1.5,
                }}>
                  Before I show it...<br />tell me a little about yourself.
                </p>
              </motion.div>
            ) : (
              <motion.div key="text-loading" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }}>
                <h1 style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 600,
                  color: '#3D1A26',
                  fontSize: 28,
                  lineHeight: 1.2,
                  marginBottom: 14,
                }}>
                  Writing your message...
                </h1>
                <p style={{
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontSize: 16,
                  color: '#9CA3AF',
                  lineHeight: 1.5,
                }}>
                  Thinking of the perfect words<br />just for you.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {phase === 'form' && (
            <motion.div
              key="form-fields"
              variants={stagger}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}
            >
              <motion.div variants={fieldVariant}>
                <label
                  htmlFor="name-input"
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#C84D75',
                    marginBottom: 8,
                    fontFamily: '"Inter", system-ui, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  YOUR NAME
                </label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  style={INPUT_BASE}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C84D75'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,77,117,0.12)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#F5A7C0'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </motion.div>

              <motion.div variants={fieldVariant}>
                <label
                  htmlFor="gender-select"
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#C84D75',
                    marginBottom: 8,
                    fontFamily: '"Inter", system-ui, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  GENDER
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="gender-select"
                    value={gender}
                    onChange={(e) => onUpdate({ gender: e.target.value })}
                    style={{ ...INPUT_BASE, paddingRight: 40 }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#C84D75'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,77,117,0.12)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#F5A7C0'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <option value="" disabled hidden>Select gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <div
                    style={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#C84D75',
                    }}
                  >
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={btnVariant} style={{ marginTop: 8 }}>
                {error && (
                  <p style={{
                    color: '#C84D75',
                    fontSize: 13,
                    textAlign: 'center',
                    marginBottom: 8,
                    fontFamily: '"Inter", system-ui, sans-serif',
                  }}>
                    {error}
                  </p>
                )}
                <DateButton
                  variant="yes"
                  wide
                  disabled={!canProceed || phase !== 'form'}
                  onClick={handleContinue}
                >
                  Continue 💌
                </DateButton>
              </motion.div>
            </motion.div>
          )}

          {phase === 'loading' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: 20 }}
            >
              <LoadingDots />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 12 }}
              >
                This will only take<br/>a moment.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
