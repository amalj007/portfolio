import type { Metadata, Viewport } from "next";
import { DM_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { Cursor, ScrollProgress, SiteHeader } from "@/components/site-ui";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollDirector } from "@/components/scroll-director";
import "./globals.css";

const display = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const mono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://amalj007.github.io/portfolio/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Amal Joy — Robotics & Automation Engineer",
    template: "%s · Amal Joy",
  },
  description:
    "Amal Joy is a Robotics and Automation Engineer building dependable control systems across marine, aerospace, and industrial environments.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Amal Joy — Robotics & Automation Engineer",
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
  themeColor: "#070a0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={display.variable + " " + mono.variable}>
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
