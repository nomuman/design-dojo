import Image from "next/image";

import Link from "next/link";
import { getAllCases, getAllExercises } from "@/lib/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const cases = await getAllCases();
  const exercises = await getAllExercises();

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">design-dojo</h1>
        <p className="text-lg text-muted-foreground">
          AI時代に鍛えるべき「設計力・要件定義力」の体験型ドリルです。
          フォルダ単位・機能レベルで「なぜこの設計か」を把握し、自分の言葉で説明できる力を養います。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">使い方</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Read（読解）</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Casesの設計事例を読み、「なぜこのフォルダ構成・API設計・DB設計なのか」を理解します。まず要件だけ読み、自分なりに設計を考えてから解答を見るのが効果的です。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Design（設計）</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Exercisesの要件を読み、テンプレートに沿って自分で設計ドキュメントを書きます。実装コードではなく、設計意図・構成・フローを言語化します。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Review（照合）</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                模範解答と自分の設計を比較し、差分を確認します。「正解」ではなく「なぜその設計か」を比較することが成長につながります。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Cases（設計読解）</h2>
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
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Exercises（設計演習）</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises.map((e) => (
            <Link key={e.slug} href={`/exercises/${e.slug}`} className="block">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{e.title}</CardTitle>
                    <Badge variant={e.difficulty === "beginner" ? "secondary" : e.difficulty === "advanced" ? "destructive" : "default"}>
                      {e.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{e.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
