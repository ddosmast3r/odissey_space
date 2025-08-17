'use client';

import ProjectCard from "@/components/ProjectCard";
import { useLanguage } from '@/contexts/LanguageContext';

interface Project {
  slug: string;
  title: string;
  projectType: 'professional' | 'personal';
  company?: string;
  workPeriod?: string;
  year?: string;
  description?: string;
}

interface ProfessionalProjectsPageProps {
  projects: Project[];
}

export default function ProfessionalProjectsPage({ projects }: ProfessionalProjectsPageProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('professionalPage.title')}</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto">
          {t('professionalPage.description')}
        </p>
      </div>
      
      {projects.length > 0 ? (
        <div className="grid gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg opacity-70">{t('professionalPage.noProjects')}</p>
          <p className="text-sm opacity-50 mt-2">{t('professionalPage.checkBack')}</p>
        </div>
      )}
    </div>
  );
}