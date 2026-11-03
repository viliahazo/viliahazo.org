import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { getDb } from "@/lib/db";
import { buildSessionUser, sessionCookie } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (error) {
    console.error("[auth/callback] OAuth error:", error, errorDescription);
    return NextResponse.redirect(new URL("/hiditra?error=oauth_failed", request.url));
  }

  // Si aucun `code` en query param, le token peut être dans le fragment d'URL #access_token=...
  // qui n'est accessible que côté navigateur. On sert un script client qui le transmet à /api/auth/oauth-token.
  if (!code) {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Fanamarinana / Authentification</title>
</head>
<body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#fbfbf9;color:#2c221e;">
  <div style="text-align:center;">
    <p style="font-size:14px;font-weight:600;">Eo am-pidirana amin'ny alalan'ny Google...</p>
    <p style="font-size:12px;color:#78655c;">Connexion avec Google en cours...</p>
  </div>
  <script>
    const hash = window.location.hash;
    if (hash && hash.includes("access_token=")) {
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const accessToken = params.get("access_token");
      fetch("/api/auth/oauth-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken })
      })
      .then(r => r.json())
      .then(d => {
        if (d.ok && d.redirect) {
          window.location.assign(d.redirect);
        } else {
          window.location.assign("/hiditra?error=oauth_failed");
        }
      })
      .catch(() => window.location.assign("/hiditra?error=oauth_failed"));
    } else {
      window.location.assign("/hiditra");
    }
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.redirect(
      new URL("/hiditra?error=supabase_not_configured", request.url),
    );
  }

  // Échange le code d'autorisation contre une session Supabase (flux PKCE)
  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !data.session?.user) {
    console.error(
      "[auth/callback] Code exchange error:",
      exchangeError?.message,
    );
    return NextResponse.redirect(new URL("/hiditra?error=oauth_failed", request.url));
  }

  const oauthUser = data.session.user;
  const email = (oauthUser.email ?? "").toLowerCase().trim();
  const name =
    (oauthUser.user_metadata?.full_name as string) ||
    (oauthUser.user_metadata?.name as string) ||
    email.split("@")[0] ||
    "Mponina";

  if (!email) {
    return NextResponse.redirect(new URL("/hiditra?error=no_email", request.url));
  }

  const db = getDb();
  if (!db) {
    return NextResponse.redirect(new URL("/hiditra?error=generic", request.url));
  }

  // 1. Vérifie si l'utilisateur existe déjà dans public.users
  const { data: existingUser } = await db
    .from("users")
    .select("id, nom, email, role")
    .eq("email", email)
    .maybeSingle<{
      id: string;
      nom: string;
      email: string;
      role: "citoyen" | "admin";
    }>();

  let finalUser = existingUser;

  // 2. S'il n'existe pas encore, l'inscrire dans la table public.users
  if (!finalUser) {
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const role = adminEmail && email === adminEmail ? "admin" : "citoyen";

    const { data: newUser, error: insertError } = await db
      .from("users")
      .insert({
        id: oauthUser.id,
        nom: name,
        email: email,
        password_hash: "oauth:google",
        role,
      })
      .select("id, nom, email, role")
      .single<{
        id: string;
        nom: string;
        email: string;
        role: "citoyen" | "admin";
      }>();

    if (insertError || !newUser) {
      console.error("[auth/callback] User insert error:", insertError?.message);
      return NextResponse.redirect(new URL("/hiditra?error=generic", request.url));
    }
    finalUser = newUser;
  }

  // 3. Pose le cookie de session de l'application Viliahazo
  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie(
      buildSessionUser(
        finalUser.id,
        finalUser.nom,
        finalUser.email,
        finalUser.role,
      ),
    ),
  );

  return NextResponse.redirect(
    new URL(finalUser.role === "admin" ? "/admin" : "/vaovao", request.url),
  );
}
