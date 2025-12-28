'use client'
import React, { useState } from 'react'
import { useGame } from '../components/GameProvider'

export const Keyboard: React.FC = () => {
  const { submitGuess, allPlayers, gameOver } = useGame()
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gameOver) {
      submitGuess(input)
      setInput('')
    }
  }

  const suggestions = allPlayers
    .filter(p => p.name.toLowerCase().includes(input.toLowerCase()) && input.length > 0)
    .slice(0, 5) 

  return (
    <div className="keyboard" role="group" aria-label="Player guess input">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter player name"
          list="players"
          className="player-input"
          disabled={gameOver}
        />
        <datalist id="players">
          {suggestions.map(p => (
            <option key={p.name} value={p.name} />
          ))}
        </datalist>
        <button type="submit" disabled={gameOver}>Guess</button>
      </form>
    </div>
  )
}