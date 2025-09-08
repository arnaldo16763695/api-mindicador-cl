import { toYYYYMMDD } from '@/helpers/helpers';
import React, { useState } from 'react'

function IndicatorDateRange({
    from,
    to,
    onChange,
  }: {
    from: string; 
    to: string;   
    onChange: (next: { from: string; to: string }) => void;
  }) {

    // el dato mas antiguo de la api
    const min = "2013-01-01";
    const [today] = useState<string>(() => toYYYYMMDD(new Date()));

  return (
    <div className="flex flex-col gap-1">
    <label className="text-sm text-muted-foreground">Rango de fechas</label>
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={from}
        min={min}
        max={to}
        onChange={(e) => onChange({ from: e.target.value, to })}
        className="border rounded px-2 py-1"
      />
      <span>—</span>
      <input
        type="date"
        value={to}
        min={from}
        max={today}
        onChange={(e) => onChange({ from, to: e.target.value })}
        className="border rounded px-2 py-1"
      />
    </div>
  </div>
  )
}

export default IndicatorDateRange