import { useState } from "react";
import { T } from "../tokens.js";
import { Badge, Callout, SectionTitle, Btn } from "../shared.jsx";

export default function S1Amnesia() {
  const [step, setStep] = useState(null);
  const demos = [
    {
      id:"req1", label:"Request #1", sublabel:'Usuario: "Hola, soy Juan"',
      color:T.blue, sent:[{role:"user",msg:"Hola, soy Juan"}],
      reply:"¡Hola Juan! ¿En qué puedo ayudarte hoy?", ok:true,
      note:"✓ Contexto fresco — el LLM recibe el nombre en este mismo request.",
    },
    {
      id:"req2", label:"Request #2 ❌", sublabel:'"¿Cómo me llamo?"',
      color:T.red, sent:[{role:"user",msg:"¿Cómo me llamo?"}],
      reply:"Lo siento, no tengo información sobre tu nombre. Cada conversación empieza desde cero para mí.", ok:false,
      note:"✗ Sin contexto — el LLM NO recuerda la conversación anterior. Cada request es stateless.",
    },
    {
      id:"req2ctx", label:"Request #2 ✓", sublabel:"Con historial reinyectado",
      color:T.green, sent:[
        {role:"user",msg:"Hola, soy Juan"},
        {role:"assistant",msg:"¡Hola Juan! ¿En qué puedo ayudarte?"},
        {role:"user",msg:"¿Cómo me llamo?"},
      ],
      reply:"Tu nombre es Juan, me lo dijiste al inicio de nuestra conversación.", ok:true,
      note:"✓ El agente reinyecta el historial completo — ahora el LLM 'recuerda'.",
    },
  ];
  const d = step !== null ? demos[step] : null;
  return (
    <div style={{animation:"fadeSlideIn 0.4s ease"}}>
      <SectionTitle icon="🧠" title="La Amnesia del LLM" color={T.purple}
        subtitle="Cada llamada al LLM es completamente stateless. No existe 'memoria' entre requests — el agente es quien construye e inyecta el contexto en cada llamada." />
      <div style={{
        background:T.surface2, border:`1px solid ${T.border}`, borderRadius:12,
        padding:20, marginBottom:20,
      }}>
        <p style={{fontFamily:T.mono, fontSize:12, color:T.cyan, marginBottom:16}}>// La analogía fundamental</p>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>
          {[
            {icon:"💻", label:"CPU", desc:"Procesa instrucciones\nno guarda estado", color:T.pink},
            {icon:"🧠", label:"LLM", desc:"Procesa tokens\nno recuerda nada", color:T.purple},
            {icon:"📀", label:"RAM / Contexto", desc:"Datos activos\ndel turno actual", color:T.cyan},
            {icon:"⚙️", label:"Sistema Op.", desc:"Gestiona recursos\ny procesos", color:T.amber},
            {icon:"🤖", label:"Agente", desc:"Empaqueta contexto\nen cada request", color:T.blue},
            {icon:"💾", label:"Disco / Memoria", desc:"Datos persistentes\nRAG, files, notas", color:T.green},
          ].map((x,i)=>(
            <div key={i} style={{
              background:`${x.color}0f`, border:`1px solid ${x.color}33`,
              borderRadius:8, padding:"12px", textAlign:"center",
            }}>
              <div style={{fontSize:22, marginBottom:6}}>{x.icon}</div>
              <div style={{fontFamily:T.mono, fontSize:11, color:x.color, fontWeight:600}}>{x.label}</div>
              <div style={{fontFamily:T.sans, fontSize:11, color:T.textDim, marginTop:4, whiteSpace:"pre-line"}}>{x.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex", gap:10, marginBottom:20, flexWrap:"wrap"}}>
        {demos.map((demo, i) => (
          <Btn key={demo.id} onClick={()=>setStep(i)} active={step===i}
            color={demo.color}>{demo.label}</Btn>
        ))}
      </div>
      {d && (
        <div style={{animation:"fadeSlideIn 0.3s ease", display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
          <div>
            <p style={{fontFamily:T.mono, fontSize:11, color:T.textDim, marginBottom:8}}>PAYLOAD ENVIADO AL LLM</p>
            <div style={{background:"#050912", borderRadius:8, border:`1px solid ${T.border}`, padding:14}}>
              {d.sent.map((m,i)=>(
                <div key={i} style={{marginBottom:8, display:"flex", gap:8}}>
                  <Badge color={m.role==="user"?T.blue:T.pink} small>{m.role}</Badge>
                  <span style={{fontFamily:T.mono, fontSize:12, color:T.text}}>{m.msg}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{fontFamily:T.mono, fontSize:11, color:T.textDim, marginBottom:8}}>RESPUESTA DEL LLM</p>
            <div style={{
              background: d.ok ? `${T.green}0f`:`${T.red}0f`,
              border:`1px solid ${d.ok?T.green:T.red}44`,
              borderRadius:8, padding:14,
            }}>
              <p style={{fontFamily:T.sans, fontSize:13, color:T.text, lineHeight:1.6}}>{d.reply}</p>
            </div>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <Callout color={d.ok?T.green:T.red} icon={d.ok?"✅":"❌"}>{d.note}</Callout>
          </div>
        </div>
      )}
      {step === null && (
        <Callout color={T.purple} icon="👆">Haz clic en los botones para simular los 3 escenarios de request.</Callout>
      )}
    </div>
  );
}
