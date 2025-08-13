import type { Metadata } from "next";
import Link from "next/link";
import { Roboto, Roboto_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
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
        className={`${roboto.variable} ${robotoMono.variable} ${pixelFont.variable} antialiased`}
      >
        <header className="border-b border-black/10 dark:border-white/10">
          <div className="max-w-4xl mx-auto p-4 flex justify-center gap-8 text-sm">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/projects/professional" className="hover:text-blue-600 transition-colors">Professional</Link>
            <Link href="/projects/personal" className="hover:text-blue-600 transition-colors">Personal</Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
