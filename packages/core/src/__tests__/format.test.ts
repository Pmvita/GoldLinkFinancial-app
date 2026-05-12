import { describe, expect, it } from 'vitest';

import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  formatRelativeDate,
  maskAccountNumber,
} from '../format';

describe('formatCurrency', () => {
  it('formats a USD amount with two fraction digits and a thousands separator', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('rounds to two fraction digits by default', () => {
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });

  it('respects an explicit currency code', () => {
    const eur = formatCurrency(99.5, 'EUR');
    expect(eur).toContain('99.50');
    expect(eur).toMatch(/[€]|EUR/);
  });
});

describe('formatCompactCurrency', () => {
  it('produces compact notation for large values', () => {
    expect(formatCompactCurrency(1_500_000)).toMatch(/1\.5M/);
  });
});

describe('maskAccountNumber', () => {
  it('replaces all but the last four digits with bullets', () => {
    expect(maskAccountNumber('123456789')).toBe('\u2022\u2022\u2022\u20226789');
  });

  it('returns an empty string for falsy input', () => {
    expect(maskAccountNumber('')).toBe('');
  });

  it('ignores embedded whitespace', () => {
    expect(maskAccountNumber('1234 5678 9012')).toBe('\u2022\u2022\u2022\u20229012');
  });
});

describe('formatDate', () => {
  it('returns a non-empty string for a valid ISO date', () => {
    const out = formatDate('2024-01-15T00:00:00Z');
    expect(typeof out).toBe('string');
    expect(out.length).toBeGreaterThan(0);
  });

  it('echoes the input back for an invalid date string', () => {
    const garbage = 'not-a-date';
    expect(formatDate(garbage)).toBe(garbage);
  });
});

describe('formatRelativeDate', () => {
  it('returns "Today" for the current moment', () => {
    expect(formatRelativeDate(new Date().toISOString())).toBe('Today');
  });
});
