import React from 'react'
import { GameProvider } from './components/GameProvider'
import { Header } from './components/Header'
import { GameBoard } from './components/GameBoard'
import { GuessInput } from './components/GuessInput'

export default function Page() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Header />
          <GameBoard />
          <GuessInput />
        </div>
      </div>
    </GameProvider>
  )
}