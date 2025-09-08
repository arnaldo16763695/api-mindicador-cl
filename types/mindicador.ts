export interface SerieItem { fecha: string; valor: number }

export interface MindicadorYearResponse {
  serie: SerieItem[];
 
  [k: string]: unknown;
}

export interface TraceEntry {
  ts: string;
  route: string;
  duration_ms: number;
  status?: number;
  ua?: string;
  points?: number;
  error?: string;
  query?: Record<string, string | number | null | undefined>; 
  upstream?: { url: string; status: number };
}



