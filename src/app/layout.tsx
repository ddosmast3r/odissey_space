import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Roboto_Mono, Press_Start_2P, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

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
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} ${pixelFont.variable} ${poppins.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme') || 'dark';
                  if (savedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
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
              {/* Desktop Navigation */}
              <nav className="hidden md:flex gap-6 lg:gap-8 text-base lg:text-lg font-medium font-poppins">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">Home</Link>
                <Link href="/projects/professional" className="text-gray-300 hover:text-white transition-colors duration-200">Professional</Link>
                <Link href="/projects/personal" className="text-gray-300 hover:text-white transition-colors duration-200">Personal</Link>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About Me</Link>
              </nav>
              
              {/* Mobile Navigation */}
              <nav className="md:hidden flex gap-4 text-sm font-medium font-poppins">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">Home</Link>
                <Link href="/projects/professional" className="text-gray-300 hover:text-white transition-colors duration-200">Work</Link>
                <Link href="/projects/personal" className="text-gray-300 hover:text-white transition-colors duration-200">Personal</Link>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About Me</Link>
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
