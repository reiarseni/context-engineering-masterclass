import { useState, useEffect } from "react";
import { T } from "../tokens.js";
import { Callout, SectionTitle, Btn, CodeBlock } from "../shared.jsx";

export default function S3LostMiddle() {
  const [show, setShow] = useState(true);
  const [animated, setAnimated] = useState(false);
  useEffect(()=>{ setTimeout(()=>setAnimated(true), 200); },[]);
  const bars = [
    {pos:"Inicio",att:92,label:"System Prompt\n.rules files"},{pos:"",att:85,label:"Primeros\nmensajes"},
    {pos:"",att:72,label:"Historial\ntemprano"},{pos:"",att:55,label:"Tool results"},
    {pos:"🔴 MEDIO",att:38,label:"Archivos\nRAG medio"},{pos:"",att:31,label:"Contexto\nolvidado"},
    {pos:"",att:29,label:"← pérdida\nmáxima →"},{pos:"",att:33,label:"Recuperando\natención"},
    {pos:"",att:48,label:"Historial\nreciente"},{pos:"",att:74,label:"Último\ntool result"},
    {pos:"Final",att:95,label:"Mensaje\nactual"},
  ];
  const getColor = (v) => {
    if(v>=80) return T.green;
    if(v>=60) return T.amber;
    if(v>=45) return "#f97316";
    return T.red;
  };
  return (
    <div style={{animation:"fadeSlideIn 0.4s ease"}}>
      <SectionTitle icon="👁️" title="Lost in the Middle" color={T.amber}
        subtitle="El LLM presta máxima atención al inicio y final del contexto. El contenido en el medio se atenúa — el modelo literalmente 'pierde el hilo'." />
      <div style={{display:"flex", gap:10, marginBottom:20}}>
        <Btn onClick={()=>setShow(v=>!v)} active={show} color={T.amber}>
          {show?"Ocultar":"Mostrar"} Heatmap
        </Btn>
      </div>
      {show && (
        <div style={{
          animation:"fadeSlideIn 0.35s ease",
          background:T.surface2, border:`1px solid ${T.border}`,
          borderRadius:12, padding:24, marginBottom:20,
        }}>
          <div style={{display:"flex", alignItems:"flex-end", gap:6, height:200, marginBottom:12}}>
            {bars.map((b,i)=>(
              <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4}}>
                <span style={{fontFamily:T.mono, fontSize:9, color:getColor(b.att)}}>{b.att}%</span>
                <div style={{
                  width:"100%", borderRadius:"4px 4px 0 0",
                  background:`linear-gradient(to top, ${getColor(b.att)}, ${getColor(b.att)}88)`,
                  height: animated ? `${b.att*1.8}px` : "0px",
                  transition:`height 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i*0.06}s`,
                  boxShadow:`0 0 12px ${getColor(b.att)}55`,
                }}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex", alignItems:"flex-start", gap:6}}>
            {bars.map((b,i)=>(
              <div key={i} style={{flex:1, textAlign:"center"}}>
                {b.pos && <div style={{fontFamily:T.mono, fontSize:9, color:b.pos.includes("MEDIO")?T.red:T.green, fontWeight:600, marginBottom:2}}>{b.pos}</div>}
                <div style={{fontFamily:T.mono, fontSize:8, color:T.textDim, whiteSpace:"pre-line", lineHeight:1.4}}>{b.label}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16, display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap"}}>
            {[{c:T.green,l:"Alta atención (>80%)"},{c:T.amber,l:"Media (60-80%)"},{c:"#f97316",l:"Baja (45-60%)"},{c:T.red,l:"Pérdida de foco (<45%)"}].map((x,i)=>(
              <div key={i} style={{display:"flex", alignItems:"center", gap:6}}>
                <div style={{width:10,height:10,borderRadius:2,background:x.c}}/>
                <span style={{fontFamily:T.mono, fontSize:10, color:T.textMid}}>{x.l}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20}}>
        <Callout color={T.red} icon="⚠️">
          Contextos fragmentados producen una caída del 39% en rendimiento (paper "Lost in the Middle", Stanford 2023). El orden importa tanto como el contenido.
        </Callout>
        <Callout color={T.green} icon="🎯">
          Regla práctica: pon el contexto crítico (archivos clave, error exacto, objetivo) al INICIO del system prompt Y al FINAL como mensaje del usuario.
        </Callout>
      </div>
      <CodeBlock lang="❌ Mal — contexto crítico en el medio" code={`// ❌ Sistema largo → contexto clave sepultado en el centro
[Sistema extenso 2000 tokens...]
   ← AQUÍ: "El error está en OrderController línea 47" ←
[Más contexto, tool results, historial...]
Usuario: "Arréglalo"`} />
      <div style={{height:12}}/>
      <CodeBlock lang="✅ Bien — sandwich injection" code={`// ✅ Contexto crítico al INICIO y al FINAL
INICIO → "Error en OrderController.php línea 47: Column not found"
[Sistema, historial, herramientas...]
FINAL → Usuario: "El error crítico es en línea 47 de OrderController. Arréglalo."`} />
    </div>
  );
}
