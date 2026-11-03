import Link from "next/link";
import { getLangAndDict } from "@/lib/lang";
import { pageMetadata } from "@/lib/seo";
import { Badge, Card } from "@/components/ui";
import { getFokontany } from "@/lib/data";
import type { Metadata } from "next";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLangAndDict();
  return pageMetadata({
    title: t.home.title,
    description: t.home.text,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const { lang, t } = await getLangAndDict();
  const fokontany = await getFokontany();

  return (
    < >
      <h1 className="text-2xl font-bold text-leaf-900 mb-6">
        {t.home.contactTitle}
      </h1>

      <div className="mx-auto max-w-3xl px-4 pb-12">
        {/* ---------------------------- Contact Form -------------------------- */} <Card className="bg-white/90 p-6 rounded-2xl mb-8">
          <h2 className="text-lg font-bold text-earth-900 mb-4">
            Formulaire de contact
          </h2>

          <form className="space-y-4" action="/contact" method="POST">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  placeholder="Nom complet"
                  type="text"
                  name="nom"
                  required
                  className="w-full rounded-xl border border-earth-300 bg-white px-3.5 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200 focus:outline-none"
                />
              </div>
              <div>
                <input
                  placeholder="E-mail"
                  type="email"
                  name="mailaka"
                  required
                  className="w-full rounded-xl border border-earth-300 bg-white px-3.5 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200 focus:outline-none"
                />
              </div>
            </div>

            <input
              placeholder="Téléphone"
              type="tel"
              name="telephone"
              required
              className="w-full rounded-xl border border-earth-300 bg-white px-3.5 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200 focus:outline-none"
            />

            <textarea
              placeholder="Message"
              name="message"
              required
              className="w-full rounded-xl border border-earth-300 bg-white px-3.5 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200 focus:outline-none min-h-[120px] resize-y"
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-leaf-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-leaf-700 disabled:opacity-60"
            >
              Envoyer
            </button>
          </form>
        </Card>

        {/* ---------------------------- Adresse Officielle ------------------------- */} <Card className="bg-leaf-50 p-6 rounded-2xl mt-8">
          <h2 className="text-lg font-bold text-earth-900 mb-4">
            Adresse officielle
          </h2>

          <dl className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-earth-600">Viliahazo</dt>
              <dd className="font-medium text-earth-900">
                Commune rurale de Viliahazo
              </dd>
            </div>
            <div>
              <dt className="text-earth-600">Téléphone</dt>
              <dd className="font-medium text-earth-900">
                <a href="tel:+261340000000" className="hover:underline">
                  034 00 000 00
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-earth-600">E-mail</dt>
              <dd className="font-medium text-earth-900">
                <a href="mailto:contact@viliahazo.org" className="hover:underline">
                  contact@viliahazo.org
                </a>
              </dd>
            </div>
          </dl>
        </Card>

        {/* ---------------------------- Horaires d'ouverture ------------------------- */} <Card className="bg-leaf-50 p-6 rounded-2xl mt-8">
          <h2 className="text-lg font-bold text-earth-900 mb-4">
            Horaires d'ouverture
          </h2>

          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-earth-600">Lundi - Vendredi</dt>
              <dd className="font-medium text-earth-900">7:30 - 16:00</dd>
            </div>
            <div>
              <dt className="text-earth-600">Samedi</dt>
              <dd className="font-medium text-earth-900">Fermé</dd>
            </div>
          </dl>
        </Card>

        {/* ---------------------------- Les 8 Fokontany ------------------------- */} <Card className="bg-leaf-50 p-6 rounded-2xl mt-8">
          <h2 className="text-lg font-bold text-earth-900 mb-4">
            Les 8 Fokontany
          </h2>

          <p className="text-sm text-earth-600 mb-4">
            Mifandraisa amin'ny fokontany misy anao raha mila fanampiana eo an-toerana
          </p>

          <ul className="space-y-3">
            {fokontany.map((item) => (
              <li key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-earth-50">
                <span className="text-earth-800 font-medium">{item.nom}</span>
                {item.chef && (
                  <span className="ml-2 text-earth-500 text-xs">
                    Chef: {item.chef}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}