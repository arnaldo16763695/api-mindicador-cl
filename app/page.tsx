"use client";
import IndicatorTypeSelect from "@/components/IndicadorTypeSelect";
import IndicatorDateRange from "@/components/IndicatorDateRange";
import IndicatorSeriesCard from "@/components/IndicatorSeriesCard";
import CrossRateCard from "@/components/JoinRateCard";
import MainIndicator from "@/components/MainIndicator";
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
      <div className="w-full text-center p-4">
        <h1 className="text-2xl font-bold">Dashboard Economico Chile (Mindicador)</h1>
      </div>

      <MainIndicator types={["dolar", "uf", "euro", "ipc"]} />

      <div className="flex flex-wrap gap-4">
        <IndicatorTypeSelect value={type} onChange={setType} />

        <IndicatorDateRange
          from={range.from}
          to={range.to}
          onChange={handleRangeChange}
        />
      </div>
        {message && <p className="text-sm text-red-600">{message}</p>}
        <IndicatorSeriesCard type={type} from={range.from} to={range.to} />
        <CrossRateCard from={range.from} to={range.to} />
    </div>
  );
}
