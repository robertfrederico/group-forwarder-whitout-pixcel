"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import Stores from "@/components/Stores";
import CTAButton from "@/components/CTAButton";
import Offers from "@/components/Offers";
import Footer from "@/components/Footer";

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupIdParam, setGroupIdParam] = useState<string | null>(null);
  const [groupTypeParam, setGroupTypeParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setGroupIdParam(params.get("id"));
      setGroupTypeParam(params.get("groupType"));
    }
  }, []);

  useEffect(() => {
    const recordPageView = async () => {
      try {
        await fetch("/api/stats/view", { method: "POST" });
      } catch {}
    };
    recordPageView();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && PIXEL_ID) {
      const f = window as any;
      if (!f.fbq) {
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
      }
    }
  }, []);

  const handleJoinGroup = async () => {
    setLoading(true);
    setError(null);
    const timeout = setTimeout(() => setLoading(false), 8000);

    const fbq = (window as any).fbq;
    if (fbq) fbq("track", "Lead", { content_name: "Entrada no Grupo" });

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

  return (
    <main className="page-card">
      <Hero loading={loading} error={error} onJoinGroup={handleJoinGroup} />
      <Stores />
      <section className="cta-section">
        <CTAButton loading={loading} onClick={handleJoinGroup} />
      </section>
      <Offers />
      <Footer />
    </main>
  );
}
