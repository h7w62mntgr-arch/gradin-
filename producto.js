/* ===== producto.html?id=<id> → redirección a la URL definitiva =====
   Las fichas ahora son HTML estático en maquinaria/<slug>/ (las genera
   build.mjs). Esta página existe sólo para que los enlaces viejos con
   ?id= sigan funcionando; no debería quedar ninguno en el sitio.

   producto.html es además la plantilla que usa build.mjs, por eso conserva
   la estructura completa de header/footer.                                */

const params = new URLSearchParams(location.search);
const product = PRODUCTS.find(p => p.id === params.get('id'));

if (product) {
  /* replace() y no href: así el botón "atrás" no te devuelve al redirector. */
  location.replace(`maquinaria/${product.slug}/`);
} else {
  document.getElementById('detail').innerHTML = `
    <div class="detail__empty">
      <i class="bi bi-exclamation-triangle"></i>
      <h1>Producto no encontrado</h1>
      <p>El equipo que buscás no está disponible.</p>
      <a class="btn btn--primary" href="index.html#productos">Ver toda la maquinaria</a>
    </div>`;

  /* ===== Menú móvil ===== */
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const setNav = (abierto) => {
    nav.classList.toggle('is-open', abierto);
    toggle.classList.toggle('is-open', abierto);
    toggle.setAttribute('aria-expanded', String(abierto));
    toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  };
  toggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));

  document.getElementById('year').textContent = new Date().getFullYear();
}
