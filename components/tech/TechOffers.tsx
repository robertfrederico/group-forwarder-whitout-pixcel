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
      <p className="tech-offers__title">Algumas ofertas reais que já compartilhei</p>

      <div className="tech-carousel">
        <div
          className="tech-carousel__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {IMAGES.map((src, i) => (
            <div key={i} className="tech-carousel__slide">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Oferta ${i + 1}`} className="tech-carousel__img" />
            </div>
          ))}
        </div>

        <button className="tech-carousel__btn tech-carousel__btn--prev" onClick={prev} aria-label="Anterior">‹</button>
        <button className="tech-carousel__btn tech-carousel__btn--next" onClick={next} aria-label="Próximo">›</button>
      </div>

      <div className="tech-carousel__dots">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            className={`tech-carousel__dot${i === current ? " tech-carousel__dot--active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Oferta ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
