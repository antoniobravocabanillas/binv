export type Product = {
  slug: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  summary: string;
  description: string;
  specs: Record<string, string>;
  price?: number;
  badge: "Nuevo" | "Oferta" | "Destacado" | "Cotizar";
  availability: string;
  related: string[];
};

export const categories = [
  "Estaciones totales",
  "GPS / GNSS",
  "Niveles",
  "Drones",
  "Escaneres",
  "Software",
  "Accesorios",
  "Baterias",
  "Tripodes",
  "Prismas",
  "Alquiler",
  "Soporte / mantenimiento",
  "Capacitacion"
];

export const products: Product[] = [
  {
    slug: "estacion-total-robotica-rt500",
    name: "Estacion total robotica RT500",
    brand: "GeoMax Pro",
    model: "RT500 1\"",
    category: "Estaciones totales",
    summary: "Estacion robotica de alta precision para replanteo, control geometrico y obras de infraestructura.",
    description: "Instrumento de alto rendimiento para equipos que requieren productividad, precision angular y trazabilidad en campo. Ideal para obras viales, edificaciones, montaje industrial y control de deformaciones.",
    specs: {
      Precision: "1 segundo",
      Alcance: "Hasta 1,000 m sin prisma",
      Compensador: "Doble eje",
      Conectividad: "Bluetooth, Wi-Fi, USB",
      Proteccion: "IP65"
    },
    price: 18500,
    badge: "Destacado",
    availability: "Disponible bajo pedido",
    related: ["prisma-360-control", "tripode-carbono-tc90"]
  },
  {
    slug: "gnss-rtk-gx7",
    name: "Receptor GNSS RTK GX7",
    brand: "South Survey",
    model: "GX7",
    category: "GPS / GNSS",
    summary: "GNSS multiconstelacion con IMU para levantamientos, georreferenciacion y replanteos productivos.",
    description: "Solucion RTK para cuadrillas que necesitan velocidad, estabilidad de señal y compatibilidad con flujos CAD/GIS.",
    specs: {
      Canales: "1408",
      Constelaciones: "GPS, GLONASS, Galileo, BeiDou",
      IMU: "Inclinacion hasta 60 grados",
      Radio: "UHF interna",
      Autonomia: "Hasta 10 horas"
    },
    price: 9200,
    badge: "Nuevo",
    availability: "Stock limitado",
    related: ["controladora-rugged-c8", "capacitacion-gnss-rtk"]
  },
  {
    slug: "nivel-digital-precisio-dl2",
    name: "Nivel digital Precisio DL2",
    brand: "NivelTech",
    model: "DL2",
    category: "Niveles",
    summary: "Nivel digital para control altimetrico, redes de nivelacion y control de asentamientos.",
    description: "Equipo confiable para proyectos donde la altimetria exige repetibilidad, registro digital y reportes ordenados.",
    specs: {
      Precision: "0.7 mm/km",
      Aumento: "32x",
      Memoria: "30,000 lecturas",
      Proteccion: "IP54"
    },
    price: 3400,
    badge: "Oferta",
    availability: "En stock",
    related: ["mira-codigo-barras-3m", "tripode-aluminio-industrial"]
  },
  {
    slug: "estacion-total-leica-ts07-r500",
    name: "Estacion total Leica TS07 5\" R500",
    brand: "Leica Geosystems",
    model: "TS07 5\" R500",
    category: "Estaciones totales",
    summary: "Estacion total manual para mediciones topograficas de mediana y alta precision con pantalla tactil y memoria interna.",
    description: "Equipo recomendado para levantamiento, replanteo y control de obra cuando se requiere confiabilidad Leica, manejo eficiente y compatibilidad con flujos profesionales de campo.",
    specs: {
      Precision: "5 segundos",
      Pantalla: "3.5 pulgadas QVGA color tactil",
      Memoria: "2 GB Flash",
      Distancia: "R500 sin prisma",
      Energia: "Bateria Li-Ion GEB331"
    },
    badge: "Cotizar",
    availability: "Cotizacion especializada",
    related: ["tripode-aluminio-teodolito-topcon-tp110", "mini-prisma-leica-gmp111"]
  },
  {
    slug: "distanciometro-leica-disto-x4",
    name: "Distanciometro laser Leica DISTO X4",
    brand: "Leica Geosystems",
    model: "DISTO X4",
    category: "Accesorios",
    summary: "Medidor laser robusto con precision milimetrica, Bluetooth, zoom 4x y sensor de inclinacion 360 grados.",
    description: "Herramienta compacta para mediciones rapidas en obra, replanteo, interiores, superficies, volumenes y controles dimensionales.",
    specs: {
      Precision: "±1 mm",
      Rango: "0.05 m a 150 m",
      Pantalla: "Color de alta resolucion",
      Bluetooth: "v4.0",
      Inclinacion: "360 grados"
    },
    price: 680,
    badge: "Nuevo",
    availability: "Consultar stock",
    related: ["nivel-digital-precisio-dl2"]
  },
  {
    slug: "radio-motorola-dep450",
    name: "Radio Motorola DEP450",
    brand: "Motorola",
    model: "DEP450",
    category: "Accesorios",
    summary: "Radio de comunicacion profesional para cuadrillas de campo, seguridad operacional y coordinacion en obra.",
    description: "Solucion confiable para mejorar tiempos de respuesta y coordinacion entre equipos tecnicos durante levantamientos, replanteos y operaciones de obra.",
    specs: {
      Canales: "16 o 64",
      Frecuencia: "VHF / UHF segun configuracion",
      Potencia: "5W VHF / 4W UHF",
      Uso: "Campo y operaciones"
    },
    badge: "Cotizar",
    availability: "Bajo pedido",
    related: ["gnss-rtk-gx7"]
  },
  {
    slug: "drone-mapping-vtol-x4",
    name: "Drone mapping VTOL X4",
    brand: "AeroSurvey",
    model: "VTOL X4",
    category: "Drones",
    summary: "Plataforma de mapeo para grandes extensiones, fotogrametria, inspeccion y modelos de terreno.",
    description: "Sistema profesional para operaciones de cartografia y monitoreo en mineria, energia, agricultura e infraestructura.",
    specs: {
      Autonomia: "55 minutos",
      Sensor: "RGB 42 MP",
      PPK: "Integrado",
      Cobertura: "Hasta 400 ha por vuelo"
    },
    badge: "Cotizar",
    availability: "Cotizacion especializada",
    related: ["software-fotogrametria-pro", "capacitacion-drones-topografia"]
  }
];
