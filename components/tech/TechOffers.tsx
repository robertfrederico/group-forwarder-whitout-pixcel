const OFFER_IMAGES: string[] = [
  "/oferta-tech-1.jpg",
  "/oferta-tech-2.jpg",
  "/oferta-tech-3.jpg",
];

export default function TechOffers() {
  return (
    <section className="tech-offers">
      <p className="tech-offers__title">Ofertas que já compartilhei</p>
      <div className="tech-offers__grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="tech-offer-slot">
            {OFFER_IMAGES[i] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={OFFER_IMAGES[i]} alt={`Oferta ${i + 1}`} className="tech-offer-slot__img" />
            ) : (
              <span className="tech-offer-slot__placeholder">PRINT</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
