# Documentación NUBO

Entregables académicos para la práctica de autenticación web y despliegue en la nube (TESJo).

| Documento | Descripción |
|-----------|-------------|
| [Plan de trabajo](PLAN_DE_TRABAJO.md) | Fases, cronograma y riesgos del proyecto |
| [Reporte técnico](REPORTE_TECNICO.md) | Documento principal para entregar al docente |
| [Guía de despliegue](GUIA_DESPLIEGUE_GITHUB_PAGES.md) | Publicar en GitHub Pages con HTTPS |
| [Evidencias gráficas](evidencias/) | Capturas de pruebas de seguridad |

## Antes de entregar

1. Completa la portada del reporte (nombre, matrícula, materia, URL).
2. Verifica que existan las 6 imágenes en `evidencias/`.
3. Exporta `REPORTE_TECNICO.md` a PDF o Word.

## Regenerar evidencias

```bash
npm install
npx playwright install chromium
npm run evidencias
```
