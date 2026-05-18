"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export function DiffViewer({ slug }: { slug: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    queueMicrotask(() => setAnswers(readStoredAnswers(slug)));
  }, [slug]);

  const hasAnyAnswer = Object.values(answers).some((v) => v?.trim().length > 0);

  if (!hasAnyAnswer) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-lg">
        <p>まだ自分の回答が保存されていません。</p>
        <p className="mt-2">
          演習ページで設計を入力し「保存」ボタンを押すと、ここに表示されます。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">自分の回答</h3>
        <Badge variant="secondary">比較用表示</Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        ※ 模範解答は「アーキテクチャ」「API設計」「DB設計」タブを参照してください。自分の回答と比較し、「なぜこの設計か」を考えましょう。
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {SECTIONS.map((section) => {
          const answer = answers[section.id] || "";
          const isEmpty = !answer.trim();

          return (
            <Card key={section.id} className={isEmpty ? "opacity-60" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{section.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {isEmpty ? (
                  <p className="text-sm text-muted-foreground italic">未入力</p>
                ) : (
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-[300px] font-mono whitespace-pre-wrap">
                    {answer}
                  </pre>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
