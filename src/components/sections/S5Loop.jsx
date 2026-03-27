import { useState, useEffect, useRef } from "react";
import { T } from "../tokens.js";
import { Badge, Callout, SectionTitle, Btn } from "../shared.jsx";

export default function S5Loop() {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);
  const steps = [
    {id:0, actor:"Usuario", color:T.blue, icon:"👤",
      title:"Petición inicial",
      desc:"El usuario escribe su request en Cursor, Windsurf, Claude Code u OpenCode.",
      payload:"Crea un endpoint POST /api/orders en Laravel con validación y respuesta JSON"},
    {id:1, actor:"Agente", color:T.purple, icon:"🤖",
      title:"Empaqueta el contexto",
      desc:"El agente construye el payload: system prompt + reglas + memorias + archivos relevantes + mensaje.",
      payload:"[SystemPrompt 1.2K] + [.cursorrules 800T] + [historial 0T] + [mensaje usuario ~30T]"},
    {id:2, actor:"API", color:T.amber, icon:"⚡",
      title:"Envía tokens al LLM",
      desc:"El payload viaja a la API (Anthropic, OpenAI, etc.). Se cobra por input tokens.",
      payload:"POST api.anthropic.com/v1/messages → ~2,100 tokens input"},
    {id:3, actor:"LLM", color:T.pink, icon:"🧠",
      title:"LLM decide usar herramienta",
      desc:"El modelo responde que necesita leer archivos antes de escribir código.",
      payload:'tool_use: read_file("app/Http/Controllers/Api/OrderController.php")'},
    {id:4, actor:"Agente", color:T.purple, icon:"🔧",
      title:"Ejecuta la herramienta",
      desc:"El agente ejecuta read_file en el sistema de archivos del proyecto.",
      payload:"Leyendo OrderController.php... 187 líneas, 4.2KB"},
    {id:5, actor:"Agente", color:T.purple, icon:"📦",
      title:"RE-ENVÍA TODO + tool result",
      desc:"El agente reenvía el contexto COMPLETO más el resultado de la herramienta. El LLM no 'recuerda'.",
      payload:"[Todo anterior ~2,100T] + [tool_result: OrderController.php ~800T] = ~2,900T"},
    {id:6, actor:"LLM", color:T.pink, icon:"✍️",
      title:"LLM genera el código",
      desc:"Ahora con el contexto completo, el LLM genera el nuevo endpoint y las instrucciones.",
      payload:"public function store(StoreOrderRequest $r) { $o = Order::create($r->validated()); return response()->json($o, 201); }"},
    {id:7, actor:"Agente", color:T.purple, icon:"💾",
      title:"Aplica los cambios",
      desc:"El agente escribe el código en el archivo, ejecuta php artisan test.",
      payload:"Escribiendo OrderController.php... ejecutando php artisan test --filter=OrderTest"},
    {id:8, actor:"Usuario", color:T.blue, icon:"👤",
      title:"Usuario revisa y corrige",
      desc:"El usuario ve el resultado y pide un ajuste: agregar el fetch() en React.",
      payload:"Falta el fetch() en OrderForm.jsx — agrégalo con error handling"},
    {id:9, actor:"Agente", color:T.purple, icon:"📦",
      title:"RE-ENVÍA TODO + corrección",
      desc:"El agente construye un nuevo payload con TODO el historial + la corrección del usuario.",
      payload:"[Todo anterior ~4,500T] + [OrderForm.jsx leído ~600T] + [corrección usuario ~30T] = ~5,130T"},
    {id:10, actor:"LLM", color:T.pink, icon:"✅",
      title:"LLM completa con contexto total",
      desc:"El LLM recibe el contexto total acumulado y genera el componente React completo.",
      payload:"const res = await fetch('/api/orders', { method:'POST', body:JSON.stringify(data) }); if(!res.ok) throw new Error(await res.text());"},
  ];
  const play = () => {
    setPlaying(true); setActiveStep(0);
    let i = 0;
    intervalRef.current = setInterval(()=>{
      i++; if(i>=steps.length){ clearInterval(intervalRef.current); setPlaying(false); return; }
      setActiveStep(i);
    }, 1400);
  };
  useEffect(()=>()=>clearInterval(intervalRef.current),[]);
  const s = steps[activeStep];
  return (
    <div style={{animation:"fadeSlideIn 0.4s ease"}}>
      <SectionTitle icon="🔄" title="El Loop Agéntico" color={T.blue}
        subtitle="El LLM nunca 'continúa' una conversación — recibe TODO desde cero en cada request. El agente es quien mantiene el estado." />
      <div style={{display:"flex", gap:10, marginBottom:20}}>
        <Btn onClick={play} active={playing} color={T.green}>▶ Animar</Btn>
        <Btn onClick={()=>setActiveStep(v=>Math.min(v+1,steps.length-1))} color={T.blue}>Paso →</Btn>
        <Btn onClick={()=>{setActiveStep(0);setPlaying(false);clearInterval(intervalRef.current);}} color={T.amber}>↺ Reset</Btn>
        <span style={{fontFamily:T.mono, fontSize:12, color:T.textDim, alignSelf:"center"}}>
          Paso {activeStep+1}/{steps.length}
        </span>
      </div>
      <div style={{display:"flex", overflowX:"auto", gap:4, paddingBottom:8, marginBottom:20}}>
        {steps.map((st,i)=>(
          <div key={i} onClick={()=>setActiveStep(i)}
            style={{
              minWidth:60, display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              cursor:"pointer",
            }}>
            <div style={{
              width:36, height:36, borderRadius:"50%",
              background: activeStep===i ? `${st.color}33` : activeStep>i ? `${st.color}18` : T.surface2,
              border:`2px solid ${activeStep>=i?st.color:T.border}`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:14,
              transition:"all 0.3s ease",
              boxShadow: activeStep===i ? `0 0 14px ${st.color}66`:"none",
            }}>{st.icon}</div>
            <span style={{fontFamily:T.mono, fontSize:9, color:activeStep>=i?st.color:T.textDim, textAlign:"center", whiteSpace:"nowrap"}}>
              {st.actor}
            </span>
          </div>
        ))}
      </div>
      <div style={{
        animation:"fadeSlideIn 0.25s ease",
        background:`${s.color}0d`, border:`1px solid ${s.color}44`,
        borderRadius:12, padding:20, marginBottom:16,
      }}>
        <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:12}}>
          <div style={{fontSize:28}}>{s.icon}</div>
          <div>
            <Badge color={s.color}>{s.actor}</Badge>
            <h3 style={{fontFamily:T.mono, fontSize:15, color:T.text, marginTop:4}}>{s.title}</h3>
          </div>
        </div>
        <p style={{fontFamily:T.sans, fontSize:13, color:T.textMid, lineHeight:1.65, marginBottom:14}}>{s.desc}</p>
        <div style={{background:"#050912", borderRadius:7, padding:"10px 14px", border:`1px solid ${T.border}`}}>
          <span style={{fontFamily:T.mono, fontSize:11, color:s.color}}>{s.payload}</span>
        </div>
      </div>
      <Callout color={T.red} icon="🔁">
        El LLM nunca "continúa" — recibe TODO desde cero cada vez. Lo que parece una conversación es en realidad el agente reconstruyendo y reenviando el contexto completo en cada turno.
      </Callout>
    </div>
  );
}
