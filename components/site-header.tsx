"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Sprout,
  UserRound,
  X,
} from "lucide-react";
import type { Dictionary, Lang } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";
import type { SessionUser } from "@/lib/types";

const links = [
  { href: "/", key: "home" },
  { href: "/vaovao", key: "news" },
  { href: "/taratasy", key: "procedures" },
  { href: "/trano", key: "housing" },
  { href: "/fitaterana", key: "transport" },
  { href: "/asa", key: "jobs" },
  { href: "/hetsika", key: "events" },
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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-earth-200 bg-earth-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
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

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Fizarana">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-leaf-100 text-leaf-900"
                  : "text-earth-700 hover:bg-leaf-50 hover:text-leaf-900"
              }`}
            >
              {t.nav[link.key]}
            </Link>
          ))}
        </nav>

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

      {open ? (
        <div id="mobile-nav" className="border-t border-earth-200 bg-white lg:hidden">
          <nav className="mx-auto grid max-w-6xl gap-1 px-4 py-3" aria-label="Fizarana">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-leaf-100 text-leaf-900"
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
