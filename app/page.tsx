import { preload } from "react-dom";
import Hero from "@/components/Hero";
import Stores from "@/components/Stores";
import PageInteractive from "@/components/PageInteractive";
import Offers from "@/components/Offers";
import Footer from "@/components/Footer";

export default function Home() {
  preload("/camilla.webp", { as: "image", fetchPriority: "high" });
  return (
    <main className="page-card">
      <Hero />
      <Stores />
      <PageInteractive />
      <Offers />
      <Footer />
    </main>
  );
}
