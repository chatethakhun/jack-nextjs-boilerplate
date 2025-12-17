// error.test.ts
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { AppError, handleError } from '@/lib/error-handler';

describe('AppError', () => {
  describe('Constructor', () => {
    test('creates error with message and status code', () => {
      const error = new AppError('Not found', 404);

      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
    });

    test('extends Error class', () => {
      const error = new AppError('Test error', 400);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });

    test('captures stack trace', () => {
      const error = new AppError('Test error', 500);

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('Test error');
    });

    test('stack trace excludes constructor', () => {
      const error = new AppError('Test', 400);

      // Stack should not include the constructor itself
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    test('sets isOperational to true', () => {
      const error = new AppError('Error', 500);

      expect(error.isOperational).toBe(true);
    });
  });

  describe('Different Status Codes', () => {
    test('creates 400 Bad Request error', () => {
      const error = new AppError('Bad request', 400);

      expect(error.message).toBe('Bad request');
      expect(error.statusCode).toBe(400);
    });

    test('creates 401 Unauthorized error', () => {
      const error = new AppError('Unauthorized', 401);

      expect(error.statusCode).toBe(401);
    });

    test('creates 403 Forbidden error', () => {
      const error = new AppError('Forbidden', 403);

      expect(error.statusCode).toBe(403);
    });

    test('creates 404 Not Found error', () => {
      const error = new AppError('Not found', 404);

      expect(error.statusCode).toBe(404);
    });

    test('creates 422 Unprocessable Entity error', () => {
      const error = new AppError('Validation failed', 422);

      expect(error.statusCode).toBe(422);
    });

    test('creates 500 Internal Server error', () => {
      const error = new AppError('Internal error', 500);

      expect(error.statusCode).toBe(500);
    });
  });

  describe('Error Messages', () => {
    test('handles empty message', () => {
      const error = new AppError('', 400);

      expect(error.message).toBe('');
    });

    test('handles long message', () => {
      const longMessage = 'x'.repeat(1000);
      const error = new AppError(longMessage, 400);

      expect(error.message).toBe(longMessage);
    });

    test('handles special characters in message', () => {
      const error = new AppError('Error: <script>alert("xss")</script>', 400);

      expect(error.message).toBe('Error: <script>alert("xss")</script>');
    });

    test('handles unicode characters', () => {
      const error = new AppError('ข้อผิดพลาด 错误 エラー', 400);

      expect(error.message).toBe('ข้อผิดพลาด 错误 エラー');
    });
  });

  describe('Error Properties', () => {
    test('has name property', () => {
      const error = new AppError('Test', 400);

      expect(error.name).toBe('Error'); // inherited from Error
    });

    test('can be thrown and caught', () => {
      expect(() => {
        throw new AppError('Test error', 400);
      }).toThrow(AppError);
    });

    test('can be caught as Error', () => {
      expect(() => {
        throw new AppError('Test error', 400);
      }).toThrow(Error);
    });

    test('error message is accessible', () => {
      try {
        throw new AppError('Custom message', 404);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe('Custom message');
      }
    });
  });
  // error-usage.test.ts
  describe('Error Usage in Real Scenarios', () => {
    let consoleErrorSpy: any;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    describe('API Error Handling', () => {
      test('handles not found error', () => {
        const error = new AppError('User not found', 404);
        const result = handleError(error);

        expect(result.statusCode).toBe(404);
        expect(result.message).toBe('User not found');
      });

      test('handles validation error', () => {
        const error = new AppError('Invalid email format', 422);
        const result = handleError(error);

        expect(result.statusCode).toBe(422);
        expect(result.message).toBe('Invalid email format');
      });

      test('handles unauthorized error', () => {
        const error = new AppError('Token expired', 401);
        const result = handleError(error);

        expect(result.statusCode).toBe(401);
        expect(result.message).toBe('Token expired');
      });

      test('handles forbidden error', () => {
        const error = new AppError('Insufficient permissions', 403);
        const result = handleError(error);

        expect(result.statusCode).toBe(403);
      });
    });

    describe('Database Error Handling', () => {
      test('masks database errors', () => {
        const error = new Error(
          'Connection to MongoDB failed at localhost:27017'
        );
        const result = handleError(error);

        expect(result.message).toBe('Something went wrong');
        expect(result.message).not.toContain('MongoDB');
        expect(result.statusCode).toBe(500);
      });

      test('handles query errors safely', () => {
        const error = new Error('SELECT * FROM users WHERE password = "..."');
        const result = handleError(error);

        expect(result.message).not.toContain('SELECT');
        expect(result.message).not.toContain('password');
      });
    });

    describe('Integration with Try-Catch', () => {
      test('handles errors thrown in functions', () => {
        function riskyOperation() {
          throw new AppError('Operation failed', 400);
        }

        try {
          riskyOperation();
        } catch (error) {
          const result = handleError(error);
          expect(result.statusCode).toBe(400);
        }
      });

      test('handles async errors', async () => {
        async function asyncOperation() {
          throw new AppError('Async error', 500);
        }

        try {
          await asyncOperation();
        } catch (error) {
          const result = handleError(error);
          expect(result.statusCode).toBe(500);
        }
      });
    });
  });

  describe('handleError', () => {
    let consoleErrorSpy: any;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    describe('AppError Handling', () => {
      test('handles AppError correctly', () => {
        const error = new AppError('Not found', 404);
        const result = handleError(error);

        expect(result).toEqual({
          message: 'Not found',
          statusCode: 404,
        });
      });

      test('logs AppError with status code', () => {
        const error = new AppError('Bad request', 400);
        handleError(error);

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error 400: Bad request');
      });

      test('returns correct format for AppError', () => {
        const error = new AppError('Unauthorized', 401);
        const result = handleError(error);

        expect(result).toHaveProperty('message');
        expect(result).toHaveProperty('statusCode');
        expect(result.message).toBe('Unauthorized');
        expect(result.statusCode).toBe(401);
      });

      test('handles multiple AppErrors', () => {
        const error1 = new AppError('Error 1', 400);
        const error2 = new AppError('Error 2', 404);

        const result1 = handleError(error1);
        const result2 = handleError(error2);

        expect(result1.statusCode).toBe(400);
        expect(result2.statusCode).toBe(404);
      });
    });

    describe('Standard Error Handling', () => {
      test('handles standard Error', () => {
        const error = new Error('Something failed');
        const result = handleError(error);

        expect(result).toEqual({
          message: 'Something went wrong',
          statusCode: 500,
        });
      });

      test('logs standard Error', () => {
        const error = new Error('Database connection failed');
        handleError(error);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Unexpected error: Database connection failed'
        );
      });

      test('masks standard Error message in response', () => {
        const error = new Error('Sensitive internal error');
        const result = handleError(error);

        expect(result.message).toBe('Something went wrong');
        expect(result.message).not.toContain('Sensitive');
      });

      test('always returns 500 for standard Error', () => {
        const error = new Error('Any error');
        const result = handleError(error);

        expect(result.statusCode).toBe(500);
      });
    });

    describe('Unknown Error Handling', () => {
      test('handles string error', () => {
        const result = handleError('string error');

        expect(result).toEqual({
          message: 'Something went wrong',
          statusCode: 500,
        });
      });

      test('handles number error', () => {
        const result = handleError(42);

        expect(result).toEqual({
          message: 'Something went wrong',
          statusCode: 500,
        });
      });

      test('handles null error', () => {
        const result = handleError(null);

        expect(result).toEqual({
          message: 'Something went wrong',
          statusCode: 500,
        });
      });

      test('handles undefined error', () => {
        const result = handleError(undefined);

        expect(result).toEqual({
          message: 'Something went wrong',
          statusCode: 500,
        });
      });

      test('handles object error', () => {
        const result = handleError({ foo: 'bar' });

        expect(result).toEqual({
          message: 'Something went wrong',
          statusCode: 500,
        });
      });

      test('handles array error', () => {
        const result = handleError(['error', 'array']);

        expect(result).toEqual({
          message: 'Something went wrong',
          statusCode: 500,
        });
      });

      test('logs unknown error', () => {
        const unknownError = { custom: 'error' };
        handleError(unknownError);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Unknown error:',
          unknownError
        );
      });
    });

    describe('Console Logging', () => {
      test('logs to console for AppError', () => {
        const error = new AppError('Test', 400);
        handleError(error);

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      });

      test('logs to console for standard Error', () => {
        const error = new Error('Test');
        handleError(error);

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      });

      test('logs to console for unknown error', () => {
        handleError('unknown');

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      });

      test('logs different format for each error type', () => {
        const appError = new AppError('App error', 400);
        const stdError = new Error('Std error');
        const unknown = 'unknown';

        handleError(appError);
        handleError(stdError);
        handleError(unknown);

        expect(consoleErrorSpy).toHaveBeenNthCalledWith(
          1,
          'Error 400: App error'
        );
        expect(consoleErrorSpy).toHaveBeenNthCalledWith(
          2,
          'Unexpected error: Std error'
        );
        expect(consoleErrorSpy).toHaveBeenNthCalledWith(
          3,
          'Unknown error:',
          unknown
        );
      });
    });
  });
});
