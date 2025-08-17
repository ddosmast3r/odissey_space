import { Project } from './projects';
import { Language } from '@/contexts/LanguageContext';

type ProjectTranslationKey = 'sherlock' | 'empire' | 'stint';

const projectKeyMap: Record<string, ProjectTranslationKey> = {
  'sherlock-hidden-match-3': 'sherlock',
  'empire-of-vampire': 'empire',
  'stint-rift-apart': 'stint'
};

export function getProjectTranslationKey(slug: string): ProjectTranslationKey | null {
  return projectKeyMap[slug] || null;
}

export function getTranslatedProject(project: Project, t: (key: string) => string): Project {
  const translationKey = getProjectTranslationKey(project.slug);
  
  if (!translationKey) {
    return project;
  }
  
  const translatedTitle = t(`projects.${translationKey}.title`);
  const translatedDescription = t(`projects.${translationKey}.description`);
  
  return {
    ...project,
    title: translatedTitle !== `projects.${translationKey}.title` ? translatedTitle : project.title,
    description: translatedDescription !== `projects.${translationKey}.description` ? translatedDescription : project.description
  };
}