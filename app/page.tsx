import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Sprout,
} from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import { getFokontany, getProcedures, getPublishedNews } from "@/lib/data";
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
    title: t.home.title,
    description: t.home.text,
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

      {/* ------------------------------- Hero ------------------------------- */}
      <section className="border-b border-earth-200 bg-gradient-to-b from-leaf-50 via-earth-50 to-earth-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-leaf-800">
              <Sprout className="h-4 w-4" aria-hidden />
              {t.home.badge}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-leaf-900 sm:text-4xl lg:text-5xl">
              {t.home.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-earth-700 sm:text-base">
              {t.home.text}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/vaovao"
                className="inline-flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-700"
              >
                {t.home.ctaNews}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/taratasy"
                className="inline-flex items-center gap-2 rounded-xl border border-earth-300 bg-white px-5 py-3 text-sm font-semibold text-earth-800 transition hover:border-leaf-400 hover:text-leaf-800"
              >
                {t.home.ctaProcedures}
              </Link>
            </div>
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-earth-200 bg-white/70 p-3">
                <dt className="text-[11px] font-medium text-earth-600">
                  {t.home.statsFokontany}
                </dt>
                <dd className="text-lg font-extrabold text-leaf-900">
                  {fokontany.length || 8}
                </dd>
              </div>
              <div className="rounded-xl border border-earth-200 bg-white/70 p-3">
                <dt className="text-[11px] font-medium text-earth-600">
                  {t.home.statsServices}
                </dt>
                <dd className="text-lg font-extrabold text-leaf-900">
                  {procedures.length || 6}
                </dd>
              </div>
              <div className="rounded-xl border border-earth-200 bg-white/70 p-3">
                <dt className="text-[11px] font-medium text-earth-600">
                  {t.common.today}
                </dt>
                <dd className="text-sm font-bold text-leaf-900">
                  {formatDate(lang, new Date())}
                </dd>
              </div>
            </dl>
          </div>

          <Card className="bg-white/90">
            <h2 className="text-sm font-bold uppercase tracking-wide text-earth-600">
              {t.home.quickAccess}
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {sections.map(({ key, href, icon: Icon, tone }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="group flex h-full items-start gap-2.5 rounded-xl border border-earth-200 p-3 transition hover:border-leaf-300 hover:bg-leaf-50"
                  >
                    <span className={`rounded-lg p-2 ${tone}`}>
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="text-sm font-semibold leading-snug text-earth-900 group-hover:text-leaf-900">
                      {t.sections[key].title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* ----------------------------- Alerte ------------------------------ */}
      {alert ? (
        <div className="bg-amber-50">
          <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-4">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
              aria-hidden
            />
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

      {/* ---------------------------- Fizarana ----------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-bold text-leaf-900 sm:text-3xl">
            {t.home.sectionsTitle}
          </h2>
          <p className="mt-2 text-sm text-earth-700">{t.home.sectionsSubtitle}</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ key, href, icon: Icon, tone }) => (
            <li key={key}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-earth-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-leaf-300 hover:shadow-md"
              >
                <span className={`w-fit rounded-xl p-2.5 ${tone}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold text-earth-900 group-hover:text-leaf-900">
                  {t.sections[key].title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-earth-600">
                  {t.sections[key].subtitle}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-leaf-700">
                  {t.sections[key].cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------- Vaovao farany -------------------------- */}
      {news.length > 0 ? (
        <section className="border-y border-earth-200 bg-white/60">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="mb-6 flex items-end justify-between gap-3">
              <h2 className="text-2xl font-bold text-leaf-900">
                {t.home.latestNews}
              </h2>
              <Link
                href="/vaovao"
                className="text-sm font-semibold text-leaf-700 hover:underline"
              >
                {t.common.seeAll}
              </Link>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <li key={item.id}>
                  <article className="flex h-full flex-col rounded-2xl border border-earth-200 bg-white p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={item.categorie === "fampitandrina" ? "amber" : "leaf"}>
                        {t.news.categories[item.categorie]}
                      </Badge>
                      <span className="text-xs text-earth-500">
                        {formatDate(lang, item.created_at)}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-bold text-earth-900">
                      {pick(lang, item.titre_mg, item.titre_fr)}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-earth-600">
                      {pick(lang, item.contenu_mg, item.contenu_fr)}
                    </p>
                    {item.auteur ? (
                      <p className="mt-auto pt-4 text-xs text-earth-500">
                        {item.auteur}
                      </p>
                    ) : null}
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ------------------------ Ben'ny tanàna --------------------------- */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-lg font-bold text-white">
              RG
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-earth-500">
                {t.home.mayorTitle}
              </p>
              <p className="text-base font-bold text-earth-900">{t.home.mayorName}</p>
              <p className="text-sm text-earth-600">{t.home.mayorRole}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-earth-700">
            {t.home.mayorText}
          </p>
          <Link
            href="/taratasy"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-leaf-700 hover:underline"
          >
            {t.sections.procedures.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Card>

        <Card>
          <h2 className="text-base font-bold text-earth-900">
            {t.home.fokontanyTitle}
          </h2>
          <p className="mt-2 text-sm text-earth-600">{t.home.fokontanyText}</p>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {fokontany.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-earth-200 bg-earth-50 px-3 py-2 text-sm font-medium text-earth-800"
              >
                {item.nom}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* ----------------------------- Contact ---------------------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-2xl bg-leaf-700 px-5 py-6 text-leaf-50 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="text-lg font-bold">{t.home.contactTitle}</h2>
              <p className="mt-1 text-sm text-leaf-100/80">{t.home.contactText}</p>
            </div>
            <ul className="flex flex-wrap gap-4 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden />
                Viliahazo
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" aria-hidden />
                <a href="tel:+261340000000" className="hover:underline">
                  034 00 000 00
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden />
                <a href="mailto:contact@viliahazo.org" className="hover:underline">
                contact@viliahazo.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden />
                7:30 - 16:00
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
