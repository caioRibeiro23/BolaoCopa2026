'use server'

import { createClient } from "@/src/lib/supabase/server"

export async function getUserData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from("user_stats")
    .select("total_points")
    .eq("user_id", user.id)
    .single()

  if (error) return null

  return {
    name: user.user_metadata.full_name,
    pts: data.total_points,
    avatarUrl: user.user_metadata.avatar_url || "/copa.png"
  }
}