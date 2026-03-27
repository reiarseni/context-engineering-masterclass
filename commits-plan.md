# Plan de Commits - Masterclass Context Engineering

## 1. Initial commit: Setup básico del proyecto
**Body**:
- Configuración inicial con Astro 4 y React 18
- Archivos de configuración básicos (tsconfig, astro.config)
- Dependencias mínimas para comenzar el desarrollo

**Archivos**: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `package-lock.json`

## 2. feat: Layout base y estructura de páginas
**Body**:
- Creación del layout principal en Astro para el esqueleto HTML
- Página de inicio que sirve como punto de entrada
- Configuración de TypeScript básica para el entorno

**Archivos**: `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/env.d.ts`

## 3. feat: Sistema de diseño y tokens visuales
**Body**:
- Definición de tokens de diseño (colores, tipografía, espacios)
- Componentes compartidos base (Badge, CodeBlock, Callout)
- CSS global con animaciones y fuentes personalizadas

**Archivos**: `src/components/tokens.js`, `src/components/shared.jsx`

## 4. feat: Aplicación principal y navegación
**Body**:
- Componente principal MasterclassApp con gestión de estado
- Sistema de navegación por tabs con hash routing
- Barra de progreso y controles de navegación
- Header con información de la masterclass

**Archivos**: `src/components/MasterclassApp.jsx`

## 5. feat: Módulos fundamentales del contexto
**Body**:
- Amnesia del LLM y naturaleza stateless
- Anatomía de un request con sus 7 capas
- Lost in the Middle y atención del modelo
- Técnicas de inyección quirúrgica de contexto

**Archivos**: `src/components/sections/S1Amnesia.jsx`, `S2Anatomy.jsx`, `S3LostMiddle.jsx`, `S4Injection.jsx`

## 6. feat: Loop agéntico y costos
**Body**:
- Visualización del loop agéntico de reconstrucción de contexto
- Calculadora interactiva de costos con crecimiento exponencial
- Timeline de sesión real con análisis de 4 requests

**Archivos**: `src/components/sections/S5Loop.jsx`, `S6Cost.jsx`, `S12SessionCost.jsx`

## 7. feat: Capacidades modulares y MCP
**Body**:
- Sistema de Skills modulares y sus 4 tipos
- Model Context Protocol y servidores MCP reales
- Ciclo de ejecución de Tool Use con visualizaciones

**Archivos**: `src/components/sections/S7Skills.jsx`, `S8MCP.jsx`, `S14ToolUse.jsx`

## 8. feat: Agentes de programación y memorias
**Body**:
- Arquitectura interna de agentes (Cursor, Windsurf, Claude Code, OpenCode)
- Sistemas de memoria (in-context, RAG, episódica, semántica)
- Guía práctica para elegir el agente adecuado

**Archivos**: `src/components/sections/S9Agents.jsx`, `S10Memories.jsx`, `S15AgentChooser.jsx`

## 9. feat: Interacción entre sistemas y facturación
**Body**:
- Mecanismos de interacción entre Skills, MCP, Memorias y Agentes
- Sistema de facturación y costos por token
- Árbol de decisiones para sesiones de desarrollo

**Archivos**: `src/components/sections/S11Interaction.jsx`, `S13DecisionTree.jsx`, `S16Billing.jsx`

## 10. docs: Documentación completa del proyecto
**Body**:
- README con descripción detallada de la masterclass
- Tabla de módulos con conceptos clave
- Instrucciones de desarrollo y deploy
- Información sobre el stack tecnológico

**Archivos**: `README.md`

## 11. ci: Configuración de despliegue automático
**Body**:
- Workflow de GitHub Actions para deploy en GitHub Pages
- Configuración para builds automáticos en push a main
- Integración con Astro para despliegue estático

**Archivos**: `.github/workflows/deploy.yml`

## 12. build: Assets públicos y configuración final
**Body**:
- Archivos públicos y assets necesarios
- Configuración de VS Code para desarrollo
- Build final y verificación de funcionamiento

**Archivos**: `public/`, `.vscode/`, configuración final de proyecto