import { getAllProjects } from "@/lib/projects";
import PersonalProjectsPage from "@/components/PersonalProjectsPage";

export const metadata = {
  title: "Personal Projects",
};

export default function Page() {
  const projects = getAllProjects().filter((p) => p.projectType === "personal");
  
  return <PersonalProjectsPage projects={projects} />;
}


