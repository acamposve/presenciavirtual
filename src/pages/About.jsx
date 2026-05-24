import './About.css'

function About() {
  return (
    <div className="about">
      <section className="section">
        <div className="container">
          <h1>Acerca de Nosotros</h1>
          <p className="lead">
            Somos un equipo apasionado por crear soluciones web innovadoras que 
            transforman negocios y mejoran la presencia digital de nuestros clientes.
          </p>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <h2 className="mb-4">Nuestra Misión</h2>
          <p>
            Proporcionar soluciones digitales de alta calidad que ayuden a las empresas 
            a alcanzar sus objetivos y destacar en el mundo digital.
          </p>
          <p>
            Creemos en la importancia de combinar diseño moderno, funcionalidad robusta 
            y experiencia del usuario excepcional.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="mb-4">Nuestros Valores</h2>
          <div className="grid grid-2">
            <div className="value-item">
              <h3>Excelencia</h3>
              <p>Nos esforzamos por entregar los mejores resultados en cada proyecto</p>
            </div>
            <div className="value-item">
              <h3>Innovación</h3>
              <p>Siempre buscamos nuevas formas de resolver problemas</p>
            </div>
            <div className="value-item">
              <h3>Transparencia</h3>
              <p>Comunicación clara y honesta con nuestros clientes</p>
            </div>
            <div className="value-item">
              <h3>Colaboración</h3>
              <p>Trabajamos juntos para alcanzar los mejores resultados</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
