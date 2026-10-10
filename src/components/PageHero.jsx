import './PageHero.css'

function PageHero({ title, subtitle, badge }) {
  return (
    <section className="page-hero">
      <div className="container">
        {badge && <span className="page-hero-badge">{badge}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  )
}

export default PageHero
