import { useState } from "react";
import { T } from "../tokens.js";
import { SectionTitle, Btn, CodeBlock } from "../shared.jsx";

export default function S4Injection() {
  const [active, setActive] = useState(0);
  const techniques = [
    {
      id:0, name:"Sandwich Injection", icon:"🥪", color:T.blue,
      desc:"Coloca el contexto crítico al INICIO del system prompt y REPÍTELO al final del mensaje del usuario.",
      code:`// INICIO del System Prompt
<critical_context>
Error: Column 'status' not found in 'orders' table
File: app/Http/Controllers/Api/OrderController.php
Line: 47 → Order::create($request->validated())
Migration: 2024_01_15_add_status_to_orders
</critical_context>

// ... historial, archivos, etc. ...

// FINAL del mensaje del usuario
"El error crítico es Column 'status' not found.
El archivo es OrderController.php línea 47.
Necesito que ejecutes php artisan migrate:status
para verificar si la migración se corrió."`,
      highlights:[2,3,4,5,19,20,21],
    },
    {
      id:1, name:"XML Tags de Atención", icon:"🏷️", color:T.cyan,
      desc:"Usa tags XML semánticos para que el LLM identifique y priorice bloques de contexto específicos.",
      code:`<stack_context>
  framework: Laravel 11
  php_version: 8.3
  db: MySQL 8.0
  frontend: React 18 + Inertia.js
</stack_context>

<current_error>
  SQLSTATE[42S22]: Column not found: 1054
  Unknown column 'status' in 'field list'
  → app/Http/Controllers/Api/OrderController.php:47
</current_error>

<files_read>
  ✓ OrderController.php (leído)
  ✓ Order.php model (leído)
  ✗ create_orders_table migration (pendiente)
</files_read>

<objective>Corregir el error y ejecutar la migración pendiente</objective>`,
      highlights:[1,2,3,4,5,8,9,10,11,19],
    },
    {
      id:2, name:"Memoria Activa Explícita", icon:"📋", color:T.pink,
      desc:"Incluye un resumen estructurado del estado actual: qué se hizo, qué funciona, qué falta.",
      code:`## Estado Actual del Proyecto

### ✅ Completado
- Modelo Order.php con fillable y relaciones
- Ruta POST /api/orders en api.php
- React component OrderForm.jsx con fetch()
- Validación en StoreOrderRequest.php

### ⚠️ En progreso
- OrderController@store → error de columna SQL
- Migration 2024_01_15_add_status_to_orders → no ejecutada

### ❌ Pendiente
- Tests en OrderTest.php (php artisan test)
- Frontend error handling en OrderForm.jsx
- Documentación API con swagger-php`,
      highlights:[4,5,6,7,8,10,11,12,14,15,16],
    },
    {
      id:3, name:"Contraste Explícito", icon:"⚖️", color:T.amber,
      desc:"Lista explícitamente lo que ya intentaste VS lo que todavía falta. Evita que el agente repita soluciones fallidas.",
      code:`## Lo que YA intentamos (NO repetir):
1. ❌ $fillable en Order.php → no resolvió el error
2. ❌ php artisan config:cache → no ayudó
3. ❌ Cambiar Order::create() por new Order() → mismo error
4. ❌ Revisar .env DATABASE_URL → configuración correcta

## Lo que FALTA por intentar:
1. → Verificar php artisan migrate:status
2. → Leer el archivo de migración completo
3. → Comparar columnas en DB con $fillable del modelo
4. → Ejecutar php artisan migrate si hay pendientes

## Hipótesis actual:
La migración add_status_to_orders no se ejecutó en este entorno.`,
      highlights:[2,3,4,5,8,9,10,11],
    },
    {
      id:4, name:"Ancla de Objetivo", icon:"⚓", color:T.green,
      desc:"Cuando la conversación deriva hacia detalles, ancla de nuevo el objetivo principal para mantener el foco.",
      code:`// Cuando el agente empieza a divagar en detalles...

## ⚓ OBJETIVO PRINCIPAL (recordatorio)
Crear endpoint completo POST /api/orders que:
1. Valide los campos (usar StoreOrderRequest)
2. Guarde en BD con Order::create()
3. Devuelva JsonResponse con el pedido creado
4. Sea consumible desde OrderForm.jsx con fetch()

## Estado: Estamos en el paso 2 (error SQL)
No avancemos a otros archivos hasta resolver
el Column not found en OrderController.php:47

// Tras resolver, continuar con paso 3 y 4`,
      highlights:[3,4,5,6,7,8,10,11,12],
    },
  ];
  const t = techniques[active];
  return (
    <div style={{animation:"fadeSlideIn 0.4s ease"}}>
      <SectionTitle icon="💉" title="Inyección Quirúrgica de Contexto" color={T.purple}
        subtitle="5 técnicas probadas para maximizar la atención del LLM sobre el contexto que más importa." />
      <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:20}}>
        {techniques.map((tc,i)=>(
          <Btn key={i} onClick={()=>setActive(i)} active={active===i} color={tc.color}>
            {tc.icon} {tc.name}
          </Btn>
        ))}
      </div>
      <div style={{animation:"fadeSlideIn 0.25s ease"}}>
        <div style={{
          background:`${t.color}0d`, border:`1px solid ${t.color}33`,
          borderRadius:10, padding:16, marginBottom:16,
        }}>
          <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
            <span style={{fontSize:22}}>{t.icon}</span>
            <span style={{fontFamily:T.mono, fontSize:14, color:t.color, fontWeight:600}}>{t.name}</span>
          </div>
          <p style={{fontFamily:T.sans, fontSize:13, color:T.textMid, lineHeight:1.65}}>{t.desc}</p>
        </div>
        <CodeBlock code={t.code} lang={`técnica: ${t.name}`} highlights={t.highlights} />
      </div>
    </div>
  );
}
