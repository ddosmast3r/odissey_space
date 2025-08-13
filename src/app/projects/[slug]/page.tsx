import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

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
    <article className="prose dark:prose-invert max-w-3xl mx-auto py-10">
      <h1>{project.title}</h1>
      <div className="text-sm opacity-70 mb-6">
        {(project.projectType === "professional" ? "Professional" : "Personal") + (project.year ? ` • ${project.year}` : "")}
      </div>
      <MDXRemote source={project.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
    </article>
  );
}


