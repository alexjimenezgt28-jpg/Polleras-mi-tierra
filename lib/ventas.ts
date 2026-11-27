import type { ArticuloCatalogo } from "@/lib/catalogo";

export const CATEGORIAS_VENTA = [
  "Camisa",
  "Falda",
  "Enagua",
  "Rebozo",
  "Vestido",
  "Pollera",
] as const;

export const NOTA_VENTAS =
  "Solo prendas para vestir; no incluimos tembleques, joyero ni zapatos.";

export type PrendaVenta = ArticuloCatalogo & {
  descripcion: string;
  precio: number;
  imagenUrl: string | null;
};

export const prendasVenta: PrendaVenta[] = [
  {
    id: "camisa-santena",
    nombre: "Camisa bordada santeña",
    categoria: "Camisa",
    talla: "M",
    color: "Blanco y rojo",
    descripcion: "Camisa de hilo con bordado floral a mano y mangas amplias.",
    estilo: "Guararé",
    precio: 85,
    imagenUrl: "/polleras/gala-roja.png",
  },
  {
    id: "falda-gala",
    nombre: "Falda de gala marfil",
    categoria: "Falda",
    talla: "S",
    color: "Marfil y dorado",
    descripcion: "Falda de vuelo generoso con cinta de satén y remate en encaje.",
    estilo: "Lujo",
    precio: 120,
    imagenUrl: "/polleras/fiesta-dorada.png",
  },
  {
    id: "enagua-encaje",
    nombre: "Enagua de encaje",
    categoria: "Enagua",
    talla: "M",
    color: "Blanco y crema",
    descripcion: "Enagua interior de algodón con trencilla de mundillo en el borde.",
    estilo: "Blanca",
    precio: 65,
    imagenUrl: "/polleras/encaje-azul.png",
  },
  {
    id: "rebozo-hilo",
    nombre: "Rebozo de hilo",
    categoria: "Rebozo",
    talla: "L",
    color: "Crema y rosado",
    descripcion: "Rebozo ligero de hilo con flecos tejidos a mano.",
    estilo: "Coquito",
    precio: 45,
    imagenUrl: "/polleras/diario-verde.png",
  },
  {
    id: "vestido-organza",
    nombre: "Vestido de organza",
    categoria: "Vestido",
    talla: "S",
    color: "Amarillo y crema",
    descripcion: "Vestido fresco de organza con arandelas rematadas en encaje.",
    estilo: "Organza",
    precio: 150,
    imagenUrl: "/polleras/fiesta-dorada.png",
  },
  {
    id: "basquina-chiricana",
    nombre: "Basquiña chiricana",
    categoria: "Vestido",
    talla: "M",
    color: "Multicolor",
    descripcion: "Basquiña de tela estampada con vuelo amplio para presentaciones.",
    estilo: "Chiriquí",
    precio: 140,
    imagenUrl: "/polleras/fiesta-dorada.png",
  },
  {
    id: "pollera-coquito-venta",
    nombre: "Pollera de coquito en venta",
    categoria: "Pollera",
    talla: "S",
    color: "Azul y blanco",
    descripcion: "Pollera con calados finos, lista para usar en eventos folclóricos.",
    estilo: "Coquito",
    precio: 210,
    imagenUrl: "/polleras/encaje-azul.png",
  },
  {
    id: "pollera-blanca-venta",
    nombre: "Pollera blanca de novia en venta",
    categoria: "Pollera",
    talla: "M",
    color: "Blanco y perla",
    descripcion: "Conjunto blanco con trencillas de mundillo y caída elegante.",
    estilo: "Blanca",
    precio: 320,
    imagenUrl: "/polleras/encaje-azul.png",
  },
  {
    id: "camisa-diario",
    nombre: "Camisa de diario",
    categoria: "Camisa",
    talla: "L",
    color: "Verde y crema",
    descripcion: "Camisa sencilla y cómoda para el día a día o sesiones de fotos.",
    estilo: "Montuna",
    precio: 55,
    imagenUrl: "/polleras/diario-verde.png",
  },
  {
    id: "pollera-chorrerana-venta",
    nombre: "Pollera chorrerana en venta",
    categoria: "Pollera",
    talla: "M",
    color: "Dorado y blanco",
    descripcion: "Sobrepuesto de percal con sombreado y calados a juego.",
    estilo: "Chorrerana",
    precio: 240,
    imagenUrl: "/polleras/fiesta-dorada.png",
  },
];
