import type { Metadata } from "next";
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSolutionContent(slug);

  if (!data) return {};

  return {
    title: `${data.meta.title} 模範解答`,
    description: data.meta.description,
    alternates: {
      canonical: `/exercises/${slug}/solution`,
    },
    openGraph: {
      title: `${data.meta.title} 模範解答`,
      description: data.meta.description,
      url: `/exercises/${slug}/solution`,
    },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getSolutionContent(slug);

  if (!data) notFound();

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{data.meta.title}</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">模範解答です。自分の設計と比較してみましょう。</p>
        </div>
        <Link href={`/exercises/${slug}`} className="md:self-auto">
          <Button variant="outline" className="w-full md:w-auto">演習に戻る</Button>
        </Link>
      </div>

      <Tabs defaultValue={data.sections[0]?.id} className="w-full">
        <TabsList className="scrollbar-thin h-10 min-h-10 w-full justify-start overflow-x-auto">
          {data.sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="flex-none text-xs md:text-sm">
              {section.title}
            </TabsTrigger>
          ))}
          <TabsTrigger value="diff" className="flex-none text-xs md:text-sm">自分の回答との比較</TabsTrigger>
        </TabsList>
        {data.sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="prose dark:prose-invert mt-6 max-w-none">
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </TabsContent>
        ))}
        <TabsContent value="diff" className="mt-6">
          <DiffViewer slug={slug} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
