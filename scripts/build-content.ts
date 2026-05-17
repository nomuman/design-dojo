import fs from "fs/promises";
import path from "path";

async function main() {
  const contentDir = path.join(process.cwd(), "src/content");
  const result: Record<string, Record<string, string>> = {
    cases: {},
    exercises: {},
    solutions: {},
  };

  // cases: src/content/cases/[slug]/[file].mdx
  const casesDir = path.join(contentDir, "cases");
  const caseEntries = await fs.readdir(casesDir, { withFileTypes: true });
  for (const entry of caseEntries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const casePath = path.join(casesDir, slug);
    const files = await fs.readdir(casePath);
    for (const file of files) {
      if (!file.endsWith(".mdx")) continue;
      const source = await fs.readFile(path.join(casePath, file), "utf8");
      result.cases[`${slug}/${file.replace(".mdx", "")}`] = source;
    }
  }

  // exercises: src/content/exercises/[slug].mdx
  const exercisesDir = path.join(contentDir, "exercises");
  const exerciseFiles = await fs.readdir(exercisesDir);
  for (const file of exerciseFiles) {
    if (!file.endsWith(".mdx")) continue;
    const slug = file.replace(".mdx", "");
    const source = await fs.readFile(path.join(exercisesDir, file), "utf8");
    result.exercises[slug] = source;
  }

  // solutions: src/content/solutions/[slug]/[file].mdx
  const solutionsDir = path.join(contentDir, "solutions");
  const solutionEntries = await fs.readdir(solutionsDir, { withFileTypes: true });
  for (const entry of solutionEntries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const solutionPath = path.join(solutionsDir, slug);
    const files = await fs.readdir(solutionPath);
    for (const file of files) {
      if (!file.endsWith(".mdx")) continue;
      const source = await fs.readFile(path.join(solutionPath, file), "utf8");
      result.solutions[`${slug}/${file.replace(".mdx", "")}`] = source;
    }
  }

  const outputPath = path.join(process.cwd(), "src/generated/content.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
  console.log("Generated src/generated/content.json");
}

main();
