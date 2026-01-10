'use client'
import React from 'react'
import { useGame } from '../components/GameProvider'

export const GuessHistory: React.FC = () => {
  const { guesses } = useGame()
  return (
    <aside className="guess-history" aria-label="Guess history">
      <h3>History</h3>
      <table className="history-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Team</th>
            <th>Conf</th>
            <th>Div</th>
            <th>Pos</th>
            <th>Height</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {guesses.map((g, i) => (
            <tr key={i}>
              <td>{g.player.name}</td>
              <td>{g.feedback.team}</td>
              <td>{g.feedback.conference}</td>
              <td>{g.feedback.division}</td>
              <td>{g.feedback.pos}</td>
              <td>{g.feedback.height_ft}</td>
              <td>{g.feedback.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  )
}