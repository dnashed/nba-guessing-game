'use client'
import React from 'react'
import { useGame } from './GameProvider'

export const Header: React.FC = () => {
  const { gameOver, gameWon, guesses, maxGuesses } = useGame()

  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        🏀 NBA Player Guesser
      </h1>
      <p className="text-gray-600 mb-4">
        Guess the mystery NBA player in 8 tries or less!
      </p>

      <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
        <span className="bg-white px-3 py-1 rounded-full shadow-sm">
          Guesses: {guesses.length}/{maxGuesses}
        </span>
        {gameOver && (
          <span className={`px-3 py-1 rounded-full shadow-sm ${
            gameWon ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {gameWon ? '🎉 Won!' : '❌ Lost'}
          </span>
        )}
      </div>
    </header>
  )
}