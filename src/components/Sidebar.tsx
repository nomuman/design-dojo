"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface SidebarProps {
  cases: { slug: string; title: string }[];
  exercises: { slug: string; title: string }[];
}

export function Sidebar({ cases, exercises }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ハンバーガーボタン（スマホのみ） */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* サイドバー */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 border-r bg-card flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-screen md:sticky md:top-0
        `}
      >
        <div className="p-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-primary">design-dojo</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">
            設計力・要件定義力の体験型ドリル
          </p>
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
              <nav className="space-y-1">
                {exercises.map((e) => (
                  <Link
                    key={e.slug}
                    href={`/exercises/${e.slug}`}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
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

      {/* オーバーレイ（スマホのみ） */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
