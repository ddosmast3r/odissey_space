import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ProjectFrontmatter = {
  title: string;
  slug: string;
  projectType: "professional" | "personal";
  disciplines?: string[];
  primaryDiscipline?: string;
  engine?: string;
  tools?: string[];
  year?: number;
  duration?: string;
  tags?: string[];
  cover?: string;
  gallery?: string[];
  video?: string;
  client?: string;
  studio?: string;
  company?: string;
  role?: string;
  teamSize?: number;
  responsibilities?: string[];
  platforms?: string[];
  status?: string;
  NDA?: boolean;
  goal?: string;
  learningFocus?: string[];
  jam?: string;
  description?: string;
  url?: string;
};

export type Project = ProjectFrontmatter & {
  content: string;
  description: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

export function getAllProjects(): Project[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return files
    .map((filename) => {
      const filePath = path.join(CONTENT_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const fm = data as ProjectFrontmatter;
      const slug = fm.slug || path.basename(filename, path.extname(filename));
      const description = fm.description || content.slice(0, 200) + "...";
      return { ...fm, slug, content, description } as Project;
    })
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

export function getProjectBySlug(slug: string): Project | null {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  for (const filename of files) {
    const filePath = path.join(CONTENT_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const fm = data as ProjectFrontmatter;
    const projectSlug = fm.slug || path.basename(filename, path.extname(filename));
    const description = fm.description || content.slice(0, 200) + "...";
    if (projectSlug === slug) return { ...fm, slug: projectSlug, content, description } as Project;
  }
  return null;
}


