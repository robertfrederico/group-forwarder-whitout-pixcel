"use client";

import { useEffect, useState } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export function useGroupRedirect(defaultGroupType?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupIdParam, setGroupIdParam] = useState<string | null>(null);
  const [groupTypeParam, setGroupTypeParam] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setGroupIdParam(params.get("id"));
    // URL param tem prioridade; se não veio, usa o default da página
    setGroupTypeParam(params.get("groupType") ?? defaultGroupType ?? null);
  }, [defaultGroupType]);

  useEffect(() => {
    fetch("/api/stats/view", { method: "POST" }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!PIXEL_ID) return;
    const f = window as any;
    if (f.fbq) return;
    const n: any = (f.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod(...args) : n.queue.push(args);
    });
    f._fbq = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = document.createElement("script");
    t.async = true;
    t.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(t);
    f.fbq("init", PIXEL_ID);
    f.fbq("track", "PageView");
  }, []);

  const handleJoinGroup = async () => {
    setLoading(true);
    setError(null);
    const timeout = setTimeout(() => setLoading(false), 8000);

    const fbq = (window as any).fbq;
    if (fbq) fbq("track", "Lead", {
      content_name: "Entrada no Grupo",
      value: 1.00,
      currency: "BRL",
    });

    try {
      const res = await fetch("/api/groups/redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: groupIdParam, groupType: groupTypeParam }),
      });
      const data = await res.json();
      if (data.url) {
        setTimeout(() => { window.location.href = data.url; }, 500);
      } else {
        throw new Error(data.error || "Nenhum grupo disponível.");
      }
    } catch {
      clearTimeout(timeout);
      setError("Não conseguimos validar a tua vaga. Tenta novamente!");
      setLoading(false);
    }
  };

  return { loading, error, handleJoinGroup };
}
