import { useState } from "react";
import { T } from "../tokens.js";
import { Badge, CodeBlock, Callout, SectionTitle, useMobile } from "../shared.jsx";

export default function S7Skills() {
  const isMobile = useMobile();
  const [activeSkill, setActiveSkill] = useState(null);
  const skills = [
    {
      id:0, name:"SKILL.md / Reglas", icon:"📜", color:T.cyan,
      type:"Instruccional",
      desc:"Archivos de texto que contienen instrucciones especializadas para una tarea específica. El agente los lee e inyecta en el contexto cuando la tarea los requiere.",
      when:"Cuando el usuario pide crear un .docx, .pptx, .xlsx — el agente lee el SKILL.md correspondiente primero.",
      example:`# SKILL: docx
## Cuándo usarlo
Cuando el usuario pide crear documentos Word.

## Instrucciones
1. Instala python-docx si no está disponible
2. Usa estilos corporativos definidos aquí
3. Incluye tabla de contenidos automática
4. Exporta a /mnt/user-data/outputs/

## Ejemplo de uso
pip install python-docx --break-system-packages
from docx import Document
doc = Document()`,
      cost:"Costo: ~400-1,200 tokens extra por invocación",
    },
    {
      id:1, name:"System Prompt Skills", icon:"⚙️", color:T.purple,
      type:"Configuración",
      desc:"Capacidades hardcoded en el system prompt del agente. Siempre presentes, sin costo adicional de lectura.",
      when:"Formateo de respuestas, tono, idioma, restricciones éticas — siempre activos.",
      example:`// En el System Prompt del agente:
## Coding Guidelines
- Use TypeScript over JavaScript when possible
- Prefer functional components in React
- Follow Laravel conventions for PHP
- Always add error handling

## Response Format
- Use markdown for explanations
- Wrap code in appropriate code blocks
- Be concise, avoid padding`,
      cost:"Costo: incluido en los ~1,200 tokens del system prompt",
    },
    {
      id:2, name:"Few-shot Examples", icon:"🎯", color:T.amber,
      type:"Demostrativo",
      desc:"Ejemplos de input/output perfectos incluidos en el contexto para guiar el comportamiento del LLM por analogía.",
      when:"Cuando quieres un formato de output muy específico: JSON estructurado, código con patrón determinado, etc.",
      example:`// Ejemplo few-shot para generar endpoints Laravel:
<example>
INPUT: "Crear endpoint para listar órdenes"
OUTPUT:
Route::get('/api/orders', [OrderController::class, 'index']);

public function index(): JsonResponse {
    $orders = Order::with(['user','items'])
        ->paginate(20);
    return response()->json($orders);
}
</example>
// El LLM aprende el patrón esperado`,
      cost:"Costo: 200-800 tokens extra por ejemplo incluido",
    },
    {
      id:3, name:"Tool Definitions", icon:"🔧", color:T.green,
      type:"Funcional",
      desc:"Definición JSON de las herramientas disponibles para el LLM. El modelo 'conoce' qué puede hacer: leer archivos, ejecutar bash, buscar en web.",
      when:"Siempre presentes. El LLM decide autónomamente cuándo llamar cada herramienta.",
      example:`{
  "name": "bash",
  "description": "Execute shell commands",
  "input_schema": {
    "command": "php artisan test --filter=OrderTest",
    "description": "Run specific test suite"
  }
},
{
  "name": "read_file",
  "description": "Read file contents",
  "input_schema": {
    "path": "app/Models/Order.php"
  }
}`,
      cost:"Costo: ~300-600 tokens para definir el set de herramientas",
    },
  ];
  return (
    <div style={{animation:"fadeSlideIn 0.4s ease"}}>
      <SectionTitle icon="🛠️" title="Skills — Capacidades Modulares" color={T.cyan}
        subtitle="Los Skills son bloques de conocimiento especializado que el agente inyecta en el contexto según la tarea. Son la forma en que los agentes aprenden nuevas capacidades sin reentrenamiento." />
      <div style={{display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:12, marginBottom:20}}>
        {skills.map((sk,i)=>(
          <div key={i} onClick={()=>setActiveSkill(activeSkill===i?null:i)}
            style={{
              background: activeSkill===i ? `${sk.color}18`:T.surface2,
              border:`1px solid ${activeSkill===i?sk.color:T.border}`,
              borderRadius:10, padding:16, cursor:"pointer",
              transition:"all 0.2s ease",
            }}>
            <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
              <span style={{fontSize:22}}>{sk.icon}</span>
              <div>
                <div style={{fontFamily:T.mono, fontSize:12, color:sk.color, fontWeight:600}}>{sk.name}</div>
                <Badge color={sk.color} small>{sk.type}</Badge>
              </div>
            </div>
            <p style={{fontFamily:T.sans, fontSize:12, color:T.textMid, lineHeight:1.6}}>{sk.desc}</p>
          </div>
        ))}
      </div>
      {activeSkill !== null && (
        <div style={{animation:"fadeSlideIn 0.25s ease"}}>
          <div style={{
            background:`${skills[activeSkill].color}0d`,
            border:`1px solid ${skills[activeSkill].color}33`,
            borderRadius:10, padding:16, marginBottom:14,
          }}>
            <p style={{fontFamily:T.sans, fontSize:13, color:T.textMid, marginBottom:8}}>
              <strong style={{color:skills[activeSkill].color}}>¿Cuándo se activa?</strong> {skills[activeSkill].when}
            </p>
            <p style={{fontFamily:T.mono, fontSize:11, color:T.amber}}>{skills[activeSkill].cost}</p>
          </div>
          <CodeBlock code={skills[activeSkill].example} lang={skills[activeSkill].name} />
        </div>
      )}
      <div style={{height:16}}/>
      <Callout color={T.cyan} icon="🧩">
        Los Skills son context engineering modular: en lugar de un system prompt monolítico, el agente inyecta solo el conocimiento relevante para cada tarea. Esto reduce tokens y mejora la precisión.
      </Callout>
    </div>
  );
}
