import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Clock,
  Heart,
  MapPin,
  Phone,
  School,
} from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import { getDb } from "@/lib/db";
import { getEtablissementActualites } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { Badge, Card, EmptyState } from "@/components/ui";
import type { Etablissement, EtablissementType } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

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

async function getEtablissement(id: string): Promise<Etablissement | null> {
  const db = getDb();
  if (!db) return null;
  const { data, error } = await db
    .from("etablissements")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as Etablissement;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const etab = await getEtablissement(id);
  if (!etab) return { title: "Introuvable" };
  return pageMetadata({
    title: etab.nom,
    description: etab.description_mg ?? etab.nom,
    path: `/fianarana/${id}`,
  });
}

export default async function EtablissementDetailPage({ params }: Params) {
  const { id } = await params;
  const { lang, t } = await getLangAndDict();

  const [etab, news] = await Promise.all([
    getEtablissement(id),
    getEtablissementActualites(id, 20),
  ]);

  if (!etab) notFound();

  const Icon = TYPE_ICONS[etab.type] ?? School;
  const tone = TYPE_TONES[etab.type] ?? "bg-indigo-100 text-indigo-700";

  return (
    <>
      {/* ── Hero ── */}
      <div className="border-b border-earth-200 bg-gradient-to-b from-indigo-50/60 to-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Link
            href="/fianarana"
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {t.etablissements.backToList}
          </Link>

          <div className="flex items-start gap-5">
            <span className={`shrink-0 rounded-2xl p-4 ${tone} shadow-sm`}>
              <Icon className="h-8 w-8" aria-hidden />
            </span>
            <div>
              <Badge tone="earth">
                {t.etablissements.types[etab.type]}
              </Badge>
              <h1 className="text-2xl font-extrabold tracking-tight text-earth-950 sm:text-3xl">
                {etab.nom}
              </h1>
              {etab.adresse && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-earth-500">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  {etab.adresse}
                </p>
              )}
            </div>
          </div>

          {/* Contact info row */}
          {(etab.directeur || etab.contact) && (
            <div className="mt-6 flex flex-wrap gap-4">
              {etab.directeur && (
                <div className="flex items-center gap-2 rounded-xl border border-earth-200 bg-white px-4 py-2.5 text-sm shadow-sm">
                  <School className="h-4 w-4 text-indigo-500" aria-hidden />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-earth-400">
                      {t.etablissements.director}
                    </p>
                    <p className="font-semibold text-earth-900">{etab.directeur}</p>
                  </div>
                </div>
              )}
              {etab.contact && (
                <a
                  href={`tel:${etab.contact.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 rounded-xl border border-earth-200 bg-white px-4 py-2.5 text-sm shadow-sm transition hover:border-indigo-300 hover:text-indigo-900"
                >
                  <Phone className="h-4 w-4 text-indigo-500" aria-hidden />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-earth-400">
                      {t.etablissements.contact}
                    </p>
                    <p className="font-semibold text-earth-900">{etab.contact}</p>
                  </div>
                </a>
              )}
            </div>
          )}

          {/* Description */}
          {etab.description_mg && (
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-earth-700">
              {pick(lang, etab.description_mg, etab.description_fr)}
            </p>
          )}
        </div>
      </div>

      {/* ── News / Actualités ── */}
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-earth-900 sm:text-2xl">
            {t.etablissements.newsTitle}
          </h2>
          <p className="mt-1 text-sm text-earth-500">{t.etablissements.newsSubtitle}</p>
        </div>

        {news.length === 0 ? (
          <EmptyState text={t.etablissements.noNews} />
        ) : (
          <ul className="space-y-5">
            {news.map((item) => (
              <li key={item.id}>
                <Card className="shadow-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone="earth">
                      {t.etablissements.types[etab.type]}
                    </Badge>
                    <span className="text-xs text-earth-400">
                      {formatDate(lang, item.created_at)}
                    </span>
                    {item.auteur && (
                      <span className="text-xs text-earth-400">· {item.auteur}</span>
                    )}
                  </div>

                  {item.image_url && (
                    <div className="my-4 overflow-hidden rounded-xl">
                      <img
                        src={item.image_url}
                        alt={pick(lang, item.titre_mg, item.titre_fr)}
                        className="h-56 w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <h3 className="mt-3 text-base font-bold text-earth-900 sm:text-lg">
                    {pick(lang, item.titre_mg, item.titre_fr)}
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-earth-700">
                    {pick(lang, item.contenu_mg, item.contenu_fr)}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
