// logger.test.ts
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'


describe('Logger', () => {
  // Spy on console methods
  let consoleLogSpy: any
  let consoleWarnSpy: any
  let consoleErrorSpy: any
  let consoleDebugSpy: any
  let originalEnv: string | undefined

  beforeEach(() => {
    // Save original NODE_ENV
    originalEnv = process.env.NODE_ENV

    // Spy on console methods
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv

    // Restore console methods
    consoleLogSpy.mockRestore()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    consoleDebugSpy.mockRestore()

    // Clear module cache to reload logger with new NODE_ENV
    vi.resetModules()
  })

  describe('Development Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development'
      vi.resetModules()
    })

    test('info logs in development', async () => {
      const { default: logger } = await import('@/lib/logger')
      
      logger.info('Test info message')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[INFO] Test info message'
      )
      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    })

    test('info logs with additional arguments', async () => {
      const { default: logger } = await import('@/lib/logger')
      const data = { userId: 123, action: 'login' }

      logger.info('User action', data, 'extra')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[INFO] User action',
        data,
        'extra'
      )
    })

    test('warn logs in development', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.warn('Test warning')

      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] Test warning')
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })

    test('warn logs with additional arguments', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.warn('Deprecated API', { method: 'oldMethod' })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[WARN] Deprecated API',
        { method: 'oldMethod' }
      )
    })

    test('error logs in development', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.error('Test error')

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Test error')
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })

    test('error logs with error object', async () => {
      const { default: logger } = await import('@/lib/logger')
      const error = new Error('Something went wrong')

      logger.error('API Error', error)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[ERROR] API Error',
        error
      )
    })

    test('debug logs in development', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.debug('Debug info')

      expect(consoleDebugSpy).toHaveBeenCalledWith('[DEBUG] Debug info')
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1)
    })

    test('debug logs with state data', async () => {
      const { default: logger } = await import('@/lib/logger')
      const state = { count: 5, active: true }

      logger.debug('Current state', state)

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        '[DEBUG] Current state',
        state
      )
    })

    test('logs multiple messages', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.info('Message 1')
      logger.warn('Message 2')
      logger.debug('Message 3')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Production Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production'
      vi.resetModules()
    })

    test('info does not log in production', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.info('Should not appear')

      expect(consoleLogSpy).not.toHaveBeenCalled()
    })

    test('warn does not log in production', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.warn('Should not appear')

      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    test('error DOES log in production', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.error('Critical error')

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Critical error')
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })

    test('debug does not log in production', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.debug('Should not appear')

      expect(consoleDebugSpy).not.toHaveBeenCalled()
    })

    test('error logs with full context in production', async () => {
      const { default: logger } = await import('@/lib/logger')
      const error = new Error('Database connection failed')
      const context = { host: 'localhost', port: 5432 }

      logger.error('DB Error', error, context)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[ERROR] DB Error',
        error,
        context
      )
    })

    test('multiple non-error logs do not appear', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.info('Info message')
      logger.warn('Warning message')
      logger.debug('Debug message')

      expect(consoleLogSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()
      expect(consoleDebugSpy).not.toHaveBeenCalled()
    })
  })

  describe('Test Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test'
      vi.resetModules()
    })

    test('info does not log in test', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.info('Test message')

      expect(consoleLogSpy).not.toHaveBeenCalled()
    })

    test('error still logs in test', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.error('Test error')

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Test error')
    })
  })

  describe('Edge Cases', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development'
      vi.resetModules()
    })

    test('handles empty message', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.info('')

      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] ')
    })

    test('handles special characters in message', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.info('Message with \n newline and \t tab')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[INFO] Message with \n newline and \t tab'
      )
    })

    test('handles undefined arguments', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.info('Message', undefined)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[INFO] Message',
        undefined
      )
    })

    test('handles null arguments', async () => {
      const { default: logger } = await import('@/lib/logger')

      logger.warn('Message', null)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[WARN] Message',
        null
      )
    })

    test('handles circular references', async () => {
      const { default: logger } = await import('@/lib/logger')
      const circular: any = { a: 1 }
      circular.self = circular

      logger.info('Circular', circular)

      expect(consoleLogSpy).toHaveBeenCalled()
    })

    test('handles very long messages', async () => {
      const { default: logger } = await import('@/lib/logger')
      const longMessage = 'x'.repeat(10000)

      logger.info(longMessage)

      expect(consoleLogSpy).toHaveBeenCalledWith(`[INFO] ${longMessage}`)
    })

    test('handles objects with toString', async () => {
      const { default: logger } = await import('@/lib/logger')
      const obj = {
        toString() {
          return 'Custom toString'
        }
      }

      logger.info('Object', obj)

      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] Object', obj)
    })
  })
})