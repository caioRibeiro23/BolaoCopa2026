import { loginAction } from "@/src/lib/supabase/auth-actions"
import LoginForm from "../../components/login/login-form"

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {}
  const registered = params.registered === "true"

  return <LoginForm action={loginAction} registered={registered} />
}

