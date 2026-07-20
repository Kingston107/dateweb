/**
 * FoodSelection — Step 5: "What are we feeling?"
 *
 * FoodCard is co-located — it's only used here.
 * Reuses: FloatingHeart, HEART_CONFIGS, DateButton (disabled/wide variant).
 * State lifted to parent via onNext callback.
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FloatingHeart } from './FloatingHeart'
import { DateButton } from './DateButton'
import { HEART_CONFIGS } from '../data/heartConfig'
import { FOODS } from '../data/foods'
import { ProgressDots } from './ProgressDots'

/* ─── FoodCard ──────────────────────────────────────────────── */
interface FoodCardProps {
  emoji: string
  label: string
  selected: boolean
  onToggle: () => void
}

function FoodCard({ emoji, label, selected, onToggle }: FoodCardProps) {
  return (
    <motion.button
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={`${label}${selected ? ', selected' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px 0 rgba(200,77,117,0.22)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 340, damping: 24 }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '16px 12px 14px',
        borderRadius: 20,
        border: selected ? '2px solid #C84D75' : '2px solid transparent',
        background: selected ? '#FFF0F5' : '#ffffff',
        boxShadow: selected
          ? '0 4px 20px 0 rgba(200,77,117,0.18)'
          : '0 2px 12px 0 rgba(200,77,117,0.08)',
        cursor: 'pointer',
        outline: 'none',
        userSelect: 'none',
        width: '100%',
        transition: 'border-color 0.2s, background 0.2s',
        willChange: 'transform',
      }}
    >
      {/* Checkmark badge */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#C84D75',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          ✓
        </motion.div>
      )}

      {/* Emoji */}
      <span style={{ fontSize: 36, lineHeight: 1, userSelect: 'none' }} aria-hidden="true">
        {emoji}
      </span>

      {/* Label */}
      <span
        style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          fontWeight: selected ? 700 : 600,
          fontSize: '0.9rem',
          color: selected ? '#C84D75' : '#7A2A45',
          transition: 'color 0.2s, font-weight 0.2s',
        }}
      >
        {label}
      </span>
    </motion.button>
  )
}

/* ─── Variants ──────────────────────────────────────────────── */
const screenVariant: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
}

const PAGE_BG: React.CSSProperties = {
  background: 'linear-gradient(160deg in oklab, #FFF5F8 0%, #FFF0F5 35%, #FDE8F0 65%, #FBCFE8 100%)',
}

/* ─── Props ─────────────────────────────────────────────────── */
interface FoodSelectionProps {
  onNext: (foods: string[]) => void
}

/* ─── Main component ────────────────────────────────────────── */
export function FoodSelection({ onNext }: FoodSelectionProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [customFood, setCustomFood] = useState('')

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const canProceed = selected.size > 0 || customFood.trim().length > 0

  return (
    <motion.main
      variants={screenVariant}
      initial="hidden"
      animate="visible"
      className="relative h-screen w-full overflow-y-auto"
      style={PAGE_BG}
      aria-label="Food selection screen"
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
          opacity={cfg.opacity}
        />
      ))}

      <div
        className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 py-8"
        style={{ maxWidth: 640, margin: '0 auto' }}
      >
        {/* Progress */}
        <ProgressDots step={2} />

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 800,
            color: '#C84D75',
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            lineHeight: 1.15,
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          What are we feeling? 🍽️
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            color: '#E0739A',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          (you can pick more than one btw)
        </motion.p>

        {/* Food grid — 2 cols mobile/tablet, 3 cols desktop */}
        <motion.div
          variants={gridStagger}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            width: '100%',
          }}
          className="sm:grid-cols-3"
        >
          {FOODS.map((food) => (
            <FoodCard
              key={food.id}
              emoji={food.emoji}
              label={food.label}
              selected={selected.has(food.id)}
              onToggle={() => toggle(food.id)}
            />
          ))}
        </motion.div>

        {/* Custom food input */}
        <motion.input
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          type="text"
          placeholder="What food do you want to have?"
          value={customFood}
          onChange={(e) => setCustomFood(e.target.value)}
          style={{
            width: '100%',
            marginTop: 24,
            padding: '14px 20px',
            borderRadius: 20,
            border: customFood.trim() ? '2px solid #C84D75' : '2px solid transparent',
            background: '#ffffff',
            boxShadow: '0 2px 12px 0 rgba(200,77,117,0.08)',
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: '0.95rem',
            color: '#7A2A45',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 320, damping: 24 }}
          style={{ width: '100%', marginTop: 24 }}
        >
          <DateButton
            variant="yes"
            wide
            disabled={!canProceed}
            onClick={() => {
              const allFoods = [...selected]
              if (customFood.trim()) allFoods.push(customFood.trim())
              onNext(allFoods)
            }}
          >
            this one! 🍴
          </DateButton>
        </motion.div>
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
  )
}
