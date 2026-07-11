/* ===== Catálogo de maquinaria =====
   Los datos viven en products.js (PRODUCTS). Cada tarjeta es un enlace
   a la página de detalle producto.html?id=<id>.                        */
const grid = document.getElementById('productGrid');
let mode = 'venta';

function render() {
  grid.innerHTML = PRODUCTS.map((p, i) => {
    const isVenta = mode === 'venta';
    let priceHTML, subHTML;
    if (isVenta) {
      priceHTML = p.precio
        ? `USD ${p.precio} <small>+IVA</small>`
        : `Consultar <small>precio</small>`;
      subHTML = p.precio
        ? `Financiación propia: entregás 50% + hasta ${p.cuotasMax} cuotas de USD ${p.cuota}`
        : 'Escribinos por precio y financiación';
    } else {
      priceHTML = p.alquiler
        ? `USD ${p.alquiler} <small>/ día</small>`
        : `Consultar <small>alquiler</small>`;
      subHTML = 'Alquiler con entrega incluida';
    }
    return `
      <a class="pcard pcard--link" href="producto.html?id=${p.id}" style="animation-delay:${i * 60}ms">
        <div class="pcard__img pcard__img--photo">
          <img src="${p.images[0]}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
          <i class="bi ${p.icon} pcard__img-ph"></i>
        </div>
        <h3>${p.name}</h3>
        <p class="pcard__price">${priceHTML}</p>
        <p class="pcard__sub">${subHTML}</p>
        <div class="pcard__specs">${p.cardSpecs.map(s => `<span><i class="bi ${s[0]}"></i> ${s[1]}</span>`).join('')}</div>
        <span class="pcard__cta">Ver detalles y fotos →</span>
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
