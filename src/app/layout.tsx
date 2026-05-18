import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MermaidInit } from "@/components/MermaidInit";
import { getAllCases, getAllExercises } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "design-dojo",
  description: "設計力・要件定義力の体験型ドリル",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cases = await getAllCases();
  const exercises = await getAllExercises();

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <Sidebar cases={cases} exercises={exercises} />
        <main className="flex-1 min-w-0 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 pb-4 pt-20 md:p-8">{children}</div>
        </main>
        <MermaidInit />
      </body>
    </html>
  );
}
