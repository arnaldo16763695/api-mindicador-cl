export interface SerieItem { fecha: string; valor: number }

export interface MindicadorYearResponse {
  serie: SerieItem[];
 
  [k: string]: unknown;
}


