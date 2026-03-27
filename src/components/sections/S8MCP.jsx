import { useState, useEffect, useRef } from "react";
import { T } from "../tokens.js";
import { CodeBlock, Callout, SectionTitle } from "../shared.jsx";

const mcpItems = [
    {
      id:0, slug:"que-es-mcp", name:"¿Qué es MCP?", icon:"🔌", color:T.blue,
      title:"Model Context Protocol",
      desc:"Protocolo abierto de Anthropic (2024) que estandariza cómo los LLMs se conectan a herramientas y fuentes de datos externas. Es el 'USB-C de los agentes de IA'.",
      flow:["LLM genera tool_use call","Agente detecta la llamada MCP","Conecta al servidor MCP (local/remoto)","Servidor ejecuta la acción","Retorna result al agente","Agente reinyecta el result al LLM"],
      example:`// MCP Server en Node.js (ejemplo)
import { Server } from "@modelcontextprotocol/sdk/server";

const server = new Server({ name: "laravel-tools" });

server.setRequestHandler("tools/call", async (req) => {
  if (req.params.name === "run_artisan") {
    const output = await exec(
      \`php artisan \${req.params.arguments.command}\`
    );
    return { content: [{ type: "text", text: output }] };
  }
});`,
    },
    {
      id:1, slug:"mcp-vs-api", name:"MCP vs API Tools", icon:"⚖️", color:T.amber,
      title:"MCP vs Herramientas Nativas",
      desc:"La diferencia clave: las API Tools están hardcoded en el agente. Los servidores MCP son externos, componibles y reutilizables entre diferentes agentes.",
      flow:["API Tools: definidas en el código del agente","MCP: servidores independientes y reutilizables","API Tools: requieren redeploy para cambiar","MCP: hot-swap sin recompilar el agente","Ambos: inyectan tool results en el contexto","MCP: ecosistema compartido entre herramientas"],
      example:`// Sin MCP (tool hardcoded en el agente)
const tools = [{
  name: "read_file",
  // Implementación acoplada al agente
}];

// Con MCP (servidor externo)
mcp_servers: [{
  type: "url",
  url: "https://filesystem.mcp.server/sse",
  name: "filesystem"
  // Reutilizable por cualquier agente
}]`,
    },
    {
      id:2, slug:"mcp-practica", name:"MCP en Práctica", icon:"🚀", color:T.green,
      title:"Servidores MCP populares",
      desc:"El ecosistema MCP crece rápidamente. Hoy existen servidores para casi cualquier herramienta del stack de desarrollo.",
      flow:["GitHub MCP: issues, PRs, repos","Filesystem MCP: leer/escribir archivos","Browser MCP: automatización web","Postgres MCP: queries SQL directas","Docker MCP: gestión de contenedores","Sentry MCP: errores en producción"],
      example:`// Agente con múltiples servidores MCP
{
  mcp_servers: [
    { url: "github.mcp.server", name: "github" },
    { url: "filesystem.mcp.server", name: "fs" },
    { url: "postgres.mcp.server", name: "db" }
  ],
  messages: [{
    role: "user",
    content: "Lee el PR #142, obtén las migraciones
              pendientes y ejecútalas en la DB de staging"
  }]
}
// El agente orquesta los 3 servidores MCP automáticamente`,
    },
    {
      id:3, slug:"mcp-contexto", name:"MCP y el Contexto", icon:"📦", color:T.purple,
      title:"MCP como fuente de contexto",
      desc:"Los resultados de MCP son context engineering: cada tool_result inyecta datos frescos en el context window. El agente decide qué herramientas llamar y cómo usar sus resultados.",
      flow:["MCP result llega como tool_result block","Se inyecta en el contexto del LLM","Ocupa 200-5,000 tokens por resultado","El LLM lo procesa con el contexto completo","El agente puede encadenar múltiples MCPs","Cada resultado alimenta la siguiente decisión"],
      example:`// Context window tras tool MCP
[system_prompt ~1,200T]
[user: "¿Hay errores en producción?"]
[tool_use: sentry_mcp.get_issues()]
[tool_result: {              ← MCP result inyectado
  "issues": [{
    "title": "OrderController: Column not found",
    "occurrences": 847,
    "first_seen": "2024-01-15T10:23:00Z",
    "file": "OrderController.php:47"
  }]
}]
[assistant: "Encontré 847 errores en producción..."]`,
    },
];

function itemFromHash() {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace("#", "");
  const found = mcpItems.find(m => m.slug === hash);
  return found ? found.id : null;
}

export default function S8MCP() {
  const [selected, setSelected] = useState(() => itemFromHash());
  const detailRef = useRef(null);

  const select = (id, slug) => {
    const next = selected === id ? null : id;
    if (next === null) {
      history.pushState(null, "", window.location.pathname);
      setSelected(null);
    } else {
      history.pushState(null, "", window.location.pathname + "#" + slug);
      setSelected(next);
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
    }
  };

  useEffect(() => {
    const onPop = () => setSelected(itemFromHash());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const active = selected !== null ? mcpItems[selected] : null;

  return (
    <div style={{animation:"fadeSlideIn 0.4s ease"}}>
      <SectionTitle icon="🔌" title="MCP — Model Context Protocol" color={T.blue}
        subtitle="El estándar abierto que conecta LLMs con el mundo exterior. MCP es la plomería que hace posible los agentes de IA capaces de actuar." />
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20}}>
        {mcpItems.map((m)=>(
          <div key={m.id} onClick={() => select(m.id, m.slug)}
            style={{
              background: selected===m.id ? `${m.color}18` : T.surface2,
              border:`1px solid ${selected===m.id?m.color:T.border}`,
              borderRadius:10, padding:16, cursor:"pointer", transition:"all 0.15s ease",
            }}>
            <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
              <span style={{fontSize:24}}>{m.icon}</span>
              <span style={{fontFamily:T.mono, fontSize:12, color:m.color, fontWeight:600}}>{m.name}</span>
            </div>
            <p style={{fontFamily:T.sans, fontSize:12, color:T.textMid, lineHeight:1.6}}>{m.desc}</p>
          </div>
        ))}
      </div>
      <div ref={detailRef} style={{marginBottom:16}}>
        {active && (
          <div>
            <div style={{
              background:`${active.color}0d`,
              border:`1px solid ${active.color}33`,
              borderRadius:10, padding:16, marginBottom:14,
            }}>
              <p style={{fontFamily:T.mono, fontSize:12, color:active.color, fontWeight:600, marginBottom:10}}>
                Flujo: {active.title}
              </p>
              <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
                {active.flow.map((f,i)=>(
                  <div key={i} style={{display:"flex", alignItems:"center", gap:6}}>
                    <div style={{
                      background:`${active.color}18`,
                      border:`1px solid ${active.color}44`,
                      borderRadius:6, padding:"4px 10px",
                      fontFamily:T.mono, fontSize:11, color:active.color,
                    }}>{i+1}. {f}</div>
                    {i < active.flow.length-1 && <span style={{color:T.textDim}}>→</span>}
                  </div>
                ))}
              </div>
            </div>
            <CodeBlock code={active.example} lang={active.name} />
          </div>
        )}
      </div>
      <Callout color={T.blue} icon="🌐">
        MCP convierte al agente en un hub de integración: en lugar de que cada agente reimplemente sus propias herramientas, comparten servidores MCP del ecosistema. Cursor, Claude Code, Windsurf y OpenCode todos soportan MCP.
      </Callout>
    </div>
  );
}
