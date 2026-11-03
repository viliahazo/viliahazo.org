"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  login,
  register,
  signInWithGoogle,
  type AuthState,
} from "@/app/actions/auth";
import { useLang } from "./lang-provider";
import { Field, buttonClass, inputClass } from "./ui";

function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const isLogin = mode === "login";

  const [oauthLoading, setOauthLoading] = useState(false);

  // Intercepte le fragment d'URL #access_token=... renvoyé par le flux OAuth implicite de Supabase
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token=")) return;

    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const accessToken = params.get("access_token");
    if (!accessToken) return;

    setOauthLoading(true);

    fetch("/api/auth/oauth-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.redirect) {
          // Nettoie le fragment de l'URL pour ne pas exposer le token
          window.history.replaceState(null, "", window.location.pathname);
          window.location.assign(data.redirect);
        } else {
          setOauthLoading(false);
        }
      })
      .catch((err) => {
        console.error("[oauth] Token exchange failed:", err);
        setOauthLoading(false);
      });
  }, []);

  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    isLogin ? login : register,
    null,
  );

  const errorText =
    state?.error === "invalid"
      ? t.auth.invalid
      : state?.error === "exists"
        ? t.auth.exists
        : state?.error === "weak"
          ? t.auth.weak
          : state?.error === "missing"
            ? t.auth.missing
            : state?.error || oauthError
              ? t.common.error
              : null;

  if (oauthLoading) {
    return (
      <div className="rounded-2xl border border-earth-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-leaf-600 border-t-transparent" />
        <p className="text-sm font-semibold text-earth-800">
          {t.common.submitting}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-earth-200 bg-white p-6 shadow-sm">
      <h1 className="flex items-center gap-2 text-xl font-bold text-leaf-900">
        {isLogin ? (
          <LogIn className="h-5 w-5" aria-hidden />
        ) : (
          <UserPlus className="h-5 w-5" aria-hidden />
        )}
        {isLogin ? t.auth.loginTitle : t.auth.registerTitle}
      </h1>
      <p className="mt-2 text-sm text-earth-600">
        {isLogin ? t.auth.loginText : t.auth.registerText}
      </p>

      {/* ----------------- Bouton Google Sign-In ----------------- */}
      <form action={signInWithGoogle} className="mt-5">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-earth-300 bg-white px-4 py-2.5 text-sm font-semibold text-earth-800 shadow-sm transition hover:bg-earth-50 hover:border-earth-400 active:scale-[0.99] cursor-pointer"
        >
          <GoogleIcon className="h-5 w-5" />
          <span>{isLogin ? t.auth.googleSignIn : t.auth.googleSignUp}</span>
        </button>
      </form>

      {/* ----------------- Séparateur "na" / "ou" ----------------- */}
      <div className="relative my-5 flex items-center justify-center">
        <div className="w-full border-t border-earth-200" />
        <span className="absolute bg-white px-3 text-xs uppercase tracking-wider text-earth-400">
          {t.auth.or}
        </span>
      </div>

      {/* ----------------- Formulaire Email / Mot de passe ----------------- */}
      <form action={formAction}>
        <div className="space-y-3">
          {!isLogin ? (
            <Field label={t.auth.name}>
              <input
                name="nom"
                required
                maxLength={120}
                className={inputClass}
                autoComplete="name"
              />
            </Field>
          ) : null}

          <Field label={t.auth.email}>
            <input
              name="email"
              type="email"
              required
              className={inputClass}
              autoComplete="email"
            />
          </Field>

          <Field label={t.auth.password} hint={isLogin ? undefined : "8+"}>
            <input
              name="password"
              type="password"
              required
              minLength={isLogin ? undefined : 8}
              className={inputClass}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </Field>
        </div>

        {errorText ? (
          <p className="mt-3 text-sm font-medium text-red-700">{errorText}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className={`${buttonClass} mt-5 w-full`}
        >
          {pending
            ? t.common.submitting
            : isLogin
              ? t.auth.submitLogin
              : t.auth.submitRegister}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-earth-600">
        {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
        <Link
          href={isLogin ? "/hisoratra" : "/hiditra"}
          className="font-semibold text-leaf-700 hover:underline"
        >
          {isLogin ? t.nav.register : t.nav.login}
        </Link>
      </p>
    </div>
  );
}
