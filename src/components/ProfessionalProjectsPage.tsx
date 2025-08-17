'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Project } from '@/lib/projects';
import ProjectsPageBase from './ProjectsPageBase';

interface ProfessionalProjectsPageProps {
  projects: Project[];
}

export default function ProfessionalProjectsPage({ projects }: ProfessionalProjectsPageProps) {
  const { t } = useLanguage();

  return (
    <ProjectsPageBase
      projects={projects}
      title={t('professionalPage.title')}
      description={t('professionalPage.description')}
      noProjectsMessage={t('professionalPage.noProjects')}
      additionalMessage={t('professionalPage.checkBack')}
    />
  );
}