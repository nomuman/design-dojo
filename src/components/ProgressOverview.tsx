"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDotDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ExerciseSummary = {
  slug: string;
  title: string;
};

const SECTION_IDS = ["folder", "tech", "api", "db"];

function getStoredProgress(slug: string) {
  const stored = localStorage.getItem(`design-dojo-exercise-${slug}`);
  if (!stored) return 0;

  try {
    const answers = JSON.parse(stored) as Record<string, string>;
    const filled = SECTION_IDS.filter((id) => answers[id]?.trim().length > 0).length;
    return Math.round((filled / SECTION_IDS.length) * 100);
  } catch {
    return 0;
  }
}

export function ProgressOverview({ exercises }: { exercises: ExerciseSummary[] }) {
  const [progressBySlug, setProgressBySlug] = useState<Record<string, number>>({});

  useEffect(() => {
    queueMicrotask(() => {
      setProgressBySlug(
        Object.fromEntries(exercises.map((exercise) => [exercise.slug, getStoredProgress(exercise.slug)]))
      );
    });
  }, [exercises]);

  const stats = useMemo(() => {
    const values = exercises.map((exercise) => progressBySlug[exercise.slug] ?? 0);
    const completed = values.filter((value) => value === 100).length;
    const started = values.filter((value) => value > 0 && value < 100).length;
    const average = values.length
      ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
      : 0;
    return { completed, started, average };
  }, [exercises, progressBySlug]);

  const nextExercise =
    exercises.find((exercise) => (progressBySlug[exercise.slug] ?? 0) < 100) ?? exercises[0];

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CircleDotDashed className="size-4 text-primary" />
          学習進捗
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md border p-2.5">
            <div className="text-xl font-semibold">{stats.average}%</div>
            <div className="text-xs text-muted-foreground">平均</div>
          </div>
          <div className="rounded-md border p-2.5">
            <div className="text-xl font-semibold">{stats.started}</div>
            <div className="text-xs text-muted-foreground">着手中</div>
          </div>
          <div className="rounded-md border p-2.5">
            <div className="text-xl font-semibold">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">完了</div>
          </div>
        </div>

        <div className="space-y-3">
          {exercises.map((exercise) => {
            const progress = progressBySlug[exercise.slug] ?? 0;
            return (
              <Link
                key={exercise.slug}
                href={`/exercises/${exercise.slug}`}
                className="block rounded-md border p-3 transition-colors hover:bg-accent"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium">{exercise.title}</span>
                  {progress === 100 ? (
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  ) : (
                    <span className="text-xs tabular-nums text-muted-foreground">{progress}%</span>
                  )}
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                </div>
              </Link>
            );
          })}
        </div>

        {nextExercise && (
          <Button asChild className="w-full">
            <Link href={`/exercises/${nextExercise.slug}`}>
              続きから始める
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
