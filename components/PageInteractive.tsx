"use client";

import { useGroupRedirect } from "@/hooks/useGroupRedirect";
import CTAButton from "./CTAButton";

export default function PageInteractive() {
  const { loading, error, handleJoinGroup } = useGroupRedirect();
  return (
    <section className="cta-section">
      {error && <p className="hero__error">{error}</p>}
      <p className="cta-urgency">⚡ As melhores ofertas acabam rápido</p>
      <CTAButton loading={loading} onClick={handleJoinGroup} />
    </section>
  );
}
