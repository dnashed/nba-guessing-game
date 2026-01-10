import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'placeholder-key'
const supabase = createClient(supabaseUrl, supabaseKey)

function getDailySeed() {
  const now = new Date()
  // convert to EST (UTC-5)
  const estOffset = -5 * 60 * 60 * 1000
  const estDate = new Date(now.getTime() + estOffset)
  const year = estDate.getUTCFullYear()
  const month = estDate.getUTCMonth() + 1
  const day = estDate.getUTCDate()
  return `${year}-${month}-${day}`
}

function seededRandom(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // convert to 32bit integer
  }
  // convert to positive number between 0 and 1
  const x = Math.sin(Math.abs(hash)) * 10000
  return x - Math.floor(x)
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')

    if (error) throw error
    if (!data || data.length === 0) throw new Error('No players found')

    const dailySeed = getDailySeed()
    const randomValue = seededRandom(dailySeed)
    const index = Math.floor(randomValue * data.length)
    const dailyPlayer = data[index]

    return NextResponse.json({
      name: dailyPlayer.player,
      team: dailyPlayer.team,
      conference: dailyPlayer.conference,
      division: dailyPlayer.division,
      pos: dailyPlayer.pos,
      height_ft: dailyPlayer.height_ft,
      age: dailyPlayer.age,
      date: dailySeed
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch daily player' }, { status: 500 })
  }
}
