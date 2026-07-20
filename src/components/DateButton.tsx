/**
 * DateButton — a reusable CTA button with two visual variants:
 *
 *  "yes"  — pink gradient, white text, soft shadow
 *  "no"   — white background, rose border/text, subtle shadow
 *
 * Framer Motion handles hover (scale + brightness) and tap (slight shrink).
 * Only `transform` and `filter` are animated — GPU-composited per CSS guide.
 */
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface DateButtonProps {
  variant: 'yes' | 'no'
  children: ReactNode
  onClick?: () => void
  /** Renders full-width (100%) instead of fixed 170px */
  wide?: boolean
  /** Mutes gradient and blocks interaction */
  disabled?: boolean
}

const YES_STYLE: React.CSSProperties = {
  width: 180,
  height: 50,
  borderRadius: 9999,
  border: 'none',
  background: 'linear-gradient(180deg, #D4668B 0%, #B73B62 100%)',
  color: '#ffffff',
  fontSize: '1.125rem',
  fontWeight: 700,
  fontFamily: '"Inter", system-ui, sans-serif',
  letterSpacing: '0.06em',
  cursor: 'pointer',
  boxShadow: '0 4px 14px 0 rgba(200, 77, 117, 0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  outline: 'none',
  willChange: 'transform, filter',
}

const NO_STYLE: React.CSSProperties = {
  width: 180,
  height: 50,
  borderRadius: 9999,
  border: '2px solid #C84D75',
  background: '#ffffff',
  color: '#C84D75',
  fontSize: '1.125rem',
  fontWeight: 600,
  fontFamily: '"Inter", system-ui, sans-serif',
  letterSpacing: '0.06em',
  cursor: 'pointer',
  boxShadow: '0 2px 12px 0 rgba(200, 77, 117, 0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  outline: 'none',
  willChange: 'transform',
}

export function DateButton({ variant, children, onClick, wide, disabled }: DateButtonProps) {
  const baseStyle = variant === 'yes' ? YES_STYLE : NO_STYLE

  const computedStyle: React.CSSProperties = {
    ...baseStyle,
    ...(wide ? { width: '100%' } : {}),
    ...(disabled && variant === 'yes' ? {
      background: 'linear-gradient(135deg in oklab, #F5C6D6 0%, #EBA3BA 60%, #D989A8 100%)',
      boxShadow: '0 2px 8px 0 rgba(200, 77, 117, 0.12)',
      cursor: 'not-allowed',
    } : {}),
  }

  const whileHover =
    disabled ? {} :
    variant === 'yes'
      ? { scale: 1.03, filter: 'brightness(1.1)' }
      : { scale: 1.04 }

  return (
    <motion.button
      style={computedStyle}
      whileHover={whileHover}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={variant === 'yes' ? 'Yes, I would love to!' : 'No thank you'}
      aria-disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
