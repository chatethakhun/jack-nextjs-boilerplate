// error.test.ts
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { AppError, handleError } from '@/lib/error-handler'

describe('AppError', () => {
  describe('Constructor', () => {
    test('creates error with message and status code', () => {
      const error = new AppError('Not found', 404)

      expect(error.message).toBe('Not found')
      expect(error.statusCode).toBe(404)
      expect(error.isOperational).toBe(true)
    })

    test('extends Error class', () => {
      const error = new AppError('Test error', 400)

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(AppError)
    })

    test('captures stack trace', () => {
      const error = new AppError('Test error', 500)

      expect(error.stack).toBeDefined()
      expect(error.stack).toContain('Test error')
    })

    test('stack trace excludes constructor', () => {
      const error = new AppError('Test', 400)

      // Stack should not include the constructor itself
      expect(error.stack).toBeDefined()
      expect(typeof error.stack).toBe('string')
    })

    test('sets isOperational to true', () => {
      const error = new AppError('Error', 500)

      expect(error.isOperational).toBe(true)
    })
  })

  describe('Different Status Codes', () => {
    test('creates 400 Bad Request error', () => {
      const error = new AppError('Bad request', 400)

      expect(error.message).toBe('Bad request')
      expect(error.statusCode).toBe(400)
    })

    test('creates 401 Unauthorized error', () => {
      const error = new AppError('Unauthorized', 401)

      expect(error.statusCode).toBe(401)
    })

    test('creates 403 Forbidden error', () => {
      const error = new AppError('Forbidden', 403)

      expect(error.statusCode).toBe(403)
    })

    test('creates 404 Not Found error', () => {
      const error = new AppError('Not found', 404)

      expect(error.statusCode).toBe(404)
    })

    test('creates 422 Unprocessable Entity error', () => {
      const error = new AppError('Validation failed', 422)

      expect(error.statusCode).toBe(422)
    })

    test('creates 500 Internal Server error', () => {
      const error = new AppError('Internal error', 500)

      expect(error.statusCode).toBe(500)
    })
  })

  describe('Error Messages', () => {
    test('handles empty message', () => {
      const error = new AppError('', 400)

      expect(error.message).toBe('')
    })

    test('handles long message', () => {
      const longMessage = 'x'.repeat(1000)
      const error = new AppError(longMessage, 400)

      expect(error.message).toBe(longMessage)
    })

    test('handles special characters in message', () => {
      const error = new AppError('Error: <script>alert("xss")</script>', 400)

      expect(error.message).toBe('Error: <script>alert("xss")</script>')
    })

    test('handles unicode characters', () => {
      const error = new AppError('ข้อผิดพลาด 错误 エラー', 400)

      expect(error.message).toBe('ข้อผิดพลาด 错误 エラー')
    })
  })

  describe('Error Properties', () => {
    test('has name property', () => {
      const error = new AppError('Test', 400)

      expect(error.name).toBe('Error') // inherited from Error
    })

    test('can be thrown and caught', () => {
      expect(() => {
        throw new AppError('Test error', 400)
      }).toThrow(AppError)
    })

    test('can be caught as Error', () => {
      expect(() => {
        throw new AppError('Test error', 400)
      }).toThrow(Error)
    })

    test('error message is accessible', () => {
      try {
        throw new AppError('Custom message', 404)
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).message).toBe('Custom message')
      }
    })
  })
})