import { getAllProjects } from "@/lib/projects";
import HomePage from "@/components/HomePage";

export default function Home() {
  const projects = getAllProjects();
  const featured = projects.slice(0, 4);
  
  return <HomePage featured={featured} />;
}
