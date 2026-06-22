# Plan de trabajo — Proyecto NUBO

**Proyecto:** Tienda web de refacciones automotrices con autenticación y despliegue en la nube  
**Institución:** Tecnológico Nacional de México (TESJo)  
**Estado general:** Completado (desarrollo y documentación)

---

## 1. Objetivo del plan

Organizar retrospectivamente las actividades realizadas para desarrollar **NUBO**, una aplicación web estática con registro e inicio de sesión, almacenamiento seguro de contraseñas mediante hash SHA-256, validación de entradas, flujo de compra simulado y despliegue planificado en **GitHub Pages** con HTTPS.

---

## 2. Alcance

| Incluido | Excluido |
|----------|----------|
| Interfaz de login y registro | Backend con MySQL/PHP |
| Hash SHA-256 para usuarios registrados | Pagos reales |
| Catálogo, carrito y checkout | Base de datos relacional |
| Almacenamiento en `localStorage` | Servidor de autenticación centralizado |
| Documentación académica y pruebas de seguridad | Producción comercial |

---

## 3. Fases del proyecto

### Fase 1 — Análisis (Completada)

**Duración estimada:** 2 días  
**Responsable:** Equipo de desarrollo

| Actividad | Entregable | Estado |
|-----------|------------|--------|
| Revisar requisitos académicos (incisos a–i) | Lista de requisitos | Completado |
| Definir flujo e-commerce (catálogo → compra) | Diagrama de flujo | Completado |
| Decidir arquitectura 100% estática (HTML/CSS/JS) | Documento de decisión técnica | Completado |
| Identificar limitaciones (sin SQL, demo local) | Tabla de riesgos | Completado |

**Resultado:** Se optó por un sitio estático compatible con XAMPP y GitHub Pages, usando `localStorage` en lugar de base de datos SQL.

---

### Fase 2 — Diseño (Completada)

**Duración estimada:** 3 días  
**Responsable:** Equipo de desarrollo

| Actividad | Entregable | Estado |
|-----------|------------|--------|
| Diseñar estructura de páginas | Wireframe conceptual | Completado |
| Definir estructura de carpetas | Árbol `tienda/` | Completado |
| Especificar claves de `localStorage` | `tienda_session`, `tienda_users`, etc. | Completado |
| Diseñar formularios (registro, envío, tarjeta) | Campos y validaciones | Completado |
| Definir identidad visual NUBO | Logo, colores, tipografía Poppins | Completado |

**Páginas diseñadas:**

- `index.html` — Catálogo público
- `login.html` — Login y registro
- `carrito.html` — Carrito de compras
- `checkout.html` — Envío, pago y resumen
- `confirmacion.html` — Confirmación de pedido

---

### Fase 3 — Desarrollo (Completada)

**Duración estimada:** 8 días  
**Responsable:** Equipo de desarrollo

| Actividad | Archivo(s) | Estado |
|-----------|------------|--------|
| Estilos unificados | `css/styles.css` | Completado |
| Carga de datos y utilidades | `js/data.js` | Completado |
| Autenticación (login/registro) | `js/auth.js`, `login.html` | Completado |
| Catálogo, filtros y búsqueda | `js/catalog.js`, `index.html` | Completado |
| Carrito de compras | `js/cart.js`, `carrito.html` | Completado |
| Checkout y confirmación | `js/checkout.js`, `checkout.html`, `confirmacion.html` | Completado |
| Datos de productos (25 ítems) | `data/products.json` | Completado |
| Usuarios demo | `data/users-demo.json` | Completado |
| Imágenes de productos | `assets/images/products/` | Completado |

**Resultado:** Flujo funcional completo en `http://localhost/tienda/`.

---

### Fase 4 — Seguridad (Completada)

**Duración estimada:** 2 días  
**Responsable:** Equipo de desarrollo

| Medida | Implementación | Archivo |
|--------|----------------|---------|
| Hash SHA-256 en registro | `crypto.subtle.digest('SHA-256')` | `js/auth.js` |
| No guardar contraseña en claro (registrados) | Campo `passwordHash` en `tienda_users` | `js/auth.js` |
| Validación de correo electrónico | Función `isValidEmail()` | `js/data.js` |
| Validación de formularios de envío | Regex teléfono (10 dígitos), CP (5 dígitos) | `js/checkout.js` |
| Validación de tarjeta (simulada) | Formato MM/AA, CVV 3–4 dígitos | `js/checkout.js` |
| No persistir número completo ni CVV | Solo `ultimosDigitos` en pedido | `js/checkout.js` |
| Mensajes de error genéricos en login | "Correo o contraseña incorrectos" | `js/auth.js` |

**Limitación documentada:** Los usuarios demo en `users-demo.json` mantienen contraseña en texto plano únicamente para facilitar pruebas locales; no representa un modelo de producción.

---

### Fase 5 — Pruebas (Completada)

**Duración estimada:** 2 días  
**Responsable:** Equipo de desarrollo

#### Pruebas funcionales

| Caso | Resultado |
|------|-----------|
| Navegar catálogo sin sesión | OK |
| Login con usuario demo | OK |
| Registro de cuenta nueva | OK |
| Agregar productos al carrito | OK |
| Checkout con envío y pago simulado | OK |
| Confirmación con número de pedido `PED-YYYYMMDD-XXXX` | OK |
| Cerrar sesión y proteger carrito | OK |

#### Pruebas de seguridad (inciso h)

| Prueba | Resultado |
|--------|-----------|
| Contraseña incorrecta | Rechazo con mensaje de error |
| Intento de inyección SQL en login | Autenticación fallida; sin consultas SQL |
| Inspección de `localStorage` tras registro | `passwordHash` visible, sin `password` |
| HTTPS en GitHub Pages | Pendiente de captura tras despliegue |

Evidencias gráficas: carpeta [`evidencias/`](evidencias/README.md).

---

### Fase 6 — Despliegue y documentación (Completada)

**Duración estimada:** 2 días  
**Responsable:** Equipo de desarrollo

| Actividad | Entregable | Estado |
|-----------|------------|--------|
| Preparar proyecto para GitHub Pages | Repositorio listo para subir | Completado |
| Redactar guía de despliegue | Sección en `REPORTE_TECNICO.md` | Completado |
| Documentar pruebas con plantilla de capturas | `evidencias/` (6 PNG) | Completado |
| Elaborar guía de despliegue | `GUIA_DESPLIEGUE_GITHUB_PAGES.md` | Completado |
| Elaborar reporte técnico académico | `REPORTE_TECNICO.md` | Completado |
| Actualizar README del proyecto | `README.md` | Completado |

---

## 4. Diagrama de Gantt simplificado

| Actividad | Semana 1 | Semana 2 | Semana 3 |
|-----------|:--------:|:--------:|:--------:|
| Fase 1 — Análisis | ████ | | |
| Fase 2 — Diseño | ████ | | |
| Fase 3 — Desarrollo | ██ | ████████ | ██ |
| Fase 4 — Seguridad | | | ████ |
| Fase 5 — Pruebas | | | ████ |
| Fase 6 — Documentación | | | ████ |

**Duración total estimada:** 19 días hábiles (~3 semanas).

---

## 5. Recursos utilizados

| Recurso | Uso |
|---------|-----|
| XAMPP (Apache) | Servidor local de pruebas |
| Visual Studio Code / Cursor | Editor de código |
| Navegador Chrome/Edge | Pruebas y DevTools |
| GitHub Pages | Despliegue en la nube (HTTPS) |
| Font Awesome, Google Fonts | Iconos y tipografía |
| Web Crypto API | Hash SHA-256 nativo del navegador |

---

## 6. Tabla de riesgos y limitaciones

| Riesgo / Limitación | Impacto | Mitigación aplicada |
|---------------------|---------|---------------------|
| Sin backend ni base de datos SQL | No aplica prevención SQL clásica | Arquitectura documentada; validación de inputs; explicación teórica de consultas preparadas |
| Datos en `localStorage` (solo navegador) | Pérdida al limpiar caché; accesible vía XSS | Documentado como demo; no usar en producción |
| Usuarios demo con contraseña en texto plano | Riesgo educativo si se confunde con producción | Nota explícita en reporte y README |
| SHA-256 sin salt | Vulnerable a rainbow tables en producción | Aceptable para práctica; se recomienda bcrypt/Argon2 en producción |
| Sin autenticación de servidor | Sesión manipulable en cliente | Documentado como limitación del prototipo |
| Pagos simulados | No hay transacciones reales | Solo últimos 4 dígitos de tarjeta guardados |

---

## 7. Cronograma de entregables

| Entregable | Fase | Estado |
|------------|------|--------|
| Código fuente funcional | 3 | Completado |
| Medidas de seguridad implementadas | 4 | Completado |
| Evidencias de pruebas | 5 | Completado (6 capturas en `evidencias/`) |
| Despliegue GitHub Pages | 6 | Guía lista; URL por completar tras publicar |
| Reporte técnico académico | 6 | Completado |
| Plan de trabajo | 6 | Completado |

---

## 8. Referencias del plan

- Documentación del proyecto: [`REPORTE_TECNICO.md`](REPORTE_TECNICO.md)
- Guía de despliegue: [`GUIA_DESPLIEGUE_GITHUB_PAGES.md`](GUIA_DESPLIEGUE_GITHUB_PAGES.md)
- Evidencias gráficas: [`evidencias/`](evidencias/)
- Código principal de autenticación: [`../js/auth.js`](../js/auth.js)

---

*Documento generado como parte de la práctica académica de desarrollo web con autenticación y despliegue en la nube — Proyecto NUBO.*
