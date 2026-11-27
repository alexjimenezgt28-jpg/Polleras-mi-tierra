export type Pollera = {
  id: string;
  nombre: string;
  talla: string;
  color: string;
  descripcion: string;
  precioSola: number;
  precioCombo: number;
  imagenUrl: string | null;
  fechasOcupadas: string[];
};

export const polleras: Pollera[] = [
  {
    id: "gala-roja",
    nombre: "Pollera de gala roja",
    talla: "M",
    color: "Rojo y blanco",
    descripcion: "Bordado floral, falda amplia y manto a juego. Ideal para fiestas formales.",
    precioSola: 45,
    precioCombo: 70,
    imagenUrl: "/polleras/gala-roja.png",
    fechasOcupadas: ["2026-11-28", "2026-12-05"],
  },
  {
    id: "encaje-azul",
    nombre: "Pollera de encaje azul",
    talla: "S",
    color: "Azul y crema",
    descripcion: "Encaje delicado y toque de seda. Muy liviana para eventos de día.",
    precioSola: 40,
    precioCombo: 65,
    imagenUrl: "/polleras/encaje-azul.png",
    fechasOcupadas: ["2026-11-29"],
  },
  {
    id: "fiesta-dorada",
    nombre: "Pollera de fiesta dorada",
    talla: "L",
    color: "Dorado y marfil",
    descripcion: "Brillo discreto, vuelo generoso y cinta de satén. Para ocasiones especiales.",
    precioSola: 55,
    precioCombo: 85,
    imagenUrl: "/polleras/fiesta-dorada.png",
    fechasOcupadas: ["2026-12-02", "2026-12-12"],
  },
  {
    id: "diario-verde",
    nombre: "Pollera de diario verde",
    talla: "M",
    color: "Verde y blanco",
    descripcion: "Diseño sencillo y cómodo, perfecta para sesiones de fotos y pruebas.",
    precioSola: 35,
    precioCombo: 60,
    imagenUrl: "/polleras/diario-verde.png",
    fechasOcupadas: ["2026-12-01"],
  },
];
