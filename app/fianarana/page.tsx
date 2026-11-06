import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  Phone,
  School,
} from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import {
  getEtablissements,
  getFiangonana,
  getPublishedEtabActualites,
  getPublishedFiangonanaActualites,
} from "@/lib/data";
import { pick } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { Badge, Card, EmptyState, PageHero } from "@/components/ui";
import type { EtablissementType } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLangAndDict();
  return pageMetadata({
    title: t.etablissements.title,
    description: t.etablissements.subtitle,
    path: "/fianarana",
  });
}

const TYPE_ICONS: Record<EtablissementType, typeof School> = {
  epp: BookOpen,
  ceg: BookOpen,
  lycee: BookOpen,
  csb: Heart,
  mairie: Building2,
  autre: Building2,
};

const TYPE_TONES: Record<EtablissementType, string> = {
  epp: "bg-sky-100 text-sky-700",
  ceg: "bg-indigo-100 text-indigo-700",
  lycee: "bg-violet-100 text-violet-700",
  csb: "bg-rose-100 text-rose-700",
  mairie: "bg-earth-100 text-earth-700",
  autre: "bg-amber-100 text-amber-700",
};

export default async function EtablissementsPage() {
  const { lang, t } = await getLangAndDict();

  const [etablissements, fiangonana, recentNews, churchNews] = await Promise.all([
    getEtablissements(),
    getFiangonana(),
    getPublishedEtabActualites(6),
    getPublishedFiangonanaActualites(6),
  ]);

  // Group by type
  const schools = etablissements.filter((e) =>
    ["epp", "ceg", "lycee"].includes(e.type),
  );
  const health = etablissements.filter((e) => e.type === "csb");
  const others = etablissements.filter((e) =>
    ["mairie", "autre"].includes(e.type),
  );

  return (
    <>
      <PageHero
        title={t.etablissements.title}
        subtitle={t.etablissements.subtitle}
        icon={<School className="h-6 w-6" aria-hidden />}
        path="/fianarana"
      />

      <div className="mx-auto max-w-6xl px-4 py-10 space-y-14">

        {/* ── Recent News from Establishments ── */}
        {recentNews.length > 0 && (
          <section>
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-700">
                  {t.etablissements.newsTitle}
                </span>
                <h2 className="mt-1 text-xl font-bold text-earth-900 sm:text-2xl">
                  {t.etablissements.newsSubtitle}
                </h2>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentNews.map((item) => {
                const etab = etablissements.find(
                  (e) => e.id === item.etablissement_id,
                );
                return (
                  <li key={item.id}>
                    <Link
                      href={`/fianarana/${item.etablissement_id}`}
                      className="group flex h-full flex-col rounded-2xl border border-earth-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                    >
                      {item.image_url && (
                        <div className="mb-3 overflow-hidden rounded-xl bg-earth-50">
                          <img
                            src={item.image_url}
                            alt={pick(lang, item.titre_mg, item.titre_fr)}
                            className="h-36 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>
                      )}
                      {etab && (
                        <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                          <School className="h-3.5 w-3.5" aria-hidden />
                          {etab.nom}
                        </span>
                      )}
                      <h3 className="text-sm font-bold leading-snug text-earth-900 group-hover:text-indigo-900 sm:text-base">
                        {pick(lang, item.titre_mg, item.titre_fr)}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-earth-600">
                        {pick(lang, item.contenu_mg, item.contenu_fr)}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-earth-100 pt-3 text-xs text-earth-400">
                        <span>{formatDate(lang, item.created_at)}</span>
                        <span className="font-semibold text-indigo-700 group-hover:underline">
                          {t.common.readMore} →
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* ── Schools ── */}
        <section>
          <div className="mb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-700">
              {t.etablissements.filterSchools}
            </span>
            <h2 className="mt-1 text-xl font-bold text-earth-900 sm:text-2xl">
              {t.etablissements.allTitle}
            </h2>
          </div>
          {schools.length === 0 ? (
            <EmptyState text={t.etablissements.empty} />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {schools.map((etab) => {
                const Icon = TYPE_ICONS[etab.type] ?? School;
                const tone = TYPE_TONES[etab.type] ?? "bg-indigo-100 text-indigo-700";
                return (
                  <li key={etab.id}>
                    <Link
                      href={`/fianarana/${etab.id}`}
                      className="group flex h-full flex-col rounded-2xl border border-earth-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`rounded-xl p-2.5 ${tone}`}>
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <Badge tone="earth">
                          {t.etablissements.types[etab.type]}
                        </Badge>
                      </div>
                      <h3 className="mt-4 text-base font-bold text-earth-900 group-hover:text-indigo-900">
                        {etab.nom}
                      </h3>
                      {etab.description_mg && (
                        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-earth-600">
                          {pick(lang, etab.description_mg, etab.description_fr)}
                        </p>
                      )}
                      <ul className="mt-4 space-y-1.5 border-t border-earth-100 pt-4">
                        {etab.directeur && (
                          <li className="flex items-center gap-2 text-xs text-earth-600">
                            <School className="h-3.5 w-3.5 shrink-0 text-indigo-500" aria-hidden />
                            {t.etablissements.director}: {etab.directeur}
                          </li>
                        )}
                        {etab.contact && (
                          <li className="flex items-center gap-2 text-xs text-earth-600">
                            <Phone className="h-3.5 w-3.5 shrink-0 text-indigo-500" aria-hidden />
                            {etab.contact}
                          </li>
                        )}
                        {etab.adresse && (
                          <li className="flex items-center gap-2 text-xs text-earth-600">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-500" aria-hidden />
                            {etab.adresse}
                          </li>
                        )}
                      </ul>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 group-hover:text-indigo-800">
                        {t.etablissements.viewDetail}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ── Health (CSB) ── */}
        {health.length > 0 && (
          <section>
            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-700">
                {t.etablissements.filterHealth}
              </span>
              <h2 className="mt-1 text-xl font-bold text-earth-900 sm:text-2xl">
                CSB II
              </h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {health.map((etab) => (
                <li key={etab.id}>
                  <Link
                    href={`/fianarana/${etab.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-earth-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-xl bg-rose-100 p-2.5 text-rose-700">
                        <Heart className="h-5 w-5" aria-hidden />
                      </span>
                      <Badge tone="red">{t.etablissements.types.csb}</Badge>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-earth-900 group-hover:text-rose-900">
                      {etab.nom}
                    </h3>
                    {etab.description_mg && (
                      <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-earth-600">
                        {pick(lang, etab.description_mg, etab.description_fr)}
                      </p>
                    )}
                    <ul className="mt-4 space-y-1.5 border-t border-earth-100 pt-4">
                      {etab.directeur && (
                        <li className="flex items-center gap-2 text-xs text-earth-600">
                          <Heart className="h-3.5 w-3.5 shrink-0 text-rose-500" aria-hidden />
                          {etab.directeur}
                        </li>
                      )}
                      {etab.contact && (
                        <li className="flex items-center gap-2 text-xs text-earth-600">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-rose-500" aria-hidden />
                          {etab.contact}
                        </li>
                      )}
                      {etab.adresse && (
                        <li className="flex items-center gap-2 text-xs text-earth-600">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-500" aria-hidden />
                          {etab.adresse}
                        </li>
                      )}
                    </ul>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-rose-700 group-hover:text-rose-800">
                      {t.etablissements.viewDetail}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Others (Mairie, autre) ── */}
        {others.length > 0 && (
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-earth-900 sm:text-2xl">
                {lang === "fr" ? "Autres services" : "Sampana hafa"}
              </h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((etab) => {
                const Icon = TYPE_ICONS[etab.type] ?? Building2;
                const tone = TYPE_TONES[etab.type] ?? "bg-earth-100 text-earth-700";
                return (
                  <li key={etab.id}>
                    <Link
                      href={`/fianarana/${etab.id}`}
                      className="group flex h-full flex-col rounded-2xl border border-earth-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-earth-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <span className={`rounded-xl p-2.5 ${tone}`}>
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <Badge tone="earth">{t.etablissements.types[etab.type]}</Badge>
                      </div>
                      <h3 className="mt-4 text-base font-bold text-earth-900 group-hover:text-earth-700">
                        {etab.nom}
                      </h3>
                      {etab.contact && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-earth-600">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-earth-400" />
                          {etab.contact}
                        </p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-earth-700 group-hover:underline">
                        {t.etablissements.viewDetail}
                        <ChevronRight className="h-4 w-4" aria-hidden />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* ── Churches / Fiangonana ── */}
        <section>
          <div className="mb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              {t.etablissements.filterChurches}
            </span>
            <h2 className="mt-1 text-xl font-bold text-earth-900 sm:text-2xl">
              {t.etablissements.churchesTitle}
            </h2>
            <p className="mt-1 text-sm text-earth-600">{t.etablissements.churchesSubtitle}</p>
          </div>
          {fiangonana.length === 0 ? (
            <EmptyState text={t.etablissements.noChurches} />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {fiangonana.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col rounded-2xl border border-earth-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <Building2 className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-earth-900 leading-snug">{item.nom}</h3>
                      {item.responsable && (
                        <p className="mt-0.5 text-xs text-earth-500">
                          {t.etablissements.churchLeader}: {item.responsable}
                        </p>
                      )}
                    </div>
                  </div>
                  <ul className="mt-4 space-y-1.5 border-t border-earth-100 pt-4">
                    {item.horaire_mg && (
                      <li className="flex items-start gap-2 text-xs text-earth-600">
                        <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden />
                        <span>{pick(lang, item.horaire_mg, item.horaire_fr)}</span>
                      </li>
                    )}
                    {item.contact && (
                      <li className="flex items-center gap-2 text-xs text-earth-600">
                        <Phone className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden />
                        <a href={`tel:${item.contact.replace(/\s/g, "")}`} className="hover:underline">
                          {item.contact}
                        </a>
                      </li>
                    )}
                    {item.adresse && (
                      <li className="flex items-center gap-2 text-xs text-earth-600">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden />
                        {item.adresse}
                      </li>
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          )}

          {/* Actualités des églises */}
          {churchNews.length > 0 && (
            <div className="mt-8 border-t border-earth-100 pt-6">
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  {t.etablissements.churchNewsTitle}
                </span>
                <p className="mt-0.5 text-sm text-earth-600">
                  {t.etablissements.churchNewsSubtitle}
                </p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {churchNews.map((newsItem) => {
                  const church = fiangonana.find((f) => f.id === newsItem.fiangonana_id);
                  return (
                    <li
                      key={newsItem.id}
                      className="flex flex-col rounded-2xl border border-amber-200/80 bg-gradient-to-br from-white to-amber-50/30 p-5 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone="amber">
                          {church ? church.nom : (lang === "fr" ? "Église" : "Fiangonana")}
                        </Badge>
                        <span className="text-xs text-earth-400">
                          {formatDate(lang, newsItem.created_at)}
                        </span>
                      </div>
                      <h4 className="mt-3 text-base font-bold text-earth-900 leading-snug">
                        {pick(lang, newsItem.titre_mg, newsItem.titre_fr)}
                      </h4>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-earth-700">
                        {pick(lang, newsItem.contenu_mg, newsItem.contenu_fr)}
                      </p>
                      {newsItem.auteur && (
                        <p className="mt-auto pt-3 text-xs text-earth-500 border-t border-earth-100">
                          {newsItem.auteur}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
