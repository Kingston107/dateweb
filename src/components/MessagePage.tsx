import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingHeart } from './FloatingHeart'
import { HEART_CONFIGS } from '../data/heartConfig'
import { DateButton } from './DateButton'

const PAGE_BG: React.CSSProperties = {
  background: 'linear-gradient(160deg in oklab, #FFF5F8 0%, #FFF0F5 35%, #FDE8F0 65%, #FBCFE8 100%)',
}

interface MessagePageProps {
  name: string
  message: string
  onNext: () => void
}

export function MessagePage({ name, message, onNext }: MessagePageProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(message.slice(0, i))
      if (i >= message.length) {
        clearInterval(id)
        setDone(true)
      }
    }, 20)
    return () => clearInterval(id)
  }, [message])

  return (
    <main
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-y-auto px-6"
      style={PAGE_BG}
      aria-label="Your message"
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

      <div
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-md py-8"
        style={{ margin: '0 auto' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 28,
            boxShadow: '0 8px 48px 0 rgba(200,77,117,0.14), 0 2px 12px 0 rgba(200,77,117,0.08)',
            border: '1px solid rgba(245,167,192,0.35)',
            padding: '36px 32px 32px',
            width: '100%',
            maxWidth: 360,
            minHeight: 420,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>💌</div>
          
          <h1 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            color: '#C84D75',
            fontSize: 26,
            lineHeight: 1.2,
            marginBottom: 20,
            textAlign: 'center',
          }}>
            Just for you, {name} 💕
          </h1>

          <div style={{ flex: 1, width: '100%' }}>
            <p style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 15,
              color: '#4A1A2C',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}>
              {displayed}
              {!done && <span className="animate-pulse">|</span>}
            </p>
          </div>

          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: 24, width: '100%' }}
              >
                <DateButton variant="yes" wide onClick={onNext}>
                  I'm ready for you 💌
                </DateButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 h-16"
        style={{
          background: 'linear-gradient(to top in oklab, rgba(251,207,232,0.4) 0%, transparent 100%)',
        }}
      />
    </main>
  )
}
