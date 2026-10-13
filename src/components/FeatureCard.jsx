import './FeatureCard.css'

function FeatureCard({ icon, title, desc, price, priceNote, items, children }) {
  return (
    <div className="feature-item">
      {icon && <div className="feature-item-icon" aria-hidden="true">{icon}</div>}
      <h3>{title}</h3>
      {price && (
        <p className="feature-item-price">
          {price}
          {priceNote && <span>{priceNote}</span>}
        </p>
      )}
      {desc && <p className="feature-item-desc">{desc}</p>}
      {items && items.length > 0 && (
        <ul className="feature-item-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {children}
    </div>
  )
}

export default FeatureCard
