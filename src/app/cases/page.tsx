import Link from "next/link";
import { getAllCases } from "@/lib/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function CasesPage() {
  const cases = await getAllCases();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cases（設計読解）</h1>
        <p className="text-muted-foreground mt-2">
          先輩エンジニアの設計ドキュメントを読み、なぜその技術選定・構成・API設計なのかを理解します。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((c) => (
          <Link key={c.slug} href={`/cases/${c.slug}`} className="block">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{c.title}</CardTitle>
                  <Badge variant={c.difficulty === "beginner" ? "secondary" : c.difficulty === "advanced" ? "destructive" : "default"}>
                    {c.difficulty}
                  </Badge>
                </div>
                <CardDescription>{c.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {c.tags?.map((tag) => (
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
