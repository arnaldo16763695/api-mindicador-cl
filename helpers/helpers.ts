

export function toYYYYMMDD(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}


export function daysBetween(a: string, b: string) {
    const A = new Date(a);
    const B = new Date(b);
    A.setHours(0,0,0,0);
    B.setHours(0,0,0,0);
    console.log(+A, +B);
    return Math.abs((+B - +A) / 86400000) + 1;
  }

  
export function isoDay(s: string) {
    return s.slice(0, 10); // YYYY-MM-DD
  }

export function formatNumber(n: number) {
    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  }