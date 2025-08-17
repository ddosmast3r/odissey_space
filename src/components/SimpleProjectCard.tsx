'use client';

import Link from "next/link";
import { ProjectBase } from "@/types/project";
import { useLanguage } from '@/contexts/LanguageContext';

export default function SimpleProjectCard({ project }: { project: ProjectBase }) {
  const { t } = useLanguage();

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block p-6 frosted-glass rounded-lg transition-all duration-300"
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          {project.year && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {project.year}
            </span>
          )}
        </div>
        
        {project.company && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <span>{t('projectCard.company')}:</span>
            <span className="font-medium">{project.company}</span>
          </div>
        )}
        
        {project.workPeriod && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <span>{t('projectCard.period')}:</span>
            <span className="font-medium">{project.workPeriod}</span>
          </div>
        )}
        
        {project.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}
        
        <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
          {t('projectCard.viewDetails')} →
        </div>
      </div>
    </Link>
  );
}