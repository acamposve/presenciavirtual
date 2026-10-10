import './PageHero.css'

function PageHero({ title, subtitle, badge, children }) {
  return (
    <section className="page-hero">
      <div className="container">
        {badge && <span className="page-hero-badge">{badge}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}

export default PageHero
