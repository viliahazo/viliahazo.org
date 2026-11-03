import type { Metadata } from "next";
import { CalendarDays, Church, MapPin, PartyPopper, Phone } from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import { getEvenements, getFiangonana } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { formatDateTime } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { Badge, Card, EmptyState, PageHero } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { itemListJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLangAndDict();
  return pageMetadata({
    title: t.events.title,
    description: t.events.subtitle,
    path: "/hetsika",
    keywords: ["hetsika Viliahazo", "événements", "fety", "tsena", "fiangonana"],
  });
}

export default async function EventsPage() {
  const { lang, t } = await getLangAndDict();
  const [evenements, fiangonana] = await Promise.all([
    getEvenements(),
    getFiangonana(),
  ]);

  return (
    <>
      <JsonLd
        data={itemListJsonLd({
          path: "/hetsika",
          name: t.events.upcoming,
          items: evenements.map((item) => ({
            name: pick(lang, item.titre_mg, item.titre_fr),
            description: pick(lang, item.description_mg, item.description_fr) || undefined,
          })),
        })}
      />
      <PageHero
        title={t.events.title}
        subtitle={t.events.subtitle}
        path="/hetsika"
        icon={<PartyPopper className="h-6 w-6" aria-hidden />}
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <section aria-label={t.events.upcoming}>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-leaf-900">
            <CalendarDays className="h-5 w-5 text-leaf-600" aria-hidden />
            {t.events.upcoming}
          </h2>

          {evenements.length === 0 ? (
            <EmptyState text={t.events.empty} />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {evenements.map((evenement) => (
                <li key={evenement.id}>
                  <article className="flex h-full flex-col rounded-2xl border border-earth-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="earth">{t.events.type[evenement.type]}</Badge>
                      <span className="text-xs font-medium text-earth-600">
                        {formatDateTime(lang, evenement.date_event)}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-bold text-earth-900">
                      {pick(lang, evenement.titre_mg, evenement.titre_fr)}
                    </h3>
                    {evenement.description_mg ? (
                      <p className="mt-2 text-sm leading-relaxed text-earth-600">
                        {pick(lang, evenement.description_mg, evenement.description_fr)}
                      </p>
                    ) : null}
                    {evenement.lieu ? (
                      <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-earth-600">
                        <MapPin className="h-3.5 w-3.5" aria-hidden />
                        {evenement.lieu}
                      </p>
                    ) : null}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10" aria-label={t.events.churchesTitle}>
          <h2 className="flex items-center gap-2 text-lg font-bold text-leaf-900">
            <Church className="h-5 w-5 text-leaf-600" aria-hidden />
            {t.events.churchesTitle}
          </h2>
          <p className="mt-1 text-sm text-earth-600">{t.events.churchesSubtitle}</p>

          {fiangonana.length === 0 ? (
            <div className="mt-4">
              <EmptyState text={t.common.none} />
            </div>
          ) : (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fiangonana.map((eglise) => (
                <li key={eglise.id}>
                  <Card className="h-full">
                    <h3 className="text-sm font-bold text-earth-900">{eglise.nom}</h3>
                    {eglise.responsable ? (
                      <p className="mt-1 text-xs text-earth-500">
                        {t.events.leader} :{" "}
                        <span className="font-medium text-earth-700">
                          {eglise.responsable}
                        </span>
                      </p>
                    ) : null}
                    <dl className="mt-3 space-y-1 text-sm text-earth-700">
                      {eglise.horaire_mg ? (
                        <div className="flex gap-1">
                          <dt className="text-xs font-semibold text-earth-500">
                            {t.common.hours} :
                          </dt>
                          <dd>{pick(lang, eglise.horaire_mg, eglise.horaire_fr)}</dd>
                        </div>
                      ) : null}
                      {eglise.adresse ? (
                        <div className="flex items-start gap-1">
                          <dt className="text-xs font-semibold text-earth-500">
                            <MapPin className="mt-0.5 h-3.5 w-3.5" aria-hidden />
                          </dt>
                          <dd className="text-xs">{eglise.adresse}</dd>
                        </div>
                      ) : null}
                      {eglise.contact ? (
                        <div className="flex items-center gap-1">
                          <dt className="text-earth-500">
                            <Phone className="h-3.5 w-3.5" aria-hidden />
                          </dt>
                          <dd className="text-xs">
                            <a href={`tel:${eglise.contact.replace(/\s/g, "")}`}>
                              {eglise.contact}
                            </a>
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
