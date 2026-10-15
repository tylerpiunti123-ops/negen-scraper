"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_COOKIE = "ngc_vid";

function getOrCreateVisitorId(): string {
  const match = document.cookie.match(new RegExp(`${VISITOR_COOKIE}=([^;]+)`));
  if (match?.[1]) return match[1];

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${VISITOR_COOKIE}=${id};max-age=${oneYear};path=/;SameSite=Lax`;
  return id;
}

export function VisitorBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const visitorId = getOrCreateVisitorId();
      const payload = JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        visitorId,
      });
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", blob);
      } else {
        fetch("/api/track", { method: "POST", body: payload, keepalive: true });
      }
    } catch {
      // Tracking is best-effort — never let it break the page.
    }
  }, [pathname]);

  return null;
}
