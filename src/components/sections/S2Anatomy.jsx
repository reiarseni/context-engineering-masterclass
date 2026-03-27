import { useState, useEffect, useRef } from "react";
import { T } from "../tokens.js";
import { Badge, CodeBlock, Callout, SectionTitle } from "../shared.jsx";

function blockFromHash(blocks) {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace("#", "");
  const found = blocks.find(b => b.slug === hash);
  return found ? found.id : null;
}

export default function S2Anatomy() {
  const blocks = [
    { id:0, slug:"system-prompt",  label:"System Prompt",    tokens:"~1,200 tok", color:T.purple, pct:14,
      desc:"Instrucciones base del agente: rol, comportamiento, restricciones. Define quién 'es' el LLM.",
      example:"You are an expert PHP/Laravel developer. Always follow PSR-12 coding standards..." },
    { id:1, slug:"reglas",         label:"Reglas / .rules",  tokens:"~800 tok",   color:T.cyan,   pct:10,
      desc:"Archivos de configuración del proyecto: .cursorrules, .windsurfrules, CLAUDE.md, etc.",
      example:"# Project Rules\n- Use Eloquent ORM, avoid raw queries\n- Controllers in app/Http/Controllers/Api/\n- Always return JsonResponse" },
    { id:2, slug:"memorias",       label:"Memorias",          tokens:"~400 tok",   color:T.pink,   pct:5,
      desc:"Hechos persistentes sobre el proyecto: arquitectura, decisiones tomadas, preferencias del dev.",
      example:"• Auth uses Laravel Sanctum (tokens, not sessions)\n• Orders table has soft deletes\n• Frontend uses React + Inertia.js" },
    { id:3, slug:"historial",      label:"Historial de Chat", tokens:"~2,000+ tok",color:T.blue,   pct:25,
      desc:"Todos los turnos previos de la conversación. Crece con cada mensaje — el mayor consumidor.",
      example:"User: Fix the OrderController@store method\nAgent: I'll read the file first...\n[tool_result: file content...]\nAgent: Found the issue in line 47..." },
    { id:4, slug:"archivos",       label:"Archivos / RAG",    tokens:"500–5,000 tok",color:T.amber, pct:30,
      desc:"Contenido de archivos leídos por el agente: controllers, models, migrations, componentes React.",
      example:"// app/Http/Controllers/Api/OrderController.php\nclass OrderController extends Controller {\n  public function store(Request $req) {\n    $order = Order::create($req->validated());\n    return response()->json($order, 201);\n  }\n}" },
    { id:5, slug:"tool-results",   label:"Tool Results",      tokens:"variable",   color:T.green,  pct:10,
      desc:"Resultados de herramientas ejecutadas: output de 'php artisan test', 'npm run build', bash, etc.",
      example:"$ php artisan test --filter=OrderTest\n✓ can create order (123ms)\n✗ validates required fields\n  Expected 422, got 200" },
    { id:6, slug:"tu-mensaje",     label:"Tu Mensaje",        tokens:"~30–100 tok",color:T.text,   pct:2,
      desc:"Lo que tú escribiste. Generalmente < 1% del contexto total enviado.",
      example:"Fix the validation error in OrderController" },
  ];

  const [selected, setSelected] = useState(() => blockFromHash(blocks));
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
    const onPop = () => setSelected(blockFromHash(blocks));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const active = selected !== null ? blocks[selected] : null;

  return (
    <div style={{animation:"fadeSlideIn 0.4s ease"}}>
      <SectionTitle icon="📦" title="Anatomía de un Request" color={T.cyan}
        subtitle="Cada llamada al LLM contiene múltiples capas de contexto. Click en cada bloque para explorar su contenido." />
      <div style={{
        background:T.surface2, border:`1px solid ${T.border}`, borderRadius:12,
        padding:20, marginBottom:20,
      }}>
        <p style={{fontFamily:T.mono, fontSize:11, color:T.textDim, marginBottom:14}}>COMPOSICIÓN DEL CONTEXT WINDOW — click para explorar</p>
        <div style={{display:"flex", gap:3, height:48, borderRadius:8, overflow:"hidden", marginBottom:16}}>
          {blocks.map((b)=>(
            <div key={b.id}
              onClick={() => select(b.id, b.slug)}
              style={{
                flex:b.pct, background:`${b.color}${selected===b.id?"55":"33"}`,
                border:`1px solid ${b.color}${selected===b.id?"":"44"}`,
                borderRadius:4, cursor:"pointer", transition:"all 0.15s ease",
                display:"flex", alignItems:"center", justifyContent:"center",
                transform: selected===b.id?"scaleY(1.08)":"scaleY(1)",
              }}>
              {b.pct > 6 && <span style={{fontFamily:T.mono, fontSize:9, color:b.color, fontWeight:600}}>{b.pct}%</span>}
            </div>
          ))}
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8}}>
          {blocks.map((b)=>(
            <div key={b.id}
              onClick={() => select(b.id, b.slug)}
              style={{
                background: selected===b.id ? `${b.color}18`:`${b.color}0a`,
                border:`1px solid ${selected===b.id?b.color:b.color+"33"}`,
                borderRadius:7, padding:"10px 12px", cursor:"pointer",
                transition:"all 0.15s ease",
              }}>
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                <span style={{fontFamily:T.mono, fontSize:11, color:b.color, fontWeight:600}}>{b.label}</span>
              </div>
              <span style={{fontFamily:T.mono, fontSize:10, color:T.textDim}}>{b.tokens}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={detailRef} style={{marginBottom:20}}>
        {active && (
          <div style={{
            background:`${active.color}0d`,
            border:`1px solid ${active.color}44`,
            borderRadius:10, padding:18,
          }}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:10}}>
              <span style={{fontFamily:T.mono, fontSize:13, color:active.color, fontWeight:600}}>
                {active.label}
              </span>
              <Badge color={active.color}>{active.tokens}</Badge>
            </div>
            <p style={{fontFamily:T.sans, fontSize:13, color:T.textMid, marginBottom:14, lineHeight:1.6}}>
              {active.desc}
            </p>
            <CodeBlock code={active.example} lang="ejemplo" />
          </div>
        )}
      </div>

      <Callout color={T.amber} icon="⚡">
        Tu mensaje ocupa ~1% del request. El otro 99% es contexto construido por el agente. Entender esto es la clave del context engineering.
      </Callout>
    </div>
  );
}
