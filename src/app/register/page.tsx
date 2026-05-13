import { registerAction } from "@/src/lib/supabase/auth-actions"
import RegisterForm from "./register-form"

export default function RegisterPage() {
  return <RegisterForm action={registerAction} />
}