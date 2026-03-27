import { useState } from "react";
import { T } from "../tokens.js";
import { Badge, CodeBlock, Callout, SectionTitle } from "../shared.jsx";

export default function S10Memories() {
  const [memType, setMemType] = useState(0);
  const memTypes = [
    {
      id:0, name:"In-Context", icon:"⚡", color:T.blue,
      scope:"Sesión actual",
      desc:"Información dentro del context window activo. El 'working memory' del agente — lo que el LLM puede ver ahora mismo. Se pierde cuando termina la sesión.",
      persistence:"Solo durante la conversación",
      examples:["Historial de mensajes del turno actual","Archivos leídos en esta sesión","Tool results de esta sesión","Estado actual del debug"],
      code:`// In-context memory = el historial enviado en cada request
messages: [
  { role: "user", content: "El error está en línea 47" },
  { role: "assistant", content: "Revisaré OrderController.php" },
  { role: "tool_result", content: "[código del archivo]" },
  { role: "user", content: "¿Encontraste el problema?" }
  // Todo esto viaja en CADA request → es la memoria en contexto
]`,
    },
    {
      id:1, name:"External / RAG", icon:"🔍", color:T.amber,
      scope:"Base de conocimiento",
      desc:"Documentos, código y datos almacenados externamente. Se recuperan mediante búsqueda semántica (embeddings) cuando son relevantes para la tarea actual.",
      persistence:"Permanente (base de datos vectorial)",
      examples:["Codebase completo indexado","Documentación del proyecto","Issues y PRs históricos","Código de referencia/ejemplos"],
      code:`// RAG: recuperar contexto relevante del codebase
const query = "OrderController validation error";

// 1. Buscar documentos similares (embeddings)
const relevant = await vectorDB.search(query, { k: 5 });
// → ["OrderController.php", "Order.php",
//    "StoreOrderRequest.php", "orders migration"]

// 2. Inyectar solo los relevantes en el contexto
context.push(...relevant.map(doc => ({
  type: "document",
  content: doc.content  // Solo ~2,000 tokens en lugar de todo el codebase
})));`,
    },
    {
      id:2, name:"Episódica", icon:"📖", color:T.purple,
      scope:"Historia de interacciones",
      desc:"Registro de conversaciones y acciones pasadas. Permite al agente aprender de errores anteriores y no repetir soluciones que fallaron.",
      persistence:"Sesiones anteriores",
      examples:["'Intentamos X y falló'","Decisiones arquitectónicas tomadas","Bugs resueltos y cómo","Preferencias del desarrollador"],
      code:`// Memoria episódica: qué pasó en sesiones anteriores
## Historial de Proyecto (auto-generado)

### Sesión 2024-01-15
- ❌ Intentamos usar Session auth → incompatible con API
- ✓ Migrado a Laravel Sanctum token-based auth
- Archivo clave: config/sanctum.php

### Sesión 2024-01-16
- ❌ Order::create() fallaba por campo 'status' faltante
- ✓ Creada migration add_status_to_orders_table
- Lección: siempre verificar migrate:status antes de debug`,
    },
    {
      id:3, name:"Semántica / Proyecto", icon:"🧬", color:T.green,
      scope:"Conocimiento del proyecto",
      desc:"Hechos explícitos sobre el proyecto: arquitectura, decisiones técnicas, convenciones. Se mantiene actualizada por el agente o el desarrollador.",
      persistence:"Permanente (CLAUDE.md, .cursorrules, etc.)",
      examples:["Stack tecnológico","Convenciones de naming","Reglas de negocio","Configuración de entornos"],
      code:`# CLAUDE.md — Memoria Semántica del Proyecto

## Stack
- Backend: Laravel 11, PHP 8.3, MySQL 8.0
- Frontend: React 18 + Inertia.js + TypeScript
- Auth: Laravel Sanctum (tokens, no sessions)
- Queue: Laravel Horizon + Redis

## Convenciones
- Controllers: app/Http/Controllers/Api/ (solo API)
- Models: siempre usar soft deletes en recursos principales
- Tests: Feature tests para endpoints, Unit para services
- Respuestas: siempre JsonResponse con estructura estándar

## Entornos
- Local: .env.local (Docker Compose)
- Staging: railway.app
- Producción: AWS ECS + RDS`,
    },
  ];
  const m = memTypes[memType];
  return (
    <div style={{animation:"fadeSlideIn 0.4s ease"}}>
      <SectionTitle icon="🧬" title="Memorias del Agente" color={T.green}
        subtitle="Los agentes tienen múltiples tipos de memoria, cada uno con diferente alcance, persistencia y costo en tokens. Entenderlos es clave para diseñar agentes eficientes." />
      <div style={{
        background:T.surface2, border:`1px solid ${T.border}`,
        borderRadius:12, padding:20, marginBottom:20,
      }}>
        <p style={{fontFamily:T.mono, fontSize:11, color:T.textDim, marginBottom:14}}>TIPOS DE MEMORIA — selecciona para explorar</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:20}}>
          {memTypes.map((mt,i)=>(
            <div key={i} onClick={()=>setMemType(i)}
              style={{
                background: memType===i ? `${mt.color}22`:T.surface,
                border:`1px solid ${memType===i?mt.color:T.border}`,
                borderRadius:8, padding:14, cursor:"pointer", textAlign:"center",
                transition:"all 0.2s ease",
              }}>
              <div style={{fontSize:24, marginBottom:6}}>{mt.icon}</div>
              <div style={{fontFamily:T.mono, fontSize:11, color:mt.color, fontWeight:600}}>{mt.name}</div>
              <div style={{fontFamily:T.sans, fontSize:10, color:T.textDim, marginTop:4}}>{mt.scope}</div>
            </div>
          ))}
        </div>
        <div style={{animation:"fadeSlideIn 0.25s ease",
          background:`${m.color}0d`, border:`1px solid ${m.color}33`,
          borderRadius:9, padding:16, marginBottom:14}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8}}>
            <span style={{fontFamily:T.mono, fontSize:13, color:m.color, fontWeight:600}}>{m.icon} {m.name} Memory</span>
            <Badge color={m.color}>{m.persistence}</Badge>
          </div>
          <p style={{fontFamily:T.sans, fontSize:13, color:T.textMid, lineHeight:1.65, marginBottom:12}}>{m.desc}</p>
          <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
            {m.examples.map((ex,i)=>(
              <div key={i} style={{
                background:`${m.color}15`, border:`1px solid ${m.color}33`,
                borderRadius:5, padding:"3px 10px",
                fontFamily:T.mono, fontSize:11, color:m.color,
              }}>• {ex}</div>
            ))}
          </div>
        </div>
        <CodeBlock code={m.code} lang={`${m.name} Memory`} />
      </div>
      <Callout color={T.green} icon="🧠">
        Los mejores agentes combinan los 4 tipos: usan RAG para conocimiento masivo, memoria semántica para el contexto del proyecto, episódica para no repetir errores, y el contexto activo como workspace de trabajo.
      </Callout>
    </div>
  );
}
