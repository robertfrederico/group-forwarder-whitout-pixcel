"use client";

import { useEffect, useRef, useState } from "react";

const IMAGES = [
  "/ofertas-tech/oferta1.jpeg",
  "/ofertas-tech/oferta2.jpeg",
  "/ofertas-tech/oferta3.jpeg",
  "/ofertas-tech/oferta4.jpeg",
  "/ofertas-tech/oferta5.jpeg",
  "/ofertas-tech/oferta6.jpeg",
  "/ofertas-tech/oferta7.jpeg",
  "/ofertas-tech/oferta8.jpeg",
  "/ofertas-tech/oferta9.jpeg",
  "/ofertas-tech/oferat10.jpeg",
  "/ofertas-tech/oferta11.jpeg",
  "/ofertas-tech/oferta12.png",
  "/ofertas-tech/oferta-tech-2.jpg",
  "/ofertas-tech/oferta-tech-3.jpg",
];

const btnStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.45)",
  border: "none",
  color: "#fff",
  fontSize: 22,
  lineHeight: 1,
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  borderRadius: 4,
  padding: 0,
  zIndex: 2,
};

export default function TechOffers() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((i) => (i - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setCurrent((i) => (i + 1) % IMAGES.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <section className="tech-offers">
      <p className="tech-offers__title" style={{ color: "#fff", fontSize: "12.5px", letterSpacing: "0.095em" }}>Algumas ofertas reais que já compartilhei</p>

      <div style={{ position: "relative", overflow: "hidden", borderRadius: 6, boxShadow: "0 4px 20px rgba(0,0,0,0.45)" }}>
        <div
          style={{
            display: "flex",
            transition: "transform 0.35s ease",
            transform: `translateX(-${current * 100}%)`,
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {IMAGES.map((src, i) => (
            <div
              key={i}
              style={{
                flex: "0 0 100%",
                aspectRatio: "3/4",
                background: "oklch(12% 0.01 25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Oferta ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            </div>
          ))}
        </div>

        <button style={{ ...btnStyle, left: 6 }} onClick={prev} aria-label="Anterior">‹</button>
        <button style={{ ...btnStyle, right: 6 }} onClick={next} aria-label="Próximo">›</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "8px 0 4px" }}>
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Oferta ${i + 1}`}
            style={{
              width: i === current ? 16 : 6,
              height: 6,
              borderRadius: i === current ? 3 : "50%",
              background: i === current ? "var(--tech-red)" : "rgba(255,255,255,0.25)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          />
        ))}
      </div>
    </section>
  );
}
