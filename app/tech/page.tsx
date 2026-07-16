"use client";

import { useGroupRedirect } from "@/hooks/useGroupRedirect";
import TechHero from "@/components/tech/TechHero";
import TechStores from "@/components/tech/TechStores";
import TechCTAButton from "@/components/tech/TechCTAButton";
import TechOffers from "@/components/tech/TechOffers";
import TechFooter from "@/components/tech/TechFooter";

export default function TechPage() {
  const { loading, error, handleJoinGroup } = useGroupRedirect(
    "T",
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_TECH,
  );

  return (
    <main className="tech-page-card">
      <TechHero error={error} />

      <TechCTAButton loading={loading} onClick={handleJoinGroup} />

      <TechStores />

      <p className="tech-bottom-urgency">⚡ Muitas ofertas<br />acabam em poucos minutos</p>

      <TechOffers />
      <TechFooter />
    </main>
  );
}
