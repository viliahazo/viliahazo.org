import type { Metadata } from "next";
import { Clock, FileText, MapPin, Phone, Wallet } from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import { getFokontany, getProcedures } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { Card, EmptyState, PageHero } from "@/components/ui";
import { DemarcheForm } from "@/components/demarche-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLangAndDict();
  return pageMetadata({
    title: t.procedures.title,
    description: t.procedures.subtitle,
    path: "/taratasy",
    keywords: [
      "fanamarinam-ponenana",
      "kopia taratasy",
      "certificat de résidence",
      "démarches Viliahazo",
      "latsakemboka",
    ],
  });
}

export default async function ProceduresPage() {
  const { lang, t } = await getLangAndDict();
  const [demarches, fokontany] = await Promise.all([
    getProcedures(),
    getFokontany(),
  ]);

  return (
    <>
      <PageHero
        title={t.procedures.title}
        subtitle={t.procedures.subtitle}
        path="/taratasy"
        icon={<FileText className="h-6 w-6" aria-hidden />}
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <section aria-label={t.procedures.title}>
            <h2 className="mb-4 text-lg font-bold text-leaf-900">
              {t.procedures.documents}
            </h2>

            {demarches.length === 0 ? (
              <EmptyState text={t.procedures.empty} />
            ) : (
              <ul className="space-y-4">
                {demarches.map((demarche) => {
                  const documents =
                    lang === "fr" && demarche.documents_fr.length > 0
                      ? demarche.documents_fr
                      : demarche.documents;

                  return (
                    <li
                      key={demarche.id}
                      id={demarche.slug}
                      className="scroll-mt-24 rounded-2xl border border-earth-200 bg-white p-5 shadow-sm"
                    >
                      <h3 className="text-base font-bold text-earth-900">
                        {pick(lang, demarche.titre_mg, demarche.titre_fr)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-earth-700">
                        {pick(lang, demarche.description_mg, demarche.description_fr)}
                      </p>

                      {documents.length > 0 ? (
                        <div className="mt-4">
                          <h4 className="text-xs font-bold uppercase tracking-wide text-earth-500">
                            {t.procedures.documents}
                          </h4>
                          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                            {documents.map((doc) => (
                              <li
                                key={doc}
                                className="flex items-start gap-2 text-sm text-earth-700"
                              >
                                <span
                                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-500"
                                  aria-hidden
                                />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        {demarche.delai ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-earth-100 px-2.5 py-1 font-medium text-earth-800">
                            <Clock className="h-3.5 w-3.5" aria-hidden />
                            {t.procedures.delay} : {demarche.delai}
                          </span>
                        ) : null}
                        {demarche.frais ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-100 px-2.5 py-1 font-medium text-leaf-900">
                            <Wallet className="h-3.5 w-3.5" aria-hidden />
                            {t.procedures.cost} : {demarche.frais}
                          </span>
                        ) : null}
                      </div>

                      <a
                        href="#hangataka"
                        className="mt-4 inline-block text-sm font-semibold text-leaf-700 hover:underline"
                      >
                        {t.procedures.request} →
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <DemarcheForm demarches={demarches} />
          </aside>
        </div>

        {/* Fokontany */}
        <section className="mt-10" aria-label={t.procedures.fokontanyTitle}>
          <h2 className="text-lg font-bold text-leaf-900">
            {t.procedures.fokontanyTitle}
          </h2>
          <p className="mt-1 text-sm text-earth-600">
            {t.procedures.fokontanySubtitle}
          </p>
          {fokontany.length === 0 ? (
            <div className="mt-4">
              <EmptyState text={t.common.none} />
            </div>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {fokontany.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-earth-200 bg-white p-4 text-sm"
                >
                  <p className="flex items-center gap-1.5 font-bold text-earth-900">
                    <MapPin className="h-4 w-4 text-leaf-600" aria-hidden />
                    {item.nom}
                  </p>
                  {item.chef ? (
                    <p className="mt-2 text-xs text-earth-500">
                      {t.procedures.chief}
                    </p>
                  ) : null}
                  {item.chef ? (
                    <p className="text-earth-700">{item.chef}</p>
                  ) : null}
                  {item.contact ? (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-earth-600">
                      <Phone className="h-3.5 w-3.5" aria-hidden />
                      <a href={`tel:${item.contact.replace(/\s/g, "")}`}>
                        {item.contact}
                      </a>
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
