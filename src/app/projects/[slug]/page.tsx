import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import ImageGallery from "@/components/ImageGallery";

type RouteParams = { slug: string };

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title };
}

export default async function ProjectPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return notFound();
  
  return (
    <article className="max-w-4xl mx-auto py-16 px-4">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-lg opacity-70">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.projectType === "professional" 
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          }`}>
            {project.projectType === "professional" ? "Professional" : "Personal"}
          </span>
          {project.workPeriod && (
            <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              📅 {project.workPeriod}
            </span>
          )}
          {project.year && !project.workPeriod && <span>{project.year}</span>}
          {project.company && (
            <span className="text-sm opacity-60">
              @ {project.company}
            </span>
          )}
        </div>
      </header>
      
      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-p:leading-relaxed prose-ul:my-6 prose-li:my-2">
        <MDXRemote 
          source={project.content} 
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          components={{ ImageGallery }}
        />
      </div>
    </article>
  );
}


