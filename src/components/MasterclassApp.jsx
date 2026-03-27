import { useState, useEffect } from "react";
import { T } from "./tokens.js";
import { Btn } from "./shared.jsx";
import { CONFIG } from "../config.js";

import S1Amnesia from "./sections/S1Amnesia.jsx";
import S2Anatomy from "./sections/S2Anatomy.jsx";
import S3LostMiddle from "./sections/S3LostMiddle.jsx";
import S4Injection from "./sections/S4Injection.jsx";
import S5Loop from "./sections/S5Loop.jsx";
import S6Cost from "./sections/S6Cost.jsx";
import S7Skills from "./sections/S7Skills.jsx";
import S8MCP from "./sections/S8MCP.jsx";
import S9Agents from "./sections/S9Agents.jsx";
import S10Memories from "./sections/S10Memories.jsx";
import S11Interaction from "./sections/S11Interaction.jsx";
import S12SessionCost from "./sections/S12SessionCost.jsx";
import S13DecisionTree from "./sections/S13DecisionTree.jsx";
import S14ToolUse from "./sections/S14ToolUse.jsx";
import S15AgentChooser from "./sections/S15AgentChooser.jsx";
import S16Billing from "./sections/S16Billing.jsx";

const TABS = [
  { id:0,  slug:"amnesia",        label:"🧠 Amnesia",         short:"Amnesia",        component:S1Amnesia },
  { id:1,  slug:"anatomia",       label:"📦 Anatomía",        short:"Anatomía",       component:S2Anatomy },
  { id:2,  slug:"lost-middle",    label:"👁️ Lost Middle",     short:"Lost Middle",    component:S3LostMiddle },
  { id:3,  slug:"inyeccion",      label:"💉 Inyección",       short:"Inyección",      component:S4Injection },
  { id:4,  slug:"loop",           label:"🔄 Loop",             short:"Loop",           component:S5Loop },
  { id:5,  slug:"costos",         label:"💸 Costos",          short:"Costos",         component:S6Cost },
  { id:6,  slug:"sesion-real",    label:"📊 Sesión Real",     short:"Sesión Real",    component:S12SessionCost },
  { id:7,  slug:"skills",         label:"🛠️ Skills",          short:"Skills",         component:S7Skills },
  { id:8,  slug:"mcp",            label:"🔌 MCP",             short:"MCP",            component:S8MCP },
  { id:9,  slug:"tool-use",       label:"🔧 Tool Use",        short:"Tool Use",       component:S14ToolUse },
  { id:10, slug:"agentes",        label:"🤖 Agentes",         short:"Agentes",        component:S9Agents },
  { id:11, slug:"elegir-agente",  label:"🎯 ¿Cuál elegir?",   short:"¿Cuál elegir?",  component:S15AgentChooser },
  { id:12, slug:"facturacion",    label:"💳 Facturación",     short:"Facturación",    component:S16Billing },
  { id:13, slug:"memorias",       label:"🧬 Memorias",        short:"Memorias",       component:S10Memories },
  { id:14, slug:"interaccion",    label:"🕸️ Interacción",     short:"Interacción",    component:S11Interaction },
  { id:15, slug:"guia",           label:"🗺️ Guía Decisiones",  short:"Guía",          component:S13DecisionTree },
];

function tabFromPath() {
  if (typeof window === "undefined") return 0;
  const base = CONFIG.baseSlash;
  const path = window.location.pathname.replace(new RegExp(`^${base}`), "").replace(/^\//, "").replace(/\/$/, "");
  const found = TABS.find(t => t.slug === path);
  return found ? found.id : 0;
}

const SIDEBAR_W = 220;

export default function MasterclassApp() {
  const [tab, setTab] = useState(() => tabFromPath());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const Section = TABS[tab].component;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navigate = (id) => {
    const clamped = Math.max(0, Math.min(TABS.length - 1, id));
    history.pushState(null, "", CONFIG.baseSlash + TABS[clamped].slug);
    setTab(clamped);
    window.scrollTo({ top: 0 });
    if (isMobile) setDrawerOpen(false);
  };

  useEffect(() => {
    const onPop = () => setTab(tabFromPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (isMobile && drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, drawerOpen]);

  const sidebar = (
    <nav style={{
      width: SIDEBAR_W,
      minWidth: SIDEBAR_W,
      height: "100%",
      background: T.surface,
      borderRight: `1px solid ${T.border}`,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      overflowX: "hidden",
    }}>
      {/* Sidebar header */}
      <div style={{
        padding: "20px 16px 12px",
        borderBottom: `1px solid ${T.border}`,
        background: `linear-gradient(180deg, #0a0f1e 0%, ${T.surface} 100%)`,
      }}>
        <div style={{
          fontFamily: T.mono, fontSize: 9, color: T.purple,
          background: `${T.purple}18`, border: `1px solid ${T.purple}33`,
          padding: "3px 8px", borderRadius: 20, letterSpacing: "0.12em",
          display: "inline-block", marginBottom: 10,
        }}>MASTERCLASS</div>
        <div style={{
          fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: T.text,
          lineHeight: 1.3,
        }}>
          Context Engineering
          <span style={{
            background: `linear-gradient(90deg, ${T.blue}, ${T.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            display: "block",
          }}>& Agentic Systems</span>
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginTop: 4 }}>
          v4.0 — {TABS.length} módulos
        </div>
      </div>

      {/* Progress bar thin */}
      <div style={{ padding: "8px 16px 0", background: T.surface }}>
        <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
          {TABS.map((t, i) => (
            <div key={i} style={{
              height: 2, flex: 1, borderRadius: 1,
              background: i <= tab ? T.blue : T.border,
              transition: "background 0.3s ease",
            }} />
          ))}
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, textAlign: "right" }}>
          {tab + 1}/{TABS.length}
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: "8px 0" }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => navigate(t.id)} style={{
              display: "block", width: "100%", textAlign: "left",
              background: active ? `${T.blue}18` : "transparent",
              border: "none",
              borderLeft: active ? `3px solid ${T.blue}` : "3px solid transparent",
              cursor: "pointer",
              padding: "9px 16px 9px 13px",
              fontFamily: T.mono, fontSize: 12,
              color: active ? T.text : T.textDim,
              fontWeight: active ? 600 : 400,
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      color: T.text,
      fontFamily: T.sans,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Mobile top bar */}
      {isMobile && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 16px",
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
            style={{
              background: "transparent", border: `1px solid ${T.border}`,
              borderRadius: 6, cursor: "pointer", padding: "6px 8px",
              display: "flex", flexDirection: "column", gap: 4,
              color: T.text,
            }}
          >
            <span style={{ display: "block", width: 18, height: 2, background: T.textMid, borderRadius: 1 }} />
            <span style={{ display: "block", width: 18, height: 2, background: T.textMid, borderRadius: 1 }} />
            <span style={{ display: "block", width: 18, height: 2, background: T.textMid, borderRadius: 1 }} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700, color: T.text }}>
              {TABS[tab].label}
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim }}>
              {tab + 1}/{TABS.length}
            </div>
          </div>
        </div>
      )}

      {/* Mobile progress bar */}
      {isMobile && (
        <div style={{ display: "flex", gap: 2, padding: "0 0 0 0" }}>
          {TABS.map((t, i) => (
            <div key={i} style={{
              height: 3, flex: 1,
              background: i <= tab ? T.blue : T.border,
              transition: "background 0.3s ease",
            }} />
          ))}
        </div>
      )}

      {/* Mobile drawer overlay */}
      {isMobile && drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <div style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          width: SIDEBAR_W,
          zIndex: 201,
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: drawerOpen ? "4px 0 24px rgba(0,0,0,0.5)" : "none",
        }}>
          {sidebar}
        </div>
      )}

      {/* Desktop layout */}
      <div style={{
        display: "flex",
        flex: 1,
        minHeight: "100vh",
      }}>
        {/* Desktop sidebar — always visible */}
        {!isMobile && (
          <div style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            flexShrink: 0,
          }}>
            {sidebar}
          </div>
        )}

        {/* Main content */}
        <main style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Desktop header */}
          {!isMobile && (
            <div style={{
              background: `linear-gradient(180deg, #0a0f1e 0%, ${T.bg} 100%)`,
              borderBottom: `1px solid ${T.border}`,
              padding: "10px 32px 8px",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `radial-gradient(circle at 20% 50%, ${T.purple}08 0%, transparent 60%),
                  radial-gradient(circle at 80% 20%, ${T.blue}08 0%, transparent 50%)`,
              }} />
              <div style={{ position: "relative" }}>
                <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, lineHeight: 1.5, margin: 0, letterSpacing: "0.01em" }}>
                  Cursor, Windsurf, Claude Code, OpenCode — contexto · Skills · MCPs · Memorias · tokens
                </p>
              </div>
            </div>
          )}

          {/* Section content */}
          <div style={{ padding: isMobile ? "20px 16px 60px" : "32px 40px 60px" }}>
            <Section key={tab} />

            {/* Navigation buttons */}
            <div style={{
              display: "flex", justifyContent: "space-between", marginTop: 40,
              paddingTop: 20, borderTop: `1px solid ${T.border}`,
            }}>
              <Btn onClick={() => navigate(tab - 1)} color={T.textDim} active={tab > 0}>
                ← {tab > 0 ? TABS[tab - 1].short : "—"}
              </Btn>
              <Btn onClick={() => navigate(tab + 1)} color={T.blue} active={tab < TABS.length - 1}>
                {tab < TABS.length - 1 ? TABS[tab + 1].short : "Fin"} →
              </Btn>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
