import Link from "next/link";
import { Mail, MapPin, Phone, Sprout } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

export function SiteFooter({ t }: { t: Dictionary }) {
  return (
    <footer className="mt-16 border-t border-earth-200 bg-leaf-900 text-leaf-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-leaf-50 text-leaf-800">
              <Sprout className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg font-extrabold">{t.common.siteName}</span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-leaf-100/80">
            {t.footer.about}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-leaf-200">
            {t.footer.links}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/vaovao" className="hover:underline">
                {t.nav.news}
              </Link>
            </li>
            <li>
              <Link href="/taratasy" className="hover:underline">
                {t.nav.procedures}
              </Link>
            </li>
            <li>
              <Link href="/trano" className="hover:underline">
                {t.nav.housing}
              </Link>
            </li>
            <li>
              <Link href="/fitaterana" className="hover:underline">
                {t.nav.transport}
              </Link>
            </li>
            <li>
              <Link href="/asa" className="hover:underline">
                {t.nav.jobs}
              </Link>
            </li>
            <li>
              <Link href="/hetsika" className="hover:underline">
                {t.nav.events}
              </Link>
            </li>
            <li>
              <Link href="/fokontany" className="hover:underline">
                {t.nav.fokontany}
              </Link>
            </li>
            <li>
              <Link href="/mifandraisa" className="hover:underline">
                {t.nav.contact}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-leaf-200">
            {t.footer.contact}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-leaf-100/90">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {t.footer.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              <a href="tel:+261340000000" className="hover:underline">
                034 00 000 00
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              <a href="mailto:contact@viliahazo.org" className="hover:underline">
                contact@viliahazo.org
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-leaf-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-leaf-200/80">
          <p>
            © {new Date().getFullYear()} {t.common.siteName}. {t.footer.rights}
          </p>
          <p>{t.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
