'use client';

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from '@/contexts/LanguageContext';
import Pico8Player from "@/components/Pico8Player";
import AnimatedSubtitle from './AnimatedSubtitle';
import { Project } from '@/lib/projects';
import { getTranslatedProject } from '@/lib/projectTranslations';

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
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
        <Link href="/projects/professional" className="group frosted-glass p-4 md:p-6 rounded-lg transition-all duration-300">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-green-500 font-poppins">{t('home.professionalProjects')}</h3>
          <p className="text-xs md:text-sm opacity-70">{t('home.professionalDesc')}</p>
        </Link>
        <Link href="/projects/personal" className="group frosted-glass p-4 md:p-6 rounded-lg transition-all duration-300">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-green-500 font-poppins">{t('home.personalProjects')}</h3>
          <p className="text-xs md:text-sm opacity-70">{t('home.personalDesc')}</p>
        </Link>
        <Link href="/projects" className="group frosted-glass p-4 md:p-6 rounded-lg transition-all duration-300">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-green-500 font-poppins">{t('home.allProjects')}</h3>
          <p className="text-xs md:text-sm opacity-70">{t('home.allProjectsDesc')}</p>
        </Link>
        <Link href="/about" className="group frosted-glass p-4 md:p-6 rounded-lg transition-all duration-300">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-green-500 font-poppins">{t('home.aboutMe')}</h3>
          <p className="text-xs md:text-sm opacity-70">{t('home.aboutMeDesc')}</p>
        </Link>
      </div>

      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 font-poppins">{t('home.featuredProjects')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((p) => {
            const translatedProject = getTranslatedProject(p, t);
            return (
              <div key={p.slug} className="group frosted-glass rounded-lg p-6 transition-all duration-300 h-full">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center h-full">
                  {/* Project Icon/Image */}
                  <div className="flex-shrink-0 w-16 h-16 mx-auto sm:mx-0 sm:self-start">
                    {translatedProject.cover ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={translatedProject.cover}
                          alt={translatedProject.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-2xl opacity-50">🎮</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Project Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left w-full sm:w-auto flex flex-col justify-start">
                    {/* Title - fixed height */}
                    <div className="text-xl font-semibold mb-2 group-hover:text-green-500 min-h-[28px] flex items-start justify-center sm:justify-start">
                      <Link href={`/projects/${p.slug}`} className="text-center sm:text-left">{translatedProject.title}</Link>
                    </div>
                    
                    {/* Type and Company - fixed height */}
                    <div className="text-sm opacity-70 mb-2 min-h-[24px]">
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <span className={`px-2 py-1 rounded text-xs ${p.projectType === "professional" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"}`}>
                          {p.projectType === "professional" ? t('projectsPage.professional') : t('projectsPage.personal')}
                        </span>
                        {p.company && <span className="font-medium">{p.company}</span>}
                      </div>
                    </div>
                    
                    {/* Date - fixed height */}
                    <div className="text-sm opacity-70 mb-3 min-h-[20px] text-center sm:text-left">
                      {p.workPeriod && <span>{p.workPeriod}</span>}
                      {!p.workPeriod && p.year && <span>{p.year}</span>}
                    </div>
                    
                    {/* Description - flexible height */}
                    <div className="text-sm opacity-80 line-clamp-2 flex-1">
                      {translatedProject.description || ''}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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