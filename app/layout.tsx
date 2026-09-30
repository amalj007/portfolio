import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cursor, ScrollProgress, SiteHeader } from "@/components/site-ui";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollDirector } from "@/components/scroll-director";
import "./globals.css";
import "./portfolio-effects.css";
import "./liquid-glass.css";
import "./glass-navigation.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://amalj007.github.io/portfolio/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Amal Joy — Intelligent Automation & Robotics Engineer",
    template: "%s · Amal Joy",
  },
  description:
    "Amal Joy is an Automation and Robotics Engineer building dependable PLC, SCADA, marine, aerospace, and Industry 4.0 control systems.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Amal Joy — Intelligent Automation & Robotics Engineer",
    description:
      "Automation across marine vessels, aerospace facilities, and industrial processes.",
    siteName: "Amal Joy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ScrollProgress />
        <Cursor />
        <SmoothScroll>
          <SiteHeader />
          <ScrollDirector>{children}</ScrollDirector>
        </SmoothScroll>
      </body>
    </html>
  );
}
