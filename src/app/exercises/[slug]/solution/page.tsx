import { notFound } from "next/navigation";
import Link from "next/link";
import { getSolutionContent, getAllExercises } from "@/lib/content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DiffViewer } from "@/components/DiffViewer";

export async function generateStaticParams() {
  const exercises = await getAllExercises();
  return exercises.map((e) => ({ slug: e.slug }));
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getSolutionContent(slug);

  if (!data) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{data.meta.title}</h1>
          <p className="text-muted-foreground mt-2">模範解答です。自分の設計と比較してみましょう。</p>
        </div>
        <Link href={`/exercises/${slug}`}>
          <Button variant="outline">演習に戻る</Button>
        </Link>
      </div>

      <Tabs defaultValue={data.sections[0]?.id} className="w-full">
        <TabsList className="w-full justify-start flex-wrap h-auto">
          {data.sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.title}
            </TabsTrigger>
          ))}
          <TabsTrigger value="diff">自分の回答との比較</TabsTrigger>
        </TabsList>
        {data.sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </TabsContent>
        ))}
        <TabsContent value="diff">
          <DiffViewer slug={slug} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
