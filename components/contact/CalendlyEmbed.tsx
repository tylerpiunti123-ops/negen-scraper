"use client";

import { useEffect, useRef } from "react";
import { CALENDLY_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

export function CalendlyEmbed({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function init() {
      if (containerRef.current && window.Calendly) {
        containerRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: containerRef.current,
        });
      }
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);

    if (existing) {
      if (window.Calendly) {
        init();
        return;
      }
      existing.addEventListener("load", init);
      return () => existing.removeEventListener("load", init);
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", init);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", init);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("min-h-[700px] w-full", className)}
      aria-label="Calendly scheduling widget"
    />
  );
}
