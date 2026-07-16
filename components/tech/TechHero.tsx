export default function TechHero() {
  return (
    <section className="tech-hero">
      {/* Textura diagonal tech */}
      <div className="tech-hero__texture" aria-hidden="true" />

      <div className="tech-hero__content">
        {/* Tag de identificação com canto cortado */}
        <div className="tech-hero__tag">🔥 Ofertas selecionadas todos os dias</div>

        {/* Bloco de texto com padding-right para reservar espaço da foto */}
        <div className="tech-hero__body">
          <h1 className="tech-hero__title">
            As <span className="tech-hero__title-mark">melhores<br />promoções</span><br />
            direto pra você
          </h1>
          <p className="tech-hero__desc" style={{ color: "#fff", marginBottom: "5px" }}>
            💸 Economize centenas de reais em tecnologia, games, perfumes, eletrodomésticos e muito mais.
          </p>
          <div className="tech-hero__social-badge" style={{ background: "#F5F5F5", padding: "8px 22px", gap: "5px" }}>
            <span className="tech-hero__social-highlight" style={{ whiteSpace: "nowrap", fontSize: "19.5px" }}>👥 +200 MIL PESSOAS</span>
            <span className="tech-hero__social-sub" style={{ fontSize: "9.8px", color: "#555" }}>já economizam com a gente.</span>
          </div>
        </div>
      </div>

      {/* Foto com máscara radial */}
      <div className="tech-hero__photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/robert.webp"
          alt="Robert"
          className="tech-hero__photo-img"
          fetchPriority="high"
          decoding="sync"
        />
      </div>

    </section>
  );
}
