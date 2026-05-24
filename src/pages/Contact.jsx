import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', message: '' })
    
    // Resetear el mensaje después de 3 segundos
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="contact">
      <section className="section">
        <div className="container">
          <h1>Contactanos</h1>
          <p className="section-subtitle">
            ¿Tienes alguna pregunta? Nos encantaría escucharte
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2 contact-grid">
            <div className="contact-info">
              <h2>Información de Contacto</h2>
              
              <div className="info-item">
                <h3>Email</h3>
                <p><a href="mailto:info@presenciavirtual.com">info@presenciavirtual.com</a></p>
              </div>

              <div className="info-item">
                <h3>Teléfono</h3>
                <p><a href="tel:+34123456789">+34 123 456 789</a></p>
              </div>

              <div className="info-item">
                <h3>Ubicación</h3>
                <p>
                  Presencia Virtual<br />
                  Calle Principal 123<br />
                  28000 Madrid, España
                </p>
              </div>

              <div className="info-item">
                <h3>Horario</h3>
                <p>
                  Lunes a Viernes: 9:00 - 18:00<br />
                  Sábado y Domingo: Cerrado
                </p>
              </div>
            </div>

            <div className="contact-form">
              <h2>Envíanos un Mensaje</h2>
              
              {submitted && (
                <div className="success-message">
                  ¡Gracias por tu mensaje! Nos pondremos en contacto pronto.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+34 123 456 789"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensaje</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tu mensaje aquí..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
