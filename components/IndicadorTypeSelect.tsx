// components/IndicatorTypeSelect.tsx
"use client";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type IndicatorType = "dolar" | "uf" | "euro" | "ipc";

export default function IndicatorTypeSelect({
  value,  
}: {
  value: IndicatorType;  
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-muted-foreground">Indicador</label>
      <Select value={value} >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecciona indicador" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dolar">Dolar</SelectItem>
          <SelectItem value="uf">UF</SelectItem>
          <SelectItem value="euro">Euro</SelectItem>
          <SelectItem value="ipc">IPC</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
