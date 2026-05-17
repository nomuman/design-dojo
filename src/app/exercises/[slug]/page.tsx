import { notFound } from "next/navigation";
import Link from "next/link";
import { getExerciseContent, getAllExercises } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExerciseEditor } from "@/components/ExerciseEditor";

export async function generateStaticParams() {
  const exercises = await getAllExercises();
  return exercises.map((e) => ({ slug: e.slug }));
}

export default async function ExercisePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getExerciseContent(slug);

  if (!data) notFound();

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{data.meta.title}</h1>
          <Badge
            variant={
              data.meta.difficulty === "beginner"
                ? "secondary"
                : data.meta.difficulty === "advanced"
                  ? "destructive"
                  : "default"
            }
          >
            {data.meta.difficulty}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">{data.meta.description}</p>
      </div>

      <div className="prose dark:prose-invert max-w-none border p-4 md:p-6 rounded-lg bg-card">
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">自分の設計を書く</h2>
          <Link href={`/exercises/${slug}/solution`}>
            <Button variant="outline">模範解答を見る</Button>
          </Link>
        </div>
        <ExerciseEditor slug={slug} />
      </div>
    </div>
  );
}
