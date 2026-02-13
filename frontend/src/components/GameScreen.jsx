import { useEffect, useMemo, useRef, useState } from 'react'
import { validateWord } from '../lib/api'
import { buildWordFromPath, generateBoard, isAdjacent, scoreForWord } from '../lib/game'

function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export default function GameScreen({ settings, onBackToStart }) {
  const [board, setBoard] = useState(() => generateBoard(settings.boardSize, settings.layout))
  const [secondsLeft, setSecondsLeft] = useState(settings.durationSeconds)
  const [words, setWords] = useState([])
  const [score, setScore] = useState(0)
  const [selectedPath, setSelectedPath] = useState([])
  const [status, setStatus] = useState('playing')
  const [sequenceBanner, setSequenceBanner] = useState({ text: '', state: 'neutral', points: '' })

  const activePointer = useRef(null)
  const submitting = useRef(false)
  const selectedPathRef = useRef([])
  const wordsRef = useRef([])
  const validationCacheRef = useRef(new Map())

  useEffect(() => {
    wordsRef.current = words
  }, [words])

  const updateSelectedPath = (nextPath) => {
    selectedPathRef.current = nextPath
    setSelectedPath(nextPath)
  }

  const prefetchWordValidation = (candidateWord) => {
    if (candidateWord.length < 3 || wordsRef.current.includes(candidateWord)) return
    if (validationCacheRef.current.has(candidateWord)) return

    const pending = validateWord(candidateWord)
      .then((result) => result)
      .catch(() => ({ valid: false, reason: 'network_error' }))
    validationCacheRef.current.set(candidateWord, pending)
  }

  useEffect(() => {
    if (status !== 'playing') return undefined

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setStatus('ended')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [status])

  useEffect(() => {
    if (settings.endCondition === 'target_words' && words.length >= settings.targetWords) {
      setStatus('ended')
    }
  }, [settings.endCondition, settings.targetWords, words.length])

  useEffect(() => {
    if (sequenceBanner.state !== 'success' && sequenceBanner.state !== 'warning') return undefined

    const timeout = setTimeout(() => {
      setSequenceBanner((prev) => {
        if (prev.state === 'success' || prev.state === 'warning') {
          return { text: '', state: 'neutral', points: '' }
        }
        return prev
      })
    }, 750)

    return () => clearTimeout(timeout)
  }, [sequenceBanner.state, sequenceBanner.text])

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (activePointer.current === null || event.pointerId !== activePointer.current || status !== 'playing') {
        return
      }

      const target = document.elementFromPoint(event.clientX, event.clientY)
      const tile = target?.closest?.('[data-tile-index]')
      if (!tile) return

      const nextIndex = Number(tile.getAttribute('data-tile-index'))
      const currentPath = selectedPathRef.current
      if (currentPath.length === 0) {
        const nextPath = [nextIndex]
        updateSelectedPath(nextPath)
        const nextWord = buildWordFromPath(board, nextPath).toLowerCase()
        prefetchWordValidation(nextWord)
        setSequenceBanner({ text: nextWord.toUpperCase(), state: 'neutral', points: '' })
        return
      }

      const last = currentPath[currentPath.length - 1]
      if (nextIndex === last) return
      if (currentPath.includes(nextIndex)) return
      if (!isAdjacent(settings.boardSize, last, nextIndex)) return
      const nextPath = [...currentPath, nextIndex]
      updateSelectedPath(nextPath)
      const nextWord = buildWordFromPath(board, nextPath).toLowerCase()
      prefetchWordValidation(nextWord)
      setSequenceBanner({ text: nextWord.toUpperCase(), state: 'neutral', points: '' })
    }

    const handlePointerUp = async (event) => {
      if (activePointer.current === null || event.pointerId !== activePointer.current) return
      activePointer.current = null

      const path = selectedPathRef.current
      const word = buildWordFromPath(board, path).toLowerCase()
      updateSelectedPath([])
      setSequenceBanner({
        text: word.toUpperCase(),
        state: 'neutral',
        points: '',
      })

      if (word.length < 3 || wordsRef.current.includes(word) || submitting.current) {
        setSequenceBanner({
          text: word.toUpperCase(),
          state: 'warning',
          points: '',
        })
        return
      }

      submitting.current = true
      try {
        const cachedValidation = validationCacheRef.current.get(word)
        const result = cachedValidation ? await cachedValidation : await validateWord(word)
        validationCacheRef.current.set(word, Promise.resolve(result))
        if (!result.valid) {
          setSequenceBanner({
            text: word.toUpperCase(),
            state: 'warning',
            points: '',
          })
          return
        }

        setWords((prev) => [...prev, word])
        const points = scoreForWord(word)
        setScore((prev) => prev + points)
        setSequenceBanner({
          text: word.toUpperCase(),
          state: 'success',
          points: `+${points}`,
        })
      } finally {
        submitting.current = false
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [board, settings.boardSize, status])

  const currentWord = useMemo(() => buildWordFromPath(board, selectedPath).toUpperCase(), [board, selectedPath])

  const handleTilePointerDown = (index, event) => {
    if (status !== 'playing') return
    event.currentTarget.setPointerCapture?.(event.pointerId)
    activePointer.current = event.pointerId
    const nextPath = [index]
    updateSelectedPath(nextPath)
    const nextWord = buildWordFromPath(board, nextPath).toLowerCase()
    prefetchWordValidation(nextWord)
    setSequenceBanner({ text: nextWord.toUpperCase(), state: 'neutral', points: '' })
  }

  const resetGame = () => {
    setBoard(generateBoard(settings.boardSize, settings.layout))
    setSecondsLeft(settings.durationSeconds)
    setWords([])
    setScore(0)
    updateSelectedPath([])
    setSequenceBanner({ text: '', state: 'neutral', points: '' })
    validationCacheRef.current.clear()
    setStatus('playing')
  }

  return (
    <div className="app-shell game-shell" style={{ '--page-bg': settings.backgroundColor }}>
      <div className="game-stack">
        <div className="game-header">
          <div>
            <p>words: {words.length}</p>
            <p>score: {score}</p>
          </div>
          <h2>{formatClock(secondsLeft)}</h2>
        </div>

        <div className={`sequence-banner ${sequenceBanner.state}`}>
          <span className="sequence-banner-text">{currentWord || sequenceBanner.text || '\u00A0'}</span>
          {!currentWord && sequenceBanner.points ? (
            <span className="sequence-banner-points">{sequenceBanner.points}</span>
          ) : null}
        </div>

        <div
          className="board"
          style={{ gridTemplateColumns: `repeat(${settings.boardSize}, minmax(46px, 1fr))` }}
        >
          {board.map((letter, index) => {
            const selected = selectedPath.includes(index)
            return (
              <button
                type="button"
                key={index}
                className={`tile ${selected ? 'selected' : ''}`}
                data-tile-index={index}
                onPointerDown={(event) => handleTilePointerDown(index, event)}
              >
                {letter.toUpperCase()}
              </button>
            )
          })}
        </div>
      </div>

      {status === 'ended' ? (
        <div className="end-overlay">
          <h3>Game Over</h3>
          <p>Words found: {words.length}</p>
          <p>Final score: {score}</p>
          <div className="end-actions">
            <button type="button" onClick={resetGame}>
              Play Again
            </button>
            <button type="button" onClick={onBackToStart}>
              Back
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
