import './Home.css'

function Home() {
  return (
    <div className="home">
      {/* Hero section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Bienvenido a Presencia Virtual</h1>
            <p>Creamos soluciones web innovadoras para tu negocio</p>
            <div className="hero-buttons">
              <a href="/services" className="btn btn-primary">Ver Servicios</a>
              <a href="/contact" className="btn btn-secondary">Contactanos</a>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-4">¿Por qué elegirnos?</h2>
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Diseño Moderno</h3>
              <p>Creamos interfaces atractivas y funcionales que captivan a tus usuarios</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Rendimiento</h3>
              <p>Aplicaciones rápidas y optimizadas para la mejor experiencia</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive</h3>
              <p>Perfectos en cualquier dispositivo: móvil, tablet o desktop</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="section section-light">
        <div className="container text-center">
          <h2>¿Listo para transformar tu presencia digital?</h2>
          <p>Contáctanos hoy y déjanos ayudarte a alcanzar tus objetivos</p>
          <a href="/contact" className="btn btn-primary mt-3">Solicitar Información</a>
        </div>
      </section>
    </div>
  )
}

export default Home
