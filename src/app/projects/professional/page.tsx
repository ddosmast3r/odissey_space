import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/projects";

export const metadata = {
  title: "Professional Projects",
};

export default function ProfessionalProjectsPage() {
  const projects = getAllProjects().filter((p) => p.projectType === "professional");
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Professional Projects</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto">
          Commercial games, client work, and professional collaborations showcasing 
          my expertise in game development and level design.
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
          <p className="text-lg opacity-70">No professional projects yet.</p>
          <p className="text-sm opacity-50 mt-2">Check back soon for updates!</p>
        </div>
      )}
    </div>
  );
}


