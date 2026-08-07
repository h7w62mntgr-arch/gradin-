/* ===== Interactividad de la ficha de producto =====
   El contenido de la ficha ya viene en el HTML (lo genera build.mjs), así que
   acá no se arma nada: sólo se enganchan la galería y el lightbox.

   La lista de fotos se lee de las miniaturas del propio DOM, no de PRODUCTS.
   Por eso estas páginas no necesitan cargar products.js.                  */

/* ===== Galería ===== */
const galMain = document.getElementById('galMain');
const galImg = document.getElementById('galImg');

if (galMain && galImg) {
  const thumbBtns = [...document.querySelectorAll('.gallery__thumb')];
  const imgs = thumbBtns.map(b => b.querySelector('img').getAttribute('src'));
  let idx = 0;

  galImg.addEventListener('error', () => galMain.classList.add('is-missing'));
  galImg.addEventListener('load', () => galMain.classList.remove('is-missing'));

  function show(i) {
    idx = (i + imgs.length) % imgs.length;
    galMain.classList.remove('is-missing');
    galImg.src = imgs[idx];
    thumbBtns.forEach((b, n) => {
      b.classList.toggle('is-active', n === idx);
      b.setAttribute('aria-pressed', String(n === idx));
    });
  }

  document.getElementById('galPrev').addEventListener('click', () => show(idx - 1));
  document.getElementById('galNext').addEventListener('click', () => show(idx + 1));
  thumbBtns.forEach(b => b.addEventListener('click', () => show(Number(b.dataset.index))));

  /* ===== Lightbox: ampliar la imagen (útil para leer la ficha técnica) ===== */
  const titulo = document.querySelector('.detail__title')?.textContent.trim() || 'Imagen';
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', `${titulo} — imagen ampliada`);
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="Cerrar imagen ampliada"><i class="bi bi-x-lg"></i></button>
    <div class="lightbox__scroll">
      <img class="lightbox__img" alt="${titulo} — imagen ampliada">
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
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));

/* ===== Header shadow al hacer scroll ===== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
}, { passive: true });

/* ===== Año footer ===== */
document.getElementById('year').textContent = new Date().getFullYear();
