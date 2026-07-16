export default function Hero() {
  return (
    <section className="hero">
      {/* Badge de acesso gratuito */}
      <div className="hero__badge-row">
        <span className="hero__badge-access">✦ ACESSO 100% GRATUITO</span>
      </div>

      {/* Texto principal (padding-right reserva espaço para a foto) */}
      <div className="hero__body">
        <p className="hero__eyebrow">oi, eu sou a Camilla! ♡</p>
        <h1 className="hero__title">
          Eu garimpo as{" "}
          <span className="hero__title-mark">melhores promoções</span>
          {" "}pra você economizar de verdade!
        </h1>
        <p className="hero__desc">
          Beleza, skincare, maquiagem, autocuidado, casa e muito mais — todo dia.
        </p>
        <div className="hero__social-badge">
          +200 MIL pessoas já<br />economizando com a gente
        </div>
      </div>

      {/* Foto com máscara radial para fundir com o fundo */}
      <div className="hero__photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/camilla.webp"
          alt="Camilla"
          className="hero__photo-img"
          fetchPriority="high"
          decoding="sync"
        />
      </div>

    </section>
  );
}
