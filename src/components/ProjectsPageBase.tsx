'use client';

import ProjectCard from "@/components/ProjectCard";
import { Project } from '@/lib/projects';

interface ProjectsPageBaseProps {
  projects: Project[];
  title: string;
  description: string;
  noProjectsMessage: string;
  additionalMessage: string;
}

export default function ProjectsPageBase({ 
  projects, 
  title, 
  description, 
  noProjectsMessage, 
  additionalMessage 
}: ProjectsPageBaseProps) {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto">
          {description}
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
          <p className="text-lg opacity-70">{noProjectsMessage}</p>
          <p className="text-sm opacity-50 mt-2">{additionalMessage}</p>
        </div>
      )}
    </div>
  );
}