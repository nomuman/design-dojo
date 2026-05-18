"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookOpenText, Dumbbell, Home, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  cases: { slug: string; title: string }[];
  exercises: { slug: string; title: string }[];
}

export function Sidebar({ cases, exercises }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const linkClassName = (href: string) =>
    cn(
      "flex min-h-9 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
      pathname === href
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    );

  return (
    <>
      <div className="fixed left-4 top-[calc(env(safe-area-inset-top)+1rem)] z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 border-r bg-card flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-screen md:sticky md:top-0
        `}
        aria-label="メインナビゲーション"
      >
        <div className="p-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
            onClick={() => setIsOpen(false)}
          >
            <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
              D
            </span>
            <span>design-dojo</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">
            設計力・要件定義力の体験型ドリル
          </p>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-5 pb-4">
            <nav className="space-y-1" aria-label="トップ">
              <Link href="/" className={linkClassName("/")} onClick={() => setIsOpen(false)}>
                <Home className="size-4" />
                <span>ホーム</span>
              </Link>
              <Link href="/cases" className={linkClassName("/cases")} onClick={() => setIsOpen(false)}>
                <BookOpenText className="size-4" />
                <span>Cases 一覧</span>
              </Link>
              <Link href="/exercises" className={linkClassName("/exercises")} onClick={() => setIsOpen(false)}>
                <Dumbbell className="size-4" />
                <span>Exercises 一覧</span>
              </Link>
            </nav>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Cases（読解）
              </h3>
              <nav className="space-y-1" aria-label="設計読解ケース">
                {cases.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/cases/${c.slug}`}
                    className={linkClassName(`/cases/${c.slug}`)}
                    onClick={() => setIsOpen(false)}
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
              <nav className="space-y-1" aria-label="設計演習">
                {exercises.map((e) => (
                  <Link
                    key={e.slug}
                    href={`/exercises/${e.slug}`}
                    className={linkClassName(`/exercises/${e.slug}`)}
                    onClick={() => setIsOpen(false)}
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

      {isOpen && (
        <button
          aria-label="メニューを閉じる"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
