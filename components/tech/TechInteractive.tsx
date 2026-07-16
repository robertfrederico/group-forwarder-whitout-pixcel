"use client";

import { useGroupRedirect } from "@/hooks/useGroupRedirect";
import TechCTAButton from "./TechCTAButton";

export default function TechInteractive() {
  const { loading, error, handleJoinGroup } = useGroupRedirect(
    "T",
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_TECH,
  );
  return (
    <>
      {error && <p className="tech-hero__error">{error}</p>}
      <TechCTAButton loading={loading} onClick={handleJoinGroup} />
    </>
  );
}
