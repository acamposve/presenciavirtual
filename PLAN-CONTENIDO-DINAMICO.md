# Plan: contenido dinámico y administrable para Presencia Virtual

## Objetivo

Permitir que personas autorizadas actualicen el contenido comercial y editorial del sitio sin editar código ni volver a compilar cada cambio. El sitio actual es una SPA React/Vite bilingüe (ES/EN), desplegada manualmente en hosting compartido con PHP; el buscador de dominios ya consulta una API PHP y los textos hoy viven mayormente en `src/i18n/sections/`.

La administración debe cubrir primero los datos que cambian con frecuencia o que hoy bloquean la publicación (planes, precios, testimonios y casos). No debe permitir que contenido editable cambie rutas, lógica de formularios, credenciales ni código ejecutable.

## Inventario: qué debería administrarse

### Prioridad alta: datos comerciales y prueba social

- **Planes de hosting**: nombre, descripción, precio mensual/anual, moneda, periodicidad, características, orden, etiqueta (por ejemplo “Más elegido”), URL de contratación, estado publicado/borrador y traducciones. Hoy los tres planes tienen precios `0`, listas de características vacías y sin URL de compra.
- **Testimonios**: cita, nombre, cargo/empresa opcionales, foto/logotipo opcionales, idioma, servicio relacionado, permiso de publicación, orden y estado. La web todavía no tiene una sección de testimonios; deberá diseñarse y agregarse además de conectarla al CMS.
- **Casos de estudio / portfolio**: cliente o nombre anonimizado, reto, solución, resultados verificables, servicios, imagen, enlaces, idioma y orden. La página de desarrollo tiene el espacio y el estado vacío; la página de soluciones puede enlazar casos relevantes.
- **Promociones y avisos**: texto, fechas de inicio/fin, servicios relacionados, CTA, idioma y programación de publicación. Los avisos deben ocultarse al vencer.
- **Precios y enlaces de productos gestionados manualmente**: hosting y servicios con precio definido por el negocio. Los precios de dominios provienen del API de ResellersPanel y no se deben duplicar como contenido editable; sí administrar TLD visibles, orden o textos de presentación si el negocio lo requiere, sin contradecir el catálogo real devuelto por el API.

### Prioridad alta: contenido de páginas y conversión

- **Inicio**: hero (título, bajada y CTA), tarjetas de servicios, sección “cuándo llamarnos”, diferenciador/diagrama y CTA final. El buscador de dominios conserva su comportamiento y validaciones; administrables solo sus textos y chips informativos.
- **Páginas de servicio**: títulos, bajadas, distintivos, beneficios, entregables, etapas del proceso, capacidades, principios, CTA, texto de paquetes y preguntas frecuentes. Incluye dominios, hosting, desarrollo web, consultoría de IA y soluciones.
- **Preguntas frecuentes**: preguntas y respuestas por servicio, orden, idioma y estado. No hay actualmente un FAQ, por lo que requiere nueva sección de presentación.
- **Acerca de**: descripción, misión/enfoque, equipo, perfiles, fotos y enlaces, solo cuando se confirme contenido real.
- **Llamadas a la acción reutilizables**: etiqueta, destino permitido y servicio/tema asociado. El CMS debe ofrecer destinos predefinidos o validar rutas para que no se rompan links ni la preselección del formulario.

### Prioridad media: identidad, navegación y datos globales

- **Header/footer**: textos, enlaces de navegación, datos públicos de contacto, redes y horarios si se publican. Mantener controladas las rutas y los enlaces legales.
- **Medios**: imágenes de portada, casos, testimonios y equipo; texto alternativo, créditos, idioma, recorte/uso y tamaño optimizado.
- **SEO por página**: título, descripción, Open Graph, imagen social, canonical cuando aplique y configuración indexable/no indexable. El sitemap se genera o actualiza a partir de páginas publicadas.
- **Textos de contacto y legales**: datos visibles, privacidad, términos, reembolsos y condiciones de venta. Estos documentos requieren revisión del responsable antes de publicar.
- **Páginas nuevas**: crear páginas a partir de bloques permitidos (hero, texto, tarjetas, FAQ, CTA, testimonios y casos), sin editor de HTML arbitrario.

### Mantener fuera del CMS (o con control técnico separado)

- Código, estilos, rutas, comportamiento del buscador, validación, temas válidos del formulario, reglas de seguridad y configuración de infraestructura.
- Credenciales de ResellersPanel, SMTP, claves y variables de entorno.
- Disponibilidad/precios en vivo de dominios: la API es la fuente de verdad.
- Traducciones de interfaz operativa y errores técnicos (por ejemplo, errores de red y validación). Mantenerlas en el sistema i18n y usar chequeos de paridad; el CMS administra contenido editorial y comercial por idioma.

## Principios y decisiones de producto

1. **Una sola fuente de datos publicada** para la web; no mantener los mismos precios o textos en el CMS y en archivos React.
2. **Bilingüe desde el esquema**: español e inglés asociados al mismo contenido, con indicador visible de traducción incompleta y política definida para no mostrar una mezcla accidental de idiomas.
3. **Borrador y publicación**: editar no debe cambiar producción hasta publicar; permitir vista previa autenticada.
4. **Validación antes de publicar**: precio no negativo, moneda y periodos permitidos, URLs seguras, fechas coherentes, campos obligatorios y traducciones requeridas.
5. **Historial y recuperación**: registrar quién cambió qué y cuándo, y permitir restaurar una versión publicada anterior.
6. **Contenido seguro**: texto plano y formato enriquecido limitado con sanitización; nunca ejecutar HTML, JavaScript o componentes proporcionados por usuarios.
7. **Compatible con el hosting actual**: decidir si se conserva PHP compartido o se adopta un CMS headless externo antes de implementar. Comparar coste, mantenimiento, seguridad, backups, bilingüismo, previews y disponibilidad del servicio.

## Fases de trabajo

### Fase 0 — Descubrimiento y definición editorial

**Tareas**
- Confirmar quién mantendrá el sitio, cuántas personas editarán, permisos necesarios y frecuencia de cambios.
- Confirmar idioma original y si cada pieza debe tener traducción completa antes de publicar.
- Recopilar precios, moneda, periodos, características, URLs de compra y reglas promocionales reales de hosting.
- Reunir testimonios con autorización documentada y casos con métricas que puedan publicarse.
- Definir contenido que requiere aprobación (precios, promociones, legales, testimonios y resultados).
- Confirmar si se administrarán páginas completas o solo bloques de páginas existentes.

**Entregable / salida**
- Inventario aprobado de contenidos, responsables, campos, políticas de traducción y frecuencia de cambios.
- Decisión sobre el alcance inicial: precios/planes, casos, testimonios y FAQ como mínimo.

### Fase 1 — Selección de arquitectura CMS

**Tareas**
- Comparar dos alternativas: CMS headless administrado y panel propio en PHP con persistencia apta para el hosting. Evaluar también si el proveedor actual ofrece CMS seguro y sostenible.
- Verificar conectividad de producción, CORS, HTTPS, límites del hosting, almacenamiento, backups, disponibilidad y coste.
- Elegir almacenamiento con escritura segura, copias y recuperación. No guardar contenido estructurado complejo en archivos planos editables desde el navegador.
- Definir API pública de solo lectura para la SPA y API privada de administración; evitar exponer credenciales del CMS en el bundle del frontend.
- Especificar autenticación, roles, sesiones, protección CSRF, límites de acceso y procedimiento de recuperación de cuenta.
- Definir formato versionado de contenido, caché, invalidación y comportamiento cuando el CMS no responda.
- Decidir cómo se hará preview de borradores sin indexarlos ni servirlos al público.

**Entregable / salida**
- ADR (registro de decisión de arquitectura) y diagrama de flujo entre panel, CMS/API, web pública y hosting.
- Especificación de entornos, dominios, backups y responsabilidades operativas.

### Fase 2 — Modelo de contenido y API

**Tareas**
- Definir tipos: configuración global, página, bloque/sección, servicio, plan, testimonio, caso de estudio, FAQ, promoción, medio y metadatos SEO.
- Definir campos por idioma, slug estable, orden, estado, fechas de publicación, autor/editor y referencias entre contenidos.
- Modelar planes por moneda y periodicidad; definir si el precio es mensual/anual, precio promocional, vigencia y condiciones para evitar ambigüedad.
- Definir esquema JSON público y reglas de validación versionadas. Mantener identificadores estables para que idioma y referencias no dependan del texto visible.
- Diseñar endpoints públicos y privados, respuestas, errores, caché y fallback local seguro.
- Establecer política para contenido incompleto: ocultar, usar versión anterior publicada o mostrar fallback bilingüe aprobado.

**Entregable / salida**
- Esquemas y ejemplos de payload ES/EN para cada tipo de contenido.
- Contrato de API documentado y criterios de compatibilidad entre versiones.

### Fase 3 — Administración y flujo editorial

**Tareas**
- Crear/configurar acceso autenticado y roles (administrador, editor y, si aplica, revisor).
- Implementar listado, búsqueda, filtros por estado/idioma, creación, edición, duplicación, orden y archivado.
- Permitir borrador, preview, revisión, publicación inmediata o programada y despublicación.
- Añadir estado de traducción ES/EN, indicador de faltantes y validación previa a publicación.
- Añadir vista previa fiel a la web y comparación con versión publicada.
- Registrar auditoría de cambios y ofrecer restauración de versiones.
- Limitar medios por tipo, peso y dimensiones; generar formatos/tamaños optimizados y exigir texto alternativo para imágenes informativas.
- Añadir confirmación para cambios de alto impacto como precio, URL de compra, promoción o publicación de testimonio.

**Entregable / salida**
- Panel usable por una persona no técnica, con permisos, vista previa e historial.

### Fase 4 — Conexión de la web y migración del contenido existente

**Tareas**
- Crear una capa de acceso a contenido desacoplada de los componentes para leer el contenido publicado y aplicar fallback.
- Migrar al modelo nuevo el contenido actual de `src/i18n/sections/` que corresponda a contenido editorial/comercial; mantener en código interfaz, errores y comportamiento.
- Reemplazar el origen de los planes en `src/data/hostingPlans.js` y la información de planes en traducciones por una única fuente administrable.
- Conectar inicio, hosting, dominios (solo contenido editorial), desarrollo web, consultoría de IA, soluciones, acerca de, header/footer y metadatos según el inventario priorizado.
- Construir componentes para testimonios, casos, FAQ, promociones y bloques de contenido que hoy no existen.
- Mantener los links de CTA de servicio al formulario con `topic` válido y permitir solo destinos autorizados.
- Definir skeleton/estado de carga, error y fallback; el sitio público debe seguir mostrando la última versión válida si el CMS falla.
- Asegurar consistencia de idioma al alternar ES/EN y preservar rutas/SEO existentes.

**Entregable / salida**
- Las páginas publicadas consumen contenido administrable sin duplicados estáticos.

### Fase 5 — Carga inicial y revisión de contenido

**Tareas**
- Cargar precios, nombres, características y enlaces de planes confirmados por el negocio.
- Cargar casos de estudio con resultados verificables y permiso para usar nombres/logos.
- Cargar testimonios autorizados y decidir si aparecen en inicio, página de servicio o ambos.
- Preparar FAQ de hosting, dominios, desarrollo e IA, revisadas por el responsable.
- Revisar copys ES/EN, tono, ortografía, enlaces, imágenes y texto alternativo.
- Completar SEO, páginas legales y datos de contacto aprobados.
- Probar expiración y activación programada de promociones.

**Entregable / salida**
- Contenido inicial aprobado y publicado en staging.

### Fase 6 — Seguridad, calidad y aceptación

**Tareas**
- Verificar acceso sin sesión a endpoints privados y preview; revisar CSRF, sesiones, roles, rate limits y sanitización.
- Comprobar que secretos no aparecen en el bundle, respuestas públicas, logs ni artefactos de despliegue.
- Verificar caché e invalidación tras publicar, fallback ante caída y recuperación desde backup.
- Validar contratos y datos: ES/EN, campos obligatorios, precios, enlaces, fechas, slugs, referencias y estados.
- Revisar render móvil/escritorio, teclado, lector de pantalla, contraste, foco y texto alternativo.
- Comprobar title, description, Open Graph, canonical, robots y sitemap para publicaciones y borradores.
- Hacer pruebas de usuario con un editor: actualizar precio, añadir testimonio, editar traducción, previsualizar, publicar y restaurar.
- Ejecutar las comprobaciones existentes del proyecto (`npm run verify`) y añadir las nuevas verificaciones automatizadas que cubran el contrato de contenido y los fallbacks.

**Criterios de aceptación**
- Un editor actualiza un plan en ES/EN y el cambio aparece sin edición de código ni credenciales técnicas.
- Un borrador y una vista previa no aparecen públicamente ni se indexan.
- Una publicación incompleta o inválida queda bloqueada con un mensaje claro.
- Si el CMS/API se cae, la web presenta el último contenido válido o un fallback aprobado.
- Existe historial recuperable de cambios y queda claro quién publicó cada cambio.

### Fase 7 — Despliegue y operación

**Tareas**
- Preparar staging y producción, configurar HTTPS, dominio del panel y secretos fuera del directorio público.
- Definir backups automáticos, retención, prueba periódica de restauración y responsable de recuperación.
- Documentar publicación, reversión, gestión de usuarios, actualización de contenido y respuesta ante caída.
- Desplegar la API/CMS y luego la web; cargar el contenido inicial en staging y validar antes de producción.
- Configurar monitoreo de errores, disponibilidad, latencia y fallos de publicación sin registrar datos sensibles.
- Definir responsables de precios, traducciones, casos, testimonios y contenido legal, además de una revisión periódica de enlaces y promociones vencidas.

**Entregable / salida**
- Sitio en producción conectado a contenido administrable, respaldado y con procedimiento operativo probado.

## Orden recomendado de entrega

1. Arquitectura, autenticación y modelo editorial.
2. Planes de hosting, precios y enlaces de contratación.
3. Casos de estudio y testimonios (incluida su nueva presentación pública).
4. FAQ y promociones.
5. Textos de páginas existentes y datos globales.
6. SEO, legales y creación de páginas con bloques permitidos.

## Riesgos y decisiones pendientes

- El hosting actual es compartido y la publicación se hace manualmente; hay que validar si admite de forma confiable el backend y el CMS propuestos antes de decidir el producto.
- El sitio incluye archivos PHP y credenciales de API dentro de `public/`; el flujo actual copia contenido de `public/` a `dist/`. La arquitectura de contenido debe conservar la separación entre secretos y archivos públicos y evitar distribuir credenciales en el artefacto web.
- Los precios del registrador cambian y el API ya es fuente de verdad. Una edición manual paralela produciría discrepancias.
- Testimonios, resultados, logos, nombres de clientes, precios, beneficios y afirmaciones comerciales requieren datos reales y autorización; no deben inventarse como parte de la carga inicial.
- Un CMS remoto introduce dependencia de red. La última publicación debe poder seguir sirviéndose si el CMS queda temporalmente fuera de servicio.
- Las páginas legales deben ser revisadas por el responsable correspondiente antes de publicarse.

## Fuera de alcance de este plan

- Cambiar el diseño o el stack general de la web sin necesidad funcional.
- Habilitar compras o cobros dentro del sitio: el plan actual redirige a ResellersPanel.
- Editar credenciales, código o reglas del API desde el panel.
- Publicar información comercial, casos o testimonios sin validación del negocio.
