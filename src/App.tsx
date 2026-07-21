import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LandingPage } from './pages/LandingPage'
import { CelebrationScreen } from './components/CelebrationScreen'
import { ConfettiExplosion } from './components/ConfettiExplosion'
import { DateTimeCard } from './components/DateTimeCard'
import { FoodSelection } from './components/FoodSelection'
import { FinalSummary } from './components/FinalSummary'
import { AboutYouCard } from './components/AboutYouCard'

type Screen = 'landing' | 'celebration' | 'datetime' | 'food' | 'about-you' | 'writing-message' | 'summary'

const LeftArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
)

const RightArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
)

interface AppState {
  date: string
  time: string
  notes: string
  foods: string[]
  customFood: string
  place: string
  name: string
  gender: string
}

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [showConfetti, setShowConfetti] = useState(false)
  const [state, setState] = useState<AppState>({ date: '', time: '', notes: '', foods: [], customFood: '', place: '', name: '', gender: '' })

  function handleUpdate(updates: Partial<AppState>) {
    setState(s => ({ ...s, ...updates }))
  }

  const navOrder: Screen[] = ['landing', 'datetime', 'food', 'about-you', 'summary']
  const showArrows = screen === 'landing' || screen === 'datetime' || screen === 'food' || screen === 'about-you'
  const currentIndex = navOrder.indexOf(screen)

  function canTraverseNext() {
    if (screen === 'landing') return false
    if (screen === 'datetime') return state.date.trim() !== '' && state.time.trim() !== ''
    if (screen === 'food') return state.foods.length > 0 || state.customFood.trim() !== '' || state.place.trim() !== ''
    if (screen === 'about-you') return state.name.trim() !== '' && state.gender !== ''
    return false
  }

  function handleBack() {
    if (currentIndex > 0) setScreen(navOrder[currentIndex - 1])
  }
  
  function handleNext() {
    if (currentIndex !== -1 && currentIndex < navOrder.length - 1) {
      setScreen(navOrder[currentIndex + 1])
    }
  }

  function handleYes() {
    setShowConfetti(true)
    setTimeout(() => setScreen('celebration'), 600)
    setTimeout(() => setShowConfetti(false), 3500)
  }

  function handleDateNext() {
    setScreen('food')
  }

  function handleFoodNext() {
    setScreen('about-you')
  }

  const slideExit = { opacity: 0, scale: 0.96, transition: { duration: 0.35, ease: 'easeInOut' as const } }

  return (
    <>
      {showArrows && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={handleBack}
              aria-label="Go back"
              className="fixed top-6 left-6 z-50 p-2 rounded-full hover:bg-pink-100 text-pink-400 transition-colors"
            >
              <LeftArrowIcon />
            </button>
          )}
          {currentIndex < navOrder.length - 1 && screen !== 'landing' && (
            <button
              onClick={handleNext}
              disabled={!canTraverseNext()}
              aria-label="Skip to next"
              className={`fixed top-6 right-6 z-50 p-2 rounded-full transition-colors ${
                canTraverseNext()
                  ? 'hover:bg-pink-100 text-pink-400 cursor-pointer'
                  : 'text-gray-300 cursor-not-allowed opacity-50'
              }`}
            >
              <RightArrowIcon />
            </button>
          )}
        </>
      )}

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
            <DateTimeCard
              date={state.date}
              time={state.time}
              notes={state.notes}
              onUpdate={handleUpdate}
              onNext={handleDateNext}
            />
          </motion.div>
        )}

        {screen === 'food' && (
          <motion.div key="food" exit={slideExit} style={{ minHeight: '100vh' }}>
            <FoodSelection
              foods={state.foods}
              customFood={state.customFood}
              place={state.place}
              onUpdate={handleUpdate}
              onNext={handleFoodNext}
            />
          </motion.div>
        )}

        {screen === 'about-you' && (
          <motion.div key="about-you" exit={slideExit} style={{ height: '100vh' }}>
            <AboutYouCard
              name={state.name}
              gender={state.gender}
              onUpdate={handleUpdate}
              onNext={() => setScreen('writing-message')}
            />
          </motion.div>
        )}

        {screen === 'writing-message' && (
          <motion.div key="writing-message" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg in oklab, #FFF5F8 0%, #FFF0F5 35%, #FDE8F0 65%, #FBCFE8 100%)' }}>
            <p style={{ fontFamily: '"Inter", system-ui, sans-serif', color: '#C84D75', fontSize: '1.2rem' }}>✍️ Writing your message…</p>
          </motion.div>
        )}

        {screen === 'summary' && (
          <motion.div key="summary" style={{ minHeight: '100vh' }}>
            <FinalSummary
              date={state.date}
              time={state.time}
              notes={state.notes}
              foods={[...state.foods, ...(state.customFood.trim() ? [state.customFood.trim()] : [])]}
              place={state.place}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
