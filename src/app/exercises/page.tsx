import Link from "next/link";
import { getAllExercises } from "@/lib/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ExercisesPage() {
  const exercises = await getAllExercises();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Exercises（設計演習）</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">
          要件だけが与えられます。自分の頭でフォルダ構成、技術選定、API設計、DB設計を行い、模範解答と照らし合わせましょう。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {exercises.map((e) => (
          <Link key={e.slug} href={`/exercises/${e.slug}`} className="block">
            <Card className="h-full cursor-pointer transition-colors hover:bg-accent/50">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="min-w-0 text-lg">{e.title}</CardTitle>
                  <Badge
                    className="shrink-0"
                    variant={
                      e.difficulty === "beginner"
                        ? "secondary"
                        : e.difficulty === "advanced"
                          ? "destructive"
                          : "default"
                    }
                  >
                    {e.difficulty}
                  </Badge>
                </div>
                <CardDescription>{e.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {e.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
