import { useState, useEffect } from 'react';
import { T } from './tokens.js';

export function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < bp);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [bp]);
  return m;
}

export const Badge = ({ color, children, small }) => (
  <span style={{
    display:"inline-block", padding: small?"2px 7px":"3px 10px",
    borderRadius:4, fontSize: small?10:11, fontFamily:T.mono,
    fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase",
    background:`${color}22`, color, border:`1px solid ${color}44`,
  }}>{children}</span>
);

export const CodeBlock = ({ code, lang="php", highlights=[] }) => {
  const lines = code.split("\n");
  return (
    <div style={{ background:"#050912", borderRadius:8, overflow:"hidden",
      border:`1px solid ${T.border}`, fontFamily:T.mono, fontSize:12 }}>
      <div style={{ background:T.surface2, padding:"6px 14px", display:"flex",
        alignItems:"center", gap:8, borderBottom:`1px solid ${T.border}` }}>
        {["#ef4444","#f59e0b","#22c55e"].map((c,i)=>
          <div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
        <span style={{color:T.textDim, fontSize:11, marginLeft:6}}>{lang}</span>
      </div>
      <div style={{padding:"14px 0", overflowX:"auto"}}>
        {lines.map((line, i) => (
          <div key={i} style={{
            padding:"1px 16px", lineHeight:"1.7",
            background: highlights.includes(i+1) ? `${T.amber}18` : "transparent",
            borderLeft: highlights.includes(i+1) ? `2px solid ${T.amber}` : "2px solid transparent",
          }}>
            <span style={{color:T.textDim, marginRight:16, userSelect:"none", fontSize:10}}>{String(i+1).padStart(2,"0")}</span>
            <span style={{color:T.text}}>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Callout = ({ color=T.blue, icon="💡", children }) => (
  <div style={{
    background:`${color}0d`, border:`1px solid ${color}33`,
    borderLeft:`3px solid ${color}`, borderRadius:8,
    padding:"12px 16px", display:"flex", gap:12, alignItems:"flex-start",
  }}>
    <span style={{fontSize:16, flexShrink:0, marginTop:1}}>{icon}</span>
    <p style={{fontFamily:T.sans, fontSize:13, color:T.textMid, lineHeight:1.65}}>{children}</p>
  </div>
);

export const SectionTitle = ({ icon, title, subtitle, color=T.blue }) => (
  <div style={{marginBottom:28}}>
    <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:8}}>
      <div style={{
        width:40, height:40, borderRadius:10, background:`${color}1a`,
        border:`1px solid ${color}44`, display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:20,
      }}>{icon}</div>
      <h2 style={{fontFamily:T.mono, fontSize:22, fontWeight:600, color:T.text}}>{title}</h2>
    </div>
    {subtitle && <p style={{fontFamily:T.sans, fontSize:14, color:T.textMid, lineHeight:1.65, paddingLeft:52}}>{subtitle}</p>}
  </div>
);

export const Btn = ({ onClick, children, color=T.blue, active, small }) => (
  <button onClick={onClick} style={{
    background: active ? `${color}22` : "transparent",
    border: `1px solid ${active ? color : T.border}`,
    color: active ? color : T.textMid,
    padding: small ? "5px 12px":"8px 16px",
    borderRadius:6, cursor:"pointer", fontFamily:T.mono,
    fontSize: small ? 11:12, fontWeight:500,
    transition:"all 0.18s ease",
  }}>{children}</button>
);
