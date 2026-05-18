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

    document.querySelectorAll("pre > code.language-mermaid").forEach((code) => {
      const pre = code.parentElement;
      if (!pre || pre.dataset.mermaidReady === "true") return;

      const graph = document.createElement("div");
      graph.className = "mermaid";
      graph.textContent = code.textContent ?? "";
      pre.dataset.mermaidReady = "true";
      pre.replaceWith(graph);
    });

    mermaid.run({ querySelector: ".mermaid" });
  }, []);

  return null;
}
