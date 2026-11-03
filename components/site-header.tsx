"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Sprout,
  UserRound,
  Users,
  X,
} from "lucide-react";
import type { Dictionary, Lang } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";
import type { SessionUser } from "@/lib/types";

/** Rubriques citoyennes principales affichées directement dans la barre desktop. */
const primaryLinks = [
  { href: "/vaovao", key: "news" },
  { href: "/taratasy", key: "procedures" },
  { href: "/trano", key: "housing" },
  { href: "/fitaterana", key: "transport" },
  { href: "/asa", key: "jobs" },
  { href: "/hetsika", key: "events" },
] as const;

/** Liens institutionnels / territoire regroupés dans le menu "Bebe kokoa / Plus". */
const secondaryLinks = [
  { href: "/fokontany", key: "fokontany", icon: Users },
  { href: "/mifandraisa", key: "contact", icon: Mail },
] as const;

/** Tous les liens pour le tiroir de navigation mobile. */
const mobileLinks = [
  { href: "/", key: "home" },
  ...primaryLinks,
  { href: "/fokontany", key: "fokontany" },
  { href: "/mifandraisa", key: "contact" },
] as const;

export function SiteHeader({
  lang,
  t,
  user,
  logout,
}: {
  lang: Lang;
  t: Dictionary;
  user: SessionUser | null;
  logout: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Fermer les menus lors d'un changement de page
  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Fermer le sous-menu "Plus" lors d'un clic extérieur ou appui sur Échap
  useEffect(() => {
    if (!moreOpen) return;

    function handlePointerDown(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMoreOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [moreOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isSecondaryActive = secondaryLinks.some((link) => isActive(link.href));

  return (
    <header className="sticky top-0 z-40 border-b border-earth-200 bg-earth-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Logo & nom de la commune */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-600 text-white">
            <Sprout className="h-5 w-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-leaf-900">
              {t.common.siteName}
            </span>
            <span className="block text-[11px] text-earth-600">{t.common.region}</span>
          </span>
        </Link>

        {/* Navigation Desktop principale */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label={t.nav.menu}>
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-leaf-100 text-leaf-900 font-semibold"
                  : "text-earth-700 hover:bg-leaf-50 hover:text-leaf-900"
              }`}
            >
              {t.nav[link.key]}
            </Link>
          ))}

          {/* Menu déroulant "Bebe kokoa / Plus" pour les liens secondaires */}
          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                isSecondaryActive || moreOpen
                  ? "bg-leaf-100 text-leaf-900 font-semibold"
                  : "text-earth-700 hover:bg-leaf-50 hover:text-leaf-900"
              }`}
            >
              {t.nav.more}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  moreOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>

            {moreOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-earth-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100"
              >
                {secondaryLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-leaf-100 text-leaf-900 font-semibold"
                          : "text-earth-700 hover:bg-leaf-50 hover:text-leaf-900"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-leaf-700" aria-hidden />
                      <span>{t.nav[link.key]}</span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        </nav>

        {/* Contrôles droits : langue, compte & bouton burger mobile */}
        <div className="flex items-center gap-2">
          <LanguageSwitch lang={lang} />

          <div className="hidden items-center gap-2 sm:flex">
            {user ? (
              <>
                {user.role === "admin" ? (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-leaf-600 px-3 py-2 text-sm font-semibold text-white hover:bg-leaf-700"
                  >
                    <LayoutDashboard className="h-4 w-4" aria-hidden />
                    {t.nav.admin}
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-leaf-50 px-3 py-2 text-sm font-medium text-leaf-900">
                    <UserRound className="h-4 w-4" aria-hidden />
                    {user.nom.split(" ")[0]}
                  </span>
                )}
                <form action={logout}>
                  <button
                    type="submit"
                    className="rounded-lg p-2 text-earth-600 hover:bg-earth-100 hover:text-earth-900"
                    title={t.nav.logout}
                    aria-label={t.nav.logout}
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/hiditra"
                className="inline-flex items-center gap-1.5 rounded-lg border border-leaf-600 px-3 py-2 text-sm font-semibold text-leaf-800 hover:bg-leaf-50"
              >
                <LogIn className="h-4 w-4" aria-hidden />
                {t.nav.login}
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t.nav.menu}
            className="rounded-lg border border-earth-300 bg-white p-2 text-earth-800 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Tiroir de navigation mobile */}
      {open ? (
        <div id="mobile-nav" className="border-t border-earth-200 bg-white lg:hidden">
          <nav className="mx-auto grid max-w-6xl gap-1 px-4 py-3" aria-label={t.nav.menu}>
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-leaf-100 text-leaf-900 font-semibold"
                    : "text-earth-800 hover:bg-earth-50"
                }`}
              >
                {t.nav[link.key]}
                <ChevronDown className="h-4 w-4 -rotate-90 opacity-40" aria-hidden />
              </Link>
            ))}
            <div className="mt-2 border-t border-earth-200 pt-2">
              {user ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-earth-700">
                    {user.nom}
                    {user.role === "admin" ? ` · ${t.nav.admin}` : ""}
                  </span>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-leaf-800 hover:bg-leaf-50"
                    >
                      {t.nav.logout}
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/hiditra"
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-leaf-800 hover:bg-leaf-50"
                >
                  {t.nav.login} / {t.nav.register}
                </Link>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
