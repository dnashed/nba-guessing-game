import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('player, team, conference, division, pos, height_ft, age')

    if (error) throw error

    const players = data.map(p => ({
      name: p.player,
      team: p.team,
      conference: p.conference,
      division: p.division,
      pos: p.pos,
      height_ft: p.height_ft,
      age: p.age
    }))

    return NextResponse.json(players)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 })
  }
}