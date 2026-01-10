'use client'
import React from 'react'
import { useGame } from './GameProvider'

export const Header: React.FC = () => {
  const { gameOver, gameWon, guesses, maxGuesses, gameMode, setGameMode, timeUntilNextDaily } = useGame()

  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        NBA Player Guesser
      </h1>
      <p className="text-gray-600 mb-4">
        Guess the mystery NBA player in 8 tries or less!
      </p>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setGameMode('daily')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            gameMode === 'daily'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Daily Challenge
        </button>
        <button
          onClick={() => setGameMode('unlimited')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            gameMode === 'unlimited'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Unlimited Mode
        </button>
      </div>

      {/* Timer for Daily Mode */}
      {gameMode === 'daily' && (
        <div className="mb-4 text-sm text-gray-600">
          Next daily challenge in: <span className="font-mono font-bold text-orange-600">{timeUntilNextDaily}</span>
        </div>
      )}

      <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
        <span className="bg-white px-3 py-1 rounded-full shadow-sm">
          Guesses: {guesses.length}/{maxGuesses}
        </span>
        {gameOver && (
          <span className={`px-3 py-1 rounded-full shadow-sm ${
            gameWon ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {gameWon ? 'Won!' : 'Lost'}
          </span>
        )}
      </div>
    </header>
  )
}