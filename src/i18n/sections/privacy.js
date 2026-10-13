// Privacy policy copy. Every statement here describes what this site actually
// does (contact form, domain search, hosting logs, Google Fonts, `pv-lang` in
// localStorage) and nothing else: no certification, no compliance claim and no
// security measure that is not in the code. The values that depend on the owner
// live in src/data/privacy.js, not here.
//
// No third-party template was copied. Spanish uses the site's own register
// ("vos" where the rest of the site does), English is neutral.
export const privacy = {
  es: {
    title: 'Política de Privacidad',
    subtitle:
      'Qué datos personales recoge este sitio, para qué los usamos, quién más los ve y cómo podés ejercer tus derechos.',
    draftNoticeTitle: 'Versión preliminar: faltan datos por completar',
    draftNoticeText:
      'Este documento no está completo ni revisado todavía. No debería publicarse como política válida hasta que el responsable complete los datos que faltan y los textos pasen una revisión legal. Falta lo siguiente:',
    pendingValue: 'Pendiente de completar',
    fieldLabels: {
      legalName: 'Razón social o nombre legal',
      address: 'Domicilio',
      retentionPeriod: 'Plazo de conservación de los mensajes',
      supervisoryAuthority: 'Autoridad de control competente',
      jurisdiction: 'Legislación aplicable',
      hostingCountry: 'País donde se aloja el sitio',
      lastUpdated: 'Última actualización',
    },
    rightsHowToLabel: 'Cómo ejercerlos',
    rightsHowToText:
      'Escribinos desde la dirección de correo con la que nos contactaste y contanos qué necesitás. Te vamos a responder a esa misma dirección.',
    rightsAuthorityIntro:
      'Si considerás que no tratamos tus datos como corresponde, podés reclamar ante la autoridad de control competente:',
    sections: {
      controller: {
        title: '1. Responsable del tratamiento',
        paragraphs: [
          'Este sitio (presenciavirtual.net) recoge algunos datos personales: los que escribís en el formulario de contacto y los técnicos que registra el servidor al usarlo. En este documento explicamos cuáles son, para qué los usamos y qué podés pedirnos.',
          'El responsable del tratamiento de esos datos es quien figura a continuación. Si tenés cualquier duda sobre este documento, escribinos al correo indicado.',
        ],
        items: [],
      },
      data: {
        title: '2. Qué datos tratamos y de dónde salen',
        paragraphs: [
          'Tratamos únicamente los datos necesarios para responderte y para mantener el sitio funcionando. No pedimos nada que no escribas vos en el formulario y no hacemos perfilado.',
          'En este sitio no se procesan pagos. Si decidís registrar un dominio o contratar un hosting, el alta y el pago se completan en el sitio del registrador, con sus propias condiciones.',
        ],
        items: [
          'Formulario de contacto: nombre, correo electrónico, teléfono (opcional), el tema que elegís y el texto del mensaje. Los completás vos y nos llegan por correo electrónico.',
          'Buscador de dominios: el nombre de dominio que escribís. Viaja a nuestro propio servidor y desde ahí a la API del registrador, que responde si el dominio está disponible y a qué precio.',
          'Dirección IP: el servidor la registra para limitar el abuso del buscador de dominios (un contador de peticiones por IP) y también aparece en los registros habituales del hosting.',
          'Idioma elegido: se guarda en tu navegador, no en nuestros servidores (ver el apartado de cookies y almacenamiento local).',
        ],
      },
      purposes: {
        title: '3. Para qué los usamos y con qué base',
        paragraphs: [
          'Usamos esos datos solo para lo siguiente:',
          'La base para tratar los datos del formulario es tu consentimiento, que prestás al enviarlo y podés retirar cuando quieras escribiéndonos (ver el apartado de tus derechos). Los datos técnicos del buscador se tratan para mantener el servicio disponible y libre de abuso.',
        ],
        items: [
          'Responder tu consulta y continuar la conversación por el medio que elijas (correo, teléfono o WhatsApp).',
          'Hacer funcionar el buscador de dominios: consultar la disponibilidad y mostrar precios actualizados.',
          'Mantener el sitio disponible y protegido: limitar el abuso automático del buscador y detectar errores.',
          'Conservar el registro necesario para atender un reclamo o un requerimiento de una autoridad competente.',
        ],
      },
      retention: {
        title: '4. Cuánto tiempo los conservamos',
        paragraphs: [
          'Conservamos los mensajes que nos enviás por el formulario durante el plazo indicado en este apartado.',
          'Los datos técnicos del buscador de dominios no forman un historial de tus consultas: el contador de peticiones por IP y las cachés de precios y de consultas son temporales y se renuevan solas en el servidor.',
        ],
        items: [],
      },
      recipients: {
        title: '5. Quién más los ve',
        paragraphs: [
          'No vendemos tus datos ni los cedemos a terceros con fines publicitarios. Solo pasan por otras empresas los datos imprescindibles para que el sitio funcione:',
          'No usamos herramientas de analítica ni píxeles de seguimiento, y el sitio no carga recursos de otros terceros fuera de las tipografías.',
        ],
        items: [
          'Proveedor de hosting: aloja este sitio, el correo del responsable y los registros del servidor. Todo lo que enviás por el formulario pasa por sus servidores.',
          'Google Fonts: las tipografías del sitio se cargan desde servidores de Google (fonts.googleapis.com y fonts.gstatic.com). Para eso tu navegador se conecta directamente con Google, que recibe tu dirección IP y datos técnicos del navegador. Ese tratamiento lo hace Google bajo sus propias condiciones y no lo controlamos.',
          'Registrador de dominios (ResellersPanel): si registrás un dominio, el alta y el pago se completan en su sitio, fuera de presenciavirtual.net, con sus propias condiciones y su propia política de privacidad.',
        ],
      },
      transfers: {
        title: '6. Transferencias internacionales',
        paragraphs: [
          'El sitio y el correo del responsable están alojados en un proveedor de hosting. Si ese proveedor, o alguno de sus servidores, está en otro país, los datos que enviás salen de tu país y se tratan donde estén esos servidores.',
          'El país de alojamiento figura en este apartado, y es un dato que debe precisar el responsable: mientras falte, este documento no está completo.',
          'Las tipografías de Google implican además que tu navegador se conecta con servidores de Google que pueden estar en otros países.',
        ],
        items: [],
      },
      rights: {
        title: '7. Tus derechos',
        paragraphs: [
          'Los derechos que te corresponden dependen de la legislación aplicable, que debe precisarse en este documento (ver el aviso al inicio). En términos generales, podés pedirnos que:',
        ],
        items: [
          'te digamos qué datos tuyos tenemos y de dónde los obtuvimos;',
          'corrijamos datos incorrectos o incompletos;',
          'eliminemos tus datos cuando ya no sean necesarios para lo que nos los diste;',
          'dejemos de usar tus datos para una finalidad concreta, por ejemplo que no te contactemos más;',
          'te entreguemos una copia de los datos que nos diste en un formato que puedas leer.',
        ],
      },
      cookies: {
        title: '8. Cookies y almacenamiento local',
        paragraphs: [
          'Este sitio no usa cookies propias ni de terceros, ni herramientas de analítica, ni píxeles de seguimiento. Por eso no vas a ver un aviso de cookies.',
          'Lo único que guardamos en tu navegador es tu elección de idioma:',
          'Si borrás los datos del sitio desde tu navegador, el idioma se vuelve a detectar a partir de la configuración del navegador.',
        ],
        items: [
          'Clave pv-lang en el almacenamiento local (localStorage): guarda si elegiste español o inglés, para mostrarte el sitio en ese idioma la próxima vez. No identifica a ninguna persona, no se comparte con nadie y podés borrarla cuando quieras desde la configuración de tu navegador.',
        ],
      },
      security: {
        title: '9. Seguridad',
        paragraphs: [
          'Cuidamos los datos que nos enviás con las medidas que tenemos y que podemos describir:',
          'No prometemos una seguridad absoluta, porque ningún sistema la ofrece. En este documento no afirmamos certificaciones ni estándares de cumplimiento que no estén efectivamente vigentes.',
        ],
        items: [
          'El formulario de contacto tiene un campo trampa que descarta los envíos automáticos de bots.',
          'El buscador de dominios limita el abuso con un contador de peticiones por IP y cachés temporales.',
          'Las credenciales del registrador de dominios se usan solo del lado del servidor: nunca llegan a tu navegador.',
        ],
      },
      changes: {
        title: '10. Cambios en esta política y fecha de última actualización',
        paragraphs: [
          'Podemos actualizar esta política si cambia lo que hace el sitio o la forma en que tratamos los datos. La versión publicada en esta página es siempre la vigente, y la fecha de este apartado indica cuándo se actualizó por última vez.',
          'Esta versión todavía no puede considerarse definitiva: faltan datos que debe completar el responsable y una revisión legal de los textos. Cuando eso esté resuelto, el aviso del inicio de la página desaparece solo.',
        ],
        items: [],
      },
    },
  },
  en: {
    title: 'Privacy Policy',
    subtitle:
      'What personal data this site collects, what we use it for, who else sees it and how you can exercise your rights.',
    draftNoticeTitle: 'Draft version: details still missing',
    draftNoticeText:
      'This document is neither complete nor reviewed yet. It should not be published as a valid policy until the controller fills in the missing details and the wording goes through a legal review. Still missing:',
    pendingValue: 'To be completed',
    fieldLabels: {
      legalName: 'Legal or business name',
      address: 'Address',
      retentionPeriod: 'Retention period for messages',
      supervisoryAuthority: 'Competent supervisory authority',
      jurisdiction: 'Governing law',
      hostingCountry: 'Country where the site is hosted',
      lastUpdated: 'Last updated',
    },
    rightsHowToLabel: 'How to exercise them',
    rightsHowToText:
      'Write to us from the email address you used to contact us and tell us what you need. We will reply to that same address.',
    rightsAuthorityIntro:
      'If you believe we are not handling your data properly, you can complain to the competent supervisory authority:',
    sections: {
      controller: {
        title: '1. Who is responsible for the data',
        paragraphs: [
          'This site (presenciavirtual.net) collects some personal data: what you type into the contact form and the technical data the server records while you use it. This document explains what is collected, what we use it for and what you can ask us to do.',
          'The controller of that data is the person or company listed below. If you have any question about this document, write to the email address shown.',
        ],
        items: [],
      },
      data: {
        title: '2. What data we process and where it comes from',
        paragraphs: [
          'We only process the data we need to answer you and to keep the site running. We do not ask for anything you did not type into the form, and we do not build profiles.',
          'No payments are processed on this site. If you decide to register a domain or buy hosting, the order and the payment are completed on the registrar site, under its own terms.',
        ],
        items: [
          'Contact form: name, email address, phone (optional), the topic you choose and the text of your message. You fill it in and it reaches us by email.',
          'Domain search: the domain name you type. It travels to our own server and from there to the registrar API, which answers whether the domain is available and at what price.',
          'IP address: the server records it to limit abuse of the domain search (a request counter per IP), and it also appears in the usual hosting logs.',
          'Chosen language: stored in your browser, not on our servers (see the cookies and local storage section).',
        ],
      },
      purposes: {
        title: '3. What we use it for and on what basis',
        paragraphs: [
          'We use that data only for the following:',
          'The basis for processing the form data is your consent, which you give when you submit it and can withdraw at any time by writing to us (see the rights section). The technical data of the search is processed to keep the service available and free of abuse.',
        ],
        items: [
          'Answering your enquiry and continuing the conversation through the channel you choose (email, phone or WhatsApp).',
          'Running the domain search: checking availability and showing current prices.',
          'Keeping the site available and protected: limiting automated abuse of the search and detecting errors.',
          'Keeping the record needed to handle a complaint or a request from a competent authority.',
        ],
      },
      retention: {
        title: '4. How long we keep it',
        paragraphs: [
          'We keep the messages you send through the form for the period stated in this section.',
          'The technical data of the domain search is not a history of your searches: the request counter per IP and the price and query caches are temporary and refresh on their own on the server.',
        ],
        items: [],
      },
      recipients: {
        title: '5. Who else sees it',
        paragraphs: [
          'We do not sell your data and we do not share it with third parties for advertising purposes. Only the data that is essential for the site to work passes through other companies:',
          'We use no analytics tools and no tracking pixels, and the site loads no third-party resources other than the fonts.',
        ],
        items: [
          'Hosting provider: hosts this site, the controller mailbox and the server logs. Everything you send through the form passes through its servers.',
          'Google Fonts: the site fonts load from Google servers (fonts.googleapis.com and fonts.gstatic.com). To do that, your browser connects directly to Google, which receives your IP address and technical browser data. Google does that under its own terms and we do not control it.',
          'Domain registrar (ResellersPanel): if you register a domain, the order and the payment are completed on its site, outside presenciavirtual.net, under its own terms and privacy policy.',
        ],
      },
      transfers: {
        title: '6. International transfers',
        paragraphs: [
          'The site and the controller mailbox are hosted with a hosting provider. If that provider, or any of its servers, is in another country, the data you send leaves your country and is processed where those servers are.',
          'The hosting country is stated in this section, and it is a detail the controller has to specify: while it is missing, this document is not complete.',
          'Google Fonts also means your browser connects to Google servers that may be in other countries.',
        ],
        items: [],
      },
      rights: {
        title: '7. Your rights',
        paragraphs: [
          'The rights available to you depend on the applicable law, which has to be specified in this document (see the notice at the top). In general terms, you can ask us to:',
        ],
        items: [
          'tell you what data of yours we hold and where we got it from;',
          'correct data that is wrong or incomplete;',
          'delete your data when it is no longer needed for what you gave it to us for;',
          'stop using your data for a specific purpose, for example to stop contacting you;',
          'give you a copy of the data you gave us in a format you can read.',
        ],
      },
      cookies: {
        title: '8. Cookies and local storage',
        paragraphs: [
          'This site uses no first-party or third-party cookies, no analytics tools and no tracking pixels. That is why you will not see a cookie banner here.',
          'The only thing we store in your browser is your language choice:',
          'If you clear the site data from your browser, the language is detected again from your browser settings.',
        ],
        items: [
          'Key pv-lang in local storage (localStorage): it stores whether you chose Spanish or English, so the site is shown in that language next time. It does not identify anyone, it is not shared with anyone, and you can delete it at any time from your browser settings.',
        ],
      },
      security: {
        title: '9. Security',
        paragraphs: [
          'We look after the data you send us with the measures we have and can describe:',
          'We do not promise absolute security, because no system offers it. This document claims no certifications or compliance standards that are not actually in place.',
        ],
        items: [
          'The contact form has a honeypot field that discards automated bot submissions.',
          'The domain search limits abuse with a request counter per IP and temporary caches.',
          'The domain registrar credentials are used server-side only: they never reach your browser.',
        ],
      },
      changes: {
        title: '10. Changes to this policy and last update date',
        paragraphs: [
          'We may update this policy if what the site does changes, or if the way we process data changes. The version published on this page is always the current one, and the date in this section shows when it was last updated.',
          'This version cannot be considered final yet: some details still have to be filled in by the controller and the wording still needs a legal review. Once that is done, the notice at the top of the page disappears on its own.',
        ],
        items: [],
      },
    },
  },
}
