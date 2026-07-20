import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LandingPage } from './pages/LandingPage'
import { CelebrationScreen } from './components/CelebrationScreen'
import { ConfettiExplosion } from './components/ConfettiExplosion'
import { DateTimeCard } from './components/DateTimeCard'
import { FoodSelection } from './components/FoodSelection'
import { FinalSummary } from './components/FinalSummary'

type Screen = 'landing' | 'celebration' | 'datetime' | 'food' | 'summary'

interface AppState {
  date: string
  time: string
  notes: string
  foods: string[]
}

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [showConfetti, setShowConfetti] = useState(false)
  const [state, setState] = useState<AppState>({ date: '', time: '', notes: '', foods: [] })

  function handleYes() {
    setShowConfetti(true)
    setTimeout(() => setScreen('celebration'), 600)
    setTimeout(() => setShowConfetti(false), 3500)
  }

  function handleDateNext(date: string, time: string, notes: string) {
    setState((s) => ({ ...s, date, time, notes }))
    setScreen('food')
  }

  function handleFoodNext(foods: string[]) {
    setState((s) => ({ ...s, foods }))
    setScreen('summary')
  }

  const slideExit = { opacity: 0, scale: 0.96, transition: { duration: 0.35, ease: 'easeInOut' } }

  return (
    <>
      {showConfetti && <ConfettiExplosion />}

      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <motion.div key="landing" exit={slideExit} style={{ height: '100vh' }}>
            <LandingPage onYes={handleYes} />
          </motion.div>
        )}

        {screen === 'celebration' && (
          <motion.div key="celebration" exit={slideExit} style={{ height: '100vh' }}>
            <CelebrationScreen onNext={() => setScreen('datetime')} />
          </motion.div>
        )}

        {screen === 'datetime' && (
          <motion.div key="datetime" exit={slideExit} style={{ height: '100vh' }}>
            <DateTimeCard onNext={handleDateNext} />
          </motion.div>
        )}

        {screen === 'food' && (
          <motion.div key="food" exit={slideExit} style={{ minHeight: '100vh' }}>
            <FoodSelection onNext={handleFoodNext} />
          </motion.div>
        )}

        {screen === 'summary' && (
          <motion.div key="summary" style={{ minHeight: '100vh' }}>
            <FinalSummary
              date={state.date}
              time={state.time}
              notes={state.notes}
              foods={state.foods}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
