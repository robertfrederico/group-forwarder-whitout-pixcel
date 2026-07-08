const CHIPS = [
  { name: "AMAZON",        color: "#fff" },
  { name: "SHOPEE",        color: "#ff9466" },
  { name: "MAGALU",        color: "#4a9de8" },
  { name: "ALIEXPRESS",    color: "#ff6b4a" },
  { name: "MERCADO LIVRE", color: "#ffd400" },
];

export default function TechStores() {
  return (
    <section className="tech-stores">
      <p className="tech-stores__title">Lojas confiáveis</p>
      <div className="tech-stores__chips">
        {CHIPS.map((chip) => (
          <span key={chip.name} className="tech-store-chip" style={{ color: chip.color }}>
            {chip.name}
          </span>
        ))}
      </div>
    </section>
  );
}
