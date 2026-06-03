import { createClient } from "./client";

export async function sendEmailRecoveryPasswordAction(email: string) {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
    })
    if (error)
        throw new Error(error.message)
}    

export async function resetPassword(new_password: string) {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
        password: new_password
    })
    if (error)
        throw new Error(error.message)
}