import { useState } from "react";
import { T } from "../tokens.js";
import { Callout, SectionTitle, useMobile } from "../shared.jsx";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const BILLING_MODELS = [
  {
    id: "subscription",
    icon: "📅",
    label: "Suscripción mensual",
    color: T.purple,
    desc: "Pagas un fee fijo mensual. Accedes a la herramienta sin preocuparte por tokens individuales. Hay límites de uso por ventana de tiempo.",
    examples: ["Claude Code Pro ($20/mes)", "GitHub Copilot Pro ($10/mes)", "Windsurf Pro ($20/mes)"],
    goodFor: "Uso diario constante, developers que prefieren costo predecible.",
    watchOut: "Los límites de ventana pueden interrumpir el flujo. Shared con otras apps del plan.",
  },
  {
    id: "api",
    icon: "🔑",
    label: "API pay-per-token",
    color: T.cyan,
    desc: "Pagas exactamente por lo que usas. Sin costo fijo mensual. La factura depende del volumen real de tokens enviados y recibidos.",
    examples: ["Anthropic API directa", "OpenAI API directa", "Google AI Studio (pago)"],
    goodFor: "Automatización, CI/CD, uso variable o bajo. Sin overhead cuando no usas.",
    watchOut: "Una sesión larga puede costar más de lo esperado. Requiere monitorear el gasto.",
  },
  {
    id: "aggregator",
    icon: "🔀",
    label: "Agregador de APIs",
    color: T.amber,
    desc: "Un intermediario que unifica múltiples proveedores en una sola API y factura. Compras créditos y los gastas en cualquier modelo.",
    examples: ["OpenRouter", "AWS Bedrock", "Azure AI Foundry"],
    goodFor: "Cambiar entre modelos fácilmente, acceso a modelos de múltiples proveedores desde una sola key.",
    watchOut: "Fee de plataforma en OpenRouter (~5.5% al comprar créditos). Menor control directo.",
  },
];

const CLAUDE_PLANS = [
  {
    name: "Pro", price: "$20/mes", color: T.blue,
    windowTokens: "~17,500 tokens",
    resetEvery: "5 horas",
    includes: ["Claude Code incluido", "claude.ai web + desktop + móvil", "Acceso a Sonnet 4.6", "Uso compartido entre apps"],
    note: "Mínimo práctico. Útil para uso ocasional o aprendizaje.",
  },
  {
    name: "Max 5×", price: "$100/mes", color: T.purple,
    windowTokens: "~88,000 tokens",
    resetEvery: "5 horas",
    includes: ["5× el uso de Pro", "Acceso a Opus 4.6", "Todos los modelos Anthropic", "Proyectos sin límite"],
    note: "Para developers que usan Claude Code varias horas al día.",
  },
  {
    name: "Max 20×", price: "$200/mes", color: T.pink,
    windowTokens: "~220,000 tokens",
    resetEvery: "5 horas",
    includes: ["20× el uso de Pro", "Acceso a todos los modelos", "Prioridad de acceso en alta demanda", "Límites más generosos en todo"],
    note: "Desarrollo a tiempo completo sin interrupciones. Recomendado para uso intensivo.",
  },
  {
    name: "API Directa", price: "pay-per-token", color: T.cyan,
    windowTokens: "Sin límite de ventana",
    resetEvery: "—",
    includes: ["Solo acceso programático (sin claude.ai)", "Todos los modelos disponibles", "Control granular del gasto", "Ideal para CI/CD y scripts"],
    note: "Cuando el uso es impredecible o automatizado. Sin costo fijo.",
  },
];

const API_MODELS = [
  { provider: "Anthropic", model: "Claude Opus 4.6",    input: 5.00,  output: 25.00, ctx: "1M tokens",  color: T.pink,   tier: "flagship" },
  { provider: "Anthropic", model: "Claude Sonnet 4.6",  input: 3.00,  output: 15.00, ctx: "1M tokens",  color: T.purple, tier: "balanced" },
  { provider: "Anthropic", model: "Claude Haiku 4.5",   input: 1.00,  output: 5.00,  ctx: "200K tokens",color: T.blue,   tier: "fast" },
  { provider: "OpenAI",    model: "GPT-4.1",             input: 2.00,  output: 8.00,  ctx: "1M tokens",  color: T.green,  tier: "balanced" },
  { provider: "OpenAI",    model: "GPT-4.1 Mini",        input: 0.40,  output: 1.60,  ctx: "1M tokens",  color: T.green,  tier: "fast" },
  { provider: "OpenAI",    model: "o3",                  input: 2.00,  output: 8.00,  ctx: "200K tokens",color: T.green,  tier: "reasoning" },
  { provider: "OpenAI",    model: "o4-mini",             input: 1.10,  output: 4.40,  ctx: "200K tokens",color: T.green,  tier: "reasoning" },
  { provider: "Google",    model: "Gemini 2.5 Pro",      input: 1.25,  output: 10.00, ctx: "1M tokens",  color: T.amber,  tier: "balanced" },
  { provider: "Google",    model: "Gemini 2.5 Flash",    input: 0.30,  output: 2.50,  ctx: "1M tokens",  color: T.amber,  tier: "fast" },
  { provider: "Google",    model: "Gemini 2.5 Flash",    input: 0.00,  output: 0.00,  ctx: "Free tier*",  color: T.amber,  tier: "free" },
  { provider: "DeepSeek",  model: "DeepSeek-V3.2",       input: 0.28,  output: 0.42,  ctx: "64K tokens", color: T.cyan,   tier: "fast" },
  { provider: "DeepSeek",  model: "DeepSeek-V3.2 (cache hit)", input: 0.028, output: 0.42, ctx: "64K tokens", color: T.cyan, tier: "fast" },
];

const TIER_COLORS = {
  flagship: T.pink, balanced: T.purple, fast: T.blue, reasoning: T.amber, free: T.green,
};

const OPENROUTER_INFO = {
  markup: "Sin markup en inferencia",
  fee: "5.5% al comprar créditos con tarjeta",
  freeModels: "25+ modelos gratuitos (50 req/día sin créditos)",
  highlights: [
    "Una sola API key para todos los proveedores",
    "Cambia de Claude → GPT → Gemini con un parámetro",
    "Modelos gratuitos: DeepSeek R1, Llama 3.3 70B, Qwen3 Coder 480B...",
    "BYOK (Bring Your Own Key): primer millón de requests gratis",
    "Dashboard con métricas de uso y costos en tiempo real",
  ],
};

/* ─── Session cost calculator ───────────────────────────────────────────── */
function CostCalc() {
  const isMobile = useMobile();
  const [turns, setTurns] = useState(8);
  const [modelIdx, setModelIdx] = useState(1); // Sonnet 4.6 by default
  const calcModels = [
    { label: "Claude Haiku 4.5",  input: 1.00,  output: 5.00 },
    { label: "Claude Sonnet 4.6", input: 3.00,  output: 15.00 },
    { label: "GPT-4.1",           input: 2.00,  output: 8.00 },
    { label: "Gemini 2.5 Flash",  input: 0.30,  output: 2.50 },
    { label: "DeepSeek-V3.2",     input: 0.28,  output: 0.42 },
  ];
  const m = calcModels[modelIdx];

  const baseInput = 2000;
  const growthFactor = 1.55;
  const turnData = Array.from({ length: turns }, (_, i) => {
    const inputTokens = Math.round(baseInput * Math.pow(growthFactor, i));
    const outputTokens = Math.round(300 * (1 + i * 0.2));
    const cost = (inputTokens / 1_000_000) * m.input + (outputTokens / 1_000_000) * m.output;
    return { inputTokens, outputTokens, cost };
  });
  const totalCost = turnData.reduce((a, t) => a + t.cost, 0);
  const maxInput = Math.max(...turnData.map(t => t.inputTokens));

  return (
    <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16 }}>
      <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginBottom: 12 }}>
        CALCULADORA — costo real de una sesión API
      </p>
      <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, display: "block", marginBottom: 4 }}>Modelo</label>
          <select
            value={modelIdx}
            onChange={e => setModelIdx(+e.target.value)}
            style={{
              width: "100%", fontFamily: T.mono, fontSize: 11, color: T.text,
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 4, padding: "5px 8px", cursor: "pointer",
            }}
          >
            {calcModels.map((cm, i) => <option key={i} value={i}>{cm.label}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid, display: "block", marginBottom: 4 }}>
            Turnos: <strong style={{ color: T.text }}>{turns}</strong>
          </label>
          <input type="range" min="2" max="15" value={turns} onChange={e => setTurns(+e.target.value)}
            style={{ width: "100%", accentColor: T.purple }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80, marginBottom: 10 }}>
        {turnData.map((t, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{
              width: "100%", borderRadius: "2px 2px 0 0",
              background: `linear-gradient(to top, ${T.purple}, ${T.purple}88)`,
              height: `${(t.inputTokens / maxInput) * 68}px`,
              transition: "height 0.4s ease",
            }} />
            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.textDim }}>T{i + 1}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 8 }}>
        {[
          { label: "Costo total sesión", value: `$${totalCost.toFixed(4)}`, color: T.purple },
          { label: "Tokens último turno", value: `${(turnData[turns - 1].inputTokens / 1000).toFixed(1)}K`, color: T.amber },
          { label: `× sesiones hasta $1`, value: `${Math.floor(1 / totalCost)}`, color: T.green },
        ].map((s, i) => (
          <div key={i} style={{
            background: `${s.color}0f`, border: `1px solid ${s.color}33`,
            borderRadius: 6, padding: "8px 10px", textAlign: "center",
          }}>
            <div style={{ fontFamily: T.mono, fontSize: 16, color: s.color, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontFamily: T.sans, fontSize: 9, color: T.textDim, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────────── */

export default function S16Billing() {
  const isMobile = useMobile();
  const [billingTab, setBillingTab] = useState("subscription");
  const [filterProvider, setFilterProvider] = useState("all");

  const providers = ["all", "Anthropic", "OpenAI", "Google", "DeepSeek"];
  const filteredModels = filterProvider === "all"
    ? API_MODELS
    : API_MODELS.filter(m => m.provider === filterProvider);

  const billingModel = BILLING_MODELS.find(b => b.id === billingTab);

  return (
    <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
      <SectionTitle
        icon="💳"
        title="Facturación y APIs"
        color={T.amber}
        subtitle="Cómo se cobra cada herramienta: suscripciones vs pay-per-token, planes Claude Pro/Max, OpenRouter, y el costo real por modelo. Datos de marzo 2026."
      />

      {/* ── 1. Billing models ── */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 12 }}>DOS MODELOS DE FACTURACIÓN</p>
        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          {BILLING_MODELS.map(b => (
            <button key={b.id} onClick={() => setBillingTab(b.id)} style={{
              flex: 1, minWidth: 120, fontFamily: T.mono, fontSize: 10, padding: "7px 10px",
              borderRadius: 6, cursor: "pointer", transition: "all 0.15s",
              background: billingTab === b.id ? `${b.color}22` : T.surface2,
              border: `1px solid ${billingTab === b.id ? b.color + "66" : T.border}`,
              color: billingTab === b.id ? b.color : T.textDim,
            }}>
              {b.icon} {b.label}
            </button>
          ))}
        </div>
        {billingModel && (
          <div style={{ animation: "fadeSlideIn 0.15s ease" }}>
            <p style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.7, marginBottom: 12 }}>
              {billingModel.desc}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 10 }}>
              <div style={{ background: T.surface2, borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 5 }}>EJEMPLOS</div>
                {billingModel.examples.map((e, i) => (
                  <div key={i} style={{ fontFamily: T.sans, fontSize: 11, color: T.text, padding: "2px 0" }}>• {e}</div>
                ))}
              </div>
              <div style={{ background: `${billingModel.color}0a`, border: `1px solid ${billingModel.color}33`, borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: billingModel.color, marginBottom: 5 }}>IDEAL CUANDO</div>
                <p style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{billingModel.goodFor}</p>
              </div>
              <div style={{ background: `${T.red}0a`, border: `1px solid ${T.red}33`, borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: T.red, marginBottom: 5 }}>OJO CON</div>
                <p style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{billingModel.watchOut}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Claude Plans ── */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginBottom: 14 }}>
          PLANES CLAUDE CODE — suscripción vs API directa
        </p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 8 }}>
          {CLAUDE_PLANS.map((plan, i) => (
            <div key={i} style={{
              background: `${plan.color}0a`, border: `1px solid ${plan.color}33`,
              borderRadius: 8, padding: 12,
            }}>
              <div style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: plan.color, marginBottom: 4 }}>
                {plan.name}
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 16, color: T.text, fontWeight: 700, marginBottom: 8 }}>
                {plan.price}
              </div>
              <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: T.mono, fontSize: 9, color: plan.color,
                  background: `${plan.color}22`, padding: "1px 6px", borderRadius: 4,
                }}>
                  {plan.windowTokens}
                </span>
                {plan.resetEvery !== "—" && (
                  <span style={{
                    fontFamily: T.mono, fontSize: 9, color: T.textDim,
                    background: T.surface2, padding: "1px 6px", borderRadius: 4,
                  }}>
                    reset c/{plan.resetEvery}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 8 }}>
                {plan.includes.map((item, j) => (
                  <div key={j} style={{ fontFamily: T.sans, fontSize: 10, color: T.textMid, display: "flex", gap: 5 }}>
                    <span style={{ color: plan.color }}>·</span>{item}
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: T.sans, fontSize: 10, color: T.textDim, fontStyle: "italic", lineHeight: 1.4 }}>
                {plan.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. OpenRouter ── */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>OPENROUTER — el agregador de APIs</span>
          <span style={{
            fontFamily: T.mono, fontSize: 9, color: T.amber,
            background: `${T.amber}22`, border: `1px solid ${T.amber}44`,
            padding: "1px 7px", borderRadius: 10,
          }}>openrouter.ai</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          <div>
            <p style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.7, marginBottom: 10 }}>
              Una sola API key para acceder a <strong style={{ color: T.text }}>múltiples proveedores</strong>. Cambia de Claude a GPT a Gemini modificando un parámetro. Sin markup en la inferencia — el fee de ~5.5% se aplica <em>al comprar créditos</em>, no por uso.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {OPENROUTER_INFO.highlights.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ color: T.amber, fontSize: 10, marginTop: 1, flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: T.sans, fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12 }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginBottom: 8 }}>EJEMPLO: OPENCODE + OPENROUTER</div>
            <div style={{
              fontFamily: T.mono, fontSize: 10, color: T.textMid,
              background: T.bg, borderRadius: 6, padding: 10, lineHeight: 1.9,
              border: `1px solid ${T.border}`,
            }}>
              <span style={{ color: T.textDim }}># opencode.json</span>{"\n"}
              <span style={{ color: T.cyan }}>"provider"</span>: <span style={{ color: T.green }}>"openrouter"</span>,{"\n"}
              <span style={{ color: T.cyan }}>"model"</span>: <span style={{ color: T.green }}>"anthropic/claude-sonnet-4-6"</span>,{"\n"}
              <span style={{ color: T.purple }}># o cambia a:</span>{"\n"}
              <span style={{ color: T.cyan }}>"model"</span>: <span style={{ color: T.green }}>"openai/gpt-4.1"</span>{"\n"}
              <span style={{ color: T.cyan }}>"model"</span>: <span style={{ color: T.green }}>"google/gemini-2.5-flash"</span>{"\n"}
              <span style={{ color: T.cyan }}>"model"</span>: <span style={{ color: T.green }}>"deepseek/deepseek-chat"</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. API pricing table ── */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim }}>
            PRECIOS POR PROVEEDOR — por 1M tokens (USD) · Datos: marzo 2026
          </p>
          <div style={{ display: "flex", gap: 5 }}>
            {providers.map(p => (
              <button key={p} onClick={() => setFilterProvider(p)} style={{
                fontFamily: T.mono, fontSize: 9, padding: "3px 8px", borderRadius: 4,
                cursor: "pointer", transition: "all 0.15s",
                background: filterProvider === p ? `${T.blue}33` : T.surface2,
                border: `1px solid ${filterProvider === p ? T.blue : T.border}`,
                color: filterProvider === p ? T.blue : T.textDim,
              }}>{p === "all" ? "Todos" : p}</button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Proveedor", "Modelo", "Input / 1M", "Output / 1M", "Contexto", "Tier"].map((h, i) => (
                  <th key={i} style={{
                    fontFamily: T.mono, fontSize: 9, color: T.textDim, textAlign: i > 1 ? "right" : "left",
                    padding: "7px 10px", borderBottom: `1px solid ${T.border}`,
                    background: T.surface2, whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredModels.map((m, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? T.surface : T.surface2 }}>
                  <td style={{ fontFamily: T.mono, fontSize: 10, color: m.color, padding: "6px 10px", borderBottom: `1px solid ${T.border}22` }}>
                    {m.provider}
                  </td>
                  <td style={{ fontFamily: T.sans, fontSize: 11, color: T.text, padding: "6px 10px", borderBottom: `1px solid ${T.border}22`, whiteSpace: "nowrap" }}>
                    {m.model}
                  </td>
                  <td style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, textAlign: "right", padding: "6px 10px", borderBottom: `1px solid ${T.border}22` }}>
                    {m.input === 0 ? <span style={{ color: T.green }}>gratis</span> : `$${m.input.toFixed(2)}`}
                  </td>
                  <td style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, textAlign: "right", padding: "6px 10px", borderBottom: `1px solid ${T.border}22` }}>
                    {m.output === 0 ? <span style={{ color: T.green }}>gratis</span> : `$${m.output.toFixed(2)}`}
                  </td>
                  <td style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, textAlign: "right", padding: "6px 10px", borderBottom: `1px solid ${T.border}22` }}>
                    {m.ctx}
                  </td>
                  <td style={{ textAlign: "right", padding: "6px 10px", borderBottom: `1px solid ${T.border}22` }}>
                    <span style={{
                      fontFamily: T.mono, fontSize: 8, fontWeight: 600,
                      color: TIER_COLORS[m.tier] || T.textDim,
                      background: `${TIER_COLORS[m.tier] || T.border}22`,
                      border: `1px solid ${TIER_COLORS[m.tier] || T.border}44`,
                      padding: "1px 6px", borderRadius: 4,
                    }}>{m.tier}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 8 }}>
          * Gemini 2.5 Flash gratis en Google AI Studio con rate limits. Batch API de Anthropic/Google: 50% dto. Prompt cache hit de Anthropic: 90% dto.
        </p>
      </div>

      {/* ── 5. Live cost calculator ── */}
      <CostCalc />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <Callout color={T.green} icon="💡">
          <strong style={{ color: T.text }}>DeepSeek es 10× más barato que Sonnet</strong> para tareas donde la calidad es suficiente. Muchos developers usan DeepSeek para exploración/planificación y Sonnet/Opus solo para implementación final.
        </Callout>
        <Callout color={T.red} icon="⚠️">
          <strong style={{ color: T.text }}>El output es siempre más caro que el input.</strong> Sonnet output ($15) cuesta 5× más que input ($3). Prompts que generan respuestas largas se encarecen rápido — sé conciso en lo que pides.
        </Callout>
      </div>
    </div>
  );
}
