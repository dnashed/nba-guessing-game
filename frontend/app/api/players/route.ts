import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')

    if (error) throw error
    if (!data || data.length === 0) throw new Error('No players found')

    const randomPlayer = data[Math.floor(Math.random() * data.length)]
    return NextResponse.json({
      name: randomPlayer.player,
      team: randomPlayer.team,
      conference: randomPlayer.conference,
      division: randomPlayer.division,
      pos: randomPlayer.pos,
      height_ft: randomPlayer.height_ft,
      age: randomPlayer.age
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch player' }, { status: 500 })
  }
}