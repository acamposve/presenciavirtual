import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <img src="/logopv.png" alt="Logo" className="logo-img" />
          <span>Presencia Virtual</span>
        </Link>
        <nav className="nav">
          <Link to="/">Inicio</Link>
          <Link to="/about">Acerca de</Link>
          <Link to="/services">Servicios</Link>
          <Link to="/contact">Contacto</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
