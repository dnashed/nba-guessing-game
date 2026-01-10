'use client'
import React, { useState } from 'react'
import { useGame } from './GameProvider'

export const GuessInput: React.FC = () => {
  const { submitGuess, allPlayers, gameOver } = useGame()
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gameOver && input.trim()) {
      submitGuess(input)
      setInput('')
    }
  }

  console.log('All players count:', allPlayers.length)
  const suggestions = allPlayers
    .filter(p => p.name.toLowerCase().includes(input.toLowerCase()) && input.length > 0)
    .slice(0, 5)

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Make Your Guess
        </h2>
        <p className="text-gray-600 text-sm">
          Type a player's name and select from suggestions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter NBA player name..."
            list="players"
            className="text-gray-800 placeholder:text-gray-800 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg"
            disabled={gameOver}
          />
          <datalist id="players">
            {suggestions.map(p => (
              <option key={p.name} value={p.name} />
            ))}
          </datalist>
        </div>

        <button
          type="submit"
          disabled={gameOver || !input.trim()}
          className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
            gameOver || !input.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {gameOver ? 'Game Over' : 'Submit Guess'}
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mb-2">
            {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} available
          </p>
        </div>
      )}
    </div>
  )
}