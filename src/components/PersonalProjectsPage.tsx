'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Project } from '@/lib/projects';
import ProjectsPageBase from './ProjectsPageBase';

interface PersonalProjectsPageProps {
  projects: Project[];
}

export default function PersonalProjectsPage({ projects }: PersonalProjectsPageProps) {
  const { t } = useLanguage();

  return (
    <ProjectsPageBase
      projects={projects}
      title={t('personalPage.title')}
      description={t('personalPage.description')}
      noProjectsMessage={t('personalPage.noProjects')}
      additionalMessage={t('personalPage.workingOn')}
    />
  );
}