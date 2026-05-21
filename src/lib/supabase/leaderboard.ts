'use server'

import { createClient } from "@/src/lib/supabase/server"

export async function getLeaderboard() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("position", { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  return data
}