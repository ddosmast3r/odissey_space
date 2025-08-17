import { getAllProjects } from "@/lib/projects";
import ProfessionalProjectsPage from "@/components/ProfessionalProjectsPage";

export const metadata = {
  title: "Professional Projects",
};

export default function Page() {
  const projects = getAllProjects().filter((p) => p.projectType === "professional");
  
  return <ProfessionalProjectsPage projects={projects} />;
}


