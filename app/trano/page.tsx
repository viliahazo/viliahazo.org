import { House, Info, Phone, Users } from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import { getAides } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { metadataForPath } from "@/lib/seo";
import { Card, EmptyState, PageHero } from "@/components/ui";

export const generateMetadata = () => metadataForPath("/trano");

export default async function HousingPage() {
  const { lang, t } = await getLangAndDict();
  const aides = await getAides();

  return (
    <>
      <PageHero
        title={t.housing.title}
        subtitle={t.housing.subtitle}
        path="/trano"
        icon={<House className="h-6 w-6" aria-hidden />}
      />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.6fr_1fr]">
        <section aria-label={t.housing.title}>
          {aides.length === 0 ? (
            <EmptyState text={t.housing.empty} />
          ) : (
            <ul className="grid gap-4">
              {aides.map((aide) => (
                <li key={aide.id}>
                  <article className="rounded-2xl border border-earth-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-bold text-earth-900">
                      {pick(lang, aide.titre_mg, aide.titre_fr)}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-earth-700">
                      {pick(lang, aide.description_mg, aide.description_fr)}
                    </p>

                    {aide.public_cible_mg ? (
                      <p className="mt-3 inline-flex items-start gap-2 rounded-lg bg-leaf-50 px-3 py-2 text-xs text-leaf-900">
                        <Users className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        <span>
                          <strong className="font-semibold">
                            {t.housing.target} :
                          </strong>{" "}
                          {pick(lang, aide.public_cible_mg, aide.public_cible_fr)}
                        </span>
                      </p>
                    ) : null}

                    {aide.contact ? (
                      <a
                        href={`tel:${aide.contact.replace(/\s/g, "")}`}
                        className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-leaf-700 hover:underline"
                      >
                        <Phone className="h-4 w-4" aria-hidden />
                        {aide.contact}
                      </a>
                    ) : null}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside>
          <Card className="border-leaf-200 bg-leaf-50">
            <h2 className="flex items-center gap-2 text-base font-bold text-leaf-900">
              <Info className="h-4 w-4" aria-hidden />
              {t.housing.howTo}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-leaf-900/90">
              {t.housing.howToText}
            </p>
          </Card>
        </aside>
      </div>
    </>
  );
}
