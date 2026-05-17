"use client";

import { useEffect } from "react";
import mermaid from "mermaid";

export function MermaidInit() {
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
    });
    mermaid.run({ querySelector: ".language-mermaid" });
  }, []);

  return null;
}
