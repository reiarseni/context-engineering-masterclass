import { useState, useEffect } from "react";
import { T } from "../tokens.js";
import { Callout, SectionTitle, Badge, useMobile } from "../shared.jsx";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const AGENTS = [
  {
    id: "claude-code",
    icon: "⌨️",
    name: "Claude Code",
    maker: "Anthropic",
    color: T.purple,
    price: "desde $20/mes",
    model: "Solo Anthropic",
    where: "Terminal + extensión IDE",
    openSource: false,
    freeTier: false,
    mcp: true,
    planMode: false,
    cicd: true,
    rules: "CLAUDE.md",
    tagline: "El más poderoso en terminal. Orquestación multi-agente nativa.",
    pros: [
      "Creador del estándar MCP — integración más profunda",
      "CLAUDE.md es el sistema de instrucciones más maduro",
      "Sub-agentes y paralelización de tareas nativas",
      "CI/CD nativo (GitHub Actions, GitLab)",
      "Tareas programadas y modo headless/pipe",
      "Extended thinking para razonamiento profundo",
      "Multiplataforma: terminal, IDE, web, móvil",
    ],
    cons: [
      "Sin tier gratuito — mínimo $20/mes",
      "Solo modelos Anthropic (sin elección de proveedor)",
      "Curva de aprendizaje en terminal para developers no-CLI",
      "Límites de uso compartidos con claude.ai (mismo plan)",
    ],
    idealFor: "Teams que quieren CI/CD con IA, power users de terminal, proyectos que necesitan orquestación multi-agente o automatización compleja.",
  },
  {
    id: "opencode",
    icon: "🖥️",
    name: "OpenCode",
    maker: "SST (open source)",
    color: T.cyan,
    price: "$0 (pagas API)",
    model: "75+ modelos / cualquier proveedor",
    where: "Terminal TUI",
    openSource: true,
    freeTier: true,
    mcp: true,
    planMode: true,
    cicd: true,
    rules: "AGENTS.md",
    tagline: "Control total. Cualquier modelo, cualquier proveedor, sin suscripción.",
    pros: [
      "Completamente gratuito — solo pagas tu API",
      "Mayor flexibilidad de modelos: 75+ (Claude, GPT, Gemini, DeepSeek, Ollama local)",
      "Plan mode nativo con toggle explícito (tecla Tab)",
      "Filosofía Unix: composable, scriptable, pipeable",
      "Sin vendor lock-in — cambias de modelo en segundos",
      "MCP completo con control granular por agente",
      "130K+ stars en GitHub — comunidad muy activa",
    ],
    cons: [
      "Sin GUI propia — puramente terminal TUI",
      "Requiere gestionar tus propias API keys y facturas",
      "Integración con IDE es indirecta (terminal dentro del IDE)",
      "Soporte comunitario, no oficial",
    ],
    idealFor: "Developers avanzados que priorizan control total sobre modelo y costos, usuarios de terminal, quienes necesitan rotar entre múltiples proveedores de LLM.",
  },
  {
    id: "windsurf",
    icon: "🌊",
    name: "Windsurf",
    maker: "Codeium",
    color: T.blue,
    price: "Free tier + $20/mes Pro",
    model: "SWE-1.5 propio + multi-modelo",
    where: "IDE completo (fork VS Code) + plugin JetBrains",
    openSource: false,
    freeTier: true,
    mcp: true,
    planMode: false,
    cicd: false,
    rules: ".windsurfrules",
    tagline: "IDE completo con IA agentic. El más visual de la lista.",
    pros: [
      "Free tier funcional con autocompletado ilimitado",
      "Cascade es muy capaz para tareas multi-archivo",
      "Modelo propio SWE-1.5 optimizado para software engineering",
      "Previews de apps web en vivo dentro del IDE",
      "Despliegues a Netlify directamente desde Cascade",
      "Plugin para JetBrains con paridad de características",
      "MCP integrado con Plugin Store visual",
    ],
    cons: [
      "IDE propietario — fork privado de VS Code",
      "Sistema de créditos puede ser opaco en la facturación",
      "SWE-1.5 tiene inconsistencias en codebases legacy complejos",
      "Vendor lock-in: configuraciones atadas al IDE",
      "Sin integración nativa con GitHub Actions / CI",
    ],
    idealFor: "Developers que quieren un IDE completo con IA sin abandonar el entorno VS Code, equipos que valoran previews visuales y deploys integrados, quienes buscan free tier.",
  },
  {
    id: "copilot",
    icon: "🐙",
    name: "GitHub Copilot",
    maker: "Microsoft / GitHub",
    color: T.green,
    price: "Free tier + $10/mes Pro",
    model: "GPT-4.1, Claude Opus 4.6, Gemini (seleccionable)",
    where: "Extensión VS Code, JetBrains, Xcode, Neovim, Visual Studio",
    openSource: false,
    freeTier: true,
    mcp: true,
    planMode: true,
    cicd: true,
    rules: ".github/copilot-instructions.md",
    tagline: "El más integrado con GitHub. Mayor cobertura de IDEs.",
    pros: [
      "Mayor cobertura de IDEs del mercado (VS Code, JetBrains, Xcode, Neovim, Eclipse)",
      "Free tier más generoso: 2,000 completions y 50 chats/mes",
      "Pro en $10/mes — el punto de entrada más económico",
      "Copilot Workspace: issue → plan → código integrado en GitHub.com",
      "Multi-modelo con selección manual (Claude, GPT, Gemini)",
      "Integración nativa con GitHub Actions y Copilot coding agent",
    ],
    cons: [
      "Agent mode no tan maduro como Claude Code o Cline en tareas largas",
      "Premium requests se agotan rápido en uso intensivo ($0.04/request extra)",
      "Copilot Workspace solo en GitHub.com, no en el IDE",
      "Instrucciones custom menos flexibles que CLAUDE.md o .clinerules",
      "Enterprise requiere activar MCP explícitamente (off por defecto)",
    ],
    idealFor: "Developers que viven en el ecosistema GitHub, equipos con workflows basados en issues/PRs, organizations que necesitan cobertura multi-IDE y auditoría de código.",
  },
  {
    id: "cline",
    icon: "🤖",
    name: "Cline",
    maker: "Cline (antes Claude Dev)",
    color: T.amber,
    price: "$0 extensión (pagas API)",
    model: "10+ proveedores: Anthropic, OpenAI, Gemini, Bedrock, Ollama...",
    where: "Extensión VS Code (principalmente) + JetBrains en desarrollo",
    openSource: true,
    freeTier: true,
    mcp: true,
    planMode: true,
    cicd: false,
    rules: ".clinerules (con conditional rules)",
    tagline: "Plan/Act mode más maduro. MCP marketplace con 100+ servidores.",
    pros: [
      "Plan/Act mode: el sistema de planificación más explícito del mercado",
      "Mayor soporte de proveedores de todos los agentes comparados",
      "MCP marketplace con 100+ servidores integrados",
      ".clinerules con conditional rules — las instrucciones más avanzadas",
      "Asigna modelos distintos para Plan y Act (optimiza costos)",
      "Extensión gratuita y open source (AGPL-3.0)",
      "5M+ instalaciones, 59.5K stars en GitHub",
    ],
    cons: [
      "Sin IDE propio — depende de VS Code o JetBrains",
      "Hay que gestionar múltiples API keys y facturas",
      "Curva de aprendizaje mayor: muchas opciones de configuración",
      "Sin integración nativa con GitHub Actions / CI/CD",
      "El tier Teams está en transición de negocio (pricing incierto)",
    ],
    idealFor: "Developers avanzados que quieren máximo control, quienes optimizan costos por tarea, proyectos que necesitan la integración MCP más amplia, usuarios de VS Code que no quieren cambiar de IDE.",
  },
];

const PROFILES = [
  {
    label: "Quiero control total y pagar solo lo que uso",
    agents: ["opencode", "cline"],
    reason: "Ambos son gratuitos como herramienta — solo pagas la API que elijas.",
  },
  {
    label: "Soy desarrollador full-time y uso Claude diariamente",
    agents: ["claude-code"],
    reason: "Max 20x ($200/mes) es el único plan donde los límites no son obstáculo real.",
  },
  {
    label: "Quiero empezar sin pagar nada",
    agents: ["windsurf", "copilot"],
    reason: "Windsurf tiene autocompletado ilimitado gratis. Copilot tiene 2,000 completions + 50 chats gratis.",
  },
  {
    label: "Mi equipo trabaja con GitHub Issues y PRs",
    agents: ["copilot"],
    reason: "Copilot Workspace convierte issues en código directamente en GitHub.com.",
  },
  {
    label: "Necesito CI/CD y automatización programada",
    agents: ["claude-code", "copilot"],
    reason: "Claude Code tiene GitHub/GitLab Actions nativo. Copilot tiene el coding agent en Actions.",
  },
  {
    label: "Uso múltiples modelos o quiero cambiar fácilmente",
    agents: ["opencode", "cline"],
    reason: "OpenCode soporta 75+ modelos. Cline permite asignar modelos diferentes para Plan y Act.",
  },
  {
    label: "Trabajo en JetBrains (IntelliJ, PyCharm, etc.)",
    agents: ["windsurf", "copilot"],
    reason: "Windsurf tiene plugin JetBrains con paridad total. Copilot tiene extensión oficial para todos los IDEs JetBrains.",
  },
  {
    label: "Quiero el mejor Plan Mode para planificar antes de actuar",
    agents: ["cline", "opencode"],
    reason: "Cline tiene el Plan/Act mode más maduro. OpenCode tiene el toggle más rápido (tecla Tab).",
  },
];

const TABLE_FEATURES = [
  { label: "Precio mínimo", values: { "claude-code": "$20/mes", opencode: "$0", windsurf: "$0", copilot: "$0", cline: "$0" } },
  { label: "Modelos disponibles", values: { "claude-code": "Solo Anthropic", opencode: "75+", windsurf: "Propios + 8+", copilot: "3 seleccionables", cline: "10+ proveedores" } },
  { label: "Plan Mode explícito", values: { "claude-code": "—", opencode: "✓", windsurf: "—", copilot: "Workspace (web)", cline: "✓ (más maduro)" } },
  { label: "MCP", values: { "claude-code": "✓ (creador)", opencode: "✓", windsurf: "✓", copilot: "✓", cline: "✓ (marketplace)" } },
  { label: "CI/CD nativo", values: { "claude-code": "✓", opencode: "✓ (Actions)", windsurf: "—", copilot: "✓", cline: "—" } },
  { label: "Open source", values: { "claude-code": "—", opencode: "✓ MIT", windsurf: "—", copilot: "—", cline: "✓ AGPL" } },
  { label: "Archivo de reglas", values: { "claude-code": "CLAUDE.md", opencode: "AGENTS.md", windsurf: ".windsurfrules", copilot: "copilot-instructions.md", cline: ".clinerules" } },
];

/* ─── Sub-components ────────────────────────────────────────────────────── */

function AgentCard({ agent, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? `${agent.color}15` : T.surface2,
        border: `1px solid ${selected ? agent.color + "66" : T.border}`,
        borderRadius: 10, padding: "12px 14px", cursor: "pointer",
        transition: "all 0.2s ease", flex: 1, minWidth: 0,
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 6 }}>{agent.icon}</div>
      <div style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700, color: selected ? agent.color : T.text, marginBottom: 3 }}>
        {agent.name}
      </div>
      <div style={{ fontFamily: T.sans, fontSize: 10, color: T.textDim, marginBottom: 8 }}>{agent.maker}</div>
      <div style={{
        fontFamily: T.mono, fontSize: 10, color: agent.color,
        background: `${agent.color}18`, border: `1px solid ${agent.color}33`,
        padding: "2px 7px", borderRadius: 10, display: "inline-block",
      }}>
        {agent.price}
      </div>
    </div>
  );
}

function FeatureTag({ yes, label }) {
  return (
    <span style={{
      fontFamily: T.mono, fontSize: 9, fontWeight: 600,
      padding: "2px 7px", borderRadius: 4,
      background: yes ? `${T.green}22` : `${T.border}44`,
      color: yes ? T.green : T.textDim,
      border: `1px solid ${yes ? T.green + "44" : T.border}`,
    }}>{label}</span>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────────── */

function agentFromHash() {
  if (typeof window === "undefined") return "claude-code";
  const hash = window.location.hash.replace("#", "");
  return AGENTS.find(a => a.id === hash) ? hash : "claude-code";
}

export default function S15AgentChooser() {
  const isMobile = useMobile();
  const [selected, setSelected] = useState(() => agentFromHash());
  const [profileTab, setProfileTab] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const agent = AGENTS.find(a => a.id === selected);

  const selectAgent = (id) => {
    history.pushState(null, "", window.location.pathname + "#" + id);
    setSelected(id);
  };

  useEffect(() => {
    const onPop = () => setSelected(agentFromHash());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
      <SectionTitle
        icon="🎯"
        title="¿Qué agente elegir?"
        color={T.green}
        subtitle="Comparativa práctica de Claude Code, OpenCode, Windsurf, GitHub Copilot y Cline. Pros, contras, y para qué perfil de developer es cada uno."
      />

      {/* Agent selector cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
        {AGENTS.map(a => (
          <AgentCard key={a.id} agent={a} selected={selected === a.id} onClick={() => selectAgent(a.id)} />
        ))}
      </div>

      {/* Detail panel */}
      <div style={{
        background: `${agent.color}0a`,
        border: `1px solid ${agent.color}44`,
        borderRadius: 10, padding: 18, marginBottom: 20,
      }}>
        {/* Header */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 28 }}>{agent.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: agent.color }}>
                {agent.name}
              </span>
              <span style={{ fontFamily: T.sans, fontSize: 11, color: T.textDim }}>by {agent.maker}</span>
              <FeatureTag yes={agent.openSource} label="Open Source" />
              <FeatureTag yes={agent.freeTier} label="Free tier" />
              <FeatureTag yes={agent.mcp} label="MCP" />
              <FeatureTag yes={agent.planMode} label="Plan Mode" />
              <FeatureTag yes={agent.cicd} label="CI/CD" />
            </div>
            <p style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, fontStyle: "italic" }}>
              "{agent.tagline}"
            </p>
          </div>
        </div>

        {/* Quick specs */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[
            { k: "Precio", v: agent.price },
            { k: "Modelos", v: agent.model },
            { k: "Entorno", v: agent.where },
          ].map((s, i) => (
            <div key={i} style={{
              background: T.surface2, border: `1px solid ${T.border}`,
              borderRadius: 6, padding: "8px 10px",
            }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 3 }}>{s.k}</div>
              <div style={{ fontFamily: T.sans, fontSize: 11, color: T.text, lineHeight: 1.4 }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Pros / Cons */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.green, marginBottom: 8, fontWeight: 600 }}>
              ✓ PROS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {agent.pros.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ color: T.green, fontSize: 10, marginTop: 2, flexShrink: 0 }}>+</span>
                  <span style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.red, marginBottom: 8, fontWeight: 600 }}>
              ✗ CONTRAS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {agent.cons.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ color: T.red, fontSize: 10, marginTop: 2, flexShrink: 0 }}>–</span>
                  <span style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ideal for + rules file */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", gap: 10, alignItems: "start" }}>
          <div style={{
            background: `${agent.color}0f`, border: `1px solid ${agent.color}33`,
            borderRadius: 6, padding: "8px 12px",
          }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: agent.color, marginBottom: 4, fontWeight: 600 }}>
              IDEAL PARA
            </div>
            <p style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.6 }}>
              {agent.idealFor}
            </p>
          </div>
          <div style={{
            background: T.surface2, border: `1px solid ${T.border}`,
            borderRadius: 6, padding: "8px 12px",
          }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 4 }}>ARCHIVO DE REGLAS</div>
            <code style={{ fontFamily: T.mono, fontSize: 11, color: agent.color }}>{agent.rules}</code>
          </div>
        </div>
      </div>

      {/* Profile matcher */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 10, padding: 16, marginBottom: 20,
      }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 12 }}>
          ¿CUÁL ELEGIR? — selecciona tu perfil
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {PROFILES.map((p, i) => (
            <div key={i}>
              <div
                onClick={() => setProfileTab(profileTab === i ? null : i)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 12px", borderRadius: 6, cursor: "pointer",
                  background: profileTab === i ? `${T.blue}18` : T.surface2,
                  border: `1px solid ${profileTab === i ? T.blue + "44" : T.border}`,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontFamily: T.sans, fontSize: 12, color: profileTab === i ? T.text : T.textMid }}>
                  {p.label}
                </span>
                <div style={{ display: "flex", gap: 5, marginLeft: 10 }}>
                  {p.agents.map(id => {
                    const a = AGENTS.find(ag => ag.id === id);
                    return (
                      <span key={id} style={{
                        fontFamily: T.mono, fontSize: 9, color: a.color,
                        background: `${a.color}22`, border: `1px solid ${a.color}44`,
                        padding: "1px 6px", borderRadius: 8,
                      }}>{a.name}</span>
                    );
                  })}
                </div>
              </div>
              {profileTab === i && (
                <div style={{
                  margin: "4px 0 2px 12px",
                  padding: "6px 10px",
                  background: `${T.blue}0a`, borderLeft: `2px solid ${T.blue}55`,
                  fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.5,
                }}>
                  {p.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table toggle */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowTable(v => !v)}
          style={{
            fontFamily: T.mono, fontSize: 11, color: T.textDim,
            background: T.surface2, border: `1px solid ${T.border}`,
            borderRadius: 6, padding: "7px 14px", cursor: "pointer",
            width: "100%", textAlign: "left",
            transition: "all 0.15s",
          }}
        >
          {showTable ? "▼" : "▶"} Tabla comparativa completa
        </button>
        {showTable && (
          <div style={{ marginTop: 8, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  <th style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, textAlign: "left", padding: "8px 10px", borderBottom: `1px solid ${T.border}`, background: T.surface2 }}>
                    Característica
                  </th>
                  {AGENTS.map(a => (
                    <th key={a.id} style={{
                      fontFamily: T.mono, fontSize: 10, color: a.color, textAlign: "center",
                      padding: "8px 10px", borderBottom: `1px solid ${T.border}`,
                      background: T.surface2, whiteSpace: "nowrap",
                    }}>
                      {a.icon} {a.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_FEATURES.map((f, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? T.surface : T.surface2 }}>
                    <td style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, padding: "7px 10px", borderBottom: `1px solid ${T.border}22` }}>
                      {f.label}
                    </td>
                    {AGENTS.map(a => (
                      <td key={a.id} style={{
                        fontFamily: T.mono, fontSize: 10, color: T.textMid, textAlign: "center",
                        padding: "7px 10px", borderBottom: `1px solid ${T.border}22`,
                      }}>
                        {f.values[a.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Callout color={T.amber} icon="💡">
          <strong style={{ color: T.text }}>No son mutuamente excluyentes.</strong> Muchos developers usan Claude Code para tareas complejas de terminal y Copilot para autocompletado rápido en el IDE, o Cline para proyectos donde necesitan cambiar de modelo.
        </Callout>
        <Callout color={T.cyan} icon="🔑">
          <strong style={{ color: T.text }}>El archivo de reglas es lo más importante.</strong> Independientemente del agente que elijas, configurar bien tu CLAUDE.md / .clinerules / .windsurfrules es lo que más impacto tiene en la calidad de las respuestas.
        </Callout>
      </div>
    </div>
  );
}
