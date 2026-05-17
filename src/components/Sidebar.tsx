import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getAllCases, getAllExercises } from "@/lib/content";

export async function Sidebar() {
  const cases = await getAllCases();
  const exercises = await getAllExercises();

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
          <span className="text-primary">design-dojo</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">設計力・要件定義力の体験型ドリル</p>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Cases（読解）
            </h3>
            <nav className="space-y-1">
              {cases.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cases/${c.slug}`}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span className="truncate">{c.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Exercises（演習）
            </h3>
            <nav className="space-y-1">
              {exercises.map((e) => (
                <Link
                  key={e.slug}
                  href={`/exercises/${e.slug}`}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span className="truncate">{e.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground">
          進捗はブラウザに保存されます
        </p>
      </div>
    </aside>
  );
}
