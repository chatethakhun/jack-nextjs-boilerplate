// src/lib/auth-service.test.ts
import { describe, test, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { loginUser } from '@/lib/api/login.service'

vi.mock('axios')

describe('loginUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('successfully logs in user', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          id: '123',
          email: 'test@example.com',
          accessToken: 'token123',
        },
      },
    }

    vi.mocked(axios.post).mockResolvedValueOnce(mockResponse)

    const result = await loginUser({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/adminLogin'),
      {
        username: 'test@example.com',
        password: 'password123',
      }
    )
    expect(result).toEqual(mockResponse.data.data)
  })

  test('returns null on API error', async () => {
    vi.mocked(axios.post).mockRejectedValueOnce(new Error('Network error'))

    const result = await loginUser({
      email: 'test@example.com',
      password: 'wrong',
    })

    expect(result).toBeNull()
  })

  test('returns null on invalid credentials', async () => {
    vi.mocked(axios.post).mockRejectedValueOnce({
      response: {
        status: 401,
        data: { message: 'Invalid credentials' },
      },
    })

    const result = await loginUser({
      email: 'test@example.com',
      password: 'wrong',
    })

    expect(result).toBeNull()
  })

  test('handles API returning success: false', async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        success: false,
        data: null,
      },
    })

    const result = await loginUser({
      email: 'test@example.com',
      password: 'wrong',
    })

    expect(result).toBeNull()
  })
})