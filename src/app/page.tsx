import Link from "next/link";
import { getAllCases, getAllExercises } from "@/lib/content";
import { ProgressOverview } from "@/components/ProgressOverview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenText, BrainCircuit, CheckCircle2, Database, GitBranch, Network, PencilLine } from "lucide-react";

function difficultyVariant(difficulty: string) {
  if (difficulty === "beginner") return "secondary" as const;
  if (difficulty === "advanced") return "destructive" as const;
  return "default" as const;
}

export default async function Home() {
  const cases = await getAllCases();
  const exercises = await getAllExercises();
  const featuredCases = cases.slice(0, 3);
  const featuredExercises = exercises.slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-6 rounded-lg border bg-card p-5 md:p-7">
          <div className="space-y-4">
            <Badge variant="outline">AI時代の設計トレーニング</Badge>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                要件から設計意図まで、説明できる力を鍛える。
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                design-dojo は、ケース読解と演習を往復しながら、フォルダ構成、API、DB、アーキテクチャを自分の言葉で組み立てるためのウェブアプリです。
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/exercises">
                演習を始める
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/cases">ケースを読む</Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border p-3">
              <div className="text-2xl font-semibold">{cases.length}</div>
              <div className="text-sm text-muted-foreground">読解ケース</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-2xl font-semibold">{exercises.length}</div>
              <div className="text-sm text-muted-foreground">設計演習</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-2xl font-semibold">4</div>
              <div className="text-sm text-muted-foreground">設計観点</div>
            </div>
          </div>
        </div>
        <ProgressOverview exercises={exercises.map(({ slug, title }) => ({ slug, title }))} />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">学習フロー</h2>
            <p className="mt-1 text-sm text-muted-foreground">読解、設計、照合の順に進めると、設計判断の解像度が上がります。</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpenText className="size-4 text-primary" />
                1. Read
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Casesの設計事例を読み、「なぜこのフォルダ構成・API設計・DB設計なのか」を理解します。まず要件だけ読み、自分なりに設計を考えてから解答を見るのが効果的です。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PencilLine className="size-4 text-primary" />
                2. Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Exercisesの要件を読み、テンプレートに沿って自分で設計ドキュメントを書きます。実装コードではなく、設計意図・構成・フローを言語化します。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="size-4 text-primary" />
                3. Review
              </CardTitle>
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
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Cases（設計読解）</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/cases">すべて見る</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featuredCases.map((c) => (
            <Link key={c.slug} href={`/cases/${c.slug}`} className="block">
              <Card className="h-full cursor-pointer transition-colors hover:bg-accent/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <Badge variant={difficultyVariant(c.difficulty)}>{c.difficulty}</Badge>
                  </div>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {c.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Exercises（設計演習）</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/exercises">すべて見る</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featuredExercises.map((e) => (
            <Link key={e.slug} href={`/exercises/${e.slug}`} className="block">
              <Card className="h-full cursor-pointer transition-colors hover:bg-accent/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg">{e.title}</CardTitle>
                    <Badge variant={difficultyVariant(e.difficulty)}>{e.difficulty}</Badge>
                  </div>
                  <CardDescription>{e.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {e.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { icon: GitBranch, title: "構成", text: "境界と責務を分ける" },
          { icon: BrainCircuit, title: "技術", text: "制約から選定する" },
          { icon: Network, title: "API", text: "操作と状態を設計する" },
          { icon: Database, title: "DB", text: "データの寿命を決める" },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <item.icon className="size-4 text-primary" />
                {item.title}
              </CardTitle>
              <CardDescription>{item.text}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}
