export const hosting = {
  es: {
    badge: 'Próximamente',
    title: 'Hosting web',
    subtitle: 'Un lugar confiable para tu sitio o aplicación, con soporte cercano y en tu idioma.',
    highlightsTitle: 'Por qué elegir nuestro hosting',
    highlights: [
      {
        icon: '⚡',
        title: 'Rendimiento',
        desc: 'Infraestructura pensada para que tu sitio cargue rápido.',
      },
      {
        icon: '🔒',
        title: 'Seguridad',
        desc: 'Certificados SSL y buenas prácticas de seguridad desde el primer día.',
      },
      {
        icon: '💬',
        title: 'Soporte en tu idioma',
        desc: 'Atención directa en español e inglés, sin intermediarios.',
      },
    ],
    plans: {
      title: 'Planes de hosting',
      subtitle: 'Elegí el plan que mejor se adapte a tu proyecto.',
      billingLabel: 'Periodo de facturación',
      monthly: 'Mensual',
      annual: 'Anual',
      perMonth: '/mes',
      perYear: '/año',
      pricePending: 'Precio a confirmar',
      featuresPending: 'Detalles del plan a confirmar',
      order: 'Contratar',
      // Sin URL de pedido el botón lleva al formulario de contacto, así que la
      // etiqueta no puede prometer una compra.
      orderWithoutUrl: 'Consultar',
      // Plan names are product names, so they are identical in both languages.
      // `features` stays empty until the product owner dictates the real
      // features: an invented bullet is a claim about the service.
      items: {
        starter: { name: 'Starter', features: [] },
        business: { name: 'Business', features: [] },
        pro: { name: 'Pro', features: [] },
      },
    },
    bundleTitle: 'Dominio + hosting en un solo lugar',
    bundleText: 'Buscá y registrá tu dominio y alojá el sitio con nosotros: te acompañamos en todo el proceso.',
    bundleLink: 'Buscar mi dominio',
    ctaTitle: '¿Querés alojar tu sitio con nosotros?',
    ctaText: 'Contanos qué necesitás y te recomendamos el plan adecuado.',
    ctaButton: 'Consultar por hosting',
  },
  en: {
    badge: 'Coming soon',
    title: 'Web hosting',
    subtitle: 'A reliable home for your website or application, with close support in your language.',
    highlightsTitle: 'Why choose our hosting',
    highlights: [
      {
        icon: '⚡',
        title: 'Performance',
        desc: 'Infrastructure built so your site loads fast.',
      },
      {
        icon: '🔒',
        title: 'Security',
        desc: 'SSL certificates and security best practices from day one.',
      },
      {
        icon: '💬',
        title: 'Support in your language',
        desc: 'Direct help in Spanish and English, with no middlemen.',
      },
    ],
    plans: {
      title: 'Hosting plans',
      subtitle: 'Choose the plan that best fits your project.',
      billingLabel: 'Billing period',
      monthly: 'Monthly',
      annual: 'Annual',
      perMonth: '/mo',
      perYear: '/yr',
      pricePending: 'Price to be confirmed',
      featuresPending: 'Plan details to be confirmed',
      order: 'Order now',
      orderWithoutUrl: 'Ask us',
      // Plan names match the Spanish tree on purpose: they are product names.
      items: {
        starter: { name: 'Starter', features: [] },
        business: { name: 'Business', features: [] },
        pro: { name: 'Pro', features: [] },
      },
    },
    bundleTitle: 'Domain + hosting in one place',
    bundleText: 'Search and register your domain and host the site with us: we help you through the whole process.',
    bundleLink: 'Find my domain',
    ctaTitle: 'Want to host your site with us?',
    ctaText: 'Tell us what you need and we will recommend the right plan.',
    ctaButton: 'Ask about hosting',
  },
}
