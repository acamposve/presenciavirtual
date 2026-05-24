import './Services.css'

function Services() {
  const services = [
    {
      id: 1,
      title: 'Diseño Web',
      description: 'Creamos diseños modernos y atractivos que capturan la esencia de tu marca',
      icon: '🎨'
    },
    {
      id: 2,
      title: 'Desarrollo Frontend',
      description: 'Interfaces interactivas y responsivas con las mejores tecnologías',
      icon: '💻'
    },
    {
      id: 3,
      title: 'Desarrollo Backend',
      description: 'Servidores robustos y seguros para soportar tu aplicación',
      icon: '🔧'
    },
    {
      id: 4,
      title: 'E-commerce',
      description: 'Tiendas online completas y optimizadas para ventas',
      icon: '🛒'
    },
    {
      id: 5,
      title: 'SEO',
      description: 'Posicionamiento en buscadores para aumentar tu visibilidad',
      icon: '📊'
    },
    {
      id: 6,
      title: 'Mantenimiento',
      description: 'Soporte continuo y actualizaciones para tu sitio web',
      icon: '🛡️'
    }
  ]

  return (
    <div className="services">
      <section className="section">
        <div className="container">
          <h1>Nuestros Servicios</h1>
          <p className="section-subtitle">
            Ofrecemos soluciones completas para tu presencia digital
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href="/contact" className="service-link">Más información →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container text-center">
          <h2>¿Necesitas un servicio personalizado?</h2>
          <p>Contáctanos para una consulta gratuita</p>
          <a href="/contact" className="btn btn-primary mt-3">Solicitar Consulta</a>
        </div>
      </section>
    </div>
  )
}

export default Services
