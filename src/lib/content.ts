import rawContent from "@/generated/content.json";

type RawContent = {
  cases: Record<string, { html: string; frontmatter: Record<string, unknown> }>;
  exercises: Record<string, { html: string; frontmatter: Record<string, unknown> }>;
  solutions: Record<string, { html: string; frontmatter: Record<string, unknown> }>;
};

const content = rawContent as RawContent;

export type ContentSection = {
  id: string;
  title: string;
  content: string;
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

function getCaseEntries(slug: string) {
  const prefix = `${slug}/`;
  const result: Record<string, { html: string; frontmatter: Record<string, unknown> }> = {};
  for (const [key, entry] of Object.entries(content.cases)) {
    if (key.startsWith(prefix)) {
      result[key.slice(prefix.length)] = entry;
    }
  }
  return result;
}

function getSolutionEntries(slug: string) {
  const prefix = `${slug}/`;
  const result: Record<string, { html: string; frontmatter: Record<string, unknown> }> = {};
  for (const [key, entry] of Object.entries(content.solutions)) {
    if (key.startsWith(prefix)) {
      result[key.slice(prefix.length)] = entry;
    }
  }
  return result;
}

export async function getAllCases(): Promise<ContentItem[]> {
  const slugs = new Set<string>();
  for (const key of Object.keys(content.cases)) {
    const slug = key.split("/")[0];
    if (slug) slugs.add(slug);
  }

  const items = await Promise.all(
    Array.from(slugs).map(async (slug) => {
      const entries = getCaseEntries(slug);
      const requirements = entries["requirements"];
      if (!requirements) return null;
      const frontmatter = requirements.frontmatter;
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

  return (items.filter(Boolean) as ContentItem[]).sort((a, b) => a.order - b.order);
}

export async function getCaseContent(slug: string): Promise<{ meta: ContentMeta; sections: ContentSection[] } | null> {
  const entries = getCaseEntries(slug);
  if (Object.keys(entries).length === 0) return null;
  const keys = Object.keys(entries).sort();

  let meta: ContentMeta = {
    title: slug,
    description: "",
    difficulty: "intermediate",
    order: 999,
  };

  const sections: ContentSection[] = [];

  for (const key of keys) {
    const entry = entries[key];
    const frontmatter = entry.frontmatter;

    if (key === "requirements") {
      meta = {
        title: (frontmatter.title as string) || slug,
        description: (frontmatter.description as string) || "",
        difficulty: (frontmatter.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate",
        tags: (frontmatter.tags as string[]) || [],
        order: (frontmatter.order as number) || 999,
      };
    }

    sections.push({
      id: key,
      title: (frontmatter.title as string) || key,
      content: entry.html,
    });
  }

  return { meta, sections };
}

export async function getAllExercises(): Promise<ContentItem[]> {
  const entries = Object.entries(content.exercises);

  const items = await Promise.all(
    entries.map(async ([slug, entry]) => {
      const frontmatter = entry.frontmatter;
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

export async function getExerciseContent(slug: string): Promise<{ meta: ContentMeta; content: string } | null> {
  const entry = content.exercises[slug];
  if (!entry) return null;

  return {
    meta: {
      title: (entry.frontmatter.title as string) || slug,
      description: (entry.frontmatter.description as string) || "",
      difficulty: (entry.frontmatter.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate",
      tags: (entry.frontmatter.tags as string[]) || [],
      order: (entry.frontmatter.order as number) || 999,
    },
    content: entry.html,
  };
}

export async function getSolutionContent(slug: string): Promise<{ meta: ContentMeta; sections: ContentSection[] } | null> {
  const entries = getSolutionEntries(slug);
  if (Object.keys(entries).length === 0) return null;
  const keys = Object.keys(entries).sort();

  let meta: ContentMeta = {
    title: slug,
    description: "",
    difficulty: "intermediate",
    order: 999,
  };

  const sections: ContentSection[] = [];

  for (const key of keys) {
    const entry = entries[key];
    const frontmatter = entry.frontmatter;

    if (key === "architecture") {
      meta = {
        title: (frontmatter.title as string) || slug,
        description: (frontmatter.description as string) || "",
        difficulty: (frontmatter.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate",
        tags: (frontmatter.tags as string[]) || [],
        order: (frontmatter.order as number) || 999,
      };
    }

    sections.push({
      id: key,
      title: (frontmatter.title as string) || key,
      content: entry.html,
    });
  }

  return { meta, sections };
}
