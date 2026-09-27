import { describe, expect, it } from 'vitest';

import { formatDuration } from './format-duration';

describe('formatDuration', () => {
  it('менше за секунду показує мілісекунди', () => {
    expect(formatDuration(0)).toBe('0ms');
    expect(formatDuration(450)).toBe('450ms');
    expect(formatDuration(999)).toBe('999ms');
  });

  it('дробові мілісекунди округлює вниз', () => {
    expect(formatDuration(12.9)).toBe('12ms');
  });

  it('від секунди відкидає залишок мілісекунд', () => {
    expect(formatDuration(1_000)).toBe('1s');
    expect(formatDuration(1_999)).toBe('1s');
  });

  it('складає кілька одиниць від більшої до меншої', () => {
    expect(formatDuration(61_000)).toBe('1m 1s');
    expect(formatDuration(3_661_000)).toBe('1h 1m 1s');
    expect(formatDuration(90_061_000)).toBe('1d 1h 1m 1s');
  });

  it('пропускає нульові одиниці посередині', () => {
    expect(formatDuration(3_600_000)).toBe('1h');
    expect(formatDuration(86_400_000 + 5_000)).toBe('1d 5s');
  });

  it('кидає RangeError на від’ємне, NaN та Infinity', () => {
    expect(() => formatDuration(-1)).toThrow(RangeError);
    expect(() => formatDuration(Number.NaN)).toThrow(RangeError);
    expect(() => formatDuration(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});
