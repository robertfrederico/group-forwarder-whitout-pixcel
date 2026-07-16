"use client";

import dynamic from "next/dynamic";
import { useGroupRedirect } from "@/hooks/useGroupRedirect";
import TechHero from "@/components/tech/TechHero";
import TechStores from "@/components/tech/TechStores";
import TechCTAButton from "@/components/tech/TechCTAButton";
import TechFooter from "@/components/tech/TechFooter";

const TechOffers = dynamic(() => import("@/components/tech/TechOffers"), { ssr: false });

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

      <p className="tech-bottom-urgency" style={{ fontSize: "17.5px", fontWeight: 700 }}>⚡ Muitas ofertas<br />acabam em poucos minutos</p>

      <TechOffers />
      <TechFooter />
    </main>
  );
}
