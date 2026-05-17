import { AuthError } from "@supabase/supabase-js"

export function translateSupabaseError(error: AuthError) {
    const codeMap: Record<string, string> = {
        invalid_credentials: "Email ou senha inválidos.",
        email_not_confirmed: "Confirme seu email antes de fazer login.",
        user_already_exists: "Este email já está cadastrado.",
        over_email_send_rate_limit:"Muitas tentativas. Aguarde alguns minutos.",
    }

    const messageMap: Record<string, string> = {
        "Invalid login credentials": "Email ou senha inválidos.",
        "Email not confirmed": "Confirme seu email antes de fazer login.",
        "User already registered": "Este email já está cadastrado.",
        "Unable to validate email address: invalid format": "Formato de email inválido.",
        "Email rate limit exceeded": "Muitas tentativas. Tente novamente mais tarde.",
    }

    return (
        codeMap[error.code || ""] ||
        messageMap[error.message] ||
        "Ocorreu um erro inesperado."
    )
}