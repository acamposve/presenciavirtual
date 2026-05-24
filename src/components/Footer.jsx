import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Presencia Virtual</h3>
            <p>Transformamos tu presencia digital en internet</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/about">Acerca de</a></li>
              <li><a href="/services">Servicios</a></li>
              <li><a href="/contact">Contacto</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>Email: <a href="mailto:info@presenciavirtual.com">info@presenciavirtual.com</a></p>
            <p>Teléfono: <a href="tel:+34123456789">+34 123 456 789</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Presencia Virtual. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
