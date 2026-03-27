import { useState } from "react";
import { T } from "../tokens.js";
import { Badge, Callout, SectionTitle, Btn, useMobile } from "../shared.jsx";

export default function S11Interaction() {
  const isMobile = useMobile();
  const [flow, setFlow] = useState(null);
  const flows = [
    {
      id:0, name:"Request Completo", icon:"🔄", color:T.blue,
      desc:"Cómo Skills, MCP, Memorias y el Agente trabajan juntos en un solo request.",
      steps:[
        {actor:"Dev", color:T.blue, text:"'Arregla el bug de validación en OrderController'"},
        {actor:"Agente", color:T.purple, text:"Lee CLAUDE.md (Memoria Semántica) + .cursorrules (Skill) para entender el proyecto"},
        {actor:"Agente", color:T.purple, text:"Consulta RAG: busca archivos relevantes en el codebase indexado (Memoria Externa)"},
        {actor:"Agente", color:T.purple, text:"Ensambla contexto: System + Skills + Memorias + Historial (Context Engineering)"},
        {actor:"LLM", color:T.pink, text:"Procesa contexto completo → decide llamar read_file vía MCP Filesystem"},
        {actor:"MCP", color:T.amber, text:"Servidor MCP lee OrderController.php, Order.php, migration → retorna contenido"},
        {actor:"Agente", color:T.purple, text:"Reinyecta todo + tool_results → LLM genera el fix"},
        {actor:"LLM", color:T.pink, text:"Genera el código corregido con el contexto completo del proyecto"},
        {actor:"Agente", color:T.purple, text:"Escribe el archivo, ejecuta php artisan test via MCP → guarda resultado en Memoria Episódica"},
        {actor:"Dev", color:T.green, text:"✓ Bug resuelto, contexto del proyecto actualizado para la próxima sesión"},
      ],
    },
    {
      id:1, name:"Skills + MCP", icon:"🔌", color:T.cyan,
      desc:"Cuando un Skill activa un servidor MCP para ejecutar acciones especializadas.",
      steps:[
        {actor:"Dev", color:T.blue, text:"'Crea un documento Word con el informe de la API'"},
        {actor:"Agente", color:T.purple, text:"Detecta la tarea → busca SKILL.md para docx en /mnt/skills/"},
        {actor:"Skill", color:T.cyan, text:"Lee SKILL.md: instrucciones para python-docx, estilos, estructura"},
        {actor:"Agente", color:T.purple, text:"Inyecta el SKILL en el system prompt → LLM ahora 'sabe' crear docx"},
        {actor:"LLM", color:T.pink, text:"Genera el código Python para crear el documento"},
        {actor:"MCP/Bash", color:T.amber, text:"Ejecuta el script: pip install python-docx → genera el .docx"},
        {actor:"Agente", color:T.purple, text:"Mueve el archivo a /mnt/user-data/outputs/ → presenta al usuario"},
        {actor:"Dev", color:T.green, text:"✓ Documento descargable generado con el skill correcto"},
      ],
    },
    {
      id:2, name:"Memoria + RAG", icon:"🧬", color:T.green,
      desc:"Cómo la memoria episódica y el RAG trabajan juntos para evitar repetir errores.",
      steps:[
        {actor:"Dev", color:T.blue, text:"Nueva sesión: 'Agrega autenticación al endpoint de órdenes'"},
        {actor:"Agente", color:T.purple, text:"Consulta Memoria Episódica: '¿hubo problemas de auth antes?'"},
        {actor:"Memoria", color:T.green, text:"Retorna: 'Sesión anterior: Session auth falló → usar Sanctum tokens'"},
        {actor:"Agente", color:T.purple, text:"Consulta RAG: busca 'sanctum auth' en el codebase indexado"},
        {actor:"RAG", color:T.amber, text:"Retorna: config/sanctum.php + AuthController.php + auth middleware"},
        {actor:"Agente", color:T.purple, text:"Ensambla contexto con memorias + RAG results → LLM tiene todo el histórico"},
        {actor:"LLM", color:T.pink, text:"Genera auth middleware correcto con Sanctum, SIN repetir el error de Sessions"},
        {actor:"Dev", color:T.green, text:"✓ Auth implementado correctamente gracias a la memoria del agente"},
      ],
    },
  ];
  const f = flow !== null ? flows[flow] : null;
  return (
    <div style={{animation:"fadeSlideIn 0.4s ease"}}>
      <SectionTitle icon="🕸️" title="Interacción entre Sistemas" color={T.pink}
        subtitle="Skills, MCP, Memorias y el Agente no operan en silos — se orquestan en tiempo real para resolver tareas complejas." />
      <div style={{
        background:T.surface2, border:`1px solid ${T.border}`, borderRadius:12,
        padding:24, marginBottom:20,
      }}>
        <p style={{fontFamily:T.mono, fontSize:11, color:T.textDim, marginBottom:16}}>ARQUITECTURA DE ORQUESTACIÓN</p>
        <div style={{position:"relative"}}>
          <div style={{display:"flex", justifyContent:"center", marginBottom:20}}>
            <div style={{
              background:`${T.purple}22`, border:`2px solid ${T.purple}`,
              borderRadius:12, padding:"16px 32px", textAlign:"center",
              boxShadow:`0 0 24px ${T.purple}44`,
            }}>
              <div style={{fontSize:28, marginBottom:4}}>🤖</div>
              <div style={{fontFamily:T.mono, fontSize:13, color:T.purple, fontWeight:700}}>AGENTE</div>
              <div style={{fontFamily:T.sans, fontSize:11, color:T.textDim}}>Orquestador central</div>
            </div>
          </div>
          <div style={{display:"grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap:12}}>
            {[
              {icon:"🛠️", label:"Skills", color:T.cyan, desc:"Conocimiento\nmodular"},
              {icon:"🔌", label:"MCP Servers", color:T.amber, desc:"Herramientas\nexternas"},
              {icon:"🧬", label:"Memorias", color:T.green, desc:"Estado\npersistente"},
              {icon:"🧠", label:"LLM", color:T.pink, desc:"Motor de\nrazonamiento"},
            ].map((s,i)=>(
              <div key={i} style={{
                background:`${s.color}0f`, border:`1px solid ${s.color}44`,
                borderRadius:10, padding:14, textAlign:"center",
              }}>
                <div style={{fontSize:22, marginBottom:6}}>{s.icon}</div>
                <div style={{fontFamily:T.mono, fontSize:11, color:s.color, fontWeight:600}}>{s.label}</div>
                <div style={{fontFamily:T.sans, fontSize:10, color:T.textDim, marginTop:4, whiteSpace:"pre-line"}}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop:16, background:`${T.purple}0a`, border:`1px solid ${T.border}`,
            borderRadius:8, padding:12, display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center",
          }}>
            {["Skills → inyectan conocimiento al contexto","MCP → inyectan resultados de herramientas","Memorias → inyectan contexto histórico","LLM → genera respuestas con todo el contexto"].map((fl,i)=>(
              <div key={i} style={{
                background:T.surface, border:`1px solid ${T.borderBright}`,
                borderRadius:5, padding:"4px 12px",
                fontFamily:T.mono, fontSize:10, color:T.textMid,
              }}>→ {fl}</div>
            ))}
          </div>
        </div>
      </div>
      <p style={{fontFamily:T.mono, fontSize:11, color:T.textDim, marginBottom:12}}>FLUJOS DE EJEMPLO — clic para explorar</p>
      <div style={{display:"flex", gap:10, marginBottom:16, flexWrap:"wrap"}}>
        {flows.map((fl,i)=>(
          <Btn key={i} onClick={()=>setFlow(flow===i?null:i)} active={flow===i} color={fl.color}>
            {fl.icon} {fl.name}
          </Btn>
        ))}
      </div>
      {f && (
        <div style={{animation:"fadeSlideIn 0.3s ease", marginBottom:20}}>
          <p style={{fontFamily:T.sans, fontSize:13, color:T.textMid, marginBottom:14}}>{f.desc}</p>
          <div style={{display:"flex", flexDirection:"column", gap:4}}>
            {f.steps.map((st,i)=>(
              <div key={i} style={{
                display:"flex", alignItems:"flex-start", gap:12,
                background:`${st.color}08`, border:`1px solid ${st.color}22`,
                borderRadius:7, padding:"10px 14px",
              }}>
                <div style={{
                  minWidth:24, height:24, borderRadius:"50%",
                  background:`${st.color}22`, border:`1px solid ${st.color}55`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:T.mono, fontSize:9, color:st.color, fontWeight:700, flexShrink:0,
                }}>{i+1}</div>
                <div>
                  <Badge color={st.color} small>{st.actor}</Badge>
                  <p style={{fontFamily:T.sans, fontSize:12, color:T.text, marginTop:4, lineHeight:1.6}}>{st.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Callout color={T.pink} icon="🎯">
        La maestría en context engineering no es sobre un solo concepto — es sobre orquestar Skills, MCP, Memorias y el Loop Agéntico para que el LLM tenga exactamente el contexto correcto, en el orden correcto, en el momento correcto.
      </Callout>
    </div>
  );
}
