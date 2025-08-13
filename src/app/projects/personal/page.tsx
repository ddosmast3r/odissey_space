import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/projects";

export const metadata = {
  title: "Personal Projects",
};

export default function PersonalProjectsPage() {
  const projects = getAllProjects().filter((p) => p.projectType === "personal");
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Personal Projects</h1>
        <p className="text-lg opacity-70 max-w-2xl mx-auto">
          Passion projects, experiments, and creative explorations where I push 
          boundaries and explore new ideas in game design and development.
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
          <p className="text-lg opacity-70">No personal projects yet.</p>
          <p className="text-sm opacity-50 mt-2">Currently working on some exciting experiments!</p>
        </div>
      )}
    </div>
  );
}


