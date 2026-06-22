# Guía de despliegue en GitHub Pages

Publica **NUBO** en la nube con HTTPS gratuito.

## Requisitos

- Cuenta en [GitHub](https://github.com)
- Git instalado (opcional; también puedes subir archivos por la web)

## Paso 1 — Crear repositorio

1. En GitHub, clic en **New repository**.
2. Nombre sugerido: `nubo-tienda`
3. Visibilidad: **Public** (requerido para Pages gratis en cuenta personal)
4. Crear repositorio vacío (sin README si vas a subir el proyecto completo)

## Paso 2 — Subir el proyecto

Desde PowerShell:

```powershell
cd c:\xampp\htdocs\tienda
git init
git add .
git commit -m "Proyecto NUBO - tienda de refacciones con autenticacion"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/nubo-tienda.git
git push -u origin main
```

Reemplaza `TU-USUARIO` por tu usuario de GitHub.

## Paso 3 — Activar GitHub Pages

1. Repositorio → **Settings** → **Pages**
2. **Build and deployment** → Source: **Deploy from a branch**
3. Branch: `main` — Folder: `/ (root)`
4. Guardar

En 1–5 minutos la URL estará disponible:

```
https://TU-USUARIO.github.io/nubo-tienda/
```

GitHub provisiona **HTTPS automático** (certificado TLS).

## Paso 4 — Verificar en la nube

| Prueba | Esperado |
|--------|----------|
| Catálogo | Productos e imágenes visibles |
| Login demo | `demo@nubo.com` / `demo123` |
| Registro | Nuevo usuario con hash en localStorage |
| Compra | Carrito → checkout → confirmación |
| HTTPS | Candado en barra de direcciones |

## Paso 5 — Actualizar documentación

1. Copia la URL real en la portada de [`REPORTE_TECNICO.md`](REPORTE_TECNICO.md).
2. Regenera capturas con la URL de producción (opcional):

```powershell
$env:BASE_URL = "https://TU-USUARIO.github.io/nubo-tienda"
$env:HTTPS_URL = "https://TU-USUARIO.github.io/nubo-tienda/login.html"
npm run evidencias
```

## Archivos incluidos para Pages

| Archivo | Función |
|---------|---------|
| `.nojekyll` | Permite servir carpetas que empiezan con `_` y rutas estáticas |
| Rutas relativas | `css/`, `js/`, `data/` funcionan sin configuración extra |

## Solución de problemas

**404 en assets:** Verifica que la URL termine en `/nubo-tienda/` y que los archivos estén en la raíz del repo.

**Login no guarda usuarios entre dispositivos:** Es normal; `localStorage` es local al navegador.

**Web Crypto no funciona:** GitHub Pages sirve por HTTPS; la API `crypto.subtle` requiere contexto seguro (cumplido en Pages).

---

Volver al [índice de documentación](README.md).
