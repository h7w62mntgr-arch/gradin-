/* ===== Página de detalle de producto =====
   Lee ?id=<id> de la URL, busca el producto en PRODUCTS (products.js)
   y renderiza galería de fotos + especificaciones + botón WhatsApp.   */

const params = new URLSearchParams(location.search);
const product = PRODUCTS.find(p => p.id === params.get('id'));
const detail = document.getElementById('detail');

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

  const waText = encodeURIComponent(
    product.soon
      ? `Hola GRADIN, quiero reservar la ${product.name} (próximo ingreso). ¿Cómo hago la reserva?`
      : `Hola GRADIN, me interesa la ${product.name}. ¿Me pasás precio y disponibilidad?`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;
  const ctaLabel = product.soon ? 'Reservar por WhatsApp' : 'Consultar por WhatsApp';

  const thumbs = product.images.map((src, i) => `
    <button class="gallery__thumb ${i === 0 ? 'is-active' : ''}" data-index="${i}" aria-label="Foto ${i + 1}">
      <img src="${src}" alt="${product.name} — foto ${i + 1}" onerror="this.style.display='none'">
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
        <img id="galImg" src="${product.images[0]}" alt="${product.name}">
        <div class="gallery__ph"><i class="bi ${product.icon}"></i><span>Foto próximamente</span></div>
        <button class="gallery__nav gallery__nav--prev" id="galPrev" aria-label="Anterior"><i class="bi bi-chevron-left"></i></button>
        <button class="gallery__nav gallery__nav--next" id="galNext" aria-label="Siguiente"><i class="bi bi-chevron-right"></i></button>
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
    thumbBtns().forEach((b, n) => b.classList.toggle('is-active', n === idx));
  }

  document.getElementById('galPrev').addEventListener('click', () => show(idx - 1));
  document.getElementById('galNext').addEventListener('click', () => show(idx + 1));
  thumbBtns().forEach(b =>
    b.addEventListener('click', () => show(Number(b.dataset.index)))
  );
}

/* ===== Menú móvil ===== */
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
toggle.addEventListener('click', () => {
  nav.classList.toggle('is-open');
  toggle.classList.toggle('is-open');
});

/* ===== Header shadow al hacer scroll ===== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
}, { passive: true });

/* ===== Año footer ===== */
document.getElementById('year').textContent = new Date().getFullYear();
