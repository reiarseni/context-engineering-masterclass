import { useState } from "react";
import { T } from "../tokens.js";
import { Callout, SectionTitle } from "../shared.jsx";

export default function S6Cost() {
  const [turns, setTurns] = useState(5);
  const baseTokens = 2000;
  const growthFactor = 1.55;
  const inputPrice = 0.003/1000;
  const outputPrice = 0.015/1000;
  const turnTokens = Array.from({length:turns}, (_,i) => ({
    input: Math.round(baseTokens * Math.pow(growthFactor, i)),
    output: Math.round(300 * (1 + i*0.2)),
  }));
  const totalCost = turnTokens.reduce((a,t)=>a + t.input*inputPrice + t.output*outputPrice, 0);
  const maxInput = Math.max(...turnTokens.map(t=>t.input));
  const multiplier = (turnTokens[turns-1].input / turnTokens[0].input).toFixed(1);
  return (
    <div style={{animation:"fadeSlideIn 0.4s ease"}}>
      <SectionTitle icon="💸" title="El Costo Real del Contexto" color={T.red}
        subtitle="Cada turno acumula más tokens. El costo no crece linealmente — crece exponencialmente con cada re-envío del contexto." />
      <div style={{background:T.surface2, border:`1px solid ${T.border}`, borderRadius:12, padding:20, marginBottom:20}}>
        <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:20}}>
          <label style={{fontFamily:T.mono, fontSize:12, color:T.textMid}}>Turnos:</label>
          <input type="range" min="2" max="15" value={turns} onChange={e=>setTurns(+e.target.value)}
            style={{flex:1, accentColor:T.red}}/>
          <span style={{fontFamily:T.mono, fontSize:16, color:T.red, fontWeight:700, minWidth:30}}>{turns}</span>
        </div>
        <div style={{display:"flex", alignItems:"flex-end", gap:4, height:140, marginBottom:12}}>
          {turnTokens.map((t,i)=>(
            <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3}}>
              <span style={{fontFamily:T.mono, fontSize:8, color:T.textDim}}>{(t.input/1000).toFixed(1)}K</span>
              <div style={{
                width:"100%", borderRadius:"3px 3px 0 0",
                background:`linear-gradient(to top, ${T.red}, ${T.red}88)`,
                height:`${(t.input/maxInput)*120}px`,
                transition:"height 0.5s ease",
                boxShadow: i===turns-1 ? `0 0 12px ${T.red}77`:"none",
              }}/>
              <span style={{fontFamily:T.mono, fontSize:9, color:T.textDim}}>T{i+1}</span>
            </div>
          ))}
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>
          {[
            {label:"Costo Total", value:`$${totalCost.toFixed(4)}`, color:T.red, icon:"💰"},
            {label:"Tokens último turno", value:`${(turnTokens[turns-1].input/1000).toFixed(1)}K`, color:T.amber, icon:"📊"},
            {label:"Multiplicador", value:`${multiplier}×`, color:T.purple, icon:"📈"},
          ].map((m,i)=>(
            <div key={i} style={{
              background:`${m.color}0f`, border:`1px solid ${m.color}33`,
              borderRadius:8, padding:14, textAlign:"center",
            }}>
              <div style={{fontSize:22, marginBottom:6}}>{m.icon}</div>
              <div style={{fontFamily:T.mono, fontSize:20, color:m.color, fontWeight:700}}>{m.value}</div>
              <div style={{fontFamily:T.sans, fontSize:11, color:T.textDim, marginTop:4}}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
        <Callout color={T.green} icon="💡">
          Si resuelves en 3 turnos lo que tomaría 10, ahorras ~70% en tokens — y el código suele ser mejor porque el contexto está más limpio.
        </Callout>
        <Callout color={T.cyan} icon="🗜️">
          Cursor, Windsurf, Claude Code y OpenCode implementan auto-compact/summarization: comprimen el historial para mantener el contexto manejable sin perder información crítica.
        </Callout>
      </div>
    </div>
  );
}
