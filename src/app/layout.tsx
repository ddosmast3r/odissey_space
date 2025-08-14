import type { Metadata } from "next";
import Link from "next/link";
import { Roboto, Roboto_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = savedTheme || 'dark';
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <ThemeProvider>
          <header className="bg-black border-b border-gray-700 z-50">
            <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
              <nav className="flex gap-8 text-lg font-medium">
                <Link href="/" className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors duration-200">Home</Link>
                <Link href="/projects/professional" className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors duration-200">Professional</Link>
                <Link href="/projects/personal" className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors duration-200">Personal</Link>
                <Link href="/about" className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors duration-200">About</Link>
              </nav>
              <ThemeToggle />
            </div>
          </header>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
