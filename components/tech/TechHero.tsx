type TechHeroProps = {
  error: string | null;
};

export default function TechHero({ error }: TechHeroProps) {
  return (
    <section className="tech-hero">
      {/* Textura diagonal tech */}
      <div className="tech-hero__texture" aria-hidden="true" />

      <div className="tech-hero__content">
        {/* Tag de identificação com canto cortado */}
        <div className="tech-hero__tag">Robert · caçador de ofertas</div>

        {/* Bloco de texto com padding-right para reservar espaço da foto */}
        <div className="tech-hero__body">
          <h1 className="tech-hero__title">
            As <span className="tech-hero__title-mark">melhores promoções</span>{" "}
            de tecnologia, direto pra você
          </h1>
          <p className="tech-hero__desc" style={{ color: "#fff" }}>
            💸 Economize centenas de reais comprando na hora certa.
          </p>
          <div className="tech-hero__social-badge">
            <span className="tech-hero__social-highlight" style={{ whiteSpace: "nowrap" }}>👥 +200 MIL PESSOAS</span>
            <span className="tech-hero__social-sub">já economizam com a gente.</span>
          </div>
        </div>
      </div>

      {/* Foto com máscara radial */}
      <div className="tech-hero__photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/robert.png"
          alt="Robert"
          className="tech-hero__photo-img"
        />
      </div>

      {error ? <p className="tech-hero__error">{error}</p> : null}
    </section>
  );
}
