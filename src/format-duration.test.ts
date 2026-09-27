import { describe, expect, it } from 'vitest';

import { formatDuration } from './format-duration';

describe('formatDuration', () => {
  it('менше секунди показує мілісекунди', () => {
    expect(formatDuration(0)).toBe('0ms');
    expect(formatDuration(450)).toBe('450ms');
    expect(formatDuration(999)).toBe('999ms');
  });

  it('дробові мілісекунди округлює вниз', () => {
    expect(formatDuration(12.9)).toBe('12ms');
  });

  it('від секунди переходить на одиниці й відкидає залишок мс', () => {
    expect(formatDuration(1_000)).toBe('1s');
    expect(formatDuration(1_999)).toBe('1s');
  });

  it('складає кілька одиниць через пробіл', () => {
    // 1 год + 2 хв + 3 с = 3 600 000 + 120 000 + 3 000.
    expect(formatDuration(3_723_000)).toBe('1h 2m 3s');
  });

  it('пропускає нульові одиниці посередині', () => {
    expect(formatDuration(3_600_000)).toBe('1h');
    expect(formatDuration(3_605_000)).toBe('1h 5s');
  });

  it('понад добу додає дні', () => {
    expect(formatDuration(90_061_000)).toBe('1d 1h 1m 1s');
  });

  it('на від’ємних і нескінченних значеннях кидає RangeError', () => {
    expect(() => formatDuration(-1)).toThrow(RangeError);
    expect(() => formatDuration(Number.NaN)).toThrow(RangeError);
    expect(() => formatDuration(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});
