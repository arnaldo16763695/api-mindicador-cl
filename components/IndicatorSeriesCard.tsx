"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatNumber, isoDay } from "@/helpers/helpers";

type SerieItem = { fecha: string; valor: number };

export default function IndicatorSeriesCard({
  type = "dolar",
  from,
  to,
}: {
  type?: "dolar" | "uf" | "euro" | "ipc";
  from: string;
  to: string;
}) {
  const [rows, setRows] = useState<SerieItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [ma7, setMa7] = useState<SerieItem[]>([]);
  const [pct, setPct] = useState<{ fecha: string; valor: number }[]>([]);
  const [top7, setTop7] = useState<SerieItem[]>([]);  


  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const fromYear = Number(from.slice(0, 4));
        const toYear = Number(to.slice(0, 4));
        const years = fromYear === toYear ? [fromYear] : [fromYear, toYear];

        const datas = await Promise.all(
          years.map((y) =>
            fetch(`/api/mindicador/${type}?year=${y}`).then((r) => r.json())
          )
        );

        // console.log(datas.map(d => d.serie ?? []));
        // console.log("**********");
        // console.log(datas.flatMap(d => d.serie ?? []));

        const combined: SerieItem[] = datas
          .flatMap((d: { serie?: SerieItem[] }) => d?.serie ?? [])
          .filter((it) => {
            const day = isoDay(it.fecha);
            return day >= from && day <= to;
          })
          .sort((a, b) => isoDay(a.fecha).localeCompare(isoDay(b.fecha)));

        if (!cancelled) {
          setRows(combined);
        
        }
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [type, from, to]);

  useEffect(() => {
    if (!rows.length) {
      setMa7([]);
      setPct([]);
      setTop7([]);
      return;
    }

    const ma: SerieItem[] = rows.map((d, i) => {
      const start = Math.max(0, i - 6);
      const win = rows.slice(start, i + 1);
      const avg =
        win.reduce((sum, x) => sum + (Number(x.valor) || 0), 0) / win.length;
      return { fecha: d.fecha, valor: Number(avg.toFixed(2)) };
    });

    const pc = rows.map((d, i) => {
      if (i === 0) return { fecha: d.fecha, valor: 0 };
      const prev = Number(rows[i - 1].valor) || 0;
      const curr = Number(d.valor) || 0;
      const v = prev ? ((curr - prev) / prev) * 100 : 0;
      return { fecha: d.fecha, valor: Number(v.toFixed(2)) };
    });

    const top = [...rows]
      .sort((a, b) => Number(b.valor) - Number(a.valor))
      .slice(0, 7);

    setMa7(ma);
    setPct(pc);
    setTop7(top);
  }, [rows]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type.toUpperCase()} — {from} a {to}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin datos.</p>
        ) : (
          <>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        


              <div className="flex flex-col border rounded border-gray-200 p-4">
                <h4 className="font-medium mb-2">Serie Diaria</h4>
                <div className="max-h-64 overflow-y-auto pr-2">
                  <ul className="space-y-1">
                    {rows.map((d) => {                    
                     
                      return (
                        <li key={d.fecha}>
                          <button
                            type="button"                         
                            className={`w-full text-left rounded px-1 hover:underline cursor-pointer `}
                          >
                            {new Date(d.fecha).toLocaleDateString("es-CL")} —{" "}
                            {formatNumber(d.valor)}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Media móvil 7d */}
              <div className="flex flex-col border rounded border-gray-200 p-4">
                <h4 className="font-medium mb-2">Media móvil 7d</h4>
                <div className="max-h-64 overflow-y-auto pr-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {ma7.map((d) => (
                      <li key={d.fecha}>
                        {new Date(d.fecha).toLocaleDateString("es-CL")} —{" "}
                        {formatNumber(d.valor)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* % cambio diario */}
              <div className="flex flex-col border rounded border-gray-200 p-4">
                <h4 className="font-medium mb-2">% cambio diario</h4>
                <div className="max-h-64 overflow-y-auto pr-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {pct.map((d) => (
                      <li key={d.fecha}>
                        {new Date(d.fecha).toLocaleDateString("es-CL")} —{" "}
                        {formatNumber(d.valor)}%
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Top-7 días */}
              <div className="flex flex-col border rounded border-gray-200 p-4">
                <h4 className="font-medium mb-2">Top-7 días por valor</h4>
                <div className="max-h-64 overflow-y-auto pr-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {top7.map((d) => (
                      <li key={d.fecha}>
                        {new Date(d.fecha).toLocaleDateString("es-CL")} —{" "}
                        {formatNumber(d.valor)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

        

          
          </>
        )}
      </CardContent>
    </Card>
  );
}
