const CHIPS = [
  { name: "Amazon", color: "#111" },
  { name: "Natura", color: "#c2185b" },
  { name: "Avon", color: "#111" },
  { name: "Shopee", color: "#e64a19" },
  { name: "Shein", color: "#111" },
  { name: "Magalu", color: "#1976d2" },
  { name: "O Boticário", color: "#1a472a" },
  { name: "Mercado Livre", color: "#3483fa" },
];

export default function Stores() {
  return (
    <section className="stores">
      <p className="stores__title">✦ LOJAS CONFIÁVEIS ✦</p>
      <div className="stores__chips">
        {CHIPS.map((chip) => (
          <span
            key={chip.name}
            className="store-chip"
            style={{ color: chip.color }}
          >
            {chip.name}
          </span>
        ))}
      </div>
    </section>
  );
}
