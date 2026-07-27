/* ===== Catálogo de maquinaria =====
   Los datos viven en products.js (PRODUCTS). Cada tarjeta es un enlace
   a la página de detalle producto.html?id=<id>.                        */
const grid = document.getElementById('productGrid');
const brandBar = document.getElementById('brandBar');
const brandStrip = document.getElementById('brandStrip');
const brandEmpty = document.getElementById('brandEmpty');
let mode = 'venta';
let brand = 'all';

/* ----- Marcas en el header (junto a GRADIN): cada logo filtra sus equipos ----- */
brandStrip.innerHTML = BRANDS.map(b => `
  <a href="#productos" class="brandstrip__logo ${b.pending ? 'is-pending' : ''}" data-brand="${b.id}" title="${b.pending ? b.name + ' — Próximamente' : 'Ver equipos ' + b.name}">
    <img src="${b.logo}" alt="${b.name}" onerror="this.style.display='none'">
    ${b.pending ? '<span class="brandstrip__soon">Próximamente</span>' : ''}
  </a>`).join('');

/* ----- Barra de filtro por marca (solo en modo Venta) ----- */
function renderBrandBar() {
  const chips = [{ id: 'all', name: 'Todas' }, ...BRANDS];
  brandBar.innerHTML = chips.map(b => `
    <button class="brandbar__chip ${brand === b.id ? 'is-active' : ''}" data-brand="${b.id}">${b.name}</button>`).join('');
}

function render() {
  const isVenta = mode === 'venta';
  brandBar.hidden = !isVenta;

  let list = isVenta
    ? PRODUCTS.filter(p => !p.ventaOculta)
    : PRODUCTS.filter(p => p.alquilerDia);

  if (isVenta && brand !== 'all') list = list.filter(p => p.brand === brand);

  renderBrandBar();

  /* Marca sin equipos (ej. TITAN pendiente) → estado “Próximamente” */
  if (isVenta && list.length === 0) {
    const b = BRANDS.find(x => x.id === brand);
    grid.innerHTML = '';
    brandEmpty.hidden = false;
    brandEmpty.innerHTML = `
      <i class="bi bi-hourglass-split"></i>
      <h3>${b ? b.name : 'Esta marca'} · Próximamente</h3>
      <p>Estamos sumando el catálogo de esta marca. Escribinos y te avisamos apenas esté disponible.</p>
      <a class="btn btn--accent" href="https://wa.me/${WPP_NEGOCIO}?text=${encodeURIComponent('Hola GRADIN, quiero info de los equipos ' + (b ? b.name : '') + ' cuando estén disponibles.')}" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i> Quiero que me avisen</a>`;
    return;
  }
  brandEmpty.hidden = true;

  grid.innerHTML = list.map((p, i) => {
    let priceHTML, subHTML, badge = '', cta = 'Ver detalles y fotos →';
    if (isVenta) {
      priceHTML = p.precio
        ? `USD ${p.precio} <small>+IVA</small>`
        : `Consultar <small>precio</small>`;
      if (p.soon) {
        badge = '<span class="pcard__soon"><i class="bi bi-hourglass-split"></i> Próximamente · Ya podés reservar</span>';
        subHTML = 'Próximo ingreso — reservá tu unidad';
        cta = 'Reservar / ver ficha →';
      } else if (p.precio) {
        subHTML = p.cuota
          ? `Financiación propia: entregás 50% + hasta ${p.cuotasMax} cuotas de USD ${p.cuota}`
          : 'Consultanos financiación y disponibilidad';
      } else {
        subHTML = 'Escribinos por precio y financiación';
      }
    } else {
      priceHTML = `USD ${p.alquilerDia} <small>+IVA / día</small>`;
      subHTML = `Semana USD ${p.alquilerSemana} +IVA · Cotizamos tu traslado`;
    }
    return `
      <a class="pcard pcard--link ${p.soon ? 'pcard--soon' : ''}" href="producto.html?id=${p.id}" style="animation-delay:${i * 60}ms">
        <div class="pcard__img pcard__img--photo">
          <img src="${p.images[0]}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
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

/* ===== Toggle venta / alquiler ===== */
document.getElementById('modeToggle').addEventListener('click', (e) => {
  const btn = e.target.closest('.toggle__btn');
  if (!btn || btn.classList.contains('is-active')) return;
  document.querySelectorAll('.toggle__btn').forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  mode = btn.dataset.mode;
  render();
});

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
  if (mode !== 'venta') {
    mode = 'venta';
    document.querySelectorAll('.toggle__btn').forEach(b =>
      b.classList.toggle('is-active', b.dataset.mode === 'venta'));
  }
  render();
});

/* ===== Menú móvil ===== */
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
toggle.addEventListener('click', () => {
  nav.classList.toggle('is-open');
  toggle.classList.toggle('is-open');
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle.classList.remove('is-open');
}));

/* ===== Header shadow al hacer scroll ===== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
}, { passive: true });

/* ===== Formulario → WhatsApp =====
   Arma un mensaje con los datos del formulario y abre WhatsApp hacia
   el número del negocio, listo para enviar.                          */
const form = document.getElementById('contactForm');
const WPP_NEGOCIO = '59897150208';
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

  const url = `https://wa.me/${WPP_NEGOCIO}?text=` + encodeURIComponent(lineas.join('\n'));
  window.open(url, '_blank', 'noopener');

  document.getElementById('formNote').hidden = false;
  form.reset();
});

/* ===== Año footer ===== */
document.getElementById('year').textContent = new Date().getFullYear();
