import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { getDb } from "@/lib/db";
import { buildSessionUser, sessionCookie } from "@/lib/auth";

/**
 * Reçoit un access_token Supabase (issu du flux OAuth implicite #access_token=...),
 * vérifie l'identité auprès de Supabase, synchronise l'utilisateur dans la table
 * public.users et pose le cookie de session viliahazo_session.
 */
export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();
    if (!accessToken || typeof accessToken !== "string") {
      return NextResponse.json({ error: "Missing accessToken" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      return NextResponse.json({ error: "Config missing" }, { status: 500 });
    }

    // 1. Vérification du token auprès de Supabase Auth
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) {
      console.error("[oauth-token] Invalid access token:", error?.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const oauthUser = data.user;
    const email = (oauthUser.email ?? "").toLowerCase().trim();
    const name =
      (oauthUser.user_metadata?.full_name as string) ||
      (oauthUser.user_metadata?.name as string) ||
      email.split("@")[0] ||
      "Mponina";

    if (!email) {
      return NextResponse.json({ error: "No email in token" }, { status: 400 });
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: "DB missing" }, { status: 500 });
    }

    // 2. Synchronisation dans la table public.users
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const role = adminEmail && email === adminEmail ? "admin" : "citoyen";

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

    if (!finalUser) {
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
        console.error("[oauth-token] User insert error:", insertError?.message);
        return NextResponse.json({ error: "Insert failed" }, { status: 500 });
      }
      finalUser = newUser;
    }

    // 3. Pose du cookie de session Viliahazo
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

    return NextResponse.json({
      ok: true,
      redirect: finalUser.role === "admin" ? "/admin" : "/vaovao",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    console.error("[oauth-token] Exception:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
