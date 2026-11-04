const { formatDate, formatCurrency, getInitials, capitalize } = require('../../src/utils/formatters');

describe('formatters', () => {
  describe('formatDate', () => {
    test('formats date string to DD/MM/YYYY', () => {
      expect(formatDate('2024-01-15')).toBe('15/01/2024');
    });

    test('formats ISO datetime string', () => {
      expect(formatDate('2024-12-25T10:30:00.000Z')).toContain('2024');
    });

    test('returns original string for invalid date', () => {
      expect(formatDate('not-a-date')).toBe('not-a-date');
    });

    test('pads single digit day and month', () => {
      expect(formatDate('2024-03-05')).toBe('05/03/2024');
    });
  });

  describe('formatCurrency', () => {
    test('formats number with rupee symbol', () => {
      expect(formatCurrency(100)).toBe('₹100');
    });

    test('formats zero', () => {
      expect(formatCurrency(0)).toBe('₹0');
    });

    test('formats decimal amounts', () => {
      expect(formatCurrency(999.50)).toBe('₹999.5');
    });
  });

  describe('getInitials', () => {
    test('returns first letter of first and last name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    test('returns single initial for single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    test('returns max 2 initials', () => {
      expect(getInitials('John Michael Doe')).toBe('JM');
    });

    test('returns ? for empty string', () => {
      expect(getInitials('')).toBe('?');
    });

    test('handles extra spaces', () => {
      expect(getInitials('  John   Doe  ')).toBe('JD');
    });

    test('capitalizes lowercase initials', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });

  describe('capitalize', () => {
    test('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    test('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    test('handles already capitalized', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    test('handles single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });
});
