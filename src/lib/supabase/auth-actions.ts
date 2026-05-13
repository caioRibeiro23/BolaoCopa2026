'use server'

import { createClient } from "@/src/lib/supabase/server"
import { translateSupabaseError } from "@/src/utils/supabase-errors"
import { redirect } from "next/navigation"

export type AuthActionState = {
  error: string
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/

function readString(formData: FormData, field: string) {
  const value = formData.get(field)
  return typeof value === "string" ? value.trim() : ""
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = readString(formData, "email")
  const password = readString(formData, "password")

  if (!email || !password) {
    return { error: "Preencha e-mail e senha para continuar." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: translateSupabaseError(error) }
  }

  redirect("/")
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const fullName = readString(formData, "fullName")
  const email = readString(formData, "email")
  const password = readString(formData, "password")
  const confirmPassword = readString(formData, "confirmPassword")

  if (!fullName) {
    return { error: "Nome completo é obrigatório." }
  }

  if (!email || !password || !confirmPassword) {
    return { error: "Preencha todos os campos para criar a conta." }
  }

  if (password.length < 8 || !passwordRegex.test(password)) {
    return {
      error:
        "A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.",
    }
  }

  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: translateSupabaseError(error) }
  }

  redirect("/login?registered=true")
}