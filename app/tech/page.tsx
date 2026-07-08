"use client";

import { useGroupRedirect } from "@/hooks/useGroupRedirect";
import TechHero from "@/components/tech/TechHero";
import TechStores from "@/components/tech/TechStores";
import TechCTAButton from "@/components/tech/TechCTAButton";
import TechOffers from "@/components/tech/TechOffers";
import TechFooter from "@/components/tech/TechFooter";

export default function TechPage() {
  const { loading, error, handleJoinGroup } = useGroupRedirect("T");

  return (
    <main className="tech-page-card">
      <TechHero error={error} />
      <TechStores />
      <TechCTAButton loading={loading} onClick={handleJoinGroup} />
      <TechOffers />
      <TechFooter />
    </main>
  );
}
