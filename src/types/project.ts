// Общий базовый тип для проектов, используемый в компонентах
export interface ProjectBase {
  slug: string;
  title: string;
  projectType: 'professional' | 'personal';
  company?: string;
  workPeriod?: string;
  year?: string;
  description?: string;
}

// Расширенный тип проекта для ProjectCard
export interface ProjectCardProps extends ProjectBase {
  className?: string;
}