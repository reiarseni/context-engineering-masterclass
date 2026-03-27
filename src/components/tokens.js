export const T = {
  bg:       "#070b14",
  surface:  "#0e1628",
  surface2: "#131d33",
  border:   "#1e2d4a",
  borderBright: "#2a3f66",
  blue:     "#3b82f6",
  blueD:    "#1d4ed8",
  purple:   "#a855f7",
  purpleD:  "#7c3aed",
  amber:    "#f59e0b",
  amberD:   "#d97706",
  green:    "#22c55e",
  greenD:   "#15803d",
  red:      "#ef4444",
  redD:     "#b91c1c",
  pink:     "#ec4899",
  pinkD:    "#be185d",
  cyan:     "#06b6d4",
  cyanD:    "#0e7490",
  text:     "#e2e8f0",
  textMid:  "#94a3b8",
  textDim:  "#475569",
  mono:     "'IBM Plex Mono', 'Fira Code', monospace",
  sans:     "'IBM Plex Sans', 'Inter', sans-serif",
};

export const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
@keyframes fadeSlideIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes barGrow { from{height:0} to{height:var(--h)} }
@keyframes stepGlow { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0)} 50%{box-shadow:0 0 16px 4px rgba(59,130,246,0.35)} }
@keyframes scanline { 0%{top:0%} 100%{top:100%} }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes gradientShift {0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%}}
* { box-sizing: border-box; margin:0; padding:0; }
::-webkit-scrollbar{width:6px;height:6px} ::-webkit-scrollbar-track{background:#0e1628} ::-webkit-scrollbar-thumb{background:#1e2d4a;border-radius:3px}
`;
