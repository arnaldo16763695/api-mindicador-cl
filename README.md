# Dashboard Económico Chile (Mindicador)

Mini-dashboard construido con **Next.js + TypeScript + Tailwind + shadcn/ui + Recharts**.  
Cumple: integración a API vía backend, **transformaciones (≥3)**, **visualizaciones (≥4)**, **filtros**, **drill-down**, y **evidencia de ejecución real** (trazas + webhook).

---

## 🔗 Fuente / API

**Proveedor:** [mindicador.cl](https://mindicador.cl) — indicadores económicos de Chile en CLP.

**Endpoints externos usados (desde el backend, nunca directo desde el navegador):**
- `https://mindicador.cl/api/{type}/{year}`  
  Donde `type ∈ {dolar, euro, uf, ipc}` y `year = YYYY`.

**Endpoints internos del proyecto (API Routes de Next.js):**
- `GET /api/mindicador/[type]?year=YYYY`  
   Agrega datos de 1–2 años, filtra por rango y ordena ASC. Aplica tope de días para evitar cargas gigantes.
- `GET /api/traces` **  
  Devuelve las últimas trazas parseadas del archivo `server/logs/http_trace.jsonl`.

**Notas de uso**
- El `from/to` del dashboard parte en **últimos 10 días**.  
- Si el rango excede el máximo configurado, el backend devuelve **413** y/o el cliente **recorta** automáticamente.

---

## ▶️ Cómo correr

1. **Clonar & deps**
   ```bash
   npm i
   ```

2. **Variables de entorno**
   - Crea `.env.local` (basado en `.env.example`):
     ```
     WEBHOOK_URL=<opcional: URL de prueba, ej. de webhook.site>
     ```
     Si no seteas `WEBHOOK_URL`, el envío a webhook simplemente se omite.

3. **Dev**
   ```bash
   npm run dev
   ```
   Abre `http://localhost:3000`.

4. **Build / Prod local**
   ```bash
   npm run build
   npm start
   ```

---

## 🔐 Variables de entorno

- `WEBHOOK_URL` *(opcional)*: destino para notificar cada request del backend (evidencia de ejecución).  
  Ejemplo: una URL de **webhook.site** o similar.

---

## 🧮 Transformaciones implementadas

1) **Media móvil 7 días (MA7)**  
   Para cada día *t*:  
   \[
   MA7_t = \frac{1}{k}\sum_{i=t-k+1}^{t} valor_i
   \]
   con \(k = \min(7, t+1)\).

2) **% cambio diario**  
   \[
   \%\Delta_t = \left(\frac{valor_t - valor_{t-1}}{valor_{t-1}}\right)\times 100
   \]
   (Para el primer día se fija 0 o “sin dato”.)

3) **Top-7 por valor**  
   Ordena la serie filtrada descendentemente por `valor` y toma los **7** mayores.

4) **Join entre 2 endpoints (USD/EUR)**  
   Se consultan **dólar** y **euro** por año, se **unen por fecha** (inner join) y se calcula:  
   \[
   \text{USD/EUR} = \frac{\text{dólar\_CLP}}{\text{euro\_CLP}}
   \]

> Extras de UX/performance: *sampling* para charts (máx. ~200 puntos) y *ticks mensuales* en eje X.

---

## 📊 Visualizaciones (≥4)

- **Línea: Serie diaria** (sin puntos, sin animación).
- **Línea: MA7** (gráfico separado).
- **Barras: % cambio diario** (últimos ~90).
- **Barras: Top-7 días por valor**.

Además, se mantienen **listas con scroll** como vista complementaria (valores exactos y fallback accesible).

---

## 🧰 Interactividad

- **Filtros:**  
  - **Tipo de indicador:** `dolar`, `euro`, `uf`, `ipc`.  
  - **Rango de fechas:** selector `from/to` (por defecto **10 días**).  
  - Tope de rango para evitar llamadas masivas (cliente + backend).

- **Drill-down simple:**  
  Click en un día de la “Serie original” → muestra **Detalle** (Valor, MA7, % cambio y valor del día anterior).

- **Estados:** loading / vacío / error amigables.

- **Responsive:** grid/flex con cartas y secciones scrollables.

---

## 🧾 Evidencia de ejecución real (trazas + webhook)

- Cada petición al backend genera una **traza** en `server/logs/http_trace.jsonl` (formato **JSONL**, 1 línea por request).  
  Campos típicos:  
  ```json
  {
    "ts":"2025-09-05T12:34:56.789Z",
    "route":"/api/mindicador/range",
    "query":{"type":"dolar","from":"2025-08-27","to":"2025-09-05"},
    "status":200,
    "points": 10,
    "duration_ms": 123
  }
  ```
- Si `WEBHOOK_URL` está definido, se **envía** el mismo `entry` vía `POST` (content-type `application/json`).  
- **Visor opcional:** `GET /api/traces` + `TraceViewerCard` para ver las últimas 100 entradas dentro de la app.  
- **Nota:** en entornos serverless el archivo puede no persistir; para la entrega se prueba **en local** y se incluye el archivo en el repo.

---

## 🧠 Decisiones de diseño & trade-offs

- **Backend obligatorio**: todo pasa por **API Routes** (no fetch directo desde el navegador) → control de cabeceras, logging y webhook.
- **Tope de rango**: evita bloqueos si el usuario pide años de datos; además se **muestra nota** y/o se **recorta** en cliente.
- **Listas + gráficos**: listas con **scroll** para exactitud y accesibilidad; gráficos para tendencia.  
- **Recharts “puro”**: se usó Recharts directamente para reducir fricción de tipado/props y asegurar render inmediato.
- **Sampling/ticks**: límite de puntos y ticks mensuales en X para legibilidad y performance.
- **TypeScript estricto**: sin `any`; tipos para responses, trazas y helpers (mejor DX y menos bugs).
- **Logs JSONL**: formato fácil de *tail*, parseo y commit.

---

## 🤖 Declaración de uso de IA

Se utilizó **IA** como apoyo para:
- Brainstorming de arquitectura y elección de API.
- Redacción de algunos **snippets** (hooks, transformaciones, charts) y este **README**.
- Revisión de tipos y manejo de errores.

El código fue **entendido, adaptado y verificado** manualmente. Se pueden solicitar cambios en vivo.

---



---


