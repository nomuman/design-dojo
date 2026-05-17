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
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{data.meta.title}</h1>
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
        <p className="text-muted-foreground mt-2">{data.meta.description}</p>
      </div>

      <div className="prose dark:prose-invert max-w-none border p-6 rounded-lg bg-card">
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">自分の設計を書く</h2>
          <Link href={`/exercises/${slug}/solution`}>
            <Button variant="outline">模範解答を見る</Button>
          </Link>
        </div>
        <ExerciseEditor slug={slug} />
      </div>
    </div>
  );
}
