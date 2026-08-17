/* ===== Generador de las fichas de producto =====
   Lee el catálogo de products.js y escribe un HTML completo por equipo en
   maquinaria/<slug>/index.html, con el detalle, el title, la meta description
   y el JSON-LD ya resueltos. Antes todo eso lo armaba el navegador, así que
   quien no ejecuta JS (WhatsApp, Bing, los crawlers de IA) veía las 10 fichas
   iguales y vacías.

   Uso:  node build.mjs          genera las fichas y el sitemap
         node build.mjs --check  no escribe; falla si hay algo desactualizado
                                 (para CI, así no se puede olvidar de correrlo)

   No usa dependencias: sólo módulos nativos de Node.                      */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

/* fileURLToPath y no new URL().pathname: en Windows eso devuelve "/C:/Users/..."
   con la barra de más y termina armando rutas tipo "C:\C:\Users\...". */
const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const SITE_ORIGIN = 'https://gradinuruguay.com.uy';
const SOLO_VERIFICAR = process.argv.includes('--check');

/* products.js es JS plano sin exports: se evalúa en un sandbox y se leen
   las constantes con una expresión final (los `const` no quedan en el contexto). */
function leerCatalogo() {
  const src = fs.readFileSync(path.join(RAIZ, 'products.js'), 'utf8');
  return vm.runInContext(
    src + '\n;({ PRODUCTS, BRANDS, IMAGE_DIMS, WHATSAPP_NUMBER });',
    vm.createContext({})
  );
}

/* Corta en el último espacio antes del límite, para no partir una palabra. */
function recortar(texto, max = 155) {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max);
  const esp = corte.lastIndexOf(' ');
  return (esp > 0 ? corte.slice(0, esp) : corte).replace(/[.,;:]$/, '') + '…';
}

const escapar = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/* Las fichas viven dos niveles abajo (maquinaria/<slug>/), así que todas las
   rutas relativas del template tienen que subir dos niveles. Se hace por
   reescritura y no con <base>, para que el sitio siga funcionando tanto en la
   raíz de un dominio como en un subdirectorio (github.io/gradin-/). */
const SUBIR = '../../';
function reescribirRutas(html) {
  return html
    .replace(/(href|src)="\.\/(assets\/)/g, `$1="${SUBIR}$2`)
    .replace(/(href|src)="(assets\/|styles\.css|products\.js|producto\.js|ficha\.js)/g, `$1="${SUBIR}$2`)
    /* Se enlaza al directorio y no a index.html: si el host reescribe URLs
       limpias, /gradin-/index.html queda como /gradin- (sin barra final) y las
       rutas relativas pasan a resolverse contra la raíz. */
    .replace(/(href|src)="\.\/#/g, `$1="${SUBIR}#`)
    .replace(/href="\.\/"/g, `href="${SUBIR}"`);
}

function bloqueDetalle(p, IMAGE_DIMS) {
  const dim = (src) => {
    const d = IMAGE_DIMS[src];
    return d ? ` width="${d[0]}" height="${d[1]}"` : '';
  };
  const img = (src) => SUBIR + src;

  const thumbs = p.images.map((src, i) => `
        <button type="button" class="gallery__thumb ${i === 0 ? 'is-active' : ''}" data-index="${i}" aria-label="Ver foto ${i + 1} de ${p.images.length}" aria-pressed="${i === 0}">
          <img src="${img(src)}" alt="${escapar(p.name)} — foto ${i + 1}"${dim(src)} loading="lazy" decoding="async" onerror="this.style.display='none'">
          <i class="bi ${p.icon}"></i>
        </button>`).join('');

  const specRows = p.specs.map((s) => `
          <li class="spec">
            <span class="spec__label"><i class="bi ${s[0]}"></i> ${escapar(s[1])}</span>
            <span class="spec__value">${escapar(s[2])}</span>
          </li>`).join('');

  let priceBlock = '';
  if (p.precio) {
    const financeBlock = p.soon ? `
          <div class="detail__finance">
            <p class="detail__finance-title"><i class="bi bi-hourglass-split"></i> Próximamente · ya podés reservar</p>
            <ul>
              <li>Reservá tu unidad con seña y coordinás el resto al ingreso del equipo.</li>
            </ul>
          </div>` : (p.cuota ? `
          <div class="detail__finance">
            <p class="detail__finance-title"><i class="bi bi-credit-card-2-front-fill"></i> Financiación de la casa</p>
            <ul>
              <li>Entregás el <strong>50%</strong>: USD ${p.entrega} + IVA</li>
              <li>El resto en <strong>hasta ${p.cuotasMax} cuotas</strong> de <strong>USD ${p.cuota}</strong> + IVA</li>
            </ul>
          </div>` : '');
    priceBlock = `
        <div class="detail__price">
          <div class="detail__price-row">
            <span class="detail__price-big">USD ${p.precio}</span>
            <small>+ IVA · ${p.soon ? 'precio de reserva' : 'precio contado'}</small>
          </div>${financeBlock}
        </div>`;
  } else {
    priceBlock = `
        <div class="detail__price">
          <div class="detail__price-row">
            <span class="detail__price-big">Consultá el precio</span>
          </div>
          <div class="detail__price-alt">Escribinos por WhatsApp y te pasamos precio y opciones de financiación.</div>
        </div>`;
  }
  return { thumbs, specRows, priceBlock, img, dim };
}

function generarFicha(p, datos, template) {
  const { BRANDS, IMAGE_DIMS, WHATSAPP_NUMBER } = datos;
  const { thumbs, specRows, priceBlock, img, dim } = bloqueDetalle(p, IMAGE_DIMS);
  const marca = BRANDS.find((b) => b.id === p.brand);
  const url = `${SITE_ORIGIN}/maquinaria/${p.slug}/`;

  const waText = encodeURIComponent(p.soon
    ? `Hola GRADIN, quiero reservar la ${p.name} (próximo ingreso). ¿Cómo hago la reserva?`
    : `Hola GRADIN, me interesa la ${p.name}. ¿Me pasás precio y disponibilidad?`);
  const ctaLabel = p.soon ? 'Reservar por WhatsApp' : 'Consultar por WhatsApp';

  const detalle = `
      <div class="detail__gallery">
        <div class="gallery__main" id="galMain">
          <img id="galImg" src="${img(p.images[0])}" alt="${escapar(p.name)}"${dim(p.images[0])} fetchpriority="high"
               tabindex="0" role="button" aria-label="Ampliar imagen de ${escapar(p.name)}">
          <div class="gallery__ph"><i class="bi ${p.icon}"></i><span>Foto próximamente</span></div>
          <button type="button" class="gallery__nav gallery__nav--prev" id="galPrev" aria-label="Foto anterior"><i class="bi bi-chevron-left"></i></button>
          <button type="button" class="gallery__nav gallery__nav--next" id="galNext" aria-label="Foto siguiente"><i class="bi bi-chevron-right"></i></button>
        </div>
        <div class="gallery__thumbs">${thumbs}
        </div>
      </div>

      <div class="detail__info">
        <span class="pcard__tag ${p.hot ? 'pcard__tag--hot' : ''} detail__tag">${escapar(p.tag)}</span>
        <h1 class="detail__title">${escapar(p.name)}</h1>
        <p class="detail__desc">${escapar(p.desc)}</p>
${priceBlock}
        <ul class="spec-list">${specRows}
        </ul>

        <div class="detail__actions">
          <a class="btn btn--accent btn--block" href="https://wa.me/${WHATSAPP_NUMBER}?text=${waText}" target="_blank" rel="noopener">
            <i class="bi bi-whatsapp"></i> ${ctaLabel}
          </a>
          <a class="btn btn--ghost-dark btn--block" href="${SUBIR}#productos">Ver otros equipos</a>
        </div>
      </div>`;

  /* ----- Datos estructurados ----- */
  const producto = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.desc,
    sku: p.id,
    image: p.images.map((s) => `${SITE_ORIGIN}/${s}`),
    brand: { '@type': 'Brand', name: marca ? marca.name : 'GRADIN' },
    additionalProperty: p.specs.map((s) => ({ '@type': 'PropertyValue', name: s[1], value: s[2] })),
  };
  /* Sin precio publicado no va Offer: Google necesita un valor concreto. */
  if (p.precio) {
    producto.offers = {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: Number(p.precio.replace(/\./g, '')),
      availability: p.soon ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'GRADIN' },
    };
  }
  const migas = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Maquinaria', item: `${SITE_ORIGIN}/#productos` },
      { '@type': 'ListItem', position: 3, name: p.name, item: url },
    ],
  };

  /* ----- Open Graph -----
     Es lo único que leen WhatsApp, Facebook y LinkedIn para armar el preview
     del link: no ejecutan JS, así que tiene que estar resuelto en el HTML.
     Va la foto del equipo, no la imagen genérica, para que al compartir una
     ficha se vea la máquina. Sin width/height: no son 1200×630 y cada
     plataforma las mide sola. */
  const ogDesc = escapar(recortar(p.desc, 200));
  const ogImagen = `${SITE_ORIGIN}/${p.images[0]}`;
  const og = `  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="GRADIN" />
  <meta property="og:locale" content="es_UY" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="GRADIN · ${escapar(p.name)}" />
  <meta property="og:description" content="${ogDesc}" />
  <meta property="og:image" content="${ogImagen}" />
  <meta property="og:image:alt" content="${escapar(p.name)}" />
  <meta name="twitter:card" content="summary_large_image" />`;

  const cabeza = `  <link rel="canonical" href="${url}" />

${og}

  <script type="application/ld+json">
${JSON.stringify(producto, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(migas, null, 2)}
  </script>`;

  return reescribirRutas(template)
    .replace('<title>GRADIN · Detalle de maquinaria</title>', `<title>GRADIN · ${escapar(p.name)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapar(recortar(p.desc))}" />`)
    .replace(/  <!-- El canonical[\s\S]*?<!-- fin cabecera dinámica -->/, cabeza)
    .replace('<div class="detail" id="detail"><!-- JS render --></div>',
      `<div class="detail" id="detail" data-product="${p.id}">${detalle}\n      </div>`)
    /* La ficha generada no necesita el catálogo: ficha.js lee las fotos del
       propio DOM. Se ahorra la descarga y el parseo de products.js. */
    .replace(`  <script src="${SUBIR}products.js"></script>\n`, '')
    .replace(`<script src="${SUBIR}producto.js"></script>`, `<script src="${SUBIR}ficha.js"></script>`)
    /* producto.html lleva noindex por ser sólo un redirector; las fichas no. */
    .replace(/  <!-- Redirector de enlaces viejos[\s\S]*?<meta name="robots"[^>]*>\n/, '');
}

function generarSitemap(PRODUCTS) {
  const hoy = new Date().toISOString().slice(0, 10);
  const url = (loc, prio, freq) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${hoy}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url(`${SITE_ORIGIN}/`, '1.0', 'weekly')}
${PRODUCTS.map((p) => url(`${SITE_ORIGIN}/maquinaria/${p.slug}/`, p.soon ? '0.6' : '0.8', 'monthly')).join('\n')}
</urlset>
`;
}

/* ===== Main ===== */
/* Todo se normaliza a LF antes de tocarlo. En Windows git hace checkout con
   CRLF, y las expresiones de generarFicha() buscan "\n": sin esto no matchean
   y se cuelan en la ficha cosas que había que sacar (el noindex del
   redirector, el <script> de products.js). Además garantiza que el archivo
   generado sea byte a byte igual en Windows y en el CI, que corre --check. */
const aLF = (s) => s.replace(/\r\n/g, '\n');

const datos = leerCatalogo();
const template = aLF(fs.readFileSync(path.join(RAIZ, 'producto.html'), 'utf8'));
const salidas = new Map();

for (const p of datos.PRODUCTS) {
  if (!p.slug) throw new Error(`El producto "${p.id}" no tiene slug: no se puede generar su URL.`);
  salidas.set(path.join('maquinaria', p.slug, 'index.html'), generarFicha(p, datos, template));
}
salidas.set('sitemap.xml', generarSitemap(datos.PRODUCTS));

let desactualizados = 0;
for (const [rel, contenido] of salidas) {
  const abs = path.join(RAIZ, rel);
  const actual = fs.existsSync(abs) ? aLF(fs.readFileSync(abs, 'utf8')) : null;
  if (actual === contenido) continue;
  desactualizados++;
  if (SOLO_VERIFICAR) {
    console.error(`  desactualizado: ${rel}`);
  } else {
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, contenido);
    console.log(`  ${actual === null ? 'creado ' : 'actualizado'}  ${rel}`);
  }
}

if (SOLO_VERIFICAR && desactualizados) {
  console.error(`\n${desactualizados} archivo(s) desactualizado(s). Corré: node build.mjs`);
  process.exit(1);
}
console.log(SOLO_VERIFICAR
  ? `Todo al día (${salidas.size} archivos verificados).`
  : `Listo: ${salidas.size} archivos, ${desactualizados} con cambios.`);
