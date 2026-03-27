import { useState } from "react";
import { T } from "../tokens.js";
import { Callout, SectionTitle, Badge } from "../shared.jsx";

const COMPONENTS = [
  { key: "sys",     label: "System Prompt",   color: T.blue,   short: "SP" },
  { key: "rules",   label: "Rules / CLAUDE.md",color: T.purple, short: "RL" },
  { key: "mem",     label: "Memoria / Engram", color: T.pink,   short: "ME" },
  { key: "hist",    label: "Historial Chat",   color: T.amber,  short: "HC" },
  { key: "files",   label: "Archivos / RAG",   color: T.cyan,   short: "AR" },
  { key: "tools",   label: "Tool Results",     color: T.red,    short: "TR" },
  { key: "user",    label: "Tu Mensaje",       color: T.green,  short: "TM" },
];

const REQUESTS = [
  {
    id: "01", label: "Inicio de sesión",
    desc: "El usuario describe la tarea. Primer request — solo estructura base.",
    tokens: 1850, cost: 0.0028,
    payload: { sys: 800, rules: 400, mem: 150, hist: 0, files: 0, tools: 0, user: 500 },
    note: "Sin historial ni archivos aún. El 81% es contexto fijo que se paga en CADA request.",
  },
  {
    id: "02", label: "Agente lee archivos",
    desc: "El agente ejecuta tool_use: lee 3 archivos del proyecto.",
    tokens: 6950, cost: 0.0104,
    growth: "+276%",
    payload: { sys: 800, rules: 400, mem: 150, hist: 850, files: 4500, tools: 200, user: 50 },
    note: "Los archivos son el 65% del request. Una vez leídos, viajan en TODOS los siguientes.",
    newBadge: ["files"],
  },
  {
    id: "03", label: "El usuario corrige",
    desc: "El usuario pide un ajuste. El agente ya hizo ediciones — el historial creció.",
    tokens: 13100, cost: 0.0197,
    growth: "+88%",
    payload: { sys: 800, rules: 400, mem: 150, hist: 2800, files: 4500, tools: 4100, user: 350 },
    note: "Los tool results acumulados (ediciones, bash) ya superan al historial de chat.",
    newBadge: ["tools"],
  },
  {
    id: "04", label: "Sesión completa",
    desc: "Últimas instrucciones. 4 turnos de conversación acumulados.",
    tokens: 22600, cost: 0.0339,
    growth: "+73%",
    payload: { sys: 800, rules: 400, mem: 150, hist: 7500, files: 4500, tools: 9000, user: 250 },
    note: "×12 el costo del request 1. El historial + tools son ahora el 73% del payload.",
    newBadge: [],
  },
];

const INSIGHTS = [
  { stat: "80%", label: "Archivos = mayor costo", color: T.cyan,
    body: "El contenido de archivos leídos domina el payload y se reenvía en CADA turno siguiente." },
  { stat: "×12", label: "Costo Request 4 vs 1", color: T.amber,
    body: "De $0.0028 a $0.0339 en 4 turnos. El crecimiento no es lineal — es acumulativo." },
  { stat: "fixed", label: "System prompt + reglas", color: T.blue,
    body: "Se pagan en cada request sin importar cuánto dure la sesión. Mantenlos bajo 200 líneas." },
  { stat: "poison", label: "Context poisoning", color: T.red,
    body: "Tool results acumulados (errores, outputs) saturan el contexto. Usa /compact a tiempo." },
];

function StackedBar({ payload, total, highlight }) {
  return (
    <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden", gap: 1 }}>
      {COMPONENTS.map((c) => {
        const val = payload[c.key];
        if (!val) return null;
        const pct = (val / total) * 100;
        return (
          <div
            key={c.key}
            title={`${c.label}: ${val.toLocaleString()} tok (${pct.toFixed(1)}%)`}
            style={{
              flex: val, background: `${c.color}${highlight === c.key ? "cc" : "66"}`,
              borderTop: `2px solid ${c.color}`,
              transition: "all 0.3s ease",
              position: "relative",
              minWidth: pct > 4 ? 24 : 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {pct > 7 && (
              <span style={{ fontFamily: T.mono, fontSize: 8, color: c.color, fontWeight: 700 }}>
                {Math.round(pct)}%
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RequestCard({ req, expanded, onToggle }) {
  const total = Object.values(req.payload).reduce((a, b) => a + b, 0);
  return (
    <div style={{
      background: T.surface2, border: `1px solid ${T.border}`,
      borderRadius: 10, overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Card header */}
      <div
        onClick={onToggle}
        style={{
          padding: "14px 18px", cursor: "pointer", display: "flex",
          alignItems: "flex-start", gap: 14,
          background: `linear-gradient(90deg, ${T.surface2} 0%, ${T.surface} 100%)`,
        }}
      >
        <div style={{
          fontFamily: T.mono, fontSize: 11, color: T.textDim,
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 6, padding: "3px 8px", whiteSpace: "nowrap", marginTop: 2,
        }}>
          REQ {req.id}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontFamily: T.mono, fontSize: 13, color: T.text, fontWeight: 600 }}>
              {req.label}
            </span>
            {req.growth && (
              <span style={{
                fontFamily: T.mono, fontSize: 10, color: T.red,
                background: `${T.red}18`, border: `1px solid ${T.red}44`,
                padding: "1px 7px", borderRadius: 12,
              }}>
                {req.growth}
              </span>
            )}
          </div>
          <p style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, marginBottom: 10 }}>
            {req.desc}
          </p>
          <StackedBar payload={req.payload} total={total} />
        </div>
        <div style={{ textAlign: "right", whiteSpace: "nowrap", minWidth: 70 }}>
          <div style={{ fontFamily: T.mono, fontSize: 14, color: T.text, fontWeight: 700 }}>
            {req.tokens.toLocaleString()}
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>tokens</div>
          <div style={{
            fontFamily: T.mono, fontSize: 12, color: T.amber,
            fontWeight: 600, marginTop: 3,
          }}>
            ${req.cost.toFixed(4)}
          </div>
        </div>
        <div style={{
          fontFamily: T.mono, fontSize: 10, color: T.textDim,
          transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease", marginTop: 4,
        }}>▶</div>
      </div>

      {/* Expanded detail table */}
      {expanded && (
        <div style={{ animation: "fadeSlideIn 0.2s ease", padding: "0 18px 14px" }}>
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
            {COMPONENTS.map((c) => {
              const val = req.payload[c.key];
              const pct = ((val / total) * 100).toFixed(1);
              const isNew = req.newBadge?.includes(c.key);
              return (
                <div key={c.key} style={{
                  display: "grid",
                  gridTemplateColumns: "12px 1fr auto auto",
                  gap: 10, alignItems: "center",
                  padding: "6px 0",
                  borderBottom: `1px solid ${T.border}22`,
                  opacity: val === 0 ? 0.35 : 1,
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 2,
                    background: c.color, boxShadow: `0 0 6px ${c.color}66`,
                  }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: c.color, fontWeight: 600 }}>
                      {c.label}
                    </span>
                    {isNew && (
                      <span style={{
                        fontFamily: T.mono, fontSize: 9, color: T.amber,
                        background: `${T.amber}22`, border: `1px solid ${T.amber}55`,
                        padding: "0 5px", borderRadius: 4,
                      }}>NEW</span>
                    )}
                  </div>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMid, textAlign: "right" }}>
                    {val > 0 ? val.toLocaleString() + " tok" : "—"}
                  </span>
                  <span style={{
                    fontFamily: T.mono, fontSize: 10,
                    color: val > 0 ? T.textDim : T.border,
                    textAlign: "right", minWidth: 36,
                  }}>
                    {val > 0 ? pct + "%" : ""}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{
            marginTop: 10, fontFamily: T.sans, fontSize: 11, color: T.textMid,
            fontStyle: "italic", lineHeight: 1.6,
            paddingLeft: 8, borderLeft: `2px solid ${T.border}`,
          }}>
            {req.note}
          </div>
        </div>
      )}
    </div>
  );
}

export default function S12SessionCost() {
  const [expanded, setExpanded] = useState(null);

  const totalTokens = REQUESTS.reduce((a, r) => a + r.tokens, 0);
  const totalCost = REQUESTS.reduce((a, r) => a + r.cost, 0);

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  return (
    <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
      <SectionTitle
        icon="📊"
        title="Sesión Real: Anatomía de Costos"
        color={T.amber}
        subtitle="Una sesión de refactoring en 4 turnos. Cada request muestra qué viaja al LLM y cuánto cuesta. Haz click en cada card para ver el desglose."
      />

      {/* Legend */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
        padding: "10px 16px", marginBottom: 20,
        display: "flex", flexWrap: "wrap", gap: "8px 16px",
      }}>
        <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, alignSelf: "center", marginRight: 4 }}>
          COMPONENTES:
        </span>
        {COMPONENTS.map((c) => (
          <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textMid }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        {/* Spine */}
        <div style={{
          position: "absolute", left: 26, top: 20, bottom: 20,
          width: 1, background: `linear-gradient(to bottom, ${T.border} 0%, ${T.borderBright} 50%, ${T.border} 100%)`,
          zIndex: 0,
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {REQUESTS.map((req, i) => (
            <div key={req.id}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", position: "relative" }}>
                {/* Timeline dot */}
                <div style={{
                  width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                  background: expanded === req.id ? T.amber : T.surface2,
                  border: `2px solid ${expanded === req.id ? T.amber : T.borderBright}`,
                  marginTop: 18, zIndex: 1,
                  boxShadow: expanded === req.id ? `0 0 10px ${T.amber}66` : "none",
                  transition: "all 0.2s ease",
                }} />
                <div style={{ flex: 1 }}>
                  <RequestCard
                    req={req}
                    expanded={expanded === req.id}
                    onToggle={() => toggle(req.id)}
                  />
                </div>
              </div>

              {/* Connector between cards */}
              {i < REQUESTS.length - 1 && (
                <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "6px 0" }}>
                  <div style={{ width: 14, flexShrink: 0 }} />
                  <div style={{
                    fontFamily: T.mono, fontSize: 10, color: T.textDim,
                    borderLeft: `2px dashed ${T.border}`, paddingLeft: 12,
                    marginLeft: 5,
                  }}>
                    ↓ el agente reenvía TODO el contexto acumulado
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Session summary */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20,
      }}>
        {[
          { label: "Tokens totales (sesión)", value: totalTokens.toLocaleString(), unit: "tokens", color: T.blue },
          { label: "Costo total sesión", value: `$${totalCost.toFixed(4)}`, unit: "USD", color: T.amber },
          { label: "Multiplicador R4 vs R1", value: `×${(REQUESTS[3].tokens / REQUESTS[0].tokens).toFixed(1)}`, unit: "crecimiento", color: T.red },
        ].map((m, i) => (
          <div key={i} style={{
            background: `${m.color}0f`, border: `1px solid ${m.color}33`,
            borderRadius: 8, padding: "14px 16px", textAlign: "center",
          }}>
            <div style={{ fontFamily: T.mono, fontSize: 22, color: m.color, fontWeight: 700 }}>{m.value}</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Insights grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {INSIGHTS.map((ins, i) => (
          <div key={i} style={{
            background: `${ins.color}0a`, border: `1px solid ${ins.color}33`,
            borderRadius: 8, padding: "14px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: T.mono, fontSize: 20, color: ins.color, fontWeight: 700 }}>
                {ins.stat}
              </span>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: ins.color, fontWeight: 600 }}>
                {ins.label}
              </span>
            </div>
            <p style={{ fontFamily: T.sans, fontSize: 12, color: T.textMid, lineHeight: 1.6 }}>
              {ins.body}
            </p>
          </div>
        ))}
      </div>

      <Callout color={T.cyan} icon="🔑">
        Tu mensaje es el <strong style={{ color: T.text }}>1% del request</strong>. El 99% restante lo construye el agente con contexto acumulado. Cada archivo que el agente lee entra al contexto y <strong style={{ color: T.text }}>se reenvía en cada turno siguiente</strong> hasta que el contexto se comprime o la sesión termina.
      </Callout>
    </div>
  );
}
