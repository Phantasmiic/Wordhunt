import { describe, expect, it } from 'vitest'
import { buildWordFromPath, isAdjacent, scoreForWord } from './game'

describe('scoreForWord', () => {
  it('scores by the expected table', () => {
    expect(scoreForWord('cat')).toBe(100)
    expect(scoreForWord('bear')).toBe(400)
    expect(scoreForWord('apple')).toBe(800)
    expect(scoreForWord('planet')).toBe(1400)
    expect(scoreForWord('puzzled')).toBe(1800)
    expect(scoreForWord('elephant')).toBe(2200)
  })
})

describe('isAdjacent', () => {
  it('accepts horizontal, vertical and diagonal neighbors', () => {
    expect(isAdjacent(4, 0, 1)).toBe(true)
    expect(isAdjacent(4, 0, 4)).toBe(true)
    expect(isAdjacent(4, 0, 5)).toBe(true)
  })

  it('rejects non-neighbors', () => {
    expect(isAdjacent(4, 0, 2)).toBe(false)
    expect(isAdjacent(4, 0, 10)).toBe(false)
  })
})

describe('buildWordFromPath', () => {
  it('builds a string from board indexes', () => {
    expect(buildWordFromPath(['c', 'a', 't', 's'], [0, 1, 2])).toBe('cat')
  })
})
