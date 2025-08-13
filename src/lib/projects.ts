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
  role?: string;
  teamSize?: number;
  responsibilities?: string[];
  platforms?: string[];
  status?: string;
  NDA?: boolean;
  goal?: string;
  learningFocus?: string[];
  jam?: string;
};

export type Project = ProjectFrontmatter & {
  content: string;
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
      return { ...fm, content } as Project;
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
    if (fm.slug === slug) return { ...fm, content } as Project;
  }
  return null;
}


