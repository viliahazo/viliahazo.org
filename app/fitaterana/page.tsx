import { Bus, Clock, MapPin, Route, Wallet } from "lucide-react";
import { getLangAndDict } from "@/lib/lang";
import { getTransport } from "@/lib/data";
import { metadataForPath } from "@/lib/seo";
import { Card, EmptyState, PageHero } from "@/components/ui";

export const generateMetadata = () => metadataForPath("/fitaterana");

export default async function TransportPage() {
  const { t } = await getLangAndDict();
  const lignes = await getTransport();

  return (
    <>
      <PageHero
        title={t.transport.title}
        subtitle={t.transport.subtitle}
        path="/fitaterana"
        icon={<Bus className="h-6 w-6" aria-hidden />}
      />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.6fr_1fr]">
        <section aria-label={t.transport.title}>
          {lignes.length === 0 ? (
            <EmptyState text={t.transport.empty} />
          ) : (
            <ul className="space-y-4">
              {lignes.map((ligne) => (
                <li
                  key={ligne.id}
                  className="rounded-2xl border border-earth-200 bg-white p-5 shadow-sm"
                >
                  <h2 className="flex items-start gap-2 text-base font-bold text-earth-900">
                    <Route className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" aria-hidden />
                    {ligne.ligne}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-lg bg-earth-100 px-2.5 py-1 font-medium text-earth-800">
                      {ligne.depart}
                    </span>
                    <span aria-hidden className="text-earth-400">
                      →
                    </span>
                    <span className="rounded-lg bg-leaf-100 px-2.5 py-1 font-medium text-leaf-900">
                      {ligne.arrivee}
                    </span>
                  </div>

                  <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                    {ligne.horaires ? (
                      <div className="flex items-start gap-1.5">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-earth-500" aria-hidden />
                        <div>
                          <dt className="text-xs text-earth-500">{t.transport.schedule}</dt>
                          <dd className="font-medium text-earth-800">{ligne.horaires}</dd>
                        </div>
                      </div>
                    ) : null}
                    {ligne.duree ? (
                      <div>
                        <dt className="text-xs text-earth-500">
                          {t.transport.duration}
                        </dt>
                        <dd className="font-medium text-earth-800">{ligne.duree}</dd>
                      </div>
                    ) : null}
                    {ligne.tarif ? (
                      <div className="flex items-start gap-1.5">
                        <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-earth-500" aria-hidden />
                        <div>
                          <dt className="text-xs text-earth-500">{t.transport.price}</dt>
                          <dd className="font-semibold text-leaf-800">{ligne.tarif}</dd>
                        </div>
                      </div>
                    ) : null}
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="space-y-4">
          <Card className="border-leaf-200 bg-leaf-50">
            <h2 className="flex items-center gap-2 text-base font-bold text-leaf-900">
              <MapPin className="h-4 w-4" aria-hidden />
              {t.transport.stationTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-leaf-900/90">
              {t.transport.stationText}
            </p>
          </Card>

          <Card>
            <h2 className="text-base font-bold text-earth-900">
              {t.transport.tipsTitle}
            </h2>
            <ul className="mt-3 space-y-2">
              {t.transport.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-earth-700">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-500"
                    aria-hidden
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </>
  );
}
