export type Service = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  benefits: string[];
  process: string[];
  deliverables: string[];
  equipment: string[];
};

export const services: Service[] = [
  {
    slug: "levantamiento-topografico",
    title: "Levantamiento topografico",
    summary: "Captura precisa de informacion planimetrica y altimetrica para obras, predios, habilitaciones y expedientes tecnicos.",
    problem: "Reduce incertidumbre en diseño, metrados, saneamiento y ejecucion de obra cuando no existe una base topografica confiable.",
    benefits: ["Curvas de nivel y modelos digitales consistentes", "Control de calidad en campo y gabinete", "Entrega compatible con CAD, GIS y BIM"],
    process: ["Revision de alcance y datum requerido", "Plan de control y captura en campo", "Procesamiento, ajuste y validacion", "Entrega tecnica con respaldo digital"],
    deliverables: ["Plano topografico", "Puntos georreferenciados", "Memoria tecnica", "Archivos DWG, LandXML o SHP"],
    equipment: ["GNSS RTK", "Estacion total", "Nivel digital", "Dron fotogrametrico"]
  },
  {
    slug: "georreferenciacion",
    title: "Georreferenciacion",
    summary: "Vinculacion de proyectos a sistemas oficiales de coordenadas para catastro, infraestructura, mineria y saneamiento fisico legal.",
    problem: "Evita desplazamientos, duplicidad de informacion y observaciones tecnicas por coordenadas no trazables.",
    benefits: ["Trazabilidad geodesica", "Compatibilidad con sistemas oficiales", "Base confiable para replanteos y controles"],
    process: ["Evaluacion de red y normativa", "Monumentacion o recuperacion de puntos", "Observacion GNSS", "Ajuste y reporte"],
    deliverables: ["Ficha de punto", "Reporte GNSS", "Coordenadas oficiales", "Croquis y memoria"],
    equipment: ["Receptores geodesicos", "Software de postproceso", "Antenas calibradas"]
  },
  {
    slug: "fotogrametria",
    title: "Fotogrametria y fotocontrol",
    summary: "Captura aerea, puntos de fotocontrol, ortomosaicos y modelos de elevacion para cartografia, catastro, urbanismo e infraestructura.",
    problem: "Permite cubrir grandes extensiones con informacion visual y metrica consistente cuando el levantamiento convencional no es suficiente.",
    benefits: ["Modelos digitales de terreno y superficie", "Ortomosaicos georreferenciados", "Integracion con CAD, GIS y BIM"],
    process: ["Plan de vuelo y control terrestre", "Establecimiento de puntos de fotocontrol", "Procesamiento fotogrametrico", "Validacion y entrega cartografica"],
    deliverables: ["Ortomosaico", "Modelo digital de elevacion", "Nube de puntos", "Reporte de precision"],
    equipment: ["Drones mapping", "GNSS RTK", "Software fotogrametrico", "Puntos de control"]
  },
  {
    slug: "modelado-bim",
    title: "Modelado y gestion BIM",
    summary: "Modelado Revit, integracion de especialidades, deteccion de incompatibilidades, metrados, sectorizacion y seguimiento 4D.",
    problem: "Reduce incompatibilidades entre arquitectura, estructuras y MEP antes de que se conviertan en costos de obra.",
    benefits: ["Compatibilizacion de especialidades", "Metrados y sectorizacion", "Modelo 4D para seguimiento"],
    process: ["Revision de informacion base", "Modelado por especialidad", "Coordinacion y deteccion de interferencias", "Entrega y acompañamiento"],
    deliverables: ["Modelo BIM", "Reporte de interferencias", "Cuadro de metrados", "Modelo 4D"],
    equipment: ["Revit", "Navisworks", "CAD", "Nube de puntos"]
  },
  {
    slug: "replanteo",
    title: "Replanteo de obra",
    summary: "Materializacion precisa de ejes, niveles, estructuras y elementos de proyecto para construccion e infraestructura.",
    problem: "Disminuye retrabajos y errores de ejecucion cuando la obra requiere control de posicion y nivel constante.",
    benefits: ["Control de tolerancias", "Trazabilidad por frente de trabajo", "Coordinacion directa con residente y oficina tecnica"],
    process: ["Revision de planos IFC", "Preparacion de datos de replanteo", "Marcacion en campo", "Reporte de control"],
    deliverables: ["Actas de replanteo", "Planillas de puntos", "Reporte fotografico", "Planos as-built"],
    equipment: ["Estacion total robotica", "GNSS RTK", "Nivel automatico"]
  },
  {
    slug: "consultoria-construccion",
    title: "Consultoria, diseño y construccion",
    summary: "Acompañamiento para diseño arquitectonico, direccion de proyectos, remodelaciones, ampliaciones, acabados, drywall y estructuras metalicas.",
    problem: "Ordena decisiones tecnicas y de ejecucion cuando el proyecto necesita integrar diseño, obra, costos, plazos y control de calidad.",
    benefits: ["Gestion integral de proyecto", "Compatibilizacion tecnica", "Control de avance y cierre"],
    process: ["Anteproyecto y alcance", "Diseño y licencia", "Seleccion y ejecucion", "Liquidacion y cierre"],
    deliverables: ["Planos", "Metrados", "Cronograma", "Informe de avance"],
    equipment: ["CAD", "BIM", "Instrumentacion topografica", "Herramientas de control de obra"]
  },
  {
    slug: "control-geometrico",
    title: "Control geometrico",
    summary: "Monitoreo dimensional y verificacion geometrica para estructuras, montaje industrial, pavimentos y obras lineales.",
    problem: "Permite detectar desviaciones antes de que impacten seguridad, calidad o costos de correccion.",
    benefits: ["Reportes por tolerancia", "Control historico", "Soporte para QA/QC"],
    process: ["Definicion de tolerancias", "Campanas de medicion", "Comparacion contra diseño", "Informe de desviaciones"],
    deliverables: ["Dashboard de control", "Informe QA/QC", "Nube de puntos o tablas", "Recomendaciones tecnicas"],
    equipment: ["Escaner laser", "Estacion total", "Nivel digital"]
  },
  {
    slug: "alquiler-equipos",
    title: "Alquiler de equipos",
    summary: "Renta de estaciones totales, GNSS, niveles, drones, accesorios y kits completos para equipos tecnicos.",
    problem: "Da capacidad operativa inmediata sin inmovilizar capital en instrumentos de alto ticket.",
    benefits: ["Equipos calibrados", "Kits completos", "Soporte de configuracion y puesta en marcha"],
    process: ["Validacion de necesidad", "Reserva y checklist", "Entrega y capacitacion breve", "Soporte durante el uso"],
    deliverables: ["Contrato de alquiler", "Checklist de entrega", "Certificado disponible", "Soporte remoto"],
    equipment: ["Estaciones totales", "GNSS", "Niveles", "Tripodes y prismas"]
  },
  {
    slug: "mantenimiento-calibracion",
    title: "Mantenimiento y calibracion",
    summary: "Servicio tecnico preventivo, correctivo y calibracion para instrumentos topograficos y geodesicos.",
    problem: "Protege la precision del instrumento y evita paradas de campo por equipos fuera de tolerancia.",
    benefits: ["Diagnostico tecnico", "Certificados y trazabilidad", "Mayor vida util del equipo"],
    process: ["Recepcion y diagnostico", "Presupuesto tecnico", "Intervencion y calibracion", "Pruebas finales"],
    deliverables: ["Informe de servicio", "Certificado", "Recomendaciones de uso", "Historial del equipo"],
    equipment: ["Bancos de calibracion", "Herramientas opticas", "Software de diagnostico"]
  },
  {
    slug: "capacitacion",
    title: "Capacitacion tecnica",
    summary: "Programas para operadores, oficinas tecnicas y equipos comerciales en uso de instrumentos, procesamiento y buenas practicas.",
    problem: "Acelera la adopcion de tecnologia y reduce errores de operacion en campo.",
    benefits: ["Contenido aplicable", "Practicas con equipo real", "Material de consulta"],
    process: ["Diagnostico de nivel", "Diseño del temario", "Sesion practica", "Evaluacion y recomendaciones"],
    deliverables: ["Constancia", "Manual operativo", "Dataset de practica", "Informe de desempeño"],
    equipment: ["GNSS", "Estacion total", "Software CAD/GIS", "Drones"]
  },
  {
    slug: "soporte-tecnico",
    title: "Soporte tecnico especializado",
    summary: "Acompañamiento remoto y presencial para configuracion, incidencias, flujos de datos y productividad de equipos.",
    problem: "Resuelve bloqueos de operacion cuando el equipo, software o flujo de datos detiene el avance del proyecto.",
    benefits: ["Respuesta especializada", "Menos tiempo detenido", "Mejora de flujos operativos"],
    process: ["Registro de caso", "Diagnostico", "Resolucion o escalamiento", "Cierre documentado"],
    deliverables: ["Ticket de soporte", "Guia de resolucion", "Configuracion validada", "Recomendacion preventiva"],
    equipment: ["GNSS", "Estaciones totales", "Software", "Controladoras"]
  }
];
