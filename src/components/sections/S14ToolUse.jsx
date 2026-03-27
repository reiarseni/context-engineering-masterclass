import { useState } from "react";
import { T } from "../tokens.js";
import { Badge, Callout, SectionTitle, CodeBlock, useMobile } from "../shared.jsx";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const TOOL_CALL_PHASES = [
  {
    id: "decide", icon: "🧠", label: "LLM decide",
    color: T.blue,
    desc: "El modelo recibe tu mensaje + contexto y razona: '¿necesito ejecutar herramientas para responder esto?'",
    detail: "Si la tarea requiere información del entorno (archivos, terminal, web), el modelo emite un tool_use block en lugar de texto.",
  },
  {
    id: "call", icon: "📤", label: "Emite tool_use",
    color: T.purple,
    desc: "El modelo devuelve un bloque estructurado con el nombre de la herramienta y los parámetros.",
    detail: `{ "type": "tool_use", "name": "read_file", "input": { "path": "src/api/auth.ts" } }`,
    isCode: true,
  },
  {
    id: "exec", icon: "⚙️", label: "Agente ejecuta",
    color: T.cyan,
    desc: "El agente (Cursor, Claude Code, etc.) intercepta el bloque y ejecuta la acción real en el sistema.",
    detail: "El LLM no ejecuta nada directamente. Es el runtime del agente quien tiene acceso al filesystem, terminal y red.",
  },
  {
    id: "result", icon: "📥", label: "tool_result al contexto",
    color: T.amber,
    desc: "El resultado de la herramienta se inyecta como tool_result en el contexto y se reenvía al LLM.",
    detail: `{ "type": "tool_result", "tool_use_id": "xyz", "content": "export async function login(..." }`,
    isCode: true,
  },
  {
    id: "respond", icon: "💬", label: "LLM responde",
    color: T.green,
    desc: "Ahora con la información real en contexto, el modelo puede responder con precisión o continuar llamando más herramientas.",
    detail: "Este ciclo puede repetirse múltiples veces antes de dar la respuesta final. Cada iteración consume tokens.",
  },
];

const PARALLEL_SCENARIO = {
  naive: {
    label: "Secuencial (naive)",
    color: T.red,
    rounds: 3,
    calls: [
      { tool: "read_file", arg: "OrderController.php", tokens: 820 },
      { tool: "read_file", arg: "Order.php (model)", tokens: 640 },
      { tool: "read_file", arg: "orders_migration.php", tokens: 390 },
    ],
    totalRounds: 3,
    desc: "3 round-trips al LLM. El modelo espera cada resultado antes de pedir el siguiente.",
  },
  parallel: {
    label: "Paralelo (óptimo)",
    color: T.green,
    rounds: 1,
    calls: [
      { tool: "read_file", arg: "OrderController.php", tokens: 820 },
      { tool: "read_file", arg: "Order.php (model)", tokens: 640 },
      { tool: "read_file", arg: "orders_migration.php", tokens: 390 },
    ],
    totalRounds: 1,
    desc: "1 round-trip. El modelo emite 3 tool_use blocks en una sola respuesta — el agente los ejecuta en paralelo.",
  },
};

const ERROR_RECOVERY_STEPS = [
  { label: "LLM llama herramienta", status: "ok", color: T.blue,
    detail: `read_file("utils/auth.helper.ts")` },
  { label: "Herramienta falla", status: "error", color: T.red,
    detail: `Error: ENOENT: no such file or directory` },
  { label: "Error entra al contexto", status: "ok", color: T.amber,
    detail: "tool_result con el error se inyecta — el LLM VE el fallo" },
  { label: "LLM razona y corrige", status: "ok", color: T.purple,
    detail: `list_files("utils/") → ["auth.ts", "helpers.ts", ...]` },
  { label: "LLM reintenta con ruta correcta", status: "ok", color: T.green,
    detail: `read_file("utils/auth.ts") → éxito` },
];

const CHAIN_STEPS = [
  { icon: "🔍", tool: "bash('git diff HEAD')", result: "Lista de archivos modificados", color: T.blue },
  { icon: "📄", tool: "read_file(changed_files[])", result: "Contenido de cada archivo", color: T.cyan },
  { icon: "🧪", tool: "bash('npm test')", result: "Output de los tests", color: T.purple },
  { icon: "✏️", tool: "write_file(fix)", result: "Archivos corregidos", color: T.amber },
  { icon: "✅", tool: "bash('npm test')", result: "Tests en verde", color: T.green },
];

const TOOL_DESIGN = [
  {
    bad: `read_file(filename: string)`,
    good: `read_file(path: string, reason?: "debug" | "refactor" | "understand")`,
    why: "El parámetro reason reduce ambigüedad y permite al modelo ser más preciso en su solicitud.",
    color: T.cyan,
  },
  {
    bad: `run_command(cmd: string)`,
    good: `run_tests(filter?: string, timeout?: number)`,
    why: "Herramientas específicas > comandos genéricos. El modelo entiende mejor qué está haciendo.",
    color: T.purple,
  },
  {
    bad: `search(query: string)`,
    good: `search_code(pattern: string, scope: "project" | "file", file?: string)`,
    why: "Scope explícito evita búsquedas costosas en todo el repositorio cuando solo se necesita un archivo.",
    color: T.amber,
  },
];

/* ─── Sub-components ────────────────────────────────────────────────────── */

function PhaseStep({ phase, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", gap: 12, padding: "10px 14px",
        background: active ? `${phase.color}15` : T.surface2,
        border: `1px solid ${active ? phase.color + "55" : T.border}`,
        borderRadius: 8, cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{phase.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: T.mono, fontSize: 12, fontWeight: 600,
          color: active ? phase.color : T.textMid, marginBottom: 2,
        }}>{phase.label}</div>
        <div style={{ fontFamily: T.sans, fontSize: 11, color: T.textDim, lineHeight: 1.5 }}>
          {phase.desc}
        </div>
      </div>
      <div style={{
        fontFamily: T.mono, fontSize: 9, color: active ? phase.color : T.border,
        alignSelf: "center",
      }}>▶</div>
    </div>
  );
}

function ParallelViz({ mode }) {
  const s = PARALLEL_SCENARIO[mode];
  return (
    <div style={{
      flex: 1, background: T.surface2, border: `1px solid ${s.color}33`,
      borderRadius: 8, padding: 14,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontFamily: T.mono, fontSize: 12, color: s.color, fontWeight: 600 }}>
          {s.label}
        </span>
        <span style={{
          fontFamily: T.mono, fontSize: 10, color: s.color,
          background: `${s.color}22`, border: `1px solid ${s.color}44`,
          padding: "1px 8px", borderRadius: 12,
        }}>
          {s.totalRounds} round-trip{s.totalRounds > 1 ? "s" : ""}
        </span>
      </div>

      {mode === "naive" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {s.calls.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: T.red, flexShrink: 0,
              }} />
              <div style={{
                flex: 1, background: `${T.red}15`, border: `1px solid ${T.red}33`,
                borderRadius: 4, padding: "5px 8px",
              }}>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid }}>
                  {c.tool}(<em style={{ color: T.red }}>"{c.arg}"</em>)
                </span>
              </div>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, flexShrink: 0 }}>
                {c.tokens}t
              </span>
            </div>
          ))}
          <div style={{
            marginTop: 4, fontFamily: T.mono, fontSize: 10, color: T.red,
            textAlign: "center", padding: "3px 0",
            borderTop: `1px dashed ${T.border}`,
          }}>
            3 × (request + wait + response)
          </div>
        </div>
      ) : (
        <div>
          <div style={{
            background: `${T.green}0f`, border: `1px solid ${T.green}33`,
            borderRadius: 6, padding: "8px 10px", marginBottom: 8,
          }}>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.green, marginBottom: 6, fontWeight: 600 }}>
              1 respuesta del LLM con 3 tool_use blocks:
            </div>
            {s.calls.map((c, i) => (
              <div key={i} style={{
                fontFamily: T.mono, fontSize: 10, color: T.textMid,
                padding: "2px 0",
              }}>
                <span style={{ color: T.green }}>→</span> {c.tool}("<em>{c.arg}</em>")
              </div>
            ))}
          </div>
          <div style={{
            fontFamily: T.mono, fontSize: 10, color: T.green,
            textAlign: "center", padding: "3px 0",
            borderTop: `1px dashed ${T.border}`,
          }}>
            1 × (request + parallel exec + response)
          </div>
        </div>
      )}

      <div style={{
        marginTop: 8, fontFamily: T.sans, fontSize: 11, color: T.textDim,
        lineHeight: 1.5, fontStyle: "italic",
      }}>
        {s.desc}
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */

export default function S14ToolUse() {
  const isMobile = useMobile();
  const [activePhase, setActivePhase] = useState(0);
  const [showDesign, setShowDesign] = useState(0);

  const phase = TOOL_CALL_PHASES[activePhase];

  return (
    <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
      <SectionTitle
        icon="🔧"
        title="Tool Use — El Ciclo de Ejecución"
        color={T.cyan}
        subtitle="Cómo el LLM decide, emite y encadena llamadas a herramientas. El puente entre el razonamiento del modelo y la ejecución real en tu sistema."
      />

      {/* ── 1. The tool call cycle ── */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 10, padding: 18, marginBottom: 20,
      }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 14 }}>
          EL CICLO TOOL USE — click en cada fase para ver el detalle
        </p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {TOOL_CALL_PHASES.slice(0, 4).map((p, i) => (
            <PhaseStep key={i} phase={p} active={activePhase === i} onClick={() => setActivePhase(i)} />
          ))}
        </div>
        <PhaseStep
          phase={TOOL_CALL_PHASES[4]}
          active={activePhase === 4}
          onClick={() => setActivePhase(4)}
        />

        {/* Detail panel */}
        <div style={{
          marginTop: 14,
          background: `${phase.color}0d`,
          border: `1px solid ${phase.color}44`,
          borderRadius: 8, padding: 14,
          animation: "fadeSlideIn 0.2s ease",
          minHeight: 70,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>{phase.icon}</span>
            <span style={{ fontFamily: T.mono, fontSize: 12, color: phase.color, fontWeight: 600 }}>
              {phase.label}
            </span>
          </div>
          {phase.isCode ? (
            <div style={{
              fontFamily: T.mono, fontSize: 11, color: T.textMid,
              background: T.surface2, border: `1px solid ${T.border}`,
              borderRadius: 6, padding: "8px 12px", lineHeight: 1.6,
            }}>
              {phase.detail}
            </div>
          ) : (
            <p style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.6 }}>
              {phase.detail}
            </p>
          )}
        </div>
      </div>

      {/* ── 2. Parallel vs Sequential ── */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 10, padding: 18, marginBottom: 20,
      }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 4 }}>
          PARALLEL TOOL CALLING — un round-trip vs tres
        </p>
        <p style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, marginBottom: 14, lineHeight: 1.6 }}>
          Cuando el modelo necesita múltiples piezas de información independientes, puede emitir varios{" "}
          <code style={{ fontFamily: T.mono, color: T.cyan }}>tool_use</code> blocks en una sola respuesta.
          El agente los ejecuta en paralelo — reduciendo round-trips de 3 a 1.
        </p>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
          <ParallelViz mode="naive" />
          <ParallelViz mode="parallel" />
        </div>
        <div style={{
          marginTop: 12, padding: "8px 12px",
          background: `${T.green}0a`, border: `1px solid ${T.green}33`,
          borderRadius: 6, fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.5,
        }}>
          <strong style={{ color: T.green }}>Implicación para el prompt:</strong> Si tu instrucción menciona varios archivos o recursos, el modelo bien instruido los pedirá todos en paralelo. Frases como{" "}
          <em style={{ color: T.text }}>"lee los archivos necesarios antes de responder"</em> activan este comportamiento.
        </div>
      </div>

      {/* ── 3. Error recovery ── */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 10, padding: 18, marginBottom: 20,
      }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 4 }}>
          ERROR RECOVERY — el agente ve sus propios fallos
        </p>
        <p style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, marginBottom: 14, lineHeight: 1.6 }}>
          Cuando una herramienta falla, el error se inyecta como{" "}
          <code style={{ fontFamily: T.mono, color: T.amber }}>tool_result</code> en el contexto.
          El LLM lo lee y puede corregir su siguiente acción automáticamente.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {ERROR_RECOVERY_STEPS.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              {/* Connector */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: "50%", marginTop: 10,
                  background: step.status === "error" ? T.red : step.color,
                  border: `2px solid ${step.status === "error" ? T.red : step.color}`,
                  boxShadow: `0 0 6px ${step.status === "error" ? T.red : step.color}55`,
                  flexShrink: 0,
                }} />
                {i < ERROR_RECOVERY_STEPS.length - 1 && (
                  <div style={{
                    width: 1, flex: 1, minHeight: 16,
                    background: i === 1 ? `linear-gradient(${T.red}, ${T.amber})` : T.border,
                  }} />
                )}
              </div>
              <div style={{
                flex: 1, padding: "8px 0",
                borderBottom: i < ERROR_RECOVERY_STEPS.length - 1 ? `1px solid ${T.border}22` : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{
                    fontFamily: T.sans, fontSize: 12, fontWeight: 500,
                    color: step.status === "error" ? T.red : T.text,
                  }}>
                    {step.label}
                  </span>
                  {step.status === "error" && (
                    <span style={{
                      fontFamily: T.mono, fontSize: 9, color: T.red,
                      background: `${T.red}22`, border: `1px solid ${T.red}44`,
                      padding: "1px 6px", borderRadius: 4,
                    }}>ERROR</span>
                  )}
                </div>
                <div style={{
                  fontFamily: T.mono, fontSize: 10,
                  color: step.status === "error" ? T.red : T.textDim,
                  lineHeight: 1.5,
                }}>
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Tool chaining ── */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 10, padding: 18, marginBottom: 20,
      }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 4 }}>
          TOOL CHAINING — output de una herramienta alimenta la siguiente
        </p>
        <p style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, marginBottom: 14, lineHeight: 1.6 }}>
          Los agentes pueden encadenar herramientas secuencialmente cuando cada paso depende del anterior.
          El modelo razona entre cada resultado y decide el siguiente tool call.
        </p>
        <div style={{ display: "flex", gap: 6, alignItems: "center", overflowX: "auto", paddingBottom: 4 }}>
          {CHAIN_STEPS.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                background: `${step.color}15`, border: `1px solid ${step.color}44`,
                borderRadius: 7, padding: "8px 12px",
                display: "flex", flexDirection: "column", gap: 4, minWidth: 130,
              }}>
                <div style={{ fontSize: 14 }}>{step.icon}</div>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: step.color, fontWeight: 600 }}>
                  {step.tool}
                </div>
                <div style={{ fontFamily: T.sans, fontSize: 10, color: T.textDim }}>
                  → {step.result}
                </div>
              </div>
              {i < CHAIN_STEPS.length - 1 && (
                <span style={{ fontFamily: T.mono, fontSize: 14, color: T.border }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Tool design ── */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 10, padding: 18, marginBottom: 20,
      }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 4 }}>
          DISEÑO DE HERRAMIENTAS — el nombre y parámetros importan
        </p>
        <p style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, marginBottom: 14, lineHeight: 1.6 }}>
          El LLM elige qué herramienta usar y con qué argumentos basándose únicamente en su nombre y descripción.
          Un buen diseño reduce errores y mejora la precisión.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {TOOL_DESIGN.map((t, i) => (
            <button key={i} onClick={() => setShowDesign(i)} style={{
              fontFamily: T.mono, fontSize: 10, padding: "4px 12px", borderRadius: 6,
              cursor: "pointer", transition: "all 0.15s",
              background: showDesign === i ? `${t.color}22` : T.surface2,
              border: `1px solid ${showDesign === i ? t.color : T.border}`,
              color: showDesign === i ? t.color : T.textDim,
            }}>
              ejemplo {i + 1}
            </button>
          ))}
        </div>
        {(() => {
          const d = TOOL_DESIGN[showDesign];
          return (
            <div style={{ animation: "fadeSlideIn 0.2s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div style={{
                  background: `${T.red}0a`, border: `1px solid ${T.red}33`,
                  borderRadius: 6, padding: "10px 12px",
                }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9, color: T.red, marginBottom: 6 }}>❌ EVITAR</div>
                  <code style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid }}>{d.bad}</code>
                </div>
                <div style={{
                  background: `${T.green}0a`, border: `1px solid ${T.green}33`,
                  borderRadius: 6, padding: "10px 12px",
                }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9, color: T.green, marginBottom: 6 }}>✓ PREFERIR</div>
                  <code style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid }}>{d.good}</code>
                </div>
              </div>
              <div style={{
                fontFamily: T.sans, fontSize: 12, color: T.textMid,
                padding: "8px 12px", background: `${d.color}0a`,
                border: `1px solid ${d.color}33`, borderRadius: 6, lineHeight: 1.6,
              }}>
                <strong style={{ color: d.color }}>Por qué:</strong> {d.why}
              </div>
            </div>
          );
        })()}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <Callout color={T.cyan} icon="⚡">
          <strong style={{ color: T.text }}>Tool use ≠ magia:</strong> el LLM no "hace" nada directamente. Emite instrucciones estructuradas que el runtime del agente intercepta y ejecuta. El modelo ve los resultados como texto en su contexto.
        </Callout>
        <Callout color={T.amber} icon="💡">
          <strong style={{ color: T.text }}>Costo oculto:</strong> cada tool result es tokens adicionales en el contexto. Un bash output de 200 líneas puede agregar 3,000 tokens que viajan en todos los turnos siguientes.
        </Callout>
      </div>
    </div>
  );
}
