import type { Metadata } from "next";
import { BriefcaseBusiness, CalendarClock, MapPin, Phone } from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import { getEmplois, getServices } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { Badge, Card, EmptyState, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Asa sy Sampandraharaha",
  description:
    "Tolotra asa eo an-toerana, fiofanana, ary ny asan'ny kaominina Viliahazo (fandraofana fako, rano madio, jiro).",
};

export default async function JobsPage() {
  const { lang, t } = await getLangAndDict();
  const [emplois, services] = await Promise.all([getEmplois(), getServices()]);

  return (
    <>
      <PageHero
        title={t.jobs.title}
        subtitle={t.jobs.subtitle}
        icon={<BriefcaseBusiness className="h-6 w-6" aria-hidden />}
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <section aria-label={t.jobs.jobsTitle}>
          <h2 className="mb-4 text-lg font-bold text-leaf-900">{t.jobs.jobsTitle}</h2>

          {emplois.length === 0 ? (
            <EmptyState text={t.jobs.empty} />
          ) : (
            <ul className="grid gap-4 lg:grid-cols-2">
              {emplois.map((emploi) => (
                <li key={emploi.id}>
                  <article className="h-full rounded-2xl border border-earth-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-earth-900">
                        {emploi.titre}
                      </h3>
                      {emploi.date_limite ? (
                        <Badge tone="earth">
                          <CalendarClock className="h-3 w-3" aria-hidden />
                          {t.jobs.deadline} : {formatDate(lang, emploi.date_limite)}
                        </Badge>
                      ) : null}
                    </div>

                    <p className="mt-1 text-sm font-medium text-leaf-800">
                      {t.jobs.employer} : {emploi.employeur}
                    </p>

                    {emploi.description_mg ? (
                      <p className="mt-3 text-sm leading-relaxed text-earth-700">
                        {pick(lang, emploi.description_mg, emploi.description_fr)}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-earth-600">
                      {emploi.lieu ? (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" aria-hidden />
                          {emploi.lieu}
                        </span>
                      ) : null}
                      {emploi.contact ? (
                        <a
                          href={
                            emploi.contact.match(/^[+0-9\s().-]+$/)
                              ? `tel:${emploi.contact.replace(/\s/g, "")}`
                              : `mailto:${emploi.contact}`
                          }
                          className="inline-flex items-center gap-1.5 font-semibold text-leaf-700 hover:underline"
                        >
                          <Phone className="h-4 w-4" aria-hidden />
                          {emploi.contact}
                        </a>
                      ) : null}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10" aria-label={t.jobs.servicesTitle}>
          <h2 className="mb-4 text-lg font-bold text-leaf-900">
            {t.jobs.servicesTitle}
          </h2>

          {services.length === 0 ? (
            <EmptyState text={t.common.none} />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <li key={service.id}>
                  <Card className="h-full">
                    <h3 className="text-sm font-bold text-earth-900">
                      {pick(lang, service.nom_mg, service.nom_fr)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-earth-600">
                      {pick(lang, service.description_mg, service.description_fr)}
                    </p>
                    <dl className="mt-3 space-y-1 text-xs text-earth-600">
                      {service.horaire ? (
                        <div className="flex gap-1">
                          <dt className="font-semibold">{t.common.hours} :</dt>
                          <dd>{service.horaire}</dd>
                        </div>
                      ) : null}
                      {service.contact ? (
                        <div className="flex gap-1">
                          <dt className="font-semibold">{t.common.phone} :</dt>
                          <dd>{service.contact}</dd>
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
