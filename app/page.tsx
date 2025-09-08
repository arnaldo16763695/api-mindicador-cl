"use client";
import IndicatorTypeSelect from "@/components/IndicadorTypeSelect";
import IndicatorDateRange from "@/components/IndicatorDateRange";
import MainIndicator from "@/components/MainIndicator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { daysBetween, toYYYYMMDD } from "@/helpers/helpers";
import { useState } from "react";

const DEFAULT_DAYS = 10; // rango inicial
const MAX_DAYS = 365; // max permitido

export default function Home() {
  const [type, setType] = useState<"dolar" | "uf" | "euro" | "ipc">("dolar");
  const [message, setMessage] = useState<string>("");
  const [range, setRange] = useState(() => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(from.getDate() - (DEFAULT_DAYS - 1)); // ultimos 10 dia
    return { from: toYYYYMMDD(from), to: toYYYYMMDD(today) };
  });

  function handleRangeChange(next: { from: string; to: string }) {
    const diff = daysBetween(next.from, next.to);
    if (diff > MAX_DAYS) {
      const to = new Date(next.to);
      const from = new Date(to);
      from.setDate(from.getDate() - (MAX_DAYS - 1));
      setRange({ from: toYYYYMMDD(from), to: toYYYYMMDD(to) });
      // console.log(range)
      setMessage("Rango máximo permitido: " + MAX_DAYS + " días");
      setTimeout(() => setMessage(""), 5000);
    } else {
      setRange(next);
      setMessage("");
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div>
        <h1>Dashboard Economico Chile (Mindicador)</h1>
      </div>

      <MainIndicator types={["dolar", "uf", "euro", "ipc"]} />

      <div className="flex flex-wrap gap-4">
        <div>
          <IndicatorTypeSelect value={type} onChange={setType} />
        </div>

        <div>
          <IndicatorDateRange
            from={range.from}
            to={range.to}
            onChange={handleRangeChange}
          />
        </div>
        
          {message && <p className="text-sm text-red-600">{message}</p> }
        
      </div>
        </div>
  );
}
