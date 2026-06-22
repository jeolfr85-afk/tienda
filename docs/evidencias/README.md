# Evidencias gráficas — Práctica NUBO

Esta carpeta contiene las capturas de pantalla que respaldan el reporte técnico académico.

## Archivos generados

| Archivo | Descripción |
|---------|-------------|
| `01-login-registro.png` | Pantalla de login y registro |
| `02-login-fallido.png` | Error con contraseña incorrecta |
| `03-inyeccion-sql-intento.png` | Intento de inyección SQL rechazado |
| `04-localstorage-hash.png` | `passwordHash` en localStorage |
| `05-https-candado.png` | HTTPS (GitHub Pages / referencia TLS) |
| `06-flujo-compra-nube.png` | Flujo de compra con sesión activa |

## Regenerar capturas

Con XAMPP activo (`http://localhost/tienda/`):

```bash
cd c:\xampp\htdocs\tienda
npm install
npm run evidencias
```

Tras desplegar en GitHub Pages, vuelve a ejecutar el script para actualizar `05` y `06` con la URL en la nube (opcional: edita `BASE_URL` en `scripts/capture-evidencias.mjs`).

## Insertar en Word

Copia las imágenes desde esta carpeta al reporte técnico o expórtalo desde Markdown a PDF.
