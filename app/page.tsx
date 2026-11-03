import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Bus,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Headphones,
  House,
  Mail,
  MapPin,
  Phone,
  Repeat2,
  Search,
  Sprout,
  Star,
  Zap,
} from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import {
  cleanActualiteContent,
  getActualiteImage,
  getFokontany,
  getProcedures,
  getPublishedNews,
} from "@/lib/data";
import { pick } from "@/lib/i18n";
import { sections } from "@/lib/sections";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { Badge, Card } from "@/components/ui";
import { SetupNotice } from "@/components/setup-notice";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLangAndDict();
  return pageMetadata({
    title: `${t.home.title} — ${t.home.tagline}`,
    description: t.home.hookText,
    path: "/",
  });
}

export default async function HomePage() {
  const { lang, t } = await getLangAndDict();

  const [news, procedures, fokontany] = await Promise.all([
    getPublishedNews(3),
    getProcedures(),
    getFokontany(),
  ]);
  const alert = news.find((item) => item.categorie === "fampitandrina");

  return (
    <>
      <SetupNotice lang={lang} />

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-earth-200 bg-gradient-to-br from-leaf-50 via-white to-earth-50">
        {/* Decorative background circles */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-leaf-200/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 -left-16 h-64 w-64 rounded-full bg-leaf-100/30 blur-2xl"
        />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* ── Left column ── */}
          <div>
            {/* Live official badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-leaf-200/80 bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-leaf-900 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf-600" />
              </span>
              {t.home.officialBadge}
            </div>

            {/* Tagline eyebrow */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-widest text-leaf-700">
                {t.home.tagline}
              </p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-leaf-950 sm:text-4xl lg:text-[2.65rem]">
                {t.home.title}
              </h1>
            </div>

            {/* Accroche / Hook — the main engagement sentence */}
            <p className="mt-4 max-w-xl text-base font-semibold leading-relaxed text-earth-800 sm:text-lg">
              {t.home.hookText}
            </p>

            {/* Descriptor */}
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-earth-500">
              {t.home.text}
            </p>

            {/* Primary CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/taratasy"
                className="inline-flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-leaf-700 hover:shadow-md active:scale-[0.98]"
              >
                <FileText className="h-4 w-4" aria-hidden />
                {t.home.ctaProcedures}
              </Link>
              <Link
                href="/vaovao"
                className="inline-flex items-center gap-2 rounded-xl border border-earth-300 bg-white/90 px-5 py-3 text-sm font-semibold text-earth-800 transition hover:border-leaf-400 hover:text-leaf-800 active:scale-[0.98]"
              >
                {t.home.ctaNews}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            {/* Quick-access chip row */}
            <div className="mt-6 border-t border-earth-200/70 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-earth-400">
                {t.home.quickShortcutsTitle}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {[
                  { href: "/taratasy", icon: FileText, label: t.home.shortcutBirth },
                  { href: "/fokontany", icon: MapPin, label: t.home.shortcutFokontany },
                  { href: "/trano", icon: House, label: t.home.shortcutHelp },
                  { href: "/fitaterana", icon: Bus, label: t.home.shortcutTransport },
                  { href: "/asa", icon: BriefcaseBusiness, label: lang === "mg" ? "Asa vaovao" : "Offres d'emploi" },
                  { href: "/hetsika", icon: Calendar, label: lang === "mg" ? "Hetsika" : "Événements" },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-earth-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-earth-800 shadow-sm transition hover:border-leaf-400 hover:bg-leaf-50 hover:text-leaf-900"
                  >
                    <Icon className="h-3.5 w-3.5 text-leaf-600" aria-hidden />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Stats strip */}
            <dl className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {[
                { label: t.home.statsFokontany, value: fokontany.length || 8, sub: t.home.statsFokontanySubtitle },
                { label: t.home.statsServices, value: `${procedures.length || 6}+`, sub: t.home.statsServicesSubtitle },
                { label: t.home.statsFree, value: "100%", sub: t.home.statsFreeSubtitle },
                { label: t.common.today, value: null, date: true, sub: t.home.statsCitizensSubtitle },
              ].map(({ label, value, date, sub }, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-earth-200/80 bg-white/85 p-2.5 shadow-sm backdrop-blur-xs"
                >
                  <dt className="text-[10px] font-semibold leading-none text-earth-500">
                    {label}
                  </dt>
                  <dd className="mt-1 text-lg font-extrabold leading-none text-leaf-900">
                    {date ? (
                      <span className="text-sm">{formatDate(lang, new Date())}</span>
                    ) : (
                      value
                    )}
                  </dd>
                  <p className="mt-0.5 text-[10px] text-earth-400">{sub}</p>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Right column: Quick Access card ── */}
          <div className="flex flex-col gap-4">
            <Card className="border-leaf-200/60 bg-white/95 shadow-lg ring-1 ring-leaf-100/80">
              <div className="flex items-center justify-between border-b border-earth-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-leaf-100 text-leaf-700">
                    <Zap className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-earth-700">
                    {t.home.quickAccess}
                  </h2>
                </div>
                <span className="rounded-full bg-leaf-100 px-2 py-0.5 text-[10px] font-bold text-leaf-800">
                  {sections.length}
                </span>
              </div>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {sections.map(({ key, href, icon: Icon, tone }) => (
                  <li key={key}>
                    <Link
                      href={href}
                      className="group flex h-full items-center justify-between rounded-xl border border-earth-200 bg-white p-3 transition hover:border-leaf-300 hover:bg-leaf-50 hover:shadow-sm"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className={`shrink-0 rounded-lg p-2 ${tone}`}>
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="truncate text-sm font-semibold text-earth-900 group-hover:text-leaf-900">
                          {t.sections[key].title}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-earth-300 transition group-hover:translate-x-0.5 group-hover:text-leaf-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Mini "why use this portal" promo card */}
            <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Star className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
                <div>
                  <p className="text-xs font-bold text-amber-900">
                    {t.home.whyTitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-800">
                    {t.home.whySubtitle}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { icon: Bell, text: t.home.why1Title },
                  { icon: FileText, text: t.home.why2Title },
                  { icon: MapPin, text: t.home.why3Title },
                  { icon: CheckCircle2, text: t.home.why4Title },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
                    <span className="text-[11px] font-semibold text-amber-900">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACT / EMERGENCY RIBBON ═══════════════════ */}
      <div className="border-b border-leaf-900/20 bg-gradient-to-r from-leaf-800 via-leaf-700 to-leaf-800 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <Headphones className="h-4 w-4 text-leaf-100" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-leaf-200">
                {t.home.emergencyHelpText}
              </p>
              <p className="text-xs text-white/80 sm:text-sm">
                {t.home.contactText} · Viliahazo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:+261340000000"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-leaf-900 shadow-sm transition hover:bg-leaf-50"
            >
              <Phone className="h-3.5 w-3.5 text-leaf-700" aria-hidden />
              {t.home.emergencyCallBtn} · 034 00 000 00
            </a>
            <Link
              href="/mifandraisa"
              className="inline-flex items-center gap-1 rounded-lg border border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              {t.nav.contact}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ ALERT BANNER ════════════════════════════ */}
      {alert ? (
        <div className="border-b border-amber-200/80 bg-amber-50">
          <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-3.5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                {t.news.alert}
              </p>
              <p className="text-sm font-semibold text-amber-950">
                {pick(lang, alert.titre_mg, alert.titre_fr)}
              </p>
            </div>
            <Link
              href="/vaovao"
              className="ml-auto shrink-0 text-xs font-semibold text-amber-800 underline underline-offset-2"
            >
              {t.common.readMore}
            </Link>
          </div>
        </div>
      ) : null}

      {/* ═══════════════ HOW IT WORKS — 3 step onboarding ════════════════ */}
      <section className="border-b border-earth-100 bg-gradient-to-b from-white to-earth-50/50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-700">
              {t.home.howItWorksTitle}
            </span>
            <p className="mt-1 text-xl font-bold text-earth-900 sm:text-2xl">
              {t.home.howItWorksSubtitle}
            </p>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {[
              {
                n: "01",
                icon: Search,
                label: t.home.step1Label,
                desc: t.home.step1Desc,
                tone: "bg-leaf-100 text-leaf-700",
              },
              {
                n: "02",
                icon: FileText,
                label: t.home.step2Label,
                desc: t.home.step2Desc,
                tone: "bg-sky-100 text-sky-700",
              },
              {
                n: "03",
                icon: CheckCircle2,
                label: t.home.step3Label,
                desc: t.home.step3Desc,
                tone: "bg-amber-100 text-amber-700",
              },
            ].map(({ n, icon: Icon, label, desc, tone }) => (
              <li
                key={n}
                className="relative flex flex-col rounded-2xl border border-earth-200 bg-white p-5 shadow-sm"
              >
                <span className="absolute right-4 top-4 text-3xl font-black text-earth-100 select-none">
                  {n}
                </span>
                <span className={`w-fit rounded-xl p-3 ${tone}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold text-earth-900">{label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-earth-600">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══════════════════ SECTIONS GRID ═══════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-leaf-700">
            {t.home.sectionsTitle}
          </span>
          <h2 className="mt-1 text-2xl font-bold text-leaf-900 sm:text-3xl">
            {t.home.sectionsSubtitle}
          </h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ key, href, icon: Icon, tone }) => (
            <li key={key}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-earth-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-leaf-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className={`rounded-xl p-2.5 ${tone}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ChevronRight className="mt-1 h-4 w-4 text-earth-300 transition group-hover:translate-x-0.5 group-hover:text-leaf-500" />
                </div>
                <h3 className="mt-4 text-base font-bold text-earth-900 group-hover:text-leaf-900">
                  {t.sections[key].title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-earth-600">
                  {t.sections[key].subtitle}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-leaf-700 group-hover:text-leaf-800">
                  {t.sections[key].cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ═══════════════════ LATEST NEWS ══════════════════════════════════ */}
      {news.length > 0 && (
        <section className="border-y border-earth-200 bg-earth-50/50">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-leaf-700">
                  Viliahazo Vaovao
                </span>
                <h2 className="mt-1 text-2xl font-bold text-leaf-900">
                  {t.home.latestNews}
                </h2>
              </div>
              <Link
                href="/vaovao"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-leaf-700 hover:underline"
              >
                {t.common.seeAll}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => {
                const image = getActualiteImage(item);
                const isAlert = item.categorie === "fampitandrina";
                return (
                  <li key={item.id}>
                    <Link
                      href="/vaovao"
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-leaf-300 hover:shadow-md"
                    >
                      {/* Image */}
                      {image ? (
                        <div className="overflow-hidden bg-earth-100">
                          <img
                            src={image}
                            alt={pick(lang, item.titre_mg, item.titre_fr)}
                            className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex h-16 w-full items-center justify-center ${isAlert ? "bg-amber-50" : "bg-leaf-50"}`}
                        >
                          <AlertTriangle
                            className={`h-6 w-6 ${isAlert ? "text-amber-400" : "text-leaf-300"}`}
                            aria-hidden
                          />
                        </div>
                      )}
                      {/* Content */}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={isAlert ? "amber" : "leaf"}>
                            {t.news.categories[item.categorie]}
                          </Badge>
                          <span className="text-xs text-earth-400">
                            {formatDate(lang, item.created_at)}
                          </span>
                        </div>
                        <h3 className="mt-3 text-sm font-bold leading-snug text-earth-900 group-hover:text-leaf-900 sm:text-base">
                          {pick(lang, item.titre_mg, item.titre_fr)}
                        </h3>
                        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-earth-600">
                          {cleanActualiteContent(
                            pick(lang, item.contenu_mg, item.contenu_fr)
                          )}
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-earth-100 pt-3 text-xs text-earth-400">
                          <span>{item.auteur || "Kaominina Viliahazo"}</span>
                          <span className="font-semibold text-leaf-700 group-hover:underline">
                            {t.common.readMore} →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* ═══════════════════ WHY COME BACK — value grid ════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-leaf-700">
            {t.home.whyTitle}
          </span>
          <h2 className="mt-1 text-2xl font-bold text-leaf-900 sm:text-3xl">
            {t.home.whySubtitle}
          </h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Bell, title: t.home.why1Title, desc: t.home.why1Desc, tone: "bg-leaf-100 text-leaf-700" },
            { icon: FileText, title: t.home.why2Title, desc: t.home.why2Desc, tone: "bg-sky-100 text-sky-700" },
            { icon: MapPin, title: t.home.why3Title, desc: t.home.why3Desc, tone: "bg-amber-100 text-amber-700" },
            { icon: CheckCircle2, title: t.home.why4Title, desc: t.home.why4Desc, tone: "bg-rose-100 text-rose-700" },
          ].map(({ icon: Icon, title, desc, tone }) => (
            <li
              key={title}
              className="flex flex-col rounded-2xl border border-earth-200 bg-white p-5 shadow-sm"
            >
              <span className={`w-fit rounded-xl p-2.5 ${tone}`}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-sm font-bold text-earth-900">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-earth-600">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ═══════════════ MAYOR WORD + FOKONTANY ════════════════════════════ */}
      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-12 lg:grid-cols-2">
        {/* Mayor */}
        <Card className="flex flex-col justify-between border-leaf-200/70 bg-gradient-to-br from-white to-leaf-50/40 p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-leaf-700 to-leaf-500 text-lg font-extrabold text-white shadow ring-4 ring-leaf-100">
                RG
              </span>
              <div>
                <span className="inline-flex items-center gap-1 rounded bg-leaf-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-leaf-800">
                  <Sprout className="h-3 w-3" aria-hidden />
                  {t.home.mayorGreeting}
                </span>
                <p className="mt-1 text-base font-bold text-earth-900">{t.home.mayorName}</p>
                <p className="text-xs text-earth-500">{t.home.mayorRole}</p>
              </div>
            </div>
            <blockquote className="mt-5 border-l-2 border-leaf-400 pl-4 text-sm italic leading-relaxed text-earth-700">
              &ldquo;{t.home.mayorText}&rdquo;
            </blockquote>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-earth-100 pt-4">
            <Link
              href="/taratasy"
              className="inline-flex items-center gap-1 text-sm font-semibold text-leaf-700 hover:underline"
            >
              {t.sections.procedures.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <span className="text-xs text-earth-400">Kaominina Viliahazo</span>
          </div>
        </Card>

        {/* Fokontany */}
        <Card className="p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-earth-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-earth-900">{t.home.fokontanyTitle}</h2>
              <p className="mt-0.5 text-xs text-earth-500">{t.home.fokontanyText}</p>
            </div>
            <Link
              href="/fokontany"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-leaf-700 hover:underline"
            >
              {t.common.seeAll}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-2.5">
            {fokontany.map((item) => (
              <li key={item.id}>
                <Link
                  href="/fokontany"
                  className="group flex items-center justify-between rounded-xl border border-earth-200 bg-earth-50/70 px-3 py-2.5 text-xs font-medium text-earth-800 transition hover:border-leaf-300 hover:bg-leaf-50 hover:text-leaf-900 sm:text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-leaf-500" aria-hidden />
                    <span className="truncate">{item.nom}</span>
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-earth-400 transition group-hover:translate-x-0.5 group-hover:text-leaf-600" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* ═════════════════ STAY INFORMED — re-engagement CTA ═════════════ */}
      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-leaf-700 via-leaf-800 to-leaf-900 px-6 py-8 shadow-md sm:px-10">
          {/* Decorative circles */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/5"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-leaf-600/30"
          />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            {/* Text */}
            <div className="max-w-md">
              <div className="flex items-center gap-2">
                <Repeat2 className="h-5 w-5 text-leaf-300" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-widest text-leaf-300">
                  {t.home.stayInformedTitle}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
                {t.home.stayInformedText}
              </h2>
              {/* Trust checklist */}
              <ul className="mt-3 space-y-1">
                {[t.home.why1Title, t.home.why2Title, t.home.why4Title].map((text) => (
                  <li key={text} className="flex items-center gap-2 text-xs text-leaf-100/80">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-leaf-300" aria-hidden />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-2.5 sm:items-start">
              <Link
                href="/vaovao"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-leaf-900 shadow transition hover:bg-leaf-50"
              >
                {t.home.stayInformedCta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/mifandraisa"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t.home.stayInformedCtaAlt}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
          {/* Contact info strip */}
          <div className="relative mt-6 border-t border-white/15 pt-4">
            <ul className="flex flex-wrap gap-4 text-xs text-leaf-100/70">
              <li className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-leaf-400" aria-hidden />
                Viliahazo
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-leaf-400" aria-hidden />
                <a href="tel:+261340000000" className="hover:underline">
                  034 00 000 00
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-leaf-400" aria-hidden />
                <a href="mailto:contact@viliahazo.org" className="hover:underline">
                  contact@viliahazo.org
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-leaf-400" aria-hidden />
                7:30 – 16:00
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
