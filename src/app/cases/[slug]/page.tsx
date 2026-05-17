import { notFound } from "next/navigation";
import { getCaseContent, getAllCases } from "@/lib/content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  const cases = await getAllCases();
  return cases.map((c) => ({ slug: c.slug }));
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCaseContent(slug);

  if (!data) notFound();

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{data.meta.title}</h1>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
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
          <p className="text-muted-foreground text-sm md:text-base">{data.meta.description}</p>
        </div>
      </div>

      <Tabs defaultValue={data.sections[0]?.id} className="w-full">
        <TabsList className="w-full justify-start flex-wrap h-auto min-h-10">
          {data.sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="text-xs md:text-sm">
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {data.sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
