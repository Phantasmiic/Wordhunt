import { useState } from 'react'
import GameScreen from './components/GameScreen'
import StartScreen from './components/StartScreen'

const DEFAULT_SETTINGS = {
  boardSize: 4,
  layout: 'balanced_vowels',
  durationSeconds: 80,
  endCondition: 'timer',
  targetWords: 20,
  backgroundColor: '#3ea357',
}

export default function App() {
  const [phase, setPhase] = useState('start')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  const handleSettingsChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (phase === 'start') {
    return (
      <>
        <div className="top-greeting">Hi Phoebe :)</div>
        <StartScreen
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onStart={() => setPhase('playing')}
        />
      </>
    )
  }

  return (
    <>
      <div className="top-greeting">Hi Phoebe :)</div>
      <GameScreen settings={settings} onBackToStart={() => setPhase('start')} />
    </>
  )
}
