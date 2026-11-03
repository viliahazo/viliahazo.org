import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getLangAndDict } from "@/lib/lang";
import { getSessionUser } from "@/lib/auth";
import { logout } from "./actions/auth";
import { LangProvider } from "@/components/lang-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "Viliahazo — Vaovao sy serivisy ho an'ny mponina",
    template: "%s · Viliahazo",
  },
  description:
    "Sehatra ofisialy ho an'ny mponina ao Viliahazo: vaovao, taratasy sy fitantanana, trano sy fanampiana sosialy, fitaterana, asa ary hetsika kolontsaina.",
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
        <LangProvider lang={lang} t={t}>
          <SiteHeader lang={lang} t={t} user={user} logout={logout} />
          <main className="flex-1">{children}</main>
          <SiteFooter t={t} />
        </LangProvider>
      </body>
    </html>
  );
}
