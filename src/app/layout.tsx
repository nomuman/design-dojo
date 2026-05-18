import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MermaidInit } from "@/components/MermaidInit";
import { getAllCases, getAllExercises } from "@/lib/content";

const siteName = "design-dojo";
const siteDescription =
  "要件定義、API設計、DB設計、アーキテクチャ設計をケース読解と演習で鍛える体験型ドリル。";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://design-dojo.nomuman625.workers.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: siteName,
    description: siteDescription,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cases = await getAllCases();
  const exercises = await getAllExercises();

  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex">
        <Sidebar cases={cases} exercises={exercises} />
        <main className="flex-1 min-w-0 overflow-auto">
          <div className="mx-auto max-w-4xl px-4 pb-6 pt-[calc(env(safe-area-inset-top)+5rem)] md:p-8">
            {children}
          </div>
        </main>
        <MermaidInit />
      </body>
    </html>
  );
}
