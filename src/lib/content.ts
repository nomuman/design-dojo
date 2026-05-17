import fs from "fs/promises";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";

export type ContentSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export type ContentMeta = {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags?: string[];
  order: number;
};

export type ContentItem = ContentMeta & {
  slug: string;
};

const CONTENT_DIR = path.join(process.cwd(), "src/content");

async function parseMdxFile(filePath: string): Promise<{ frontmatter: Record<string, unknown>; content: React.ReactNode }> {
  const source = await fs.readFile(filePath, "utf8");
  const { content, frontmatter } = await compileMDX({
    source,
    options: { parseFrontmatter: true },
  });
  return { frontmatter, content };
}

export async function getAllCases(): Promise<ContentItem[]> {
  const casesDir = path.join(CONTENT_DIR, "cases");
  const entries = await fs.readdir(casesDir, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory());

  const items = await Promise.all(
    dirs.map(async (dir) => {
      const slug = dir.name;
      const indexPath = path.join(casesDir, slug, "requirements.mdx");
      try {
        const { frontmatter } = await parseMdxFile(indexPath);
        return {
          slug,
          title: (frontmatter.title as string) || slug,
          description: (frontmatter.description as string) || "",
          difficulty: (frontmatter.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate",
          tags: (frontmatter.tags as string[]) || [],
          order: (frontmatter.order as number) || 999,
        };
      } catch {
        return null;
      }
    })
  );

  return (items.filter(Boolean) as ContentItem[]).sort((a, b) => a.order - b.order);
}

export async function getCaseContent(slug: string): Promise<{ meta: ContentMeta; sections: ContentSection[] }> {
  const caseDir = path.join(CONTENT_DIR, "cases", slug);
  const files = (await fs.readdir(caseDir))
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  let meta: ContentMeta = {
    title: slug,
    description: "",
    difficulty: "intermediate",
    order: 999,
  };

  const sections: ContentSection[] = [];

  for (const file of files) {
    const filePath = path.join(caseDir, file);
    const { frontmatter, content } = await parseMdxFile(filePath);

    if (file === "requirements.mdx") {
      meta = {
        title: (frontmatter.title as string) || slug,
        description: (frontmatter.description as string) || "",
        difficulty: (frontmatter.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate",
        tags: (frontmatter.tags as string[]) || [],
        order: (frontmatter.order as number) || 999,
      };
    }

    sections.push({
      id: file.replace(".mdx", ""),
      title: (frontmatter.title as string) || file.replace(".mdx", ""),
      content,
    });
  }

  return { meta, sections };
}

export async function getAllExercises(): Promise<ContentItem[]> {
  const exercisesDir = path.join(CONTENT_DIR, "exercises");
  const files = await fs.readdir(exercisesDir);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  const items = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(".mdx", "");
      const filePath = path.join(exercisesDir, file);
      const { frontmatter } = await parseMdxFile(filePath);
      return {
        slug,
        title: (frontmatter.title as string) || slug,
        description: (frontmatter.description as string) || "",
        difficulty: (frontmatter.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate",
        tags: (frontmatter.tags as string[]) || [],
        order: (frontmatter.order as number) || 999,
      };
    })
  );

  return items.sort((a, b) => a.order - b.order);
}

export async function getExerciseContent(slug: string): Promise<{ meta: ContentMeta; content: React.ReactNode }> {
  const filePath = path.join(CONTENT_DIR, "exercises", `${slug}.mdx`);
  const { frontmatter, content } = await parseMdxFile(filePath);

  return {
    meta: {
      title: (frontmatter.title as string) || slug,
      description: (frontmatter.description as string) || "",
      difficulty: (frontmatter.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate",
      tags: (frontmatter.tags as string[]) || [],
      order: (frontmatter.order as number) || 999,
    },
    content,
  };
}

export async function getSolutionContent(slug: string): Promise<{ meta: ContentMeta; sections: ContentSection[] }> {
  const solutionDir = path.join(CONTENT_DIR, "solutions", slug);
  const files = (await fs.readdir(solutionDir))
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  let meta: ContentMeta = {
    title: slug,
    description: "",
    difficulty: "intermediate",
    order: 999,
  };

  const sections: ContentSection[] = [];

  for (const file of files) {
    const filePath = path.join(solutionDir, file);
    const { frontmatter, content } = await parseMdxFile(filePath);

    if (file === "architecture.mdx") {
      meta = {
        title: (frontmatter.title as string) || slug,
        description: (frontmatter.description as string) || "",
        difficulty: (frontmatter.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate",
        tags: (frontmatter.tags as string[]) || [],
        order: (frontmatter.order as number) || 999,
      };
    }

    sections.push({
      id: file.replace(".mdx", ""),
      title: (frontmatter.title as string) || file.replace(".mdx", ""),
      content,
    });
  }

  return { meta, sections };
}
