/* ===== Catálogo de maquinaria (fuente única de datos) =====
   Cada producto se muestra en el catálogo (index) y en su página de
   detalle (producto.html?id=<id>).

   FOTOS: colocá las imágenes en assets/productos/ con estos nombres.
   Mientras no existan, se muestra un placeholder automáticamente.        */

const PRODUCTS = [
  {
    id: 'unipersonal',
    brand: 'gradin',
    name: 'Plataforma Unipersonal',
    tag: 'Eléctrica',
    icon: 'bi-box-arrow-up',
    precio: '3.990',
    entrega: '1.995',
    cuotasMax: 12,
    cuota: '166',
    alquilerDia: '90',
    alquilerSemana: '300',
    desc: 'Plataforma de elevación vertical unipersonal, compacta y 100% eléctrica. Ideal para tareas de mantenimiento, montaje e instalación en altura dentro de espacios reducidos e interiores.',
    cardSpecs: [
      ['bi-arrows-expand', '10 m'],
      ['bi-box-seam', '130 kg'],
      ['bi-lightning-charge-fill', '220 V'],
    ],
    specs: [
      ['bi-arrows-expand', 'Altura de elevación', '10 m'],
      ['bi-arrows-fullscreen', 'Altura de trabajo', 'Hasta 12 m'],
      ['bi-box-seam', 'Carga nominal', '130 kg'],
      ['bi-rulers', 'Dimensión total', '1450 × 850 × 1980 mm'],
      ['bi-speedometer', 'Peso total', '450 kg'],
      ['bi-lightning-charge-fill', 'Alimentación', 'Eléctrica 220 V'],
      ['bi-patch-check-fill', 'Garantía', '6 meses por escrito'],
    ],
    images: [
      'assets/productos/unipersonal-1.jpg',
      'assets/productos/unipersonal-2.jpg',
      'assets/productos/unipersonal-3.jpg',
    ],
  },
  {
    id: 'bateria-9m',
    brand: 'gradin',
    name: 'Plataforma a Batería 11 m',
    tag: 'Caminar asistido',
    hot: true,
    icon: 'bi-battery-charging',
    precio: '7.990',
    entrega: '3.995',
    cuotasMax: 18,
    cuota: '222',
    alquilerDia: '100',
    alquilerSemana: '350',
    desc: 'Plataforma de tijera con desplazamiento a batería y caminar asistido. Incluye kit de elevación. Se mueve sin cables ni combustible, ideal para trabajos prolongados en interiores donde se necesita autonomía y bajo mantenimiento.',
    cardSpecs: [
      ['bi-arrows-expand', '11 m'],
      ['bi-box-seam', '500 kg'],
      ['bi-battery-charging', 'Batería'],
    ],
    specs: [
      ['bi-arrows-expand', 'Altura de elevación', '9 m'],
      ['bi-arrows-fullscreen', 'Altura de trabajo', 'Hasta 11 m'],
      ['bi-box-seam', 'Carga nominal', '500 kg'],
      ['bi-rulers', 'Dimensión total', '2016 × 1000 × 1535 mm'],
      ['bi-speedometer', 'Peso total', '1150 kg'],
      ['bi-battery-charging', 'Desplazamiento', 'Caminar asistido a batería'],
      ['bi-arrow-up-circle', 'Kit de elevación', 'Incluido'],
      ['bi-patch-check-fill', 'Garantía', '6 meses por escrito'],
    ],
    images: [
      'assets/productos/bateria-9m-1.jpg',
      'assets/productos/bateria-9m-2.jpg',
    ],
  },
  {
    id: 'manual-9m',
    brand: 'gradin',
    name: 'Plataforma Manual 11 m',
    tag: 'Única unidad',
    hot: true,
    icon: 'bi-layers-fill',
    precio: '5.490',
    entrega: '2.745',
    cuotasMax: 18,
    cuota: '153',
    desc: 'Plataforma de tijera con elevación eléctrica y desplazamiento manual. Amplia jaula de trabajo y gran capacidad de carga, pensada para obra e industria a un costo accesible.',
    cardSpecs: [
      ['bi-arrows-expand', '11 m'],
      ['bi-box-seam', '500 kg'],
      ['bi-lightning-charge-fill', '220 V'],
    ],
    specs: [
      ['bi-arrows-expand', 'Altura de elevación', '9 m'],
      ['bi-arrows-fullscreen', 'Altura de trabajo', 'Hasta 11 m'],
      ['bi-box-seam', 'Carga nominal', '500 kg'],
      ['bi-speedometer', 'Peso total', '1050 kg'],
      ['bi-bounding-box', 'Tamaño de la jaula', '2010 × 1130 mm'],
      ['bi-rulers', 'Dimensión total', '2016 × 1290 × 1560 mm'],
      ['bi-lightning-charge-fill', 'Funcionamiento', 'Eléctrico 220 V'],
      ['bi-hand-index-thumb', 'Desplazamiento', 'Manual'],
      ['bi-patch-check-fill', 'Garantía', '6 meses por escrito'],
    ],
    images: [
      'assets/productos/manual-9m-1.jpg',
      'assets/productos/manual-9m-2.jpg',
    ],
  },
  {
    id: 'boom-16m',
    brand: 'gradin',
    name: 'Plataforma Boom 16 m',
    tag: 'Oferta',
    hot: true,
    icon: 'bi-bezier2',
    precio: '14.990',
    entrega: '7.500',
    cuotasMax: 18,
    cuota: '416',
    desc: 'Brazo articulado con rotación de 360°, disponible en versión a nafta o eléctrica. Alcanza 16 m de altura de trabajo y sortea obstáculos gracias a su brazo articulado, ideal para exteriores y grandes alturas.',
    cardSpecs: [
      ['bi-arrows-expand', '16 m'],
      ['bi-box-seam', '200 kg'],
      ['bi-fuel-pump-fill', 'Nafta/Elec.'],
    ],
    specs: [
      ['bi-arrows-expand', 'Altura de elevación', '14 m'],
      ['bi-arrows-fullscreen', 'Altura de trabajo', '16 m'],
      ['bi-box-seam', 'Carga nominal', '200 kg'],
      ['bi-speedometer', 'Peso total', '2300 kg'],
      ['bi-arrow-repeat', 'Rotación', '360°'],
      ['bi-bezier2', 'Brazo', 'Articulado (opción)'],
      ['bi-fuel-pump-fill', 'Motorización', 'Nafta / Eléctrico'],
      ['bi-bounding-box', 'Tamaño de la jaula', '1200 × 800 mm'],
      ['bi-rulers', 'Dimensión total', '5200 × 1800 × 3050 mm'],
      ['bi-patch-check-fill', 'Garantía', '6 meses por escrito'],
    ],
    images: [
      'assets/productos/boom-16m-1.jpg',
      'assets/productos/boom-16m-2.jpg',
      'assets/productos/boom-16m-3.jpg',
    ],
  },
  {
    id: 'montacargas',
    brand: 'gradin',
    name: 'Montacargas 2.5 T',
    tag: 'Solo alquiler',
    icon: 'bi-truck',
    ventaOculta: true,
    alquilerDia: '120',
    alquilerSemana: '500',
    desc: 'Montacargas de 2,5 toneladas de capacidad y hasta 4,5 m de altura de elevación. Ideal para carga, descarga y movimiento de pallets y materiales pesados en obra, depósito e industria. Disponible para alquiler por día o por semana.',
    cardSpecs: [
      ['bi-arrows-expand', '4,5 m'],
      ['bi-box-seam', '2.500 kg'],
    ],
    specs: [
      ['bi-box-seam', 'Capacidad de carga', '2.500 kg (2,5 T)'],
      ['bi-arrows-expand', 'Altura de elevación', 'Hasta 4,5 m'],
      ['bi-patch-check-fill', 'Modalidad', 'Alquiler por día o semana'],
    ],
    images: [
      'assets/productos/montacargas-1.jpg',
      'assets/productos/montacargas-2.jpg',
    ],
  },

  /* ===== GRADIN · Próximamente (ya podés reservar) ===== */
  {
    id: 'andamio-electrico',
    brand: 'gradin',
    name: 'Andamio Eléctrico',
    tag: 'Próximamente',
    soon: true,
    icon: 'bi-building-up',
    precio: '1.750',
    desc: 'Andamio eléctrico de elevación vertical, compacto y fácil de trasladar. Ideal para tareas de mantenimiento, pintura e instalación en altura dentro de espacios reducidos. Próximo ingreso: ya podés reservar tu unidad.',
    cardSpecs: [
      ['bi-arrows-expand', '5 m'],
      ['bi-box-seam', '300 kg'],
    ],
    specs: [
      ['bi-arrows-fullscreen', 'Altura de trabajo', 'Hasta 5 m'],
      ['bi-box-seam', 'Carga nominal', '300 kg'],
      ['bi-speedometer', 'Peso del equipo', '180 kg'],
      ['bi-bounding-box', 'Superficie del mostrador', '1500 × 800 mm'],
      ['bi-rulers', 'Dimensiones externas', '1800 × 900 × 2230 mm'],
    ],
    images: [
      'assets/andamio-electrico.jpeg',
    ],
  },
  {
    id: 'autopropulsada-10m',
    brand: 'gradin',
    name: 'Plataforma Eléctrica Autopropulsada 10 m',
    tag: 'Próximamente',
    soon: true,
    icon: 'bi-truck-front',
    precio: '11.900',
    desc: 'Plataforma de tijera eléctrica autopropulsada de gran altura y capacidad. Se desplaza por sí sola, con amplia jaula de trabajo, pensada para obra e industria. Próximo ingreso: ya podés reservar tu unidad.',
    cardSpecs: [
      ['bi-arrows-expand', '10 m'],
      ['bi-box-seam', '450 kg'],
      ['bi-truck-front', 'Autopropulsada'],
    ],
    specs: [
      ['bi-arrows-fullscreen', 'Altura de trabajo', 'Hasta 10 m'],
      ['bi-truck-front', 'Desplazamiento', 'Autopropulsada'],
      ['bi-box-seam', 'Carga nominal', '450 kg'],
      ['bi-speedometer', 'Peso del equipo', '2350 kg'],
      ['bi-bounding-box', 'Plataforma de trabajo', '2.27 × 1.12 m'],
      ['bi-rulers', 'Dim. ext. (barandilla plegada)', '2.43 × 1.21 × 1.8 m'],
      ['bi-rulers', 'Dim. ext. (barandilla desplegada)', '2.43 × 1.21 × 2.35 m'],
    ],
    images: [
      'assets/plataforma-electrica-autopropulsada.jpeg',
    ],
  },
  {
    id: 'facilcarga-12m',
    brand: 'gradin',
    name: 'Plataforma Eléctrica Fácil Carga 12 m',
    tag: 'Próximamente',
    soon: true,
    icon: 'bi-box-arrow-up',
    precio: '6.400',
    desc: 'Plataforma de elevación vertical eléctrica con sistema de fácil carga. Alcanza 12 m de altura de trabajo, ideal para mantenimiento e instalaciones en altura. Próximo ingreso: ya podés reservar tu unidad.',
    cardSpecs: [
      ['bi-arrows-expand', '12 m'],
      ['bi-box-seam', '130 kg'],
    ],
    specs: [
      ['bi-arrows-fullscreen', 'Altura de trabajo', '12 m'],
      ['bi-box-seam', 'Carga nominal', '130 kg'],
      ['bi-rulers', 'Dimensión total', '1450 × 850 × 1980 mm'],
      ['bi-speedometer', 'Peso total', '450 kg'],
      ['bi-box-seam-fill', 'Característica', 'Fácil carga'],
    ],
    images: [
      'assets/plataforma-facilcarga-12m.jpeg',
      'assets/plataforma-facilcarga-12m-2.jpeg',
    ],
  },

  /* ===== HSY LIFT ===== */
  {
    id: 'hsylift-compacta',
    brand: 'hsylift',
    name: 'Plataforma Compacta 5.7 m',
    tag: 'HSY LIFT',
    icon: 'bi-layers',
    precio: '7.300',
    desc: 'Plataforma de tijera compacta y maniobrable (modelo SJYZM0406). Una sola persona puede empujarla, entra por pasillos estrechos y es apta para uso doméstico y comercial en interiores.',
    cardSpecs: [
      ['bi-arrows-expand', '5.7 m'],
      ['bi-box-seam', '240 kg'],
      ['bi-battery-charging', 'Batería'],
    ],
    specs: [
      ['bi-arrows-fullscreen', 'Altura de trabajo', 'Hasta 5.7 m'],
      ['bi-arrows-expand', 'Altura de plataforma', '3.7 m'],
      ['bi-box-seam', 'Capacidad de carga', '240 kg'],
      ['bi-rulers', 'Longitud total', '1.25 m'],
      ['bi-rulers', 'Ancho total', '0.85 m'],
      ['bi-arrows-collapse', 'Altura total (plegada)', '1.82 m'],
      ['bi-arrow-repeat', 'Radio de giro', '1.2 m'],
      ['bi-battery-charging', 'Batería / Cargador', '12 V 66 Ah / 12 V 65 Ah'],
    ],
    images: [
      'assets/plataforma-nopixeleada.jpeg',
      'assets/ficha-tijera-5,7m.jpeg',
    ],
  },
  {
    id: 'hsylift-articulada',
    brand: 'hsylift',
    name: 'Plataforma Articulada Remolcable 14 m',
    tag: 'HSY LIFT',
    icon: 'bi-bezier2',
    precio: '24.300',
    desc: 'Plataforma articulada remolcable con brazo de gran alcance y rotación de 360°. Motor Honda a nafta, estabilizadores y desplazamiento por remolque. Ideal para mantenimiento, instalaciones eléctricas, poda y trabajos en altura en exteriores.',
    cardSpecs: [
      ['bi-arrows-expand', '14 m'],
      ['bi-box-seam', '200 kg'],
      ['bi-fuel-pump-fill', 'Nafta'],
    ],
    specs: [
      ['bi-arrows-fullscreen', 'Altura de trabajo', '14 m'],
      ['bi-arrows-expand', 'Altura de plataforma', '12 m'],
      ['bi-box-seam', 'Carga nominal', '200 kg'],
      ['bi-arrow-repeat', 'Rotación', '360° continuo'],
      ['bi-arrows-collapse', 'Dimensiones plegado', '4.7 × 1.7 × 2.2 m'],
      ['bi-speedometer', 'Peso total', '1.950 kg'],
      ['bi-fuel-pump-fill', 'Motor', 'Honda GX630 · Nafta'],
    ],
    images: [
      'assets/articulada-hsylift.jpeg',
      'assets/ficha-tecncicaarticulada.jpeg',
    ],
  },
];

/* ===== Dimensiones reales de cada foto (ancho, alto) =====
   Se emiten como width/height en el <img> para que el navegador reserve
   el espacio antes de descargar la imagen y no salte el layout (CLS).
   Si agregás una foto nueva, sumá acá sus medidas.               */
const IMAGE_DIMS = {
  'assets/andamio-electrico.jpeg': [1180, 1333],
  'assets/articulada-hsylift.jpeg': [1288, 1221],
  'assets/ficha-tecncicaarticulada.jpeg': [1065, 1477],
  'assets/ficha-tijera-5,7m.jpeg': [1179, 1437],
  'assets/gradin.png': [600, 194],
  'assets/logo-hsylift.png': [1024, 1024],
  'assets/logo-titan.png': [896, 1195],
  'assets/plataforma-electrica-autopropulsada.jpeg': [1086, 1448],
  'assets/plataforma-facilcarga-12m-2.jpeg': [1086, 1448],
  'assets/plataforma-facilcarga-12m.jpeg': [1086, 1448],
  'assets/plataforma-nopixeleada.jpeg': [1055, 1491],
  'assets/productos/bateria-9m-1.jpg': [1179, 1710],
  'assets/productos/bateria-9m-2.jpg': [1179, 1520],
  'assets/productos/boom-16m-1.jpg': [1142, 1377],
  'assets/productos/boom-16m-2.jpg': [1179, 1484],
  'assets/productos/boom-16m-3.jpg': [1179, 1475],
  'assets/productos/manual-9m-1.jpg': [896, 1181],
  'assets/productos/manual-9m-2.jpg': [704, 1524],
  'assets/productos/montacargas-1.jpg': [1179, 1240],
  'assets/productos/montacargas-2.jpg': [1086, 1448],
  'assets/productos/unipersonal-1.jpg': [1265, 1243],
  'assets/productos/unipersonal-2.jpg': [928, 1144],
  'assets/productos/unipersonal-3.jpg': [1008, 1063],
};

/* ===== Marcas (se muestran junto a GRADIN; cada logo filtra sus equipos) =====
   pending: true → marca sin material aún, se muestra como “Próximamente”.
   w/h: dimensiones reales del archivo, para que el navegador reserve el
   espacio del logo antes de descargarlo (evita saltos de layout / CLS).   */
const BRANDS = [
  { id: 'gradin',  name: 'GRADIN',   logo: 'assets/gradin.png',       w: 600,  h: 194 },
  { id: 'titan',   name: 'TITAN',    logo: 'assets/logo-titan.png',   w: 896,  h: 1195 },
  { id: 'hsylift', name: 'HSY LIFT', logo: 'assets/logo-hsylift.png', w: 1024, h: 1024 },
];

const WHATSAPP_NUMBER = '59897150208';
