import { loginAction } from "@/src/lib/supabase/auth-actions"
import { createClient } from "@/src/lib/supabase/server"
import LoginForm from "../../components/login/login-form"
import { redirect } from "next/navigation"

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/")
  }

  const params = searchParams ? await searchParams : {}
  const registered = params.registered === "true"

  return <LoginForm action={loginAction} registered={registered} />
}

