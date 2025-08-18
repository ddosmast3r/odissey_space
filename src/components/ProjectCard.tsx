'use client';

import Image from "next/image";
import Link from "next/link";
import { Project } from "@/lib/projects";
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslatedProject } from '@/lib/projectTranslations';

export default function ProjectCard({ project }: { project: Project }) {
  const { t } = useLanguage();
  const translatedProject = getTranslatedProject(project, t);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block frosted-glass rounded-2xl p-6 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        {(project.icon || translatedProject.cover) ? (
          <div className="flex-shrink-0 w-full sm:w-48 md:w-32 lg:w-36">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={project.icon || translatedProject.cover}
                alt={translatedProject.title}
                fill
                className={`object-cover transition-transform duration-300 ${
                  project.icon 
                    ? 'object-center scale-125 group-hover:scale-135' 
                    : 'object-cover group-hover:scale-105'
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 192px, (max-width: 1024px) 128px, 144px"
                unoptimized={project.icon?.endsWith('.gif')}
              />
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0 w-full sm:w-48 md:w-32 lg:w-36">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl md:text-3xl opacity-50">🎮</span>
            </div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="text-lg md:text-xl font-semibold mb-2 group-hover:text-green-500 transition-colors font-poppins">
            {translatedProject.title}
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.projectType === "professional" 
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
            }`}>
              {project.projectType === "professional" ? t('projectsPage.professional') : t('projectsPage.personal')}
            </span>
            {project.workPeriod ? (
              <span className="text-sm opacity-70 font-medium">{project.workPeriod}</span>
            ) : project.year && (
              <span className="text-sm opacity-70 font-medium">{project.year}</span>
            )}
          </div>
          
          {project.disciplines?.length ? (
            <div className="flex flex-wrap gap-2 mb-3">
              {project.disciplines.map((discipline, index) => (
                <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded opacity-80">
                  {discipline}
                </span>
              ))}
            </div>
          ) : null}
          
          {translatedProject.description && (
            <p className="text-sm opacity-80 line-clamp-2">{translatedProject.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}


