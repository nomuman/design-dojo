"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SECTIONS = [
  { id: "folder", label: "フォルダ・ファイル構成" },
  { id: "tech", label: "技術選定" },
  { id: "api", label: "API設計" },
  { id: "db", label: "DB設計" },
];

export function ExerciseEditor({ slug }: { slug: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const key = `design-dojo-exercise-${slug}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setAnswers(JSON.parse(stored));
      } catch {
        // ignore parse error
      }
    }
  }, [slug]);

  const handleChange = (sectionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [sectionId]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    const key = `design-dojo-exercise-${slug}`;
    localStorage.setItem(key, JSON.stringify(answers));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getProgress = () => {
    const filled = SECTIONS.filter((s) => answers[s.id]?.trim().length > 0).length;
    return Math.round((filled / SECTIONS.length) * 100);
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            進捗: {getProgress()}%
          </div>
          <Button size="sm" onClick={handleSave}>
            {saved ? "保存しました！" : "保存"}
          </Button>
        </div>

        <Tabs defaultValue="folder" className="w-full">
          <TabsList className="w-full justify-start flex-wrap h-auto">
            {SECTIONS.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.label}
                {answers[section.id]?.trim().length > 0 && (
                  <span className="ml-1 text-xs text-green-500">●</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {SECTIONS.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <textarea
                className="w-full min-h-[300px] p-3 rounded-md border bg-background font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={`${section.label}を記述してください...`}
                value={answers[section.id] || ""}
                onChange={(e) => handleChange(section.id, e.target.value)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
