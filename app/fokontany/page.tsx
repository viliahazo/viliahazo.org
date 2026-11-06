import Link from "next/link";
import { getLangAndDict } from "@/lib/lang";
import { getFokontany } from "@/lib/data";
import { metadataForPath } from "@/lib/seo";
import { Badge, Card, EmptyState, PageHero } from "@/components/ui";
import { MapPin, Phone, Mail, Users } from "lucide-react";
import { SITE_ORG } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { fokontanyJsonLd, fokontanySlug, webPageJsonLd } from "@/lib/structured-data";
import { seoCopy } from "@/lib/seo";

export const generateMetadata = () => metadataForPath("/fokontany");

export default async function FokontanyPage() {
  const { lang, t } = await getLangAndDict();
  const fokontany = await getFokontany();
  const copy = seoCopy("/fokontany", lang);

  return (
    <>
      <JsonLd data={fokontanyJsonLd(fokontany)} />
      {copy && (
        <JsonLd
          data={webPageJsonLd({
            path: "/fokontany",
            name: copy.title,
            description: copy.description,
            lang,
            type: "CollectionPage",
          })}
        />
      )}
      <PageHero
        title={t.fokontany.title}
        subtitle={t.fokontany.subtitle}
        icon={<Users className="h-6 w-6" aria-hidden />}
        path="/fokontany"
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {fokontany.length === 0 ? (
          <EmptyState text={t.fokontany.empty} />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {fokontany.map((item) => (
              <li
                key={item.id}
                id={fokontanySlug(item.nom)}
                className="group flex scroll-mt-24 flex-col rounded-2xl border border-earth-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-leaf-300 hover:shadow-md"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-bold text-earth-900 leading-snug group-hover:text-leaf-900 truncate">
                      {item.nom}
                    </h2>
                    {item.chef && (
                      <p className="mt-0.5 text-xs text-earth-500">
                        {t.fokontany.chief}: {item.chef}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-auto space-y-2 border-t border-earth-100 pt-4">
                  {item.contact ? (
                    <>
                      {/* If contact looks like a phone number */}
                      {/^\+?[0-9\s\-().]{6,}$/.test(item.contact) ? (
                        <a
                          href={`tel:${item.contact.replace(/\s/g, "")}`}
                          className="flex items-center gap-2 text-sm text-leaf-700 hover:underline"
                        >
                          <Phone className="h-4 w-4 shrink-0" aria-hidden />
                          {item.contact}
                        </a>
                      ) : item.contact.includes("@") ? (
                        <a
                          href={`mailto:${item.contact}`}
                          className="flex items-center gap-2 text-sm text-leaf-700 hover:underline"
                        >
                          <Mail className="h-4 w-4 shrink-0" aria-hidden />
                          {item.contact}
                        </a>
                      ) : (
                        <p className="flex items-center gap-2 text-sm text-earth-700">
                          <Phone className="h-4 w-4 shrink-0 text-earth-400" aria-hidden />
                          {item.contact}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="flex items-center gap-2 text-xs text-earth-400 italic">
                      <Phone className="h-4 w-4 shrink-0" aria-hidden />
                      {t.fokontany.noContact}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* CTA strip → contact page */}
        <div className="mt-10 rounded-2xl bg-leaf-700 px-6 py-6 text-leaf-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold text-base">{t.home.contactTitle}</p>
              <p className="mt-1 text-sm text-leaf-100/80">{t.home.contactText}</p>
            </div>
            <Link
              href="/mifandraisa"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-leaf-800 hover:bg-leaf-50 transition"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}