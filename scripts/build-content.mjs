import fs from "fs/promises";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { renderToString } from "react-dom/server";

async function main() {
  const contentDir = path.join(process.cwd(), "src/content");
  const result = {
    cases: {},
    exercises: {},
    solutions: {},
  };

  const processMdx = async (srcPath, category, key) => {
    const raw = await fs.readFile(srcPath, "utf8");
    try {
      const { content, frontmatter } = await compileMDX({
        source: raw,
        options: { parseFrontmatter: true },
      });
      const html = renderToString(content);
      result[category][key] = { html, frontmatter };
    } catch (err) {
      console.error(`Error compiling MDX: ${srcPath}`);
      console.error(err.message);
      throw err;
    }
  };

  // cases
  const casesDir = path.join(contentDir, "cases");
  const caseEntries = await fs.readdir(casesDir, { withFileTypes: true });
  for (const entry of caseEntries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const casePath = path.join(casesDir, slug);
    const files = await fs.readdir(casePath);
    for (const file of files) {
      if (!file.endsWith(".mdx")) continue;
      await processMdx(
        path.join(casePath, file),
        "cases",
        `${slug}/${file.replace(".mdx", "")}`
      );
    }
  }

  // exercises
  const exercisesDir = path.join(contentDir, "exercises");
  const exerciseFiles = await fs.readdir(exercisesDir);
  for (const file of exerciseFiles) {
    if (!file.endsWith(".mdx")) continue;
    const slug = file.replace(".mdx", "");
    await processMdx(
      path.join(exercisesDir, file),
      "exercises",
      slug
    );
  }

  // solutions
  const solutionsDir = path.join(contentDir, "solutions");
  const solutionEntries = await fs.readdir(solutionsDir, { withFileTypes: true });
  for (const entry of solutionEntries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const solutionPath = path.join(solutionsDir, slug);
    const files = await fs.readdir(solutionPath);
    for (const file of files) {
      if (!file.endsWith(".mdx")) continue;
      await processMdx(
        path.join(solutionPath, file),
        "solutions",
        `${slug}/${file.replace(".mdx", "")}`
      );
    }
  }

  const outputPath = path.join(process.cwd(), "src/generated/content.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
  console.log("Generated src/generated/content.json");
}

main();
