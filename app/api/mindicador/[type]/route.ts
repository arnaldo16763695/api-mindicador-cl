import { NextRequest, NextResponse } from "next/server";
import { logTrace, sendWebhook } from "@/app/lib/server/trace";
import { MindicadorYearResponse, TraceEntry } from "@/types/mindicador";

export const dynamic = "force-dynamic";


export async function GET(
    req: NextRequest,
    ctx: { params: Promise<{ type: string }> } 
  ) {
    const { type } = await ctx.params;
    const started = Date.now();
    const sp = new URL(req.url).searchParams;
    const year = sp.get("year") ?? new Date().getFullYear().toString();
  
    try {
      const url = `https://mindicador.cl/api/${type}/${year}`;
      const r = await fetch(url, { cache: "no-store" });
      const data = (await r.json()) as MindicadorYearResponse;
  
      const entry: TraceEntry = {
        ts: new Date().toISOString(),
        route: "/api/mindicador/[type]",
        query: { type, year },
        upstream: { url, status: r.status },
        ua: req.headers.get("user-agent") || "",
        duration_ms: Date.now() - started,
        status: r.status,
      };
      await logTrace(entry);
      await sendWebhook(entry);
  
      return NextResponse.json(data, { status: r.status });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "unknown";
      const entry: TraceEntry = {
        ts: new Date().toISOString(),
        route: "/api/mindicador/[type]",
        query: { type, year },
        error: message,
        duration_ms: Date.now() - started,
        status: 500,
      };
      await logTrace(entry);
      await sendWebhook(entry);
      return NextResponse.json({ error: "Upstream error" }, { status: 500 });
    }
  }
  