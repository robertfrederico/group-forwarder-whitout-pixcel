"use client";

import { useGroupRedirect } from "@/hooks/useGroupRedirect";
import Hero from "@/components/Hero";
import Stores from "@/components/Stores";
import CTAButton from "@/components/CTAButton";
import Offers from "@/components/Offers";
import Footer from "@/components/Footer";

export default function App() {
  const { loading, error, handleJoinGroup } = useGroupRedirect();

  return (
    <main className="page-card">
      <Hero loading={loading} error={error} onJoinGroup={handleJoinGroup} />
      <Stores />
      <section className="cta-section">
        <p className="cta-urgency">⚡ As melhores ofertas acabam rápido</p>
        <CTAButton loading={loading} onClick={handleJoinGroup} />
      </section>
      <Offers />
      <Footer />
    </main>
  );
}
