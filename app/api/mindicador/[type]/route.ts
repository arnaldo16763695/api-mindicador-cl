import { MindicadorYearResponse } from "@/types/mindicador";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";


export async function GET(
    req: NextRequest,
    ctx: { params: Promise<{ type: string }> } 
  ) {
    const { type } = await ctx.params;
  
    const sp = new URL(req.url).searchParams;
    const year = sp.get("year") ?? new Date().getFullYear().toString();
  
    try {
      const url = `https://mindicador.cl/api/${type}/${year}`;
      const r = await fetch(url, { cache: "no-store" });
      const data = (await r.json()) as MindicadorYearResponse;
  
     
  
      return NextResponse.json(data, { status: r.status });
    } catch (e: unknown) {
 
      return NextResponse.json({ error: "Upstream error" }, { status: 500 });
    }
  }
  