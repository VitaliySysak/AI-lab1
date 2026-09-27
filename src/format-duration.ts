/**
 * Людиночитна тривалість: 3_723_000 → "1h 2m 3s".
 *
 * Правила:
 * - менше секунди — показуємо мілісекунди: 450 → "450ms", 0 → "0ms";
 * - від секунди — одиниці d/h/m/s, нульові пропускаємо, залишок мс відкидаємо;
 * - дробові мілісекунди округлюємо вниз: 12.9 → "12ms";
 * - від'ємні, NaN та Infinity — RangeError, а не мовчазне "NaNms".
 */
const UNITS: readonly (readonly [label: string, ms: number])[] = [
  ['d', 86_400_000],
  ['h', 3_600_000],
  ['m', 60_000],
  ['s', 1_000],
];

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) {
    throw new RangeError(`formatDuration: очікую скінченне невід'ємне число, отримано ${ms}`);
  }

  const total = Math.floor(ms);
  if (total < 1_000) return `${total}ms`;

  const parts: string[] = [];
  let rest = total;
  for (const [label, size] of UNITS) {
    const count = Math.floor(rest / size);
    rest %= size;
    if (count > 0) parts.push(`${count}${label}`);
  }
  return parts.join(' ');
}
