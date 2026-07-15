"use client";

import { useEffect, useState } from "react";

const DEFAULT_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export function useGroupRedirect(defaultGroupType?: string, pixelId?: string) {
  const PIXEL_ID = pixelId ?? DEFAULT_PIXEL_ID;
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

    // Abre janela em branco DENTRO do gesto do usuário (antes do await).
    // Necessário no iOS Safari: após um await, o contexto de gesto é perdido
    // e deep links do WhatsApp são redirecionados para a App Store em vez do app.
    const target = window.open("", "_blank");

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
        if (target) {
          target.location.href = data.url;
        } else {
          window.location.href = data.url;
        }
      } else {
        target?.close();
        throw new Error(data.error || "Nenhum grupo disponível.");
      }
    } catch {
      clearTimeout(timeout);
      target?.close();
      setError("Não conseguimos validar a tua vaga. Tenta novamente!");
      setLoading(false);
    }
  };

  return { loading, error, handleJoinGroup };
}
