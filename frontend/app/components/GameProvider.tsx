'use client'
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

type Player = {
  name: string
  team: string
  conference: string
  division: string
  pos: string
  height_ft: number
  age: number
}

type Feedback = {
  team: 'correct' | 'wrong'
  conference: 'correct' | 'wrong'
  division: 'correct' | 'wrong'
  pos: 'correct' | 'wrong'
  height_ft: 'correct' | 'close' | 'higher' | 'lower'
  age: 'correct' | 'close' | 'higher' | 'lower'
}

type Guess = {
  player: Player
  feedback: Feedback
}

type GameContextShape = {
  guesses: Guess[]
  currentGuess: string
  submitGuess: (playerName: string) => void
  maxGuesses: number
  targetPlayer: Player | null
  allPlayers: Player[]
  gameOver: boolean
  gameWon: boolean
  guessError: string | null
}

const GameContext = createContext<GameContextShape | undefined>(undefined)

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const maxGuesses = 8
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [targetPlayer, setTargetPlayer] = useState<Player | null>(null)
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [guessError, setGuessError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch target player
    fetch('/api/players')
      .then(res => res.json())
      .then(player => setTargetPlayer(player))
      .catch(err => console.error('Failed to fetch target player:', err))

    // Fetch all players for validation
    fetch('/api/players/list')
      .then(res => res.json())
      .then(players => setAllPlayers(players))
      .catch(err => console.error('Failed to fetch players list:', err))
  }, [])

  const submitGuess = useCallback((playerName: string) => {
    if (!targetPlayer || !playerName.trim()) return
    const guessedPlayer = allPlayers.find(p => p.name.toLowerCase() === playerName.toLowerCase().trim())
    if (!guessedPlayer) return // Invalid player

    // Check if player has already been guessed
    if (guesses.some(g => g.player.name === guessedPlayer.name)) {
      setGuessError(`You already guessed ${guessedPlayer.name}!`)
      return
    }

    setGuessError(null) // Clear any previous error

    const feedback: Feedback = {
      team: guessedPlayer.team === targetPlayer.team ? 'correct' : 'wrong',
      conference: guessedPlayer.conference === targetPlayer.conference ? 'correct' : 'wrong',
      division: guessedPlayer.division === targetPlayer.division ? 'correct' : 'wrong',
      pos: guessedPlayer.pos === targetPlayer.pos ? 'correct' : 'wrong',
      height_ft: (() => {
        const diff = Math.abs(guessedPlayer.height_ft - targetPlayer.height_ft);
        if (diff === 0) return 'correct';
        if (diff <= 0.2) return 'close';
        return guessedPlayer.height_ft > targetPlayer.height_ft ? 'higher' : 'lower';
      })(),
      age: (() => {
        const diff = Math.abs(guessedPlayer.age - targetPlayer.age);
        if (diff === 0) return 'correct';
        if (diff <= 2) return 'close';
        return guessedPlayer.age > targetPlayer.age ? 'higher' : 'lower';
      })()
    }

    setGuesses(g => {
      const newGuesses = [...g, { player: guessedPlayer, feedback }];
      if (newGuesses.length >= maxGuesses) {
        setGameOver(true);
      }
      if (guessedPlayer.name === targetPlayer.name) {
        setGameWon(true);
        setGameOver(true);
      }
      return newGuesses;
    })
    setCurrentGuess('')
  }, [targetPlayer, allPlayers])

  return (
    <GameContext.Provider value={{ guesses, currentGuess, submitGuess, maxGuesses, targetPlayer, allPlayers, gameOver, gameWon, guessError }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be inside GameProvider')
  return ctx
}