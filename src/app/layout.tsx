import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "odissey.space - Portfolio",
  description: "Level / Game / Technical Design Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b border-black/10 dark:border-white/10">
          <div className="max-w-4xl mx-auto p-4 flex gap-4 text-sm">
            <Link href="/">Home</Link>
            <Link href="/projects/professional">Professional</Link>
            <Link href="/projects/personal">Personal</Link>
            <Link href="/about">About</Link>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
