import { useState } from "react";
import { T } from "../tokens.js";
import { Badge, Callout, SectionTitle, Btn } from "../shared.jsx";

export default function S9Agents() {
  const [view, setView] = useState("anatomy");
  const agents = [
    {name:"Cursor", icon:"⚡", color:T.blue, model:"GPT-4o / Claude Sonnet",
     strengths:["Cursor Rules (.cursorrules)","Context-aware autocomplete","Multi-file edits","MCP support"],
     context:"~200K tokens"},
    {name:"Windsurf", icon:"🏄", color:T.cyan, model:"Claude Sonnet / GPT-4o",
     strengths:["Cascade (multi-step agent)",".windsurfrules","Deep repo indexing","Flows automation"],
     context:"~200K tokens"},
    {name:"Claude Code", icon:"🧠", color:T.purple, model:"Claude 3.5/3.7 Sonnet",
     strengths:["CLAUDE.md project files","Bash nativo","MCP nativo","Subagentes paralelos"],
     context:"~200K tokens"},
    {name:"OpenCode", icon:"🔓", color:T.amber, model:"Configurable (cualquier LLM)",
     strengths:["Open source","Multi-LLM","Altamente configurable","CLI-first"],
     context:"Depende del modelo"},
  ];
  const anatomy = [
    {layer:"Interfaz de Usuario", color:T.blue, desc:"IDE plugin, CLI, web UI — donde el dev escribe su petición",items:["Editor integration","Chat UI","Terminal"]},
    {layer:"Orquestador del Agente", color:T.purple, desc:"El cerebro: decide qué herramientas usar, construye el contexto, maneja el loop",items:["Context builder","Tool router","State manager"]},
    {layer:"Context Engine", color:T.cyan, desc:"Ensambla el payload: system prompt, skills, memorias, historial, archivos",items:["Prompt assembly","RAG retrieval","Memory injection"]},
    {layer:"LLM API", color:T.pink, desc:"El modelo de lenguaje que procesa el contexto y genera la respuesta",items:["Token processing","Tool calls","Output generation"]},
    {layer:"Tool Executor", color:T.amber, desc:"Ejecuta las herramientas que el LLM solicita: bash, file I/O, MCP servers",items:["Bash execution","File read/write","MCP clients"]},
    {layer:"Memoria & Storage", color:T.green, desc:"Persiste información entre sesiones: notas, decisiones, embeddings",items:["Project memory","Embeddings","File index"]},
  ];
  return (
    <div style={{animation:"fadeSlideIn 0.4s ease"}}>
      <SectionTitle icon="🤖" title="Agentes de Programación" color={T.purple}
        subtitle="Los agentes son la capa de orquestación que convierte un LLM stateless en un asistente de desarrollo autónomo y capaz." />
      <div style={{display:"flex", gap:10, marginBottom:20}}>
        <Btn onClick={()=>setView("anatomy")} active={view==="anatomy"} color={T.purple}>🏗️ Anatomía</Btn>
        <Btn onClick={()=>setView("compare")} active={view==="compare"} color={T.blue}>⚡ Comparar Agentes</Btn>
      </div>
      {view === "anatomy" && (
        <div style={{animation:"fadeSlideIn 0.3s ease"}}>
          <div style={{display:"flex", flexDirection:"column", gap:3, marginBottom:20}}>
            {anatomy.map((l,i)=>(
              <div key={i} style={{
                background:`${l.color}0f`, border:`1px solid ${l.color}33`,
                borderRadius:8, padding:"12px 16px",
                display:"flex", alignItems:"center", gap:16,
              }}>
                <div style={{
                  minWidth:28, height:28, borderRadius:"50%",
                  background:`${l.color}22`, border:`1px solid ${l.color}66`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:T.mono, fontSize:11, color:l.color, fontWeight:700,
                }}>{anatomy.length-i}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:T.mono, fontSize:12, color:l.color, fontWeight:600, marginBottom:3}}>{l.layer}</div>
                  <div style={{fontFamily:T.sans, fontSize:12, color:T.textMid}}>{l.desc}</div>
                </div>
                <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
                  {l.items.map((item,j)=><Badge key={j} color={l.color} small>{item}</Badge>)}
                </div>
              </div>
            ))}
          </div>
          <Callout color={T.purple} icon="🎭">
            El agente es el director de orquesta: el LLM es el músico talentoso que no recuerda nada entre piezas. El agente es quien lleva la partitura completa, decide qué tocar y cuándo.
          </Callout>
        </div>
      )}
      {view === "compare" && (
        <div style={{animation:"fadeSlideIn 0.3s ease"}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20}}>
            {agents.map((ag,i)=>(
              <div key={i} style={{
                background:`${ag.color}0d`, border:`1px solid ${ag.color}33`,
                borderRadius:10, padding:16,
              }}>
                <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:12}}>
                  <span style={{fontSize:26}}>{ag.icon}</span>
                  <div>
                    <div style={{fontFamily:T.mono, fontSize:14, color:ag.color, fontWeight:700}}>{ag.name}</div>
                    <div style={{fontFamily:T.mono, fontSize:10, color:T.textDim}}>{ag.model}</div>
                  </div>
                  <Badge color={ag.color} small>{ag.context}</Badge>
                </div>
                <div style={{display:"flex", flexDirection:"column", gap:4}}>
                  {ag.strengths.map((s,j)=>(
                    <div key={j} style={{display:"flex", alignItems:"center", gap:7}}>
                      <span style={{color:ag.color, fontSize:12}}>▸</span>
                      <span style={{fontFamily:T.sans, fontSize:12, color:T.textMid}}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Callout color={T.amber} icon="🤝">
            Todos usan el mismo principio: construir contexto → enviar al LLM → ejecutar herramientas → re-enviar. La diferencia está en qué tan bien optimizan ese loop y qué herramientas ofrecen.
          </Callout>
        </div>
      )}
    </div>
  );
}
