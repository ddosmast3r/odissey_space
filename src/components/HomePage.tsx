'use client';

import Link from "next/link";
import { useLanguage } from '@/contexts/LanguageContext';
import Pico8Player from "@/components/Pico8Player";
import AnimatedSubtitle from './AnimatedSubtitle';

interface Project {
  slug: string;
  title: string;
  projectType: 'professional' | 'personal';
  company?: string;
  workPeriod?: string;
  year?: string;
  description?: string;
}

interface HomePageProps {
  featured: Project[];
}

export default function HomePage({ featured }: HomePageProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-16 px-4">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-pixel relative">
          <span className="relative z-10 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent matrix-text-glow">
            {t('home.title')}
          </span>
          <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-green-400 opacity-30 blur-sm animate-pulse">
            {t('home.title')}
          </span>
        </h1>
        <AnimatedSubtitle />
        <p className="text-base md:text-lg opacity-70 max-w-2xl mx-auto">
          {t('home.description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
        <Link href="/projects/professional" className="group frosted-glass p-4 md:p-6 rounded-lg transition-all duration-300">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-blue-600 font-poppins">{t('home.professionalProjects')}</h3>
          <p className="text-xs md:text-sm opacity-70">{t('home.professionalDesc')}</p>
        </Link>
        <Link href="/projects/personal" className="group frosted-glass p-4 md:p-6 rounded-lg transition-all duration-300">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-blue-600 font-poppins">{t('home.personalProjects')}</h3>
          <p className="text-xs md:text-sm opacity-70">{t('home.personalDesc')}</p>
        </Link>
        <Link href="/projects" className="group frosted-glass p-4 md:p-6 rounded-lg transition-all duration-300">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-blue-600 font-poppins">{t('home.allProjects')}</h3>
          <p className="text-xs md:text-sm opacity-70">{t('home.allProjectsDesc')}</p>
        </Link>
        <Link href="/about" className="group frosted-glass p-4 md:p-6 rounded-lg transition-all duration-300">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-blue-600 font-poppins">{t('home.aboutMe')}</h3>
          <p className="text-xs md:text-sm opacity-70">{t('home.aboutMeDesc')}</p>
        </Link>
      </div>

      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 font-poppins">{t('home.featuredProjects')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((p) => (
            <div key={p.slug} className="group frosted-glass rounded-lg p-6 transition-all duration-300">
              <div className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                <Link href={`/projects/${p.slug}`}>{p.title}</Link>
              </div>
              <div className="text-sm opacity-70 mb-3">
                <span className={`px-2 py-1 rounded text-xs ${p.projectType === "professional" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                  {p.projectType === "professional" ? t('projectsPage.professional') : t('projectsPage.personal')}
                </span>
                {p.company && <span className="ml-2 font-medium">{p.company}</span>}
                {p.workPeriod && <span className="ml-2">({p.workPeriod})</span>}
                {!p.workPeriod && p.year && <span className="ml-2">({p.year})</span>}
              </div>
              {p.description && (
                <p className="text-sm opacity-80">{p.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 md:mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 font-poppins">{t('home.picoGame')}</h2>
        <div className="flex justify-center px-4">
          <div className="w-full max-w-lg mx-auto">
            <Pico8Player width={512} height={512} />
          </div>
        </div>
      </section>
    </div>
  );
}