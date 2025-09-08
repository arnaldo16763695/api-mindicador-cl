// components/CrossRateCard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type SerieItem = { fecha: string; valor: number };

function isoDay(s: string) {
  return s.slice(0, 10); // YYYY-MM-DD
}
function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export default function CrossRateCard({
  from,
  to,
}: {
  from: string; // "YYYY-MM-DD"
  to: string;   // "YYYY-MM-DD"
}) {
  const [rows, setRows] = useState<
    { date: string; dolar: number; euro: number; usdPerEur: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // calcula los años involucrados
  const years = useMemo(() => {
    const fy = Number(from.slice(0, 4));
    const ty = Number(to.slice(0, 4));
    const ys: number[] = [];
    for (let y = fy; y <= ty; y++) ys.push(y);
    return ys;
  }, [from, to]);

  useEffect(() => {
    let cancelled = false;

    async function fetchType(type: "dolar" | "euro"): Promise<SerieItem[]> {
      const datas = await Promise.all(
        years.map((y) =>
          fetch(`/api/mindicador/${type}?year=${y}`).then((r) => r.json())
        )
      );
      // combina, filtra por rango e ordena ASC
      return datas
        .flatMap((d: { serie?: SerieItem[] }) => d?.serie ?? [])
        .filter((it) => {
          const day = isoDay(it.fecha);
          return day >= from && day <= to;
        })
        .sort((a, b) => isoDay(a.fecha).localeCompare(isoDay(b.fecha)));
    }

    async function run() {
      setLoading(true);
      try {
        const [usd, eur] = await Promise.all([fetchType("dolar"), fetchType("euro")]);

        // indexamos por fecha para “inner join”
        const mapUSD = new Map<string, number>(usd.map((d) => [isoDay(d.fecha), Number(d.valor)]));
        const mapEUR = new Map<string, number>(eur.map((d) => [isoDay(d.fecha), Number(d.valor)]));

        const commonDates: string[] = [];
        mapUSD.forEach((_v, k) => {
          if (mapEUR.has(k)) commonDates.push(k);
        });
        commonDates.sort((a, b) => a.localeCompare(b)); // ASC

        const joined = commonDates.map((date) => {
          const d = mapUSD.get(date)!;
          const e = mapEUR.get(date)!;
          return {
            date,
            dolar: d,
            euro: e,
            usdPerEur: Number((d / e).toFixed(4)), // USD/EUR
          };
        });

        if (!cancelled) setRows(joined);
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
  }, [years, from, to]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join: USD/EUR (dólar & euro) — {from} a {to}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin datos para el rango.</p>
        ) : (
          <div className="max-h-64 overflow-y-auto pr-2">
            <ul className="list-disc pl-5 space-y-1">
              {rows.map((r) => (
                <li key={r.date}>
                  {new Date(r.date).toLocaleDateString("es-CL")} Dolar: {fmt(r.dolar)} | Euro: {fmt(r.euro)} |{" "}
                  <b>USD/EUR: {r.usdPerEur}</b>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
