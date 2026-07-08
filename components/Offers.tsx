// Substitua os itens abaixo por URLs de screenshots reais das ofertas
const OFFER_IMAGES: string[] = [
  "/oferta1.png",
  "/oferta2.png",
  "/oferta3.png",
  "/oferta4.png",
  "/oferta5.png",
  "/oferta6.png",
];

export default function Offers() {
  return (
    <section className="offers-section">
      <p className="offers-section__title">✦ OFERTAS QUE JÁ COMPARTILHEI ✦</p>
      <div className="offers-section__grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="offer-slot">
            {OFFER_IMAGES[i] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={OFFER_IMAGES[i]} alt={`Oferta ${i + 1}`} className="offer-slot__img" />
            ) : (
              <span className="offer-slot__placeholder">print</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
