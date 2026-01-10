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
  gameMode: 'daily' | 'unlimited'
  setGameMode: (mode: 'daily' | 'unlimited') => void
  timeUntilNextDaily: string
}

const GameContext = createContext<GameContextShape | undefined>(undefined)

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const maxGuesses = 8
  const [gameMode, setGameMode] = useState<'daily' | 'unlimited'>('unlimited')
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [targetPlayer, setTargetPlayer] = useState<Player | null>(null)
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [guessError, setGuessError] = useState<string | null>(null)
  const [timeUntilNextDaily, setTimeUntilNextDaily] = useState('')

  // calculate time until next daily reset (midnight EST)
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      
      const estOffset = -5 * 60 * 60 * 1000 // EST is UTC-5
      const estNow = new Date(now.getTime() + estOffset)
      
      const nextMidnightEST = new Date(estNow)
      nextMidnightEST.setHours(24, 0, 0, 0)
      
      const nextMidnightLocal = new Date(nextMidnightEST.getTime() - estOffset)
      const diff = nextMidnightLocal.getTime() - now.getTime()
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeUntilNextDaily(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // load saved game mode
    const savedMode = localStorage.getItem('gameMode') as 'daily' | 'unlimited' | null
    if (savedMode) {
      setGameMode(savedMode)
    }

    // load saved daily game state if in daily mode
    if (savedMode === 'daily') {
      const now = new Date()
      const estOffset = -5 * 60 * 60 * 1000 // EST is UTC-5
      const estDate = new Date(now.getTime() + estOffset)
      const today = estDate.toISOString().split('T')[0]
      const savedDailyState = localStorage.getItem(`daily-game-${today}`)
      if (savedDailyState) {
        const state = JSON.parse(savedDailyState)
        setGuesses(state.guesses || [])
        setGameOver(state.gameOver || false)
        setGameWon(state.gameWon || false)
      }
    }

    // fetch target player based on mode
    const endpoint = savedMode === 'daily' ? '/api/players/daily' : '/api/players'
    fetch(endpoint)
      .then(res => res.json())
      .then(player => setTargetPlayer(player))
      .catch(err => console.error('Failed to fetch target player:', err))

    // fetch all players for validation
    fetch('/api/players/list')
      .then(res => res.json())
      .then(players => setAllPlayers(players))
      .catch(err => console.error('Failed to fetch players list:', err))
  }, [gameMode])

  const submitGuess = useCallback((playerName: string) => {
    if (!targetPlayer || !playerName.trim()) return
    const guessedPlayer = allPlayers.find(p => p.name.toLowerCase() === playerName.toLowerCase().trim())
    if (!guessedPlayer) return // invalid player

    // check if player has already been guessed
    if (guesses.some(g => g.player.name === guessedPlayer.name)) {
      setGuessError(`You already guessed ${guessedPlayer.name}!`)
      return
    }

    setGuessError(null) // clear any previous error

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
      const isGameOver = newGuesses.length >= maxGuesses;
      const isWon = guessedPlayer.name === targetPlayer.name;
      
      if (isGameOver) setGameOver(true);
      if (isWon) {
        setGameWon(true);
        setGameOver(true);
      }

      // save daily game state
      if (gameMode === 'daily') {
        const now = new Date()
        const estOffset = -5 * 60 * 60 * 1000 // EST is UTC-5
        const estDate = new Date(now.getTime() + estOffset)
        const today = estDate.toISOString().split('T')[0]
        localStorage.setItem(`daily-game-${today}`, JSON.stringify({
          guesses: newGuesses,
          gameOver: isGameOver || isWon,
          gameWon: isWon
        }))
      }

      return newGuesses;
    })
    setCurrentGuess('')
  }, [targetPlayer, allPlayers, gameMode, maxGuesses, guesses])

  const handleSetGameMode = useCallback((mode: 'daily' | 'unlimited') => {
    setGameMode(mode)
    localStorage.setItem('gameMode', mode)
    
    // reset game state
    setGuesses([])
    setGameOver(false)
    setGameWon(false)
    setGuessError(null)
    
    // load daily game state if switching to daily mode
    if (mode === 'daily') {
      const now = new Date()
      const estOffset = -5 * 60 * 60 * 1000 
      const estDate = new Date(now.getTime() + estOffset)
      const today = estDate.toISOString().split('T')[0]
      const savedDailyState = localStorage.getItem(`daily-game-${today}`)
      if (savedDailyState) {
        const state = JSON.parse(savedDailyState)
        setGuesses(state.guesses || [])
        setGameOver(state.gameOver || false)
        setGameWon(state.gameWon || false)
      }
    }
  }, [])

  return (
    <GameContext.Provider value={{ 
      guesses, 
      currentGuess, 
      submitGuess, 
      maxGuesses, 
      targetPlayer, 
      allPlayers, 
      gameOver, 
      gameWon, 
      guessError,
      gameMode,
      setGameMode: handleSetGameMode,
      timeUntilNextDaily
    }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be inside GameProvider')
  return ctx
}