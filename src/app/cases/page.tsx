import Link from "next/link";
import { getAllCases } from "@/lib/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function CasesPage() {
  const cases = await getAllCases();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Cases（設計読解）</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">
          先輩エンジニアの設計ドキュメントを読み、なぜその技術選定・構成・API設計なのかを理解します。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cases.map((c) => (
          <Link key={c.slug} href={`/cases/${c.slug}`} className="block">
            <Card className="h-full cursor-pointer transition-colors hover:bg-accent/50">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="min-w-0 text-lg">{c.title}</CardTitle>
                  <Badge className="shrink-0" variant={c.difficulty === "beginner" ? "secondary" : c.difficulty === "advanced" ? "destructive" : "default"}>
                    {c.difficulty}
                  </Badge>
                </div>
                <CardDescription>{c.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {c.tags?.map((tag) => (
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
