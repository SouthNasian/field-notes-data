
import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";


export const metadata: Metadata = {
  metadataBase: new URL("https://fieldnotesanddata.com"),
  title: {
    default: "Field Notes & Data | AI, Analytics & Curiosity",
    template: "%s | Field Notes & Data",
  },
  description:
    "Curious inquiries. Real data. AI-assisted answers. Exploring data visualization, analytics, and observations from the field.",
  applicationName: "Field Notes & Data",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Field Notes & Data",
    title: "Field Notes & Data | AI, Analytics & Curiosity",
    description:
      "Curious inquiries. Real data. AI-assisted answers. Exploring data visualization, analytics, and observations from the field.",
    url: "https://fieldnotesanddata.com",
    locale: "en_US",
  },
  twitter: {},
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
