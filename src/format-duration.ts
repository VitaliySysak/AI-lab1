/**
 * Форматування тривалості в мілісекундах у короткий людський рядок.
 *
 * Приклади: `450` → `'450ms'`, `61_000` → `'1m 1s'`, `90_061_000` → `'1d 1h 1m 1s'`.
 *
 * Правила:
 * - менше за секунду — показуємо мілісекунди (`'0ms'` для нуля);
 * - від секунди — лише одиниці d/h/m/s, нульові пропускаємо, залишок
 *   мілісекунд відкидаємо (округлення вниз);
 * - від'ємне, `NaN` чи `Infinity` — `RangeError`: тривалість має бути
 *   скінченним невід'ємним числом.
 */

const UNITS = [
  { label: 'd', ms: 86_400_000 },
  { label: 'h', ms: 3_600_000 },
  { label: 'm', ms: 60_000 },
  { label: 's', ms: 1_000 },
] as const;

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) {
    throw new RangeError(`formatDuration: очікується скінченне невід'ємне число, отримано ${ms}`);
  }

  if (ms < 1_000) {
    return `${Math.floor(ms)}ms`;
  }

  let rest: number = Math.floor(ms);
  const parts: string[] = [];
  for (const unit of UNITS) {
    const count: number = Math.floor(rest / unit.ms);
    rest -= count * unit.ms;
    if (count > 0) {
      parts.push(`${count}${unit.label}`);
    }
  }
  return parts.join(' ');
}
