

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