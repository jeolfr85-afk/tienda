# NUBO — Tienda de refacciones automotrices

Sitio **100% estático** (HTML, CSS y JavaScript vanilla) sin base de datos. Ideal para demostración, portafolio o despliegue en GitHub Pages.

## Requisitos

- Servidor web local (XAMPP, Live Server, etc.)
- Navegador moderno con JavaScript habilitado

## Cómo probar en XAMPP

1. Coloca la carpeta en `c:\xampp\htdocs\tienda\`
2. Inicia **Apache** en el panel de XAMPP
3. Abre [http://localhost/tienda/](http://localhost/tienda/)

## Flujo de uso

1. Explora el catálogo en la página principal (sin necesidad de iniciar sesión)
2. Haz clic en **Acceder** e inicia sesión con un usuario demo
3. Agrega productos al carrito
4. Completa el checkout y confirma el pedido
5. Revisa el número de pedido en la página de confirmación

## Usuarios demo

| Correo              | Contraseña   |
|---------------------|--------------|
| `demo@nubo.com`     | `demo123`    |
| `cliente@nubo.com`  | `cliente123` |

También puedes **registrar una cuenta nueva**; los datos se guardan en `localStorage` del navegador. Las contraseñas de usuarios registrados se almacenan con **hash SHA-256** (campo `passwordHash`). Los usuarios demo del archivo JSON conservan contraseña en texto plano solo para pruebas locales.

## Documentación académica

- [Índice de documentación](docs/README.md)
- [Plan de trabajo](docs/PLAN_DE_TRABAJO.md)
- [Reporte técnico](docs/REPORTE_TECNICO.md) (pruebas de seguridad, cuestionario, despliegue GitHub Pages)
- [Guía de despliegue GitHub Pages](docs/GUIA_DESPLIEGUE_GITHUB_PAGES.md)
- [Evidencias gráficas](docs/evidencias/) (6 capturas PNG)

### Regenerar capturas de prueba

```bash
npm install
npx playwright install chromium
npm run evidencias
```

## Estructura del proyecto

```
tienda/
├── index.html              # Catálogo público
├── login.html              # Login y registro
├── carrito.html            # Carrito de compras
├── checkout.html           # Envío, pago y resumen
├── confirmacion.html       # Pedido confirmado
├── css/styles.css          # Estilos unificados
├── js/
│   ├── data.js             # Carga de datos y utilidades
│   ├── auth.js             # Autenticación local
│   ├── cart.js             # Carrito
│   ├── catalog.js          # Catálogo, filtros y búsqueda
│   └── checkout.js         # Checkout y confirmación
├── data/
│   ├── products.json       # 25 refacciones de ejemplo
│   └── users-demo.json     # Usuarios demo
├── docs/                   # Documentación académica y evidencias
├── scripts/                # Script para capturas de prueba
└── assets/images/          # Logo y fotos de productos
```

## Almacenamiento local (`localStorage`)

| Clave              | Contenido                    |
|--------------------|------------------------------|
| `tienda_session`   | Sesión del usuario activo    |
| `tienda_users`     | Usuarios registrados         |
| `tienda_cart`      | Productos en el carrito      |
| `tienda_orders`    | Historial de pedidos         |

## Envío simulado

- **$99** en compras menores a $500
- **Gratis** en compras de $500 o más

## Limitaciones (demo)

- Usuarios **registrados**: contraseña hasheada (SHA-256) en `localStorage`; usuarios **demo**: texto plano en JSON
- Los pedidos solo existen en el dispositivo del usuario
- No hay pagos reales ni backend
- **No usar en producción** sin implementar seguridad real (bcrypt, servidor, base de datos)

## Categorías

Frenos · Motor · Suspensión · Eléctrico · Aceites · Llantas

---

© 2025 NUBO — Proyecto de demostración
