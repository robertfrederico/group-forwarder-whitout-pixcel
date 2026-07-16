import { preload } from "react-dom";
import TechHero from "@/components/tech/TechHero";
import TechStores from "@/components/tech/TechStores";
import TechInteractive from "@/components/tech/TechInteractive";
import TechOffers from "@/components/tech/TechOffers";
import TechFooter from "@/components/tech/TechFooter";

export default function TechPage() {
  preload("/robert.webp", { as: "image", fetchPriority: "high" });
  preload("/ofertas-tech/oferta1.webp", { as: "image" });
  return (
    <main className="tech-page-card">
      <TechHero />

      <TechInteractive />

      <TechStores />

      <p className="tech-bottom-urgency" style={{ fontSize: "17.5px", fontWeight: 700 }}>⚡ Muitas ofertas<br />acabam em poucos minutos</p>

      <TechOffers />
      <TechFooter />
    </main>
  );
}
