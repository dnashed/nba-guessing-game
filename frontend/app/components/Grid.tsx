'use client'
import React from 'react'
import { useGame } from '../components/GameProvider'

const getClass = (state: string) => {
  switch (state) {
    case 'correct': return 'correct'
    case 'close': return 'close'
    default: return ''
  }
}

export const Grid: React.FC = () => {
  const { guesses, maxGuesses, gameOver, gameWon, targetPlayer, guessError } = useGame()

  return (
    <div className="grid" aria-label="Guesses grid">
      {guessError && <div className="error-message">{guessError}</div>}
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Team</th>
            <th>Conference</th>
            <th>Division</th>
            <th>Position</th>
            <th>Height</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {guesses.map((guess, idx) => (
            <tr key={idx}>
              <td>{guess.player.name}</td>
              <td className={getClass(guess.feedback.team)}>{guess.player.team}</td>
              <td className={getClass(guess.feedback.conference)}>{guess.player.conference}</td>
              <td className={getClass(guess.feedback.division)}>{guess.player.division}</td>
              <td className={getClass(guess.feedback.pos)}>{guess.player.pos}</td>
              <td className={getClass(guess.feedback.height_ft)}>{guess.player.height_ft}</td>
              <td className={getClass(guess.feedback.age)}>{guess.player.age}</td>
            </tr>
          ))}
          {Array.from({ length: maxGuesses - guesses.length }).map((_, idx) => (
            <tr key={`empty-${idx}`}>
              <td colSpan={7}></td>
            </tr>
          ))}
        </tbody>
      </table>
      {gameOver && (
        <div className="game-result">
          <h2>{gameWon ? 'Congratulations! You won!' : 'Game Over'}</h2>
          <p>The correct player was: <strong>{targetPlayer?.name}</strong></p>
        </div>
      )}
    </div>
  )
}