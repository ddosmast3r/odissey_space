import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Roboto_Mono, Press_Start_2P, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import SettingsMenu from "../components/SettingsMenu";
import Navigation from "../components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} ${pixelFont.variable} ${poppins.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Set default theme first
                  document.documentElement.classList.add('dark');
                  
                  var savedTheme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = savedTheme || (prefersDark ? 'dark' : 'light');
                  
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                  
                  // Preload language setting to prevent hydration mismatch
                  var savedLanguage = localStorage.getItem('language');
                  if (!savedLanguage) {
                    var browserLanguage = navigator.language.toLowerCase();
                    var detectedLanguage = browserLanguage.startsWith('ru') ? 'ru' : 'en';
                    localStorage.setItem('language', detectedLanguage);
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <ThemeProvider>
          <LanguageProvider>
            <header className="bg-black border-b border-green-400/40 z-50">
              <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
                <Navigation />
                <SettingsMenu />
              </div>
            </header>
            <main>{children}</main>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
