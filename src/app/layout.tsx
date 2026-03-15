import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "subtrack — Abonelik Takip",
  description:
    "Online aboneliklerini kolayca takip et. Yenileme tarihleri, fiyatlar, harcama analizi.",
  manifest: "/manifest.json",
  openGraph: {
    title: "subtrack",
    description: "Online aboneliklerini kolayca takip et",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#5b4cf5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
