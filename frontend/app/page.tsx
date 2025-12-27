import React from 'react'
import { GameProvider } from './components/GameProvider'
import { Grid } from './components/Grid'
import { Keyboard } from './components/Keyboard'

export default function Page() {
  return (
    <GameProvider>
      <main className="container">
        <Grid />
        <Keyboard />
      </main>
    </GameProvider>
  )
}