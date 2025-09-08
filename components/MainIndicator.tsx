"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

type Type = "dolar" | "uf" | "euro" | "ipc";
type SerieItem = { fecha: string; valor: number };

const LABEL: Record<Type, string> = {
  dolar: "Dólar",
  uf: "UF",
  euro: "Euro",
  ipc: "IPC",
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 2 }).format(n);
}

export default function MainIndicator({
  types = ["dolar", "uf", "euro", "ipc"],
}: {
  types?: Type[];
}) {
  const [items, setItems] = useState<
    { type: Type; value: number; prev?: number; date?: string; unit?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all(
      types.map((t) =>
        fetch(`/api/mindicador/${t}`)
          .then((r) => r.json())
          .then((data: { serie?: SerieItem[]; unidad_medida?: string }) => {
            const serie = data?.serie ?? [];

            // Mindicador viene Desc , el primer item es el más reciente
            const last = serie[0];       
            const prev = serie[1];

            console.log(last, prev);
            console.log(last?.valor, prev?.valor);
            
            return {
              type: t as Type,
              value: last?.valor ?? NaN,
              prev: prev?.valor,
              date: last?.fecha,
              unit: data?.unidad_medida ?? undefined,
            };
          })
          .catch(() => ({
            type: t as Type,
            value: NaN,
            prev: undefined,
            date: undefined,
            unit: undefined,
          }))
      )
    )
      .then((arr) => {
        if (!cancelled) setItems(arr);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [types]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {loading && (
        <>
          {types.map((t) => (
            <Card key={`sk-${t}`} className="p-4">
              <div className="h-5 w-24 bg-muted rounded mb-3" />
              <div className="h-7 w-32 bg-muted rounded" />
            </Card>
          ))}
        </>
      )}

      {!loading &&
        items.map((it) => {
          const hasValue = Number.isFinite(it.value);
          const delta =
            hasValue && Number.isFinite(it.prev || NaN) && (it.prev as number) !== 0
              ? ((it.value - (it.prev as number)) / (it.prev as number)) * 100
              : undefined;

          const up = typeof delta === "number" && delta >= 0;

          return (
            <Card key={it.type}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{LABEL[it.type]}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {hasValue ? fmt(it.value) : "—"}
                  {it.unit ? <span className="ml-1 text-sm text-muted-foreground">{it.unit}</span> : null}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {it.date ? new Date(it.date).toLocaleDateString("es-CL") : "Sin fecha"}
                </div>

                {typeof delta === "number" && (
                  <div
                    className={`mt-2 inline-flex items-center gap-1 text-sm ${
                      up ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {fmt(delta)}%
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
