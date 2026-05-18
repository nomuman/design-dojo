"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SECTIONS = [
  { id: "folder", label: "フォルダ・ファイル構成" },
  { id: "tech", label: "技術選定" },
  { id: "api", label: "API設計" },
  { id: "db", label: "DB設計" },
];

function readStoredAnswers(slug: string) {
  if (typeof window === "undefined") return {};

  const stored = localStorage.getItem(`design-dojo-exercise-${slug}`);
  if (!stored) return {};

  try {
    return JSON.parse(stored) as Record<string, string>;
  } catch {
    return {};
  }
}

export function ExerciseEditor({ slug }: { slug: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    queueMicrotask(() => setAnswers(readStoredAnswers(slug)));
  }, [slug]);

  const handleChange = (sectionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [sectionId]: value }));
    setSaveState("idle");
  };

  const handleSave = () => {
    const key = `design-dojo-exercise-${slug}`;
    localStorage.setItem(key, JSON.stringify(answers));
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2000);
  };

  const handleReset = () => {
    const key = `design-dojo-exercise-${slug}`;
    localStorage.removeItem(key);
    setAnswers({});
    setSaveState("idle");
  };

  const getProgress = () => {
    const filled = SECTIONS.filter((s) => answers[s.id]?.trim().length > 0).length;
    return Math.round((filled / SECTIONS.length) * 100);
  };

  const totalCharacters = Object.values(answers).reduce((sum, value) => sum + value.length, 0);

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium">進捗 {getProgress()}%</span>
              <span className="text-muted-foreground">{totalCharacters.toLocaleString()}文字</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted sm:w-64">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${getProgress()}%` }} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="size-4" />
              クリア
            </Button>
            <Button type="button" size="sm" onClick={handleSave}>
              <Save className="size-4" />
              {saveState === "saved" ? "保存済み" : "保存"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="folder" className="w-full">
          <TabsList className="scrollbar-thin h-10 min-h-10 w-full justify-start overflow-x-auto">
            {SECTIONS.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="flex-none text-xs md:text-sm">
                {section.label}
                {answers[section.id]?.trim().length > 0 && (
                  <span className="ml-1 text-xs text-emerald-600">●</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {SECTIONS.map((section) => (
            <TabsContent key={section.id} value={section.id} className="mt-4 space-y-2">
              <label htmlFor={`${slug}-${section.id}`} className="text-sm font-medium">
                {section.label}
              </label>
              <textarea
                id={`${slug}-${section.id}`}
                className="min-h-[320px] w-full resize-y rounded-md border bg-background p-3 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={`${section.label}を記述してください...`}
                value={answers[section.id] || ""}
                onChange={(e) => handleChange(section.id, e.target.value)}
              />
              <div className="text-right text-xs text-muted-foreground">
                {(answers[section.id]?.length ?? 0).toLocaleString()}文字
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
