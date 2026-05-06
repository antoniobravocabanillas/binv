# Auditoria avanzada del frontend - BINV Capital Platform

## Veredicto ejecutivo

La plataforma ya transmite una intencion premium: identidad BINV visible, paleta sobria, landing con presencia, modulos clave y separacion entre experiencia publica y privada. Sin embargo, todavia se percibe como un prototipo institucional avanzado, no como una plataforma wealth/fintech lista para clientes high-ticket.

El principal salto pendiente no es agregar mas secciones, sino endurecer producto, jerarquia, operacion, mobile, accesibilidad, data room, KYC/KYB y arquitectura frontend. La experiencia debe pasar de "demo visual completa" a "plataforma patrimonial confiable, controlada y operativa".

## Prioridades inmediatas

1. Convertir acceso, roles, KYC/KYB y data rooms en reglas funcionales.
2. Corregir navegacion publica, anchors y experiencia mobile.
3. Reorganizar el frontend monolitico en modulos escalables.
4. Darle mas profundidad operativa a Investment Hub, Deal Room, Portfolio, Financing y Admin.
5. Refinar el sistema visual para que sea mas wealth management y menos dashboard generico.

---

## Hallazgos criticos

### 1. Acceso privado simulado

Problema detectado: la experiencia privada depende de un estado local `isAuthenticated` y botones demo. No existe sesion real, control de usuario, rol persistente ni autorizacion por modulo.

Por que es un problema: una plataforma institucional de inversiones/financiamiento no puede mostrar la misma experiencia a todos los perfiles, especialmente si hay data rooms, KYC, oportunidades calificadas y panel admin.

Impacto visual/UX/negocio: reduce confianza, rompe la percepcion fintech y puede crear riesgo legal si el usuario entiende que ya esta accediendo a informacion sensible real.

Como corregirlo: implementar session/auth real o, como minimo en demo, un modelo de usuario centralizado con rol, estado KYC/KYB, pais, permisos, perfil de inversionista y restricciones por modulo.

Prioridad: critico.

### 2. Data room sin gating real

Problema detectado: el data room aparece como concepto, pero el acceso esta expresado principalmente en copy. No hay bloqueo funcional por KYC/KYB, rol, oportunidad, pais o aprobacion.

Por que es un problema: el data room es una zona sensible. En wealth, private debt y real estate estructurado, el acceso documental debe sentirse controlado.

Impacto visual/UX/negocio: baja percepcion institucional, debilita la narrativa de cliente calificado y pone en duda el rigor operativo.

Como corregirlo: crear una funcion de permisos tipo `canAccessDataRoom(user, deal)`, estados de bloqueo, solicitud de acceso, aprobacion admin y logs de descarga.

Prioridad: critico.

### 3. Navegacion publica con anchors incompletos

Problema detectado: el header publico genera links por texto, pero no todas las secciones tienen IDs equivalentes. "Inicio", "Financiamiento" y "Relacion con Inversionistas" no estan resueltos como secciones publicas claras.

Por que es un problema: la navegacion parece terminada visualmente, pero puede fallar como arquitectura de informacion.

Impacto visual/UX/negocio: reduce conversion, genera friccion y transmite sensacion de landing incompleta.

Como corregirlo: definir un mapa explicito de navegacion publica con `label` y `href`, crear secciones reales para financiamiento e investor relations o retirar links no implementados.

Prioridad: critico.

### 4. Mobile no suficientemente maduro

Problema detectado: la landing tiene un selector mobile posicionado manualmente y la experiencia privada depende de sidebar desktop oculto en mobile. No hay drawer o menu mobile completo.

Por que es un problema: clientes high-ticket tambien revisan desde celular; la primera impresion mobile debe ser impecable.

Impacto visual/UX/negocio: riesgo de botones comprimidos, selector poco visible, navegacion incomoda y perdida de control del pais activo.

Como corregirlo: crear header mobile unico, menu drawer, selector pais visible con banderas, CTAs ordenados y pruebas en 390, 430, 768 y 1024 px.

Prioridad: critico.

### 5. Formularios sin flujo operativo suficiente

Problema detectado: Login, Financing Hub, KYC/KYB y perfiles usan inputs de demo, sin validacion robusta, errores, estados de envio, persistencia ni confirmaciones.

Por que es un problema: una plataforma de financiamiento e inversion necesita capturar informacion sensible y guiar al usuario con precision.

Impacto visual/UX/negocio: la experiencia se percibe como maqueta y no como herramienta real para originacion.

Como corregirlo: usar `react-hook-form` + `zod`, labels visibles, estados de error, carga de adjuntos, confirmacion, pipeline y resumen final de solicitud.

Prioridad: critico.

### 6. Demasiado frontend en un solo componente

Problema detectado: la plataforma BINV vive mayormente en un archivo grande con datos, componentes, vistas, formularios, hero, landing, dashboard y logica de filtros juntos.

Por que es un problema: dificulta mantenimiento, testing, colaboracion, performance y evolucion futura.

Impacto visual/UX/negocio: cada mejora se vuelve riesgosa y lenta; la plataforma no escala como producto.

Como corregirlo: separar en `data`, `types`, `components/public`, `components/private`, `modules/investments`, `modules/financing`, `modules/urbania`, `modules/admin`, `hooks` y `access-control`.

Prioridad: critico.

---

## Hallazgos importantes por experiencia

### 7. Landing publica potente, pero con narrativa todavia dispersa

Problema detectado: el hero tiene presencia premium, pero el relato posterior mezcla pilares, ecosistema, oportunidades, Urbania y compliance sin una progresion comercial suficientemente clara.

Por que es un problema: un prospecto nuevo debe entender en segundos que BINV conecta capital, oportunidades y financiamiento con aliados en Argentina y Peru.

Impacto visual/UX/negocio: puede verse sofisticada, pero no necesariamente convertir mejor.

Como corregirlo: estructurar la landing en flujo: problema del cliente, rol BINV, paises, verticales, oportunidades, proceso, confianza, CTA. Cada seccion debe responder una duda comercial.

Prioridad: importante.

### 8. Hero experience con riesgo de exceso visual

Problema detectado: canvas, particulas, SVG, redes, capas, parallax y efectos conviven en la misma escena.

Por que es un problema: en wealth management la sofisticacion se apoya en control, no en saturacion.

Impacto visual/UX/negocio: puede acercarse a una estetica tech demo si no se contiene.

Como corregirlo: reducir elementos simultaneos, mantener una red mas editorial, reforzar copy, CTAs y pais activo. El motion debe explicar flujo de capital, no solo decorar.

Prioridad: importante.

### 9. Experiencia post-login demasiado cercana a dashboard generico

Problema detectado: el panel privado tiene sidebar, cards y tablas funcionales, pero aun se siente como template SaaS financiero.

Por que es un problema: BINV apunta a clientes patrimoniales, empresas y aliados. La interfaz debe sentirse curada, no administrativa generica.

Impacto visual/UX/negocio: menor percepcion de exclusividad y asesoria personalizada.

Como corregirlo: crear home privada por rol, resumen de relacion con asesor, proximos pasos, acceso a data rooms, alertas de cumplimiento y recomendaciones contextuales.

Prioridad: importante.

### 10. Dashboard con metricas correctas pero poco ejecutivo

Problema detectado: patrimonio, YTD, distribuciones y KYC estan presentes, pero falta jerarquia de decision.

Por que es un problema: un dashboard patrimonial debe responder "que paso", "que requiere accion" y "que oportunidades son relevantes".

Impacto visual/UX/negocio: el usuario ve datos, pero no recibe guia.

Como corregirlo: separar en tres niveles: estado patrimonial, acciones pendientes, oportunidades recomendadas. Agregar confianza de datos, fuente, fecha y estado de validacion.

Prioridad: importante.

### 11. Investment Hub duplica tabla y cards sin una estrategia clara

Problema detectado: se muestra tabla de oportunidades y luego cards de los primeros deals. La duplicacion puede parecer relleno.

Por que es un problema: cada formato debe cumplir una funcion distinta.

Impacto visual/UX/negocio: menor claridad, mas densidad y menos sensacion de curaduria.

Como corregirlo: usar tabla para escritorio profesional, cards para mobile o recomendados, y agregar "por que aparece para tu perfil".

Prioridad: importante.

### 12. Filtros del Investment Hub son funcionales pero poco premium

Problema detectado: selects genericos con icono repetido, sin labels visibles, sin resumen de filtros, sin limpieza rapida y con logica fragil en plazo/ticket.

Por que es un problema: clientes sofisticados esperan control, claridad y precision.

Impacto visual/UX/negocio: se siente mas catalogo que hub patrimonial.

Como corregirlo: labels visibles, chips activos, boton limpiar filtros, conteo de resultados, filtros guardados y logica estructurada para plazo/ticket.

Prioridad: importante.

### 13. Deal Room sin workflow de evaluacion suficientemente guiado

Problema detectado: existe resumen, tesis, riesgos y documentos, pero falta un flujo de revision institucional.

Por que es un problema: un deal room no es solo una ficha; debe guiar una decision y dejar trazabilidad.

Impacto visual/UX/negocio: el usuario puede no saber si debe pedir llamada, documentos, derivacion o aprobacion interna.

Como corregirlo: agregar checklist de evaluacion, elegibilidad, estado KYC, documentos bloqueados, acciones por estado y timeline de aprobacion.

Prioridad: importante.

### 14. Portfolio necesita estados de confianza y conciliacion

Problema detectado: el portfolio muestra posiciones y ROI, pero los datos mock se perciben casi definitivos.

Por que es un problema: BINV no custodia ni ejecuta directamente; el origen del dato debe quedar claro sin parecer disclaimer defensivo.

Impacto visual/UX/negocio: riesgo de expectativa incorrecta sobre saldos, custodios y liquidacion.

Como corregirlo: incluir fuente del dato, aliado, fecha, estado "informativo", "pendiente validacion", "validado por aliado" y enlace a reporte.

Prioridad: importante.

### 15. Urbania Capital necesita mas credibilidad inmobiliaria

Problema detectado: tiene metricas correctas, pero faltan visuales de proyecto, renders, mapa, permisos, avance fotografico, hitos y documentos con mayor profundidad.

Por que es un problema: real estate high-ticket se vende por confianza fisica, legal y documental.

Impacto visual/UX/negocio: Urbania puede sentirse como vertical conceptual, no como proyecto invertible/analizable.

Como corregirlo: cards con imagen/render, ficha tecnica, estado legal, avance de obra, avance financiero, ubicacion, timeline y data room por proyecto.

Prioridad: importante.

### 16. Financing Hub aun no se siente como mesa de estructuracion

Problema detectado: el modulo recoge campos, pero no orienta suficientemente a empresas segun pais, instrumento, monto, plazo y garantia.

Por que es un problema: el financiamiento empresarial requiere diagnostico previo y claridad de opciones.

Impacto visual/UX/negocio: puede parecer formulario de contacto avanzado, no originacion financiera.

Como corregirlo: agregar prediagnostico, recomendacion de instrumentos, pipeline visual, documentos requeridos y siguiente accion con asesor.

Prioridad: importante.

### 17. KYC/KYB tratado como modulo, no como flujo transversal

Problema detectado: KYC aparece como seccion, pero no condiciona de forma integral oportunidades, data rooms, documentos y CTAs.

Por que es un problema: en plataformas patrimoniales, compliance define el acceso.

Impacto visual/UX/negocio: baja rigor operativo y genera inconsistencia entre copy y comportamiento.

Como corregirlo: hacer que KYC/KYB afecte visibilidad, acciones, alertas, data rooms y estados de oportunidad.

Prioridad: importante.

### 18. Relacion con Inversionistas requiere mas arquitectura institucional

Problema detectado: la seccion existe, pero debe sentirse como centro documental serio.

Por que es un problema: IR comunica transparencia, gobierno, reportes y confianza.

Impacto visual/UX/negocio: si queda como pagina informativa simple, pierde peso institucional.

Como corregirlo: dividir en reportes, comunicados, documentos institucionales, legal, FAQ, contacto y biblioteca descargable filtrable.

Prioridad: importante.

### 19. Admin Panel es mas demostrativo que operativo

Problema detectado: el panel admin muestra capacidades, pero no flujos reales de aprobacion, asignacion, edicion, logs o auditoria.

Por que es un problema: la operacion interna define si la plataforma puede escalar.

Impacto visual/UX/negocio: parece una lista de funcionalidades, no una consola de backoffice.

Como corregirlo: crear tablas de usuarios, KYC, deals, documentos, aliados, logs, con acciones y estados.

Prioridad: importante.

### 20. Aliados e infraestructura pueden confundirse

Problema detectado: aliados operativos, custodios, infraestructura de mercado y referencias regionales conviven en el mismo universo visual.

Por que es un problema: legalmente y comercialmente no es lo mismo INVIU que BYMA, nuam o Interactive Brokers.

Impacto visual/UX/negocio: puede crear ambiguedad sobre relacion comercial, ejecucion y responsabilidad.

Como corregirlo: clasificar visualmente: aliado operativo, infraestructura/referencia, custodia/acceso internacional y vertical BINV.

Prioridad: importante.

---

## Hallazgos visuales y de sistema

### 21. Paleta premium correcta, pero falta disciplina de uso

Problema detectado: azul profundo, oro y neutros funcionan, pero algunos tonos dorados, grises y fondos crema se repiten sin una escala formal.

Por que es un problema: lo premium exige consistencia milimetrica.

Impacto visual/UX/negocio: puede verse bonito, pero no necesariamente sistema de marca robusto.

Como corregirlo: definir tokens: `surface`, `surface-elevated`, `ink`, `muted`, `gold`, `gold-soft`, `orange-brand`, `success`, `warning`, `risk`.

Prioridad: refinamiento.

### 22. Naranja BINV debe usarse con mas precision

Problema detectado: el naranja de marca es poderoso, pero si se usa demasiado puede romper el tono private banking.

Por que es un problema: BINV necesita verse institucional, no fintech retail.

Impacto visual/UX/negocio: exceso de naranja puede bajar percepcion wealth.

Como corregirlo: reservar naranja para marca, estados clave o acentos muy puntuales; usar oro sobrio para CTAs premium.

Prioridad: refinamiento.

### 23. Contraste de textos secundarios debe revisarse

Problema detectado: varios textos usan grises suaves sobre fondos oscuros, crema o translucidos.

Por que es un problema: legibilidad es parte de lujo y confianza.

Impacto visual/UX/negocio: textos importantes pueden perderse en mobile o pantallas con bajo brillo.

Como corregirlo: auditar WCAG AA, subir contraste de `muted`, revisar badges, placeholders, overlays y textos en hero.

Prioridad: refinamiento.

### 24. CTAs compiten entre si

Problema detectado: varias pantallas presentan tres CTAs con pesos visuales similares.

Por que es un problema: la conversion high-ticket requiere una accion principal clara.

Impacto visual/UX/negocio: el usuario duda entre explorar, asesorarse o financiarse.

Como corregirlo: definir CTA primario por contexto y secundarios visualmente subordinados.

Prioridad: refinamiento.

### 25. Tipografia fuerte, pero con exceso de peso en algunas cards

Problema detectado: muchas cards usan titulos bold y textos densos.

Por que es un problema: wealth design necesita jerarquia tranquila, no gritos tipograficos.

Impacto visual/UX/negocio: puede sentirse menos editorial y mas dashboard.

Como corregirlo: bajar pesos en tarjetas, mejorar line-height, usar titulos mas cortos y separar copy operativo de copy comercial.

Prioridad: refinamiento.

### 26. Motion sin gobernanza suficiente

Problema detectado: hay muchas animaciones CSS, canvas continuo, parallax y efectos de scroll.

Por que es un problema: el motion premium debe ser selectivo, no permanente.

Impacto visual/UX/negocio: riesgo de performance, distraccion y fatiga visual.

Como corregirlo: crear motion tokens, reducir canvas en mobile, respetar `prefers-reduced-motion`, pausar fuera de viewport.

Prioridad: importante.

### 27. Iconografia correcta, pero demasiado uniforme

Problema detectado: lucide funciona bien, pero muchos modulos comparten estilo e intensidad similar.

Por que es un problema: los iconos no ayudan suficientemente a distinguir negocio, compliance, deal, portfolio o admin.

Impacto visual/UX/negocio: menor escaneabilidad.

Como corregirlo: definir familias de uso: navegacion, estados, riesgo, documentos, accion, aliado, pais.

Prioridad: refinamiento.

---

## Responsive y accesibilidad

### 28. Falta una estrategia mobile-first para plataforma privada

Problema detectado: la experiencia interna usa sidebar desktop y header compacto en mobile, pero no ofrece navegacion completa clara.

Por que es un problema: modulos como Investment Hub, Deal Room y Portfolio necesitan rutas moviles eficientes.

Impacto visual/UX/negocio: el usuario puede quedar atrapado en una vista.

Como corregirlo: drawer mobile, bottom actions contextuales, tablas convertidas a cards y CTA sticky segun modulo.

Prioridad: critico.

### 29. Tablas no son ideales para mobile

Problema detectado: la tabla de oportunidades se adapta como grid, pero sigue cargando muchas columnas e informacion.

Por que es un problema: mobile necesita sintesis y detalle progresivo.

Impacto visual/UX/negocio: lectura pesada y menor conversion a "ver deal".

Como corregirlo: cards moviles con 5 datos clave: nombre, activo, ticket, riesgo, estado y CTA.

Prioridad: importante.

### 30. Inputs dependen demasiado de placeholders

Problema detectado: varios formularios usan placeholder como guia principal.

Por que es un problema: placeholders desaparecen al escribir y no reemplazan labels.

Impacto visual/UX/negocio: accesibilidad baja, errores de carga y menor confianza.

Como corregirlo: labels visibles, helper text, errores y formatos esperados.

Prioridad: importante.

### 31. Faltan estados vacios, loading y error

Problema detectado: los modulos no muestran una estrategia consistente para carga, error, sin resultados, pendiente aprobacion o acceso denegado.

Por que es un problema: toda plataforma operativa necesita manejar estados intermedios.

Impacto visual/UX/negocio: parece demo estatica.

Como corregirlo: crear componentes `EmptyState`, `LoadingState`, `BlockedState`, `ErrorState` y `PendingApprovalState`.

Prioridad: importante.

---

## Producto, conversion e institucionalidad

### 32. Falta explicar mejor "que hace BINV" en cada accion

Problema detectado: el rol BINV aparece, pero no siempre acompana cada CTA.

Por que es un problema: BINV no ejecuta directamente, pero tampoco debe sonar pasivo.

Impacto visual/UX/negocio: el usuario puede no entender si esta solicitando asesoria, documentacion, derivacion o evaluacion.

Como corregirlo: CTAs contextuales: "Solicitar evaluacion", "Recibir documentacion", "Agendar llamada", "Solicitar acceso al data room", "Conectar con aliado".

Prioridad: importante.

### 33. Country switching funciona, pero necesita mas senales visuales

Problema detectado: el pais cambia contenido, pero visualmente podria ser mas evidente.

Por que es un problema: Argentina y Peru tienen aliados, instrumentos, regulacion y monedas distintas.

Impacto visual/UX/negocio: el usuario puede no percibir que la plataforma realmente adapto el universo.

Como corregirlo: usar bandera, mercado activo, moneda, aliados visibles, disclaimer contextual y filtros preconfigurados por pais.

Prioridad: importante.

### 34. Urbania visible en ambos paises requiere nota mas elegante

Problema detectado: Urbania se muestra en Peru y Argentina, pero la aclaracion de ejecucion en Peru debe ser parte natural de la ficha.

Por que es un problema: evita confusion sobre jurisdiccion y estructura.

Impacto visual/UX/negocio: mejora confianza y reduce ambiguedad legal.

Como corregirlo: badge "Proyecto ejecutado en Peru", seccion "jurisdiccion y estructura", documentos especificos.

Prioridad: importante.

### 35. Falta separacion clara entre prospecto, cliente, empresa, aliado y admin

Problema detectado: la app contiene roles, pero la experiencia no se reconfigura de forma real por rol.

Por que es un problema: cada usuario tiene objetivos distintos.

Impacto visual/UX/negocio: la plataforma se siente unica para todos y menos sofisticada.

Como corregirlo: crear perfiles de demo por rol y renderizar navegacion, dashboard, permisos y CTAs segun rol.

Prioridad: critico.

---

## Performance frontend

### 36. Hero costoso para equipos modestos

Problema detectado: canvas animado, SVG, parallax y multiples capas pueden elevar costo de rendering.

Por que es un problema: una landing premium debe sentirse fluida.

Impacto visual/UX/negocio: scroll menos suave, consumo de bateria y peor performance mobile.

Como corregirlo: reducir particulas en mobile, pausar animacion fuera de viewport, medir Lighthouse y usar `prefers-reduced-motion`.

Prioridad: importante.

### 37. CSS global con selectores amplios

Problema detectado: algunas reglas visuales impactan muchas secciones de forma transversal.

Por que es un problema: aumenta riesgo de efectos colaterales al modificar una parte.

Impacto visual/UX/negocio: inconsistencias y bugs visuales dificiles de rastrear.

Como corregirlo: migrar estilos a componentes, CSS modules o clases mas especificas por bloque.

Prioridad: importante.

### 38. Faltan pruebas de regresion visual y funcional

Problema detectado: no hay evidencia de tests para cambio de pais, filtros, acceso, responsive o data room.

Por que es un problema: la plataforma tiene muchas reglas contextuales.

Impacto visual/UX/negocio: cualquier ajuste puede romper una jurisdiccion o modulo.

Como corregirlo: agregar Playwright para flujos principales y snapshots por desktop/mobile.

Prioridad: importante.

---

## Recomendacion de roadmap

### Fase 1 - Endurecimiento institucional

- Auth demo estructurada por rol.
- KYC/KYB transversal.
- Gating real de data rooms.
- Navegacion publica corregida.
- Mobile header + drawer.
- Formularios con validacion.

### Fase 2 - Plataforma wealth premium

- Dashboard por rol.
- Deal Room guiado.
- Investment Hub con recomendacion por perfil.
- Portfolio con fuentes y estados de validacion.
- Urbania con fichas visuales/documentales.
- Financing con prediagnostico y pipeline real.

### Fase 3 - Escalabilidad frontend

- Separar el componente monolitico.
- Crear sistema de componentes BINV.
- Centralizar datos mock y reglas de negocio.
- Agregar tests funcionales y visuales.
- Optimizar motion y performance.

## Conclusion

La direccion visual es buena y la plataforma ya tiene una base muy superior a una landing comun. Pero para que BINV Capital se perciba como una plataforma patrimonial de nivel institucional, el foco inmediato debe ser control, claridad, jerarquia, permisos, mobile y profundidad operativa.

El criterio recomendado es no agregar mas decoracion ni mas cards. La mejora profesional viene de hacer que cada modulo parezca parte de una firma financiera real: datos con fuente, accesos con permiso, oportunidades con estructura, formularios con validacion, paises con reglas y decisiones con trazabilidad.
