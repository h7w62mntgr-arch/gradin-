/* ===== Catálogo de maquinaria =====
   Los datos viven en products.js (PRODUCTS). Cada tarjeta es un enlace
   a su ficha estática en maquinaria/<slug>/ (la genera build.mjs).     */
const grid = document.getElementById('productGrid');
const brandBar = document.getElementById('brandBar');
const brandStrip = document.getElementById('brandStrip');
const brandEmpty = document.getElementById('brandEmpty');
let brand = 'all';

/* ----- Marcas en el header (junto a GRADIN): cada logo filtra sus equipos ----- */
brandStrip.innerHTML = BRANDS.map(b => `
  <a href="#productos" class="brandstrip__logo ${b.pending ? 'is-pending' : ''}" data-brand="${b.id}" title="${b.pending ? b.name + ' — Próximamente' : 'Ver equipos ' + b.name}">
    <img src="${b.logo}" alt="${b.name}" width="${b.w}" height="${b.h}" onerror="this.style.display='none'">
    ${b.pending ? '<span class="brandstrip__soon">Próximamente</span>' : ''}
  </a>`).join('');

/* ----- Barra de filtro por marca ----- */
function renderBrandBar() {
  const chips = [{ id: 'all', name: 'Todas' }, ...BRANDS];
  brandBar.innerHTML = chips.map(b => `
    <button type="button" class="brandbar__chip ${brand === b.id ? 'is-active' : ''}" data-brand="${b.id}" aria-pressed="${brand === b.id}">${b.name}</button>`).join('');
}

/* ----- Textos de una tarjeta -----
   Lo usan tanto la grilla como la tarjeta destacada del hero, así los
   precios nunca pueden quedar desfasados entre una y otra.            */
function cardCopy(p) {
  const priceHTML = p.precio
    ? `USD ${p.precio} <small>+IVA</small>`
    : 'Consultar <small>precio</small>';

  if (p.soon) {
    return {
      priceHTML,
      subHTML: 'Próximo ingreso — reservá tu unidad',
      badge: '<span class="pcard__soon"><i class="bi bi-hourglass-split"></i> Próximamente · Ya podés reservar</span>',
      cta: 'Reservar / ver ficha →',
    };
  }
  let subHTML;
  if (!p.precio) {
    subHTML = 'Escribinos por precio y financiación';
  } else if (p.cuota) {
    subHTML = `Financiación propia: entregás 50% + hasta ${p.cuotasMax} cuotas de USD ${p.cuota} +IVA`;
  } else {
    subHTML = 'Consultanos financiación y disponibilidad';
  }
  return { priceHTML, subHTML, badge: '', cta: 'Ver detalles y fotos →' };
}

/* width/height reales de una foto, para que el navegador reserve el espacio. */
function dimsAttr(src) {
  const d = IMAGE_DIMS[src];
  return d ? ` width="${d[0]}" height="${d[1]}"` : '';
}

function render() {
  let list = PRODUCTS;
  if (brand !== 'all') list = list.filter(p => p.brand === brand);

  renderBrandBar();

  /* Marca sin equipos (ej. TITAN pendiente) → estado “Próximamente” */
  if (list.length === 0) {
    const b = BRANDS.find(x => x.id === brand);
    grid.innerHTML = '';
    brandEmpty.hidden = false;
    brandEmpty.innerHTML = `
      <i class="bi bi-hourglass-split"></i>
      <h3>${b ? b.name : 'Esta marca'} · Próximamente</h3>
      <p>Estamos sumando el catálogo de esta marca. Escribinos y te avisamos apenas esté disponible.</p>
      <a class="btn btn--accent" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola GRADIN, quiero info de los equipos ' + (b ? b.name : '') + ' cuando estén disponibles.')}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> Quiero que me avisen</a>`;
    return;
  }
  brandEmpty.hidden = true;

  grid.innerHTML = list.map((p, i) => {
    const { priceHTML, subHTML, badge, cta } = cardCopy(p);
    return `
      <a class="pcard pcard--link ${p.soon ? 'pcard--soon' : ''}" href="maquinaria/${p.slug}/" style="animation-delay:${i * 60}ms">
        <div class="pcard__img pcard__img--photo">
          <img src="${p.images[0]}" alt="${p.name}"${dimsAttr(p.images[0])} loading="lazy" decoding="async" onerror="this.style.display='none'">
          <i class="bi ${p.icon} pcard__img-ph"></i>
        </div>
        ${badge}
        <h3>${p.name}</h3>
        <p class="pcard__price">${priceHTML}</p>
        <p class="pcard__sub">${subHTML}</p>
        <div class="pcard__specs">${p.cardSpecs.map(s => `<span><i class="bi ${s[0]}"></i> ${s[1]}</span>`).join('')}</div>
        <span class="pcard__cta">${cta}</span>
      </a>`;
  }).join('');
}
render();

/* ===== Tarjeta destacada del hero =====
   El HTML de index.html ya trae el contenido (para buscadores y para que se
   vea sin esperar al JS); acá lo resincronizamos con PRODUCTS para que precio,
   cuota y specs no puedan quedar desfasados del catálogo.               */
function syncHeroCard() {
  const card = document.getElementById('heroCard');
  if (!card) return;
  const p = PRODUCTS.find(x => x.id === card.dataset.product);
  if (!p) return;

  const { priceHTML, subHTML } = cardCopy(p);
  card.href = `maquinaria/${p.slug}/`;
  card.querySelector('h3').textContent = p.name;
  card.querySelector('.pcard__price').innerHTML = priceHTML;
  card.querySelector('.pcard__sub').textContent = subHTML;
  card.querySelector('.pcard__specs').innerHTML =
    p.cardSpecs.map(s => `<span><i class="bi ${s[0]}"></i> ${s[1]}</span>`).join('');

  const img = card.querySelector('.pcard__img--photo img');
  if (img) {
    if (img.getAttribute('src') !== p.images[0]) img.src = p.images[0];
    img.alt = p.name;
    const d = IMAGE_DIMS[p.images[0]];
    if (d) { img.width = d[0]; img.height = d[1]; }
  }
  const ph = card.querySelector('.pcard__img-ph');
  if (ph) ph.className = `bi ${p.icon} pcard__img-ph`;
}
syncHeroCard();

/* ===== Opciones del formulario =====
   Se generan desde PRODUCTS para que la lista no se desincronice
   del catálogo cuando se agregan o sacan equipos.                */
function renderEquipoOptions() {
  const select = document.getElementById('equipo');
  if (!select) return;
  const sufijo = p => (p.soon ? ' (próximamente)' : '');
  const grupos = BRANDS
    .map(b => {
      const equipos = PRODUCTS.filter(p => p.brand === b.id);
      if (!equipos.length) return '';
      return `<optgroup label="${b.name}">${
        equipos.map(p => `<option>${p.name}${sufijo(p)}</option>`).join('')
      }</optgroup>`;
    })
    .join('');
  select.innerHTML = `${grupos}<option>Otro / No estoy seguro</option>`;
}
renderEquipoOptions();

/* ===== Filtro por marca (chips) ===== */
brandBar.addEventListener('click', (e) => {
  const btn = e.target.closest('.brandbar__chip');
  if (!btn) return;
  brand = btn.dataset.brand;
  render();
});

/* ===== Logos de marca del header → filtran esa marca ===== */
brandStrip.addEventListener('click', (e) => {
  const link = e.target.closest('.brandstrip__logo');
  if (!link) return;
  brand = link.dataset.brand;
  render();
});

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
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));

/* ===== Header shadow al hacer scroll ===== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
}, { passive: true });

/* ===== Formulario → WhatsApp =====
   Arma un mensaje con los datos del formulario y abre WhatsApp hacia
   el número del negocio, listo para enviar.                          */
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = form.nombre.value.trim();
  const tel = form.tel.value.trim();
  const equipo = form.equipo.value;
  const mensaje = form.mensaje.value.trim();

  const lineas = [
    'Hola GRADIN, quiero hacer una consulta:',
    '',
    `Nombre: ${nombre}`,
    `Teléfono: ${tel}`,
    `Equipo de interés: ${equipo}`,
  ];
  if (mensaje) lineas.push(`Mensaje: ${mensaje}`);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(lineas.join('\n'));
  window.open(url, '_blank', 'noopener');

  document.getElementById('formNote').hidden = false;
  form.reset();
});

/* ===== Año footer ===== */
document.getElementById('year').textContent = new Date().getFullYear();
