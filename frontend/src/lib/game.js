const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const VOWELS = 'aeiou'

export const SCORE_BY_LENGTH = {
  3: 100,
  4: 400,
  5: 800,
  6: 1400,
  7: 1800,
  8: 2200,
}

export function scoreForWord(word) {
  const length = word.length
  if (length < 3) return 0
  if (length >= 8) return SCORE_BY_LENGTH[8]
  return SCORE_BY_LENGTH[length] || 0
}

function randomLetter(pool) {
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}

export function generateBoard(size, layout) {
  const letters = []
  for (let i = 0; i < size * size; i += 1) {
    if (layout === 'balanced_vowels') {
      const useVowel = Math.random() < 0.38
      letters.push(randomLetter(useVowel ? VOWELS : ALPHABET))
    } else {
      letters.push(randomLetter(ALPHABET))
    }
  }
  return letters
}

export function isAdjacent(size, fromIndex, toIndex) {
  const fromRow = Math.floor(fromIndex / size)
  const fromCol = fromIndex % size
  const toRow = Math.floor(toIndex / size)
  const toCol = toIndex % size
  const rowDiff = Math.abs(fromRow - toRow)
  const colDiff = Math.abs(fromCol - toCol)

  return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)
}

export function buildWordFromPath(board, path) {
  return path.map((index) => board[index]).join('')
}
