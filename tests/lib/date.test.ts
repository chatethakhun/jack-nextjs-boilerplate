// date-utils.test.ts
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatRelativeTime,
  isValidDate,
  formatDateUTC,
} from '@/lib/date';

describe('Date Utils', () => {
  // Fix time for consistent testing
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    test('formats Date object with default format', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      const result = formatDate(date);

      // PPP format: January 15th, 2024
      expect(result).toMatch(/January 15(st|nd|rd|th)?, 2024/);
    });

    test('formats ISO string with default format', () => {
      const result = formatDate('2024-01-15T10:00:00Z');

      expect(result).toMatch(/January 15(st|nd|rd|th)?, 2024/);
    });

    test('formats with custom format string', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      const result = formatDate(date, 'yyyy-MM-dd');

      expect(result).toBe('2024-01-15');
    });

    test('formats with time format in UTC', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = formatDate(date, 'HH:mm:ss', 'UTC');

      expect(result).toBe('14:30:00');
    });

    test('formats with time format without UTC', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = formatDate(date, 'HH:mm:ss');

      expect(result).toBe('21:30:00');
    });

    test('formats with full datetime format', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = formatDate(date, 'PPP p');

      expect(result).toContain('January');
      expect(result).toContain('2024');
    });

    test('formats time in specific timezone', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = formatDate(date, 'HH:mm:ss', 'Asia/Bangkok'); // UTC+7

      expect(result).toBe('21:30:00'); // 14:30 + 7 hours
    });

    test('handles different date formats', () => {
      const formats = [
        { format: 'yyyy-MM-dd', expected: '2024-01-15' },
        { format: 'MM/dd/yyyy', expected: '01/15/2024' },
        { format: 'dd.MM.yyyy', expected: '15.01.2024' },
        { format: 'MMMM do, yyyy', expected: /January 15th, 2024/ },
      ];

      const date = new Date('2024-01-15');

      formats.forEach(({ format: fmt, expected }) => {
        const result = formatDate(date, fmt);
        if (typeof expected === 'string') {
          expect(result).toBe(expected);
        } else {
          expect(result).toMatch(expected);
        }
      });
    });

    test('handles ISO string input', () => {
      const isoString = '2024-12-25T00:00:00.000Z';
      const result = formatDate(isoString, 'yyyy-MM-dd');

      expect(result).toBe('2024-12-25');
    });

    test('handles Date object input', () => {
      const date = new Date(2024, 11, 25); // December 25, 2024
      const result = formatDate(date, 'yyyy-MM-dd');

      expect(result).toContain('2024-12-');
    });
  });

  describe('formatRelativeTime', () => {
    test('formats date from 1 hour ago', () => {
      const oneHourAgo = new Date('2024-01-15T09:00:00Z');
      const result = formatRelativeTime(oneHourAgo);

      expect(result).toBe('about 1 hour ago');
    });

    test('formats date from 2 days ago', () => {
      const twoDaysAgo = new Date('2024-01-13T10:00:00Z');
      const result = formatRelativeTime(twoDaysAgo);

      expect(result).toBe('2 days ago');
    });

    test('formats date from 30 minutes ago', () => {
      const halfHourAgo = new Date('2024-01-15T09:30:00Z');
      const result = formatRelativeTime(halfHourAgo);

      expect(result).toBe('30 minutes ago');
    });

    test('formats date from less than a minute ago', () => {
      const justNow = new Date('2024-01-15T09:59:30Z');
      const result = formatRelativeTime(justNow);

      expect(result).toBe('1 minute ago');
    });

    test('formats ISO string input', () => {
      const isoString = '2024-01-15T08:00:00Z';
      const result = formatRelativeTime(isoString);

      expect(result).toBe('about 2 hours ago');
    });

    test('formats Date object input', () => {
      const date = new Date('2024-01-14T10:00:00Z');
      const result = formatRelativeTime(date);

      expect(result).toBe('1 day ago');
    });

    test('formats future date', () => {
      const tomorrow = new Date('2024-01-16T10:00:00Z');
      const result = formatRelativeTime(tomorrow);

      expect(result).toBe('in 1 day');
    });

    test('formats far past date', () => {
      const longAgo = new Date('2023-01-15T10:00:00Z');
      const result = formatRelativeTime(longAgo);

      expect(result).toBe('about 1 year ago');
    });
  });

  describe('isValidDate', () => {
    test('returns true for valid ISO string', () => {
      expect(isValidDate('2024-01-15T10:00:00Z')).toBe(true);
    });

    test('returns true for valid date string without time', () => {
      expect(isValidDate('2024-01-15')).toBe(true);
    });

    test('returns false for invalid date string', () => {
      expect(isValidDate('invalid-date')).toBe(false);
    });

    test('returns false for malformed ISO string', () => {
      expect(isValidDate('2024-13-45T99:99:99Z')).toBe(false);
    });

    test('returns false for empty string', () => {
      expect(isValidDate('')).toBe(false);
    });

    test('returns false for random string', () => {
      expect(isValidDate('hello world')).toBe(false);
    });

    test('returns false for numbers as string', () => {
      expect(isValidDate('123456')).toBe(false);
    });

    test('returns true for various valid formats', () => {
      const validDates = [
        '2024-01-15',
        '2024-01-15T10:00:00Z',
        '2024-01-15T10:00:00.000Z',
        '2024-01-15T10:00:00+07:00',
      ];

      validDates.forEach((date) => {
        expect(isValidDate(date)).toBe(true);
      });
    });

    test('returns false for invalid dates', () => {
      const invalidDates = [
        'not-a-date',
        '2024-13-01', // Invalid month
        '2024-01-32', // Invalid day
        '01/15/2024', // Wrong format for parseISO
        'January 15, 2024',
      ];

      invalidDates.forEach((date) => {
        expect(isValidDate(date)).toBe(false);
      });
    });
  });

  describe('Date Utils - Performance', () => {
    test('formatDate handles large number of operations', () => {
      const date = new Date('2024-01-15');
      const start = performance.now();

      for (let i = 0; i < 10000; i++) {
        formatDate(date, 'yyyy-MM-dd');
      }

      const end = performance.now();
      const duration = end - start;

      expect(duration).toBeLessThan(1000); // Should complete in under 1s
    });

    test('isValidDate validates many dates quickly', () => {
      const dates = Array.from(
        { length: 1000 },
        (_, i) => `2024-01-${String((i % 28) + 1).padStart(2, '0')}`
      );

      const start = performance.now();

      dates.forEach((date) => isValidDate(date));

      const end = performance.now();
      const duration = end - start;

      expect(duration).toBeLessThan(500);
    });
  });

  describe('Date Utils - Error Handling', () => {
    test('formatDate throws on invalid date string', () => {
      expect(() => formatDate('invalid-date')).toThrow();
    });

    test('formatDate throws on invalid Date object', () => {
      const invalidDate = new Date('invalid');
      expect(() => formatDate(invalidDate)).toThrow();
    });

    test('formatRelativeTime throws on invalid date', () => {
      expect(() => formatRelativeTime('invalid-date')).toThrow();
    });

    test('isValidDate catches errors gracefully', () => {
      // Should not throw, should return false
      expect(() => isValidDate('anything')).not.toThrow();
      expect(isValidDate('anything')).toBe(false);
    });

    test('formatDate with invalid format string throws', () => {
      const date = new Date('2024-01-15');
      expect(() => formatDate(date, 'invalid-format-xyz')).toThrow();
    });
  });

  // date-utils-integration.test.ts
  describe('Date Utils - Integration', () => {
    test('format and validate workflow', () => {
      const dateString = '2024-01-15T10:00:00Z';

      // Validate first
      expect(isValidDate(dateString)).toBe(true);

      // Then format
      const formatted = formatDate(dateString, 'yyyy-MM-dd');
      expect(formatted).toBe('2024-01-15');
    });

    test('handles user input to display workflow', () => {
      const userInput = '2024-01-15';

      if (isValidDate(userInput)) {
        const displayDate = formatDate(userInput);
        const relativeTime = formatRelativeTime(userInput);

        expect(displayDate).toBeDefined();
        expect(relativeTime).toBeDefined();
      }
    });

    test('chain multiple operations', () => {
      const isoString = '2024-01-15T10:00:00Z';

      expect(isValidDate(isoString)).toBe(true);
      expect(formatDate(isoString, 'yyyy-MM-dd')).toBe('2024-01-15');
      expect(formatRelativeTime(isoString)).toContain('ago');
    });
  });

  describe('Date Utils - Timezone Handling', () => {
    test('formatDate handles different timezone formats', () => {
      const dates = [
        '2024-01-15T10:00:00Z', // UTC
        '2024-01-15T10:00:00+00:00', // UTC explicit
        '2024-01-15T10:00:00+07:00', // Bangkok
        '2024-01-15T10:00:00-05:00', // EST
      ];

      dates.forEach((date) => {
        const result = formatDate(date, 'yyyy-MM-dd');
        expect(result).toMatch(/2024-01-1[45]/);
      });
    });

    test('formatRelativeTime works with different timezones', () => {
      vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));

      const dateWithTimezone = '2024-01-15T08:00:00+05:00'; // 3:00 UTC
      const result = formatRelativeTime(dateWithTimezone);

      expect(result).toContain('hour');
      expect(result).toContain('ago');
    });
  });

  describe('Date Utils - Edge Cases', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('formatDate Edge Cases', () => {
      test('handles leap year dates', () => {
        const leapDate = new Date('2024-02-29T10:00:00Z');
        const result = formatDate(leapDate, 'yyyy-MM-dd');

        expect(result).toBe('2024-02-29');
      });

      test('handles end of year date', () => {
        const endOfYear = new Date('2024-12-31T23:59:59Z');
        const result = formatDate(endOfYear, 'yyyy-MM-dd HH:mm:ss', 'UTC');

        expect(result).toBe('2024-12-31 23:59:59');
      });

      test('handles start of year date', () => {
        const startOfYear = new Date('2024-01-01T00:00:00Z');
        const result = formatDate(startOfYear, 'yyyy-MM-dd HH:mm:ss', 'UTC');

        expect(result).toBe('2024-01-01 00:00:00');
      });

      test('handles very old dates', () => {
        const oldDate = new Date('1900-01-01T00:00:00Z');
        const result = formatDate(oldDate, 'yyyy-MM-dd');

        expect(result).toBe('1900-01-01');
      });

      test('handles far future dates', () => {
        const futureDate = new Date('2100-12-31T23:59:59Z');
        const result = formatDate(futureDate, 'yyyy-MM-dd', 'UTC');

        expect(result).toBe('2100-12-31');
      });

      test('handles milliseconds precision', () => {
        const preciseDate = new Date('2024-01-15T10:00:00.123Z');
        const result = formatDate(
          preciseDate,
          'yyyy-MM-dd HH:mm:ss.SSS',
          'UTC'
        );

        expect(result).toBe('2024-01-15 10:00:00.123');
      });

      test('handles timezone offsets in ISO string', () => {
        const dateWithOffset = '2024-01-15T10:00:00+05:30';
        const result = formatDate(dateWithOffset, 'yyyy-MM-dd');

        expect(result).toMatch(/2024-01-1[45]/); // Could be either day due to timezone
      });
    });

    describe('formatRelativeTime Edge Cases', () => {
      test('handles dates in the far past', () => {
        const longAgo = new Date('2000-01-01T00:00:00Z');
        const result = formatRelativeTime(longAgo);

        expect(result).toContain('year');
        expect(result).toContain('ago');
      });

      test('handles dates in the far future', () => {
        const farFuture = new Date('2030-01-01T00:00:00Z');
        const result = formatRelativeTime(farFuture);

        expect(result).toContain('year');
        expect(result).toContain('in');
      });

      test('handles same time (now)', () => {
        const now = new Date('2024-01-15T10:00:00Z');
        const result = formatRelativeTime(now);

        expect(result).toBe('less than a minute ago');
      });

      test('handles dates with different precisions', () => {
        const dates = [
          { date: new Date('2024-01-15T09:59:00Z'), expected: /minute/ },
          { date: new Date('2024-01-15T09:00:00Z'), expected: /hour/ },
          { date: new Date('2024-01-14T10:00:00Z'), expected: /day/ },
          { date: new Date('2024-01-08T10:00:00Z'), expected: /day/ },
          { date: new Date('2023-12-15T10:00:00Z'), expected: /month/ },
        ];

        dates.forEach(({ date, expected }) => {
          const result = formatRelativeTime(date);
          expect(result).toMatch(expected);
        });
      });
    });

    describe('isValidDate Edge Cases', () => {
      test('handles dates with only year', () => {
        // parseISO might not accept just year
        expect(isValidDate('2024')).toBe(true);
      });

      test('handles dates with year and month', () => {
        expect(isValidDate('2024-01')).toBe(true);
      });

      test('handles whitespace', () => {
        expect(isValidDate('  2024-01-15  ')).toBe(false); // parseISO doesn't trim
      });

      test('handles null-like strings', () => {
        expect(isValidDate('null')).toBe(false);
        expect(isValidDate('undefined')).toBe(false);
      });

      test('handles special date strings', () => {
        expect(isValidDate('0000-00-00')).toBe(false);
        expect(isValidDate('9999-99-99')).toBe(false);
      });
    });
  });

  describe('Format in UTC function', () => {
    test('formats Date object with default format', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      const result = formatDateUTC(date);
      expect(result).toBe('January 15th, 2024');
    });
  });
});
