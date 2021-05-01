export function dayFraction(t: Date): number {
  const start = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0)
  return (t.getTime() - start.getTime()) / 86400000
}

export function dayFractionNow(): number {
  return dayFraction(new Date())
}
