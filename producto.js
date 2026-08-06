/* ===== Página de detalle de producto =====
   Lee ?id=<id> de la URL, busca el producto en PRODUCTS (products.js)
   y renderiza galería de fotos + especificaciones + botón WhatsApp.   */

const params = new URLSearchParams(location.search);
const product = PRODUCTS.find(p => p.id === params.get('id'));
const detail = document.getElementById('detail');

/* ===== Canonical dinámico =====
   SITE_ORIGIN debe coincidir con el usado en index.html, robots.txt y sitemap.xml. */
const SITE_ORIGIN = 'https://www.gradinuruguay.com.uy';
const pageURL = product
  ? `${SITE_ORIGIN}/producto.html?id=${product.id}`
  : `${SITE_ORIGIN}/`;

(function setCanonical() {
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = pageURL;
  document.head.appendChild(link);
})();

/* ===== Datos estructurados de la ficha =====
   Product + Offer le dan a Google precio y disponibilidad del equipo, y
   BreadcrumbList le da la ruta Inicio › Maquinaria › <equipo>.        */
function addJsonLd(data) {
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

if (product) {
  const marca = (typeof BRANDS !== 'undefined' && BRANDS.find(b => b.id === product.brand)) || null;

  const producto = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.desc,
    sku: product.id,
    image: product.images.map(src => `${SITE_ORIGIN}/${src}`),
    brand: { '@type': 'Brand', name: marca ? marca.name : 'GRADIN' },
    additionalProperty: product.specs.map(s => ({
      '@type': 'PropertyValue', name: s[1], value: s[2],
    })),
  };

  /* Sólo publicamos precio cuando hay precio de venta. Los equipos que son
     únicamente de alquiler no llevan Offer: poner ahí la tarifa por día haría
     que Google muestre "USD 120" como si fuera el precio del equipo. */
  if (product.precio) {
    producto.offers = {
      '@type': 'Offer',
      url: pageURL,
      priceCurrency: 'USD',
      price: Number(product.precio.replace(/\./g, '')),
      availability: product.soon
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'GRADIN' },
    };
  }
  addJsonLd(producto);

  addJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Maquinaria', item: `${SITE_ORIGIN}/#productos` },
      { '@type': 'ListItem', position: 3, name: product.name, item: pageURL },
    ],
  });
}

if (!product) {
  detail.innerHTML = `
    <div class="detail__empty">
      <i class="bi bi-exclamation-triangle"></i>
      <h1>Producto no encontrado</h1>
      <p>El equipo que buscás no está disponible.</p>
      <a class="btn btn--primary" href="index.html#productos">Ver toda la maquinaria</a>
    </div>`;
} else {
  document.title = `GRADIN · ${product.name}`;

  /* Meta description propia por equipo: si todas las fichas comparten la
     misma, Google las lee como contenido duplicado. */
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = product.desc.slice(0, 155);

  const waText = encodeURIComponent(
    product.soon
      ? `Hola GRADIN, quiero reservar la ${product.name} (próximo ingreso). ¿Cómo hago la reserva?`
      : `Hola GRADIN, me interesa la ${product.name}. ¿Me pasás precio y disponibilidad?`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;
  const ctaLabel = product.soon ? 'Reservar por WhatsApp' : 'Consultar por WhatsApp';

  /* width/height reales de una foto, para que el navegador reserve el espacio. */
  const dimsAttr = (src) => {
    const d = IMAGE_DIMS[src];
    return d ? ` width="${d[0]}" height="${d[1]}"` : '';
  };

  const thumbs = product.images.map((src, i) => `
    <button type="button" class="gallery__thumb ${i === 0 ? 'is-active' : ''}" data-index="${i}" aria-label="Ver foto ${i + 1} de ${product.images.length}" aria-pressed="${i === 0}">
      <img src="${src}" alt="${product.name} — foto ${i + 1}"${dimsAttr(src)} loading="lazy" decoding="async" onerror="this.style.display='none'">
      <i class="bi ${product.icon}"></i>
    </button>`).join('');

  const specRows = product.specs.map(s => `
    <li class="spec">
      <span class="spec__label"><i class="bi ${s[0]}"></i> ${s[1]}</span>
      <span class="spec__value">${s[2]}</span>
    </li>`).join('');

  const rentBlock = product.alquilerDia ? `
    <div class="detail__price">
      <div class="detail__price-row">
        <span class="detail__price-big">USD ${product.alquilerDia}</span>
        <small>+ IVA · por día</small>
      </div>
      <div class="detail__finance">
        <p class="detail__finance-title"><i class="bi bi-calendar-week"></i> Alquiler</p>
        <ul>
          <li>Por semana: <strong>USD ${product.alquilerSemana}</strong> + IVA</li>
          <li>Cotizamos tu traslado</li>
        </ul>
      </div>
    </div>` : '';

  let priceBlock = '';
  if (product.precio) {
    const financeBlock = product.soon ? `
      <div class="detail__finance">
        <p class="detail__finance-title"><i class="bi bi-hourglass-split"></i> Próximamente · ya podés reservar</p>
        <ul>
          <li>Reservá tu unidad con seña y coordinás el resto al ingreso del equipo.</li>
        </ul>
      </div>` : (product.cuota ? `
      <div class="detail__finance">
        <p class="detail__finance-title"><i class="bi bi-credit-card-2-front-fill"></i> Financiación de la casa</p>
        <ul>
          <li>Entregás el <strong>50%</strong>: USD ${product.entrega} + IVA</li>
          <li>El resto en <strong>hasta ${product.cuotasMax} cuotas</strong> de <strong>USD ${product.cuota}</strong> + IVA</li>
        </ul>
      </div>` : '');
    priceBlock = `
    <div class="detail__price">
      <div class="detail__price-row">
        <span class="detail__price-big">USD ${product.precio}</span>
        <small>+ IVA · ${product.soon ? 'precio de reserva' : 'precio contado'}</small>
      </div>
      ${financeBlock}
    </div>`;
  } else if (!product.alquilerDia) {
    priceBlock = `
    <div class="detail__price">
      <div class="detail__price-row">
        <span class="detail__price-big">Consultá el precio</span>
      </div>
      <div class="detail__price-alt">Escribinos por WhatsApp y te pasamos precio y opciones de financiación.</div>
    </div>`;
  }

  detail.innerHTML = `
    <div class="detail__gallery">
      <div class="gallery__main" id="galMain">
        <img id="galImg" src="${product.images[0]}" alt="${product.name}"${dimsAttr(product.images[0])} fetchpriority="high"
             tabindex="0" role="button" aria-label="Ampliar imagen de ${product.name}">
        <div class="gallery__ph"><i class="bi ${product.icon}"></i><span>Foto próximamente</span></div>
        <button type="button" class="gallery__nav gallery__nav--prev" id="galPrev" aria-label="Foto anterior"><i class="bi bi-chevron-left"></i></button>
        <button type="button" class="gallery__nav gallery__nav--next" id="galNext" aria-label="Foto siguiente"><i class="bi bi-chevron-right"></i></button>
      </div>
      <div class="gallery__thumbs">${thumbs}</div>
    </div>

    <div class="detail__info">
      <span class="pcard__tag ${product.hot ? 'pcard__tag--hot' : ''} detail__tag">${product.tag}</span>
      <h1 class="detail__title">${product.name}</h1>
      <p class="detail__desc">${product.desc}</p>

      ${priceBlock}
      ${rentBlock}

      <ul class="spec-list">${specRows}</ul>

      <div class="detail__actions">
        <a class="btn btn--accent btn--block" href="${waLink}" target="_blank" rel="noopener">
          <i class="bi bi-whatsapp"></i> ${ctaLabel}
        </a>
        <a class="btn btn--ghost-dark btn--block" href="index.html#productos">Ver otros equipos</a>
      </div>
    </div>`;

  /* ----- Galería interactiva ----- */
  const imgs = product.images;
  let idx = 0;
  const galMain = document.getElementById('galMain');
  const galImg = document.getElementById('galImg');
  const thumbBtns = () => document.querySelectorAll('.gallery__thumb');

  galImg.addEventListener('error', () => galMain.classList.add('is-missing'));
  galImg.addEventListener('load', () => galMain.classList.remove('is-missing'));

  function show(i) {
    idx = (i + imgs.length) % imgs.length;
    galMain.classList.remove('is-missing');
    galImg.src = imgs[idx];
    const d = IMAGE_DIMS[imgs[idx]];
    if (d) { galImg.width = d[0]; galImg.height = d[1]; }
    thumbBtns().forEach((b, n) => {
      b.classList.toggle('is-active', n === idx);
      b.setAttribute('aria-pressed', String(n === idx));
    });
  }

  document.getElementById('galPrev').addEventListener('click', () => show(idx - 1));
  document.getElementById('galNext').addEventListener('click', () => show(idx + 1));
  thumbBtns().forEach(b =>
    b.addEventListener('click', () => show(Number(b.dataset.index)))
  );

  /* ----- Lightbox: ampliar la imagen (útil para leer la ficha técnica) ----- */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', `${product.name} — imagen ampliada`);
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="Cerrar imagen ampliada"><i class="bi bi-x-lg"></i></button>
    <div class="lightbox__scroll">
      <img class="lightbox__img" alt="${product.name} — imagen ampliada">
    </div>
    <span class="lightbox__hint">Tocá la imagen para acercar · Esc para cerrar</span>`;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('.lightbox__img');
  const lbScroll = lightbox.querySelector('.lightbox__scroll');
  const lbClose = lightbox.querySelector('.lightbox__close');
  let focoPrevio = null;

  function openLightbox() {
    focoPrevio = document.activeElement;
    lbImg.src = imgs[idx];
    lightbox.classList.remove('is-zoomed');
    lightbox.hidden = false;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open', 'is-zoomed');
    lightbox.hidden = true;
    document.body.style.overflow = '';
    /* Devolvemos el foco a donde estaba: si no, con teclado quedás al
       principio de la página cada vez que cerrás una foto. */
    if (focoPrevio && document.contains(focoPrevio)) focoPrevio.focus();
    focoPrevio = null;
  }

  galImg.addEventListener('click', openLightbox);
  /* La foto principal es alcanzable con Tab (role="button"), así que también
     tiene que abrirse con Enter o Espacio. */
  galImg.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(); }
  });
  lbClose.addEventListener('click', closeLightbox);
  lbScroll.addEventListener('click', e => { if (e.target === lbScroll) closeLightbox(); });
  lbImg.addEventListener('click', e => {
    e.stopPropagation();
    lightbox.classList.toggle('is-zoomed');
    lbScroll.scrollTop = 0;
  });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') { closeLightbox(); return; }
    /* Mientras está abierto, el foco no se escapa al fondo de la página. */
    if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); }
  });
}

/* ===== Menú móvil ===== */
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
function setNav(abierto) {
  nav.classList.toggle('is-open', abierto);
  toggle.classList.toggle('is-open', abierto);
  toggle.setAttribute('aria-expanded', String(abierto));
  toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
}
toggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
/* Los links del menú navegan a index.html, pero en el caso del ancla de la
   misma página el menú quedaba abierto tapando todo. */
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));

/* ===== Header shadow al hacer scroll ===== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
}, { passive: true });

/* ===== Año footer ===== */
document.getElementById('year').textContent = new Date().getFullYear();
