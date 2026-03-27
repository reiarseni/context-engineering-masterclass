# Context Engineering & Agentic Systems — Masterclass

Masterclass interactiva sobre cómo los agentes de código (Cursor, Windsurf, Claude Code, OpenCode) construyen contexto, orquestan Skills, conectan MCPs, gestionan Memorias y cuánto cuesta cada request al LLM.

16 módulos con demos interactivas, visualizaciones y ejemplos de código reales.

🌐 **Live:** [reiarseni.github.io/context-engineering-masterclass](https://reiarseni.github.io/context-engineering-masterclass/)

## Stack

- **Astro 4** — framework web con renderizado estático
- **React 18** — componentes interactivos (hidratados con `client:load`)
- **CSS-in-JS** — estilos inline con design tokens centralizados

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # previsualiza el build
```

## Estructura

```
src/
├── layouts/Layout.astro          # HTML shell
├── pages/index.astro             # Ruta "/"
└── components/
    ├── tokens.js                 # Design tokens (colores, tipografía)
    ├── shared.jsx                # Badge, CodeBlock, Callout, SectionTitle
    ├── MasterclassApp.jsx        # App principal — navegación por tabs
    └── sections/                 # Un archivo por módulo (S1–S13)
.github/workflows/deploy.yml      # Deploy automático a GitHub Pages
```

## Módulos

| # | Título | Concepto clave |
|---|--------|----------------|
| 1 | La Amnesia del LLM | El modelo es stateless — cada request empieza de cero |
| 2 | Anatomía de un Request | Las 7 capas que componen el context window |
| 3 | Lost in the Middle | El modelo atiende más al inicio y al final del contexto |
| 4 | Inyección Quirúrgica | 5 técnicas para inyectar contexto crítico de forma óptima |
| 5 | El Loop Agéntico | Cómo el agente reconstruye y reenvía el contexto en cada turno |
| 6 | El Costo Real | Calculadora de crecimiento exponencial de tokens |
| 7 | Sesión Real: Anatomía de Costos | Timeline de 4 requests reales — qué viaja y cuánto cuesta |
| 8 | Skills — Capacidades Modulares | Los 4 tipos de Skills y cómo el agente las carga |
| 9 | MCP — Model Context Protocol | Qué es MCP, cómo funciona y servidores MCP reales |
| 10 | Tool Use — El Ciclo de Ejecución | Cómo el LLM decide, emite y encadena tool calls; paralelo, error recovery y chaining |
| 11 | Agentes de Programación | Arquitectura interna de Cursor, Windsurf, Claude Code, OpenCode |
| 12 | Memorias del Agente | In-context, RAG, episódica y semántica |
| 13 | Interacción entre Sistemas | Skills + MCP + Memorias + Agentes orquestando juntos |
| 14 | Guía de Decisiones | Árbol de decisiones práctico para cada momento de una sesión |

## Deploy

El sitio se publica automáticamente en GitHub Pages con cada push a `main`.

Para configurar en un fork nuevo: **Settings → Pages → Source → GitHub Actions**.
