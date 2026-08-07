# GRADIN · Sitio de maquinaria

Sitio estático: HTML, CSS y JavaScript sin frameworks ni dependencias.

## Editar el catálogo

**Todos los datos de los equipos viven en un solo archivo: `products.js`.**
Precios, cuotas, especificaciones, fotos y marcas salen de ahí — el catálogo de
la home, el `<select>` del formulario de contacto y las fichas de producto se
arman con esos datos, así que no hay que tocar nada en dos lugares.

Después de editar `products.js` hay que **regenerar las fichas**:

```bash
node build.mjs
```

Eso escribe un HTML completo por equipo en `maquinaria/<slug>/index.html` y
actualiza `sitemap.xml`. **Si no lo corrés, las fichas quedan con los datos
viejos.** No hace falta instalar nada: usa sólo módulos nativos de Node.

Para agregar un equipo nuevo: sumalo a `PRODUCTS` con un `slug`, agregá las
medidas de sus fotos en `IMAGE_DIMS` y corré el build.

> El `slug` define la URL pública (`/maquinaria/<slug>/`). Una vez que el sitio
> está publicado **no conviene cambiarlo**: rompe los enlaces que ya circulan y
> lo que Google tenga indexado.

## Ver el sitio en local

```bash
npx serve
```

Queda en <http://localhost:3000>. La config de `serve.json` es sólo para
desarrollo; GitHub Pages no la usa.

## Cómo está organizado

| Archivo | Qué hace |
|---|---|
| `products.js` | Catálogo. **La única fuente de datos.** |
| `build.mjs` | Genera las fichas y el sitemap desde el catálogo. |
| `index.html` + `script.js` | Home: grilla, filtros por marca, formulario. |
| `producto.html` + `producto.js` | Redirige los enlaces viejos `?id=` a la URL nueva. Es además la plantilla del build. |
| `ficha.js` | Interactividad de las fichas (galería y lightbox). |
| `maquinaria/` | **Generado por `build.mjs` — no editar a mano.** |
| `styles.css` | Estilos de todo el sitio. |

### Por qué las fichas se generan y no se arman con JS

WhatsApp, Bing y los crawlers de IA no ejecutan JavaScript. Cuando las fichas se
armaban en el navegador, esos clientes veían las 10 páginas idénticas y vacías:
cada link de producto compartido por WhatsApp mostraba el mismo título genérico.
Generándolas, el contenido ya viaja en el HTML.

## Pendiente

- El `<link>` a Bootstrap Icons (jsDelivr) no tiene `integrity`. Para calcularlo:
  ```bash
  curl -s https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css \
    | openssl dgst -sha384 -binary | openssl base64 -A
  ```
  Va como `integrity="sha384-..." crossorigin="anonymous"` en `index.html`,
  `producto.html` y `404.html` (las fichas lo heredan al regenerarse).
- Cabeceras de seguridad (CSP, `Referrer-Policy`, HSTS): dependen del hosting.
