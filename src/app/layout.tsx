import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteStateTracker } from "@/components/ui/site-header/SiteStateTracker";
import { SkipLink } from "@/components/ui/site-header/SkipLink";
import { fontVariables } from "@/lib/fonts";
import { ScrollProvider } from "@/lib/motion/ScrollProvider";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${site.name} | ${site.role}`,
  description: site.tagline,
};

export const viewport: Viewport = {
  themeColor: "#25151E",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={fontVariables}>
      <head>
        {/* Without JS the spatial scene cannot mount, so show the stacked composition on every viewport. */}
        <noscript>
          <style>{".intro-runway{display:none!important}.intro-fallback{display:block!important}"}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-background font-sans text-text">
        <ScrollProvider>
          <SkipLink />
          <SiteHeader />
          <SiteStateTracker />
          <main id="contenido" tabIndex={-1} className="relative outline-none">
            {children}
          </main>
        </ScrollProvider>
      </body>
    </html>
  );
}
