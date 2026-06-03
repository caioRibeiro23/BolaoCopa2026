import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);

    const code = searchParams.get("code");

    // If a code is present, forward it to the client so the browser
    // (which has the PKCE verifier in storage) can complete the exchange.
    if (code) {
        const forwardUrl = `${origin}/recovery-password?${searchParams.toString()}`;
        console.log('[auth/confirm] forwarding to client with params:', forwardUrl);
        return NextResponse.redirect(forwardUrl);
    }

    return NextResponse.redirect(`${origin}/recovery-password`);
}