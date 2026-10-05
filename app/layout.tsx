import type { Metadata, Viewport } from "next";
// Self-hosted fonts (latin subsets only) — no third-party font requests.
import "@fontsource/stix-two-text/latin-400.css";
import "@fontsource/stix-two-text/latin-400-italic.css";
import "@fontsource/stix-two-text/latin-600.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/courier-prime/latin-400.css";
import "@fontsource/fredoka/latin-600.css";
import "@fontsource/fredoka/latin-700.css";
import "./globals.css";
import { Sidebar } from "@/components/shell/Sidebar";
import { TabBar } from "@/components/ui/TabBar";
import { PlateDefs } from "@/components/illustrations/PhotoPlate";
import { THEME_BOOT } from "@/lib/themes";
import { Splash, SPLASH_BOOT } from "@/components/shell/Splash";

export const metadata: Metadata = {
  title: { default: "datelist", template: "%s · datelist" },
  description: "Our plans, the places we keep saying we'll go, and what we remember.",
  robots: { index: false, follow: false }, // it's ours
  icons: { icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>♡</text></svg>" },
};

export const viewport: Viewport = {
  themeColor: "#FBFBF9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // the theme attribute is set by THEME_BOOT before React loads
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT + SPLASH_BOOT }} />
      </head>
      <body>
        <Splash />
        <PlateDefs />
        <Sidebar />
        <main id="main" className="pb-28 pt-[env(safe-area-inset-top)] lg:pb-0 lg:pl-[248px]">
          {children}
        </main>
        <TabBar />
      </body>
    </html>
  );
}
