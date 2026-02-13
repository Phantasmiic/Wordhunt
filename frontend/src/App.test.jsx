import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App start flow', () => {
  it('moves from start screen to game screen', () => {
    render(<App />)

    expect(screen.getByText('Word Hunt')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Start' }))

    expect(screen.getByText(/words:/i)).toBeInTheDocument()
    expect(screen.getByText(/score:/i)).toBeInTheDocument()
  })
})
