"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackFunnel, FunnelEvent } from "@/lib/depositguard/funnel";
export default function FunnelView() {
  const path = usePathname();
  const previous = useRef("");
  useEffect(() => {
    if (previous.current === path) return;
    previous.current = path;
    const events: Record<string, FunnelEvent> = {
      "/": "landing_viewed",
      "/kiem-tra-mua-nha": "wizard_started",
      "/bao-cao-mau": "sample_viewed",
      "/ra-soat-ho-so-vay": "service_viewed",
      "/dang-ky-ra-soat": "service_cta_clicked",
    };
    if (events[path]) trackFunnel(events[path]);
  }, [path]);
  return null;
}
