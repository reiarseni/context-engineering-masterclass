import { useState } from "react";
import { T } from "../tokens.js";
import { Callout, SectionTitle, CodeBlock } from "../shared.jsx";

function DiamondIcon({ color, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0, marginTop: 1 }}>
      <polygon
        points="10,2 18,10 10,18 2,10"
        fill={`${color}22`}
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function BranchLabel({ type, color }) {
  const styles = {
    yes: { bg: `${T.green}22`, border: `1px solid ${T.green}55`, color: T.green },
    no:  { bg: `${T.red}22`,   border: `1px solid ${T.red}55`,   color: T.red   },
    do:  { bg: `${T.blue}22`,  border: `1px solid ${T.blue}55`,  color: T.blue  },
  };
  const s = styles[type] || styles.do;
  const labels = { yes: "SÍ", no: "NO", do: "→" };
  return (
    <span style={{
      fontFamily: T.mono, fontSize: 10, fontWeight: 700,
      padding: "1px 7px", borderRadius: 4, whiteSpace: "nowrap",
      marginTop: 2, flexShrink: 0,
      ...s,
    }}>
      {labels[type]}
    </span>
  );
}

function DecisionNode({ question, branches, color }) {
  return (
    <div style={{
      display: "flex", gap: 10, padding: "10px 0",
      borderBottom: `1px solid ${T.border}33`,
    }}>
      <DiamondIcon color={color} />
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: T.sans, fontSize: 13, fontWeight: 500,
          color: T.text, marginBottom: 6, lineHeight: 1.5,
        }}>
          {question}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {branches.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <BranchLabel type={b.type} color={color} />
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.55 }}>
                  {b.text}
                </span>
                {b.code && (
                  <div style={{
                    marginTop: 6,
                    fontFamily: T.mono, fontSize: 11, color: T.textMid,
                    background: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: 6, padding: "7px 10px",
                    borderLeft: `2px solid ${color}`,
                    lineHeight: 1.6,
                  }}>
                    <em style={{ color: T.textDim, fontSize: 10 }}></em>
                    {b.code}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TreeSection({ num, title, color, badge, nodes, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      border: `1px solid ${open ? color + "44" : T.border}`,
      borderRadius: 10, overflow: "hidden", marginBottom: 8,
      transition: "border-color 0.2s ease",
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: "12px 16px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: open ? `${color}0d` : T.surface2,
          transition: "background 0.2s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: T.mono, fontSize: 11, fontWeight: 600,
            background: `${color}33`, color: color,
            border: `1px solid ${color}55`,
            padding: "2px 9px", borderRadius: 20,
          }}>
            {num}
          </span>
          <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: T.text }}>
            {title}
          </span>
          <span style={{
            fontFamily: T.mono, fontSize: 10, color: color,
            background: `${color}15`, border: `1px solid ${color}33`,
            padding: "1px 8px", borderRadius: 12,
          }}>
            {badge}
          </span>
        </div>
        <span style={{
          fontFamily: T.mono, fontSize: 11, color: T.textDim,
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}>▶</span>
      </div>

      {/* Body */}
      {open && (
        <div style={{
          animation: "fadeSlideIn 0.25s ease",
          padding: "4px 16px 12px",
          background: T.surface,
          borderTop: `1px solid ${T.border}33`,
        }}>
          {nodes.map((node, i) => (
            <DecisionNode
              key={i}
              question={node.question}
              branches={node.branches}
              color={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const SECTIONS = [
  {
    num: "1", title: "Antes de empezar una sesión", color: T.purple,
    badge: "configuración",
    nodes: [
      {
        question: "¿Existe un CLAUDE.md en el proyecto?",
        branches: [
          { type: "yes", text: "Verifica que tenga: stack tecnológico, convenciones del proyecto, comandos clave y reglas críticas. Máximo 200 líneas." },
          { type: "no", text: "Créalo ahora. Es la memoria persistente entre sesiones — sin él, el agente redescubre el proyecto desde cero cada vez.",
            code: "# CLAUDE.md\n## Stack: Next.js 14, TypeScript, Prisma\n## Commands: npm run dev | npm run build\n## Conventions: kebab-case filenames, async/await always\n## Rules: never modify migrations directly" },
        ],
      },
      {
        question: "¿Tienes un system prompt estructurado?",
        branches: [
          { type: "yes", text: "Asegúrate del sandwich: ROL al inicio → CONTEXTO técnico fijo → REGLAS → RECORDATORIO al final." },
          { type: "no", text: "El agente opera sin marco. Prioridad alta: arma los 5 bloques esenciales (rol, contexto, reglas, formato, recordatorio)." },
        ],
      },
      {
        question: "¿Tienes .claudeignore / .cursorignore configurado?",
        branches: [
          { type: "no", text: "Excluye node_modules/, dist/, *.lock, .git/. Puede ahorrar hasta el 50% del presupuesto de tokens en repos grandes.",
            code: "# .claudeignore\nnode_modules/\ndist/\nbuild/\n*.lock\n.git/\ncoverage/" },
        ],
      },
    ],
  },
  {
    num: "2", title: "Al pedir una tarea nueva", color: T.green,
    badge: "tarea",
    nodes: [
      {
        question: "¿La tarea tiene partes ambiguas o asunciones implícitas?",
        branches: [
          { type: "yes", text: "Pide que haga preguntas primero. No permitas que asuma.",
            code: "\"Hazme todas las preguntas que necesites antes de comenzar.\nNo escribas código hasta que yo responda.\"" },
          { type: "no", text: "Procede, pero inyecta @archivo relevante directamente en el mensaje para dar contexto concreto." },
        ],
      },
      {
        question: "¿La tarea es compleja o puede tomar un camino costoso?",
        branches: [
          { type: "yes", text: "Activa Plan Mode primero. Revisa el plan antes de ejecutar.",
            code: "\"Analiza el problema y dime:\n1. Qué archivos necesitas leer\n2. Qué cambios propones\n3. Posibles riesgos\nNo modifiques nada hasta que yo apruebe.\"" },
          { type: "no", text: "Tarea simple: inyecta @archivos específicos y procede directamente. No uses Plan Mode para cambios de 1-2 líneas." },
        ],
      },
      {
        question: "¿La tarea requiere explorar muchos archivos o todo el repositorio?",
        branches: [
          { type: "yes", text: "Delega la exploración a un subagente para no saturar el contexto principal.",
            code: "\"Usa la herramienta Task para catalogar todos los endpoints.\nReporta solo el resumen al contexto principal.\nNo incluyas el contenido completo de los archivos.\"" },
        ],
      },
    ],
  },
  {
    num: "3", title: "Durante la conversación", color: T.amber,
    badge: "contexto activo",
    nodes: [
      {
        question: "¿El agente sugirió algo que ya intentamos antes?",
        branches: [
          { type: "yes", text: "Inyecta contraste explícito. Sin esto, el agente repetirá el mismo camino.",
            code: "\"Lo que YA intentamos y NO funcionó: X, Y.\nLo que AÚN no verificamos: Z.\nEnfócate SOLO en Z.\"" },
        ],
      },
      {
        question: "¿La conversación lleva +10 turnos con información crítica al inicio?",
        branches: [
          { type: "yes", text: "Inyecta memoria activa manual antes de tu próximo mensaje. El modelo atiende más al inicio y al final.",
            code: "\"Estado actual:\n✓ Problema identificado: race condition en OrderController\n✓ Fix aplicado en línea 47\n✗ Pendiente: tests y migración\nContinuando con los tests...\"" },
        ],
      },
      {
        question: "¿El agente parece haber \"olvidado\" el objetivo principal?",
        branches: [
          { type: "yes", text: "Ancla el objetivo explícitamente al inicio del mensaje.",
            code: "\"OBJETIVO ORIGINAL (no ha cambiado): refactorizar auth sin romper sesiones existentes.\nTeniendo eso en mente, analiza el error actual.\"" },
        ],
      },
      {
        question: "¿Hay información que debe ser absolutamente visible para el modelo?",
        branches: [
          { type: "yes", text: "Envuélvela en XML tags semánticos — el modelo les presta atención especial.",
            code: "<critical_context>\nEl cliente tiene datos en producción que NO deben modificarse.\nCualquier migración debe ser reversible.\n</critical_context>\n\n¿Cómo implementarías el cambio?" },
        ],
      },
    ],
  },
  {
    num: "4", title: "Gestión del contexto", color: T.red,
    badge: "mantenimiento",
    nodes: [
      {
        question: "¿El contexto está al 80% o más?",
        branches: [
          { type: "yes", text: "Ejecuta /compact ahora. Esperar al 95% activa el auto-compact de Claude Code y pierdes control sobre qué se comprime.",
            code: "# Claude Code\n/compact\n\n# Cursor / Windsurf\nAbrir nuevo chat con resumen del estado actual" },
        ],
      },
      {
        question: "¿El agente falló 2+ veces seguidas en la misma cosa?",
        branches: [
          { type: "yes", text: "Context poisoning probable. El contexto contaminado es peor que empezar de cero.",
            code: "# Limpiar completamente\n/clear\n\n# Reexplicar con archivos específicos\n\"El problema es X. Lee @archivo.ts\nEl error es: [pegar error exacto]\"" },
        ],
      },
      {
        question: "¿Empiezas una tarea completamente distinta?",
        branches: [
          { type: "yes", text: "Usa /clear para evitar prompt drift. El contexto anterior contamina las respuestas de la tarea nueva." },
          { type: "no", text: "Continúa la sesión. El historial acumulado es valioso si la tarea es la misma." },
        ],
      },
      {
        question: "¿Hay un hecho clave que debe sobrevivir entre sesiones?",
        branches: [
          { type: "yes", text: "Guárdalo en engram (memoria persistente). Se inyectará automáticamente en futuras sesiones.",
            code: "\"Recuerda para futuras sesiones que:\nusamos Sanctum para auth, no JWT.\nEl campo 'status' en orders usa enum, no string.\"" },
        ],
      },
    ],
  },
  {
    num: "5", title: "Cuando la calidad baja", color: T.blue,
    badge: "recuperación",
    nodes: [
      {
        question: "¿La respuesta es genérica o demasiado amplia?",
        branches: [
          { type: "do", text: "Añade @archivos concretos. El 80% del contexto útil viene de archivos reales, no de descripciones en texto.",
            code: "# En vez de:\n\"Tengo un problema con el login\"\n\n# Haz esto:\n\"@LoginController.php @AuthService.ts\nEl problema está en la línea 89, el token no se invalida.\"" },
        ],
      },
      {
        question: "¿Necesitas razonamiento profundo en una tarea compleja?",
        branches: [
          { type: "do", text: "Activa Chain of Thought explícitamente.",
            code: "\"Piensa paso a paso. Antes de responder:\n1. ¿Qué información tienes disponible?\n2. ¿Qué información falta?\n3. ¿Cuál es la solución más simple posible?\"" },
        ],
      },
      {
        question: "¿El formato de respuesta no es lo que necesitas?",
        branches: [
          { type: "do", text: "Few-shot: muestra un ejemplo del output exacto que esperas. Mostrar es 10× más eficiente que describir.",
            code: "\"Quiero el output en este formato exacto:\n[ARCHIVO]: src/api/auth.ts\n[LÍNEA]: 89\n[PROBLEMA]: token no se invalida\n[FIX]: agregar await session.destroy()\"" },
        ],
      },
      {
        question: "¿La tarea es demasiado grande para una sola petición?",
        branches: [
          { type: "do", text: "Prompt chaining: divide en pasos donde la salida de uno es la entrada del siguiente. Cada paso tiene contexto limpio.",
            code: "# Paso 1\n\"Analiza el código y lista SOLO los problemas. No corrijas nada.\"\n\n# Paso 2 (usando output del 1)\n\"Dado este análisis: [pegar output]\nCorrige SOLO el problema de seguridad.\"" },
        ],
      },
    ],
  },
];

export default function S13DecisionTree() {
  return (
    <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
      <SectionTitle
        icon="🗺️"
        title="Guía de Decisiones para Prompting"
        color={T.purple}
        subtitle="Un árbol de decisiones práctico para cada situación en una sesión de trabajo con un agente de IA. Expande cada sección según el momento en que estás."
      />

      {/* Quick reference badges */}
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20,
        padding: "10px 14px",
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 8,
      }}>
        <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, alignSelf: "center" }}>REFERENCIA RÁPIDA:</span>
        {[
          { label: "/compact", desc: "contexto al 80%+", color: T.amber },
          { label: "/clear", desc: "tarea nueva o 2+ fallos", color: T.red },
          { label: "Plan Mode", desc: "tarea compleja", color: T.blue },
          { label: "@archivo", desc: "respuesta genérica", color: T.cyan },
          { label: "engram", desc: "persistir entre sesiones", color: T.pink },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{
              fontFamily: T.mono, fontSize: 10, color: r.color,
              background: `${r.color}18`, border: `1px solid ${r.color}44`,
              padding: "2px 8px", borderRadius: 12, fontWeight: 600,
            }}>{r.label}</span>
            <span style={{ fontFamily: T.sans, fontSize: 11, color: T.textDim }}>{r.desc}</span>
          </div>
        ))}
      </div>

      {/* Decision tree sections */}
      {SECTIONS.map((s, i) => (
        <TreeSection
          key={i}
          num={s.num}
          title={s.title}
          color={s.color}
          badge={s.badge}
          nodes={s.nodes}
          defaultOpen={i === 0}
        />
      ))}

      <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Callout color={T.purple} icon="🧠">
          <strong style={{ color: T.text }}>La regla de oro:</strong> sé específico con archivos, explícito con el objetivo, y limpio con el contexto. Los problemas de calidad casi siempre son problemas de contexto.
        </Callout>
        <Callout color={T.green} icon="🔄">
          <strong style={{ color: T.text }}>Iteración inteligente:</strong> cuando algo no funciona, no repitas — cambia el contexto. Añade lo que falta, elimina lo que contamina, ancla el objetivo.
        </Callout>
      </div>
    </div>
  );
}
