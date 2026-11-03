import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getLangAndDict } from "@/lib/lang";
import { getSessionUser } from "@/lib/auth";
import { logout } from "./actions/auth";
import { LangProvider } from "@/components/lang-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { OG_IMAGE, languageAlternates } from "@/lib/seo";
import { SITE_NAME, SITE_ORG, SITE_URL } from "@/lib/site";

const DEFAULT_TITLE = `${SITE_NAME} — Vaovao sy serivisy ho an'ny mponina`;
const DEFAULT_DESCRIPTION =
  "Sehatra ofisialy ho an'ny mponina ao Viliahazo: vaovao, taratasy sy fitantanana, trano sy fanampiana sosialy, fitaterana, asa ary hetsika kolontsaina. / Plateforme officielle de la commune rurale de Viliahazo (Madagascar).";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Viliahazo",
    "kaominina Viliahazo",
    "commune rurale Viliahazo",
    "Madagasikara",
    "Madagascar",
    "vaovao Viliahazo",
    "taratasy kaominina",
    "fanamarinam-ponenana",
    "fanampiana sosialy",
    "fitaterana",
    "asa",
    "hetsika",
    "Ben'ny tanàna",
    SITE_ORG.mayor,
  ],
  authors: [{ name: SITE_ORG.name, url: SITE_URL }],
  creator: SITE_ORG.name,
  publisher: SITE_ORG.name,
  category: "government",
  alternates: { languages: languageAlternates("/") },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "mg_MG",
    alternateLocale: ["fr_MG"],
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false, address: false, email: false },
  other: {
    "geo.region": "MG",
    "geo.placename": "Viliahazo",
  },
};

export const viewport: Viewport = {
  themeColor: "#25582b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang, t } = await getLangAndDict();
  const user = await getSessionUser();

  return (
    <html lang={lang}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd(lang)} />
        <LangProvider lang={lang} t={t}>
          <SiteHeader lang={lang} t={t} user={user} logout={logout} />
          <main className="flex-1">{children}</main>
          <SiteFooter t={t} />
        </LangProvider>
      </body>
    </html>
  );
}
