import Link from "next/link";
import { getAllExercises } from "@/lib/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ExercisesPage() {
  const exercises = await getAllExercises();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exercises（設計演習）</h1>
        <p className="text-muted-foreground mt-2">
          要件だけが与えられます。自分の頭でフォルダ構成、技術選定、API設計、DB設計を行い、模範解答と照らし合わせましょう。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises.map((e) => (
          <Link key={e.slug} href={`/exercises/${e.slug}`} className="block">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{e.title}</CardTitle>
                  <Badge
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
                    <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-md">
                      {tag}
                    </span>
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
