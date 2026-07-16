"use client";

import { useEffect, useRef, useState } from "react";

const OFFER_IMAGES: string[] = [
  "/oferta1.png",
  "/oferta2.png",
  "/oferta3.png",
  "/oferta4.png",
  "/oferta5.png",
  "/oferta6.png",
];

const btnStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(90,19,57,0.4)",
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
  borderRadius: 6,
  padding: 0,
  zIndex: 2,
};

export default function Offers() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % OFFER_IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((i) => (i - 1 + OFFER_IMAGES.length) % OFFER_IMAGES.length);
  const next = () => setCurrent((i) => (i + 1) % OFFER_IMAGES.length);

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
    <section className="offers-section">
      <p className="offers-section__title">✦ OFERTAS QUE JÁ COMPARTILHEI ✦</p>

      {/* Wrapper com overflow hidden — inline style para garantir compilação */}
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 10 }}>
        {/* Track deslizante */}
        <div
          style={{
            display: "flex",
            transition: "transform 0.35s ease",
            transform: `translateX(-${current * 100}%)`,
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {OFFER_IMAGES.map((src, i) => (
            <div
              key={i}
              style={{
                flex: "0 0 100%",
                aspectRatio: "3/4",
                background: "#fff",
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

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "8px 0 2px" }}>
        {OFFER_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Oferta ${i + 1}`}
            style={{
              width: i === current ? 16 : 6,
              height: 6,
              borderRadius: i === current ? 3 : "50%",
              background: i === current ? "#fff" : "rgba(255,255,255,0.4)",
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
