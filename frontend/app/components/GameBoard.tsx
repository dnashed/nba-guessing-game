'use client'
import React from 'react'
import { useGame } from './GameProvider'

const getFeedbackStyles = (state: string) => {
  switch (state) {
    case 'correct':
      return 'bg-green-500 text-white border-green-600 shadow-lg'
    case 'close':
      return 'bg-yellow-500 text-white border-yellow-600 shadow-lg'
    case 'wrong':
      return 'bg-gray-300 text-gray-700 border-gray-400'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}

const getHeightFeedbackStyles = (state: string) => {
  switch (state) {
    case 'correct':
      return 'bg-green-500 text-white border-green-600 shadow-lg'
    case 'close':
      return 'bg-yellow-500 text-white border-yellow-600 shadow-lg'
    case 'higher':
      return 'bg-gray-100 text-gray-700 border-gray-300'
    case 'lower':
      return 'bg-gray-100 text-gray-700 border-gray-300'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}

const getAgeFeedbackStyles = (state: string) => {
  switch (state) {
    case 'correct':
      return 'bg-green-500 text-white border-green-600 shadow-lg'
    case 'close':
      return 'bg-yellow-500 text-white border-yellow-600 shadow-lg'
    case 'higher':
      return 'bg-gray-100 text-gray-700 border-gray-300'
    case 'lower':
      return 'bg-gray-100 text-gray-700 border-gray-300'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}

export const GameBoard: React.FC = () => {
  const { guesses, maxGuesses, gameOver, gameWon, targetPlayer, guessError, gameMode } = useGame()

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
      {guessError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center font-medium">
          {guessError}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Player</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Team</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Conference</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Division</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Position</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Height</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Age</th>
            </tr>
          </thead>
          <tbody>
            {guesses.map((guess, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">
                  {guess.player.name}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border-2 ${getFeedbackStyles(guess.feedback.team)}`}>
                    {guess.player.team}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border-2 ${getFeedbackStyles(guess.feedback.conference)}`}>
                    {guess.player.conference}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border-2 ${getFeedbackStyles(guess.feedback.division)}`}>
                    {guess.player.division}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border-2 ${getFeedbackStyles(guess.feedback.pos)}`}>
                    {guess.player.pos}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border-2 ${getHeightFeedbackStyles(guess.feedback.height_ft)}`}>
                    {guess.player.height_ft.toFixed(2)} ft
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border-2 ${getAgeFeedbackStyles(guess.feedback.age)}`}>
                    {guess.player.age}
                  </span>
                </td>
              </tr>
            ))}
            {Array.from({ length: maxGuesses - guesses.length }).map((_, idx) => (
              <tr key={`empty-${idx}`} className="border-b border-gray-100">
                <td colSpan={7} className="py-4 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {gameOver && (
        <div className={`mt-6 p-4 rounded-lg text-center ${
          gameWon
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <h3 className={`text-xl font-bold mb-2 ${
            gameWon ? 'text-green-800' : 'text-red-800'
          }`}>
            {gameWon ? 'Congratulations! You Won!' : '🥀 Game Over'}
          </h3>
          <p className="text-gray-700">
            The correct player was: <span className="font-semibold text-gray-900">{targetPlayer?.name}</span>
          </p>
          {gameMode === 'unlimited' && (
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Play Again
            </button>
          )}
        </div>
      )}
    </div>
  )
}