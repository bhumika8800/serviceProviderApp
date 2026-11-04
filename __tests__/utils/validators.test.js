const { validateEmail, validatePhone, validatePincode } = require('../../src/utils/validators');

describe('validators', () => {
  describe('validateEmail', () => {
    test('accepts valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    test('accepts email with subdomain', () => {
      expect(validateEmail('user@mail.example.com')).toBe(true);
    });

    test('rejects email without @', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    test('rejects email without domain', () => {
      expect(validateEmail('user@')).toBe(false);
    });

    test('rejects email with spaces', () => {
      expect(validateEmail('user @example.com')).toBe(false);
    });

    test('rejects empty string', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    test('accepts valid 10-digit phone', () => {
      expect(validatePhone('9876543210')).toBe(true);
    });

    test('rejects phone with country code (too many digits)', () => {
      expect(validatePhone('+919876543210')).toBe(false);
    });

    test('accepts 10-digit phone with country code prefix stripped', () => {
      expect(validatePhone('91987654321')).toBe(false);
      expect(validatePhone('9876543210')).toBe(true);
    });

    test('accepts phone with spaces', () => {
      expect(validatePhone('987 654 3210')).toBe(true);
    });

    test('rejects short phone', () => {
      expect(validatePhone('987654')).toBe(false);
    });

    test('rejects empty string', () => {
      expect(validatePhone('')).toBe(false);
    });

    test('rejects letters', () => {
      expect(validatePhone('abcdefghij')).toBe(false);
    });
  });

  describe('validatePincode', () => {
    test('accepts valid 6-digit pincode', () => {
      expect(validatePincode('400001')).toBe(true);
    });

    test('accepts pincode with spaces', () => {
      expect(validatePincode('400 001')).toBe(true);
    });

    test('rejects short pincode', () => {
      expect(validatePincode('40000')).toBe(false);
    });

    test('rejects letters', () => {
      expect(validatePincode('abcdef')).toBe(false);
    });

    test('rejects empty string', () => {
      expect(validatePincode('')).toBe(false);
    });
  });
});
